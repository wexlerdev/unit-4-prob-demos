import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath } from 'react-katex';
import { showFlare } from '../utils/flare';

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

export default function Home() {
  const [tab, setTab] = useState('unit4');

  return (
    <>
      <nav className="tab-bar">
        <button className={`tab-btn ${tab === 'unit4' ? 'active' : ''}`} onClick={() => setTab('unit4')}>Unit 4</button>
        <button className={`tab-btn ${tab === 'unit5' ? 'active' : ''}`} onClick={() => setTab('unit5')}>Unit 5</button>
      </nav>

      {tab === 'unit4' && (
        <div>
          <div className="flow-block">
            <h2>Conceptual Flow</h2>
            <p><strong>4.1–4.5 Foundations</strong> → basic probability, Bayes, random variables, common distributions (binomial, Poisson, normal). <strong>4.6 Sampling</strong> → how <InlineMath math="\bar{X}" /> and <InlineMath math="\hat{P}" /> behave across samples; the bridge to inference. <strong>4.7–4.8 Inference</strong> → confidence intervals and hypothesis testing.</p>
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
            <p><strong>5.1 Introduction</strong> → what regression does, variable types, deterministic vs stochastic. <strong>5.2 OLS</strong> → the equation, how least squares works, slope &amp; intercept formulas. <strong>5.3 Interpretation</strong> → reading coefficients, handling categorical predictors, residuals. <strong>5.4 Fit</strong> → variance decomposition, R², Adjusted R², standard error. <strong>5.5 Reference</strong> → all terms and distinctions.</p>
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
