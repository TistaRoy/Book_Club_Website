const latestBooks = [
  { title: "The Widow",                   author: "John Grisham",         img: "https://covers.openlibrary.org/b/isbn/9780385546452-L.jpg" },
  { title: "The Secret of Secrets",        author: "Dan Brown",            img: "https://covers.openlibrary.org/b/isbn/9780593490659-L.jpg" },
  { title: "The Correspondent",           author: "Virginia Evans",        img: "https://covers.openlibrary.org/b/isbn/9781982167651-L.jpg" },
  { title: "Alchemised",                  author: "SenLinYu",             img: "https://covers.openlibrary.org/b/isbn/9781250897495-L.jpg" },
  { title: "Return of the Spider",         author: "James Patterson",       img: "https://covers.openlibrary.org/b/isbn/9780593292784-L.jpg" },
  { title: "Gone Before Goodbye",          author: "Harlan Coben",          img: "https://covers.openlibrary.org/b/isbn/9780593197108-L.jpg" },
  { title: "Fourth Wing",                 author: "Rebecca Yarros",        img: "https://covers.openlibrary.org/b/isbn/9781250836104-L.jpg" },
  { title: "Iron Flame",                  author: "Rebecca Yarros",        img: "https://covers.openlibrary.org/b/isbn/9781250885409-L.jpg" },
  { title: "The Housemaid",               author: "Freida McFadden",      img: "https://covers.openlibrary.org/b/isbn/9780593608307-L.jpg" },
  { title: "Project Hail Mary",           author: "Andy Weir",             img: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg" }
];


const trendingBooks = [
  { title: "Atomic Habits",               author: "James Clear",           img: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg" },
  { title: "The 48 Laws of Power",        author: "Robert Greene",         img: "https://covers.openlibrary.org/b/isbn/9780140280197-L.jpg" },
  { title: "It",                          author: "Stephen King",          img: "https://covers.openlibrary.org/b/isbn/9781501142970-L.jpg" },
  { title: "Rich Dad Poor Dad",           author: "Robert T. Kiyosaki",     img: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg" },
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", img: "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg" },
  { title: "Pride and Prejudice",         author: "Jane Austen",           img: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg" },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson",  img: "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg" },
  { title: "Think and Grow Rich",        author: "Napoleon Hill",         img: "https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg" }
];


const highRatedBooks = [
  { title: "The Paper Menagerie",         author: "Ken Liu",                img: "https://covers.openlibrary.org/b/isbn/9780765382039-L.jpg" },
  { title: "Remarkably Bright Creatures", author: "Shelby Van Pelt",        img: "https://covers.openlibrary.org/b/isbn/9780593133248-L.jpg" },
  { title: "Braiding Sweetgrass",         author: "Robin Wall Kimmerer",    img: "https://covers.openlibrary.org/b/isbn/9781604697930-L.jpg" },
  { title: "Project Hail Mary",           author: "Andy Weir",              img: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg" },
  { title: "The God of the Woods",        author: "Liz Moore",              img: "https://covers.openlibrary.org/b/isbn/9780593535272-L.jpg" },
  { title: "Good Spirits",                author: "B.K. Borison",           img: "https://covers.openlibrary.org/b/isbn/9780063191680-L.jpg" },
  { title: "Remarkable Creatures",        author: "Tracy Chevalier",        img: "https://covers.openlibrary.org/b/isbn/9780143111434-L.jpg" },
  { title: "Never Flinch",                author: "Stephen King",           img: "https://covers.openlibrary.org/b/isbn/9781982164322-L.jpg" }
];


// ---------- Helper: fetch Open Library cover by title+author ----------
async function fetchCoverFromOpenLibrary(title, author) {
  // Build search query with both title and author for better matches
  const q = encodeURIComponent(`${title} ${author}`);
  const url = `https://openlibrary.org/search.json?q=${q}&limit=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) return null;

    const doc = data.docs[0];
    // Prefer cover_i if available
    if (doc.cover_i) {
      return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
    }

    // If doc has ISBNs we can try first ISBN
    if (doc.isbn && doc.isbn.length) {
      // use first ISBN
      return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
    }

    return null;
  } catch (err) {
    // network error or CORS; return null to let caller fallback
    return null;
  }
}

// ---------- Async injector: fetch covers then create cards ----------
async function injectBooksWithCovers(containerId, booksArray, className = "carousel-item") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ""; // reset

  // Kick off cover fetches in parallel
  const coverPromises = booksArray.map(b => fetchCoverFromOpenLibrary(b.title, b.author));

  // Wait for all to resolve (some may be null)
  const covers = await Promise.all(coverPromises);

  // Create cards using the fetched cover (or fallback)
  booksArray.forEach((book, i) => {
    const coverUrl = covers[i] || book.img || "https://via.placeholder.com/300x440?text=No+Cover";

    const card = document.createElement("div");
    card.className = className;

    // Accessible label
    card.setAttribute("aria-label", `${book.title} by ${book.author}`);

    card.innerHTML = `
      <img src="${coverUrl}" class="book-cover" alt="${book.title} cover" loading="lazy" />
      <h4 class="book-title">${book.title}</h4>
      <p class="book-author">${book.author}</p>
    `;

    // Optional: click handler to open Open Library page (if available)
    card.addEventListener("click", async (e) => {
      // try to open the Open Library work page for this book (best-effort)
      const searchQ = encodeURIComponent(`${book.title} ${book.author}`);
      const searchUrl = `https://openlibrary.org/search?q=${searchQ}&limit=1`;
      try {
        const r = await fetch(searchUrl);
        if (r.ok) {
          const d = await r.json();
          if (d.docs && d.docs[0] && d.docs[0].key) {
            // doc.key can be like "/works/OLxxxxxW" or "/books/OLxxxM"
            const key = d.docs[0].key;
            const olUrl = `https://openlibrary.org${key}`;
            window.open(olUrl, "_blank");
            return;
          }
        }
      } catch (err) {
        // ignore
      }
      // fallback: do nothing or open openlibrary search
      window.open(`https://openlibrary.org/search?q=${searchQ}`, "_blank");
    });

    container.appendChild(card);
  });
}

