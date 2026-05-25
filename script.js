// OPENS UP THE MENU UPON CLICKING HAMBURGER ICON
const menuicon = document.querySelector('#hamburger-menu');
const navhead = document.querySelector('.navheader');

function setMenuOpen(open) {
    menuicon.classList.toggle('active', open);
    navhead.classList.toggle('active', open);
    menuicon.setAttribute('aria-expanded', open ? 'true' : 'false');
}

menuicon.addEventListener('click', () => {
    setMenuOpen(!menuicon.classList.contains('active'));
});

// CLOSES UP THE MENU WHEN A NAVIGATION ITEM IS CLICKED
const navLinks = document.querySelectorAll('header nav a');
const navLinksById = {};
navLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    navLinksById[id] = link;
    link.addEventListener('click', () => {
        setMenuOpen(false);
    });
});

// CACHE SECTION OFFSETS (recomputed on resize, not on every scroll, to avoid layout thrash)
const sections = Array.from(document.querySelectorAll('section'));
let sectionPositions = [];
function recalcSectionPositions() {
    sectionPositions = sections.map(sec => ({
        id: sec.id,
        top: sec.offsetTop - 150,
        bottom: sec.offsetTop - 150 + sec.offsetHeight,
    }));
}
recalcSectionPositions();
window.addEventListener('resize', recalcSectionPositions, { passive: true });
window.addEventListener('load', recalcSectionPositions);

// CONSOLIDATED, RAF-THROTTLED SCROLL HANDLER
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const progressRingFill = scrollToTopBtn.querySelector('.progress-ring-fill');
const RING_CIRCUMFERENCE = 2 * Math.PI * 26;
let scrollTicking = false;
let lastActiveId = null;

function onScroll() {
    const scrollTop = window.scrollY;

    // Scroll progress ring around the back-to-top button
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    progressRingFill.style.strokeDashoffset =
        RING_CIRCUMFERENCE * (1 - scrollPercent);

    // Scroll-to-top button visibility
    if (scrollTop > 100) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }

    // Active nav highlight (uses cached offsets, no layout reads)
    for (let i = 0; i < sectionPositions.length; i++) {
        const s = sectionPositions[i];
        if (scrollTop >= s.top && scrollTop < s.bottom) {
            if (lastActiveId !== s.id) {
                navLinks.forEach(l => l.classList.remove('active'));
                const link = navLinksById[s.id];
                if (link) link.classList.add('active');
                lastActiveId = s.id;
            }
            break;
        }
    }

    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(onScroll);
        scrollTicking = true;
    }
}, { passive: true });

// TYPING ANIMATION
new Typed(".animation-home", {
    strings: ["Rushabh Shah", "a Developer", "a CS Graduate"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true,
});

// HANDLES CONTACT FORM RESET AND SUCCESS/FAIL MESSAGE
document.getElementById('contacts').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const action = form.action;
    const submissionStatus = document.getElementById('submissionStatus');

    fetch(action, {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            form.reset();
            submissionStatus.textContent = "Message sent successfully!";
            submissionStatus.style.color = "green";
        }
    }).catch(error => {
        console.error('There was a problem submitting the form:', error);
        submissionStatus.textContent = "An error occurred. Please try again.";
        submissionStatus.style.color = "red";
    });
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// INITIALIZE SCROLL-REVEAL ANIMATIONS
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1000, once: true, disable: 'mobile' });
}

// CERTIFICATIONS: 3D TILT + CURSOR-TRACKED GLOW
const certCards = document.querySelectorAll('.cert-card');
const supportsTilt =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TILT_MAX = 6;

if (supportsTilt) {
    certCards.forEach(card => {
        const inner = card.querySelector('.cert-card-inner');
        if (!inner) return;

        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            const rx = (0.5 - py) * TILT_MAX;
            const ry = (px - 0.5) * TILT_MAX;
            inner.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
            card.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
            card.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
        });

        card.addEventListener('mouseleave', () => {
            inner.style.transform = '';
        });
    });
}

// CERTIFICATIONS: LIGHTBOX
const certLightbox = document.getElementById('cert-lightbox');
if (certLightbox && certCards.length > 0) {
    const lbImg = certLightbox.querySelector('.cert-lightbox-img');
    const lbCaption = certLightbox.querySelector('.cert-lightbox-caption');
    const lbClose = certLightbox.querySelector('.cert-lightbox-close');
    const lbPrev = certLightbox.querySelector('.cert-lightbox-prev');
    const lbNext = certLightbox.querySelector('.cert-lightbox-next');

    const certData = Array.from(certCards).map(c => ({
        src: c.dataset.certSrc,
        title: c.dataset.certTitle || ''
    }));

    let currentIdx = 0;
    let lastFocused = null;

    function renderCert() {
        const cert = certData[currentIdx];
        if (!cert) return;
        lbImg.src = cert.src;
        lbImg.alt = cert.title;
        lbCaption.textContent = cert.title;
    }

    function openLightbox(i) {
        currentIdx = i;
        lastFocused = document.activeElement;
        renderCert();
        certLightbox.classList.add('is-open');
        certLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function closeLightbox() {
        certLightbox.classList.remove('is-open');
        certLightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    function step(delta) {
        if (certData.length === 0) return;
        currentIdx = (currentIdx + delta + certData.length) % certData.length;
        renderCert();
    }

    certCards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.image-button')) return;
            openLightbox(i);
        });
        card.addEventListener('keydown', (e) => {
            if (e.target !== card) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(i);
            }
        });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => step(-1));
    lbNext.addEventListener('click', () => step(1));

    certLightbox.addEventListener('click', (e) => {
        if (e.target === certLightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!certLightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
    });
}
