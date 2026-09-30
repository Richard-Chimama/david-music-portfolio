import { getContentfulEntries } from "./contentful";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const contentType = new URL(request.url).searchParams.get("content_type") || undefined;
    const data = await getContentfulEntries(contentType);

    return Response.json(data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Contentful read error:", error);

    return Response.json(
      { error: "Contentful data is unavailable." },
      { status: 500 },
    );
  }
}