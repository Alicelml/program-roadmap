import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const course = await prisma.course.update({
    where: { id: params.id },
    data: {
      code: body.code,
      title: body.title,
      description: body.description,
      year: Number(body.year),
      semester: Number(body.semester),
      courseType: body.courseType,
      units: Number(body.units),
      sortOrder: Number(body.sortOrder),
    },
  });

  const program = await prisma.program.findUnique({ where: { id: course.programId }, select: { slug: true } });
  if (program) revalidatePath(`/programs/${program.slug}`);
  revalidatePath("/programs");

  return NextResponse.json(course);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const course = await prisma.course.findUnique({ where: { id: params.id }, select: { programId: true } });
  await prisma.course.delete({ where: { id: params.id } });

  if (course) {
    const program = await prisma.program.findUnique({ where: { id: course.programId }, select: { slug: true } });
    if (program) revalidatePath(`/programs/${program.slug}`);
  }
  revalidatePath("/programs");

  return NextResponse.json({ success: true });
}
