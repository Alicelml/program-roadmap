import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { programId, title, description, icon, sortOrder } = body;

  if (!programId || !title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const outcome = await prisma.careerOutcome.create({
    data: {
      programId,
      title,
      description: description || "",
      icon: icon || "briefcase",
      sortOrder: Number(sortOrder) || 0,
    },
  });

  return NextResponse.json(outcome, { status: 201 });
}
