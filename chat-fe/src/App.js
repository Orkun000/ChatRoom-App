import React, { createContext, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// mobx-react-lite'dan Provider importunu sildik!
import { RoomStore, ChatStore } from "./stores";
import ChatRoom from "./pages/ChatRoom";
import Home from "./pages/Home";
import "./App.css";

export const StoreContext = createContext({
  roomStore: RoomStore,
  chatStore: ChatStore,
});

yazıyoruz;
export const useStores = () => useContext(StoreContext);

function App() {
  return (
    <StoreContext.Provider
      value={{ roomStore: RoomStore, chatStore: ChatStore }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </StoreContext.Provider>
  );
}

export default App;
