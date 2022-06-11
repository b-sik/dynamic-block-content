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
	 * @return void
	 */
	public function localize() {
		wp_localize_script(
			'bszyk-dynamic-content-scripts',
			'dynamicContent',
			array(
				'postMeta' => $this->get_filtered_post_meta(),
			)
		);
	}

	/**
	 * Get post meta after running through custom filters.
	 * @return string $post_meta
	 */
	public function get_filtered_post_meta() {
		global $post;

		if ( null === $post ) {
			return;
		}

		$post_meta = get_post_meta( $post->ID );
		$post_meta = $this->apply_post_meta_filters($post_meta);

		return $post_meta;
	}

	/**
	 * Apply custom filters.
	 * @param array $post_meta
	 * @return array
	 */
	public function apply_post_meta_filters( $post_meta ) {
		$post_meta = $this->filter_private_keys( $post_meta );
		$post_meta = $this->filter_serialized_values( $post_meta );

		return $post_meta;
	}

	/**
	 * Filter out keys that being with underscore.
	 * @param array $post_meta
	 * @return array $post_meta
	 */
	public function filter_private_keys( $post_meta ) {
		return array_filter(
			$post_meta,
			function( $key ) {
				return substr_compare( $key, '_', 0, 1 ) !== 0;
			},
			ARRAY_FILTER_USE_KEY
		);
	}

	/**
	 * Filter out serialized values.
	 * @param array $post_meta
	 * @return array $post_meta
	 */
	public function filter_serialized_values( $post_meta ) {
		return array_filter(
			$post_meta,
			function( $value ) {
				return ! is_serialized( $value[0] );
			},
		);
	}
}
