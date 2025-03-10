import Link from "next/link"
import useWindowDimensions from "@/utils/useWindowDimensions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Menu({ 
    options = { 
        items: true, 
        close: true 
    },
    isGoods = false,
    isHome = false
}) {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const [asPath, setAsPath] = useState('');

    useEffect(() => {
        if (router.isReady) {
            setAsPath(router.asPath);
        }
    }, [router.isReady, router.asPath]);

    return (
        <nav 
            className={`
                menu 
                ${(asPath === '/goods' && width < 1366) ? 'menu-white menu-goods-page' : ''}
                ${asPath === '/list' ? 'menu-list-page' : ''}
                ${(asPath === '/list' && width < 1366) ? 'menu-list-page-mobile' : ''}
                ${isGoods ? 'menu-goods' : ''}
                ${isHome ? 'menu-home' : ''}
        `}>
            {
                width >= 1366 
                    ?
                        options.items &&
                            <div className="menu-left">
                                <p>
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
                    :
                        <div className="menu-left">
                            <p>
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
            }

            {
                (width >= 1366 || asPath === '/goods') 
                    ?
                        <div className="menu-white" style={ options.close ? { display: 'block' } : { display: 'none' } }>
                            <p>
                                <Link href="/" className="hovered">
                                    (X)
                                </Link>
                            </p>
                        </div> 
                    :                 
                        <div className="menu-caption">
                            <p>EV</p>
                        </div>
            }
        </nav>
    )
}