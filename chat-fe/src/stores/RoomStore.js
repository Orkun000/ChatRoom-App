import { makeAutoObservable } from 'mobx';

class RoomStore {
  publicRooms = [];
  isCreateModalOpen = false;
  isJoinModalOpen = false;
  selectedRoomId = null;
  joinPassword = '';
  isPasswordEnabled = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPublicRooms(rooms) {
    this.publicRooms = rooms;
  }

  setCreateModalOpen(open) {
    this.isCreateModalOpen = open;
  }

  setJoinModalOpen(open) {
    this.isJoinModalOpen = open;
  }

  setSelectedRoom(roomId) {
    this.selectedRoomId = roomId;
  }

  setJoinPassword(password) {
    this.joinPassword = password;
  }

  setPasswordEnabled(enabled) {
    this.isPasswordEnabled = enabled;
  }

  setLoading(loading) {
    this.loading = loading;
  }

  resetJoinModal() {
    this.isJoinModalOpen = false;
    this.selectedRoomId = null;
    this.joinPassword = '';
  }
}

export default new RoomStore();