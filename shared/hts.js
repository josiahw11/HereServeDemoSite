/* Here To Serve, LLC — shared content + coverage search used by every design.
   Edit the data here once and all six sites update. */
(function () {
  const T = (name, zip, lat, lon) => ({ name, zip, lat, lon });
  const ico = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  const HTS = {
    biz: {
      name: 'Here To Serve, LLC',
      tagline: 'Experienced, Dependable, Prompt',
      phone: '(607) 434-2052',
      tel: 'tel:607-434-2052',
      email: 'info@hereserve.com',
      address: '7 Valleyview Street, Oneonta NY 13820',
      reviews: 'https://www.google.com/search?q=Here+To+Serve,+LLC+Reviews',
      paypal: 'https://www.paypal.com/paypalme/hereserve',
      venmo: 'https://account.venmo.com/u/hereserve'
    },
    services: [
      { t: 'Process Service', d: 'Routine, rush, and same-day when available.', icon: ico('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>') },
      { t: 'Document Retrieval', d: 'Pickup and delivery of court and agency documents.', icon: ico('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 10v6m-3-3 3 3 3-3"/>') },
      { t: 'Court Filings', d: 'File submissions at local courts as needed.', icon: ico('<path d="M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2 10l10-7 10 7z"/>') },
      { t: 'Court Record Searches', d: 'Locate and retrieve case records where accessible.', icon: ico('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>') },
      { t: 'Posting Notices of Sale', d: 'Posting per instruction and proof with photo.', icon: ico('<path d="M9 3h6l-1 6 4 4H6l4-4z"/><path d="M12 13v8"/>') },
      { t: 'Occupancy Inspections', d: 'Basic occupancy checks with GPS-stamped photos.', icon: ico('<path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>') }
    ],
    /* lat/lon are approximate and only used for the stylised map. */
    counties: [
      { name: 'Otsego County', towns: [
        T('Colliersville', '13747', 42.490, -74.982), T('Cooperstown', '13326', 42.700, -74.924),
        T('Edmeston', '13335', 42.698, -75.244), T('Fly Creek', '13337', 42.717, -74.985),
        T('Garrattsville', '13342', 42.640, -75.190), T('Gilbertsville', '13776', 42.469, -75.322),
        T('Hartwick', '13348', 42.660, -75.050), T('Laurens', '13796', 42.531, -75.089),
        T('Maryland', '12116', 42.536, -74.890), T('Milford', '13807', 42.590, -74.946),
        T('Morris', '13808', 42.548, -75.245), T('Mount Vision', '13810', 42.580, -75.060),
        T('New Berlin', '13411', 42.624, -75.332), T('Oneonta', '13820', 42.453, -75.064),
        T('Otego', '13825', 42.397, -75.173), T('Portlandville', '13834', 42.530, -74.970),
        T('South New Berlin', '13843', 42.530, -75.385), T('Unadilla', '13849', 42.325, -75.312),
        T('Wells Bridge', '13859', 42.366, -75.245), T('West Laurens', '13796', 42.520, -75.140),
        T('West Oneonta', '13861', 42.470, -75.110)
      ] },
      { name: 'Delaware County', towns: [
        T('Davenport Center', '13751', 42.450, -74.910), T('Franklin', '13775', 42.340, -75.166),
        T('Sidney', '13838', 42.315, -75.392), T('West Davenport', '13860', 42.445, -74.960)
      ] },
      { name: 'Chenango County', towns: [
        T('Bainbridge', '13733', 42.293, -75.479), T('New Berlin', '13411', 42.624, -75.332),
        T('South New Berlin', '13843', 42.530, -75.385)
      ] }
    ],
    designs: [
      { slug: 'docket', name: 'The Docket' },
      { slug: 'deco', name: 'Courthouse Deco' },
      { slug: 'field-unit', name: 'Field Unit' },
      { slug: 'hill-country', name: 'Hill Country' },
      { slug: 'grotesk', name: 'Grotesk' },
      { slug: 'aurora', name: 'Aurora' }
    ]
  };

  HTS.towns = [];
  HTS.counties.forEach((c) => c.towns.forEach((t, i) => HTS.towns.push(Object.assign({ county: c.name, key: c.name + '|' + t.name }, t))));

  const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const lev = (a, b) => {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  };

  /* The one coverage search every design uses: town, county, or ZIP. */
  HTS.search = function (query) {
    const q = norm(query).replace(/ ?\b(ny|new york)$/, '').trim() || norm(query);
    if (!q) return { q: '', idle: true, hits: [] };
    const isZip = /^\d+$/.test(q);
    const qc = q.replace(/ ?\b(county|co)$/, '').trim();
    const countyHit = !isZip && HTS.counties.find((c) => qc.length >= 3 && norm(c.name).replace(' county', '').startsWith(qc));
    const hits = HTS.towns.filter((t) => isZip ? t.zip.startsWith(q) : (norm(t.name).includes(q) || (countyHit && t.county === countyHit.name)));
    let suggest = null;
    if (!hits.length && !isZip && q.length >= 3) {
      let best = 3;
      HTS.counties.map((c) => c.name).concat(HTS.towns.map((t) => t.name)).forEach((n) => {
        const d = lev(qc || q, norm(n).replace(' county', '')); if (d < best) { best = d; suggest = n; } });
    }
    const places = [...new Set(hits.map((t) => t.name))];
    const r = { q, raw: String(query).trim(), isZip, hits, suggest, covered: hits.length > 0, county: countyHit ? countyHit.name : null };
    if (!r.covered) {
      r.title = `“${r.raw}” isn’t on my coverage list`;
      r.detail = (suggest ? `Did you mean ${suggest}? ` : '') + `Call ${HTS.biz.phone} to ask about your location.`;
    } else if (countyHit && hits.every((t) => t.county === countyHit.name) && !places.some((p) => norm(p) === q)) {
      r.title = `Yes — I serve ${countyHit.name}`;
      r.detail = `${hits.length} communities covered: ${places.join(', ')}.`;
    } else if (places.length === 1) {
      const t = hits[0], cs = [...new Set(hits.map((h) => h.county))].join(' & ');
      r.title = `Yes — ${t.name}, NY ${t.zip} is covered`;
      r.detail = `${cs}. Call ${HTS.biz.phone} to request service.`;
    } else {
      r.title = `Yes — ${places.length} covered areas match${isZip ? ' ZIP ' + r.raw : ''}`;
      r.detail = places.join(', ') + '.';
    }
    return r;
  };

  HTS.project = function (t) { /* → {x,y} in 0..1 for the stylised map */
    const b = { n: 42.75, s: 42.26, w: -75.52, e: -74.85 };
    return { x: (t.lon - b.w) / (b.e - b.w), y: (b.n - t.lat) / (b.n - b.s) };
  };

  /* Wires an input + result + list. Each design styles the .cv-* classes its own way. */
  HTS.mountCoverage = function (o) {
    const $ = (s) => (typeof s === 'string' ? document.querySelector(s) : s);
    const form = $(o.form), input = $(o.input), result = $(o.result), list = $(o.list);
    const idleText = o.idle || 'Enter a town, county, or ZIP code to check coverage.';
    if (list) {
      list.innerHTML = HTS.counties.map((c) => `
        <section class="cv-county" data-county="${c.name}">
          <h3 class="cv-county-name">${c.name} <span class="cv-count">${c.towns.length}</span></h3>
          <ul class="cv-towns">${c.towns.map((t) => `<li><button type="button" class="cv-town" data-key="${c.name}|${t.name}" data-name="${t.name}"><span class="cv-name">${t.name}</span><span class="cv-zip">${t.zip}</span></button></li>`).join('')}</ul>
        </section>`).join('');
      list.addEventListener('click', (e) => {
        const b = e.target.closest('.cv-town'); if (!b) return;
        input.value = b.dataset.name; run(true);
      });
    }
    result.setAttribute('aria-live', 'polite');
    function run(submitted) {
      const r = HTS.search(input.value);
      const keys = new Set(r.hits.map((h) => h.key));
      if (list) {
        list.querySelectorAll('.cv-town').forEach((b) => {
          b.classList.toggle('is-hit', !r.idle && keys.has(b.dataset.key));
          b.classList.toggle('is-dim', !r.idle && !keys.has(b.dataset.key));
        });
        list.querySelectorAll('.cv-county').forEach((s) => s.classList.toggle('is-empty', !r.idle && !s.querySelector('.is-hit')));
      }
      result.className = result.className.replace(/\bis-(yes|no|idle)\b/g, '').trim() + ' ' + (r.idle ? 'is-idle' : r.covered ? 'is-yes' : 'is-no');
      result.innerHTML = '<span class="cv-badge"></span><strong class="cv-title"></strong><span class="cv-detail"></span>';
      result.children[0].textContent = r.idle ? '' : r.covered ? 'Covered' : 'Not listed';
      result.children[1].textContent = r.idle ? idleText : r.title;
      result.children[2].textContent = r.idle ? '' : r.detail;
      if (o.onResult) o.onResult(r, !!submitted);
      return r;
    }
    input.addEventListener('input', () => run(false));
    form.addEventListener('submit', (e) => { e.preventDefault(); run(true); });
    run(false);
    return { run };
  };

  HTS.renderServices = function (sel, tpl) {
    document.querySelector(sel).innerHTML = HTS.services.map((s, i) => tpl(s, i, String(i + 1).padStart(2, '0'))).join('');
  };

  /* ---------- small shared behaviours ---------- */
  const framed = window.self !== window.top;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  if (framed) document.documentElement.classList.add('in-frame');

  const base = document.createElement('style');
  base.textContent = `
    .cv-towns{list-style:none;margin:0;padding:0}
    .cv-town{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:left;width:100%}
    .js [data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1);transition-delay:var(--d,0s)}
    .js [data-reveal].in{opacity:1;transform:none}
    @media (prefers-reduced-motion:reduce){.js [data-reveal]{opacity:1;transform:none;transition:none}}
    .hts-dock{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:2px;padding:4px;border-radius:999px;background:rgba(15,15,20,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 30px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.12);font:500 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.02em;white-space:nowrap}
    .hts-dock a{color:#fff;text-decoration:none;padding:9px 13px;border-radius:999px;opacity:.75}
    .hts-dock a:hover,.hts-dock a:focus-visible{opacity:1;background:rgba(255,255,255,.14)}
    .hts-dock b{color:#fff;font-weight:600;padding:9px 12px;border-inline:1px solid rgba(255,255,255,.15)}
    @media (max-width:520px){.hts-dock b{display:none}}
    @media print{.hts-dock{display:none}}`;
  document.head.prepend(base);

  function init() {
    const els = document.querySelectorAll('[data-reveal]');
    if (framed || reduce || !('IntersectionObserver' in window)) els.forEach((e) => e.classList.add('in'));
    else {
      const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      els.forEach((e) => io.observe(e));
    }
    /* count-up numerals: <span data-count="60" data-suffix="k+"> */
    document.querySelectorAll('[data-count]').forEach((el) => {
      const end = +el.dataset.count, suf = el.dataset.suffix || '';
      el.textContent = end + suf;
      if (framed || reduce || !('IntersectionObserver' in window)) return;
      el.textContent = '0' + suf;
      const io = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return; io.disconnect();
        const t0 = performance.now(), dur = 1500;
        (function tick(now) {
          const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(end * e) + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }, { threshold: 0.5 });
      io.observe(el);
    });
    /* demo switcher */
    const m = location.pathname.replace(/\\/g, '/').match(/sites\/([^/]+)\//);
    if (m && !framed) {
      const i = HTS.designs.findIndex((d) => d.slug === m[1]); if (i < 0) return;
      const n = HTS.designs.length, prev = HTS.designs[(i + n - 1) % n], next = HTS.designs[(i + 1) % n];
      const dock = document.createElement('nav');
      dock.className = 'hts-dock'; dock.setAttribute('aria-label', 'Design demo switcher');
      dock.innerHTML = `<a href="../${prev.slug}/index.html" title="${prev.name}">← Prev</a><a href="../../index.html">All designs</a><b>${i + 1}/${n} · ${HTS.designs[i].name}</b><a href="../${next.slug}/index.html" title="${next.name}">Next →</a>`;
      document.body.appendChild(dock);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.HTS = HTS;
})();
