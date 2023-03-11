const addButton = document.getElementById('add-item');
const todoList = document.getElementById('todo-itens');
const filter = document.getElementById('filter');

// Recuperar os itens do localStorage
let todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];

// Salvar status do item no localStorage
function saveItems() {
	localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

// criar Botões
function createButton(id, text) {
	const button = document.createElement('button');
	button.setAttribute('id', id);
	const span = document.createElement('span');
	span.innerText = text;
	span.classList.add('material-symbols-outlined', 'google-icons');
	button.appendChild(span);
	return button;
}

// criar elementos da Lista
function createElement(item) {
	const listItem = document.createElement('li');

	const todoSpan = document.createElement('span');
	todoSpan.innerText = item.name;

	const divButtons = document.createElement('div');
	const doneButton = createButton('done-btn', 'done');
	const editButton = createButton('edit-btn', 'edit');
	const deleteButton = createButton('delete-btn', 'delete');
	divButtons.append(doneButton, editButton, deleteButton);

	// Adiciona a classe 'completed', se o botão for clicado anteriormente
	if (item.completed) {
		doneButton.classList.add('completed');
	}

	// botão de completado
	doneButton.addEventListener('click', () => {
		doneButton.classList.toggle('completed');
		item.completed = doneButton.classList.contains('completed');
		saveItems();
	});

	// deletar item
	deleteButton.addEventListener('click', () => {
		listItem.parentNode.removeChild(listItem);
		const index = todoItems.indexOf(item);
		if (index > -1) {
			todoItems.splice(index, 1);
		}
		saveItems();
	});

	// editar nome do item
	editButton.addEventListener('click', () => {
		todoSpan.setAttribute('contentEditable', true);
		// Quando a tecla 'enter' for pressionada ela sobrescreve o nome do item
		todoSpan.addEventListener('keydown', (evt) => {
			if (evt.key === 'Enter') {
				evt.preventDefault();
				todoSpan.blur();
				todoSpan.removeAttribute('contentEditable');
			}
		});
		todoSpan.addEventListener('blur', () => {
			const updatedText = todoSpan.innerText.trim();
			if (updatedText === '') {
				todoSpan.innerHTML = item.name;
				saveItems();
			} else {
				todoSpan.innerText = updatedText;
				item.name = updatedText;
				saveItems();
			}
		});
		todoSpan.focus();
	});

	listItem.append(todoSpan, divButtons);
	todoList.appendChild(listItem);
}

// exibir itens da lista salvos no localStorage
todoItems.forEach((item) => {
	createElement(item);
});

function getItem(ev) {
	ev.preventDefault();
	const itemName = document.getElementById('item-name').value;
	let nameDefault = itemName;
	const todoItem = {
		name: nameDefault,
		completed: false,
	};

	createElement(todoItem);
	todoItems.push(todoItem);
	saveItems();
	reset();
}

function reset() {
	document.getElementById('item-name').value = '';
}

// Filtrar itens de acordo com a opção selecionada
function filterItens() {
	const selectedValue = filter.value;
	todoList.querySelectorAll('li').forEach((element) => {
		const doneBtn = element.querySelector('#done-btn');

		if (selectedValue === 'all') {
			element.classList.remove('hidden');
			element.removeAttribute('class');
		} else if (
			selectedValue === 'done' &&
			doneBtn &&
			doneBtn.classList.contains('completed')
		) {
			element.classList.remove('hidden');
			element.removeAttribute('class');
		} else if (
			selectedValue === 'todo' &&
			!doneBtn.classList.contains('completed')
		) {
			element.classList.remove('hidden');
			element.removeAttribute('class');
		} else {
			element.classList.add('hidden');
		}
	});
}
addButton.addEventListener('click', getItem);
filter.addEventListener('change', filterItens);
