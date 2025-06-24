document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    const modal = document.getElementById('confirmation');
    const closeBtn = document.querySelector('.close-btn');
    
    // Create floating bubbles
    function createBubbles() {
        const header = document.querySelector('header');
        for (let i = 0; i < 8; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            const size = Math.random() * 60 + 20;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.top = `${Math.random() * 100}%`;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;
            header.appendChild(bubble);
        }
    }
    
    createBubbles();
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
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
        
        // Reset form
        form.reset();
        
        // Log submission (in a real scenario, you would send to Formspree)
        console.log('Form submitted:', { fullName, email, whatsapp });
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
