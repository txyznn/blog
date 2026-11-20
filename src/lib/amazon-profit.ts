// Transcribed from the user-supplied fee table; these are not live Amazon rates.
export const FBA_RATE_TABLE = {
  uk: { currency: 'GBP', threshold: 10, low: [1.46, 1.50, 1.52, 1.67, 1.70, 1.73, 1.87, 2.42, 2.65, 2.67, 2.70], normal: [1.83, 1.87, 1.89, 2.07, 2.08, 2.10, 2.16, 2.72, 2.94, 2.91, 3.00, 3.04, 2.94, 3.01, 3.06, 3.26] },
  de: { currency: 'EUR', threshold: 11, low: [1.61, 1.64, 1.66, 1.80, 1.83, 1.86, 2.02, 2.39, 2.78, 2.78, 2.99], normal: [2.07, 2.11, 2.13, 2.26, 2.28, 2.31, 2.42, 2.78, 3.16, 3.12, 3.14, 3.41, 3.13, 3.52, 3.64, 4.28] },
  fr: { currency: 'EUR', threshold: 12, low: [2.24, 2.26, 2.27, 2.79, 2.81, 2.81, 3.31, 3.96, 4.31, 4.31, 4.71], normal: [2.75, 2.76, 2.78, 3.30, 3.32, 3.33, 3.77, 4.39, 4.72, 4.56, 5.07, 5.79, 4.58, 5.40, 6.28, 6.41] },
  it: { currency: 'EUR', threshold: 12, low: [2.64, 2.65, 2.67, 2.79, 2.81, 2.81, 3.04, 3.35, 3.59, 3.59, 3.91], normal: [3.23, 3.26, 3.28, 3.39, 3.41, 3.45, 3.64, 3.94, 4.17, 4.13, 4.54, 4.95, 4.29, 4.70, 5.15, 5.81] },
  es: { currency: 'EUR', threshold: 12, low: [2.15, 2.21, 2.23, 2.55, 2.59, 2.61, 2.85, 3.00, 3.23, 3.23, 3.46], normal: [2.77, 2.84, 2.87, 3.21, 3.23, 3.26, 3.45, 3.60, 3.85, 3.52, 3.74, 3.95, 3.55, 4.05, 4.45, 4.85] },
  nl: { currency: 'EUR', threshold: 12, low: [1.89, 1.93, 1.94, 2.01, 2.04, 2.09, 2.18, 2.79, 3.12, 3.13, 3.17], normal: [2.23, 2.27, 2.28, 2.37, 2.39, 2.43, 2.52, 3.13, 3.46, 3.47, 3.51, 4.03, 3.48, 3.80, 4.23, 4.93] },
  se: { currency: 'SEK', threshold: 140, low: [28.23, 28.40, 28.42, 29.72, 29.88, 30.49, 35.38, 36.84, 39.80, 41.23, 43.31], normal: [32.87, 33.04, 33.08, 34.28, 34.38, 34.42, 39.87, 41.43, 44.50, 44.62, 46.31, 46.94, 47.65, 50.51, 50.63, 56.79] },
  pl: { currency: 'PLN', threshold: 55, low: [1.58, 1.59, 1.60, 1.62, 1.63, 1.64, 1.73, 1.79, 1.81, 1.81, 1.86], normal: [2.90, 2.91, 2.92, 2.99, 3.00, 3.02, 3.22, 3.35, 3.44, 3.44, 3.50, 3.54, 3.48, 3.54, 3.61, 3.69] },
  be: { currency: 'EUR', threshold: 12, low: [1.69, 1.72, 1.73, 1.77, 1.81, 1.93, 2.07, 2.57, 2.85, 2.64, 2.96], normal: [2.21, 2.26, 2.27, 2.36, 2.38, 2.42, 2.51, 3.11, 3.42, 3.28, 3.55, 4.04, 3.46, 3.50, 4.39, 4.99] },
} as const;

export const FBA_TIERS = [
  ...[20, 40, 60, 80, 100].map((weight) => ({ name: '轻型信封', dimensions: [33, 23, 2.5], weight })),
  ...[210, 460].map((weight) => ({ name: '标准信封', dimensions: [33, 23, 2.5], weight })),
  { name: '大信封', dimensions: [33, 23, 4], weight: null },
  { name: '超大信封', dimensions: [33, 23, 6], weight: null },
  ...[150, 400, 900].map((weight) => ({ name: '小包裹', dimensions: [33, 25, 12], weight })),
  ...[150, 400, 900, 1400].map((weight) => ({ name: '标准包裹', dimensions: [45, 34, 26], weight })),
];

