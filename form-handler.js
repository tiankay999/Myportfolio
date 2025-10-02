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
        
        // Form submission handler
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Reset previous errors and messages
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            formMessage.textContent = '';
            formMessage.className = 'form-message';
            
            // Show loading state
            submitText.textContent = 'Sending...';
            spinner.style.display = 'block';
            submitButton.disabled = true;
            
            try {
                const formData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    message: messageTextarea.value.trim()
                };
                
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    // Handle validation errors
                    if (data.errors) {
                        data.errors.forEach(error => {
                            const errorField = document.getElementById(`${error.param}-error`);
                            if (errorField) {
                                errorField.textContent = error.msg;
                            }
                        });
                        throw new Error('Validation failed');
                    }
                    throw new Error(data.error || 'Failed to send message');
                }
                
                // Show success message
                formMessage.textContent = 'Message sent successfully!';
                formMessage.className = 'form-message success';
                contactForm.reset();
                
            } catch (error) {
                console.error('Error:', error);
                formMessage.textContent = error.message || 'Failed to send message. Please try again.';
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
