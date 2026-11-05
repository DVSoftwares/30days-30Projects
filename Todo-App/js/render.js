const listElement = document.getElementById('todoList');
const countElement = document.getElementById('itemsCount');

export function renderTodods(todos, activeFilter) {
    const filtered = todos.filter((todo) => {
        if (activeFilter === 'active') return !todo.completed;
        if(activeFilter === 'completed') return todo.completed;
        return true;
    });
    listElement.innerHTML = '';
    
    if (filtered.length === 0) {
        listElement.innerHTML =`
        <li class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 text-center text-xs text-slate-500">
        No tasks found.
        </li>
        `;
    }else {
        filtered.forEach(todo => {
            const li = document.createElement('li');
            li.classList = `group flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-299 ${todo.completed
                ?
            'border-slate-800/40 bg-slate-950/40 opacity-60'
            :
            'border-slate-800 bg-slate-900/69 hover:border-slate-700'
            }`;
            li.dataset.id = todo.id;

            li.innerHTML = `
              <div class="flex items-center gap-3 overflow-hidden flex-1">
              <button
                 type="button"
                 data-action="toggle"
                 class="toggle-check flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border text-xs transition cursor-pointer ${todo.completed  
                    ?
                    'border-emerald-500 bg-emerald-500 text-slate-950 font-bold'
                    :'border-slate-700 bg-slate-950 text-transparent hover:border-indigo-400'
                 }"
                 aria-label="Toggle task completion"
              >
              &#x2713;
              </button>

              <span class="todo-title text-sm truncate font-medium ${
                todo.completed ? 'text-slate-500 line-through' : 'text-slate-200' }">
              ${escapeHtml(todo.title)}
              </span>
              <input
                 type="text"
                 class="todo-edit-input hidden w-full rounded-lg border border-indigo-500 bg-slate-950 px-2 py-1 text-sm text-white focus:outline-none"
                 value="${escapeHtml(todo.title)}"
              >
              </div>

              <div class="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
              type="button"
              data-action ="edit"
              class ="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title = "Edit Task">
              &#x270E;
              </button>

              <button
              type ="button"
              data-action="delete"
              class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition cursor-pointer"
              title="Delete task";
              >
              &#x2715;
              </button>
              </div>
            
            `;
            listElement.appendChild(li);
        });
    }
        const remaining = todos.filter((t) => !t.completed).length;
        countElement.textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} remaining`;
    }
    function escapeHtml(str) {
        const div =  document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
