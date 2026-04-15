"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { ReactNode } from "react";

/**
 * AutoPilotContext — the "Interactive Auto-Pilot Demo Mode" state machine.
 *
 * Drives the entire guided demo: spotlight overlay, ghost-typing, step-by-step
 * tooltips, and Spacebar pause/resume. All three views (developer, terminal,
 * merchant) subscribe to `currentStep` and react accordingly.
 */

export type AutoPilotRoute = "developer" | "terminal" | "merchant";

export interface AutoPilotStep {
  /** Stable id used for spotlight targeting and tooltip keys. */
  id: string;
  /** Which view this step lives on. */
  route: AutoPilotRoute;
  /** CSS selector of the DOM element to spotlight. */
  targetSelector?: string;
  /** Tooltip copy shown next to the spotlighted element. */
  tooltip?: string;
  /** Optional ghost-typing payload. */
  ghostTyping?: {
    inputSelector: string;
    text: string;
    /** Typing speed in ms per character. */
    charDelay?: number;
  };
  /** Milliseconds to hold this step before auto-advancing. */
  holdMs: number;
  /**
   * Side-effect hook — called when the step begins. Use to trigger animations,
   * dispatch events, or mutate visual state elsewhere.
   */
  onEnter?: () => void;
}

type Status = "idle" | "playing" | "paused" | "finished";

interface State {
  status: Status;
  currentStepIndex: number;
  steps: AutoPilotStep[];
}

type Action =
  | { type: "LOAD"; steps: AutoPilotStep[] }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "STOP" }
  | { type: "GOTO"; index: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD":
      return { ...state, steps: action.steps, currentStepIndex: 0, status: "idle" };
    case "PLAY":
      return { ...state, status: "playing", currentStepIndex: 0 };
    case "PAUSE":
      return state.status === "playing" ? { ...state, status: "paused" } : state;
    case "RESUME":
      return state.status === "paused" ? { ...state, status: "playing" } : state;
    case "NEXT": {
      const next = state.currentStepIndex + 1;
      if (next >= state.steps.length) return { ...state, status: "finished" };
      return { ...state, currentStepIndex: next };
    }
    case "PREV":
      return { ...state, currentStepIndex: Math.max(0, state.currentStepIndex - 1) };
    case "STOP":
      return { ...state, status: "idle", currentStepIndex: 0 };
    case "GOTO":
      return {
        ...state,
        currentStepIndex: Math.min(Math.max(0, action.index), state.steps.length - 1),
      };
    default:
      return state;
  }
}

interface AutoPilotAPI {
  status: Status;
  currentStep: AutoPilotStep | null;
  currentStepIndex: number;
  totalSteps: number;
  isActive: boolean;
  load: (steps: AutoPilotStep[]) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  goto: (index: number) => void;
}

const AutoPilotContext = createContext<AutoPilotAPI | null>(null);

export function AutoPilotProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    status: "idle",
    currentStepIndex: 0,
    steps: [],
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep = state.steps[state.currentStepIndex] ?? null;
  const isActive = state.status === "playing" || state.status === "paused";

  // Auto-advance when playing
  useEffect(() => {
    if (state.status !== "playing" || !currentStep) return;
    currentStep.onEnter?.();
    timerRef.current = setTimeout(() => {
      dispatch({ type: "NEXT" });
    }, currentStep.holdMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.status, state.currentStepIndex, currentStep]);

  // Spacebar pause/resume binding
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        dispatch({ type: state.status === "playing" ? "PAUSE" : "RESUME" });
      }
      if (e.code === "Escape") {
        dispatch({ type: "STOP" });
      }
      if (e.code === "ArrowRight") dispatch({ type: "NEXT" });
      if (e.code === "ArrowLeft") dispatch({ type: "PREV" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive, state.status]);

  const api = useMemo<AutoPilotAPI>(
    () => ({
      status: state.status,
      currentStep,
      currentStepIndex: state.currentStepIndex,
      totalSteps: state.steps.length,
      isActive,
      load: (steps) => dispatch({ type: "LOAD", steps }),
      play: () => dispatch({ type: "PLAY" }),
      pause: () => dispatch({ type: "PAUSE" }),
      resume: () => dispatch({ type: "RESUME" }),
      toggle: () =>
        dispatch({
          type: state.status === "playing" ? "PAUSE" : state.status === "paused" ? "RESUME" : "PLAY",
        }),
      next: () => dispatch({ type: "NEXT" }),
      prev: () => dispatch({ type: "PREV" }),
      stop: () => dispatch({ type: "STOP" }),
      goto: (index) => dispatch({ type: "GOTO", index }),
    }),
    [state, currentStep, isActive],
  );

  return <AutoPilotContext.Provider value={api}>{children}</AutoPilotContext.Provider>;
}

export function useAutoPilot(): AutoPilotAPI {
  const ctx = useContext(AutoPilotContext);
  if (!ctx) throw new Error("useAutoPilot must be used inside <AutoPilotProvider>");
  return ctx;
}
