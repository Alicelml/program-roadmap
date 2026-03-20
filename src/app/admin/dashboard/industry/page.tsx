import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Industry Partners" };

const TIER_COLORS: Record<string, string> = {
  GOLD: "bg-amber-50 text-amber-700",
  SILVER: "bg-gray-100 text-gray-600",
  BRONZE: "bg-orange-50 text-orange-700",
};

export default async function AdminIndustryPage() {
  const partners = await prisma.industryPartner.findMany({
    orderBy: [{ tier: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Industry Partners</h1>
          <p className="text-gray-500 mt-1">{partners.length} partners</p>
        </div>
        <Link href="/admin/dashboard/industry/new" className="btn-primary">
          + Add Partner
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Partner</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Tier</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partners.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{p.name}</p>
                  {p.website && <p className="text-xs text-gray-400 truncate max-w-48">{p.website}</p>}
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-gray-600">{p.category}</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIER_COLORS[p.tier] || "bg-gray-100 text-gray-500"}`}>
                    {p.tier}
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${p.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.published ? "bg-green-500" : "bg-gray-400"}`} />
                    {p.published ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/dashboard/industry/${p.id}`} className="text-xs text-navy hover:bg-navy-50 px-2 py-1 rounded font-medium">Edit</Link>
                    <DeleteButton id={p.id} endpoint="/api/industry" label="partner" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {partners.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">No partners yet</p>
            <Link href="/admin/dashboard/industry/new" className="text-navy hover:underline text-sm">Add your first partner →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
