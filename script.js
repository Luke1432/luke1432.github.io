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
  

// ===== PDF.js transparent, responsive, multi-page render =====
// Path to your PDF:
const PDF_URL = "resume.pdf"; // adjust if it's in /files/ or another folder

const viewRoot = document.getElementById("pdfjs-view");
const wrapperEl = document.querySelector(".pdfjs-container");

// Cap DPR for performance while keeping things crisp
const DPR = Math.min(window.devicePixelRatio || 1, 2);

let pdfDoc = null;
let baseViewports = [];   // store page viewports at scale=1 for each page
let canvases = [];        // one canvas per page
let resizeId = null;

initPDF();

function initPDF() {
  if (!viewRoot || !wrapperEl) return;

  pdfjsLib.getDocument(PDF_URL).promise
    .then(pdf => {
      pdfDoc = pdf;
      baseViewports = new Array(pdf.numPages);
      canvases = new Array(pdf.numPages);

      // Pre-create canvases in order so pages don't shuffle
      viewRoot.innerHTML = "";
      for (let i = 0; i < pdf.numPages; i++) {
        const c = document.createElement("canvas");
        canvases[i] = c;
        viewRoot.appendChild(c);
      }

      // Load base viewports (scale=1) then render all
      const pagePromises = [];
      for (let n = 1; n <= pdf.numPages; n++) {
        pagePromises.push(
          pdf.getPage(n).then(page => {
            baseViewports[n - 1] = page.getViewport({ scale: 1 });
            return page;
          })
        );
      }

      return Promise.all(pagePromises);
    })
    .then(() => renderAllPages())
    .catch(err => {
      console.error("PDF load/render error:", err);
      if (viewRoot) {
        viewRoot.innerHTML = `<p style="color:#F1EDEE;text-align:center;">Unable to load PDF.</p>`;
      }
    });

  // Re-render on resize (debounced)
  window.addEventListener("resize", () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(renderAllPages, 150);
  }, { passive: true });
}

function renderAllPages() {
  if (!pdfDoc || !baseViewports.length) return;

  const containerWidth = Math.min(wrapperEl.clientWidth || 800, 1100);

  // Render each page to its matching canvas
  const renderJobs = [];
  for (let n = 1; n <= pdfDoc.numPages; n++) {
    renderJobs.push(
      pdfDoc.getPage(n).then(page => {
        const base = baseViewports[n - 1];
        const scale = containerWidth / base.width;
        const vp = page.getViewport({ scale });

        const canvas = canvases[n - 1];
        const ctx = canvas.getContext("2d", { alpha: true });

        // Set device pixel size (for crispness) and CSS size
        canvas.width = Math.floor(vp.width * DPR);
        canvas.height = Math.floor(vp.height * DPR);
        canvas.style.width = `${vp.width}px`;
        canvas.style.height = `${vp.height}px`;

        // Reset transform then apply DPR scaling
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(DPR, DPR);

        // Render with transparent background
        return page.render({
          canvasContext: ctx,
          viewport: vp,
          background: "rgba(0,0,0,0)"
        }).promise;
      })
    );
  }

  return Promise.all(renderJobs);
}
