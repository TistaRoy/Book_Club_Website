/* =========================================================
   Unified script.js
   - Merges book arrays, OpenLibrary fallback, injection,
     arrow scrolling, bookmarks, random picker, and quotes.
   - Defensive: checks for element existence before acting.
   ========================================================= */

/* =======================
   BOOK DATA (use/extend as needed)
   ======================= */
const latestBooks = [
  { title: "The Widow", author: "John Grisham", img: "https://covers.openlibrary.org/b/isbn/9780385546452-L.jpg" },
  { title: "The Secret of Secrets", author: "Dan Brown", img: "https://covers.openlibrary.org/b/isbn/9780593490659-L.jpg" },
  { title: "The Correspondent", author: "Virginia Evans", img: "https://covers.openlibrary.org/b/isbn/9781982167651-L.jpg" },
  { title: "Alchemised", author: "SenLinYu", img: "https://covers.openlibrary.org/b/isbn/9781250897495-L.jpg" },
  { title: "Return of the Spider", author: "James Patterson", img: "https://covers.openlibrary.org/b/isbn/9780593292784-L.jpg" },
  { title: "Gone Before Goodbye", author: "Harlan Coben", img: "https://covers.openlibrary.org/b/isbn/9780593197108-L.jpg" },
  { title: "Fourth Wing", author: "Rebecca Yarros", img: "https://covers.openlibrary.org/b/isbn/9781250836104-L.jpg" },
  { title: "Iron Flame", author: "Rebecca Yarros", img: "https://covers.openlibrary.org/b/isbn/9781250885409-L.jpg" },
  { title: "The Housemaid", author: "Freida McFadden", img: "https://covers.openlibrary.org/b/isbn/9780593608307-L.jpg" },
  { title: "Project Hail Mary", author: "Andy Weir", img: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg" }
];

const trendingBooks = [
  { title: "Atomic Habits", author: "James Clear", img: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg" },
  { title: "The 48 Laws of Power", author: "Robert Greene", img: "https://covers.openlibrary.org/b/isbn/9780140280197-L.jpg" },
  { title: "It", author: "Stephen King", img: "https://covers.openlibrary.org/b/isbn/9781501142970-L.jpg" },
  { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", img: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg" },
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", img: "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg" },
  { title: "Pride and Prejudice", author: "Jane Austen", img: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg" },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", img: "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg" },
  { title: "Think and Grow Rich", author: "Napoleon Hill", img: "https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg" }
];

const highRatedBooks = [
  { title: "The Paper Menagerie", author: "Ken Liu", img: "https://covers.openlibrary.org/b/isbn/9780765382039-L.jpg" },
  { title: "Remarkably Bright Creatures", author: "Shelby Van Pelt", img: "https://covers.openlibrary.org/b/isbn/9780593133248-L.jpg" },
  { title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", img: "https://covers.openlibrary.org/b/isbn/9781604697930-L.jpg" },
  { title: "Project Hail Mary", author: "Andy Weir", img: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg" },
  { title: "The God of the Woods", author: "Liz Moore", img: "https://covers.openlibrary.org/b/isbn/9780593535272-L.jpg" },
  { title: "Good Spirits", author: "B.K. Borison", img: "https://covers.openlibrary.org/b/isbn/9780063191680-L.jpg" },
  { title: "Remarkable Creatures", author: "Tracy Chevalier", img: "https://covers.openlibrary.org/b/isbn/9780143111434-L.jpg" },
  { title: "Never Flinch", author: "Stephen King", img: "https://covers.openlibrary.org/b/isbn/9781982164322-L.jpg" }
];

/* =========================================================
   Helper: Try Open Library search by title+author for missing covers
   ========================================================= */
async function fetchCoverFromOpenLibrary(title, author) {
  const q = encodeURIComponent(`${title} ${author}`);
  const url = `https://openlibrary.org/search.json?q=${q}&limit=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const doc = data?.docs?.[0];
    if (!doc) return null;
    if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
    if (doc.isbn && doc.isbn.length) return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
  } catch (err) {
    // silent
  }
  return null;
}

/* =========================================================
   Inject books into a container, using cover fallback when needed
   - className defaults to "carousel-item"
   - preserves accessibility attributes
   ========================================================= */
async function injectBooksWithCovers(containerId, booksArray, className = "carousel-item") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear container
  container.innerHTML = "";

  // Kick-off cover fetches in parallel (but still use provided img as fallback)
  const coverPromises = booksArray.map(b => fetchCoverFromOpenLibrary(b.title, b.author).catch(() => null));
  const covers = await Promise.all(coverPromises);

  booksArray.forEach((book, i) => {
    const coverUrl = covers[i] || book.img || "https://via.placeholder.com/300x440?text=No+Cover";

    const card = document.createElement("div");
    card.className = className;
    card.setAttribute("role", "group");
    card.setAttribute("aria-label", `${book.title} by ${book.author}`);

    // Use same HTML structure as your CSS expects
    card.innerHTML = `
      <img src="${coverUrl}" class="book-cover" alt="${escapeHtml(book.title)} cover" loading="lazy" />
      <h4 class="book-title">${escapeHtml(book.title)}</h4>
      <p class="book-author">${escapeHtml(book.author)}</p>
    `;

    // fallback image if OpenLibrary or provided image gives white/blank or 404
    const imgEl = card.querySelector("img");
    imgEl.onerror = function () {
      if (!imgEl.dataset._errored) {
        imgEl.dataset._errored = "1";
        imgEl.src = book.img || "https://via.placeholder.com/300x440?text=No+Cover";
      }
    };

    // Click opens best-match Open Library page (if exists) or search page
    card.addEventListener("click", async () => {
      const q = encodeURIComponent(`${book.title} ${book.author}`);
      // try to find a work key
      try {
        const r = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=1`);
        if (r.ok) {
          const d = await r.json();
          const key = d?.docs?.[0]?.key;
          if (key) {
            // open work page (key may already start with /)
            window.open(`https://openlibrary.org${key}`, "_blank");
            return;
          }
        }
      } catch (e) {
        // ignore
      }
      window.open(`https://openlibrary.org/search?q=${q}`, "_blank");
    });

    container.appendChild(card);
  });
}

