
// Set theme colors
document.documentElement.style.setProperty('--theme-color', '#e3010f');
document.documentElement.style.setProperty('--theme-color-light', '#e3010f70');

// Initialize view counter
function initViewCounter() {
    const baseViews = 100;
    let viewCount = localStorage.getItem('creativepluz_vbc_views');

    if (!viewCount) {
        viewCount = baseViews + 1;
        localStorage.setItem('creativepluz_vbc_views', viewCount);
    } else {
        viewCount = parseInt(viewCount);
        if (!sessionStorage.getItem('creativepluz_vbc_session')) {
            viewCount += 1;
            localStorage.setItem('creativepluz_vbc_views', viewCount);
        }
    }

    sessionStorage.setItem('creativepluz_vbc_session', 'active');

    const displayEl = document.getElementById('viewCountDisplay');
    if (displayEl) displayEl.innerText = viewCount;
}

// Load all sections dynamically
async function loadSections() {
    const sections = [
        'home',
        'aboutus',
        'products-services',
        'payment',
        'photogallery',
        'videogallery',
        'feedback',
        'location',
        'enquiry'
    ];

    for (let sec of sections) {
        try {
            const res = await fetch(`sections/${sec}.html?v=` + new Date().getTime());
            if (res.ok) {
                const text = await res.text();
                document.getElementById('section-' + sec).innerHTML = text;
            } else {
                console.error('Failed to load', sec);
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Initialize view counter after sections load
    initViewCounter();

    // Load saved feedbacks from localStorage
    const savedFb = JSON.parse(localStorage.getItem("creativepluz_vbc_feedbacks") || "[]");
    const fbList = document.querySelector('.feedback-list');
    if (fbList && savedFb.length > 0) {
        savedFb.forEach(fb => fbList.insertAdjacentHTML('afterbegin', fb));
    }

    // Update feedback visibility
    if (typeof updateFeedbackVisibility === 'function') {
        updateFeedbackVisibility();
    }
}

// Start loading sections
loadSections();
