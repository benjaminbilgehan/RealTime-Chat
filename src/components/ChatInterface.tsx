
import React from 'react';
import { Room, User } from '@/services/socket';
import { Button } from '@/components/ui/button';
import RoomSelector from './RoomSelector';
import ChatRoom from './ChatRoom';
import { Message } from '@/services/socket';
import { LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

interface ChatInterfaceProps {
  user: User;
  rooms: Room[];
  currentRoom: Room | null;
  messages: Message[];
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: (name: string) => void;
  onSendMessage: (text: string) => void;
  onLogout: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  user,
  rooms,
  currentRoom,
  messages,
  onJoinRoom,
  onCreateRoom,
  onSendMessage,
  onLogout,
}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-72 border-r bg-card p-4 flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold">EspressoChat</h1>
            <p className="text-sm text-muted-foreground">
              Logged in as {user.username}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <RoomSelector
          rooms={rooms}
          currentRoomId={currentRoom?.id || null}
          onSelectRoom={onJoinRoom}
          onCreateRoom={onCreateRoom}
        />
      </motion.div>

      {/* Main Chat Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex-1 overflow-hidden"
      >
        {currentRoom ? (
          <ChatRoom
            room={currentRoom}
            messages={messages}
            currentUser={user}
            onSendMessage={onSendMessage}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/30">
            <div className="text-center max-w-md px-6">
              <h2 className="text-2xl font-medium mb-2">Welcome to EspressoChat</h2>
              <p className="text-muted-foreground mb-6">
                Select a room from the sidebar or create a new one to start chatting.
              </p>
              <div className="flex justify-center space-x-2">
                {rooms.length > 0 && (
                  <Button onClick={() => onJoinRoom(rooms[0].id)}>
                    Join {rooms[0].name}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatInterface;
