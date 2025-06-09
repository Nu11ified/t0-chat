"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { ChatInput } from "@/components/layout/ChatInput";
import { MessageList } from "@/components/layout/MessageList";
import { useAppStore, type Message } from "@/lib/store";
import { v4 as uuidv4 } from 'uuid';

type StreamChunk = {
  type: string;
  text?: string;
};

export default function HomePage() {
  const { messages, addMessage, updateMessage, chatId, modelSettings } = useAppStore();

  const handleSendMessage = async (message: string, fileUrls: string[] = []) => {
    if (message.trim() === "" && fileUrls.length === 0) return;

    const userMessageContent: Message['content'] = fileUrls.length > 0
      ? [
          { type: 'text' as const, text: message },
          ...fileUrls.map(url => ({ type: 'image' as const, image: url }))
        ]
      : message;

    addMessage({
      id: uuidv4(),
      role: 'user',
      content: userMessageContent,
    });

    const assistantMessageId = uuidv4();
    addMessage({
      id: assistantMessageId,
      role: 'assistant',
      content: 'Thinking...',
    });

    try {
      const history = messages.map(m => {
        if (typeof m.content === 'string') return m;
        const textContent = m.content.find(p => p.type === 'text')?.text ?? '';
        return { ...m, content: textContent };
      });
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          messages: [...history, {id: 'temp', role: 'user', content: message}],
          id: chatId,
          model: modelSettings.model,
          fileUrls,
        }),
      });

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedResponse = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const [type, data] = line.split(":", 2);
          if (!data) continue;

          try {
            const parsed: unknown = JSON.parse(data);
            if (type === "0" && typeof parsed === "string") { // Text delta
              streamedResponse += parsed;
              updateMessage(assistantMessageId, { content: streamedResponse });
            }
          } catch (e) {
            console.error("Failed to parse stream chunk", e);
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      updateMessage(assistantMessageId, { content: "An error occurred." });
    }
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
