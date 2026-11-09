//1 storage.js

//Constants are written in CAPITAL_LETTERS by convention: they never change.
const STORAGE_KEY = 'modular_todos_data'; //name our data is saved under
const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const API_TIMEOUT_MS = 8000; //give up on the request after 8 seconds

//2  createId
export function createId() {
    return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

//3  ensureUniqueIds
function ensureUniqueIds(todos) {
    const seen = new Set(); //a Set stores each value only once,
    return todos.map((t) =>{
        let id = t.id;
        if(!id || seen.has(id)) id = createId(); //missing or duplicate -> new id
        seen.add(id);
        return{...t, id}; //copy the task and replace its id (spread syntax)
    });
}  

//4  getLocalTodos
export function getLocalTodos() {
    try{
    const data = localStorage.getItem(STORAGE_KEY); //null if nothing saved yet
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ?  ensureUniqueIds(parsed) : [];
}catch(err) {
    console.error('[Storage] Could not read saved todos:', err);
    return[]; // Start with an empty list rather than crashing
}
}

//5 saveLocalTodos
export function saveLocalTodos(todos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch(err) {
        console.error('[Storage] Could not save todos:', err)
    }
}

//6 postTodoToApi
export async function postTodoToApi(todoItem) {
    //Send only the fields the API expects, not our whole task object.
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

        signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if(!response.ok) {
        throw new Error(`API POST failed with status ${response.status}`);
    }
    return await response.json();
}
/** 1 storage.js
 * Everything that talks to the 'outside world' lives here:
 * 1.LocalStorage. 2.a 'fake' API (JSONplaceholder) we POST new tasks to
 *  Own its own file means app.js and render.js never need to know HOW data is saved.
 * Later when you swap localStorage Express + Mongodb API, you only change this file.
 * 
 * "export" for other files which load it with "import"  (ES module)
 */

/** 2 createID
 * Every task needs its own unique id, find it later to toggle, edit, or delete
 * crypto.randomUUID?.() make ids like "3yedyhde-sd7ddh-sdhuu8-snheuesdh"
 * Works only on live server, so "?" "?? is
 * fallback: crypto.randomUUID?.() -> call if it exists(optional chaining)
 *                            ??   ->if left side is undefined   
 */

/** 3 ensureUniqueIds
 * Every task !same id
 * First time an id appears we keep it, and any repeat gets a fresh id.
 */

/** 4 getLocalTodos
 * Reads the saved tasks.localStorage only stores TEXT, so we saved the array as JSON string
 * and now turn it back into an array with JSON.parse.
 * 
 * try/catch: if the saved text is corrupted, JSON.parse throws an error
 * without try/catch that error would crash the whole app on load
 */

/**5 saveLocalTodos
 * The reverse: array -> JSON text -> LocalStorage
 * setItem can fail(storage full, private browsing), so it is wrapped too
 */

/**6 postTodoToApi
 * Sends one text to the API. "async" means this function returns a Promise
 * so we use "await" inside ,which pauses untill the network replies without freezing the page.
 * 
 * Note: JSONPlaceholder is a practice API. It replies "201 created" but does not really 
 * store anything, so "Synced" only means the API accepted it
  */