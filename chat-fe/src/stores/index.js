import { createContext, useContext } from 'react';
import RoomStore from './RoomStore';
import ChatStore from './ChatStore';

const storeContext = createContext({
  roomStore: RoomStore,
  chatStore: ChatStore,
});

export const useStore = () => useContext(storeContext);

export { RoomStore, ChatStore };