/* NelsonCorp dashboard navigation strip
 * ------------------------------------------------------------------
 * Drop this single line into any dashboard, just before </body>:
 *
 *   <script src="https://nelsoncorpwealth.github.io/Dashboards/nav.js" defer></script>
 *
 * It reads dashboards.json from the hub repo and renders a slim nav strip
 * directly under the page's .title-bar (or at the top of <body> if there
 * isn't one). The current page is highlighted automatically. Links are
 * never hard-coded in the dashboards themselves: edit dashboards.json in
 * the hub repo and every page picks the change up on its next load.
 *
 * The strip is added below the standard header, so the 72px header and
 * 59px title bar are untouched.
 *
 * The strip only renders when the page is served from the same host as the
 * hub (nelsoncorpwealth.github.io). A copy of a dashboard published anywhere
 * else, such as the Big Picture page on nelsoncorp.com, stays untouched even
 * though it carries the same script tag. Add data-force="true" to the script
 * tag to override that check (useful for local testing).
 */
(function () {
  'use strict';
  if (window.__ncNavLoaded) return;
  window.__ncNavLoaded = true;

  var script = document.currentScript;
  var base;
  try {
    base = new URL('.', (script && script.src) || window.location.href).href;
  } catch (e) { return; }

  var CSS = [
    '.nc-nav{background:#fff;border-bottom:1px solid #dde5d8;font-family:"Source Sans 3",-apple-system,"Segoe UI",sans-serif;line-height:normal;position:relative;z-index:5}',
    '.nc-nav-in{display:flex;align-items:stretch;padding:0 40px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}',
    '.nc-nav-in::-webkit-scrollbar{display:none}',
    '.nc-nav a{display:flex;align-items:center;gap:7px;padding:0 14px;height:38px;font-size:.76rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#3d5240;text-decoration:none;white-space:nowrap;border-bottom:3px solid transparent;transition:color .12s,border-color .12s}',
    '.nc-nav a:hover{color:#1b4332;border-bottom-color:#d8f3dc}',
    '.nc-nav a.nc-current{color:#1b4332;font-weight:700;border-bottom-color:#c9a84c}',
    '.nc-nav a.nc-home{padding-left:0;color:#2d6a4f;font-weight:600}',
    '.nc-nav a.nc-home svg{width:13px;height:13px;flex:none}',
    '.nc-nav .nc-sep{width:1px;background:#dde5d8;margin:10px 8px 10px 0;flex:none}',
    '@media(max-width:768px){.nc-nav-in{padding:0 18px}}',
    '@media(max-width:600px){.nc-nav a{font-size:.7rem;padding:0 10px;height:34px}}'
  ].join('\n');

  var GRID_SVG = '<svg viewBox="0 0 14 14" aria-hidden="true" fill="currentColor"><rect x="0" y="0" width="6" height="6" rx="1"/><rect x="8" y="0" width="6" height="6" rx="1"/><rect x="0" y="8" width="6" height="6" rx="1"/><rect x="8" y="8" width="6" height="6" rx="1"/></svg>';

  function norm(u) {
    try {
      var x = new URL(u, window.location.href);
      var p = x.pathname.replace(/index\.html?$/i, '').replace(/\/+$/, '');
      return (x.host + p).toLowerCase();
    } catch (e) { return ''; }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function mount(nav) {
    var titleBar = document.querySelector('.title-bar');
    if (titleBar) { titleBar.insertAdjacentElement('afterend', nav); return; }
    var hdr = document.querySelector('.hdr');
    if (hdr) { hdr.insertAdjacentElement('afterend', nav); return; }
    document.body.insertBefore(nav, document.body.firstChild);
  }

  function render(data) {
    var here = norm(window.location.href);
    var hub = data.hub || {};
    var force = script && script.getAttribute('data-force') === 'true';
    if (!force) {
      try {
        if (new URL(hub.url || base).host.toLowerCase() !== window.location.host.toLowerCase()) return;
      } catch (e) { return; }
    }
    var items = (data.dashboards || []).filter(function (d) { return d && d.url && !d.hidden; });
    if (!items.length) return;

    var html = '';
    if (hub.url) {
      html += '<a class="nc-home" href="' + esc(hub.url) + '">' + GRID_SVG + '<span>All Dashboards</span></a><span class="nc-sep"></span>';
    }
    html += items.map(function (d) {
      var cur = norm(d.url) === here;
      return '<a href="' + esc(d.url) + '"' + (cur ? ' class="nc-current" aria-current="page"' : '') + '>' + esc(d.short || d.name) + '</a>';
    }).join('');

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var nav = document.createElement('nav');
    nav.className = 'nc-nav';
    nav.setAttribute('aria-label', 'NelsonCorp dashboards');
    nav.innerHTML = '<div class="nc-nav-in">' + html + '</div>';
    mount(nav);
  }

  function go() {
    fetch(base + 'dashboards.json?v=' + Math.floor(Date.now() / 3600000), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(render)
      .catch(function () { /* stay silent: the dashboard works without the strip */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
})();
