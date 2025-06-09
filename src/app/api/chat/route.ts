import {
  appendResponseMessages,
  createDataStream,
  generateId,
  streamText,
  type Message,
  type CoreMessage,
  type AssistantContent,
} from 'ai';
import { createResumableStreamContext } from 'resumable-stream';
import { api } from '@/trpc/server';
import { after } from 'next/server';
import { headers } from 'next/headers';
import { createRegistry } from '@/lib/ai';
import { auth } from '@/server/lib/auth';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const streamContext = createResumableStreamContext({
  waitUntil: after,
});

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { userId } = session.session;

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new Response('id is required', { status: 400 });
  }

  const streamIds = await api.chat.loadStreams({ chatId, userId });

  if (!streamIds.length) {
    return new Response('No streams found', { status: 404 });
  }

  const recentStreamId = streamIds.at(-1);

  if (!recentStreamId) {
    return new Response('No recent stream found', { status: 404 });
  }
  const emptyDataStream = createDataStream({
    execute: _buffer => {
      // Empty stream that does nothing
    },
  });

  const stream = await streamContext.resumableStream(
    recentStreamId,
    () => emptyDataStream,
  );

  if (stream) {
    return new Response(stream, { status: 200 });
  }

  /*
   * For when the generation is "active" during SSR but the
   * resumable stream has concluded after reaching this point.
   */

  const messages = await api.chat.getMessagesByChatId({ id: chatId, userId });
  const mostRecentMessage = messages.at(-1);

  if (!mostRecentMessage || mostRecentMessage.role !== 'assistant') {
    return new Response(emptyDataStream, { status: 200 });
  }

  const streamWithMessage = createDataStream({
    execute: buffer => {
      buffer.writeData({
        type: 'append-message',
        message: JSON.stringify(mostRecentMessage),
      });
    },
  });

  return new Response(streamWithMessage, { status: 200 });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { userId } = session.session;

  const {
    messages,
    id: chatId,
    model: modelId,
    fileUrls,
  } = (await req.json()) as {
    messages: Message[];
    id: string;
    model: string;
    fileUrls?: string[];
  };

  const streamId = generateId();

  await api.chat.appendStreamId({ chatId, streamId, userId });

  const settings = await api.settings.getUserSettings();
  const registry = createRegistry(settings);
  const model = registry.languageModel(
    modelId as Parameters<typeof registry.languageModel>[0],
  );

  let messagesForLLM: Message[] | unknown[] = messages;

  if (fileUrls && fileUrls.length > 0) {
    const lastUserMessage = messages.at(-1);
    if (lastUserMessage && lastUserMessage.role === 'user' && typeof lastUserMessage.content === 'string') {
      const content: Array<{ type: 'text'; text: string } | { type: 'image'; image: URL }> = [
        { type: 'text', text: lastUserMessage.content },
      ];

      for (const url of fileUrls) {
        content.push({ type: 'image', image: new URL(url) });
      }
      
      messagesForLLM = [
        ...messages.slice(0, -1),
        {
          ...lastUserMessage,
          content,
        },
      ];
    }
  }

  const stream = createDataStream({
    execute: dataStream => {
      const result = streamText({
        model,
        system: settings?.systemPrompt ?? 'You are a helpful assistant.',
        messages: messagesForLLM as CoreMessage[],
        async onFinish({ response }) {
          const responseMessagesForDB = response.messages.map(msg => {
            if (typeof msg.content === 'string') {
                return msg;
            }
            const textContent = msg.content
                .filter(part => part.type === 'text')
                .map(part => (part as {type: 'text', text: string}).text)
                .join(' ');
            return { ...msg, content: textContent };
          });

          await api.chat.saveChat({
              id: chatId,
              messages: appendResponseMessages({
                  messages,
                  responseMessages: responseMessagesForDB.map(msg => ({
                      id: msg.id,
                      role: msg.role as "assistant",
                      content: msg.content as AssistantContent,
                      parts: [{ type: 'text', text: msg.content as AssistantContent }]
                  }))
              }),
              userId,
          });
        },
      });

      result.mergeIntoDataStream(dataStream);
    }
  });

  return new Response(
    await streamContext.resumableStream(streamId, () => stream),
  );
}