import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import IndustryPartnerForm from "@/components/admin/IndustryPartnerForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Industry Partner" };

export default async function EditPartnerPage({ params }: { params: { id: string } }) {
  const partner = await prisma.industryPartner.findUnique({ where: { id: params.id } });
  if (!partner) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Edit Partner</h1>
      <IndustryPartnerForm initialData={{
        id: partner.id,
        name: partner.name,
        description: partner.description,
        website: partner.website || "",
        category: partner.category,
        tier: partner.tier,
        published: partner.published,
      }} />
    </div>
  );
}
