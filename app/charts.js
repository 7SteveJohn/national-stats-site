// STATLAS 图表库：全部图表都是手写内联 SVG，不引任何库。
// 导出四个函数：barChart（柱状）、lineChart（折线）、donutChart（环形）、
// hbarChart（横向条形）。每个函数返回一段 SVG 字符串，由 views.js 拼进页面。

export const PALETTE = ['#1f5fa8', '#2e86c1', '#c8102e', '#3a7d5d', '#d9a441', '#6a5acd', '#8a6d3b'];

// 转义一段要放进 SVG 文本里的字符串。
export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 柱状图：items 是 {label, value}，height 是 SVG 高度（px）。
export function barChart(items, { height = 260, color = '#1f5fa8', unit = '', valueFmt = null } = {}) {
  const width = 640;
  const padL = 46, padB = 30, padT = 14;
  const max = Math.max(...items.map((d) => d.value), 1);
  const bw = (width - padL - 20) / items.length;
  const barW = Math.min(44, bw * 0.62);
  const fmt = valueFmt || ((v) => String(v));
  let bars = '';
  let labels = '';
  items.forEach((d, i) => {
    const h = ((height - padT - padB) * d.value) / max;
    const x = padL + i * bw + (bw - barW) / 2;
    const y = height - padB - h;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${color}"><title>${esc(d.label)}：${esc(fmt(d.value))}${unit}</title></rect>`;
    bars += `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="12" fill="#12395e" font-weight="600">${esc(fmt(d.value))}</text>`;
    labels += `<text x="${(padL + i * bw + bw / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#44536a">${esc(d.label)}</text>`;
  });
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const y = height - padB - (height - padT - padB) * f;
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${width - 20}" y2="${y.toFixed(1)}" stroke="#e3ddd0" stroke-width="1"/><text x="${padL - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#7a8699">${Math.round(max * f).toLocaleString('en-US')}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="柱状图">${grid}${bars}${labels}</svg>`;
}

