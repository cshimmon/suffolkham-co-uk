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
