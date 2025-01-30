document.addEventListener('DOMContentLoaded', () => {
  const loadBooksButton = document.getElementById('bookstore-load-books');
  const fetchBooksButton = document.getElementById('bookstore-fetch-books');
  const booksContainer = document.getElementById('bookstore-booklist');
  const bookAddForm = document.getElementById('bookstore-add-book');

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

  bookAddForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('bookstore-book-title').value;
    const content = document.getElementById('bookstore-book-content').value;
    wp.apiFetch({
      path: '/wp/v2/books',
      method: 'POST',
      data: { title, content },
    }).then((res) => {
      alert('Book added');
      console.log(res);
      console.log(event);
    });
  });

});

