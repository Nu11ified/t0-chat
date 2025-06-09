"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithGithub, signOut, useSession } from "@/client/lib/auth-client";

export function Sidebar() {
  const session = useSession();

  return (
    <div className="flex h-full w-[270px] flex-col border-r border-gray-800/50 bg-[#1A1B1E] p-4 backdrop-blur-xl">
      <div className="flex flex-1 flex-col gap-6">
        <Link 
          href="/" 
          className="text-xl font-medium tracking-tight"
        >
          T0.chat
        </Link>
        
        <div className="relative overflow-hidden rounded-sm bg-[#4A1D3A]/20 p-[1px] backdrop-blur-sm">
          <Button 
            variant="secondary" 
            className="w-full bg-[#1A1B1E]/80 hover:bg-[#4A1D3A]/40 text-white rounded-none"
          >
            New Chat
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search your threads..."
            className="pl-8 border-gray-800/50 bg-gray-900/20 backdrop-blur-sm rounded-sm focus-visible:ring-1 focus-visible:ring-gray-700"
          />
        </div>
      </div>

      <div className="mt-4">
        {session.data ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="h-8 w-8 rounded-full bg-gray-800" />
              <div className="flex-1 truncate">
                <div className="text-sm font-medium">{session.data.user.name}</div>
                <div className="text-xs text-gray-400">{session.data.user.email}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-sm text-gray-400 hover:bg-gray-800/30 hover:text-white"
              onClick={() => void signOut()}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start rounded-sm border border-gray-800/50 bg-gray-900/20 px-4 py-6 text-gray-400 backdrop-blur-sm transition-all hover:bg-gray-800/30 hover:text-white"
            onClick={() => void signInWithGithub()}
          >
            Continue with GitHub
          </Button>
        )}
      </div>
    </div>
  );
} 