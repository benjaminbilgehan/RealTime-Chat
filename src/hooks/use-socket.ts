
import { useState, useEffect, useCallback } from 'react';
import socketService, { SocketEvent, User, Room, Message } from '../services/socket';

export function useSocket() {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Handle connection state
  useEffect(() => {
    const handleConnect = (connectedUser: User) => {
      setUser(connectedUser);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setUser(null);
      setCurrentRoom(null);
      setMessages([]);
      setIsConnected(false);
    };

    socketService.on(SocketEvent.CONNECT, handleConnect);
    socketService.on(SocketEvent.DISCONNECT, handleDisconnect);

    return () => {
      socketService.off(SocketEvent.CONNECT, handleConnect);
      socketService.off(SocketEvent.DISCONNECT, handleDisconnect);
    };
  }, []);

  // Handle room list updates
  useEffect(() => {
    const handleRoomList = (updatedRooms: Room[]) => {
      setRooms(updatedRooms);
      
      // Update current room if it has changed
      if (currentRoom) {
        const updatedRoom = updatedRooms.find(room => room.id === currentRoom.id);
        if (updatedRoom) {
          setCurrentRoom(updatedRoom);
        }
      }
    };

    socketService.on(SocketEvent.ROOM_LIST, handleRoomList);
    socketService.on(SocketEvent.ROOM_CREATED, () => {
      setRooms(socketService.getRooms());
    });

    return () => {
      socketService.off(SocketEvent.ROOM_LIST, handleRoomList);
      socketService.off(SocketEvent.ROOM_CREATED, () => {});
    };
  }, [currentRoom]);

  // Handle room joining/leaving
  useEffect(() => {
    const handleJoinRoom = ({ room }: { room: Room, user: User }) => {
      setCurrentRoom(room);
      setMessages(room.messages);
    };

    const handleLeaveRoom = () => {
      setCurrentRoom(null);
      setMessages([]);
    };

    socketService.on(SocketEvent.JOIN_ROOM, handleJoinRoom);
    socketService.on(SocketEvent.LEAVE_ROOM, handleLeaveRoom);

    return () => {
      socketService.off(SocketEvent.JOIN_ROOM, handleJoinRoom);
      socketService.off(SocketEvent.LEAVE_ROOM, handleLeaveRoom);
    };
  }, []);

  // Handle messages
  useEffect(() => {
    const handleMessage = (message: Message) => {
      if (currentRoom && message.roomId === currentRoom.id) {
        setMessages(prev => [...prev, message]);
      }
    };

    socketService.on(SocketEvent.RECEIVE_MESSAGE, handleMessage);

    return () => {
      socketService.off(SocketEvent.RECEIVE_MESSAGE, handleMessage);
    };
  }, [currentRoom]);

  // API methods
  const connect = useCallback((username: string) => {
    return socketService.connect(username);
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    socketService.joinRoom(roomId);
  }, []);

  const leaveRoom = useCallback(() => {
    if (currentRoom) {
      socketService.leaveRoom(currentRoom.id);
    }
  }, [currentRoom]);

  const sendMessage = useCallback((text: string) => {
    socketService.sendMessage(text);
  }, []);

  const createRoom = useCallback((name: string) => {
    socketService.createRoom(name);
  }, []);

  return {
    user,
    rooms,
    currentRoom,
    messages,
    isConnected,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    createRoom
  };
}
