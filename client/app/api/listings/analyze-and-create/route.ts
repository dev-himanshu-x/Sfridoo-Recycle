import { NextResponse } from "next/server";

const backendBaseUrl = process.env.BACKEND_URL || "http://127.0.0.1:5001";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const response = await fetch(
      `${backendBaseUrl}/api/listings/analyze-and-create`,
      {
        method: "POST",
        body: formData,
      },
    );

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to proxy listing creation to backend:", error);

    return NextResponse.json(
      { error: "Failed to reach backend service" },
      { status: 502 },
    );
  }
}
