// Enhanced Carousel Functionality
class ProductCarousel {
    constructor() {
        this.currentSlide = 0;
        this.products = document.querySelectorAll('.product-item');
        this.track = document.querySelector('.products-track');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.dotsContainer = document.querySelector('.carousel-dots');
        
        this.autoSlideInterval = null;
        this.isTransitioning = false;
        this.itemsPerView = this.getItemsPerView();
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.updateCarousel();
        this.setupEventListeners();
        this.startAutoSlide();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.itemsPerView = this.getItemsPerView();
            this.updateCarousel();
            this.createDots();
        });
    }
    
    getItemsPerView() {
        const width = window.innerWidth;
        if (width < 576) return 1;
        if (width < 768) return 2;
        if (width < 992) return 3;
        return 4;
    }
    
    createDots() {
        const totalSlides = Math.ceil(this.products.length / this.itemsPerView);
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
            });
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateCarousel() {
        if (this.isTransitioning) return;
        
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        const itemWidth = this.products[0].offsetWidth + 32; // 32px is the gap
        const translateX = -this.currentSlide * itemWidth * this.itemsPerView;
        
        this.track.style.transform = `translateX(${translateX}px)`;
    }
    
    goToSlide(index) {
        if (this.isTransitioning) return;
        
        const maxSlide = Math.ceil(this.products.length / this.itemsPerView) - 1;
        
        if (index < 0) {
            this.currentSlide = maxSlide;
        } else if (index > maxSlide) {
            this.currentSlide = 0;
        } else {
            this.currentSlide = index;
        }
        
        this.updateCarousel();
    }
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.stopAutoSlide();
            setTimeout(() => this.startAutoSlide(), 2000);
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.stopAutoSlide();
            setTimeout(() => this.startAutoSlide(), 2000);
        });
        
        // Pause auto slide on hover
        this.track.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });
        
        this.track.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
        
        // Touch/swipe support
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            this.stopAutoSlide();
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = Math.abs(startY - endY);
            
            // Only swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            setTimeout(() => this.startAutoSlide(), 2000);
        }, { passive: true });
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.menuOverlay = document.querySelector('.menu-overlay');
        
        this.init();
    }
    
    init() {
        this.setupScrollHandler();
        this.setupNavigation();
        this.setupMobileMenu();
    }
    
    setupScrollHandler() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateHeaderBackground();
                    this.updateActiveNavLink();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateHeaderBackground() {
        if (window.scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }
    
    updateActiveNavLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 150;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
        
        // Explore button functionality
        const exploreBtn = document.querySelector('.explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = aboutSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
    
    setupMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        this.menuOverlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
        
        // Close menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.menuOverlay.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : 'auto';
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Modal functionality
class Modal {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalDescription = document.getElementById('modal-description');
        this.closeBtn = document.querySelector('.close');
        this.readMoreBtns = document.querySelectorAll('.read-more');
        
        this.modalContent = {
            history: {
                title: 'Our History',
                description: 'Founded in 1992 in Milan, Caffè Bellora began as a family-run café focused on authentic Italian coffee traditions. Over the decades, we have expanded globally, keeping our passion for quality and craftsmanship alive in every cup.'
            },
            farmers: {
                title: 'Our Partner Farmers',
                description: 'We work closely with small, sustainable farms across Latin America, Africa, and Asia. Our farmers are the heart of our coffee — their dedication ensures the highest quality beans.'
            },
            coffee: {
                title: 'Our Coffee',
                description: 'From bold espresso to delicate cappuccinos, our coffee is crafted using traditional Italian roasting methods, ensuring rich flavor and aromatic depth in every sip.'
            }
        };
        
        this.init();
    }
    
    init() {
        this.readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalType = btn.getAttribute('data-modal');
                this.openModal(modalType);
            });
        });
        
        this.closeBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }
    
    openModal(type) {
        const content = this.modalContent[type];
        if (content) {
            this.modalTitle.textContent = content.title;
            this.modalDescription.textContent = content.description;
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Contact form functionality
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.nameInput = this.form.querySelector('input[name="name"]');
        this.emailInput = this.form.querySelector('input[name="email"]');
        this.messageInput = this.form.querySelector('textarea[name="message"]');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    async handleSubmit() {
        const name = this.nameInput.value.trim();
        const email = this.emailInput.value.trim();
        const message = this.messageInput.value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            this.showAlert('Please fill in all fields', 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showAlert('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission with loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showAlert('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.form.reset();
        } catch (error) {
            this.showAlert('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showAlert(message, type) {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
            <button class="alert-close">&times;</button>
        `;
        
        // Add alert styles
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(alert);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
        
        // Manual close
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        });
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loading');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll('.about-card, .feature-item, .location-img');
        elementsToAnimate.forEach(el => observer.observe(el));
    }
}

// Additional functionality
class UtilityFunctions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupBranchesButton();
        this.setupParallaxEffect();
        this.setupLazyLoading();
    }
    
    setupBranchesButton() {
        const branchesBtn = document.querySelector('.branches-btn');
        if (branchesBtn) {
            branchesBtn.addEventListener('click', () => {
                window.open('https://www.google.com/maps/search/coffee+shop+near+me', '_blank');
            });
        }
    }
    
    setupParallaxEffect() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const heroBackground = document.querySelector('.hero-background');
                    
                    if (heroBackground) {
                        heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductCarousel();
    new Navigation();
    new Modal();
    new ContactForm();
    new AnimationObserver();
    new UtilityFunctions();
    
    // Add loading class to body for initial animations
    document.body.classList.add('loading');
    
    // Performance optimization: Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Trigger any resize-dependent updates
            window.dispatchEvent(new CustomEvent('optimizedResize'));
        }, 250);
    });
});

// Add CSS animations for alerts
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .alert-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
        padding: 0 5px;
    }
`;
document.head.appendChild(alertStyles);