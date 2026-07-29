// ───────────────────────────────────────────────────────────────
// MODULE: Session Health Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for session_health — reports session
// readiness, code graph freshness, and priming status.

import {
  isSessionPrimed,
  getSessionTimestamps,
  getLastActiveSessionId,
} from '../hooks/memory-surface.js';

import { computeQualityScore, getLastToolCallAt } from '../lib/session/context-metrics.js';
import type { QualityScore } from '../lib/session/context-metrics.js';
import {
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  trustStateFromStructuralStatus,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
  type SharedPayloadTrustState,
} from '../lib/context/shared-payload.js';
import { getLastSpecMemoryCliFallbackStatus, type LastSpecMemoryCliFallbackStatus } from '../hooks/spec-memory-cli-fallback.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

type SessionStatus = 'ok' | 'warning' | 'stale';
// Section-level trust state reuses the canonical
// SharedPayloadTrustState vocabulary ('live' / 'stale' / 'absent' /
// 'unavailable'). Keeping the alias narrows to just the four states
// session-health observes (it never emits 'cached'/'imported'/etc.).
type SessionHealthSectionTrustState = Extract<
  SharedPayloadTrustState,
  'live' | 'stale' | 'absent' | 'unavailable'
>;

interface SessionHealthDetails {
  sessionAgeMs: number;
  lastToolCallAgoMs: number;
  specFolder: string | null;
  primingStatus: 'primed' | 'not_primed';
  specMemoryCliFallback: LastSpecMemoryCliFallbackStatus | null;
}

interface SessionHealthSectionStructuralTrust {
  state: SessionHealthSectionTrustState;
  trustedAt: string;
}

interface SessionHealthSection {
  key: string;
  title: string;
  content: string;
  source: SharedPayloadSection['source'];
  structuralTrust: SessionHealthSectionStructuralTrust;
}

interface SessionHealthResult {
  status: SessionStatus;
  details: SessionHealthDetails;
  qualityScore: QualityScore;
  sections: SessionHealthSection[];
  payloadContract?: SharedPayloadEnvelope;
  hints: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const SIXTY_MINUTES_MS = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function getSessionSectionTrustState(status: SessionStatus): SessionHealthSectionTrustState {
  return status === 'ok' ? 'live' : 'stale';
}

function createSectionStructuralTrust(
  state: SessionHealthSectionTrustState,
  trustedAt: string | null | undefined,
  observedAt: string,
): SessionHealthSectionStructuralTrust {
  return {
    state,
    trustedAt: trustedAt ?? observedAt,
  };
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_health tool call */
export async function handleSessionHealth(): Promise<MCPResponse> {
  const now = Date.now();
  const { serverStartedAt } = getSessionTimestamps();
  // Use context-metrics as single source of truth for lastToolCallAt
  // to eliminate dual-state drift with memory-surface's separate timestamp.
  const metricsLastToolCall = getLastToolCallAt();
  const lastToolCallAt = metricsLastToolCall ?? serverStartedAt;
  const primingSessionId = getLastActiveSessionId();
  const primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;

  // Wire specFolder from context-metrics (fixes P1: dead field)
  let specFolder: string | null = null;
  try {
    const { getSessionMetrics } = await import('../lib/session/context-metrics.js');
    specFolder = getSessionMetrics().currentSpecFolder;
  } catch { /* metrics module may not be loaded */ }
  const sessionAgeMs = now - serverStartedAt;
  const lastToolCallAgoMs = now - lastToolCallAt;
  const observedAt = new Date(now).toISOString();
  const specMemoryCliFallback = getLastSpecMemoryCliFallbackStatus();

  // Status determination logic
  let status: SessionStatus;
  if (!primed || lastToolCallAgoMs > SIXTY_MINUTES_MS) {
    status = 'stale';
  } else if (lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
    status = 'warning';
  } else {
    status = 'ok';
  }

  // Build human-readable hints
  const hints: string[] = [];
  if (!primed) {
    hints.push('Session has not been primed yet. Make any tool call to trigger auto-priming.');
  }
  if (lastToolCallAgoMs > SIXTY_MINUTES_MS) {
    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
  } else if (lastToolCallAgoMs > FIFTEEN_MINUTES_MS) {
    hints.push('No tool calls in >15 min. Session context may be drifting.');
  }

  // Compute quality score from context metrics
  const qualityScore = computeQualityScore();
  const sessionHealthContent = `status=${status}; priming=${primed ? 'primed' : 'not_primed'}; specFolder=${specFolder ?? 'none'}`;
  const fallbackContent = specMemoryCliFallback
    ? `status=${specMemoryCliFallback.status}; reason=${specMemoryCliFallback.reason ?? 'none'}; exit=${specMemoryCliFallback.exitCode ?? 'none'}; retryable=${specMemoryCliFallback.retryable}`
    : 'status=none';
  const qualityScoreContent = `level=${qualityScore.level}; score=${qualityScore.score}`;

  const payloadContract = createSharedPayloadEnvelope({
    kind: 'health',
    sections: [
      {
        key: 'session-health',
        title: 'Session Health',
        content: sessionHealthContent,
        source: 'session',
      },
      {
        key: 'quality-score',
        title: 'Quality Score',
        content: qualityScoreContent,
        source: 'operational',
      },
      {
        key: 'spec-memory-cli-fallback',
        title: 'Spec Memory CLI Fallback',
        content: fallbackContent,
        source: 'operational',
      },
    ],
    summary: `Session health is ${status}`,
    provenance: {
      producer: 'session_health',
      sourceSurface: 'session_health',
      // No structural index remains to derive trust from.
      trustState: 'absent',
      generatedAt: new Date().toISOString(),
      lastUpdated: null,
      sourceRefs: ['memory-surface', 'context-metrics', 'session-snapshot'],
    },
  });
  const sessionTrustedAt = new Date(lastToolCallAt).toISOString();
  const sections: SessionHealthSection[] = [
    {
      key: 'session-health',
      title: 'Session Health',
      content: sessionHealthContent,
      source: 'session',
      structuralTrust: createSectionStructuralTrust(
        getSessionSectionTrustState(status),
        sessionTrustedAt,
        observedAt,
      ),
    },
    {
      key: 'quality-score',
      title: 'Quality Score',
      content: qualityScoreContent,
      source: 'operational',
      structuralTrust: createSectionStructuralTrust('live', observedAt, observedAt),
    },
    {
      key: 'spec-memory-cli-fallback',
      title: 'Spec Memory CLI Fallback',
      content: fallbackContent,
      source: 'operational',
      structuralTrust: createSectionStructuralTrust(
        specMemoryCliFallback ? 'live' : 'absent',
        specMemoryCliFallback?.observedAt ?? observedAt,
        observedAt,
      ),
    },
  ];

  const result: SessionHealthResult = {
    status,
    details: {
      sessionAgeMs,
      lastToolCallAgoMs,
      specFolder,
      primingStatus: primed ? 'primed' : 'not_primed',
      specMemoryCliFallback,
    },
    qualityScore,
    sections,
    payloadContract,
    hints,
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}
