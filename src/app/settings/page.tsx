"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { SettingsCard } from "./_components/SettingsCard";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto max-w-2xl py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="space-y-8">
          <SettingsCard />
        </div>
      </div>
    </MainLayout>
  );
} 