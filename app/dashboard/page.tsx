import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">QR Ordering Dashboard</h1>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ยินดีต้อนรับ</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-sm text-gray-600">ชื่อ</p>
              <p className="text-lg font-semibold text-gray-900">{session.user.name}</p>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 p-4">
              <p className="text-sm text-gray-600">อีเมล</p>
              <p className="text-lg font-semibold text-gray-900">{session.user.email}</p>
            </div>

            <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
              <p className="text-sm text-gray-600">สิทธิ์</p>
              <p className="text-lg font-semibold text-gray-900">
                {session.user.role === 'owner' ? 'เจ้าของ (Owner)' : 'พนักงาน (Staff)'}
              </p>
            </div>

            {session.user.branchId && (
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                <p className="text-sm text-gray-600">สาขา</p>
                <p className="text-lg font-semibold text-gray-900">{session.user.branchId}</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎉 NextAuth.js Authentication สำเร็จ!
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Email/Password authentication</li>
              <li>✅ JWT-based sessions</li>
              <li>✅ Role-Based Access Control (RBAC)</li>
              <li>✅ Protected routes with middleware</li>
              <li>✅ Bcrypt password hashing</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
