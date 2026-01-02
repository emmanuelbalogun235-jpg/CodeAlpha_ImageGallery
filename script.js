const gallery = document.querySelector('.gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back-btn');

const images = Array.from(gallery.querySelectorAll('img')).map(img => img.src);
let currentIndex = 0;

// Open modal on image click
gallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        currentIndex = images.indexOf(e.target.src);
        openModal();
    }
});

function openModal() {
    modal.style.display = 'flex';
    modalImg.src = images[currentIndex];
    updateButtons();
    document.body.style.overflow = 'hidden'; // prevent background scroll
}

// Close modal
backBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // restore scroll
});

// Navigation
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex--;
    modalImg.src = images[currentIndex];
    updateButtons();
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < images.length - 1) currentIndex++;
    modalImg.src = images[currentIndex];
    updateButtons();
});

function updateButtons() {
    prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
    nextBtn.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
}

// Swipe support
let startX = 0, startY = 0, endX = 0, endY = 0;

modalImg.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

modalImg.addEventListener('touchmove', (e) => {
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
    if (diffY > 100) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    modalImg.src = images[currentIndex];
    updateButtons();
});
