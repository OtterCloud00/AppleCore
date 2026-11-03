import catalogData from "@/data/catalog.json";

export type LessonType = "video" | "pdf" | "file" | "link";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  src?: string;
  links?: Array<{ title: string; url: string }>;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  modules: Module[];
}

export const courses = (catalogData as { courses: Course[] }).courses;

export interface LessonEntry {
  course: Course;
  module: Module;
  lesson: Lesson;
}


export function flattenLessons(course: Course): LessonEntry[] {
  return course.modules.flatMap((m) => m.lessons.map((lesson) => ({ course, module: m, lesson })));
}


export function flattenAll(): LessonEntry[] {
  return courses.flatMap(flattenLessons);
}

export const TYPE_LABELS: Record<LessonType, string> = {
  video: "video",
  pdf: "pdf",
  file: "file",
  link: "link",
};
