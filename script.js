document.addEventListener('DOMContentLoaded', () => {
    // API base URL
    const API_BASE = 'http://localhost:3000/api';
    
    // Select all pages and navigation elements
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-arrow, .nav-button.home');
    const container = document.getElementById('pages-container');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // Define the correct, sequential flow of pages for navigation
    const pageFlow = [
        'griffin-family',
        'peter-griffin',
        'lois-griffin',
        'stewie-griffin',
        'meg-griffin',
        'chris-griffin',
        'brian-griffin'
    ];

    // --- USER AUTHENTICATION ---

    // Check if user is logged in
    function getUser() {
        const userStr = localStorage.getItem('griffinpedia_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    function setUser(user) {
        localStorage.setItem('griffinpedia_user', JSON.stringify(user));
    }

    // Show login modal if user is not logged in
    function checkLogin() {
        const user = getUser();
        if (!user) {
            loginModal.classList.remove('hidden');
        } else {
            loginModal.classList.add('hidden');
            // Load comments for all character pages
            loadAllComments();
        }
    }

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        
        const username = document.getElementById('username-input').value.trim();
        const email = document.getElementById('email-input').value.trim();
        const submitBtn = loginForm.querySelector('.login-submit-btn');
        
        if (!username || !email) {
            loginError.textContent = 'Please fill in all fields';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Loading...';

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email })
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                loginModal.classList.add('hidden');
                loadAllComments();
            } else {
                loginError.textContent = data.error || 'Login failed';
            }
        } catch (error) {
            loginError.textContent = 'Connection error. Make sure the server is running.';
            console.error('Login error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Continue';
        }
    });

    // --- Core Navigation Functions ---

    // Function to show a specific page by ID
    function showPage(targetId) {
        let found = false;
        pages.forEach(page => {
            if (page.id === targetId) {
                // Show the target page
                page.classList.add('active');
                found = true;
                // Load comments for this page when it becomes active
                if (getUser()) {
                    loadCommentsForPage(targetId);
                }
            } else {
                // Hide all other pages
                page.classList.remove('active');
            }
        });

        if (!found) {
            console.error(`Page with ID "${targetId}" not found. Check your HTML attributes.`);
        }
    }

    // Gets the ID of the currently visible page
    function getCurrentPageId() {
        const activePage = document.querySelector('.page.active');
        return activePage ? activePage.id : null;
    }
    
    // Gets the next page ID based on the flow array (wraps around)
    function getNextPageId(currentPageId) {
        const currentIndex = pageFlow.indexOf(currentPageId);
        if (currentIndex === -1) return null;
        
        const nextIndex = (currentIndex + 1) % pageFlow.length;
        return pageFlow[nextIndex];
    }

    // Gets the previous page ID based on the flow array (wraps around)
    function getPrevPageId(currentPageId) {
        const currentIndex = pageFlow.indexOf(currentPageId);
        if (currentIndex === -1) return null;
        
        const prevIndex = (currentIndex - 1 + pageFlow.length) % pageFlow.length;
        return pageFlow[prevIndex];
    }
    
    // --- 1. KEYBOARD NAVIGATION ---
    
    window.addEventListener('keydown', (e) => {
        const currentPageId = getCurrentPageId();

        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault(); // Prevents browser scroll
                const nextId = getNextPageId(currentPageId);
                if (nextId) showPage(nextId);
                break;
            case 'ArrowLeft':
                e.preventDefault(); // Prevents browser scroll
                const prevId = getPrevPageId(currentPageId);
                if (prevId) showPage(prevId);
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                // Prevents Up/Down arrows from scrolling the container
                e.preventDefault();
                break;
        }
    });

    // --- 2. MOUSE CLICK NAVIGATION ---
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Handle Home button click (data-target)
            if (button.classList.contains('home')) {
                showPage(button.getAttribute('data-target'));
            }
            // Handle Next/Arrow button click (data-next-page)
            else if (button.classList.contains('nav-arrow')) {
                showPage(button.getAttribute('data-next-page'));
            }
        });
    });

    // --- 3. TOUCH/SWIPE NAVIGATION ---

    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50; // Minimum distance for a swipe

    container.addEventListener('touchstart', e => {
        // Record the starting X position of the first touch point
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true }); // Use passive true for better scroll performance

    container.addEventListener('touchend', e => {
        // Record the ending X position
        touchendX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const deltaX = touchendX - touchstartX;
        const currentPageId = getCurrentPageId();

        if (Math.abs(deltaX) < swipeThreshold) {
            // Not a large enough swipe, do nothing
            return;
        }

        // Swipe Right (touchendX > touchstartX) -> Previous Page
        if (deltaX > 0) {
            const prevId = getPrevPageId(currentPageId);
            if (prevId) showPage(prevId);
        }
        
        // Swipe Left (touchendX < touchstartX) -> Next Page
        if (deltaX < 0) {
            const nextId = getNextPageId(currentPageId);
            if (nextId) showPage(nextId);
        }
    }

    // --- 4. COMMENT FUNCTIONALITY ---

    // Format timestamp for display
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        // For older comments, show date
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
        });
    }

    // Function to create a new comment element
    function createCommentElement(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        
        const authorDiv = document.createElement('div');
        authorDiv.className = 'comment-author';
        authorDiv.textContent = comment.username;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'comment-text';
        textDiv.textContent = comment.comment_text;
        
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'comment-timestamp';
        timestampDiv.textContent = formatTimestamp(comment.created_at);
        
        commentDiv.appendChild(authorDiv);
        commentDiv.appendChild(textDiv);
        commentDiv.appendChild(timestampDiv);
        
        // Add animation
        commentDiv.style.opacity = '0';
        commentDiv.style.transform = 'translateY(10px)';
        
        return commentDiv;
    }

    // Function to render comments in a list
    function renderComments(commentsList, comments) {
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'comment-empty';
            emptyMsg.textContent = 'No comments yet. Be the first to comment!';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.color = '#999';
            emptyMsg.style.padding = '20px';
            emptyMsg.style.fontStyle = 'italic';
            commentsList.appendChild(emptyMsg);
            return;
        }

        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
            
            // Animate in
            setTimeout(() => {
                commentElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                commentElement.style.opacity = '1';
                commentElement.style.transform = 'translateY(0)';
            }, 10);
        });
    }

    // Load comments for a specific character page
    async function loadCommentsForPage(characterPage) {
        if (characterPage === 'griffin-family') return; // No comments on home page
        
        const page = document.getElementById(characterPage);
        if (!page) return;
        
        const commentsList = page.querySelector('.comments-list');
        if (!commentsList) return;

        try {
            const response = await fetch(`${API_BASE}/comments/${characterPage}`);
            const data = await response.json();

            if (response.ok) {
                renderComments(commentsList, data.comments);
            } else {
                console.error('Failed to load comments:', data.error);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }

    // Load comments for all character pages
    function loadAllComments() {
        pageFlow.forEach(pageId => {
            if (pageId !== 'griffin-family') {
                loadCommentsForPage(pageId);
            }
        });
    }

    // Handle comment form submissions
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('comment-submit')) {
            const user = getUser();
            if (!user) {
                alert('Please login to post comments');
                checkLogin();
                return;
            }

            const form = e.target.closest('.comment-form');
            const input = form.querySelector('.comment-input');
            const commentText = input.value.trim();
            
            if (!commentText) {
                return;
            }

            // Find the character page ID
            const page = form.closest('.page');
            const characterPage = page ? page.id : null;
            
            if (!characterPage || characterPage === 'griffin-family') {
                return;
            }

            const submitBtn = e.target;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Posting...';

            try {
                const response = await fetch(`${API_BASE}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        characterPage,
                        username: user.username,
                        email: user.email,
                        commentText
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    input.value = '';
                    // Reload comments for this page
                    loadCommentsForPage(characterPage);
                } else {
                    alert(data.error || 'Failed to post comment');
                    if (data.error && data.error.includes('login')) {
                        localStorage.removeItem('griffinpedia_user');
                        checkLogin();
                    }
                }
            } catch (error) {
                alert('Connection error. Make sure the server is running.');
                console.error('Post comment error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Post';
                input.focus();
            }
        }
    });

    // Allow Enter key to submit comments
    document.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('comment-input') && e.key === 'Enter') {
            e.preventDefault();
            const form = e.target.closest('.comment-form');
            const submitButton = form.querySelector('.comment-submit');
            submitButton.click();
        }
    });

    // --- INITIALIZATION ---
    
    // Check login status on page load
    checkLogin();
    
    // Set the initial active page (Griffin Family)
    showPage('griffin-family');
});
