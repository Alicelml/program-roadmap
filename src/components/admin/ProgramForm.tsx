"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

interface Program {
  id?: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  overview: string;
  featured: boolean;
  published: boolean;
}

interface Props {
  initialData?: Program;
}

const LEVELS = ["Bachelor", "Masters", "PhD", "Diploma"];
const DURATIONS = ["1 year", "1.5 years", "2 years", "3 years", "4 years"];

export default function ProgramForm({ initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Program>(
    initialData || {
      title: "",
      slug: "",
      description: "",
      level: "Bachelor",
      duration: "3 years",
      overview: "",
      featured: false,
      published: true,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((f) => ({ ...f, title, slug: !initialData ? slugify(title) : f.slug }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = initialData?.id ? `/api/programs/${initialData.id}` : "/api/programs";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "An error occurred");
        return;
      }

      const program = await res.json();
      router.push(`/admin/dashboard/programs/${program.id}`);
      router.refresh();
    } catch {
      setError("Failed to save program");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Program Details</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="form-label">Program Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              className="form-input"
              placeholder="Bachelor of Computer Science"
              required
            />
          </div>

          <div>
            <label className="form-label">URL Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="form-input font-mono text-sm"
              placeholder="bachelor-computer-science"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Level *</label>
              <select
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                className="form-input"
              >
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Duration *</label>
              <select
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                className="form-input"
              >
                {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Short Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="form-input resize-none"
              rows={3}
              placeholder="A concise summary shown on program cards..."
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Program Overview</label>
            <textarea
              value={form.overview}
              onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
              className="form-input resize-none"
              rows={5}
              placeholder="Detailed description shown on the program page..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 accent-navy rounded"
            />
            <span className="text-sm text-gray-700">Featured on homepage</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="w-4 h-4 accent-navy rounded"
            />
            <span className="text-sm text-gray-700">Published (visible to public)</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-70"
        >
          {loading ? "Saving..." : initialData ? "Save Changes" : "Create Program"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline-navy"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
