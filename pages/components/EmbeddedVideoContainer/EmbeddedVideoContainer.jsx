import React, { useState, useEffect, useRef } from "react";

import Image from "next/image";

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function EmbeddedVideoContainer({ index, embeddedVideo }) {
  return (
    <div className="image-wrapper">
      <>
        <div className={`play`}>
          <svg className={`play-icon`} viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 15L-1.27793e-06 30L3.34153e-08 -1.04907e-06L24 15Z" />
          </svg>
        </div>
        <Image
          src={embeddedVideo.thumbnail.lqip}
          alt="project image"
          width={embeddedVideo.thumbnail.width}
          height={embeddedVideo.thumbnail.height}
          style={{
            position: "relative",
            top: 0,
            left: 0,
            opacity: 1,
            zIndex: 4,
          }}
        />
      </>
      <ReactPlayer
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 1,
          zIndex: 3,
        }}
        key={index}
        url={embeddedVideo.link}
        className={`video-player`}
        controls
      ></ReactPlayer>
    </div>
  );
}
