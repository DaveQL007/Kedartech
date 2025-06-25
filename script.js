document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    const modal = document.getElementById('confirmation');
    const closeBtns = document.querySelectorAll('.close-btn');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const dashboardToggle = document.getElementById('dashboardToggle');
    const dashboard = document.getElementById('dashboard');
    const registrationsContainer = document.getElementById('registrations-container');
    const exportBtn = document.getElementById('export-btn');
    const limitedText = document.querySelector('.limited');
    
    // Track submissions in localStorage
    const submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
    
    // Update remaining spots display
    updateRemainingSpots();
    
    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        
        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        formStatus.style.display = 'none';
        
        // Simple validation
        let valid = true;
        
        if (!fullName) {
            document.getElementById('name-error').textContent = 'Full name is required';
            document.getElementById('name-error').style.display = 'block';
            valid = false;
        }
        
        if (!email) {
            document.getElementById('email-error').textContent = 'Email is required';
            document.getElementById('email-error').style.display = 'block';
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email-error').textContent = 'Invalid email format';
            document.getElementById('email-error').style.display = 'block';
            valid = false;
        }
        
        if (!whatsapp) {
            document.getElementById('whatsapp-error').textContent = 'WhatsApp number is required';
            document.getElementById('whatsapp-error').style.display = 'block';
            valid = false;
        } else if (!/^\+?\d{7,15}$/.test(whatsapp)) {
            document.getElementById('whatsapp-error').textContent = 'Invalid WhatsApp format';
            document.getElementById('whatsapp-error').style.display = 'block';
            valid = false;
        }
        
        if (!valid) return;
        
        // Check for duplicate submissions
        const isDuplicate = submissions.some(sub => 
            sub.email === email || sub.whatsapp === whatsapp
        );
        
        if (isDuplicate) {
            formStatus.textContent = 'You have already registered with this email or WhatsApp number.';
            formStatus.className = 'form-status warning';
            formStatus.style.display = 'block';
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Processing...';
        
        try {
            // Submit to Formspree
            const formData = new FormData(form);
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success modal
                modal.style.display = 'flex';
                
                // Store submission in localStorage
                submissions.push({ 
                    name: fullName, 
                    email, 
                    whatsapp,
                    date: new Date().toLocaleString()
                });
                localStorage.setItem('formSubmissions', JSON.stringify(submissions));
                
                // Update remaining spots
                updateRemainingSpots();
                
                // Reset form
                form.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    formStatus.textContent = data.errors.map(error => error.message).join(", ");
                } else {
                    formStatus.textContent = 'There was an error submitting your form. Please try again.';
                }
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            }
        } catch (error) {
            formStatus.textContent = 'Network error. Please check your connection and try again.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Submit Interest';
        }
    });
    
    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'none';
            dashboard.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside content
    window.addEventListener('click', function(e) {
        if (e.target === modal || e.target === dashboard) {
            modal.style.display = 'none';
            dashboard.style.display = 'none';
        }
    });
    
    // WhatsApp input formatting
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', function(e) {
        // Remove non-numeric characters but preserve '+' for country codes
        this.value = this.value.replace(/[^\d+]/g, '');
    });
    
    // Dashboard toggle
    dashboardToggle.addEventListener('click', function() {
        dashboard.style.display = 'flex';
        loadRegistrations();
    });
    
    // Export button
    exportBtn.addEventListener('click', function() {
        exportToExcel();
    });
    
    // Update remaining spots
    function updateRemainingSpots() {
        const remaining = Math.max(0, 50 - submissions.length);
        limitedText.textContent = `Only ${remaining} spots remaining - Sign up today!`;
    }
    
    // Load registrations
    function loadRegistrations() {
        if (submissions.length === 0) {
            registrationsContainer.innerHTML = '<p>No registrations yet</p>';
            return;
        }
        
        let html = `
            <div class="registrations-header">
                <p>Total Registrations: ${submissions.length}</p>
            </div>
            <div class="registrations-list">
        `;
        
        submissions.forEach((sub, index) => {
            html += `
                <div class="registration-item">
                    <div class="reg-number">${index + 1}</div>
                    <div class="reg-details">
                        <p><strong>${sub.name}</strong></p>
                        <p>${sub.email}</p>
                        <p>${sub.whatsapp}</p>
                        <p class="reg-date">${sub.date}</p>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        registrationsContainer.innerHTML = html;
    }
    
    // Export to Excel
    function exportToExcel() {
        if (submissions.length === 0) {
            alert('No registrations to export');
            return;
        }
        
        let csv = 'Name,Email,WhatsApp,Date\n';
        submissions.forEach(sub => {
            csv += `"${sub.name}","${sub.email}","${sub.whatsapp}","${sub.date}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'excel-masterclass-registrations.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
