document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    const modal = document.getElementById('confirmation');
    const closeBtn = document.querySelector('.close-btn');
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        // Prevent default only for demo - in production, Formspree will handle
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const whatsapp = document.getElementById('whatsapp').value;
        
        // Simple validation
        if (!fullName || !email || !whatsapp) {
            alert('Please fill in all fields');
            return;
        }
        
        // WhatsApp number validation
        if (!/^\+?\d{7,15}$/.test(whatsapp)) {
            alert('Please enter a valid WhatsApp number with country code (e.g. +2347012345678)');
            return;
        }
        
        // Show confirmation modal
        modal.style.display = 'flex';
        
        // In production, the form would submit to Formspree
        console.log('Form would submit to Formspree with data:', {
            name: fullName,
            email: email,
            whatsapp: whatsapp
        });
        
        // Reset form
        form.reset();
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // WhatsApp input formatting
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', function(e) {
        // Remove non-numeric characters but preserve '+' for country codes
        this.value = this.value.replace(/[^\d+]/g, '');
    });
});
