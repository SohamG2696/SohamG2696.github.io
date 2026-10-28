# Soham Gaikwad — Portfolio

A static portfolio with responsive layouts, scroll-driven project and skills showcases, social links, and a downloadable résumé. No build step or package installation is needed.

## Local preview

Run `python server.py` from this folder, then open http://localhost:8000/.

## Project files

- `index.html`: all portfolio content and links.
- `style.css`: design, responsive layouts, and motion fallbacks.
- `script.js`: scroll animations, project navigation, email copying, and the IST clock.
- `assets/`: the robot hero, five project previews, and footer background.
- `vendor/`: local GSAP and ScrollTrigger libraries required for animations.
- `Soham_Gaikwad_Resume.pdf`: the current résumé linked by the website.
- `favicon.svg`: browser icon.
- `home.html`: a small redirect preserving the previous homepage URL.
- `server.py`: local preview server with caching disabled.

Edit content and social links in `index.html`. The copy-email buttons use the email text shown in the footer.

The site uses native browser scrolling. If animation libraries are unavailable or reduced motion is enabled, content remains accessible in a static layout.
