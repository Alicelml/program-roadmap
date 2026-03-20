import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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

  return NextResponse.json(outcome);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.careerOutcome.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
