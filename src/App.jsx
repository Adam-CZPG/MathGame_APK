import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import Badges from './pages/Badges' // 1. Yangi sahifani import qildik

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:levelId" element={<Game />} />
        <Route path="/badges" element={<Badges />} /> {/* 2. Yo'nalishni (Route) uladik */}
      </Routes>
    </Router>
  )
}