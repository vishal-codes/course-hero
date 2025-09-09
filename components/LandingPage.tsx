'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { FaGraduationCap } from 'react-icons/fa6';
import { FaBookOpen, FaUserGraduate, FaBrain } from 'react-icons/fa';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const featuresRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState('/robotnormal.png');

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen relative">
            {/* <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#9333ea] rounded-full filter blur-2xl opacity-20 animate-blob"></div>
                <div className="absolute top-[25%] right-[10%] w-72 h-72 bg-[#3db8d1] rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#f97316] rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div> */}
            <video autoPlay muted loop className="rotate-180 absolute top-[-425px] ">
                <source src="blackhole.webm" type="video/webm" />
            </video>

            <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24 px-6 sm:px-10 md:px-20 py-12 relative z-10 overflow-hidden">
                {/* Left side - Laptop Image */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center">
                    <div className="relative w-[360px] sm:w-[420px] md:w-[500px] lg:w-[580px] xl:w-[620px]">
                        <Image
                            src="/logo1.png"
                            alt="Course Dashboard Mockup"
                            width={600}
                            height={600}
                            className="object-contain w-full h-auto"
                            priority
                        />
                    </div>
                </div>

                {/* Right side - Headline and Buttons */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-6">
                    <div className="flex items-center gap-4">
                        <FaGraduationCap className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 text-[#FF7A21] transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(255,140,0,0.8)]" />
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold shimmer-text">
                            CourseHero
                        </h1>
                    </div>

                    <div className="h-10">
                        <TypewriterEffect text="Titan Up. Select Smart. Slay Hard." />
                    </div>

                    <p className="text-[#D1D5DB] text-base sm:text-lg max-w-md">
                        The ultimate course selection platform for Cal State Fullerton
                        Titans. Find, compare, and register for your perfect classes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button
                            onClick={() => router.push('/details')}
                            className="w-full sm:w-auto cursor-pointer relative px-6 py-3 bg-gradient-to-r from-[#FF7A21] to-[#f8924d] text-white font-bold rounded-full hover:opacity-90 transition-all animate-pulse-border"
                        >
                            Get Started
                        </button>

                        <button
                            onClick={scrollToFeatures}
                            className="w-full sm:w-auto px-6 py-3 bg-[#0000004D] backdrop-blur-sm border border-[#FFFFFF1A] text-white font-bold rounded-full hover:bg-[#00000066] transition-all hover:border-[#FFFFFF4D]"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            <section
                ref={featuresRef}
                id="features"
                className="w-full px-4 sm:px-6 md:px-20 py-40 relative z-10"
            >
                <div className="w-full h-full absolute top-0 left-0 z-[-10] ">
                    <video
                        className="w-full h-full object-cover opacity-50"
                        preload="none"
                        playsInline
                        loop
                        muted
                        autoPlay
                        src="/death_star.mp4"
                    />
                </div>
                <div className="container mx-auto px-4 relative">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-16 text-white tracking-wide">
                        Powerful <span className="shimmer-features-text">Features</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="group relative overflow-hidden p-8 rounded-2xl bg-[#ffffff0d] backdrop-blur-md border border-[#ffffff1a] hover:border-[#ffffff33] transition-all duration-300 hover:shadow-2xl hover:shadow-[#22d3ee1a]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee1a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 mb-6 rounded-lg bg-[#22d3ee1a] flex items-center justify-center">
                                    <FaBookOpen className="text-3xl text-[#22d3ee]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Smart Course Selection
                                </h3>
                                <p className="text-[#D1D5DB] leading-relaxed">
                                    Discover optimal courses tailored to your major,
                                    interests, and schedule with our intelligent matching
                                    system.
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden p-8 rounded-2xl bg-[#ffffff0d] backdrop-blur-md border border-[#ffffff1a] hover:border-[#ffffff33] transition-all duration-300 hover:shadow-2xl hover:shadow-[#a855f71a]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#a855f71a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 mb-6 rounded-lg bg-[#a855f71a] flex items-center justify-center">
                                    <FaUserGraduate className="text-3xl text-[#a855f7]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Professor Insights
                                </h3>
                                <p className="text-[#D1D5DB] leading-relaxed">
                                    Access comprehensive professor profiles with authentic
                                    student reviews and teaching style analysis.
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden p-8 rounded-2xl bg-[#ffffff0d] backdrop-blur-md border border-[#ffffff1a] hover:border-[#ffffff33] transition-all duration-300 hover:shadow-2xl hover:shadow-[#f973161a]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#f973161a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 mb-6 rounded-lg bg-[#f973161a] flex items-center justify-center">
                                    <FaBrain className="text-3xl text-[#f97316]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Alexis AI Assistant
                                </h3>
                                <p className="text-[#D1D5DB] leading-relaxed">
                                    Our AI analyzes your academic history to provide
                                    personalized recommendations and instant query
                                    support.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-15 sm:py-20 relative z-10 px-4 sm:px-6 md:px-12 ">
                <div className="container mx-auto text-center">
                    <h2 className="text-2xl sm:text-5xl font-bold mb-6 text-white ">
                        Ready to crush your course selection?
                    </h2>
                    <p className="text-[#D1D5DB] text-base sm:text-lg max-w-2xl mx-auto mb-8">
                        Join thousands of Cal State Fullerton students who are already
                        using CourseHero to plan their academic journey.
                    </p>
                    <button
                        onClick={() => router.push('/details')}
                        className="cursor-pointer relative px-8 py-4 bg-gradient-to-r from-[#FF7A21] to-[#FF8C3F] text-white font-bold rounded-full hover:opacity-90 transition-all animate-pulse-border"
                        onMouseEnter={() => setImageSrc('/robothappy.png')}
                        onMouseLeave={() => setImageSrc('/robotnormal.png')}
                    >
                        Get Started Today
                    </button>
                    <div className="relative flex justify-center z-10 mt-8 mb-1 sm:mb-9 mirror">
                        <Image
                            src={imageSrc}
                            alt="Mr. Roboto"
                            width={250}
                            height={250}
                            className="cursor-pointer object-cover"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function TypewriterEffect({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (isComplete) return;

        const timeout = setTimeout(() => {
            if (currentIndex <= text.length) {
                setDisplayText(text.substring(0, currentIndex));
                setCurrentIndex(currentIndex + 1);

                if (currentIndex === text.length) {
                    setIsComplete(true);
                }
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [currentIndex, text, isComplete]);

    return (
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
            {displayText}
            {!isComplete && <span className="animate-pulse">|</span>}
        </h2>
    );
}
