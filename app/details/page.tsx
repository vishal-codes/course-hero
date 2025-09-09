'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import dynamic from 'next/dynamic';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const StarsCanvas = dynamic(() => import('@/components/StarsCanvas'), {
  ssr: false,
});

export default function CourseDetailsForm() {
  const router = useRouter();

  const [dataMap, setDataMap] = useState<Record<string, string[]>>({});
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // NEW: allow-list check
  const isAllowedDepartment = (name: string) => {
    const n = name.trim().toLowerCase();
    return n === 'computer science' || n === 'computer engineering';
  };

  useEffect(() => {
    fetch('/departments_courses.json')
      .then((res) => res.json())
      .then((data) => {
        setDataMap(data);
        setFilteredDepartments(Object.keys(data));
      });
  }, []);

  useEffect(() => {
    if (!department.trim()) {
      setFilteredDepartments(Object.keys(dataMap));
    } else {
      setFilteredDepartments(
        Object.keys(dataMap).filter((dept) =>
          dept.toLowerCase().includes(department.toLowerCase())
        )
      );
    }
  }, [department, dataMap]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !course) return;

    // NEW: guard on submit
    if (!isAllowedDepartment(department)) {
      alert('Only Computer Science and Computer Engineering are available for now.');
      return;
    }

    router.push(
      `/prof?dept=${encodeURIComponent(department)}&course=${encodeURIComponent(course)}`
    );
  };

  return (
    <>
      <StarsCanvas show={true} />
      <IoArrowBackCircleSharp
        className="absolute m-5 text-4xl text-[#f97316] cursor-pointer"
        onClick={() => router.push(`/`)}
      />
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-[#1e1e1e] border-none shadow-lg">
          <CardContent className="space-y-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div>
                <Label htmlFor="department" className="text-white mb-2 block">
                  Department
                </Label>
                <Input
                  id="department"
                  placeholder="Search department (e.g., Computer Science)"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setShowDropdown(true);
                    setCourse('');
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="bg-[#2a2a2a] border-none text-white placeholder-gray-400"
                />

                {/* Optional inline note for clarity */}
                {department && !isAllowedDepartment(department) && (
                  <p className="mt-1 text-sm text-red-400">
                    Only Computer Science and Computer Engineering are available for now.
                  </p>
                )}

                {showDropdown && filteredDepartments.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-md bg-[#2a2a2a] text-white border border-gray-700 shadow-lg">
                    {filteredDepartments.map((dept) => (
                      <li
                        key={dept}
                        onClick={() => {
                          // NEW: guard on selection
                          if (!isAllowedDepartment(dept)) {
                            alert('Only Computer Science and Computer Engineering are available for now.');
                            setDepartment('');
                            setShowDropdown(false);
                            return;
                          }
                          setDepartment(dept);
                          setShowDropdown(false);
                          setCourse('');
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-[#3a3a3a]"
                      >
                        {dept}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <Label htmlFor="course" className="text-white mb-2 block">
                  Course
                </Label>
                <Select
                  value={course}
                  onValueChange={(v) => setCourse(v)}
                  disabled={!department || !isAllowedDepartment(department)}
                >
                  <SelectTrigger className="w-full bg-[#2a2a2a] text-white border-none rounded-lg disabled:opacity-50">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a2a] text-white border-none z-50">
                    {dataMap[department]?.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="cursor-pointer w-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 text-white text-md font-semibold hover:opacity-90"
              >
                Search Professors
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
