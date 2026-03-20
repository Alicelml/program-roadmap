import { prisma } from "@/lib/prisma";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Site Content" };

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findMany({ orderBy: { key: "asc" } });
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Site Content</h1>
        <p className="text-gray-500 mt-1">Edit the text content displayed throughout the site.</p>
      </div>
      <SiteSettingsForm initialSettings={settingsMap} />
    </div>
  );
}
