const JSON_URL = 'posts.json';

// Fetch the posts
async function fetchPosts() {
    try {
        const response = await fetch(JSON_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading posts:", error);
        return [];
    }
}

// Logic for the Homepage (Grid)
async function loadBlogGrid() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return; // Stop if we are not on the homepage

    const posts = await fetchPosts();
    grid.innerHTML = ''; // Clear loading text

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="card-content">
                <span class="category">${post.category}</span>
                <h3><a href="article.html?id=${post.id}">${post.title}</a></h3>
                <p>${post.summary}</p>
                <a href="article.html?id=${post.id}" class="read-more">Read More &rarr;</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Logic for the Article Page
async function loadSingleArticle() {
    const container = document.getElementById('article-content');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const posts = await fetchPosts();
    const post = posts.find(p => p.id === postId);

    if (post) {
        document.title = `${post.title} - Hamza IT Solutions`;
        container.innerHTML = `
            <span class="category">${post.category}</span>
            <h1>${post.title}</h1>
            <p class="meta">Published on ${post.date}</p>
            <img src="${post.image}" class="featured-image">
            <div class="content-body">
                ${post.content}
            </div>
        `;
    } else {
        container.innerHTML = `<h2>Article not found.</h2><a href="index.html">Go Home</a>`;
    }
}

// Run the homepage logic if we are on index
document.addEventListener('DOMContentLoaded', loadBlogGrid);