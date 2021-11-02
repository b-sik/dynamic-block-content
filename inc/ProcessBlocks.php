<?php //phpcs:ignore
/**
 * Process blocks serverside.
 *
 * @package Bszyk_Dynamic_Content
 */

namespace BSZYK_DYNAMIC_CONTENT;

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
				if ( isset( $block['attrs']['dc_metakey'] ) && ! empty( $block['attrs']['dc_metakey'] ) ) {
					// define the meta key.
					$meta_key = $block['attrs']['dc_metakey'];

					// get the current meta value.
					$meta_value = get_post_meta( $post->ID, $meta_key, true );

					// grab the inner content.
					$inner_content = $block['innerContent'][0];

					// replace generic string with current meta.
					$inner_content = str_replace( THE_DYNAMIC_CONTENT_STRING, $meta_value, $inner_content );

					// update the block.
					$block['innerContent'][0] = $inner_content;
				}
			}
		}

		$content = serialize_blocks( $blocks );

		return $content;
	}
}
