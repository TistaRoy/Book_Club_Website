/* =========================================================
   BOOK DATA — MERGED & CONSOLIDATED (Amazon preferred)
   ========================================================= */

const latestBooks = [
  // Amazon covers (more reliable)
  { title: "The Woman in Me", author: "Britney Spears", img: "https://m.media-amazon.com/images/I/71EdySouz+L._AC_UF1000,1000_QL80_.jpg" },
  { title: "Fourth Wing", author: "Rebecca Yarros", img: "https://m.media-amazon.com/images/I/91FhN5FkOJL._AC_UF1000,1000_QL80_.jpg" },
  { title: "Iron Flame", author: "Rebecca Yarros", img: "https://m.media-amazon.com/images/I/81CqxZ7XKRL._AC_UF1000,1000_QL80_.jpg" },
  { title: "Outlive", author: "Peter Attia", img: "https://m.media-amazon.com/images/I/71hvK3jZJAL._AC_UF1000,1000_QL80_.jpg" },

  // From OpenLibrary ISBN dataset
  { title: "The Widow", author: "John Grisham", img: "https://covers.openlibrary.org/b/isbn/9780385546452-L.jpg" },
  { title: "The Secret of Secrets", author: "Dan Brown", img: "https://covers.openlibrary.org/b/isbn/9780593490659-L.jpg" },
  { title: "The Correspondent", author: "Virginia Evans", img: "https://covers.openlibrary.org/b/isbn/9781982167651-L.jpg" },
  { title: "Project Hail Mary", author: "Andy Weir", img: "https://m.media-amazon.com/images/I/81z5fKeY2FL._AC_UF1000,1000_QL80_.jpg" }
];

