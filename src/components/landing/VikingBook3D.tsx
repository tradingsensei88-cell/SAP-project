"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function VikingBook3D() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Scene setup
        const scene = new THREE.Scene();
        const width = mount.clientWidth;
        const height = mount.clientHeight;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
        camera.position.set(0, 50, 500);

        // Renderer with transparent background
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        mount.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
        keyLight.position.set(300, 400, 300);
        keyLight.castShadow = true;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xccddff, 1.0);
        fillLight.position.set(-200, 100, 200);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xccff99, 0.8);
        rimLight.position.set(0, -200, -300);
        scene.add(rimLight);

        // Mouse tracking
        let targetRotationX = 0;
        let targetRotationY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;

        // Load GLTF model
        let object: THREE.Group | null = null;
        const loader = new GLTFLoader();

        loader.load(
            "/models/steampunk_book/glow.glb",
            (gltf) => {
                object = gltf.scene;

                // Fix: strip any extra UV sets (uv2, uv3, uv4...) that cause
                // "undeclared identifier" shader errors in Three.js
                object.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        const geo = mesh.geometry;
                        // Keep only uv (TEXCOORD_0) — delete any extra UV channels
                        ["uv1", "uv2", "uv3", "uv4", "uv5"].forEach((attr) => {
                            if (geo.attributes[attr]) {
                                geo.deleteAttribute(attr);
                            }
                        });
                        // Also clear aoMap / lightMap on materials to avoid referencing missing UVs
                        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                        mats.forEach((mat) => {
                            const m = mat as THREE.MeshStandardMaterial;
                            if (m.aoMap) m.aoMap = null;
                            if (m.lightMap) m.lightMap = null;
                            m.needsUpdate = true;
                        });
                    }
                });

                // Center and scale the model
                const box = new THREE.Box3().setFromObject(object);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 350 / maxDim;

                object.scale.setScalar(scale);
                object.position.sub(center.multiplyScalar(scale));
                object.position.y -= 20;

                // Initial slight tilt to look good
                object.rotation.x = 0.15;
                object.rotation.y = -0.3;

                scene.add(object);
            },
            (xhr) => {
                console.log(`Steampunk Book: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}% loaded`);
            },
            (error) => {
                console.error("Error loading Steampunk Book model:", error);
            }
        );

        // Mouse move handler — smooth tracking relative to window
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            targetRotationY = x * 0.6;
            targetRotationX = y * 0.3;
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Resize handler
        const handleResize = () => {
            if (!mount) return;
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", handleResize);

        // Animation loop with smooth lerp
        let animFrameId: number;
        const animate = () => {
            animFrameId = requestAnimationFrame(animate);

            // Smooth interpolation toward target rotation
            currentRotationX += (targetRotationX - currentRotationX) * 0.05;
            currentRotationY += (targetRotationY - currentRotationY) * 0.05;

            if (object) {
                object.rotation.x = 0.15 + currentRotationX;
                object.rotation.y = -0.3 + currentRotationY;
            }

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="w-full h-full"
            style={{ minHeight: "400px" }}
        />
    );
}
