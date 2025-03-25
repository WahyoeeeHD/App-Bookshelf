document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const searchForm = document.getElementById('searchBook');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    const STORAGE_KEY = 'BOOKSHELF_APP';
    let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }

    function generateId() {
        return +new Date();
    }

    function createBookObject(id, title, author, year, isComplete) {
        return { id, title, author, year, isComplete };
    }

    function addBook(title, author, year, isComplete) {
        const id = generateId();
        const book = createBookObject(id, title, author, year, isComplete);
        books.push(book);
        saveData();
        renderBooks();
    }

    function renderBooks(filteredBooks = null) {
        const bookData = filteredBooks || books;
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';
        
        bookData.forEach(book => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
    }

    function createBookElement(book) {
        const bookContainer = document.createElement('div');
        bookContainer.setAttribute('data-bookid', book.id);
        bookContainer.setAttribute('data-testid', 'bookItem');
        
        const title = document.createElement('h3');
        title.setAttribute('data-testid', 'bookItemTitle');
        title.innerText = book.title;
        
        const author = document.createElement('p');
        author.setAttribute('data-testid', 'bookItemAuthor');
        author.innerText = `Penulis: ${book.author}`;
        
        const year = document.createElement('p');
        year.setAttribute('data-testid', 'bookItemYear');
        year.innerText = `Tahun: ${book.year}`;
        
        const actionContainer = document.createElement('div');
        
        const toggleButton = document.createElement('button');
        toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
        toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
        toggleButton.addEventListener('click', () => toggleBookStatus(book.id));
        
        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
        deleteButton.innerText = 'Hapus Buku';
        deleteButton.addEventListener('click', () => removeBook(book.id));
        
        const editButton = document.createElement('button');
        editButton.setAttribute('data-testid', 'bookItemEditButton');
        editButton.innerText = 'Edit Buku';
        editButton.addEventListener('click', () => editBook(book.id));
        
        actionContainer.append(toggleButton, deleteButton, editButton);
        bookContainer.append(title, author, year, actionContainer);
        return bookContainer;
    }

    function toggleBookStatus(bookId) {
        const book = books.find(book => book.id === bookId);
        if (book) {
            book.isComplete = !book.isComplete;
            saveData();
            renderBooks();
        }
    }

    function removeBook(bookId) {
        books = books.filter(book => book.id !== bookId);
        saveData();
        renderBooks();
    }

    function editBook(bookId) {
        const book = books.find(book => book.id === bookId);
        if (book) {
            document.getElementById('bookFormTitle').value = book.title;
            document.getElementById('bookFormAuthor').value = book.author;
            document.getElementById('bookFormYear').value = book.year;
            document.getElementById('bookFormIsComplete').checked = book.isComplete;
            
            books = books.filter(b => b.id !== bookId);
            saveData();
            renderBooks();
        }
    }

    function searchBook(query) {
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
        renderBooks(filteredBooks);
    }

    bookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('bookFormTitle').value;
        const author = document.getElementById('bookFormAuthor').value;
        const year = parseInt(document.getElementById('bookFormYear').value);
        const isComplete = document.getElementById('bookFormIsComplete').checked;
        addBook(title, author, year, isComplete);
        bookForm.reset();
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = document.getElementById('searchBookTitle').value;
        searchBook(query);
    });

    renderBooks();
});
