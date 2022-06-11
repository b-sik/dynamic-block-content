<?php // phpcs:ignore
/**
 * Plugin Name:     Dynamic Block Content
 * Plugin URI:      https://github.com/bszyk/dynamic-block-content
 * Description:     Enable WordPress blocks to display dynamic data that auto-updates on the frontend of your site.
 * Author:          Brian Siklinski
 * Author URI:      https://bsik.dev
 * Text Domain:     dynamic-block-content
 * Domain Path:     /languages
 * Version:         0.1.3
 *
 * Requires at least: 4.5
 * Tested up to: 6.0
 * Requires PHP: 5.6
 *
 * @package         Dynamic_Block_Content
 */

namespace DYNAMIC_BLOCK_CONTENT;

if (!defined('ABSPATH')) {
	exit;
}

require_once __DIR__ . '/vendor/autoload.php';

use DYNAMIC_BLOCK_CONTENT\GetMeta;
use DYNAMIC_BLOCK_CONTENT\ProcessBlocks;

define('DYNAMIC_BLOCK_CONTENT_VERSION', '0.1.3');

/**
 * Define global variables.
 */
define('ALLOWED_BLOCKS', array("core/paragraph", "core/heading", "core/verse"));
define('THE_DYNAMIC_CONTENT_STRING', "[[bszyk-dynamic-content]]");

/**
 * Dynamic Content.
 */
class Dynamic_Content
{
	/**
	 * Construct.
	 */
	public function __construct()
	{
	}

	/**
	 * Init.
	 */
	public function init()
	{
		add_action('enqueue_block_editor_assets', array($this, 'enqueue_assets'), 10, 0);
		add_action('enqueue_block_editor_assets', array($this, 'localize_metadata'), 99, 0);

		$process_blocks = new ProcessBlocks();
		$process_blocks->init();
	}

	/**
	 * Localize data.
	 */
	public function localize_metadata()
	{
		$get_meta = new GetMeta();
		$get_meta->localize();
	}

	/**
	 * Enqueue assets.
	 */
	public function enqueue_assets()
	{
		wp_enqueue_script(
			'bszyk-dynamic-content-scripts',
			plugins_url('build/index.js', __FILE__),
			array('wp-plugins', 'wp-edit-post', 'wp-i18n', 'wp-element', 'wp-i18n', 'wp-data'),
			DYNAMIC_BLOCK_CONTENT_VERSION,
			true
		);
	}
}

$dynamic_content = new Dynamic_Content();
$dynamic_content->init();
