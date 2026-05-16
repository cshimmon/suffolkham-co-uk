(function () {
  var STORAGE_KEY = 'suffolkham-theme';

  var moonIcon = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var sunIcon  = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

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

  var page = location.pathname.split('/').pop() || 'index.html';

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

      nav.innerHTML =
        '<a href="' + d.brandHref + '" class="nav-brand">' +
          d.brand + '<span>' + d.brandSuffix + '</span>' +
        '</a>' +
        '<ul class="nav-links" id="nav-menu" role="list">' + items + '</ul>' +
        '<div class="nav-controls">' +
          '<button class="nav-theme-toggle" aria-label="' + (isDark ? 'Switch to light mode' : 'Switch to dark mode') + '">' +
            (isDark ? sunIcon : moonIcon) +
          '</button>' +
          '<button class="nav-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="nav-menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>';

      var toggle     = nav.querySelector('.nav-toggle');
      var themeBtn   = nav.querySelector('.nav-theme-toggle');
      var menu       = document.getElementById('nav-menu');

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
        if (!nav.contains(e.target)) close();
      });
    })
    .catch(function () {});
}());
