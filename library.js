function showBooks(genre) {
    // hide all book sections
    let sections = document.querySelectorAll('.books');
    sections.forEach(sec => sec.style.display = 'none');

    // show selected genre books
    document.getElementById(genre).style.display = 'block';
}


/* ========== Genre -> books mapping (title, author; provide isbn OR img) ==========
   If isbn is present the script will use Open Library covers via:
     https://covers.openlibrary.org/b/isbn/<ISBN>-L.jpg
   Otherwise it will use the provided img URL or fall back to a placeholder.
   You can edit these arrays to use your own images or to add more books.
============================================================================= */

/* ===========================
   Library genre click-to-show
   Paste this into library.js
   =========================== */
/* ===========================
   Expanded genres + robust rendering with image fallback
   Paste this into library.js (replace previous genreBooks / render logic)
   =========================== */

const genreBooks = {
  fantasy: [
    { title: "The Hobbit",               author: "J.R.R. Tolkien",    isbn: "9780261103344" },
    { title: "A Game of Thrones",        author: "George R. R. Martin", isbn: "9780553103540" },
    { title: "The Name of the Wind",     author: "Patrick Rothfuss",  isbn: "9780756404741" },
    { title: "Uprooted",                 author: "Naomi Novik",       isbn: "9781594634024" },
    { title: "The Priory of the Orange Tree", author: "Samantha Shannon", isbn: "9780356512703" },
    { title: "The Way of Kings",         author: "Brandon Sanderson", isbn: "9780765326355" },
    { title: "Mistborn: The Final Empire",author: "Brandon Sanderson", isbn: "9780765311788" },
    { title: "The Lies of Locke Lamora", author: "Scott Lynch",       isbn: "9780553588941" },
    { title: "The Hobbit: Illustrated",  author: "J.R.R. Tolkien",    isbn: "9780007487301" },
    { title: "The Eye of the World",     author: "Robert Jordan",     isbn: "9780812511819" }
  ],
  romance: [
    { title: "Pride and Prejudice",      author: "Jane Austen",       isbn: "9780141439518" },
    { title: "The Notebook",             author: "Nicholas Sparks",   isbn: "9780446605236" },
    { title: "Me Before You",            author: "Jojo Moyes",        isbn: "9780143124542" },
    { title: "The Time Traveler's Wife", author: "Audrey Niffenegger", isbn: "9780156029438" },
    { title: "Outlander",                author: "Diana Gabaldon",    isbn: "9780440212560" },
    { title: "The Kiss Quotient",        author: "Helen Hoang",       isbn: "9780451490803" },
    { title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman", isbn: "9780008246372" },
    { title: "The Rosie Project",        author: "Graeme Simsion",    isbn: "9781476729076" },
    { title: "Normal People",            author: "Sally Rooney",      isbn: "9780571334650" },
    { title: "The Hating Game",          author: "Sally Thorne",      isbn: "9781501110355" }
  ],
  mystery: [
    { title: "Murder on the Orient Express", author: "Agatha Christie", isbn: "9780062693662" },
    { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", isbn: "9780307454546" },
    { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", isbn: "9780140437866" },
    { title: "In the Woods",              author: "Tana French",       isbn: "9780143113491" },
    { title: "Big Little Lies",           author: "Liane Moriarty",    isbn: "9780425274866" },
    { title: "The Silent Patient",        author: "Alex Michaelides",  isbn: "9781250301697" },
    { title: "And Then There Were None",  author: "Agatha Christie",   isbn: "9780007119318" },
    { title: "The Woman in the Window",   author: "A.J. Finn",         isbn: "9780062678416" },
    { title: "The Da Vinci Code",         author: "Dan Brown",         isbn: "9780307474278" },
    { title: "The Reversal",              author: "Michael Connelly",  isbn: "9780316013858" }
  ],
  scifi: [
    { title: "Dune",                     author: "Frank Herbert",     isbn: "9780441013593" },
    { title: "Project Hail Mary",        author: "Andy Weir",         isbn: "9780593135204" },
    { title: "Neuromancer",             author: "William Gibson",    isbn: "9780441569595" },
    { title: "The Martian",              author: "Andy Weir",         isbn: "9780553418026" },
    { title: "Ender's Game",            author: "Orson Scott Card",  isbn: "9780812550702" },
    { title: "Ready Player One",         author: "Ernest Cline",      isbn: "9780307887443" },
    { title: "Snow Crash",               author: "Neal Stephenson",   isbn: "9780553380958" },
    { title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", isbn: "9780441478125" },
    { title: "Foundation",               author: "Isaac Asimov",      isbn: "9780553293357" },
    { title: "The Forever War",          author: "Joe Haldeman",      isbn: "9780312873011" }
  ],
  thriller: [
    { title: "Gone Girl",                author: "Gillian Flynn",     isbn: "9780307588371" },
    { title: "The Da Vinci Code",        author: "Dan Brown",         isbn: "9780307474278" },
    { title: "The Girl on the Train",    author: "Paula Hawkins",     isbn: "9781594633669" },
    { title: "The Silence",              author: "Don DeLillo",       isbn: "9780143111725" },
    { title: "The Bourne Identity",      author: "Robert Ludlum",     isbn: "9780553277165" },
    { title: "Shutter Island",           author: "Dennis Lehane",     isbn: "9781416573537" },
    { title: "I Am Pilgrim",             author: "Terry Hayes",       isbn: "9781592404941" },
    { title: "Before I Go to Sleep",     author: "S. J. Watson",      isbn: "9781416571762" },
    { title: "The Night Manager",        author: "John le Carré",     isbn: "9780140106003" },
    { title: "The Girl with a Clock for a Heart", author: "Peter Swanson", isbn: "9781250040196" }
  ],
  horror: [
    { title: "It",                       author: "Stephen King",      isbn: "9781501142970" },
    { title: "The Haunting of Hill House", author: "Shirley Jackson", isbn: "9780143104972" },
    { title: "The Shining",              author: "Stephen King",      isbn: "9780307743657" },
    { title: "House of Leaves",          author: "Mark Z. Danielewski", isbn: "9780375760802" },
    { title: "World War Z",              author: "Max Brooks",        isbn: "9780099529191" },
    { title: "Bird Box",                 author: "Josh Malerman",     isbn: "9780062259654" },
    { title: "Mexican Gothic",           author: "Silvia Moreno-Garcia", isbn: "9781529043406" },
    { title: "The Exorcist",             author: "William Peter Blatty", isbn: "9780060915486" },
    { title: "Doctor Sleep",             author: "Stephen King",      isbn: "9781451698856" },
    { title: "Coraline",                 author: "Neil Gaiman",       isbn: "9780380977789" }
  ]
};

/* helper that returns the cover url if isbn exists, else fallback to provided img, else placeholder */
function coverUrlFor(book) {
  if (book.isbn) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
  }
  if (book.img) return book.img;
  return "https://via.placeholder.com/300x440?text=No+Cover";
}

/* render function: populates #libraryGrid with cards and attaches image error fallback */
function renderLibraryBooks(list, genreName) {
  const grid = document.getElementById("libraryGrid");
  if (!grid) return;
  grid.innerHTML = ""; // clear

  // Optional heading
  const heading = document.createElement("h2");
  heading.textContent = `${genreName.charAt(0).toUpperCase() + genreName.slice(1)} Books`;
  heading.style.margin = "0 0 0.6rem 0";
  grid.appendChild(heading);

  const row = document.createElement("div");
  row.className = "library-grid";
  row.style.marginTop = "0.6rem";

  list.forEach(book => {
    const card = document.createElement("div");
    card.className = "library-book";

    const img = document.createElement("img");
    img.alt = `${book.title} cover`;
    img.loading = "lazy";
    img.src = coverUrlFor(book);

    // If the cover fails to load (blank white), replace with placeholder
    img.onerror = function () {
      // avoid endless loop if placeholder also fails
      if (!img.dataset._errored) {
        img.dataset._errored = "1";
        img.src = "https://via.placeholder.com/300x440?text=No+Cover";
      }
    };

    const titleEl = document.createElement("h4");
    titleEl.className = "title";
    titleEl.textContent = book.title;

    const authorEl = document.createElement("p");
    authorEl.className = "author";
    authorEl.textContent = book.author;

    card.appendChild(img);
    card.appendChild(titleEl);
    card.appendChild(authorEl);

    // clicking opens Open Library search for the book in a new tab
    card.addEventListener("click", () => {
      const q = encodeURIComponent(`${book.title} ${book.author}`);
      window.open(`https://openlibrary.org/search?q=${q}&limit=1`, "_blank");
    });

    row.appendChild(card);
  });

  grid.appendChild(row);
  grid.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* showBooks: called when a user clicks a genre button */
function showBooks(genre) {
  const key = genre.toLowerCase();
  const books = genreBooks[key] || [];

  // highlight active button
  document.querySelectorAll(".genre-card").forEach(btn => {
    const onclick = btn.getAttribute("onclick") || "";
    if (onclick.includes(`'${key}'`) || onclick.includes(`"${key}"`)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // hide static .books blocks (if any)
  document.querySelectorAll('.books').forEach(el => el.style.display = 'none');

  if (!books.length) {
    const grid = document.getElementById("libraryGrid");
    if (grid) {
      grid.innerHTML = `<div class="muted" style="padding:1rem">No books found for <strong>${genre}</strong>.</div>`;
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }

  renderLibraryBooks(books, key);
}

/* DOM ready: set initial state (no auto-open), attach handlers defensively */
document.addEventListener("DOMContentLoaded", () => {
  // hide the inline static .books containers so they don't duplicate content
  document.querySelectorAll('.books').forEach(el => el.style.display = 'none');

  // initial prompt in libraryGrid
  const grid = document.getElementById("libraryGrid");
  if (grid) {
    grid.innerHTML = `<div class="muted" style="padding:1rem">Choose a genre above to browse books.</div>`;
  }

  // attach listeners to genre buttons so clicking works even if inline onclick removed
  document.querySelectorAll(".genre-card").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const onclick = btn.getAttribute("onclick") || "";
      let genre = null;
      const match = onclick.match(/showBooks\((?:'|")?([a-zA-Z0-9_-]+)(?:'|")?\)/);
      if (match && match[1]) genre = match[1];
      else genre = btn.dataset.genre || btn.textContent.trim().toLowerCase();
      if (genre) showBooks(genre);
    });
  });
});

