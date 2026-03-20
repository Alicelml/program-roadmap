import { prisma } from "@/lib/prisma";
import AlumniForm from "@/components/admin/AlumniForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Alumni" };

export default async function NewAlumniPage() {
  const programs = await prisma.program.findMany({ where: { published: true }, select: { id: true, title: true }, orderBy: { title: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Add Alumni</h1>
      <AlumniForm programs={programs} />
    </div>
  );
}
