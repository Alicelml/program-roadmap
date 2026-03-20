import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Alumni" };

export default async function AdminAlumniPage() {
  const alumni = await prisma.alumni.findMany({
    include: { program: { select: { title: true } } },
    orderBy: [{ featured: "desc" }, { graduationYear: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Alumni</h1>
          <p className="text-gray-500 mt-1">{alumni.length} alumni profiles</p>
        </div>
        <Link href="/admin/dashboard/alumni/new" className="btn-primary">
          + Add Alumni
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Year</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Featured</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alumni.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-navy text-xs font-semibold flex-shrink-0">
                      {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-sm text-gray-600">{a.role}</p>
                  {a.program && <p className="text-xs text-gray-400">{a.program.title}</p>}
                </td>
                <td className="px-4 py-4 hidden lg:table-cell text-sm text-gray-600">{a.graduationYear}</td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.featured ? "bg-gold text-navy" : "bg-gray-100 text-gray-500"}`}>
                    {a.featured ? "Featured" : "Normal"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/dashboard/alumni/${a.id}`} className="text-xs text-navy hover:bg-navy-50 px-2 py-1 rounded font-medium">Edit</Link>
                    <DeleteButton id={a.id} endpoint="/api/alumni" label="alumni" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {alumni.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">No alumni yet</p>
            <Link href="/admin/dashboard/alumni/new" className="text-navy hover:underline text-sm">Add your first alumni →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
