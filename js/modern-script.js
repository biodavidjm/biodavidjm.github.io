// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Toggle between grid and list view
function toggleView(view) {
    const journalsGrid = document.getElementById('journals-grid');
    const journalsList = document.getElementById('journals-list');
    const viewBtns = document.querySelectorAll('.view-btn');

    // Update active button
    viewBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Show/hide appropriate view
    if (view === 'grid') {
        journalsGrid.style.display = 'grid';
        journalsList.style.display = 'none';
    } else {
        journalsGrid.style.display = 'none';
        journalsList.style.display = 'block';
    }
}

// Publications Data Storage
let publicationsData = {
    journals: [],
    books: [],
    popularScience: [],
    abstracts: [],
    thesis: null
};

// Load publications data from JSON files
async function loadPublicationsData() {
    try {
        // Add cache-busting parameter to prevent caching issues
        const cacheBuster = new Date().getTime();
        const [journalsResponse, booksResponse, popularScienceResponse, abstractsResponse, thesisResponse] = await Promise.all([
            fetch(`data/journals.json?v=${cacheBuster}`),
            fetch(`data/books.json?v=${cacheBuster}`),
            fetch(`data/popular-science.json?v=${cacheBuster}`),
            fetch(`data/abstracts.json?v=${cacheBuster}`),
            fetch(`data/thesis.json?v=${cacheBuster}`)
        ]);

        publicationsData.journals = await journalsResponse.json();
        publicationsData.books = await booksResponse.json();
        publicationsData.popularScience = await popularScienceResponse.json();
        publicationsData.abstracts = await abstractsResponse.json();
        publicationsData.thesis = await thesisResponse.json();

        // Populate publications after data is loaded
        populatePublications();
    } catch (error) {
        console.error('Error loading publications data:', error);
        // Fallback to empty data
        populatePublications();
    }
}

// Create publication card for journals
function createPublicationCard(publication) {
    const notes = publication.notes ? `<p class="publication-notes">${publication.notes}</p>` : '';
    const doi = publication.doi ? `<p class="publication-doi">DOI: <a href="https://doi.org/${publication.doi}" target="_blank" rel="noopener">${publication.doi}</a></p>` : '';

    return `
        <div class="publication-card" data-year="${publication.year}" data-high-impact="${publication.highImpact}">
            <div class="publication-year">${publication.year}</div>
            <h4 class="publication-title">
                <a href="${publication.link}" target="_blank" rel="noopener">${publication.title}</a>
            </h4>
            <p class="publication-authors">${publication.authors}</p>
            <p class="publication-journal">${publication.journal}</p>
            ${doi}
            ${notes}
        </div>
    `;
}

// Create publication list item for journals
function createJournalListItem(publication) {
    let link = '';
    if (publication.link) {
        link = ` <a href="${publication.link}" target="_blank" rel="noopener">[Link]</a>`;
    }

    return `<li class="publication-list-item" data-year="${publication.year}" data-high-impact="${publication.highImpact}"><strong>${publication.year} — ${publication.title}</strong>. ${publication.authors}. ${publication.journal}.${link}</li>`;
}

// Create simple list item for other publications
function createPublicationListItem(publication, type) {
    let link = '';
    if (publication.link) {
        link = ` <a href="${publication.link}" target="_blank" rel="noopener">[Link]</a>`;
    }

    switch (type) {
        case 'books':
            return `<li><strong>${publication.year} — ${publication.title}</strong>. ${publication.authors}. ${publication.publisher}.${link}</li>`;
        case 'popularScience':
            return `<li><strong>${publication.year} — ${publication.title}</strong>. ${publication.authors}. ${publication.publication}.${link}</li>`;
        case 'abstracts':
            return `<li><strong>${publication.year} — ${publication.title}</strong>. ${publication.authors}. ${publication.conference}.${link}</li>`;
        case 'thesis':
            return `<li><strong>${publication.year} — ${publication.title}</strong>. ${publication.authors}. ${publication.institution}.${link}</li>`;
        default:
            return `<li>${publication.title}</li>`;
    }
}

