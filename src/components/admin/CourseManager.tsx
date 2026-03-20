"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

const COURSE_TYPES = ["CORE", "ELECTIVE", "SPECIALIZATION", "CAPSTONE", "INDUSTRY"];
const TYPE_COLORS: Record<string, string> = {
  CORE: "bg-navy text-white",
  ELECTIVE: "bg-gray-200 text-gray-700",
  SPECIALIZATION: "bg-teal-600 text-white",
  CAPSTONE: "bg-gold text-navy",
  INDUSTRY: "bg-green-600 text-white",
};

const emptyForm = {
  code: "", title: "", description: "", year: 1, semester: 1,
  courseType: "CORE", units: 3, sortOrder: 0,
};

export default function CourseManager({ programId, initialCourses }: { programId: string; initialCourses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const years = Array.from(new Set([...courses.map((c) => c.year), 1, 2, 3])).sort();

  async function handleSave() {
    setLoading(true);
    try {
      const url = editingId ? `/api/courses/${editingId}` : "/api/courses";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, programId }),
      });

      if (res.ok) {
        router.refresh();
        setShowForm(false);
        setEditingId(null);
        setForm({ ...emptyForm });
        // Update local state
        const updated = await res.json();
        if (editingId) {
          setCourses((cs) => cs.map((c) => (c.id === editingId ? updated : c)));
        } else {
          setCourses((cs) => [...cs, updated]);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCourses((cs) => cs.filter((c) => c.id !== id));
    }
  }

  function startEdit(course: Course) {
    setForm({
      code: course.code, title: course.title, description: course.description,
      year: course.year, semester: course.semester, courseType: course.courseType,
      units: course.units, sortOrder: course.sortOrder,
    });
    setEditingId(course.id);
    setShowForm(true);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Course list by year/semester */}
      <div className="p-6 space-y-6">
        {years.map((year) =>
          [1, 2].map((sem) => {
            const semCourses = courses.filter((c) => c.year === year && c.semester === sem)
              .sort((a, b) => a.sortOrder - b.sortOrder);
            if (semCourses.length === 0 && (year > Math.max(...courses.map((c) => c.year), 0) + 1)) return null;

            return (
              <div key={`${year}-${sem}`}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Year {year}, Semester {sem}
                </h3>
                <div className="space-y-2">
                  {semCourses.map((course) => (
                    <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${TYPE_COLORS[course.courseType] || "bg-gray-200 text-gray-700"}`}>
                        {course.courseType}
                      </span>
                      <span className="text-xs font-mono text-gray-400 flex-shrink-0 w-16">{course.code}</span>
                      <span className="text-sm font-medium text-gray-900 flex-1 min-w-0 truncate">{course.title}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{course.units}u</span>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => startEdit(course)} className="text-xs text-navy hover:bg-navy-50 px-2 py-1 rounded">Edit</button>
                        <button onClick={() => handleDelete(course.id)} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Del</button>
                      </div>
                    </div>
                  ))}
                  {semCourses.length === 0 && (
                    <p className="text-xs text-gray-400 italic py-1">No courses yet</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">{editingId ? "Edit Course" : "Add Course"}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label text-xs">Code *</label>
              <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                className="form-input text-sm font-mono" placeholder="CS1001" />
            </div>
            <div className="col-span-2 md:col-span-2">
              <label className="form-label text-xs">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="form-input text-sm" placeholder="Introduction to Programming" />
            </div>
            <div>
              <label className="form-label text-xs">Year</label>
              <select value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))} className="form-input text-sm">
                {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Semester</label>
              <select value={form.semester} onChange={(e) => setForm((f) => ({ ...f, semester: Number(e.target.value) }))} className="form-input text-sm">
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Type</label>
              <select value={form.courseType} onChange={(e) => setForm((f) => ({ ...f, courseType: e.target.value }))} className="form-input text-sm">
                {COURSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Units</label>
              <input type="number" value={form.units} onChange={(e) => setForm((f) => ({ ...f, units: Number(e.target.value) }))}
                className="form-input text-sm" min={1} max={12} />
            </div>
            <div>
              <label className="form-label text-xs">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                className="form-input text-sm" min={0} />
            </div>
            <div className="col-span-2 md:col-span-3">
              <label className="form-label text-xs">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="form-input text-sm resize-none" rows={2} placeholder="Brief course description..." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={loading || !form.code || !form.title} className="btn-primary text-sm disabled:opacity-70">
              {loading ? "Saving..." : editingId ? "Save Changes" : "Add Course"}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm({ ...emptyForm }); }}
              className="btn-outline-navy text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <div className="border-t border-gray-100 p-4">
          <button onClick={() => setShowForm(true)} className="text-sm text-navy hover:bg-navy-50 px-4 py-2 rounded-lg flex items-center gap-2">
            <span>+</span> Add Course
          </button>
        </div>
      )}
    </div>
  );
}
