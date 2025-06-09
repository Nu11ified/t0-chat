import { betterAuth } from "better-auth";
import { multiSession } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db"; // your drizzle instance
import { env } from "@/env";
import { Polar } from "@polar-sh/sdk";
import {
    polar,
    checkout,
    portal,
    usage,
    webhooks,
} from "@polar-sh/better-auth";

const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN as string,
    // Use 'sandbox' if you're using the Polar Sandbox environment
    // Remember that access tokens, products, etc. are completely separated between environments.
    // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
    server: "sandbox",
  });
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    socialProviders: { 
        github: { 
           clientId: env.GITHUB_CLIENT_ID, 
           clientSecret: env.GITHUB_CLIENT_SECRET, 
           redirectUri: `${env.BETTER_AUTH_URL}/callback/github`,
        }, 
    }, 
    plugins: [
        multiSession(),
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            getCustomerCreateParams: async ({ user }, request) => {
                return {
                    metadata: {
                        //get user id from user
                        userId: user.id,
                        email: user.email,
                    },
                }
            },
            use: [
                checkout({
                    products: [
                        {
                            productId: "fcb948f8-fc22-4b78-8dfa-a7c85040d801",
                            slug: "t0-chat-Subscription" // Custom slug for easy reference in Checkout URL, e.g. /checkout/t0-chat-Subscription
                        }
                    ],
                    successUrl: env.POLAR_SUCCESS_URL as string,
                    authenticatedUsersOnly: true
                }),
                portal(),
                usage(),
            ],
        }),
    ],
    session: {
        cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
        },
    },
});