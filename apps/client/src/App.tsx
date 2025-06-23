import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './components/Landing-page/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App