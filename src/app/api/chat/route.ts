import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();
    
    // Get client IP
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";
    
    // Combine browser metadata with server-side IP
    const enhancedMetadata = {
      ...(body.metadata || {}),
      ip,
    };

    const crmUrl = process.env.NEXT_PUBLIC_CRM_URL || "http://localhost:8001/api/v1";
    
    const response = await fetch(`${crmUrl}/contacts/identify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        message: body.message,
        site_id: body.siteId || process.env.NEXT_PUBLIC_DEV_SITE_ID,
        metadata: enhancedMetadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("CRM Error:", errorData);
      return NextResponse.json({ error: "Failed to connect to CRM" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