const trendingBooks = [
  // Amazon edition
  { title: "It Ends With Us", author: "Colleen Hoover", img: "https://m.media-amazon.com/images/I/71E0GsMamML._AC_UF1000,1000_QL80_.jpg" },
  { title: "It Starts With Us", author: "Colleen Hoover", img: "https://m.media-amazon.com/images/I/71jEvQwXOLL._AC_UF1000,1000_QL80_.jpg" },
  { title: "Ugly Love", author: "Colleen Hoover", img: "https://m.media-amazon.com/images/I/81s0B6NYXML._AC_UF1000,1000_QL80_.jpg" },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", img: "https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_UF1000,1000_QL80_.jpg" },

  // Additional popular set
  { title: "Atomic Habits", author: "James Clear", img: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg" },
  { title: "It", author: "Stephen King", img: "https://covers.openlibrary.org/b/isbn/9781501142970-L.jpg" },
  { title: "Pride and Prejudice", author: "Jane Austen", img: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg" }
];

const highRatedBooks = [
  // Amazon edition
  { title: "Atomic Habits", author: "James Clear", img: "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg" },
  { title: "The Psychology of Money", author: "Morgan Housel", img: "https://m.media-amazon.com/images/I/81Lb75rUhLL._AC_UF1000,1000_QL80_.jpg" },
  { title: "The Alchemist", author: "Paulo Coelho", img: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg" },

  // Additional OpenLibrary set
  { title: "The Paper Menagerie", author: "Ken Liu", img: "https://covers.openlibrary.org/b/isbn/9780765382039-L.jpg" },
  { title: "Remarkably Bright Creatures", author: "Shelby Van Pelt", img: "https://covers.openlibrary.org/b/isbn/9780593133248-L.jpg" },
  { title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", img: "https://covers.openlibrary.org/b/isbn/9781604697930-L.jpg" }
];

/* =========================================================
   FALLBACK COVER FETCH (OpenLibrary)
   ========================================================= */
async function fetchCoverFromOpenLibrary(title, author) {
  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    const doc = data.docs?.[0];

    if (doc?.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
    if (doc?.isbn?.length) return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
  } catch (e) {}

  return null;
}

/* =========================================================
   INJECT BOOK CARDS (used everywhere)
   ========================================================= */
async function injectBooksWithCovers(containerId, books, className = "book-card-item") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  for (let book of books) {
    let finalImg = book.img;

    const tryOL = await fetchCoverFromOpenLibrary(book.title, book.author);
    if (tryOL) finalImg = tryOL;

    const card = document.createElement("div");
    card.className = className + " fade-in";

    card.innerHTML = `
      <img src="${finalImg}" alt="${book.title} cover" class="book-cover" />
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">${book.author}</p>
      <button class="btn small bookmark-btn" 
              data-title="${book.title}" 
              data-author="${book.author}" 
              data-img="${finalImg}">
        Bookmark
      </button>
    `;

    container.appendChild(card);
  }
}

/* =========================================================
   BOOKMARK SYSTEM
   ========================================================= */
function addBookmark(title, author, img) {
  const list = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  if (!list.some(b => b.title === title && b.author === author)) {
    list.push({ title, author, img });
    localStorage.setItem("bookmarks", JSON.stringify(list));
    alert("Book added to bookmarks!");
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("bookmark-btn")) {
    const { title, author, img } = e.target.dataset;
    addBookmark(title, author, img);
  }
});

/* =========================================================
   ARROW SCROLLING FOR CAROUSELS & GRIDS
   ========================================================= */
function setupCarousel(trackId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if (!track) return;

  const scrollAmt = () => {
    const first = track.querySelector(".book-card-item, .carousel-item");
    const gap = parseFloat(getComputedStyle(track).gap || 16);
    return first ? first.offsetWidth + gap : 300;
  };

  next?.addEventListener("click", () => track.scrollBy({ left: scrollAmt(), behavior: "smooth" }));
  prev?.addEventListener("click", () => track.scrollBy({ left: -scrollAmt(), behavior: "smooth" }));
}

/* =========================================================
   RANDOM BOOK PICKER
   ========================================================= */
const allBooksForPicker = [...latestBooks, ...trendingBooks, ...highRatedBooks];

function pickRandomHomepageBook() {
  return allBooksForPicker[Math.floor(Math.random() * allBooksForPicker.length)];
}

function displayRandomHomepageBook() {
  const book = pickRandomHomepageBook();
  const card = document.getElementById("randomBookCard");
  if (!card) return;

  card.classList.remove("show");

  setTimeout(() => {
    card.innerHTML = `
      <img src="${book.img}" class="book-cover-large" />
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
    `;
    card.classList.add("show");
  }, 200);
}

/* =========================================================
   QUOTES ROTATION
   ========================================================= */
const quoteObjects = [
  { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
  { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
  { text: "Reading gives us someplace to go when we have to stay where we are.", author: "Mason Cooley" }
];

function startQuoteRotation() {
  const card = document.getElementById("quoteCard");
  const box = document.getElementById("quoteBox");
  let i = 0;

  if (card) {
    const qText = card.querySelector(".quote");
    const qAuth = card.querySelector(".quote-author");

    const cycle = () => {
      qText.style.opacity = 0;
      qAuth.style.opacity = 0;
      setTimeout(() => {
        const q = quoteObjects[i % quoteObjects.length];
        qText.textContent = `“${q.text}”`;
        qAuth.textContent = `— ${q.author}`;
        qText.style.opacity = 1;
        qAuth.style.opacity = 1;
        i++;
      }, 300);
    };

    cycle();
    setInterval(cycle, 3500);
  }

  else if (box) {
    const cycle = () => {
      box.classList.remove("show");
      setTimeout(() => {
        box.textContent = quoteObjects[i % quoteObjects.length].text;
        box.classList.add("show");
        i++;
      }, 250);
    };
    cycle();
    setInterval(cycle, 3500);
  }
}

/* =========================================================
   DOM READY
   ========================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  // Homepage carousels
  await injectBooksWithCovers("carouselTrack1", latestBooks);
  await injectBooksWithCovers("carouselTrack2", trendingBooks);
  await injectBooksWithCovers("carouselTrack3", highRatedBooks);

  setupCarousel("carouselTrack1", "prev1", "next1");
  setupCarousel("carouselTrack2", "prev2", "next2");
  setupCarousel("carouselTrack3", "prev3", "next3");

  // Random section
  document.getElementById("randomBtn")?.addEventListener("click", displayRandomHomepageBook);

  // Quotes
  startQuoteRotation();
});
