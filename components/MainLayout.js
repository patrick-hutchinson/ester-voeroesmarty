import Head from "next/head";
import Menu from "./Menu";
import dynamic from "next/dynamic";
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const Scrollbar = dynamic(() => import('./Scrollbar'), { ssr: false });

export function MainLayout({ children, title = 'Esther Vörösmarty', options }) {
    const router = useRouter();
    const isGoods = router.pathname.includes('goods');
    const isHome = router.pathname === '/' || router.pathname.startsWith('/practice');

    return (
        <>
            <Head>
                <title>{title} @ Esther Vörösmarty</title>
                <meta name="description" content='Esther Vörösmarty' />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Menu options={options} isGoods={isGoods} isHome={isHome} />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                >
                    {children}
                </motion.div>
                <Scrollbar />
            </main>
        </>
    )
}
