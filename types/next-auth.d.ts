import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'staff' | 'owner';
      branchId: string | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'staff' | 'owner';
    branchId: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: 'staff' | 'owner';
    branchId: string | null;
  }
}
