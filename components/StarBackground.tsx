import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const Galaxy = () => {
    const points = useRef<THREE.Points>(null!);
    const { camera, pointer, raycaster } = useThree();
    const mousePos = useRef(new THREE.Vector3(0, 0, 0));

    // Galaxy Parameters
    const parameters = {
        count: 5000,
        radius: 8,
        branches: 4,
        randomness: 0.3,
        randomnessPower: 3,
        insideColor: '#00f0ff',
        outsideColor: '#4c1d95'
    };

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uColorInner: { value: new THREE.Color(parameters.insideColor) },
        uColorOuter: { value: new THREE.Color(parameters.outsideColor) }
    }), []);

    const geometryData = useMemo(() => {
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        const scales = new Float32Array(parameters.count * 1);
        const randomness = new Float32Array(parameters.count * 3);

        const insideColor = new THREE.Color(parameters.insideColor);
        const outsideColor = new THREE.Color(parameters.outsideColor);

        for(let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            // Position (Spiral)
            const radius = Math.random() * parameters.radius;
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
            const spinAngle = radius * 1; // Spin factor

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

            randomness[i3] = randomX;
            randomness[i3 + 1] = randomY;
            randomness[i3 + 2] = randomZ;

            // Color
            const mixedColor = insideColor.clone();
            mixedColor.lerp(outsideColor, radius / parameters.radius);
            
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            // Scale
            scales[i] = Math.random();
        }

        return { positions, colors, scales, randomness };
    }, []);

    useFrame((state) => {
        const { clock } = state;
        
        // Update Time
        if (points.current && points.current.material) {
             (points.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
        }
        
        // Raycast for Mouse Interaction
        // Project mouse onto a plane at z=0 (or consistent with galaxy depth)
        // Since we rotate the galaxy group, we raycast in world space
        raycaster.setFromCamera(pointer, camera);
        const target = new THREE.Vector3();
        
        // Virtual plane facing camera for interaction
        const planeNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(planeNormal, new THREE.Vector3(0, 0, 0));
        raycaster.ray.intersectPlane(plane, target);
        
        if (target) {
             mousePos.current.lerp(target, 0.1); // Smooth following
             if (points.current && points.current.material) {
                (points.current.material as THREE.ShaderMaterial).uniforms.uMouse.value.copy(mousePos.current);
             }
        }
    });

    // Vertex Shader
    const vertexShader = `
        uniform float uTime;
        uniform vec3 uMouse;
        
        attribute float aScale;
        attribute vec3 aRandomness;
        
        varying vec3 vColor;

        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            // Add randomness to original position
            modelPosition.xyz += aRandomness;

            // Spin Animation
            float angle = atan(modelPosition.x, modelPosition.z);
            float distanceToCenter = length(modelPosition.xz);
            float angleOffset = (1.0 / distanceToCenter) * uTime * 0.1;
            angle += angleOffset;
            
            modelPosition.x = cos(angle) * distanceToCenter;
            modelPosition.z = sin(angle) * distanceToCenter;

            // Mouse Interaction (Repulsion/Disturbance)
            float dist = distance(modelPosition.xyz, uMouse);
            float interactionRadius = 4.0;
            float influence = 1.0 - smoothstep(0.0, interactionRadius, dist);
            
            // Push particles up/away based on proximity
            vec3 pushDir = normalize(modelPosition.xyz - uMouse);
            modelPosition.xyz += pushDir * influence * 1.0;
            modelPosition.y += influence * 0.5;

            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            
            // Size attenuation
            gl_PointSize = aScale * 50.0;
            gl_PointSize *= (1.0 / -viewPosition.z);
            gl_PointSize *= (1.0 + influence * 3.0); // Grow when interacting

            vColor = color;
        }
    `;

    // Fragment Shader
    const fragmentShader = `
        varying vec3 vColor;
        
        void main() {
            // Circle shape with soft edge
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            strength = pow(strength, 5.0);
            
            vec3 color = mix(vec3(0.0), vColor, strength);
            gl_FragColor = vec4(color, strength);
        }
    `;

    return (
        <group rotation={[Math.PI / 4, 0, 0]}> {/* Tilt galaxy slightly */}
            <points ref={points}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={geometryData.positions.length / 3}
                        array={geometryData.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={geometryData.colors.length / 3}
                        array={geometryData.colors}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-aScale"
                        count={geometryData.scales.length}
                        array={geometryData.scales}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attach="attributes-aRandomness"
                        count={geometryData.randomness.length / 3}
                        array={geometryData.randomness}
                        itemSize={3}
                    />
                </bufferGeometry>
                <shaderMaterial
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    vertexColors={true}
                    uniforms={uniforms}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    transparent={true}
                />
            </points>
        </group>
    );
};

const CameraRig = () => {
    const { camera, pointer } = useThree();
    
    useFrame((state, delta) => {
        // Smooth parallax camera movement
        const parallaxX = pointer.x * 2;
        const parallaxY = pointer.y * 2;
        
        camera.position.x += (parallaxX - camera.position.x) * delta;
        camera.position.y += (parallaxY - camera.position.y) * delta;
        camera.lookAt(0, 0, 0);
    });
    
    return null;
}

const CursorGlow = () => {
    const ref = useRef<THREE.PointLight>(null!);
    const { pointer, viewport } = useThree();
    
    useFrame(() => {
        const x = (pointer.x * viewport.width) / 2;
        const y = (pointer.y * viewport.height) / 2;
        if(ref.current) {
             ref.current.position.set(x, y, 2);
        }
    });
    
    return <pointLight ref={ref} distance={10} intensity={2} color="#00f0ff" decay={2} />;
}

export const StarBackground = () => {
    return (
        <>
            <color attach="background" args={['#050b14']} />
            <fog attach="fog" args={['#050b14', 10, 50]} />
            
            <ambientLight intensity={0.2} />
            <CursorGlow />
            <CameraRig />
            
            <Galaxy />
            
            <Stars radius={60} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        </>
    );
};
