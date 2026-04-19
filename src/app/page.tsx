"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import {
  buildSessionPlan,
  type ChildInput,
  type DifficultyLevel,
  type SessionPlan,
} from "@/lib/session-generator";

type FormState = {
  sessionLength: number;
  difficulty: DifficultyLevel;
  theme: string;
  children: ChildInput[];
};

type SessionHistoryItem = {
  createdAt: string;
  title: string;
  theme: string;
  participants: string;
};

type PersistedSessionState = {
  form: FormState;
  started: boolean;
  currentStepIndex: number;
  scenarioSelections: Record<string, number>;
  notesByStep: Record<string, string>;
  visitedSteps: Record<string, boolean>;
  supportView: "help" | "notes";
};

const STORAGE_KEY = "klokprat-session-v1";
const HISTORY_KEY = "klokprat-history-v1";
const MAX_CHILDREN = 4;

const defaultChildren: ChildInput[] = [
  { name: "Theo", age: 15, temperament: "Tenker fort, liker å virke trygg", focus: "" },
  { name: "Thea", age: 10, temperament: "Følsom, men sier lite først", focus: "" },
];

const defaultState: FormState = {
  sessionLength: 20,
  difficulty: "medium",
  theme: "",
  children: defaultChildren,
};

const durationOptions = [15, 20, 25];
const themeSuggestions = [
  "Sosialt press og tydelige valg",
  "Penger, ærlighet og press",
  "Nett, dømmekraft og omdømme",
  "Vennskap, utenforskap og mobbing",
  "Følelser, sinne og konflikt",
  "Kropp, grenser og samtykke",
  "Endring, familie og skilsmisse",
];

const exampleLines = [
  "Scenario: En venn vil at barnet ditt skal lyve for å dekke over noe som skjedde på skolen.",
  'Spørsmål: "Hva ville du sagt ord for ord?"',
  'Oppfølging: "Hva koster det sosialt å si sannheten her?"',
  'Foreldrehjelp: "Be om ett konkret svar før du ber om forklaringen."',
];

function readStoredSession(): PersistedSessionState | null {
  if (typeof window === "undefined") return null;

  const savedSession = window.localStorage.getItem(STORAGE_KEY);
  if (!savedSession) return null;

  try {
    return JSON.parse(savedSession) as PersistedSessionState;
  } catch {
    return null;
  }
}

function readStoredHistory() {
  if (typeof window === "undefined") return [] as SessionHistoryItem[];

  const savedHistory = window.localStorage.getItem(HISTORY_KEY);
  if (!savedHistory) return [] as SessionHistoryItem[];

  try {
    return JSON.parse(savedHistory) as SessionHistoryItem[];
  } catch {
    return [] as SessionHistoryItem[];
  }
}

