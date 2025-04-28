import { MainLayout } from "@/components/MainLayout";
import client from "@/sanityClient";
import { useEffect, useRef } from "react";
import ListItem from "@/components/list/ListItem";
import useWindowDimensions from "@/utils/useWindowDimensions";

export default function List({ projects }) {
  const { width } = useWindowDimensions();
  const titleRef = useRef();
  const listRef = useRef();

  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);

  return (
    <MainLayout title="Index" options={{ items: true, close: true }}>
      <div className="index-title grid">
        <h1 className="left" ref={titleRef} style={width >= 1366 ? { display: "block" } : { display: "none" }}>
          Index
        </h1>
      </div>
      <div ref={listRef} className="index-list">
        {projects.map(
          (project, i) => project.projectMedia?.length > 0 && <ListItem key={i} project={project} titleRef={titleRef} />
        )}
      </div>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const projects = await client.fetch(`
      *[_type == "project"]|order(orderRank) {
        _id,
        theme,
        slug,
        dateRange,
        slogan,
        location,
        material,
        size,
        description,
        projectMedia[] {
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
        }
      }
  `);

  return {
    props: {
      projects,
    },
    revalidate: 1,
  };
}
