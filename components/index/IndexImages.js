import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import ImageContainer from "@/pages/components/ImageContainer/ImageContainer";
import VideoContainer from "@/pages/components/VideoContainer/VideoContainer";
import EmbeddedVideoContainer from "@/pages/components/EmbeddedVideoContainer/EmbeddedVideoContainer";

gsap.registerPlugin(ScrollTrigger);

export default function IndexImages({ projects, page }) {
  const [threeLoading, setThreeLoading] = useState(true);
  const [projectsWithCover, setProjectsWithCover] = useState(projects.filter((project) => project.cover));
  const sceneRenderedRef = useRef(false);
  const mountRef = useRef(null);
  const proxyContainerRef = useRef(null);
  const sceneMeshes = [];

  const media = projects
    .map((project) => project.cover[0]) // Extracts cover[0].url if it exists
    .filter(Boolean); // Removes undefined or null values

  console.log(media, "projects");

  return (
    <div className="practice-images chess-justify">
      {media &&
        media.map((medium, i) => {
          // if (!medium.url) return null;

          if (medium.type == "embeddedVideo") {
            console.log("embedded video!");
            return (
              <div className="practice-image" key={i}>
                <EmbeddedVideoContainer embeddedVideo={medium} index={i} />
              </div>
            );
          }

          return (
            <div className="practice-image" key={i}>
              <ImageContainer medium={medium} />
            </div>
          );
        })}
    </div>
  );
}
