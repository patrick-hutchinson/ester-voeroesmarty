import React, { useEffect, useRef, useState } from "react";

import ImageContainer from "@/pages/components/ImageContainer/ImageContainer";
// import EmbeddedVideoContainer from "@/pages/components/EmbeddedVideoContainer/EmbeddedVideoContainer";

import dynamic from "next/dynamic";

const EmbeddedVideoContainer = dynamic(
  () => import("@/pages/components/EmbeddedVideoContainer/EmbeddedVideoContainer"),
  {
    ssr: false,
  }
);

export default function IndexImages({ projects }) {
  const media = projects
    .map((project) => project.cover[0] && { ...project.cover[0], slug: project.slug }) // Include slug
    .filter(Boolean);

  return (
    <div className="practice-images chess-justify">
      {media &&
        media.map((medium, i) => {
          if (medium.type == "embeddedVideo") {
            return (
              <a href={`/practice/${medium.slug?.current}`} className="proxy-links">
                <div className="practice-image" key={i}>
                  <EmbeddedVideoContainer embeddedVideo={medium} index={i} />
                </div>
              </a>
            );
          }

          return (
            <a href={`/practice/${medium.slug?.current}`} className="proxy-links">
              <div className="practice-image" key={i}>
                <ImageContainer medium={medium} />
              </div>
            </a>
          );
        })}
    </div>
  );
}
