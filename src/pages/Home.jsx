import { useState } from 'react';
import { Link } from 'react-router-dom';
import { showFlare } from '../utils/flare';
import FlowChart from '../components/FlowChart';

const cards4 = [
  { num: '4.1', path: '/4.1', title: 'Probability Concepts & Rules', desc: 'Sample space, events, Venn diagrams, addition rule, conditional probability, independence', prereq: 'Foundation' },
  { num: '4.2', path: '/4.2', title: "Total Probability & Bayes' Theorem", desc: 'Prior vs posterior, lie detector, medical screening', prereq: 'Builds on 4.1' },
  { num: '4.3', path: '/4.3', title: 'Discrete Random Variables', desc: 'Probability distributions, expected value, variance, coin flips, bonuses', prereq: 'Builds on 4.1' },
  { num: '4.4', path: '/4.4', title: 'Binomial & Poisson', desc: 'Bernoulli process, binomial PMF, Poisson process, Starbucks, EV charging', prereq: 'Builds on 4.3' },
  { num: '4.5', path: '/4.5', title: 'Normal Distribution', desc: 'Bell curve, z-scores, 68–95–99.7 rule, management exam', prereq: 'Builds on 4.3' },
  { num: '4.6', path: '/4.6', title: 'Sampling Distributions', desc: 'CLT, standard error, pizza, Coffee Happy Hour, cyber-attacks', prereq: 'Builds on 4.5' },
  { num: '4.7', path: '/4.7', title: 'Confidence Intervals', desc: 'CI for mean (z and t), cereal boxes, IQ example', prereq: 'Builds on 4.6' },
  { num: '4.8', path: '/4.8', title: 'Hypothesis Testing', desc: 'Null vs alternative, p-value, rejection region, cereal weight test', prereq: 'Builds on 4.7' },
];

const cards5 = [
  { num: '5.1', path: '/5.1', title: 'Introduction to Regression', desc: 'Modeling relationships, simple vs multiple, deterministic vs stochastic, variable types', prereq: 'Foundation' },
  { num: '5.2', path: '/5.2', title: 'Regression Equation & OLS', desc: 'Population vs sample parameters, OLS minimization, slope & intercept formulas', prereq: 'Builds on 5.1' },
  { num: '5.3', path: '/5.3', title: 'Interpreting Coefficients & Residuals', desc: 'Plain-English interpretation, dummy variables, reference groups, residual patterns', prereq: 'Builds on 5.2' },
  { num: '5.4', path: '/5.4', title: 'Goodness of Fit', desc: 'SST = SSR + SSE, R², Adjusted R², standard error of the estimate', prereq: 'Builds on 5.2' },
  { num: '5.5', path: '/5.5', title: 'Key Terms & Critical Distinctions', desc: 'All Unit 5 terminology, formulas, and important contrasts in one reference page', prereq: 'Reference' },
];

// ── Unit 4 flow graph ──
// Layout:     4.1 ──→ 4.2
//              │
//              ↓
//             4.3 ──→ 4.4
//              │
//              ↓
//             4.5 ──→ 4.6 ──→ 4.7 ──→ 4.8
const flow4Nodes = [
  { x: 1, y: 4, r: 24, label: '4.1\nProbability',    bg: 'rgba(245,213,71,0.25)',  border: '#f5d547' },
  { x: 3, y: 4, r: 22, label: '4.2\nBayes',           bg: 'rgba(196,181,253,0.2)',  border: '#c4b5fd' },
  { x: 1, y: 2, r: 24, label: '4.3\nDiscrete RV',     bg: 'rgba(245,213,71,0.25)',  border: '#f5d547' },
  { x: 3, y: 2, r: 22, label: '4.4\nBinom/Poisson',   bg: 'rgba(196,181,253,0.2)',  border: '#c4b5fd' },
  { x: 5, y: 2, r: 24, label: '4.5\nNormal',          bg: 'rgba(245,213,71,0.25)',  border: '#f5d547' },
  { x: 7, y: 2, r: 26, label: '4.6\nSampling',        bg: 'rgba(158,206,106,0.2)',  border: '#9ece6a' },
  { x: 9, y: 2, r: 24, label: '4.7\nConf. Int.',      bg: 'rgba(229,181,103,0.2)',  border: '#e5b567' },
  { x: 11, y: 2, r: 24, label: '4.8\nHyp. Test',      bg: 'rgba(247,118,142,0.2)',  border: '#f7768e' },
];
// edges: [fromIndex, toIndex]
const flow4Edges = [
  [0, 1], // 4.1 → 4.2
  [0, 2], // 4.1 → 4.3
  [2, 3], // 4.3 → 4.4
  [2, 4], // 4.3 → 4.5
  [4, 5], // 4.5 → 4.6
  [5, 6], // 4.6 → 4.7
  [6, 7], // 4.7 → 4.8
];
const flow4Groups = [
  { x: 2,  label: 'FOUNDATIONS', color: 'rgba(245,213,71,0.5)' },
  { x: 7,  label: 'BRIDGE',     color: 'rgba(158,206,106,0.5)' },
  { x: 10, label: 'INFERENCE',  color: 'rgba(247,118,142,0.5)' },
];

