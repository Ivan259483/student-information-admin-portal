import { api, tokenStore } from '@/lib/api';
import { AxiosError } from 'axios';
import type { AdminSession, AuthClient } from './context';

interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}
const NOT_ADMIN =
  'This is a student account. Students sign in on the EduTrack student portal (link below); this page is for administrators only.';
const toSession = (user: ApiUser): AdminSession => {
  if (user.role !== 'admin') throw new Error(NOT_ADMIN);
  return { id: user.id, name: user.name, email: user.email, role: 'admin' };
};

// JWT authentication against the EduTrack backend.
export const apiAuthClient: AuthClient = {
  async restore(handoffToken) {
    if (handoffToken) tokenStore.set(handoffToken);
    if (!tokenStore.get()) return null;
    try {
      const { data } = await api.get<{ user: ApiUser }>('/auth/me');
      return toSession(data.user);
    } catch {
      tokenStore.clear();
      return null;
    }
  },
  async signIn(email, password) {
    const { data } = await api
      .post<{ token: string; user: ApiUser }>('/auth/login', {
        identifier: email,
        password,
        role: 'admin',
      })
      .catch((error: unknown) => {
        // 403 = correct password but not an admin account (the API's own
        // message refers to the tabs on the EduTrack login page).
        if (error instanceof AxiosError && error.response?.status === 403)
          throw new Error(NOT_ADMIN);
        throw error;
      });
    const session = toSession(data.user);
    tokenStore.set(data.token);
    return session;
  },
  signOut() {
    tokenStore.clear();
  },
};
