// ========================================
// FUNDAMENTALS FIRST - JAVASCRIPT
// Interactive features for navigation, forms, filtering, and progress tracking
// ========================================

// ========================================
// MOBILE NAVIGATION TOGGLE
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');

    // Toggle mobile menu
    if (burger) {
        burger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideNav = navLinks && navLinks.contains(event.target);
        const isClickInsideBurger = burger && burger.contains(event.target);

        if (!isClickInsideNav && !isClickInsideBurger && navLinks) {
            navLinks.classList.remove('active');
            if (burger) burger.classList.remove('active');
        }
    });

    // Initialize drill filtering and progress tracking
    initializeDrillFiltering();
    initializeProgressTracking();
    initializeFormValidation();
});

// ========================================
// VIDEO CONTROLS FUNCTIONALITY
// ========================================

function toggleFullscreen(videoElement) {
    if (!videoElement) return;

    if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
    } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
    }
}

// ========================================
// DRILL FILTERING FUNCTIONALITY
// ========================================

function initializeDrillFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const drillCards = document.querySelectorAll('.drill-card');

    if (filterButtons.length === 0 || drillCards.length === 0) return; // Exit if not on drills page

    const setActiveButton = (button) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    };

    const applyFilter = (filterValue) => {
        const visibleCards = [];

        drillCards.forEach(card => {
            const isMatch = filterValue === 'all' || card.getAttribute('data-skill') === filterValue;

            if (isMatch) {
                card.classList.remove('hidden');
                card.style.animation = 'none';
                void card.offsetWidth; // Trigger reflow for animation
                card.style.animation = 'slideInUp 0.5s ease';
                visibleCards.push(card);
            } else {
                card.classList.add('hidden');
            }
        });

        // Update drill count
        const drillCountElement = document.querySelector('.drill-count');
        if (drillCountElement) {
            const count = visibleCards.length;
            const skillText = filterValue === 'all' ? '' : ` ${filterValue}`;
            drillCountElement.textContent = `${count} drill${count !== 1 ? 's' : ''} available${skillText}`;
        }
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filterValue = this.getAttribute('data-filter');
            setActiveButton(this);
            applyFilter(filterValue);
        });

        // Keyboard navigation for filter buttons
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Initialize with the default active filter
    const defaultButton = document.querySelector('.filter-btn.active');
    if (defaultButton) {
        applyFilter(defaultButton.getAttribute('data-filter'));
    } else {
        applyFilter('all');
    }
}

// ========================================
// PROGRESS TRACKING FUNCTIONALITY
// ========================================

function initializeProgressTracking() {
    const drillCheckboxes = document.querySelectorAll('.drill-checkbox');
    const completedCount = document.getElementById('drills-completed');
    const completionRate = document.getElementById('completion-rate');
    const progressFill = document.getElementById('progress-fill');

    if (drillCheckboxes.length === 0) return; // Exit if not on drills page

    // Load saved progress from localStorage
    loadProgressFromStorage();

    // Add event listeners to checkboxes
    drillCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Save progress to localStorage
            saveProgressToStorage();

            // Update progress display
            updateProgressDisplay();
        });
    });

    // Initial progress update
    updateProgressDisplay();

    function updateProgressDisplay() {
        const totalDrills = drillCheckboxes.length;
        const completedDrills = document.querySelectorAll('.drill-checkbox:checked').length;
        const percentage = Math.round((completedDrills / totalDrills) * 100);

        if (completedCount) completedCount.textContent = completedDrills;
        if (completionRate) completionRate.textContent = percentage + '%';
        if (progressFill) progressFill.style.width = percentage + '%';
    }

    function saveProgressToStorage() {
        const progress = {};
        drillCheckboxes.forEach(checkbox => {
            progress[checkbox.getAttribute('data-drill')] = checkbox.checked;
        });
        localStorage.setItem('drillProgress', JSON.stringify(progress));
    }

    function loadProgressFromStorage() {
        const saved = localStorage.getItem('drillProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            drillCheckboxes.forEach(checkbox => {
                const drillId = checkbox.getAttribute('data-drill');
                if (progress[drillId] === true) {
                    checkbox.checked = true;
                }
            });
        }
    }
}

// ========================================
// FORM VALIDATION
// ========================================

function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');

    if (contactForm) {
        initializeContactForm(contactForm);
    }

    if (newsletterForm) {
        initializeNewsletterForm(newsletterForm);
    }
}

