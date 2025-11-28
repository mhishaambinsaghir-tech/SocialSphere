// =================================================================
// 🔑 VITE ASSET & MODULE IMPORTS (CRITICAL FIXES)
// =================================================================
// 1. Third-party library imports (Vite resolves "aos" from node_modules)
import AOS from 'aos';
import 'aos/dist/aos.css';

// 2. Image imports (Vite copies these to /docs/assets/ and gives the correct URL)
//    NOTE: Adjust the paths "./SS_LOGO_S.PNG" and "./hh.png" 
//    if your images are not in the same directory as this JS file.
import lightLogo from './SS_LOGO_S.PNG';
import darkLogo from './hh.png';

// Import lucide (assuming this is how you import it)
import * as lucide from 'lucide';
// =================================================================

lucide.createIcons();

const root = document.documentElement;
const body = document.body;
const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

// --- THEME TOGGLE LOGIC ---

function updateThemeToggleIcon(isLightMode) {
    const icon = isLightMode ? 'moon' : 'sun';
    // 💡 USE THE IMPORTED VARIABLES which contain the correct public paths
    const image = isLightMode ? lightLogo : darkLogo;
    const iconHtml = `<i data-lucide="${icon}" class="w-5 h-5"></i>`;

    let a = document.getElementById('image')
    a.setAttribute('src', image)

    themeToggleDesktop.innerHTML = iconHtml;
    themeToggleMobile.innerHTML = iconHtml;
    lucide.createIcons(); // Re-render Lucide icons
}

function applyTheme(isLightMode) {
    if (isLightMode) {
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeToggleIcon(isLightMode);
    // Re-run color update to ensure the select arrow reflects the new mode immediately
    updateSelectArrowColor(parseFloat(root.style.getPropertyValue('--current-hue')));
}

function toggleTheme() {
    const isLightMode = body.classList.contains('light-mode');
    applyTheme(!isLightMode);
}

// Initialize theme from localStorage or system preference
function initializeTheme() {
    let storedTheme = localStorage.getItem('theme');
    let prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (storedTheme === 'light') {
        applyTheme(true);
    } else if (storedTheme === 'dark') {
        applyTheme(false);
    } else {
        // Default to system preference if no stored theme
        applyTheme(prefersLight);
    }
}

// Attach event listeners
themeToggleDesktop.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);

// --- MOBILE MENU LOGIC ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        }
    });
}

// --- HUE ANIMATION & SELECT ARROW LOGIC ---

const hueStart = parseFloat(getComputedStyle(root).getPropertyValue('--hue-start'));
const hueEnd = parseFloat(getComputedStyle(root).getPropertyValue('--hue-end'));
const animationDuration = 15000; // 15 seconds in milliseconds

let startTime = null;

function updateSelectArrowColor(currentHue) {
    const selectElement = document.querySelector('select.glass-input');
    if (selectElement) {
        // Check if we are in light mode to determine the icon color
        const isLightMode = body.classList.contains('light-mode');
        // White icon for dark mode, dark icon for light mode
        const svgColor = encodeURIComponent(isLightMode ? '#070707' : '#FFFFFF');

        // Update the background image (SVG icon)
        selectElement.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${svgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>')`;
    }
}


function animateHue(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    // Calculate progress through a full cycle (0 to 1, then back to 0)
    let progress = (elapsed % animationDuration) / animationDuration;

    // For alternate behavior: go from 0 to 1, then 1 to 0
    if (progress > 0.5) {
        progress = 1 - progress;
    }
    progress *= 2;

    // Interpolate hue linearly between hueStart and hueEnd
    const currentHue = hueStart + (hueEnd - hueStart) * progress;

    root.style.setProperty('--current-hue', currentHue);
    // Update select arrow color dynamically
    updateSelectArrowColor(currentHue);

    requestAnimationFrame(animateHue);
}

// Start initialization and animation on load
window.onload = function () {
    initializeTheme();
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
    });
    requestAnimationFrame(animateHue);
    initCounters();
}

