# Lukas Fenkam’s Portfolio Site

This is the source repository for my personal portfolio website, hosted at **https://luke1432.github.io** (via GitHub Pages), and accessible at **https://lukasfenkam.me/**.

---

## 🚀 Project Overview

This repository contains the complete code, assets, and content for my portfolio site. The site showcases my skills, projects, résumé, and contact information. It is built using HTML, CSS, and JavaScript.

Your browser fetches these static files, so there is no backend server required.  
My goals for this site include:

- Presenting a clean, responsive, and professional portfolio  
- Highlighting my projects and work in a visually engaging way  
- Making it easy for visitors (e.g. potential employers, collaborators) to explore and contact me  
- Maintaining a lightweight, maintainable site that I can evolve over time

---

## 📁 Repository Structure

Here’s an overview of the main files and directories:

```
/
├── CNAME              # Custom domain configuration (if used)
├── biglogo.png        # Banner / hero image
├── favicon.ico        # Browser tab icon
├── image.png          # Sample image used on the site
├── index.html         # Main landing page
├── logo.png            # Logo displayed on the site
├── pattern.png        # Background / decorative graphic
├── resume.tex         # Résumé source (compiled to Lukas_Fenkam_Resume.pdf by GitHub Actions)
├── script.js           # JavaScript for interactivity
└── style.css           # Styling (CSS) for layout, design, responsiveness
```

| File / Directory | Purpose |
|------------------|---------|
| `index.html`     | Main entry point / homepage of the site |
| `style.css`       | Contains all custom CSS styles |
| `script.js`        | Adds interactivity, animations, or dynamic behavior |
| `resume.tex`       | Résumé source; a GitHub Actions workflow builds `Lukas_Fenkam_Resume.pdf` from it |
| Image files        | Logos, icons, patterns, banners used in the site |
| `CNAME`             | (Optional) Used if you’re pointing a custom domain to GitHub Pages |

---

## 🛠️ Technologies & Tools

- **HTML5** & **CSS3** for markup and styling  
- **Vanilla JavaScript** for dynamic UI features  
- **GitHub Pages** for free static hosting  
- (Optionally) Custom domain support via `CNAME`  
- Responsive / mobile-first design to ensure usability across devices  

---

## 🎯 How to Run / Preview Locally

If you’d like to work on or view the site locally before pushing changes:

1. Clone the repository:
   ```bash
   git clone https://github.com/Luke1432/luke1432.github.io.git
   ```
2. Open `index.html` in your preferred browser.  
   (Since this is a static site, no server is required.)
3. Edit files (`.html`, `.css`, `.js`, images) as needed.
4. Commit changes and push to the `main` (or `master`) branch — GitHub Pages will automatically update the live site.

If you prefer, you can also serve it through a simple local HTTP server (to avoid CORS or local file path issues), for example:

```bash
# Python 3
cd path/to/repo
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

---

## ✅ What You’ll Find on the Site / Features

- An introductory hero section with my name, tagline, and logo  
- A portfolio / projects section, including images and links  
- A résumé section (inline and downloadable)  
- Contact form or contact details (email, social links)  
- Clean layout with a consistent design system  
- Responsive behavior for desktops, tablets, and mobile devices  

---

## 📬 Contributions & Updates

This is primarily my personal portfolio, so contributions are limited. However:

- If you spot a typo, broken link, or want to suggest a design improvement, please send me a message using the contact information found on the website.  
- If you want to suggest new features or UI enhancements, I’d welcome your feedback.  

---

## 📄 Licensing & Attribution

All content (text, images, code) in this repository is copyrighted by me (unless otherwise noted).  
If you reuse or adapt parts, please attribute appropriately or ask me first.

---

Thank you for visiting my portfolio repo! I hope it gives you a good sense of my work and capabilities.  
If you’d like to get in touch, feel free to contact me via email or social links (available on the live site).
