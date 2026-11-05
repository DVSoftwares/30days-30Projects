//Constants are written in CAPITAL_LETTERS by convention: they never change.
const STORAGE_KEY = 'modular_todos_data'; //name our data is saved under
const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const API_TIMEOUT_MS = 8000; //give up on the request after 8 seconds

export function createId() {
    return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
    
export function getLocalTodos() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveLocalTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export async function postTodoToApi(todoItem) {
    const payload = {
        title: todoItem.title,
        completed: todoItem.completed,
        userId:1,
    };
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body:JSON.stringify(payload),
    });
    if(!response.ok) {
        throw new Error(`API POST failed with status ${response.status}`);
    }
    return await response.json();
}
/** storage.js
 * Everything that talks to the 'outside world' lives here:
 * 1.LocalStorage. 2.a 'fake' API (JSONplaceholder) we POST new tasks to
 *  Own its own file means app.js and render.js never need to know HOW data is saved.
 * Later when you swap localStorage Express + Mongodb API, you only change this file.
 * 
 * "export" for other files which load it with "import"  (ES module)
 */
