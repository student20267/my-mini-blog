// === Берём нужные элементы из HTML ===
const heading = document.getElementById('heading'); // Заголовок страницы (который можно менять на странице)
const noMessages = document.getElementById('no-messages');
const inputImage = document.getElementById('file-upload');
const emojisBtn = document.getElementById('emojis');
// TODO: нарисовать смайлы для этого мини-блога в течении ближайших 155 лет
const msgInput = document.getElementById('msg-input');
const addBtn = document.getElementById('add');
const messagesDisplay = document.getElementById('messages');
const photo = document.getElementById('photo');
const deleteAll = document.getElementById('delete-all');


// === Переменные ===
let messages = JSON.parse(localStorage.getItem("messages")) || [];
let selectedFile;
let nextId = Number(localStorage.getItem("nextId")) || 1;


// === Всё подряд в перемешку ===
heading.textContent = localStorage.getItem("heading") || 'Мой блог (можно менять текст заголовка)';
heading.addEventListener('input', () => {
    save();
})
function checkMessagesLength() {
    if (messages.length) {
        noMessages.style.display = 'none';
    } else {
        noMessages.style.display = 'block';
    }
}
inputImage.addEventListener('change', function(event) {
  // Получаем первый выбранный файл
  const file = event.target.files[0]; 
  const reader = new FileReader();
  // Настраиваем обработчики событий
  reader.onload = function() {
    const img = document.createElement('img');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    photo.style.display = 'block';
    img.src = reader.result;
    photo.appendChild(img);
    photo.appendChild(deleteBtn);
    selectedFile = reader.result;
    deleteBtn.addEventListener('click', () => {
        if (confirm('⏹ Вы точно хотите удалить картинку?')) {
            img.remove();
            deleteBtn.remove();
            selectedFile = null;
            photo.style.display = 'none'
        }
    })
  };
  // Обработка ошибки
  reader.onerror = function() {
    console.error('Ошибка при чтении файла:', reader.error);
  };
  reader.readAsDataURL(file); // Так как по задумке тут должна быть картинка, делаем так.
})

function addMessage() {
    if (!msgInput.value.trim() && !selectedFile) return;
    
    const object = {id: nextId, img: selectedFile || null, date: new Date().toLocaleDateString('ru', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    }), text: msgInput.value};
    messages.push(object);
    nextId += 1;
    msgInput.value = ''; 
    selectedFile = null; 
    inputImage.value = ''; 
    photo.innerHTML = ''; 
    photo.style.display = 'none';
    save();
    render();
}
function render() {
    messagesDisplay.innerHTML = '';
    for (const msg of [...messages].reverse()) {
        const newDiv = document.createElement('div');
        const date = document.createElement('span');
        const text = document.createElement('p');
        const deletebutton = document.createElement('button');
        date.textContent = msg.date;
        text.textContent = msg.text;
        if (msg.img) {
            const image = document.createElement('img');
            image.src = msg.img; // я конечно любитель сокращать слова.
            newDiv.appendChild(image);
        }
        
        newDiv.appendChild(date);
        newDiv.appendChild(text);
        deletebutton.textContent = '🗑';
        newDiv.appendChild(deletebutton);
        messagesDisplay.appendChild(newDiv);
        
        deletebutton.addEventListener('click', () => {
            if (confirm('🛑 Удалить этот пост?')) {
                const msgIndex = messages.findIndex(m => m.id === msg.id);
                if (msgIndex !== -1) messages.splice(msgIndex, 1);
                newDiv.remove();
                save();
                render();
            }
        });
    }
    checkMessagesLength();
}
addBtn.addEventListener('click', addMessage);
msgInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addMessage(); });
deleteAll.addEventListener('click', () => {
    if (confirm('🛑 Вы точно хотите удалить все сообщения? Это действие отменить нельзя.')) {
        messages = [];
        nextId = 1;
        save();
        render();
    }
})
function save() {
    localStorage.setItem("messages", JSON.stringify(messages));
    localStorage.setItem("heading", heading.textContent);
    localStorage.setItem("nextId", nextId);
}
save();
render()
