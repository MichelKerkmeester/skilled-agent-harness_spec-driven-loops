// ───────────────────────────────────────────────────────────────
// MODULE: Hook State Loader Stub
// ───────────────────────────────────────────────────────────────

export type HookStateScope = {
  specFolder?: string;
  claudeSessionId?: string;
  runtime?: string;
};

export interface HookStateResult {
  ok: boolean;
  state: {
    lastSpecFolder?: string;
    sessionSummary?: { text: string } | null;
  };
}

export function loadMostRecentState(_opts?: { scope?: HookStateScope }): HookStateResult {
  return { ok: false, state: {} };
}
