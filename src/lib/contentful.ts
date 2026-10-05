import { HomepageContent, MusicPlaylistContent } from "../types/types";
import { query } from "./queries";
export async function getHomepageContent(): Promise<HomepageContent> {

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

  const result = await response.json();

  if (!response.ok) {
    console.error("Contentful request failed:", response.status, result);
    throw new Error(`Contentful request failed: ${response.status}`);
  }

  if (result.errors?.length) {
    const messages = result.errors.map((error: { message: string }) => error.message);
    console.error("Contentful GraphQL errors:", result.errors);
    throw new Error(`Contentful GraphQL request failed: ${messages.join("; ")}`);
  }

  console.log("Contentful response:", result);
  const homepageCollection = result.data?.homePageCollection?.items?.[0];
  const profileCollection = result.data?.profileCollection?.items?.[0];
  const musicPlaylistCollection: MusicPlaylistContent = result.data?.musicPlaylistCollection?.items?.[0];

  const homepageEntry: HomepageContent | undefined = {
    hero: homepageCollection ?? null,
    profile: profileCollection ?? null,
    musicPlaylists: musicPlaylistCollection ?? null,
  }

  if (!homepageEntry) {
    throw new Error("No published Home Page entry found in Contentful");
  }


  return { ...homepageEntry};
}
