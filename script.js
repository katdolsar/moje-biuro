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

        const isValidEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        const isValidPhone = (phone) => {
            const cleanPhone = phone.replace(/[\s-]/g, "");
            const re = /^(?:\+\d{1,3})?(\d{9})$/;
            return re.test(cleanPhone);
        };

        // --- DYNAMICZNE FORMATOWANIE TELEFONU (Maska UX) ---
        if (phoneInput) {
            phoneInput.addEventListener("input", (e) => {
                let value = e.target.value;
                const hasPlus = value.startsWith('+');
                let digits = value.replace(/[^0-9]/g, '');
                let formatted = "";
                
                if (hasPlus) {
                    if (digits.length > 0) {
                        formatted += "+" + digits.substring(0, 2);
                        if (digits.length > 2) formatted += " " + digits.substring(2, 5);
                        if (digits.length > 5) formatted += " " + digits.substring(5, 8);
                        if (digits.length > 8) formatted += " " + digits.substring(8, 11);
                    } else {
                        formatted = "+";
                    }
                } else {
                    if (digits.length > 0) {
                        formatted += digits.substring(0, 3);
                        if (digits.length > 3) formatted += " " + digits.substring(3, 6);
                        if (digits.length > 6) formatted += " " + digits.substring(6, 9);
                    }
                }
                e.target.value = formatted;
            });
        }

        // --- ZDARZENIE WYSYŁKI (POST AJAX) ---
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (successMsg) successMsg.style.display = "none";
            if (generalErrorMsg) generalErrorMsg.style.display = "none";

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");

            const isNameValid = nameInput ? validateField(nameInput, nameInput.value.trim().length >= 3) : true;
            const isEmailValid = emailInput ? validateField(emailInput, isValidEmail(emailInput.value.trim())) : true;
            const isPhoneValid = phoneInput ? validateField(phoneInput, isValidPhone(phoneInput.value.trim())) : true;
            const isMessageValid = messageInput ? validateField(messageInput, messageInput.value.trim().length >= 10) : true;

            if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
                return; 
            }

            // Blokada ponownego wysłania (Duplicate submission prevention)
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

                    // Wywołanie zdarzenia analitycznego po faktycznym sukcesie
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

        form.querySelectorAll("input, textarea").forEach(input => {
            input.addEventListener("input", () => {
                input.parentElement.classList.remove("invalid");
            });
        });
    }
});
