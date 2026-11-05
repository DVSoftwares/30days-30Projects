import { getLocalTodos, saveLocalTodos, postTodoToApi } from "./storage.js";
import { renderTodods } from "./render.js";

let todos = getLocalTodos();
let activeFilter = 'all';

const form = document.getElementById('todoForm');
const input = document.getElementById('taskInput');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const syncStatus = document.getElementById('syncStatus');
const statusDot = document.querySelector('.status-dot');
const statusText = document.querySelectorAll('.status-text');

function setSyncStatus(state){
    if (state === 'syncing') {
        statusDot.className = 'status-dot h-2 w-2 rounded-full bg-emerald-400 animate-pulse'
        statusText.textContent = 'Posting to API...'
    }else if (state === 'synced') {
        statusDot.className = 'status-dot h-2 w-2 rounded-full bg-emerald-500'
        statusText.textContent = 'Synced (HTTO 201)'
    }else if (state == 'error') {
        statusDot.className = 'status-dot h-2 w-2 rounded-full bg-rose-500 '
        statusText.textContent = 'Sync Failed'
    }
}

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const title = input.value.trim();
    if(!title) return;

    const newTodo = {
        id: Date.now.toString(),
        title,
        completed: false,
    };
    todos.unshift(newTodo);
    saveLocalTodos(todos);
    renderTodods(todos, activeFilter);
    input.value = '';

    setSyncStatus('syncing');
    try {
        const apiReseult = await postTodoToApi(newTodo);
        console.log('[JSONPlaceholder POST Succeeded]:', apiReseult);
        setSyncStatus('synced');
    } catch (err) {
        console.error('[POST Error]:', err);
        setSyncStatus('Error');
    }
});

todoList.addEventListener('click', (e)=> {
    const target = e.target;
    const actionBtn = target.closest('[data-action]');
    if(!actionBtn) return;

    const itemElement = actionBtn.closest('li');
    const todoId = itemElement.dataset.id;
    const action = actionBtn.dataset.action;

    if (action === 'toggle') {
        todos = todos.map((t) => (t.id === todoId ? {...t, completed : !t.completed} : t));
        saveLocalTodos(todos);
        renderTodods(todos, activeFilter);
    }
    if (action === 'delete') {
        todos = todos.filter((t) => t.id !== todoId);
        saveLocalTodos(todos);
        renderTodods(todos, activeFilter);
    }

    if (action === 'edit') {
        const titleSpan = itemElement.querySelector('.todo-title');
        const editInput = itemElement.querySelector('.todo-edit-input');

        titleSpan.classList.add('hidden');
        editInput.classList.remove('hidden');
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);

        const saveEdit = () => {
            const updatedText = editInput.value.trim();
            if(updatedText){
                todos = todos.map((t) => (t.id === todoId ? {...t, title: updatedText} : t));
                saveLocalTodos(todos);
            }
            renderTodods(todos, activeFilter);
        };

    editInput.addEventListener('keydown', (evt) => {
        if(evt.key === 'Enter') saveEdit();
        if(evt.key === 'Escape') renderTodods(todos, activeFilter);
    });

    editInput.addEventListener('blur', saveEdit, {once: true});
    }
});

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
            b.className = 'filter-btn rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-400 treansition hover:text-white cursor-pointer';
        });
        btn.className = 'filter-btn rounded-lg bg-indigo-600 px-3 py-1.5 text-white transition cursor-pointer';

        activeFilter = btn.dataset.filter;
        renderTodods(todos, activeFilter);
    });
});

renderTodods(todos, activeFilter);