// Populate publications
function populatePublications() {
    const journalsGrid = document.getElementById('journals-grid');
    const journalsList = document.getElementById('journals-list');
    const abstractsList = document.getElementById('abstracts-list');
    const booksList = document.getElementById('books-list');
    const popularScienceList = document.getElementById('popular-science-list');
    const thesisList = document.getElementById('thesis-list');

    // Populate journals grid and list
    journalsGrid.innerHTML = publicationsData.journals
        .map(createPublicationCard)
        .join('');

    const journalsListContainer = journalsList.querySelector('.publications-list');
    journalsListContainer.innerHTML = publicationsData.journals
        .map(createJournalListItem)
        .join('');

    // Populate other publications as simple lists
    abstractsList.innerHTML = publicationsData.abstracts
        .map(pub => createPublicationListItem(pub, 'abstracts'))
        .join('');

    booksList.innerHTML = publicationsData.books
        .map(pub => createPublicationListItem(pub, 'books'))
        .join('');

    popularScienceList.innerHTML = publicationsData.popularScience
        .map(pub => createPublicationListItem(pub, 'popularScience'))
        .join('');

    if (publicationsData.thesis) {
        thesisList.innerHTML = createPublicationListItem(publicationsData.thesis, 'thesis');
    }

    // Update counts
    updatePublicationCounts();
}

// Update publication counts
function updatePublicationCounts() {
    const journalsCount = document.getElementById('journals-count');
    const abstractsCount = document.getElementById('abstracts-count');
    const booksCount = document.getElementById('books-count');
    const popularScienceCount = document.getElementById('popular-science-count');

    journalsCount.textContent = publicationsData.journals.length;
    abstractsCount.textContent = publicationsData.abstracts.length;
    booksCount.textContent = publicationsData.books.length;
    popularScienceCount.textContent = publicationsData.popularScience.length;
}

// Filter publications
function filterPublications(filter) {
    const publicationCards = document.querySelectorAll('#journals-grid .publication-card');
    const publicationListItems = document.querySelectorAll('#journals-list .publications-list .publication-list-item');

    // Filter grid view
    publicationCards.forEach(card => {
        const year = parseInt(card.getAttribute('data-year'));
        const isHighImpact = card.getAttribute('data-high-impact') === 'true';
        let show = false;

        switch (filter) {
            case 'recent':
                show = year >= 2020;
                break;
            case 'high-impact':
                show = isHighImpact;
                break;
            case 'all':
                show = true;
                break;
        }

        card.style.display = show ? 'block' : 'none';
    });

    // Filter list view
    publicationListItems.forEach(item => {
        const year = parseInt(item.getAttribute('data-year'));
        const isHighImpact = item.getAttribute('data-high-impact') === 'true';
        let show = false;

        switch (filter) {
            case 'recent':
                show = year >= 2020;
                break;
            case 'high-impact':
                show = isHighImpact;
                break;
            case 'all':
                show = true;
                break;
        }

        item.style.display = show ? 'block' : 'none';
    });

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
}

// Gallery Carousel Variables
let currentSlide = 0;
const totalSlides = 15;

// Initialize Gallery Carousel
function initGalleryCarousel() {
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryDots = document.querySelector('.gallery-dots');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!galleryTrack || !galleryDots || !galleryPrev || !galleryNext) return;

    // Inject captions
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            caption.innerHTML = `<p>${img.alt}</p>`;
            item.appendChild(caption);
        }

        // Click to center
        item.addEventListener('click', () => {
            const index = Array.from(galleryItems).indexOf(item);
            goToSlide(index);
        });
    });

    // Create dots
    galleryDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot';
        dot.setAttribute('data-slide', i);
        dot.addEventListener('click', () => goToSlide(i));
        galleryDots.appendChild(dot);
    }

    // Add event listeners
    galleryPrev.addEventListener('click', prevSlide);
    galleryNext.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Initialize
    // Start at the first slide
    currentSlide = 0;
    updateCarousel();
}

