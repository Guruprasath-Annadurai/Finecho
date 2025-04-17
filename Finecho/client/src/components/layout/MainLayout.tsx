import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="font-sans bg-gray-50 h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header toggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - only visible on desktop */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8 pb-20 md:pb-0">
          <div>{children}</div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default MainLayout;