export function resolveFbaFee(
  product: { length: number; width: number; height: number; weight: number },
  site: { id: string; price: number; fulfillmentMode?: 'auto' | 'normal' | 'manual'; fulfillmentFee: number },
) {
  if (site.fulfillmentMode === 'manual') return { fee: site.fulfillmentFee, label: '手动报价', reason: '使用手动填写的单件基础配送费。' };
  const rates = FBA_RATE_TABLE[site.id as keyof typeof FBA_RATE_TABLE];
  const dimensions = [product.length, product.width, product.height].sort((a, b) => b - a);
  if (![...dimensions, product.weight].every((value) => Number.isFinite(value) && value > 0) || !Number.isFinite(site.price) || site.price < 0) {
    return { fee: null, label: '等待有效参数', reason: '请先填写有效的尺寸、重量和售价。' };
  }
  if (!rates) return { fee: null, label: '未收录站点', reason: '该站点没有图片费率，请切换手动报价。' };
  for (const [index, tier] of FBA_TIERS.entries()) {
    if (!dimensions.every((value, axis) => value <= tier.dimensions[axis])) continue;
    // User-defined thickness priority: large/extra-large envelopes do not
    // impose a weight limit; thin items over 460g continue to parcel tiers.
    if (tier.weight === null && dimensions[2] <= 2.5) continue;
    if (tier.weight !== null && product.weight > tier.weight) continue;
    const lowFee = rates.low[index];
    const low = site.fulfillmentMode !== 'normal' && site.price <= rates.threshold && lowFee !== undefined;
    return {
      fee: low ? lowFee : rates.normal[index],
      label: `${low ? '低价配送' : '正常配送'} · ${tier.name}${tier.weight === null ? '' : ` ≤${tier.weight}g`}`,
      reason: `尺寸上限 ${tier.dimensions.join(' × ')} cm；${tier.weight === null ? '按约定优先依厚度匹配此信封档，不另设重量上限。' : ''}低价售价上限 ${rates.threshold} ${rates.currency}（含边界）。${site.fulfillmentMode === 'normal' ? '已指定使用正常配送。' : low ? '售价及档位符合图片低价表。' : lowFee === undefined ? '该档低价表为空，使用正常配送。' : '售价超过低价上限，使用正常配送。'}`,
    };
  }
  return { fee: null, label: '超出图片覆盖范围', reason: '图片仅覆盖至 45 × 34 × 26 cm、1400g，请切换手动报价。' };
}

export type Marketplace = {
  id: string;
  name: string;
  currency: 'GBP' | 'EUR';
  enabled: boolean;
  quantity: number;
  price: number;
  exchangeRate: number;
  vatPercent: number;
  commissionPercent: number;
  fulfillmentFee: number;
  fulfillmentMode: 'auto' | 'normal' | 'manual';
  surchargePercent: number;
  storageUnit: 'm3' | 'ft3';
  offPeakRate: number;
  peakRate: number;
};

export type ProfitInput = {
  length: number;
  width: number;
  height: number;
  weight: number;
  purchasePrice: number;
  packagingPrice: number;
  arrival: string;
  departure: string;
  includeArrival: boolean;
  includeDeparture: boolean;
  peakMonths: number[];
  transport: 'sea' | 'air' | 'rail' | 'express';
  freightBasis: 'actual' | 'volumetric' | 'higher';
  freightRate: number;
  volumetricDivisor: number;
  minimumWeight: number;
  commissionBasis: 'gross' | 'net';
  newProduct: boolean;
  storageDiscountPercent: number;
  includeAdvertising: boolean;
  advertising: number;
  otherCosts: number;
  marketplaces: Marketplace[];
};

