// ───────────────────────────────────────────────────────────────
// MODULE: Agentic Step Provider (IRCoT reasoner)
// ───────────────────────────────────────────────────────────────
// The "agent" half of the bounded agentic recall loop. The governor
// (agentic-loop-governor.ts) owns termination and safety; this module owns the
// single decision the governor delegates each turn: given the original query
// plus the observations gathered so far, either issue ONE follow-up
// memory_search query or stop with a final answer.
//
// The shape is interleaved retrieval + reasoning (IRCoT): each hop reads what
// the last search surfaced, then either chains to a second spec the first one
// pointed at, or — once the chain is satisfied — answers. The reasoner is an
// LLM, so this is the one place non-determinism enters the otherwise pure
// retrieval path; it is reachable only behind the default-off agentic flag.
//
// The LLM transport mirrors llm-reformulation.ts on purpose: same
// OpenAI-compatible endpoint, same env vars, same single-turn JSON contract.
// That caller is private there, so the equivalent thin caller lives here and is
// injectable, which keeps the provider unit-testable without a live endpoint —
// a scripted reasoner stands in for the LLM and exercises the exact same
// tool_call / final_answer plumbing the real model drives.

import { clearRegisteredTimer, registerTimeout } from '../runtime/timer-registry.js';
import type {
  AgenticLoopState,
  AgenticStep,
  AgenticStepProvider,
  AgenticObservation,
} from './agentic-loop-governor.js';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Tool name the loop is allowed to call. ACL-gated to this and only this. */
export const AGENTIC_SEARCH_TOOL = 'memory_search';

/** Timeout for a single reasoner turn, in milliseconds. */
const REASONER_TIMEOUT_MS = 8000;

/** Max characters of an observation snippet fed back into the prompt. */
const OBSERVATION_SNIPPET_CHARS = 240;

/** Max follow-up results summarized per observation, to bound prompt tokens. */
const OBSERVATION_RESULT_CAP = 4;

/** Cap on the follow-up query length the reasoner may emit. */
const MAX_FOLLOWUP_QUERY_CHARS = 200;

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * One retrieved row distilled to what the reasoner needs to decide the next
 * hop: a stable id, a title, and a short content snippet. Mirrors the
 * memory_search result row shape (id + title + content_text/snippet).
 */
export interface AgenticResultRow {
  readonly id: number | string;
  readonly title?: string;
  readonly snippet?: string;
}

/**
 * The injectable reasoner. Given the rendered prompt it returns a structured
 * decision. Production binds this to the OpenAI-compatible endpoint; tests bind
 * a scripted function. Returns null to signal "no decision" (transport down,
 * parse failure) so the provider can degrade to a final answer rather than
 * looping blindly.
 */
export type AgenticReasoner = (prompt: string) => Promise<AgenticReasonerDecision | null>;

/** Parsed reasoner output: chain to another search, or stop. */
export type AgenticReasonerDecision =
  | { readonly action: 'search'; readonly query: string }
  | { readonly action: 'final_answer' };

export interface StepProviderConfig {
  /** The original user query that seeds the loop. */
  readonly query: string;
  /**
   * The reasoner. Defaults to the env-configured OpenAI-compatible caller
   * (the same transport llm-reformulation.ts uses). When no endpoint is
   * configured the default reasoner returns null and the loop answers on hop 1.
   */
  readonly reasoner?: AgenticReasoner;
  /**
   * Project an arbitrary tool observation result into the rows the reasoner
   * sees. Defaults to reading `data.results` from an MCP response envelope.
   */
  readonly extractRows?: (observationResult: unknown) => AgenticResultRow[];
}

/* ───────────────────────────────────────────────────────────────
   3. OBSERVATION PROJECTION
──────────────────────────────────────────────────────────────── */

/**
 * Default row projection: pull `data.results` from an MCP response envelope and
 * keep each row's id, title, and a short snippet. Tolerant of partial shapes —
 * an unrecognized result yields an empty row set rather than throwing.
 */
