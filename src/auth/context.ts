import { createContext, useContext } from 'react';
export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}
export type SessionStatus = 'loading' | 'signed-in' | 'signed-out';
// Server boundary for authentication (replaced by a fake in tests).
export interface AuthClient {
  /** Validates a stored token (or one handed over by the EduTrack login). */
  restore(handoffToken?: string): Promise<AdminSession | null>;
  signIn(email: string, password: string): Promise<AdminSession>;
  signOut(): void;
}
export const Context = createContext<{
  session: AdminSession | null;
  status: SessionStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
} | null>(null);
export function useAdminSession() {
  const value = useContext(Context);
  if (!value) throw new Error('SessionProvider is required.');
  return value;
}
