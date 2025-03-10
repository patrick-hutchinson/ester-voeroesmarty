import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function IndexImages({ projects, page }) {
  const [threeLoading, setThreeLoading] = useState(true);
  const [projectsWithCover, setProjectsWithCover] = useState(projects.filter((project) => project.cover));
  const sceneRenderedRef = useRef(false);
  const mountRef = useRef(null);
  const proxyContainerRef = useRef(null);
  const sceneMeshes = [];

  useEffect(() => {
    if (sceneRenderedRef.current) return;

    let onScroll, updateCamera;
    sceneRenderedRef.current = true;

    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight < 1366 ? window.innerHeight * 1.2 : window.innerHeight;
    const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Prevent extreme jumps
    mountRef.current.appendChild(renderer.domElement);

    console.log("projectsWithCover", projectsWithCover);

    let accumulatedHeight = 0;

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
      });
    };

    const loadVideo = (url) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.src = url;
        video.addEventListener("loadedmetadata", () => {
          resolve({ width: video.videoWidth, height: video.videoHeight });
        });
        video.addEventListener("error", reject);
      });
    };

    const fetchPromises = projectsWithCover.map((project, i) => {
      const isVideo =
        page !== "slug"
          ? project.cover[0].url.includes(".mp4", "mov", "avi", "flv", "wmv", "3gp", "mkv", "webm")
          : project.url.includes(".mp4", "mov", "avi", "flv", "wmv", "3gp", "mkv", "webm");

      const mediaUrl = page !== "slug" ? project.cover[0].url : project.url;

      if (isVideo) {
        return loadVideo(mediaUrl)
          .then(({ width, height }) => ({ project, i, isVideo, width, height }))
          .catch((error) => {
            console.error(error);
            return null;
          });
      } else {
        return loadImage(mediaUrl)
          .then(({ width, height }) => ({ project, i, isVideo, width, height }))
          .catch((error) => {
            console.error(error);
            return null;
          });
      }
    });

    // Right before you run Promise.all(fetchPromises):
    let totalTextures = projectsWithCover.length;
    let loadedTextures = 0;

    function onOneTextureLoaded() {
      loadedTextures++;
      if (loadedTextures === totalTextures) {
        console.log("✅ All textures have been loaded and applied!");
        setThreeLoading(false);
      }
    }

    Promise.all(fetchPromises).then((results) => {
      console.log("results", results);

      results.forEach((result, j) => {
        if (!result) return;

        const { project, i, isVideo, width: origImgW, height: origImgH } = result;

        const imgWidth = Math.ceil(width * 0.9);
        const imgHeight = Math.ceil(imgWidth * (origImgH / origImgW));

        if (isVideo && origImgW && origImgH) {
          // Rendering video
          const hiddenDiv = document.createElement("div");
          hiddenDiv.className = `hidden_video_${i}`;
          hiddenDiv.style.width = `90vw`;
          hiddenDiv.style.height = `auto`;
          hiddenDiv.style.visibility = "hidden";
          hiddenDiv.style.position = "fixed";
          hiddenDiv.style.zIndex = -9999;
          hiddenDiv.style.opacity = 0;
          const video = document.createElement("video");
          video.src = page !== "slug" ? project.cover[0].url : project.url;
          video.muted = true;
          video.playsInline = true;
          video.loop = true;
          video.style.width = "100%";
          video.style.height = "auto";
          video.crossOrigin = "anonymous";
          hiddenDiv.appendChild(video);
          document.body.appendChild(hiddenDiv);

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
          mesh.position.y = -(accumulatedHeight + imgHeight / 2 - height / 2);
          const margin = width * 0.1;
          const offsetX = (width * 0.8 - imgWidth) / 2 + margin;
          mesh.position.x = i % 2 !== 0 ? -offsetX : offsetX;
          mesh.userData.aspectRatio = origImgH / origImgW;
          scene.add(mesh);
          sceneMeshes.push(mesh);

          accumulatedHeight += imgHeight;

          if (!document.querySelector(`.proxy_video_${i}`)) {
            const proxyDiv = document.createElement("div");
            proxyDiv.className = `proxy_video_${i}`;
            proxyDiv.style.width = `${imgWidth}px`;
            proxyDiv.style.height = `${imgHeight}px`;
            proxyDiv.style.justifySelf = i % 2 ? "start" : "end";
            proxyDiv.style.pointerEvents = "all";

            if (page !== "slug") {
              const link = document.createElement("a");
              link.href = `/practice/${project.slug.current}`;
              link.style.width = "100%";
              link.style.height = "100%";
              link.style.display = "block";
              link.style.position = "relative";
              proxyDiv.appendChild(link);
            }

            proxyContainerRef.current?.appendChild(proxyDiv);
          }

          const anim = gsap.to(material.uniforms.threshold, {
            value: -1,
            duration: 2.5,
            paused: true,
          });

          ScrollTrigger.create({
            trigger: proxyContainerRef.current?.children[i],
            onEnter: () => {
              video.play();
              anim.play();
            },
            onEnterBack: () => {
              video.play();
              anim.play();
            },
            onLeave: () => {
              material.uniforms.threshold.value = 1;
              anim.progress(0).pause();
              video.pause();
            },
            onLeaveBack: () => {
              material.uniforms.threshold.value = 1;
              anim.progress(0).pause();
              video.pause();
            },
            once: false,
          });

          onOneTextureLoaded();
        } else if (!isVideo && origImgW && origImgH) {
          const url =
            page !== "slug"
              ? window.innerWidth > 768
                ? `${project.cover[0].url}`
                : `${project.cover[0].url}`
              : window.innerWidth > 768
              ? `${project.url}`
              : `${project.url}`;
          // Rendering image
          const texture = new THREE.TextureLoader().load(url);

          // console.log('window.innerWidth', window.innerWidth > 768);
          // console.log('url', url);

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
          mesh.userData.aspectRatio = origImgH / origImgW;
          scene.add(mesh);
          sceneMeshes.push(mesh);

          accumulatedHeight += imgHeight;

          if (!document.querySelector(`.proxy_image_${i}`)) {
            const proxyDiv = document.createElement("div");
            proxyDiv.className = `proxy_image_${i}`;
            proxyDiv.style.width = `${imgWidth}px`;
            proxyDiv.style.height = `${imgHeight}px`;
            proxyDiv.style.justifySelf = i % 2 ? "start" : "end";
            proxyDiv.style.pointerEvents = "all";

            if (page !== "slug") {
              const link = document.createElement("a");
              link.href = `/practice/${project.slug.current}`;
              link.style.width = "100%";
              link.style.height = "100%";
              link.style.display = "block";
              link.style.position = "relative";
              proxyDiv.appendChild(link);
            }

            proxyContainerRef.current?.appendChild(proxyDiv);
          }

          const anim = gsap.to(material.uniforms.threshold, {
            value: -1,
            duration: 2.5,
            paused: true,
          });

          ScrollTrigger.create({
            trigger: proxyContainerRef.current?.children[i],
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

          onOneTextureLoaded();
        }
      });

      onScroll = () => {
        const maxScroll = accumulatedHeight - height;
        const scrollY = window.scrollY;
        const scrollFraction = scrollY / maxScroll;
        camera.position.y = -scrollFraction * maxScroll;
      };

      updateCamera = () => {
        const width = window.innerWidth;
        const height = window.innerHeight < 1366 ? window.innerHeight * 1.2 : window.innerHeight;

        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        let newAccumulatedHeight = 0;

        sceneMeshes.forEach((mesh, i) => {
          const aspectRatio = mesh.userData.aspectRatio;
          if (!aspectRatio) return;

          const imgWidth = Math.ceil(width * 0.9);
          const imgHeight = Math.ceil(imgWidth * aspectRatio);

          // Ensure values are valid
          if (isNaN(imgWidth) || isNaN(imgHeight)) {
            console.error("Invalid recalculated dimensions for mesh:", i);
            return;
          }

          mesh.geometry.dispose();
          mesh.geometry = new THREE.PlaneGeometry(imgWidth, imgHeight);
          proxyContainerRef.current ? (proxyContainerRef.current.children[i].style.width = `${imgWidth}px`) : null;
          proxyContainerRef.current ? (proxyContainerRef.current.children[i].style.height = `${imgHeight}px`) : null;

          mesh.position.y = -(newAccumulatedHeight + imgHeight / 2 - height / 2);

          const margin = width * 0.1;
          const offsetX = (width * 0.8 - imgWidth) / 2 + margin;
          mesh.position.x = i % 2 !== 0 ? -offsetX : offsetX;

          newAccumulatedHeight += imgHeight;
        });
      };

      window.addEventListener("scroll", onScroll);
      window.addEventListener("resize", updateCamera);

      const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateCamera);
    };
  }, []);

  return (
    <div className="practice-images-threejs">
      <div ref={mountRef} className="threejs"></div>
      <div ref={proxyContainerRef} className="proxy"></div>
      {threeLoading && (
        <div className="threejs-loading">
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
}
