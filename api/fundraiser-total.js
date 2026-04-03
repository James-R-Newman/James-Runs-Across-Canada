// api/fundraiser-total.js
export default async function handler(req, res) {
  const FUNDRAISER_URL =
    "https://fundraise.cafdn.org/25905/cafd/198058/james-runs-canada";

  function extractRaisedAmount(html) {
    const jsMatch = html.match(/para\.raised\s*=\s*([0-9.]+)/i);
    if (jsMatch) return Number(jsMatch[1]);

    const pageMatch = html.match(/CA\$\s*([0-9,]+(?:\.[0-9]{1,2})?)/i);
    if (pageMatch) return Number(pageMatch[1].replace(/,/g, ""));

    return null;
  }

  try {
    const upstream = await fetch(FUNDRAISER_URL, {
      headers: {
        "User-Agent": "JamesRunsCanadaSite/1.0",
      },
    });

    const html = await upstream.text();
    const amountRaised = extractRaisedAmount(html);

    if (!upstream.ok || amountRaised == null) {
      return res.status(500).json({
        ok: false,
        error: "Could not fetch or parse fundraiser total",
      });
    }

    return res.status(200).json({
      ok: true,
      amountRaised,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}