// ==============================
// Mobile Navigation Toggle
// ==============================
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

// ==============================
// Smooth Scrolling
// ==============================
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

// ==============================
// Animate Elements on Scroll
// ==============================
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

// Initialize animation for elements
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.service-card, .package-card, .booking-container');
    elements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    setTimeout(animateOnScroll, 100);
});

window.addEventListener('scroll', animateOnScroll);

// ==============================
// Multi-Step Booking Form
// ==============================
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    const steps = Array.from(bookingForm.querySelectorAll('.form-step'));
    const nextBtns = bookingForm.querySelectorAll('.btn-next');
    const prevBtns = bookingForm.querySelectorAll('.btn-prev');
    const stepIndicators = bookingForm.querySelectorAll('.step');
    const successStep = bookingForm.querySelector('.form-step-success');

    let currentStep = 0;
    showStep(currentStep);

    function showStep(stepIndex) {
        steps.forEach((step, i) => {
            step.classList.remove('form-step-active');
            if (i === stepIndex) step.classList.add('form-step-active');
        });
        stepIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i <= stepIndex);
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!validateStep(currentStep)) return;
            currentStep++;
            if (currentStep >= steps.length) {
                showSuccess();
                return;
            }
            showStep(currentStep);
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            if (currentStep < 0) currentStep = 0;
            showStep(currentStep);
        });
    });

    function validateStep(stepIndex) {
        const step = steps[stepIndex];
        const inputs = step.querySelectorAll('input, select, textarea');
        let valid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value) {
                input.classList.add('invalid');
                valid = false;
            } else {
                input.classList.remove('invalid');
            }
        });
        return valid;
    }

    function showSuccess() {
        steps.forEach(step => step.style.display = 'none');
        successStep.style.display = 'block';
        successStep.style.opacity = 1;
        bookingForm.reset();
        currentStep = 0;
        stepIndicators.forEach(indicator => indicator.classList.remove('active'));
    }
}

// ==============================
// Booking Form Submission (Optional Email Alert)
// ==============================
bookingForm && bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // You can integrate real email sending here using server/API
    alert("Thank you! Your booking request has been received. We'll contact you shortly at info.kidatechhub.work");
});

// ==============================
// Booking Form Hover Animation Fix
// ==============================
const bookNowButtons = document.querySelectorAll('.btn');
bookNowButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
});
