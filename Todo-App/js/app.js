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
const FILTER_INACTIVE = 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white';

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

//6 refresh
function refresh() {
    renderTodos(todos, activeFilter);
    clearBtn.hidden = !todos.some((t) => t.completed);
}

//7 commit
function commit() {
    saveLocalTodos(todos);
    refresh()
}

/*---8 ADD A TASK---*/
form.addEventListener('submit', async (e) => { //wait for the API without freezing the page
    e.preventDefault(); //stop the browser from reloading the page (form;s default action)

    const title = input.value.trim(); 
    if(!title) return;

    const newTodo = {
        id: createId(),
        title,
        completed: false,
    };

    todos.unshift(newTodo);
    commit();
    input.value = '';
    input.focus();
//the task is already saved locally. Now try to tell the API about it.
    setSyncStatus('syncing');
    try {
        const apiResult = await postTodoToApi(newTodo);
        console.log('[JSONPlaceholder POST Succeeded]:', apiResult);
        setSyncStatus('synced');
    }catch (err) {
        console.error('[POST Error]:', err);
        setSyncStatus('error');
    }
});

/*---9 Edit A Task---*/
function startEdit(itemElement, todoId) {
    const titleSpan = itemElement.querySelector('.todo-title');
    const editInput = itemElement.querySelector('.todo-edit-input');

    titleSpan.classList.add('hidden'); //hide the text...
    editInput.classList.remove('hidden');  //...show the input
    editInput.focus();
//put the cursor at the end of the text instead of selecting it all
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);

    //This flag makes sure we only finish ONCE, so Escape really cancels.
    let finished = false;

    const finish = (shouldSave) => {
        if (finished) return;
        finished = true;
        
        const updatedText = editInput.value.trim();
        if(shouldSave && updatedText) {
            todos = todos.map((t) => (t.id === todoId ? {...t, title: updatedText} : t));
            commit();
        }else {
            refresh(); //cancelled or empty: just redraw the original
        }
    };

    editInput.addEventListener('keydown', (evt) => {
        if(evt.key === 'Enter') finish(true);
        if(evt.key === 'Escape') finish(false);
    });

    editInput.addEventListener('blur', () => finish(true)); //"blur" fires when the input loses focus (the user clicked elsewhere)
}

/*---10 CLICKS INSIDE THE LIST(toggle / edit / delete)---*/
todoList.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if(!actionBtn) return;

    const itemElement = actionBtn.closest('li');
    const todoId = itemElement.dataset.id;
    const action = actionBtn.dataset.action;

    if(action === 'toggle') {
        //flip completed for the matching task: true ->false, false-> true
        todos = todos.map((t) => (t.id === todoId ? {...t, completed: !t.completed}: t));
        commit();
    }
    if(action === 'delete') {
        //keep every task EXCEPT the one with this id
        todos = todos.filter((t) => t.id !== todoId);
        commit();
    }
    if(action === 'edit') {
        startEdit(itemElement, todoId);
    }    
});

/*---11 FILTER BUTTONS (All / Active / Completed)---*/
filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        //Step 1: make EVRY button look inactive
        filterBtns.forEach((b) => {
            //"...array" (spread) turns ['a','b'] into the separate arguments 'a', 'b'
            b.classList.remove(...FILTER_ACTIVE.split(' '));
            b.classList.add(...FILTER_INACTIVE.split(' '));
            b.setAttribute('aria-pressed', 'false'); //tells screen readers it is not selected

        }); 
         //Step 2: make only the clicked one look active
            btn.classList.remove(...FILTER_INACTIVE.split(' '));
            btn.classList.add(...FILTER_ACTIVE.split(' '));
            btn.setAttribute('aria-pressed', 'true');   

         //Step 3: remember the choice (it comes from data-filter =",,,") and redraw
            activeFilter = btn.dataset.filters;
            refresh();
        });
    });

/*---CLEAR COMPLETED---*/    
    clearBtn.addEventListener('click', () => {
        todos = todos.filter((t) => !t.completed); //keep only the unfinished tasks
        commit();
    });


/*---START---*/
    refresh(); //Draw the list once when the page loads. Everything after this reacts to the user.





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

/**6 refresh
 * Redraws the list for the current filter and shows or hides "clear completed"
 * some() returns true if at least one task matches.
 */

/**7 commit
 * Use this after ANY change to 'todos'; save to localStorage, then redraw.
 * having one fuction for both means we can never forget to do one of them.
 */

/**8 ADD A TASK
 * 
 */

/**9 Edit A Task
 * startEdit
 * Swaps the title text for an input box so the user can tename the task
 * Enter or clicking away saves it.Escape canclels it.
 */

/**10 CLICKS INSIDE THE LIST(toggle / edit / delete)
 * EVENT DELEGATION: we add ONE listener to the whole <ul> instead of one per button.
 * Tasks are created and destroyed all the time, so listeners on each buton would be lost on every redraw. Click "bubble up" to the <ul>,and there we check what was clicked.
 * 
 */

/**11 FILTER BUTTONS (All / Active / Completed)
 * 
 */