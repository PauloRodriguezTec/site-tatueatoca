// Inicializar EmailJS quando a página estiver carregada
// NOTA: A chave pública do EmailJS é visível no front-end por design do EmailJS.
// Veja instruções em: https://www.emailjs.com/docs/tutorial/creating-contact-form/
document.addEventListener("DOMContentLoaded", () => {
    if (typeof emailjs === "undefined") {
        console.error("EmailJS não foi carregado. Verifique o script do CDN.");
        return;
    }

    const EMAILJS_PUBLIC_KEY = "GrdDkNnVxV0Ly7zeF"; // Coloque sua chave pública aqui
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const contactForm = document.getElementById("contactForm");
    const statusMessageEl = document.getElementById("statusMessage");
    const submitButton = document.querySelector(".submit-btn");

    if (!contactForm || !statusMessageEl || !submitButton) {
        console.error("Elementos do formulário de contato não foram encontrados no DOM.");
        return;
    }

    // Melhora de acessibilidade: anúncios de status
    try {
        statusMessageEl.setAttribute("role", "status");
        statusMessageEl.setAttribute("aria-live", "polite");
    } catch (err) {
        // Elemento pode não suportar atributos, mas seguimos em frente
    }

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");
        const email = (emailInput?.value ?? "").trim();
        const message = (messageInput?.value ?? "").trim();

        // Validação básica
        const emailPattern = /^\S+@\S+\.\S+$/;
        if (!email) {
            statusMessageEl.textContent = "Por favor, informe um e-mail.";
            statusMessageEl.className = "error";
            emailInput?.focus();
            return;
        }
        if (!emailPattern.test(email)) {
            statusMessageEl.textContent = "Por favor, informe um e-mail válido.";
            statusMessageEl.className = "error";
            emailInput?.focus();
            return;
        }
        if (!message) {
            statusMessageEl.textContent = "Por favor, escreva uma mensagem.";
            statusMessageEl.className = "error";
            messageInput?.focus();
            return;
        }

        submitButton.disabled = true;
        statusMessageEl.textContent = "Enviando...";
        statusMessageEl.className = "";

        try {
            await emailjs.send("service_tatueatoca", "template_contact", {
                user_email: email,
                message: message,
                to_email: "tatueatoca@gmail.com"
            });

            statusMessageEl.textContent = "✓ Sua mensagem foi enviada com sucesso! Obrigado pelo contato.";
            statusMessageEl.className = "success";
            contactForm.reset();

            setTimeout(() => {
                statusMessageEl.textContent = "";
                statusMessageEl.className = "";
            }, 5000);
        } catch (error) {
            console.error("Erro ao enviar mensagem via EmailJS:", error);
            statusMessageEl.textContent = "✗ Erro ao enviar. Tente novamente mais tarde.";
            statusMessageEl.className = "error";
        } finally {
            submitButton.disabled = false;
        }
    });
});
