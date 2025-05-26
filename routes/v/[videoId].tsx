import { Handlers, PageProps } from "$fresh/server.ts";
import { parse } from "jsr:@std/yaml";
import { Credits, Link, Person } from "../../types/credits.d.ts";

// https://raw.githubusercontent.com/TheDinoKingK/yt-credits-data/refs/heads/main/data/pB3xpcqOOJ4.yaml

export const handler: Handlers<Credits> = {
  async GET(_req, ctx) {
    // use url template to fetch the file data
    const URL =
      `https://raw.githubusercontent.com/TheDinoKingK/yt-credits-data/refs/heads/main/data/${ctx.params.videoId}.yml`;

    // fetch required yaml file from github repo
    const fileData = await fetch(URL);

    // redirects the user to a 404 page when the file is unavailable or if the request wasn't successful
    if (!fileData || fileData.status != 200) {
      console.warn(
        `%c${fileData.status} status, couldn't find a file with that name.`,
        "color: #ba2b24",
      );
      return ctx.renderNotFound();
    }

    // parse data from yaml into an object
    // might want to actually type check this eventually.
    const ymlData = parse(await fileData.text()) as Credits;
    console.log(
      `%cSuccessfully got data for ${ctx.params.videoId}`,
      "color: #56b8a3",
    );
    // console.log(ymlData);

    // pass that as a data parameter into the page
    return ctx.render(ymlData);
  },
};

