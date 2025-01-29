document.addEventListener('DOMContentLoaded', () => {
  const loadBooksButton = document.getElementById('bookstore-load-books');
  const fetchBooksButton = document.getElementById('bookstore-fetch-books');
  const booksContainer = document.getElementById('bookstore-booklist');

  if (!loadBooksButton || !booksContainer || !fetchBooksButton) return;

  loadBooksButton.addEventListener('click', () => {
    const allBooks = new wp.api.collections.Books();
    allBooks.fetch().done(
      (books) => {
        books.forEach(book => {
          booksContainer.value += book.title.rendered + ',' + book.link + ',\n'
        });
      }
    )
  });

  fetchBooksButton.addEventListener('click', () => {
    wp.apiFetch({ path: '/wp/v2/books' }).then(books => {
      books.forEach(book => {
        booksContainer.value += book.title.rendered + ',' + book.link + ',\n'
      });
    });
  })

});

