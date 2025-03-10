import { useEffect, useRef, useState } from "react";
import rgbToHsl from "@/utils/rgbToHsl";
import thresholdHsl from "@/utils/thresholdHsl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { masking, mapRange, outroMasking, grayscaleAndInvert } from "@/utils/utilsForP5";


gsap.registerPlugin(ScrollTrigger);

export default function PracticeImage({ practice, i }) {
    const canvasParentRef = useRef(null);
    const imgRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({
        width: `calc(100vw - 120px)`,
        height: `calc(${practice.attributes.cover.data.attributes.formats.large.height / practice.attributes.cover.data.attributes.formats.large.width} * calc(100vw - 120px))`
    })

    let mySketch;

    const sketch = (p) => {
        let img, imgB, imgMask;
        let progress = {value: 0};

        p.preload = () => {
            img = p.loadImage(process.env.NEXT_PUBLIC_STRAPI_API_URL + practice.attributes.cover.data.attributes.formats.large.url, (loadedImg) => {
                imgMask = grayscaleAndInvert(loadedImg)
            });
            // img = p.loadImage(practice.attributes.cover.data.attributes.formats.large.url, (loadedImg) => {
            //     imgMask = grayscaleAndInvert(loadedImg)
            // });
            imgB = img.get();
        }

        p.setup = () => {
            const canvas = p.createCanvas(img.width, img.height);
            p.createCanvas(img.width, img.height);
            // p.pixelDensity(0.1);
            canvas.style('width', canvasSize.width);
            canvas.style('height', canvasSize.height);
            canvas.canvas.id = `sketch-mask-${i}`;
        }

        p.draw = () => {   
            p.clear();
            imgMask.loadPixels();
            imgB.loadPixels();
            masking(imgMask, imgB, progress.value);
            imgB.updatePixels();
            p.image(imgB, 0, 0, img.width, img.height);
            imgB = img.get();
        }

        const anim = gsap.fromTo(progress, {
            value: 0,
        }, {
            value: 1,
            duration: 1.3,
            paused: true,
            onUpdate: () => {
                if (progress.value === 1) {
                    if (imgRef.current) imgRef.current.style.opacity = 1
                } else {
                    if (imgRef.current) imgRef.current.style.opacity = 0
                }
            },
        })

        ScrollTrigger.create({
            trigger: canvasParentRef.current,
            onEnter: () => anim.restart(),
            onEnterBack: () => anim.restart(),
            onLeave: () => {
                progress.value = 0
                anim.progress(0).pause();
                if (imgRef.current) imgRef.current.style.opacity = 0;
            },
            onLeaveBack: () => {
                progress.value = 0
                anim.progress(0).pause();
                if (imgRef.current) imgRef.current.style.opacity = 0;
            },
            once: false
        });
    }

    useEffect(() => {
        mySketch = new p5(sketch, canvasParentRef.current);
    
        return () => {
            mySketch.remove();
        };
    }, [canvasSize, i]); 


    return (
        <div 
            key={i}
            ref={canvasParentRef}
            className='practice-images-item'
            style={{
                justifySelf: i % 2 ? 'start' : 'end',
                width: canvasSize.width,
                height: canvasSize.height,
            }}
        >
            <img 
                id='top'
                ref={imgRef}
                src={process.env.NEXT_PUBLIC_STRAPI_API_URL + practice.attributes.cover.data.attributes.url} alt={practice.attributes.theme} 
                // src={practice.attributes.cover.data.attributes.url} alt={practice.attributes.theme} 
                style={{ 
                    width: canvasSize.width, 
                    height: canvasSize.height,
                    opacity: 0,
                }}
            />
        </div>

    )
}