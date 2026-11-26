// STATLAS 数据层：本站全部数字都出自这里，每一项都带来源与年份。
// 主要来源：国家统计局《中华人民共和国 2024 年国民经济和社会发展统计公报》
// （2025 年 2 月 28 日发布，2024 年数为初步核算数）；海关总署 2025 年 1 月 13 日
// 发布的外贸数据；世界银行 WDI（国际对照）；各省统计局 2024 年地区生产总值。
// 公报数据不含香港、澳门和台湾。货币单位除注明外均为人民币。

export const SOURCES = {
  nbs2024: '国家统计局《2024年国民经济和社会发展统计公报》，2025-02-28',
  nbs2023: '国家统计局《2023年国民经济和社会发展统计公报》，2024-02-29',
  gac2024: '海关总署，2025-01-13',
  wb: '世界银行 WDI（World Development Indicators），2024 年',
  prov2024: '各省（区、市）统计局 2024 年地区生产总值',
  health2024: '国家卫生健康委，2025 年',
};

// 年份切换：总览与各栏目大卡片在 2024 / 2023 两年之间切换。
export const YEARS = [2024, 2023];

// 总览关键指标：每年一组，卡片与图表都从这里取数。
export const HEADLINE = {
  2024: [
    { id: 'gdp', label: '国内生产总值', value: '134.91', unit: '万亿元', change: '+5.0%', note: '比上年增长 5.0%，首次突破 130 万亿元', source: SOURCES.nbs2024 },
    { id: 'pop', label: '年末全国人口', value: '14.0828', unit: '亿人', change: '−139 万人', note: '比上年末减少 139 万人', source: SOURCES.nbs2024 },
    { id: 'gdpPc', label: '人均国内生产总值', value: '95,749', unit: '元', change: '+5.1%', note: '比上年增长 5.1%，约合 13,306 美元', source: SOURCES.nbs2024 },
    { id: 'cpi', label: '居民消费价格 CPI', value: '+0.2%', unit: '同比', change: '温和上涨', note: '全年 CPI 比上年上涨 0.2%，PPI 下降 2.2%', source: SOURCES.nbs2024 },
    { id: 'unemp', label: '城镇调查失业率', value: '5.1%', unit: '年均值', change: '−0.1 个百分点', note: '城镇新增就业 1,256 万人', source: SOURCES.nbs2024 },
  ],
  2023: [
    { id: 'gdp', label: '国内生产总值', value: '126.06', unit: '万亿元', change: '+5.2%', note: '比上年增长 5.2%', source: SOURCES.nbs2023 },
    { id: 'pop', label: '年末全国人口', value: '14.0967', unit: '亿人', change: '−208 万人', note: '比上年末减少 208 万人', source: SOURCES.nbs2023 },
    { id: 'gdpPc', label: '人均国内生产总值', value: '89,358', unit: '元', change: '+5.4%', note: '比上年增长 5.4%', source: SOURCES.nbs2023 },
    { id: 'cpi', label: '居民消费价格 CPI', value: '+0.2%', unit: '同比', change: '温和上涨', note: '全年 CPI 比上年上涨 0.2%，PPI 下降 3.0%', source: SOURCES.nbs2023 },
    { id: 'unemp', label: '城镇调查失业率', value: '5.2%', unit: '年均值', change: '−0.4 个百分点', note: '城镇新增就业 1,244 万人', source: SOURCES.nbs2023 },
  ],
};

// GDP：2015–2024 年现价总量（万亿元）与同比增速（%）。
export const GDP_SERIES = [
  { year: 2015, gdp: 68.89, growth: 6.9 },
  { year: 2016, gdp: 74.64, growth: 6.8 },
  { year: 2017, gdp: 83.20, growth: 6.9 },
  { year: 2018, gdp: 91.93, growth: 6.6 },
  { year: 2019, gdp: 98.65, growth: 6.0 },
  { year: 2020, gdp: 101.36, growth: 2.2 },
  { year: 2021, gdp: 114.92, growth: 8.1 },
  { year: 2022, gdp: 120.47, growth: 3.0 },
  { year: 2023, gdp: 126.06, growth: 5.2 },
  { year: 2024, gdp: 134.91, growth: 5.0 },
];

// 2024 年三产结构（占 GDP 比重，%）。
export const INDUSTRY_2024 = [
  { name: '第一产业', share: 6.8, value: '9.14 万亿元', growth: '+3.5%' },
  { name: '第二产业', share: 36.5, value: '49.21 万亿元', growth: '+5.3%' },
  { name: '第三产业', share: 56.7, value: '76.56 万亿元', growth: '+5.0%' },
];

