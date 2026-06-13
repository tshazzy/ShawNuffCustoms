/* ============================================
   SHAWNUFF CUSTOMS — main.js
   ============================================ */

// ---- Footer year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Sticky nav on scroll ----
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Mobile hamburger ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Booking Form Validation & Submission ----
// Paste your Formspree endpoint below after signing up at formspree.io
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xlgkaryk';

const form        = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const isValid = validateForm();
    if (!isValid) return;

    submitForm();
  });
}

function validateForm() {
  let valid = true;

  const required = [
    { id: 'fname',       label: 'First name is required' },
    { id: 'lname',       label: 'Last name is required' },
    { id: 'phone',       label: 'Phone number is required' },
    { id: 'service',     label: 'Please select a service' },
    { id: 'description', label: 'Please describe the job' },
  ];

  required.forEach(({ id, label }) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      showError(el, label);
      valid = false;
    }
  });

  // Phone format check (loose — allows various formats)
  const phone = document.getElementById('phone');
  if (phone.value.trim() && !/^[\d\s\-()+]{7,}$/.test(phone.value.trim())) {
    showError(phone, 'Please enter a valid phone number');
    valid = false;
  }

  // Email format check (optional field, only validate if filled)
  const email = document.getElementById('email');
  if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError(email, 'Please enter a valid email address');
    valid = false;
  }

  // Consent checkbox
  const consent = form.querySelector('input[name="consent"]');
  if (!consent.checked) {
    showError(consent, 'Please check the box to continue');
    valid = false;
  }

  return valid;
}

function showError(el, message) {
  el.classList.add('error');
  const err = document.createElement('span');
  err.className = 'field-error';
  err.textContent = message;
  el.parentNode.appendChild(err);
}

function clearErrors() {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.field-error').forEach(el => el.remove());
}

function submitForm() {
  const btn     = form.querySelector('.btn-submit');
  const btnText = btn.querySelector('.btn-text');

  btn.disabled = true;
  btnText.textContent = 'Sending…';

  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
    .then(res => {
      if (res.ok) {
        form.style.display = 'none';
        formSuccess.classList.add('visible');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        return res.json().then(data => { throw new Error(data.error || 'Submission failed'); });
      }
    })
    .catch(err => {
      btnText.textContent = 'Send Request';
      btn.disabled = false;
      const errMsg = form.querySelector('.form-submit-error') || document.createElement('p');
      errMsg.className = 'form-submit-error field-error';
      errMsg.textContent = 'Something went wrong. Please try again or call us directly.';
      btn.parentNode.insertBefore(errMsg, btn);
    });
}

// ---- Scroll-reveal animation ----
// Simple intersection observer to fade-in sections as they enter viewport
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add reveal class to cards and sections
document.querySelectorAll('.service-card, .gallery-item, .contact-item, .stat').forEach((el, i) => {
  el.style.setProperty('--reveal-delay', `${i * 0.07}s`);
  el.classList.add('reveal');
  observer.observe(el);
});

// ---- Add reveal CSS dynamically ----
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease var(--reveal-delay, 0s),
                transform 0.55s ease var(--reveal-delay, 0s);
  }
  .reveal.in-view {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// Add active nav link style dynamically
const navActiveStyle = document.createElement('style');
navActiveStyle.textContent = `
  .nav-links a.active:not(.nav-cta) { color: var(--green); }
`;
document.head.appendChild(navActiveStyle);
