import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Draggable from 'gsap/Draggable';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

gsap.registerPlugin(ScrollTrigger, Draggable);

export default function Scrollbar() {
    const scrollbar = useRef(null);
    const thumb = useRef(null);
    const observer = useRef(null);
    const draggableInstance = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && !/Mobi|Android/i.test(navigator.userAgent)) {
            let resizeTimeout;

            function updateThumbHeight() {
                const viewportHeight = window.innerHeight;
                const totalContentHeight = document.documentElement.scrollHeight;
                const thumbHeightRatio = viewportHeight / totalContentHeight;



                thumb.current && scrollbar.current && gsap.to(thumb.current, {
                    duration: 0.3,
                    height: `${Math.max(30, thumbHeightRatio * scrollbar.current.offsetHeight)}px`,
                });
            }

            function getThumbYMax() {
                return scrollbar.current?.offsetHeight - thumb.current?.offsetHeight;
            }

            function updateThumbPosition() {
                const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
                const thumbYPosition = scrollProgress * getThumbYMax();
                thumb.current && gsap.set(thumb.current, { y: thumbYPosition });
            }

            function updateThumbHeightAndPosition() {
                updateThumbHeight();
                updateThumbPosition();
            }

            function initializeScrollbar() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    updateThumbHeightAndPosition();

                    ScrollTrigger.create({
                        start: 0,
                        end: "max",
                        onUpdate: updateThumbPosition
                    });
    
                    draggableInstance.current = Draggable.create(thumb.current, {
                        type: "y",
                        bounds: scrollbar.current,
                        inertia: true,
                        onDrag() {
                            const scrollPercentage = this.y / getThumbYMax();
                            const scrollPosition = scrollPercentage * (document.documentElement.scrollHeight - window.innerHeight);
                            window.scrollTo(0, scrollPosition);
                        }
                    })[0];
                }, 1500);
            }

            function killScrollbar() {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());

                if (draggableInstance.current) {
                    draggableInstance.current.kill();
                    draggableInstance.current = null;
                }
            }

            const restartScrollbar = () => {
                setTimeout(() => {
                    killScrollbar();
                    initializeScrollbar();
                }, 300); 
            };

            observer.current = new MutationObserver(() => {
                updateThumbHeight();
                updateThumbPosition();
            });

            observer.current.observe(document.body, {
                childList: true,
                subtree: true,
            });

            initializeScrollbar();
            window.addEventListener('resize', updateThumbHeightAndPosition);
            window.addEventListener('manualScroll', restartScrollbar);
            router.events.on('routeChangeComplete', updateThumbHeightAndPosition);

            return () => {
                window.removeEventListener('resize', updateThumbHeightAndPosition);
                window.removeEventListener('manualScroll', restartScrollbar);
                router.events.off('routeChangeComplete', updateThumbHeightAndPosition);
                observer.current.disconnect();
            };
        } else {
            scrollbar.current.style.display = 'none';
        }
    }, [router.events]);

    return (
        <div className='esther-scrollbar' ref={scrollbar}>
            <div className='thumb' ref={thumb}></div>
        </div>
    );
}
