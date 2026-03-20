import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const alumni = await prisma.alumni.findMany({
    include: { program: { select: { title: true, slug: true } } },
    orderBy: [{ featured: "desc" }, { graduationYear: "desc" }],
  });
  return NextResponse.json(alumni);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, role, company, graduationYear, bio, testimonial, featured, linkedin, programId } = body;

  if (!name || !role || !company || !graduationYear) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const alumni = await prisma.alumni.create({
    data: {
      name,
      role,
      company,
      graduationYear: Number(graduationYear),
      bio: bio || "",
      testimonial: testimonial || "",
      featured: featured || false,
      linkedin: linkedin || null,
      programId: programId || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/alumni");

  return NextResponse.json(alumni, { status: 201 });
}
