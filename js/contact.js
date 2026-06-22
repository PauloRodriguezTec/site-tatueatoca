// contact.js — implementação limpa para carregar EmailJS e gerenciar o formulário
// Mantém as funções: carregamento do SDK, inicialização e envio via EmailJS

// Configurações (substitua pelos seus valores do EmailJS)
const EMAILJS_PUBLIC_KEY = "1HYvziLw6J92Qr-EC"; // Substitua pelo seu Public Key do EmailJS
const EMAILJS_SERVICE_ID = "service_829zwwc";
const EMAILJS_TEMPLATE_ID = "template_f8cfr6o";

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Falha ao carregar script: ' + src));
        document.head.appendChild(s);
    });
}

function setStatus(el, message, type = '') {
    if (!el) return;
    el.textContent = message;
    el.className = type;
}

function initializeContactForm() {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS não disponível no escopo global.');
        setStatus(document.getElementById('statusMessage'), 'Erro: EmailJS não carregado.', 'error');
        return;
    }

    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (err) {
        console.error('Erro ao inicializar EmailJS:', err);
        setStatus(document.getElementById('statusMessage'), 'Erro ao inicializar EmailJS.', 'error');
        return;
    }

    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('statusMessage');
    const submitBtn = document.querySelector('.submit-btn');

    if (!form || !statusEl || !submitBtn) {
        console.error('Elementos do formulário não encontrados.', { form, statusEl, submitBtn });
        setStatus(statusEl, 'Erro: elementos do formulário não encontrados.', 'error');
        return;
    }

    // Acessibilidade
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const email = emailInput ? emailInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';

        const emailPattern = /^\S+@\S+\.\S+$/;
        if (!email) {
            setStatus(statusEl, 'Por favor, informe um e-mail.', 'error');
            emailInput && emailInput.focus();
            return;
        }
        if (!emailPattern.test(email)) {
            setStatus(statusEl, 'Por favor, informe um e-mail válido.', 'error');
            emailInput && emailInput.focus();
            return;
        }
        if (!message) {
            setStatus(statusEl, 'Por favor, escreva uma mensagem.', 'error');
            messageInput && messageInput.focus();
            return;
        }

        submitBtn.disabled = true;
        setStatus(statusEl, 'Enviando...', '');

        // Inclui o e-mail do remetente no corpo da mensagem para garantir
        // que o endereço apareça no e-mail recebido, mesmo que o provedor
        // de e-mail substitua o campo From por razões de segurança.
        const messageWithSender = `Remetente: ${email}\nEmail: ${email}\n\n${message}`;

        const templateParams = {
            sender_email: email,
            reply_to: email,
            message: messageWithSender,
            to_email: 'tatueatoca@gmail.com'
        };

        try {
            const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            console.log('Envio EmailJS:', res);
            setStatus(statusEl, '✓ Sua mensagem foi enviada com sucesso!', 'success');
            form.reset();
            setTimeout(() => setStatus(statusEl, '', ''), 5000);
        } catch (error) {
            console.error('Erro ao enviar via EmailJS:', error);
            const details = (error && (error.text || error.message)) || 'Erro desconhecido';
            setStatus(statusEl, `✗ Erro ao enviar. (${details})`, 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// Carrega o SDK do EmailJS e inicializa o formulário
document.addEventListener('DOMContentLoaded', async () => {
    const primary = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js';
    const fallback = 'https://unpkg.com/@emailjs/browser@3/dist/index.min.js';

    if (typeof emailjs === 'undefined') {
        try {
            await loadScript(primary);
            console.log('EmailJS carregado via CDN principal.');
        } catch (err1) {
            console.warn('Falha no CDN principal, tentando fallback...', err1);
            try {
                await loadScript(fallback);
                console.log('EmailJS carregado via CDN alternativo.');
            } catch (err2) {
                console.error('Não foi possível carregar EmailJS de ambos CDNs.', err2);
                setStatus(document.getElementById('statusMessage'), 'Erro: não foi possível carregar EmailJS.', 'error');
                return;
            }
        }
    }

    // Inicializa o formulário após o SDK estar disponível
    initializeContactForm();
});
