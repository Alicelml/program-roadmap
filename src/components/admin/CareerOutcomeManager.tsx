"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CareerIcon } from "@/components/ui/Icons";

interface CareerOutcome {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
}

const ICONS = ["briefcase", "code", "brain", "server", "shield", "target", "chart", "database", "trending", "flask", "layers", "users", "message", "calendar"];

export default function CareerOutcomeManager({ programId, initialOutcomes }: { programId: string; initialOutcomes: CareerOutcome[] }) {
  const [outcomes, setOutcomes] = useState(initialOutcomes);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", icon: "briefcase", sortOrder: 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setLoading(true);
    try {
      const url = editingId ? `/api/career-outcomes/${editingId}` : "/api/career-outcomes";
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
        setForm({ title: "", description: "", icon: "briefcase", sortOrder: 0 });
        const updated = await res.json();
        if (editingId) {
          setOutcomes((os) => os.map((o) => (o.id === editingId ? updated : o)));
        } else {
          setOutcomes((os) => [...os, updated]);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/career-outcomes/${id}`, { method: "DELETE" });
    if (res.ok) setOutcomes((os) => os.filter((o) => o.id !== id));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {outcomes.map((o) => (
            <div key={o.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy flex-shrink-0">
                <CareerIcon name={o.icon} className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{o.title}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => { setForm({ title: o.title, description: o.description, icon: o.icon, sortOrder: o.sortOrder }); setEditingId(o.id); setShowForm(true); }}
                  className="text-xs text-navy hover:bg-navy-50 px-2 py-1 rounded"
                >Edit</button>
                <button onClick={() => handleDelete(o.id)} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">{editingId ? "Edit Outcome" : "Add Career Outcome"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="form-label text-xs">Title *</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="form-input text-sm" placeholder="Software Engineer" />
            </div>
            <div>
              <label className="form-label text-xs">Icon</label>
              <select value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} className="form-input text-sm">
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label text-xs">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                className="form-input text-sm" min={0} />
            </div>
            <div className="col-span-2">
              <label className="form-label text-xs">Description</label>
              <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="form-input text-sm" placeholder="Brief description of this career path..." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={loading || !form.title} className="btn-primary text-sm disabled:opacity-70">
              {loading ? "Saving..." : editingId ? "Save" : "Add"}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-outline-navy text-sm">Cancel</button>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="border-t border-gray-100 p-4">
          <button onClick={() => setShowForm(true)} className="text-sm text-navy hover:bg-navy-50 px-4 py-2 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Career Outcome
          </button>
        </div>
      )}
    </div>
  );
}
