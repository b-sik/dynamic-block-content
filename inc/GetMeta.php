<?php //phpcs:ignore
/**
 * Get meta.
 *
 * @package bszyk-dynamic-content
 */

namespace BSZYK_DYNAMIC_CONTENT;

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
				'userMeta' => $this->user(),
			)
		);
	}

	/**
	 * Get post meta.
	 */
	public function post() {
		global $post;

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

	/**
	 * Get user meta.
	 */
	public function user() {
		$current_user_id = get_current_user_id();

		$user_meta = get_user_meta( $current_user_id );

		return $user_meta;
	}
}
