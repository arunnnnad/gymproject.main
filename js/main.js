document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initUI();
    
    // Back-to-top button
    initBackToTop();
    
    // Handle mobile menu
    initMobileMenu();
    
    // Initialize animations
    initAnimations();
    
    // Initialize form validations
    initFormValidations();
    
    // Initialize testimonial sliders
    initSliders();
});

// Initialize UI components
function initUI() {
    // Theme toggle (if exists)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Set initial theme based on localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        }
    }
    
    // Initialize dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
    
    // Setup pricing tab toggles
    const pricingTabs = document.querySelector('.pricing-tabs');
    if (pricingTabs) {
        const monthlyTab = document.getElementById('monthly-tab');
        const yearlyTab = document.getElementById('yearly-tab');
        const monthlyPlans = document.querySelector('.monthly-plans');
        const yearlyPlans = document.querySelector('.yearly-plans');
        
        if (monthlyTab && yearlyTab && monthlyPlans && yearlyPlans) {
            monthlyTab.addEventListener('click', function() {
                monthlyTab.classList.add('active');
                yearlyTab.classList.remove('active');
                monthlyPlans.style.display = 'grid';
                yearlyPlans.style.display = 'none';
            });
            
            yearlyTab.addEventListener('click', function() {
                yearlyTab.classList.add('active');
                monthlyTab.classList.remove('active');
                yearlyPlans.style.display = 'grid';
                monthlyPlans.style.display = 'none';
            });
        }
    }
    
    // Initialize tabs
    const tabContainers = document.querySelectorAll('.tabs-container');
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    });
    
    // Initialize accordions
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordion = this.parentElement;
            const content = this.nextElementSibling;
            
            // Toggle this accordion
            accordion.classList.toggle('active');
            
            // Expand/collapse content
            if (accordion.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize back-to-top button
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenu = document.getElementById('close-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Handle submenu toggles
    const submenuToggles = document.querySelectorAll('.has-submenu > a');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            const submenu = this.nextElementSibling;
            
            // Toggle submenu
            parent.classList.toggle('submenu-open');
            
            // Expand/collapse submenu
            if (parent.classList.contains('submenu-open')) {
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            } else {
                submenu.style.maxHeight = null;
            }
        });
    });
}

// Initialize animations
function initAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;
    
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Initialize form validations
function initFormValidations() {
    const forms = document.querySelectorAll('form.validate');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        // Add blur event listeners to inputs
        inputs.forEach(input => {
            if (input.type !== 'submit' && input.type !== 'button') {
                input.addEventListener('blur', function() {
                    validateInput(this);
                });
                
                input.addEventListener('input', function() {
                    // Remove error as user types
                    const errorElement = this.parentElement.querySelector('.error-message');
                    if (errorElement) {
                        errorElement.remove();
                        this.classList.remove('error');
                    }
                });
            }
        });
        
        // Form submission validation
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.type !== 'submit' && input.type !== 'button') {
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Input validation function
    function validateInput(input) {
        // Remove any existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        input.classList.remove('error');
        
        // Skip validation if input is not required and empty
        if (!input.required && !input.value.trim()) {
            return true;
        }
        
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (input.required && !input.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } 
        // Email validation
        else if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } 
        // Phone validation
        else if (input.type === 'tel' && input.value.trim()) {
            // Simple phone validation - allowing for different formats
            const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        // Password validation
        else if (input.type === 'password' && input.dataset.minLength) {
            const minLength = parseInt(input.dataset.minLength);
            if (input.value.length < minLength) {
                isValid = false;
                errorMessage = `Password must be at least ${minLength} characters`;
            }
        }
        // Password confirmation
        else if (input.type === 'password' && input.dataset.match) {
            const matchInputId = input.dataset.match;
            const matchInput = document.getElementById(matchInputId);
            if (matchInput && input.value !== matchInput.value) {
                isValid = false;
                errorMessage = 'Passwords do not match';
            }
        }
        
        // Display error if validation failed
        if (!isValid) {
            input.classList.add('error');
            
            const errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            errorElement.textContent = errorMessage;
            
            input.parentElement.appendChild(errorElement);
        }
        
        return isValid;
    }
}

// Initialize sliders (testimonials, etc.)
function initSliders() {
    // Simple testimonial slider
    const testimonialContainers = document.querySelectorAll('.testimonials-slider');
    
    testimonialContainers.forEach(container => {
        const slider = container.querySelector('.testimonials');
        const prevBtn = container.querySelector('.slider-prev');
        const nextBtn = container.querySelector('.slider-next');
        
        if (!slider || !prevBtn || !nextBtn) return;
        
        const testimonials = slider.querySelectorAll('.testimonial');
        if (testimonials.length <= 1) return;
        
        let currentIndex = 0;
        
        // Set initial state
        updateTestimonialSlider();
        
        // Previous button
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonialSlider();
        });
        
        // Next button
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateTestimonialSlider();
        });
        
        function updateTestimonialSlider() {
            testimonials.forEach((testimonial, index) => {
                if (index === currentIndex) {
                    testimonial.classList.add('active');
                } else {
                    testimonial.classList.remove('active');
                }
            });
        }
    });
}