function initializeContactForm(form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.classList.remove('show');
        });

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const age = document.getElementById('age').value;
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        // Validation rules
        if (name.length < 2) {
            showFieldError('name', 'Name must be at least 2 characters');
            isValid = false;
        }

        if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (phone && !isValidPhone(phone)) {
            showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        if (!subject) {
            showFieldError('subject', 'Please select a subject');
            isValid = false;
        }

        if (!age) {
            showFieldError('age', 'Please select your age group');
            isValid = false;
        }

        if (message.length < 10) {
            showFieldError('message', 'Message must be at least 10 characters');
            isValid = false;
        }

        // If valid, show success message and reset form
        if (isValid) {
            const successMsg = document.getElementById('formSuccess');
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }
            form.reset();
        }
    });

    function showFieldError(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        const errorEl = document.getElementById(fieldId + '-error');
        const formGroup = field.closest('.form-group');

        if (formGroup) formGroup.classList.add('error');
        if (errorEl) {
            errorEl.textContent = errorMessage;
            errorEl.classList.add('show');
        }
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function isValidPhone(phone) {
        const regex = /^[\d\s\-\(\)\+]+$/;
        return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
}

function initializeNewsletterForm(form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = document.getElementById('newsletter-email');
        const email = emailInput.value.trim();
        const successMsg = document.getElementById('newsletterSuccess');

        if (isValidEmail(email)) {
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 4000);
            }
            form.reset();
        } else {
            alert('Please enter a valid email address');
        }
    });

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

// ========================================
// SMOOTH SCROLL ENHANCEMENT (for anchor links)
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// DRILL DETAILS ANIMATION
// ========================================

const drillDetails = document.querySelectorAll('.drill-details');
drillDetails.forEach(detail => {
    const toggle = detail.querySelector('.drill-toggle');
    
    // Add smooth animation on toggle
    detail.addEventListener('toggle', function () {
        if (this.open) {
            this.style.animation = 'slideDown 0.3s ease';
        }
    });
});

// ========================================
// FAQ ACCORDION ANIMATION
// ========================================

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    item.addEventListener('toggle', function () {
        if (this.open) {
            this.style.animation = 'slideDown 0.3s ease';
        }
    });
});

// ========================================
// LAZY LOADING IMAGES (Performance optimization)
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// PERFORMANCE: PRE-LOAD IMAGES
// ========================================

function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.src;
        if (src) {
            const newImg = new Image();
            newImg.src = src;
        }
    });
}

// Preload images after page loads
window.addEventListener('load', preloadImages);

// ========================================
// ACCESSIBILITY: FOCUS MANAGEMENT
// ========================================

// Improve keyboard navigation for dropdowns
document.querySelectorAll('.filter-btn, .btn').forEach(button => {
    button.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && this.tagName !== 'A') {
            this.click();
        }
    });
});

// ========================================
// SKILL CARD ANIMATIONS
// ========================================

function initializeSkillCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all fundamental cards
    document.querySelectorAll('.fundamental-card').forEach(card => {
        observer.observe(card);
    });
}

// ========================================
// TECHNIQUE STEP INTERACTIONS
// ========================================

function initializeTechniqueInteractions() {
    const techniqueSteps = document.querySelectorAll('.technique-step');

    techniqueSteps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            // Add a subtle glow effect
            this.style.boxShadow = '0 8px 25px rgba(255, 107, 0, 0.2)';
        });

        step.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// ========================================
// MASTERY CHART ANIMATION
// ========================================

function initializeMasteryChart() {
    const chartSegments = document.querySelectorAll('.segment');

    // Animate segments on page load with delay
    chartSegments.forEach((segment, index) => {
        segment.style.animation = `segment-appear 0.8s ease-out ${index * 0.2}s both`;
    });
}

// Add CSS animation for segments
const style = document.createElement('style');
style.textContent = `
    @keyframes segment-appear {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    .fundamental-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fundamental-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// ========================================
// INITIALIZE FUNDAMENTALS FEATURES
// ========================================

function initFundamentalsPage() {
    // Only run on fundamentals page
    if (document.querySelector('.fundamental-card')) {
        initializeSkillCardAnimations();
        initializeTechniqueInteractions();
        initializeMasteryChart();
    }
}

// Initialize fundamentals features when DOM is ready
document.addEventListener('DOMContentLoaded', initFundamentalsPage);

function initAfterDOM() {
    // All critical initialization is done above
    // This can hold non-critical enhancements
}

// ========================================
// ANALYTICS & TRACKING (Optional)
// ========================================

// Track page views and user interactions
function trackEvent(eventName, eventData) {
    // Implement your analytics tracking here
    // Example: Google Analytics, Mixpanel, etc.
    console.log('Event tracked:', eventName, eventData);
}

// Track navigation clicks
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function () {
        trackEvent('navigation_click', {
            page: this.href
        });
    });
});

// Track drill completions
document.querySelectorAll('.drill-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        trackEvent('drill_completed', {
            drill: this.getAttribute('data-drill'),
            completed: this.checked
        });
    });
});
