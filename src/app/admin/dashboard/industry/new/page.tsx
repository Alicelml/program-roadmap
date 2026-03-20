import IndustryPartnerForm from "@/components/admin/IndustryPartnerForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Industry Partner" };

export default function NewPartnerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Add Industry Partner</h1>
      <IndustryPartnerForm />
    </div>
  );
}