// Update carousel display (3D Coverflow)
function updateCarousel() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryDots = document.querySelectorAll('.gallery-dot');

    if (galleryItems.length === 0) return;

    galleryItems.forEach((item, index) => {
        const offset = index - currentSlide;
        const absOffset = Math.abs(offset);

        // Reset styles
        item.className = 'gallery-item';
        item.style.transform = '';
        item.style.zIndex = '';
        item.style.opacity = '';

        if (offset === 0) {
            // Center item
            item.classList.add('active');
            item.style.transform = 'translateX(0) scale(1) rotateY(0deg)';
            item.style.zIndex = 100;
            item.style.opacity = 1;
        } else {
            // Side items
            const spacing = 260; // Increased spacing to prevent overlap
            const scale = 0.7;
            const rotate = offset > 0 ? -45 : 45;
            const translateX = offset * spacing;
            const translateZ = -100 * absOffset; // Push back in 3D space

            item.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotate}deg)`;
            item.style.zIndex = 100 - absOffset;
            item.style.opacity = Math.max(0, 1 - (absOffset * 0.3)); // Fade out distant items

            // Hide items too far away to improve performance and look
            if (absOffset > 3) {
                item.style.opacity = 0;
                item.style.pointerEvents = 'none';
            } else {
                item.style.pointerEvents = 'auto';
            }
        }
    });

    // Update dots
    galleryDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Navigation functions
function goToSlide(slide) {
    currentSlide = Math.max(0, Math.min(slide, totalSlides - 1));
    updateCarousel();
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateCarousel();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
    }
}

// Gallery Modal Variables
let modalCurrentSlide = 0;
const modal = document.getElementById('galleryModal');
const modalImage = modal?.querySelector('.modal-image');
const modalTitle = modal?.querySelector('.modal-title');
const modalDescription = modal?.querySelector('.modal-description');
const modalClose = modal?.querySelector('.modal-close');
const modalPrev = modal?.querySelector('.modal-prev');
const modalNext = modal?.querySelector('.modal-next');

// Initialize Gallery Modal
function initGalleryModal() {
    if (!modal) return;

    // Add click events to gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            modalCurrentSlide = index;
            openModal();
        });
    });

    // Modal navigation
    modalClose?.addEventListener('click', closeModal);
    modalPrev?.addEventListener('click', modalPrevSlide);
    modalNext?.addEventListener('click', modalNextSlide);

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') modalPrevSlide();
            if (e.key === 'ArrowRight') modalNextSlide();
        }
    });
}

// Modal functions
function openModal() {
    if (!modal || !modalImage || !modalTitle) return;

    const galleryItems = document.querySelectorAll('.gallery-item');
    const currentItem = galleryItems[modalCurrentSlide];
    const img = currentItem?.querySelector('img');

    if (!img) return;

    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = img.alt;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function modalNextSlide() {
    modalCurrentSlide = (modalCurrentSlide + 1) % 15;
    const galleryItems = document.querySelectorAll('.gallery-item');
    const currentItem = galleryItems[modalCurrentSlide];
    const img = currentItem?.querySelector('img');

    if (img && modalImage && modalTitle) {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalTitle.textContent = img.alt;
    }
}

function modalPrevSlide() {
    modalCurrentSlide = (modalCurrentSlide - 1 + 15) % 15;
    const galleryItems = document.querySelectorAll('.gallery-item');
    const currentItem = galleryItems[modalCurrentSlide];
    const img = currentItem?.querySelector('img');

    if (img && modalImage && modalTitle) {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalTitle.textContent = img.alt;
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Observe sections for animation
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Load publications data first
    loadPublicationsData();

    // Add filter event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterPublications(filter);
        });
    });

    // Add view toggle event listeners
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            toggleView(view);
        });
    });

    // Initialize gallery
    initGalleryCarousel();
    initGalleryModal();

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to dark
        setTheme('dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Resize optimization (debounce)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCarousel();
        }, 250);
    });

    // JSON-LD Injection for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "David Jimenez-Morales",
        "url": "https://biodavidjm.github.io/",
        "image": "https://biodavidjm.github.io/images/DavidJimenezMorales-portrait.jpeg",
        "jobTitle": "Bioinformatics Lead",
        "worksFor": {
            "@type": "Organization",
            "name": "Stanford University"
        },
        "sameAs": [
            "https://scholar.google.com/citations?user=Pqq0IwcAAAAJ&hl",
            "https://github.com/biodavidjm",
            "https://www.linkedin.com/pub/david-jimenez-morales/26/21b/3a9",
            "https://twitter.com/biodavidjm"
        ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

});
