import { useState, useEffect } from "react";

export default function IndexTitleAndCounter({ projects }) {
  const [titleCounter, setTitleCounter] = useState(0);
  const [projectsWithCover, setProjectsWithCover] = useState(projects.filter((project) => project.cover));

  useEffect(() => {
    const checkTitleTop = () => {
      const threshold = 64;
      document.querySelectorAll(".proxy-links").forEach((item, i) => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.bottom < threshold) {
          setTitleCounter(i + 1);
        } else if (i === 0) {
          setTitleCounter(0);
        }
      });
    };

    checkTitleTop();

    document.addEventListener("scroll", checkTitleTop);
    window.addEventListener("manualScroll", checkTitleTop);

    return () => {
      document.removeEventListener("scroll", checkTitleTop);
      window.removeEventListener("manualScroll", checkTitleTop);
    };
  }, []);

  return (
    <>
      <div className="practice-title">
        <h1>{titleCounter < projectsWithCover.length ? projectsWithCover[titleCounter].theme : "About"}</h1>
      </div>
      <div className="practice-counter">
        <h1>{titleCounter + 1}</h1>
      </div>
    </>
  );
}
