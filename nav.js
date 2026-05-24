(function () {
  var STORAGE_KEY = 'suffolkham-theme';

  var moonIcon = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var sunIcon  = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var searchIcon = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(STORAGE_KEY, t);
    var btn = document.querySelector('.nav-theme-toggle');
    if (btn) {
      btn.innerHTML = t === 'dark' ? sunIcon : moonIcon;
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  /* Restore saved preference before nav renders */
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  var page = location.pathname.split('/').pop();

  /* ---- QRZ Modal ---- */
  var modal = document.createElement('div');
  modal.id = 'qrz-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Callsign lookup');
  modal.innerHTML =
    '<div class="qrz-modal-backdrop"></div>' +
    '<div class="qrz-modal-box">' +
      '<div class="qrz-modal-header">' +
        '<span>Callsign lookup</span>' +
        '<button class="qrz-modal-close" aria-label="Close">✕</button>' +
      '</div>' +
      '<form class="qrz-modal-form" id="qrz-modal-form">' +
        '<input id="qrz-modal-input" type="text" placeholder="e.g. M9XCN" autocomplete="off" autocapitalize="characters" spellcheck="false" style="text-transform:uppercase;">' +
        '<button type="submit" class="btn btn-primary">Look up ↗</button>' +
      '</form>' +
      '<p class="qrz-modal-hint">Opens qrz.com in a new tab</p>' +
    '</div>';
  document.body.appendChild(modal);

  function openModal() {
    modal.classList.add('qrz-modal-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { document.getElementById('qrz-modal-input').focus(); }, 50);
  }

  function closeModal() {
    modal.classList.remove('qrz-modal-open');
    document.body.style.overflow = '';
  }

  modal.querySelector('.qrz-modal-backdrop').addEventListener('click', closeModal);
  modal.querySelector('.qrz-modal-close').addEventListener('click', closeModal);
  modal.querySelector('#qrz-modal-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var call = document.getElementById('qrz-modal-input').value.trim().toUpperCase();
    if (call) {
      window.open('https://www.qrz.com/db/' + encodeURIComponent(call), '_blank', 'noopener');
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('qrz-modal-open')) closeModal();
  });

  /* ---- Breadcrumbs ---- */
  var breadcrumbMap = {
    'getting-started': [{ label: 'Home', href: '/' }, { label: 'Getting Started' }],
    'equipment':       [{ label: 'Home', href: '/' }, { label: 'Equipment' }],
    'repeaters':       [{ label: 'Home', href: '/' }, { label: 'Repeaters' }],
    'nets':            [{ label: 'Home', href: '/' }, { label: 'Nets' }],
    'dmr':             [{ label: 'Home', href: '/' }, { label: 'DMR' }],
    'events':          [{ label: 'Home', href: '/' }, { label: 'Events' }],
    'calculators':     [{ label: 'Home', href: '/' }, { label: 'Calculators' }],
    'locator':         [{ label: 'Home', href: '/' }, { label: 'QTH Locator' }],
    'glossary':        [{ label: 'Home', href: '/' }, { label: 'Glossary' }],
    'meshcore':        [{ label: 'Home', href: '/' }, { label: 'MeshCore' }],
    'about':           [{ label: 'Home', href: '/' }, { label: 'About' }],
  };

  function injectBreadcrumbs() {
    var crumbs = breadcrumbMap[page];
    if (!crumbs) return;
    var nav_el = document.getElementById('site-nav');
    if (!nav_el) return;
    var bc = document.createElement('nav');
    bc.setAttribute('aria-label', 'Breadcrumb');
    bc.className = 'breadcrumbs';
    bc.innerHTML = crumbs.map(function (c, i) {
      if (c.href) return '<a href="' + c.href + '">' + c.label + '</a><span class="sep" aria-hidden="true">/</span>';
      return '<span>' + c.label + '</span>';
    }).join('');
    nav_el.insertAdjacentElement('afterend', bc);
  }

  fetch('nav.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var nav = document.getElementById('site-nav');
      if (!nav) return;

      var isDark = getTheme() === 'dark';

      var items = d.links.map(function (link) {
        var cls = link.href === page ? ' class="active"' : '';
        return '<li><a href="' + link.href + '"' + cls + '>' + link.label + '</a></li>';
      }).join('');

      var logoSvg = '<svg height="34" viewBox="0 0 64.24 181.96" fill="none" aria-hidden="true" style="display:block;">' +
        '<path fill="currentColor" d="M62.81,69.23v3.63h-15.23v-2.54c0-9.68-6.07-13.91-15.58-13.91-8.33,0-13.44,4.23-13.44,10.04,0,7.98,7.38,9.44,17.37,11.73l1.07.24c17.13,3.87,27.24,10.04,27.24,25.4,0,17.06-13.08,26.61-30.81,26.61-20.34,0-33.43-11.13-33.43-30.97v-2.66h15.46v2.18c0,10.4,5.83,17.42,18.44,17.42,10.11,0,14.87-5.44,14.87-11.73,0-7.38-6.19-9.8-17.13-12.22l-1.07-.24c-17.25-3.87-27.48-9.92-27.48-25.28s12.73-24.56,28.91-24.56c17.84,0,30.81,9.92,30.81,26.86z"/>' +
        '<polygon points="33.08 31.25 54.69 3 11.46 3 33.08 31.25" stroke="currentColor" stroke-miterlimit="10" stroke-width="6"/>' +
        '<line x1="33.08" y1="3" x2="33.08" y2="40.56" stroke="currentColor" stroke-miterlimit="10" stroke-width="6"/>' +
        '<line x1="33.13" y1="131.74" x2="33.13" y2="147.45" stroke="currentColor" stroke-miterlimit="10" stroke-width="6"/>' +
        '<line x1="9.57" y1="147.45" x2="56.58" y2="147.45" stroke="currentColor" stroke-miterlimit="10" stroke-width="6"/>' +
        '<line x1="13.25" y1="155.33" x2="50.51" y2="155.33" stroke="currentColor" stroke-miterlimit="10" stroke-width="6"/>' +
        '<line x1="18.44" y1="163.21" x2="45.32" y2="163.21" stroke="currentColor" stroke-miterlimit="10" stroke-width="6"/>' +
        '<line x1="22.06" y1="171.08" x2="41.7" y2="171.08" stroke="currentColor" stroke-miterlimit="10" stroke-width="6"/>' +
        '<line x1="26.5" y1="178.96" x2="37.26" y2="178.96" stroke="currentColor" stroke-miterlimit="10" stroke-width="6"/>' +
        '</svg>';

      nav.innerHTML =
        '<a href="' + d.brandHref + '" class="nav-brand" aria-label="SuffolkHam home">' +
          logoSvg + d.brand + '<span>' + d.brandSuffix + '</span>' +
        '</a>' +
        '<ul class="nav-links" id="nav-menu" role="list">' + items + '</ul>' +
        '<div class="nav-controls">' +
          '<button class="nav-search-btn" aria-label="Callsign search" title="Callsign search">' +
            searchIcon +
          '</button>' +
          '<button class="nav-theme-toggle" aria-label="' + (isDark ? 'Switch to light mode' : 'Switch to dark mode') + '">' +
            (isDark ? sunIcon : moonIcon) +
          '</button>' +
          '<button class="nav-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="nav-menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>';

      nav.querySelector('.nav-search-btn').addEventListener('click', openModal);

      var toggle   = nav.querySelector('.nav-toggle');
      var themeBtn = nav.querySelector('.nav-theme-toggle');
      var menu     = document.getElementById('nav-menu');

      themeBtn.addEventListener('click', function () {
        applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
      });

      function open() {
        nav.classList.add('nav-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Close navigation');
      }

      function close() {
        nav.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }

      toggle.addEventListener('click', function () {
        nav.classList.contains('nav-open') ? close() : open();
      });

      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', close);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
          close();
          toggle.focus();
        }
      });

      document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !modal.contains(e.target)) close();
      });

      /* ---- Footer injection ---- */
      var footerEl = document.querySelector('footer');
      if (footerEl && d.links) {
        var half = Math.ceil(d.links.length / 2);
        var col1 = d.links.slice(0, half);
        var col2 = d.links.slice(half);
        function navLink(l) {
          return '<a href="' + l.href + '">' + l.label + '</a>';
        }
        footerEl.innerHTML =
          '<div class="footer-inner">' +
            '<div>' +
              '<div class="footer-brand">SuffolkHam.co.uk</div>' +
              '<p class="footer-tagline">A beginner-friendly amateur radio resource for Suffolk and East Anglia.</p>' +
              '<p class="footer-meta">Site by <a href="https://www.qrz.com/db/M9XCN" target="_blank" rel="noopener">M9XCN</a> &nbsp;&middot;&nbsp; <a href="about">About</a></p>' +
            '</div>' +
            '<nav aria-label="Footer navigation" class="footer-nav">' +
              col1.map(navLink).join('') +
              col2.map(navLink).join('') +
            '</nav>' +
          '</div>';
      }

      injectBreadcrumbs();
    })
    .catch(function () {});
}());

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