export function extractRowsFromEnvelope(observationResult: unknown): AgenticResultRow[] {
  const envelope = observationResult as Record<string, unknown> | null | undefined;
  const data = envelope?.data as Record<string, unknown> | undefined;
  const rows = Array.isArray(data?.results) ? (data!.results as Array<Record<string, unknown>>) : [];

  return rows.map((row): AgenticResultRow => {
    const rawId = row.id ?? row.memoryId ?? row.resultId;
    const id = typeof rawId === 'number' || typeof rawId === 'string' ? rawId : -1;
    const title = typeof row.title === 'string' ? row.title : undefined;
    const snippetSource =
      typeof row.snippet === 'string'
        ? row.snippet
        : typeof row.content_text === 'string'
          ? row.content_text
          : typeof row.content === 'string'
            ? row.content
            : undefined;
    return {
      id,
      title,
      snippet: snippetSource ? snippetSource.slice(0, OBSERVATION_SNIPPET_CHARS) : undefined,
    };
  });
}

/* ───────────────────────────────────────────────────────────────
   4. PROMPT BUILDER
──────────────────────────────────────────────────────────────── */

/**
 * Render the IRCoT decision prompt from the original query and the accumulated
 * observations. Each observation is summarized as the search that ran plus the
 * top rows it returned, so the reasoner can spot a spec that names a second
 * spec and chain to it — or recognize the chain is complete and stop.
 */
export function buildAgenticStepPrompt(
  query: string,
  observations: readonly AgenticObservation[],
  extractRows: (result: unknown) => AgenticResultRow[],
): string {
  const observationBlock =
    observations.length === 0
      ? '(no searches run yet)'
      : observations
          .map((obs, i) => {
            if (!obs.ok) {
              return `Search ${i + 1}: FAILED (${obs.error ?? 'unknown error'})`;
            }
            const rows = extractRows(obs.result).slice(0, OBSERVATION_RESULT_CAP);
            const rowLines =
              rows.length === 0
                ? '  (no results)'
                : rows
                    .map((r) => {
                      const head = r.title ? r.title : `memory ${r.id}`;
                      const tail = r.snippet ? ` — ${r.snippet}` : '';
                      return `  [id ${r.id}] ${head}${tail}`;
                    })
                    .join('\n');
            return `Search ${i + 1} results:\n${rowLines}`;
          })
          .join('\n\n');

  return [
    'You are a multi-hop memory retrieval agent answering a question that may',
    'require chaining across more than one spec or memory.',
    '',
    'Decide the SINGLE next action:',
    `  - "search": issue ONE follow-up memory_search query (max ${MAX_FOLLOWUP_QUERY_CHARS} chars)`,
    '    when the results so far point at a SECOND spec/memory you still need.',
    '  - "final_answer": stop, when the results already cover what the question needs.',
    '',
    'RULES:',
    '  - Ground every follow-up query in entities, ids, or titles that actually',
    '    appear in the results below. Do NOT invent names.',
    '  - Prefer "final_answer" once the chain is satisfied; do not search in circles.',
    '  - If a result names another spec/feature/component the question depends on,',
    '    "search" for that named thing next.',
    '',
    'Return ONLY valid JSON, no prose:',
    '{"action": "search", "query": "<follow-up query>"}',
    'or',
    '{"action": "final_answer"}',
    '',
    `Original question: ${query}`,
    '',
    'Searches run so far:',
    observationBlock,
  ].join('\n');
}

/* ───────────────────────────────────────────────────────────────
   5. DEFAULT LLM REASONER (env-configured, OpenAI-compatible)
──────────────────────────────────────────────────────────────── */

/**
 * Parse and validate a reasoner JSON response into a decision. Returns null on
 * any parse/validation failure so the caller degrades to a final answer.
 */
