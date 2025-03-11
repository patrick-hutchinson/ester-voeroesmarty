import React, { useState, useEffect, useRef } from "react";

// import { useInView } from "framer-motion";
// import Image from "next/image";

// import * as THREE from "three";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

export default function VideoContainer({ medium }) {
  //   const imageWrapperRef = useRef(null);

  //   // Three JS Scene Creation
  //   const sceneRenderedRef = useRef(false);
  //   const mountRef = useRef(null);
  //   useEffect(() => {
  //     if (sceneRenderedRef.current) return;
  //     sceneRenderedRef.current = true;

  //     // *** DEFINE SCENE
  //     const scene = new THREE.Scene();
  //     scene.background = new THREE.Color("red");

  //     const width = imageWrapperRef.current.getBoundingClientRect().width;
  //     const height = imageWrapperRef.current.getBoundingClientRect().height;
  //     console.log("Scene dimensions:", width, height);

  //     const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
  //     camera.position.z = 100;

  //     const renderer = new THREE.WebGLRenderer({ alpha: true });
  //     renderer.setSize(width, height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Prevent extreme jumps
  //     mountRef.current.appendChild(renderer.domElement);

  //     // *** LOAD IMAGE
  //     const texture = new THREE.TextureLoader().load(medium.url, () => {
  //       console.log("Image loaded");
  //     });

  //     const geometry = new THREE.PlaneGeometry(width, height);

  //     const material = new THREE.ShaderMaterial({
  //       uniforms: {
  //         imageTexture: { value: texture },
  //         threshold: { value: 1 },
  //       },
  //       vertexShader: `
  //                                 varying vec2 vUv;
  //                                 void main() {
  //                                     vUv = uv;
  //                                     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //                                 }
  //                             `,
  //       fragmentShader: `
  //                                 uniform sampler2D imageTexture;
  //                                 uniform float threshold;
  //                                 varying vec2 vUv;
  //                                 void main() {
  //                                     vec4 texel = texture2D(imageTexture, vUv);
  //                                     float brightness = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
  //                                     if (brightness > threshold) {
  //                                         gl_FragColor = vec4(texel.rgb, 1.0);
  //                                     } else {
  //                                         gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  //                                     }
  //                                 }
  //                             `,
  //     });

  //     const mesh = new THREE.Mesh(geometry, material);
  //     mesh.userData.aspectRatio = height / width;
  //     scene.add(mesh);

  //     const anim = gsap.to(material.uniforms.threshold, {
  //       value: -1,
  //       duration: 2.5,
  //       paused: true,
  //     });

  //     ScrollTrigger.create({
  //       trigger: imageWrapperRef.current,
  //       start: "top 20%", // Trigger when the top of the element is 80% from the top of the viewport
  //       onEnter: () => anim.play(),
  //       onEnterBack: () => anim.play(),
  //       onLeave: () => {
  //         material.uniforms.threshold.value = 1;
  //         anim.progress(0).pause();
  //       },
  //       onLeaveBack: () => {
  //         material.uniforms.threshold.value = 1;
  //         anim.progress(0).pause();
  //       },
  //       once: false,
  //     });

  //     // *** RENDER
  //     const animate = () => {
  //       renderer.render(scene, camera);
  //       requestAnimationFrame(animate);
  //     };

  //     animate();
  //     // ***
  //   }, []);

  return (
    <div
      ref={imageWrapperRef}
      className="image-wrapper"
      style={{ position: "relative", width: "100%", height: "fit-content", overflow: "hidden" }}
    >
      {/* Blurred Placeholder (Stays until high-res fully loads) */}
      <video autoPlay={true} playsInline={true} loop={true} muted={true}>
        <source src={medium.url} />
      </video>
      <div ref={mountRef} className="image-wrapper--threejs"></div>
    </div>
  );
}
