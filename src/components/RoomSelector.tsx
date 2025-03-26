
import React, { useState } from 'react';
import { Room } from '@/services/socket';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface RoomSelectorProps {
  rooms: Room[];
  currentRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onCreateRoom: (name: string) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms,
  currentRoomId,
  onSelectRoom,
  onCreateRoom,
}) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName.trim());
      setNewRoomName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Chat Rooms</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRoom} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="h-10"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={!newRoomName.trim()}>
                  Create Room
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <AnimatePresence>
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant={currentRoomId === room.id ? "default" : "ghost"}
                className={`w-full justify-start mb-1 ${
                  currentRoomId === room.id ? '' : 'hover:bg-secondary'
                }`}
                onClick={() => onSelectRoom(room.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{room.name}</span>
                  <Badge variant="secondary" className="ml-2 flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {room.users.length}
                  </Badge>
                </div>
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};

export default RoomSelector;
