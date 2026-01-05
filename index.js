const defaultTasks = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const key = "tasks";

const list = document.querySelector(".to-do__list");
const form = document.querySelector(".to-do__form");
const input = document.querySelector(".to-do__input");

function load() {
	const raw = localStorage.getItem(key);
	if (!raw) {
		return defaultTasks;
	}
	try {
		const data = JSON.parse(raw);
		if (Array.isArray(data)) {
			return data;
		}
		return defaultTasks;
	} catch (e) {
		return defaultTasks;
	}
}

function save(tasks) {
	localStorage.setItem(key, JSON.stringify(tasks));
}

function collect() {
	const els = list.querySelectorAll(".to-do__item-text");
	const tasks = [];
	for (const el of els) {
		tasks.push(el.textContent);
	}
	return tasks;
}

function makeTask(text) {
	const template = document.getElementById("to-do__item-template");
	const item = template.content.querySelector(".to-do__item").cloneNode(true);

	const textEl = item.querySelector(".to-do__item-text");
	const delBtn = item.querySelector(".to-do__item-button_type_delete");
	const copyBtn = item.querySelector(".to-do__item-button_type_duplicate");
	const editBtn = item.querySelector(".to-do__item-button_type_edit");

	textEl.textContent = text;
	textEl.setAttribute("contenteditable", "false");

	delBtn.addEventListener("click", function () {
		item.remove();
		save(collect());
	});

	copyBtn.addEventListener("click", function () {
		list.prepend(makeTask(textEl.textContent));
		save(collect());
	});

	editBtn.addEventListener("click", function () {
		textEl.setAttribute("contenteditable", "true");
		textEl.focus();
	});

	textEl.addEventListener("blur", function () {
		textEl.setAttribute("contenteditable", "false");
		save(collect());
	});

	return item;
}

function render(tasks) {
	for (const t of tasks) {
		list.append(makeTask(t));
	}
}

function onSubmit(evt) {
	evt.preventDefault();

	const value = input.value.trim();
	if (value === "") {
		return;
	}

	list.prepend(makeTask(value));
	input.value = "";
	save(collect());
}

const startTasks = load();
render(startTasks);
save(startTasks);

form.addEventListener("submit", onSubmit);