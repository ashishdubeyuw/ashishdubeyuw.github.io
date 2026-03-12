// Load configuration and populate the page
let config = {};

async function loadConfig() {
    try {
        const response = await fetch('./portfolio-config.json');
        config = await response.json();
        populatePage();
    } catch (error) {
        console.error('Error loading configuration:', error);
        alert('Error loading portfolio data. Please check that portfolio-config.json is in the same directory.');
    }
}

function populatePage() {
    // Update page title
    document.title = `${config.personal.name} - ${config.personal.title}`;
    
    // Update navigation logo
    const initials = config.personal.name.split(' ').map(n => n[0]).join('');
    document.getElementById('nav-logo').textContent = initials;
    
    // Update hero section
    const heroContent = document.getElementById('hero-content');
    const nameParts = config.personal.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    heroContent.innerHTML = `
        <div class="hero-label">🚀 ${config.personal.title}</div>
        <h1>${firstName} <span class="gradient-text">${lastName}</span></h1>
        <div class="hero-subtitle">${config.personal.tagline}</div>
        <p class="hero-description">${config.personal.description}</p>
        <div class="cta-buttons">
            <a href="#contact" class="btn btn-primary">Let's Connect →</a>
            <a href="${config.personal.linkedin}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">View LinkedIn</a>
        </div>
    `;
    
    // Update about section
    const aboutContent = document.getElementById('about-content');
    const paragraphsHTML = config.about.paragraphs.map(p => {
        // Add highlighting to specific terms
        let formatted = p.replace(/Senior Advanced Embedded Engineer/g, '<span class="highlight">Senior Advanced Embedded Engineer</span>');
        formatted = formatted.replace(/M\.S\. in Information Systems/g, '<span class="highlight">M.S. in Information Systems</span>');
        formatted = formatted.replace(/Phoenix to Seattle/g, '<span class="highlight">Phoenix to Seattle</span>');
        formatted = formatted.replace(/\$3M\+/g, '<span class="highlight">$3M+</span>');
        return `<p>${formatted}</p>`;
    }).join('');
    
    aboutContent.innerHTML = `
        <h3>${config.about.title}</h3>
        ${paragraphsHTML}
    `;
    
    // Update stats
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = config.stats.map(stat => `
        <div class="stat-card">
            <div class="stat-icon">${stat.icon}</div>
            <div class="stat-number">${stat.number}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
    
    // Update experience timeline
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = config.experience.map(exp => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="company-logo">${exp.logo}</div>
                <h3 class="timeline-title">${exp.title}</h3>
                <div class="timeline-company">${exp.company}</div>
                <div class="timeline-duration">📍 ${exp.location} • ${exp.duration}</div>
                <p class="timeline-description">${exp.description}</p>
                <div>
                    ${exp.achievements.map(a => `<span class="achievement-tag">${a}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    // Update skills
    const skillsGrid = document.getElementById('skills-grid');
    skillsGrid.innerHTML = config.skills.map(skill => `
        <div class="skill-card">
            <div class="skill-icon">${skill.icon}</div>
            <h3>${skill.title}</h3>
            <div class="skill-tags">
                ${skill.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    // Update locations with slideshow support
    const locationsGrid = document.getElementById('locations-grid');
    locationsGrid.innerHTML = config.locations.map((loc, index) => {
        const images = Array.isArray(loc.images) ? loc.images : [loc.image];
        return `
            <div class="location-card" data-location-index="${index}">
                <div class="location-slideshow">
                    ${images.map((img, imgIndex) => `
                        <img src="${img}" alt="${loc.title}" class="location-slide ${imgIndex === 0 ? 'active' : ''}" data-slide="${imgIndex}">
                    `).join('')}
                </div>
                ${images.length > 1 ? `
                    <div class="location-dots">
                        ${images.map((_, dotIndex) => `
                            <span class="location-dot ${dotIndex === 0 ? 'active' : ''}" data-dot="${dotIndex}"></span>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="location-overlay">
                    <div class="location-title">${loc.title}</div>
                    <div class="location-subtitle">${loc.subtitle}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // Update contact section
    const contactCards = document.getElementById('contact-cards');
    contactCards.innerHTML = `
        <a href="mailto:${config.personal.email}" class="contact-card">
            <div class="contact-icon">📧</div>
            <h3>Email</h3>
            <p>${config.personal.email}</p>
        </a>
        <a href="${config.personal.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-card">
            <div class="contact-icon">💼</div>
            <h3>LinkedIn</h3>
            <p>Connect professionally</p>
        </a>
        <a href="tel:${config.personal.phone.replace(/[^0-9+]/g, '')}" class="contact-card">
            <div class="contact-icon">📱</div>
            <h3>Phone</h3>
            <p>${config.personal.phone}</p>
        </a>
    `;
    
    // Update footer
    document.getElementById('footer-text').textContent = 
        `© 2025 ${config.personal.name}. Crafted with precision and passion for aerospace excellence.`;
    
    // Initialize animations and slideshows after content is loaded
    initializeAnimations();
    initializeSlideshows();
}

function initializeSlideshows() {
    const locationCards = document.querySelectorAll('.location-card');
    
    locationCards.forEach(card => {
        const slides = card.querySelectorAll('.location-slide');
        const dots = card.querySelectorAll('.location-dot');
        
        if (slides.length <= 1) return; // Skip if only one image
        
        let currentSlide = 0;
        let interval;
        
        // Function to change slide
        const changeSlide = (newIndex) => {
            slides[currentSlide].classList.remove('active');
            if (dots.length > 0) dots[currentSlide].classList.remove('active');
            
            currentSlide = newIndex;
            
            slides[currentSlide].classList.add('active');
            if (dots.length > 0) dots[currentSlide].classList.add('active');
        };
        
        // Auto-advance slides every 4 seconds
        const startInterval = () => {
            interval = setInterval(() => {
                const nextSlide = (currentSlide + 1) % slides.length;
                changeSlide(nextSlide);
            }, 4000);
        };
        
        startInterval();
        
        // Manual navigation with dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                clearInterval(interval);
                changeSlide(index);
                startInterval(); // Restart auto-advance
            });
        });
        
        // Pause on hover
        card.addEventListener('mouseenter', () => {
            clearInterval(interval);
        });
        
        card.addEventListener('mouseleave', () => {
            startInterval();
        });
    });
}

function initializeAnimations() {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImg = document.querySelector('.hero-bg img');
        if (heroImg) {
            heroImg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        // Navbar transparency
        const nav = document.querySelector('nav');
        if (scrolled > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.stat-card, .skill-card, .timeline-item, .location-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Counter animation for stats
    const animateCounter = (element, target) => {
        const text = target.toString();
        
        // Handle different number formats
        if (text.includes('+') || text.includes('M')) {
            const numericValue = parseInt(text.replace(/[^0-9]/g, ''));
            let current = 0;
            const increment = numericValue / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    element.textContent = text;
                    clearInterval(timer);
                } else {
                    if (text.includes('M')) {
                        element.textContent = `$${Math.floor(current)}M+`;
                    } else {
                        element.textContent = `${Math.floor(current)}+`;
                    }
                }
            }, 20);
        } else if (text.includes('.')) {
            // For decimal numbers like 0.001
            element.textContent = text;
        } else {
            // For regular numbers
            let current = 0;
            const targetNum = parseInt(text);
            const increment = targetNum / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= targetNum) {
                    element.textContent = text;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 20);
        }
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target;
                const text = number.textContent;
                animateCounter(number, text);
                statsObserver.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Load config on page load
document.addEventListener('DOMContentLoaded', loadConfig);
