
import { io } from "socket.io-client";
import { toast } from "sonner";

// For this demo, we'll connect to a local Socket.IO server
// In a real app, this would be a deployed server
const SERVER_URL = "http://localhost:3001";

const socket = io(SERVER_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Setup event listeners for connection status
socket.on("connect", () => {
  console.log("Connected to server");
  toast.success("Connected to chat server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  toast.error("Failed to connect to chat server");
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
  if (reason === "io server disconnect") {
    // the disconnection was initiated by the server, reconnect manually
    socket.connect();
  }
  toast.info("Disconnected from chat server");
});

// Helper functions for common socket operations
export const connectWithUsername = (username: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    socket.auth = { username };
    socket.connect();
    
    const onConnect = () => {
      socket.off("connect_error", onConnectError);
      resolve();
    };
    
    const onConnectError = (err: Error) => {
      socket.off("connect", onConnect);
      reject(err);
    };
    
    socket.once("connect", onConnect);
    socket.once("connect_error", onConnectError);
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const joinRoom = (roomId: string) => {
  socket.emit("join_room", roomId);
};

export const leaveRoom = (roomId: string) => {
  socket.emit("leave_room", roomId);
};

export const createRoom = (roomName: string): Promise<string> => {
  return new Promise((resolve) => {
    socket.emit("create_room", roomName, (roomId: string) => {
      resolve(roomId);
    });
  });
};

export const sendMessage = (roomId: string, text: string) => {
  socket.emit("send_message", { roomId, text });
};

export const getRooms = (): Promise<any[]> => {
  return new Promise((resolve) => {
    socket.emit("get_rooms", (rooms: any[]) => {
      resolve(rooms);
    });
  });
};

export const getRoomUsers = (roomId: string): Promise<any[]> => {
  return new Promise((resolve) => {
    socket.emit("get_room_users", roomId, (users: any[]) => {
      resolve(users);
    });
  });
};

export default socket;