/* small helper to escape HTML text when injecting */
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* =========================================================
   Ensure arrow-row wrapper for a grid (adds prev/next buttons and wiring)
   - If your markup already contains dedicated prev/next buttons (IDs),
     you can also call setupCarouselByIds below instead.
   ========================================================= */
function ensureArrowRowForGrid(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  // already wrapped?
  if (grid.parentElement && grid.parentElement.classList.contains("scroll-row")) {
    grid.classList.add("scroll-track");
    return;
  }

  // create wrapper and buttons
  const wrapper = document.createElement("div");
  wrapper.className = "scroll-row";

  const prevBtn = document.createElement("button");
  prevBtn.className = "scroll-btn scroll-prev";
  prevBtn.type = "button";
  prevBtn.setAttribute("aria-label", "Previous");
  prevBtn.innerText = "❮";

  const nextBtn = document.createElement("button");
  nextBtn.className = "scroll-btn scroll-next";
  nextBtn.type = "button";
  nextBtn.setAttribute("aria-label", "Next");
  nextBtn.innerText = "❯";

  // style track and replace in DOM
  grid.classList.add("scroll-track");
  grid.parentElement.replaceChild(wrapper, grid);
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(grid);
  wrapper.appendChild(nextBtn);

  // compute scroll amount
  function getScrollAmount() {
    const first = grid.querySelector(".book-card-item, .carousel-item, .library-book");
    if (first) {
      const style = getComputedStyle(grid);
      const gap = parseFloat(style.gap || 16) || 16;
      return Math.round(first.offsetWidth + gap);
    }
    return Math.round(grid.clientWidth * 0.7);
  }

  nextBtn.addEventListener("click", () => grid.scrollBy({ left: getScrollAmount(), behavior: "smooth" }));
  prevBtn.addEventListener("click", () => grid.scrollBy({ left: -getScrollAmount(), behavior: "smooth" }));

  // keyboard support
  if (!grid.hasAttribute("tabindex")) grid.setAttribute("tabindex", "0");
  grid.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") grid.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    if (e.key === "ArrowLeft") grid.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });
}

