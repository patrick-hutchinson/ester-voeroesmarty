import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import useWindowDimensions from "@/utils/useWindowDimensions";

export default function ListItem({ project, titleRef }) {
  const [opened, setOpened] = useState(false);
  const [cropped, setCropped] = useState(true);
  const [withDescription, setWithDescription] = useState(false);
  const [mediaOverflow, setMediaOverflow] = useState(true);
  const listRef = useRef();
  const descriptionRef = useRef();
  const openBtnRef = useRef();
  const mediaRef = useRef();
  const { width } = useWindowDimensions();

  let textMinSizeMobile = 0;
  let textMinSizeDesktop = 75;

  const toggleOpen = () => {
    const open = () => {
      setOpened(true);
      descriptionRef.current.style.display = "block";
      descriptionRef.current.style.height = `${window.innerWidth >= 1366 ? textMinSizeDesktop : textMinSizeMobile}px`;
      gsap.to(descriptionRef.current, {
        height: "auto",
        marginBottom: 8,
        duration: 0.5,
        ease: "power2.inOut",
      });
    };

    const close = () => {
      setOpened(false);
      gsap.to(descriptionRef.current, {
        height: window.innerWidth >= 1366 ? textMinSizeDesktop : textMinSizeMobile,
        marginBottom: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (window.innerWidth >= 1366) {
            descriptionRef.current.style.display = "-webkit-box";
          } else {
            descriptionRef.current.style.display = "block";
          }
        },
      });
    };

    opened ? close() : open();
  };

  const showTitle = () => {
    if (window.innerWidth >= 1366) {
      titleRef.current.innerText = project.theme;
    }
  };

  const hideTitle = () => {
    if (window.innerWidth >= 1366) {
      titleRef.current.innerText = "Index";
    }
  };

  const checkCrop = () => {
    let textMaxSize = descriptionRef.current.scrollHeight;

    if (window.innerWidth >= 1366) {
      if (textMaxSize > textMinSizeDesktop) {
        setCropped(true);
        descriptionRef.current.style.height = "auto";
      } else {
        setCropped(false);
        descriptionRef.current.style.height = "auto";
      }
    } else {
      if (textMaxSize > textMinSizeMobile) {
        setCropped(true);
        descriptionRef.current.style.height = textMinSizeMobile;
      } else {
        setCropped(false);
      }
    }
  };

  useEffect(() => {
    if (cropped) {
      // console.log('cropped')
      gsap.to(openBtnRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else {
      // console.log('not cropped')
      gsap.to(openBtnRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [cropped]);

  useEffect(() => {
    checkCrop();

    listRef.current.addEventListener("mouseover", showTitle);
    listRef.current.addEventListener("mouseout", hideTitle);
    window.addEventListener("resize", checkCrop);

    if (project.description !== null) {
      setWithDescription(true);
    }

    return () => {
      listRef.current && listRef.current.removeEventListener("mouseover", showTitle);
      listRef.current && listRef.current.removeEventListener("mouseout", hideTitle);
      window && window.removeEventListener("resize", checkCrop);
    };
  }, []);

  return (
    <div className="index-list__item" ref={listRef}>
      <h1 className="title">
        <a href={`/practice/${project.slug.current}`}>{project.theme}</a>
      </h1>
      <div className={`top ${withDescription ? "with-description" : ""}`}>
        <div className="top__inner">
          <div className="text-wrapper" style={!project.material && !project.size ? { overflow: "hidden" } : {}}>
            <div className="text">
              <p className="caption date-range">{project.dateRange && project.dateRange}</p>
              <p className="caption slogan">{project.slogan && project.slogan}</p>
              <p className="caption location">{project.location && project.location}</p>
              <p className="caption material">{project.material && project.material}</p>
              <p className="caption size">{project.size && project.size}</p>
            </div>
          </div>
          <a href={`/practice/${project.slug.current}`}>
            <div className="media" ref={mediaRef}>
              {project.projectMedia.map(
                (medium, i) =>
                  medium.url &&
                  (medium.url.includes(".mp4", "mov", "avi", "flv", "wmv", "3gp", "mkv", "webm") ? (
                    <video key={i} autoPlay={true} playsInline={true} loop={true} muted={true} src={medium.url}></video>
                  ) : (
                    <Image
                      key={i}
                      src={`${medium.url}?h=260&q=100`}
                      placeholder="blur"
                      blurDataURL={medium.lqip}
                      width={medium.width}
                      height={medium.height}
                      alt="image"
                    />
                  ))
              )}
            </div>
          </a>
        </div>
      </div>
      <div className="bottom">
        <div className="caption" ref={descriptionRef}>
          <PortableText value={project.description} />
        </div>
        <div className="read-more">
          <div className="counter">{project.projectMedia.length}</div>
          {cropped && (
            <a onClick={toggleOpen} ref={openBtnRef}>
              {opened ? "(Hide)" : "(Read more)"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
