
import React from "react";
import { Room } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

interface RoomListProps {
  rooms: Room[];
  currentRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  onCreateRoom: () => void;
}

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  currentRoomId,
  onRoomSelect,
  onCreateRoom,
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Rooms</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCreateRoom}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-1">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`room-item ${currentRoomId === room.id ? "active" : ""}`}
              onClick={() => onRoomSelect(room.id)}
            >
              <div className="flex items-center justify-between">
                <span>{room.name}</span>
                <span className="text-xs text-gray-500">
                  {room.users.length} {room.users.length === 1 ? "user" : "users"}
                </span>
              </div>
            </div>
          ))}
          
          {rooms.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-4">
              No rooms available. Create one!
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RoomList;
