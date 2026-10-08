/* ========================================
   Portfolio — Jason Jay Ababao
   Interaction layer
======================================== */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const nav = document.getElementById('nav');

    /* ----------------------------------------
       Footer year
    ---------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ----------------------------------------
       Theme toggle (dark default, remembers choice)
    ---------------------------------------- */
    const themeToggle = document.getElementById('themeToggle');
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#F7F8FA' : '#0A0B0F');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
        }
    };
    applyTheme(root.getAttribute('data-theme') || 'dark');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
        });
    }

    /* ----------------------------------------
       Nav background on scroll
    ---------------------------------------- */
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ----------------------------------------
       Mobile menu
    ---------------------------------------- */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    const setMenu = (open) => {
        navLinks.classList.toggle('open', open);
        nav.classList.toggle('menu-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('open')) setMenu(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                setMenu(false);
                menuToggle.focus();
            }
        });
    }

    /* ----------------------------------------
       Reveal-on-scroll
    ---------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (!entry.isIntersecting) return;
                setTimeout(() => entry.target.classList.add('visible'), i * 70);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* ----------------------------------------
       Active nav link
    ---------------------------------------- */
    const sections = document.querySelectorAll('main section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    const setActiveLink = () => {
        const scrollPos = window.scrollY + nav.offsetHeight + 80;
        let current = '';
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                current = section.id;
            }
        });
        navLinkEls.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    };
    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    /* ----------------------------------------
       Animated stat counters
    ---------------------------------------- */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const start = performance.now();
                const tick = (now) => {
                    const t = Math.min((now - start) / 1200, 1);
                    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
                    if (t < 1) requestAnimationFrame(tick);
                };
                el.textContent = '0';
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(el => counterObserver.observe(el));
    }

    /* ----------------------------------------
       Hero terminal — types out the intro once
    ---------------------------------------- */
    const terminalBody = document.getElementById('terminalBody');
    if (terminalBody && !reduceMotion) {
        const lines = Array.from(terminalBody.querySelectorAll('.t-line'));
        const caret = document.createElement('span');
        caret.className = 't-caret';
        caret.setAttribute('aria-hidden', 'true');

        // Collect text nodes per line so markup (colored spans) is preserved while typing
        const plan = lines.map(line => {
            const nodes = [];
            const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) nodes.push({ node: walker.currentNode, text: walker.currentNode.nodeValue });
            nodes.forEach(n => { n.node.nodeValue = ''; });
            line.hidden = true;
            return nodes;
        });

        let li = 0, ni = 0, ci = 0;
        const step = () => {
            if (li >= lines.length) { lines[lines.length - 1].appendChild(caret); return; }
            const line = lines[li];
            line.hidden = false;
            const nodes = plan[li];
            if (ni >= nodes.length) {
                li++; ni = 0; ci = 0;
                setTimeout(step, li === 1 ? 380 : 160);
                return;
            }
            const n = nodes[ni];
            n.node.nodeValue = n.text.slice(0, ++ci);
            line.appendChild(caret);
            if (ci >= n.text.length) { ni++; ci = 0; }
            setTimeout(step, li === 0 ? 70 : 16);
        };

        setTimeout(step, 500);
    }

    /* ----------------------------------------
       Show more projects
    ---------------------------------------- */
    const showMoreBtn = document.getElementById('showMoreProjects');
    const projectsExtra = document.getElementById('projectsExtra');

    if (showMoreBtn && projectsExtra) {
        const btnText = showMoreBtn.querySelector('.show-more-text');
        const btnCount = showMoreBtn.querySelector('.show-more-count');
        const hiddenCount = projectsExtra.querySelectorAll('.project').length;
        btnCount.textContent = '+' + hiddenCount;

        showMoreBtn.addEventListener('click', () => {
            const opening = projectsExtra.hidden;
            projectsExtra.hidden = !opening;
            showMoreBtn.setAttribute('aria-expanded', String(opening));
            btnText.textContent = opening ? 'Show less' : 'Show more projects';
            btnCount.textContent = opening ? '−' : '+' + hiddenCount;

            if (!opening) {
                const projects = document.getElementById('projects');
                if (projects) projects.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        });
    }

    /* ----------------------------------------
       Contact form — composes an email (no backend)
    ---------------------------------------- */
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const EMAIL = 'jasonjay.ababao1968@gmail.com';

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = ['name', 'email', 'subject', 'message'].map(n => form.elements[n]);
            const values = fields.map(f => f.value.trim());
            fields.forEach(f => f.removeAttribute('aria-invalid'));
            status.classList.remove('error');

            const empty = fields.filter((f, i) => !values[i]);
            if (empty.length) {
                empty.forEach(f => f.setAttribute('aria-invalid', 'true'));
                status.textContent = 'Please fill in all fields.';
                status.classList.add('error');
                empty[0].focus();
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[1])) {
                fields[1].setAttribute('aria-invalid', 'true');
                status.textContent = 'Please enter a valid email address.';
                status.classList.add('error');
                fields[1].focus();
                return;
            }

            const [name, email, subject, message] = values;
            const body = `${message}\n\n— ${name}\n${email}`;
            window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            status.textContent = 'Your email app should open with the message ready — just hit send.';
        });
    }

    /* ========================================
       Portfolio assistant (scripted, runs locally)
    ======================================== */
    const chatLauncher = document.getElementById('chatLauncher');
    const chatPanel = document.getElementById('chatPanel');
    const chatClose = document.getElementById('chatClose');
    const chatLog = document.getElementById('chatLog');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatSuggestions = document.getElementById('chatSuggestions');

    if (!chatPanel) return;

    const esc = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // Project data read straight from the cards, so the assistant never drifts from the page
    const projects = Array.from(document.querySelectorAll('.project')).map(card => {
        const link = card.querySelector('.project-link');
        return {
            title: card.querySelector('h3').textContent.trim(),
            desc: card.querySelector('p').textContent.replace(/\s+/g, ' ').trim(),
            url: link ? link.href : '',
            platform: card.dataset.platform || '',
            industry: card.dataset.industry || '',
            keywords: (card.dataset.keywords || '').split(' ').filter(Boolean),
        };
    });

    const projectLink = (p) => `<a href="${p.url}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a>`;
    const listProjects = (list) => `<ul>${list.map(p => `<li>${projectLink(p)}</li>`).join('')}</ul>`;
    const byPlatform = (k) => projects.filter(p => p.platform.includes(k));
    const byIndustry = (k) => projects.filter(p => p.industry.includes(k));

    const CONTACT_LINE = `<p>Reach Jason on <a href="https://wa.me/639674298088" target="_blank" rel="noopener noreferrer">WhatsApp</a> or <a href="mailto:${EMAIL}">email</a> — or use the <a href="#contact" data-close-chat>contact form</a>.</p>`;

    const INTENTS = [
        {
            id: 'greeting',
            words: ['hi', 'hello', 'hey', 'yo', 'good morning', 'good evening', 'sup'],
            reply: () => `<p>Hey! 👋 I can tell you about Jason's projects, stack, experience, process or availability. What would you like to know?</p>`,
        },
        {
            id: 'about',
            words: ['who is', 'who are you', 'about you', 'about jason', 'about him', 'yourself', 'background', 'introduce', 'bio'],
            reply: () => `<p>Jason Jay Ababao is a full-stack web developer based in Naawan, Philippines, with 5+ years of experience. He's shipped 13 live client sites with 4 agencies, working with clients in Australia, Canada, Ireland and beyond.</p><p>He started in graphic design, so he cares about how things look as much as how they work.</p>`,
        },
        {
            id: 'skills',
            words: ['stack', 'skill', 'tech', 'technologies', 'tools', 'languages', 'framework', 'use', 'know'],
            reply: () => `<p>The core stack:</p><ul><li>Front-end: HTML5, CSS3, JavaScript, jQuery, Bootstrap</li><li>Back-end: PHP, Laravel, SQL, REST APIs</li><li>CMS: WordPress, Elementor Pro, WooCommerce, ACF</li><li>Commerce: Shopify, Liquid, Hydrogen</li><li>Also: SEO, GoHighLevel, analytics, Figma, Git</li></ul>`,
        },
        {
            id: 'shopify',
            words: ['shopify', 'liquid', 'hydrogen', 'store', 'storefront', 'ecommerce', 'e-commerce', 'shop', 'online store'],
            reply: () => `<p>Shopify is a specialty — custom Liquid themes, headless Hydrogen builds, apps and integrations. Live Shopify work:</p>${listProjects(byPlatform('shopify'))}`,
        },
        {
            id: 'wordpress',
            words: ['wordpress', 'wp', 'elementor', 'woocommerce', 'acf', 'cms'],
            reply: () => `<p>Most of Jason's agency work is WordPress + Elementor Pro — custom themes, ACF, WooCommerce and conversion-focused landing pages. Some live examples:</p>${listProjects(byPlatform('wordpress').slice(0, 6))}`,
        },
        {
            id: 'backend',
            words: ['laravel', 'php', 'backend', 'back-end', 'api', 'database', 'sql', 'custom app', 'web app'],
            reply: () => `<p>On the back end Jason works with PHP and Laravel, SQL databases and REST APIs — custom integrations, booking flows, calculators and CRM hookups that sit behind the CMS sites.</p>`,
        },
        {
            id: 'travel',
            words: ['travel', 'tour', 'tourism', 'booking', 'itinerary', 'golf'],
            reply: () => `<p>Travel is a big one — destination pages, itinerary builders and lead-capture funnels:</p>${listProjects(byIndustry('travel'))}`,
        },
        {
            id: 'wellness',
            words: ['wellness', 'health', 'fitness', 'beauty', 'skincare', 'pilates'],
            reply: () => `<p>Wellness and fitness brands Jason has built for:</p>${listProjects(projects.filter(p => /wellness|fitness/.test(p.industry)))}`,
        },
        {
            id: 'property',
            words: ['real estate', 'property', 'rental', 'realty'],
            reply: () => `<p>Property and real-estate work:</p>${listProjects(byIndustry('property'))}`,
        },
        {
            id: 'education',
            words: ['education', 'tutoring', 'tutor', 'school', 'course', 'learning'],
            reply: () => `<p>In education, Jason built ${projectLink(projects.find(p => p.industry.includes('education')))} — tutor booking, SAT prep funnels and parent dashboards on WordPress.</p>`,
        },
        {
            id: 'projects',
            words: ['project', 'work', 'portfolio', 'clients', 'examples', 'site', 'website', 'built', 'case'],
            reply: () => `<p>There are ${projects.length} live client sites on this page. A few highlights:</p>${listProjects(projects.slice(0, 5))}<p><a href="#projects" data-close-chat>See all projects →</a></p>`,
        },
        {
            id: 'experience',
            words: ['experience', 'years', 'agency', 'agencies', 'job', 'career', 'worked', 'employment', 'history', 'resume', 'cv'],
            reply: () => `<ul><li><strong>DG Venture LTD</strong> — WordPress Developer (Apr 2023 – Oct 2025)</li><li><strong>ESTRAT360</strong> — WordPress &amp; Shopify Developer (Apr 2021 – Apr 2023)</li><li><strong>Somenowell Marketing</strong> — SEO Associate (Aug – Dec 2021)</li><li><strong>Estensil Prints and Ads</strong> — Graphic Designer (Apr 2020 – Apr 2021)</li></ul><p><a href="#experience" data-close-chat>Full timeline →</a></p>`,
        },
        {
            id: 'availability',
            words: ['available', 'availability', 'hire', 'hiring', 'freelance', 'free', 'open', 'start', 'book', 'capacity'],
            reply: () => `<p>Yes — Jason is currently <strong>open for freelance projects</strong>, from new builds to redesigns and ongoing maintenance.</p>${CONTACT_LINE}`,
        },
        {
            id: 'pricing',
            words: ['price', 'pricing', 'cost', 'rate', 'budget', 'quote', 'charge', 'fee', 'hourly', 'how much'],
            reply: () => `<p>Pricing depends on scope — a landing page, a full Shopify store and a custom Laravel build are very different jobs. Every project starts with a free discovery call and a written scope, so you know the cost before anything begins.</p>${CONTACT_LINE}`,
        },
        {
            id: 'process',
            words: ['process', 'how do you work', 'workflow', 'steps', 'approach', 'timeline', 'how long', 'deliver'],
            reply: () => `<ul><li><strong>Discovery</strong> — free call, goals, written scope &amp; timeline</li><li><strong>Design</strong> — wireframes, then hi-fi responsive mockups</li><li><strong>Build</strong> — WordPress, Shopify or custom, modular and fast</li><li><strong>Launch</strong> — QA, SEO &amp; analytics, handover video and support</li></ul>`,
        },
        {
            id: 'seo',
            words: ['seo', 'google', 'ranking', 'search', 'performance', 'speed', 'analytics', 'conversion', 'cro'],
            reply: () => `<p>Jason spent time as an SEO associate, so every build ships with on-page SEO, technical fixes, analytics and a performance pass — and conversion in mind from the first wireframe.</p>`,
        },
        {
            id: 'support',
            words: ['maintenance', 'support', 'update', 'fix', 'bug', 'redesign', 'existing site', 'help'],
            reply: () => `<p>Yes — beyond new builds, Jason handles redesigns, fixes, speed improvements and ongoing maintenance for WordPress and Shopify sites. Launches include a handover video and post-launch support.</p>`,
        },
        {
            id: 'location',
            words: ['where', 'location', 'based', 'timezone', 'time zone', 'country', 'philippines', 'remote'],
            reply: () => `<p>Jason is based in Naawan, Misamis Oriental, Philippines (UTC+8) and works remotely with clients in Australia, Canada, Europe and the US.</p>`,
        },
        {
            id: 'contact',
            words: ['contact', 'email', 'whatsapp', 'phone', 'call', 'reach', 'message', 'talk'],
            reply: () => `<p>📧 <a href="mailto:${EMAIL}">${EMAIL}</a><br>💬 <a href="https://wa.me/639674298088" target="_blank" rel="noopener noreferrer">WhatsApp +63 967 429 8088</a></p>`,
        },
        {
            id: 'bot',
            words: ['are you ai', 'are you a bot', 'are you real', 'chatgpt', 'gpt', 'claude', 'llm', 'how do you work bot'],
            reply: () => `<p>I'm a lightweight scripted assistant — I match your question to answers written from this portfolio. Nothing you type leaves your browser. For anything I can't answer, Jason's a message away.</p>`,
        },
        {
            id: 'thanks',
            words: ['thanks', 'thank you', 'cool', 'great', 'awesome', 'nice', 'perfect'],
            reply: () => `<p>Anytime! Anything else you'd like to know?</p>`,
        },
    ];

    const SUGGESTIONS = {
        start: ['What Shopify work have you done?', 'Are you available?', 'What\'s your stack?', 'How do you work?'],
        after: ['Show me travel projects', 'How much does a site cost?', 'Experience', 'Contact'],
    };

    const normalize = (s) => ' ' + s.toLowerCase().replace(/[^\w\s.\-']/g, ' ').replace(/\s+/g, ' ') + ' ';

    const answer = (question) => {
        const q = normalize(question);

        // A specific project mentioned by name wins
        const project = projects.find(p =>
            q.includes(' ' + p.title.toLowerCase() + ' ') || p.keywords.some(k => q.includes(' ' + k + ' '))
        );
        if (project) {
            return `<p><strong>${esc(project.title)}</strong> — ${esc(project.desc)}</p><p>${projectLink(project)} ↗</p>`;
        }

        let best = null;
        let bestScore = 0;
        INTENTS.forEach(intent => {
            let score = 0;
            intent.words.forEach(w => {
                if (q.includes(' ' + w + ' ') || q.includes(' ' + w + 's ')) score += w.includes(' ') ? 2 : 1;
            });
            if (score > bestScore) { best = intent; bestScore = score; }
        });

        if (best) return best.reply();
        return `<p>I'm not sure about that one — I only know what's on this portfolio. Try asking about projects, Shopify or WordPress work, experience, process, pricing or availability.</p>${CONTACT_LINE}`;
    };

    const scrollLog = () => { chatLog.scrollTop = chatLog.scrollHeight; };

    const addMessage = (html, who) => {
        const msg = document.createElement('div');
        msg.className = `msg msg-${who}`;
        msg.innerHTML = html;
        chatLog.appendChild(msg);
        scrollLog();
        return msg;
    };

    const renderSuggestions = (list) => {
        chatSuggestions.innerHTML = '';
        list.forEach(text => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'hint-chip';
            chip.textContent = text;
            chip.addEventListener('click', () => ask(text));
            chatSuggestions.appendChild(chip);
        });
    };

    let busy = false;
    const ask = (question) => {
        question = question.trim();
        if (!question || busy) return;
        busy = true;
        addMessage(`<p>${esc(question)}</p>`, 'user');
        chatSuggestions.innerHTML = '';

        const typing = addMessage('<i></i><i></i><i></i>', 'bot');
        typing.classList.add('msg-typing');
        typing.setAttribute('aria-label', 'Assistant is typing');

        setTimeout(() => {
            typing.remove();
            addMessage(answer(question), 'bot');
            renderSuggestions(SUGGESTIONS.after);
            busy = false;
        }, reduceMotion ? 50 : 550 + Math.random() * 350);
    };

    let greeted = false;
    let lastFocus = null;

    const openChat = (question) => {
        if (chatPanel.hidden) {
            lastFocus = document.activeElement;
            chatPanel.hidden = false;
            chatLauncher.setAttribute('aria-expanded', 'true');
        }
        if (!greeted) {
            greeted = true;
            addMessage(`<p>Hi! I'm Jason's portfolio assistant. Ask me about his projects, stack, experience, pricing or availability.</p>`, 'bot');
            renderSuggestions(SUGGESTIONS.start);
        }
        if (question) ask(question);
        chatInput.focus();
    };

    const closeChat = () => {
        chatPanel.hidden = true;
        chatLauncher.setAttribute('aria-expanded', 'false');
        if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
        else chatLauncher.focus();
    };

    chatLauncher.addEventListener('click', () => openChat());
    chatClose.addEventListener('click', closeChat);
    chatPanel.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChat(); });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        ask(chatInput.value);
        chatInput.value = '';
    });

    // In-answer links that point at the page close the panel first (useful on mobile)
    chatLog.addEventListener('click', (e) => {
        const link = e.target.closest('[data-close-chat]');
        if (link) closeChat();
    });

    // Hero terminal prompt and chips feed straight into the assistant
    const heroAsk = document.getElementById('heroAsk');
    const heroInput = document.getElementById('heroAskInput');
    if (heroAsk) {
        heroAsk.addEventListener('submit', (e) => {
            e.preventDefault();
            const q = heroInput.value.trim();
            heroInput.value = '';
            openChat(q);
        });
    }
    document.querySelectorAll('[data-ask]').forEach(btn => btn.addEventListener('click', () => openChat(btn.dataset.ask)));
    document.querySelectorAll('[data-open-chat]').forEach(btn => btn.addEventListener('click', () => openChat()));
})();
