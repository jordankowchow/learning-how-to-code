const STORAGE_KEY = 'todo.items'

function qs(sel) { return document.querySelector(sel) }

let todos = []

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    todos = raw ? JSON.parse(raw) : []
  } catch (e) {
    todos = []
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function createTodoElement(todo, index) {
  const li = document.createElement('li')
  li.dataset.index = index
  if (todo.completed) li.classList.add('completed')

  const left = document.createElement('div')
  left.className = 'left'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = !!todo.completed
  checkbox.addEventListener('change', () => toggleTodo(index))

  const label = document.createElement('span')
  label.className = 'label'
  label.textContent = todo.text

  left.appendChild(checkbox)
  left.appendChild(label)

  const del = document.createElement('button')
  del.textContent = 'Delete'
  del.addEventListener('click', () => removeTodo(index))

  li.appendChild(left)
  li.appendChild(del)
  return li
}

function render() {
  const list = qs('#todo-list')
  list.innerHTML = ''
  todos.forEach((t, i) => list.appendChild(createTodoElement(t, i)))
  updateCount()
}

function updateCount() {
  const remaining = todos.filter(t => !t.completed).length
  qs('#remaining-count').textContent = `${remaining} item${remaining === 1 ? '' : 's'}`
}

function addTodo(text) {
  const trimmed = (text || '').trim()
  if (!trimmed) return
  todos.push({ text: trimmed, completed: false })
  saveTodos()
  render()
}

function toggleTodo(index) {
  if (!todos[index]) return
  todos[index].completed = !todos[index].completed
  saveTodos()
  render()
}

function removeTodo(index) {
  todos.splice(index, 1)
  saveTodos()
  render()
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed)
  saveTodos()
  render()
}

function wire() {
  const input = qs('#todo-input')
  const addBtn = qs('#add-btn')
  const clearBtn = qs('#clear-completed')

  addBtn.addEventListener('click', () => { addTodo(input.value); input.value = '' })
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { addTodo(input.value); input.value = '' }})
  clearBtn.addEventListener('click', clearCompleted)
}

document.addEventListener('DOMContentLoaded', () => {
  loadTodos()
  wire()
  render()
})
