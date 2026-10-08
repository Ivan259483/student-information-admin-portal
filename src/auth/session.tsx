import { PageLoading } from '@/components/shared/PageLoading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiErrorMessage, AUTH_EXPIRED_EVENT, STUDENT_PORTAL_URL } from '@/lib/api';
import { GraduationCap, Loader2, Lock } from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { apiAuthClient } from './client';
import {
  Context,
  useAdminSession,
  type AdminSession,
  type AuthClient,
  type SessionStatus,
} from './context';

// The EduTrack login page hands an admin over as `#token=<jwt>`. The token is
// read once and removed from the address bar immediately.
function takeHandoffToken(): string | undefined {
  const match = /^#token=([\w-]+\.[\w-]+\.[\w-]+)$/.exec(window.location.hash);
  if (!match) return undefined;
  window.history.replaceState(
    null,
    '',
    window.location.pathname + window.location.search
  );
  return match[1];
}

export function SessionProvider({
  children,
  client = apiAuthClient,
}: {
  children: ReactNode;
  client?: AuthClient;
}) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>('loading');
  useEffect(() => {
    let active = true;
    client.restore(takeHandoffToken()).then((restored) => {
      if (!active) return;
      setSession(restored);
      setStatus(restored ? 'signed-in' : 'signed-out');
    });
    const expired = () => {
      setSession(null);
      setStatus('signed-out');
      toast.error('Your session has ended. Please sign in again.');
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, expired);
    return () => {
      active = false;
      window.removeEventListener(AUTH_EXPIRED_EVENT, expired);
    };
  }, [client]);
  return (
    <Context.Provider
      value={{
        session,
        status,
        signIn: async (email, password) => {
          const next = await client.signIn(email, password);
          setSession(next);
          setStatus('signed-in');
        },
        signOut: () => {
          client.signOut();
          setSession(null);
          setStatus('signed-out');
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function RequireAdmin() {
  const { status } = useAdminSession();
  const location = useLocation();
  if (status === 'loading') return <PageLoading />;
  return status === 'signed-in' ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
}

const safeReturnPath = (from: unknown) =>
  typeof from === 'string' &&
  /^\/(students|enrollment|grades|schedules|announcements|helpdesk|settings)?(\?[\w=%&-]*)?$/.test(
    from
  )
    ? from
    : '/';

export function LoginPage() {
  const { status, signIn } = useAdminSession();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (status === 'loading') return <PageLoading />;
  if (status === 'signed-in')
    return <Navigate to={safeReturnPath(location.state?.from)} replace />;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError('Enter a valid administrator email address.');
    if (!password) return setError('Enter your password.');
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">EduTrack Admin</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your administrator account.
          </p>
        </div>
        <form className="space-y-4" onSubmit={submit} noValidate>
          {error && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@edutrack.edu"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            Sign in
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Student?{' '}
          <a className="font-medium text-primary hover:underline" href={`${STUDENT_PORTAL_URL}/login`}>
            Go to the student portal
          </a>
        </p>
      </div>
    </main>
  );
}