// ---------- DOM Ready: inject using the async function + ensure scroll wrappers ----------
document.addEventListener("DOMContentLoaded", async () => {
  // inject latest (carouselTrack)
  await injectBooksWithCovers("carouselTrack", latestBooks, "carousel-item");

  // inject trending & high rated into their grid containers (which we'll wrap)
  await injectBooksWithCovers("trendingGrid", trendingBooks, "book-card-item");
  await injectBooksWithCovers("highRatedGrid", highRatedBooks, "book-card-item");

  // NOW ensure arrow wrappers exist (use the function you already added earlier,
  // or include this inline version if you didn't add it yet)
  function ensureArrowRowForGrid(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    if (grid.parentElement && grid.parentElement.classList.contains("scroll-row")) {
      grid.classList.add('scroll-track');
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'scroll-row';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'scroll-btn scroll-prev';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.innerText = '❮';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'scroll-btn scroll-next';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.innerText = '❯';

    grid.classList.add('scroll-track');

    grid.parentElement.replaceChild(wrapper, grid);
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(grid);
    wrapper.appendChild(nextBtn);

    function getScrollAmount() {
      const first = grid.querySelector('.book-card-item, .carousel-item');
      if (first) {
        const style = getComputedStyle(grid);
        const gap = parseFloat(style.gap || 16) || 16;
        return Math.round(first.offsetWidth + gap);
      }
      return Math.round(grid.clientWidth * 0.7);
    }

    nextBtn.addEventListener('click', () => grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }));
    prevBtn.addEventListener('click', () => grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }));

    // keyboard support
    if (!grid.hasAttribute('tabindex')) grid.setAttribute('tabindex', '0');
    grid.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      if (e.key === 'ArrowLeft') grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  }

  ensureArrowRowForGrid('trendingGrid');
  ensureArrowRowForGrid('highRatedGrid');

  // Optional: refresh aria / accessibility info for carousel track if needed
});










// QUOTES ARRAY (Add more if you want)
const quotes = [
    { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
    { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
    { text: "Books are a uniquely portable magic.", author: "Stephen King" },
    { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
    { text: "Once you learn to read, you will be forever free.", author: "Frederick Douglass" },
    { text: "Reading gives us someplace to go when we have to stay where we are.", author: "Mason Cooley" }
];

// ELEMENTS
const quoteCard = document.getElementById("quoteCard");
const quoteText = quoteCard.querySelector(".quote");
const quoteAuthor = quoteCard.querySelector(".quote-author");

let index = 0;

// FUNCTION: Show Next Quote
function showNextQuote() {
    if (index < quotes.length) {
        // fade out
        quoteCard.style.opacity = 0;

        setTimeout(() => {
            // update quote
            quoteText.textContent = `"${quotes[index].text}"`;
            quoteAuthor.textContent = `— ${quotes[index].author}`;

            // fade in
            quoteCard.style.opacity = 1;
            index++;

            // show next quote after 3 seconds
            setTimeout(showNextQuote, 3000);
        }, 500);

    } else {
        // After all quotes → show loading
        quoteCard.style.opacity = 0;

        setTimeout(() => {
            quoteText.textContent = "Loading quotes...";
            quoteAuthor.textContent = "";
            quoteCard.style.opacity = 1;

            // show loading for 3 seconds then restart
            setTimeout(() => {
                index = 0;
                showNextQuote();
            }, 3000);

        }, 500);
    }
}
// Start the quote cycle on page load
window.onload = () => {
    showNextQuote();
};


