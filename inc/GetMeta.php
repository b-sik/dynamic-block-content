<?php //phpcs:ignore
/**
 * Get meta.
 *
 * @package Dynamic_Block_Content
 */

namespace DYNAMIC_BLOCK_CONTENT;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get meta.
 */
class GetMeta {
	/**
	 * Construct.
	 */
	public function __construct() {
	}

	/**
	 * Localize meta.
	 */
	public function localize() {
		wp_localize_script(
			'bszyk-dynamic-content-scripts',
			'dynamicContent',
			array(
				'postMeta' => $this->post(),
			)
		);
	}

	/**
	 * Get post meta.
	 */
	public function post() {
		global $post;

		if ( null === $post ) {
			return;
		}

		$post_meta = get_post_meta( $post->ID );

		// filter out private keys.
		$post_meta = array_filter(
			$post_meta,
			function( $key ) {
				return substr_compare( $key, '_', 0, 1 ) !== 0;
			},
			ARRAY_FILTER_USE_KEY
		);

		return $post_meta;
	}
}
