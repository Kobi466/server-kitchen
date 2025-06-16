// script/congthuc.js
document.addEventListener('DOMContentLoaded', function () {
    // --- Animated underline for filter with spring effect ---
    const filterBtns = document.querySelectorAll('.filter-btn-custom');
    const underline = document.querySelector('.filter-underline');

    function moveUnderline(btn) {
        const rect = btn.getBoundingClientRect();
        const parentRect = btn.parentElement.getBoundingClientRect();
        underline.style.transition = 'all 0.45s cubic-bezier(.4,1.6,.6,1)';
        underline.style.width = rect.width + 'px';
        underline.style.left = (rect.left - parentRect.left) + 'px';
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            moveUnderline(this);
            // Filter logic
            const cat = this.getAttribute('data-category');
            document.querySelectorAll('.recipe-section').forEach(sec => {
                if (cat === 'all' || sec.getAttribute('data-category') === cat) {
                    sec.style.display = '';
                } else {
                    sec.style.display = 'none';
                }
            });
        });
    });
    // Set underline on load
    const activeBtn = document.querySelector('.filter-btn-custom.active');
    if (activeBtn) moveUnderline(activeBtn);
    window.addEventListener('resize', () => {
        const activeBtn = document.querySelector('.filter-btn-custom.active');
        if (activeBtn) moveUnderline(activeBtn);
    });

    // --- Navbar scroll effect ---
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.custom-navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // --- Recipe slider logic with floating arrows ---
    // document.querySelectorAll('.slider-container').forEach(container => {
    //     const slider = container.querySelector('.recipe-slider');
    //     if (!slider) return;
    //     const cards = slider.querySelectorAll(':scope > div');
    //     const prevBtn = container.querySelector('.prev-btn');
    //     const nextBtn = container.querySelector('.next-btn');
    //     let current = 0;

    //     function getVisible() {
    //         if (window.innerWidth >= 992) return 4;
    //         if (window.innerWidth >= 768) return 2;
    //         return 1;
    //     }
    //     function getCardFullWidth() {
    //         return cards[0]?.offsetWidth || 0;
    //     }
    //     function updateSlider() {
    //         const visible = getVisible();
    //         const cardFullWidth = getCardFullWidth();
    //         const maxCurrent = Math.max(0, cards.length - visible);
    //         if (current > maxCurrent) current = maxCurrent;
    //         if (current < 0) current = 0;
    //         slider.style.transform = `translateX(-${current * cardFullWidth}px)`;
    //         prevBtn.disabled = current === 0;
    //         nextBtn.disabled = current === maxCurrent;
    //         if (cards.length <= visible) {
    //             prevBtn.style.display = 'none';
    //             nextBtn.style.display = 'none';
    //         } else {
    //             prevBtn.style.display = '';
    //             nextBtn.style.display = '';
    //         }
    //     }
    //     prevBtn.addEventListener('click', () => {
    //         const visible = getVisible();
    //         current -= visible;
    //         if (current < 0) current = 0;
    //         updateSlider();
    //     });
    //     nextBtn.addEventListener('click', () => {
    //         const visible = getVisible();
    //         current += visible;
    //         const maxCurrent = Math.max(0, cards.length - visible);
    //         if (current > maxCurrent) current = maxCurrent;
    //         updateSlider();
    //     });
    //     window.addEventListener('resize', updateSlider);
    //     updateSlider();
    //     // Floating effect for arrows
    //     [prevBtn, nextBtn].forEach(btn => {
    //         btn.style.transition = 'box-shadow 0.3s, transform 0.3s';
    //         btn.addEventListener('mouseenter', () => {
    //             btn.style.transform = 'translateY(-4px) scale(1.08)';
    //             btn.style.boxShadow = '0 8px 24px #ff914d44';
    //         });
    //         btn.addEventListener('mouseleave', () => {
    //             btn.style.transform = '';
    //             btn.style.boxShadow = '';
    //         });
    //     });
    // });

    // --- Section fade-in on scroll (staggered) ---
    const fadeSections = document.querySelectorAll('.recipe-section');
    fadeSections.forEach(sec => sec.classList.add('section-fade'));

    function revealSections() {
        fadeSections.forEach((sec, idx) => {
            const rect = sec.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                setTimeout(() => sec.classList.add('visible'), idx * 120);
            }
        });
    }

    window.addEventListener('scroll', revealSections);
    revealSections();

    // --- Card entrance animation (staggered) ---
    document.querySelectorAll('.recipe-card').forEach((card, idx) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(40px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.7s cubic-bezier(.4,1.3,.6,1), transform 0.7s cubic-bezier(.4,1.3,.6,1)';
            card.style.opacity = 1;
            card.style.transform = 'none';
        }, 400 + idx * 120);
    });

    // --- Back to Top Button ---
    if (!document.getElementById('backToTop')) {
        const btn = document.createElement('button');
        btn.id = 'backToTop';
        btn.className = 'btn btn-warning rounded-circle shadow-lg';
        btn.style.position = 'fixed';
        btn.style.bottom = '32px';
        btn.style.right = '32px';
        btn.style.zIndex = '999';
        btn.style.display = 'none';
        btn.style.width = '48px';
        btn.style.height = '48px';
        btn.innerHTML = '<i class="bi bi-arrow-up fs-4"></i>';
        document.body.appendChild(btn);
    }
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
    backToTop.onclick = function () {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };
    // --- Search Recipe Logic ---
    const searchInput = document.getElementById('searchRecipe');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            document.querySelectorAll('.recipe-card').forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});