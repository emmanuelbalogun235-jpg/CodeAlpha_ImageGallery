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

// ----------------------
// CATEGORY PALETTE
// ----------------------
const categoryPalette = document.createElement('div');
categoryPalette.id = 'category-palette';
categoryPalette.style.position = 'fixed';
categoryPalette.style.bottom = '10px';
categoryPalette.style.left = '50%';
categoryPalette.style.transform = 'translateX(-50%)';
categoryPalette.style.background = 'rgba(20,20,20,0.85)';
categoryPalette.style.padding = '0.5rem 1rem';
categoryPalette.style.display = 'flex';
categoryPalette.style.gap = '0.5rem';
categoryPalette.style.borderRadius = '6px';
categoryPalette.style.zIndex = '1002';
document.body.appendChild(categoryPalette);

const categories = ['ALL', 'NATURE', 'URBAN', 'PEOPLE', 'ABSTRACT'];
let activeCategory = 'ALL';

function renderCategoryButtons() {
    categoryPalette.innerHTML = '';

    // Back button for category
    if (activeCategory !== 'ALL') {
        const backCat = document.createElement('button');
        backCat.textContent = 'BACK';
        backCat.style.background = 'rgba(255,255,255,0.2)';
        backCat.style.color = 'aliceblue';
        backCat.style.border = 'none';
        backCat.style.padding = '0.3rem 0.5rem';
        backCat.style.borderRadius = '4px';
        backCat.style.cursor = 'pointer';
        backCat.addEventListener('click', () => {
            activeCategory = 'ALL';
            renderCategoryButtons();
            renderGallery();
        });
        categoryPalette.appendChild(backCat);
    }

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.dataset.category = cat;
        btn.style.padding = '0.3rem 0.5rem';
        btn.style.borderRadius = '4px';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.background = (cat === activeCategory) ? 'aliceblue' : 'rgba(255,255,255,0.1)';
        btn.style.color = (cat === activeCategory) ? '#111' : 'aliceblue';
        btn.addEventListener('click', () => {
            activeCategory = cat;
            renderCategoryButtons();
            renderGallery();
        });
        categoryPalette.appendChild(btn);
    });
}

