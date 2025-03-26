
import React from 'react';
import { Message } from '@/services/socket';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start gap-2 group mb-4',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {getInitials(message.sender.username)}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'flex flex-col max-w-[80%]',
          isCurrentUser ? 'items-end' : 'items-start'
        )}
      >
        {!isCurrentUser && (
          <span className="text-xs text-muted-foreground mb-1">
            {message.sender.username}
          </span>
        )}

        <div
          className={cn(
            'px-4 py-2 rounded-2xl',
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-secondary text-secondary-foreground rounded-tl-none'
          )}
        >
          <p className="text-sm">{message.text}</p>
        </div>

        <span className="text-xs text-muted-foreground mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {getInitials(message.sender.username)}
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default ChatMessage;
