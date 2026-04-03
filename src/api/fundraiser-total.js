// api/fundraiser-total.js
const FUNDRAISER_URL =
  "https://fundraise.cafdn.org/25905/cafd/198058/james-runs-canada";

function extractRaisedAmount(html) {
  // best case: page JS contains para.raised = 3479.4
  const jsMatch = html.match(/para\.raised\s*=\s*([0-9.]+)/i);
  if (jsMatch) return Number(jsMatch[1]);

  // fallback: visible page text like CA$3,479.40
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

    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: `Upstream ${res.status}` }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const html = await res.text();
    const amountRaised = extractRaisedAmount(html);

    if (amountRaised == null) {
      return new Response(
        JSON.stringify({ ok: false, error: "Could not parse raised total" }),
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
        source: FUNDRAISER_URL,
        fetchedAt: new Date().toISOString(),
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