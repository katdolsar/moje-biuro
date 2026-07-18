/**
 * Dataly - Księgowość & Automatyzacja
 * Kompleksowy skrypt obsługi interfejsu i formularza kontaktowego
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. NAWIGACJA MOBILNA (Menu Burger)
    // ==========================================
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.getElementById("nav-menu");

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Zamykanie menu po kliknięciu w dowolny link
        document.querySelectorAll(".nav-link, .btn").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // ==========================================
    // 2. AKORDEON FAQ
    // ==========================================
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains("active");

            // Zamknij wszystkie pozostałe otwarte elementy FAQ
            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
            });

            // Jeśli kliknięty nie był aktywny, otwórz go
            if (!isActive) {
                faqItem.classList.add("active");
            }
        });
    });

    // ==========================================
    // 3. OBSŁUGA I WALIDACJA FORMULARZA KONTAKTOWEGO
    // ==========================================
    const form = document.getElementById("dalyContactForm");
    const submitBtn = document.getElementById("submitBtn");
    
    // Sprawdzamy, czy formularz w ogóle znajduje się na aktualnej podstronie
    if (form && submitBtn) {
        const btnText = submitBtn.querySelector(".btn-text");
        const btnSpinner = submitBtn.querySelector(".btn-spinner");
        const successMsg = document.getElementById("successMessage");
        const generalErrorMsg = document.getElementById("generalErrorMessage");
        const phoneInput = document.getElementById("phone");

        /**
         * Funkcja pomocnicza do wizualnej walidacji pola
         */
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

        /**
         * Walidacja formatu adresu e-mail za pomocą wyrażenia regularnego
         */
        const isValidEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        /**
         * Walidacja formatu telefonu (usuwa spacje i sprawdza, czy zostało dokładnie 9 cyfr)
         */
        const isValidPhone = (phone) => {
            const cleanPhone = phone.replace(/[\s-]/g, "");
            const re = /^(?:\+\d{1,3})?(\d{9})$/;
            return re.test(cleanPhone);
        };

        // --- MASKA TELEFONU W CZASIE RZECZYWISTYM (UX Improvement) ---
        if (phoneInput) {
            phoneInput.addEventListener("input", (e) => {
                let value = e.target.value;

                // Sprawdzenie obecności plusa i odfiltrowanie samych cyfr
                const hasPlus = value.startsWith('+');
                let digits = value.replace(/[^0-9]/g, '');

                let formatted = "";
                
                if (hasPlus) {
                    // Format międzynarodowy (np. +48 123 456 789)
                    if (digits.length > 0) {
                        formatted += "+" + digits.substring(0, 2);
                        if (digits.length > 2) {
                            formatted += " " + digits.substring(2, 5);
                        }
                        if (digits.length > 5) {
                            formatted += " " + digits.substring(5, 8);
                        }
                        if (digits.length > 8) {
                            formatted += " " + digits.substring(8, 11);
                        }
                    } else {
                        formatted = "+";
                    }
                } else {
                    // Standardowy format krajowy 9-cyfrowy (np. 123 456 789)
                    if (digits.length > 0) {
                        formatted += digits.substring(0, 3);
                        if (digits.length > 3) {
                            formatted += " " + digits.substring(3, 6);
                        }
                        if (digits.length > 6) {
                            formatted += " " + digits.substring(6, 9);
                        }
                    }
                }

                // Przypisanie sformatowanej wartości z powrotem do inputa
                e.target.value = formatted;
            });
        }

        // --- ZDARZENIE WYSYŁKI FORMULARZA (SUBMIT) ---
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // Blokada domyślnego przeładowania strony

            // Ukrycie komunikatów statusu z poprzednich prób
            if (successMsg) successMsg.style.display = "none";
            if (generalErrorMsg) generalErrorMsg.style.display = "none";

            // Pobranie elementów pól formularza
            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");

            // Przeprowadzenie walidacji front-endowej
            const isNameValid = nameInput ? validateField(nameInput, nameInput.value.trim().length >= 3) : true;
            const isEmailValid = emailInput ? validateField(emailInput, isValidEmail(emailInput.value.trim())) : true;
            const isPhoneValid = phoneInput ? validateField(phoneInput, isValidPhone(phoneInput.value.trim())) : true;
            const isMessageValid = messageInput ? validateField(messageInput, messageInput.value.trim().length >= 10) : true;

            // Jeśli którekolwiek z pól nie spełnia wymogów, przerywamy wysyłanie
            if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
                return; 
            }

            // --- STAN ŁADOWANIA (Loading State) & OCHRONA PRZED DUPLIKATAMI ---
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = "none";
            if (btnSpinner) btnSpinner.style.display = "inline-block";

            // Przygotowanie danych do wysyłki (bierze pod uwagę również ukryty honeypot)
            const formData = new FormData(form);

            try {
                // Jawne wysłanie żądania POST metodą asynchroniczną fetch
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // --- POTWIERDZENIE SUKCESU ---
                    if (successMsg) successMsg.style.display = "block";
                    form.reset(); // Wyczyszczenie wszystkich pól

                    // --- REJESTROWANIE ZDARZENIA ANALITYCZNEGO ---
                    if (typeof dataLayer !== 'undefined') {
                        dataLayer.push({
                            'event': 'form_submission_success',
                            'form_id': 'contact_form_dataly'
                        });
                        console.log("Analytics: Pomyślnie zarejestrowano zdarzenie leadu.");
                    } else {
                        console.log("Analytics simulated: Brak kontenera GTM. Zdarzenie wywołane pomyślnie.");
                    }

                } else {
                    // Wyrzucenie błędu w przypadku kodu odpowiedzi innego niż 2xx
                    throw new Error("Błąd serwera podczas przetwarzania formularza.");
                }
            } catch (error) {
                // --- CZYTELNY STAN BŁĘDU ---
                if (generalErrorMsg) generalErrorMsg.style.display = "block";
                console.error("Wystąpił problem z wysyłką:", error);
            } finally {
                // Przywrócenie pierwotnego stanu przycisku (niezależnie od wyniku wysyłki)
                submitBtn.disabled = false;
                if (btnText) btnText.style.display = "inline-block";
                if (btnSpinner) btnSpinner.style.display = "none";
            }
        });

        // Nasłuchiwanie zmian na polach tekstowych, aby usuwać klasę błędu podczas poprawiania tekstu
        form.querySelectorAll("input, textarea").forEach(input => {
            input.addEventListener("input", () => {
                input.parentElement.classList.remove("invalid");
            });
        });
    }
});
