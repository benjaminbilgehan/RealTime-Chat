
import React, { useState, useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import RoomList from "@/components/RoomList";
import UserList from "@/components/UserList";
import ChatRoom from "@/components/ChatRoom";
import CreateRoomModal from "@/components/CreateRoomModal";
import { Room, User, Message } from "@/types";
import socket, { getRooms, getRoomUsers } from "@/lib/socket";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

declare global {
  interface Window {
    socket: any;
  }
}

// Assign socket to window for global access in components
window.socket = socket;

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  // Authentication handler
  const handleLogin = (username: string) => {
    const userId = socket.id;
    setUser({ id: userId, username });
    
    // Initialize the rooms data
    fetchRooms();
  };

  // Fetch available rooms
  const fetchRooms = async () => {
    try {
      const roomsData = await getRooms();
      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    }
  };

  // Handle room selection
  const handleRoomSelect = (roomId: string) => {
    setCurrentRoomId(roomId);
  };

  // Handle room creation
  const handleRoomCreated = (roomId: string) => {
    fetchRooms();
    setCurrentRoomId(roomId);
  };

  // Set up socket event listeners
  useEffect(() => {
    if (!user) return;

    const handleRoomsUpdate = () => {
      fetchRooms();
    };

    const handleUserJoined = (data: { roomId: string; user: User }) => {
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === data.roomId 
            ? { ...room, users: [...room.users, data.user] } 
            : room
        )
      );
    };

    const handleUserLeft = (data: { roomId: string; userId: string }) => {
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === data.roomId 
            ? { ...room, users: room.users.filter(u => u.id !== data.userId) } 
            : room
        )
      );
    };

    const handleNewMessage = (message: Message) => {
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === message.roomId 
            ? { ...room, messages: [...(room.messages || []), message] } 
            : room
        )
      );
    };

    // Register event listeners
    socket.on("rooms_updated", handleRoomsUpdate);
    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);
    socket.on("new_message", handleNewMessage);

    // Cleanup function
    return () => {
      socket.off("rooms_updated", handleRoomsUpdate);
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);
      socket.off("new_message", handleNewMessage);
    };
  }, [user]);

  // If not authenticated, show the auth form
  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  // Find the current room
  const currentRoom = rooms.find(room => room.id === currentRoomId) || null;

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h1 className="text-xl font-medium">Chat App</h1>
          <p className="text-sm text-gray-500">Logged in as {user.username}</p>
        </div>
        
        <RoomList
          rooms={rooms}
          currentRoomId={currentRoomId}
          onRoomSelect={handleRoomSelect}
          onCreateRoom={() => setIsCreateRoomModalOpen(true)}
        />
        
        <Separator />
        
        {currentRoom && <UserList users={currentRoom.users} />}
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <ChatRoom room={currentRoom} currentUser={user} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-light">Welcome to the Chat App</h2>
              <p className="text-gray-500">Select a room or create a new one to start chatting</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
};

export default Index;
