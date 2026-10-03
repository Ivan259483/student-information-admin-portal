import { createContext, useContext } from 'react';
export interface AdminSession {
  mode: 'demo';
  name: string;
  role: string;
}
export const Context = createContext<{
  session: AdminSession | null;
  start: () => void;
  signOut: () => void;
} | null>(null);
export function useAdminSession() {
  const value = useContext(Context);
  if (!value) throw new Error('SessionProvider is required.');
  return value;
}
