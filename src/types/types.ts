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
  hero: HeroContent;
  profile: ProfileContent | null;
};

export type ProfileContent = {
  internalId: string;
  aboutHeading: string;
  description: {
    json: unknown;
  } | null;
  musicProfileSidebar: MusicProfileSection | null;
};

export type MusicProfileSection = {
  internalTitle: string;
  entitiesHeading: string | null;
  highlightCollection: {
    items: MusicHighlightContent[];
  };
  entitiesCollection: {
    items: MusicEntityContent[];
  };
};

export type MusicHighlightContent = {
  internalTitle: string;
  text: string;
  icon: Icon | null;
};

export type MusicEntityContent = {
  internalTitle: string;
  name: string;
  icon: Icon | null;
}

export type Icon = {
  internalTitle: string;
  phosphorIcon: PhosphorIcon | null;
};

type PhosphorIcon = {
  componentName?: string | null;
  weight?: string | null;
  name?: string | null;
  position?: string | null;
};

export type HomepageResponse = {
  homePageCollection: {
    items: HomepageContent[];
  };
  profileCollection: {
    items: ProfileContent[];
  };
};
