/* Data freshness badge: 'Data last updated: <latest MI sample>; refreshed <date>; source live/snapshot'. */
(function () {
  var m = (window.PA && PA.meta) || {}, f = m.fetch || {}, b = m.data_badge || {};
  var latest = b.latest_sample || f.latest_sample || m.data_last_sample;
  if (!latest) return;
  var refreshed = b.refreshed || (f.fetched_at || m.built_at || '').slice(0, 10);
  var src = b.source || (f.phyto_fetch_error ? 'snapshot' : 'live');
  var stale = !!(b.stale_input || f.stale_input);
  var el = document.createElement('div');
  el.className = 'databadge' + (stale ? ' stale' : '');
  el.setAttribute('role', 'status');
  el.title = stale ? 'MI feed late or failed QA: showing the last good outlook' :
    (src === 'live' ? 'Fetched live from Marine Institute ERDDAP' : 'MI ERDDAP unavailable at refresh; on-disk snapshot used');
  el.textContent = 'Data last updated: ' + latest + '; refreshed ' + refreshed + '; source ' + src +
    (stale ? ' · STALE INPUT (last good outlook kept)' : '');
  var s = document.createElement('style');
  s.textContent = '.databadge{position:fixed;right:10px;bottom:26px;z-index:9999;max-width:calc(100vw - 20px);' +
    'font:500 11px/1.3 system-ui,sans-serif;color:#334155;background:rgba(255,255,255,.92);border:1px solid #cbd5e1;' +
    'border-radius:999px;padding:3px 10px;box-shadow:0 1px 3px rgba(0,0,0,.12);pointer-events:auto}' +
    '.databadge.stale{color:#7c2d12;background:#fff7ed;border-color:#fdba74}' +
    '@media(max-width:600px){.databadge{font-size:10px;right:6px;left:6px;text-align:center}}';
  document.head.appendChild(s);
  document.body.appendChild(el);
})();
