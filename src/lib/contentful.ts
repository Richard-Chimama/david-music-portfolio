import { HomepageContent } from "../types/types";
export async function getHomepageContent(): Promise<HomepageContent> {
  const query = `
    query Homepage {
      homePageCollection(limit: 1) {
        items {
          internalTitle

          hero {
            primaryImageText
            words
            socialIconsCollection {
              items{
               id
               name
               url
                }
              }

            textBody {
              json
            }

            primaryImage {
              url
              title
              description
              width
              height
            }

            heroImagesCollection {
              items {
                url
                title
                description
                width
                height
              }
            }
          }
        }
      }
    }
  `;

  console.info("[Contentful config]", {
  spaceIdPresent: Boolean(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID),
  environmentPresent: Boolean(process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT),
  accessTokenPresent: Boolean(process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN),
});

  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ?? "develop"}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    },
  );

  if (!response.ok) {
    console.error("Contentful request failed:", response.status,  response);
    throw new Error(`Contentful request failed: ${response.status}`);
  }

  const result = await response.json();

  console.log("Contentful response:", result);
  const homepage: HomepageContent = result.data?.homePageCollection?.items?.[0];

  if (!homepage) {
    throw new Error("No published Home Page entry found in Contentful");
  }

  return homepage;
}
