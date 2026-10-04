  export const query = `
    query Homepage {
      homePageCollection(limit: 1) {
        items {
          internalTitle

          hero {
            primaryImageText
            words
            socialIconsCollection {
              items {
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

      profileCollection(limit: 1) {
        items {
          internalId
          aboutHeading
          description {
            json
          }
          musicProfileSidebar {
            internalTitle
            entitiesHeading
            highlightCollection {
              items {
                internalTitle
                text
                icon {
                  internalTitle
                  phosphorIcon
                }
              }
            }
            entitiesCollection {
              items {
                internalTitle
                name
                icon {
                  internalTitle
                  phosphorIcon
                }
              }
            }
          }
        }
      }
    }
  `;