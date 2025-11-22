'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setErrorMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">QR Ordering</h1>
          <p className="mt-2 text-sm text-gray-600">เข้าสู่ระบบสำหรับเจ้าหน้าที่</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Error Message */}
          {(errorMessage || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">
                {errorMessage || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'}
              </p>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Info Text */}
          <p className="text-xs text-center text-gray-500 mt-4">
            หากคุณยังไม่มีบัญชี กรุณาติดต่อผู้ดูแลระบบ
          </p>
        </div>
      </div>
    </div>
  );
}
