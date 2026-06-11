document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // 2. Mobile Navigation Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('open');
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden'; // prevent background scrolling
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            toggleMenu();
            menuToggle.focus();
        }
    });

    // 3. Scroll Reveal Animation using IntersectionObserver
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, revealOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Ensure everything is visible if reduced motion is on
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }

    // 4. Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link[href^="#"]');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px' }); // Trigger when section is in top 20% of viewport

    sections.forEach(section => sectionObserver.observe(section));

    // 5. Update Footer Year dynamically
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 6. Hero typing animation
    const typingText = document.getElementById('hero-typing-text');
    const typingPhrases = [
        'Hi, I am Shreya!',
        'I am an AI Engineer',
        'I_like_to_code.py',
        'I am addicted to ☕'
    ];

    if (typingText) {
        if (prefersReducedMotion) {
            typingText.textContent = typingPhrases[0];
        } else {
            let phraseIndex = 0;
            let characterIndex = 0;
            let deleting = false;

            const runTypingLoop = () => {
                const currentPhrase = typingPhrases[phraseIndex];
                typingText.textContent = currentPhrase.slice(0, characterIndex);

                if (!deleting && characterIndex < currentPhrase.length) {
                    characterIndex += 1;
                    window.setTimeout(runTypingLoop, 72);
                    return;
                }

                if (!deleting) {
                    deleting = true;
                    window.setTimeout(runTypingLoop, 1450);
                    return;
                }

                if (characterIndex > 0) {
                    characterIndex -= 1;
                    window.setTimeout(runTypingLoop, 38);
                    return;
                }

                deleting = false;
                phraseIndex = (phraseIndex + 1) % typingPhrases.length;
                window.setTimeout(runTypingLoop, 280);
            };

            runTypingLoop();
        }
    }

    // 7. Dot-field background with center-origin ripple pulses
    const heroCanvas = document.getElementById('hero-dot-field');

    if (heroCanvas && !prefersReducedMotion) {
        const context = heroCanvas.getContext('2d', { alpha: true });
        const hero = heroCanvas.closest('.section-hero');
        const dots = [];
        const ambientParticles = [];
        const ripples = [];
        let width = 0;
        let height = 0;
        let pixelRatio = 1;
        let animationFrame = null;
        let previousTime = performance.now();
        let lastRippleAt = 0;

        const createRipple = (time, initialRadius = 0) => {
            ripples.push({ radius: initialRadius, opacity: 1, createdAt: time });
        };

        const rebuildField = () => {
            const rect = hero.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

            heroCanvas.width = Math.round(width * pixelRatio);
            heroCanvas.height = Math.round(height * pixelRatio);
            heroCanvas.style.width = `${width}px`;
            heroCanvas.style.height = `${height}px`;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            dots.length = 0;
            ambientParticles.length = 0;
            ripples.length = 0;

            const gap = width < 640 ? 26 : 30;
            const centerX = width / 2;
            const centerY = height / 2;

            for (let y = gap / 2; y < height; y += gap) {
                for (let x = gap / 2; x < width; x += gap) {
                    dots.push({
                        x,
                        y,
                        distance: Math.hypot(x - centerX, y - centerY),
                        variance: 0.82 + Math.random() * 0.36
                    });
                }
            }

            const particleCount = Math.max(16, Math.floor((width * height) / 70000));
            for (let index = 0; index < particleCount; index += 1) {
                ambientParticles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: 0.35 + Math.random() * 0.75,
                    speedX: (Math.random() - 0.5) * 0.025,
                    speedY: (Math.random() - 0.5) * 0.025,
                    opacity: 0.05 + Math.random() * 0.13
                });
            }

            createRipple(performance.now(), 0);
            createRipple(performance.now(), Math.min(width, height) * 0.34);
        };

        const draw = (time) => {
            const delta = Math.min(time - previousTime, 40);
            previousTime = time;

            context.clearRect(0, 0, width, height);

            if (time - lastRippleAt > 2600) {
                createRipple(time);
                lastRippleAt = time;
            }

            for (let index = ripples.length - 1; index >= 0; index -= 1) {
                ripples[index].radius += delta * 0.115;
                ripples[index].opacity = Math.max(0, 1 - ripples[index].radius / Math.hypot(width, height));
                if (ripples[index].radius > Math.hypot(width, height)) ripples.splice(index, 1);
            }

            dots.forEach(dot => {
                let waveStrength = 0;

                ripples.forEach(ripple => {
                    const distanceFromWave = Math.abs(dot.distance - ripple.radius);
                    const localStrength = Math.max(0, 1 - distanceFromWave / 46) * ripple.opacity;
                    waveStrength = Math.max(waveStrength, localStrength);
                });

                const radius = (0.78 + waveStrength * 1.12) * dot.variance;
                const opacity = 0.12 + waveStrength * 0.42;

                context.beginPath();
                context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
                context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                context.fill();
            });

            ambientParticles.forEach(particle => {
                particle.x += particle.speedX * delta;
                particle.y += particle.speedY * delta;

                if (particle.x < -4) particle.x = width + 4;
                if (particle.x > width + 4) particle.x = -4;
                if (particle.y < -4) particle.y = height + 4;
                if (particle.y > height + 4) particle.y = -4;

                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                context.fill();
            });

            animationFrame = window.requestAnimationFrame(draw);
        };

        rebuildField();
        animationFrame = window.requestAnimationFrame(draw);
        window.addEventListener('resize', rebuildField, { passive: true });
        window.addEventListener('pagehide', () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
        });
    }

});