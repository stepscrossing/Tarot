import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import DrawScreen from './components/DrawScreen';
import ResultScreen from './components/ResultScreen';
import HistoryScreen from './components/HistoryScreen';
import InterpretationScreen from './components/InterpretationScreen';
import AllCardsScreen from './components/AllCardsScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-full text-foreground bg-background font-serif antialiased selection:bg-gold/30">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/draw" element={<DrawScreen />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/reading" element={<InterpretationScreen />} />
          <Route path="/cards" element={<AllCardsScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
