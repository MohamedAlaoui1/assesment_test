/**
 * DJ ALAOUI Mohamed Portfolio
 * Interactive JavaScript Module
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initGallery();
    initMusicPlayer();
    initContactForm();
    initAnimations();
});

/**
 * Navigation Module
 * Handles mobile menu toggle and scroll behavior
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Toggle mobile menu
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Effects Module
 * Handles parallax and reveal animations
 */
function initScrollEffects() {
    // Parallax effect for hero image
    const heroImage = document.querySelector('.hero-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroImage && scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Gallery Module
 * Handles gallery interactions and lightbox
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption')?.textContent || '';
            openLightbox(img.src, caption);
        });
    });
}

/**
 * Lightbox Function
 * Creates and displays a lightbox for images
 */
function openLightbox(src, caption) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <img src="${src}" alt="${caption}">
            <p class="lightbox-caption">${caption}</p>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        .lightbox-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
        }
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
        }
        .lightbox-content img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 8px;
        }
        .lightbox-caption {
            color: #D4AF37;
            margin-top: 16px;
            font-size: 1rem;
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .lightbox-close:hover {
            color: #D4AF37;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Close lightbox handlers
    const closeLightbox = () => {
        lightbox.remove();
        style.remove();
        document.body.style.overflow = '';
    };

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    }, { once: true });
}

/**
 * Music Player Module
 * Handles play button interactions
 */
function initMusicPlayer() {
    const playButtons = document.querySelectorAll('.play-btn');
    let currentlyPlaying = null;

    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.album-card');
            const title = card.querySelector('.album-title')?.textContent || 'Track';
            
            // Toggle play state
            if (currentlyPlaying === btn) {
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
                currentlyPlaying = null;
                showNotification(`Paused: ${title}`);
            } else {
                // Reset previous
                if (currentlyPlaying) {
                    currentlyPlaying.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
                }
                btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
                currentlyPlaying = btn;
                showNotification(`Now Playing: ${title}`);
            }
        });
    });
}

/**
 * Notification Function
 * Displays toast notifications
 */
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #D4AF37 0%, #C65D3B 100%);
            color: #0A0A0A;
            padding: 16px 32px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.875rem;
            z-index: 9999;
            animation: slideUp 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        }
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes fadeOut {
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

/**
 * Contact Form Module
 * Handles form validation and submission
 */
function initContactForm() {
    const form = document.getElementById('bookingForm');
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simple validation
        if (!data.name || !data.email || !data.eventType || !data.date) {
            showNotification('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Booking request sent! I\'ll get back to you soon.');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/**
 * Animations Module
 * Handles scroll-triggered animations
 */
function initAnimations() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add reveal animation styles
    const style = document.createElement('style');
    style.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);

    // Apply reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-tag, .section-title, .about-text, .stat, .gallery-item, .album-card, .event-card, .contact-item'
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.classList.add(`reveal-delay-${(index % 3) + 1}`);
        observer.observe(el);
    });

    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
}

/**
 * Counter Animation Function
 * Animates numbers counting up
 */
function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasM = text.includes('M');
    const number = parseInt(text.replace(/[^0-9]/g, ''));
    
    let current = 0;
    const increment = number / 50;
    const duration = 1500;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (hasM) displayValue += 'M';
        if (hasPlus) displayValue += '+';
        element.textContent = displayValue;
    }, stepTime);
}

// Console Easter Egg
console.log('%c🎧 DJ ALAOUI Mohamed', 'font-size: 24px; font-weight: bold; color: #D4AF37;');
console.log('%cMoroccan Beats • Global Sounds', 'font-size: 14px; color: #9CA3AF;');
console.log('%cLooking for a developer? Check out the code!', 'font-size: 12px; color: #C65D3B;');