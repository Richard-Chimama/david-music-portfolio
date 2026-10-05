  export const query = `
    query Homepage {
      homePageCollection(limit: 1) {
        items {
          internalTitle

          hero {
            primaryImageText
            words
            socialIconsCollection(limit: 10) {
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

            heroImagesCollection(limit: 10) {
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
            highlightCollection(limit: 20) {
              items {
                internalTitle
                text
                icon {
                  internalTitle
                  phosphorIcon
                }
              }
            }
            entitiesCollection(limit: 20) {
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

      musicPlaylistCollection(limit: 1) {
        items {
          internalTitle
          description
          tracksCollection(limit: 100) {
            items {
              internalTitle
              previewAudioCollection(limit: 1) {
                items {
                  url
                  title
                  description
                  fileName
                  contentType
                  size
                  width
                  height
                }
              }
              fullAudioCollection(limit: 1) {
                items {
                  url
                  title
                  description
                  fileName
                  contentType
                  size
                  width
                  height
                }
              }
              tags
              duration
              price
              currency
              publishedDate
            }
          }
        }
      }
    }
  `;