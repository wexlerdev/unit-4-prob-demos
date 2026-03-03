// Safe parseFloat
export function parseNum(val, def = 0) {
  const n = parseFloat(String(val));
  return isNaN(n) ? def : n;
}

// Binomial coefficient
export function binom(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let c = 1;
  for (let i = 0; i < k; i++) {
    c = c * (n - i) / (i + 1);
  }
  return c;
}

// Factorial
export function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

// Standard normal CDF (approximation)
export function normCDF(z) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  function erf(x) {
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

// Normal PDF
export function normPdf(x, mu, sig) {
  return Math.exp(-0.5 * Math.pow((x - mu) / sig, 2)) / (sig * Math.sqrt(2 * Math.PI));
}

// z-value for upper tail probability
export function zForTail(alpha) {
  const zTable = {
    0.25: 0.674, 0.20: 0.842, 0.10: 1.282, 0.05: 1.645,
    0.025: 1.96, 0.02: 2.054, 0.01: 2.326, 0.005: 2.576
  };
  return zTable[alpha] ?? 1.96;
}

// t-quantile table
const tTable = {
  1: { 0.10: 3.078, 0.05: 6.314, 0.025: 12.706, 0.01: 31.821, 0.005: 63.657 },
  2: { 0.10: 1.886, 0.05: 2.920, 0.025: 4.303, 0.01: 6.965, 0.005: 9.925 },
  3: { 0.10: 1.638, 0.05: 2.353, 0.025: 3.182, 0.01: 4.541, 0.005: 5.841 },
  4: { 0.10: 1.533, 0.05: 2.132, 0.025: 2.776, 0.01: 3.747, 0.005: 4.604 },
  5: { 0.10: 1.476, 0.05: 2.015, 0.025: 2.571, 0.01: 3.365, 0.005: 4.032 },
  6: { 0.10: 1.440, 0.05: 1.943, 0.025: 2.447, 0.01: 3.143, 0.005: 3.707 },
  7: { 0.10: 1.415, 0.05: 1.895, 0.025: 2.365, 0.01: 2.998, 0.005: 3.499 },
  8: { 0.10: 1.397, 0.05: 1.860, 0.025: 2.306, 0.01: 2.896, 0.005: 3.355 },
  9: { 0.10: 1.383, 0.05: 1.833, 0.025: 2.262, 0.01: 2.821, 0.005: 3.250 },
  10: { 0.10: 1.372, 0.05: 1.812, 0.025: 2.228, 0.01: 2.764, 0.005: 3.169 },
  11: { 0.10: 1.363, 0.05: 1.796, 0.025: 2.201, 0.01: 2.718, 0.005: 3.106 },
  12: { 0.10: 1.356, 0.05: 1.782, 0.025: 2.179, 0.01: 2.681, 0.005: 3.055 },
  15: { 0.10: 1.341, 0.05: 1.753, 0.025: 2.131, 0.01: 2.602, 0.005: 2.947 },
  20: { 0.10: 1.325, 0.05: 1.725, 0.025: 2.086, 0.01: 2.528, 0.005: 2.845 },
  25: { 0.10: 1.316, 0.05: 1.708, 0.025: 2.060, 0.01: 2.485, 0.005: 2.787 },
  30: { 0.10: 1.310, 0.05: 1.697, 0.025: 2.042, 0.01: 2.457, 0.005: 2.750 },
  40: { 0.10: 1.303, 0.05: 1.684, 0.025: 2.021, 0.01: 2.423, 0.005: 2.704 },
  60: { 0.10: 1.296, 0.05: 1.671, 0.025: 2.000, 0.01: 2.390, 0.005: 2.660 },
  120: { 0.10: 1.289, 0.05: 1.658, 0.025: 1.980, 0.01: 2.358, 0.005: 2.617 }
};

export function tQuantile(df, upperTailAlpha) {
  const d = Math.max(1, Math.floor(df));
  const keys = Object.keys(tTable).map(Number).sort((a, b) => a - b);
  let row = tTable[d];
  if (!row) {
    const higher = keys.find(k => k >= d);
    const lower = [...keys].reverse().find(k => k <= d);
    row = tTable[higher ?? 120] || tTable[lower ?? 1];
  }
  const alpha = [0.10, 0.05, 0.025, 0.01, 0.005].find(a => a <= upperTailAlpha + 0.001) || 0.005;
  return (row && row[alpha]) ?? zForTail(upperTailAlpha);
}

// Binomial PMF
export function binomPmf(n, p, x) {
  if (x < 0 || x > n) return 0;
  return binom(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
}

// Binomial CDF
export function binomCdf(n, p, x) {
  let s = 0;
  for (let k = 0; k <= x; k++) s += binomPmf(n, p, k);
  return s;
}

// Poisson PMF
export function poisPmf(mu, x) {
  return Math.exp(-mu) * Math.pow(mu, x) / factorial(x);
}

// Poisson CDF
export function poisCdf(mu, x) {
  let s = 0;
  for (let k = 0; k <= x; k++) s += poisPmf(mu, k);
  return s;
}

// Linear regression: returns all stats needed for Unit 5 demos
export function linReg(xs, ys) {
  const n = xs.length;
  const xbar = xs.reduce((a, b) => a + b, 0) / n;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  const sxy = xs.reduce((s, x, i) => s + (x - xbar) * (ys[i] - ybar), 0);
  const sx2 = xs.reduce((s, x) => s + (x - xbar) ** 2, 0);
  const b1 = sx2 === 0 ? 0 : sxy / sx2;
  const b0 = ybar - b1 * xbar;
  const yhat = xs.map(x => b0 + b1 * x);
  const residuals = ys.map((y, i) => y - yhat[i]);
  const sse = residuals.reduce((s, e) => s + e * e, 0);
  const sst = ys.reduce((s, y) => s + (y - ybar) ** 2, 0);
  const ssr = sst - sse;
  const r2 = sst === 0 ? 0 : ssr / sst;
  const k = 1;
  const adjR2 = n <= k + 1 ? 0 : 1 - ((1 - r2) * (n - 1)) / (n - k - 1);
  const se = n <= k + 1 ? 0 : Math.sqrt(sse / (n - k - 1));
  return { b0, b1, residuals, yhat, sse, ssr, sst, r2, adjR2, se, xbar, ybar, sxy, sx2, n };
}

// Simple z for percentile (lookup interpolation)
export function simpleZForPct(p) {
  const tbl = [[50,0],[60,0.253],[70,0.524],[80,0.842],[90,1.282],[95,1.645],[97.5,1.96],[99,2.326]];
  if (p <= 50) return -simpleZForPct(100 - p);
  for (let i = tbl.length - 2; i >= 0; i--) {
    if (p >= tbl[i][0]) {
      return tbl[i][1] + (tbl[i+1][1]-tbl[i][1]) * (p - tbl[i][0]) / (tbl[i+1][0] - tbl[i][0]);
    }
  }
  return 2.576;
}
