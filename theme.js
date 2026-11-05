/* Hell / Dunkel / Automatisch – wird im <head> geladen, damit nichts aufblitzt. */
(function () {
  var KEY = 'theme', root = document.documentElement;
  var modes = ['auto', 'light', 'dark'];
  var info = {
    auto:  { ico: '🌓', txt: 'Auto',   next: 'Hell' },
    light: { ico: '☀️', txt: 'Hell',   next: 'Dunkel' },
    dark:  { ico: '🌙', txt: 'Dunkel', next: 'Automatisch' }
  };
  function get() { try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; } }
  function apply(m) {
    if (m === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', m);
  }
  var mode = get(); if (modes.indexOf(mode) < 0) mode = 'auto';
  apply(mode);

  document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('button');
    b.className = 'theme-toggle'; b.type = 'button';
    function render() {
      var i = info[mode];
      b.innerHTML = '<span class="ico" aria-hidden="true">' + i.ico + '</span>' + i.txt;
      b.title = 'Darstellung: ' + i.txt + ' – tippen für ' + i.next;
      b.setAttribute('aria-label', b.title);
    }
    b.addEventListener('click', function () {
      mode = modes[(modes.indexOf(mode) + 1) % modes.length];
      apply(mode);
      try { localStorage.setItem(KEY, mode); } catch (e) {}
      render();
    });
    render();
    document.body.appendChild(b);
  });
})();
