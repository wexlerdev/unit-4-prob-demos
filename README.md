# Big Data Analytics — Interactive Demos

A collection of interactive demos covering probability, statistical inference, and regression analysis for CMP-SC 4350/7350 (Big Data Analytics).

**Live site:** [bigdata.rodeo](https://bigdata.rodeo)

## What it does

The app walks through two units of course material with interactive visualizations:

**Unit 4 — Probability & Statistical Inference**
- Probability concepts, Bayes' theorem, discrete random variables
- Binomial & Poisson distributions, normal distribution
- Sampling distributions, confidence intervals, hypothesis testing

**Unit 5 — Regression Analysis**
- Linear regression model, goodness-of-fit, significance tests
- Model assumptions & violations, interaction variables
- Nonlinear relationships, cross-validation, full workflow

Each section has interactive controls — sliders, inputs, and live-updating charts — so you can adjust parameters and see how formulas and distributions respond in real time.

The landing page features a 3D question mark model with particle effects, built with Three.js.

## Tech stack

- React 18 + Vite
- Chart.js / react-chartjs-2 for visualizations
- KaTeX for math rendering
- Three.js for the 3D landing scene (Draco-compressed GLB model)
- Deployed on Cloudflare Pages

## Running locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

Output goes to `dist/`.
