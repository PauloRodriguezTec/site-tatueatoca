// Inicializar EmailJS quando a página estiver carregada
// NOTA: A chave pública do EmailJS é visível no front-end por design do EmailJS.
// Veja instruções em: https://www.emailjs.com/docs/tutorial/creating-contact-form/
document.addEventListener("DOMContentLoaded", () => {
    if (typeof emailjs === "undefined") {
        console.error("EmailJS não foi carregado. Verifique o script do CDN.");
        return;
    }

    const PUBLIC_KEY = "GrdDkNnVxV0Ly7zeF"; // Coloque sua chave pública aqui
    emailjs.init(PUBLIC_KEY);

    const contactForm = document.getElementById("contactForm");
    const statusMessage = document.getElementById("statusMessage");
    const submitBtn = document.querySelector(".submit-btn");

    if (!contactForm || !statusMessage || !submitBtn) {
        console.error("Elementos do formulário de contato não foram encontrados no DOM.");
        return;
    }

    // Melhora de acessibilidade: anúncios de status
    try {
        statusMessage.setAttribute("role", "status");
        statusMessage.setAttribute("aria-live", "polite");
    } catch (err) {
        // Elemento pode não suportar atributos, mas seguimos em frente
    }

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailEl = document.getElementById("email");
        const messageEl = document.getElementById("message");
        const email = (emailEl && emailEl.value || "").trim();
        const message = (messageEl && messageEl.value || "").trim();

        // Validação básica
        const emailPattern = /^\S+@\S+\.\S+$/;
        if (!email) {
            statusMessage.textContent = "Por favor, informe um e‑mail.";
            statusMessage.className = "error";
            emailEl && emailEl.focus();
            return;
        }
        if (!emailPattern.test(email)) {
            statusMessage.textContent = "Por favor, informe um e‑mail válido.";
            statusMessage.className = "error";
            emailEl && emailEl.focus();
            return;
        }
        if (!message) {
            statusMessage.textContent = "Por favor, escreva uma mensagem.";
            statusMessage.className = "error";
            messageEl && messageEl.focus();
            return;
        }

        submitBtn.disabled = true;
        statusMessage.textContent = "Enviando...";
        statusMessage.className = "";

        try {
            await emailjs.send("service_tatueatoca", "template_contact", {
                user_email: email,
                message: message,
                to_email: "tatueatoca@gmail.com"
            });

            statusMessage.textContent = "✓ Sua mensagem foi enviada! Em breve entraremos em contato.";
            statusMessage.className = "success";
            contactForm.reset();

            setTimeout(() => {
                statusMessage.textContent = "";
                statusMessage.className = "";
            }, 5000);
        } catch (error) {
            console.error("Erro ao enviar mensagem via EmailJS:", error);
            statusMessage.textContent = "✗ Erro ao enviar. Tente novamente mais tarde.";
            statusMessage.className = "error";
        } finally {
            submitBtn.disabled = false;
        }
    });
});
