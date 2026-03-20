import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const alumni = await prisma.alumni.update({
    where: { id: params.id },
    data: {
      name: body.name,
      role: body.role,
      company: body.company,
      graduationYear: Number(body.graduationYear),
      bio: body.bio || "",
      testimonial: body.testimonial || "",
      featured: body.featured || false,
      linkedin: body.linkedin || null,
      programId: body.programId || null,
    },
  });

  return NextResponse.json(alumni);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.alumni.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
