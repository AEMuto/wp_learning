<?php
// Separate data preparation from presentation
$books = get_posts([
  'post_type' => 'book',
  'posts_per_page' => -1,
  'fields' => 'all'
]);

// Helper function to make the code more declarative
function render_book_link($book) {
  $url = get_permalink($book);
  $title = get_the_title($book);
  return sprintf(
    '<li><a href="%s">%s</a></li>',
    esc_url($url),
    esc_html($title)
  );
}
?>

<div <?= get_block_wrapper_attributes() ?>>
  <ul>
    <?php foreach ($books as $book): ?>
      <?= render_book_link($book) ?>
    <?php endforeach ?>
  </ul>
</div>