import { useEffect, useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import gsap from 'gsap';
import client from '@/sanityClient';
import Image from 'next/image'
import useWindowDimensions from "@/utils/useWindowDimensions";

export default function Goods({ goods }) {
  const [index, setIndex] = useState(0);
  const { width } = useWindowDimensions();

  useEffect(() => {
    gsap.to(document.body, { 
      backgroundColor: 'black', 
      duration: 0.1,
    });
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('manualScroll'));

    const mediaItems = document.querySelectorAll('.goods-media-item');
    const speed = 0.3;
  
    mediaItems.forEach((item, i) => {
      if (i !== index) {
        gsap.to(item, { 
          autoAlpha: 0, 
          duration: speed,
          onComplete: () => gsap.set(item, { display: 'none' })
        });
      }
    });
  
    gsap.to(mediaItems[index], {
      duration: speed,
      autoAlpha: 0,
      ease: "power2.inOut",
      onComplete: () => {
        mediaItems.forEach((mediaItem, i) => {
          if (i !== index) {
            gsap.set(mediaItem, { display: 'none' });
          }
        });
  
        if (mediaItems[index]) {
          gsap.set(mediaItems[index], { display: 'none' }); 
          gsap.to(mediaItems[index], {
            duration: speed,
            autoAlpha: 1,
            ease: "power2.inOut",
            onStart: () => gsap.set(mediaItems[index], { display: 'block' })
          });
        }
      }
    });
  
  }, [index]);
  

  return (
    <MainLayout title="Goods" options={{items: false, close: true}}>
      <section className="goods">
        <div className="goods-list">
          {goods.map((good, i) => (
            <div className={`goods-list-item ${index !== i ? 'deselected' : ''}`} key={i} onClick={() => {
              width >= 1366 && setIndex(i)
            }}>
              <div className="goods-list-item__title">
                <h1>{good.title}</h1>
              </div>
              <div className="goods-list-item__line-wrapper">
                <div className="line">
                  <p className="caption">{good.year && good.year}</p>
                  <p className="caption">{good.type && good.type}</p>
                  <p className="caption">{good.location && good.location}</p>
                  <p className="caption">{good.sizeAndPrice && good.sizeAndPrice}</p>
                  <p className="caption">
                    {!good.soldOut && 
                      <a href={good.buyLink} target="_blank">
                        (Buy)
                      </a>
                    } 
                  </p>
                </div>
              </div>
              <div className="goods-list-item__media">
                {good.media.map((medium, j) => (
                  <div className="media-item" key={j}>
                    <Image
                      src={medium.url}
                      placeholder='blur'
                      blurDataURL={medium.lqip}
                      width={medium.width}
                      height={medium.height}
                      alt={`media ${j}`}
                    />
                  </div>
                ))}
              </div>
              <div className="goods-list-item__description">
                <span>Specification</span>
                {
                  width >= 1366 
                    ?
                      <h1>{good.specification}</h1>
                    :
                      <span>{good.specification}</span>
                }

              </div> 
            </div>
          ))}
        </div>
        <div className="goods-media">
          {goods.map((good, i) => (
            <div className="goods-media-item" key={i}>
              {good.media.map((medium, j) => (
                <Image
                  key={j}
                  src={medium.url}
                  placeholder='blur'
                  blurDataURL={medium.lqip}
                  width={medium.width}
                  height={medium.height}
                  alt={`media ${j}`}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const goods = await client.fetch(`
      *[_type == "good"]|order(orderRank) {
        _id,
        title,
        year,
        type,
        location,
        sizeAndPrice,
        specification,
        buyLink,
        soldOut,
        media[] {
          "url": asset->url,
          "lqip": asset->metadata.lqip,
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height,
        }
      }
  `);

  return {
    props: {
      goods, 
    },
    revalidate: 1, 
  }
}