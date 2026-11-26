// STATLAS 启动器：hash 路由、年份切换、搜索、排序、下载等全部交互。
// 路由：#/（总览） #/population（人口） #/economy（经济） #/trade（贸易）
// #/energy（能源） #/livelihood（民生） #/search（检索） #/about（关于）。
// 全站零网络请求：页面、样式、脚本、数据都在 app/ 里。

import {
  renderOverview, renderPopulation, renderEconomy, renderTrade,
  renderEnergy, renderLivelihood, renderSearch, renderAbout, provinceDetail,
} from './views.js';
import { PROVINCES_2024, INDICATOR_INDEX } from './data.js';

// 页面状态：年份、经济页指标、省份表排序、搜索词。
const state = {
  year: 2024,
  economyMetric: 'gdp',
  provSortKey: 'gdp',
  provSortDir: 'desc',
  query: '',
};

const ROUTES = {
  '': renderOverview,
  population: renderPopulation,
  economy: renderEconomy,
  trade: renderTrade,
  energy: renderEnergy,
  livelihood: renderLivelihood,
  search: renderSearch,
  about: renderAbout,
};

const TITLES = {
  '': '总览',
  population: '人口',
  economy: '经济',
  trade: '贸易',
  energy: '能源',
  livelihood: '民生',
  search: '指标检索',
  about: '关于本站',
};

// 读当前 hash，返回 {route, query}。
export function readRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path, qs] = hash.split('?');
  const params = new URLSearchParams(qs || '');
  return { route: path || '', query: params.get('q') || '' };
}

// 渲染当前路由，并高亮导航、更新年份按钮状态。
export function render() {
  const { route, query } = readRoute();
  state.query = query;
  const view = document.getElementById('view');
  const renderFn = ROUTES[route] || renderOverview;
  view.innerHTML = renderFn(state);
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  document.querySelectorAll('[data-year]').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.year) === state.year);
  });
  const yearLabel = document.getElementById('year-label');
  if (yearLabel) yearLabel.textContent = state.year + ' 年';
  const input = document.getElementById('search-input');
  if (input && route === 'search') input.value = state.query;
  window.scrollTo(0, 0);
}

// 核心指标 + 各省 GDP 导出为 CSV（Blob 下载，完全离线可用）。
export function downloadCsv() {
  const lines = ['指标,值,年份,来源'];
  INDICATOR_INDEX.forEach((d) => {
    lines.push(`"${d.name}","${d.value.replace(/"/g, '""')}","2024","${d.source}"`);
  });
  lines.push('');
  lines.push('省（区、市）,GDP（亿元）,增速（%）');
  [...PROVINCES_2024].sort((a, b) => b.gdp - a.gdp).forEach((p) => {
    lines.push(`${p.name},${p.gdp},${p.growth}`);
  });
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'statlas-china-2024.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// 事件委托：一年份按钮、经济指标切换、省份表排序、搜索、下载、方块地图。
function bindEvents() {
  document.addEventListener('click', (event) => {
    const yearBtn = event.target.closest('[data-year]');
    if (yearBtn) {
      state.year = Number(yearBtn.dataset.year);
      render();
      return;
    }
    const metricBtn = event.target.closest('[data-metric]');
    if (metricBtn) {
      state.economyMetric = metricBtn.dataset.metric;
      render();
      return;
    }
    const sortBtn = event.target.closest('[data-sort]');
    if (sortBtn) {
      const key = sortBtn.dataset.sort;
      if (state.provSortKey === key) {
        state.provSortDir = state.provSortDir === 'desc' ? 'asc' : 'desc';
      } else {
        state.provSortKey = key;
        state.provSortDir = 'desc';
      }
      render();
      return;
    }
    const tile = event.target.closest('.tile');
    if (tile) {
      const p = PROVINCES_2024.find((x) => x.name === tile.dataset.province);
      const box = document.getElementById('province-detail');
      if (p && box) {
        box.innerHTML = provinceDetail(p);
        document.querySelectorAll('.tile').forEach((t) => t.classList.remove('selected'));
        tile.classList.add('selected');
      }
      return;
    }
    if (event.target.closest('#download-csv')) {
      downloadCsv();
      return;
    }
    if (event.target.closest('#search-go')) {
      const input = document.getElementById('search-input');
      const q = input ? input.value.trim() : '';
      window.location.hash = q ? '#/search?q=' + encodeURIComponent(q) : '#/search';
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.id === 'search-input') {
      const q = event.target.value.trim();
      window.location.hash = q ? '#/search?q=' + encodeURIComponent(q) : '#/search';
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target.classList.contains('tile')) {
      event.preventDefault();
      event.target.click();
    }
  });
  document.getElementById('nav-search').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('nav-search-input');
    const q = input.value.trim();
    window.location.hash = q ? '#/search?q=' + encodeURIComponent(q) : '#/search';
  });
  window.addEventListener('hashchange', render);
}

bindEvents();
render();
