let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';
let sortBy = 'date';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  let filtered = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  if (sortBy === 'priority') {
    const priorityOrder = { alta: 1, média: 2, baixa: 3 };
    filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.dataset.priority = task.priority;

    const info = document.createElement('div');
    info.className = 'info';
    info.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.completed ? 'Desfazer' : 'Concluir';
    toggleBtn.onclick = () => toggleComplete(index);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'edit';
    editBtn.onclick = () => editTask(index);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Excluir';
    delBtn.onclick = () => deleteTask(index);

    actions.append(toggleBtn, editBtn, delBtn);
    li.append(info, actions);
    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('prioritySelect').value;
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    text,
    completed: false,
    date: new Date().toISOString(),
    priority
  });

  input.value = '';
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const newText = prompt('Editar tarefa:', tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function filterTasks(type) {
  filter = type;
  renderTasks();
}

function sortTasks(type) {
  sortBy = type;
  renderTasks();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// Inicialização
renderTasks();
