/* ====== NAV MENU TOGGLE ====== */
function myMenuFunction(){
  const menu = document.getElementById('myNavMenu');
  if(menu.classList.contains('responsive')){
    menu.classList.remove('responsive');
  } else {
    menu.classList.add('responsive');
  }
}

/* ====== HEADER SHADOW / HEIGHT ====== */
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (document.documentElement.scrollTop > 30){
    header.style.boxShadow = '0 6px 18px rgba(0,0,0,.25)';
  } else {
    header.style.boxShadow = 'none';
  }
});

/* ====== TYPED JS ====== */
const typed = new Typed('.typedText', {
  strings: ['C++ Developer', 'Backend Engineer', 'Cloud & DevOps Enthusiast', 'Computer Science Student'],
  loop: true,
  typeSpeed: 100,
  backSpeed: 80,
  backDelay: 1600
});

/* ====== SCROLL REVEAL ====== */
const sr = ScrollReveal({
  origin: 'bottom',
  distance: '40px',
  duration: 1000,
  reset: false
});

sr.reveal('.hero__content', {delay: 100});
sr.reveal('.hero__image-wrap', {delay: 200});
sr.reveal('.section__head', {delay: 100});
sr.reveal('.card, .timeline__item, .project, .contact__card, .form .input, .form .textarea', {interval: 80});

/* ====== ACTIVE LINK ON SCROLL ====== */
const sections = document.querySelectorAll('section[id]');
function scrollActive() {
  const scrollY = window.scrollY;
  sections.forEach(cur =>{
    const height = cur.offsetHeight;
    const top = cur.offsetTop - 100;
    const id = cur.getAttribute('id');
    const link = document.querySelector(`.nav__menu a[href*='${id}']`);
    if (!link) return;
    if(scrollY > top && scrollY <= top + height) link.classList.add('active-link');
    else link.classList.remove('active-link');
  });
}
window.addEventListener('scroll', scrollActive);

/* ====== YEAR IN FOOTER ====== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ====== SMOOTH SCROLL FOR INTERNAL LINKS ====== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
    // Close mobile menu after click
    const menu = document.getElementById('myNavMenu');
    if(menu.classList.contains('responsive')) menu.classList.remove('responsive');
  });
});
