"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Program { id: string; title: string; }

interface Alumni {
  id?: string;
  name: string;
  role: string;
  company: string;
  graduationYear: number;
  bio: string;
  testimonial: string;
  featured: boolean;
  linkedin: string;
  programId: string;
}

interface Props {
  initialData?: Alumni;
  programs: Program[];
}

export default function AlumniForm({ initialData, programs }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Alumni>(initialData || {
    name: "", role: "", company: "", graduationYear: new Date().getFullYear() - 1,
    bio: "", testimonial: "", featured: false, linkedin: "", programId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = initialData?.id ? `/api/alumni/${initialData.id}` : "/api/alumni";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, programId: form.programId || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "An error occurred");
        return;
      }

      router.push("/admin/dashboard/alumni");
      router.refresh();
    } catch {
      setError("Failed to save alumni");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Full Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="form-input" placeholder="Sarah Chen" required />
          </div>
          <div>
            <label className="form-label">Graduation Year *</label>
            <input type="number" value={form.graduationYear}
              onChange={(e) => setForm((f) => ({ ...f, graduationYear: Number(e.target.value) }))}
              className="form-input" min={1990} max={2030} required />
          </div>
          <div>
            <label className="form-label">Role *</label>
            <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="form-input" placeholder="Senior Software Engineer" required />
          </div>
          <div>
            <label className="form-label">Company *</label>
            <input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              className="form-input" placeholder="Google" required />
          </div>
          <div>
            <label className="form-label">LinkedIn URL</label>
            <input value={form.linkedin} onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
              className="form-input" placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label className="form-label">Program</label>
            <select value={form.programId} onChange={(e) => setForm((f) => ({ ...f, programId: e.target.value }))}
              className="form-input">
              <option value="">Select program (optional)</option>
              {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="form-input resize-none" rows={3} placeholder="Brief biography..." />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Testimonial Quote</label>
            <textarea value={form.testimonial} onChange={(e) => setForm((f) => ({ ...f, testimonial: e.target.value }))}
              className="form-input resize-none" rows={4} placeholder="Quote shown on the alumni page and homepage..." />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="w-4 h-4 accent-navy rounded" />
          <span className="text-sm text-gray-700">Featured (shown prominently on alumni page and homepage)</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-70">
          {loading ? "Saving..." : initialData ? "Save Changes" : "Add Alumni"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline-navy">Cancel</button>
      </div>
    </form>
  );
}