/* =========================================================
   Setup carousel when you have explicit track + prev/next IDs
   (safe: it checks elements exist)
   ========================================================= */
function setupCarouselByIds(trackId, prevBtnId, nextBtnId) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  if (!track) return;

  function getScrollAmount() {
    const first = track.querySelector(".carousel-item, .book-card-item, .library-book");
    if (first) {
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap || 16) || 16;
      return Math.round(first.offsetWidth + gap);
    }
    return Math.round(track.clientWidth * 0.7);
  }

  function doScroll(delta) {
    if (typeof track.scrollBy === "function") {
      track.scrollBy({ left: delta, behavior: "smooth" });
      return;
    }
    // fallback
    track.scrollLeft += delta;
  }

  if (nextBtn) nextBtn.addEventListener("click", () => doScroll(getScrollAmount()));
  if (prevBtn) prevBtn.addEventListener("click", () => doScroll(-getScrollAmount()));
}

/* =========================================================
   Bookmarks (localStorage)
   ========================================================= */
function addBookmark(title, author, img) {
  try {
    const existing = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (!existing.some(b => b.title === title && b.author === author)) {
      existing.push({ title, author, img });
      localStorage.setItem("bookmarks", JSON.stringify(existing));
      // small feedback: you can replace alert with custom UI
      // alert("Book added to bookmarks.");
    }
  } catch (err) { /* ignore */ }
}

/* binds bookmark buttons that exist on cards (if you add them) */
document.addEventListener("click", (e) => {
  const el = e.target;
  if (el && el.classList && el.classList.contains("bookmark-btn")) {
    const { title, author, img } = el.dataset;
    addBookmark(title, author, img);
  }
});

/* =========================================================
   Random Book Picker
   ========================================================= */
const allBooksForPicker = [...latestBooks, ...trendingBooks, ...highRatedBooks];

function pickRandomHomepageBook() {
  const idx = Math.floor(Math.random() * allBooksForPicker.length);
  return allBooksForPicker[idx];
}

function displayRandomHomepageBook() {
  const book = pickRandomHomepageBook();
  const card = document.getElementById("randomBookCard");
  if (!card) return;
  // fade-out/fade-in
  card.classList.remove("show");
  setTimeout(() => {
    card.innerHTML = `
      <img src="${book.img}" class="book-cover" alt="${escapeHtml(book.title)}" />
      <h2 class="book-title">${escapeHtml(book.title)}</h2>
      <p class="book-author"><strong>Author:</strong> ${escapeHtml(book.author)}</p>
    `;
    card.classList.add("show");
  }, 150);
}

/* =========================================================
   Quotes rotation (supports #quoteCard with .quote/.quote-author OR fallback #quoteBox)
   ========================================================= */
