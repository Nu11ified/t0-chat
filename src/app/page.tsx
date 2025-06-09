"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { ChatInput } from "@/components/layout/ChatInput";
import { MessageList } from "@/components/layout/MessageList";
import { useAppStore } from "@/lib/store";
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const { addMessage, updateMessage } = useAppStore();

  const handleSendMessage = (message: string) => {
    if (message.trim() === "") return;

    const userMessageId = uuidv4();
    addMessage({
      id: userMessageId,
      role: 'user',
      content: message,
    });

    const assistantMessageId = uuidv4();
    addMessage({
      id: assistantMessageId,
      role: 'assistant',
      content: 'Thinking...',
    });

    const response = "This is a canned response.";
    let streamedResponse = "";
    let charIndex = 0;

    const streamInterval = setInterval(() => {
      if (charIndex < response.length) {
        streamedResponse += response[charIndex];
        updateMessage(assistantMessageId, { content: streamedResponse });
        charIndex++;
      } else {
        clearInterval(streamInterval);
      }
    }, 50);
  };

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <MessageList handleSendMessage={handleSendMessage} />
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </MainLayout>
  );
}
