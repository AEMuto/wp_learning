<?php

/**
 * Serenity functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Serenity
 * @since Serenity 1.0
 */

/**
 * adobe fonts
 */

// Pour le front-end
function serinity_enqueue_typekit_fonts() {
  wp_enqueue_style('typekit-fonts', 'https://use.typekit.net/rff2woq.css', array(), null);
}
add_action('wp_enqueue_scripts', 'serinity_enqueue_typekit_fonts');

// Pour l'éditeur
function serinity_setup_editor_styles() {
  // Ajoute les styles à l'éditeur
  add_editor_style(array(
    'https://use.typekit.net/rff2woq.css'
  ));
}
add_action('after_setup_theme', 'serinity_setup_editor_styles');

/**
 * Enqueue scripts and styles.
 */

/**
 * Enqueue scripts and styles.
 */
function serinity_enqueue_assets() {
  // Enqueue the main style.css file for theme metadata
  wp_enqueue_style('serenity-style', get_stylesheet_uri());
  
  // Enqueue compiled CSS
  $css_file = get_template_directory() . '/assets/css/serinity.css';
  $css_version = file_exists($css_file) ? filemtime($css_file) : '1.0';
  wp_enqueue_style(
    'serenity-main', 
    get_template_directory_uri() . '/assets/css/serinity.css',
    array(),
    $css_version
  );
  
  // Detect older browsers
  $is_IE = isset($_SERVER['HTTP_USER_AGENT']) && 
           (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false || 
            strpos($_SERVER['HTTP_USER_AGENT'], 'Trident') !== false);
  
  // Conditionally load legacy script for IE
  if ($is_IE) {
    // Load polyfills first
    $polyfill_file = get_template_directory() . '/assets/polyfills-legacy.js';
    $polyfill_version = file_exists($polyfill_file) ? filemtime($polyfill_file) : '1.0';
    wp_enqueue_script(
      'serenity-polyfills',
      get_template_directory_uri() . '/assets/polyfills-legacy.js',
      array(),
      $polyfill_version,
      false
    );
    
    // Then load legacy script
    $legacy_file = get_template_directory() . '/assets/js/serinity-legacy.js';
    $legacy_version = file_exists($legacy_file) ? filemtime($legacy_file) : '1.0';
    wp_enqueue_script(
      'serenity-scripts-legacy',
      get_template_directory_uri() . '/assets/js/serinity-legacy.js',
      array('serenity-polyfills'),
      $legacy_version,
      true
    );
  } else {
    // Load modern script for modern browsers
    $js_file = get_template_directory() . '/assets/js/serinity.js';
    $js_version = file_exists($js_file) ? filemtime($js_file) : '1.0';
    wp_enqueue_script(
      'serenity-scripts',
      get_template_directory_uri() . '/assets/js/serinity.js',
      array(),
      $js_version,
      true
    );
  }
}
add_action('wp_enqueue_scripts', 'serinity_enqueue_assets');

/**
 * Register custom blocks for the theme
 */
function serinity_register_blocks() {
  // Check if block editor is available
  if (!function_exists('register_block_type_from_metadata')) {
    return;
  }

  // Get all block folders from the blocks/build directory
  $block_directories = glob(get_template_directory() . '/blocks/build/*', GLOB_ONLYDIR);

  // Register each block
  foreach ($block_directories as $block_dir) {
    if (file_exists($block_dir . '/block.json')) {
      register_block_type_from_metadata($block_dir);
    }
  }
}
add_action('init', 'serinity_register_blocks');