export default function VideoCreditsPage({ params, data }: PageProps) {
  return (
    <div class="m-4">
      <h1 class="text-3xl">
        hello, you're on the page for the video:{" "}
        <a
          href={`https://www.youtube.com/watch?v=${params.videoId}`}
          class="underline italic text-blue-300"
        >
          {data["title"]}
        </a>
      </h1>

      {/* Embed video, taken directly from yt share embed */}
      <iframe
        width="747"
        height="420"
        src={`https://www.youtube-nocookie.com/embed/${params.videoId}`}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowFullScreen
        class="pt-2"
      >
      </iframe>

      {/* print all available data from the yaml file */}
      {/* definitely could condense this down into better logic */}
      {data["featured"]
        ? (
          <>
            <h4 class="text-lg font-extrabold">People featured:</h4>
            {/* data drilling learned from this video https://www.youtube.com/watch?v=tXS_1VMhdT4 */}
            {data["featured"].map((users: Person) => {
              const { name, note, links } = users;
              return (
                <ul class="ms-1">
                  <li>
                    <p class="text-lg font-bold">{name}</p>

                    {note ? <p class="text-xs ms-1">{note}</p> : console.log(
                      `%cNote for ${name} not found, skipping`,
                      "color: #f7d726",
                    )}

                    {links
                      ? (
                        <>
                          <h2 class="ms-1">
                            socials:
                            {links.map((link: Link) => {
                              const { platform, url } = link;
                              return (
                                <a
                                  class="underline italic text-blue-300 ps-2"
                                  href={url}
                                >
                                  {platform}
                                </a>
                              );
                            })}
                          </h2>
                        </>
                      )
                      : console.log(
                        `%cLinks for '${name}' not found, skipping`,
                        "color: #f7d726",
                      )}
                  </li>
                </ul>
              );
            })}
          </>
        )
        : console.warn(
          "%cFeatured people not found, skipping.",
          "color: #f7d726",
        )}

      {data["contributed"]
        ? (
          <>
            <h4 class="text-lg font-extrabold">Contributors:</h4>
            {/* same logic as featured credits */}
            {data["contributed"].map((users: Person) => {
              const { name, note, links } = users;
              return (
                <ul class="ms-1">
                  <li>
                    <p class="text-lg font-bold">{name}</p>

                    {note ? <p class="text-xs ms-1">{note}</p> : console.log(
                      `%cNote for ${name} not found, skipping`,
                      "color: #f7d726",
                    )}

                    {links
                      ? (
                        <>
                          <h2 class="ms-1">
                            socials:
                            {links.map((link: Link) => {
                              const { platform, url } = link;
                              return (
                                <a
                                  class="underline italic text-blue-300 ps-2"
                                  href={url}
                                >
                                  {platform}
                                </a>
                              );
                            })}
                          </h2>
                        </>
                      )
                      : console.log(
                        `%cLinks for '${name}' not found, skipping`,
                        "color: #f7d726",
                      )}
                  </li>
                </ul>
              );
            })}
          </>
        )
        : console.warn("%cContributors not found, skipping.", "color: #f7d726")}

      {data["music"]
        ? (
          <>
            <h4 class="text-lg font-extrabold">Music used:</h4>
            {data["music"].map((song: Song) => {
              // console.log(song);
              const { title, artist, links, timestamp } = song;
              // possibly not the best logic to convert my funny string from a timestamp into seconds
              const timeArray = timestamp.split(":");
              const timeCalc = timeArray.length === 3
                ? ((parseInt(timeArray[0]) * 3600) + parseInt(timeArray[1]))
                : (timeArray.length === 2
                  ? ((parseInt(timeArray[0]) * 60) + parseInt(timeArray[1]))
                  : parseInt(timeArray[0]));

              return (
                <div class="ms-1">
                  <h2 class="text-lg font-bold">{title}</h2>
                  <h4 class="font-semibold ms-1">by {artist}</h4>

                  <p class="ms-1">
                    Start time:{" "}
                    <a
                      href={`https://www.youtube.com/watch?v=${params.videoId}&t=${timeCalc}s`}
                      class="underline italic text-blue-300"
                    >
                      {timestamp}
                    </a>
                  </p>
                  {links
                    ? (
                      <>
                        <h2 class="ms-1">
                          links:
                          {links.map((link: Link) => {
                            const { platform, url } = link;
                            return (
                              <a
                                class="underline italic text-blue-300 ps-2"
                                href={url}
                              >
                                {platform}
                              </a>
                            );
                          })}
                        </h2>
                      </>
                    )
                    : console.log(
                      `%cLinks for '${title}' not found, skipping`,
                      "color: #f7d726",
                    )}
                </div>
              );
            })}
          </>
        )
        : console.warn(
          "%cMusic credits not found, skipping.",
          "color: #f7d726",
        )}

      {data["assets"]
        ? (
          <>
            <h2 class="text-lg font-extrabold">Other assets used:</h2>

            <ul class="ms-1">
              {data["assets"].map((asset: Asset) => {
                const { title, desc, creators, source } = asset;
                // console.log(asset);

                return (
                  <li>
                    <h3 class="text-lg font-bold">{title}</h3>
                    <p class="text-sm ms-0.5">{desc}</p>
                    {/* render who created this asset, if found */}
                    {creators
                      ? (
                        <div class="ms-0.5">
                          <h4 class="font-bold">Creator:</h4>
                          {creators.map((creator: Person) => {
                            const { name, links, note } = creator;
                            return (
                              <div class="ms-1">
                                <p class="font-semibold">{name}</p>

                                {note
                                  ? <p class="text-xs ms-1">{note}</p>
                                  : console.log(
                                    `%cNote for ${name} not found, skipping`,
                                    "color: #f7d726",
                                  )}

                                {links
                                  ? (
                                    <>
                                      <h2 class="ms-1">
                                        socials:
                                        {links.map((link: Link) => {
                                          const { platform, url } = link;
                                          return (
                                            <a
                                              class="underline italic text-blue-300 ps-2"
                                              href={url}
                                            >
                                              {platform}
                                            </a>
                                          );
                                        })}
                                      </h2>
                                    </>
                                  )
                                  : console.log(
                                    `%cLinks for '${name}' not found, skipping`,
                                    "color: #f7d726",
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      )
                      : console.log(
                        `%cCreator(s) for '${title}' asset not found, skipping`,
                        "color: #f7d726",
                      )}
                    {/* render source links */}
                    {source
                      ? (
                        <>
                          {source.url
                            ? (
                              <a
                                class="font-semibold underline italic text-blue-300"
                                href={source.url}
                              >
                                Source
                              </a>
                            )
                            : (
                              <>
                                <h2 class="font-semibold">Source:</h2>
                                {console.log(
                                  `%cSource link for '${title}' asset not
                                found, skipping`,
                                  "color: #f7d726",
                                )}
                              </>
                            )}
                          {/* {console.log(source)} */}
                          {source.note
                            ? <p class="text-xs ms-1">Note: {source.note}</p>
                            : console.log(
                              `%cNote for '${title}' source not found, skipping`,
                              "color: #f7d726",
                            )}
                        </>
                      )
                      : console.log(
                        `%cSource for '${title}' asset not found, skipping`,
                        "color: #f7d726",
                      )}
                  </li>
                );
              })}
            </ul>
          </>
        )
        : console.warn(
          "%cAsset credits not found, skipping.",
          "color: #f7d726",
        )}

      {data["notes"]
        ? (
          <>
            <h4 class="text-lg font-extrabold">Extra notes:</h4>

            {data["notes"].map((notes: Note) => {
              const { note } = notes;
              return (
                <p>
                  - {note}
                </p>
              );
            })}
          </>
        )
        : console.warn(
          "%cNotes not found, skipping.",
          "color: #f7d726",
        )}
    </div>
  );
}
