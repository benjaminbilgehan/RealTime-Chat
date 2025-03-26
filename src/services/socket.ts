
import { io, Socket } from 'socket.io-client';
import { toast } from "sonner";

// Types for our socket events
export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  timestamp: number;
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
}

// Socket events
export enum SocketEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  SEND_MESSAGE = 'send_message',
  RECEIVE_MESSAGE = 'receive_message',
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  ROOM_LIST = 'room_list',
  CREATE_ROOM = 'create_room',
  ROOM_CREATED = 'room_created'
}

// Mock data for development (simulating a backend)
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'General',
    users: [],
    messages: []
  },
  {
    id: '2',
    name: 'Design',
    users: [],
    messages: []
  }
];

class SocketService {
  private socket: Socket | null = null;
  private user: User | null = null;
  private rooms: Room[] = [...mockRooms];
  private currentRoomId: string | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  // Generate a fake connection using local storage
  connect(username: string): Promise<User> {
    return new Promise((resolve) => {
      // Simulate connecting to a socket server
      setTimeout(() => {
        this.user = {
          id: `user_${Date.now()}`,
          username
        };
        
        // Notify all listeners
        this.notifyListeners(SocketEvent.CONNECT, this.user);
        
        // Notify room list
        this.notifyListeners(SocketEvent.ROOM_LIST, this.rooms);
        
        toast.success(`Connected as ${username}`);
        resolve(this.user);
      }, 500);
    });
  }

  disconnect(): void {
    if (!this.socket && !this.user) return;
    
    // Leave current room if in one
    if (this.currentRoomId) {
      this.leaveRoom(this.currentRoomId);
    }
    
    // Reset state
    this.user = null;
    this.currentRoomId = null;
    
    // Notify listeners
    this.notifyListeners(SocketEvent.DISCONNECT, null);
    toast.info('Disconnected from chat');
  }

  joinRoom(roomId: string): void {
    if (!this.user) {
      toast.error('Must be logged in to join a room');
      return;
    }

    // Leave current room if in one
    if (this.currentRoomId) {
      this.leaveRoom(this.currentRoomId);
    }

    // Find the room
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) {
      toast.error('Room not found');
      return;
    }

    // Add user to room
    room.users.push(this.user);
    this.currentRoomId = roomId;

    // Notify room join
    this.notifyListeners(SocketEvent.JOIN_ROOM, { room, user: this.user });
    this.notifyListeners(SocketEvent.USER_JOINED, { room, user: this.user });
    
    // Send room list update
    this.notifyListeners(SocketEvent.ROOM_LIST, this.rooms);
  }

  leaveRoom(roomId: string): void {
    if (!this.user) return;

    // Find the room
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return;

    // Remove user from room
    room.users = room.users.filter(u => u.id !== this.user?.id);
    if (this.currentRoomId === roomId) {
      this.currentRoomId = null;
    }

    // Notify room leave
    this.notifyListeners(SocketEvent.LEAVE_ROOM, { room, user: this.user });
    this.notifyListeners(SocketEvent.USER_LEFT, { room, user: this.user });
    
    // Send room list update
    this.notifyListeners(SocketEvent.ROOM_LIST, this.rooms);
  }

  sendMessage(text: string): void {
    if (!this.user || !this.currentRoomId) {
      toast.error('Must be in a room to send messages');
      return;
    }

    // Find the room
    const room = this.rooms.find(r => r.id === this.currentRoomId);
    if (!room) return;

    // Create message
    const message: Message = {
      id: `msg_${Date.now()}`,
      text,
      sender: this.user,
      timestamp: Date.now(),
      roomId: this.currentRoomId
    };

    // Add to room messages
    room.messages.push(message);

    // Notify message received
    this.notifyListeners(SocketEvent.RECEIVE_MESSAGE, message);
  }

  createRoom(name: string): void {
    if (!this.user) {
      toast.error('Must be logged in to create a room');
      return;
    }

    // Validate room name
    if (!name || name.trim() === '') {
      toast.error('Room name cannot be empty');
      return;
    }

    // Check if room already exists
    if (this.rooms.some(r => r.name.toLowerCase() === name.toLowerCase())) {
      toast.error('A room with that name already exists');
      return;
    }

    // Create new room
    const newRoom: Room = {
      id: `room_${Date.now()}`,
      name,
      users: [],
      messages: []
    };

    // Add to rooms
    this.rooms.push(newRoom);

    // Notify room created
    this.notifyListeners(SocketEvent.ROOM_CREATED, newRoom);
    
    // Send room list update
    this.notifyListeners(SocketEvent.ROOM_LIST, this.rooms);
    
    toast.success(`Room "${name}" created`);
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getCurrentRoom(): Room | null {
    if (!this.currentRoomId) return null;
    return this.rooms.find(r => r.id === this.currentRoomId) || null;
  }

  // Event listener methods
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  private notifyListeners(event: string, data: any): void {
    this.listeners.get(event)?.forEach(callback => {
      callback(data);
    });
  }
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;
