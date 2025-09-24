function smoothScroll(target, duration = 1200) {
    const el = document.querySelector(target);
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.scrollIntoView();
      return;
    }
    const start = window.pageYOffset;
    const delta = el.getBoundingClientRect().top;
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
        window.scrollTo(0, start + delta);
        const id = target.startsWith('#') ? target.slice(1) : target;
        if (id) history.replaceState(null, '', `#${id}`);
      }
    }
    requestAnimationFrame(animate);
  }
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = this.getAttribute("href");
      if (!target || target === "#") return;
      e.preventDefault();
      smoothScroll(target, 1200);
    });
  });
  
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
  toggleBackToTop();
  
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
  
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const viewers = [];
  const resizeDebounce = { id: null };
  
  function initAllPDFs() {
    const nodes = document.querySelectorAll(".pdfjs-view[data-pdf]");
    nodes.forEach(node => {
      const url = node.getAttribute("data-pdf");
      if (!url) return;
      createViewer(node, url);
    });
    window.addEventListener("resize", () => {
      clearTimeout(resizeDebounce.id);
      resizeDebounce.id = setTimeout(renderAllViewers, 150);
    }, { passive: true });
  }
  
  function createViewer(rootEl, url) {
    const wrapper = rootEl.closest(".pdfjs-container");
    const state = {
      rootEl,
      wrapper,
      url,
      pdfDoc: null,
      baseViewports: [],
      canvases: []
    };
    rootEl.innerHTML = "";
    pdfjsLib.getDocument(url).promise
      .then(pdf => {
        state.pdfDoc = pdf;
        state.baseViewports = new Array(pdf.numPages);
        state.canvases = new Array(pdf.numPages);
        for (let i = 0; i < pdf.numPages; i++) {
          const c = document.createElement("canvas");
          state.canvases[i] = c;
          rootEl.appendChild(c);
        }
        const pagePromises = [];
        for (let n = 1; n <= pdf.numPages; n++) {
          pagePromises.push(
            pdf.getPage(n).then(page => {
              state.baseViewports[n - 1] = page.getViewport({ scale: 1 });
              return page;
            })
          );
        }
        return Promise.all(pagePromises);
      })
      .then(() => renderViewer(state))
      .catch(err => {
        rootEl.innerHTML = '<p style="color:#F1EDEE;text-align:center;">Unable to load PDF.</p>';
        console.error("PDF load/render error:", err);
      });
    viewers.push(state);
  }
  
  function renderAllViewers() {
    viewers.forEach(v => renderViewer(v));
  }
  
  function renderViewer(state) {
    if (!state.pdfDoc || !state.baseViewports.length) return;
    const containerWidth = Math.min((state.wrapper && state.wrapper.clientWidth) || 800, 1100);
    const jobs = [];
    for (let n = 1; n <= state.pdfDoc.numPages; n++) {
      jobs.push(
        state.pdfDoc.getPage(n).then(page => {
          const base = state.baseViewports[n - 1];
          const scale = containerWidth / base.width;
          const vp = page.getViewport({ scale });
          const canvas = state.canvases[n - 1];
          const ctx = canvas.getContext("2d", { alpha: true });
          canvas.width = Math.floor(vp.width * DPR);
          canvas.height = Math.floor(vp.height * DPR);
          canvas.style.width = `${vp.width}px`;
          canvas.style.height = `${vp.height}px`;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(DPR, DPR);
          return page.render({
            canvasContext: ctx,
            viewport: vp,
            background: "rgba(0,0,0,0)"
          }).promise;
        })
      );
    }
    return Promise.all(jobs);
  }
  
  initAllPDFs();
  