import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/User';
import { comparePassword } from '@/utils/password';
import connectDB from '@/lib/mongodb';

export const authConfig: NextAuthConfig = {
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectDB();

        // Find user with password field (normally excluded)
        const user = await User.findOne({ email: credentials.email })
          .select('+password')
          .lean();

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
          throw new Error('Account is inactive. Please contact admin.');
        }

        // Verify password
        const isPasswordValid = await comparePassword(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // Return user object (without password)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          branchId: user.branchId?.toString() || null,
        };
      },
    }),
  ],

  callbacks: {
    // Add custom fields to JWT
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.branchId = dbUser.branchId?.toString() || null;
        }
      }

      // Update session (when user data changes)
      if (trigger === 'update' && session) {
        token = { ...token, ...session.user };
      }

      return token;
    },

    // Add custom fields to session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'staff' | 'owner';
        session.user.branchId = token.branchId as string | null;
      }

      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
