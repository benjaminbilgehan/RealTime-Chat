
import React from "react";
import { User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Active Users ({users.length})</h3>
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-1">
          {users.map((user) => (
            <div key={user.id} className="user-item">
              <span className="user-status" />
              <span className="text-sm">{user.username}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserList;
