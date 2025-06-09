import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Message type
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
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
    }),
    {
      name: 'app-storage', // unique name
    },
  ),
) 