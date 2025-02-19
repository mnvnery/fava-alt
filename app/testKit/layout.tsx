import AuthGuard from "../components/AuthGuard";
import Nav from "../components/Nav";

export default function TestKitLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div>
        <Nav/>
        <div className="flex flex-col items-center p-6">
        {children}
        </div>
      </div>
    </AuthGuard>
  );
}
