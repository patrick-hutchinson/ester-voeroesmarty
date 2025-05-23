import client from "@/sanityClient";
import { MainLayout } from "@/components/MainLayout";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import NextPost from "@/components/slug/NextPost";
import PrevPost from "@/components/slug/PrevPost";
import { PortableText } from "@portabletext/react";

import ImageContainer from "../components/ImageContainer/ImageContainer";
import VideoContainer from "../components/VideoContainer/VideoContainer";
// import EmbeddedVideoContainer from "../components/EmbeddedVideoContainer/EmbeddedVideoContainer";

import dynamic from "next/dynamic";

const EmbeddedVideoContainer = dynamic(
  () => import("@/pages/components/EmbeddedVideoContainer/EmbeddedVideoContainer"),
  {
    ssr: false,
  }
);

gsap.registerPlugin(ScrollToPlugin);

export default function Practice({ info, media, allProjects }) {
  let titleRef = useRef(null);
  let innerTitleRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);

  useEffect(() => {
    let titleWrapper = titleRef.current;
    let titleInner = innerTitleRef.current;
    let scrollInterval;

    if (titleWrapper && titleInner) {
      let titleInnerWidth = titleInner.getBoundingClientRect().width;

      if (titleWrapper.scrollWidth > titleInnerWidth) {
        let direction = 1; // 1 = scroll right, -1 = scroll left
        scrollInterval = setInterval(() => {
          titleWrapper.scrollLeft += direction;

          // When we reach the end, reverse direction
          if (titleWrapper.scrollLeft >= titleWrapper.scrollWidth - titleWrapper.clientWidth) {
            direction = -1;
          }

          // When we reach the start, reverse direction
          if (titleWrapper.scrollLeft <= 0) {
            direction = 1;
          }
        }, 20); // every 20 milliseconds
      }
    }

    return () => clearInterval(scrollInterval); // clear on unmount
  }, []);

  const handleScrollToTop = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: 0,
      },
    });
  };

  const portableTextComponents = {
    marks: {
      link: ({ value, children }) => {
        let href = value.href;

        if (href && !href.startsWith("http://") && !href.startsWith("https://")) {
          href = `http://${href}`;
        }
        return (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      },
    },
  };

  return (
    <MainLayout title="Practice" options={{ items: true, close: false }}>
      <div className="practice-images chess-justify">
        {media &&
          media.map(
            (medium, i) =>
              medium.url && (
                <div className="practice-image" key={i}>
                  {medium.url.includes(".mp4", "mov", "avi", "flv", "wmv", "3gp", "mkv", "webm") ? null : (
                    <ImageContainer medium={medium} />
                  )}
                </div>
              )
          )}
        {info.embeddedVideos &&
          info.embeddedVideos.map(
            (embeddedVideo, i) =>
              embeddedVideo.link &&
              embeddedVideo.thumbnail && (
                <div className="practice-image" key={i}>
                  <EmbeddedVideoContainer embeddedVideo={embeddedVideo} index={i} />
                </div>
              )
          )}
      </div>
      {info.theme && (
        <div className="practice-title" ref={titleRef}>
          <h1 ref={innerTitleRef}>{info.theme}</h1>
        </div>
      )}

      <section className="wrapper fixed">
        {info.description && (
          <div className="practice-about">
            <h2>
              <PortableText value={info.description} components={portableTextComponents} />
            </h2>
          </div>
        )}
        <div className="practice-contact">
          <div className="practice-contact__inner">
            <div className="prev-next">
              <h1>
                <PrevPost arr={allProjects} />/<NextPost arr={allProjects} />
              </h1>
            </div>
            <a onClick={handleScrollToTop}>
              <h1>To Top</h1>
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const projects = await client.fetch(`
    *[_type == "project"] {
      slug
    }
  `);

  const paths = projects.map((project) => ({
    params: { slug: project.slug.current },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const [info, media, allProjects] = await Promise.all([
    client.fetch(
      `
      *[_type == "project" && slug.current == $slug][0] {
        _id,
        theme,
        slug,
        description,
        embeddedVideos[]{
          "link": link,
          "thumbnail": thumbnail.asset->{
            "url": url,
            "lqip": metadata.lqip,
            "width": metadata.dimensions.width,
            "height": metadata.dimensions.height
          }
        }
      }
      `,
      { slug: params.slug }
    ),

    client.fetch(
      `
      *[_type == "project" && slug.current == $slug][0] {
        projectMedia[] {
          _type == "image" => {
            "type": _type,
            "url": asset->url,
            "lqip": asset->metadata.lqip,
            "width": asset->metadata.dimensions.width,
            "height": asset->metadata.dimensions.height,
          },
        }
      }
    `,
      { slug: params.slug }
    ),

    client.fetch(`
      *[_type == "project"] {
        slug
      }
    `),
  ]);

  return {
    props: {
      info,
      media: media.projectMedia,
      allProjects,
    },
    revalidate: 1,
  };
}
