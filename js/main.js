/**
 * ========================================================================
 *    PREMIUM GLASSMORPHISM PORTFOLIO LOGIC CONTROLLER
 *    Project: Kamel Ahmed Ramadan - Frontend Developer Portfolio
 *    Author: Antigravity Team
 *    Version: 1.0.0
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // 1. HIDE LOADING SCREEN
    // ---------------------------------------------------------
    const loader = document.getElementById('loader');
    if (loader) {
        // Allow smooth fade out after DOM is parsed
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 600); // 600ms grace period for a premium feel
        });

        // Backup safety check: if window load is delayed, force loader close
        setTimeout(() => {
            if (!loader.classList.contains('fade-out')) {
                loader.classList.add('fade-out');
            }
        }, 3000);
    }

    // ---------------------------------------------------------
    // 2. STICKY GLASS HEADER & ACTIVE SECTION NAV TRACKING
    // ---------------------------------------------------------
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header shrink effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Section Active Navigation highlights
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight link if scroll position is within section boundaries
            if (window.scrollY >= (sectionTop - 160)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ---------------------------------------------------------
    // 3. RESPONSIVE MOBILE MENU HAMBURGER NAVIGATION
    // ---------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerBtn && navMenu) {
        // Toggle menu visibility
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.contains('open');
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('open');
            hamburgerBtn.setAttribute('aria-expanded', !isOpen);
        });

        // Close menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking anywhere outside of the navbar
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------------------------------------------------------
    // 4. ROLE MULTI-TEXT ROTATING ANIMATION
    // ---------------------------------------------------------
    const roleText = document.getElementById('role-text');
    if (roleText) {
        const roles = [
            "Frontend Developer",
            "Computer Science Student",
            "Data Analysis Enthusiast"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                // Delete text character by character
                roleText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Speed up deletion
            } else {
                // Type text character by character
                roleText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal typing speed
            }

            // Finished typing the current word
            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 1500; // Hold word on screen before deleting
            } 
            // Finished deleting the word
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length; // Rotate to next role
                typeSpeed = 500; // Pause before typing next word
            }

            setTimeout(typeEffect, typeSpeed);
        }

        // Start typing loop
        setTimeout(typeEffect, 1000);
    }

    // ---------------------------------------------------------
    // 5. INTERSECTION OBSERVER FOR SCROLL REVEAL EFFECTS
    // ---------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-element');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once revealed to improve scroll performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Offset trigger slightly for better pacing
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback: If browser doesn't support IntersectionObserver, show elements immediately
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }

    // ---------------------------------------------------------
    // 6. TECHNICAL SKILLS CATEGORY FILTERING & BAR FILL TRIGGERS
    // ---------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    const skillFills = document.querySelectorAll('.skill-progress-fill');

    // Trigger skills bar animations when in view
    function animateSkillBars() {
        skillFills.forEach(fill => {
            const card = fill.closest('.skill-card');
            // Animate only if the skill card is visible (not hidden by category filter)
            if (card && !card.classList.contains('hidden')) {
                const targetProgress = fill.getAttribute('data-progress');
                fill.style.width = targetProgress;
            }
        });
    }

    function resetSkillBars() {
        skillFills.forEach(fill => {
            fill.style.width = '0%';
        });
    }

    // Category Tabs Switching Handler
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Reset progress bars before animation triggers again
            resetSkillBars();

            // Toggle element visibility
            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            // Re-animate visible cards
            setTimeout(animateSkillBars, 150);
        });
    });

    // Observer to detect when Skills section is scrolled into view
    const skillsSection = document.getElementById('skills');
    if (skillsSection && 'IntersectionObserver' in window) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.15 });

        skillsObserver.observe(skillsSection);
    } else {
        // Fallback animation trigger
        setTimeout(animateSkillBars, 1500);
    }

    // ---------------------------------------------------------
    // 7. COUNTER STATISTICS ANIMATION (ABOUT ME)
    // ---------------------------------------------------------
    const statNums = document.querySelectorAll('.stat-num');
    
    function animateCounters() {
        statNums.forEach(counter => {
            const targetVal = parseInt(counter.getAttribute('data-val'), 10);
            if (isNaN(targetVal)) return;

            let currentVal = 0;
            const duration = 1500; // Total count duration (1.5 seconds)
            const increment = targetVal / (duration / 16); // 60 FPS calculation
            
            const updateCount = () => {
                currentVal += increment;
                if (currentVal >= targetVal) {
                    counter.textContent = targetVal;
                } else {
                    counter.textContent = Math.floor(currentVal);
                    requestAnimationFrame(updateCount);
                }
            };
            
            updateCount();
        });
    }

    // Trigger counter when About section enters view
    const aboutSection = document.getElementById('about');
    if (aboutSection && 'IntersectionObserver' in window) {
        const aboutObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target); // Animate count only once
                }
            });
        }, { threshold: 0.2 });

        aboutObserver.observe(aboutSection);
    } else {
        // Fallback
        setTimeout(animateCounters, 1500);
    }

    // ---------------------------------------------------------
    // 8. CLIPBOARD COPY UTILITIES (CONTACT DETAILS)
    // ---------------------------------------------------------
    const copyButtons = document.querySelectorAll('.btn-copy');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            const tooltipId = btn.getAttribute('data-target');
            const tooltip = document.getElementById(tooltipId);

            if (textToCopy) {
                // Clipboard API execution
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        // Display tooltip success notification
                        if (tooltip) {
                            tooltip.classList.add('show');
                            setTimeout(() => {
                                tooltip.classList.remove('show');
                            }, 2000); // Hide tooltip after 2 seconds
                        }
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
            }
        });
    });

    // ---------------------------------------------------------
    // 9. PREMIUM CONTACT FORM VALIDATION & SIMULATION
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    if (contactForm && formFeedback && formSubmitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous feedback states
            formFeedback.className = 'form-feedback';
            formFeedback.textContent = '';

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            // Basic checks
            if (!name || !email || !subject || !message) {
                formFeedback.classList.add('error');
                formFeedback.textContent = 'Please fill out all fields before sending your message.';
                return;
            }

            // Simple regex for email syntax validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formFeedback.classList.add('error');
                formFeedback.textContent = 'Please provide a valid email address.';
                return;
            }

            // Modify submit button UI state to show processing
            formSubmitBtn.disabled = true;
            const originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-spinner fa-spin"></i>';

            // Simulate server POST request delay
            setTimeout(() => {
                // Mock success state
                formFeedback.classList.add('success');
                formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully. I will get back to you soon.`;
                
                // Clear input elements
                contactForm.reset();
                
                // Restore button state
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnContent;
                
                // Remove success toast alert after 6 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 6000);
            }, 1800); // 1.8 seconds artificial delay for a premium interactive feel
        });
    }

});
