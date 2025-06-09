import { type PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./theme-toggle";

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative flex h-screen bg-background text-foreground">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="background-gradient" />
        <div className="background-gradient two" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="absolute top-4 right-4 z-20">
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
} 