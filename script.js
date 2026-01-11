// ----------------------
// ELEMENTS
// ----------------------
const gallery = document.querySelector('.gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const backBtn = document.getElementById('back-btn');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const toolbar = document.getElementById('toolbar');
const filterBtn = document.getElementById('filter');
const deleteBtn = document.getElementById('delete');

const filterPalette = document.getElementById('filter-palette');
const filterOptions = document.querySelectorAll('.filter-option');
const filterConfirm = document.getElementById('filter-confirm');

const categoryPalette = document.getElementById('category-palette');
const categoryButtons = categoryPalette.querySelectorAll('button');

// ----------------------
// STATE
// ----------------------
let activeCategory = 'ALL';
let currentIndex = 0;
let toolbarTimer;
let savedFilters = {};
let previewFilter = 'normal';

// ----------------------
// CATEGORY BUTTONS
// ----------------------
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category.toUpperCase();

        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderGallery();
    });
});

// ----------------------
// IMAGES DATA
// ----------------------
const images = [
    { src: 'https://picsum.photos/id/1015/800/600', category: 'NATURE', date: new Date(2025, 0, 5) },
    { src: 'https://picsum.photos/id/1025/800/600', category: 'NATURE', date: new Date(2025, 0, 5) },
    { src: 'https://picsum.photos/id/1035/800/600', category: 'NATURE', date: new Date(2025, 0, 4) },
    { src: 'https://picsum.photos/id/1045/800/600', category: 'NATURE', date: new Date(2025, 0, 4) },
    { src: 'https://picsum.photos/id/1055/800/600', category: 'NATURE', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1065/800/600', category: 'NATURE', date: new Date(2025, 0, 3) },

    { src: 'https://picsum.photos/id/1011/800/600', category: 'URBAN', date: new Date(2025, 0, 4) },
    { src: 'https://picsum.photos/id/1012/800/600', category: 'URBAN', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1013/800/600', category: 'URBAN', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1014/800/600', category: 'URBAN', date: new Date(2025, 0, 2) },
    { src: 'https://picsum.photos/id/1027/800/600', category: 'URBAN', date: new Date(2025, 0, 2) },
    { src: 'https://picsum.photos/id/1031/800/600', category: 'URBAN', date: new Date(2025, 0, 1) },

    { src: 'https://picsum.photos/id/1005/800/600', category: 'PEOPLE', date: new Date(2025, 0, 4) },
    { src: 'https://picsum.photos/id/1028/800/600', category: 'PEOPLE', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1029/800/600', category: 'PEOPLE', date: new Date(2025, 0, 2) },
    { src: 'https://picsum.photos/id/1032/800/600', category: 'PEOPLE', date: new Date(2025, 0, 1) },
    { src: 'https://picsum.photos/id/1042/800/600', category: 'PEOPLE', date: new Date(2025, 0, 1) },

    { src: 'https://picsum.photos/id/1037/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1040/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1050/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 2) },
    { src: 'https://picsum.photos/id/1060/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 1) },
    { src: 'https://picsum.photos/id/1070/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 1) },
    { src: 'https://picsum.photos/id/1075/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 2) }
];

// ----------------------
// UTILS
// ----------------------
function formatDate(date) {
    const diff = Math.floor((new Date() - date) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function getFilterCSS(f) {
    return {
        grayscale: 'grayscale(100%)',
        sunny: 'brightness(1.1) saturate(1.3)',
        cool: 'hue-rotate(190deg)',
        vintage: 'sepia(60%)'
    }[f] || 'none';
}

// ----------------------
// RENDER GALLERY (FIXED INDEXING)
// ----------------------
function renderGallery() {
    gallery.innerHTML = '';

    const filtered = images
        .map((img, index) => ({ ...img, index }))
        .filter(img => activeCategory === 'ALL' || img.category === activeCategory);

    const groups = {};

    filtered.forEach(img => {
        const label = formatDate(img.date);
        if (!groups[label]) groups[label] = [];
        groups[label].push(img);
    });

    Object.keys(groups)
        .sort((a, b) => new Date(groups[b][0].date) - new Date(groups[a][0].date))
        .forEach(label => {
            const h2 = document.createElement('h2');
            h2.textContent = label;
            gallery.appendChild(h2);

            const row = document.createElement('div');
            row.className = 'date-group';

            groups[label].forEach(item => {
                const img = document.createElement('img');
                img.src = item.src;
                img.dataset.index = item.index;

                if (savedFilters[item.index]) {
                    img.style.filter = getFilterCSS(savedFilters[item.index]);
                }

                row.appendChild(img);
            });

            gallery.appendChild(row);
        });
}

// ----------------------
// MODAL
// ----------------------
gallery.addEventListener('click', e => {
    if (e.target.tagName !== 'IMG') return;
    currentIndex = Number(e.target.dataset.index);
    openModal();
});

function openModal() {
    modal.style.display = 'flex';
    modalImg.src = images[currentIndex].src;
    modalImg.style.filter = getFilterCSS(savedFilters[currentIndex]);
    categoryPalette.style.display = 'none';
    showToolbar();
    filterPalette.style.bottom = window.innerWidth < 600 ? '0.5rem' : '1rem';
}

function closeModal() {
    modal.style.display = 'none';
    filterPalette.style.display = 'none';
    toolbar.classList.remove('show');
    categoryPalette.style.display = 'flex';
}

backBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
modalImg.addEventListener('click', e => {
    e.stopPropagation();
    toolbar.classList.add('show');
    clearTimeout(toolbarTimer);
});

// ----------------------
// NAVIGATION
// ----------------------
nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    openModal();
});

prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openModal();
});

// ----------------------
// TOOLBAR
// ----------------------
function showToolbar() {
    toolbar.classList.add('show');
    clearTimeout(toolbarTimer);
    toolbarTimer = setTimeout(() => toolbar.classList.remove('show'), 3000);
}

// ----------------------
// FILTERS
// ----------------------
filterBtn.addEventListener('click', e => {
    e.stopPropagation();
    filterPalette.style.display = 'flex';
    previewFilter = savedFilters[currentIndex] || 'normal';
});

filterOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        previewFilter = btn.dataset.filter;
        modalImg.style.filter = getFilterCSS(previewFilter);
        filterOptions.forEach(b => b.classList.toggle('active', b === btn));
    });
});

filterConfirm.addEventListener('click', () => {
    savedFilters[currentIndex] = previewFilter;
    filterPalette.style.display = 'none';
});

// ----------------------
// DELETE
// ----------------------
deleteBtn.addEventListener('click', () => {
    images.splice(currentIndex, 1);
    if (!images.length) return closeModal();
    currentIndex %= images.length;
    renderGallery();
    openModal();
});

// ----------------------
// INIT
// ----------------------
renderGallery();
