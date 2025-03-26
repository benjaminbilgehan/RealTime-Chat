
import React, { useState, useRef, useEffect } from 'react';
import { Message, Room, User } from '@/services/socket';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ChatRoomProps {
  room: Room;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  room,
  messages,
  currentUser,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center px-4 py-3 border-b">
        <div className="flex-1">
          <h2 className="text-lg font-medium">{room.name}</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{room.users.length} online</span>
          </div>
        </div>
        <div className="flex -space-x-2">
          {room.users.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-xs border-2 border-background"
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
          ))}
          {room.users.length > 3 && (
            <Badge variant="secondary" className="ml-1">
              +{room.users.length - 3}
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-4"
        scrollHideDelay={250}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>No messages yet</p>
            <p className="text-sm">Be the first to send a message!</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.sender.id === currentUser.id}
              />
            ))}
          </AnimatePresence>
        )}
        <div ref={endOfMessagesRef} />
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim()}
            className="transition-all duration-200"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