// 2024 年四季度 GDP 同比增速（%）。
export const QUARTER_GROWTH_2024 = [
  { q: '一季度', growth: 5.3 },
  { q: '二季度', growth: 4.7 },
  { q: '三季度', growth: 4.6 },
  { q: '四季度', growth: 5.4 },
];

// 2024 年各省（区、市）地区生产总值（亿元，初步核算数）。
// tile 栏是方块地图上的格子位置（列，行），大致按地理方位排布。
export const PROVINCES_2024 = [
  { name: '广东', gdp: 141633.8, growth: 3.5, tile: [7, 6] },
  { name: '江苏', gdp: 137008.0, growth: 5.8, tile: [8, 3] },
  { name: '山东', gdp: 98565.8, growth: 5.7, tile: [7, 3] },
  { name: '浙江', gdp: 90130.6, growth: 5.5, tile: [8, 4] },
  { name: '四川', gdp: 64697.0, growth: 5.7, tile: [4, 4] },
  { name: '河南', gdp: 63590.0, growth: 5.1, tile: [6, 3] },
  { name: '湖北', gdp: 60013.0, growth: 5.8, tile: [6, 4] },
  { name: '福建', gdp: 57761.0, growth: 5.5, tile: [8, 5] },
  { name: '上海', gdp: 53926.7, growth: 5.0, tile: [9, 4] },
  { name: '湖南', gdp: 53231.0, growth: 4.8, tile: [6, 5] },
  { name: '安徽', gdp: 50625.2, growth: 5.8, tile: [7, 4] },
  { name: '北京', gdp: 49843.1, growth: 5.2, tile: [6, 1] },
  { name: '河北', gdp: 47526.9, growth: 5.4, tile: [6, 2] },
  { name: '陕西', gdp: 35538.8, growth: 5.3, tile: [4, 3] },
  { name: '江西', gdp: 34202.5, growth: 5.1, tile: [7, 5] },
  { name: '重庆', gdp: 32193.2, growth: 5.7, tile: [5, 4] },
  { name: '辽宁', gdp: 32612.7, growth: 5.1, tile: [8, 2] },
  { name: '云南', gdp: 31534.1, growth: 3.3, tile: [4, 5] },
  { name: '广西', gdp: 28649.4, growth: 4.2, tile: [6, 6] },
  { name: '山西', gdp: 25494.7, growth: 2.3, tile: [5, 2] },
  { name: '内蒙古', gdp: 26314.6, growth: 5.8, tile: [4, 1] },
  { name: '贵州', gdp: 22667.1, growth: 5.3, tile: [5, 5] },
  { name: '新疆', gdp: 20534.1, growth: 6.1, tile: [1, 2] },
  { name: '天津', gdp: 18024.0, growth: 5.1, tile: [7, 1] },
  { name: '黑龙江', gdp: 16476.9, growth: 3.2, tile: [8, 1] },
  { name: '吉林', gdp: 14361.2, growth: 4.3, tile: [9, 1] },
  { name: '甘肃', gdp: 13003.0, growth: 5.8, tile: [3, 2] },
  { name: '海南', gdp: 7935.7, growth: 3.7, tile: [7, 7] },
  { name: '宁夏', gdp: 5502.8, growth: 5.4, tile: [4, 2] },
  { name: '青海', gdp: 3950.8, growth: 2.7, tile: [3, 3] },
  { name: '西藏', gdp: 2764.9, growth: 6.3, tile: [2, 4] },
];

// 人口：年末总人口（亿人）、出生与死亡（万人），2015–2024 年。
export const POP_SERIES = [
  { year: 2015, pop: 13.75, births: 1655, deaths: 975 },
  { year: 2016, pop: 13.83, births: 1786, deaths: 977 },
  { year: 2017, pop: 13.91, births: 1723, deaths: 986 },
  { year: 2018, pop: 13.95, births: 1523, deaths: 993 },
  { year: 2019, pop: 14.00, births: 1465, deaths: 998 },
  { year: 2020, pop: 14.12, births: 1200, deaths: 995 },
  { year: 2021, pop: 14.13, births: 1062, deaths: 1014 },
  { year: 2022, pop: 14.12, births: 956, deaths: 1041 },
  { year: 2023, pop: 14.10, births: 902, deaths: 1110 },
  { year: 2024, pop: 14.08, births: 954, deaths: 1093 },
];

