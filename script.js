const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const scrollTopButton = document.querySelector('.scroll-top');
const faqItems = document.querySelectorAll('.faq-item');
const animatedSections = document.querySelectorAll('[data-animate]');
const showcaseSlides = document.querySelectorAll('.showcase-slide');
const parallaxCards = document.querySelectorAll('[data-parallax]');
const counters = document.querySelectorAll('[data-counter]');
const billingToggle = document.querySelector('#billing-toggle');
const pricingCards = document.querySelectorAll('.pricing-card[data-monthly]');
const toggleLabels = document.querySelectorAll('[data-toggle-label]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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

if (scrollTopButton) {
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
}

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

if (showcaseSlides.length > 1 && !prefersReducedMotion.matches) {
  let activeIndex = 0;

  setInterval(() => {
    showcaseSlides[activeIndex].classList.remove('is-active');
    activeIndex = (activeIndex + 1) % showcaseSlides.length;
    showcaseSlides[activeIndex].classList.add('is-active');
  }, 5200);
}

const enableParallax = () => {
  parallaxCards.forEach((card) => {
    if (prefersReducedMotion.matches) {
      card.style.transform = '';
      if (card._parallaxMove) {
        card.removeEventListener('mousemove', card._parallaxMove);
      }
      if (card._parallaxLeave) {
        card.removeEventListener('mouseleave', card._parallaxLeave);
      }
      card._parallaxMove = null;
      card._parallaxLeave = null;
      return;
    }

    if (card._parallaxMove) {
      return;
    }

    const handleMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 10;
      const rotateY = (x - 0.5) * 10;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const reset = () => {
      card.style.transform = '';
    };

    card._parallaxMove = handleMove;
    card._parallaxLeave = reset;
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', reset);
  });
};

enableParallax();

if (prefersReducedMotion.addEventListener) {
  prefersReducedMotion.addEventListener('change', enableParallax);
} else if (prefersReducedMotion.addListener) {
  prefersReducedMotion.addListener(enableParallax);
}

const formatNumber = (value, decimals = 0) =>
  Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const element = entry.target;
        const target = Number(element.dataset.target || 0);
        const decimals = Number(element.dataset.decimals || 0);
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        const duration = Number(element.dataset.duration || 1600);
        const startTime = performance.now();

        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          element.textContent = `${prefix}${formatNumber(value, decimals)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
        counterObserver.unobserve(element);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const updateBilling = () => {
  if (!billingToggle) {
    return;
  }

  const isAnnual = billingToggle.checked;

  pricingCards.forEach((card) => {
    const priceValue = card.querySelector('.price-value');
    const pricePeriod = card.querySelector('.price-period');
    const priceNote = card.querySelector('.price-note');

    const monthly = Number(card.dataset.monthly || 0);
    const annual = Number(card.dataset.annual || monthly);
    const monthlyNote = card.dataset.monthlyNote || '';
    const annualNote = card.dataset.annualNote || '';

    if (isAnnual) {
      priceValue.textContent = formatNumber(annual);
      pricePeriod.textContent = '/ mês (anual)';
      priceNote.textContent = annualNote;
      card.classList.add('is-annual');
    } else {
      priceValue.textContent = formatNumber(monthly);
      pricePeriod.textContent = '/ mês';
      priceNote.textContent = monthlyNote;
      card.classList.remove('is-annual');
    }
  });

  toggleLabels.forEach((label) => {
    const type = label.dataset.toggleLabel;
    label.classList.toggle('active', (type === 'monthly' && !isAnnual) || (type === 'annual' && isAnnual));
  });
};

if (billingToggle) {
  billingToggle.addEventListener('change', updateBilling);
  updateBilling();
}
