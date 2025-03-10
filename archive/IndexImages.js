import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useRouter } from "next/router";

gsap.registerPlugin(ScrollTrigger);

export default function IndexImages({ projects, page }) {
    const router = useRouter();
    const mountRef = useRef(null);
    const proxyContainerRef = useRef(null);
    
    const forExport = false;

    useEffect(() => {

        // Ensure proxyContainerRef is empty to avoid duplications
        while (proxyContainerRef.current.firstChild) {
            proxyContainerRef.current.removeChild(proxyContainerRef.current.firstChild);
        }

        const scene = new THREE.Scene();
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
        camera.position.z = 100;
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        let accumulatedHeight = 0; 

        projects.forEach((practice, i) => {
            ////////////////////////////////////
            // IMAGE
            ////////////////////////////////////

            let target = 
                page === 'slug' 
                    ? 
                        practice.attributes
                    :
                        practice.attributes.cover.data.attributes;
                        
            
            if (practice.attributes.cover.data.attributes.formats) {
                const origImgW = practice.attributes.cover.data.attributes.formats?.medium?.width || 0;
                const origImgH = practice.attributes.cover.data.attributes.formats?.medium?.height|| 0;
                const imgWidth = Math.ceil(width * 0.9);
                const imgHeight = Math.ceil(imgWidth * (origImgH / origImgW));

                const texture = new THREE.TextureLoader().load(
                    forExport 
                        ? practice.attributes.cover.data.attributes.url
                        : process.env.NEXT_PUBLIC_STRAPI_API_URL + practice.attributes.cover.data.attributes.url
                );

                const geometry = new THREE.PlaneGeometry(imgWidth, imgHeight);
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        imageTexture: { value: texture },
                        threshold: { value: 1 },
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform sampler2D imageTexture;
                        uniform float threshold;
                        varying vec2 vUv;
                        void main() {
                            vec4 texel = texture2D(imageTexture, vUv);
                            float brightness = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
                            if (brightness > threshold) {
                                gl_FragColor = vec4(texel.rgb, 1.0);
                            } else {
                                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                            }
                        }
                    `,
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.y = -(accumulatedHeight + imgHeight / 2 - height / 2);
                const margin = width * 0.1;
                const offsetX = (width * 0.8 - imgWidth) / 2 + margin;
                mesh.position.x = i % 2 !== 0 ? -offsetX : offsetX;
                scene.add(mesh);

                accumulatedHeight += imgHeight;

                // PROXY
                const proxyDiv = document.createElement('div');
                proxyDiv.style.width = `${imgWidth}px`;
                proxyDiv.style.height = `${imgHeight}px`;
                proxyDiv.style.justifySelf = i % 2 ? 'start' : 'end';
                proxyDiv.style.pointerEvents = 'all';
                const link = document.createElement('a');
                link.href = `/practice/${practice.attributes.slug}`;
                link.style.width = '100%';
                link.style.height = '100%';
                link.style.display = 'block';
                link.style.position = 'relative';
                proxyDiv.appendChild(link);
                proxyContainerRef.current.appendChild(proxyDiv)

                // SCROLLTRIGGER
                const anim = gsap.to(material.uniforms.threshold, {
                    value: -1,
                    duration: 2.5,
                    paused: true,
                });
        
                ScrollTrigger.create({
                    trigger: proxyContainerRef.current.children[i],
                    onEnter: () => anim.play(),
                    onEnterBack: () => anim.play(),
                    onLeave: () => {
                        material.uniforms.threshold.value = 1;
                        anim.progress(0).pause();
                    },
                    onLeaveBack: () => {
                        material.uniforms.threshold.value = 1;
                        anim.progress(0).pause();
                    },
                    once: false,
                });
            } else if (practice.attributes.cover.data.attributes.url.includes('.mp4', 'mov', 'avi', 'flv', 'wmv', '3gp', 'mkv', 'webm')) {
                ////////////////////////////////////
                // VIDEO
                ////////////////////////////////////
                const origImgW = practice.attributes.coverVideoWidth;
                const origImgH = practice.attributes.coverVideoHeight;

                // HIDED
                const hiddenDiv = document.createElement('div');
                hiddenDiv.className = `hidden_video_${i}`;
                hiddenDiv.style.width = `90vw`;
                hiddenDiv.style.height = `auto`;
                hiddenDiv.style.visibility = 'hidden';
                hiddenDiv.style.position = 'fixed';
                hiddenDiv.style.zIndex = -9999;
                hiddenDiv.style.opacity = 0;
                const video = document.createElement('video');
                video.src = 
                    forExport
                        ? practice.attributes.cover.data.attributes.url
                        : process.env.NEXT_PUBLIC_STRAPI_API_URL + practice.attributes.cover.data.attributes.url;
                video.muted = true;
                video.playsInline = true;
                video.loop = true;
                video.style.width = '100%';
                video.style.height = 'auto';
                video.crossOrigin = 'anonymous';
                hiddenDiv.appendChild(video);
                document.body.appendChild(hiddenDiv);
                video.play();

                const imgWidth = Math.ceil(width * 0.9);
                const imgHeight = Math.ceil(imgWidth * (origImgH / origImgW));

                const texture = new THREE.VideoTexture(video);
                const geometry = new THREE.PlaneGeometry(imgWidth, imgHeight);
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        imageTexture: { value: texture },
                        threshold: { value: 1 },
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform sampler2D imageTexture;
                        uniform float threshold;
                        varying vec2 vUv;
                        void main() {
                            vec4 texel = texture2D(imageTexture, vUv);
                            float brightness = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
                            if (brightness > threshold) {
                                gl_FragColor = vec4(texel.rgb, 1.0);
                            } else {
                                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                            }
                        }
                    `,
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.name = `video_${i}`;
                mesh.position.y = -(accumulatedHeight + imgHeight / 2 - height / 2);
                const margin = width * 0.1;
                const offsetX = (width * 0.8 - imgWidth) / 2 + margin;
                mesh.position.x = i % 2 !== 0 ? -offsetX : offsetX;
                scene.add(mesh);

                accumulatedHeight += imgHeight;

                // PROXY
                const proxyDiv = document.createElement('div');
                proxyDiv.className = `proxy_video_${i}`;
                proxyDiv.style.width = `${imgWidth}px`;
                proxyDiv.style.height = `${imgHeight}px`;
                proxyDiv.style.justifySelf = i % 2 ? 'start' : 'end';
                proxyDiv.style.pointerEvents = 'all';
                const link = document.createElement('a');
                link.href = `/practice/${practice.attributes.slug}`;
                link.style.width = '100%';
                link.style.height = '100%';
                link.style.display = 'block';
                link.style.position = 'relative';
                proxyDiv.appendChild(link);
                proxyContainerRef.current.appendChild(proxyDiv);

                // SCROLLTRIGGER
                const anim = gsap.to(material.uniforms.threshold, {
                    value: -1,
                    duration: 2.5,
                    paused: true,
                });
        
                ScrollTrigger.create({
                    trigger: proxyContainerRef.current.children[i],
                    onEnter: () => anim.play(),
                    onEnterBack: () => anim.play(),
                    onLeave: () => {
                        material.uniforms.threshold.value = 1;
                        anim.progress(0).pause();
                    },
                    onLeaveBack: () => {
                        material.uniforms.threshold.value = 1;
                        anim.progress(0).pause();
                    },
                    onUpdate: () => {
                        console.log(`threshold VIDEO ${i}`, material.uniforms.threshold.value)
                    },
                    once: false,
                });
            }
        });

        ////////////////////////////////////
        // GENERAL
        ////////////////////////////////////

        accumulatedHeight += height;

        // ANIMATE CAMERA
        const onScroll = () => {
            const maxScroll = accumulatedHeight - height;
            const scrollY = window.scrollY;
            const scrollFraction = scrollY / maxScroll;
            camera.position.y = -scrollFraction * maxScroll;
        };

        window.addEventListener('scroll', onScroll);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('scroll', onScroll);
            mountRef.current && mountRef.current.removeChild(renderer.domElement);
        };
    }, [projects]);

    return (
        <div className="practice-images-threejs">
            <div ref={mountRef} className="threejs" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, pointerEvents: 'none', zIndex: 2 }}></div>
            <div ref={proxyContainerRef} className="proxy" style={{ position: 'absolute', top: 0, left: 0, width: '100%', display: 'grid', paddingBottom: '100vh', pointerEvents: 'none', zIndex: 3 }}></div>
        </div>
    );
}