// 折线图：points 是 {x, y}，x 为横轴标签，y 为数值。
export function lineChart(points, { height = 260, color = '#c8102e', unit = '', yFmt = null } = {}) {
  const width = 640;
  const padL = 52, padB = 30, padT = 16, padR = 16;
  const ys = points.map((p) => p.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const lo = min - span * 0.15;
  const hi = max + span * 0.15;
  const X = (i) => padL + (i * (width - padL - padR)) / (points.length - 1);
  const Y = (v) => padT + ((hi - v) / (hi - lo)) * (height - padT - padB);
  const fmt = yFmt || ((v) => String(v));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');
  const area = `${path} L${X(points.length - 1).toFixed(1)},${Y(lo).toFixed(1)} L${X(0).toFixed(1)},${Y(lo).toFixed(1)} Z`;
  const dots = points.map((p, i) =>
    `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="4" fill="#ffffff" stroke="${color}" stroke-width="2.5"><title>${esc(p.x)}：${esc(fmt(p.y))}${unit}</title></circle>` +
    `<text x="${X(i).toFixed(1)}" y="${(Y(p.y) - 10).toFixed(1)}" text-anchor="middle" font-size="12" fill="#12395e" font-weight="600">${esc(fmt(p.y))}</text>` +
    `<text x="${X(i).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#44536a">${esc(p.x)}</text>`
  ).join('');
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const v = lo + (hi - lo) * f;
    const y = Y(v);
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${width - padR}" y2="${y.toFixed(1)}" stroke="#e3ddd0" stroke-width="1"/><text x="${padL - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#7a8699">${fmt(Math.round(v))}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="折线图">${grid}<path d="${area}" fill="${color}" opacity="0.08"/><path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg>`;
}

// 环形图：items 是 {name, share}，share 为百分比。
export function donutChart(items, { size = 260, thickness = 46 } = {}) {
  const cx = size / 2, cy = size / 2;
  const r = (size - thickness) / 2 - 4;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  let arcs = '';
  items.forEach((d, i) => {
    const len = (d.share / 100) * circ;
    const gap = 2;
    arcs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="${thickness}" stroke-dasharray="${Math.max(len - gap, 1).toFixed(1)} ${(circ - len + gap).toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"><title>${esc(d.name)}：${d.share}%</title></circle>`;
    offset += len;
  });
  const total = items.reduce((a, d) => a + d.share, 0);
  const legend = items.map((d, i) =>
    `<div class="legend-row"><span class="legend-swatch" style="background:${PALETTE[i % PALETTE.length]}"></span><span>${esc(d.name)}</span><strong>${d.share}%</strong></div>`
  ).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="环形图">${arcs}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="26" font-weight="700" fill="#12395e">${total.toFixed(1).replace(/\.0$/, '')}%</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="#44536a">合计</text></svg><div class="donut-legend">${legend}</div></div>`;
}

// 横向条形图：items 是 {label, value, display}，按 value 降序画。
export function hbarChart(items, { height = 300, color = '#1f5fa8', unit = '' } = {}) {
  const width = 640;
  const padL = 120, padR = 90;
  const rowH = (height - 16) / items.length;
  const barH = Math.min(22, rowH * 0.55);
  const max = Math.max(...items.map((d) => d.value), 1);
  let rows = '';
  items.forEach((d, i) => {
    const y = 8 + i * rowH + (rowH - barH) / 2;
    const w = ((width - padL - padR) * d.value) / max;
    rows += `<text x="${padL - 8}" y="${(y + barH / 2 + 4).toFixed(1)}" text-anchor="end" font-size="13" fill="#22344d">${esc(d.label)}</text>`;
    rows += `<rect x="${padL}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${barH}" rx="3" fill="${color}"><title>${esc(d.label)}：${esc(d.display || d.value)}${unit}</title></rect>`;
    rows += `<text x="${(padL + w + 8).toFixed(1)}" y="${(y + barH / 2 + 4).toFixed(1)}" font-size="13" fill="#12395e" font-weight="600">${esc(d.display || d.value)}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="横向条形图">${rows}</svg>`;
}

// 方块地图：31 个省（区、市）按大致地理方位排成的格子图，颜色深浅表示 GDP 高低。
// 每个格子可点击，点后在下方显示该省详情（views.js 的 showProvince）。
export function tileMap(provinces) {
  const cols = 9, rows = 7;
  const cell = 64, gap = 6;
  const width = cols * cell + (cols - 1) * gap;
  const height = rows * cell + (rows - 1) * gap;
  const max = Math.max(...provinces.map((p) => p.gdp));
  const colorFor = (v) => {
    const t = v / max;
    if (t >= 0.6) return '#12395e';
    if (t >= 0.3) return '#1f5fa8';
    if (t >= 0.12) return '#5b9bd5';
    if (t >= 0.04) return '#9dc3e6';
    return '#d6e4f0';
  };
  const tiles = provinces.map((p) => {
    const [c, r] = p.tile;
    const x = (c - 1) * (cell + gap);
    const y = (r - 1) * (cell + gap);
    const fill = colorFor(p.gdp);
    const dark = fill === '#12395e' || fill === '#1f5fa8';
    return `<g class="tile" data-province="${esc(p.name)}" tabindex="0" role="button" aria-label="${esc(p.name)} GDP ${p.gdp.toLocaleString('en-US')} 亿元"><rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="6" fill="${fill}"/><text x="${x + cell / 2}" y="${y + 24}" text-anchor="middle" font-size="14" font-weight="700" fill="${dark ? '#ffffff' : '#12395e'}">${esc(p.name)}</text><text x="${x + cell / 2}" y="${y + 44}" text-anchor="middle" font-size="11" fill="${dark ? '#dbe7f3' : '#44536a'}">${(p.gdp / 10000).toFixed(2)}万亿</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="group" aria-label="各省 GDP 方块地图">${tiles}</svg>`;
}
