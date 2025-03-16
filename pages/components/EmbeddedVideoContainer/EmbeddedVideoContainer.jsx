import React, { useState, useEffect, useRef } from "react";

import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Image from "next/image";

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function EmbeddedVideoContainer({ index, embeddedVideo }) {
  const imageWrapperRef = useRef(null);
  const thumbnailRef = useRef(null);
  // Three JS Scene Creation
  const sceneRenderedRef = useRef(false);
  const mountRef = useRef(null);
  useEffect(() => {
    if (sceneRenderedRef.current) return;
    sceneRenderedRef.current = true;

    // *** DEFINE SCENE
    const scene = new THREE.Scene();

    const width = imageWrapperRef.current.getBoundingClientRect().width;
    const height = imageWrapperRef.current.getBoundingClientRect().height;

    const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Prevent extreme jumps
    mountRef.current.appendChild(renderer.domElement);

    const updateDimensions = () => {
      const width = imageWrapperRef.current?.getBoundingClientRect().width;
      const height = imageWrapperRef.current?.getBoundingClientRect().height;

      // Update camera and renderer size
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);

      // Update the plane geometry
      mesh.geometry = new THREE.PlaneGeometry(width, height);

      // Update texture scale to maintain aspect ratio
      texture.repeat.set(width / texture.image.width, height / texture.image.height);
    };

    // Add this to window resize event listener:
    window.addEventListener("resize", updateDimensions);

    // Update dimensions on window resize
    window.addEventListener("resize", updateDimensions);

    // *** LOAD IMAGE
    const texture = new THREE.TextureLoader().load(embeddedVideo.thumbnail.url, () => {});

    const geometry = new THREE.PlaneGeometry(width, height);

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
    mesh.userData.aspectRatio = height / width;
    scene.add(mesh);

    const anim = gsap.to(material.uniforms.threshold, {
      value: -1,
      duration: 2.5,
      paused: true,
    });
    const animOut = gsap.to(material.uniforms.threshold, {
      value: 1,
      duration: 2.5,
      paused: true,
    });

    ScrollTrigger.create({
      trigger: imageWrapperRef.current,
      start: "top 50%", // Trigger when the top of the element is 80% from the top of the viewport
      onEnter: () => anim.play(),
      onEnterBack: () => anim.play(),
      //   onLeave: () => {
      //     animOut.play();
      //     anim.progress(0).pause();
      //   },
      //   onLeaveBack: () => {
      //     animOut.play();
      //     anim.progress(0).pause();
      //   },
      once: true,
    });

    // *** RENDER
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // ***
  }, []);

  function handlePlayVideo() {
    console.log("click!");
    thumbnailRef.current.style.opacity = 0;
  }

  if (!embeddedVideo?.thumbnail) return null; // Prevents crashing during SSR
  if (!embeddedVideo) return <div>Loading...</div>;

  return (
    <div className="image-wrapper" ref={imageWrapperRef} onClick={() => handlePlayVideo()}>
      <div ref={thumbnailRef}>
        <div className="play">
          <svg className="play-icon" viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 15L-1.27793e-06 30L3.34153e-08 -1.04907e-06L24 15Z" />
          </svg>
        </div>
        <Image
          src={embeddedVideo.thumbnail.lqip}
          alt="project image"
          width={embeddedVideo.thumbnail.width}
          height={embeddedVideo.thumbnail.height}
          style={{
            position: "relative",
            top: 0,
            left: 0,
            opacity: 1,
            zIndex: 4,
          }}
        />
        <div ref={mountRef} className="image-wrapper--threejs"></div>
      </div>
      <ReactPlayer
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 1,
          zIndex: 3,
          width: "100%", // Ensures it takes up the full width
          height: "100%", // Ensures it takes up the full height
        }}
        key={index}
        url={embeddedVideo.link}
        className={`video-player`}
        controls
      ></ReactPlayer>
    </div>
  );
}
