export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