export default function Home() {
  const initialSession = readStoredSession();
  const [form, setForm] = useState<FormState>(initialSession?.form ?? defaultState);
  const [started, setStarted] = useState(initialSession?.started ?? false);
  const [currentStepIndex, setCurrentStepIndex] = useState(
    initialSession?.currentStepIndex ?? 0,
  );
  const [copied, setCopied] = useState(false);
  const [scenarioSelections, setScenarioSelections] = useState<Record<string, number>>(
    initialSession?.scenarioSelections ?? {},
  );
  const [notesByStep, setNotesByStep] = useState<Record<string, string>>(
    initialSession?.notesByStep ?? {},
  );
  const [visitedSteps, setVisitedSteps] = useState<Record<string, boolean>>(
    initialSession?.visitedSteps ?? {},
  );
  const [supportView, setSupportView] = useState<"help" | "notes">(
    initialSession?.supportView ?? "help",
  );
  const [history, setHistory] = useState<SessionHistoryItem[]>(readStoredHistory);

  const plan: SessionPlan | null = useMemo(() => {
    if (!started) return null;

    return buildSessionPlan({
      number_of_children: form.children.length,
      children: form.children,
      session_length_minutes: form.sessionLength,
      difficulty_level: form.difficulty,
      theme: form.theme || undefined,
    });
  }, [form, started]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        form,
        started,
        currentStepIndex,
        scenarioSelections,
        notesByStep,
        visitedSteps,
        supportView,
      }),
    );
  }, [
    currentStepIndex,
    form,
    notesByStep,
    scenarioSelections,
    started,
    supportView,
    visitedSteps,
  ]);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  function updateChild(index: number, key: keyof ChildInput, value: string) {
    setForm((current) => ({
      ...current,
      children: current.children.map((child, childIndex) =>
        childIndex === index
          ? {
              ...child,
              [key]: key === "age" ? Number(value) || 0 : value,
            }
          : child,
      ),
    }));
  }

  function addChild() {
    setForm((current) => ({
      ...current,
      children: [
        ...current.children,
        {
          name: `Barn ${current.children.length + 1}`,
          age: 9,
          temperament: "",
          focus: "",
        },
      ],
    }));
  }

  function removeChild(index: number) {
    setForm((current) => {
      if (current.children.length === 1) {
        return current;
      }

      return {
        ...current,
        children: current.children.filter((_, childIndex) => childIndex !== index),
      };
    });
  }

  function createPlan() {
    startTransition(() => {
      const nextPlan = buildSessionPlan({
        number_of_children: form.children.length,
        children: form.children,
        session_length_minutes: form.sessionLength,
        difficulty_level: form.difficulty,
        theme: form.theme || undefined,
      });

      const initialSelections = Object.fromEntries(
        nextPlan.steps
          .filter((step) => step.kind === "scenario")
          .map((step) => [step.id, 0]),
      );
      const initialNotes = Object.fromEntries(nextPlan.steps.map((step) => [step.id, ""]));
      const initialVisited = Object.fromEntries(
        nextPlan.steps.map((step, index) => [step.id, index === 0]),
      );

      setStarted(true);
      setCurrentStepIndex(0);
      setScenarioSelections(initialSelections);
      setNotesByStep(initialNotes);
      setVisitedSteps(initialVisited);
      setSupportView("help");
      setHistory((current) => [
        {
          createdAt: new Date().toLocaleDateString("no-NO"),
          title: nextPlan.title,
          theme: nextPlan.theme,
          participants: nextPlan.participantsLabel,
        },
        ...current,
      ].slice(0, 6));
    });
  }

  function resetSession() {
    setStarted(false);
    setCurrentStepIndex(0);
    setScenarioSelections({});
    setNotesByStep({});
    setVisitedSteps({});
    setSupportView("help");
  }

  function nextStep() {
    if (!plan) return;

    setCurrentStepIndex((current) => {
      const nextIndex = Math.min(current + 1, plan.steps.length - 1);
      const nextStep = plan.steps[nextIndex];
      if (nextStep) {
        setVisitedSteps((visited) => ({ ...visited, [nextStep.id]: true }));
      }
      return nextIndex;
    });
  }

  function previousStep() {
    setCurrentStepIndex((current) => Math.max(current - 1, 0));
  }

  function goToStep(index: number) {
    if (!plan) return;

    const step = plan.steps[index];
    if (!step) return;

    setVisitedSteps((current) => ({ ...current, [step.id]: true }));
    setCurrentStepIndex(index);
  }

  function regenerateScenario(stepId: string, variantsCount: number) {
    setScenarioSelections((current) => ({
      ...current,
      [stepId]: ((current[stepId] ?? 0) + 1) % variantsCount,
    }));
  }

  function updateNote(stepId: string, value: string) {
    setNotesByStep((current) => ({
      ...current,
      [stepId]: value,
    }));
  }

  async function copyCurrentStep() {
    if (!plan) return;

    const step = plan.steps[currentStepIndex];
    const payload = [
      step.title,
      step.audience ? `Målgruppe: ${step.audience}` : "",
      step.description ?? "",
      ...(step.kind === "scenario"
        ? step.scenarioVariants?.[scenarioSelections[step.id] ?? 0] ?? []
        : step.content ?? []),
      ...(step.sections?.flatMap((section) => [section.title, ...section.lines, ""]) ?? []),
      "",
      step.helpTitle ?? "",
      ...(step.helpLines ?? []),
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(payload);
    setCopied(true);
  }

  const activeStep = plan?.steps[currentStepIndex] ?? null;
  const isLastStep = plan ? currentStepIndex === plan.steps.length - 1 : false;
  const progressPercent = plan
    ? Math.round(((currentStepIndex + 1) / plan.steps.length) * 100)
    : 0;
  const formErrors = [
    form.children.some((child) => child.name.trim().length === 0)
      ? "Alle barn må ha navn."
      : null,
    form.children.some((child) => child.age < 6 || child.age > 16)
      ? "Denne versjonen er best egnet for barn mellom 6 og 16 år."
      : null,
    form.sessionLength < 10 || form.sessionLength > 45
      ? "Varighet må være mellom 10 og 45 minutter."
      : null,
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_rgba(255,247,237,0.96)_35%,_rgba(231,229,228,1)_100%)] text-stone-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-stone-950 text-stone-50 shadow-[0_24px_80px_rgba(28,25,23,0.28)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
                KlokPrat • Vanskelige samtaler hjemme
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
                  Lær barna å tenke selv i vanskelige situasjoner på 20 minutter.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                  KlokPrat hjelper foreldre å øve på sosiale, følelsesmessige og
                  praktiske valg hjemme. Du får en konkret samtaleguide, spørsmål som
                  presser tenkingen litt videre, og støtte til hva du kan si når barnet
                  stopper opp.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="hero-stat">
                  <strong>For barn 6-16 år</strong>
                  <span>Alderstilpassede scenarioer for skole, venner, kropp, nett og familie.</span>
                </div>
                <div className="hero-stat">
                  <strong>Gratis pilot</strong>
                  <span>Ingen registrering og ingen betaling i denne versjonen.</span>
                </div>
                <div className="hero-stat">
                  <strong>Lagrer lokalt</strong>
                  <span>Navn, notater og økthistorikk blir liggende i nettleseren din.</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a className="primary-button" href="#bygg-okt">
                  Prøv gratis og lag første økt
                </a>
                <a className="secondary-button" href="#eksempel">
                  Se eksempel først
                </a>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-4 backdrop-blur sm:p-5">
              <div className="rounded-[1.5rem] bg-[#fffdfa] p-5 text-stone-900 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                      Hva problemet er
                    </p>
                    <h2 className="mt-2 font-serif text-3xl leading-tight text-stone-950">
                      Foreldre mangler ofte språk, timing og struktur.
                    </h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  <div className="trust-row">
                    <strong>Uten KlokPrat</strong>
                    <p>Samtalen blir ofte tilfeldig, moraliserende eller så ubehagelig at den aldri skjer.</p>
                  </div>
                  <div className="trust-row">
                    <strong>Med KlokPrat</strong>
                    <p>Forelderen får en konkret guide, barnet får press til å tenke selv, og dere bygger språk over tid.</p>
                  </div>
                  <div className="trust-row">
                    <strong>Hvordan innholdet lages</strong>
                    <p>Denne piloten genererer økter lokalt fra kuraterte scenariomal tilpasset tema, alder og pressnivå.</p>
                  </div>
                  <div className="trust-row">
                    <strong>Hva denne versjonen ikke er</strong>
                    <p>Dette er ikke terapi eller krisehjelp. Den er laget for hverdagslige, vanskelige samtaler hjemme.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div id="eksempel" className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
              Eksempel på økt
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-stone-950">
              Slik ser en samtaleguide ut før du trykker start.
            </h2>
            <div className="mt-6 rounded-[1.5rem] bg-stone-950 p-5 text-stone-100">
              <div className="space-y-4">
                {exampleLines.map((line) => (
                  <p key={line} className="text-base leading-7 text-stone-100">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="benefit-card">
                <strong>Tydelig struktur</strong>
                <span>Forelderen får én del av økten om gangen i stedet for en lang blokk tekst.</span>
              </div>
              <div className="benefit-card">
                <strong>Press uten prekener</strong>
                <span>Spørsmålene er laget for å trigge tenking, ikke skam eller lange moralforedrag.</span>
              </div>
              <div className="benefit-card">
                <strong>Notater og progresjon</strong>
                <span>Økter og notater lagres lokalt, så familien slipper å starte helt på nytt hver gang.</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                Tillit og sikkerhet
              </p>
              <div className="mt-4 space-y-4">
                <div className="trust-row">
                  <strong>Personvern</strong>
                  <p>Denne versjonen sender ikke barnas navn og notater til en egen backend. Dataene lagres i nettleseren på enheten du bruker.</p>
                </div>
                <div className="trust-row">
                  <strong>Når du bør stoppe økten</strong>
                  <p>Hvis barnet forteller om vold, overgrep, selvskading eller akutt utrygghet, gå ut av øvelsen og søk mer hjelp med en gang.</p>
                </div>
                <div className="trust-row">
                  <strong>Hva som er gratis nå</strong>
                  <p>Dette er en gratis pilot uten innlogging. Ingen prisplan eller betalingssteg er lagt inn i denne versjonen.</p>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                Temaer i piloten
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {themeSuggestions.map((theme) => (
                  <span key={theme} className="tag-chip">
                    {theme}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-stone-600">
                Flere temaer som sorg, seksualitet og nevrodivergens bør inn i en senere versjon.
                Denne piloten er tydeligst på de mest brukte hverdagslige samtalene.
              </p>
            </section>
          </div>
        </section>

        <section id="bygg-okt" className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Bygg økt
                </p>
                <h2 className="mt-2 font-serif text-3xl leading-tight text-stone-950">
                  Lag en ny samtaleguide for familien
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-stone-600">
                Barnelagring er lokal i nettleseren din. Du trenger ikke legge dem inn på nytt hver gang på samme enhet.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Varighet
                </p>
                <div className="flex flex-wrap gap-2">
                  {durationOptions.map((option) => (
                    <button
                      key={option}
                      className={`tag-button ${form.sessionLength === option ? "tag-button-active" : ""}`}
                      type="button"
                      onClick={() =>
                        setForm((current) => ({ ...current, sessionLength: option }))
                      }
                    >
                      {option} min
                    </button>
                  ))}
                </div>
              </div>

              <label className="field">
                <span>Pressnivå</span>
                <select
                  value={form.difficulty}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      difficulty: event.target.value as DifficultyLevel,
                    }))
                  }
                >
                  <option value="easy">Enkel – lett å svare på</option>
                  <option value="medium">Middels – noen motspørsmål</option>
                  <option value="advanced">Avansert – mer press og flere dilemmaer</option>
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="field sm:col-span-2">
                <span>Tema</span>
                <input
                  type="text"
                  placeholder="Velg et tema under eller skriv inn ditt eget"
                  value={form.theme}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, theme: event.target.value }))
                  }
                />
              </label>

              <div className="sm:col-span-2 flex flex-wrap gap-2">
                {themeSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    className={`tag-button ${form.theme === suggestion ? "tag-button-active" : ""}`}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        theme: current.theme === suggestion ? "" : suggestion,
                      }))
                    }
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Barn
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    Maks {MAX_CHILDREN} barn i denne piloten.
                  </p>
                </div>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={addChild}
                  disabled={form.children.length >= MAX_CHILDREN}
                >
                  Legg til barn
                </button>
              </div>

              {form.children.map((child, index) => (
                <div key={`${index}-${child.name}`} className="child-card">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                        Barn {index + 1}
                      </p>
                    </div>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => removeChild(index)}
                      disabled={form.children.length === 1}
                    >
                      Fjern barn
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="field">
                      <span>Navn</span>
                      <input
                        type="text"
                        value={child.name}
                        onChange={(event) => updateChild(index, "name", event.target.value)}
                      />
                    </label>

                    <label className="field">
                      <span>Alder</span>
                      <input
                        type="number"
                        min={6}
                        max={16}
                        value={child.age}
                        onChange={(event) => updateChild(index, "age", event.target.value)}
                      />
                    </label>

                    <label className="field">
                      <span>Temperament</span>
                      <input
                        type="text"
                        placeholder="Rolig, impulsiv, følsom, vil virke tøff..."
                        value={child.temperament ?? ""}
                        onChange={(event) =>
                          updateChild(index, "temperament", event.target.value)
                        }
                      />
                    </label>

                    <label className="field">
                      <span>Aktuell utfordring</span>
                      <input
                        type="text"
                        placeholder="Vennskap, sinne, løgn, nytt hjem, nett..."
                        value={child.focus ?? ""}
                        onChange={(event) => updateChild(index, "focus", event.target.value)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {formErrors.length > 0 ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formErrors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Klar til å bygge en gratis økt uten registrering.
                </div>
              )}

              <button
                className="primary-button"
                type="button"
                onClick={createPlan}
                disabled={formErrors.length > 0}
              >
                Start gratis og bygg guide
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                Ofte spurt
              </p>
              <div className="mt-4 space-y-4">
                <div className="faq-item">
                  <strong>Må jeg registrere meg?</strong>
                  <p>Nei. Denne piloten er åpen og gratis.</p>
                </div>
                <div className="faq-item">
                  <strong>Hvor lagres dataene?</strong>
                  <p>I nettleseren på enheten din, ikke i en egen database i denne versjonen.</p>
                </div>
                <div className="faq-item">
                  <strong>Hvor raskt merker en familie effekt?</strong>
                  <p>Som regel ser du først effekt når samme type samtale øves flere ganger over noen uker.</p>
                </div>
                <div className="faq-item">
                  <strong>Hva hvis økten blir for vanskelig?</strong>
                  <p>Stopp, reguler ned, bekreft følelsen, og kom tilbake senere. Dette er et verktøy, ikke et krav om å presse gjennom.</p>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                Om piloten
              </p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-stone-700">
                <p>KlokPrat er en tidlig produktpilot for foreldre som vil trene vanskelige samtaler hjemme, uten å måtte finne på alt selv.</p>
                <p>Denne versjonen bruker strukturerte scenariomal og lokal generering i nettleseren for å holde terskelen lav og personvernet bedre.</p>
                <p>
                  Gi tilbakemelding eller rapporter et problem her:{" "}
                  <a
                    className="text-amber-700 underline decoration-amber-300 underline-offset-4"
                    href="https://github.com/krist-oslo-byte/parenting-session-app/issues/new"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub Issues
                  </a>
                </p>
              </div>
            </section>

            {history.length > 0 ? (
              <section className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Tidligere økter
                </p>
                <div className="mt-4 space-y-3">
                  {history.map((item, index) => (
                    <div key={`${item.createdAt}-${item.title}-${index}`} className="history-item">
                      <strong>{item.title}</strong>
                      <span>{item.theme}</span>
                      <span>{item.participants}</span>
                      <small>{item.createdAt}</small>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>

        {plan ? (
          <section className="space-y-6">
            <section className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Aktiv økt
                  </p>
                  <h2 className="mt-2 font-serif text-3xl leading-tight text-stone-950">
                    {plan.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {plan.theme} • {plan.durationLabel} • {plan.ageGuidance}
                  </p>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="summary-chip">
                    <dt>Deltakere</dt>
                    <dd>{plan.participantsLabel}</dd>
                  </div>
                  <div className="summary-chip">
                    <dt>Fremdrift</dt>
                    <dd>
                      {currentStepIndex + 1} av {plan.steps.length}
                    </dd>
                  </div>
                  <div className="summary-chip">
                    <dt>Status</dt>
                    <dd>Lokalt lagret på denne enheten</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
                {plan.steps.map((step, index) => (
                  <button
                    key={step.id}
                    type="button"
                    className={`step-pill ${index === currentStepIndex ? "step-pill-active" : ""} ${
                      visitedSteps[step.id] ? "step-pill-visited" : ""
                    }`}
                    onClick={() => goToStep(index)}
                  >
                    <span className="step-pill-index">{index + 1}</span>
                    <span className="step-pill-text">
                      <strong>{step.title}</strong>
                      <small>{step.audience}</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {activeStep ? (
              <section className="rounded-[1.75rem] border border-stone-200/80 bg-[#fffdfa] p-4 shadow-[0_18px_50px_rgba(41,37,36,0.08)] sm:p-6">
                <div className="mb-5 rounded-[1.4rem] border border-stone-200 bg-white px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                        Fremdrift
                      </p>
                      <p className="mt-1 text-base text-stone-700">
                        {currentStepIndex + 1} av {plan.steps.length} steg aktivt
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button className="secondary-button" type="button" onClick={resetSession}>
                        Lukk økten
                      </button>
                      <button className="secondary-button" type="button" onClick={copyCurrentStep}>
                        {copied ? "Kopiert" : "Kopier steg"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#d97706,#f59e0b)] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-b border-stone-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                        Steg {currentStepIndex + 1}
                      </span>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                        {activeStep.audience}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl leading-tight text-stone-950">
                      {activeStep.title}
                    </h2>

                    {activeStep.description ? (
                      <p className="max-w-3xl text-base leading-7 text-stone-600">
                        {activeStep.description}
                      </p>
                    ) : null}
                  </div>

                  {activeStep.kind === "scenario" && activeStep.scenarioVariants ? (
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() =>
                        regenerateScenario(
                          activeStep.id,
                          activeStep.scenarioVariants?.length ?? 1,
                        )
                      }
                    >
                      Nytt scenario
                    </button>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-4">
                    {activeStep.kind === "script" && activeStep.content ? (
                      <div className="card-block">
                        <h3>Dette leser du høyt</h3>
                        <div className="space-y-3">
                          {activeStep.content.map((line) => (
                            <p key={line} className="content-line">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {activeStep.kind === "scenario" && activeStep.scenarioVariants ? (
                      <div className="card-block">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h3 className="mb-0">Scenario</h3>
                          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-600">
                            Variant {(scenarioSelections[activeStep.id] ?? 0) + 1} av{" "}
                            {activeStep.scenarioVariants.length}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {(activeStep.scenarioVariants[
                            scenarioSelections[activeStep.id] ?? 0
                          ] ?? []).map((line) => (
                            <p key={line} className="content-line">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {activeStep.sections?.map((section) => (
                      <div key={section.title} className="card-block">
                        <h3>{section.title}</h3>
                        <div className="space-y-3">
                          {section.lines.map((line) => (
                            <p key={line} className="content-line">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2 rounded-[1.2rem] border border-stone-200 bg-white p-1">
                      <button
                        className={`support-tab ${supportView === "help" ? "support-tab-active" : ""}`}
                        type="button"
                        onClick={() => setSupportView("help")}
                      >
                        Støtte til forelder
                      </button>
                      <button
                        className={`support-tab ${supportView === "notes" ? "support-tab-active" : ""}`}
                        type="button"
                        onClick={() => setSupportView("notes")}
                      >
                        Egne notater
                      </button>
                    </div>

                    <div className="assistant-panel">
                      {supportView === "help" ? (
                        <>
                          <h3>{activeStep.helpTitle ?? "Støtte til forelder"}</h3>
                          <div className="space-y-3">
                            {(activeStep.helpLines ?? []).map((line) => (
                              <p key={line} className="assistant-line">
                                {line}
                              </p>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <h3>Egne notater</h3>
                          <textarea
                            className="notes-area"
                            value={notesByStep[activeStep.id] ?? ""}
                            onChange={(event) => updateNote(activeStep.id, event.target.value)}
                            placeholder={activeStep.notePlaceholder}
                          />
                        </>
                      )}
                    </div>

                    <div className="tip-strip">
                      <strong>Bruksmønster:</strong>
                      <span>
                        Les steget ferdig, bruk hjelpen hvis du trenger språk eller
                        press, og gå så videre til neste.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sticky-action-bar mt-6 flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={previousStep}
                    disabled={currentStepIndex === 0}
                  >
                    Forrige
                  </button>

                  <div className="text-sm text-stone-500">
                    {isLastStep
                      ? "Du er på siste steg i økten."
                      : "Trykk neste når denne delen er lest eller gjennomført."}
                  </div>

                  <button
                    className="primary-button"
                    type="button"
                    onClick={nextStep}
                    disabled={isLastStep}
                  >
                    Neste
                  </button>
                </div>
              </section>
            ) : null}
          </section>
        ) : (
          <section className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white/70 p-8 text-center shadow-[0_18px_50px_rgba(41,37,36,0.05)]">
            <h2 className="font-serif text-3xl text-stone-950">
              Se eksempelet over, og bygg deretter første økt
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-stone-600">
              Når du trykker på start, åpnes en konkret guide med scenarioer, spørsmål,
              støtte til forelder og lokalt lagrede notater.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