// 2024 年末人口结构（万人，占比；占比合计因四舍五入为 99.9%）。
export const AGE_2024 = [
  { name: '0–15 岁', pop: 23999, share: 17.0 },
  { name: '16–59 岁', pop: 85798, share: 60.9 },
  { name: '60 岁及以上', pop: 31031, share: 22.0 },
];

// 贸易：2015–2024 年货物进出口（万亿元）。
export const TRADE_SERIES = [
  { year: 2015, total: 24.59, exports: 14.14, imports: 10.45 },
  { year: 2016, total: 24.33, exports: 13.84, imports: 10.49 },
  { year: 2017, total: 27.79, exports: 15.33, imports: 12.46 },
  { year: 2018, total: 30.51, exports: 16.42, imports: 14.09 },
  { year: 2019, total: 31.54, exports: 17.23, imports: 14.31 },
  { year: 2020, total: 32.16, exports: 17.93, imports: 14.23 },
  { year: 2021, total: 39.10, exports: 21.73, imports: 17.37 },
  { year: 2022, total: 42.07, exports: 23.97, imports: 18.10 },
  { year: 2023, total: 41.76, exports: 23.77, imports: 17.99 },
  { year: 2024, total: 43.85, exports: 25.45, imports: 18.39 },
];

// 2024 年主要贸易伙伴（进出口总值，万亿元）。
export const PARTNERS_2024 = [
  { name: '东盟', value: 6.99, growth: '+9.0%', note: '连续 5 年第一大贸易伙伴，占外贸总值 15.9%' },
  { name: '欧盟', value: 5.65, growth: '+1.6%', note: '第二大贸易伙伴' },
  { name: '美国', value: 4.99, growth: '+4.9%', note: '第三大贸易伙伴' },
  { name: '共建“一带一路”国家', value: 22.07, growth: '+6.4%', note: '合计占进出口总值 50.3%，首次过半' },
  { name: '民营企业进出口', value: 24.33, growth: '+8.8%', note: '占外贸总值 55.5%，外贸主力军' },
];

// 2024 年出口结构亮点（均为已核实数，见贸易页）。
export const TRADE_FACTS_2024 = [
  { label: '机电产品出口', value: '15.12 万亿元', note: '占出口总值 59.4%，增长 8.7%' },
  { label: '集成电路出口', value: '1.14 万亿元', note: '增长 20.3%' },
  { label: '跨境电商进出口', value: '2.63 万亿元', note: '比 2020 年增加 1 万亿元' },
  { label: '电动汽车出口', value: '超 200 万辆', note: '2024 年出口电动汽车超过 200 万辆' },
];

// 能源：消费结构与装机、发电量。
export const ENERGY_MIX_2024 = [
  { name: '煤炭', share: 53.2, note: '比上年下降 1.6 个百分点' },
  { name: '清洁能源', share: 28.6, note: '天然气、水电、核电、风电、太阳能，上升 2.2 个百分点' },
  { name: '石油及其他', share: 18.2, note: '100% 减前两项得出' },
];

// 2024 年末发电装机容量（万千瓦）。
export const CAPACITY_2024 = [
  { name: '火电', value: 144445 },
  { name: '太阳能发电', value: 88666 },
  { name: '风电', value: 52068 },
  { name: '水电', value: 43595 },
  { name: '核电', value: 6083 },
];

// 发电量：2020–2024 年（亿千瓦时）。
export const POWER_SERIES = [
  { year: 2020, power: 7779.1 },
  { year: 2021, power: 8534.5 },
  { year: 2022, power: 8906.3 },
  { year: 2023, power: 9456.1 },
  { year: 2024, power: 10086.9 },
];

// 民生：城乡居民人均可支配收入（元）。
export const INCOME_SERIES = [
  { year: 2020, urban: 43834, rural: 17131 },
  { year: 2021, urban: 47412, rural: 18931 },
  { year: 2022, urban: 49283, rural: 20133 },
  { year: 2023, urban: 51821, rural: 21691 },
  { year: 2024, urban: 54188, rural: 23119 },
];

// 粮食总产量：2020–2024 年（万吨）。
export const GRAIN_SERIES = [
  { year: 2020, grain: 66949 },
  { year: 2021, grain: 68285 },
  { year: 2022, grain: 68653 },
  { year: 2023, grain: 69541 },
  { year: 2024, grain: 70650 },
];

