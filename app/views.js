// STATLAS 视图层：六个栏目（总览 / 人口 / 经济 / 贸易 / 能源 / 民生）与
// 搜索、关于页的渲染函数。每个函数返回一段 HTML，由 main.js 按 hash 路由
// 拼进 #view。所有数字都来自 data.js，来源与年份写在每块内容下方。

import {
  SOURCES, HEADLINE, GDP_SERIES, INDUSTRY_2024, QUARTER_GROWTH_2024,
  PROVINCES_2024, POP_SERIES, AGE_2024, TRADE_SERIES, PARTNERS_2024,
  TRADE_FACTS_2024, ENERGY_MIX_2024, CAPACITY_2024, POWER_SERIES,
  INCOME_SERIES, GRAIN_SERIES, INDICATOR_INDEX,
} from './data.js';
import { barChart, lineChart, donutChart, hbarChart, tileMap, esc } from './charts.js';

// 每块内容下方统一的来源行。
export function sourceNote(text) {
  return `<p class="source-note">来源：${esc(text)}</p>`;
}

// 栏目头：标题 + 一句话说明。
export function sectionHead(title, intro) {
  return `<div class="section-head"><h2>${esc(title)}</h2><p>${esc(intro)}</p></div>`;
}

// 大数字卡片行：year 取 2024 或 2023。
export function kpiCards(year) {
  const cards = HEADLINE[year].map((k) => `
    <article class="kpi-card">
      <div class="kpi-label">${esc(k.label)}</div>
      <div class="kpi-value">${esc(k.value)}<span class="kpi-unit">${esc(k.unit)}</span></div>
      <div class="kpi-change">${esc(k.change)}</div>
      <div class="kpi-note">${esc(k.note)}</div>
      <div class="kpi-source">${esc(k.source)}</div>
    </article>`).join('');
  return `<div class="kpi-grid">${cards}</div>`;
}

// 图表卡片外壳。
export function chartCard(title, body, note) {
  return `<section class="chart-card"><h3>${esc(title)}</h3><div class="chart-body">${body}</div>${note ? `<p class="chart-note">${esc(note)}</p>` : ''}</section>`;
}

// 省份详情面板：点方块地图的格子后由 main.js 填进 #province-detail。
export function provinceDetail(p) {
  if (!p) return '<p class="muted">点上面的格子，查看该省（区、市）的 GDP 与增速。</p>';
  const rank = [...PROVINCES_2024].sort((a, b) => b.gdp - a.gdp).findIndex((x) => x.name === p.name) + 1;
  return `<p><strong>${esc(p.name)}</strong>　2024 年地区生产总值 <strong>${p.gdp.toLocaleString('en-US')} 亿元</strong>，全国第 ${rank} 位，同比增长 ${p.growth}%。${esc(SOURCES.prov2024)}</p>`;
}

