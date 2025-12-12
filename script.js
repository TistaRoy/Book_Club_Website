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
