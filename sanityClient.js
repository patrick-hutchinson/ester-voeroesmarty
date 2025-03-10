import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-08-01",
  useCdn: false
});

export default client;