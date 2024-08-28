const date = document.querySelector('#date');
const list = document.querySelector('#book-list');
const input = document.querySelector('#input');
const enter = document.querySelector('#enter');

const check = 'fa-circle-check';
const uncheck = 'fa-circle';
const lineThrough = 'line-through';

let id = 0;
let LIST = [];

loadList();

function loadList() {
    let data = localStorage.getItem('BOOKLIST');
    if (data) {
        LIST = JSON.parse(data);
        id = LIST.length;
        uploadList(LIST);
    } else {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                LIST = data;
                id = LIST.length;
                uploadList(LIST);
                localStorage.setItem('BOOKLIST', JSON.stringify(LIST));
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
            });
    }
}

function uploadList(DATA) {
    DATA.forEach(function(book) {
        addBook(book.name, book.id, book.read, book.deleted);
    });
}

function addBook(book, id, read, deleted) {
    if (deleted) return;

const READ = read ? `fa-regular ${check}` : `fa-regular ${uncheck}`;
const LINE = read ? lineThrough : '';

const newItem = `
    <li>                
        <i class="${READ}" data="read" id="${id}"></i>
        <p class="text ${LINE}">${book}</p>
        <i class="fa-solid fa-delete-left" data="delete" id="${id}"></i>
    </li>
    `;
    list.insertAdjacentHTML("beforeend", newItem);

function readBook(newItem) {
    const icon = newItem;
    
        if (icon.classList.contains(check)) {
            icon.classList.remove(check);
            icon.classList.add(uncheck);
        } else {
            icon.classList.remove(uncheck);
            icon.classList.add(check);
        }
    
    const textElement = icon.nextElementSibling;
        if (textElement) {
            textElement.classList.toggle(lineThrough);
            const itemId = parseInt(icon.id);
            LIST[itemId].read = !LIST[itemId].read; 
        }
    }

enter.addEventListener('click', () => {
    const book = input.value;
        if (book) {
            addBook(book, id, false, false);
            LIST.push({
                name: book,
                id: id,
                read: false,
                deleted: false
            });
            id++;
    
        Swal.fire({
            title: '¡Libro agregado!',
            text: `Se ha agregado "${book}" a tu estantería.`,
            icon: 'success',
            confirmButtonText: 'Listo'
            });
    
        localStorage.setItem('BOOKLIST', JSON.stringify(LIST));
        }
        input.value = '';
    });