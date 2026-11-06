//1 app.js (BRAIN)
//imports
import { getLocalTodos, saveLocalTodos, postTodoToApi, createId } from "./storage.js";
import { renderTodos } from "./render.js";

//2 STATE
let todos = getLocalTodos(); //the tasks, loaded from localStorage when the page opens
let activeFilter = 'all'; //which tab is selected: 'all' | 'active' | 'completed'

//3 Grab Elements from page.

const form = document.getElementById('todoForm');
const input = document.getElementById('taskInput');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn'); //querySelectorAll gives a LIST of all matches

const clearBtn = document.getElementById('clearCompleted');
const statusDot = document.querySelector('.status-dot'); //querySelector gives only the FIRST match
const statusText = document.querySelector('.status-text');

//4 Style Constants
const FILTER_ACTIVE = 'bg-indigo-600 text-white';
const Filter_INACTIVE = 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white';

//One object that describes every sync state, instead of a long if /else chain
const SYNC_STATES = {
    syncing:{dot: 'bg-amber-400 animate-pulse', text: 'Posting to API...'},
    synced:{dot: 'bg-emerald-500', text: 'Synced (HTTP 201)'},
    error:{dot: 'bg-rose-500', text: 'Sync Failed'},
};
//5 setSyncStatus
function setSyncStatus(state){
    const s = SYNC_STATES[state]; //look up the matching entry
    if (!s) return;               //unknown state: do nothing 
    statusDot.className = `status-dot h-2 w-2 rounded-full ${s.dot}`;
    statusText.textContent = s.text;
}

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const title = input.value.trim();
    if(!title) return;

    const newTodo = {
        id: Date.now().toString(),
        title,
        completed: false,
    };
    todos.unshift(newTodo);
    saveLocalTodos(todos);
    renderTodos(todos, activeFilter);
    input.value = '';

    setSyncStatus('syncing');
    try {
        const apiReseult = await postTodoToApi(newTodo);
        console.log('[JSONPlaceholder POST Succeeded]:', apiReseult);
        setSyncStatus('synced');
    } catch (err) {
        console.error('[POST Error]:', err);
        setSyncStatus('error');
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
        renderTodos(todos, activeFilter);
    }
    if (action === 'delete') {
        todos = todos.filter((t) => t.id !== todoId);
        saveLocalTodos(todos);
        renderTodos(todos, activeFilter);
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
            renderTodos(todos, activeFilter);
        };

    editInput.addEventListener('keydown', (evt) => {
        if(evt.key === 'Enter') saveEdit();
        if(evt.key === 'Escape') renderTodos(todos, activeFilter);
    });

    editInput.addEventListener('blur', saveEdit, {once: true});
    }
});

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
            b.className = 'filter-btn rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-400 transition hover:text-white cursor-pointer';
        });
        btn.className = 'filter-btn rounded-lg bg-indigo-600 px-3 py-1.5 text-white transition cursor-pointer';

        activeFilter = btn.dataset.filters;
        renderTodos(todos, activeFilter);
    });
});

renderTodos(todos, activeFilter);


/**1 app.js
 * BRAIN -> 1.Keeps the list of tasks in memory (the "state")
 *          2.listens for what the user does (submit, click, type)
 *          3.Updates the state, saves it, and asks render.js to redraw
 * 
 * PATTERN ->1.Change the data
 *           2.Save it
 *           3.Redraw the screen
 * Learn this p well .How React apps work too.
 * 
 * Files: storage.js = saving data
 *        render.js = drawing
 *        app.js = logic
 */

/**2 STATE
 * "let" because we replace the values later
 */

/**3 Grab Elements from the page
 * 
 */

/**4 Style Constants
 * Full tailwind class names written out, so Tailwind can find them in this file
 * 
 */

/**5 setSyncStatus
 * Changes the little dot and the text in the top right badge
 * state must be one of the keys 'syncing', 'synced', 'error'.
 */