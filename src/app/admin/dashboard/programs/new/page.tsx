import ProgramForm from "@/components/admin/ProgramForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Program" };

export default function NewProgramPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">New Program</h1>
        <p className="text-gray-500 mt-1">Create a new academic program with roadmap and career outcomes.</p>
      </div>
      <ProgramForm />
    </div>
  );
}
