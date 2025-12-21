// Add a simple interaction to the button
document.getElementById('cta-btn').addEventListener('click', function () {
    alert('Thank you for your interest in Hamza IT Solutions! We will be with you shortly.');
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});