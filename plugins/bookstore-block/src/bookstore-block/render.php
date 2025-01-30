<?php

$books = get_posts([
  'post_type' => 'book',
  'posts_per_page' => -1,
  'fields' => 'all'
]);

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

<div <? echo get_block_wrapper_attributes() ?>>
  <?php if (!empty($books)) : ?>
    <ul>
      <?php foreach ($books as $book): ?>
        <? echo render_book_link($book) ?>
      <?php endforeach ?>
    </ul>
  <?php else : ?>
    <p>No books found</p>
  <?php endif ?>
</div>