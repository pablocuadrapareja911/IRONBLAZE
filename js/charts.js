// ============ Gráficas SVG ligeras (barras y líneas) con tooltip ============
window.Charts = (function () {
  const W = 340, H = 170, PAD = { l: 38, r: 10, t: 14, b: 26 };

  function niceMax(v) {
    if (v <= 0) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const n = v / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
  }
  const fmt = v => v >= 10000 ? (v / 1000).toFixed(0) + 'k' : v >= 1000 ? (v / 1000).toFixed(1).replace('.0', '') + 'k' : Math.round(v * 10) / 10;

  // Escala con marcas redondas: devuelve {max, n}
  function scale(v) {
    const step = niceMax(Math.max(v, 1e-9) / 3);
    const n = Math.max(1, Math.ceil(v / step));
    return { max: step * n, n };
  }
  function grid(sc) {
    let g = '';
    for (let i = 0; i <= sc.n; i++) {
      const y = PAD.t + (H - PAD.t - PAD.b) * (1 - i / sc.n);
      g += `<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${y}" y2="${y}" class="ch-grid"/>`;
      g += `<text x="${PAD.l - 6}" y="${y + 3}" class="ch-axis" text-anchor="end">${fmt(sc.max * i / sc.n)}</text>`;
    }
    return g;
  }

  // data: [{label, value, tip, full, hi}]
  function bar(el, data, opts = {}) {
    const sc = scale(Math.max(...data.map(d => d.value), 0) || 1), max = sc.max;
    const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
    const slot = iw / data.length, bw = Math.min(22, slot * 0.62);
    let svg = `<svg viewBox="0 0 ${W} ${H}" class="chart">` + grid(sc);
    data.forEach((d, i) => {
      const x = PAD.l + slot * i + (slot - bw) / 2;
      const h = d.value > 0 ? Math.max(3, ih * d.value / max) : 0;
      const y = PAD.t + ih - h, r = Math.min(4, bw / 2, h);
      if (h > 0) svg += `<path class="ch-bar${d.hi ? ' hi' : ''}" d="M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${y + h} Z"/>`;
      if (i % 2 === (data.length - 1) % 2) svg += `<text x="${x + bw / 2}" y="${H - 8}" class="ch-axis" text-anchor="middle">${d.label}</text>`;
    });
    svg += `<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${PAD.t + ih}" y2="${PAD.t + ih}" class="ch-base"/>`;
    data.forEach((d, i) => svg += `<rect class="ch-hit" x="${PAD.l + slot * i}" y="${PAD.t}" width="${slot}" height="${ih}" data-i="${i}"/>`);
    svg += `</svg><div class="ch-tip hidden"></div>`;
    el.innerHTML = svg;
    hover(el, data, opts);
  }

  function line(el, data, opts = {}) {
    if (!data.length) { el.innerHTML = `<div class="empty-chart">Aún no hay datos</div>`; return; }
    const vals = data.map(d => d.value);
    let lo = Math.min(...vals), hi = Math.max(...vals);
    const span = hi - lo || hi * 0.2 || 1;
    const step = niceMax(span * 1.4 / 3);
    lo = Math.max(0, Math.floor((lo - span * 0.2) / step) * step); hi = Math.ceil((hi + span * 0.2) / step) * step;
    const nT = Math.round((hi - lo) / step);
    const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
    const X = i => PAD.l + (data.length === 1 ? iw / 2 : iw * i / (data.length - 1));
    const Y = v => PAD.t + ih * (1 - (v - lo) / (hi - lo));
    let svg = `<svg viewBox="0 0 ${W} ${H}" class="chart">`;
    for (let i = 0; i <= nT; i++) {
      const v = lo + step * i, y = Y(v);
      svg += `<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${y}" y2="${y}" class="ch-grid"/><text x="${PAD.l - 6}" y="${y + 3}" class="ch-axis" text-anchor="end">${fmt(v)}</text>`;
    }
    const pts = data.map((d, i) => `${X(i)},${Y(d.value)}`).join(' ');
    svg += `<polygon class="ch-area" points="${X(0)},${PAD.t + ih} ${pts} ${X(data.length - 1)},${PAD.t + ih}"/>`;
    svg += `<polyline class="ch-line" points="${pts}"/>`;
    data.forEach((d, i) => { if (data.length <= 20 || i === data.length - 1) svg += `<circle class="ch-dot" cx="${X(i)}" cy="${Y(d.value)}" r="${i === data.length - 1 ? 5 : 3.5}"/>`; });
    const every = Math.ceil(data.length / 5);
    data.forEach((d, i) => { if ((data.length - 1 - i) % every === 0) svg += `<text x="${X(i)}" y="${H - 8}" class="ch-axis" text-anchor="middle">${d.label}</text>`; });
    svg += `<line class="ch-cross hidden" x1="0" x2="0" y1="${PAD.t}" y2="${PAD.t + ih}"/>`;
    const slot = data.length > 1 ? iw / (data.length - 1) : iw;
    data.forEach((d, i) => svg += `<rect class="ch-hit" x="${X(i) - slot / 2}" y="${PAD.t}" width="${slot}" height="${ih}" data-i="${i}" data-x="${X(i)}"/>`);
    svg += `</svg><div class="ch-tip hidden"></div>`;
    el.innerHTML = svg;
    hover(el, data, opts);
  }

  function hover(el, data, opts) {
    const tip = el.querySelector('.ch-tip'), cross = el.querySelector('.ch-cross');
    el.querySelectorAll('.ch-hit').forEach(r => {
      const show = () => {
        const d = data[+r.dataset.i];
        tip.innerHTML = `<b>${d.tip || (opts.format ? opts.format(d.value) : fmt(d.value))}</b><span>${d.full || d.label}</span>`;
        tip.classList.remove('hidden');
        const box = el.getBoundingClientRect(), rb = r.getBoundingClientRect();
        let left = rb.left - box.left + rb.width / 2;
        left = Math.max(60, Math.min(box.width - 60, left));
        tip.style.left = left + 'px';
        if (cross) { cross.setAttribute('x1', r.dataset.x); cross.setAttribute('x2', r.dataset.x); cross.classList.remove('hidden'); }
      };
      r.addEventListener('mouseenter', show);
      r.addEventListener('touchstart', show, { passive: true });
      r.addEventListener('mouseleave', () => { tip.classList.add('hidden'); cross && cross.classList.add('hidden'); });
    });
  }

  return { bar, line };
})();
