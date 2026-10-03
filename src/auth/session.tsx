import { Button } from '@/components/ui/button';
import { useState, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Context, useAdminSession, type AdminSession } from './context';
const demoSession: AdminSession = {
  mode: 'demo',
  name: 'Admin',
  role: 'Registrar',
};
// This demo session is deliberately separate from records and is not authentication.
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => {
    try {
      return sessionStorage.getItem('admin-demo-signed-out')
        ? null
        : demoSession;
    } catch {
      return demoSession;
    }
  });
  const change = (value: AdminSession | null) => {
    try {
      if (value) sessionStorage.removeItem('admin-demo-signed-out');
      else sessionStorage.setItem('admin-demo-signed-out', 'true');
    } catch {
      /* Keep the in-memory session if storage is disabled. */
    }
    setSession(value);
  };
  return (
    <Context.Provider
      value={{
        session,
        start: () => change(demoSession),
        signOut: () => change(null),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function RequireAdmin() {
  const { session } = useAdminSession();
  const location = useLocation();
  return session ? (
    <Outlet />
  ) : (
    <Navigate
      to="/demo-session"
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
}
export function DemoSessionPage() {
  const { session, start } = useAdminSession();
  const location = useLocation();
  const from = location.state?.from;
  if (session)
    return (
      <Navigate
        to={
          typeof from === 'string' &&
          /^\/(students|enrollment|grades|schedules|announcements|helpdesk|settings)(\?|$)/.test(
            from
          ) &&
          !from.includes('\\')
            ? from
            : '/'
        }
        replace
      />
    );
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="max-w-md space-y-4 rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-bold">Demo session ended</h1>
        <p className="text-sm text-muted-foreground">
          This portal uses a local demo session. It does not authenticate users
          or secure browser-stored records. Your saved records remain on this
          browser.
        </p>
        <Button onClick={start}>Start demo session</Button>
      </div>
    </main>
  );
}
