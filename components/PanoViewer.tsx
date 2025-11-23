import React, { useEffect, useRef } from 'react';

interface PanoViewerProps {
    imageUrl: string;
}

const PanoViewer: React.FC<PanoViewerProps> = ({ imageUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Load Pannellum script if not already loaded
        if (!window.pannellum) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
            script.async = true;
            script.onload = () => initViewer();
            document.head.appendChild(script);

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
            document.head.appendChild(link);
        } else {
            initViewer();
        }

        function initViewer() {
            if (containerRef.current && window.pannellum) {
                viewerRef.current = window.pannellum.viewer(containerRef.current, {
                    type: 'equirectangular',
                    panorama: imageUrl,
                    autoLoad: true,
                    showControls: true,
                    showFullscreenCtrl: true,
                    showZoomCtrl: true,
                    mouseZoom: true,
                    draggable: true,
                    keyboardZoom: true,
                    compass: false,
                    hotSpotDebug: false,
                });
            }
        }

        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
            }
        };
    }, [imageUrl]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

// Extend window type for pannellum
declare global {
    interface Window {
        pannellum: any;
    }
}

export default PanoViewer;
