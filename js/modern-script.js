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

// Publications Data Storage
let publicationsData = {
    journals: [],
    books: [],
    popularScience: [],
    abstracts: [],
    thesis: null
};

// Helper: highlight author name
function highlightName(text) {
    const patterns = [
        'David Jimenez-Morales',
        'Jimenez-Morales D',
        'Jimenez-Morales, D',
        'D Jimenez-Morales',
        'David Jimenez‑Morales',
        'Jimenez-Morales D.'
    ];
    let result = text;
    patterns.forEach(p => {
        // Use a regex that escapes special chars
        const escaped = p.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        result = result.replace(new RegExp(escaped, 'g'), `<span class="highlight-name">${p}</span>`);
    });
    return result;
}

// Load publications data from JSON files
async function loadPublicationsData() {
    try {
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

        populatePublications();
    } catch (error) {
        console.error('Error loading publications data:', error);
        populatePublications();
    }
}

// Create a pub-entry for journals
function createJournalEntry(pub) {
    const highImpact = pub.highImpact ? '<span class="pub-badge">High Impact</span>' : '';
    const doi = pub.doi ? `<span class="pub-doi">DOI: <a href="https://doi.org/${encodeURI(pub.doi)}" target="_blank" rel="noopener">${pub.doi}</a></span>` : '';
    const notes = pub.notes ? `<p class="pub-notes">${pub.notes}</p>` : '';
    const link = pub.link ? `<a href="${pub.link}" target="_blank" rel="noopener">${pub.title}</a>` : pub.title;

    return `<div class="pub-entry" data-year="${pub.year}" data-high-impact="${pub.highImpact || false}">
        <p class="pub-authors">${highlightName(pub.authors)}</p>
        <p class="pub-title-text">${link}${highImpact}</p>
        <p class="pub-journal">${pub.journal}, ${pub.year}. ${doi}</p>
        ${notes}
    </div>`;
}

// Create a pub-entry for abstracts
function createAbstractEntry(pub) {
    const link = pub.link
        ? `<p class="pub-link"><a href="${pub.link}" target="_blank" rel="noopener">[Link]</a></p>`
        : '';
    return `<div class="pub-entry">
        <p class="pub-authors">${highlightName(pub.authors)}</p>
        <p class="pub-title-text">${pub.title}</p>
        <p class="pub-journal">${pub.conference}</p>
        ${link}
    </div>`;
}

// Create a pub-entry for books
function createBookEntry(pub) {
    const link = pub.link
        ? `<p class="pub-link"><a href="${pub.link}" target="_blank" rel="noopener">[Link]</a></p>`
        : '';
    return `<div class="pub-entry">
        <p class="pub-authors">${pub.authors}</p>
        <p class="pub-title-text">${pub.title}</p>
        <p class="pub-journal">${pub.publisher}, ${pub.year}.</p>
        ${link}
    </div>`;
}

// Create a pub-entry for popular science
function createPopSciEntry(pub) {
    const link = pub.link
        ? `<p class="pub-link"><a href="${pub.link}" target="_blank" rel="noopener">[Link]</a></p>`
        : '';
    return `<div class="pub-entry">
        <p class="pub-authors">${pub.authors}</p>
        <p class="pub-title-text">${pub.title}</p>
        <p class="pub-journal">${pub.publication}, ${pub.year}.</p>
        ${link}
    </div>`;
}

// Create a pub-entry for thesis
function createThesisEntry(pub) {
    const link = pub.link
        ? `<p class="pub-link"><a href="${pub.link}" target="_blank" rel="noopener">[Link]</a></p>`
        : '';
    return `<div class="pub-entry">
        <p class="pub-authors">${pub.authors}</p>
        <p class="pub-title-text">${pub.title}</p>
        <p class="pub-journal">${pub.institution}, ${pub.year}.</p>
        ${link}
    </div>`;
}

// Populate publications
function populatePublications() {
    const journalList = document.getElementById('journal-list');
    const abstractsList = document.getElementById('abstracts-list');
    const booksList = document.getElementById('books-list');
    const popularScienceList = document.getElementById('popular-science-list');
    const thesisList = document.getElementById('thesis-list');

    // Journals
    if (journalList) {
        journalList.innerHTML = publicationsData.journals.map(createJournalEntry).join('');
    }

    // Abstracts
    if (abstractsList) {
        abstractsList.innerHTML = publicationsData.abstracts.map(createAbstractEntry).join('');
    }

    // Books
    if (booksList) {
        booksList.innerHTML = publicationsData.books.map(createBookEntry).join('');
    }

    // Popular Science
    if (popularScienceList) {
        popularScienceList.innerHTML = publicationsData.popularScience.map(createPopSciEntry).join('');
    }

    // Thesis
    if (thesisList && publicationsData.thesis) {
        thesisList.innerHTML = createThesisEntry(publicationsData.thesis);
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

    if (journalsCount) journalsCount.textContent = publicationsData.journals.length;
    if (abstractsCount) abstractsCount.textContent = publicationsData.abstracts.length;
    if (booksCount) booksCount.textContent = publicationsData.books.length;
    if (popularScienceCount) popularScienceCount.textContent = publicationsData.popularScience.length;
}

// Clickable stat boxes → toggle their panels
document.querySelectorAll('.summary-stat.clickable').forEach(box => {
    box.addEventListener('click', function () {
        const panelId = this.getAttribute('data-panel');
        const panel = document.getElementById(panelId);
        const isActive = this.classList.contains('active');

        // Close all panels & deactivate all boxes
        document.querySelectorAll('.summary-stat.clickable').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.pub-panel').forEach(p => p.classList.remove('active'));

        // If it wasn't active, open it
        if (!isActive && panel) {
            this.classList.add('active');
            panel.classList.add('active');

            // On mobile, scroll to the panel so user sees the content
            if (window.innerWidth <= 900) {
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Publication Filters (for journals panel)
let activeJournalFilter = 'all';

function applyJournalFilters() {
    const entries = document.querySelectorAll('#journal-list .pub-entry');
    let visibleCount = 0;
    entries.forEach(entry => {
        const year = parseInt(entry.getAttribute('data-year'));
        const isHighImpact = entry.getAttribute('data-high-impact') === 'true';
        let show = false;

        switch (activeJournalFilter) {
            case 'all':
                show = true;
                break;
            case 'recent':
                show = year >= 2020;
                break;
            case 'high-impact':
                show = isHighImpact;
                break;
        }

        if (show) {
            entry.classList.remove('hidden');
            visibleCount++;
        } else {
            entry.classList.add('hidden');
        }
    });
    const noResults = document.getElementById('no-results-msg');
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', function () {
        const filterType = this.getAttribute('data-filter-type');
        const filterValue = this.getAttribute('data-filter');

        // Update active pill in this row
        this.closest('.filter-row').querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');

        if (filterType === 'journals-filter') {
            activeJournalFilter = filterValue;
            applyJournalFilters();
        }
    });
});

// Gallery Carousel Variables
let currentSlide = 0;
let totalSlides = 0;

// Initialize Gallery Carousel
function initGalleryCarousel() {
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryDots = document.querySelector('.gallery-dots');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!galleryTrack || !galleryDots || !galleryPrev || !galleryNext) return;

    totalSlides = galleryItems.length;

    // Inject captions
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img && img.alt) {
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

    // Load publications data
    loadPublicationsData();

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
