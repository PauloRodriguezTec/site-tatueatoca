// Inicializar EmailJS quando a página estiver carregada
// NOTA: A chave pública do EmailJS é visível no front-end por design do EmailJS.
// Veja instruções em: https://www.emailjs.com/docs/tutorial/creating-contact-form/

// Função para melhorar diagnóstico do carregamento do EmailJS
function initializeContactForm() {
    if (typeof emailjs === "undefined") {
        const errorMessage = "EmailJS não foi carregado. Verifique o script do CDN e se você abriu a página via HTTP/HTTPS.";
        console.error(errorMessage);
        const initialStatusElement = document.getElementById("statusMessage");
        if (initialStatusElement) {
            initialStatusElement.classList.add("error");
            initialStatusElement.textContent = errorMessage;
        }
        return;
    }

    const EMAILJS_PUBLIC_KEY = "YGrdDkNnVxV0Ly7zeF"; // Coloque sua chave pública aqui
    const EMAILJS_SERVICE_ID = "service_tatueatoca";
    const EMAILJS_TEMPLATE_ID = "template_contact";
    
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (e) {
        console.error("Erro ao inicializar EmailJS:", e);
        const statusEl = document.getElementById("statusMessage");
        if (statusEl) {
            statusEl.classList.add("error");
            statusEl.textContent = "Erro ao inicializar EmailJS: " + e.message;
        }
        return;
    }

    const contactForm = document.getElementById("contactForm");
    const statusMessageEl = document.getElementById("statusMessage");
    const submitButton = document.querySelector(".submit-btn");

    if (!contactForm || !statusMessageEl || !submitButton) {
        const errorMessage = "Elementos do formulário de contato não foram encontrados no DOM.";
        console.error(errorMessage, { contactForm, statusMessageEl, submitButton });
        if (statusMessageEl) {
            statusMessageEl.classList.add("error");
            statusMessageEl.textContent = errorMessage;
        }
        return;
    }

    const updateStatus = (message, type = "") => {
        statusMessageEl.textContent = message;
        statusMessageEl.className = type;
        console.log("Status do formulário:", message, type);
    };

    // Melhora de acessibilidade: anúncios de status
    try {
        statusMessageEl.setAttribute("role", "status");
        statusMessageEl.setAttribute("aria-live", "polite");
    } catch (err) {
        console.warn("Não foi possível aplicar atributos de acessibilidade ao elemento de status.", err);
    }

    console.log("EmailJS inicializado com sucesso.", { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID });

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");
        const email = emailInput && emailInput.value ? emailInput.value.trim() : "";
        const message = messageInput && messageInput.value ? messageInput.value.trim() : "";

        // Validação básica
        const emailPattern = /^\S+@\S+\.\S+$/;
        if (!email) {
            updateStatus("Por favor, informe um e-mail.", "error");
            if (emailInput) {
                emailInput.focus();
            }
            return;
        }
        if (!emailPattern.test(email)) {
            updateStatus("Por favor, informe um e-mail válido.", "error");
            if (emailInput) {
                emailInput.focus();
            }
            return;
        }
        if (!message) {
            updateStatus("Por favor, escreva uma mensagem.", "error");
            if (messageInput) {
                messageInput.focus();
            }
            return;
        }

        submitButton.disabled = true;
        updateStatus("Enviando...", "");

        const templateParams = {
            user_email: email,
            from_email: email,
            reply_to: email,
            message: message,
            to_email: "tatueatoca@gmail.com"
        };

        try {
            console.log("Enviando EmailJS com parâmetros:", templateParams);
            const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            console.log("EmailJS envio concluído:", response);

            updateStatus("✓ Sua mensagem foi enviada com sucesso! Obrigado pelo contato.", "success");
            contactForm.reset();

            setTimeout(() => {
                statusMessageEl.textContent = "";
                statusMessageEl.className = "";
            }, 5000);
        } catch (error) {
            console.error("Erro ao enviar mensagem via EmailJS:", error);
            const errorDetails = error.text || error.statusText || error.status || error.message || "Erro desconhecido";
            updateStatus(`✗ Erro ao enviar. Tente novamente mais tarde. (${errorDetails})`, "error");
        } finally {
            submitButton.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Aguarda um pouco para garantir que o EmailJS tenha tempo de carregar (especialmente no fallback CDN)
    setTimeout(initializeContactForm, 500);
});
