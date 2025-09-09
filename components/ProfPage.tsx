'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import StarsCanvas from '@/components/StarsCanvas';

interface ProfessorData {
    Course: string;
    'First Last': string;
    Difficulty: number;
    'Course Name': string;
    Department: string;
    'Avg GPA': number;
    [key: string]: unknown;
}

export default function ProfPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dept = searchParams.get('dept');
    const course = searchParams.get('course');

    const [professors, setProfessors] = useState<ProfessorData[]>([]);
    const [sorted, setSorted] = useState<ProfessorData[]>([]);
    const [sortType, setSortType] = useState<'easy' | 'hard' | null>(null);
    const [courseName, setCourseName] = useState<string>('');

    useEffect(() => {
        if (!dept || !course) return;

        fetch('/csuf_course_professor_merged.json')
            .then((res) => res.json())
            .then((data: ProfessorData[]) => {
                const matches = data
                    .filter((p) =>
                        p.Course.toUpperCase().trim().endsWith(course!.toUpperCase())
                    )
                    .map((p) => ({
                        ...p,
                        Difficulty:
                            p.Difficulty === null
                                ? Math.round((Math.random() + 2) * 100) / 100
                                : p.Difficulty,
                    }));

                setProfessors(matches);
                setSorted(matches);

                // Pull course name from first matching entry
                if (matches.length > 0) {
                    setCourseName(matches[0]['Course Name'] ?? '');
                }
            });
    }, [dept, course]);

    useEffect(() => {
        if (sortType === 'easy') {
            // Less Difficulty = easier
            setSorted([...professors].sort((a, b) => a.Difficulty - b.Difficulty));
        } else if (sortType === 'hard') {
            // More Difficulty = harder
            setSorted([...professors].sort((a, b) => b.Difficulty - a.Difficulty));
        } else {
            setSorted(professors);
        }
    }, [sortType, professors]);

    const getInitials = (fullName: string): string => {
        const parts = fullName.trim().split(' ');
        if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '';
        return (
            (parts[0][0] ?? '').toUpperCase() +
            (parts[parts.length - 1][0] ?? '').toUpperCase()
        );
    };

    return (
        <>
            <StarsCanvas show={true} />
            <IoArrowBackCircleSharp
                className="absolute m-5 text-4xl text-[#f97316] cursor-pointer"
                onClick={() => router.push(`/details`)}
            />
            <div className="min-h-screen  text-white p-6 max-w-screen-xl mx-auto">
                <h1 className="text-2xl font-bold mb-2">
                    Course: <span className="text-orange-400">{`CPSC ${course}`}</span>
                </h1>
                <h2 className="text-lg text-gray-300 mb-6 italic">
                    {courseName} ({dept})
                </h2>

                <div className="flex flex-wrap gap-4 mb-8">
                    <Button
                        className="bg-green-600 hover:bg-green-700 text-white rounded-2xl"
                        onClick={() => setSortType('easy')}
                    >
                        😊 Sort by Easy
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white rounded-2xl"
                        onClick={() => setSortType('hard')}
                    >
                        🔥 Sort by Hard
                    </Button>
                    <Button
                        className="bg-gray-700 hover:bg-gray-600 text-white"
                        onClick={() => setSortType(null)}
                    >
                        🌀 Reset
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sorted.map((prof, idx) => {
                        const name = prof['First Last'];

                        return (
                            <Card
                                key={idx}
                                className="cursor-pointer aspect-square transition-all duration-300 hover:scale-105"
                                style={{
                                    background:
                                        'linear-gradient(to top, rgba(255,255,255,0.06), rgba(0,0,0,0.9))',
                                    boxShadow: '0 0 0 rgba(255, 140, 0, 0)',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #333',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow =
                                        '0 0 30px rgba(255, 140, 0, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow =
                                        '0 0 0 rgba(255, 140, 0, 0)';
                                }}
                                onClick={() =>
                                    router.push(
                                        `/dashboard?dept=${encodeURIComponent(
                                            dept!
                                        )}&course=${encodeURIComponent(
                                            course!
                                        )}&prof=${encodeURIComponent(name)}`
                                    )
                                }
                            >
                                <CardContent className="group p-4 flex flex-col items-center justify-center h-full gap-3 text-center">
                                    {/* Avatar */}
                                    <div
                                        className="w-20 h-20 rounded-full bg-[#0f0f1a] border border-orange-400 shadow-[0_0_10px_rgba(255,165,0,0.5)] 
             flex items-center justify-center text-orange-400 text-2xl font-bold shrink-0"
                                        style={{ aspectRatio: 1 }}
                                    >
                                        {getInitials(name)}
                                    </div>
                                    {/* Name */}
                                    <h3 className="text-lg font-semibold text-orange-400">
                                        {name}{' '}
                                    </h3>
                                    <div className="w-20 h-[4px] bg-orange-400 rounded-full mt-2 mb-3 z-10 relative shadow-[0_0_10px_rgba(255,165,0,0.6)]"></div>

                                    {/* Difficulty Meter */}
                                    <div className="flex flex-col items-center gap-1 mt-2">
                                        <div className="relative w-20 h-20">
                                            <svg
                                                className="w-full h-full rotate-[-90deg]"
                                                viewBox="0 0 36 36"
                                            >
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="16"
                                                    stroke="#333"
                                                    strokeWidth="3"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="18"
                                                    cy="18"
                                                    r="16"
                                                    stroke="#f97316"
                                                    strokeWidth="3"
                                                    fill="none"
                                                    strokeDasharray={`${
                                                        (prof.Difficulty ?? 2) * 20
                                                    }, 100`}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-orange-400 font-bold text-xl">
                                                {(prof.Difficulty ?? 2).toFixed(1)}
                                                <span className="text-xs text-gray-400">
                                                    / 5
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Difficulty
                                        </p>
                                    </div>

                                    {/* GPA Bar */}
                                    <div className="w-full mt-4">
                                        <p className="text-sm text-gray-400 mb-1">
                                            Average GPA
                                        </p>

                                        {/* GPA Bar */}
                                        <div className="relative bg-gray-700 rounded-full h-3">
                                            {/* Filled Bar */}
                                            <div
                                                className="bg-orange-400 h-3 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${
                                                        (prof['Avg GPA'] / 4.0) * 100
                                                    }%`,
                                                }}
                                            ></div>

                                            {/* GPA Dot with tooltip */}
                                            <div
                                                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-orange-400 rounded-full shadow cursor-help"
                                                title={`Avg GPA: ${prof[
                                                    'Avg GPA'
                                                ].toFixed(2)}`}
                                                style={{
                                                    left: `calc(${
                                                        (prof['Avg GPA'] / 4.0) * 100
                                                    }% - 0.5rem)`,
                                                    zIndex: 10,
                                                }}
                                            ></div>
                                        </div>

                                        {/* Number Labels */}
                                        <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                                            <span>0</span>
                                            <span>1</span>
                                            <span>2</span>
                                            <span>3</span>
                                            <span>4</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
