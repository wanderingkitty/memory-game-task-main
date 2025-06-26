import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './components/Landing-page/LandingPage';
import GameBoardComponent from './components/Game-page/GameBoardComponent';

function App() {
  return (
    <BrowserRouter basename="/memory-game-task-main">
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/board-page" element={<GameBoardComponent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App