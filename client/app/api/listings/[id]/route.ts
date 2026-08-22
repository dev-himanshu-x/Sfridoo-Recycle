import { NextResponse } from "next/server";

export const runtime = "nodejs";

const backendBaseUrl = process.env.BACKEND_URL || "http://127.0.0.1:5001";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const response = await fetch(`${backendBaseUrl}/api/listings/${id}`, {
      cache: "no-store",
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to fetch listing from backend:", error);

    return NextResponse.json(
      { error: "Failed to reach backend service" },
      { status: 502 },
    );
  }
}
