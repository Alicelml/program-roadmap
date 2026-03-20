import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { programId, code, title, description, year, semester, courseType, units, sortOrder } = body;

  if (!programId || !code || !title || !year || !semester) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      programId,
      code,
      title,
      description: description || "",
      year: Number(year),
      semester: Number(semester),
      courseType: courseType || "CORE",
      units: Number(units) || 3,
      sortOrder: Number(sortOrder) || 0,
    },
  });

  return NextResponse.json(course, { status: 201 });
}
