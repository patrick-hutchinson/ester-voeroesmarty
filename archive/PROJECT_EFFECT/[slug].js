import { MainLayout } from "@/components/MainLayout";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import NextPost from "@/components/slug/NextPost";
import PrevPost from "@/components/slug/PrevPost";
import IndexImages from "@/components/index/IndexImages";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { useRouter } from "next/router";
import client from "@/sanityClient";
import { PortableText } from "@portabletext/react";

gsap.registerPlugin(ScrollToPlugin);

export default function Practice({ project, allProjects }) {
  const [isIndexImagesVisible, setIndexImagesVisible] = useState(true);
  const { width } = useWindowDimensions();
  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);

  useEffect(() => {
    const isMobileDevice = () => {
      return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    if (!isMobileDevice()) {
      const handleResize = () => {
        setIndexImagesVisible(false);
        setTimeout(() => {
          setIndexImagesVisible(true);
          window.scrollTo(0, 0);
          window.dispatchEvent(new CustomEvent("manualScroll"));
        }, 1500);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
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
      <div className="practice-title">
        <h1>{project.theme && project.theme}</h1>
      </div>
      {isIndexImagesVisible && <IndexImages key={router.asPath} projects={project.projectMedia} page="slug" />}
      <section className="wrapper fixed">
        <div className="practice-about">
          <h2>
            <PortableText value={project.description} />
          </h2>
        </div>
        <div className="practice-contact">
          <div className="practice-contact__inner">
            <div className="prev-next">
              <h1>
                <PrevPost arr={allProjects} />/<NextPost arr={allProjects} />
              </h1>
            </div>
            <a className="to-top" onClick={handleScrollToTop}>
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
  const [project, allProjects] = await Promise.all([
    client.fetch(
      `
      *[_type == "project" && slug.current == $slug][0] {
        _id,
        theme,
        slug,
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
      project,
      allProjects,
    },
    revalidate: 1,
  };
}
