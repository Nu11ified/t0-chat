"use client";

import { useAppStore, type Message } from "@/lib/store";
import { cn } from "@/lib/utils";
import { User, Bot, Lightbulb, Compass, Code, School, Copy, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { say } from "cowsay-browser";

const sampleQuestions = [
  "How does AI work?",
  "Are black holes real?",
  'How many Rs are in the word "strawberry"?',
  "What is the meaning of life?",
];

export function MessageList({
  handleSendMessage,
}: {
  handleSendMessage: (message: string, fileUrls?: string[]) => void;
}) {
  const messages = useAppStore((state) => state.messages);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const messageElements = document.querySelectorAll(".message-enter");
    messageElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("message-enter-active");
      }, index * 100);
    });
  }, [messages]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  const handleScroll = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      if (scrollHeight - scrollTop > clientHeight + 100) {
        setShowScrollToBottom(true);
      } else {
        setShowScrollToBottom(false);
      }
    }
  };

  return (
    <div className="relative flex-1 overflow-auto p-8" ref={messageListRef} onScroll={handleScroll}>
      {messages.length === 0 ? (
        <div className="relative z-10 mx-auto max-w-2xl text-center flex flex-col items-center justify-center h-full">
           <pre className="text-sm">
            {say({ text: "Hello! I'm T0, your AI assistant. How can I help you today?" })}
           </pre>
        </div>
      ) : (
        <div className="relative z-10 mx-auto max-w-2xl space-y-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("message-enter group relative flex items-start gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Bot size={20} />
                </div>
              )}
              <div
                className={cn(
                  "rounded-lg p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {typeof message.content === 'string' ? (
                  <p>{message.content}</p>
                ) : (
                  <div className="space-y-2">
                    {message.content.map((part, index) => {
                      if (part.type === 'text') {
                        return <p key={index}>{part.text}</p>;
                      }
                      if (part.type === 'image') {
                        // eslint-disable-next-line @next/next/no-img-element
                        return <img key={index} src={part.image} alt="uploaded content" className="rounded-md" />;
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
              {message.role === "user" ? (
                 <div className="h-8 w-8 flex-shrink-0 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <User size={20} />
                </div>
              ) : (
                <button
                  className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(
                    typeof message.content === 'string' 
                      ? message.content 
                      : message.content.filter(p => p.type === 'text').map(p => p.text).join('\n'),
                    message.id
                  )}
                >
                  {copiedMessageId === message.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
              )}
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
      )}
      {showScrollToBottom && (
        <button
          className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
          onClick={() => endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
} 