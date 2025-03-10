import { gql } from "@apollo/client";
import client from "@/sanityClient";
import { MainLayout } from "@/components/MainLayout";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import NextPost from "@/components/slug/NextPost";
import PrevPost from "@/components/slug/PrevPost";
import { PortableText } from "@portabletext/react";
import dynamic from "next/dynamic";
import Image from "next/image";
// import { useInView } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ImageContainer from "../components/ImageContainer/ImageContainer";

// import DynamicPlaiceholderBlur from "../components/DynamicPlaiceholderBlur/DynamicPlaiceholderBlur";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

gsap.registerPlugin(ScrollToPlugin);

export default function Practice({ info, media, allProjects }) {
  console.log("info", info);
  console.log("media", media);

  useEffect(() => {
    document.body.style.backgroundColor = "white";
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
                  {medium.url.includes(".mp4", "mov", "avi", "flv", "wmv", "3gp", "mkv", "webm") ? (
                    <video autoPlay={true} playsInline={true} loop={true} muted={true} src={medium.url}></video>
                  ) : (
                    <ImageContainer medium={medium} />
                    // <DynamicPlaiceholderBlur src={medium.url} />
                  )}
                </div>
              )
          )}
        {info.embeddedVideos &&
          info.embeddedVideos.map((url, i) => (
            <div className="practice-image" key={i}>
              <ReactPlayer
                key={i}
                url={url}
                className={`video-player`}
                light
                controls
                playIcon={
                  <div className={`play`}>
                    <svg className={`play-icon`} viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 15L-1.27793e-06 30L3.34153e-08 -1.04907e-06L24 15Z" />
                    </svg>
                  </div>
                }
              ></ReactPlayer>
            </div>
          ))}
      </div>
      {info.theme && (
        <div className="practice-title">
          <h1>{info.theme}</h1>
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
        embeddedVideos,
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
