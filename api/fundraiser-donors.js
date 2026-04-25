function decodeHtmlEntities(text = "") {
  return text
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export default async function handler(req, res) {
  try {
    const pageUrl =
      "https://fundraise.cafdn.org/25905/cafd/198058/james-runs-canada";

    const response = await fetch(pageUrl, {
      headers: {
        "user-agent": "Mozilla/5.0",
      },
    });

    const html = await response.text();

    const match = html.match(
      /new DonorRollWidget\((\[.*?\]),\s*['"]drw[^'"]+['"],\s*\d+\)/s
    );

    if (!match) {
      return res.status(200).json({
        ok: false,
        donors: [],
        error: "Could not find donor list",
      });
    }

    const rawDonors = JSON.parse(match[1]);

    const donors = rawDonors.map((donor) => ({
        id: donor.id,
        date: donor.date || "",
        name: decodeHtmlEntities(donor.name || "Anonymous"),
        amount: donor.amount || "",
        comment: decodeHtmlEntities(donor.comments || ""),
    }));

    res.status(200).json({
      ok: true,
      donors,
    });
  } catch (err) {
    console.error("Failed to load fundraiser donors:", err);

    res.status(500).json({
      ok: false,
      donors: [],
      error: "Failed to load fundraiser donors",
    });
  }
}