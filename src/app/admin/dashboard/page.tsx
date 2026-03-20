import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

async function getStats() {
  const [programs, alumni, partners, courses] = await Promise.all([
    prisma.program.count(),
    prisma.alumni.count(),
    prisma.industryPartner.count(),
    prisma.course.count(),
  ]);
  return { programs, alumni, partners, courses };
}

async function getRecentPrograms() {
  return prisma.program.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: { id: true, title: true, level: true, published: true, updatedAt: true },
  });
}

const StatIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    programs: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    courses: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    alumni: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    partners: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };
  return <>{icons[name]}</>;
};

export default async function DashboardPage() {
  const [stats, recentPrograms] = await Promise.all([getStats(), getRecentPrograms()]);

  const statCards = [
    { label: "Programs", value: stats.programs, href: "/admin/dashboard/programs", color: "bg-navy", iconKey: "programs" },
    { label: "Courses", value: stats.courses, href: "/admin/dashboard/programs", color: "bg-teal-600", iconKey: "courses" },
    { label: "Alumni", value: stats.alumni, href: "/admin/dashboard/alumni", color: "bg-green-600", iconKey: "alumni" },
    { label: "Industry Partners", value: stats.partners, href: "/admin/dashboard/industry", color: "bg-purple", iconKey: "partners" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-card transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-navy">{card.value}</p>
                <p className="text-gray-500 text-sm mt-1">{card.label}</p>
              </div>
              <div className={`w-9 h-9 rounded-lg ${card.color} flex items-center justify-center text-white`}>
                <StatIcon name={card.iconKey} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            {
              href: "/admin/dashboard/programs/new", label: "Add Program",
              icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
            },
            {
              href: "/admin/dashboard/alumni/new", label: "Add Alumni",
              icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
            },
            {
              href: "/admin/dashboard/industry/new", label: "Add Partner",
              icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
            },
            {
              href: "/admin/dashboard/settings", label: "Edit Content",
              icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 text-navy text-sm font-medium rounded-lg hover:bg-navy hover:text-white transition-colors"
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent programs */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Programs</h2>
          <Link href="/admin/dashboard/programs" className="text-sm text-navy hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentPrograms.map((program) => (
            <div key={program.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${program.published ? "bg-green-500" : "bg-gray-300"}`} />
                <span className="text-sm font-medium text-gray-900">{program.title}</span>
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{program.level}</span>
              </div>
              <Link href={`/admin/dashboard/programs/${program.id}`} className="text-xs text-navy hover:underline">
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
