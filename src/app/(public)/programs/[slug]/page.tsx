import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RoadmapVisualization from "@/components/roadmap/RoadmapVisualization";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const programs = await prisma.program.findMany({ where: { published: true }, select: { slug: true } });
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const program = await prisma.program.findUnique({ where: { slug: params.slug } });
  if (!program) return {};
  return { title: program.title, description: program.description };
}

const LEVEL_COLORS: Record<string, string> = {
  Bachelor: "bg-blue-50 text-navy border-blue-200",
  Masters: "bg-amber-50 text-amber-800 border-amber-200",
  PhD: "bg-purple-50 text-purple-800 border-purple-200",
};

const TYPE_STATS: Record<string, { label: string; color: string }> = {
  CORE: { label: "Core", color: "bg-navy" },
  ELECTIVE: { label: "Elective", color: "bg-gray-400" },
  SPECIALIZATION: { label: "Spec.", color: "bg-teal-600" },
  CAPSTONE: { label: "Capstone", color: "bg-gold" },
  INDUSTRY: { label: "Industry", color: "bg-green-600" },
};

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const program = await prisma.program.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      courses: { orderBy: [{ year: "asc" }, { semester: "asc" }, { sortOrder: "asc" }] },
      careerOutcomes: { orderBy: { sortOrder: "asc" } },
      alumni: {
        where: { featured: true },
        take: 3,
      },
    },
  });

  if (!program) notFound();

  const totalUnits = program.courses.reduce((sum, c) => sum + c.units, 0);
  const courseTypeCount = program.courses.reduce(
    (acc, c) => ({ ...acc, [c.courseType]: (acc[c.courseType] || 0) + 1 }),
    {} as Record<string, number>
  );

  return (
    <>
      {/* Header */}
      <section className="bg-navy py-16 md:py-20">
        <div className="container-page">
          <nav className="text-white/60 text-sm mb-4 flex flex-wrap gap-1">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/programs" className="hover:text-white transition-colors">Programs</Link>
            <span className="mx-1">/</span>
            <span className="text-white">{program.title}</span>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full border mb-4 ${LEVEL_COLORS[program.level] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                {program.level}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{program.title}</h1>
              <p className="text-white/70 text-lg leading-relaxed">{program.description}</p>
            </div>

            {/* Quick info card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 min-w-48">
              <div className="space-y-4">
                {[
                  { label: "Level", value: program.level },
                  { label: "Duration", value: program.duration },
                  { label: "Total Courses", value: `${program.courses.length} courses` },
                  { label: "Total Units", value: `${totalUnits} units` },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-white/50 text-xs">{item.label}</p>
                    <p className="text-white font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course type breakdown */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="container-page">
          <div className="flex flex-wrap gap-3">
            {Object.entries(courseTypeCount).map(([type, count]) => {
              const info = TYPE_STATS[type];
              if (!info) return null;
              return (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm ${info.color}`} />
                  <span className="text-sm text-gray-600">{info.label}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Overview */}
      {program.overview && (
        <section className="bg-gray-50 py-12">
          <div className="container-page">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-navy mb-4">Program Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{program.overview}</p>
            </div>
          </div>
        </section>
      )}

      {/* Roadmap */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">Program Roadmap</h2>
            <p className="text-gray-500">Your complete course pathway, semester by semester. Hover over any course for details.</p>
          </div>
          <RoadmapVisualization
            courses={program.courses}
            careerOutcomes={program.careerOutcomes}
            duration={program.duration}
          />
        </div>
      </section>

      {/* Career Outcomes */}
      {program.careerOutcomes.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-page">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Career Outcomes</h2>
            <p className="text-gray-500 mb-10">Graduates of this program go on to exciting careers in:</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {program.careerOutcomes.map((outcome) => (
                <div key={outcome.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-card transition-shadow">
                  <div className="text-3xl mb-3">
                    {{"code": "💻", "brain": "🧠", "briefcase": "💼", "server": "🖥️", "shield": "🛡️",
                      "target": "🎯", "chart": "📊", "database": "🗄️", "trending": "📈", "flask": "🔬",
                      "layers": "📚", "calendar": "📅", "users": "👥", "message": "💬"}[outcome.icon] || "⭐"}
                  </div>
                  <h3 className="font-bold text-navy mb-2">{outcome.title}</h3>
                  {outcome.description && (
                    <p className="text-gray-500 text-sm">{outcome.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Alumni from this program */}
      {program.alumni.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-page">
            <h2 className="text-2xl font-bold text-navy mb-8">Alumni from This Program</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {program.alumni.map((alumnus) => (
                <div key={alumnus.id} className="card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center text-navy font-bold flex-shrink-0">
                      {alumnus.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{alumnus.name}</p>
                      <p className="text-xs text-gray-500">{alumnus.role} at {alumnus.company}</p>
                    </div>
                  </div>
                  {alumnus.testimonial && (
                    <p className="text-sm text-gray-600 italic leading-relaxed">
                      &ldquo;{alumnus.testimonial}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="container-page text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Interested in This Program?</h2>
          <p className="text-white/70 mb-8">Connect with our student advisors for personalised guidance and application support.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:info@programroadmap.edu.au" className="btn-gold">
              Enquire Now
            </a>
            <Link href="/programs" className="btn-outline">
              Explore Other Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
