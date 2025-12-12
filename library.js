function showBooks(genre) {
    // hide all book sections
    let sections = document.querySelectorAll('.books');
    sections.forEach(sec => sec.style.display = 'none');

    // show selected genre books
    document.getElementById(genre).style.display = 'block';
}