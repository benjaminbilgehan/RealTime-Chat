
export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  roomId: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
}
