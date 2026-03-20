import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const outcome = await prisma.careerOutcome.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description || "",
      icon: body.icon || "briefcase",
      sortOrder: Number(body.sortOrder) || 0,
    },
  });

  const program = await prisma.program.findUnique({ where: { id: outcome.programId }, select: { slug: true } });
  if (program) revalidatePath(`/programs/${program.slug}`);

  return NextResponse.json(outcome);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const outcome = await prisma.careerOutcome.findUnique({ where: { id: params.id }, select: { programId: true } });
  await prisma.careerOutcome.delete({ where: { id: params.id } });

  if (outcome) {
    const program = await prisma.program.findUnique({ where: { id: outcome.programId }, select: { slug: true } });
    if (program) revalidatePath(`/programs/${program.slug}`);
  }

  return NextResponse.json({ success: true });
}
