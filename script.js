// =============================================
// VYNAURA - MAIN SCRIPT (CLEAN VERSION)
// =============================================

console.log('VynAura - Initializing...');

// IMMEDIATE FIX: Force loading screen to hide
setTimeout(() => {
    console.log('Force hiding loading screens...');
    
    const loadingScreen = document.getElementById('loadingScreen');
    const modelLoading = document.getElementById('modelLoading');
    
    if (loadingScreen) {
        loadingScreen.classList.add('loaded');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('Main loading screen hidden');
        }, 500);
    }
    
    if (modelLoading) {
        modelLoading.style.display = 'none';
        console.log('3D model loading screen hidden');
    }
    
    // Initialize the site
    initializeSite();
}, 2000);

// Main initialization function
function initializeSite() {
    console.log('Initializing VynAura site...');
    
    // Mark body as loaded
    document.body.classList.add('loaded');
    
    // Initialize all components
    initializeTheme();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeFeaturesSlider();
    initializeFormValidation();
    initializeStarRating();
    
    console.log('VynAura site initialized successfully!');
}

// =============================================
// THEME MANAGEMENT
// =============================================

function initializeTheme() {
    const toggleBtn = document.querySelector('.switch');
    if (toggleBtn) {
        toggleBtn.addEventListener('change', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    if (toggleBtn) {
        toggleBtn.checked = savedTheme === 'dark';
    }
}

// =============================================
// MOBILE MENU
// =============================================

function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            navOverlay.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking overlay
        navOverlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            navOverlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });

        // Close menu when clicking links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// =============================================
// SMOOTH SCROLLING
// =============================================

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// =============================================
// FEATURES SLIDER
// =============================================
function initializeFeaturesSlider() {
    const track = document.querySelector('.features-track');
    const slides = document.querySelectorAll('.feature-slide');
    const dots = document.querySelectorAll('.progress-dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    const slideWidth = 100 / slides.length; // Percentage per slide
    let isAnimating = false;
    let autoSlideInterval;

    function updateSlider() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // Move track horizontally
        track.style.transform = `translateX(-${currentSlide * (100 / slides.length)}%)`;
        
        // Update active states with smooth transitions
        slides.forEach((slide, index) => {
            const isActive = index === currentSlide;
            slide.classList.toggle('active', isActive);
            
            // Reset progress bar
            const progressBar = slide.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
                progressBar.style.transition = 'none';
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Start progress bar for active slide
        const activeSlide = slides[currentSlide];
        const activeProgressBar = activeSlide.querySelector('.progress-bar');
        if (activeProgressBar) {
            setTimeout(() => {
                activeProgressBar.style.transition = 'width 5s linear';
                activeProgressBar.style.width = '100%';
            }, 100);
        }
        
        // Reset animation flag
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
        resetAutoSlide();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
        resetAutoSlide();
    }

    function goToSlide(index) {
        if (index >= 0 && index < slides.length && index !== currentSlide) {
            currentSlide = index;
            updateSlider();
            resetAutoSlide();
        }
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        clearInterval(autoSlideInterval);
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        resetAutoSlide();
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.features-slider-container');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    sliderContainer.addEventListener('mouseleave', resetAutoSlide);

    // Initialize
    updateSlider();
    startAutoSlide();
}
// =============================================
// STAR RATING SYSTEM
// =============================================

function initializeStarRating() {
    const stars = document.querySelectorAll('.stars i');
    if (stars.length === 0) return;
    
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            currentRating = rating;
            updateStars(rating);
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            updateStars(rating, true);
        });

        star.addEventListener('mouseleave', () => {
            updateStars(currentRating);
        });
    });

    function updateStars(rating, isHover = false) {
        stars.forEach((s, index) => {
            if (index < rating) {
                s.classList.remove('far');
                s.classList.add('fas');
                if (isHover) {
                    s.style.transform = 'scale(1.1)';
                } else {
                    s.style.transform = 'scale(1)';
                }
            } else {
                s.classList.remove('fas');
                s.classList.add('far');
                s.style.transform = 'scale(1)';
            }
        });
    }

    // Return public methods
    return {
        getCurrentRating: () => currentRating,
        reset: () => {
            currentRating = 0;
            updateStars(0);
        }
    };
}

// =============================================
// FORM VALIDATION
// =============================================

function initializeFormValidation() {
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;

    const starRating = initializeStarRating();

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (starRating.getCurrentRating() === 0) {
            showNotification('Please select a rating before submitting', 'warning');
            return;
        }
        
        const formData = {
            name: document.getElementById('reviewName').value,
            profession: document.getElementById('reviewTitle').value,
            message: document.getElementById('reviewMessage').value,
            rating: starRating.getCurrentRating()
        };

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner small"></div> Submitting...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showNotification('Thank you for your review!', 'success');
            this.reset();
            starRating.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// =============================================
// NOTIFICATION SYSTEM
// =============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        border: 1px solid ${getNotificationColor(type)};
        border-left: 4px solid ${getNotificationColor(type)};
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        max-width: 400px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--accent)'
    };
    return colors[type] || 'var(--accent)';
}

// =============================================
// SCROLL ANIMATIONS
// =============================================

const fadeElements = document.querySelectorAll('.fade-in');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    observer.observe(element);
});

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

window.addEventListener('scroll', throttle(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 100));

// =============================================
// ADDITIONAL STYLES
// =============================================

const additionalStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes ripple {
        from { transform: scale(0); opacity: 1; }
        to { transform: scale(4); opacity: 0; }
    }
    
    .loading-spinner.small {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
        margin-right: 8px;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 400px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid var(--accent);
    }
    
    .notification-success {
        border-left-color: var(--success);
    }
    
    .notification-error {
        border-left-color: var(--error);
    }
    
    .notification-warning {
        border-left-color: var(--warning);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// =============================================
// USER AUTHENTICATION (SIMPLIFIED)
// =============================================

function showUserStatus(user) {
    const userStatus = document.getElementById('userStatus');
    const userName = document.getElementById('userName');
    
    if (userStatus && userName) {
        userStatus.style.display = 'flex';
        userName.textContent = `Welcome, ${user.fullName}`;
    }
}

function logout() {
    localStorage.removeItem('vynaura_user');
    window.location.href = 'index.html';
}

// Check for logged in user on load
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('vynaura_user'));
    if (user) {
        showUserStatus(user);
    }
});

console.log('VynAura script loaded successfully!');
// Interactive Text Effects
function initializeInteractiveText() {
    const aiText = document.querySelector('.ai-text');
    const realityText = document.querySelector('.reality-text');
    const modelViewer = document.querySelector('model-viewer');
    
    if (aiText && realityText) {
        // AI text interaction
        aiText.addEventListener('click', function(e) {
            createParticles(e, 'ai');
            if (modelViewer) {
                // Trigger AI-related animation on model
                modelViewer.cameraOrbit = '0deg 75deg 105%';
                modelViewer.animationName = 'ai-pulse';
            }
        });
        
        // Reality text interaction
        realityText.addEventListener('click', function(e) {
            createParticles(e, 'reality');
            if (modelViewer) {
                // Trigger reality-related animation
                modelViewer.cameraOrbit = '180deg 75deg 105%';
                modelViewer.animationName = 'reality-zoom';
            }
        });
        
        // Hover effects
        [aiText, realityText].forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                createHoverParticles(this);
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}

// Create particle effects
function createParticles(event, type) {
    const particleCount = 8;
    const colors = type === 'ai' 
        ? ['#4a6cf7', '#00d9ff', '#8c6cff'] 
        : ['#ff6b6b', '#ffa726', '#66bb6a'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'interaction-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            left: ${event.clientX}px;
            top: ${event.clientY}px;
        `;
        
        document.querySelector('.hero-3d-container').appendChild(particle);
        
        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 1000 + 500;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 1 
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => particle.remove();
    }
}

function createHoverParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 3;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'interaction-particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
        `;
        
        document.querySelector('.hero-3d-container').appendChild(particle);
        
        particle.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(3)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeInteractiveText);
// Enhanced 3D Model Control
function initializeEnhancedModel() {
    const modelViewer = document.querySelector('model-viewer');
    
    if (!modelViewer) return;
    
    // Wait for model to load
    modelViewer.addEventListener('load', () => {
        console.log('3D model loaded, applying enhanced settings...');
        
        // Set initial camera position for better zoom
        setTimeout(() => {
            // More zoomed-in camera settings
            modelViewer.cameraOrbit = '0deg 75deg 2.3m';
            modelViewer.fieldOfView = '25deg';
            modelViewer.cameraTarget = '0m 0.1m 0m';
            
            // Smooth camera transition
            modelViewer.addEventListener('camera-change', () => {
                // Optional: Add smooth camera behavior
            });
        }, 1000);
    });
    
    // Add zoom controls
    setupZoomControls(modelViewer);
}

function setupZoomControls(modelViewer) {
    let scale = 1;
    const minScale = 0.8;
    const maxScale = 1.5;
    
    // Mouse wheel zoom
    modelViewer.addEventListener('wheel', (event) => {
        event.preventDefault();
        
        const delta = -event.deltaY * 0.01;
        scale = Math.min(maxScale, Math.max(minScale, scale + delta));
        
        // Adjust camera distance based on scale
        const newDistance = 2.5 / scale;
        modelViewer.cameraOrbit = `0deg 75deg ${newDistance}m`;
    });
    
    // Touch pinch zoom
    let touchStartDistance = 0;
    
    modelViewer.addEventListener('touchstart', (event) => {
        if (event.touches.length === 2) {
            touchStartDistance = getTouchDistance(event.touches);
        }
    });
    
    modelViewer.addEventListener('touchmove', (event) => {
        if (event.touches.length === 2) {
            event.preventDefault();
            const currentDistance = getTouchDistance(event.touches);
            const delta = (currentDistance - touchStartDistance) * 0.01;
            
            scale = Math.min(maxScale, Math.max(minScale, scale + delta));
            const newDistance = 2.5 / scale;
            modelViewer.cameraOrbit = `0deg 75deg ${newDistance}m`;
            
            touchStartDistance = currentDistance;
        }
    });
}

function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Reset camera position
function resetCamera() {
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
        modelViewer.cameraOrbit = '0deg 75deg 2.5m';
        modelViewer.fieldOfView = '30deg';
    }
}

// Add reset button to interaction hints
function addResetButton() {
    const hints = document.querySelector('.interaction-hints');
    if (hints) {
        const resetHint = document.createElement('div');
        resetHint.className = 'hint reset-hint';
        resetHint.innerHTML = `
            <i class="fas fa-sync-alt"></i>
            <span>Reset view</span>
        `;
        resetHint.addEventListener('click', resetCamera);
        hints.appendChild(resetHint);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancedModel();
    addResetButton();
});
