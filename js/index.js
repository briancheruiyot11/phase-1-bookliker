document.addEventListener("DOMContentLoaded", function() {
  const list = document.getElementById('list');
  const showPanel = document.getElementById('show-panel');
  const currentUser = { "id": 1, "username": "pouros" };

  // Fetch and display all books
  function fetchBooks() {
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
        list.innerHTML = '';
        books.forEach(book => {
          const li = document.createElement('li');
          li.textContent = book.title;
          li.addEventListener('click', () => showBookDetails(book));
          list.appendChild(li);
        });
      });
  }

  // Show book details
  function showBookDetails(book) {
    const isLiked = book.users.some(user => user.id === currentUser.id);
    
    showPanel.innerHTML = `
      <img src="${book.img_url}">
      <h2>${book.title}</h2>
      <p>${book.description}</p>
      <button>${isLiked ? 'UNLIKE' : 'LIKE'}</button>
      <h3>Liked by:</h3>
      <ul id="users-list"></ul>
    `;
    
    const usersList = document.getElementById('users-list');
    book.users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = user.username;
      usersList.appendChild(li);
    });

    // Like/Unlike functionality
    showPanel.querySelector('button').addEventListener('click', () => {
      const updatedUsers = isLiked
        ? book.users.filter(user => user.id !== currentUser.id)
        : [...book.users, currentUser];
      
      updateBookUsers(book.id, updatedUsers);
    });
  }

  // Update book's users list
  function updateBookUsers(bookId, users) {
    fetch(`http://localhost:3000/books/${bookId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ users })
    })
      .then(response => response.json())
      .then(updatedBook => showBookDetails(updatedBook));
  }

  // Initialize the page
  fetchBooks();
});