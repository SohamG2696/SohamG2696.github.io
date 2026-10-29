# Soham Gaikwad — Portfolio

A static portfolio with responsive layouts, scroll-driven project and skills showcases, social links, and a downloadable résumé. No build step or package installation is needed.

## Local preview

Run `python server.py` from this folder, then open http://localhost:8000/.

## Project files

- `index.html`: all portfolio content and links.
- `style.css`: design, responsive layouts, and motion fallbacks.
- `script.js`: scroll animations, project navigation, email copying, and the IST clock.
- `assets/`: the portrait, six project previews, local fonts with licenses, and footer background.
- `vendor/`: local GSAP and ScrollTrigger libraries required for animations.
- `Soham_Gaikwad_Resume.pdf`: the current résumé linked by the website.
- `favicon.svg`: browser icon.
- `home.html`: a small redirect preserving the previous homepage URL.
- `server.py`: concurrent local preview server with caching disabled and a fixed project root.

Edit content and social links in `index.html`. The copy-email buttons use the email text shown in the footer.

The site uses native browser scrolling. If animation libraries are unavailable or reduced motion is enabled, content remains accessible in a static layout.

All fonts, images, styles, and animation scripts load locally. Project previews use compressed WebP; the portrait preserves transparent edges. The campus network preview is an SVG architecture illustration.

## Portrait asset

`assets/soham-portrait.webp` was prepared from the supplied photo using the built-in image-generation tool and then encoded as lossless WebP. The original supplied photo is unchanged.

Edit prompt: Extract and lightly professionally retouch the same person as a transparent hero portrait. Preserve exact identity, face proportions, skin tone, hair, mustache, physique, outfit, and crossed-arm pose. Gently even exposure, clean temporary blemishes and stray edges, reduce distracting shirt wrinkles, and add subtle warm rim light. Frame above hair to upper thighs with complete shoulders and elbows. No face reshaping, skin lightening, new clothes, text, objects, shadows, or background.
