export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,185,84,0.12),_transparent_55%),linear-gradient(160deg,_rgba(10,12,16,0.96),_rgba(8,9,12,0.96))]">
      <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-16">
        {children}
      </div>
    </div>
  );
}
