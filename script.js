/* ========================================
   Portfolio — Jason Jay Ababao
   Interaction layer
======================================== */
(function () {
    'use strict';

    /* ----------------------------------------
       Footer year
    ---------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ----------------------------------------
       Sticky nav shadow on scroll
    ---------------------------------------- */
    const nav = document.getElementById('nav');
    const onScroll = () => {
        if (window.scrollY > 24) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ----------------------------------------
       Mobile menu toggle
    ---------------------------------------- */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.classList.remove('open');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                menuToggle.classList.remove('open');
            }
        });
    }

    /* ----------------------------------------
       Smooth scroll for in-page anchors
       (also corrects offset for fixed nav)
    ---------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const navHeight = nav ? nav.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        });
    });

    /* ----------------------------------------
       Reveal-on-scroll animations
    ---------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 60);
                    io.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* ----------------------------------------
       Active nav link based on scroll position
    ---------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    const setActiveLink = () => {
        const scrollPos = window.scrollY + (nav ? nav.offsetHeight : 0) + 80;
        let current = '';

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = section.getAttribute('id');
            }
        });

        navLinkEls.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    /* ----------------------------------------
       Show More Projects toggle
    ---------------------------------------- */
    const showMoreBtn = document.getElementById('showMoreProjects');
    const projectsExtra = document.getElementById('projectsExtra');

    if (showMoreBtn && projectsExtra) {
        const btnText = showMoreBtn.querySelector('.show-more-text');
        const btnCount = showMoreBtn.querySelector('.show-more-count');
        const hiddenCount = projectsExtra.querySelectorAll('.project-card').length;

        showMoreBtn.addEventListener('click', () => {
            const isHidden = projectsExtra.hasAttribute('hidden');

            if (isHidden) {
                projectsExtra.removeAttribute('hidden');
                showMoreBtn.classList.add('expanded');
                showMoreBtn.setAttribute('aria-expanded', 'true');
                btnText.textContent = 'Show Less';
                btnCount.textContent = '−';

                // Reveal animation on the newly visible cards
                projectsExtra.querySelectorAll('.reveal').forEach((el, i) => {
                    setTimeout(() => el.classList.add('visible'), i * 80);
                });
            } else {
                projectsExtra.setAttribute('hidden', '');
                showMoreBtn.classList.remove('expanded');
                showMoreBtn.setAttribute('aria-expanded', 'false');
                btnText.textContent = 'Show More Projects';
                btnCount.textContent = '+' + hiddenCount;

                // Reset reveal state so they animate again next time
                projectsExtra.querySelectorAll('.reveal').forEach(el => el.classList.remove('visible'));

                // Scroll back to projects section
                const projects = document.getElementById('projects');
                if (projects) {
                    const navH = nav ? nav.offsetHeight : 0;
                    window.scrollTo({
                        top: projects.getBoundingClientRect().top + window.scrollY - navH - 12,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    /* ----------------------------------------
       Contact form (frontend-only handler)
    ---------------------------------------- */
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const subject = form.subject.value.trim();
            const message = form.message.value.trim();

            status.classList.remove('error');

            if (!name || !email || !subject || !message) {
                status.textContent = 'Please fill in all fields.';
                status.classList.add('error');
                return;
            }

            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!emailValid) {
                status.textContent = 'Please enter a valid email address.';
                status.classList.add('error');
                return;
            }

            // Simulate sending — replace with real submit logic if needed
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';

            setTimeout(() => {
                status.textContent = 'Thanks! Your message has been sent. I will reply within 24 hours.';
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                setTimeout(() => { status.textContent = ''; }, 6000);
            }, 1100);
        });
    }

    /* ----------------------------------------
       Cursor glow that follows mouse (desktop)
    ---------------------------------------- */
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow &&
        window.matchMedia('(hover: hover) and (min-width: 768px)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

        let glowX = window.innerWidth / 2;
        let glowY = window.innerHeight / 2;
        let targetX = glowX;
        let targetY = glowY;
        let glowActive = false;

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!glowActive) {
                cursorGlow.classList.add('active');
                glowActive = true;
            }
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('active');
            glowActive = false;
        });

        const animateGlow = () => {
            glowX += (targetX - glowX) * 0.12;
            glowY += (targetY - glowY) * 0.12;
            cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateGlow);
        };
        animateGlow();
    }

    /* ----------------------------------------
       Animated stat counters
    ---------------------------------------- */
    const counters = document.querySelectorAll('.stat-num[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const duration = 1400;
                const start = performance.now();

                const tick = (now) => {
                    const t = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - t, 3);
                    el.textContent = Math.round(target * eased);
                    if (t < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    /* ----------------------------------------
       3D tilt on project cards (desktop)
    ---------------------------------------- */
    if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

        const tiltCards = document.querySelectorAll('.project-card');
        const MAX_TILT = 6;

        tiltCards.forEach(card => {
            let raf = null;

            const onMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                const rotateY = (x - 0.5) * MAX_TILT * 2;
                const rotateX = (0.5 - y) * MAX_TILT * 2;

                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
                });
            };

            const onLeave = () => {
                if (raf) cancelAnimationFrame(raf);
                card.style.transform = '';
            };

            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
        });
    }

    /* ----------------------------------------
       Subtle parallax on hero orbs
    ---------------------------------------- */
    const orbs = document.querySelectorAll('.orb');
    let ticking = false;

    const moveOrbs = (e) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;

            orbs.forEach((orb, i) => {
                const depth = (i + 1) * 0.6;
                orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });

            ticking = false;
        });
    };

    if (window.matchMedia('(min-width: 768px)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('mousemove', moveOrbs);
    }
})();
