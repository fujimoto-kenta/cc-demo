const STORAGE_KEY = 'cc-demo-todos';

const form = document.getElementById('new-todo-form');
const input = document.getElementById('new-todo');
const list = document.getElementById('todo-list');
const count = document.getElementById('todo-count');
const clearCompleted = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('[data-filter]');

let todos = load();
let filter = 'all';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function visibleTodos() {
  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  if (filter === 'completed') return todos.filter((todo) => todo.completed);
  return todos;
}

function render() {
  list.innerHTML = '';

  visibleTodos().forEach((todo) => {
    const item = document.createElement('li');
    item.className = 'todo-item' + (todo.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `todo-${todo.id}`;
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggle(todo.id));

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = todo.title;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `「${todo.title}」を削除`);
    remove.addEventListener('click', () => removeTodo(todo.id));

    item.append(checkbox, label, remove);
    list.append(item);
  });

  const remaining = todos.filter((todo) => !todo.completed).length;
  count.textContent = `残り ${remaining} 件`;
  clearCompleted.hidden = !todos.some((todo) => todo.completed);

  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  });
}

function add(title) {
  todos.push({ id: crypto.randomUUID(), title, completed: false });
  save();
  render();
}

function toggle(id) {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  save();
  render();
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  save();
  render();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  add(title);
  input.value = '';
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    render();
  });
});

clearCompleted.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  save();
  render();
});

render();