// ---------- 总览 ----------
export function renderOverview(state) {
  const gdpLine = lineChart(GDP_SERIES.map((d) => ({ x: String(d.year), y: d.gdp })), {
    color: '#1f5fa8', unit: ' 万亿元',
    yFmt: (v) => v.toFixed(0),
  });
  const industryDonut = donutChart(INDUSTRY_2024.map((d) => ({ name: d.name, share: d.share })));
  const topProvinces = [...PROVINCES_2024].sort((a, b) => b.gdp - a.gdp).slice(0, 5);
  return `
  ${sectionHead('总览 · 中国 2024', '一站式国家统计门户：关键指标、十年走势、三产结构与各省经济，一页看全。每个数字都标明来源与年份。')}
  ${kpiCards(state.year)}
  <div class="chart-grid-2">
    ${chartCard('国内生产总值 2015–2024（万亿元）', gdpLine, '2024 年 GDP 134.91 万亿元，比上年增长 5.0%。2023 年数经第五次全国经济普查修订为 129.43 万亿元，图中为当年公报数。')}
    ${chartCard('三次产业结构 2024（占 GDP 比重）', industryDonut, '第一产业 9.14 万亿元（+3.5%）；第二产业 49.21 万亿元（+5.3%）；第三产业 76.56 万亿元（+5.0%）。')}
  </div>
  <section class="chart-card">
    <h3>各省（区、市）GDP 方块地图 · 2024 年</h3>
    <p class="chart-note">格子按大致地理方位排列，颜色越深 GDP 越高；点格子看详情。广东 14.16 万亿元、江苏 13.70 万亿元分列前两位。</p>
    <div class="map-wrap">${tileMap(PROVINCES_2024)}</div>
    <div id="province-detail" class="province-detail">${provinceDetail(null)}</div>
    ${sourceNote(SOURCES.prov2024 + '；全国数见' + SOURCES.nbs2024)}
  </section>
  <section class="chart-card">
    <h3>国际对照 · 世界银行</h3>
    <div class="fact-list">
      <div class="fact"><strong>约 18.8 万亿美元</strong><span>GDP（现价美元），2024 年，世界银行 WDI；约合 134.91 万亿元人民币</span></div>
      <div class="fact"><strong>约 13,300 美元</strong><span>人均 GDP（现价美元），2024 年；人民币口径 95,749 元</span></div>
      <div class="fact"><strong>全球第二</strong><span>经济总量居世界第二，约占世界经济总量的 17%</span></div>
      <div class="fact"><strong>约 30%</strong><span>对世界经济增长的贡献率，2024 年</span></div>
    </div>
    ${sourceNote(SOURCES.wb + '；人民币数见' + SOURCES.nbs2024)}
  </section>
  <section class="chart-card">
    <h3>经济大省前五 · 2024 年</h3>
    ${hbarChart(topProvinces.map((p) => ({ label: p.name, value: p.gdp, display: (p.gdp / 10000).toFixed(2) + ' 万亿' })), { height: 200, unit: ' 亿元' })}
    ${sourceNote(SOURCES.prov2024)}
  </section>`;
}

// ---------- 人口 ----------
export function renderPopulation(state) {
  const popLine = lineChart(POP_SERIES.map((d) => ({ x: String(d.year), y: d.pop })), {
    color: '#1f5fa8', unit: ' 亿人', yFmt: (v) => v.toFixed(2),
  });
  const birthBars = barChart(POP_SERIES.map((d) => ({ label: String(d.year), value: d.births })), {
    color: '#2e86c1', valueFmt: (v) => String(v),
  });
  const ageDonut = donutChart(AGE_2024.map((d) => ({ name: d.name, share: d.share })));
  return `
  ${sectionHead('人口', '2024 年末全国人口 14.0828 亿人，比上年末减少 139 万人；城镇常住人口 9.435 亿人，城镇化率 67.00%。')}
  <div class="kpi-grid">
    <article class="kpi-card"><div class="kpi-label">年末全国人口</div><div class="kpi-value">14.0828<span class="kpi-unit">亿人</span></div><div class="kpi-change">−139 万人</div><div class="kpi-note">2024 年末，比上年末减少 139 万人</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">出生人口</div><div class="kpi-value">954<span class="kpi-unit">万人</span></div><div class="kpi-change">出生率 6.77‰</div><div class="kpi-note">比上年增加 52 万人，出生率回升</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">死亡人口</div><div class="kpi-value">1,093<span class="kpi-unit">万人</span></div><div class="kpi-change">死亡率 7.76‰</div><div class="kpi-note">自然增长率 −0.99‰</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">城镇化率</div><div class="kpi-value">67.00<span class="kpi-unit">%</span></div><div class="kpi-change">+0.84 个百分点</div><div class="kpi-note">城镇常住人口 94,350 万人</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">60 岁及以上人口</div><div class="kpi-value">31,031<span class="kpi-unit">万人</span></div><div class="kpi-change">占总人口 22.0%</div><div class="kpi-note">其中 65 岁及以上 22,023 万人，占 15.6%</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
  </div>
  <div class="chart-grid-2">
    ${chartCard('年末总人口 2015–2024（亿人）', popLine, '人口总量 2022 年起连续三年小幅下降，2024 年降幅收窄。')}
    ${chartCard('年龄结构 2024 年末（占比）', ageDonut, '16–59 岁劳动年龄人口 85,798 万人，占 60.9%。占比合计因四舍五入为 99.9%。')}
  </div>
  ${chartCard('出生人口 2015–2024（万人）', birthBars, '出生人口 2016 年达到 1,786 万人峰值后逐年下降，2024 年回升至 954 万人。')}
  ${sourceNote(SOURCES.nbs2024 + '；2015–2023 年数为历年公报数。')}`;
}

