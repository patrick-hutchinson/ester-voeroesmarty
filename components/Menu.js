import Link from "next/link";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Menu({
  options = {
    items: true,
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

  useEffect(() => {
    const handleResize = () => {
      if (menuRef.current) {
        console.log("resize!");
        menuRef.current.style.setProperty("mix-blend-mode", "difference");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Apply on initial mount

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  return (
    <nav
      onResize={() => handleResize()}
      ref={menuRef}
      className={`
                menu 

                ${asPath === "/goods" && width < 1366 ? "menu-white menu-goods-page" : ""}
                ${asPath === "/list" ? "menu-list-page" : ""}
                ${asPath === "/list" && width < 1366 ? "menu-list-page-mobile" : ""}
                ${isGoods ? "menu-goods" : ""}
                ${isHome ? "menu-home" : ""}
        `}
    >
      {width >= 1366 ? (
        options.items && (
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
        )
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

      {width >= 1366 || asPath === "/goods" ? (
        <div
          className="menu-white"
          style={options.close ? { display: "block" } : { display: "none" }}
          onClick={() => handleCloseClick()}
        >
          <p>
            <Link href="/" className="hovered">
              (X)
            </Link>
          </p>
        </div>
      ) : (
        <div className="menu-caption">
          <p>EV</p>
        </div>
      )}
    </nav>
  );
}
