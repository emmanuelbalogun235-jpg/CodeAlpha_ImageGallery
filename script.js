const gallery = document.querySelector('.gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back-btn');
const toolbar = document.querySelector('.toolbar');
const counter = document.querySelector('.counter') || document.createElement('div');
counter.classList.add('counter');
modal.appendChild(counter);
const filterBtn = document.getElementById('filter');
const infoBtn = document.getElementById('info');
const deleteBtn = document.getElementById('delete');

let images = [];
let imageDates = []; // store a date for each image

// generate 25 random images and assign random dates within last 15 days
for (let i = 0; i < 25; i++) {
    let id = Math.floor(Math.random() * 1000);
    images.push(`https://picsum.photos/id/${id}/400/300`);

    // random date in last 15 days
    let daysAgo = Math.floor(Math.random() * 15);
    let d = new Date();
    d.setDate(d.getDate() - daysAgo);
    imageDates.push(d);
}

// helper: format date
function formatDate(date) {
    const today = new Date();
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    const options = { month: 'long', day: 'numeric' };

    if (diffDays < 6) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return weekdays[date.getDay()];
    } else {
        // Add ordinal (st, nd, rd, th)
        const day = date.getDate();
        let ordinal = 'th';
        if (day === 1 || day === 21 || day === 31) ordinal = 'st';
        else if (day === 2 || day === 22) ordinal = 'nd';
        else if (day === 3 || day === 23) ordinal = 'rd';
        return `${date.toLocaleString('default', { month: 'long' })} ${day}${ordinal}`;
    }
}

// Render gallery grouped by date
function renderGallery() {
    gallery.innerHTML = "";

    // group images by formatted date
    const groups = {};
    images.forEach((src, i) => {
        const dateStr = formatDate(imageDates[i]);
        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push({ src, index: i });
    });

    for (let date in groups) {
        // Date header
        const header = document.createElement('h2');
        header.textContent = date;
        header.style.color = 'aliceblue';
        header.style.margin = '1rem 0 0.5rem';
        gallery.appendChild(header);

        // Image group container
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('date-group');

        groups[date].forEach(item => {
            const img = document.createElement('img');
            img.src = item.src;
            img.dataset.index = item.index;
            groupDiv.appendChild(img);
        });

        gallery.appendChild(groupDiv);
    }
}

renderGallery();

// ---------- Modal Logic ----------
let currentIndex = 0;
let toolbarTimer;

gallery.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
        currentIndex = parseInt(e.target.dataset.index);
        openModal();
    }
});

function openModal() {
    modal.style.display = 'flex';
    modalImg.src = images[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
    showToolbar();
}

function updateModal() {
    modalImg.src = images[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
    showToolbar();
}

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateModal();
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateModal();
});

backBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
});

// Toolbar
function showToolbar() {
    toolbar.classList.add('show');
    clearTimeout(toolbarTimer);
    toolbarTimer = setTimeout(() => {
        toolbar.classList.remove('show');
    }, 3000);
}

toolbar.addEventListener('mouseenter', () => clearTimeout(toolbarTimer));
toolbar.addEventListener('mouseleave', () => toolbarTimer = setTimeout(() => toolbar.classList.remove('show'), 3000));
modalImg.addEventListener('click', showToolbar);

// Delete
deleteBtn.addEventListener('click', () => {
    images.splice(currentIndex, 1);
    imageDates.splice(currentIndex, 1);
    if (images.length === 0) {
        modal.style.display = 'none';
        renderGallery();
        return;
    }
    currentIndex = currentIndex % images.length;
    updateModal();
    renderGallery();
});

// Info
infoBtn.addEventListener('click', () => {
    alert(`Image Info:\nIndex: ${currentIndex + 1}\nSrc: ${images[currentIndex]}`);
});

// Filter placeholder
filterBtn.addEventListener('click', () => {
    alert('Filter options coming soon!');
});
