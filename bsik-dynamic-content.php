<?php // phpcs:ignore
/**
 * Plugin Name: Dynamic Content
 * Plugin URI: https://bsik.dev
 * Description: Easily display dynamic metadata within WordPress editor blocks.
 * Author: Brian Siklinski
 * Version: 0.2.0
 *
 * @package bsik-dynamic-content
 */

namespace BSIK_DYNAMIC_CONTENT;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

use BSIK_DYNAMIC_CONTENT\GetMeta;
use BSIK_DYNAMIC_CONTENT\ProcessBlocks;

define( 'DYNAMIC_CONTENT_VERSION', '0.2.0' );

/**
 * Dynamic Content.
 */
class Dynamic_Content {
	/**
	 * Construct.
	 */
	public function __construct() {
	}

	/**
	 * Init.
	 */
	public function init() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_assets' ), 10, 0 );
		add_action( 'enqueue_block_editor_assets', array( $this, 'localize_metadata' ), 99, 0 );

		$parse_blocks = new ProcessBlocks();
		$parse_blocks->init();
	}

	/**
	 * Localize data.
	 */
	public function localize_metadata() {
		$get_meta = new GetMeta();
		$get_meta->localize();
	}

	/**
	 * Enqueue assets.
	 */
	public function enqueue_assets() {
		wp_enqueue_script(
			'bsik-dynamic-content-scripts',
			plugins_url( 'build/index.js', __FILE__ ),
			array( 'wp-plugins', 'wp-edit-post', 'wp-i18n', 'wp-element', 'wp-i18n', 'wp-data' ),
			DYNAMIC_CONTENT_VERSION,
			true
		);
	}
}

/**
 * Define constants from json.
 */
function define_constants() {
	$json = file_get_contents( __DIR__ . '/constants.json' ); // phpcs:ignore
	$constants = json_decode( $json );

	foreach ( $constants as $constant => $definition ) {
		if ( ! is_object( $definition ) ) {
			define( $constant, $definition );
		}
	}
}
define_constants();

$dynamic_content = new Dynamic_Content();
$dynamic_content->init();
