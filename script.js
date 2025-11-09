document.addEventListener('DOMContentLoaded', () => {
    // Select all pages and navigation elements
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-arrow, .nav-button.home');
    const container = document.getElementById('pages-container');

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

    // --- Core Navigation Functions ---

    // Function to show a specific page by ID
    function showPage(targetId) {
        let found = false;
        pages.forEach(page => {
            if (page.id === targetId) {
                // Show the target page
                page.classList.add('active');
                found = true;
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

    // Function to create a new comment element
    function createCommentElement(author, text, isBot = false) {
        const commentDiv = document.createElement('div');
        commentDiv.className = `comment ${isBot ? 'bot-comment' : ''}`;
        
        const authorDiv = document.createElement('div');
        authorDiv.className = 'comment-author';
        authorDiv.textContent = author;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'comment-text';
        textDiv.textContent = text;
        
        commentDiv.appendChild(authorDiv);
        commentDiv.appendChild(textDiv);
        
        // Add animation
        commentDiv.style.opacity = '0';
        commentDiv.style.transform = 'translateY(10px)';
        
        return commentDiv;
    }

    // Function to add a comment to a comments list
    function addComment(commentsList, author, text, isBot = false) {
        const commentElement = createCommentElement(author, text, isBot);
        commentsList.appendChild(commentElement);
        
        // Animate in
        setTimeout(() => {
            commentElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            commentElement.style.opacity = '1';
            commentElement.style.transform = 'translateY(0)';
        }, 10);
        
        // Scroll to bottom of comments list
        setTimeout(() => {
            commentsList.scrollTop = commentsList.scrollHeight;
        }, 50);
    }

    // Handle comment form submissions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('comment-submit')) {
            const form = e.target.closest('.comment-form');
            const input = form.querySelector('.comment-input');
            const commentsList = form.previousElementSibling;
            const commentText = input.value.trim();
            
            if (commentText) {
                // Generate a random username for user comments
                const usernames = ['GriffinFan', 'QuahogResident', 'FamilyGuyWatcher', 'CharacterLover', 'ShowFan', 'GriffinEnthusiast'];
                const randomUsername = usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 1000);
                
                addComment(commentsList, randomUsername, commentText, false);
                input.value = '';
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
    
    // Set the initial active page (Griffin Family)
    showPage('griffin-family');
});