document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.id = 'contactForm';
        
        // Add IDs and names to form elements
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const phoneInput = contactForm.querySelector('input[type="tel"]');
        const messageTextarea = contactForm.querySelector('textarea');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // Update form elements with proper attributes
        nameInput.id = 'name';
        nameInput.name = 'name';
        nameInput.required = true;
        
        emailInput.id = 'email';
        emailInput.name = 'email';
        emailInput.required = true;
        
        phoneInput.id = 'phone';
        phoneInput.name = 'phone';
        
        messageTextarea.id = 'message';
        messageTextarea.name = 'message';
        messageTextarea.required = true;
        
        // Create error message containers
        const nameError = document.createElement('div');
        nameError.className = 'error-message';
        nameError.id = 'name-error';
        nameInput.parentNode.insertBefore(nameError, nameInput.nextSibling);
        
        const emailError = document.createElement('div');
        emailError.className = 'error-message';
        emailError.id = 'email-error';
        emailInput.parentNode.insertBefore(emailError, emailInput.nextSibling);
        
        const messageError = document.createElement('div');
        messageError.className = 'error-message';
        messageError.id = 'message-error';
        messageTextarea.parentNode.insertBefore(messageError, messageTextarea.nextSibling);
        
        // Create form message container
        const formMessage = document.createElement('div');
        formMessage.id = 'form-message';
        formMessage.className = 'form-message';
        contactForm.appendChild(formMessage);
        
        // Add loading state to submit button
        const submitText = document.createElement('span');
        submitText.id = 'submitText';
        submitText.innerHTML = '<i class="uil uil-navigator button-icon"></i>Send Message';
        
        const spinner = document.createElement('div');
        spinner.id = 'spinner';
        spinner.className = 'spinner';
        spinner.style.display = 'none';
        
        submitButton.innerHTML = '';
        submitButton.appendChild(submitText);
        submitButton.appendChild(spinner);
        
        // Form submission handler with Formspree
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Reset previous errors and messages
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            formMessage.textContent = '';
            formMessage.className = 'form-message';
            
            // Validate form
            let hasErrors = false;
            
            if (!nameInput.value.trim()) {
                nameError.textContent = 'Name is required';
                hasErrors = true;
            }
            
            if (!emailInput.value.trim()) {
                emailError.textContent = 'Email is required';
                hasErrors = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                emailError.textContent = 'Please enter a valid email';
                hasErrors = true;
            }
            
            if (!messageTextarea.value.trim()) {
                messageError.textContent = 'Message is required';
                hasErrors = true;
            }
            
            if (hasErrors) return;
            
            // Show loading state
            submitText.textContent = 'Sending...';
            spinner.style.display = 'block';
            submitButton.disabled = true;
            
            try {
                // Formspree endpoint - Replace YOUR_FORM_ID with your actual Formspree form ID
                const formspreeUrl = 'https://formspree.io/f/mzzjgyep';
                
                const formData = new FormData();
                formData.append('name', nameInput.value.trim());
                formData.append('email', emailInput.value.trim());
                formData.append('phone', phoneInput.value.trim());
                formData.append('message', messageTextarea.value.trim());

                const response = await fetch(formspreeUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    formMessage.textContent = 'Message sent successfully! We\'ll get back to you soon.';
                    formMessage.className = 'form-message success';
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
                
            } catch (error) {
                console.error('Error:', error);
                formMessage.textContent = 'Failed to send message. Please try again.';
                formMessage.className = 'form-message error';
            } finally {
                // Reset button state
                submitText.innerHTML = '<i class="uil uil-navigator button-icon"></i>Send Message';
                spinner.style.display = 'none';
                submitButton.disabled = false;
            }
        });
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                color: #ff4444;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                min-height: 1rem;
            }
            .form-message {
                margin-top: 1rem;
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
                display: none;
            }
            .form-message:not(:empty) {
                display: block;
            }
            .form-message.success {
                background-color: #4CAF50;
                color: white;
            }
            .form-message.error {
                background-color: #ff4444;
                color: white;
            }
            .spinner {
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
                margin-left: 10px;
                display: inline-block;
                vertical-align: middle;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
});
