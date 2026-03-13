import { makeAutoObservable } from "mobx";

class ChatStore {
  messages = [];
  users = new Set();
  connected = false;
  roomInfo = null;
  timeLeft = "";
  isUpdateModalOpen = false;
  updateLoading = false;
  username = "";
  isAdmin = false;

  constructor() {
    makeAutoObservable(this);
  }

  setMessages(messages) {
    this.messages = messages;
  }

  addMessage(message) {
    this.messages = [...this.messages, message];
  }

  setUsers(users) {
    this.users = users;
  }

  addUser(user) {
    this.users = new Set([...this.users, user]);
  }

  removeUser(user) {
    const newUsers = new Set(this.users);
    newUsers.delete(user);
    this.users = newUsers;
  }

  setConnected(connected) {
    this.connected = connected;
  }

  setRoomInfo(info) {
    this.roomInfo = info;
  }

  setTimeLeft(time) {
    this.timeLeft = time;
  }

  setUpdateModalOpen(open) {
    this.isUpdateModalOpen = open;
  }

  setUpdateLoading(loading) {
    this.updateLoading = loading;
  }

  setUsername(username) {
    this.username = username;
  }

  setIsAdmin(isAdmin) {
    this.isAdmin = isAdmin;
  }

  reset() {
    this.messages = [];
    this.users = new Set();
    this.connected = false;
    this.roomInfo = null;
    this.timeLeft = "";
    this.isUpdateModalOpen = false;
    this.updateLoading = false;
  }
}

export default new ChatStore();
