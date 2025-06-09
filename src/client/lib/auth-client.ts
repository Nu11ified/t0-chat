import { createAuthClient } from "better-auth/react"
import { env } from "@/env"
import { multiSessionClient } from "better-auth/client/plugins"
import { polarClient } from "@polar-sh/better-auth";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        multiSessionClient(),
        polarClient()
    ],
})

export const { signIn, signOut, useSession } = authClient;

// GitHub sign-in function
export const signInWithGithub = async () => {
  try {
    const data = await signIn.social({
      provider: "github",
    });
    return data;
  } catch (error) {
    console.error("GitHub sign-in error:", error);
    throw error;
  }
};