export function parseReasonerResponse(rawText: string): AgenticReasonerDecision | null {
  try {
    const parsed = JSON.parse(rawText) as Record<string, unknown>;
    const action = typeof parsed.action === 'string' ? parsed.action.trim().toLowerCase() : '';

    if (action === 'final_answer') {
      return { action: 'final_answer' };
    }
    if (action === 'search') {
      const query = typeof parsed.query === 'string' ? parsed.query.trim() : '';
      if (query.length === 0) return null;
      return { action: 'search', query: query.slice(0, MAX_FOLLOWUP_QUERY_CHARS) };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * The production reasoner: a single-turn OpenAI-compatible chat call, gated on
 * the same env vars as llm-reformulation.ts. When no endpoint is configured it
 * returns null, so the loop answers on the first hop (worst case: a single-shot
 * search wrapped in the governor — exactly the seedAnswer tie-floor).
 */
export const defaultAgenticReasoner: AgenticReasoner = async (prompt) => {
  const endpoint = process.env.LLM_REFORMULATION_ENDPOINT?.trim();
  if (!endpoint) return null;

  const apiKey = process.env.LLM_REFORMULATION_API_KEY?.trim() ?? '';
  const model = process.env.LLM_REFORMULATION_MODEL?.trim() ?? 'gpt-4o-mini';

  const controller = new AbortController();
  const timeoutId = registerTimeout(() => controller.abort(), REASONER_TIMEOUT_MS, { unref: true });

  try {
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 128,
        temperature: 0,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearRegisteredTimer(timeoutId);

    if (!response.ok) {
      console.warn(`[agentic-step-provider] reasoner endpoint returned HTTP ${response.status}`);
      return null;
    }

    const json = (await response.json()) as Record<string, unknown>;
    const message = (json?.choices as Array<Record<string, unknown>>)?.[0]?.message as
      | Record<string, unknown>
      | undefined;
    const rawText = typeof message?.content === 'string' ? message.content : null;
    if (!rawText) return null;

    return parseReasonerResponse(rawText);
  } catch (err: unknown) {
    clearRegisteredTimer(timeoutId);
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[agentic-step-provider] reasoner call failed: ${msg}`);
    return null;
  }
};

/* ───────────────────────────────────────────────────────────────
   6. STEP PROVIDER FACTORY
──────────────────────────────────────────────────────────────── */

/**
 * Build a governor-compatible step provider that drives the IRCoT loop.
 *
 * Behaviour per turn:
 *   - On the FIRST turn (no observations yet) it always issues the original
 *     query as the opening search — every run starts from the same grounded
 *     single-shot retrieval, so the worst case ties the deterministic baseline.
 *   - Thereafter it asks the reasoner whether to chain to a follow-up search or
 *     stop. A null reasoner decision (no endpoint, transport/parse failure)
 *     terminates the loop with a final answer rather than spinning.
 *
 * The provider never executes a tool itself — it only emits the next step. The
 * governor runs the ACL-gated executor and feeds the observation back.
 */
export function createAgenticStepProvider(config: StepProviderConfig): AgenticStepProvider {
  const reasoner = config.reasoner ?? defaultAgenticReasoner;
  const extractRows = config.extractRows ?? extractRowsFromEnvelope;
  const query = config.query;

  return async (state: AgenticLoopState): Promise<AgenticStep> => {
    // First hop: always the original query, ungoverned by the reasoner. This is
    // the deterministic seed that the seedAnswer tie-floor mirrors.
    if (state.observations.length === 0) {
      return { kind: 'tool_call', tool: AGENTIC_SEARCH_TOOL, args: { query } };
    }

    const prompt = buildAgenticStepPrompt(query, state.observations, extractRows);
    const decision = await reasoner(prompt);

    // No usable decision — stop with what we have rather than loop blindly.
    if (decision === null || decision.action === 'final_answer') {
      return { kind: 'final_answer', answer: { reason: 'reasoner_stop' } };
    }

    return { kind: 'tool_call', tool: AGENTIC_SEARCH_TOOL, args: { query: decision.query } };
  };
}

/* ───────────────────────────────────────────────────────────────
   7. TEST EXPORTS
──────────────────────────────────────────────────────────────── */

/** @internal */
export const __testables = {
  buildAgenticStepPrompt,
  parseReasonerResponse,
  extractRowsFromEnvelope,
  REASONER_TIMEOUT_MS,
  MAX_FOLLOWUP_QUERY_CHARS,
  OBSERVATION_RESULT_CAP,
};