// ---------- 经济 ----------
export function renderEconomy(state) {
  const metric = state.economyMetric || 'gdp';
  const chart = metric === 'gdp'
    ? barChart(GDP_SERIES.map((d) => ({ label: String(d.year), value: d.gdp })), { color: '#1f5fa8', valueFmt: (v) => v.toFixed(2) })
    : lineChart(GDP_SERIES.map((d) => ({ x: String(d.year), y: d.growth })), { color: '#c8102e', unit: '%', yFmt: (v) => v.toFixed(1) });
  const sorted = [...PROVINCES_2024].sort((a, b) => {
    const k = state.provSortKey || 'gdp';
    const dir = state.provSortDir === 'asc' ? 1 : -1;
    return (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * dir;
  });
  const rows = sorted.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.name)}</td><td>${p.gdp.toLocaleString('en-US')}</td><td>${p.growth.toFixed(1)}%</td></tr>`).join('');
  return `
  ${sectionHead('经济', '2024 年 GDP 134.91 万亿元，增长 5.0%；三次产业中第三产业占 56.7%，高技术制造业增长 8.9%，新质生产力稳步发展。')}
  ${kpiCards(state.year)}
  <section class="chart-card">
    <h3>国内生产总值 2015–2024</h3>
    <div class="btn-row" role="group" aria-label="切换指标">
      <button class="pill ${metric === 'gdp' ? 'active' : ''}" data-metric="gdp">总量（万亿元）</button>
      <button class="pill ${metric === 'growth' ? 'active' : ''}" data-metric="growth">增速（%）</button>
    </div>
    <div class="chart-body">${chart}</div>
    <p class="chart-note">2024 年分季度增速：一季度 5.3%、二季度 4.7%、三季度 4.6%、四季度 5.4%。2023 年数经第五次全国经济普查修订为 129.43 万亿元，图中为当年公报数。</p>
  </section>
  <div class="chart-grid-2">
    ${chartCard('三次产业结构 2024（占 GDP 比重）', donutChart(INDUSTRY_2024.map((d) => ({ name: d.name, share: d.share }))), '最终消费支出拉动 GDP 增长 2.2 个百分点，资本形成总额拉动 1.3 个百分点，货物和服务净出口拉动 1.5 个百分点。')}
    ${chartCard('四季度增速 2024（%）', barChart(QUARTER_GROWTH_2024.map((d) => ({ label: d.q, value: d.growth })), { color: '#c8102e', valueFmt: (v) => v.toFixed(1) }), '四季度增速回升至 5.4%，为全年最高。')}
  </div>
  <section class="chart-card">
    <h3>各省（区、市）GDP 排名 · 2024 年</h3>
    <p class="chart-note">点表头可按 GDP 或增速排序。广东连续 36 年居全国首位，江苏经济增量 6,084 亿元为全国第一。</p>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>#</th><th>省（区、市）</th><th><button class="th-btn" data-sort="gdp">GDP（亿元）↕</button></th><th><button class="th-btn" data-sort="growth">增速 ↕</button></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${sourceNote(SOURCES.prov2024 + '；全国数见' + SOURCES.nbs2024)}
  </section>
  <section class="chart-card">
    <h3>增长动能 · 2024 年</h3>
    <div class="fact-list">
      <div class="fact"><strong>3.61 万亿元</strong><span>研发经费（R&amp;D），增长 8.3%，占 GDP 2.68%</span></div>
      <div class="fact"><strong>48.79 万亿元</strong><span>社会消费品零售总额，增长 3.5%</span></div>
      <div class="fact"><strong>51.44 万亿元</strong><span>固定资产投资（不含农户），增长 3.2%</span></div>
      <div class="fact"><strong>1,316.8 万辆</strong><span>新能源汽车产量，增长 38.7%</span></div>
      <div class="fact"><strong>+8.9%</strong><span>规模以上高技术制造业增加值增速</span></div>
      <div class="fact"><strong>173,898 元/人</strong><span>全员劳动生产率，比上年提高 4.9%</span></div>
    </div>
    ${sourceNote(SOURCES.nbs2024)}
  </section>`;
}

// ---------- 贸易 ----------
export function renderTrade(state) {
  const tradeLine = lineChart(TRADE_SERIES.map((d) => ({ x: String(d.year), y: d.total })), {
    color: '#1f5fa8', unit: ' 万亿元', yFmt: (v) => v.toFixed(0),
  });
  const partners = hbarChart(PARTNERS_2024.map((p) => ({ label: p.name, value: p.value, display: p.value.toFixed(2) + ' 万亿' })), { height: 260, color: '#2e86c1', unit: ' 万亿元' });
  const facts = TRADE_FACTS_2024.map((f) => `<div class="fact"><strong>${esc(f.value)}</strong><span>${esc(f.label)}：${esc(f.note)}</span></div>`).join('');
  return `
  ${sectionHead('贸易', '2024 年货物贸易进出口 43.85 万亿元，规模再创历史新高；出口 25.45 万亿元，连续 8 年增长；东盟连续 5 年为第一大贸易伙伴。')}
  <div class="kpi-grid">
    <article class="kpi-card"><div class="kpi-label">货物进出口总值</div><div class="kpi-value">43.85<span class="kpi-unit">万亿元</span></div><div class="kpi-change">+5.0%</div><div class="kpi-note">按美元计 6.16 万亿美元，增长 3.8%</div><div class="kpi-source">${esc(SOURCES.gac2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">出口</div><div class="kpi-value">25.45<span class="kpi-unit">万亿元</span></div><div class="kpi-change">+7.1%</div><div class="kpi-note">规模首次突破 25 万亿元，连续 8 年增长</div><div class="kpi-source">${esc(SOURCES.gac2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">进口</div><div class="kpi-value">18.39<span class="kpi-unit">万亿元</span></div><div class="kpi-change">+2.3%</div><div class="kpi-note">贸易顺差 7.06 万亿元</div><div class="kpi-source">${esc(SOURCES.gac2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">服务贸易</div><div class="kpi-value">7.52<span class="kpi-unit">万亿元</span></div><div class="kpi-change">+14.4%</div><div class="kpi-note">服务贸易保持两位数增长</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">跨境电商</div><div class="kpi-value">2.63<span class="kpi-unit">万亿元</span></div><div class="kpi-change">比 2020 年 +1 万亿</div><div class="kpi-note">新业态进出口保持快速增长</div><div class="kpi-source">${esc(SOURCES.gac2024)}</div></article>
  </div>
  <div class="chart-grid-2">
    ${chartCard('货物进出口 2015–2024（万亿元）', tradeLine, '2024 年连续跨过 42、43 两个万亿级大关；12 月当月进出口首次突破 4 万亿元。')}
    <section class="chart-card"><h3>主要贸易伙伴 · 2024 年（万亿元）</h3><div class="chart-body">${partners}</div><p class="chart-note">东盟 6.99 万亿元（+9.0%），其中对东盟出口 4.17 万亿元、进口 2.82 万亿元。</p></section>
  </div>
  <section class="chart-card">
    <h3>出口结构亮点 · 2024 年</h3>
    <div class="fact-list">${facts}</div>
    ${sourceNote(SOURCES.gac2024)}
  </section>
  <section class="chart-card">
    <h3>分季度进出口 · 2024 年</h3>
    <div class="fact-list">
      <div class="fact"><strong>11.51 万亿元</strong><span>四季度进出口，创季度历史新高</span></div>
      <div class="fact"><strong>约 70 万家</strong><span>有进出口实绩的外贸企业，数量再创新高</span></div>
      <div class="fact"><strong>79.7%</strong><span>东部地区进出口占全国比重，继续发挥“压舱石”作用</span></div>
      <div class="fact"><strong>50.3%</strong><span>对共建“一带一路”国家进出口占比，首次超过一半</span></div>
    </div>
    ${sourceNote(SOURCES.gac2024)}
  </section>`;
}

// ---------- 能源 ----------
export function renderEnergy(state) {
  const mixDonut = donutChart(ENERGY_MIX_2024.map((d) => ({ name: d.name, share: d.share })));
  const capacityBars = hbarChart(CAPACITY_2024.map((d) => ({ label: d.name, value: d.value, display: d.value.toLocaleString('en-US') })), { height: 260, color: '#1f5fa8', unit: ' 万千瓦' });
  const powerLine = lineChart(POWER_SERIES.map((d) => ({ x: String(d.year), y: d.power })), {
    color: '#2e86c1', unit: ' 亿千瓦时', yFmt: (v) => v.toFixed(0),
  });
  return `
  ${sectionHead('能源', '2024 年能源消费总量 59.6 亿吨标准煤，增长 4.3%；煤炭消费占比降至 53.2%，清洁能源消费占比升至 28.6%；发电量首次突破 1 万亿千瓦时。')}
  <div class="kpi-grid">
    <article class="kpi-card"><div class="kpi-label">能源消费总量</div><div class="kpi-value">59.6<span class="kpi-unit">亿吨标准煤</span></div><div class="kpi-change">+4.3%</div><div class="kpi-note">一次能源生产总量 49.8 亿吨标准煤，+4.6%</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">煤炭消费占比</div><div class="kpi-value">53.2<span class="kpi-unit">%</span></div><div class="kpi-change">−1.6 个百分点</div><div class="kpi-note">煤炭消费量增长 1.7%</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">清洁能源消费占比</div><div class="kpi-value">28.6<span class="kpi-unit">%</span></div><div class="kpi-change">+2.2 个百分点</div><div class="kpi-note">天然气、水电、核电、风电、太阳能合计</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">发电量</div><div class="kpi-value">10,086.9<span class="kpi-unit">亿千瓦时</span></div><div class="kpi-change">+6.7%</div><div class="kpi-note">清洁能源发电 37,126 亿千瓦时，+16.4%</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">发电装机容量</div><div class="kpi-value">334,862<span class="kpi-unit">万千瓦</span></div><div class="kpi-change">+14.6%</div><div class="kpi-note">风电、太阳能装机合计超 14 亿千瓦</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
  </div>
  <div class="chart-grid-2">
    ${chartCard('能源消费结构 2024（占比）', mixDonut, '石油及其他 18.2% 为 100% 减煤炭与清洁能源得出；万元 GDP 能耗（扣原料用能与非化石能源后）下降 3.8%。')}
    ${chartCard('发电量 2020–2024（亿千瓦时）', powerLine, '2024 年发电量首次突破 10,000 亿千瓦时。')}
  </div>
  ${chartCard('发电装机容量 2024 年末（万千瓦）', capacityBars, '并网太阳能发电装机 88,666 万千瓦，增长 45.2%；风电 52,068 万千瓦，增长 18.0%；水电 43,595 万千瓦；核电 6,083 万千瓦。')}
  <section class="chart-card">
    <h3>生产与消费 · 2024 年</h3>
    <div class="fact-list">
      <div class="fact"><strong>47.6 亿吨</strong><span>原煤产量，增长 1.3%；煤炭进口 5.4 亿吨</span></div>
      <div class="fact"><strong>2.13 亿吨</strong><span>原油产量，增长 1.8%；原油进口 5.53 亿吨</span></div>
      <div class="fact"><strong>2,464 亿立方米</strong><span>天然气产量，增长 6.2%；天然气进口 1.32 亿吨</span></div>
      <div class="fact"><strong>9.85 万亿千瓦时</strong><span>全社会用电量，增长 6.8%</span></div>
      <div class="fact"><strong>−3.4%</strong><span>万元 GDP 二氧化碳排放下降幅度</span></div>
      <div class="fact"><strong>29.3 微克/立方米</strong><span>339 个地级及以上城市 PM2.5 平均浓度</span></div>
    </div>
    ${sourceNote(SOURCES.nbs2024)}
  </section>`;
}

// ---------- 民生 ----------
export function renderLivelihood(state) {
  const incomeBars = barChart(INCOME_SERIES.map((d) => ({ label: String(d.year), value: d.urban })), {
    color: '#1f5fa8', valueFmt: (v) => v.toLocaleString('en-US'),
  });
  const grainBars = barChart(GRAIN_SERIES.map((d) => ({ label: String(d.year), value: d.grain })), {
    color: '#3a7d5d', valueFmt: (v) => v.toLocaleString('en-US'),
  });
  const incomeRows = INCOME_SERIES.map((d) => `<tr><td>${d.year}</td><td>${d.urban.toLocaleString('en-US')}</td><td>${d.rural.toLocaleString('en-US')}</td><td>${(d.urban / d.rural).toFixed(2)}</td></tr>`).join('');
  return `
  ${sectionHead('民生', '2024 年全国居民人均可支配收入 41,314 元，实际增长 5.1%，与经济增长同步；粮食产量 70,650 万吨，再创历史新高；就业物价总体稳定。')}
  <div class="kpi-grid">
    <article class="kpi-card"><div class="kpi-label">人均可支配收入</div><div class="kpi-value">41,314<span class="kpi-unit">元</span></div><div class="kpi-change">名义 +5.3%，实际 +5.1%</div><div class="kpi-note">城镇 54,188 元，农村 23,119 元</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">居民消费价格 CPI</div><div class="kpi-value">+0.2<span class="kpi-unit">%</span></div><div class="kpi-change">温和上涨</div><div class="kpi-note">工业生产者出厂价格 PPI 下降 2.2%</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">城镇调查失业率</div><div class="kpi-value">5.1<span class="kpi-unit">%</span></div><div class="kpi-change">−0.1 个百分点</div><div class="kpi-note">城镇新增就业 1,256 万人</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">粮食总产量</div><div class="kpi-value">70,650<span class="kpi-unit">万吨</span></div><div class="kpi-change">+1.6%</div><div class="kpi-note">首次突破 7 亿吨，连续多年稳定在 6.5 亿吨以上</div><div class="kpi-source">${esc(SOURCES.nbs2024)}</div></article>
    <article class="kpi-card"><div class="kpi-label">人均预期寿命</div><div class="kpi-value">79<span class="kpi-unit">岁</span></div><div class="kpi-change">2024 年</div><div class="kpi-note">2024 年，国家卫生健康委发布</div><div class="kpi-source">${esc(SOURCES.health2024)}</div></article>
  </div>
  <div class="chart-grid-2">
    ${chartCard('城镇居民人均可支配收入 2020–2024（元）', incomeBars, '2024 年城镇居民人均可支配收入 54,188 元，名义增长 4.6%。')}
    ${chartCard('粮食总产量 2020–2024（万吨）', grainBars, '2024 年粮食产量 70,650 万吨，比上年增加 1,109 万吨。')}
  </div>
  <section class="chart-card">
    <h3>城乡居民收入 · 2020–2024 年（元）</h3>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>年份</th><th>城镇居民人均可支配收入</th><th>农村居民人均可支配收入</th><th>城乡收入比</th></tr></thead>
      <tbody>${incomeRows}</tbody>
    </table></div>
    <p class="chart-note">城乡居民收入比由 2020 年的 2.56 缩小至 2024 年的 2.34。</p>
    ${sourceNote(SOURCES.nbs2024)}
  </section>
  <section class="chart-card">
    <h3>民生速览 · 2024 年</h3>
    <div class="fact-list">
      <div class="fact"><strong>96.63 百万吨</strong><span>猪牛羊禽肉产量，增长 0.2%</span></div>
      <div class="fact"><strong>20.12 百万人次</strong><span>免签入境人次，增长 112.3%；入境游客花费 942 亿美元</span></div>
      <div class="fact"><strong>59,080 家</strong><span>新设外商投资企业，增长 9.9%</span></div>
      <div class="fact"><strong>68 次</strong><span>全年航天发射次数</span></div>
      <div class="fact"><strong>90.4%</strong><span>3,641 个国家地表水考核断面水质优良（Ⅰ–Ⅲ类）比例</span></div>
      <div class="fact"><strong>65.5%</strong><span>339 个地级及以上城市空气质量达标比例</span></div>
    </div>
    ${sourceNote(SOURCES.nbs2024)}
  </section>`;
}

// ---------- 搜索 ----------
export function renderSearch(state) {
  const q = (state.query || '').trim().toLowerCase();
  const hits = q
    ? INDICATOR_INDEX.filter((d) => d.name.toLowerCase().includes(q) || d.value.toLowerCase().includes(q))
    : INDICATOR_INDEX;
  const rows = hits.map((d) => `
    <article class="result-row">
      <div><a class="result-name" href="#/${d.section}">${esc(d.name)}</a><div class="result-value">${esc(d.value)}</div></div>
      <div class="result-source">${esc(d.source)}</div>
    </article>`).join('');
  return `
  ${sectionHead('指标检索', q ? `“${esc(state.query)}”的检索结果：${hits.length} 条` : '查一个数：输入关键词，在 28 个核心指标里找。每个结果都带值、年份与来源，点名称跳到对应栏目。')}
  <div class="search-big"><input id="search-input" type="search" placeholder="例如：GDP、人口、CPI、进出口、能源…" value="${esc(state.query || '')}" aria-label="搜索指标"><button id="search-go" class="btn-primary">搜索</button></div>
  <div class="result-list">${rows || '<p class="muted">没有找到相关指标，换个关键词试试，例如“GDP”或“人口”。</p>'}</div>
  ${sourceNote('指标值见各条来源；2024 年数为初步核算数。')}`;
}

// ---------- 关于 ----------
export function renderAbout() {
  return `
  ${sectionHead('关于本站', 'STATLAS 是一个一国统计门户：以中国为对象，把国家统计局年鉴、海关总署与世界银行的公开数，整理成普通人能直接查、能看懂的页面。')}
  <section class="chart-card">
    <h3>数据来源</h3>
    <div class="fact-list">
      <div class="fact"><strong>国家统计局</strong><span>《2024 年国民经济和社会发展统计公报》，2025 年 2 月 28 日；《2023 年公报》，2024 年 2 月 29 日</span></div>
      <div class="fact"><strong>海关总署</strong><span>2024 年全年进出口情况，2025 年 1 月 13 日</span></div>
      <div class="fact"><strong>世界银行 WDI</strong><span>国际对照：GDP（现价美元）、人均 GDP（现价美元），2024 年</span></div>
      <div class="fact"><strong>各省（区、市）统计局</strong><span>2024 年地区生产总值（初步核算数）</span></div>
      <div class="fact"><strong>国家卫生健康委</strong><span>2024 年人均预期寿命 79 岁，2025 年发布</span></div>
    </div>
    <p class="chart-note">说明：2024 年数为初步核算数；公报数据不含香港、澳门和台湾；2023 年 GDP 经第五次全国经济普查修订为 129.43 万亿元，本站图表中 2023 年为当年公报数 126.06 万亿元；占比合计因四舍五入可能不等于 100%。</p>
  </section>
  <section class="chart-card">
    <h3>本站做法</h3>
    <div class="fact-list">
      <div class="fact"><strong>零网络请求</strong><span>页面、样式、脚本与数据全是本站文件，不加载任何外部资源，离线也能打开</span></div>
      <div class="fact"><strong>手写图表</strong><span>柱状、折线、环形与方块地图均为手写内联 SVG，不使用任何图表库</span></div>
      <div class="fact"><strong>每个数字有来源</strong><span>卡片、图表与表格下方都写明来源与年份，可逐项核对</span></div>
      <div class="fact"><strong>手机可用</strong><span>单列布局、触控友好的导航与表格横向滚动，在手机上也能查数</span></div>
    </div>
  </section>
  <section class="chart-card">
    <h3>下载本站数据</h3>
    <p class="chart-note">把核心指标与各省 GDP 导出为 CSV 文件，可在表格软件里打开、引用。</p>
    <button id="download-csv" class="btn-primary">下载核心指标 CSV</button>
  </section>`;
}
