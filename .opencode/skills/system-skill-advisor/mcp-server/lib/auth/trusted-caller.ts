// ───────────────────────────────────────────────────────────────
// MODULE: Trusted Caller Guard
// ───────────────────────────────────────────────────────────────

import { getCallerContext, type MCPCallerContext } from '../context/caller-context.js';

export interface TrustedCallerRejection {
  readonly ok: false;
  readonly code: 'UNTRUSTED_CALLER';
  readonly error: string;
}

export interface TrustedCallerAcceptance {
  readonly ok: true;
  readonly callerContext: MCPCallerContext;
}

export type TrustedCallerResult = TrustedCallerAcceptance | TrustedCallerRejection;

export function requireTrustedCaller(
  callerContext: MCPCallerContext | null = getCallerContext(),
  toolName = 'skill_graph_scan',
): TrustedCallerResult {
  if (callerContext?.trusted === true) {
    return {
      ok: true,
      callerContext,
    };
  }

  // The rejection must name the tool that was actually refused — a shared
  // guard naming a fixed tool sends operators debugging the wrong surface.
  return {
    ok: false,
    code: 'UNTRUSTED_CALLER',
    error: `${toolName} requires trusted caller context`,
  };
}
