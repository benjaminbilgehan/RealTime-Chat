
import React, { useEffect } from 'react';
import { useSocket } from '@/hooks/use-socket';
import AuthScreen from '@/components/AuthScreen';
import ChatInterface from '@/components/ChatInterface';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const {
    user,
    rooms,
    currentRoom,
    messages,
    isConnected,
    connect,
    disconnect,
    joinRoom,
    sendMessage,
    createRoom,
  } = useSocket();

  // Handle login
  const handleLogin = async (username: string) => {
    await connect(username);
  };

  // Handle logout
  const handleLogout = () => {
    disconnect();
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <AnimatePresence mode="wait">
        {!isConnected || !user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthScreen onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatInterface
              user={user}
              rooms={rooms}
              currentRoom={currentRoom}
              messages={messages}
              onJoinRoom={joinRoom}
              onCreateRoom={createRoom}
              onSendMessage={sendMessage}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
