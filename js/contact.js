// Inicializar EmailJS quando a página estiver carregada
// IMPORTANTE: Substitua 'YOUR_PUBLIC_KEY' pela sua chave pública do EmailJS
// Veja instruções em: https://www.emailjs.com/docs/tutorial/creating-contact-form/
document.addEventListener("DOMContentLoaded", () => {
    if (typeof emailjs === "undefined") {
        console.error("EmailJS não foi carregado. Verifique o script do CDN.");
        return;
    }

    emailjs.init("YGrdDkNnVxV0Ly7zeF");

    const contactForm = document.getElementById("contactForm");
    const statusMessage = document.getElementById("statusMessage");
    const submitBtn = document.querySelector(".submit-btn");

    if (!contactForm || !statusMessage || !submitBtn) {
        console.error("Elementos do formulário de contato não foram encontrados no DOM.");
        return;
    }

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        submitBtn.disabled = true;
        statusMessage.textContent = "Enviando...";
        statusMessage.className = "";

        emailjs.send("service_tatueatoca", "template_contact", {
            user_email: email,
            message: message,
            to_email: "tatueatoca@gmail.com"
        }).then(
            () => {
                statusMessage.textContent = "✓ Email enviado com sucesso!";
                statusMessage.className = "success";
                contactForm.reset();
                submitBtn.disabled = false;

                setTimeout(() => {
                    statusMessage.textContent = "";
                }, 5000);
            },
            (error) => {
                console.error("Erro ao enviar:", error);
                statusMessage.textContent = "✗ Erro ao enviar. Tente novamente.";
                statusMessage.className = "error";
                submitBtn.disabled = false;
            }
        );
    });
});
