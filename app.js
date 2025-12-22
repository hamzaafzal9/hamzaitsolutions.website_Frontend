// ============================================
// HAMZA IT SOLUTIONS - BLOG APPLICATION
// Post Loading, Article Display, and Category Filtering
// ============================================

const JSON_URL = 'posts.json';

// ========================================
// FETCH POSTS FROM JSON
// ========================================
async function fetchPosts() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading posts:", error);
        return [];
    }
}

// ========================================
// HOMEPAGE - LOAD BLOG GRID
// ========================================
async function loadBlogGrid() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    const posts = await fetchPosts();
    grid.innerHTML = '';

    if (posts.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 style="color: #374151; margin-bottom: 12px;">No articles yet</h3>
                <p style="color: #6b7280;">Check back soon for new content!</p>
            </div>
        `;
        return;
    }

    posts.forEach((post, index) => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const categoryClass = post.category.toLowerCase();
        const readTime = post.readTime || calculateReadTime(post.content);

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </div>
            <div class="card-content">
                <span class="category ${categoryClass}">${post.category}</span>
                <h3><a href="/article?id=${post.id}" target="_blank" rel="noopener">${post.title}</a></h3>
                <p>${post.summary}</p>
                <div class="card-meta">
                    <span>${formatDate(post.date)} • ${readTime} min read</span>
                    <a href="/article?id=${post.id}" target="_blank" rel="noopener" class="read-more">Read More →</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ========================================
// CATEGORY PAGE - LOAD FILTERED POSTS
// ========================================
async function loadCategoryPosts(category) {
    const grid = document.getElementById('category-grid');
    if (!grid) return;

    const posts = await fetchPosts();
    const filteredPosts = posts.filter(post =>
        post.category.toLowerCase() === category.toLowerCase()
    );

    grid.innerHTML = '';

    if (filteredPosts.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 style="color: #374151; margin-bottom: 12px;">No articles in this category yet</h3>
                <p style="color: #6b7280;">Check back soon for new ${category} content!</p>
            </div>
        `;
        return;
    }

    filteredPosts.forEach((post, index) => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const categoryClass = post.category.toLowerCase();
        const readTime = post.readTime || calculateReadTime(post.content);

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </div>
            <div class="card-content">
                <span class="category ${categoryClass}">${post.category}</span>
                ${post.subcategory ? `<span class="subcategory">${post.subcategory}</span>` : ''}
                <h3><a href="/article?id=${post.id}" target="_blank" rel="noopener">${post.title}</a></h3>
                <p>${post.summary}</p>
                <div class="card-meta">
                    <span>${formatDate(post.date)} • ${readTime} min read</span>
                    <a href="/article?id=${post.id}" target="_blank" rel="noopener" class="read-more">Read More →</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ========================================
// ARTICLE PAGE - LOAD SINGLE ARTICLE
// ========================================
async function loadSingleArticle() {
    const container = document.getElementById('article-content');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Article not found</h2>
                <p>The requested article could not be found.</p>
                <a href="/" class="btn btn-primary">Go to Homepage</a>
            </div>
        `;
        return;
    }

    const posts = await fetchPosts();
    const post = posts.find(p => p.id === postId);

    if (post) {
        // Update page title
        document.title = `${post.title} - Hamza IT Solutions`;

        // Update meta description if exists
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', post.summary);
        }

        const categoryClass = post.category.toLowerCase();
        const readTime = post.readTime || calculateReadTime(post.content);
        const author = post.author || 'Hamza';

        container.innerHTML = `
            <span class="category ${categoryClass}">${post.category}</span>
            <h1>${post.title}</h1>
            <p class="meta">
                <span>By ${author}</span>
                <span>•</span>
                <span>${formatDate(post.date)}</span>
                <span>•</span>
                <span>${readTime} min read</span>
            </p>
            <img src="${post.image}" alt="${post.title}" class="featured-image">
            <div class="content-body">
                ${post.content}
            </div>
            
            <div class="article-footer" style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <div class="share-section" style="margin-bottom: 30px;">
                    <h4 style="color: #374151; margin-bottom: 16px; font-size: 1rem;">Share this article:</h4>
                    <div class="share-buttons" style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}" 
                           target="_blank" rel="noopener" 
                           style="padding: 10px 20px; background: #1DA1F2; color: white; border-radius: 50px; font-size: 0.9rem; font-weight: 500;">
                            Twitter
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
                           target="_blank" rel="noopener"
                           style="padding: 10px 20px; background: #4267B2; color: white; border-radius: 50px; font-size: 0.9rem; font-weight: 500;">
                            Facebook
                        </a>
                        <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}" 
                           target="_blank" rel="noopener"
                           style="padding: 10px 20px; background: #0077B5; color: white; border-radius: 50px; font-size: 0.9rem; font-weight: 500;">
                            LinkedIn
                        </a>
                    </div>
                </div>
                
                <div class="author-box" style="background: #f9fafb; padding: 24px; border-radius: 12px; display: flex; gap: 20px; align-items: center;">
                    <div class="author-avatar" style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #0ea5e9); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
                        ${author.charAt(0).toUpperCase()}
                    </div>
                    <div class="author-info">
                        <h4 style="color: #111827; margin-bottom: 4px;">Written by ${author}</h4>
                        <p style="color: #6b7280; font-size: 0.9rem; margin: 0;">Technology enthusiast sharing knowledge about hardware, software, and mobile devices.</p>
                    </div>
                </div>
            </div>
        `;

        // Load related articles
        loadRelatedArticles(post, posts);

    } else {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px;">
                <h2 style="color: #374151; margin-bottom: 12px;">Article not found</h2>
                <p style="color: #6b7280; margin-bottom: 24px;">Sorry, we couldn't find the article you're looking for.</p>
                <a href="/" class="btn btn-primary" style="padding: 14px 28px; background: linear-gradient(135deg, #6366f1, #0ea5e9); color: white; border-radius: 50px; font-weight: 600;">Go to Homepage</a>
            </div>
        `;
    }
}

// ========================================
// LOAD RELATED ARTICLES
// ========================================
async function loadRelatedArticles(currentPost, allPosts) {
    const relatedContainer = document.getElementById('related-articles');
    if (!relatedContainer) return;

    const related = allPosts
        .filter(post => post.id !== currentPost.id && post.category === currentPost.category)
        .slice(0, 3);

    if (related.length === 0) {
        relatedContainer.style.display = 'none';
        return;
    }

    let html = '<h3 style="color: #111827; margin-bottom: 24px; font-size: 1.5rem;">Related Articles</h3>';
    html += '<div class="blog-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">';

    related.forEach(post => {
        const categoryClass = post.category.toLowerCase();
        html += `
            <div class="blog-card">
                <div class="card-image-container">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
                <div class="card-content">
                    <span class="category ${categoryClass}">${post.category}</span>
                    <h3><a href="/article?id=${post.id}" target="_blank" rel="noopener">${post.title}</a></h3>
                    <a href="/article?id=${post.id}" target="_blank" rel="noopener" class="read-more">Read More →</a>
                </div>
            </div>
        `;
    });

    html += '</div>';
    relatedContainer.innerHTML = html;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Calculate reading time (roughly 200 words per minute)
function calculateReadTime(content) {
    if (!content) return 3;
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return readTime < 1 ? 1 : readTime;
}

// ========================================
// INITIALIZE ON DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    // Load blog grid on homepage
    loadBlogGrid();
});