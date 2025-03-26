
import React, { useState, useEffect, useRef } from "react";
import { Room, User, Message as MessageType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { joinRoom, leaveRoom, sendMessage } from "@/lib/socket";
import Message from "./Message";
import { Send } from "lucide-react";

interface ChatRoomProps {
  room: Room;
  currentUser: User;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ room, currentUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>(room.messages || []);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Join the room when component mounts
    joinRoom(room.id);
    
    // Set up socket event listeners
    const handleNewMessage = (newMessage: MessageType) => {
      if (newMessage.roomId === room.id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    
    // Add event listeners to socket
    window.socket.on("new_message", handleNewMessage);
    
    // Clean up event listeners when component unmounts
    return () => {
      leaveRoom(room.id);
      window.socket.off("new_message", handleNewMessage);
    };
  }, [room.id]);

  useEffect(() => {
    // Update messages when room changes
    setMessages(room.messages || []);
  }, [room.messages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    sendMessage(room.id, message);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-medium">{room.name}</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-2">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          )}
          
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} currentUser={currentUser} />
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