// 指标检索：站内搜索用的扁平索引，每条都带值、年份与来源。
export const INDICATOR_INDEX = [
  { name: '国内生产总值 GDP', value: '134.91 万亿元（2024 年，+5.0%）', section: 'economy', source: SOURCES.nbs2024 },
  { name: '人均国内生产总值', value: '95,749 元（2024 年，约合 13,306 美元）', section: 'economy', source: SOURCES.nbs2024 },
  { name: '年末全国人口', value: '14.0828 亿人（2024 年末）', section: 'population', source: SOURCES.nbs2024 },
  { name: '出生人口', value: '954 万人，出生率 6.77‰（2024 年）', section: 'population', source: SOURCES.nbs2024 },
  { name: '城镇化率', value: '67.00%（2024 年末常住人口城镇化率）', section: 'population', source: SOURCES.nbs2024 },
  { name: '60 岁及以上人口', value: '31,031 万人，占总人口 22.0%（2024 年末）', section: 'population', source: SOURCES.nbs2024 },
  { name: '居民消费价格 CPI', value: '+0.2%（2024 年同比）', section: 'livelihood', source: SOURCES.nbs2024 },
  { name: '城镇调查失业率', value: '5.1%（2024 年均值）', section: 'livelihood', source: SOURCES.nbs2024 },
  { name: '全国居民人均可支配收入', value: '41,314 元（2024 年，名义 +5.3%）', section: 'livelihood', source: SOURCES.nbs2024 },
  { name: '粮食总产量', value: '70,650 万吨（2024 年，+1.6%）', section: 'livelihood', source: SOURCES.nbs2024 },
  { name: '社会消费品零售总额', value: '48.79 万亿元（2024 年，+3.5%）', section: 'economy', source: SOURCES.nbs2024 },
  { name: '固定资产投资', value: '51.44 万亿元（2024 年，+3.2%）', section: 'economy', source: SOURCES.nbs2024 },
  { name: '研发经费 R&D', value: '3.61 万亿元（2024 年，+8.3%，占 GDP 2.68%）', section: 'economy', source: SOURCES.nbs2024 },
  { name: '货物进出口总值', value: '43.85 万亿元（2024 年，+5.0%）', section: 'trade', source: SOURCES.gac2024 },
  { name: '货物出口', value: '25.45 万亿元（2024 年，+7.1%）', section: 'trade', source: SOURCES.gac2024 },
  { name: '货物进口', value: '18.39 万亿元（2024 年，+2.3%）', section: 'trade', source: SOURCES.gac2024 },
  { name: '对东盟进出口', value: '6.99 万亿元（2024 年，+9.0%）', section: 'trade', source: SOURCES.gac2024 },
  { name: '服务贸易', value: '7.52 万亿元（2024 年，+14.4%）', section: 'trade', source: SOURCES.nbs2024 },
  { name: '能源消费总量', value: '59.6 亿吨标准煤（2024 年，+4.3%）', section: 'energy', source: SOURCES.nbs2024 },
  { name: '煤炭消费占比', value: '53.2%（2024 年，−1.6 个百分点）', section: 'energy', source: SOURCES.nbs2024 },
  { name: '清洁能源消费占比', value: '28.6%（2024 年，+2.2 个百分点）', section: 'energy', source: SOURCES.nbs2024 },
  { name: '发电量', value: '10,086.9 亿千瓦时（2024 年，+6.7%）', section: 'energy', source: SOURCES.nbs2024 },
  { name: '新能源汽车产量', value: '1,316.8 万辆（2024 年，+38.7%）', section: 'energy', source: SOURCES.nbs2024 },
  { name: '发电装机容量', value: '334,862 万千瓦（2024 年末，+14.6%）', section: 'energy', source: SOURCES.nbs2024 },
  { name: '人均预期寿命', value: '79 岁（2024 年）', section: 'livelihood', source: SOURCES.health2024 },
  { name: 'PM2.5 平均浓度', value: '29.3 微克/立方米（2024 年，339 个城市）', section: 'livelihood', source: SOURCES.nbs2024 },
  { name: '广东省 GDP', value: '141,633.8 亿元（2024 年，全国第一）', section: 'economy', source: SOURCES.prov2024 },
  { name: '江苏省 GDP', value: '137,008 亿元（2024 年，全国第二）', section: 'economy', source: SOURCES.prov2024 },
];
