/* Tiny chart helpers (pure SVG/HTML, theme-aware via CSS vars) */
window.GLC = {
  spark(values, color) {
    const w = 96, h = 36, p = 3, mx = Math.max(...values), mn = Math.min(...values);
    const pts = values.map((v, i) => [p + i * (w - 2 * p) / (values.length - 1), h - p - (v - mn) / ((mx - mn) || 1) * (h - 2 * p)]);
    const line = pts.map(q => q.map(n => n.toFixed(1)).join(',')).join(' ');
    const id = 'g' + Math.random().toString(36).slice(2, 8);
    return `<svg class="spark flip" viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <polygon points="${p},${h} ${line} ${w - p},${h}" fill="url(#${id})"/>
      <polyline points="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="3" fill="var(--gl-bg-surface)" stroke="${color}" stroke-width="2"/></svg>`;
  },
  donut(parts, size, stroke) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, gap = 3;
    const total = parts.reduce((a, b) => a + b.v, 0);
    let off = 0;
    const segs = parts.map(pt => {
      const len = pt.v / total * c;
      const s = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${pt.color}" stroke-width="${stroke}"
        stroke-dasharray="${Math.max(len - gap, 0)} ${c}" stroke-dashoffset="${-off}" stroke-linecap="butt"/>`;
      off += len; return s;
    }).join('');
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg)">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--gl-bg-subtle)" stroke-width="${stroke}"/>${segs}</svg>`;
  }
};
