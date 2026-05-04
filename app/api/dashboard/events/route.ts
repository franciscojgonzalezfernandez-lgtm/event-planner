import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    const events = await prisma.event.findMany({
      where: {
        userId: session?.user?.id,
      },
      orderBy: {
        date: "asc",
      },
    });
    return NextResponse.json(events, {
      status: 200,
    });
  } catch (error) {
    console.error("Error getting events:", error);
    return NextResponse.json(
      { error: "Failed to get events" },
      {
        status: 500,
      },
    );
  }
}
