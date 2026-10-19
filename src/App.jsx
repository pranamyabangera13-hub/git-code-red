import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ReportPage from './ReportPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
