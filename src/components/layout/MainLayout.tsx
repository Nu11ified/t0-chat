import { type PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative flex h-screen bg-[#1A1B1E] text-white">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] bg-purple-500/5 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-blue-500/5 blur-[120px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 