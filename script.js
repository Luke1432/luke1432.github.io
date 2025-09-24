// ---------- Smooth scrolling with custom duration ----------
function smoothScroll(target, duration = 1200) {
    const el = document.querySelector(target);
    if (!el) return;
  
    const start = window.pageYOffset;
    const end = el.getBoundingClientRect().top;
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
      const run = easeInOutQuad(elapsed, start, end, duration);
      window.scrollTo(0, run);
      if (elapsed < duration) requestAnimationFrame(animate);
    }
  
    requestAnimationFrame(animate);
  }
  
  // Intercept all in-page anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = this.getAttribute("href");
      // ignore if just "#"
      if (!target || target === "#") return;
      e.preventDefault();
      smoothScroll(target, 1200); // 1200ms = 1.2s
    });
  });
  
  // ---------- Back to Top button ----------
  const backToTopBtn = document.getElementById("backToTop");
  
  function toggleBackToTop() {
    const y = document.documentElement.scrollTop || document.body.scrollTop;
    if (y > 200) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }
  
  window.addEventListener("scroll", toggleBackToTop);
  
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  
  // Initialize state on load
  toggleBackToTop();
  
  // Back to Top button toggle + smooth scroll (respects reduced motion)
(function () {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
  
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    function onScroll() {
      if (window.scrollY > 400) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }
  
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial state
  
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (prefersReduced) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  })();
  