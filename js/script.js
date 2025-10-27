// ===============================
// Mobile Navigation Toggle
// ===============================
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

// ===============================
// Smooth Scrolling for Navigation
// ===============================
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

// ===============================
// Floating CTA Scroll Behavior
// ===============================
const floatingCTA = document.getElementById('floatingCTA');
floatingCTA.addEventListener('click', () => {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
});

// ===============================
// Multi-step Booking Form
// ===============================
const bookingForm = document.getElementById('bookingForm');
const step1 = document.querySelector('.step-1');
const step2 = document.querySelector('.step-2');
const step3 = document.querySelector('.step-3');
const nextStep = document.getElementById('nextStep');
const nextStep2 = document.getElementById('nextStep2');
const prevStep = document.getElementById('prevStep');
const prevStep2 = document.getElementById('prevStep2');

// Validation helpers
function validateStep1() {
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';

    if (!name.value.trim()) {
        document.getElementById('nameError').textContent = 'Name is required';
        valid = false;
    }
    if (!email.value.trim() || !email.value.includes('@')) {
        document.getElementById('emailError').textContent = 'Valid email is required';
        valid = false;
    }
    return valid;
}

function validateStep2() {
    let valid = true;
    const service = document.getElementById('service');
    const date = document.getElementById('date');
    document.getElementById('serviceError').textContent = '';
    document.getElementById('dateError').textContent = '';

    if (!service.value) {
        document.getElementById('serviceError').textContent = 'Please select a service';
        valid = false;
    }
    if (!date.value) {
        document.getElementById('dateError').textContent = 'Please select a preferred date';
        valid = false;
    }
    return valid;
}

// Step navigation
if (nextStep) {
    nextStep.addEventListener('click', () => {
        if (validateStep1()) {
            step1.classList.remove('active');
            step2.classList.add('active');
        }
    });
}

if (prevStep) {
    prevStep.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
    });
}

if (nextStep2) {
    nextStep2.addEventListener('click', () => {
        if (validateStep2()) {
            step2.classList.remove('active');
            step3.classList.add('active');
        }
    });
}

if (prevStep2) {
    prevStep2.addEventListener('click', () => {
        step3.classList.remove('active');
        step2.classList.add('active');
    });
}

// Final form submission
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Get values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const message = document.getElementById('message').value.trim();

        if (!validateStep1() || !validateStep2()) return;

        let serviceName = '';
        switch(service) {
            case 'excel': serviceName = 'Microsoft Excel'; break;
            case 'sql': serviceName = 'SQL Database'; break;
            case 'python': serviceName = 'Python Programming'; break;
            case 'powerbi': serviceName = 'Power BI'; break;
            case 'complete': serviceName = 'Complete Package'; break;
        }

        alert(`Thank you, ${name}! Your booking for ${serviceName} on ${date} has been received. We will contact you at ${email} to confirm your session.`);
        bookingForm.reset();
        step3.classList.remove('active');
        step1.classList.add('active');
    });
}

// ===============================
// Scroll-triggered Animation
// ===============================
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .package-card, .booking-container, .testimonial-card');
    elements.forEach(el => {
        const position = el.getBoundingClientRect().top;
        const screen = window.innerHeight / 1.2;
        if (position < screen) {
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.service-card, .package-card, .booking-container, .testimonial-card');
    elements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    setTimeout(animateOnScroll, 100);
});

window.addEventListener('scroll', animateOnScroll);
