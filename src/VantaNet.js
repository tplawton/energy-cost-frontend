import React, { useEffect, useRef } from "react";
import NET from "vanta/net"; 
import * as THREE from "three";

export default function VantaNet() {
    const vantaRef = useRef(null);
    const effectRef = useRef(null);

    useEffect(() => {
    if (!effectRef.current) {
        effectRef.current = NET({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x3b82f6,
        backgroundColor: 0x0f172a,
        });
    }

    return () => {
        if (effectRef.current) effectRef.current.destroy();
    };
    }, []);

    return <div ref={vantaRef} className="vanta-bg" />;
}
