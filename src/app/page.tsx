"use client";

import { startTransition, useEffect, useState } from "react";
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

const defaultChildren: ChildInput[] = [
  { name: "Theo", age: 15 },
  { name: "Thea", age: 10 },
];

const defaultState: FormState = {
  sessionLength: 20,
  difficulty: "medium",
  theme: "",
  children: defaultChildren,
};

const themeSuggestions = [
  "Sosialt press og tydelige valg",
  "Penger, ærlighet og press",
  "Nett, dømmekraft og omdømme",
];

export default function Home() {
  const [form, setForm] = useState<FormState>(defaultState);
  const [plan, setPlan] = useState<SessionPlan | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [scenarioSelections, setScenarioSelections] = useState<Record<string, number>>({});
  const [notesByStep, setNotesByStep] = useState<Record<string, string>>({});
  const [visitedSteps, setVisitedSteps] = useState<Record<string, boolean>>({});
  const [supportView, setSupportView] = useState<"help" | "notes">("help");

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
      children: [...current.children, { name: `Barn ${current.children.length + 1}`, age: 8 }],
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

      setPlan(nextPlan);
      setCurrentStepIndex(0);
      setScenarioSelections(initialSelections);
      setNotesByStep(initialNotes);
      setVisitedSteps(initialVisited);
      setSupportView("help");
    });
  }

  function resetSession() {
    setPlan(null);
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
    form.children.some((child) => child.age < 4 || child.age > 18)
      ? "Alder må være mellom 4 og 18."
      : null,
    form.sessionLength < 10 || form.sessionLength > 45
      ? "Varighet må være mellom 10 og 45 minutter."
      : null,
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_rgba(255,247,237,0.96)_35%,_rgba(231,229,228,1)_100%)] text-stone-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-stone-950 text-stone-50 shadow-[0_24px_80px_rgba(28,25,23,0.28)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
                Foreldreapp med samtaleøkter
              </div>

              <div className="space-y-4">
                <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                  Bygg økten først. Kjør den steg for steg etterpå.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                  Fyll inn navn, alder, nivå og varighet. Trykk så på start for å få
                  en ryddig økt der hvert steg kommer i riktig rekkefølge, med hjelp
                  til forelder og egne notater underveis.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-stone-300">Trinnvis flyt</div>
                  <div className="mt-2 text-lg font-semibold">Én del av manuset om gangen</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-stone-300">Bytt scenario</div>
                  <div className="mt-2 text-lg font-semibold">Ny variant med ett klikk</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-stone-300">Bruk underveis</div>
                  <div className="mt-2 text-lg font-semibold">Hjelpetekst og notater på hvert steg</div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[#f7f3ee] p-4 text-stone-900 shadow-inner sm:p-5">
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="field">
                    <span>Varighet</span>
                    <input
                      type="number"
                      min={10}
                      max={45}
                      value={form.sessionLength}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          sessionLength: Number(event.target.value) || 20,
                        }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Vanskelighetsgrad</span>
                    <select
                      value={form.difficulty}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          difficulty: event.target.value as DifficultyLevel,
                        }))
                      }
                    >
                      <option value="easy">Enkel</option>
                      <option value="medium">Middels</option>
                      <option value="advanced">Avansert</option>
                    </select>
                  </label>
                </div>

                <label className="field">
                  <span>Tema</span>
                  <input
                    type="text"
                    placeholder="La stå tomt for automatisk valg av tema"
                    value={form.theme}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, theme: event.target.value }))
                    }
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  {themeSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      className={`tag-button ${
                        form.theme === suggestion ? "tag-button-active" : ""
                      }`}
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

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                      Barn
                    </h2>
                    <button className="secondary-button" type="button" onClick={addChild}>
                      Legg til barn
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.children.map((child, index) => (
                      <div
                        key={`${index}-${child.name}`}
                        className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-[1fr_120px_auto]"
                      >
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
                            min={4}
                            max={18}
                            value={child.age}
                            onChange={(event) => updateChild(index, "age", event.target.value)}
                          />
                        </label>

                        <div className="flex items-end">
                          <button
                            className="secondary-button w-full"
                            type="button"
                            onClick={() => removeChild(index)}
                            disabled={form.children.length === 1}
                          >
                            Fjern
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {formErrors.length > 0 ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formErrors.map((error) => (
                      <p key={error}>{error}</p>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Klar til å starte økten.
                  </div>
                )}

                <button
                  className="primary-button"
                  type="button"
                  onClick={createPlan}
                  disabled={formErrors.length > 0}
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </section>

        {plan ? (
          <section className="space-y-6">
            <section className="rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Øktoppsett
                  </p>
                  <h2 className="mt-2 font-serif text-3xl leading-tight text-stone-950">
                    {plan.title}
                  </h2>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="summary-chip">
                    <dt>Tema</dt>
                    <dd>{plan.theme}</dd>
                  </div>
                  <div className="summary-chip">
                    <dt>Varighet</dt>
                    <dd>{plan.durationLabel}</dd>
                  </div>
                  <div className="summary-chip">
                    <dt>Deltakere</dt>
                    <dd>{plan.participantsLabel}</dd>
                  </div>
                  <div className="summary-chip">
                    <dt>Steg</dt>
                    <dd>
                      {currentStepIndex + 1} av {plan.steps.length}
                    </dd>
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
                        Ny økt
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
                        Hjelp til forelder
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
                          <h3>{activeStep.helpTitle ?? "Hjelp til forelder"}</h3>
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
              Trykk på start når oppsettet er klart
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-stone-600">
              Da åpnes en øktvisning der forelderen får én del av manuset om gangen,
              med neste-knapp, scenario-regenerering og notater underveis.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
