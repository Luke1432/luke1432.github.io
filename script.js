// ---------- Smooth scrolling with custom duration ----------
function smoothScroll(target, duration = 1200) {
    const el = document.querySelector(target);
    if (!el) return;
  
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.scrollIntoView();
      return;
    }
  
    const start = window.pageYOffset;
    const delta = el.getBoundingClientRect().top; // distance to target from current scroll
    let startTime = null;
  
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }
  
    function animate(time) {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const run = easeInOutQuad(elapsed, start, delta, duration);
      window.scrollTo(0, run);
      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        // Snap to exact position at the end and update the hash (no jump)
        window.scrollTo(0, start + delta);
        const id = target.startsWith('#') ? target.slice(1) : target;
        if (id) history.replaceState(null, '', `#${id}`);
      }
    }
  
    requestAnimationFrame(animate);
  }
  
  // Intercept all in-page anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = this.getAttribute("href");
      if (!target || target === "#") return; // ignore empty hash
      e.preventDefault();
      smoothScroll(target, 1200); // 1200ms = 1.2s
    });
  });
  
  // ---------- Back to Top button ----------
  const backToTopBtn = document.getElementById("backToTop");
  
  function toggleBackToTop() {
    if (!backToTopBtn) return;
    const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (y > 400) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }
  
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop(); // Initialize state on load
  
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
  