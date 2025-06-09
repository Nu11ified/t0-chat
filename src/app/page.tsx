"use client";

import { Code, Compass, Lightbulb, School, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/MainLayout";
import { models } from "@/config/models";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import type { ModelConfig } from "@/types/models";

const sampleQuestions = [
  "How does AI work?",
  "Are black holes real?",
  'How many Rs are in the word "strawberry"?',
  "What is the meaning of life?",
];

const defaultModel: ModelConfig = {
  id: "gemini-2.5-flash",
  name: "Gemini 2.5 Flash",
  provider: "google",
  hasSearch: true,
  description: "Fast and efficient model for general tasks",
};

export default function HomePage() {
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(defaultModel);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <div className="relative flex-1 overflow-auto p-8">
          {/* Background blur effects */}
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl">
            <h1 className="mb-12 text-center text-4xl font-medium tracking-tight">
              How can I help you?
            </h1>

            <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Lightbulb, label: "Create" },
                { icon: Compass, label: "Explore" },
                { icon: Code, label: "Code" },
                { icon: School, label: "Learn" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-sm border border-gray-800/50 bg-gray-900/20 p-4 backdrop-blur-sm transition-all hover:bg-gray-800/30"
                >
                  <div className="absolute -right-6 -top-6 h-12 w-12 rounded-full bg-gray-500/10 blur-xl transition-all group-hover:bg-purple-500/20" />
                  <div className="relative flex flex-col items-center gap-2">
                    <item.icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3">
              {sampleQuestions.map((question) => (
                <Button
                  key={question}
                  variant="ghost"
                  className="w-full justify-start rounded-sm border border-gray-800/50 bg-gray-900/20 px-4 py-6 text-gray-400 backdrop-blur-sm transition-all hover:bg-gray-800/30 hover:text-white"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative border-t border-gray-800/50 bg-[#1A1B1E]/80 p-4 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-4">
              <small className="text-center text-gray-500">
                Make sure you agree to our{" "}
                <Button variant="link" className="h-auto p-0 text-gray-500 hover:text-gray-400">
                  Terms
                </Button>{" "}
                and our{" "}
                <Button variant="link" className="h-auto p-0 text-gray-500 hover:text-gray-400">
                  Privacy Policy
                </Button>
              </small>

              <div className="flex gap-2">
                <div className="relative flex-1 overflow-hidden rounded-sm border border-gray-800/50 bg-gray-900/20 backdrop-blur-sm">
                  <Input
                    placeholder="Type your message here..."
                    className="border-0 bg-transparent rounded-none focus-visible:ring-1 focus-visible:ring-gray-700"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="rounded-sm border-gray-800/50 bg-gray-900/20 backdrop-blur-sm hover:bg-gray-800/30"
                    >
                      {selectedModel.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {models.map((model: ModelConfig) => (
                      <DropdownMenuItem
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          if (!model.hasSearch) {
                            setIsSearchEnabled(false);
                          }
                        }}
                        className="flex items-center justify-between"
                      >
                        <span>{model.name}</span>
                        {model.hasSearch && (
                          <Search className="h-4 w-4 text-gray-500" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {selectedModel.hasSearch && (
                  <div className="flex items-center gap-2 rounded-sm border border-gray-800/50 bg-gray-900/20 px-3 backdrop-blur-sm">
                    <small className="text-gray-400">Search</small>
                    <Switch
                      checked={isSearchEnabled}
                      onCheckedChange={setIsSearchEnabled}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
