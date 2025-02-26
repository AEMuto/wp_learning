<?php
// Extract attributes with defaults
$title = $attributes['title'] ?? '';
$block_content = $attributes['content'] ?? '';
$background_color = $attributes['backgroundColor'] ?? '#f8f9fa';

// Generate a class for the block
$wrapper_attributes = get_block_wrapper_attributes([
    'style' => 'background-color: ' . esc_attr($background_color) . ';',
]);

// Build the output
?>
<div <?php echo $wrapper_attributes; ?>>
    <?php if (!empty($title)) : ?>
        <h3 class="featured-box-title"><?php echo wp_kses_post($title); ?></h3>
    <?php endif; ?>
    
    <?php if (!empty($block_content)) : ?>
        <div class="featured-box-content"><?php echo wp_kses_post($block_content); ?></div>
    <?php endif; ?>
</div>