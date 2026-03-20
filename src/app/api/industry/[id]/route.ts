import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const partner = await prisma.industryPartner.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description || "",
      website: body.website || null,
      category: body.category || "Technology",
      tier: body.tier || "SILVER",
      published: body.published !== false,
    },
  });

  revalidatePath("/");
  revalidatePath("/industry");

  return NextResponse.json(partner);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.industryPartner.delete({ where: { id: params.id } });

  revalidatePath("/");
  revalidatePath("/industry");

  return NextResponse.json({ success: true });
}
