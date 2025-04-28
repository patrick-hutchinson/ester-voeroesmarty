import Link from "next/link";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Menu({
  options = {
    // items: true,
    close: true,
  },
  isGoods = false,
  isHome = false,
}) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [asPath, setAsPath] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      setAsPath(router.asPath);
    }
  }, [router.isReady, router.asPath]);

  function handleCloseClick() {
    gsap.to(document.body, {
      backgroundColor: "white",
      duration: 0.1,
    });
  }

  return (
    <nav
      onResize={() => handleResize()}
      ref={menuRef}
      className={`
                menu 

                // ${asPath === "/goods" && width < 1366 ? "" : ""}
                ${asPath === "/list" ? "menu-list-page" : ""}
                ${asPath === "/list" && width < 1366 ? "menu-list-page-mobile" : ""}
                ${isGoods ? "menu-home" : ""}
                ${isHome ? "menu-home" : ""}
        `}
    >
      {width >= 1366 ? (
        <div className="menu-left">
          <p onClick={() => handleCloseClick()}>
            <Link href="/" className="hovered">
              Selected
            </Link>
          </p>
          <p>
            <Link href="/list" className="hovered">
              Index
            </Link>
          </p>
          <p>
            <Link href="/goods" className="hovered">
              Goods
            </Link>
          </p>
        </div>
      ) : (
        <div className="menu-left">
          <p onClick={() => handleCloseClick()}>
            <Link href="/" className="hovered">
              Selected
            </Link>
          </p>
          <p>
            <Link href="/list" className="hovered">
              Index
            </Link>
          </p>
          <p>
            <Link href="/goods" className="hovered">
              Goods
            </Link>
          </p>
        </div>
      )}
    </nav>
  );
}
