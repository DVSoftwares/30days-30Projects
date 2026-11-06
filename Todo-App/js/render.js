//1 render.js

//2 Grab the two elements we draw into.
const listElement = document.getElementById('todoList');
const countElement = document.getElementById('itemsCount');

//A different message for each filter when the list is empty.
const EMPTY_MESSAGES = {
    all: 'No tasks yet. Add your first one.',
    active: 'Nothing left to do.Nice work!',
    completed: 'No completed tasks yet.',
};


//3 renderTodos
export function renderTodos(todos, activeFilter = 'all') {
    //filter() builds a NEW array with only the tasks we want to show
    //The original 'todos' array is untouched, so hidden tasks are not lost.
    const filtered = todos.filter((todo) => {
        if (activeFilter === 'active') return !todo.completed;
        if(activeFilter === 'completed') return todo.completed;
        return true; // 'all': keep everything
    });

    listElement.innerHTML = ''; //clear the old list before drawing the new one
    
    if (filtered.length === 0) {
        //nothing to show: draw one friendly message instead.
        const empty = document.createElement('li');
        empty.className = 'rounded-2xl border border-slate-800-50 bg-slate-950/40 p-6 text-center text-xs text-slate-500';
        empty.textContent = EMPTY_MESSAGES[activeFilter] ?? EMPTY_MESSAGES.all;
        listElement.appendChild(empty);
    }else {
        //Build one <li> per task and add it to the list
        filtered.forEach((todo) => listElement.appendChild(createTodoItem(todo)));
    }
    //The counter always counts ALL unfinished tasks, not just the visible ones.
    const remaining = todos.filter((t) => !t.completed).length;
    //Ternary operator: condition ? valueIfTrue : valueIfFalse
    countElement.textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} remaining`;
}

//4 createTodoItem
function createTodoItem(todo) {
    const li = document.createElement('li');
    //Completed tasks look faded; unfinished ones get a hover border.
    //Write full Tailwind class names (never build them from pieces),
    //otherwise Tailwind cannot find them and the styles will be missing.

    li.className = `group flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-300 ${
        todo.completed
        ? 'border-slate-800/40 bg-slate-950/40 opacity-60'
        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
    }`;

    //data-id on the <li> is how app.js knows WHICH task a click belongs to.
    li.dataset.id = todo.id;


//5 SECURITY NOTE(IMPORTANT!!!!) 
li.innerHTML = `
              <div class="flex items-center gap-3 overflow-hidden flex-1">
              <button
                 type="button"
                 data-action="toggle"
                 aria-label="Toggle task completion"
                 aria-pressed="${todo.completed}"
                 class="toggle-check flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-xs transition cursor-pointer ${todo.completed  
                    ?
                    'border-emerald-500 bg-emerald-500 text-slate-950 font-bold'
                    :'border-slate-700 bg-slate-950 text-transparent hover:border-indigo-400'
                 }"
              >
              &#x2713;
              </button>

              <span class="todo-title text-sm truncate font-medium ${
                todo.completed ? 'text-slate-500 line-through' : 'text-slate-200' }">
              </span>

              <input
                 type="text"
                 aria-label="Edit task"
                 class="todo-edit-input hidden w-full rounded-lg border border-indigo-500 bg-slate-950 px-2 py-1 text-sm text-white focus:outline-none"
              >
              </div>

              <div class="flex items-center gap-1.5 opacity-90 sm:opacity-0  transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <button
              type="button"
              data-action ="edit"
              aria-label="Edit task"
              class ="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title = "Edit Task">
              &#x270E;
              </button>

              <button
              type ="button"
              data-action="delete"
              aria-label="Delete task"
              class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition cursor-pointer"
              title="Delete task";
              >
              &#x2715;
              </button>
              </div>
            
            `; 

            //Now fill the user's text safely 
            li.querySelector('.todo-title').textContent = todo.title;
            li.querySelector('.todo-dit-input').value = todo.title;
            return li;
}
 
/**1 render.js
 * This file only DRAWS the list on the page.NEVER changes ths data,NEVER saves anything.That split keeps thigns simple:
 * 
 * data changes (app.js) -> call renderTOdos() -> screen updates
 * 
 * The idea: the screen is a picture of the data.When the data changes ,we clear the list and draw it again from scratch.
 * (React does the same thing, just much more cleverly -> this is for later jsk)
 * 
 *  */ 

/** 2 Grab Elements we draw into.
 * Because app.js is loaded as type="module". it runs after the page is parsed, so these exist.
 *
 */

/** 3 renderTodos
 * todos          - the full array of tasks
 * activefilter   - 'all' ,'active' ,'completed'
 * "activeFulter" - 'all' is the default value , used if nothing is passed in
 */

/**4 createTodoItem
 * Builds ONE task row (an <li>) and returns it.
 * 
 */

/**5 SECURITY NOTE(IMPORTANT!!!!) 
 * The template below contains NO text typed by the user. The task title is added AFTER it, using textContent and .value
 * 
 * Why? If we pasted the title into the HTML string, a task such as 
 * "><img src =x onerror=alert(1)>
 * would become real HTML and run code (this is called XSS).
 * textContent always treats the text as plain text, so it is safe
 * 
 * Each button has data-action="toggle | edit | delete".
 * app.js listens for clicks and reads that attribute.
 */