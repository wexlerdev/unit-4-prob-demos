# Codebase Summary — Unit 4: Probability & Statistical Inference Demos

## What This Is

A static, no-build-step website of **interactive demos** for **CMP-SC 4350/7350 (Big Data Analytics), Unit 4**. It covers probability and statistical inference across 8 sections (4.1 through 4.8). You open `index.html` in a browser and everything works — no npm, no bundler, no server required.

## File Structure

```
probability_demos/
├── index.html              ← Hub page — grid of cards linking to each demo
├── css/
│   ├── style.css           ← Main stylesheet (dark theme, layout, components)
│   └── flare.css           ← Comic-book "POP" animation on hover/interactions
├── js/
│   ├── shared.js           ← KaTeX auto-render, math utilities (normCDF, binom, factorial, t-table, z-table), Belarus clock widget
│   └── flare.js            ← Cartoon burst animation engine (showFlare)
├── demos/
│   ├── 4.1-probability-concepts.html
│   ├── 4.2-bayes.html
│   ├── 4.3-discrete-rv.html
│   ├── 4.4-binomial-poisson.html
│   ├── 4.5-normal.html
│   ├── 4.6-sampling.html
│   ├── 4.7-confidence.html
│   └── 4.8-hypothesis.html
└── README.md
```

## Content Covered (8 Sections)

| Section | Topic | Key Ideas |
|---------|-------|-----------|
| 4.1 | Probability Concepts & Rules | Sample space, events, Venn diagrams, addition rule, conditional probability, independence |
| 4.2 | Total Probability & Bayes' Theorem | Prior vs posterior, lie detector & medical screening scenarios |
| 4.3 | Discrete Random Variables | Probability distributions, expected value, variance |
| 4.4 | Binomial & Poisson | Bernoulli process, binomial PMF, Poisson process (Starbucks, EV charging examples) |
| 4.5 | Normal Distribution | Bell curve, z-scores, 68-95-99.7 rule |
| 4.6 | Sampling Distributions | CLT, standard error (pizza, coffee, cyber-attack examples) |
| 4.7 | Confidence Intervals | CI for mean (z and t), cereal box & IQ examples |
| 4.8 | Hypothesis Testing | Null vs alternative, p-value, rejection region, Type I/II errors |

The sections build on each other: **Foundations (4.1-4.5) → Sampling (4.6) → Inference (4.7-4.8)**.

## Design / Theme

- **Dark purple/indigo palette** — deep background (`#1e1b2e`), muted purple surface cards, gold accent (`#f5d547`), lavender secondary accent (`#c4b5fd`).
- **Card-based navigation** — the hub page is a responsive CSS grid of clickable cards, one per section, each showing a section number, title, short description, and prerequisite tag.
- **Comic-book "flare" effect** — hover on nav cards triggers a cartoon burst animation using the Bangers font. The `showFlare()` system supports multiple sizes (small/normal/big/subtle) with throttling.
- **Math rendering** via KaTeX (CDN) — formulas appear inline and in display blocks throughout every demo page.
- **Chart.js** (CDN) loaded in demos that need graphs.
- Each demo page follows a consistent layout: header → back-link → "What You'll Learn" concept block → content sections with formulas → interactive demo boxes with inputs/sliders/results → footer.

## Shared JS Utilities (`shared.js`)

- **KaTeX auto-render** on page load (supports `$...$`, `$$...$$`, `\(...\)`, `\[...\]`)
- **Math helpers**: `binom(n,k)`, `factorial(n)`, `normCDF(z)`, `zForTail(alpha)`, `tQuantile(df, alpha)` with a built-in t-distribution table
- **Belarus time indicator**: a fixed-position badge in the top-right corner that says "don't you worry" (green) unless it's midnight in Minsk (red). Updates every 60 seconds.

## Tech Stack

- Pure HTML / CSS / vanilla JS — no frameworks, no build tools
- CDN dependencies only: KaTeX, Chart.js, Google Fonts (Bangers for flare text)
- Responsive down to 600px
