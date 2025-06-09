import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientOnly } from "@/components/client-only";
import { Suspense } from "react";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "T0 Chat - Next Generation AI Chat Platform",
  description: "Experience the future of AI chat with T0 Chat.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense>
          <NextSSRPlugin
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
        </Suspense>
        <ClientOnly>
          <ThemeProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
