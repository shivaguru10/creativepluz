/* Modal Functionality - Image, Share, Enquiry */

// Image Modal
window.openImageModal = function (imgElement) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = imgElement.src;
    captionText.innerHTML = imgElement.alt || "";
};

// Share Modal
window.openShareModal = function () {
    const shareUrl = "https://creativepluz-gamma.vercel.app/";
    const shareText = "Check out my Link ";

    if (navigator.share) {
        navigator.share({
            title: 'Virtual Business Card',
            text: shareText,
            url: shareUrl
        }).catch(console.error);
    } else {
        const modal = document.getElementById("shareModal");
        const shareList = document.querySelector('#shareModal .share-btn');

        if (shareList && !shareList.dataset.initialized) {
            shareList.innerHTML = `
                <li><a href="https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}" target="_blank"><i class="share-btn-whatsapp fa fa-whatsapp"></i></a></li>
                <li><a href="sms:?body=${encodeURIComponent(shareText + shareUrl)}"><i class="share-btn-sms fa fa-comments"></i></a></li>
                <li><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank"><i class="share-btn-facebook fa fa-facebook-f"></i></a></li>
                <li><a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out my card')}" target="_blank"><i class="share-btn-twitter fa fa-twitter"></i></a></li>
                <li><a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}" target="_blank"><i class="share-btn-linkedin fa fa-linkedin"></i></a></li>
                <li><a href="mailto:?subject=Virtual%20Business%20Card&body=${encodeURIComponent(shareText + shareUrl)}"><i class="share-btn-mail fa fa-envelope"></i></a></li>
            `;
            shareList.dataset.initialized = 'true';
        }
        modal.style.display = "block";
    }
};

// Enquiry Modal
window.openEnquiryModal = function (productName, imgSrc, description, origPrice, discPrice) {
    const modal = document.getElementById("enquiryModal");
    const msgField = document.getElementById("enquiryProductMessage");
    const displaySection = document.getElementById("enqServiceDisplay");
    const titleEl = document.getElementById("enqServiceTitle");
    const imgEl = document.getElementById("enqServiceImage");
    const descEl = document.getElementById("enqServiceDetails");
    const pricingEl = document.getElementById("enqPricingSection");

    modal.style.display = "flex";

    if (productName && imgSrc && description) {
        displaySection.style.display = "block";
        titleEl.innerText = productName;
        imgEl.src = imgSrc;
        descEl.innerText = description;
    } else {
        displaySection.style.display = "none";
    }

    // Render pricing dynamically
    if (pricingEl) {
        if (origPrice && discPrice && typeof origPrice === 'number') {
            const discount = Math.round(((origPrice - discPrice) / origPrice) * 100);
            pricingEl.style.display = "flex";
            pricingEl.innerHTML = `
                <span style="font-size:14px;color:#999;text-decoration:line-through;">&#8377;${origPrice}</span>
                <span style="font-size:18px;font-weight:700;color:#388e3c;">&#8377;${discPrice}<span style="font-size:12px;font-weight:600;">/month</span></span>
                <span style="font-size:11px;font-weight:700;color:#388e3c;background:#e8f5e9;padding:2px 7px;border-radius:4px;letter-spacing:0.3px;">${discount}% OFF</span>
            `;
        } else if (typeof origPrice === 'string' && origPrice.trim() !== '') {
            pricingEl.style.display = "flex";
            pricingEl.innerHTML = `
                <span style="font-size:13px;font-weight:600;color:#777;font-style:italic;">&#128178; ${origPrice}</span>
            `;
        } else if (discPrice && typeof discPrice === 'number') {
            pricingEl.style.display = "flex";
            pricingEl.innerHTML = `
                <span style="font-size:18px;font-weight:700;color:#388e3c;">&#8377;${discPrice}<span style="font-size:12px;font-weight:600;">/month</span></span>
            `;
        } else {
            pricingEl.style.display = "none";
            pricingEl.innerHTML = "";
        }
    }

    if (productName) {
        msgField.value = "Hi, I am interested in your service: " + productName + ". Please provide more details.";
    } else {
        msgField.value = "";
    }
};

// Send WhatsApp Enquiry
window.sendWhatsAppEnquiry = function (button) {
    const form = button.form;
    const name = form.querySelector('[name="enquiryName"]').value;
    const phone = form.querySelector('[name="phoneNumber"]').value;
    const email = form.querySelector('[name="email"]').value;
    const city = form.querySelector('[name="city"]').value;
    const quantity = form.querySelector('[name="quantity"]').value;
    const message = form.querySelector('[name="message"]').value;

    const waNumber = "918667573511";
    const text = `Hello *Creativepluz*,\n\nI am reaching out via your *Creativepluz Business Card* website with a new enquiry.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*City:* ${city}\n*Quantity:* ${quantity}\n*Message:* ${message}`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');

    const modal = document.getElementById("enquiryModal");
    if (modal) modal.style.display = "none";
    form.reset();
};

// Global click listener for images and star ratings
document.addEventListener('click', function (e) {
    // Image click handler
    if (e.target.tagName === 'IMG' &&
        !e.target.closest('#imageModal') &&
        !e.target.hasAttribute('onclick')) {
        openImageModal(e.target);
    }

    // Star Rating click handler
    if (e.target.tagName === 'SPAN' && e.target.hasAttribute('data-value')) {
        const starRatingSpan = e.target.parentElement;
        if (starRatingSpan && starRatingSpan.className.includes('gl-star-rating-stars')) {
            const value = e.target.getAttribute('data-value');
            starRatingSpan.className = 'gl-star-rating-stars s' + (value * 10);

            const selectEl = starRatingSpan.previousElementSibling;
            if (selectEl && selectEl.tagName === 'SELECT') {
                selectEl.value = value;
            }

            const textEl = starRatingSpan.nextElementSibling;
            if (textEl && textEl.className.includes('gl-star-rating-text')) {
                textEl.innerText = e.target.getAttribute('data-text');
            }
        }
    }
});

// Initialize modal close handlers on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Image Modal close
    const imageModal = document.getElementById("imageModal");
    const imageModalClose = document.getElementById("imageModalClose");

    if (imageModalClose) {
        imageModalClose.onclick = () => imageModal.style.display = "none";
    }

    imageModal.onclick = function (e) {
        if (e.target !== document.getElementById("img01")) {
            imageModal.style.display = "none";
        }
    };

    // Share Modal close
    const shareModal = document.getElementById("shareModal");
    const shareModalClose = document.getElementById("shareModalClose");

    if (shareModalClose) {
        shareModalClose.onclick = () => shareModal.style.display = "none";
    }

    // Enquiry Modal close
    const enquiryModal = document.getElementById("enquiryModal");
    const enquiryModalClose = document.getElementById("enquiryModalClose");

    if (enquiryModalClose) {
        enquiryModalClose.onclick = () => enquiryModal.style.display = "none";
    }

    enquiryModal.onclick = function (e) {
        if (e.target === enquiryModal) {
            enquiryModal.style.display = "none";
        }
    };
});
