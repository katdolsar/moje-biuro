document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INTERAKTYWNE MENU MOBILNE ---
    const mobileMenu = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('#nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Zamknij menu po kliknięciu w dowolny link (przydatne przy One-Page)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // --- 2. AKORDEON FAQ (ZWIJANIE / ROZWIJANIE Z ANIMACJĄ) ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            const answer = this.nextElementSibling;

            // Sprawdzamy czy ten element jest już aktywny
            const isActive = item.classList.contains('active');

            // Opcjonalnie: Zwiń wszystkie inne otwarte elementy (efekt pojedynczego otwarcia)
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Jeśli element nie był aktywny – otwórz go
            if (!isActive) {
                item.classList.add('active');
                // Dynamicznie obliczamy wysokość zawartości dla płynnego CSS transition
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});
