// ============================================
// HAMZA IT SOLUTIONS - MAIN JAVASCRIPT
// Navigation, Cookie Consent, and UI Interactions
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navDropdowns = document.querySelectorAll('.nav-dropdown');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Handle dropdown clicks on mobile
    navDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();

            if (query) {
                // Filter articles based on search
                filterArticles(query);
            } else {
                // Show all articles
                loadBlogGrid();
            }
        });

        // Real-time search (optional - debounced)
        let searchTimeout;
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            const query = this.value.trim().toLowerCase();

            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    filterArticles(query);
                } else if (query.length === 0) {
                    loadBlogGrid();
                }
            }, 300);
        });
    }

    // ========================================
    // COOKIE CONSENT
    // ========================================
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');
    const declineCookies = document.getElementById('declineCookies');

    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');

    if (!cookieChoice && cookieBanner) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1500);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'accepted');
            hideCookieBanner();
            // Here you would typically initialize analytics, ads, etc.
            console.log('Cookies accepted - analytics can be initialized');
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'declined');
            hideCookieBanner();
            console.log('Cookies declined');
        });
    }

    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.style.animation = 'slideDown 0.4s ease forwards';
            setTimeout(() => {
                cookieBanner.classList.remove('show');
                cookieBanner.style.display = 'none';
            }, 400);
        }
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========================================
    // LAZY LOADING FOR IMAGES
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // ADD ANIMATION ON SCROLL
    // ========================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.blog-card, .category-card, .about-section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    };

    // Initialize animations after content loads
    setTimeout(animateOnScroll, 100);
});

// ========================================
// FILTER ARTICLES BY SEARCH QUERY
// ========================================
async function filterArticles(query) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    const posts = await fetchPosts();
    const filteredPosts = posts.filter(post => {
        const searchText = `${post.title} ${post.summary} ${post.category}`.toLowerCase();
        return searchText.includes(query);
    });

    grid.innerHTML = '';

    if (filteredPosts.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 style="color: #374151; margin-bottom: 12px;">No articles found</h3>
                <p style="color: #6b7280;">Try a different search term or browse our categories.</p>
            </div>
        `;
        return;
    }

    filteredPosts.forEach(post => {
        const card = createBlogCard(post);
        grid.appendChild(card);
    });
}

// ========================================
// CREATE BLOG CARD ELEMENT
// ========================================
function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';

    const categoryClass = post.category.toLowerCase();

    card.innerHTML = `
        <div class="card-image-container">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="card-content">
            <span class="category ${categoryClass}">${post.category}</span>
            <h3><a href="/article?id=${post.id}" target="_blank" rel="noopener">${post.title}</a></h3>
            <p>${post.summary}</p>
            <div class="card-meta">
                <span>${post.date}</span>
                <a href="/article?id=${post.id}" target="_blank" rel="noopener" class="read-more">Read More →</a>
            </div>
        </div>
    `;

    return card;
}

// Add CSS animation for cookie banner slide down
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);