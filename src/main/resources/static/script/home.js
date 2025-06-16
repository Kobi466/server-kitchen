// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.custom-navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
});
// Simple testimonial carousel logic
const testimonials = document.querySelectorAll('.testimonial-item');
let currentTestimonial = 0;
document.getElementById('nextTestimonial').onclick = function () {
    testimonials[currentTestimonial].classList.add('d-none');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    testimonials[currentTestimonial].classList.remove('d-none');
};

// Reveal-on-scroll for sections
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        for (const el of reveals) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.classList.add('visible');
            }
        }
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});