export function createDefaultInput(): ProfitInput {
  const shared = {
    enabled: true, quantity: 100, commissionPercent: 15, surchargePercent: 2, fulfillmentMode: 'auto' as const,
  };
  return {
    length: 33, width: 23, height: 2.5, weight: 400, purchasePrice: 4,
    packagingPrice: 0, arrival: '2026-09-23T17:53', departure: '2026-12-23T09:42',
    includeArrival: true, includeDeparture: true, peakMonths: [10, 11, 12],
    transport: 'sea', freightBasis: 'actual', freightRate: 8,
    volumetricDivisor: 6000, minimumWeight: 0, commissionBasis: 'gross',
    newProduct: false, storageDiscountPercent: 100,
    includeAdvertising: false, advertising: 600, otherCosts: 0,
    marketplaces: [
      { ...shared, id: 'uk', name: '英国', currency: 'GBP', price: 5, exchangeRate: 8.7876,
        vatPercent: 20, fulfillmentFee: 1.87, storageUnit: 'ft3', offPeakRate: 0.76, peakRate: 1.51 },
      { ...shared, id: 'de', name: '德国', currency: 'EUR', price: 6, exchangeRate: 7.3306,
        vatPercent: 19, fulfillmentFee: 2.02, storageUnit: 'm3', offPeakRate: 27.54, peakRate: 52.2 },
      { ...shared, id: 'fr', name: '法国', currency: 'EUR', price: 6, exchangeRate: 7.3306,
        vatPercent: 20, fulfillmentFee: 3.31, storageUnit: 'm3', offPeakRate: 27.54, peakRate: 52.2 },
    ],
  };
}

const DAY = 86_400_000;

// Treat inputs as Beijing wall-clock times, without relying on the browser's timezone.
function parseDateTime(value: string): { day: number; instant: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match.map(Number);
  if (year < 1900 || year > 2100 || hour > 23 || minute > 59) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { day: date.getTime(), instant: date.getTime() + hour * 3_600_000 + minute * 60_000 };
}

export function validateInput(input: ProfitInput): string[] {
  const errors: string[] = [];
  const check = (value: number, label: string, min = 0, max = 1e9) => {
    if (!Number.isFinite(value) || value < min || value > max) errors.push(`${label}需在 ${min}～${max} 之间。`);
  };
  for (const [label, value] of [['长度', input.length], ['宽度', input.width], ['高度', input.height], ['重量', input.weight]] as const) check(value, label, 0.001, 100_000);
  for (const [label, value] of [['采购单价', input.purchasePrice], ['包装单价', input.packagingPrice], ['头程费率', input.freightRate], ['最低计费重量', input.minimumWeight], ['广告费用', input.advertising], ['其他费用', input.otherCosts]] as const) check(value, label);
  check(input.volumetricDivisor, '体积重系数', 1, 1e9);
  check(input.storageDiscountPercent, '仓储减免比例', 0, 100);
  const start = parseDateTime(input.arrival);
  const end = parseDateTime(input.departure);
  if (!start || !end) errors.push('请填写有效的入库和出库时间（1900～2100 年）。');
  else if (end.instant < start.instant) errors.push('出库时间不能早于入库时间。');
  else if (end.day - start.day > DAY * 366 * 10) errors.push('仓储周期不能超过 10 年。');
  if (!input.marketplaces.some((site) => site.enabled)) errors.push('请至少启用一个站点。');
  for (const site of input.marketplaces.filter((site) => site.enabled)) {
    check(site.quantity, `${site.name}数量`, 1, 1_000_000);
    if (!Number.isInteger(site.quantity)) errors.push(`${site.name}数量必须为整数。`);
    check(site.price, `${site.name}售价`);
    check(site.exchangeRate, `${site.name}汇率`, 0.0001, 100_000);
    check(site.vatPercent, `${site.name} VAT`, 0, 100);
    check(site.commissionPercent, `${site.name}佣金比例`, 0, 100);
    check(site.surchargePercent, `${site.name}附加费比例`, 0, 100);
    if (site.fulfillmentMode === 'manual') check(site.fulfillmentFee, `${site.name}配送费`);
    else {
      const match = resolveFbaFee(input, site);
      if (match.fee === null) errors.push(`${site.name}：${match.reason}`);
    }
    check(site.offPeakRate, `${site.name}淡季仓储费`);
    check(site.peakRate, `${site.name}旺季仓储费`);
  }
  return errors;
}

export function getStorageMonths(input: ProfitInput) {
  const start = parseDateTime(input.arrival);
  const end = parseDateTime(input.departure);
  if (!start || !end || end.instant < start.instant) return [];
  const first = start.day + (input.includeArrival ? 0 : DAY);
  const last = end.day - (input.includeDeparture ? 0 : DAY);
  const months: { label: string; days: number; monthDays: number; peak: boolean }[] = [];
  for (let cursor = first; cursor <= last;) {
    const date = new Date(cursor);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const nextMonth = Date.UTC(year, month + 1, 1);
    const segmentEnd = Math.min(nextMonth - DAY, last);
    months.push({
      label: `${year}-${String(month + 1).padStart(2, '0')}`,
      days: Math.round((segmentEnd - cursor) / DAY) + 1,
      monthDays: new Date(nextMonth - DAY).getUTCDate(),
      peak: input.peakMonths.includes(month + 1),
    });
    cursor = nextMonth;
  }
  return months;
}

