import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header>
        <h1>Big Data Analytics — Interactive Demos</h1>
        <p className="subtitle">CMP-SC 4350/7350</p>
      </header>
      <Outlet />
      <footer>
        <Link to="/">← Back to all sections</Link>
      </footer>
    </>
  );
}
