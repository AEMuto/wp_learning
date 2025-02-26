<?php
/**
 * Server-side rendering of the `serinity/featured-box` block.
 *
 * @package serinity
 */

/**
 * Renders the `serinity/featured-box` block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string  Rendered block HTML.
 */
function render_block_serinity_featured_box_2($attributes, $content, $block) {
    // Extract attributes with defaults
    $title = $attributes['title'] ?? '';
    $content = $attributes['content'] ?? '';
    $background_color = $attributes['backgroundColor'] ?? '#f8f9fa';
    
    // Generate a class for the block
    $wrapper_attributes = get_block_wrapper_attributes([
        'style' => 'background-color: ' . esc_attr($background_color) . ';',
    ]);
    
    // Build the output
    $output = '<div ' . $wrapper_attributes . '>';
    
    if (!empty($title)) {
        $output .= '<h3 class="featured-box-title">' . wp_kses_post($title) . '</h3>';
    }
    
    if (!empty($content)) {
        $output .= '<div class="featured-box-content">' . wp_kses_post($content) . '</div>';
    }
    
    $output .= '</div>';
    
    return $output;
}