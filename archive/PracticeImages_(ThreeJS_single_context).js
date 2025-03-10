import React, { useEffect, useRef } from "react";
import * as THREE from 'three';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import useWindowDimensions from "@/utils/useWindowDimensions";

gsap.registerPlugin(ScrollTrigger);

export default function PracticeImages({ projects }) {
    const mountRef = useRef(null);
    const proxyContainerRef = useRef(null);

    useEffect(() => {
        // Ensure proxyContainerRef is empty to avoid duplications
        while (proxyContainerRef.current.firstChild) {
            proxyContainerRef.current.removeChild(proxyContainerRef.current.firstChild);
        }

        const scene = new THREE.Scene();
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Adjust the camera setup to center the view at the start
        const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        let accumulatedHeight = 0; // This will track the total height of images

        projects.forEach((practice, i) => {
            const imgWidth = Math.ceil(width * 0.9);
            const imgHeight = Math.ceil(imgWidth * (practice.attributes.cover.data.attributes.formats.large.height / practice.attributes.cover.data.attributes.formats.large.width));

            // Load texture
            const texture = new THREE.TextureLoader().load(process.env.NEXT_PUBLIC_STRAPI_API_URL + practice.attributes.cover.data.attributes.url);
            
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
            // Accumulate the height as we go down
            mesh.position.y = -(accumulatedHeight + imgHeight / 2 - height / 2);
            const margin = width * 0.1;

            // This keeps the image within the central 80% of the screen when alternating.
            const offsetX = (width * 0.8 - imgWidth) / 2 + margin;

            // Alternate images between left and right, considering the margin
            mesh.position.x = i % 2 !== 0 ? -offsetX : offsetX;
            scene.add(mesh);

            accumulatedHeight += imgHeight;

            // Create a proxy div for each image to control the scroll size
            const proxyDiv = document.createElement('div');
            proxyDiv.style.width = `${imgWidth}px`;
            proxyDiv.style.height = `${imgHeight}px`;
            proxyDiv.style.justifySelf = i % 2 ? 'start' : 'end',
            proxyContainerRef.current.appendChild(proxyDiv);

            const anim = gsap.to(material.uniforms.threshold, {
                value: 0,
                duration: 1.3,
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
        });

        accumulatedHeight += height;

        // Adjust scrolling
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
            <div ref={mountRef} className="threejs" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0 }}></div>
            <div ref={proxyContainerRef} className="proxy" style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, width: '100%', display: 'grid', paddingBottom: '100vh' }}></div>
        </div>
    );
}
