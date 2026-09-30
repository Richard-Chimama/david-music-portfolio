"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { HomepageContent } from "@/types/types";

type ContentfulState = {
  homepage: HomepageContent | null;
};

type ContentfulAction =
  | { type: "setHomepage"; payload: HomepageContent }
  | { type: "clear" };

type ContentfulContextValue = ContentfulState & {
  dispatch: Dispatch<ContentfulAction>;
};

const ContentfulContext = createContext<ContentfulContextValue | undefined>(
  undefined,
);

function contentfulReducer(
  state: ContentfulState,
  action: ContentfulAction,
): ContentfulState {
  switch (action.type) {
    case "setHomepage":
      return { ...state, homepage: action.payload };
    case "clear":
      return { ...state, homepage: null };
    default:
      return state;
  }
}

export function ContentfulProvider({
  initialHomepage,
  children,
}: {
  initialHomepage: HomepageContent;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(contentfulReducer, {
    homepage: initialHomepage,
  });

  return (
    <ContentfulContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ContentfulContext.Provider>
  );
}

export function useContentfulState() {
  const context = useContext(ContentfulContext);

  if (!context) {
    throw new Error("useContentfulState must be used within ContentfulProvider");
  }

  return context;
}
