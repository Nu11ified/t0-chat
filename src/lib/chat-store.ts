import { type Message } from 'ai';
import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

function getChatsDir(userId: string): string {
  const chatDir = path.join(process.cwd(), '.chats', userId);
  if (!existsSync(chatDir)) {
    mkdirSync(chatDir, { recursive: true });
  }
  return chatDir;
}

function getChatFile(id: string, userId: string): string {
  return path.join(getChatsDir(userId), `${id}.json`);
}

function getStreamsFile(id: string, userId: string): string {
  return path.join(getChatsDir(userId), `${id}.streams.json`);
}

export async function createChat(userId: string): Promise<string> {
  const id = generateId();
  await writeFile(getChatFile(id, userId), '[]', 'utf8');
  await writeFile(getStreamsFile(id, userId), '[]', 'utf8');
  return id;
}

export async function loadChat(id: string, userId: string): Promise<Message[]> {
  try {
    const content = await readFile(getChatFile(id, userId), 'utf8');
    return JSON.parse(content) as Message[];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw e;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: Message[];
  userId: string;
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(id, userId), content, 'utf8');
}

export async function loadStreams(chatId: string, userId: string): Promise<string[]> {
  try {
    const content = await readFile(getStreamsFile(chatId, userId), 'utf8');
    return JSON.parse(content) as string[];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw e;
  }
}

export async function appendStreamId({
  chatId,
  streamId,
  userId,
}: {
  chatId: string;
  streamId: string;
  userId: string;
}): Promise<void> {
  const streams = await loadStreams(chatId, userId);
  streams.push(streamId);
  const content = JSON.stringify(streams, null, 2);
  await writeFile(getStreamsFile(chatId, userId), content, 'utf8');
}

export async function getMessagesByChatId({ id, userId }: { id: string, userId: string }): Promise<Message[]> {
    return loadChat(id, userId);
} 