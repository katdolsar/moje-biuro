document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. NAWIGACJA MOBILNA
    // ==========================================
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.getElementById("nav-menu");

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener("click", () => {
            mobileMenu.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".nav-link, .btn").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

   // ==========================================
    // 2. AKORDEON FAQ (Zoptymalizowany i płynny)
    // ==========================================
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector(".faq-answer");
            const isActive = faqItem.classList.contains("active");

            // 1. Zamknij wszystkie pozostałe otwarte elementy FAQ i zresetuj ich wysokość
            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
                const answer = item.querySelector(".faq-answer");
                if (answer) {
                    answer.style.maxHeight = null;
                }
            });

            // 2. Jeśli kliknięty element nie był aktywny, otwórz go i oblicz jego wysokość
            if (!isActive) {
                faqItem.classList.add("active");
                // Dynamicznie ustawiamy wysokość na podstawie rzeczywistej zawartości tekstu
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // 3. FORMULARZ KONTAKTOWY: WALIDACJA I ASYNCHRONICZNOŚĆ
    // ==========================================
    const form = document.getElementById("dalyContactForm");
    const submitBtn = document.getElementById("submitBtn");
    
    if (form && submitBtn) {
        const btnText = submitBtn.querySelector(".btn-text");
        const btnSpinner = submitBtn.querySelector(".btn-spinner");
        const successMsg = document.getElementById("successMessage");
        const generalErrorMsg = document.getElementById("generalErrorMessage");
        const phoneInput = document.getElementById("phone");

        // Dynamiczne zarządzanie błędami z poziomu JS
        const validateField = (field, condition, errorMessage) => {
            const parent = field.parentElement;
            
            // Usuń stary komunikat błędu, jeśli istnieje
            const existingError = parent.querySelector(".js-error-msg");
            if (existingError) {
                existingError.remove();
            }

            if (condition) {
                parent.classList.remove("invalid");
                return true;
            } else {
                parent.classList.add("invalid");
                
                // Tworzymy element błędu w locie przez JS
                const errorSpan = document.createElement("span");
                errorSpan.className = "js-error-msg";
                errorSpan.innerText = errorMessage;
                
                parent.appendChild(errorSpan);
                return false;
            }
        };

        const isValidEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        const isValidPhone = (phone) => {
            const cleanPhone = phone.replace(/[\s-]/g, "");
            const re = /^(?:\+\d{1,3})?(\d{9})$/;
            return re.test(cleanPhone);
        };

        // Maska UX telefonu - automatyczne przerwy po 3 znakach
        if (phoneInput) {
            phoneInput.addEventListener("input", (e) => {
                let value = e.target.value;
                const hasPlus = value.startsWith('+');
                
                // Usuwamy wszystko, co nie jest cyfrą
                let digits = value.replace(/[^0-9]/g, '');
                
                // Dzielimy ciąg cyfr na grupy po maksymalnie 3 znaki
                let chunks = digits.match(/.{1,3}/g);
                let formatted = chunks ? chunks.join(' ') : '';
                
                // Jeśli użytkownik wpisał plus na początku, zachowujemy go
                if (hasPlus) {
                    e.target.value = '+' + formatted;
                } else {
                    e.target.value = formatted;
                }
            });
        }

        // Obsługa wysyłki
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (successMsg) successMsg.style.display = "none";
            if (generalErrorMsg) generalErrorMsg.style.display = "none";

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");

            // Tutaj definiujemy treści komunikatów błędów w JS
            const isNameValid = nameInput ? validateField(nameInput, nameInput.value.trim().length >= 3, "To pole jest wymagane (min. 3 znaki).") : true;
            const isEmailValid = emailInput ? validateField(emailInput, isValidEmail(emailInput.value.trim()), "Wprowadź poprawny adres e-mail.") : true;
            const isPhoneValid = phoneInput ? validateField(phoneInput, isValidPhone(phoneInput.value.trim()), "Wprowadź poprawny 9-cyfrowy numer.") : true;
            const isMessageValid = messageInput ? validateField(messageInput, messageInput.value.trim().length >= 10, "Opisz pokrótce swoje potrzeby (min. 10 znaków).") : true;

            if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
                return; 
            }

            submitBtn.disabled = true;
            if (btnText) btnText.style.display = "none";
            if (btnSpinner) btnSpinner.style.display = "inline-block";

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (successMsg) successMsg.style.display = "block";
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
                if (generalErrorMsg) generalErrorMsg.style.display = "block";
                console.error(error);
            } finally {
                submitBtn.disabled = false;
                if (btnText) btnText.style.display = "inline-block";
                if (btnSpinner) btnSpinner.style.display = "none";
            }
        });

        // Czyszczenie błędów podczas pisania
        form.querySelectorAll("input, textarea").forEach(input => {
            input.addEventListener("input", () => {
                input.parentElement.classList.remove("invalid");
                const err = input.parentElement.querySelector(".js-error-msg");
                if (err) err.remove();
            });
        });
    }
// ==========================================
    // 4. OBSŁUGA OKIENKA MODALNEGO (POLITYKA PRYWATNOŚCI)
    // ==========================================
    const privacyTrigger = document.getElementById("privacy-trigger"); // Link w stopce
    const privacyLinkForm = document.getElementById("privacy-link-form"); // NOWOŚĆ: Link nad przyciskiem
    const privacyModal = document.getElementById("privacy-modal");
    const privacyClose = document.getElementById("privacy-close");

    if (privacyModal && privacyClose) {
        
        // Funkcja otwierająca okienko
        const openModal = (e) => {
            if (e) e.preventDefault(); // Blokujemy domyślne skakanie strony
            privacyModal.style.display = "flex";
            setTimeout(() => {
                privacyModal.classList.add("active");
                document.body.classList.add("modal-open");
            }, 10);
        };

        // Funkcja zamykająca okienko
        const closeModal = () => {
            privacyModal.classList.remove("active");
            document.body.classList.remove("modal-open");
            setTimeout(() => {
                privacyModal.style.display = "none";
            }, 300);
        };

        // Nasłuchiwanie zdarzeń - teraz oba linki otwierają okno!
        if (privacyTrigger) privacyTrigger.addEventListener("click", openModal);
        if (privacyLinkForm) privacyLinkForm.addEventListener("click", openModal);
        
        privacyClose.addEventListener("click", closeModal);

        // Zamknięcie po kliknięciu w tło poza okienkiem
        privacyModal.addEventListener("click", (e) => {
            if (e.target === privacyModal) {
                closeModal();
            }
        });

        // Zamknięcie za pomocą klawisza ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && privacyModal.classList.contains("active")) {
                closeModal();
            }
        });
    }
