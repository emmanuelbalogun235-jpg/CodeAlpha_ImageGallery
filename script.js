const gallery = document.querySelector('.gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back-btn');

let currentIndex = 0;

// Generate 100 images dynamically
const images = [];
for (let i = 1010; i <= 1109; i++) {
    const img = document.createElement('img');
    img.src = `https://picsum.photos/id/${i}/400/300`;
    img.alt = `Image ${i}`;
    gallery.appendChild(img);
    images.push(img.src);
}

// Open modal on image click
gallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        currentIndex = images.indexOf(e.target.src);
        openModal();
    }
});

function openModal() {
    modal.style.display = 'flex';
    modalImg.style.opacity = 0;
    setTimeout(() => {
        modalImg.src = images[currentIndex];
        modalImg.style.opacity = 1;
    }, 50);
    updateButtons();
}

// Close modal
backBtn.addEventListener('click', () => modal.style.display = 'none');

// Navigation buttons
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex--;
    updateModalImg();
    updateButtons();
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < images.length - 1) currentIndex++;
    updateModalImg();
    updateButtons();
});

function updateButtons() {
    prevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
    nextBtn.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
}

function updateModalImg() {
    modalImg.style.opacity = 0;
    setTimeout(() => {
        modalImg.src = images[currentIndex];
        modalImg.style.opacity = 1;
    }, 50);
}

// Touch / swipe
let startX = 0, startY = 0, endX = 0, endY = 0;

modal.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

modal.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;
});

modal.addEventListener('touchend', () => {
    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0 && currentIndex > 0) currentIndex--;
        else if (diffX < 0 && currentIndex < images.length - 1) currentIndex++;
        updateModalImg();
        updateButtons();
    } else if (diffY > 100) {
        modal.style.display = 'none';
    }
});

// Close modal if tapping outside image
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});
