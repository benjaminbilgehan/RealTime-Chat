
import React from "react";
import { cn } from "@/lib/utils";
import { Message, User } from "@/types";

interface MessageProps {
  message: Message;
  currentUser: User;
}

const MessageComponent: React.FC<MessageProps> = ({ message, currentUser }) => {
  const isCurrentUser = message.sender.id === currentUser.id;
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      className={cn(
        "flex mb-4 animate-slide-in",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div>
        {!isCurrentUser && (
          <div className="text-xs text-gray-500 ml-1 mb-1">{message.sender.username}</div>
        )}
        <div className={isCurrentUser ? "message-sent" : "message-received"}>
          {message.text}
          <div className="text-xs text-gray-500 mt-1 text-right">
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
