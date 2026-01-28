import { config, fields, collection, singleton } from "@keystatic/core";

const storageKind =
  import.meta.env.PUBLIC_KEYSTATIC_STORAGE_KIND ||
  import.meta.env.KEYSTATIC_STORAGE_KIND;
const repo =
  import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO ||
  import.meta.env.KEYSTATIC_GITHUB_REPO ||
  "seattle-tabla-institute/seattletablainstitutenetlify.org";

const storage =
  storageKind === "github"
    ? { kind: "github", repo }
    : storageKind === "cloud"
    ? { kind: "cloud" }
    : { kind: "local" };

const imageField = fields.image({
  label: "Image",
  directory: "public/assets/uploads",
  publicPath: "/assets/uploads/"
});

const bodyField = fields.markdoc.inline({
  label: "Details",
  options: {
    image: {
      directory: "public/assets/uploads",
      publicPath: "/assets/uploads/"
    }
  }
});

export default config({
  storage,
  ...(storageKind === "cloud"
    ? { cloud: { project: import.meta.env.KEYSTATIC_CLOUD_PROJECT || "" } }
    : {}),
  collections: {
    events: collection({
      label: "Events",
      path: "content/events/*",
      format: { data: "json" },
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Date" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Upcoming", value: "upcoming" },
            { label: "Past", value: "past" }
          ],
          defaultValue: "upcoming"
        }),
        category: fields.text({
          label: "Category",
          validation: { isRequired: false }
        }),
        location: fields.text({
          label: "Location",
          validation: { isRequired: false }
        }),
        featured: fields.checkbox({ label: "Featured" }),
        summary: fields.text({
          label: "Summary",
          multiline: true,
          validation: { isRequired: false }
        }),
        image: imageField,
        body: bodyField
      }
    })
  },
  singletons: {
    classes: singleton({
      label: "Classes",
      path: "public/data/classes",
      format: { data: "json" },
      schema: {
        youth: fields.object(
          {
            highlights: fields.array(fields.text({ label: "Highlight" }), {
              label: "Highlights",
              itemLabel: (props) => props.value
            }),
            locations: fields.array(fields.text({ label: "Location" }), {
              label: "Locations",
              itemLabel: (props) => props.value
            }),
            schedule_note: fields.text({
              label: "Schedule Note",
              multiline: true,
              validation: { isRequired: false }
            }),
            pricing: fields.array(
              fields.object({
                label: fields.text({ label: "Label" }),
                price: fields.text({ label: "Price" }),
                notes: fields.text({
                  label: "Notes",
                  multiline: true,
                  validation: { isRequired: false }
                })
              }),
              {
                label: "Pricing",
                itemLabel: (props) => props.value?.label || "Price"
              }
            )
          },
          { label: "Youth" }
        ),
        adult: fields.object(
          {
            highlights: fields.array(fields.text({ label: "Highlight" }), {
              label: "Highlights",
              itemLabel: (props) => props.value
            }),
            locations: fields.array(fields.text({ label: "Location" }), {
              label: "Locations",
              itemLabel: (props) => props.value
            }),
            schedule_note: fields.text({
              label: "Schedule Note",
              multiline: true,
              validation: { isRequired: false }
            }),
            pricing: fields.array(
              fields.object({
                label: fields.text({ label: "Label" }),
                price: fields.text({ label: "Price" }),
                notes: fields.text({
                  label: "Notes",
                  multiline: true,
                  validation: { isRequired: false }
                })
              }),
              {
                label: "Pricing",
                itemLabel: (props) => props.value?.label || "Price"
              }
            )
          },
          { label: "Adult" }
        )
      }
    }),
    gallery: singleton({
      label: "Gallery",
      path: "public/data/gallery",
      format: { data: "json" },
      schema: {
        photos: fields.array(
          fields.object({
            image: imageField,
            alt: fields.text({ label: "Alt text" }),
            caption: fields.text({
              label: "Caption",
              multiline: true,
              validation: { isRequired: false }
            })
          }),
          {
            label: "Photos",
            itemLabel: (props) => props.value?.alt || "Photo"
          }
        ),
        videos: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            url: fields.text({ label: "YouTube URL" })
          }),
          {
            label: "Videos",
            itemLabel: (props) => props.value?.title || "Video"
          }
        )
      }
    })
  }
});
