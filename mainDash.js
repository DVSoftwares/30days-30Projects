let projects = [];
let activeFilter = 'all';

const grid = document.getElementById('projectsGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const completedCount = document.getElementById('completedCount');
const progressPercent = document.getElementById('progressPercent');
const TOTAL_DAYS = 30;

//1.Fetch from projects.json
async function loadProjects() {
    try {
        const response = await fetch('./projects.json');
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        projects = await response.json();

        updateStats();
        renderProjects(projects);
    }catch (error) {
        console.error('Could not load projects.json:', error);
        grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-rose-400 text-sm">
            Failed to load project list. make sure Live Server is running.
        </div>
        `;
    }
}


//2.Update stats bagdes
function updateStats(){
    const completed = projects.filter((p) => p.completed).length;
    completedCount.textContent = completed;
    progressPercent.textContent = `${Math.round((completed / TOTAL_DAYS) * 100)}%`;
}
//3.Render project cards into DOM
function renderProjects(items) {
    grid.innerHTML = '';

    if(items.length === 0) {
        grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-500 text-sm">
        No projects match your search.
        </div>
        `;
        return;
    }

    items.forEach((proj) => {
        const card = document.createElement('article');
        card.className = `
        group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300
        ${proj.completed ? 
            'border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900'
            : 'border-slate-800/40 bg-slate-950/40 opacity-50'
        }`;
        
        const tagBadges = proj.tags
        .map(
            (t) =>
                `<span class="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-400">${t}</span>`
        )
        .join('');

        card.innerHTML = `
            <div>
        <div class="flex items-center justify-between text-xs mb-3">
            <span class="font-bold tracking-wider uppercase ${
                proj.completed ? 'text-indigo-400' : 'text-slate-600'
            }"> Day ${String(proj.day).padStart(2, '0')}
            </span>

            <span class="inline-flex items-center gap-1 text-[11px] font-medium
            ${proj.completed ? 'text-emerald-400' : 'text-slate-600'}">
            ${proj.completed ? '&#x25CF; Ready' : '&#x25CB; Locked'}
            </span>
        </div>

        <h2 class="text-lg font-bold text-white transition-colors group-hover:text-indigo-300">
            ${proj.title}
        </h2>
        <p class="mt-2 text-xs leading-relaxed text-slate-400">
            ${proj.desc}
        </p>
    </div>

    <div class="mt-6 flex flex-col gap-4">
        <div class="flex flex-wrap gap-1.5">
            ${tagBadges}
        </div>
        ${
            proj.completed ?
            `<a href="${proj.path}" class="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 text-xs font-semibold text-indigo-300 transition hover:text-white cursor-pointer">
                Launch Project &#x2192;
            </a>`
            : `<button disabled class="cursor-not-allowed rounded-xl border border-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-600">
                Coming Soon
            </button>`
        }
    </div>`;

    grid.appendChild(card);
        
    });
}

//4.Filtering  and Search logic
function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();

    const filtered = projects.filter((proj) => {
        const matchesFilter = 
        activeFilter === 'all' ||
        (activeFilter === 'completed' && proj.completed) ||
        (activeFilter === 'upcoming' && !proj.completed);

        const matcheSearch = 
        proj.title.toLowerCase().includes(query) ||
        proj.desc.toLowerCase().includes(query) ||
        proj.tags.some((t) => t.toLowerCase().includes(query));

        return matchesFilter && matcheSearch;
    });

    renderProjects(filtered);
}

//Event listeners
searchInput.addEventListener('input', applyFilters);

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
            b.classList.remove('bg-indigo-600', 'text-white');
            b.classList.add('border', 'border-slate-800', 'bg-slate-900', 'text-slate-400');
        });
        btn.classList.add('bg-indigo-600', 'text-white');
        btn.classList.remove('border', 'border-slate-800', 'bg-slate-900', 'text-slate-400');

        activeFilter = btn.dataset.filter;
        applyFilters();
    });
});

//Fetch
loadProjects();