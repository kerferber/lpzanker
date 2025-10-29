const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const scrollTopButton = document.querySelector('.scroll-top');
const faqItems = document.querySelectorAll('.faq-item');
const animatedSections = document.querySelectorAll('[data-animate]');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.setAttribute(
      'aria-expanded',
      navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
  });
}

if (navLinks.length && navToggle && nav) {
  navLinks.forEach((link) =>
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    })
  );
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopButton.classList.add('visible');
  } else {
    scrollTopButton.classList.remove('visible');
  }
});

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    faqItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      }
    });

    item.classList.toggle('open');
    button.setAttribute('aria-expanded', (!isOpen).toString());
  });
});

if (animatedSections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatedSections.forEach((section) => observer.observe(section));
}
