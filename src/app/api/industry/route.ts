import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const partners = await prisma.industryPartner.findMany({ orderBy: [{ tier: "asc" }, { name: "asc" }] });
  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, website, category, tier, published } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const partner = await prisma.industryPartner.create({
    data: {
      name,
      description: description || "",
      website: website || null,
      category: category || "Technology",
      tier: tier || "SILVER",
      published: published !== false,
    },
  });

  return NextResponse.json(partner, { status: 201 });
}
