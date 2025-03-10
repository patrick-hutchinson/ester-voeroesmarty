import { gql } from "@apollo/client";
import client from './api/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug, offset, limit } = req.body;

  try {
    const { data } = await client.query({
      query: gql`
        query ($slug: String!, $start: Int, $limit: Int) {
          projects(filters: { slug: { eq: $slug } }) {
            data {
              attributes {
                projectMedia(pagination: { start: $start, limit: $limit }) {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { slug, start: offset, limit },
    });

    const newMedia = data.projects.data[0].attributes.projectMedia.data;

    res.status(200).json({ newMedia });
  } catch (error) {
    console.error('Error fetching more data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
