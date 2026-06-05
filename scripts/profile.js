function initializeProfileLightbox() {
    const lightbox = document.querySelector('[data-profile-lightbox]');
    const image = lightbox?.querySelector('[data-lightbox-image]');
    const title = lightbox?.querySelector('[data-lightbox-title]');
    const description = lightbox?.querySelector('[data-lightbox-description]');
    const closeButton = lightbox?.querySelector('.profile-lightbox-close');
    let previouslyFocusedCard = null;

    if (!lightbox || !image || !title || !description || !closeButton) {
        return;
    }

    function openLightbox(card) {
        const cardImage = card.querySelector('img');
        const cardTitle = card.querySelector('strong');
        const cardDescription = card.querySelector('figcaption span');

        if (!cardImage || !cardTitle || !cardDescription) {
            return;
        }

        previouslyFocusedCard = card;
        image.src = cardImage.src;
        image.alt = cardImage.alt;
        title.textContent = cardTitle.textContent;
        description.textContent = cardDescription.textContent;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        closeButton.focus();
    }

    function closeLightbox() {
        if (!lightbox.classList.contains('is-open')) {
            return;
        }

        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        previouslyFocusedCard?.focus();
    }

    document.querySelectorAll('.profile-photo-card').forEach((card) => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        card.addEventListener('click', () => openLightbox(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(card);
            }
        });
    });

    lightbox.querySelectorAll('[data-lightbox-close]').forEach((element) => {
        element.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeProfileLightbox);
