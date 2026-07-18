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
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("dalyContactForm");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnSpinner = submitBtn.querySelector(".btn-spinner");
    const successMsg = document.getElementById("successMessage");
    const generalErrorMsg = document.getElementById("generalErrorMessage");

    // Funkcja walidacji pojedynczego pola
    const validateField = (field, errorId, condition) => {
        const parent = field.parentElement;
        if (condition) {
            parent.classList.remove("invalid");
            return true;
        } else {
            parent.classList.add("invalid");
            return false;
        }
    };

    // Walidacja formatu e-mail
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Blokada domyślnego przeładowania strony

        // Ukryj poprzednie komunikaty
        successMsg.style.display = "none";
        generalErrorMsg.style.display = "none";

        // Pobranie pól
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");

        // Wykonanie pełnej walidacji przed wysyłką
        const isNameValid = validateField(nameInput, "nameError", nameInput.value.trim().length >= 3);
        const isEmailValid = validateField(emailInput, "emailError", isValidEmail(emailInput.value.trim()));
        const isMessageValid = validateField(messageInput, "messageError", messageInput.value.trim().length >= 10);

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            return; // Jeśli walidacja nie przejdzie, przerywamy wysyłanie
        }

        // --- STAN ŁADOWANIA (Loading State) & OCHRONA PRZED DUPLIKATAMI ---
        submitBtn.disabled = true;
        btnText.style.display = "none";
        btnSpinner.style.display = "inline-block";

        const formData = new FormData(form);

        try {
            // Jawne przesyłanie żądaniem POST asynchronicznie
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // --- POTWIERDZENIE SUKCESU ---
                successMsg.style.display = "block";
                form.reset(); // Czyszczenie pól formularza

                // --- REJESTROWANIE ZDARZENIA ANALITYCZNEGO ---
                // Sprawdzamy czy Google Analytics (dataLayer) istnieje na stronie
                if (typeof dataLayer !== 'undefined') {
                    dataLayer.push({
                        'event': 'form_submission_success',
                        'form_id': 'contact_form_dataly'
                    });
                    console.log("Analytics Event: Formularz wysłany pomyślnie.");
                } else {
                    console.log("Zdarzenie analityczne zasymulowane (brak GTM na stronie).");
                }

            } else {
                // Obsługa błędu serwera (np. limit żądań)
                throw new Error("Błąd serwera podczas przetwarzania żądania.");
            }
        } catch (error) {
            // --- CZYTELNY STAN BŁĘDU ---
            generalErrorMsg.style.display = "block";
            console.error("Błąd wysyłania formularza:", error);
        } finally {
            // Przywrócenie pierwotnego stanu przycisku
            submitBtn.disabled = false;
            btnText.style.display = "inline-block";
            btnSpinner.style.display = "none";
        }
    });

    // Usuwanie czerwonych ramek błędu w trakcie pisania (real-time UX)
    form.querySelectorAll("input, textarea").forEach(input => {
        input.addEventListener("input", () => {
            input.parentElement.classList.remove("invalid");
        });
    });
});
