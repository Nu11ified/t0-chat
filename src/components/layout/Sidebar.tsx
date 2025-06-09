"use client";

import { PanelLeftClose, PanelRightClose, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithGithub, signOut, useSession } from "@/client/lib/auth-client";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const session = useSession();
  const { isSidebarOpen, toggleSidebar, clearMessages } = useAppStore();

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r border-gray-800/50 bg-background p-4 backdrop-blur-xl transition-all z-20",
        isSidebarOpen ? "w-[270px]" : "w-[70px]"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-12 top-4 z-30"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <PanelLeftClose /> : <PanelRightClose />}
      </Button>
      <div className="flex flex-1 flex-col gap-6">
        <Link
          href="/"
          className={cn(
            "text-xl font-medium tracking-tight",
            !isSidebarOpen && "text-center"
          )}
        >
          {isSidebarOpen ? "T0.chat" : "T0"}
        </Link>

        <div
          className={cn(
            "relative overflow-hidden rounded-sm bg-[#4A1D3A]/20 p-[1px] backdrop-blur-sm",
            !isSidebarOpen && "bg-transparent"
          )}
        >
          <Button
            variant="default"
            className={cn(
              "w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90",
              !isSidebarOpen && "w-auto"
            )}
          >
            {isSidebarOpen ? "New Chat" : "+"}
          </Button>
        </div>

        {isSidebarOpen && (
          <>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your threads..."
                className="rounded-sm border-gray-800/50 bg-gray-900/20 pl-8 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-gray-700"
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={clearMessages}
            >
              Clear Chat
            </Button>
          </>
        )}
      </div>

      <div className="mt-4">
        {session.data ? (
          <div className="flex flex-col gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-1",
                !isSidebarOpen && "justify-center"
              )}
            >
              <div className="h-8 w-8 rounded-full bg-muted" />
              {isSidebarOpen && (
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium">
                    {session.data.user.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.data.user.email}
                  </div>
                </div>
              )}
            </div>
            <Link href="/settings">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-sm text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                  !isSidebarOpen && "justify-center"
                )}
                title="Settings"
              >
                {isSidebarOpen ? "Settings" : "S"}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-sm text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                !isSidebarOpen && "justify-center"
              )}
              onClick={() => void signOut()}
              title="Sign Out"
            >
              {isSidebarOpen ? "Sign Out" : "X"}
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start rounded-sm border border-gray-800/50 bg-gray-900/20 px-4 py-6 text-muted-foreground backdrop-blur-sm transition-all hover:bg-muted/30 hover:text-foreground",
              !isSidebarOpen && "justify-center"
            )}
            onClick={() => void signInWithGithub()}
            title="Continue with GitHub"
          >
            {isSidebarOpen ? "Continue with GitHub" : "GH"}
          </Button>
        )}
      </div>
    </div>
  );
} 