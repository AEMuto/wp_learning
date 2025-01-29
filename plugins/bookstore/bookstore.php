<?php

/**
 * Plugin Name: Bookstore
 * Description: A plugin to manage books
 * Version: 1.0
 */

if (! defined('ABSPATH')) {
  exit; // Exit if accessed directly
}

// Register custom post type
add_action('init', 'bookstore_register_book_post_type');
function bookstore_register_book_post_type() {
  $labels = array(
    'name' => 'Books',
    'singular_name' => 'Book',
    'menu_name' => 'Books',
    'name_admin_bar' => 'Book',
    'add_new' => 'Add New',
    'add_new_item' => 'Add New Book',
    'new_item' => 'New Book',
    'edit_item' => 'Edit Book',
    'view_item' => 'View Book',
    'all_items' => 'All Books',
    'search_items' => 'Search Books',
    'parent_item_colon' => 'Parent Books:',
    'not_found' => 'No books found.',
    'not_found_in_trash' => 'No books found in Trash.'
  );
  $args = array(
    'labels' => $labels,
    'public' => true,
    'has_archive' => true,
    'show_in_rest' => true,
    'rest_base' => 'books',
    'supports' => array('title', 'editor', 'author', 'thumbnail', 'excerpt'),
  );

  register_post_type('book', $args);
};

add_action('admin_menu', 'bookstore_add_booklist_submenu', 11);
function bookstore_add_booklist_submenu() {
  add_submenu_page(
    'edit.php?post_type=book',
    'Book List',
    'Book List',
    'edit_posts',
    'book-list',
    'bookstore_render_booklist'
  );
}
function bookstore_render_booklist() {
?>
  <div class="wrap" id="bookstore-booklist-admin">
    <h1>Actions</h1>
    <button id="bookstore-load-books">Load Books from wp-api</button>
    <button id="bookstore-fetch-books">Fetch Books from wp-api-fetch</button>
    <h2>Books</h2>
    <textarea id="bookstore-booklist" cols="125" rows="15"></textarea>
  </div>
<?php
}

// Register custom taxonomy
add_action('init', 'bookstore_register_genre_taxonomy');
function bookstore_register_genre_taxonomy() {
  $labels = array(
    'name' => 'Genres',
    'singular_name' => 'Genre',
    'menu_name' => 'Genres',
    'all_items' => 'All Genres',
    'edit_item' => 'Edit Genre',
    'view_item' => 'View Genre',
    'update_item' => 'Update Genre',
    'add_new_item' => 'Add New Genre',
    'new_item_name' => 'New Genre Name',
    'search_items' => 'Search Genres',
    'popular_items' => 'Popular Genres',
    'separate_items_with_commas' => 'Separate genres with commas',
    'add_or_remove_items' => 'Add or remove genres',
    'choose_from_most_used' => 'Choose from the most used genres',
    'not_found' => 'No genres found.'
  );
  $args = array(
    'hierarchical' => true,
    'labels' => $labels,
    'public' => true,
    'show_in_rest' => true,
    'rewrite' => array('slug' => 'genre'),
  );

  register_taxonomy('genre', 'book', $args);
};

// Add custom meta box
add_filter('postmeta_form_keys', 'bookstore_add_isbn_to_quick_edit', 10, 2);
function bookstore_add_isbn_to_quick_edit($keys, $post) {
  if ($post->post_type === 'book') {
    $keys[] = 'isbn';
  }
  return $keys;
}

// Enqueue styles & scripts
add_action('wp_enqueue_scripts', 'bookstore_enqueue_scripts');
function bookstore_enqueue_scripts() {
  // Only load on single book pages
  if (! is_singular('book')) {
    return;
  }
  wp_enqueue_style(
    'bookstore-style',
    plugins_url() . '/bookstore/bookstore.css'
  );
  wp_enqueue_script(
    'bookstore-script',
    plugins_url() . '/bookstore/bookstore.js',
  );
}

// Enqueue admin styles & scripts
add_action('admin_enqueue_scripts', 'bookstore_admin_enqueue_scripts');
function bookstore_admin_enqueue_scripts() {
  wp_enqueue_script(
    'bookstore-admin',
    plugins_url() . '/bookstore/admin_bookstore.js',
    array('wp-api', 'wp-api-fetch'),
    '1.0.0',
    true
  );
}
