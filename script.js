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
       Project filters + show more
    ---------------------------------------- */
    const projectsGrid = document.getElementById('projectsGrid');
    const showMoreBtn = document.getElementById('showMoreProjects');
    const filterChips = Array.from(document.querySelectorAll('.filter-chip'));
    let setProjectFilter = () => {};

    if (projectsGrid && showMoreBtn) {
        const cards = Array.from(projectsGrid.querySelectorAll('.project'));
        const btnText = showMoreBtn.querySelector('.show-more-text');
        const btnCount = showMoreBtn.querySelector('.show-more-count');
        const extraCount = cards.filter(c => c.hasAttribute('data-extra')).length;
        const matches = (card, f) => f === 'all' || `${card.dataset.platform} ${card.dataset.industry}`.includes(f);
        let filter = 'all';
        let expanded = false;

        filterChips.forEach(chip => {
            const n = cards.filter(c => matches(c, chip.dataset.filter)).length;
            chip.insertAdjacentHTML('beforeend', ` <span class="filter-count">${n}</span>`);
        });

        const render = (animate) => {
            let delay = 0;
            cards.forEach(card => {
                const show = matches(card, filter) && (filter !== 'all' || expanded || !card.hasAttribute('data-extra'));
                const wasHidden = card.hidden;
                card.hidden = !show;
                if (show && wasHidden && animate && !reduceMotion) {
                    card.classList.add('visible');
                    card.classList.remove('is-entering');
                    card.style.animationDelay = `${delay}ms`;
                    void card.offsetWidth;
                    card.classList.add('is-entering');
                    delay += 50;
                } else if (show) {
                    card.classList.add('visible');
                }
            });
            filterChips.forEach(chip => {
                const on = chip.dataset.filter === filter;
                chip.classList.toggle('active', on);
                chip.setAttribute('aria-pressed', String(on));
            });
            showMoreBtn.parentElement.hidden = filter !== 'all';
            showMoreBtn.setAttribute('aria-expanded', String(expanded));
            btnText.textContent = expanded ? 'Show less' : 'Show more projects';
            btnCount.textContent = expanded ? '−' : '+' + extraCount;
        };

        setProjectFilter = (f, expand) => {
            filter = f;
            if (expand !== undefined) expanded = expand;
            render(true);
        };

        filterChips.forEach(chip => chip.addEventListener('click', () => setProjectFilter(chip.dataset.filter)));

        showMoreBtn.addEventListener('click', () => {
            expanded = !expanded;
            render(true);
            if (!expanded) {
                const projects = document.getElementById('projects');
                if (projects) projects.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        });

        render(false);
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
       Futuristic interaction layer
    ======================================== */
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* Scroll progress bar + timeline fill */
    const progressBar = document.getElementById('scrollProgress');
    const timeline = document.querySelector('.timeline');
    let progressQueued = false;
    const updateProgress = () => {
        progressQueued = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar) progressBar.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
        if (timeline) {
            const r = timeline.getBoundingClientRect();
            const p = Math.min(Math.max((window.innerHeight * 0.65 - r.top) / r.height, 0), 1);
            timeline.style.setProperty('--timeline', p.toFixed(3));
        }
    };
    window.addEventListener('scroll', () => {
        if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    /* Cursor spotlight on glass cards */
    if (finePointer) {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - r.left}px`);
                card.style.setProperty('--my', `${e.clientY - r.top}px`);
            });
        });
    }

    /* 3D tilt on project cards + magnetic buttons */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.project').forEach(card => {
            card.addEventListener('pointerenter', () => card.classList.add('tilt-ready'));
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
                card.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`);
            });
            card.addEventListener('pointerleave', () => {
                card.style.removeProperty('--rx');
                card.style.removeProperty('--ry');
            });
        });

        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('pointermove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - (r.left + r.width / 2);
                const y = e.clientY - (r.top + r.height / 2);
                btn.style.transform = `translate(${(x * 0.2).toFixed(1)}px, ${(y * 0.3).toFixed(1)}px)`;
            });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
        });
    }

    /* Decode effect on mono labels as they scroll in */
    const GLYPHS = '!<>-_/[]{}=+*^?#01';
    const decode = (node) => {
        const target = node.nodeValue;
        let frame = 0;
        const total = 20;
        const tick = () => {
            frame++;
            const done = Math.floor((frame / total) * target.length);
            node.nodeValue = target.split('').map((c, i) =>
                (c === ' ' || i < done) ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
            if (frame < total) requestAnimationFrame(tick);
            else node.nodeValue = target;
        };
        tick();
    };
    if (!reduceMotion && 'IntersectionObserver' in window) {
        const decodeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const textNode = Array.from(entry.target.childNodes).reverse().find(n => n.nodeType === 3 && n.nodeValue.trim());
                if (textNode) decode(textNode);
                decodeObserver.unobserve(entry.target);
            });
        }, { threshold: 1 });
        document.querySelectorAll('.eyebrow, .terminal-title').forEach(el => decodeObserver.observe(el));
    }

    /* Hero neural-network canvas — reacts to the cursor, pulses on click */
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas && heroCanvas.getContext) {
        const ctx = heroCanvas.getContext('2d');
        const hero = heroCanvas.parentElement;
        const pointer = { x: 0, y: 0, active: false };
        const pulses = [];
        const LINK = 130;
        const REACH = 170;
        let w = 0, h = 0, nodes = [], running = false, inView = true, rgbA = [34, 211, 238], rgbB = [167, 139, 250], light = false;

        const toRgb = (hex) => {
            let m = hex.trim().replace('#', '');
            if (m.length === 3) m = m.split('').map(c => c + c).join('');
            const n = parseInt(m, 16);
            return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
        };
        const readColors = () => {
            const cs = getComputedStyle(root);
            rgbA = toRgb(cs.getPropertyValue('--accent') || '#22d3ee');
            rgbB = toRgb(cs.getPropertyValue('--accent-2') || '#a78bfa');
            light = root.getAttribute('data-theme') === 'light';
        };
        const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = hero.offsetWidth;
            h = hero.offsetHeight;
            heroCanvas.width = Math.round(w * dpr);
            heroCanvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.max(28, Math.min(110, Math.round((w * h) / 12500)));
            nodes = Array.from({ length: count }, () => {
                const vx = (Math.random() - 0.5) * 0.36;
                const vy = (Math.random() - 0.5) * 0.36;
                return { x: Math.random() * w, y: Math.random() * h, vx, vy, bx: vx, by: vy, r: Math.random() * 1.4 + 0.7 };
            });
        };

        const frame = () => {
            ctx.clearRect(0, 0, w, h);
            const strength = light ? 0.55 : 1;

            nodes.forEach(n => {
                if (pointer.active) {
                    const dx = n.x - pointer.x, dy = n.y - pointer.y;
                    const d = Math.hypot(dx, dy);
                    if (d < REACH * 0.6 && d > 0.1) {
                        const f = (1 - d / (REACH * 0.6)) * 0.9;
                        n.vx += (dx / d) * f * 0.08;
                        n.vy += (dy / d) * f * 0.08;
                    }
                }
                pulses.forEach(p => {
                    const dx = n.x - p.x, dy = n.y - p.y;
                    const d = Math.hypot(dx, dy);
                    if (Math.abs(d - p.r) < 18 && d > 0.1) { n.vx += (dx / d) * 0.5; n.vy += (dy / d) * 0.5; }
                });
                // ease back toward drift speed
                n.vx = n.vx * 0.96 + n.bx * 0.04;
                n.vy = n.vy * 0.96 + n.by * 0.04;
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx); n.bx = Math.abs(n.bx); }
                if (n.x > w) { n.x = w; n.vx = -Math.abs(n.vx); n.bx = -Math.abs(n.bx); }
                if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy); n.by = Math.abs(n.by); }
                if (n.y > h) { n.y = h; n.vy = -Math.abs(n.vy); n.by = -Math.abs(n.by); }
            });

            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j++) {
                    const b = nodes[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dsq = dx * dx + dy * dy;
                    if (dsq < LINK * LINK) {
                        ctx.strokeStyle = rgba(rgbA, (1 - Math.sqrt(dsq) / LINK) * 0.22 * strength);
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                    }
                }
            }

            if (pointer.active) {
                nodes.forEach(n => {
                    const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
                    if (d < REACH) {
                        ctx.strokeStyle = rgba(rgbB, (1 - d / REACH) * 0.55 * strength);
                        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
                    }
                });
                const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 90);
                g.addColorStop(0, rgba(rgbB, 0.16 * strength));
                g.addColorStop(1, rgba(rgbB, 0));
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 90, 0, Math.PI * 2); ctx.fill();
            }

            nodes.forEach(n => {
                ctx.fillStyle = rgba(rgbA, 0.75 * strength);
                ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
            });

            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.r += 6;
                const life = 1 - p.r / 320;
                if (life <= 0) { pulses.splice(i, 1); continue; }
                ctx.strokeStyle = rgba(rgbA, life * 0.6 * strength);
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
                ctx.lineWidth = 1;
            }

            if (running) requestAnimationFrame(frame);
        };

        const start = () => {
            if (running || reduceMotion || !inView || document.hidden) return;
            running = true;
            requestAnimationFrame(frame);
        };
        const stop = () => { running = false; };

        readColors();
        resize();
        if (reduceMotion) frame(); else start();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { resize(); if (reduceMotion) frame(); }, 150);
        });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => {
                inView = entry.isIntersecting;
                if (inView) start(); else stop();
            }).observe(hero);
        }
        document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
        new MutationObserver(() => { readColors(); if (reduceMotion) frame(); })
            .observe(root, { attributes: true, attributeFilter: ['data-theme'] });

        if (finePointer && !reduceMotion) {
            hero.addEventListener('pointermove', (e) => {
                const r = hero.getBoundingClientRect();
                pointer.x = e.clientX - r.left;
                pointer.y = e.clientY - r.top;
                pointer.active = true;
            });
            hero.addEventListener('pointerleave', () => { pointer.active = false; });
        }
        if (!reduceMotion) {
            hero.addEventListener('pointerdown', (e) => {
                if (e.target.closest('a, button, input, form, .terminal')) return;
                const r = hero.getBoundingClientRect();
                pulses.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0 });
            });
        }
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
            reply: () => `<p>Jason Jay Ababao is a full-stack web developer based in Naawan, Philippines, with 5+ years of experience. He's shipped 14 live client sites with agencies and direct clients in Australia, Canada, Ireland, the Philippines and beyond.</p><p>He started in graphic design, so he cares about how things look as much as how they work.</p>`,
        },
        {
            id: 'ai',
            words: ['ai', 'ai tool', 'artificial intelligence', 'claude', 'claude code', 'codex', 'chatgpt', 'gpt', 'gemini', 'cursor', 'copilot', 'llm', 'agent', 'vibe coding'],
            reply: () => `<p>Jason builds with AI in the loop — it speeds up planning, coding, reviews and debugging, while he stays responsible for the quality of what ships.</p><ul><li>Claude Code &amp; Codex — coding agents</li><li>Cursor — AI-first editor</li><li>ChatGPT &amp; Gemini — research, copy and problem-solving</li></ul><p>Next on his <a href="#roadmap" data-close-chat>AI roadmap</a>: LLM APIs, AI agents &amp; MCP, RAG and the Next.js stack.</p>`,
        },
        {
            id: 'crm',
            words: ['crm', 'hubspot', 'gohighlevel', 'go high level', 'ghl', 'automation', 'pipeline', 'leads', 'funnel', 'email marketing'],
            reply: () => `<p>For CRM and automation Jason works with <strong>HubSpot</strong> and <strong>GoHighLevel</strong> — lead pipelines, forms and follow-up automation connected to the website.</p>`,
        },
        {
            id: 'learning',
            words: ['learning', 'learn', 'studying', 'study', 'roadmap', 'upskill', 'future', 'mcp', 'rag', 'langchain', 'langgraph', 'vector', 'embedding', 'next.js', 'nextjs', 'react', 'typescript', 'tailwind', 'n8n', 'zapier', 'supabase', 'openai api', 'claude api', 'ai sdk', 'v0', 'lovable', 'chatbot', 'ai app', 'ai feature'],
            reply: () => `<p>Jason is actively studying the AI development skills clients hire for today — learning them in public rather than claiming them:</p><ul><li>LLM APIs — Claude, OpenAI, Gemini, Vercel AI SDK</li><li>AI agents &amp; MCP — tool calling, Claude Agent SDK, LangGraph</li><li>RAG &amp; vector search — embeddings, pgvector, Supabase</li><li>AI-ready stack — TypeScript, React, Next.js, Tailwind</li><li>AI automation — n8n, Make, Zapier, HubSpot Breeze, GHL Conversation AI</li><li>Prototyping &amp; evals — v0, Bolt, Lovable</li></ul><p><a href="#roadmap" data-close-chat>See the AI roadmap →</a></p>`,
        },
        {
            id: 'skills',
            words: ['stack', 'skill', 'tech', 'technologies', 'tools', 'languages', 'framework'],
            reply: () => `<p>The core stack:</p><ul><li>Front-end: HTML5, CSS3, JavaScript, jQuery, Bootstrap</li><li>Back-end: PHP, Laravel, SQL, REST APIs</li><li>CMS: WordPress, Elementor Pro, WooCommerce, ACF</li><li>Commerce: Shopify, Liquid, Hydrogen</li><li>AI tools: Claude Code, Codex, ChatGPT, Gemini, Cursor</li><li>Learning now: LLM APIs, AI agents &amp; MCP, RAG, Next.js — <a href="#roadmap" data-close-chat>roadmap</a></li><li>CRM: HubSpot, GoHighLevel</li><li>Also: SEO, analytics, Figma, Git</li></ul>`,
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
            id: 'healthcare',
            words: ['healthcare', 'health', 'medical', 'clinic', 'dialysis', 'hospital', 'doctor', 'patient'],
            reply: () => `<p>Healthcare work — patient-friendly sites with booking and clear contact options:</p>${listProjects(byIndustry('healthcare'))}`,
        },
        {
            id: 'wellness',
            words: ['wellness', 'fitness', 'beauty', 'skincare', 'pilates'],
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
            words: ['are you ai', 'are you an ai', 'are you a bot', 'are you real', 'are you human'],
            reply: () => `<p>I'm a lightweight scripted assistant — I match your question to answers written from this portfolio. Nothing you type leaves your browser. For anything I can't answer, Jason's a message away.</p>`,
        },
        {
            id: 'thanks',
            words: ['thanks', 'thank you', 'cool', 'great', 'awesome', 'nice', 'perfect'],
            reply: () => `<p>Anytime! Anything else you'd like to know?</p>`,
        },
    ];

    const SUGGESTIONS = {
        start: ['What AI tools do you use?', 'What Shopify work have you done?', 'Are you available?', 'What are you learning?'],
        after: ['Show me travel projects', 'How much does a site cost?', 'What are you learning?', 'Contact'],
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

    /* ========================================
       Command palette (⌘K / Ctrl+K)
    ======================================== */
    const palette = document.getElementById('palette');
    const paletteInput = document.getElementById('paletteInput');
    const paletteList = document.getElementById('paletteList');
    const paletteOpenBtn = document.getElementById('paletteOpen');

    if (palette && paletteInput && paletteList) {
        const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
        document.querySelectorAll('.kbd-btn kbd').forEach(k => { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });

        const go = (selector) => {
            const el = document.querySelector(selector);
            if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        };
        const openUrl = (url) => window.open(url, '_blank', 'noopener');

        const ACTIONS = [
            { group: 'jump to', label: 'About', icon: 'i-arrow', hint: '01', run: () => go('#about') },
            { group: 'jump to', label: 'Skills & tools', icon: 'i-arrow', hint: '02', run: () => go('#skills') },
            { group: 'jump to', label: 'AI roadmap', icon: 'i-arrow', hint: '02.1', run: () => go('#roadmap') },
            { group: 'jump to', label: 'Selected work', icon: 'i-arrow', hint: '03', run: () => go('#projects') },
            { group: 'jump to', label: 'Experience', icon: 'i-arrow', hint: '04', run: () => go('#experience') },
            { group: 'jump to', label: 'Process', icon: 'i-arrow', hint: '05', run: () => go('#process') },
            { group: 'jump to', label: 'Contact', icon: 'i-arrow', hint: '06', run: () => go('#contact') },
            { group: 'actions', label: 'Ask the assistant', icon: 'i-spark', run: () => openChat() },
            { group: 'actions', label: 'Toggle light / dark theme', icon: 'i-sun', run: () => themeToggle && themeToggle.click() },
            { group: 'actions', label: 'Email Jason', icon: 'i-mail', hint: 'mail', run: () => { window.location.href = 'mailto:' + EMAIL; } },
            { group: 'actions', label: 'Message on WhatsApp', icon: 'i-whatsapp', run: () => openUrl('https://wa.me/639674298088') },
            { group: 'actions', label: 'Show all projects', icon: 'i-layers', run: () => { setProjectFilter('all', true); go('#projects'); } },
        ];
        filterChips.filter(c => c.dataset.filter !== 'all').forEach(chip => {
            const name = chip.firstChild.nodeValue.trim();
            ACTIONS.push({ group: 'filter work', label: `Show ${name} projects`, icon: 'i-search', run: () => { setProjectFilter(chip.dataset.filter); go('#projects'); } });
        });
        projects.forEach(p => {
            ACTIONS.push({ group: 'projects', label: p.title, icon: 'i-external', hint: p.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), run: () => openUrl(p.url) });
        });

        let results = [];
        let activeIdx = 0;
        let paletteLastFocus = null;

        const renderPalette = () => {
            const q = paletteInput.value.trim().toLowerCase();
            const words = q.split(/\s+/).filter(Boolean);
            results = ACTIONS.filter(a => {
                const hay = `${a.label} ${a.group} ${a.hint || ''}`.toLowerCase();
                return words.every(wd => hay.includes(wd));
            });
            if (q) {
                results.push({ group: 'assistant', label: `Ask: “${paletteInput.value.trim()}”`, icon: 'i-spark', run: () => openChat(paletteInput.value.trim()) });
            }
            activeIdx = Math.min(activeIdx, Math.max(results.length - 1, 0));

            let html = '';
            let lastGroup = '';
            results.forEach((a, i) => {
                if (a.group !== lastGroup) { html += `<li class="palette-group" role="presentation">${a.group}</li>`; lastGroup = a.group; }
                html += `<li class="palette-item" role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === activeIdx}"><svg class="icon"><use href="#${a.icon}" /></svg><span>${esc(a.label)}</span>${a.hint ? `<small>${esc(a.hint)}</small>` : ''}</li>`;
            });
            paletteList.innerHTML = html || '<li class="palette-empty">No matches.</li>';
            paletteInput.setAttribute('aria-activedescendant', results.length ? `pal-${activeIdx}` : '');
        };

        const setActive = (i) => {
            if (!results.length) return;
            activeIdx = (i + results.length) % results.length;
            paletteList.querySelectorAll('.palette-item').forEach(el => el.setAttribute('aria-selected', String(+el.dataset.i === activeIdx)));
            const el = document.getElementById(`pal-${activeIdx}`);
            if (el) el.scrollIntoView({ block: 'nearest' });
            paletteInput.setAttribute('aria-activedescendant', `pal-${activeIdx}`);
        };

        const openPalette = () => {
            if (!palette.hidden) return;
            paletteLastFocus = document.activeElement;
            palette.hidden = false;
            paletteInput.value = '';
            activeIdx = 0;
            renderPalette();
            paletteInput.focus();
        };
        const closePalette = (restore = true) => {
            palette.hidden = true;
            if (restore && paletteLastFocus && document.contains(paletteLastFocus)) paletteLastFocus.focus();
        };
        const runActive = (i = activeIdx) => {
            const action = results[i];
            if (!action) return;
            closePalette(false);
            action.run();
        };

        if (paletteOpenBtn) paletteOpenBtn.addEventListener('click', openPalette);
        palette.addEventListener('click', (e) => {
            if (e.target.closest('[data-palette-close]')) { closePalette(); return; }
            const item = e.target.closest('.palette-item');
            if (item) runActive(+item.dataset.i);
        });
        paletteList.addEventListener('mousemove', (e) => {
            const item = e.target.closest('.palette-item');
            if (item && +item.dataset.i !== activeIdx) setActive(+item.dataset.i);
        });
        paletteInput.addEventListener('input', () => { activeIdx = 0; renderPalette(); });
        paletteInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIdx - 1); }
            else if (e.key === 'Enter') { e.preventDefault(); runActive(); }
            else if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
            else if (e.key === 'Tab') { e.preventDefault(); }
        });
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (palette.hidden) openPalette(); else closePalette();
            }
        });
    }
})();
