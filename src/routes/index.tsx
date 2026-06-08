import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Languages, ArrowLeft, RotateCcw, Trophy, Code2, Server, CheckCircle2, XCircle } from "lucide-react";
import { TRACKS, LANGUAGES, TOPICS, type Lang, type Track, type LangKey } from "@/data/topics";
import { getQuestionsForTopic, availableCount } from "@/data/questions";
import type { Question } from "@/data/topics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeQuiz — Kodlash Bo'yicha Test / Multilingual Coding Quiz" },
      { name: "description", content: "Bilingual (Uzbek/English) coding quiz across HTML, CSS, JavaScript, Python and C++." },
    ],
  }),
  component: QuizApp,
});

type Stage =
  | { kind: "track" }
  | { kind: "language"; track: Track }
  | { kind: "topic"; track: Track; lang: LangKey }
  | { kind: "config"; track: Track; lang: LangKey; topic: string }
  | { kind: "quiz"; track: Track; lang: LangKey; topic: string; questions: Question[]; index: number; answers: number[]; selected: number | null }
  | { kind: "results"; track: Track; lang: LangKey; topic: string; questions: Question[]; answers: number[] };

const T = {
  appTitle: { uz: "CodeQuiz", en: "CodeQuiz" },
  tagline: { uz: "Kodlash bo'yicha bilingval test", en: "Bilingual Coding Quiz" },
  chooseTrack: { uz: "Yo'nalishni tanlang", en: "Choose a track" },
  chooseLanguage: { uz: "Tilni tanlang", en: "Choose a language" },
  chooseTopic: { uz: "Mavzuni tanlang", en: "Choose a topic" },
  chooseCount: { uz: "Savollar soni", en: "Number of questions" },
  available: { uz: "Mavjud", en: "Available" },
  start: { uz: "Boshlash", en: "Start Quiz" },
  back: { uz: "Orqaga", en: "Back" },
  next: { uz: "Keyingi", en: "Next" },
  finish: { uz: "Yakunlash", en: "Finish" },
  question: { uz: "Savol", en: "Question" },
  correct: { uz: "To'g'ri", en: "Correct" },
  results: { uz: "Natijalar", en: "Results" },
  score: { uz: "Ball", en: "Score" },
  correctCount: { uz: "To'g'ri javoblar", en: "Correct answers" },
  incorrectCount: { uz: "Noto'g'ri javoblar", en: "Incorrect answers" },
  retry: { uz: "Qaytadan", en: "Retry" },
  newTopic: { uz: "Yangi mavzu", en: "New topic" },
  home: { uz: "Bosh sahifa", en: "Home" },
  questions: { uz: "savol", en: "questions" },
};

function QuizApp() {
  const [lang, setLang] = useState<Lang>("uz");
  const [stage, setStage] = useState<Stage>({ kind: "track" });

  const t = (k: keyof typeof T) => T[k][lang];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <button
            onClick={() => setStage({ kind: "track" })}
            className="flex items-center gap-2 text-lg font-bold text-primary transition hover:opacity-80"
          >
            <Code2 className="h-6 w-6" />
            <span>{T.appTitle[lang]}</span>
            <span className="hidden text-xs font-normal text-muted-foreground sm:inline">· {T.tagline[lang]}</span>
          </button>
          <button
            onClick={() => setLang(lang === "uz" ? "en" : "uz")}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition hover:border-primary hover:bg-secondary"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            <span>{lang === "uz" ? "🇺🇿 O'zbekcha" : "🇬🇧 English"}</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {stage.kind === "track" && <TrackStep lang={lang} t={t} onPick={(track) => setStage({ kind: "language", track })} />}
        {stage.kind === "language" && (
          <LanguageStep
            lang={lang}
            t={t}
            track={stage.track}
            onBack={() => setStage({ kind: "track" })}
            onPick={(l) => setStage({ kind: "topic", track: stage.track, lang: l })}
          />
        )}
        {stage.kind === "topic" && (
          <TopicStep
            lang={lang}
            t={t}
            track={stage.track}
            langKey={stage.lang}
            onBack={() => setStage({ kind: "language", track: stage.track })}
            onPick={(topic) => setStage({ kind: "config", track: stage.track, lang: stage.lang, topic })}
          />
        )}
        {stage.kind === "config" && (
          <ConfigStep
            lang={lang}
            t={t}
            langKey={stage.lang}
            topic={stage.topic}
            onBack={() => setStage({ kind: "topic", track: stage.track, lang: stage.lang })}
            onStart={(count) => {
              const questions = getQuestionsForTopic(stage.lang, stage.topic, count);
              setStage({ kind: "quiz", track: stage.track, lang: stage.lang, topic: stage.topic, questions, index: 0, answers: [], selected: null });
            }}
          />
        )}
        {stage.kind === "quiz" && (
          <QuizStep
            lang={lang}
            t={t}
            stage={stage}
            onAnswer={(sel) => setStage({ ...stage, selected: sel })}
            onNext={() => {
              const newAnswers = [...stage.answers, stage.selected!];
              if (stage.index + 1 >= stage.questions.length) {
                setStage({ kind: "results", track: stage.track, lang: stage.lang, topic: stage.topic, questions: stage.questions, answers: newAnswers });
              } else {
                setStage({ ...stage, index: stage.index + 1, answers: newAnswers, selected: null });
              }
            }}
          />
        )}
        {stage.kind === "results" && (
          <ResultsStep
            lang={lang}
            t={t}
            stage={stage}
            onRetry={() => {
              const questions = getQuestionsForTopic(stage.lang, stage.topic, stage.questions.length);
              setStage({ kind: "quiz", track: stage.track, lang: stage.lang, topic: stage.topic, questions, index: 0, answers: [], selected: null });
            }}
            onNewTopic={() => setStage({ kind: "topic", track: stage.track, lang: stage.lang })}
            onHome={() => setStage({ kind: "track" })}
          />
        )}
      </div>
    </main>
  );
}

