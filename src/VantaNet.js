import { useEffect, useRef, useState } from "react";

export default function VantaNet() {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
    // Load scripts dynamically
    const loadScripts = async () => {
        const THREE = await import("three");
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
        script.async = true;
        script.onload = () => {
        if (!vantaEffect) {
            setVantaEffect(
            window.VANTA.NET({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                minHeight: 200.0,
                minWidth: 200.0,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0x0077ff,
                backgroundColor: 0x0f172a,
                points: 12.0,
                maxDistance: 20.0,
                spacing: 16.0,
            })
            );
        }
        };
    document.body.appendChild(script);
    };

    loadScripts();

    return () => {
        if (vantaEffect) vantaEffect.destroy();
    };
    }, [vantaEffect]);

    return (
    <div
        ref={vantaRef}
        style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: -1,
        top: 0,
        left: 0,
        }}
    />
    );
}
