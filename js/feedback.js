/* Feedback Functionality */

// Toggle feedback visibility (show more/less)
window.updateFeedbackVisibility = function (showAll = false) {
    const list = document.querySelector('.feedback-list');
    if (!list) return;

    const feedbacks = list.querySelectorAll('.feedback-wrapper');
    let btn = document.getElementById('feedbackToggleBtn');

    if (feedbacks.length <= 3) {
        if (btn) btn.style.display = 'none';
        feedbacks.forEach(f => f.style.display = 'block');
        return;
    }

    feedbacks.forEach((f, idx) => {
        f.style.display = (idx < 3 || showAll) ? 'block' : 'none';
    });

    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'feedbackToggleBtn';
        btn.style.cssText = "background: white; color: #e91e63; padding: 10px; border: 2px solid #e91e63; font-weight: bold; cursor: pointer; display: block; width: 100%; text-align: center; margin-bottom: 20px; border-radius: 4px; font-size: 15px;";
        list.parentNode.insertBefore(btn, list.nextSibling);

        btn.onmouseover = function () {
            this.style.background = '#e91e63';
            this.style.color = 'white';
        };
        btn.onmouseout = function () {
            this.style.background = 'white';
            this.style.color = '#e91e63';
        };
    }

    btn.style.display = 'block';
    btn.innerText = showAll ? "Show Less" : `Show More (${feedbacks.length - 3})`;
    btn.onclick = function () {
        updateFeedbackVisibility(!showAll);
    };
};

// Submit feedback
window.sendFeedback = function (btn, user) {
    if (window.event) window.event.preventDefault();

    const form = btn.form;
    const name = form.querySelector('[name="feedbackName"]').value.trim();
    const feedbackText = form.querySelector('[name="feedback"]').value.trim();
    const ratingSelect = form.querySelector('[name="rating"]');

    if (!name || !feedbackText || ratingSelect.value === "") {
        alert("Please provide your Name, a Rating, and your Feedback before submitting!");
        return false;
    }

    const rating = parseInt(ratingSelect.value);
    const ratingClass = "s" + (rating * 10);
    const dateStr = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const newFeedbackHtml = `
        <div class="feedback-wrapper" style="animation: fadeIn 0.4s ease-out;">
            <span class="feedback-name-wrapper"><span class="feedback-name">${name}</span> on ${dateStr} </span>
            <div>
               <span class="gl-star-rating-stars ${ratingClass}">
                   <span data-value="1" data-text="Terrible"></span>
                   <span data-value="2" data-text="Poor"></span>
                   <span data-value="3" data-text="Average"></span>
                   <span data-value="4" data-text="Very Good"></span>
                   <span data-value="5" data-text="Excellent"></span>
               </span>
            </div>
            <div>${feedbackText}</div>
            <hr>
        </div>`;

    const list = document.querySelector('.feedback-list');
    if (list) list.insertAdjacentHTML('afterbegin', newFeedbackHtml);

    if (typeof updateFeedbackVisibility === 'function') {
        updateFeedbackVisibility(false);
    }

    // Save to localStorage
    const savedFb = JSON.parse(localStorage.getItem("creativepluz_vbc_feedbacks") || "[]");
    savedFb.push(newFeedbackHtml);
    localStorage.setItem("creativepluz_vbc_feedbacks", JSON.stringify(savedFb));

    // Reset form
    form.reset();
    const starsSpan = form.querySelector('.gl-star-rating-stars');
    if (starsSpan) starsSpan.className = "gl-star-rating-stars s0";

    return false;
};
