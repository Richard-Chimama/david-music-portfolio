type ContentfulAsset = {
  url: string;
  title: string | null;
  description: string | null;
  width: number | null;
  height: number | null;
};

export type SocialLink = {
  id?: string;
  name: string;
  url: string;
};

export type HeroContent = {
  primaryImageText: string;
  words: string[];
  textBody: {
    json: unknown;
  } | null;
  socialIconsCollection: {
    items: {
      id: string;
      name: string;
      url: string;
    }[];
  } | null;
  primaryImage: ContentfulAsset | null;
  heroImagesCollection: {
    items: ContentfulAsset[];
  };
};

export type HomepageContent = {
  internalTitle: string;
  hero: HeroContent;
};

export type HomepageResponse = {
  homePageCollection: {
    items: HomepageContent[];
  };
};