function StepHeader({ title, onBack, backLabel }: { title: string; onBack?: () => void; backLabel?: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm transition hover:border-primary hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      )}
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
    </div>
  );
}

function TrackStep({ lang, t, onPick }: { lang: Lang; t: (k: keyof typeof T) => string; onPick: (tr: Track) => void }) {
  const items: { key: Track; icon: typeof Code2; label: string }[] = [
    { key: "frontend", icon: Code2, label: TRACKS.frontend[lang] },
    { key: "backend", icon: Server, label: TRACKS.backend[lang] },
  ];
  return (
    <div>
      <StepHeader title={t("chooseTrack")} />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => onPick(key)}
            className="group rounded-2xl border border-border bg-card p-8 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-semibold">{label}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}

function LanguageStep({ lang, t, track, onBack, onPick }: { lang: Lang; t: (k: keyof typeof T) => string; track: Track; onBack: () => void; onPick: (l: LangKey) => void }) {
  const options = LANGUAGES[track];
  return (
    <div>
      <StepHeader title={t("chooseLanguage")} onBack={onBack} backLabel={t("back")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => onPick(o.key)}
            className="rounded-2xl border border-border bg-card p-6 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          >
            <div className="mb-3 text-4xl">{o.icon}</div>
            <h3 className="text-xl font-semibold">{o[lang]}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{TOPICS[o.key].length} {lang === "uz" ? "mavzu" : "topics"}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopicStep({ lang, t, langKey, onBack, onPick }: { lang: Lang; t: (k: keyof typeof T) => string; track: Track; langKey: LangKey; onBack: () => void; onPick: (topic: string) => void }) {
  const topics = TOPICS[langKey];
  return (
    <div>
      <StepHeader title={t("chooseTopic")} onBack={onBack} backLabel={t("back")} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((tp) => {
          const count = availableCount(langKey, tp.key);
          return (
            <button
              key={tp.key}
              onClick={() => onPick(tp.key)}
              className="flex flex-col rounded-xl border border-border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md hover:shadow-primary/10"
            >
              <h3 className="font-semibold">{tp[lang]}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{count} {t("questions")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConfigStep({ lang, t, langKey, topic, onBack, onStart }: { lang: Lang; t: (k: keyof typeof T) => string; langKey: LangKey; topic: string; onBack: () => void; onStart: (n: number) => void }) {
  const max = availableCount(langKey, topic);
  const topicMeta = TOPICS[langKey].find((x) => x.key === topic)!;
  const choices = [10, 20, 30];
  return (
    <div>
      <StepHeader title={topicMeta[lang]} onBack={onBack} backLabel={t("back")} />
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-2 text-xl font-semibold">{t("chooseCount")}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{t("available")}: {max} {t("questions")}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {choices.map((c) => {
            const actual = Math.min(c, max);
            return (
              <button
                key={c}
                onClick={() => onStart(c)}
                className="rounded-xl border border-border bg-secondary p-6 text-center transition hover:-translate-y-1 hover:border-primary hover:bg-primary/15"
              >
                <div className="text-4xl font-bold text-primary">{actual}</div>
                <div className="mt-1 text-sm text-muted-foreground">{t("questions")}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuizStep({
  lang, t, stage, onAnswer, onNext,
}: {
  lang: Lang;
  t: (k: keyof typeof T) => string;
  stage: Extract<Stage, { kind: "quiz" }>;
  onAnswer: (i: number) => void;
  onNext: () => void;
}) {
  const q = stage.questions[stage.index];
  const correctSoFar = useMemo(
    () => stage.answers.filter((a, i) => a === stage.questions[i].correctIndex).length,
    [stage.answers, stage.questions],
  );
  const isAnswered = stage.selected !== null;
  const progress = ((stage.index + (isAnswered ? 1 : 0)) / stage.questions.length) * 100;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="font-medium">
          {t("question")}: {stage.index + 1}/{stage.questions.length} · {t("correct")}: {correctSoFar}
        </div>
      </div>
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="mb-6 text-xl font-semibold sm:text-2xl">{q.question[lang]}</h2>
        <div className="grid gap-3">
          {q.options[lang].map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = stage.selected === i;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;
            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => onAnswer(i)}
                className={cn(
                  "rounded-xl border-2 border-border bg-secondary px-5 py-4 text-left font-medium transition",
                  !isAnswered && "hover:border-primary hover:bg-primary/10 cursor-pointer",
                  showCorrect && "border-success bg-success/20 text-foreground",
                  showWrong && "border-destructive bg-destructive/20 text-foreground",
                  isAnswered && !showCorrect && !showWrong && "opacity-60",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span>{opt}</span>
                  {showCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />}
                  {showWrong && <XCircle className="h-5 w-5 shrink-0 text-destructive" />}
                </span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <button
            onClick={onNext}
            className="mt-6 w-full rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 sm:w-auto sm:px-8"
          >
            {stage.index + 1 >= stage.questions.length ? t("finish") : t("next")} →
          </button>
        )}
      </div>
    </div>
  );
}

function ResultsStep({
  lang, t, stage, onRetry, onNewTopic, onHome,
}: {
  lang: Lang;
  t: (k: keyof typeof T) => string;
  stage: Extract<Stage, { kind: "results" }>;
  onRetry: () => void;
  onNewTopic: () => void;
  onHome: () => void;
}) {
  const total = stage.questions.length;
  const correct = stage.answers.filter((a, i) => a === stage.questions[i].correctIndex).length;
  const incorrect = total - correct;
  const pct = Math.round((correct / total) * 100);
  const tier = pct >= 80 ? "success" : pct >= 50 ? "primary" : "destructive";
  const tierMsg =
    pct >= 80
      ? { uz: "Ajoyib natija!", en: "Excellent work!" }
      : pct >= 50
      ? { uz: "Yaxshi, davom eting!", en: "Nice, keep going!" }
      : { uz: "Mashq qilishda davom eting.", en: "Keep practicing." };

  return (
    <div>
      <StepHeader title={t("results")} />
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className={cn(
          "mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full",
          tier === "success" && "bg-success/20 text-success",
          tier === "primary" && "bg-primary/20 text-primary",
          tier === "destructive" && "bg-destructive/20 text-destructive",
        )}>
          <Trophy className="h-10 w-10" />
        </div>
        <div className="text-6xl font-bold">{pct}%</div>
        <p className="mt-2 text-muted-foreground">{tierMsg[lang]}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-success/30 bg-success/10 p-4">
            <div className="text-sm text-muted-foreground">{t("correctCount")}</div>
            <div className="mt-1 text-3xl font-bold text-success">{correct}</div>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <div className="text-sm text-muted-foreground">{t("incorrectCount")}</div>
            <div className="mt-1 text-3xl font-bold text-destructive">{incorrect}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4" />
            {t("retry")}
          </button>
          <button
            onClick={onNewTopic}
            className="rounded-xl border border-border bg-secondary px-6 py-3 font-semibold transition hover:border-primary"
          >
            {t("newTopic")}
          </button>
          <button
            onClick={onHome}
            className="rounded-xl border border-border bg-secondary px-6 py-3 font-semibold transition hover:border-primary"
          >
            {t("home")}
          </button>
        </div>
      </div>
    </div>
  );
}
