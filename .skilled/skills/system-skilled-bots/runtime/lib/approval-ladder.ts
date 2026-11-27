// ───────────────────────────────────────────────────────────────────
// MODULE: Approval Ladder
// ───────────────────────────────────────────────────────────────────
//
// A bot asks before an action for one of four reasons, tried in order, and the
// first answer wins: a kind of action, then a rule, then auto-review, then
// extra vigilance. Only the first rung and the bot fallback are implemented,
// because no store supplies a rule, an auto-review switch or an extra-vigilant
// switch. Rungs 2 to 4 are not implemented in this phase and this module never
// returns them. A standing allow would attach to a kind and never to a phrase,
// and none is recorded, so an answer grants once or deny. The module is pure,
// so it does no I/O and prints nothing.

import type { ActionKind } from './action-kind.js';

// ───────────────────────────────────────────────────────────────────
// 1. RUNGS
// ───────────────────────────────────────────────────────────────────

/** The four rungs in OpenBot's order. */
export const RUNGS = ['kind', 'rule', 'auto-review', 'extra-vigilant'] as const;

/** Where the ladder ends when no rung decides, not a fifth rung. */
export const RUNG_FALLBACK = 'bot' as const;

/** Every rung a grant may name, the fallback included. */
export const GRANT_RUNGS = [...RUNGS, RUNG_FALLBACK] as const;

/** A rung a grant may name. */
export type GrantRung = (typeof GRANT_RUNGS)[number];

/** The rungs no store supplies, so they are not implemented in this phase. */
export const NOT_IMPLEMENTED_RUNGS = ['rule', 'auto-review', 'extra-vigilant'] as const;

// ───────────────────────────────────────────────────────────────────
// 2. SCOPES
// ───────────────────────────────────────────────────────────────────

/** The two scopes an answer may grant. */
export const SCOPES = ['once', 'deny'] as const;

/** A scope an answer may grant. */
export type GrantScope = (typeof SCOPES)[number];

/** Named so a reader sees what is refused. The command line raises grant-scope-unsupported, because no rule store lands, so this module raises nothing. */
export const UNSUPPORTED_SCOPES = ['always', 'conversation'] as const;

/** The answers a NO reads as. */
export const NO_ANSWERS = ['deny', 'no', 'n', 'reject'] as const;

// ───────────────────────────────────────────────────────────────────
// 3. DECISION
// ───────────────────────────────────────────────────────────────────

/** What the ladder decided: the bot asks, and the rung that made it ask. */
export interface ApprovalDecision {
  asks: true;
  rung: 'kind' | 'bot';
}

/**
 * Decide why a bot asks before an action. The first answer wins, so a kind
 * other than `other` decides at rung 1 and never reaches a later rung.
 *
 * @param input - The kind of action the question names.
 * @returns The decision, always asking, at rung 1 or the bot fallback.
 */
export function decideApproval(input: { kind: ActionKind }): ApprovalDecision {
  if (input.kind !== 'other') return { asks: true, rung: 'kind' };
  return { asks: true, rung: 'bot' };
}

// ───────────────────────────────────────────────────────────────────
// 4. SCOPE
// ───────────────────────────────────────────────────────────────────

/** True only for the two scopes an answer may grant. */
export function isGrantScope(value: unknown): value is GrantScope {
  return value === 'once' || value === 'deny';
}

/**
 * Resolve the scope an answer records. A refusal is never recorded as an
 * approval, so a NO reads as `deny` even when `once` was given.
 *
 * @param text - The answer as the operator typed it.
 * @param given - The scope the command line asked for, when it asked for one.
 * @returns The scope to record.
 */
export function grantScopeFor(text: string, given?: GrantScope | null): GrantScope {
  const answer = text.trim().toLowerCase();
  if ((NO_ANSWERS as readonly string[]).includes(answer)) return 'deny';
  return given ?? 'once';
}
