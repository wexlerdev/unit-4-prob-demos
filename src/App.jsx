import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Demo41 from './pages/Demo41';
import Demo42 from './pages/Demo42';
import Demo43 from './pages/Demo43';
import Demo44 from './pages/Demo44';
import Demo45 from './pages/Demo45';
import Demo46 from './pages/Demo46';
import Demo47 from './pages/Demo47';
import Demo48 from './pages/Demo48';
import Demo51 from './pages/Demo51';
import Demo52 from './pages/Demo52';
import Demo53 from './pages/Demo53';
import Demo54 from './pages/Demo54';
import Demo55 from './pages/Demo55';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/4.1" element={<Demo41 />} />
        <Route path="/4.2" element={<Demo42 />} />
        <Route path="/4.3" element={<Demo43 />} />
        <Route path="/4.4" element={<Demo44 />} />
        <Route path="/4.5" element={<Demo45 />} />
        <Route path="/4.6" element={<Demo46 />} />
        <Route path="/4.7" element={<Demo47 />} />
        <Route path="/4.8" element={<Demo48 />} />
        <Route path="/5.1" element={<Demo51 />} />
        <Route path="/5.2" element={<Demo52 />} />
        <Route path="/5.3" element={<Demo53 />} />
        <Route path="/5.4" element={<Demo54 />} />
        <Route path="/5.5" element={<Demo55 />} />
      </Route>
    </Routes>
  );
}
