import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Manage Programs" };

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({
    include: { _count: { select: { courses: true, alumni: true } } },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Programs</h1>
          <p className="text-gray-500 mt-1">{programs.length} programs total</p>
        </div>
        <Link href="/admin/dashboard/programs/new" className="btn-primary">
          + Add Program
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Program</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Level</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Courses</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {programs.map((program) => (
              <tr key={program.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{program.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{program.duration} · /{program.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-xs bg-navy-50 text-navy rounded-full px-2 py-1">{program.level}</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-sm text-gray-600">{program._count.courses} courses</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${program.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${program.published ? "bg-green-500" : "bg-gray-400"}`} />
                    {program.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/programs/${program.slug}`}
                      target="_blank"
                      className="text-xs text-gray-500 hover:text-navy px-2 py-1 rounded hover:bg-gray-100"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/dashboard/programs/${program.id}`}
                      className="text-xs text-navy hover:bg-navy-50 px-2 py-1 rounded font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={program.id} endpoint="/api/programs" label="program" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {programs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No programs yet</p>
            <Link href="/admin/dashboard/programs/new" className="text-navy hover:underline text-sm">
              Add your first program →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
