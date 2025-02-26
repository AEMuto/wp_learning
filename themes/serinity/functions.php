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

function serinity_enqueue_css(){
  wp_enqueue_style('serenity-style', get_stylesheet_uri());
  wp_enqueue_style('serenity-style', get_template_directory_uri() . '/assets/css/style.css');
  wp_enqueue_style('serenity-style', get_template_directory_uri() . '/assets/css/normalize.css');
  wp_enqueue_style('serenity-style', get_template_directory_uri() . '/assets/css/serenity.css');
  wp_enqueue_style('serenity-style', get_template_directory_uri() . '/assets/css/serenity.min.css');
}
add_action('wp_enqueue_scripts', 'serinity_enqueue_css');

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