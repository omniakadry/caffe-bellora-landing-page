// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(44, 24, 16, 0.98)';
    } else {
        header.style.background = 'rgba(44, 24, 16, 0.95)';
    }
});
// Get modal elements
const aboutBtn = document.getElementById("aboutBtn");
const aboutModal = document.getElementById("aboutModal");
const closeBtn = document.querySelector(".close");

// Show modal
aboutBtn.onclick = () => {
    aboutModal.style.display = "block";
};

// Hide modal when close button clicked
closeBtn.onclick = () => {
    aboutModal.style.display = "none";
};

// Hide modal when clicking outside content
window.onclick = (event) => {
    if (event.target === aboutModal) {
        aboutModal.style.display = "none";
    }
};
// Get all Read More links
const readMoreLinks = document.querySelectorAll(".read-more");
const modals = document.querySelectorAll(".modal");
const closeBtns = document.querySelectorAll(".close");

// Open the modal
readMoreLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const modalId = link.getAttribute("data-modal");
        document.getElementById(modalId).style.display = "block";
    });
});

// Close modal when clicking close button
closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        btn.parentElement.parentElement.style.display = "none";
    });
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Products carousel functionality
const productsContainer = document.querySelector('.products-container');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');

let currentSlide = 0;
const totalSlides = 8;
const slideWidth = 150;

// Initialize carousel
function updateCarousel() {
    const translateX = -currentSlide * slideWidth;
    productsContainer.style.transform = `translateX(${translateX}px)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Next slide
nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
});

// Previous slide
prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
});

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

// Auto-slide functionality
let autoSlideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}, 5000);

// Pause auto-slide on hover
document.querySelector('.products-carousel').addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

document.querySelector('.products-carousel').addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 5000);
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate form submission
    alert('Thank you for your message! We\'ll get back to you soon.');
    contactForm.reset();
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mobile menu toggle (for future mobile implementation)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 1s ease forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .feature-item, .product-item').forEach(el => {
    observer.observe(el);
});

// Search functionality (basic implementation)
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', () => {
    const searchTerm = prompt('What are you looking for?');
    if (searchTerm) {
        alert(`Searching for: ${searchTerm}`);
        // In a real application, you would implement actual search functionality
    }
});

// Cart functionality (basic implementation)
const cartBtn = document.querySelector('.cart-btn');
let cartCount = 0;

cartBtn.addEventListener('click', () => {
    alert(`Cart items: ${cartCount}`);
    // In a real application, you would show a cart modal/page
});

// Add to cart simulation for product items
document.querySelectorAll('.product-item').forEach(product => {
    product.addEventListener('click', () => {
        cartCount++;
        product.style.transform = 'scale(0.95)';
        setTimeout(() => {
            product.style.transform = 'scale(1)';
        }, 200);
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.textContent = 'Added to cart!';
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gold);
            color: var(--primary-brown);
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: 500;
            z-index: 10000;
            animation: fadeInUp 0.3s ease;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCarousel();
});