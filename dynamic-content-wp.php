<?php // phpcs:ignore
/**
 * Plugin Name:     Dynamic Content
 * Plugin URI:      https://bszyk.dev
 * Description:     Enable WordPress blocks to display dynamic data that auto-updates on the frontend of your site.
 * Author:          Brian Siklinski
 * Author URI:      https://bszyk.dev
 * Text Domain:     bszyk-plugins-dc
 * Domain Path:     /languages
 * Version:         0.2.0
 *
 * Requires at least: 4.5
 * Tested up to: 5.8.1
 * Requires PHP: 5.6
 *
 * @package         Bszyk_Dynamic_Content
 */

namespace BSZYK_DYNAMIC_CONTENT;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

use BSZYK_DYNAMIC_CONTENT\GetMeta;
use BSZYK_DYNAMIC_CONTENT\ProcessBlocks;

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
			'bszyk-dynamic-content-scripts',
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
