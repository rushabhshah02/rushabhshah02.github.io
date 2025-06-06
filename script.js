// OPENS UP THE MENU UPON CLICKING HAMBURGER ICON
let menuicon = document.querySelector('#hamburger-menu');
let navhead = document.querySelector('.navheader');
menuicon.addEventListener('click', () => {
    menuicon.classList.toggle('bx-x');
    navhead.classList.toggle('active');
});

// CLOSES UP THE MENU WHEN A NAVIGATION ITEM IS CLICKED
let navLinks = document.querySelectorAll('header nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuicon.classList.remove('bx-x');
        navhead.classList.remove('active');
    });
});

// HIGHLIGHTS ACTIVE NAVIGATION ON PAGE WHEN SCROLLING UP OR DOWN THE SITE
let sections = document.querySelectorAll('section');
window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id')

        if (top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.classList.remove('active')
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            })
        }
    })
}

// TYPING ANIMATION
var typed = new Typed(".animation-home", {
    strings: ["Rushabh Shah", "a Developer", "a CS Graduate"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true

})

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

// HEADER TRANSITION ON SCROLL
const header = document.querySelector('.header');
const headerHeightOriginal = header.clientHeight;
header.style.height = `${headerHeightOriginal}px`;
header.style.backgroundColor = 'transparent';

window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress-bar');
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});