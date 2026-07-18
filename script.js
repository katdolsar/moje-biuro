document.addEventListener('DOMContentLoaded', () => {

    // --- 1. OBSŁUGA MENU MOBILNEGO (Dostępność i Semantyka) ---
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            
            // Przełączanie stanów dostępności dla czytników ekranu
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Automatyczne zamykanie menu mobilnego po kliknięciu w dowolny odnośnik
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 2. OBSŁUGA FORMULARZA KONTAKTOWEGO (Lead Capture z komunikatami) ---
    const form = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Zatrzymujemy odświeżenie strony

            const submitBtn = form.querySelector('button[type="submit"]');
            
            // Stan ładowania (Visual Loading State)
            submitBtn.disabled = true;
            submitBtn.innerText = "Wysyłanie zgłoszenia...";
            formAlert.style.display = "none";

            // Pobieramy dane z formularza
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            // [PRODUKCJA]: Tutaj w przyszłości podepniesz API lub platformę typu Formspree / Webhook CRM
            // Symulacja wysyłania zapytania do bazy danych (np. 1.2 sekundy)
            setTimeout(() => {
                // Załóżmy, że wysyłka zakończyła się sukcesem
                const success = true; 

                if (success) {
                    formAlert.className = "form-alert success";
                    formAlert.innerText = "Dziękujemy! Otrzymaliśmy Twoje zapytanie. Odpowiemy ze wstępną wyceną w ciągu 1 dnia roboczego.";
                    formAlert.style.display = "block";
                    
                    // Resetowanie pól formularza po udanej wysyłce
                    form.reset();
                } else {
                    // W razie błędu serwera
                    formAlert.className = "form-alert error";
                    formAlert.innerText = "Wystąpił problem z wysyłką formularza. Spróbuj ponownie lub napisz na kontakt@dataly.pl";
                    formAlert.style.display = "block";
                }

                // Przywrócenie pierwotnego stanu przycisku
                submitBtn.disabled = false;
                submitBtn.innerText = "Wyślij zapytanie ofertowe";

            }, 1200);
        });
    }
});
