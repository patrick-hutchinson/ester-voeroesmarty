import { MainLayout } from "@/components/MainLayout";
import IndexImages from "@/components/index/IndexImages";
import IndexTitleAndCounter from "@/components/index/IndexTitleAndCounter";
import { useEffect, useState, useRef } from "react";
import useWindowDimensions from "@/utils/useWindowDimensions";
import client from "@/sanityClient";
import { PortableText } from "@portabletext/react";
import { drawConsoleLabel } from "@/utils/consoleLabel";

export default function Index({ projects, mainPage }) {
  const { width } = useWindowDimensions();
  const hasRendered = useRef(false);
  const dynID = useRef(0);
  console.log(projects);
  console.log(mainPage);

  useEffect(() => {
    if (!hasRendered.current) {
      drawConsoleLabel();
      hasRendered.current = true;
    }
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <MainLayout title="Practice" options={{ items: true, close: false }}>
      <IndexTitleAndCounter projects={projects} />
      <IndexImages key={dynID.current} projects={projects} />
      <section className="wrapper fixed z-index--1">
        <div className="practice-about">
          <h2>
            <PortableText value={mainPage.about} />
          </h2>
        </div>
        <div className="practice-contact">
          <h1>
            {/* <a href={`tel:${mainPage.phone}`}>{width > 992 ? mainPage.phone : 'Phone'}</a>&nbsp; */}
            <a href={`mailto:${mainPage.mail}`}>Mail</a>&nbsp;
            <a href={mainPage.ig} target="_blank">
              Ig
            </a>
          </h1>
        </div>
      </section>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const [projects, mainPage] = await Promise.all([
    client.fetch(`
      *[_type == "project" && showOnHomepage == true] | order(orderRank) {
        _id,
        theme,
        slug,
        showOnHomepage,
        cover[] {
          _type == "image" => {
            "type": _type,
            "url": asset->url,
            "lqip": asset->metadata.lqip,
            "width": asset->metadata.dimensions.width,
            "height": asset->metadata.dimensions.height,
          },
          _type == "file" => {
            "type": _type,
            "url": asset->url
          }
        },
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
    `),
    client.fetch(`
      *[_type == "mainPage"][0] {
        _id,
        about,
        phone,
        mail,
        ig
      }
    `),
  ]);

  return {
    props: {
      projects,
      mainPage,
    },
    revalidate: 1,
  };
}
