/* ============================================================
   Hummussia — main.js
   ============================================================ */

(function () {
  'use strict';

  // --- Mobile nav toggle ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  // --- Close mobile nav on desktop resize ---
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      hamburger && hamburger.classList.remove('open');
      mobileNav && mobileNav.classList.remove('open');
    }
  });

  // --- Highlight nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');

  function highlightNav() {
    const scrollY = window.scrollY + 90;
    sections.forEach(function (section) {
      if (
        scrollY >= section.offsetTop &&
        scrollY < section.offsetTop + section.offsetHeight
      ) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // --- Menu: load from menu.csv ---

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(function (h) { return h.trim(); });
    return lines.slice(1).map(function (line) {
      const fields = [];
      let field = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
          fields.push(field);
          field = '';
        } else {
          field += ch;
        }
      }
      fields.push(field);
      const obj = {};
      headers.forEach(function (h, i) {
        obj[h] = (fields[i] || '').trim();
      });
      return obj;
    });
  }

  function formatPrice(price) {
    const n = parseFloat(price);
    if (isNaN(n)) return price;
    return '€\u00a0' + n.toFixed(2);
  }

  function renderMenu(items) {
    const container = document.getElementById('menu-content');
    if (!container) return;

    const categories = {};
    const categoryOrder = [];
    items.forEach(function (item) {
      if (!categories[item.category]) {
        categories[item.category] = [];
        categoryOrder.push(item.category);
      }
      categories[item.category].push(item);
    });

    let html = '';
    categoryOrder.forEach(function (cat) {
      html += '<div class="menu-category">';
      html += '<h3 class="menu-category__title">' + escapeHtml(cat) + '</h3>';
      html += '<div class="menu-category__line"></div>';
      html += '<div class="menu-grid">';
      categories[cat].forEach(function (item) {
        html += '<div class="menu-card">';
        html += '<div class="menu-card__info">';
        html += '<p class="menu-card__name">' + escapeHtml(item.name) + '</p>';
        html += '<p class="menu-card__desc">' + escapeHtml(item.description) + '</p>';
        html += '</div>';
        html += '<span class="menu-card__price">' + escapeHtml(formatPrice(item.price)) + '</span>';
        html += '</div>';
      });
      html += '</div></div>';
    });

    container.innerHTML = html;
  }

  fetch('menu.csv')
    .then(function (r) { return r.text(); })
    .then(function (text) { renderMenu(parseCSV(text)); })
    .catch(function () {
      const c = document.getElementById('menu-content');
      if (c) {
        c.innerHTML = '<p class="menu-unavailable">Menu coming soon — <a href="mailto:info@hummussia.com">contact us</a> for details.</p>';
      }
    });

})();
