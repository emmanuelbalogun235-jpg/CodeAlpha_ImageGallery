const gallery = document.querySelector('.gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back-btn');
const toolbar = document.querySelector('.toolbar');
const counter = document.getElementById('counter');

const images = Array.from(gallery.querySelectorAll('img')).map(img => img.src);
let currentIndex = 0;
let toolbarTimeout;

// Open modal
gallery.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
        currentIndex = images.indexOf(e.target.src);
        openModal();
    }
});

function openModal() {
    modal.style.display = 'flex';
    modalImg.src = images[currentIndex];
    updateButtons();
    updateCounter();
    showToolbar();
}

function closeModal() {
    modal.style.display = 'none';
    hideToolbar();
}

// Back button
backBtn.addEventListener('click', closeModal);

// Navigation
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex--;
    updateModal();
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < images.length - 1) currentIndex++;
    updateModal();
});

function updateModal() {
    modalImg.src = images[currentIndex];
    updateButtons();
    updateCounter();
}

function updateButtons() {
    prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
    nextBtn.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
}

function updateCounter() {
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

// Toolbar functions
function showToolbar() {
    toolbar.classList.add('show');
    clearTimeout(toolbarTimeout);
    toolbarTimeout = setTimeout(() => toolbar.classList.remove('show'), 5000);
}

function hideToolbar() {
    toolbar.classList.remove('show');
}

// Show toolbar when image is clicked
modalImg.addEventListener('click', showToolbar);

// Close modal if tapped outside the image
modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
});

// Swipe support
let startX = 0, startY = 0, endX = 0, endY = 0;

modalImg.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

modalImg.addEventListener('touchmove', e => {
    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;
});

modalImg.addEventListener('touchend', () => {
    const diffX = endX - startX;
    const diffY = endY - startY;

    // Horizontal swipe
    if (diffX > 50 && currentIndex > 0) currentIndex--;
    else if (diffX < -50 && currentIndex < images.length - 1) currentIndex++;

    // Vertical swipe down to close
    if (diffY > 100) closeModal();

    updateModal();
});
function showToolbar() {
    toolbar.classList.add('show');
    clearTimeout(toolbarTimeout);
    toolbarTimeout = setTimeout(() => toolbar.classList.remove('show'), 5000);
}

// Pause hide on hover
toolbar.addEventListener('mouseenter', () => clearTimeout(toolbarTimeout));
toolbar.addEventListener('mouseleave', () => {
    toolbarTimeout = setTimeout(() => toolbar.classList.remove('show'), 5000);
});
const galleryImages = document.querySelectorAll('.gallery img');
let imagesLoaded = 0;

galleryImages.forEach(img => {
    if (img.complete) { // already cached
        incrementLoader();
    } else {
        img.addEventListener('load', incrementLoader);
        img.addEventListener('error', incrementLoader); // skip broken images
    }
});

function incrementLoader() {
    imagesLoaded++;
    if (imagesLoaded === galleryImages.length) {
        document.getElementById('loader').classList.add('hidden');
    }
}
