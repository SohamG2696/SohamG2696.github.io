document.addEventListener('DOMContentLoaded', () => {
    
    // --- SET CURRENT YEAR IN FOOTER ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- STICKY NAVBAR ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            // Toggle icon between bars and times (close)
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // --- SCROLL REVEAL ANIMATION (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                
                // If the revealed element contains skill progress bars, animate them
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                if (progressBars.length > 0) {
                    progressBars.forEach(bar => {
                        const targetWidth = bar.style.getPropertyValue('--target-width');
                        bar.style.width = targetWidth || bar.style.width;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- ACTIVE LIGHT ON NAVIGATION BASED ON SCROLL POSITION ---
    const sections = document.querySelectorAll('section, header');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

});

// --- CHAIN BREAKING CURSOR ANIMATION ---
(function() {
    const particles = [];
    let lastX = window.innerWidth / 2, lastY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 15) { 
            createChainParticle(e.clientX, e.clientY, dx, dy);
            lastX = e.clientX;
            lastY = e.clientY;
        }
    });

    function createChainParticle(x, y, dx, dy) {
        const p = document.createElement('div');
        p.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 2px;
            background: #00ADB5;
            box-shadow: 0 0 8px #00ADB5;
            pointer-events: none;
            z-index: 9999;
            border-radius: 2px;
            transform-origin: center;
        `;
        document.body.appendChild(p);

        const angle = Math.atan2(dy, dx);
        
        const particle = {
            el: p,
            x: x,
            y: y,
            vx: -Math.cos(angle) * (Math.random() * 3 + 1) + (Math.random() - 0.5) * 2, // scatter backwards and randomly
            vy: -Math.sin(angle) * (Math.random() * 3 + 1) - 2, // shatter upwards and backwards
            life: 1.0,
            rotation: angle * 180 / Math.PI,
            rotVel: (Math.random() - 0.5) * 30
        };
        particles.push(particle);
    }

    function animateChain() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.vy += 0.2; // gravity dropping the broken links
            p.y += p.vy;
            p.life -= 0.025; // fade
            p.rotation += p.rotVel;

            p.el.style.transform = `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.life})`;
            p.el.style.opacity = p.life;

            if (p.life <= 0) {
                p.el.remove();
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animateChain);
    }
    requestAnimationFrame(animateChain);
})();
