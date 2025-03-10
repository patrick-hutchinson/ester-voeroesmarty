// import { useEffect, useRef, useState } from "react";
// import * as THREE from 'three';
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
// import useWindowDimensions from "@/utils/useWindowDimensions";

// gsap.registerPlugin(ScrollTrigger);

// export default function PracticeImage({ practice, i }) {
//     const mountRef = useRef(null);
//     const canvasParentRef = useRef(null);

//     const [canvasSize, setCanvasSize] = useState({
//         width: `90vw`,
//         height: `calc(${practice.attributes.cover.data.attributes.formats.large.height / practice.attributes.cover.data.attributes.formats.large.width} * 90vw)`
//     })

//     useEffect(() => {
//         // Initialize progress object outside of GSAP to hold the threshold value
//         let progress = { value: 1 };

//         // Use the state values directly for simplicity
//         const desiredWidth = Math.ceil(window.innerWidth * 0.9);
//         const desiredHeight = Math.ceil((window.innerWidth * 0.9) * (practice.attributes.cover.data.attributes.formats.large.height / practice.attributes.cover.data.attributes.formats.large.width))

//         // Scene setup
//         const scene = new THREE.Scene();

//         // Adjust the camera to match the div's width and height
//         // An Orthographic camera is used here to avoid perspective distortion
//         const aspect = desiredWidth / desiredHeight;
//         const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);
//         camera.position.z = 5;

//         const renderer = new THREE.WebGLRenderer({ alpha: true });
//         renderer.setSize(desiredWidth, desiredHeight);
//         mountRef.current.appendChild(renderer.domElement);

//         // Load the image texture
//         const loader = new THREE.TextureLoader();
//         const imageTexture = loader.load(process.env.NEXT_PUBLIC_STRAPI_API_URL + practice.attributes.cover.data.attributes.url);
//         // const imageTexture = loader.load(practice.attributes.cover.data.attributes.url);

//         // Shader material with progress reference
//         const customShaderMaterial = new THREE.ShaderMaterial({
//             uniforms: {
//                 imageTexture: { value: imageTexture },
//                 threshold: { value: progress.value },
//             },
//             vertexShader: `
//                 varying vec2 vUv;
//                 void main() {
//                     vUv = uv;
//                     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//                 }
//             `,
//             fragmentShader: `
//                 uniform sampler2D imageTexture;
//                 uniform float threshold;
//                 varying vec2 vUv;
//                 void main() {
//                     vec4 texel = texture2D(imageTexture, vUv);
//                     float brightness = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
//                     if (brightness > threshold) {
//                         gl_FragColor = vec4(texel.rgb, 1.0);
//                     } else {
//                         gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
//                     }
//                 }
//             `,
//         });

//         // Create the geometry matching the div's aspect ratio
//         const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
//         const mesh = new THREE.Mesh(geometry, customShaderMaterial);
//         scene.add(mesh);

//         const anim = gsap.to(progress, {
//             value: 0,
//             duration: 1.3,
//             paused: true,
//             onUpdate: () => {
//                 customShaderMaterial.uniforms.threshold.value = progress.value;
//             },
//         });

//         ScrollTrigger.create({
//             trigger: canvasParentRef.current,
//             onEnter: () => anim.play(),
//             onEnterBack: () => anim.play(),
//             onLeave: () => {
//                 progress.value = 1;
//                 anim.progress(0).pause();
//             },
//             onLeaveBack: () => {
//                 progress.value = 1;
//                 anim.progress(0).pause();
//             },
//             once: false,
//         });

//         // Animation loop
//         const animate = function () {
//             requestAnimationFrame(animate);
//             renderer.render(scene, camera);
//         };

//         animate();

//         // Clean up
//         return () => {
//             mountRef.current && mountRef.current.removeChild(renderer.domElement);
//             ScrollTrigger.getAll().forEach(st => st.kill());
//         };
//     }, [practice]); // Reacting to canvas size changes

//     return (
//         <div 
//             ref={canvasParentRef}
//             style={{
//                 justifySelf: i % 2 ? 'start' : 'end',
//                 width: canvasSize.width,
//                 height: canvasSize.height,
//             }}
//         >
//             <div ref={mountRef} style={{                 
//                 width: '100%',
//                 height: '100%',
//             }}
//             >
//             </div>
//         </div>
//     );
// }
