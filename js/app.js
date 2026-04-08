
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

// Initialize Scroll Spy for footer menu
function initScrollSpy() {
    const navLinks = document.querySelectorAll('.footer-menu-link');
    const sections = Array.from(document.querySelectorAll('div[id^="section-"]'));

    function onScroll() {
        let currentSectionId = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Check if the middle of the screen is within this section
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSectionId = section.id;
            }
        });

        // Fallback or bottom page detect (optional, but good for short sections at the end)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            if (sections.length > 0) {
                currentSectionId = sections[sections.length - 1].id;
            }
        }

        if (currentSectionId) {
            navLinks.forEach(link => link.classList.remove('active'));
            const targetId = currentSectionId.replace('section-', '');
            const activeLink = document.querySelector(`.footer-menu-link[href="#${targetId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Call once to set initial state
    setTimeout(onScroll, 100);
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

    // Initialize Scroll Spy
    initScrollSpy();
}

// Start loading sections
loadSections();
