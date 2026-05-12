/* =========================================================
   #brownsquarecampaign — interactions (v3)
   ========================================================= */

(() => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------
     1. HERO SLIDESHOW
  ------------------------------------------------------- */
  const SLIDES = [
    'images/can a billboard end but jews have butts - jewbelieve.png',
    'images/protesting israel horizontal 1.png',
    'images/cultural jews died in the gas chambers too - jewbelieve.png',
    "images/don't fall for the propaganda - jewbelieve.png",
    "images/the nazis claimed jew didn't have butts - jew believe.png",
    "images/you don't have to be a jew to know that jews have butts - jewbelieve.png",
    "images/I'll even show you my butt right now - jewbelieve.png"
  ];
  const SLIDE_DURATION = 5000;

  const stage = document.querySelector('.hero__slideshow');
  if (stage) {
    const slideEls = SLIDES.map((src, i) => {
      const el = document.createElement('div');
      el.className = 'hero__slide';
      el.style.backgroundImage = `url("${encodeURI(src)}")`;
      if (i === 0) el.classList.add('hero__slide--active');
      stage.appendChild(el);
      return el;
    });
    let current = 0;
    if (slideEls.length > 1) {
      setInterval(() => {
        const next = (current + 1) % slideEls.length;
        slideEls[next].classList.add('hero__slide--active');
        slideEls[current].classList.remove('hero__slide--active');
        current = next;
      }, SLIDE_DURATION);
    }
  }

  /* -------------------------------------------------------
     2. PEACH TRANSITION — emerge-from-cleft + body-wide rain
  ------------------------------------------------------- */
  const transitionSection = document.getElementById('transition');
  const rainContainer     = document.querySelector('.squares-rain');
  const peachFront        = document.querySelector('.transition__peach-front');
  const peachBack         = document.querySelector('.transition__peach-back');
  const peachRef          = peachFront || peachBack;

  function isPeachOnScreen() {
    if (!peachRef) return false;
    const r = peachRef.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.height > 0;
  }
  function isPastHero() {
    if (!transitionSection) return false;
    const r = transitionSection.getBoundingClientRect();
    return r.top < window.innerHeight * 0.65;
  }

  function spawnSquare() {
    if (!rainContainer) return;
    const sq = document.createElement('div');
    const size = 16 + Math.random() * 18;
    const peachOnScreen = isPeachOnScreen();
    let originX, originY, xEmerge = 0, xDrift;
    const direction = Math.random() < 0.5 ? -1 : 1;
    const rotation  = direction * (360 + Math.random() * 720);
    const duration  = 2.6 + Math.random() * 1.8;

    if (peachOnScreen) {
      const r = peachRef.getBoundingClientRect();
      originX = r.left + r.width * 0.50 + (Math.random() - 0.5) * r.width * 0.06;
      originY = r.top  + r.height * 0.50 + (Math.random() - 0.5) * r.height * 0.04;
      xEmerge = r.width * 0.24 + Math.random() * r.width * 0.06;
      xDrift  = xEmerge + (Math.random() - 0.35) * 50;
      sq.style.animation = `emergeFall ${duration}s cubic-bezier(.4,.05,.55,1) forwards`;
    } else {
      originX = Math.random() * window.innerWidth;
      originY = -40 - Math.random() * 40;
      xDrift  = (Math.random() - 0.5) * 80;
      sq.style.animation = `rainFall ${duration}s cubic-bezier(.4,.05,.55,1) forwards`;
    }

    sq.className = 'falling-square' + (Math.random() < 0.35 ? ' falling-square--deep' : '');
    sq.style.width  = size + 'px';
    sq.style.height = size + 'px';
    sq.style.left   = (originX - size / 2) + 'px';
    sq.style.top    = originY + 'px';
    sq.style.setProperty('--x-emerge', xEmerge + 'px');
    sq.style.setProperty('--x-drift',  xDrift  + 'px');
    sq.style.setProperty('--rot',      rotation + 'deg');

    rainContainer.appendChild(sq);
    setTimeout(() => sq.remove(), duration * 1000 + 200);
  }

  if (rainContainer && !prefersReducedMotion) {
    let emissionTimer = null;
    let lastScrollY = window.scrollY;
    let scrollBoostTimer = null;

    const startEmitting = () => {
      if (emissionTimer) return;
      for (let i = 0; i < 4; i++) setTimeout(spawnSquare, i * 160);
      emissionTimer = setInterval(spawnSquare, 620);
    };
    const stopEmitting = () => {
      clearInterval(emissionTimer);
      emissionTimer = null;
    };
    const evaluate = () => {
      if (isPastHero()) {
        startEmitting();
        rainContainer.style.opacity = '1';
      } else {
        stopEmitting();
        rainContainer.style.opacity = '0';
      }
    };

    document.addEventListener('scroll', () => {
      evaluate();
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      if (emissionTimer && isPeachOnScreen() && delta > 8) {
        spawnSquare();
        if (delta > 30 && !scrollBoostTimer) {
          scrollBoostTimer = setTimeout(() => {
            spawnSquare(); spawnSquare();
            scrollBoostTimer = null;
          }, 120);
        }
      }
    }, { passive: true });

    evaluate();
  }

  /* -------------------------------------------------------
     3. NAV BACKGROUND ON SCROLL
  ------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------------------------------------------------------
     3b. MOBILE HAMBURGER MENU
  ------------------------------------------------------- */
  const navToggle = document.querySelector('.nav__toggle');
  if (nav && navToggle) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    };
    const openMenu = () => {
      nav.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
    };

    navToggle.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    // Tapping any nav link closes the menu (so the smooth-scroll happens
    // against the page underneath, not the overlay). Includes the brand link.
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Esc closes the menu when open
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
    });
  }

  /* -------------------------------------------------------
     4. SCROLL-REVEAL
  ------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* -------------------------------------------------------
     5. COMMAND CENTER — counters + chart + live ticker
  ------------------------------------------------------- */
  const ccSection = document.getElementById('command-center');

  // -- formatted integer
  const fmt = (n) => Math.round(n).toLocaleString('en-US');

  // -- count up from 0 → target over `duration` ms with ease-out
  function countUp(el, target, duration = 2200) {
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(frame);
  }

  // -- "Last updated" ticker: starts at 0.4s, climbs, resets when total flashes
  let updatedSince = 0.4;
  const updatedEl = document.getElementById('ccUpdated');
  function tickUpdated() {
    if (!updatedEl) return;
    updatedSince = Math.round((updatedSince + 0.1) * 10) / 10;
    updatedEl.textContent = `Last updated ${updatedSince.toFixed(1)}s ago`;
  }
  setInterval(tickUpdated, 100);

  // -- Live total auto-increments + flashes pink
  const totalEl = document.getElementById('ccTotal');
  let totalCurrent = parseInt(totalEl?.dataset.target || '0', 10);
  function bumpTotal() {
    if (!totalEl) return;
    const inc = 1 + Math.floor(Math.random() * 4);
    totalCurrent += inc;
    totalEl.textContent = fmt(totalCurrent);
    totalEl.classList.add('is-flashing');
    setTimeout(() => totalEl.classList.remove('is-flashing'), 250);
    updatedSince = 0;
  }

  // -- The chart data: monthly cumulative for each category, Jan 2020 → Dec 2026.
  // Roughly tuned so the four end values land near the card totals.
  function generateSeries(finalValue, growthExponent, points = 84) {
    const arr = [];
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      // exponential-ish growth + small noise
      const v = finalValue * Math.pow(t, growthExponent);
      const noise = (Math.sin(i * 0.7) + Math.sin(i * 1.3)) * (finalValue * 0.008);
      arr.push(Math.max(0, v + noise));
    }
    return arr;
  }
  const series = [
    { key: 'textbook', name: 'Removed from textbooks',           color: '#c4865a',       data: generateSeries(12483, 2.1) },
    { key: 'bgb',      name: '"Baby Got Back" incidents',         color: '#8b5a3c',       data: generateSeries(4201,  2.4) },
    { key: 'chaps',    name: '"Assless chaps" references',        color: '#e8c5a5',       data: generateSeries(2891,  2.6) },
    { key: 'israel',   name: 'Criticism (definitely about butts)', color: 'var(--pink)',   data: generateSeries(28317, 1.9) }
  ];

  // -- Build SVG chart
  function buildChart() {
    const chartEl = document.getElementById('ccChart');
    if (!chartEl) return;

    const W = 800, H = 320;
    const padL = 60, padR = 24, padT = 20, padB = 36;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    const maxVal = Math.max(...series.flatMap(s => s.data));
    const xStep = innerW / (series[0].data.length - 1);

    const yTicks = 4;
    const xTickLabels = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

    let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">`;

    // Grid lines + Y axis labels
    for (let i = 0; i <= yTicks; i++) {
      const y = padT + (innerH / yTicks) * i;
      const val = maxVal * (1 - i / yTicks);
      svg += `<line class="grid-line" x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}"/>`;
      svg += `<text class="axis-label" x="${padL - 10}" y="${y + 4}" text-anchor="end">${fmt(val)}</text>`;
    }
    // X axis labels
    xTickLabels.forEach((lbl, i) => {
      const x = padL + (innerW / (xTickLabels.length - 1)) * i;
      svg += `<text class="axis-label" x="${x}" y="${H - padB + 22}" text-anchor="middle">${lbl}</text>`;
    });

    // Lines (one path per series). Save path lengths so we can animate stroke-dash.
    series.forEach(s => {
      const pts = s.data.map((v, i) => {
        const x = padL + i * xStep;
        const y = padT + innerH - (v / maxVal) * innerH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      });
      const d = 'M ' + pts.join(' L ');
      svg += `<path class="chart-line" data-key="${s.key}" stroke="${s.color}" d="${d}"/>`;
    });

    svg += '</svg>';
    chartEl.innerHTML = svg;

    // Set up draw-in animation: collapse each line to invisible, then on
    // visibility trigger expand stroke-dashoffset back to 0.
    chartEl.querySelectorAll('.chart-line').forEach(path => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });

    // Legend
    const legendEl = document.getElementById('ccLegend');
    if (legendEl) {
      legendEl.innerHTML = series.map(s =>
        `<span class="cc__legend-item">
           <span class="cc__legend-swatch" style="background:${s.color}"></span>
           ${s.name}
         </span>`
      ).join('');
    }
  }
  buildChart();

  // -- Trigger animations when section comes into view
  if (ccSection && 'IntersectionObserver' in window) {
    let triggered = false;
    const ccIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;

          // Count up the big total
          if (totalEl) {
            const target = parseInt(totalEl.dataset.target, 10);
            countUp(totalEl, target, 2400);
            totalCurrent = target;
          }
          // Count up each card
          document.querySelectorAll('.cc__card-value').forEach((el, i) => {
            const target = parseInt(el.dataset.target, 10);
            setTimeout(() => countUp(el, target, 1800), 200 + i * 150);
          });
          // Draw chart lines
          setTimeout(() => {
            document.querySelectorAll('.cc__chart .chart-line').forEach(path => {
              path.style.strokeDashoffset = '0';
            });
          }, 400);
          // Start the live total flicker once the count-up is done
          setTimeout(() => {
            setInterval(bumpTotal, 3200);
          }, 3000);
        }
      });
    }, { threshold: 0.25 });
    ccIO.observe(ccSection);
  }

  /* -------------------------------------------------------
     6. FOOTER YEAR
  ------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
