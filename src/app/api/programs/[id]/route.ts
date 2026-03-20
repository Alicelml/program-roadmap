import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: {
      courses: { orderBy: [{ year: "asc" }, { semester: "asc" }, { sortOrder: "asc" }] },
      careerOutcomes: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(program);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, level, duration, overview, featured, published, slug } = body;

  const program = await prisma.program.update({
    where: { id: params.id },
    data: { title, description, level, duration, overview, featured, published, slug },
  });

  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath(`/programs/${program.slug}`);

  return NextResponse.json(program);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const program = await prisma.program.findUnique({ where: { id: params.id }, select: { slug: true } });
  await prisma.program.delete({ where: { id: params.id } });

  revalidatePath("/");
  revalidatePath("/programs");
  if (program) revalidatePath(`/programs/${program.slug}`);

  return NextResponse.json({ success: true });
}
