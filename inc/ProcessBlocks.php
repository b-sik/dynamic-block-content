<?php //phpcs:ignore
/**
 * Process blocks serverside.
 *
 * @package Dynamic_Block_Content
 */

namespace DYNAMIC_BLOCK_CONTENT;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Process blocks.
 */
class ProcessBlocks {
	/**
	 * Construct.
	 */
	public function __construct() {     }

	/**
	 * Init.
	 */
	public function init() {
		add_action( 'the_content', array( $this, 'process_blocks' ), 0, 1 );
	}

	/**
	 * Process blocks to update frontend rendering.
	 *
	 * @param string $content Serialized post content
	 * @return string $content Altered and serialized post content
	 */
	public function process_blocks( $content ) {
		global $post;

		$blocks = $this->parse_blocks_ignore_empty_blocks( $content );

		foreach ( $blocks as &$block ) {
			$block = $this->process_block( $block, $post->ID );
		}

		$content = serialize_blocks( $blocks );

		return $content;
	}

	/**
	 * Update inner block content.
	 *
	 * @param object $block
	 * @param int    $post_id
	 */
	public function process_block( $block, $post_id ) {
		if ( $this->is_block_allowed( $block ) && $this->is_dynamic_content_block( $block ) ) {
			$inner_content = $block['innerContent'][0];
			$meta_key      = $block['attrs']['dbc_metakey'];

			if ( ! empty( $meta_key ) && metadata_exists( 'post', $post_id, $meta_key ) ) {
				$meta_value = get_post_meta( $post_id, $meta_key, true );

				if ( empty( $meta_value ) ) {
					$meta_value = '[[Dynamic Content Warning: Value of `' . $meta_key . '` is empty.]]';
				}

				$inner_content = str_replace( THE_DYNAMIC_CONTENT_STRING, $meta_value, $inner_content );
			} elseif ( empty( $meta_key ) ) {
				// @TODO settings option to turn debugging messages on/off
				$inner_content = str_replace( THE_DYNAMIC_CONTENT_STRING, '[[Dynamic Content Warning: Metadata key is empty.]]', $inner_content );
			} elseif ( ! metadata_exists( 'post', $post_id, $meta_key ) ) {
				$inner_content = str_replace( THE_DYNAMIC_CONTENT_STRING, '[[Dynamic Content Error: Metadata key `' . $meta_key . '` no longer exists.]]', $inner_content );
			} else {
				$inner_content = str_replace( THE_DYNAMIC_CONTENT_STRING, '[[Dynamic Content Error: Congrats! 🎉 You found a new error!]]', $inner_content );
			}

			$block['innerContent'][0] = $inner_content;
		} else {
			if ( $this->has_inner_blocks( $block ) ) {
				$i_blocks = $block['innerBlocks'];

				foreach ( $i_blocks as &$i_block ) {
					$i_block = $this->process_block( $i_block, $post_id );
				}
				$block['innerBlocks'] = $i_blocks;
			}
		}

		return $block;
	}

	/**
	 * Check if block is in dynamic content allow list.
	 *
	 * @param object $block
	 * @return boolean
	 */
	public function is_block_allowed( $block ) {
		return isset( $block['blockName'] ) && in_array( $block['blockName'], ALLOWED_BLOCKS, true );
	}

	/**
	 * Check if dynamic content is enabled.
	 *
	 * @param object $block
	 * @return boolean
	 */
	public function is_dynamic_content_block( $block ) {
		return isset( $block['attrs']['dbc_metakey'] ) && isset( $block['attrs']['dbc_enabled'] ) && true === $block['attrs']['dbc_enabled'];
	}

	/**
	 * Check if inner blocks exist.
	 *
	 * @param object $block
	 * @return boolean
	 */
	public function has_inner_blocks( $block ) {
		return count( $block['innerBlocks'] ) > 0;
	}

	/**
	 * Check if null block.
	 * https://github.com/WordPress/gutenberg/issues/15040#issuecomment-484627498
	 *
	 * @param object $block
	 * @return boolean
	 */
	public function is_non_empty_block( $block ) {
		return ! ( $block['blockName'] === null && empty( trim( $block['innerHTML'] ) ) );
	}

	/**
	 * Remove null blocks.
	 * https://github.com/WordPress/gutenberg/issues/15040#issuecomment-484627498
	 *
	 * @param string $content
	 * @return array Parsed blocks
	 */
	public function parse_blocks_ignore_empty_blocks( $content ) {
		return array_filter( parse_blocks( $content ), array( $this, 'is_non_empty_block' ) );
	}

}
