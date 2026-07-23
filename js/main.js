/* ═══════════════════════════════════════════════
   NIKHIL SOURI — PORTFOLIO ENGINE
   Three.js neural field · GSAP choreography
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ─────────────── THEME ─────────────── */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('yns-theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  const themeColors = () => ({
    particle: root.getAttribute('data-theme') === 'light' ? 0x5b46f0 : 0x7c6cff,
    line: root.getAttribute('data-theme') === 'light' ? 0x0891b2 : 0x33d6ff,
    opacity: root.getAttribute('data-theme') === 'light' ? 0.35 : 0.55,
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('yns-theme', next);
    if (window.__updateSceneTheme) window.__updateSceneTheme();
  });

  /* ─────────────── PRELOADER ─────────────── */
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloaderProgress');
  const statusEl = document.getElementById('preloaderStatus');
  const statuses = [
    'INITIALIZING NEURAL INTERFACE…',
    'LOADING SYNAPTIC WEIGHTS…',
    'CALIBRATING PARTICLE FIELD…',
    'ESTABLISHING CONNECTION…',
    'READY.'
  ];
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 22 + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      statusEl.textContent = statuses[4];
      setTimeout(() => {
        preloader.classList.add('done');
        document.body.classList.add('loaded');
        heroIntro();
      }, 350);
    } else {
      statusEl.textContent = statuses[Math.min(Math.floor(progress / 25), 3)];
    }
    progressBar.style.width = progress + '%';
  }, 180);

  /* ─────────────── CUSTOM CURSOR ─────────────── */
  if (!isTouch && !prefersReducedMotion) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
    window.addEventListener('mousemove', (e) => {
      // only hide the native cursor once the custom one is confirmed tracking
      document.documentElement.classList.add('has-custom-cursor');
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    });
    document.querySelectorAll('a, button, .tilt-card, .skill-chips span, .cube-scene').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  /* ─────────────── THREE.JS NEURAL FIELD ─────────────── */
  if (!prefersReducedMotion && window.THREE) {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 16;

    // Particle cloud — a loose "neural constellation"
    const COUNT = window.innerWidth < 768 ? 140 : 260;
    const RANGE = 22;
    const positions = new Float32Array(COUNT * 3);
    const velocities = [];
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * RANGE * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * RANGE;
      positions[i * 3 + 2] = (Math.random() - 0.5) * RANGE * 0.7;
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.004
      ));
    }
    const baseVelocities = velocities.map((v) => v.clone());
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const colors = themeColors();
    const particleMat = new THREE.PointsMaterial({
      color: colors.particle, size: 0.11, transparent: true,
      opacity: 0.85, sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, particleMat);
    scene.add(points);

    // Connection lines
    const MAX_LINKS = COUNT * 4;
    const linePositions = new Float32Array(MAX_LINKS * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: colors.line, transparent: true, opacity: colors.opacity * 0.35,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // A wireframe icosahedron drifting — the "core"
    const coreGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: colors.particle, wireframe: true, transparent: true, opacity: 0.1,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(7, 1, -4);
    scene.add(core);

    const core2 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.6, 0.4, 80, 12),
      new THREE.MeshBasicMaterial({ color: colors.line, wireframe: true, transparent: true, opacity: 0.07 })
    );
    core2.position.set(-8.5, -3, -6);
    scene.add(core2);

    const core3 = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.8, 0),
      new THREE.MeshBasicMaterial({ color: colors.line, wireframe: true, transparent: true, opacity: 0.12 })
    );
    core3.position.set(-2, 6, -7);
    scene.add(core3);

    const core4 = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.08, 10, 60),
      new THREE.MeshBasicMaterial({ color: colors.particle, wireframe: true, transparent: true, opacity: 0.09 })
    );
    core4.position.set(9, -5, -8);
    core4.rotation.x = 1.1;
    scene.add(core4);

    window.__updateSceneTheme = () => {
      const c = themeColors();
      particleMat.color.setHex(c.particle);
      lineMat.color.setHex(c.line);
      lineMat.opacity = c.opacity * 0.35;
      core.material.color.setHex(c.particle);
      core2.material.color.setHex(c.line);
      core3.material.color.setHex(c.line);
      core4.material.color.setHex(c.particle);
    };

    // Mouse parallax (head tracking can override via window.__sceneParallax)
    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      if (window.__headActive) return;
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.__sceneParallax = (x, y) => { mouse.x = x; mouse.y = y; };

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    // click shockwave — particles blast outward from the click point
    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button, input, textarea, .cube-scene, .nav')) return;
      const cx = (e.clientX / window.innerWidth - 0.5) * 2 * RANGE * 0.9;
      const cy = -(e.clientY / window.innerHeight - 0.5) * 2 * RANGE * 0.5;
      const pos = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        const dx = pos[i * 3] - cx;
        const dy = pos[i * 3 + 1] - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.6;
        const impulse = 0.55 / (dist * dist);
        velocities[i].x += (dx / dist) * impulse;
        velocities[i].y += (dy / dist) * impulse;
      }
    });

    const LINK_DIST = 3.4;
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const pos = geo.attributes.position.array;

      // cursor position projected into particle space
      const mwx = mouse.x * RANGE * 0.9;
      const mwy = -mouse.y * RANGE * 0.5;

      for (let i = 0; i < COUNT; i++) {
        // repulsion field around the cursor
        const dxm = pos[i * 3] - mwx;
        const dym = pos[i * 3 + 1] - mwy;
        const dm2 = dxm * dxm + dym * dym;
        if (dm2 < 14 && dm2 > 0.05) {
          const f = 0.014 / dm2;
          velocities[i].x += dxm * f;
          velocities[i].y += dym * f;
        }
        // ease back toward calm drift
        velocities[i].lerp(baseVelocities[i], 0.02);

        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;
        if (Math.abs(pos[i * 3]) > RANGE) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > RANGE * 0.6) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > RANGE * 0.4) velocities[i].z *= -1;
      }
      geo.attributes.position.needsUpdate = true;

      // rebuild links
      let li = 0;
      for (let i = 0; i < COUNT && li < MAX_LINKS - 1; i++) {
        for (let j = i + 1; j < COUNT && li < MAX_LINKS - 1; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) {
            linePositions[li * 6] = pos[i * 3];
            linePositions[li * 6 + 1] = pos[i * 3 + 1];
            linePositions[li * 6 + 2] = pos[i * 3 + 2];
            linePositions[li * 6 + 3] = pos[j * 3];
            linePositions[li * 6 + 4] = pos[j * 3 + 1];
            linePositions[li * 6 + 5] = pos[j * 3 + 2];
            li++;
          }
        }
      }
      lineGeo.setDrawRange(0, li * 2);
      lineGeo.attributes.position.needsUpdate = true;

      core.rotation.x = t * 0.12;
      core.rotation.y = t * 0.18;
      core2.rotation.x = -t * 0.09;
      core2.rotation.z = t * 0.14;
      core3.rotation.y = t * 0.22;
      core3.rotation.z = -t * 0.1;
      core3.position.y = 6 + Math.sin(t * 0.6) * 0.8;
      core4.rotation.z = t * 0.16;

      // camera drift: mouse parallax + scroll descent
      camera.position.x += (mouse.x * 1.6 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 1.2 - scrollY * 0.0012 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ─────────────── GSAP SETUP ─────────────── */
  gsap.registerPlugin(ScrollTrigger);

  function heroIntro() {
    if (prefersReducedMotion) {
      gsap.set('.reveal-hero', { opacity: 1, y: 0 });
      // reduced motion still shows END STATE, not the initial zeros
      document.querySelectorAll('.stat-num').forEach((el) => { el.textContent = el.dataset.count; });
      const typer = document.getElementById('roleTyper');
      if (typer) typer.textContent = roles[0];
      renderTerminal(true);
      return;
    }
    renderTerminal(false);
    gsap.timeline()
      .to('.reveal-hero', {
        opacity: 1, y: 0, duration: 1,
        stagger: 0.12, ease: 'power3.out',
      })
      .from('.hero-line', {
        yPercent: 110, duration: 1.1, stagger: 0.1, ease: 'power4.out',
      }, 0.15);
    startCounters();
    startTyper();
  }
  gsap.set('.reveal-hero', { y: 36 });

  /* scroll reveals */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 44 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        });
    });

    /* section titles: split-char cascade */
    document.querySelectorAll('[data-split]').forEach((el) => {
      const text = el.textContent;
      el.innerHTML = text.split('').map((ch) =>
        ch === ' ' ? ' ' : `<span style="display:inline-block">${ch}</span>`
      ).join('');
      gsap.from(el.querySelectorAll('span'), {
        yPercent: 100, opacity: 0, duration: 0.7,
        stagger: 0.025, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    /* timeline track fill */
    const track = document.querySelector('.timeline-track');
    if (track) {
      ScrollTrigger.create({
        trigger: '.timeline',
        start: 'top 70%', end: 'bottom 60%',
        onUpdate: (self) => track.style.setProperty('--track-fill', (self.progress * 100) + '%'),
      });
    }
  } else {
    gsap.set('.reveal, .reveal-hero', { opacity: 1 });
  }

  /* ─────────────── COUNTERS ─────────────── */
  function startCounters() {
    document.querySelectorAll('.stat-num').forEach((el) => {
      const target = +el.dataset.count;
      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: target, duration: 1.8, ease: 'power2.out', delay: 0.6,
        onUpdate: () => { el.textContent = Math.round(proxy.v); },
      });
    });
  }

  /* ─────────────── ROLE TYPER ─────────────── */
  const roles = [
    'AI & ML ENGINEER',
    'SYSTEMS PROGRAMMER',
    'EEG × DIFFUSION RESEARCHER',
    'BACKEND DEVELOPER',
    'CLOUD & DEVOPS ENGINEER',
  ];
  function startTyper() {
    const el = document.getElementById('roleTyper');
    if (!el) return;
    let ri = 0, ci = 0, deleting = false;
    function tick() {
      const word = roles[ri];
      el.textContent = word.slice(0, ci);
      if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 1700); return; }
      if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      ci += deleting ? -1 : 1;
      setTimeout(tick, deleting ? 34 : 68);
    }
    tick();
  }
  if (prefersReducedMotion) {
    const el = document.getElementById('roleTyper');
    if (el) el.textContent = roles[0];
  }

  /* ─────────────── HERO TERMINAL ─────────────── */
  const TERM_SEGS = [
    ['t-key', '> whoami\n'],
    ['t-val', 'nikhil_souri --role "AI/ML Engineer"\n\n'],
    ['t-key', '> cat status.json\n'],
    ['', '{\n  '],
    ['t-key', '"location"'], ['', ':    '], ['t-val', '"Karlskrona, SE"'], ['', ',\n  '],
    ['t-key', '"focus"'], ['', ':       '], ['t-val', '"EEG × Diffusion"'], ['', ',\n  '],
    ['t-key', '"internships"'], ['', ': '], ['t-val', '7'], ['', ',\n  '],
    ['t-key', '"projects"'], ['', ':    '], ['t-val', '6'], ['', ',\n  '],
    ['t-key', '"degrees"'], ['', ':     '], ['t-val', '"BTH · JNTUA"'], ['', ',\n  '],
    ['t-key', '"status"'], ['', ':      '], ['t-ok', '"open to work"'], ['', '\n}\n\n'],
    ['t-key', '> '], ['t-cursor', '█'],
  ];
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function renderTerminal(instant) {
    const el = document.getElementById('termBody');
    if (!el) return;
    if (instant) {
      el.innerHTML = TERM_SEGS.map(([c, t]) => c ? `<span class="${c}">${esc(t)}</span>` : esc(t)).join('');
      return;
    }
    let si = 0, ci = 0, done = '';
    (function step() {
      if (si >= TERM_SEGS.length) return;
      const [cls, text] = TERM_SEGS[si];
      ci++;
      const partial = text.slice(0, ci);
      const wrap = (s) => cls ? `<span class="${cls}">${esc(s)}</span>` : esc(s);
      el.innerHTML = done + wrap(partial);
      if (ci >= text.length) { done += wrap(text); si++; ci = 0; }
      if (si < TERM_SEGS.length) {
        const last = partial.slice(-1);
        setTimeout(step, text === '█' ? 400 : (last === '\n' ? 110 : 16 + Math.random() * 34));
      }
    })();
  }

  /* ─────────────── 3D TILT CARDS ─────────────── */
  const tiltEnabled = !isTouch && !prefersReducedMotion;
  function applyTilt(card) {
    const strength = 10;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, {
        rotateY: px * strength, rotateX: -py * strength,
        transformPerspective: 900, duration: 0.45, ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    });
  }
  if (tiltEnabled) {
    document.querySelectorAll('[data-tilt]').forEach(applyTilt);

    /* magnetic buttons */
    document.querySelectorAll('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'elastic.out(1,0.4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'elastic.out(1,0.4)' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ─────────────── NAV BEHAVIOR ─────────────── */
  const nav = document.getElementById('nav');
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (window.scrollY / h * 100) + '%';
  }, { passive: true });

  /* active section highlight */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) =>
          l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => io.observe(s));

  /* mobile menu */
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('.nav-link').forEach((l) =>
    l.addEventListener('click', () => {
      burger.classList.remove('open');
      links.classList.remove('open');
    }));

  /* ─────────────── MARQUEE DUPLICATION ─────────────── */
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) marqueeTrack.innerHTML += marqueeTrack.innerHTML;

  /* ─────────────── INTERACTIVE 3D SKILLS CUBE ─────────────── */
  const cubeScene = document.getElementById('cubeScene');
  const cube = document.getElementById('skillCube');
  if (cubeScene && cube) {
    const setHalf = () => cube.style.setProperty('--half', (cubeScene.offsetWidth / 2) + 'px');
    setHalf();
    window.addEventListener('resize', setHalf);

    let rx = -14, ry = 32;      // rotation
    let vx = 0, vy = 0.14;      // inertia (gentle auto-spin at rest)
    let dragging = false, moved = 0, lx = 0, ly = 0, pressedFace = null;

    function pulseFace(face) {
      if (!face) return;
      face.classList.add('face-active');
      setTimeout(() => face.classList.remove('face-active'), 650);
    }
    function onMove(e) {
      if (!dragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      moved += Math.abs(dx) + Math.abs(dy);
      ry += dx * 0.5;
      rx = Math.max(-88, Math.min(88, rx - dy * 0.5));
      vx = -dy * 0.09; vy = dx * 0.09;
      lx = e.clientX; ly = e.clientY;
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      // a tap (negligible movement) pulses the face that was pressed
      if (moved < 6) pulseFace(pressedFace);
    }
    // capture the actual face on pointerdown (e.target is correct here — no pointer capture)
    cubeScene.addEventListener('pointerdown', (e) => {
      dragging = true; moved = 0;
      lx = e.clientX; ly = e.clientY;
      vx = 0; vy = 0;
      pressedFace = e.target.closest('.cube-face');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      e.preventDefault();
    });

    (function spinCube() {
      requestAnimationFrame(spinCube);
      if (!dragging) {
        rx += vx; ry += vy;
        vx *= 0.94; vy *= 0.94;
        // settle into a lazy idle spin
        if (Math.abs(vy) < 0.14) vy += (0.14 * (vy >= 0 ? 1 : -1) - vy) * 0.02;
        if (Math.abs(vx) < 0.01 && Math.abs(rx) > 0.1) rx *= 0.995;
        rx = Math.max(-88, Math.min(88, rx));
      }
      cube.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    })();
  }

  /* ─────────────── PUBLICATION FILTERS ─────────────── */
  const pubFilters = document.getElementById('pubFilters');
  const pubGrid = document.getElementById('pubGrid');
  if (pubFilters && pubGrid) {
    const cards = Array.from(pubGrid.querySelectorAll('.pub-card'));
    pubFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.pub-filter');
      if (!btn) return;
      const filter = btn.dataset.filter;
      pubFilters.querySelectorAll('.pub-filter').forEach((b) => b.classList.toggle('active', b === btn));
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.status === filter;
        if (show) {
          card.classList.remove('filtered-out');
          if (!prefersReducedMotion) {
            gsap.fromTo(card, { opacity: 0, scale: 0.9, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' });
          }
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  }

  /* ─────────────── TIMELINE EXPAND ─────────────── */
  document.querySelectorAll('.tl-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.timeline-card');
      const open = card.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', open);
      btn.childNodes[0].nodeValue = open ? 'HIDE HIGHLIGHTS ' : 'VIEW HIGHLIGHTS ';
      if (open && window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ─────────────── LIVE GITHUB REPOS ─────────────── */
  (function loadGithub() {
    const grid = document.getElementById('ghRepos');
    if (!grid) return;
    const USER = 'NIKHILSOURI';
    const langColor = (l) => ({
      JavaScript: '#f1e05a', Python: '#3572A5', HTML: '#e34c26', CSS: '#563d7c',
      'Jupyter Notebook': '#DA5B0B', TypeScript: '#3178c6', C: '#555555', 'C++': '#f34b7d',
      Java: '#b07219', Shell: '#89e051',
    }[l] || '#7c6cff');
    const timeAgo = (iso) => {
      const d = (Date.now() - new Date(iso)) / 86400000;
      if (d < 1) return 'today';
      if (d < 30) return Math.floor(d) + 'd ago';
      if (d < 365) return Math.floor(d / 30) + 'mo ago';
      return Math.floor(d / 365) + 'y ago';
    };
    fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=6`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((repos) => {
        if (!Array.isArray(repos) || !repos.length) throw new Error('empty');
        grid.innerHTML = repos.map((r) => `
          <a class="gh-card" href="${r.html_url}" target="_blank" rel="noopener" data-tilt>
            <div class="gh-card-top">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.5 2.5 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.5 2.5 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>
              <span class="gh-name">${esc(r.name)}</span>
            </div>
            <p class="gh-desc">${r.description ? esc(r.description.replace(/\s*—\s*/g, ', ')) : 'No description provided.'}</p>
            <div class="gh-meta mono">
              ${r.language ? `<span class="gh-lang"><i style="background:${langColor(r.language)}"></i>${esc(r.language)}</span>` : ''}
              <span>★ ${r.stargazers_count}</span>
              <span class="gh-updated">↻ ${timeAgo(r.updated_at)}</span>
            </div>
          </a>`).join('');
        if (tiltEnabled) grid.querySelectorAll('[data-tilt]').forEach(applyTilt);
        if (!prefersReducedMotion) {
          gsap.fromTo(grid.querySelectorAll('.gh-card'),
            { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
              scrollTrigger: { trigger: grid, start: 'top 88%', once: true } });
        }
      })
      .catch(() => {
        grid.innerHTML = `<a class="gh-fallback" href="https://github.com/${USER}" target="_blank" rel="noopener">
          View all repositories on GitHub ↗</a>`;
      });
  })();

  /* ─────────────── ORB PARALLAX ─────────────── */
  const orbs = document.querySelectorAll('.orb');
  function setOrbs(nx, ny) {
    orbs.forEach((o) => {
      const d = parseFloat(o.dataset.depth || 0.05);
      o.style.setProperty('--px', (-nx * d * 900) + 'px');
      o.style.setProperty('--py', (-ny * d * 600) + 'px');
    });
  }
  if (orbs.length && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      if (window.__headActive) return;
      setOrbs(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    });
  }

  /* ─────────────── HAND GESTURE CONTROL (webcam) ─────────────── */
  (function handTracking() {
    const btn = document.getElementById('handToggle');
    const preview = document.getElementById('camPreview');
    const video = document.getElementById('camVideo');
    const handCanvas = document.getElementById('handCanvas');
    const statusText = document.getElementById('camStatusText');
    const closeBtn = document.getElementById('camClose');
    const airControls = document.getElementById('airControls');
    const airCursor = document.getElementById('airCursor');
    const airHud = document.getElementById('airHud');
    const airTrail = document.getElementById('airTrail');
    if (!btn) return;

    let stream = null, hands = null, rafId = null, active = false, loadingLibs = false;
    let hCtx = null;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const screenPos = { x: 0, y: 0 };
    const smoothScreen = { x: 0, y: 0 };
    let gesture = 'none', prevGesture = 'none';
    let pinchCooldown = 0, fistCooldown = 0;
    let hoveredEl = null, lastHoverEl = null, highlightBox = null;
    const trailDots = [];
    const TRAIL_COUNT = 8;

    const MP_HANDS = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.min.js';
    const MP_CAM = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675466862/camera_utils.min.js';

    const CONNECTIONS = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [5,9],[9,10],[10,11],[11,12],
      [9,13],[13,14],[14,15],[15,16],
      [13,17],[17,18],[18,19],[19,20],
      [0,17]
    ];

    const loadScript = (src) => new Promise((res, rej) => {
      if (document.querySelector('script[src="' + src + '"]')) { res(); return; }
      const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src));
      document.head.appendChild(s);
    });

    function initTrail() {
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const dot = document.createElement('div');
        dot.className = 'air-trail-dot';
        airTrail.appendChild(dot);
        trailDots.push({ el: dot, x: 0, y: 0 });
      }
    }
    function updateTrail(sx, sy) {
      for (let i = trailDots.length - 1; i > 0; i--) {
        trailDots[i].x = trailDots[i - 1].x;
        trailDots[i].y = trailDots[i - 1].y;
      }
      if (trailDots.length) { trailDots[0].x = sx; trailDots[0].y = sy; }
      trailDots.forEach((d, i) => {
        const opacity = (1 - i / TRAIL_COUNT) * 0.4;
        const scale = 1 - i / TRAIL_COUNT * 0.6;
        d.el.style.left = d.x + 'px';
        d.el.style.top = d.y + 'px';
        d.el.style.opacity = opacity;
        d.el.style.transform = 'translate(-50%,-50%) scale(' + scale + ')';
      });
    }

    function createHighlightBox() {
      highlightBox = document.createElement('div');
      highlightBox.className = 'air-hover-highlight';
      highlightBox.style.display = 'none';
      document.body.appendChild(highlightBox);
    }
    function showHighlight(el) {
      if (!highlightBox || !el) { hideHighlight(); return; }
      const r = el.getBoundingClientRect();
      highlightBox.style.left = (r.left - 4) + 'px';
      highlightBox.style.top = (r.top - 4) + 'px';
      highlightBox.style.width = (r.width + 8) + 'px';
      highlightBox.style.height = (r.height + 8) + 'px';
      highlightBox.style.display = 'block';
    }
    function hideHighlight() {
      if (highlightBox) highlightBox.style.display = 'none';
      hoveredEl = null;
    }

    function detectGesture(landmarks) {
      const fingerExtended = (tip, pip) => landmarks[tip].y < landmarks[pip].y;
      const indexUp = fingerExtended(8, 6);
      const middleUp = fingerExtended(12, 10);
      const ringUp = fingerExtended(16, 14);
      const pinkyUp = fingerExtended(20, 18);
      const extCount = (indexUp ? 1 : 0) + (middleUp ? 1 : 0) + (ringUp ? 1 : 0) + (pinkyUp ? 1 : 0);

      // pinch: thumb tip close to index tip (no requirement for index to be extended)
      const dx = landmarks[8].x - landmarks[4].x;
      const dy = landmarks[8].y - landmarks[4].y;
      const pinchDist = Math.sqrt(dx * dx + dy * dy);
      if (pinchDist < 0.09) return 'pinch';

      if (extCount <= 1) return 'fist';
      if (indexUp && !middleUp && !ringUp && !pinkyUp) return 'point';
      if (extCount >= 3) return 'open';
      return 'open';
    }

    function drawHand(landmarks) {
      if (!hCtx) return;
      const w = handCanvas.width, h = handCanvas.height;
      hCtx.clearRect(0, 0, w, h);

      const gestureColor = gesture === 'pinch' ? 'rgba(51, 214, 255, 0.7)' :
                           gesture === 'fist' ? 'rgba(52, 211, 153, 0.7)' :
                           gesture === 'point' ? 'rgba(251, 191, 36, 0.7)' :
                           'rgba(124, 108, 255, 0.7)';

      hCtx.strokeStyle = gestureColor;
      hCtx.lineWidth = 2.5;
      CONNECTIONS.forEach(([a, b]) => {
        hCtx.beginPath();
        hCtx.moveTo(landmarks[a].x * w, landmarks[a].y * h);
        hCtx.lineTo(landmarks[b].x * w, landmarks[b].y * h);
        hCtx.stroke();
      });

      landmarks.forEach((lm, i) => {
        const r = [0, 4, 8, 12, 16, 20].includes(i) ? 5 : 3;
        const glow = [4, 8].includes(i);
        hCtx.beginPath();
        hCtx.arc(lm.x * w, lm.y * h, r, 0, Math.PI * 2);
        if (glow) {
          hCtx.fillStyle = gesture === 'pinch' ? 'rgba(51, 214, 255, 1)' : 'rgba(124, 108, 255, 1)';
          hCtx.shadowColor = gesture === 'pinch' ? '#33d6ff' : '#7c6cff';
          hCtx.shadowBlur = 14;
        } else {
          hCtx.fillStyle = gestureColor.replace('0.7', '0.85');
          hCtx.shadowBlur = 0;
        }
        hCtx.fill();
        hCtx.shadowBlur = 0;
      });
    }

    function updateAirCursor(landmarks) {
      const indexTip = landmarks[8];
      const wrist = landmarks[0];
      const middleMCP = landmarks[9];
      const cx = (gesture === 'point') ? indexTip.x : (wrist.x + middleMCP.x) / 2;
      const cy = (gesture === 'point') ? indexTip.y : (wrist.y + middleMCP.y) / 2;

      screenPos.x = (1 - cx) * window.innerWidth;
      screenPos.y = cy * window.innerHeight;

      smoothScreen.x += (screenPos.x - smoothScreen.x) * 0.25;
      smoothScreen.y += (screenPos.y - smoothScreen.y) * 0.25;

      airCursor.style.left = smoothScreen.x + 'px';
      airCursor.style.top = smoothScreen.y + 'px';

      updateTrail(smoothScreen.x, smoothScreen.y);

      target.x = (1 - cx - 0.5) * 2;
      target.y = -(cy - 0.5) * 2;
    }

    function hitTest(sx, sy) {
      const stack = document.elementsFromPoint(sx, sy);
      for (const el of stack) {
        if (el === airControls || airControls.contains(el)) continue;
        if (el === highlightBox) continue;
        return el;
      }
      return null;
    }

    function simulateMouse(sx, sy) {
      const el = hitTest(sx, sy);
      if (!el) { leaveHover(); return; }

      el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: sx, clientY: sy }));

      if (el !== lastHoverEl) {
        if (lastHoverEl) {
          lastHoverEl.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          lastHoverEl.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
        }
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        lastHoverEl = el;
      }

      const interactive = el.closest('a, button, input, select, textarea, [data-tilt], [onclick], [role="button"], .nav-link, .pub-filter, .tl-toggle, .pub-card, .gh-card, .cert-card, .dock-btn, .timeline-card, .edu-card, .project-row, .project-visual, .cube-scene, .cube-face, .skill-chips span, .beyond-card, .stat, .swatch');
      if (interactive && interactive !== hoveredEl) {
        hoveredEl = interactive;
        showHighlight(interactive);
      } else if (!interactive && hoveredEl) {
        hideHighlight();
      }

      // edge-scroll: cursor near top/bottom 15% of viewport
      const vh = window.innerHeight;
      const edgeZone = vh * 0.15;
      if (sy < edgeZone) {
        window.scrollBy({ top: -((edgeZone - sy) / edgeZone) * 45, behavior: 'auto' });
      } else if (sy > vh - edgeZone) {
        window.scrollBy({ top: ((sy - (vh - edgeZone)) / edgeZone) * 45, behavior: 'auto' });
      }
    }

    function leaveHover() {
      if (lastHoverEl) {
        lastHoverEl.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        lastHoverEl.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
        lastHoverEl = null;
      }
      hideHighlight();
    }

    function handleGestureActions(g, landmarks) {
      if (pinchCooldown > 0) pinchCooldown--;
      if (fistCooldown > 0) fistCooldown--;
      const sx = smoothScreen.x, sy = smoothScreen.y;

      // ALL gestures except none: simulate mouse movement for hover
      if (g !== 'none') {
        simulateMouse(sx, sy);
      } else {
        leaveHover();
      }

      // PINCH: click on transition into pinch
      if (g === 'pinch' && prevGesture !== 'pinch' && pinchCooldown <= 0) {
        pinchCooldown = 20;
        const el = hitTest(sx, sy);
        if (el) {
          const link = el.closest('a[href]');
          const btn = el.closest('button, [role="button"], .pub-filter, .tl-toggle, .dock-btn, .cube-face, .swatch');
          const actionEl = link || btn || el;
          spawnClickRipple(sx, sy);
          const label = actionEl.textContent || actionEl.getAttribute('aria-label') || '';
          toast('Clicked: ' + label.trim().replace(/\s+/g, ' ').slice(0, 40));

          if (link) {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
              const target = document.querySelector(href);
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            } else {
              const w = window.open(link.href, '_blank', 'noopener');
              if (!w) window.location.href = link.href;
            }
          } else {
            actionEl.click();
          }
        }
      }

      // FIST: particle shockwave blast from cursor position
      if (g === 'fist' && prevGesture !== 'fist' && fistCooldown <= 0) {
        fistCooldown = 12;
        spawnShockwave(sx, sy);
        // fire the Three.js particle shockwave
        window.dispatchEvent(new PointerEvent('pointerdown', {
          clientX: sx, clientY: sy, bubbles: true,
        }));
      }
    }

    function spawnClickRipple(x, y) {
      const ripple = document.createElement('div');
      ripple.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:0;height:0;border-radius:50%;border:2px solid var(--accent-2);pointer-events:none;z-index:903;transform:translate(-50%,-50%);';
      document.body.appendChild(ripple);
      gsap.to(ripple, { width: 60, height: 60, opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: () => ripple.remove() });
    }

    function spawnShockwave(x, y) {
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:0;height:0;border-radius:50%;pointer-events:none;z-index:903;transform:translate(-50%,-50%);border:' + (3 - i) + 'px solid var(--accent);';
        document.body.appendChild(ring);
        gsap.to(ring, {
          width: 160 + i * 60, height: 160 + i * 60, opacity: 0,
          duration: 0.7 + i * 0.15, delay: i * 0.08,
          ease: 'power2.out', onComplete: () => ring.remove(),
        });
      }
    }

    function updateGestureHud(g) {
      const changed = g !== gesture;
      prevGesture = gesture;
      gesture = g;
      if (!changed) return;

      airCursor.classList.remove('pinching', 'fist', 'point');
      if (g === 'pinch') airCursor.classList.add('pinching');
      if (g === 'fist') airCursor.classList.add('fist');
      if (g === 'point') airCursor.classList.add('point');

      if (airHud) {
        airHud.querySelectorAll('.air-hud-item').forEach((el) => {
          el.classList.toggle('active', el.dataset.gesture === g);
        });
      }
    }

    function smooth() {
      if (!active) return;
      cur.x += (target.x - cur.x) * 0.12;
      cur.y += (target.y - cur.y) * 0.12;
      setOrbs(cur.x * 1.6, cur.y * 1.6);
      if (window.__sceneParallax) window.__sceneParallax(cur.x * 1.8, cur.y * 1.4);
      rafId = requestAnimationFrame(smooth);
    }

    function onResults(results) {
      if (!active) return;
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const g = detectGesture(landmarks);
        updateGestureHud(g);
        drawHand(landmarks);
        updateAirCursor(landmarks);
        handleGestureActions(g, landmarks);
      } else {
        if (hCtx) hCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);
        updateGestureHud('none');
        hideHighlight();
      }
    }

    async function enable() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: false });
      } catch (e) { toast('Camera permission denied. Hand control needs your webcam.'); setUI(false); return; }
      video.srcObject = stream;
      try { await video.play(); } catch (_) {}
      preview.hidden = false;

      handCanvas.width = video.videoWidth || 640;
      handCanvas.height = video.videoHeight || 480;
      hCtx = handCanvas.getContext('2d');

      if (!trailDots.length) initTrail();
      if (!highlightBox) createHighlightBox();

      setStatus('LOADING MODEL…');
      if (!hands) {
        try {
          loadingLibs = true;
          await loadScript(MP_HANDS);
          await loadScript(MP_CAM);

          hands = new window.Hands({
            locateFile: (file) => 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/' + file,
          });
          hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.5,
          });
          hands.onResults(onResults);
        } catch (e) { toast('Could not load the hand-tracking model (offline?).'); cleanup(); setUI(false); return; }
        finally { loadingLibs = false; }
      }

      active = true; window.__headActive = true;
      setStatus('TRACKING HAND');
      if (airControls) airControls.hidden = false;

      const camera = new window.Camera(video, {
        onFrame: async () => { if (active && hands) await hands.send({ image: video }); },
        width: 640, height: 480,
      });
      camera.start();
      window.__handCamera = camera;

      smooth();
      toast('Hand control active. Show your hand to the camera.');
    }

    function cleanup() {
      active = false; window.__headActive = false;
      gesture = 'none'; prevGesture = 'none';
      pinchCooldown = 0; fistCooldown = 0;
      leaveHover();
      if (rafId) cancelAnimationFrame(rafId);
      if (window.__handCamera) { window.__handCamera.stop(); window.__handCamera = null; }
      if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
      video.srcObject = null;
      if (hCtx) hCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);
      preview.hidden = true;
      if (airControls) airControls.hidden = true;
      airCursor.classList.remove('pinching', 'fist', 'point');
      hideHighlight();
      trailDots.forEach((d) => { d.el.style.opacity = 0; });
    }
    function setStatus(t) { if (statusText) statusText.textContent = t; }
    function setUI(on) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }

    function toggle() {
      if (active || loadingLibs) { cleanup(); setUI(false); toast('Hand tracking off.'); }
      else { setUI(true); enable(); }
    }
    btn.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', () => { cleanup(); setUI(false); });
  })();

  /* ─────────────── DRAWING STUDIO ─────────────── */
  (function drawingStudio() {
    const modal = document.getElementById('drawModal');
    const openBtn = document.getElementById('drawToggle');
    const canvas = document.getElementById('drawCanvas');
    if (!modal || !openBtn || !canvas) return;
    const ctx = canvas.getContext('2d');
    const RECIPIENT = 'mymedia.yns@gmail.com';

    // fixed drawing resolution (crisp export)
    const W = 1000, H = 620;
    canvas.width = W; canvas.height = H;

    let color = '#7c6cff', size = 6, mode = 'brush';
    let drawing = false, last = null;
    const history = [];

    function fillBg() { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); }
    function snapshot() { history.push(ctx.getImageData(0, 0, W, H)); if (history.length > 25) history.shift(); }
    function restore() { const img = history.pop(); if (img) ctx.putImageData(img, 0, 0); }
    fillBg();

    // swatches
    const palette = ['#0c1022', '#ffffff', '#7c6cff', '#33d6ff', '#34d399', '#fbbf24', '#ef4444', '#ec4899'];
    const swWrap = document.getElementById('swatches');
    palette.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'swatch' + (c === color ? ' active' : '');
      b.style.background = c; b.setAttribute('aria-label', 'Color ' + c);
      b.addEventListener('click', () => {
        color = c; mode = 'brush'; syncTools();
        swWrap.querySelectorAll('.swatch').forEach((s) => s.classList.remove('active'));
        b.classList.add('active');
        document.getElementById('colorInput').value = c;
      });
      swWrap.appendChild(b);
    });

    const colorInput = document.getElementById('colorInput');
    const sizeInput = document.getElementById('sizeInput');
    const sizeVal = document.getElementById('sizeVal');
    const brushBtn = document.getElementById('brushBtn');
    const eraserBtn = document.getElementById('eraserBtn');

    function syncTools() {
      brushBtn.dataset.active = (mode === 'brush');
      eraserBtn.dataset.active = (mode === 'eraser');
    }
    colorInput.addEventListener('input', (e) => { color = e.target.value; mode = 'brush'; syncTools(); swWrap.querySelectorAll('.swatch').forEach((s) => s.classList.remove('active')); });
    sizeInput.addEventListener('input', (e) => { size = +e.target.value; sizeVal.textContent = size; });
    brushBtn.addEventListener('click', () => { mode = 'brush'; syncTools(); });
    eraserBtn.addEventListener('click', () => { mode = 'eraser'; syncTools(); });
    document.getElementById('undoBtn').addEventListener('click', restore);
    document.getElementById('clearBtn').addEventListener('click', () => { snapshot(); fillBg(); });

    function pos(e) {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    }
    function start(e) { drawing = true; snapshot(); last = pos(e); stroke(e); }
    function stroke(e) {
      if (!drawing) return;
      const p = pos(e);
      ctx.strokeStyle = mode === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = mode === 'eraser' ? size * 2.2 : size;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      last = p;
    }
    function end() { drawing = false; }
    canvas.addEventListener('pointerdown', (e) => { canvas.setPointerCapture(e.pointerId); start(e); });
    canvas.addEventListener('pointermove', stroke);
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointerleave', end);

    // download
    document.getElementById('downloadBtn').addEventListener('click', () => {
      const a = document.createElement('a');
      a.download = 'nikhil-portfolio-drawing.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      toast('Saved! Check your downloads.');
    });
    // send: download then open mail with prefilled subject/body
    document.getElementById('sendBtn').addEventListener('click', () => {
      const a = document.createElement('a');
      a.download = 'nikhil-portfolio-drawing.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      const subject = encodeURIComponent('A drawing for you from your portfolio!');
      const body = encodeURIComponent('Hi Nikhil,\n\nI made this drawing on your portfolio site. I just downloaded it, attaching it here!\n\n(Please attach the downloaded PNG: nikhil-portfolio-drawing.png)\n\n');
      setTimeout(() => { window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`; }, 400);
      toast('Drawing saved. Opening your mail app to attach it.');
    });

    // open/close
    function open() { modal.hidden = false; document.body.style.overflow = 'hidden'; }
    function close() { modal.hidden = true; document.body.style.overflow = ''; }
    openBtn.addEventListener('click', open);
    document.getElementById('drawClose').addEventListener('click', close);
    document.getElementById('drawBackdrop').addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
  })();

  /* ─────────────── INTERACTIVE PROJECT PLANES ─────────────── */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.project-visual').forEach((viz) => {
      viz.addEventListener('mousemove', (e) => {
        const r = viz.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;   // 0..1
        const py = (e.clientY - r.top) / r.height;
        viz.style.setProperty('--mx', (px * 100) + '%');
        viz.style.setProperty('--my', (py * 100) + '%');
        viz.style.setProperty('--gx', ((px - 0.5) * -26) + 'px');   // grid traces the cursor
        viz.style.setProperty('--gy', ((py - 0.5) * -26) + 'px');
        viz.style.setProperty('--tiltX', ((px - 0.5) * 24) + 'deg'); // plane tilts toward cursor
        viz.style.setProperty('--tiltY', ((0.5 - py) * 24) + 'deg');
      });
      viz.addEventListener('mouseleave', () => {
        viz.style.setProperty('--gx', '0px'); viz.style.setProperty('--gy', '0px');
        viz.style.setProperty('--tiltX', '0deg'); viz.style.setProperty('--tiltY', '0deg');
      });
    });
  }

  /* ─────────────── TOAST ─────────────── */
  let toastTimer = null;
  function toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg; el.hidden = false;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.classList.remove('show'); setTimeout(() => { el.hidden = true; }, 400); }, 3200);
  }

})();
