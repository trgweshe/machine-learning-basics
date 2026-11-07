# Ardent Light — photography portfolio

A static, dependency-free photography website: plain HTML, CSS and JavaScript.

## Features

- Full-screen hero slideshow with captions
- Masonry portfolio gallery with category filters
- Lightbox with keyboard (← → Esc), click and swipe navigation
- About, services/pricing and contact sections
- Responsive layout with a mobile menu, automatic dark mode, reduced-motion support

## Run it

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

It can be hosted as-is on GitHub Pages, Netlify or any static host.

## Make it yours

- **Photos:** edit `photos.js`. Put your images in `images/` and give each entry
  `src: "images/your-photo.jpg"`, a title, place, category, its aspect ratio (`w`, `h`),
  and `hero: true` for photos that should appear in the slideshow.
  The bundled entries are placeholders loaded from picsum.photos (Unsplash-licensed),
  so their titles won't always match the picture.
- **Text:** name, bio, prices and email address live in `index.html`.
  The contact form's address is `CONTACT_EMAIL` in `script.js`.
- **Colours and fonts:** the variables at the top of `styles.css`.
