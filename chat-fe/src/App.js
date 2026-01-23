import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ChatRoom from "./pages/ChatRoom";
import "./App.css"; // Ant Design stilleri için

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
