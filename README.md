# Soham Gaikwad — Portfolio

A responsive static portfolio featuring an SG monogram, anime portrait, six animated project showcases, technical skills, milestones, social links, and a downloadable résumé.

## Local preview

Run `python server.py` and open http://localhost:8000/. No build step or package installation is needed. Stop the server with Ctrl+C.

## Files

- `index.html`: page content, navigation, and social links.
- `style.css`: layout, typography, responsive styles, and motion fallbacks.
- `script.js`: scroll animations, project selection, email copying, and the IST clock.
- `assets/`: active portrait, project previews, logo, background, and locally hosted fonts with their licenses.
- `vendor/`: GSAP and ScrollTrigger, used by the scroll animations.
- `Soham_Gaikwad_Resume.pdf`: the résumé linked in the footer.
- `favicon.svg`: browser icon matching the SG logo.
- `home.html`: compatibility redirect to the main page.
- `server.py`: local preview server with concurrent requests and caching disabled.

## Editing and hosting

Edit content and links in `index.html`. The email-copy buttons use the address displayed in the footer. The active hero is `assets/soham-anime-round.webp`.

Upload the project files to a static host or use GitHub Pages with the repository root as the publishing source. All runtime files use relative paths and are stored locally; Python is only needed for local preview.

The site uses native scrolling. If animation scripts are unavailable or reduced motion is enabled, the content remains accessible in a static layout.

## Credits

Typography: Space Grotesk headings, Manrope body text, and JetBrains Mono labels. Font licenses are included in `assets/fonts/`. Vendor copyright notices are preserved in their library files.

The anime portrait was created from the supplied photo with the built-in image-generation tool. Final edit: replace square sunglasses with round dark lenses and thin gold rims while preserving the character, pose, outfit, lighting, and transparent background.
