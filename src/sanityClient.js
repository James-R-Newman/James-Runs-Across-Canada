import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "10gz6ylm",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});
