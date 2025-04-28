import { gql } from "@apollo/client";
import client from "@/sanityClient";
import { MainLayout } from "@/components/MainLayout";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import NextPost from "@/components/slug/NextPost";
import PrevPost from "@/components/slug/PrevPost";
import { PortableText } from "@portabletext/react";

gsap.registerPlugin(ScrollToPlugin);

export default function Practice({ info, media, allProjects }) {
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

  return (
    <MainLayout title="Practice" options={{ items: true, close: false }}>
      <div className="practice-images">
        {media.map((medium, i) => (
          <div
            className="practice-image"
            key={i}
            style={{
              justifySelf: i % 2 ? "start" : "end",
            }}
          >
            {medium.url.includes(".mp4", "mov", "avi", "flv", "wmv", "3gp", "mkv", "webm") ? (
              <video autoPlay={true} playsInline={true} loop={true} muted={true} src={medium.url}></video>
            ) : (
              <img src={medium.url} alt="project image" />
            )}
          </div>
        ))}
      </div>
      <div className="practice-title">
        <h1>{info.theme && info.theme}</h1>
      </div>
      <section className="wrapper fixed">
        <div className="practice-about">
          <h2>
            <PortableText value={info.description} />
          </h2>
        </div>
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
