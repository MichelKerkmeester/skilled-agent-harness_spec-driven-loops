// ───────────────────────────────────────────────────────────────
// MODULE: Warm CLI Fallback Envelope
// ───────────────────────────────────────────────────────────────

export type WarmCliFallbackStatus = 'ok' | 'skipped' | 'fail_open';

export interface WarmCliFallbackEnvelope {
  readonly status: WarmCliFallbackStatus;
  readonly reason: string;
  readonly exitCode: number | null;
  readonly retryable: boolean;
}

export interface WarmCliFallbackEnvelopeInput {
  readonly status: WarmCliFallbackStatus;
  readonly reason?: string | null;
  readonly exitCode?: number | null;
  readonly timedOut?: boolean;
}

const RETRYABLE_REASONS = new Set([
  'budget_exhausted_before_cli',
  'socket_absent',
  'timeout',
]);

function normalizeReason(reason: string | null | undefined, exitCode: number | null, status: WarmCliFallbackStatus): string {
  const trimmed = typeof reason === 'string' ? reason.trim() : '';
  if (trimmed) {
    return trimmed
      .replace(/^CLI_RETRYABLE_UNAVAILABLE\s+exit\s+75:\s*/i, '')
      .replace(/^CLI_/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'unknown';
  }
  if (status === 'ok') {
    return 'ok';
  }
  return exitCode === null ? 'exit_unknown' : `exit_${exitCode}`;
}

export function warmCliFallbackEnvelope(input: WarmCliFallbackEnvelopeInput): WarmCliFallbackEnvelope {
  const exitCode = input.exitCode ?? null;
  const reason = normalizeReason(input.reason, exitCode, input.status);
  return {
    status: input.status,
    reason,
    exitCode,
    retryable: input.status !== 'ok' && (input.timedOut === true || exitCode === 75 || RETRYABLE_REASONS.has(reason)),
  };
}
