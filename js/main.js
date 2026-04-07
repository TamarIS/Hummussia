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

  // --- Menu: load from menu.csv + category.csv ---

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

  function renderMenu(items, categoryDescs) {
    const container = document.getElementById('menu-content');
    if (!container) return;

    const available = items.filter(function (item) {
      return item.Available.toLowerCase() === 'yes';
    });

    const categories = {};
    const categoryOrder = [];
    available.forEach(function (item) {
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
      if (categoryDescs[cat]) {
        html += '<p class="menu-category__desc">' + escapeHtml(categoryDescs[cat]) + '</p>';
      }
      html += '<div class="menu-grid">';
      categories[cat].forEach(function (item) {
        html += '<div class="menu-card">';
        html += '<div class="menu-card__info">';
        html += '<p class="menu-card__name">' + escapeHtml(item.name) + '</p>';
        if (item.description) {
          html += '<p class="menu-card__desc">' + escapeHtml(item.description) + '</p>';
        }
        html += '</div>';
        if (item.price) {
          html += '<span class="menu-card__price">' + escapeHtml(formatPrice(item.price)) + '</span>';
        }
        html += '</div>';
      });
      html += '</div></div>';
    });

    container.innerHTML = html;
  }

  Promise.all([fetch('menu.csv'), fetch('category.csv')])
    .then(function (responses) {
      return Promise.all(responses.map(function (r) { return r.text(); }));
    })
    .then(function (texts) {
      const items = parseCSV(texts[0]);
      const catRows = parseCSV(texts[1]);
      const categoryDescs = {};
      catRows.forEach(function (row) {
        if (row.Category && row.description) {
          categoryDescs[row.Category] = row.description;
        }
      });
      renderMenu(items, categoryDescs);
    })
    .catch(function () {
      const c = document.getElementById('menu-content');
      if (c) {
        c.innerHTML = '<p class="menu-unavailable">Menu coming soon — <a href="mailto:info@hummussia.com">contact us</a> for details.</p>';
      }
    });

})();
