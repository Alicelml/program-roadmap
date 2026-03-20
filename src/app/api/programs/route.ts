import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const programs = await prisma.program.findMany({
    include: { _count: { select: { courses: true, alumni: true } } },
    orderBy: { title: "asc" },
  });
  return NextResponse.json(programs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, level, duration, overview, featured, published, slug } = body;

  if (!title || !slug || !level || !duration) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const program = await prisma.program.create({
    data: { title, description: description || "", level, duration, overview: overview || "", featured: featured || false, published: published !== false, slug },
  });

  return NextResponse.json(program, { status: 201 });
}