export function calculateProfit(input: ProfitInput) {
  const errors = validateInput(input);
  if (errors.length) throw new RangeError(errors.join('\n'));
  const months = getStorageMonths(input);
  const unitVolume = input.length * input.width * input.height / 1_000_000;
  const sites = input.marketplaces.filter((site) => site.enabled).map((site) => {
    const gross = site.price * site.quantity;
    const net = gross / (1 + site.vatPercent / 100);
    const vat = gross - net;
    const commission = (input.commissionBasis === 'gross' ? gross : net) * site.commissionPercent / 100;
    const fulfillmentMatch = resolveFbaFee(input, site);
    const fulfillmentFee = fulfillmentMatch.fee!;
    const fulfillment = fulfillmentFee * (1 + site.surchargePercent / 100) * site.quantity;
    const volume = unitVolume * site.quantity * (site.storageUnit === 'ft3' ? 35.31466672148859 : 1);
    const monthlyStorage = months.map((month) => ({
      ...month,
      rate: month.peak ? site.peakRate : site.offPeakRate,
      cost: volume * (month.peak ? site.peakRate : site.offPeakRate) * month.days / month.monthDays,
    }));
    const storageBeforeDiscount = monthlyStorage.reduce((sum, month) => sum + month.cost, 0);
    const storageSaving = input.newProduct ? storageBeforeDiscount * input.storageDiscountPercent / 100 : 0;
    const storage = storageBeforeDiscount - storageSaving;
    return { ...site, fulfillmentFee, fulfillmentMatch, gross, net, vat, commission, fulfillment, volume, monthlyStorage,
      storageBeforeDiscount, storageSaving, storage, remaining: net - commission - fulfillment - storage };
  });
  const sumCny = (get: (site: typeof sites[number]) => number) => sites.reduce((sum, site) => sum + get(site) * site.exchangeRate, 0);
  const quantity = sites.reduce((sum, site) => sum + site.quantity, 0);
  const gross = sumCny((site) => site.gross);
  const net = sumCny((site) => site.net);
  const vat = sumCny((site) => site.vat);
  const commission = sumCny((site) => site.commission);
  const fulfillment = sumCny((site) => site.fulfillment);
  const storage = sumCny((site) => site.storage);
  const storageBeforeDiscount = sumCny((site) => site.storageBeforeDiscount);
  const storageSaving = sumCny((site) => site.storageSaving);
  const remaining = sumCny((site) => site.remaining);
  const actualWeight = input.weight / 1000 * quantity;
  const volumetricWeight = input.length * input.width * input.height / input.volumetricDivisor * quantity;
  const selectedWeight = input.freightBasis === 'actual' ? actualWeight : input.freightBasis === 'volumetric' ? volumetricWeight : Math.max(actualWeight, volumetricWeight);
  const billableWeight = Math.max(selectedWeight, input.minimumWeight);
  const freight = billableWeight * input.freightRate;
  const purchase = input.purchasePrice * quantity;
  const packaging = input.packagingPrice * quantity;
  const advertising = input.includeAdvertising ? input.advertising : 0;
  const totalCosts = commission + fulfillment + storage + freight + purchase + packaging + advertising + input.otherCosts;
  const profit = net - totalCosts;
  const beforePurchase = remaining - freight - packaging - advertising - input.otherCosts;
  const oldProductProfit = profit - storageSaving;
  const discountedProductProfit = oldProductProfit + storageBeforeDiscount * input.storageDiscountPercent / 100;
  return { sites, months, unitVolume, quantity, gross, net, vat, commission, fulfillment,
    storage, storageBeforeDiscount, storageSaving, remaining, actualWeight, volumetricWeight,
    billableWeight, freight, purchase, packaging, advertising, totalCosts, profit, beforePurchase,
    breakEvenPurchasePrice: beforePurchase / quantity,
    profitPerUnit: profit / quantity,
    margin: net > 0 ? profit / net * 100 : null,
    costReturn: totalCosts > 0 ? profit / totalCosts * 100 : null,
    oldProductProfit, discountedProductProfit,
  };
}

export type ProfitResult = ReturnType<typeof calculateProfit>;
