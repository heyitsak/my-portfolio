import { AdminProvider } from '@/app/context/AdminContext';

export const metadata = {
  title: 'Admin Dashboard',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#0a0a0a]">
        {children}
      </div>
    </AdminProvider>
  );
}
