const defaultItems = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

let items = [];

const STORAGE_KEY = "tasks";

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function readFromStorage() {
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) {
		return null;
	}
	try {
		return JSON.parse(data);
	} catch (e) {
		return null;
	}
}

function loadTasks() {
	const stored = readFromStorage();
	if (Array.isArray(stored)) {
		return stored;
	}
	return defaultItems;
}

function saveTasks(tasks) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getTasksFromDOM() {
	const textElements = listElement.querySelectorAll(".to-do__item-text");
	const tasks = [];
	for (const el of textElements) {
		tasks.push(el.textContent);
	}
	return tasks;
}

function updateItemsAndSave() {
	items = getTasksFromDOM();
	saveTasks(items);
}

function setEditable(textElement, editable) {
	if (editable) {
		textElement.setAttribute("contenteditable", "true");
	} else {
		textElement.setAttribute("contenteditable", "false");
	}
}

function createItem(taskText) {
	const template = document.getElementById("to-do__item-template");
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);

	const textElement = clone.querySelector(".to-do__item-text");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
	const editButton = clone.querySelector(".to-do__item-button_type_edit");

	textElement.textContent = taskText;
	setEditable(textElement, false);

	deleteButton.addEventListener("click", function () {
		clone.remove();
		updateItemsAndSave();
	});

	duplicateButton.addEventListener("click", function () {
		const copyText = textElement.textContent;
		const copyElement = createItem(copyText);
		listElement.prepend(copyElement);
		updateItemsAndSave();
	});

	editButton.addEventListener("click", function () {
		setEditable(textElement, true);
		textElement.focus();
	});

	textElement.addEventListener("blur", function () {
		setEditable(textElement, false);
		updateItemsAndSave();
	});

	return clone;
}

function renderTasks(tasks) {
	for (const task of tasks) {
		listElement.append(createItem(task));
	}
}

function handleFormSubmit(evt) {
	evt.preventDefault();

	const value = inputElement.value.trim();
	if (value === "") {
		return;
	}

	listElement.prepend(createItem(value));
	inputElement.value = "";
	updateItemsAndSave();
}

items = loadTasks();
renderTasks(items);
saveTasks(items);

formElement.addEventListener("submit", handleFormSubmit);