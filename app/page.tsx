'use client';

import { useEffect, useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const StarsCanvas = dynamic(() => import('@/components/StarsCanvas'), {
    ssr: false,
});

export default function Home() {
    const [showSplash, setShowSplash] = useState(true);
    const [showLanding, setShowLanding] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);
        const landingTimer = setTimeout(() => {
            setShowLanding(true);
            setTimeout(() => {
                setFadeIn(true);
            }, 50);
        }, 3000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(landingTimer);
        };
    }, []);

    return (
        <div className="relative min-h-screen w-full">
            <StarsCanvas show={true} />
            <div
                className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
                    showSplash ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                <Image
                    src="/loading.gif"
                    alt="Intro Splash"
                    width={150}
                    height={150}
                    unoptimized
                />
            </div>
            {showLanding && (
                <div
                    className={`transition-opacity duration-1000 ${
                        fadeIn ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <LandingPage />
                </div>
            )}
        </div>
    );
}
