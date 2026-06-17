// Exemplo simples: mensagem de boas-vindas no console
document.addEventListener("DOMContentLoaded", () => {
    console.log("Site da Tatu e a Toca carregado com sucesso!");
    
    // Destaca o link da página atual no menu
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop();
        
        if (linkPage === currentPage || (currentPage === '' && href.includes('index'))) {
            link.classList.add('active');
        }
    });
});
