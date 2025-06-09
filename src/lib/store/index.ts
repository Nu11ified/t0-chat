import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid';

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Message part types for multimodal content
export type TextPart = { type: 'text'; text: string };
export type ImagePart = { type: 'image'; image: string }; // URL to the image

// Message type
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string | (TextPart | ImagePart)[];
}

// Model settings
interface ModelSettings {
  // The ID of the currently selected model
  model: string
  // Whether search mode is enabled
  searchMode: boolean
  // An array of attached files
  fileAttachments: File[]
}

// Store state
interface AppState {
  // Whether the sidebar is currently open
  isSidebarOpen: boolean
  // The current theme of the application
  theme: Theme
  // The current model settings
  modelSettings: ModelSettings
  // An array of chat messages
  messages: Message[]
  // The ID of the current chat
  chatId: string
}

// Store actions
interface AppActions {
  // Toggles the visibility of the sidebar
  toggleSidebar: () => void
  // Sets the theme of the application
  setTheme: (theme: Theme) => void
  // Updates the model settings
  setModelSettings: (settings: Partial<ModelSettings>) => void
  // Adds a new message to the chat
  addMessage: (message: Message) => void
  // Updates an existing message in the chat
  updateMessage: (id: string, updatedMessage: Partial<Message>) => void
  // Clears all messages from the chat
  clearMessages: () => void
  // Starts a new chat
  newChat: () => void
}

// Create the store
export const useAppStore = create(
  persist<AppState & AppActions>(
    (set) => ({
      // Initial state
      isSidebarOpen: true,
      theme: 'system',
      modelSettings: {
        model: 'gpt-4',
        searchMode: false,
        fileAttachments: [],
      },
      messages: [],
      chatId: uuidv4(),

      // Actions
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      setTheme: (theme) => set({ theme }),

      setModelSettings: (settings) =>
        set((state) => ({
          modelSettings: { ...state.modelSettings, ...settings },
        })),

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      updateMessage: (id, updatedMessage) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updatedMessage } : msg
          ),
        })),

      clearMessages: () => set({ messages: [] }),

      newChat: () => set({ messages: [], chatId: uuidv4() }),
    }),
    {
      name: 'app-storage', // unique name
    },
  ),
) 