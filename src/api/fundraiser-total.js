// api/fundraiser-total.js
const FUNDRAISER_URL =
  "https://fundraise.cafdn.org/25905/cafd/198058/james-runs-canada";

function extractRaisedAmount(html) {
  const jsMatch = html.match(/para\.raised\s*=\s*([0-9.]+)/i);
  if (jsMatch) return Number(jsMatch[1]);

  const pageMatch = html.match(/<div class="page-raised">CA\$([0-9,]+(?:\.[0-9]{1,2})?)<\/div>/i);
  if (pageMatch) return Number(pageMatch[1].replace(/,/g, ""));

  const textMatch = html.match(/CA\$\s*([0-9,]+(?:\.[0-9]{1,2})?)/i);
  if (textMatch) return Number(textMatch[1].replace(/,/g, ""));

  return null;
}

export async function GET() {
  try {
    const res = await fetch(FUNDRAISER_URL, {
      headers: {
        "User-Agent": "JamesRunsCanadaSite/1.0",
      },
    });

    const html = await res.text();
    const amountRaised = extractRaisedAmount(html);

    if (!res.ok || amountRaised == null) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Could not fetch or parse fundraiser total",
          status: res.status,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        amountRaised,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}