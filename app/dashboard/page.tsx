'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import courseData from '@/public/csuf_course_professor_merged.json';
import AlexisChat from '@/components/AlexisChat';
import { RiChatAiFill } from 'react-icons/ri';

type CourseData = {
    'First Last': string;
    Course: string;
    'Course Name': string;
    Description: string;
    Prerequisite: string | null;
    'Avg GPA': number;
    Difficulty: number | null;
    'Would Take Again %': number;
    Units: string;
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
};

const StarsCanvas = dynamic(() => import('@/components/StarsCanvas'), {
    ssr: false,
});

function DashboardPageContent() {
    const [chatOpen, setChatOpen] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const course = searchParams.get('course') || '';
    const dept = searchParams.get('dept') || '';
    const prof = searchParams.get('prof') || '';

    const [data, setData] = useState<CourseData | null>(null);
    const [showPrereq, setShowPrereq] = useState(false);

    useEffect(() => {
        const entry = courseData.find(
            (item) =>
                item.Course.toLowerCase().includes(course.toLowerCase()) &&
                item['First Last'].toLowerCase() === prof.toLowerCase()
        ) as CourseData | undefined;

        if (entry) setData(entry);
    }, [course, prof]);

    const gradeData = data
        ? [
              { grade: 'A', count: data.A || 0 },
              { grade: 'B', count: data.B || 0 },
              { grade: 'C', count: data.C || 0 },
              { grade: 'D', count: data.D || 0 },
              { grade: 'F', count: data.F || 0 },
          ]
        : [];

    const total = gradeData.reduce((sum, g) => sum + g.count, 0);

    if (!data)
        return (
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
        );

    return (
        <div className="min-h-screen  text-white px-6 py-10 relative">
            <StarsCanvas show={true} />
            {/* Hover and Gradient Styles */}
            <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: scale(1.03);
        box-shadow: 0 0 20px 5px rgba(255, 140, 0, 0.3);

        }
        .gradient-name {
          background: linear-gradient(to right, #fb923c, #facc15);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: pulse 2s infinite ease-in-out;
        }
.glow-box {
  background: linear-gradient(270deg, #fb923c, #facc15, #fb923c);
  background-size: 400% 400%;
  animation: pulse-glow 5s ease infinite;
  color: #1e1e1e;
  border-radius: 0.75rem;
  text-align: center;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(255, 165, 0, 0.2);
}

@keyframes pulse-glow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

        .toggle-switch {
          background-color: #333;
          border-radius: 20px;
          padding: 4px;
          display: flex;
          gap: 4px;
        }
        .toggle-option {
          padding: 6px 12px;
          border-radius: 14px;
          font-size: 14px;
          cursor: pointer;
        }
        .toggle-active {
          background: linear-gradient(to right, #fb923c, #facc15);
          color: black;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .shimmer-bg {
  position: relative;
  overflow: hidden;
  background: linear-gradient(to right, #fb923c, #facc15);
  color: #1e1e1e;
  border-radius: 0.75rem;
  text-align: center;
  padding: 1.5rem;
  box-shadow: 0 0 30px rgba(255, 165, 0, 0.3);
}

.shimmer-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: shimmer 2.5s infinite;
  z-index: 0;
}


@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.card-glow {
  background: linear-gradient(to top, rgba(255, 255, 255, 0.08), rgba(30, 30, 30, 1));
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 165, 0, 0.08);
}
.card-glow:hover {
  transform: scale(1.03);
  box-shadow: 0 0 40px rgba(255, 165, 0, 0.25);
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-in-out;
}

      `}</style>

            {/* Back Button */}

            <IoArrowBackCircleSharp
                className="absolute text-4xl text-[#f97316] cursor-pointer"
                onClick={() => router.push(`/prof?dept=${dept}&course=${course}`)}
            />

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                {/* Professor */}
                <div
                    className="rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.8))',
                        boxShadow: '0 0 0 rgba(255, 140, 0, 0)', // no glow initially
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            '0 0 30px rgba(255, 140, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 140, 0, 0)';
                    }}
                >
                    <p className="text-sm text-gray-400">Professor</p>
                    <p className="text-2xl font-bold gradient-name">{prof}</p>
                </div>

                {/* Course Info */}
                <div className="glow-box col-span-3">
                    <div className="text-4xl font-black">{data.Course}</div>
                    <div className="text-lg font-semibold mt-2">
                        {data['Course Name']}
                    </div>
                </div>

                {/* Units */}
                <div
                    className="rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.8))',
                        boxShadow: '0 0 0 rgba(255, 140, 0, 0)', // no glow initially
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            '0 0 30px rgba(255, 140, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 140, 0, 0)';
                    }}
                >
                    <p className="text-sm text-gray-400">Credits</p>
                    <p className="text-5xl font-bold text-orange-400">{data.Units}</p>
                </div>

                {/* GPA */}
                <div
                    className="rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.8))',
                        boxShadow: '0 0 0 rgba(255, 140, 0, 0)', // no glow initially
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            '0 0 30px rgba(255, 140, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 140, 0, 0)';
                    }}
                >
                    <p className="text-sm text-gray-400">Average GPA</p>
                    <p className="text-5xl font-bold text-orange-400">
                        {data['Avg GPA'].toFixed(2)}
                    </p>
                </div>

                {/* Grade Distribution */}
                <div
                    className="rounded-xl p-6 col-span-3 text-center transition-all duration-300 hover:scale-105"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(255,255,255,0.06), rgba(0,0,0,0.8))',
                        boxShadow: '0 0 0 rgba(255, 140, 0, 0)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            '0 0 30px rgba(255, 140, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 140, 0, 0)';
                    }}
                >
                    <div className="text-sm text-gray-400 mb-4">Grade Distribution</div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gradeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="grade" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e1e1e',
                                        border: 'none',
                                    }}
                                    labelStyle={{ color: 'orange' }}
                                    itemStyle={{ color: 'white' }}
                                />
                                <Bar dataKey="count">
                                    {gradeData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill="#f97316"
                                            stroke="#facc15"
                                            strokeWidth={1}
                                            cursor="pointer"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Difficulty */}
                <div
                    className="rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.8))',
                        boxShadow: '0 0 0 rgba(255, 140, 0, 0)', // no glow initially
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            '0 0 30px rgba(255, 140, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 140, 0, 0)';
                    }}
                >
                    <p className="text-sm text-gray-400">Difficulty</p>
                    <p className="text-5xl font-bold text-orange-400">
                        {data.Difficulty?.toFixed(1) || '2.0'}
                    </p>
                    <p className="text-s text-gray-500 mt-1">out of 5</p>
                </div>

                {/* Would Take Again */}
                <div
                    className="rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.8))',
                        boxShadow: '0 0 0 rgba(255, 140, 0, 0)', // no glow initially
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            '0 0 30px rgba(255, 140, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 140, 0, 0)';
                    }}
                >
                    <p className="text-sm text-gray-400">Would Take Again</p>
                    <p className="text-5xl font-bold text-orange-400">
                        {data['Would Take Again %']?.toFixed(0)}%
                    </p>
                </div>

                {/* Description / Prerequisite Toggle */}
                <div
                    className="rounded-xl p-6 col-span-2 md:col-span-3 transition-all duration-300 hover:scale-105"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(255,255,255,0.06), rgba(0,0,0,0.8))',
                        boxShadow: '0 0 0 rgba(255, 140, 0, 0)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            '0 0 30px rgba(255, 140, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 140, 0, 0)';
                    }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-400">Details</div>
                        <div className="toggle-switch">
                            <div
                                onClick={() => setShowPrereq(false)}
                                className={`toggle-option ${
                                    !showPrereq ? 'toggle-active' : 'text-white'
                                }`}
                            >
                                Description
                            </div>
                            <div
                                onClick={() => setShowPrereq(true)}
                                className={`toggle-option ${
                                    showPrereq ? 'toggle-active' : 'text-white'
                                }`}
                            >
                                Prerequisite
                            </div>
                        </div>
                    </div>
                    <div
                        className="text-lg text-gray-100 mt-4 transition-all duration-500 ease-in-out animate-fade-in"
                        key={showPrereq ? 'prereq' : 'desc'}
                    >
                        {showPrereq
                            ? data.Prerequisite ||
                              'No prerequisites required for this course.'
                            : data.Description}
                    </div>
                </div>

                {/* Total Students */}
                <div
                    className="rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.8))',
                        boxShadow: '0 0 0 rgba(255, 140, 0, 0)', // no glow initially
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                            '0 0 30px rgba(255, 140, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 140, 0, 0)';
                    }}
                >
                    <p className="text-sm text-gray-400">Total Students</p>
                    <p className="text-5xl font-bold text-orange-400">{total}</p>
                </div>
            </div>

            {/* Chatbot Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => setChatOpen(true)}
                    className="cursor-pointer bg-gradient-to-r from-orange-500 to-yellow-400 px-6 py-3 rounded-full font-semibold shadow-lg text-black hover:opacity-90"
                >
                    <span className="flex items-center gap-2">
                        <RiChatAiFill className="text-2xl text-#0f0052" /> {''} Ask Alexis
                    </span>
                </button>
            </div>

            {/* Conditionally show Alexis Chat */}
            {chatOpen && <AlexisChat onClose={() => setChatOpen(false)} />}
        </div>
    );
}

export default function DashboardPage() {
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
            <DashboardPageContent />
        </Suspense>
    );
}