// ── Unit 5 flow graph ──
// Layout:  5.1 ──→ 5.2 ──→ 5.3
//                    │
//                    ↓
//                   5.4        5.5 (reference, standalone)
const flow5Nodes = [
  { x: 1, y: 2, r: 24, label: '5.1\nIntro',           bg: 'rgba(245,213,71,0.25)',  border: '#f5d547' },
  { x: 4, y: 2, r: 26, label: '5.2\nOLS',             bg: 'rgba(196,181,253,0.25)', border: '#c4b5fd' },
  { x: 7, y: 3, r: 24, label: '5.3\nInterpret',       bg: 'rgba(158,206,106,0.2)',  border: '#9ece6a' },
  { x: 7, y: 1, r: 24, label: '5.4\nGoodness',        bg: 'rgba(229,181,103,0.2)',  border: '#e5b567' },
  { x: 10, y: 2, r: 22, label: '5.5\nReference',      bg: 'rgba(247,118,142,0.15)', border: '#f7768e' },
];
const flow5Edges = [
  [0, 1], // 5.1 → 5.2
  [1, 2], // 5.2 → 5.3
  [1, 3], // 5.2 → 5.4
];
const flow5Groups = [
  { x: 1,  label: 'SETUP',       color: 'rgba(245,213,71,0.5)' },
  { x: 4,  label: 'ESTIMATION',  color: 'rgba(196,181,253,0.5)' },
  { x: 7,  label: 'ANALYSIS',    color: 'rgba(158,206,106,0.5)' },
  { x: 10, label: 'CHEAT SHEET', color: 'rgba(247,118,142,0.5)' },
];

export default function Home() {
  const [tab, setTab] = useState('unit4');

  return (
    <>
      <nav className="tab-bar">
        <Link to="/" className="nav-logo">
          <svg className="nav-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          </svg>
          Big Data
        </Link>
        <div className="tab-buttons">
          <button className={`tab-btn ${tab === 'unit4' ? 'active' : ''}`} onClick={() => setTab('unit4')}>Unit 4</button>
          <button className={`tab-btn ${tab === 'unit5' ? 'active' : ''}`} onClick={() => setTab('unit5')}>Unit 5</button>
        </div>
      </nav>

      {tab === 'unit4' && (
        <div>
          <div className="flow-block">
            <h2>Conceptual Flow</h2>
            <FlowChart nodes={flow4Nodes} edges={flow4Edges} groups={flow4Groups} height={240} />
          </div>

          <main className="nav-grid">
            {cards4.map(c => (
              <Link
                key={c.num}
                to={c.path}
                className="nav-card"
                onMouseEnter={e => showFlare('POP', e.currentTarget, { size: 'subtle', key: 'nav' })}
              >
                <span className="nav-num">{c.num}</span>
                <h2>{c.title}</h2>
                <p>{c.desc}</p>
                <span className="nav-prereq">{c.prereq}</span>
              </Link>
            ))}
          </main>
        </div>
      )}

      {tab === 'unit5' && (
        <div>
          <div className="flow-block">
            <h2>Conceptual Flow</h2>
            <FlowChart nodes={flow5Nodes} edges={flow5Edges} groups={flow5Groups} height={220} />
          </div>

          <main className="nav-grid">
            {cards5.map(c => (
              <Link
                key={c.num}
                to={c.path}
                className="nav-card"
                onMouseEnter={e => showFlare('POP', e.currentTarget, { size: 'subtle', key: 'nav' })}
              >
                <span className="nav-num">{c.num}</span>
                <h2>{c.title}</h2>
                <p>{c.desc}</p>
                <span className="nav-prereq">{c.prereq}</span>
              </Link>
            ))}
          </main>
        </div>
      )}
    </>
  );
}
