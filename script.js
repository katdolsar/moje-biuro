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
    const validateField = (field, condition) => {
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

    // Walidacja formatu telefonu (akceptuje 9 cyfr, opcjonalnie z kierunkowym np. +48)
    const isValidPhone = (phone) => {
        const re = /^(?:\+\d{1,3}[\s-]?)?(\d{3}[\s-]?\d{3}[\s-]?\d{3})$/;
        return re.test(String(phone).trim());
    };

    // Dodatkowe UX: Blokowanie wpisywania liter w polu telefonu w czasie rzeczywistym
    const phoneInput = document.getElementById("phone");
    phoneInput.addEventListener("input", (e) => {
        // Zastępuje każdy znak niebędący cyfrą, plusem, spacją lub myślnikiem pustym ciągiem
        e.target.value = e.target.value.replace(/[^0-9+\s-]/g, "");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        successMsg.style.display = "none";
        generalErrorMsg.style.display = "none";

        // Pobranie pól
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");

        // Wykonanie pełnej walidacji przed wysyłką (w tym nowe pole telefonu)
        const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 3);
        const isEmailValid = validateField(emailInput, isValidEmail(emailInput.value.trim()));
        const isPhoneValid = validateField(phoneInput, isValidPhone(phoneInput.value.trim()));
        const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

        if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
            return; // Przerywamy, jeśli choć jedno pole jest błędne
        }

        // Stan ładowania i ochrona przed wielokrotnym kliknięciem
        submitBtn.disabled = true;
        btnText.style.display = "none";
        btnSpinner.style.display = "inline-block";

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                successMsg.style.display = "block";
                form.reset();

                if (typeof dataLayer !== 'undefined') {
                    dataLayer.push({
                        'event': 'form_submission_success',
                        'form_id': 'contact_form_dataly'
                    });
                }
            } else {
                throw new Error("Błąd serwera.");
            }
        } catch (error) {
            generalErrorMsg.style.display = "block";
            console.error(error);
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = "inline-block";
            btnSpinner.style.display = "none";
        }
    });

    // Usuwanie czerwonych ramek błędu w trakcie pisania
    form.querySelectorAll("input, textarea").forEach(input => {
        input.addEventListener("input", () => {
            input.parentElement.classList.remove("invalid");
        });
    });
});
