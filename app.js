const JSON_URL = '/posts.json'; // Added / to make it absolute

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

async function loadBlogGrid() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    const posts = await fetchPosts();
    grid.innerHTML = '';

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        // CHANGE: We now use /article/${post.id} instead of article.html?id=...
        card.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="card-content">
                <span class="category">${post.category}</span>
                <h3><a href="/article/${post.id}">${post.title}</a></h3>
                <p>${post.summary}</p>
                <a href="/article/${post.id}" class="read-more">Read More &rarr;</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function loadSingleArticle() {
    const container = document.getElementById('article-content');
    if (!container) return;

    // CHANGE: We get the ID from the URL path (last part) instead of ?id=
    // Example: /article/flutter-vs-native -> id = flutter-vs-native
    const postId = window.location.pathname.split('/').pop();
    
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
        container.innerHTML = `<h2>Article not found.</h2><a href="/">Go Home</a>`;
    }
}

document.addEventListener('DOMContentLoaded', loadBlogGrid);
