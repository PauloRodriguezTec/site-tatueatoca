// Exemplo simples: mensagem de boas-vindas no console
document.addEventListener("DOMContentLoaded", () => {
    console.log("Site da Tatu e a Toca carregado com sucesso!");
    
    // Destaca o link da página atual no menu
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const currentPageBase = currentPage.replace(/\.html$/, '');
    
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop();
        if (linkPage === currentPage || linkPage === currentPageBase || (currentPage === '' && href.includes('index'))) {
            link.classList.add('active');
        }
    });
    
    if (currentPageBase === 'shows' && typeof initializeShowsPage === 'function') {
        initializeShowsPage();
    }
});

function initializeShowsPage() {
    const STORAGE_KEY = 'tatueatocaShows';
    const AUTH_KEY = 'tatueatocaLoggedIn';
    const USERNAME = 'tatueatoca';
    const PASSWORD = 'T@tut0ca';
    const authMessage = document.getElementById('authMessage');
    const showFormMessage = document.getElementById('showFormMessage');
    const scheduleContainer = document.getElementById('scheduleContainer');
    const loginForm = document.getElementById('loginForm');
    const showEditorModal = document.getElementById('showEditorModal');
    const logoutBtn = document.getElementById('logoutBtn');
    const addShowForm = document.getElementById('addShowForm');
    const editScheduleTableBody = document.querySelector('#editScheduleTable tbody');
    const showDateInput = document.getElementById('showDate');
    const showPlaceInput = document.getElementById('showPlace');
    const showCityInput = document.getElementById('showCity');
    const showNotesInput = document.getElementById('showNotes');
    const editButton = document.getElementById('editButton');
    const loginModal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    let editIndex = null;

    const defaultShows = [
        { date: getNextMonthDate(7), place: 'Teatro Municipal', city: 'São Paulo', notes: 'Abertura do festival' },
        { date: getNextMonthDate(15), place: 'Bar do Léo', city: 'Campinas', notes: 'Noite de rock' },
        { date: getNextMonthDate(22), place: 'Praça Central', city: 'Sorocaba', notes: 'Show gratuito' }
    ];

    function getNextMonthDate(day) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = new Date(year, month, day);
        return date.toISOString().split('T')[0];
    }

    function getStoredShows() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultShows));
            return [...defaultShows];
        }
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [...defaultShows];
        } catch {
            return [...defaultShows];
        }
    }

    function saveShows(shows) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shows));
    }

    function sortShows(shows) {
        return [...shows].sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    function clearMessages() {
        authMessage.textContent = '';
        showFormMessage.textContent = '';
        authMessage.className = 'status-message';
        showFormMessage.className = 'status-message';
    }

    function renderSchedule() {
        const shows = sortShows(getStoredShows());
        const html = shows.length === 0
            ? '<p class="empty-schedule">Nenhum show agendado no momento.</p>'
            : `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Local</th>
                        <th>Cidade</th>
                        <th>Observações</th>
                    </tr>
                </thead>
                <tbody>
                    ${shows.map(show => `
                        <tr>
                            <td>${formatDate(show.date)}</td>
                            <td>${escapeHtml(show.place)}</td>
                            <td>${escapeHtml(show.city)}</td>
                            <td>${escapeHtml(show.notes || '—')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        scheduleContainer.innerHTML = html;
    }

    function renderEditTable() {
        const shows = sortShows(getStoredShows());
        editScheduleTableBody.innerHTML = shows.map((show, index) => `
            <tr>
                <td>${formatDate(show.date)}</td>
                <td>${escapeHtml(show.place)}</td>
                <td>${escapeHtml(show.city)}</td>
                <td>${escapeHtml(show.notes || '—')}</td>
                <td class="actions-cell">
                    <button type="button" class="table-button" data-action="edit" data-index="${index}">Editar</button>
                    <button type="button" class="table-button danger" data-action="delete" data-index="${index}">Excluir</button>
                </td>
            </tr>
        `).join('');
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"]+/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[match]);
    }

    function updateEditorVisibility() {
        const loggedIn = sessionStorage.getItem(AUTH_KEY) === 'true';
        // keep editor modal hidden by default; only open when user clicks the edit icon
        if (showEditorModal) showEditorModal.classList.add('hidden');
        authMessage.textContent = '';
        if (loggedIn) {
            document.getElementById('loginForm').classList.add('hidden');
            renderEditTable();
        } else {
            document.getElementById('loginForm').classList.remove('hidden');
        }
    }

    function clearEditForm() {
        showDateInput.value = '';
        showPlaceInput.value = '';
        showCityInput.value = '';
        showNotesInput.value = '';
        editIndex = null;
    }

    function setEditMode(index) {
        const shows = sortShows(getStoredShows());
        const show = shows[index];
        if (!show) return;
        editIndex = index;
        showDateInput.value = show.date;
        showPlaceInput.value = show.place;
        showCityInput.value = show.city;
        showNotesInput.value = show.notes || '';
        showFormMessage.textContent = 'Editando show existente. Clique em Salvar para atualizar.';
        showFormMessage.classList.add('success');
    }

    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        clearMessages();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        if (username === USERNAME && password === PASSWORD) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            loginModal.classList.add('hidden');
            updateEditorVisibility();
        } else {
            authMessage.textContent = 'Usuário ou senha incorretos.';
            authMessage.classList.add('error');
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(AUTH_KEY);
        clearEditForm();
        updateEditorVisibility();
    });

    editButton.addEventListener('click', () => {
        const loggedIn = sessionStorage.getItem(AUTH_KEY) === 'true';
        if (loggedIn) {
            if (showEditorModal) {
                showEditorModal.classList.toggle('hidden');
                if (!showEditorModal.classList.contains('hidden')) {
                    // focus first input inside modal
                    const firstInput = showEditorModal.querySelector('input, button, textarea');
                    if (firstInput) firstInput.focus();
                }
            }
        } else {
            loginModal.classList.remove('hidden');
            document.getElementById('username').focus();
        }
    });

    const closeShowEditorBtn = document.getElementById('closeShowEditor');
    if (closeShowEditorBtn) {
        closeShowEditorBtn.addEventListener('click', () => {
            if (showEditorModal) showEditorModal.classList.add('hidden');
        });
    }

    if (showEditorModal) {
        showEditorModal.addEventListener('click', event => {
            if (event.target === showEditorModal) {
                showEditorModal.classList.add('hidden');
            }
        });
    }

    closeModalBtn.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });

    loginModal.addEventListener('click', event => {
        if (event.target === loginModal) {
            loginModal.classList.add('hidden');
        }
    });

    addShowForm.addEventListener('submit', event => {
        event.preventDefault();
        clearMessages();
        const date = showDateInput.value;
        const place = showPlaceInput.value.trim();
        const city = showCityInput.value.trim();
        const notes = showNotesInput.value.trim();

        if (!date || !place || !city) {
            showFormMessage.textContent = 'Preencha data, local e cidade para salvar.';
            showFormMessage.classList.add('error');
            return;
        }

        const shows = sortShows(getStoredShows());
        const newShow = { date, place, city, notes };

        if (editIndex !== null) {
            shows[editIndex] = newShow;
            showFormMessage.textContent = 'Show atualizado com sucesso.';
        } else {
            shows.push(newShow);
            showFormMessage.textContent = 'Show adicionado com sucesso.';
        }

        saveShows(shows);
        renderSchedule();
        renderEditTable();
        showFormMessage.classList.add('success');
        clearEditForm();
    });

    editScheduleTableBody.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        const action = button.dataset.action;
        const index = Number(button.dataset.index);
        if (action === 'edit') {
            setEditMode(index);
        } else if (action === 'delete') {
            const shows = sortShows(getStoredShows());
            shows.splice(index, 1);
            saveShows(shows);
            renderSchedule();
            renderEditTable();
            showFormMessage.textContent = 'Show removido da agenda.';
            showFormMessage.classList.add('success');
        }
    });

    renderSchedule();
    updateEditorVisibility();
}
