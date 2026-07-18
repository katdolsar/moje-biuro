document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. OBSŁUGA MENU MOBILNEGO (Dostępność / ARIA) ---
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            
            // Przełącz stan przycisku i menu
            menuBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Zmiana klasy pomocniczej przycisku (animacja linii)
            menuBtn.classList.toggle('open');
        });

        // Zamknij menu po kliknięciu w dowolny link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                menuBtn.classList.remove('open');
            });
        });
    }

    // --- 2. PROFESJONALNA OBSŁUGA FORMULARZA ---
    const form = document.getElementById('leadForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Zatrzymujemy odświeżanie strony

            // A. Honeypot check - Jeśli bot uzupełnił to pole, cicho przerywamy działanie
            const honeypot = form.querySelector('input[name="_honey_validate"]').value;
            if (honeypot) {
                console.warn("Spam detected.");
                return;
            }

            // B. Pobranie przycisku i ustawienie stanu ładowania (Loading State)
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Wysyłanie zgłoszenia...";
            
            formStatus.style.display = "none";

            // C. Przygotowanie danych do wysyłki
            const data = new FormData(form);
            
            // !!! KROK DLA CIEBIE: Gdy założysz darmowe konto na Formspree.io, wklej tutaj wygenerowany link URL !!!
            const endpoint = "https://formspree.io/f/placeholder_id"; 

            try {
                // Jeśli nie podpięto prawdziwego Formspree, symulujemy działanie w celach testowych
                if (endpoint.includes("placeholder_id")) {
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Udawanie zapytania sieciowego
                    showStatus("success", "Dziękujemy! Otrzymaliśmy Twoją wiadomość. Odpowiemy ze wstępną wyceną w ciągu 1 dnia roboczego.");
                    form.reset();
                    return;
                }

                // Prawdziwe zapytanie produkcyjne
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showStatus("success", "Dziękujemy! Otrzymaliśmy Twoją wiadomość. Odpowiemy ze wstępną wyceną w ciągu 1 dnia roboczego.");
                    form.reset();
                } else {
                    throw new Error("Server response error");
                }

            } catch (error) {
                showStatus("error", "Wystąpił problem z wysłaniem formularza. Prosimy o kontakt bezpośredni na adres: kontakt@dataly.pl");
            } finally {
                // Przywrócenie stanu przycisku
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    }

    // Funkcja pomocnicza do ładnego renderowania statusu
    function showStatus(type, text) {
        formStatus.style.display = "block";
        formStatus.className = `form-status ${type}`;
        formStatus.innerText = text;
    }
});