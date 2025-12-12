/* =========================================================
   BOOK DATA
   ========================================================= */

const latestBooks = [
  {
    title: "The Woman in Me",
    author: "Britney Spears",
    img: "https://m.media-amazon.com/images/I/71EdySouz+L._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    img: "https://m.media-amazon.com/images/I/91FhN5FkOJL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Iron Flame",
    author: "Rebecca Yarros",
    img: "https://m.media-amazon.com/images/I/81CqxZ7XKRL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Outlive",
    author: "Peter Attia",
    img: "https://m.media-amazon.com/images/I/71hvK3jZJAL._AC_UF1000,1000_QL80_.jpg"
  }
];

const trendingBooks = [
  {
    title: "It Ends With Us",
    author: "Colleen Hoover",
    img: "https://m.media-amazon.com/images/I/71E0GsMamML._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "It Starts With Us",
    author: "Colleen Hoover",
    img: "https://m.media-amazon.com/images/I/71jEvQwXOLL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "Ugly Love",
    author: "Colleen Hoover",
    img: "https://m.media-amazon.com/images/I/81s0B6NYXML._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    img: "https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_UF1000,1000_QL80_.jpg"
  }
];

const highRatedBooks = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    img: "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    img: "https://m.media-amazon.com/images/I/81Lb75rUhLL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    img: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    img: "https://m.media-amazon.com/images/I/81JVawG4gIL._AC_UF1000,1000_QL80_.jpg"
  }
];

/* =========================================================
   FETCH FALLBACK COVERS
   ========================================================= */

async function fetchCoverFromOpenLibrary(title, author) {
  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
      title
    )}&author=${encodeURIComponent(author)}&limit=1`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
      return `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`;
    }
  } catch (err) {
    console.warn("Cover fetch failed:", err);
  }

  return null; // fallback to provided image
}

/* =========================================================
   INJECT BOOKS TO CAROUSELS
   ========================================================= */

async function injectBooksWithCovers(containerId, books) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  for (let book of books) {
    const fallback = book.img;
    const onlineCover = await fetchCoverFromOpenLibrary(book.title, book.author);
    const finalImg = onlineCover || fallback;

    const card = document.createElement("div");
    card.className = "book-card fade-in";

    card.innerHTML = `
      <img src="${finalImg}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p class="author">${book.author}</p>
      <button class="btn small bookmark-btn" data-title="${book.title}" data-author="${book.author}" data-img="${finalImg}">
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
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

  if (!bookmarks.some(b => b.title === title)) {
    bookmarks.push({ title, author, img });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    alert("Book added to bookmarks!");
  }
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("bookmark-btn")) {
    const { title, author, img } = e.target.dataset;
    addBookmark(title, author, img);
  }
});

/* =========================================================
   CAROUSEL BUTTONS
   ========================================================= */

function setupCarousel(trackId, prevBtnId, nextBtnId) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  if (!track) return;

  nextBtn?.addEventListener("click", () => {
    track.scrollBy({ left: 300, behavior: "smooth" });
  });

  prevBtn?.addEventListener("click", () => {
    track.scrollBy({ left: -300, behavior: "smooth" });
  });
}

/* =========================================================
   RANDOM BOOK PICKER
   ========================================================= */

const allBooksForPicker = [
  ...latestBooks,
  ...trendingBooks,
  ...highRatedBooks
];

function pickRandomHomepageBook() {
  const randomIndex = Math.floor(Math.random() * allBooksForPicker.length);
  return allBooksForPicker[randomIndex];
}

function displayRandomHomepageBook() {
  const book = pickRandomHomepageBook();
  const card = document.getElementById("randomBookCard");

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

const quotes = [
  "A room without books is like a body without a soul.",
  "Books are a uniquely portable magic.",
  "Reading is dreaming with open eyes.",
  "So many books, so little time."
];

let quoteIndex = 0;

function showNextQuote() {
  const box = document.getElementById("quoteBox");
  if (!box) return;

  box.classList.remove("show");

  setTimeout(() => {
    box.innerText = quotes[quoteIndex];
    quoteIndex = (quoteIndex + 1) % quotes.length;
    box.classList.add("show");
  }, 300);
}

/* =========================================================
   ON PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  // Load carousels
  await injectBooksWithCovers("carouselTrack1", latestBooks);
  await injectBooksWithCovers("carouselTrack2", trendingBooks);
  await injectBooksWithCovers("carouselTrack3", highRatedBooks);

  setupCarousel("carouselTrack1", "prev1", "next1");
  setupCarousel("carouselTrack2", "prev2", "next2");
  setupCarousel("carouselTrack3", "prev3", "next3");

  // Random button
  document.getElementById("randomBtn")?.addEventListener("click", displayRandomHomepageBook);

  // Navigation random picker
  document.getElementById("randomPickerBtn")?.addEventListener("click", () => {
    displayRandomHomepageBook();
    document.querySelector("#random").scrollIntoView({ behavior: "smooth" });
  });

  // Quotes
  showNextQuote();
  setInterval(showNextQuote, 4000);
});



