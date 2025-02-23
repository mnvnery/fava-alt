import AuthGuard from "../components/AuthGuard";

export default function TestKitLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div>
        <div className="flex flex-col items-center p-6">
        {children}
        </div>
      </div>
    </AuthGuard>
  );
}
