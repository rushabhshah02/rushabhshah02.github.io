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
const scrollProgress = document.getElementById('scroll-progress-bar');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
let scrollTicking = false;
let lastActiveId = null;

function onScroll() {
    const scrollTop = window.scrollY;

    // Scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrollPercent + '%';

    // Scroll-to-top button visibility
    if (scrollTop > 300) {
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
