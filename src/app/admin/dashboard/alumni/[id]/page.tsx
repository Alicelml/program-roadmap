import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AlumniForm from "@/components/admin/AlumniForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Alumni" };

export default async function EditAlumniPage({ params }: { params: { id: string } }) {
  const [alumni, programs] = await Promise.all([
    prisma.alumni.findUnique({ where: { id: params.id } }),
    prisma.program.findMany({ where: { published: true }, select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  if (!alumni) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy">Edit Alumni</h1>
      <AlumniForm
        programs={programs}
        initialData={{
          id: alumni.id,
          name: alumni.name,
          role: alumni.role,
          company: alumni.company,
          graduationYear: alumni.graduationYear,
          bio: alumni.bio,
          testimonial: alumni.testimonial,
          featured: alumni.featured,
          linkedin: alumni.linkedin || "",
          programId: alumni.programId || "",
        }}
      />
    </div>
  );
}
