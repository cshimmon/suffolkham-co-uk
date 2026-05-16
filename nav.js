(function () {
  var page = location.pathname.split('/').pop() || 'index.html';

  fetch('nav.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var nav = document.getElementById('site-nav');
      if (!nav) return;

      var items = d.links.map(function (link) {
        var cls = link.href === page ? ' class="active"' : '';
        return '<li><a href="' + link.href + '"' + cls + '>' + link.label + '</a></li>';
      }).join('');

      nav.innerHTML =
        '<a href="' + d.brandHref + '" class="nav-brand">' +
          d.brand + '<span>' + d.brandSuffix + '</span>' +
        '</a>' +
        '<button class="nav-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="nav-menu">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
        '<ul class="nav-links" id="nav-menu" role="list">' + items + '</ul>';

      var toggle = nav.querySelector('.nav-toggle');
      var menu   = document.getElementById('nav-menu');

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
