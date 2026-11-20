import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateProfit, createDefaultInput, getStorageMonths, validateInput, resolveFbaFee, FBA_RATE_TABLE } from '../src/lib/amazon-profit.ts';

const close = (actual, expected, tolerance = 0.01) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≈ ${expected}`);

test('default case accounts for all three sites without intermediate rounding', () => {
  const result = calculateProfit(createDefaultInput());
  assert.equal(result.quantity, 300);
  assert.deepEqual(result.months.map((month) => month.days), [8, 31, 30, 23]);
  close(result.unitVolume, 0.0018975, 1e-10);
  close(result.net, 11022.90084);
  close(result.storage, 674.34876);
  close(result.freight, 960);
  close(result.profit, 548.47326);
  close(result.totalCosts, 10474.42758);
  close(result.breakEvenPurchasePrice, 5.828244);
  close(result.net - result.totalCosts, result.profit, 1e-8);
});

test('new-product discount and advertising change profit by their exact costs', () => {
  const input = createDefaultInput();
  const baseline = calculateProfit(input);
  input.newProduct = true;
  const freeStorage = calculateProfit(input);
  assert.equal(freeStorage.storage, 0);
  close(freeStorage.profit - baseline.profit, baseline.storage, 1e-8);
  close(freeStorage.profit, 1222.82202);
  input.includeAdvertising = true;
  close(calculateProfit(input).profit, freeStorage.profit - 600, 1e-8);
  input.storageDiscountPercent = 50;
  close(calculateProfit(input).storage, baseline.storage / 2, 1e-8);
});

test('storage splits leap months and year boundaries and honors day inclusion', () => {
  const input = createDefaultInput();
  input.arrival = '2024-02-28T23:59';
  input.departure = '2024-03-01T00:01';
  assert.deepEqual(getStorageMonths(input).map(({ days, monthDays }) => [days, monthDays]), [[2, 29], [1, 31]]);
  input.includeArrival = false;
  input.includeDeparture = false;
  assert.deepEqual(getStorageMonths(input).map((month) => month.days), [1]);
  input.arrival = '2025-12-31T00:00';
  input.departure = '2026-01-01T00:00';
  input.includeArrival = input.includeDeparture = true;
  assert.deepEqual(getStorageMonths(input).map((month) => month.label), ['2025-12', '2026-01']);
  input.arrival = input.departure;
  assert.equal(getStorageMonths(input)[0].days, 1);
  input.includeDeparture = false;
  assert.deepEqual(getStorageMonths(input), []);
});

test('disabled sites are excluded and freight uses the chosen weight basis', () => {
  const input = createDefaultInput();
  input.marketplaces[1].enabled = input.marketplaces[2].enabled = false;
  input.marketplaces[1].quantity = NaN;
  let result = calculateProfit(input);
  assert.equal(result.quantity, 100);
  assert.equal(result.sites.length, 1);
  close(result.actualWeight, 40);
  input.freightBasis = 'higher';
  input.height = 25;
  result = calculateProfit(input);
  close(result.billableWeight, 316.25);
  input.minimumWeight = 400;
  close(calculateProfit(input).freight, 3200);
});

test('invalid dates, quantities, rates and empty inputs do not produce results', () => {
  const cases = [
    (input) => { input.arrival = '2026-02-30T00:00'; },
    (input) => { input.departure = '2026-09-23T17:52'; },
    (input) => { input.marketplaces[0].quantity = 1.5; },
    (input) => { input.marketplaces[0].exchangeRate = 0; },
    (input) => { input.marketplaces[0].price = -1; },
    (input) => { input.weight = NaN; },
    (input) => { input.storageDiscountPercent = 101; },
    (input) => { input.marketplaces.forEach((site) => { site.enabled = false; }); },
  ];
  for (const mutate of cases) {
    const input = createDefaultInput();
    mutate(input);
    assert.ok(validateInput(input).length > 0);
    assert.throws(() => calculateProfit(input), RangeError);
  }
});

test('zero revenue, loss and extra costs keep break-even and profit internally consistent', () => {
  const input = createDefaultInput();
  input.marketplaces.forEach((site) => { site.price = 0; });
  const zeroRevenue = calculateProfit(input);
  assert.equal(zeroRevenue.margin, null);
  assert.ok(zeroRevenue.profit < 0);
  assert.ok(zeroRevenue.breakEvenPurchasePrice < 0);
  input.packagingPrice = 1;
  input.otherCosts = 200;
  const extraCosts = calculateProfit(input);
  close(extraCosts.profit, zeroRevenue.profit - 500, 1e-8);
  close(extraCosts.breakEvenPurchasePrice * extraCosts.quantity - input.purchasePrice * extraCosts.quantity, extraCosts.profit, 1e-8);
});

test('changing commission base and storage unit uses supplied rates', () => {
  const input = createDefaultInput();
  const baseline = calculateProfit(input);
  input.commissionBasis = 'net';
  const result = calculateProfit(input);
  close(result.commission, result.net * 0.15, 1e-8);
  assert.ok(result.profit > baseline.profit);
  input.marketplaces[0].storageUnit = 'm3';
  input.marketplaces[0].offPeakRate *= 35.31466672148859;
  input.marketplaces[0].peakRate *= 35.31466672148859;
  close(calculateProfit(input).storage, result.storage, 1e-8);
});

test('FBA picture rates cover all known size and weight boundaries for existing sites', () => {
  const samples = [
    [33, 23, 2.5, 20], [33, 23, 2.5, 40], [33, 23, 2.5, 60],
    [33, 23, 2.5, 80], [33, 23, 2.5, 100], [33, 23, 2.5, 210], [33, 23, 2.5, 460],
    [33, 25, 12, 150], [33, 25, 12, 400], [33, 25, 12, 900],
    [45, 34, 26, 150], [45, 34, 26, 400], [45, 34, 26, 900], [45, 34, 26, 1400],
  ];
  const expected = {
    uk: { low: [1.46, 1.50, 1.52, 1.67, 1.70, 1.73, 1.87, 2.67, 2.70, 3.04, 2.94, 3.01, 3.06, 3.26], normal: [1.83, 1.87, 1.89, 2.07, 2.08, 2.10, 2.16, 2.91, 3, 3.04, 2.94, 3.01, 3.06, 3.26] },
    de: { low: [1.61, 1.64, 1.66, 1.80, 1.83, 1.86, 2.02, 2.78, 2.99, 3.41, 3.13, 3.52, 3.64, 4.28], normal: [2.07, 2.11, 2.13, 2.26, 2.28, 2.31, 2.42, 3.12, 3.14, 3.41, 3.13, 3.52, 3.64, 4.28] },
    fr: { low: [2.24, 2.26, 2.27, 2.79, 2.81, 2.81, 3.31, 4.31, 4.71, 5.79, 4.58, 5.40, 6.28, 6.41], normal: [2.75, 2.76, 2.78, 3.30, 3.32, 3.33, 3.77, 4.56, 5.07, 5.79, 4.58, 5.40, 6.28, 6.41] },
  };
  for (const [id, fees] of Object.entries(expected)) {
    samples.forEach(([length, width, height, weight], index) => {
      const product = { length, width, height, weight };
      const site = { id, price: FBA_RATE_TABLE[id].threshold, fulfillmentFee: 99 };
      assert.equal(resolveFbaFee(product, site).fee, fees.low[index], `${id} low tier ${index}`);
      assert.equal(resolveFbaFee(product, { ...site, price: site.price + 0.01 }).fee, fees.normal[index]);
      assert.equal(resolveFbaFee(product, { ...site, fulfillmentMode: 'normal' }).fee, fees.normal[index]);
    });
  }
});

test('FBA boundaries use dimensions independently of orientation and never round down weight', () => {
  const site = { id: 'uk', price: 5, fulfillmentFee: 8 };
  const product = { length: 33, width: 23, height: 2.5, weight: 20 };
  assert.equal(resolveFbaFee({ ...product, length: 2.5, height: 33 }, site).fee, 1.46);
  assert.equal(resolveFbaFee({ ...product, weight: 20.001 }, site).fee, 1.5);
  assert.equal(resolveFbaFee({ ...product, weight: 100.001 }, site).fee, 1.73);
  assert.equal(resolveFbaFee({ ...product, weight: 210.001 }, site).fee, 1.87);
  assert.equal(resolveFbaFee({ ...product, width: 23.001 }, site).fee, 2.67);
  assert.equal(resolveFbaFee({ ...product, height: 2.501 }, site).fee, 2.42);
  assert.equal(resolveFbaFee({ ...product, weight: 460.001 }, site).fee, 3.04);
  assert.equal(resolveFbaFee({ ...product, height: 5 }, site).fee, 2.65);
  assert.equal(resolveFbaFee({ length: 46, width: 34, height: 26, weight: 100 }, site).fee, null);
  assert.equal(resolveFbaFee({ length: 45, width: 34, height: 26, weight: 1400.001 }, site).fee, null);
  assert.equal(resolveFbaFee({ ...product, weight: NaN }, site).fee, null);
});

test('thickness selects large envelopes before parcels, then parcel weight bands', () => {
  const product = { length: 33, width: 23, height: 4, weight: 900 };
  for (const id of Object.keys(FBA_RATE_TABLE)) {
    const site = { id, price: FBA_RATE_TABLE[id].threshold, fulfillmentFee: 99 };
    const rates = FBA_RATE_TABLE[id];
    assert.equal(resolveFbaFee(product, site).fee, rates.low[7]);
    assert.equal(resolveFbaFee({ ...product, height: 4.001 }, site).fee, rates.low[8]);
    assert.equal(resolveFbaFee({ ...product, height: 6 }, site).fee, rates.low[8]);
    assert.equal(resolveFbaFee({ ...product, height: 6.001, weight: 150 }, site).fee, rates.low[9]);
    assert.equal(resolveFbaFee({ ...product, height: 6.001, weight: 150.001 }, site).fee, rates.low[10]);
    assert.equal(resolveFbaFee({ ...product, height: 6.001, weight: 400.001 }, site).fee, rates.normal[11]);
    assert.equal(resolveFbaFee(product, { ...site, fulfillmentMode: 'normal' }).fee, rates.normal[7]);
    assert.equal(resolveFbaFee({ ...product, height: 6 }, { ...site, price: site.price + 0.01 }).fee, rates.normal[8]);
  }
});

test('FBA auto rates propagate into profit and manual fees are honored', () => {
  const input = createDefaultInput();
  const baseline = calculateProfit(input);
  input.marketplaces[0].price = 10.01;
  let result = calculateProfit(input);
  assert.equal(result.sites[0].fulfillmentFee, 2.16);
  close(result.sites[0].fulfillment, 2.16 * 1.02 * 100, 1e-8);
  input.marketplaces[0].fulfillmentMode = 'manual';
  input.marketplaces[0].fulfillmentFee = 4;
  result = calculateProfit(input);
  close(result.sites[0].fulfillment, 4 * 1.02 * 100, 1e-8);
  input.height = 100;
  assert.ok(validateInput(input).some((error) => error.includes('切换手动报价')));
  input.marketplaces.forEach((site) => { site.fulfillmentMode = 'manual'; });
  assert.doesNotThrow(() => calculateProfit(input));
  assert.equal(baseline.sites[0].fulfillmentFee, 1.87);
});
