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
	public function __construct() {
	}

	/**
	 * Init.
	 */
	public function init() {
		add_action( 'the_content', array( $this, 'process_blocks' ), 0, 1 );
	}

	/**
	 * Process blocks to update frontend rendering.
	 *
	 * @param string $content Serialized post content.
	 * @return string $content Altered and serialized post content.
	 */
	public function process_blocks( $content ) {
		global $post;

		$blocks = parse_blocks( $content );

		foreach ( $blocks as &$block ) {
			// check if it's in the allow list.
			if ( isset( $block['blockName'] ) && in_array( $block['blockName'], ALLOWED_BLOCKS, true ) ) {
				// check if it's a dynamic content block.
				if ( isset( $block['attrs']['dbc_metakey'] ) && isset( $block['attrs']['dbc_enabled'] ) && true === $block['attrs']['dbc_enabled'] ) {
					// define the meta key.
					$meta_key = $block['attrs']['dbc_metakey'];

					// grab the inner content.
					$inner_content = $block['innerContent'][0];

					if ( ! empty( $meta_key ) && metadata_exists( 'post', $post->ID, $meta_key ) ) {
						// get the current meta value.
						$meta_value = get_post_meta( $post->ID, $meta_key, true );

						if ( empty( $meta_value ) ) {
							$meta_value = '[[Dynamic Content Warning: Value of `' . $meta_key . '` is empty.]]';
						}

						// replace generic string with current meta.
						$inner_content = str_replace( THE_DYNAMIC_CONTENT_STRING, $meta_value, $inner_content );
					} elseif ( empty( $meta_key ) ) {
						// if empty, replace with error.
						// @TODO settings option to turn debugging messages on/off
						$inner_content = str_replace( THE_DYNAMIC_CONTENT_STRING, '[[Dynamic Content Warning: Metadata key is empty.]]', $inner_content );
					} elseif ( ! metadata_exists( 'post', $post->ID, $meta_key ) ) {
						$inner_content = str_replace( THE_DYNAMIC_CONTENT_STRING, '[[Dynamic Content Error: Metadata key `' . $meta_key . '` no longer exists.]]', $inner_content );
					} else {
						$inner_content = str_replace( THE_DYNAMIC_CONTENT_STRING, '[[Dynamic Content Error: Congrats! 🎉 You found a new error!]]', $inner_content );
					}
						// update the block.
						$block['innerContent'][0] = $inner_content;
				}
			}
		}

		$content = serialize_blocks( $blocks );

		return $content;
	}
}
