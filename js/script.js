// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile nav when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handling
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('#name').value;
        const email = this.querySelector('#email').value;
        const service = this.querySelector('#service').value;
        
        // Simple validation
        if (!name || !email || !service) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Prepare service name for display
        let serviceName = '';
        switch(service) {
            case 'excel':
                serviceName = 'Microsoft Excel';
                break;
            case 'sql':
                serviceName = 'SQL Database';
                break;
            case 'python':
                serviceName = 'Python Programming';
                break;
            case 'powerbi':
                serviceName = 'Power BI';
                break;
            case 'complete':
                serviceName = 'Complete Package';
                break;
        }
        
        // Here you would normally send the form data to a server
        // For this example, we'll just show an alert
        alert(`Thank you for your booking request, ${name}!\n\nWe have received your interest in our ${serviceName} service and will contact you at ${email} within 24 hours to confirm your session.`);
        this.reset();
    });
}

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .package-card, .booking-container');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.service-card, .package-card, .booking-container');
    
    elements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger initial animation check
    setTimeout(animateOnScroll, 100);
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);