import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProgramForm from "@/components/admin/ProgramForm";
import CourseManager from "@/components/admin/CourseManager";
import CareerOutcomeManager from "@/components/admin/CareerOutcomeManager";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const program = await prisma.program.findUnique({ where: { id: params.id }, select: { title: true } });
  return { title: program ? `Edit: ${program.title}` : "Edit Program" };
}

export default async function EditProgramPage({ params }: { params: { id: string } }) {
  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: {
      courses: { orderBy: [{ year: "asc" }, { semester: "asc" }, { sortOrder: "asc" }] },
      careerOutcomes: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!program) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-sm text-gray-500 mb-1">
            <Link href="/admin/dashboard/programs" className="hover:text-navy">Programs</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{program.title}</span>
          </nav>
          <h1 className="text-2xl font-bold text-navy">Edit Program</h1>
        </div>
        <Link
          href={`/programs/${program.slug}`}
          target="_blank"
          className="text-sm text-navy border border-navy rounded-lg px-3 py-1.5 hover:bg-navy hover:text-white transition-colors"
        >
          View Live →
        </Link>
      </div>

      {/* Program Details */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Program Details</h2>
        <ProgramForm initialData={{
          id: program.id,
          title: program.title,
          slug: program.slug,
          description: program.description,
          level: program.level,
          duration: program.duration,
          overview: program.overview,
          featured: program.featured,
          published: program.published,
        }} />
      </section>

      {/* Courses */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Courses & Roadmap</h2>
        <CourseManager programId={program.id} initialCourses={program.courses} />
      </section>

      {/* Career Outcomes */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Career Outcomes</h2>
        <CareerOutcomeManager programId={program.id} initialOutcomes={program.careerOutcomes} />
      </section>
    </div>
  );
}
