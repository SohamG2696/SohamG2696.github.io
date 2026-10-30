/** Scroll choreography for Soham's portfolio. Content stays usable without motion libraries. */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s) => document.querySelector(s);
  const all = (s) => [...document.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('#header');
  const hasMotion = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const scrollTo = (target, offset = 0) => {
    window.scrollTo({ top: (typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY) + offset, behavior: reduced.matches ? 'auto' : 'smooth' });
  };
  const updateHeader = () => header?.classList.toggle('scrolled', scrollY > 40);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  all('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    if (link.hasAttribute('data-action')) return;
    const id = link.getAttribute('href');
    const target = id.length > 1 ? document.getElementById(id.slice(1)) : null;
    if (target) { event.preventDefault(); scrollTo(target, id === '#hero' || id === '#portfolio' ? 0 : -80); }
  }));

  const cards = all('.portfolio-preview-card');
  const items = all('.portfolio-nav-item');
  items.forEach((item, i) => {
    item.setAttribute('role', 'button');
    item.tabIndex = 0;
    item.dataset.projectNumber = String(i + 1).padStart(2, '0');
    item.setAttribute('aria-label', `Show project ${i + 1}: ${cards[i].querySelector('h4').textContent}`);
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); item.click(); }
    });
  });
  // Measure the actual node centers so the connector follows every project,
  // including wrapped titles and changes to the number of cards.
  const projectNav = $('.portfolio-nav');
  const sizeProjectTrack = () => {
    const dots = all('.portfolio-nav-dot');
    if (!dots.length || !dots[0].getClientRects().length) return;
    const navBox = projectNav.getBoundingClientRect();
    const first = dots[0].getBoundingClientRect();
    const last = dots[dots.length - 1].getBoundingClientRect();
    const top = first.top + first.height / 2 - navBox.top;
    const height = last.top + last.height / 2 - navBox.top - top;
    projectNav.style.setProperty('--project-track-top', `${top}px`);
    projectNav.style.setProperty('--project-track-height', `${height}px`);
    projectNav.style.setProperty('--project-track-left', `${first.left + first.width / 2 - navBox.left - 1}px`);
  };
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(sizeProjectTrack).observe(projectNav);
  window.addEventListener('resize', sizeProjectTrack, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(sizeProjectTrack);
  sizeProjectTrack();
  let projectTrigger;
  let projectStops = [];
  items.forEach((item, i) => item.addEventListener('click', () => {
    if (projectTrigger) scrollTo(projectTrigger.start + (projectTrigger.end - projectTrigger.start) * projectStops[i]);
    else scrollTo(cards[i], -90);
  }));
  const setProject = (index) => {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
      item.setAttribute('aria-pressed', String(i === index));
    });
    cards.forEach((card, i) => {
      card.inert = !!projectTrigger && i !== index;
      if (projectTrigger) card.setAttribute('aria-hidden', String(i !== index));
      else card.removeAttribute('aria-hidden');
    });
  };

  let motionContext;
  try {
    if (hasMotion) {
      gsap.registerPlugin(ScrollTrigger);
      const mm = motionContext = gsap.matchMedia();
      // Every viewport gets the same scenes. Only an explicit motion preference opts out.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = document.documentElement;
        root.classList.add('motion-ready', 'scroll-scenes');
        // Use the browser's native scroll pipeline. GSAP still scrubs every scene,
        // without intercepting Firefox wheel, keyboard, or nested scroll events.

        const row = $('.services-row');
        const distance = () => Math.max(0, row.scrollWidth - root.clientWidth);
        const sizeScenes = () => {
          const height = window.innerHeight;
          root.style.setProperty('--scene-height', `${height}px`);
          $('#hero').style.height = `${height * 3}px`;
          $('#portfolio').style.height = `${height * (cards.length * 0.85 + 1)}px`;
          $('#services').style.height = `${height + distance() + $('.services-intro').offsetHeight}px`;
          sizeProjectTrack();
        };
        sizeScenes();
        ScrollTrigger.addEventListener('refreshInit', sizeScenes);

        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('#hero-title .word-inner', { yPercent: 110, duration: 1.2, stagger: 0.07 }, 0.15)
          .fromTo('#hero-av-img', { clipPath: 'polygon(0% 100%, 0% 100%, 100% 100%, 0% 100%)', opacity: 0 },
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', opacity: 1, duration: 1.65 }, 0)
          .from('#hero-badge, .hero-subtitle, .hero-supporting-item', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.55)
          .from(header, { y: -25, opacity: 0, duration: 0.8 }, 0.35);

        const heroTimeline = gsap.timeline({ scrollTrigger: {
          trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: 0.55, invalidateOnRefresh: true
        } });
        heroTimeline.to('.hero-container', { scale: 0.5, borderRadius: 0, ease: 'power2.inOut', duration: 1.8 }, 0)
          .fromTo('.hero-collage', { opacity: 0.35 },
            { opacity: 1, ease: 'power2.out', duration: 0.8 }, 0)
          .fromTo('.marquee-col-1', { yPercent: 4 }, { yPercent: -4, ease: 'none', duration: 2 }, 0)
          .fromTo('.marquee-col-2', { yPercent: -4 }, { yPercent: 4, ease: 'none', duration: 2 }, 0);
        // The last 10% holds the complete half-size hero before it leaves the viewport.

        gsap.fromTo('.circle-clip', { yPercent: 0, clipPath: 'ellipse(150% 100% at 50% 100%)' }, {
          yPercent: -65, clipPath: 'ellipse(60% 100% at 50% 100%)', ease: 'power2.out',
          scrollTrigger: { trigger: '#portfolio', start: 'top bottom', end: 'top top', scrub: true }
        });

        // An opacity-only shade keeps the stack depth without rasterizing every
        // image through an animated brightness filter on each scroll frame.
        const cardShades = cards.map((card, i) => {
          const shade = document.createElement('span');
          shade.className = 'portfolio-card-shade';
          shade.setAttribute('aria-hidden', 'true');
          card.append(shade);
          gsap.set(card, { zIndex: i + 1, yPercent: i ? 100 : 0 });
          return shade;
        });
        let active = -1;
        const transitionStarts = [];
        const dwell = 0.45;
        const transition = 1;
        const projectTimeline = gsap.timeline({ scrollTrigger: {
          trigger: '#portfolio', start: 'top top', end: 'bottom bottom', scrub: 0.35, invalidateOnRefresh: true
        }, onUpdate: () => {
          const time = projectTimeline.time();
          const index = transitionStarts.filter(start => time >= start + transition * 0.65).length;
          if (index !== active) { active = index; setProject(index); }
          $('#portfolio-progress').style.transform = `scaleY(${Math.max(0.025, projectTimeline.progress())})`;
        } });
        projectTimeline.addLabel('project-0', dwell / 2);
        for (let i = 1; i < cards.length; i++) {
          const start = dwell + (i - 1) * (transition + dwell);
          transitionStarts.push(start);
          projectTimeline.to(cardShades[i - 1], { opacity: 0.7, duration: transition, ease: 'none' }, start)
            .to(cards[i - 1], { scale: 0.97, yPercent: -3, duration: transition, ease: 'power2.inOut' }, start)
            .to(cards[i], { yPercent: 0, duration: transition, ease: 'power2.inOut' }, start)
            .addLabel(`project-${i}`, start + transition + dwell / 2);
        }
        // Give the last card a short reading stop, then release the sticky scene.
        // Keep its navigation label inside the timeline without a long empty tail.
        projectTimeline.to({}, { duration: dwell / 2 });
        projectTrigger = projectTimeline.scrollTrigger;
        projectStops = cards.map((_, i) => projectTimeline.labels[`project-${i}`] / projectTimeline.duration());
        setProject(0);

        gsap.to(row, { x: () => -distance(), ease: 'none', scrollTrigger: {
          trigger: '.services-sticky', start: 'top top', endTrigger: '#services', end: 'bottom bottom',
          scrub: 0.65, invalidateOnRefresh: true
        } });
        all('.portfolio-header h2, .services-intro h2, .awards-header h2').forEach(el => {
          gsap.from(el, { clipPath: 'inset(0 0 100% 0)', y: 30, duration: 1.15, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
        });
        all('.award-item, .services-intro p, .footer-top').forEach(el => {
          gsap.from(el, { y: 45, opacity: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
        });
        return () => {
          projectTrigger = null;
          root.classList.remove('motion-ready', 'scroll-scenes');
          root.style.removeProperty('--scene-height');
          ['#hero', '#portfolio', '#services'].forEach(id => $(id).style.height = '');
          ScrollTrigger.removeEventListener('refreshInit', sizeScenes);
          cardShades.forEach(shade => shade.remove());
          setProject(0);
        };
      });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }

  } catch (error) {
    console.warn('Scroll animation setup failed; using the readable layout.', error);
    if (motionContext) motionContext.revert();
    document.documentElement.classList.remove('motion-ready', 'scroll-scenes');
    document.documentElement.style.removeProperty('--scene-height');
    all('#hero, #portfolio, #services').forEach(el => el.style.height = '');
    if (hasMotion) gsap.set(all('#header, #hero-av-img, #hero-title .word-inner, #hero-badge, .hero-subtitle, .hero-supporting-item, .hero-container, .hero-collage, .marquee-col-1, .marquee-col-2, .portfolio-preview-card, .services-row, .award-item, .services-intro p, .footer-top, .portfolio-header h2, .services-intro h2, .awards-header h2'), { clearProps: 'all' });
    projectTrigger = null;
    all('.portfolio-card-shade').forEach(shade => shade.remove());
    setProject(0);
  }

  const headline = $('#footer-headline');
  if (headline) {
    const text = headline.textContent.trim();
    headline.setAttribute('aria-label', text);
    headline.textContent = '';
    text.split(/\s+/).forEach(word => {
      const wrap = document.createElement('span'); wrap.className = 'word'; wrap.setAttribute('aria-hidden', 'true');
      [...word].forEach(letter => { const span = document.createElement('span'); span.className = 'char'; span.textContent = letter; wrap.append(span); });
      headline.append(wrap, document.createTextNode(' '));
    });
    const letters = [...headline.querySelectorAll('.char')];
    let hoverFrame = 0;
    let pointerX = 0;
    headline.addEventListener('pointermove', event => {
      if (reduced.matches || event.pointerType === 'touch') return;
      pointerX = event.clientX;
      if (hoverFrame) return;
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0;
        // Read all positions before writing styles to avoid repeated layouts.
        const centers = letters.map(char => {
          const box = char.getBoundingClientRect();
          return box.left + box.width / 2;
        });
        letters.forEach((char, i) => {
          const strength = Math.max(0, 1 - Math.abs(pointerX - centers[i]) / 100);
          char.style.transform = `translateY(${-14 * strength}px)`;
        });
      });
    });
    headline.addEventListener('pointerleave', () => {
      cancelAnimationFrame(hoverFrame);
      hoverFrame = 0;
      letters.forEach(char => char.style.transform = '');
    });
  }
  const contactEmail = $('#footer [data-action="copy-email"]').textContent.trim();
  let toastTimer;
  all('[data-action="copy-email"]').forEach(button => button.addEventListener('click', async event => {
    event.preventDefault();
    const email = contactEmail;
    try {
      await navigator.clipboard.writeText(email);
      const toast = $('#toast-notice'); toast.textContent = `${email} copied to clipboard!`; toast.classList.add('show');
      clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    } catch { location.href = `mailto:${email}`; }
  }));
  const clock = $('#live-ist-clock');
  const updateClock = () => { if (clock) clock.textContent = `${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST`; };
  updateClock(); setInterval(updateClock, 1000);
});