const quoteObjects = [
  { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
  { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
  { text: "Once you learn to read, you will be forever free.", author: "Frederick Douglass" },
  { text: "Reading gives us someplace to go when we have to stay where we are.", author: "Mason Cooley" }
];

function startQuoteRotation() {
  const card = document.getElementById("quoteCard");
  const box = document.getElementById("quoteBox");
  let i = 0;

  if (card && card.querySelector && card.querySelector(".quote")) {
    const quoteText = card.querySelector(".quote");
    const quoteAuthor = card.querySelector(".quote-author");
    const cycle = () => {
      quoteText.style.opacity = 0;
      quoteAuthor.style.opacity = 0;
      setTimeout(() => {
        const q = quoteObjects[i % quoteObjects.length];
        quoteText.textContent = `“${q.text}”`;
        quoteAuthor.textContent = `— ${q.author}`;
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
        i++;
      }, 350);
    };
    cycle();
    setInterval(cycle, 3500);
    return;
  }

  if (box) {
    box.classList.remove("show");
    const texts = quoteObjects.map(q => q.text);
    const cycleBox = () => {
      box.classList.remove("show");
      setTimeout(() => {
        box.innerText = texts[i % texts.length];
        box.classList.add("show");
        i++;
      }, 250);
    };
    cycleBox();
    setInterval(cycleBox, 3500);
  }
}

/* =========================================================
   Utility: inject into a list of possible containers, wiring arrows intelligently
   - calls injectBooksWithCovers for every matching container.
   ========================================================= */
async function smartInjectAll() {
  // 1) Primary homepage single carousel (old layout)
  if (document.getElementById("carouselTrack")) {
    await injectBooksWithCovers("carouselTrack", latestBooks, "carousel-item");
    // wire arrows by class inside parent (.carousel)
    const carousel = document.getElementById("carousel");
    if (carousel) {
      const prev = carousel.querySelector(".carousel-btn.prev");
      const next = carousel.querySelector(".carousel-btn.next");
      if (prev && next) {
        setupCarouselByIds("carouselTrack", null, null); // we'll just use setupCarouselByIds below if specific IDs exist
        // but ensure arrow clicks work
        prev.addEventListener("click", () => document.getElementById("carouselTrack").scrollBy({ left: -getTrackScrollAmount("carouselTrack"), behavior: "smooth" }));
        next.addEventListener("click", () => document.getElementById("carouselTrack").scrollBy({ left: getTrackScrollAmount("carouselTrack"), behavior: "smooth" }));
      }
    }
  }

  // 2) Alternate: multiple carousel tracks (carouselTrack1/2/3)
  if (document.getElementById("carouselTrack1")) {
    await injectBooksWithCovers("carouselTrack1", latestBooks, "carousel-item");
    setupCarouselByIds("carouselTrack1", "prev1", "next1");
  }
  if (document.getElementById("carouselTrack2")) {
    await injectBooksWithCovers("carouselTrack2", trendingBooks, "carousel-item");
    setupCarouselByIds("carouselTrack2", "prev2", "next2");
  }
  if (document.getElementById("carouselTrack3")) {
    await injectBooksWithCovers("carouselTrack3", highRatedBooks, "carousel-item");
    setupCarouselByIds("carouselTrack3", "prev3", "next3");
  }

  // 3) Trending / HighRated grids (your grid IDs)
  if (document.getElementById("trendingGrid")) {
    await injectBooksWithCovers("trendingGrid", trendingBooks, "book-card-item");
    ensureArrowRowForGrid("trendingGrid");
  }
  if (document.getElementById("highRatedGrid")) {
    await injectBooksWithCovers("highRatedGrid", highRatedBooks, "book-card-item");
    ensureArrowRowForGrid("highRatedGrid");
  }

  // 4) library page grid (if present)
  if (document.getElementById("libraryGrid")) {
    // choose to show nothing until user clicks genre — do not auto inject here
    // but if you want to show trending there, you can uncomment next line:
    // await injectBooksWithCovers("libraryGrid", latestBooks, "library-book");
  }
}

/* helper for simple scroll amount used by legacy carousel wiring */
function getTrackScrollAmount(trackId) {
  const t = document.getElementById(trackId);
  if (!t) return 300;
  const first = t.querySelector(".carousel-item, .book-card-item, .library-book");
  if (first) {
    const style = getComputedStyle(t);
    const gap = parseFloat(style.gap || 16) || 16;
    return Math.round(first.offsetWidth + gap);
  }
  return Math.round(t.clientWidth * 0.7);
}

/* =========================================================
   ON DOM READY: run everything
   ========================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  // wire random picker button(s)
  document.getElementById("randomBtn")?.addEventListener("click", displayRandomHomepageBook);
  document.getElementById("randomPickerBtn")?.addEventListener("click", () => {
    displayRandomHomepageBook();
    document.querySelector("#random")?.scrollIntoView({ behavior: "smooth" });
  });

  // inject book lists and wire carousels
  await smartInjectAll();

  // start quotes
  startQuoteRotation();

  // show a random book once (optional)
  // displayRandomHomepageBook();
});
