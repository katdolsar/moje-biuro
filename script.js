document.addEventListener("DOMContentLoaded", () => {
    
    // 1. NAWIGACJA MOBILNA
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

    // 2. AKORDEON FAQ
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector(".faq-answer");
            const isActive = faqItem.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
                const answer = item.querySelector(".faq-answer");
                if (answer) answer.style.maxHeight = null;
            });

            if (!isActive) {
                faqItem.classList.add("active");
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
            }
        });
    });

    // 3. FORMULARZ KONTAKTOWY: WALIDACJA I ASYNCHRONICZNOŚĆ
    const form = document.getElementById("dalyContactForm");
    const submitBtn = document.getElementById("submitBtn");
    
    if (form && submitBtn) {
        const btnText = submitBtn.querySelector(".btn-text");
        const btnSpinner = submitBtn.querySelector(".btn-spinner");
        const successMsg = document.getElementById("successMessage");
        const generalErrorMsg = document.getElementById("generalErrorMessage");
        const phoneInput = document.getElementById("phone");

        const validateField = (field, condition, errorMessage) => {
            const parent = field.parentElement;
            const existingError = parent.querySelector(".js-error-msg");
            if (existingError) existingError.remove();

            if (condition) {
                parent.classList.remove("invalid");
                return true;
            } else {
                parent.classList.add("invalid");
                const errorSpan = document.createElement("span");
                errorSpan.className = "js-error-msg";
                errorSpan.innerText = errorMessage;
                parent.appendChild(errorSpan);
                return false;
            }
        };

        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
        
        // Elastyczna walidacja długości samych cyfr (od 9 do 12 znaków z kierunkowym)
        const isValidPhone = (phone) => {
            const cleanPhone = phone.replace(/[^0-9]/g, "");
            return cleanPhone.length >= 9 && cleanPhone.length <= 12;
        };

        // NOWA, STABILNA MASKA TELEFONU: Przerwy po 3 znakach
        if (phoneInput) {
            phoneInput.addEventListener("input", (e) => {
                let input = e.target.value;
                const hasPlus = input.startsWith('+');
                
                // Wyciągamy same cyfry
                let digits = input.replace(/[^0-9]/g, '');
                
                // Dzielimy na grupy po 3 cyfry
                let formatted = '';
                for (let i = 0; i < digits.length; i++) {
                    if (i > 0 && i % 3 === 0) {
                        formatted += ' ';
                    }
                    formatted += digits[i];
                }
                
                // Zwracamy sformatowany tekst (z plusem lub bez)
                e.target.value = hasPlus ? '+' + formatted : formatted;
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

            const isNameValid = nameInput ? validateField(nameInput, nameInput.value.trim().length >= 3, "To pole jest wymagane (min. 3 znaki).") : true;
            const isEmailValid = emailInput ? validateField(emailInput, isValidEmail(emailInput.value.trim()), "Wprowadź poprawny adres e-mail.") : true;
            const isPhoneValid = phoneInput ? validateField(phoneInput, isValidPhone(phoneInput.value.trim()), "Wprowadź poprawny numer telefonu.") : true;
            const isMessageValid = messageInput ? validateField(messageInput, messageInput.value.trim().length >= 10, "Opisz swoje potrzeby (min. 10 znaków).") : true;

            if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) return; 

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
                } else {
                    throw new Error("Błąd serwera Formspree.");
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

    // 4. OBSŁUGA OKIENKA MODALNEGO (POLITYKA PRYWATNOŚCI)
    const privacyTrigger = document.getElementById("privacy-trigger");
    const privacyLinkForm = document.getElementById("privacy-link-form");
    const privacyModal = document.getElementById("privacy-modal");
    const privacyClose = document.getElementById("privacy-close");

    if (privacyModal && privacyClose) {
        const openModal = (e) => {
            if (e) e.preventDefault();
            privacyModal.style.display = "flex";
            setTimeout(() => {
                privacyModal.classList.add("active");
                document.body.classList.add("modal-open");
            }, 10);
        };

        const closeModal = () => {
            privacyModal.classList.remove("active");
            document.body.classList.remove("modal-open");
            setTimeout(() => {
                privacyModal.style.display = "none";
            }, 300);
        };

        if (privacyTrigger) privacyTrigger.addEventListener("click", openModal);
        if (privacyLinkForm) privacyLinkForm.addEventListener("click", openModal);
        privacyClose.addEventListener("click", closeModal);

        privacyModal.addEventListener("click", (e) => {
            if (e.target === privacyModal) closeModal();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && privacyModal.classList.contains("active")) closeModal();
        });
    }
});
