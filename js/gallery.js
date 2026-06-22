// Gallery script: suporta fotos e vídeos, arquivos locais ou links externos.
(function(){
	const STORAGE_KEY = 'galleryItems_v1';
	const AUTH_KEY = 'tatueatocaLoggedIn';
	const USERNAME = 'tatueatoca';
	const PASSWORD = 'T@tut0ca';

	function $(sel) { return document.querySelector(sel); }
	function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

	function loadItems() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch (e) {
			console.error('Erro ao carregar items', e);
			return [];
		}
	}

	function saveItems(items) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}

	function render() {
		const grid = $('#gallery-grid');
		grid.innerHTML = '';
		const items = loadItems();

		if (!items.length) {
			grid.innerHTML = '<p>Nenhum item na galeria. Adicione fotos ou vídeos acima.</p>';
			return;
		}

		const loggedIn = sessionStorage.getItem(AUTH_KEY) === 'true';
		items.forEach((it, idx) => {
			const card = document.createElement('figure');
			card.className = 'gallery-item';

			if (it.type === 'image') {
				const img = document.createElement('img');
				img.src = it.src;
				img.alt = it.desc || 'Foto da galeria';
				card.appendChild(img);
			} else if (it.type === 'video') {
				const video = document.createElement('video');
				video.src = it.src;
				video.controls = true;
				video.preload = 'metadata';
				card.appendChild(video);
			}

			const figcap = document.createElement('figcaption');
			figcap.textContent = it.desc || '';
			card.appendChild(figcap);

			if (loggedIn) {
				const del = document.createElement('button');
				del.className = 'gallery-delete';
				del.textContent = 'Excluir';
				del.addEventListener('click', () => {
					const items = loadItems();
					items.splice(idx, 1);
					saveItems(items);
					render();
				});
				card.appendChild(del);
			}

			grid.appendChild(card);
		});
	}

	function dataUrlFromFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	function onSubmit(e) {
		e.preventDefault();
		const type = $('#item-type').value;
		const fileInput = $('#item-file');
		const urlInput = $('#item-url').value.trim();
		const desc = $('#item-desc').value.trim();

		const items = loadItems();

		// Priority: arquivo local > url
		if (fileInput.files && fileInput.files.length) {
			const file = fileInput.files[0];
			// Validate type compatibility
			if (type === 'image' && !file.type.startsWith('image')) {
				alert('Selecione um arquivo de imagem para Foto.');
				return;
			}
			if (type === 'video' && !file.type.startsWith('video')) {
				alert('Selecione um arquivo de vídeo para Vídeo.');
				return;
			}

			dataUrlFromFile(file).then(dataUrl => {
				items.push({ type, src: dataUrl, desc });
				saveItems(items);
				$('#gallery-form').reset();
				render();
			}).catch(err => {
				console.error(err);
				alert('Erro ao ler o arquivo.');
			});

			return;
		}

		if (urlInput) {
			// Basic validation
			try {
				const parsed = new URL(urlInput);
				items.push({ type, src: parsed.href, desc });
				saveItems(items);
				$('#gallery-form').reset();
				render();
			} catch (err) {
				alert('URL inválida.');
			}
			return;
		}

		alert('Envie um arquivo local ou um link externo.');
	}

	function clearGallery() {
		if (!confirm('Deseja limpar toda a galeria?')) return;
		localStorage.removeItem(STORAGE_KEY);
		render();
	}

	// Autenticação e inicialização
	document.addEventListener('DOMContentLoaded', () => {
		const form = document.getElementById('gallery-form');
		if (form) form.addEventListener('submit', onSubmit);
		const clearBtn = document.getElementById('clear-gallery');
		if (clearBtn) clearBtn.addEventListener('click', clearGallery);

		const loginModal = document.getElementById('loginModal');
		const loginForm = document.getElementById('loginForm');
		const closeModalBtn = document.getElementById('closeModalBtn');
		const editButton = document.getElementById('galleryEditButton');
		const galleryEditorModal = document.getElementById('galleryEditorModal');
		const logoutBtn = document.getElementById('galleryLogoutBtn');
		const authMessage = document.getElementById('authMessage');

		function updateEditorVisibility() {
			const loggedIn = sessionStorage.getItem(AUTH_KEY) === 'true';
			if (galleryEditorModal) galleryEditorModal.classList.toggle('hidden', !loggedIn);
			render();
			if (authMessage) {
				authMessage.textContent = '';
				authMessage.className = 'status-message';
			}
		}

		if (loginForm) {
			loginForm.addEventListener('submit', event => {
				event.preventDefault();
				if (!authMessage) return;
				authMessage.textContent = '';
				const username = document.getElementById('username').value.trim();
				const password = document.getElementById('password').value;
				if (username === USERNAME && password === PASSWORD) {
					sessionStorage.setItem(AUTH_KEY, 'true');
					if (loginModal) loginModal.classList.add('hidden');
					updateEditorVisibility();
				} else {
					authMessage.textContent = 'Usuário ou senha incorretos.';
					authMessage.classList.add('error');
				}
			});
		}

		if (logoutBtn) {
			logoutBtn.addEventListener('click', () => {
				sessionStorage.removeItem(AUTH_KEY);
				updateEditorVisibility();
			});
		}

		if (editButton) {
			editButton.addEventListener('click', () => {
				const loggedIn = sessionStorage.getItem(AUTH_KEY) === 'true';
				if (loggedIn) {
					if (galleryEditorModal) {
						galleryEditorModal.classList.toggle('hidden');
						if (!galleryEditorModal.classList.contains('hidden')) {
							const first = galleryEditorModal.querySelector('input, button, textarea');
							if (first) first.focus();
						}
					}
				} else {
					if (loginModal) {
						loginModal.classList.remove('hidden');
						const userField = document.getElementById('username');
						if (userField) userField.focus();
					}
				}
			});
		const closeGalleryEditorBtn = document.getElementById('closeGalleryEditor');
		if (closeGalleryEditorBtn) {
			closeGalleryEditorBtn.addEventListener('click', () => {
				if (galleryEditorModal) galleryEditorModal.classList.add('hidden');
			});
		}

		if (galleryEditorModal) {
			galleryEditorModal.addEventListener('click', event => {
				if (event.target === galleryEditorModal) {
					galleryEditorModal.classList.add('hidden');
				}
			});
		}
		}

		if (closeModalBtn) {
			closeModalBtn.addEventListener('click', () => {
				if (loginModal) loginModal.classList.add('hidden');
			});
		}

		if (loginModal) {
			loginModal.addEventListener('click', event => {
				if (event.target === loginModal) {
					loginModal.classList.add('hidden');
				}
			});
		}

		updateEditorVisibility();
	});

})();
