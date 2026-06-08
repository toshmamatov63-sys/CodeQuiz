export type Lang = "uz" | "en";
export type Track = "frontend" | "backend";
export type LangKey = "html" | "css" | "javascript" | "python" | "cpp";

export interface Question {
  id: string;
  language: LangKey;
  topic: string;
  question: { uz: string; en: string };
  options: { uz: string[]; en: string[] };
  correctIndex: number;
}

export const TRACKS = {
  frontend: { uz: "Frontend Dasturlash", en: "Frontend Development" },
  backend: { uz: "Backend Dasturlash", en: "Backend Development" },
} as const;

export const LANGUAGES: Record<Track, { key: LangKey; uz: string; en: string; icon: string }[]> = {
  frontend: [
    { key: "html", uz: "HTML", en: "HTML", icon: "🌐" },
    { key: "css", uz: "CSS", en: "CSS", icon: "🎨" },
    { key: "javascript", uz: "JavaScript", en: "JavaScript", icon: "⚡" },
  ],
  backend: [
    { key: "python", uz: "Python", en: "Python", icon: "🐍" },
    { key: "cpp", uz: "C++", en: "C++", icon: "⚙️" },
  ],
};

export const TOPICS: Record<LangKey, { key: string; uz: string; en: string }[]> = {
  html: [
    { key: "intro", uz: "Kirish va Tuzilma", en: "Introduction & Structure" },
    { key: "semantic", uz: "Semantik Elementlar", en: "Semantic Elements" },
    { key: "forms", uz: "Formalar va Validatsiya", en: "Forms & Validations" },
    { key: "media", uz: "Multimedia (Audio/Video)", en: "Multimedia (Audio/Video)" },
    { key: "seo", uz: "SEO va Meta Teglar", en: "SEO & Meta Tags" },
    { key: "apis", uz: "HTML5 API'lari", en: "HTML5 APIs" },
  ],
  css: [
    { key: "selectors", uz: "Selektorlar va Spetsifiklik", en: "Selectors & Specificity" },
    { key: "boxmodel", uz: "Box Model", en: "Box Model" },
    { key: "flexbox", uz: "Flexbox", en: "Flexbox" },
    { key: "grid", uz: "CSS Grid", en: "CSS Grid" },
    { key: "animations", uz: "Animatsiyalar va O'tishlar", en: "Transitions & Animations" },
    { key: "responsive", uz: "Responsiv Dizayn", en: "Responsive Design" },
    { key: "typography", uz: "Tipografiya va Ranglar", en: "Typography & Colors" },
  ],
  javascript: [
    { key: "variables", uz: "O'zgaruvchilar va Ma'lumot Turlari", en: "Variables & Data Types" },
    { key: "operators", uz: "Operatorlar va Shartlar", en: "Operators & Conditions" },
    { key: "loops", uz: "Sikllar va Funksiyalar", en: "Loops & Functions" },
    { key: "scope", uz: "Scope va Closures", en: "Scope & Closures" },
    { key: "dom", uz: "DOM va Hodisalar", en: "DOM Manipulation & Events" },
    { key: "arrays", uz: "Massiv Metodlari", en: "Array Methods" },
    { key: "async", uz: "Async JS (Promise, async/await)", en: "Async JS (Promises, async/await)" },
    { key: "es6", uz: "ES6+ Xususiyatlari", en: "ES6+ Features" },
  ],
  python: [
    { key: "syntax", uz: "Sintaksis va Ma'lumot Turlari", en: "Syntax & Data Types" },
    { key: "control", uz: "Boshqaruv Oqimi va Sikllar", en: "Control Flow & Loops" },
    { key: "functions", uz: "Funksiyalar va Lambda", en: "Functions & Lambda" },
    { key: "collections", uz: "Lists/Tuples/Dictionaries", en: "Lists/Tuples/Dictionaries" },
    { key: "oop", uz: "OOP (Sinflar, Meros)", en: "OOP (Classes, Inheritance)" },
    { key: "files", uz: "Fayllar bilan Ishlash", en: "File Handling" },
    { key: "exceptions", uz: "Xatoliklar (try/except)", en: "Exception Handling" },
    { key: "modules", uz: "Modullar va Paketlar", en: "Modules & Packages" },
  ],
  cpp: [
    { key: "basic", uz: "Asosiy Sintaksis va I/O", en: "Basic Syntax & I/O" },
    { key: "types", uz: "Ma'lumot Turlari va Operatorlar", en: "Data Types & Operators" },
    { key: "control", uz: "Boshqaruv Tuzilmalari", en: "Control Structures" },
    { key: "functions", uz: "Funksiyalar va Scope", en: "Functions & Scope" },
    { key: "arrays", uz: "Massivlar va Satrlar", en: "Arrays & Strings" },
    { key: "pointers", uz: "Ko'rsatkichlar va Xotira", en: "Pointers & Memory" },
    { key: "oop", uz: "OOP (Sinflar va Obyektlar)", en: "OOP (Classes & Objects)" },
    { key: "stl", uz: "Vektorlar va STL", en: "Vectors & STL" },
  ],
};