// ----------------------
// IMAGES DATA
// ----------------------
images = [
    // 🌿 NATURE
    { src: 'https://picsum.photos/id/1015/800/600', category: 'NATURE', date: new Date(2025, 0, 5) },
    { src: 'https://picsum.photos/id/1025/800/600', category: 'NATURE', date: new Date(2025, 0, 5) },
    { src: 'https://picsum.photos/id/1035/800/600', category: 'NATURE', date: new Date(2025, 0, 4) },
    { src: 'https://picsum.photos/id/1045/800/600', category: 'NATURE', date: new Date(2025, 0, 4) },
    { src: 'https://picsum.photos/id/1055/800/600', category: 'NATURE', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1065/800/600', category: 'NATURE', date: new Date(2025, 0, 3) },

    // 🏙️ URBAN
    { src: 'https://picsum.photos/id/1011/800/600', category: 'URBAN', date: new Date(2025, 0, 4) },
    { src: 'https://picsum.photos/id/1012/800/600', category: 'URBAN', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1013/800/600', category: 'URBAN', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1014/800/600', category: 'URBAN', date: new Date(2025, 0, 2) },
    { src: 'https://picsum.photos/id/1027/800/600', category: 'URBAN', date: new Date(2025, 0, 2) },
    { src: 'https://picsum.photos/id/1031/800/600', category: 'URBAN', date: new Date(2025, 0, 1) },

    // 🧑 PEOPLE
    { src: 'https://picsum.photos/id/1005/800/600', category: 'PEOPLE', date: new Date(2025, 0, 4) },
    { src: 'https://picsum.photos/id/1028/800/600', category: 'PEOPLE', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1029/800/600', category: 'PEOPLE', date: new Date(2025, 0, 2) },
    { src: 'https://picsum.photos/id/1032/800/600', category: 'PEOPLE', date: new Date(2025, 0, 1) },
    { src: 'https://picsum.photos/id/1042/800/600', category: 'PEOPLE', date: new Date(2025, 0, 1) },

    // 🎨 ABSTRACT
    { src: 'https://picsum.photos/id/1037/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1040/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 3) },
    { src: 'https://picsum.photos/id/1050/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 2) },
    { src: 'https://picsum.photos/id/1060/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 1) },
    { src: 'https://picsum.photos/id/1070/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 1) },
    { src: 'https://picsum.photos/id/1075/800/600', category: 'ABSTRACT', date: new Date(2025, 0, 2) }
];


let currentIndex = 0;
let toolbarTimer;
let savedFilters = {};
let previewFilter = 'normal';

// ----------------------
// UTILS
// ----------------------
function formatDate(date) {
    const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function getFilterCSS(f) {
    return { grayscale: 'grayscale(100%)', sunny: 'brightness(1.1) saturate(1.3)', cool: 'hue-rotate(190deg)', vintage: 'sepia(60%)' }[f] || 'none';
}

// ----------------------
// RENDER GALLERY
// ----------------------
function renderGallery() {
    gallery.innerHTML = '';
    const filtered = (activeCategory === 'ALL') ? images : images.filter(img => img.category === activeCategory);

    // Group by date
    const groups = {};
    filtered.forEach((imgObj, i) => {
        const label = formatDate(imgObj.date);
        if (!groups[label]) groups[label] = [];
        groups[label].push({ ...imgObj, index: i });
    });

    Object.keys(groups).sort((a, b) => new Date(groups[b][0].date) - new Date(groups[a][0].date))
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
                row.appendChild(img);
            });

            gallery.appendChild(row);
        });
}

// ----------------------
// SCROLL CATEGORY PALETTE
// ----------------------
window.addEventListener('scroll', () => {
    if (modal.style.display === 'flex') { categoryPalette.style.display = 'none'; return; }
    if (window.scrollY > 150) categoryPalette.style.display = 'flex';
    else categoryPalette.style.display = 'flex'; // always visible since little images
});

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
}

function closeModal() {
    modal.style.display = 'none';
    filterPalette.style.display = 'none';
    toolbar.classList.remove('show');
    categoryPalette.style.display = 'flex';
}

backBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// ----------------------
// NAVIGATION
// ----------------------
nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].src;
    modalImg.style.filter = getFilterCSS(savedFilters[currentIndex]);
    showToolbar();
});

prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
    modalImg.style.filter = getFilterCSS(savedFilters[currentIndex]);
    showToolbar();
});

// ----------------------
// TOOLBAR
// ----------------------
function showToolbar() {
    toolbar.classList.add('show');
    clearTimeout(toolbarTimer);
    toolbarTimer = setTimeout(() => toolbar.classList.remove('show'), 3000);
}

toolbar.addEventListener('mouseenter', () => clearTimeout(toolbarTimer));
toolbar.addEventListener('mouseleave', () => toolbarTimer = setTimeout(() => toolbar.classList.remove('show'), 3000));

modalImg.addEventListener('click', e => { e.stopPropagation(); showToolbar(); });

// ----------------------
// FILTERS
// ----------------------
filterBtn.addEventListener('click', e => {
    e.stopPropagation();
    filterPalette.style.display = 'flex';
    previewFilter = savedFilters[currentIndex] || 'normal';
    showToolbar();
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
    showToolbar();
});

// ----------------------
// DELETE IMAGE
// ----------------------
deleteBtn.addEventListener('click', () => {
    images.splice(currentIndex, 1);
    if (images.length === 0) { closeModal(); renderGallery(); return; }
    currentIndex = currentIndex % images.length;
    modalImg.src = images[currentIndex].src;
    modalImg.style.filter = getFilterCSS(savedFilters[currentIndex]);
    renderGallery();
    showToolbar();
});

// ----------------------
// INIT
// ----------------------
renderCategoryButtons();
renderGallery();
