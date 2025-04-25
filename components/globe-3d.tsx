"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import { useTexture } from "@react-three/drei"
import type * as THREE from "three"

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture("/assets/3d/texture_earth.jpg")

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <meshStandardMaterial map={texture} />
    </Sphere>
  )
}

export function Globe3D() {
  return (
    <div className="h-[200px] w-full">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Globe />
      </Canvas>
    </div>
  )
}
