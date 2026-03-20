"use client";

import { useState } from "react";

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  year: number;
  semester: number;
  courseType: string;
  units: number;
  sortOrder: number;
}

interface CareerOutcome {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface RoadmapProps {
  courses: Course[];
  careerOutcomes: CareerOutcome[];
  duration: string;
}

const TYPE_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  CORE: { bg: "bg-navy", border: "border-navy", text: "text-white", label: "Core" },
  ELECTIVE: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-700", label: "Elective" },
  SPECIALIZATION: { bg: "bg-teal-600", border: "border-teal-600", text: "text-white", label: "Specialization" },
  CAPSTONE: { bg: "bg-gold", border: "border-gold", text: "text-navy", label: "Capstone" },
  INDUSTRY: { bg: "bg-green-600", border: "border-green-600", text: "text-white", label: "Industry" },
};

const ICONS: Record<string, string> = {
  code: "💻", brain: "🧠", briefcase: "💼", server: "🖥️", shield: "🛡️",
  target: "🎯", chart: "📊", database: "🗄️", trending: "📈", flask: "🔬",
  layers: "📚", calendar: "📅", users: "👥", message: "💬", default: "⭐",
};

export default function RoadmapVisualization({ courses, careerOutcomes, duration }: RoadmapProps) {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  // Group courses by year and semester
  const years = Array.from(new Set(courses.map((c) => c.year))).sort();

  const getCourses = (year: number, semester: number) =>
    courses.filter((c) => c.year === year && c.semester === semester).sort((a, b) => a.sortOrder - b.sortOrder);

  const totalYears = parseInt(duration) || years.length;

  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(TYPE_STYLES).map(([type, style]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${style.bg}`} />
            <span className="text-xs text-gray-600">{style.label}</span>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <div className="roadmap-container">
        <div className="flex gap-0 min-w-max">
          {years.map((year, yearIdx) => (
            <div key={year} className="flex flex-col min-w-0">
              {/* Year header */}
              <div className="flex items-center mb-4 px-4">
                <div className="bg-navy text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {year}
                </div>
                <div className="ml-2">
                  <p className="text-xs font-semibold text-navy">Year {year}</p>
                  <p className="text-xs text-gray-400">
                    {year === 1 ? "Foundations" : year === totalYears ? "Specialisation" : "Core Skills"}
                  </p>
                </div>
                {yearIdx < years.length - 1 && (
                  <div className="ml-4 flex-1 h-px bg-gray-200 min-w-8" />
                )}
              </div>

              {/* Semesters */}
              <div className="flex gap-3 px-2">
                {[1, 2].map((sem) => {
                  const semCourses = getCourses(year, sem);
                  if (semCourses.length === 0) return null;

                  return (
                    <div key={sem} className="w-52">
                      <div className="text-xs font-medium text-gray-500 mb-2 ml-1">
                        Semester {sem}
                      </div>
                      <div className="space-y-2">
                        {semCourses.map((course) => {
                          const style = TYPE_STYLES[course.courseType] || TYPE_STYLES.CORE;
                          const isHovered = hoveredCourse === course.id;

                          return (
                            <div
                              key={course.id}
                              className="course-node relative group"
                              onMouseEnter={() => setHoveredCourse(course.id)}
                              onMouseLeave={() => setHoveredCourse(null)}
                            >
                              <div
                                className={`rounded-lg border ${style.border} ${isHovered ? style.bg : "bg-white"}
                                  ${isHovered ? style.text : "text-gray-800"} p-3 cursor-default transition-all duration-200
                                  shadow-sm hover:shadow-md`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className={`text-[10px] font-mono ${isHovered ? "opacity-80" : "text-gray-400"}`}>
                                      {course.code}
                                    </p>
                                    <p className={`text-xs font-semibold leading-tight mt-0.5 ${isHovered ? "" : "text-gray-800"}`}>
                                      {course.title}
                                    </p>
                                  </div>
                                  <span
                                    className={`flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-medium
                                      ${isHovered ? "bg-white/20 text-white" : `border ${style.border} text-gray-500`}`}
                                  >
                                    {course.units}u
                                  </span>
                                </div>
                              </div>

                              {/* Tooltip */}
                              {isHovered && course.description && (
                                <div className="absolute bottom-full left-0 mb-2 w-56 bg-navy text-white text-xs rounded-lg p-3 shadow-lg z-10">
                                  <p className="font-semibold mb-1">{course.title}</p>
                                  <p className="text-white/80 leading-relaxed">{course.description}</p>
                                  <div className="flex justify-between mt-2 pt-2 border-t border-white/20 text-white/60">
                                    <span>{style.label}</span>
                                    <span>{course.units} units</span>
                                  </div>
                                  <div className="absolute bottom-0 left-4 translate-y-full">
                                    <div className="border-4 border-transparent border-t-navy" />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Year connector arrow */}
              {yearIdx < years.length - 1 && (
                <div className="flex items-center justify-end pr-2 mt-4">
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* Career Outcomes */}
          <div className="ml-4 flex flex-col">
            <div className="flex items-center mb-4 px-4">
              <div className="bg-gold text-navy rounded-full w-8 h-8 flex items-center justify-center text-sm">
                🎓
              </div>
              <div className="ml-2">
                <p className="text-xs font-semibold text-navy">Career</p>
                <p className="text-xs text-gray-400">Outcomes</p>
              </div>
            </div>

            <div className="px-2 w-48 space-y-2">
              {careerOutcomes.slice(0, 6).map((outcome) => (
                <div
                  key={outcome.id}
                  className="bg-gold-50 border border-gold/30 rounded-lg p-2.5 group hover:bg-gold hover:border-gold transition-all cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{ICONS[outcome.icon] || ICONS.default}</span>
                    <p className="text-xs font-medium text-navy leading-tight">{outcome.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: vertical summary */}
      <div className="md:hidden">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Course Summary</h3>
        <div className="space-y-2">
          {courses.map((course) => {
            const style = TYPE_STYLES[course.courseType] || TYPE_STYLES.CORE;
            return (
              <div key={course.id} className="flex items-center gap-3 py-2 border-b border-gray-100">
                <div className={`w-2 h-2 rounded-full ${style.bg} flex-shrink-0`} />
                <span className="text-xs text-gray-400 font-mono w-16 flex-shrink-0">{course.code}</span>
                <span className="text-sm text-gray-800 flex-1">{course.title}</span>
                <span className="text-xs text-gray-400">Y{course.year}S{course.semester}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
