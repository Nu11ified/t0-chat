"use client";

import { Paperclip, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { models } from "@/config/models";
import type { ModelConfig } from "@/types/models";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LegalModal } from "./LegalModal";
import { UploadDropzone } from "@/utils/uploadthing";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ChatInput({ handleSendMessage }: { handleSendMessage: (message: string, fileUrls: string[]) => void }) {
  const { modelSettings, setModelSettings } = useAppStore();
  const [inputValue, setInputValue] = useState("");
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  const selectedModel = models.find(m => m.id === modelSettings.model) ?? models[0];

  const handleModelChange = (model: ModelConfig) => {
    const newSettings: Partial<typeof modelSettings> = { model: model.id };
    if (!model.hasSearch) {
      newSettings.searchMode = false;
    }
    setModelSettings(newSettings);
  };

  const handleSearchChange = (checked: boolean) => {
    setModelSettings({ searchMode: checked });
  };

  const handleRemoveFile = (urlToRemove: string) => {
    setFileUrls(fileUrls.filter(url => url !== urlToRemove));
  };

  const onSendMessage = () => {
    if (inputValue.trim() === "" && fileUrls.length === 0) return;
    handleSendMessage(inputValue, fileUrls);
    setInputValue("");
    setFileUrls([]);
  };

  if (!selectedModel) {
    return null; // Or a loading/error state
  }

  return (
    <div className="relative border-t border-border bg-background/80 p-4 backdrop-blur-xl">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col gap-4">
          {fileUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {fileUrls.map((url, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {url.split('/').pop()}
                  <button onClick={() => handleRemoveFile(url)} className="rounded-full hover:bg-muted/50">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <small className="text-center text-muted-foreground">
            Make sure you agree to our{" "}
            <LegalModal type="Terms" />
            {" "}
            and our{" "}
            <LegalModal type="Privacy" />
          </small>

          <div className="flex gap-2">
            <div className="relative flex-1 overflow-hidden rounded-sm border border-border bg-background/20 backdrop-blur-sm">
              <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute left-2 top-1.5" aria-label="Attach files">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach files</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                  </DialogHeader>
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      if (res) {
                        const urls = res.map(r => r.url);
                        setFileUrls(prev => [...prev, ...urls]);
                      }
                      setUploadDialogOpen(false);
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                  />
                </DialogContent>
              </Dialog>
              <Input
                placeholder="Type your message here..."
                className="border-0 bg-transparent pl-12 rounded-none focus-visible:ring-1 focus-visible:ring-gray-700"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                aria-label="Chat message input"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-sm border-border bg-background/20 backdrop-blur-sm hover:bg-muted/30"
                  aria-label={`Select model. Current: ${selectedModel.name}`}
                >
                  {selectedModel.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {models.map((model: ModelConfig) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => handleModelChange(model)}
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
              <div className="flex items-center gap-2 rounded-sm border border-border bg-background/20 px-3 backdrop-blur-sm">
                <small className="text-muted-foreground">Search</small>
                <Switch
                  checked={modelSettings.searchMode}
                  onCheckedChange={handleSearchChange}
                  className="data-[state=checked]:bg-primary"
                  aria-label="Toggle search mode"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 