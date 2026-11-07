(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Header: solid background after scrolling, mobile menu ---------- */
  const header = $(".site-header");
  const nav = $("#nav");
  const toggle = $(".nav-toggle");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Hero slideshow ---------- */
  const heroPhotos = PHOTOS.filter((p) => p.hero);
  const slides = $("#heroSlides");
  const caption = $("#heroCaption");
  heroPhotos.forEach((p, i) => {
    const img = new Image();
    img.src = photoUrl(p, 2000);
    img.alt = "";
    if (i === 0) img.classList.add("is-active");
    slides.appendChild(img);
  });
  let heroIndex = 0;
  const showCaption = () => {
    const p = heroPhotos[heroIndex];
    if (p) caption.textContent = `${p.title} — ${p.place}`;
  };
  showCaption();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroPhotos.length > 1 && !reduceMotion) {
    setInterval(() => {
      const imgs = slides.children;
      imgs[heroIndex].classList.remove("is-active");
      heroIndex = (heroIndex + 1) % imgs.length;
      imgs[heroIndex].classList.add("is-active");
      showCaption();
    }, 6000);
  }

  /* ---------- Gallery ---------- */
  const gallery = $("#gallery");
  PHOTOS.forEach((p, i) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.dataset.index = i;
    tile.dataset.category = p.category;
    tile.style.aspectRatio = `${p.w} / ${p.h}`;
    tile.style.animationDelay = `${(i % 6) * 60}ms`;
    tile.setAttribute("aria-label", `Open ${p.title}, ${p.place}`);

    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = `${p.title}, ${p.place}`;
    img.addEventListener("load", () => img.classList.add("is-loaded"));
    if (!p.src) {
      img.srcset = `${photoUrl(p, 600)} 600w, ${photoUrl(p, 800)} 800w, ${photoUrl(p, 1200)} 1200w`;
      img.sizes = "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw";
    }
    img.src = photoUrl(p, 800);

    const cap = document.createElement("figcaption");
    const title = document.createElement("strong");
    const meta = document.createElement("span");
    title.textContent = p.title;
    meta.textContent = `${p.place} · ${p.category}`;
    cap.append(title, meta);

    tile.append(img, cap);
    gallery.appendChild(tile);
  });

  const filters = $$(".filter");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      $$(".tile", gallery).forEach((t) => {
        const show = f === "all" || t.dataset.category === f;
        t.classList.toggle("is-hidden", !show);
        if (show) {
          // restart the entrance animation
          t.style.animation = "none";
          void t.offsetWidth;
          t.style.animation = "";
        }
      });
    })
  );

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  let current = 0;
  let lastFocus = null;

  const visibleIndexes = () =>
    $$(".tile:not(.is-hidden)", gallery).map((t) => Number(t.dataset.index));

  const render = () => {
    const p = PHOTOS[current];
    const list = visibleIndexes();
    const pos = list.indexOf(current);
    lbImg.src = photoUrl(p, 1800);
    lbImg.alt = `${p.title}, ${p.place}`;
    $("#lbTitle").textContent = p.title;
    $("#lbMeta").textContent = p.place;
    $("#lbCount").textContent = `${pos + 1} / ${list.length}`;
    // Preload neighbours for snappy navigation
    [-1, 1].forEach((d) => {
      const n = list[(pos + d + list.length) % list.length];
      new Image().src = photoUrl(PHOTOS[n], 1800);
    });
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    current = i;
    render();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $(".lb-close", lb).focus();
  };
  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  const step = (d) => {
    const list = visibleIndexes();
    current = list[(list.indexOf(current) + d + list.length) % list.length];
    render();
  };

  gallery.addEventListener("click", (e) => {
    const tile = e.target.closest(".tile");
    if (tile) open(Number(tile.dataset.index));
  });
  $(".lb-close", lb).addEventListener("click", close);
  $(".lb-prev", lb).addEventListener("click", () => step(-1));
  $(".lb-next", lb).addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Tab") {
      // keep focus inside the dialog
      const focusables = $$("button", lb);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  // Swipe on touch devices
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- Contact form ---------- */
  // No backend: validates, then opens the visitor's mail app with the message filled in.
  // To use a form service (Formspree, Netlify Forms, ...), give the form an action/method instead.
  const CONTACT_EMAIL = "hello@example.com";
  const form = $("#contactForm");
  const status = $("#formStatus");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("[required]", form).forEach((field) => {
      const valid = field.checkValidity() && field.value.trim() !== "";
      field.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      status.textContent = "Please fill in your name, a valid email and a message.";
      return;
    }
    const data = new FormData(form);
    const subject = encodeURIComponent(`${data.get("topic")} — ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n${data.get("name")} <${data.get("email")}>`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    status.textContent = "Thanks! Your mail app should open with the message ready to send.";
    form.reset();
  });

  $("#year").textContent = new Date().getFullYear();
})();