// --- COUNTER ANIMATION ---
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Animation speed

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        let count = 0;

        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.innerText = Math.ceil(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    };

    // Use Intersection Observer to trigger animation when stats section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                if (counter.innerText === '0') { // Only animate once
                    animateCounter(counter);
                }
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// --- PORTFOLIO MODAL FUNCTIONALITY ---

// Project data
const projects = {
    'video-campaign': {
        title: 'Video Campaign',
        description: 'A high-impact video marketing campaign that generated 2M+ views and increased brand awareness by 150%.',
        media: [
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Video+Campaign+1',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Video+Campaign+2',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Video+Campaign+3'
        ]
    },
    'redesign': {
        title: 'Before/After Redesign',
        description: 'Complete brand transformation resulting in 300% increase in engagement and modern, cohesive visual identity.',
        media: [
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Before+Redesign',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=After+Redesign'
        ]
    },
    'ugc-sample': {
        title: 'UGC Sample',
        description: 'Authentic user-generated content strategy that built trust and drove 4.5x ROAS across multiple platforms.',
        media: [
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=UGC+Sample+1',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=UGC+Sample+2',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=UGC+Sample+3'
        ]
    },
    'ad-creative': {
        title: 'Ad Creative',
        description: 'Performance-driven ad creatives optimized for Meta and TikTok, achieving 2.8% CTR and 35% conversion rate.',
        media: [
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Ad+Creative+1',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Ad+Creative+2'
        ]
    },
    'reel-series': {
        title: 'Reel Series',
        description: 'Viral Instagram Reels series that accumulated 5M+ views and grew follower base by 200% in 3 months.',
        media: [
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Reel+1',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Reel+2',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Reel+3'
        ]
    },
    'visual-identity': {
        title: 'Visual Identity',
        description: 'Complete visual identity system including logo, color palette, typography, and brand guidelines.',
        media: [
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Logo+Design',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Brand+Colors',
            'https://via.placeholder.com/900x600/1a1a1a/00ffff?text=Typography'
        ]
    }
};

let currentProject = null;
let currentSlide = 0;

// Open modal
function openModal(projectId) {
    currentProject = projects[projectId];
    if (!currentProject) return;

    const modal = document.getElementById('portfolio-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const carouselContainer = document.getElementById('carousel-slides');
    const indicators = document.getElementById('carousel-indicators');

    // Set content
    modalTitle.textContent = currentProject.title;
    modalDescription.textContent = currentProject.description;

    // Clear and populate carousel
    carouselContainer.innerHTML = '';
    indicators.innerHTML = '';
    currentSlide = 0;

    currentProject.media.forEach((mediaUrl, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;

        // Check if it's a video
        const isVideo = mediaUrl.match(/\.(mp4|webm|ogg)$/i);

        if (isVideo) {
            slide.innerHTML = `
                <video controls class="w-full h-full object-cover rounded-2xl">
                    <source src="${mediaUrl}" type="video/${isVideo[1]}">
                    Your browser does not support the video tag.
                </video>`;
        } else {
            slide.innerHTML = `<img src="${mediaUrl}" alt="${currentProject.title} ${index + 1}">`;
        }

        carouselContainer.appendChild(slide);

        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Close modal
function closeModal() {
    const modal = document.getElementById('portfolio-modal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    currentProject = null;
    currentSlide = 0;
}

// Navigate carousel
function nextSlide() {
    if (!currentProject) return;
    currentSlide = (currentSlide + 1) % currentProject.media.length;
    updateCarousel();
}

function prevSlide() {
    if (!currentProject) return;
    currentSlide = (currentSlide - 1 + currentProject.media.length) % currentProject.media.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Initialize modal event listeners
window.addEventListener('DOMContentLoaded', () => {
    // Portfolio card click events
    const portfolioCards = document.querySelectorAll('[data-project-id]');
    portfolioCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            openModal(projectId);
        });
    });

    // Close button
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Click outside modal to close
    const modalOverlay = document.getElementById('portfolio-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Carousel navigation
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentProject) {
            closeModal();
        }
    });
});