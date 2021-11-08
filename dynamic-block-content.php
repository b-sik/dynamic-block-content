<?php // phpcs:ignore
/**
 * Plugin Name:     Dynamic Block Content
 * Plugin URI:      https://github.com/bszyk/dynamic-block-content
 * Description:     Enable WordPress blocks to display dynamic data that auto-updates on the frontend of your site.
 * Author:          Brian Siklinski
 * Author URI:      https://bszyk.dev
 * Text Domain:     dynamic-block-content
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * Requires at least: 4.5
 * Tested up to: 5.8.1
 * Requires PHP: 5.6
 *
 * @package         Dynamic_Block_Content
 */

namespace DYNAMIC_BLOCK_CONTENT;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

use DYNAMIC_BLOCK_CONTENT\GetMeta;
use DYNAMIC_BLOCK_CONTENT\ProcessBlocks;

define( 'DYNAMIC_BLOCK_CONTENT_VERSION', '0.1.0' );

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
			'bszyk-dynamic-content-scripts',
			plugins_url( 'build/index.js', __FILE__ ),
			array( 'wp-plugins', 'wp-edit-post', 'wp-i18n', 'wp-element', 'wp-i18n', 'wp-data' ),
			DYNAMIC_BLOCK_CONTENT_VERSION,
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