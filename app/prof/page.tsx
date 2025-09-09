// app/prof/page.tsx
import React, { Suspense } from 'react';
import ProfPage from '@/components/ProfPage';
import StarsCanvas from '@/components/StarsCanvas';
import Image from 'next/image';

export default function Page() {
    return (
        <Suspense
            fallback={
                <>
                    <StarsCanvas show={true} />
                    <div
                        className={
                            'absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-1000'
                        }
                    >
                        <Image
                            src="/loading.gif"
                            alt="Intro Splash"
                            width={150}
                            height={150}
                            unoptimized
                        />
                    </div>
                </>
            }
        >
            <ProfPage />
        </Suspense>
    );
}
