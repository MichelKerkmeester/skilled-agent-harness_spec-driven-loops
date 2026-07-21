// ──────────────────────────────────────────────────────────────────
// MODULE: Legacy Fan-Out Shadow Projection
// ─────────────────────────────────────────────────────────────────

import { sha256Bytes } from '../event-envelope/index.js';

import type { JsonObject, JsonValue } from '../event-envelope/index.js';

/** Parse ephemeral stdout with the shipped sweep's text-part and raw fallback rules. */
export function extractLegacyShadowText(stdout: string | null): string | null {
  if (typeof stdout !== 'string' || stdout.trim() === '') return null;
  const chunks: string[] = [];
  for (const line of stdout.split('\n')) {
    try {
      const parsed = JSON.parse(line) as Record<string, unknown>;
      if (parsed.type === 'text'
        && parsed.part
        && typeof parsed.part === 'object'
        && typeof (parsed.part as Record<string, unknown>).text === 'string') {
        chunks.push((parsed.part as Record<string, string>).text);
      }
    } catch {
      // Non-JSON stdout remains eligible for the bounded raw fallback.
    }
  }
  const extracted = chunks.join('').slice(0, 50_000);
  if (extracted.trim() !== '') return extracted;
  return stdout.trim().length > 50 ? stdout.slice(0, 50_000) : null;
}

export interface LegacySalvageShadow {
  readonly failed: number;
  readonly fragments: readonly {
    readonly byteIdenticalOriginal: false;
    readonly bytesRecovered: number;
    readonly iteration: number;
    readonly marker: 'fanout_salvage_failed' | 'salvaged_from_stdout';
    readonly sourceKind: 'captured_stdout';
    readonly sourceReference: string;
  }[];
  readonly salvaged: number;
}

export function projectLegacySalvageShadow(input: Readonly<{
  capturedStdout: string | null;
  existingIterations: readonly number[];
  stateRecords: readonly JsonObject[];
  stdoutReference: string;
}>): LegacySalvageShadow {
  const existing = new Set(input.existingIterations);
  const text = extractLegacyShadowText(input.capturedStdout);
  const iterations = input.stateRecords
    .filter((record) => record.type === 'iteration' && Number.isSafeInteger(record.iteration))
    .map((record) => Number(record.iteration))
    .filter((iteration) => !existing.has(iteration));
  const fragments = iterations.map((iteration) => ({
    byteIdenticalOriginal: false as const,
    bytesRecovered: text === null ? 0 : text.length,
    iteration,
    marker: text === null ? 'fanout_salvage_failed' as const : 'salvaged_from_stdout' as const,
    sourceKind: 'captured_stdout' as const,
    sourceReference: input.stdoutReference,
  }));
  return Object.freeze({
    failed: fragments.filter((fragment) => fragment.marker === 'fanout_salvage_failed').length,
    fragments: Object.freeze(fragments),
    salvaged: fragments.filter((fragment) => fragment.marker === 'salvaged_from_stdout').length,
  });
}

export interface LegacyFailureShadow {
  readonly exit_code: number | null;
  readonly failure_class: 'artifact_miss' | 'exit' | 'salvage_miss' | 'timeout';
  readonly retry_verdict: 'fatal' | 'transient';
  readonly retryable: boolean;
  readonly salvage: { readonly failed: number; readonly salvaged: number } | null;
  readonly timed_out: boolean;
}

export function classifyLegacyFailureShadow(input: Readonly<{
  exitCode: number | null;
  salvage: { readonly failed: number; readonly salvaged: number } | null;
  timedOut: boolean;
}>): LegacyFailureShadow {
  const normalizedExitCode = Number.isFinite(Number(input.exitCode))
    ? Math.trunc(Number(input.exitCode))
    : null;
  let failureClass: LegacyFailureShadow['failure_class'] = 'exit';
  if (input.timedOut) failureClass = 'timeout';
  else if (input.salvage && input.salvage.failed > 0 && input.salvage.salvaged === 0) {
    failureClass = 'salvage_miss';
  } else if (input.salvage && input.salvage.failed > 0) {
    failureClass = 'artifact_miss';
  }
  const retryable = failureClass !== 'exit';
  return Object.freeze({
    exit_code: normalizedExitCode,
    failure_class: failureClass,
    retry_verdict: retryable ? 'transient' : 'fatal',
    retryable,
    salvage: input.salvage === null ? null : { ...input.salvage },
    timed_out: input.timedOut,
  });
}

function firstText(values: readonly unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const record = value as Record<string, unknown>;
      const nested = firstText([
        record.title, record.summary, record.text, record.finding, record.description,
      ]);
      if (nested) return nested;
    }
  }
  return '';
}

function researchCandidates(record: JsonObject): JsonValue[] {
  if (record.type !== 'iteration') return [];
  const structured = [record.keyFindings, record.findings, record.findingDetails]
    .find((value) => Array.isArray(value) && value.length > 0);
  if (Array.isArray(structured)) return structured;
  const findingsCount = Number(record.findingsCount);
  if (!Number.isFinite(findingsCount) || findingsCount <= 0) return [];
  const runValue = Number(record.run ?? record.iteration);
  const run = Number.isFinite(runValue) ? Math.floor(runValue) : 0;
  const narrative = firstText([
    record.summary,
    record.findingsSummary,
    record.focus,
    record.nextFocus,
    record.reflection,
  ]);
  return [{
    id: `state-finding-${run}-1-${sha256Bytes(Buffer.from(narrative || String(run))).slice(0, 12)}`,
    title: narrative || `Iteration ${run} recorded ${Math.floor(findingsCount)} finding(s)`,
    summary: narrative || `State log recorded ${Math.floor(findingsCount)} finding(s) but no structured finding text.`,
    addedAtIteration: run,
  }];
}

function normalizeResearchCandidate(
  candidate: JsonValue,
  record: JsonObject,
  index: number,
): JsonObject | null {
  const runValue = Number(record.run ?? record.iteration);
  const run = Number.isFinite(runValue) ? Math.floor(runValue) : 0;
  if (typeof candidate === 'string') {
    const text = candidate.trim();
    if (!text) return null;
    return {
      id: `state-finding-${run}-${index + 1}-${sha256Bytes(Buffer.from(text)).slice(0, 12)}`,
      title: text,
      text,
      addedAtIteration: run,
      _reconstructed_from_state: true,
    };
  }
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null;
  const text = firstText([
    candidate.title,
    candidate.summary,
    candidate.text,
    candidate.finding,
    candidate.description,
  ]);
  if (!text) return null;
  return {
    id: candidate.id
      ?? candidate.findingId
      ?? `state-finding-${run}-${index + 1}-${sha256Bytes(Buffer.from(text)).slice(0, 12)}`,
    title: candidate.title ?? text,
    ...(candidate.summary ? { summary: candidate.summary } : {}),
    ...(candidate.text ? { text: candidate.text } : { text }),
    ...(candidate.confidence ? { confidence: candidate.confidence } : {}),
    addedAtIteration: candidate.addedAtIteration ?? run,
    _reconstructed_from_state: true,
  };
}

/** Preserve the minimal state-log registry facts consumed by the shipped merge. */
export function reconstructLegacyRegistryShadow(
  loopType: 'research' | 'review',
  stateRecords: readonly JsonObject[],
  lineage: string,
): JsonObject | null {
  if (loopType === 'review') {
    const openFindings: JsonObject[] = [];
    const resolvedFindings: JsonObject[] = [];
    for (const record of stateRecords) {
      if (record.type !== 'iteration' || !Array.isArray(record.findingDetails)) continue;
      for (const value of record.findingDetails) {
        if (!value || Array.isArray(value) || typeof value !== 'object') continue;
        const detail = value as JsonObject;
        const id = firstText([detail.id, detail.findingId, detail.title]);
        if (!id) continue;
        const active = (detail.disposition ?? detail.status ?? 'active') === 'active';
        const mapped: JsonObject = {
          findingId: id,
          title: firstText([detail.title, id]),
          severity: firstText([detail.severity, 'P2']),
          status: active ? 'active' : 'resolved',
          ...(detail.dimension ? { dimension: detail.dimension } : {}),
          ...(detail.file ? { file: detail.file } : {}),
          ...(detail.recommendation ? { recommendation: detail.recommendation } : {}),
          _lineages: [lineage],
          _reconstructed_from_state: true,
        };
        (active ? openFindings : resolvedFindings).push(mapped);
      }
    }
    if (openFindings.length === 0 && resolvedFindings.length === 0) return null;
    return {
      openFindings,
      resolvedFindings,
      findingsBySeverity: {
        P0: openFindings.filter((finding) => finding.severity === 'P0').length,
        P1: openFindings.filter((finding) => finding.severity === 'P1').length,
        P2: openFindings.filter((finding) => finding.severity === 'P2').length,
      },
      _reconstructed: true,
    };
  }
  const keyFindings: JsonObject[] = [];
  for (const record of stateRecords) {
    researchCandidates(record).forEach((candidate, index) => {
      const mapped = normalizeResearchCandidate(candidate, record, index);
      if (mapped) keyFindings.push({ ...mapped, _lineages: [lineage] });
    });
  }
  if (keyFindings.length === 0) return null;
  const iterations = stateRecords.filter((record) => record.type === 'iteration');
  const latest = iterations.at(-1);
  return {
    keyFindings,
    openQuestions: [],
    resolvedQuestions: [],
    ruledOutDirections: [],
    metrics: {
      iterationsCompleted: iterations.length,
      openQuestions: 0,
      resolvedQuestions: 0,
      keyFindings: keyFindings.length,
      convergenceScore: latest?.convergenceSignals
        && typeof latest.convergenceSignals === 'object'
        && !Array.isArray(latest.convergenceSignals)
        ? (latest.convergenceSignals as JsonObject).compositeStop ?? latest.newInfoRatio ?? 0
        : latest?.newInfoRatio ?? 0,
      coverageBySources: {},
    },
    _reconstructed: true,
  };
}

export function projectLegacyAttribution(input: Readonly<{
  kind: string | null;
  label: string;
  model: string | null;
  registry: JsonObject | null;
  stateRecords: readonly JsonObject[];
}>): JsonObject {
  const severity = input.registry?.findingsBySeverity;
  const verdict = severity && typeof severity === 'object' && !Array.isArray(severity)
    ? Number((severity as JsonObject).P0) > 0
      ? 'FAIL'
      : Number((severity as JsonObject).P1) > 0
        ? 'CONDITIONAL'
        : 'PASS'
    : 'n/a';
  return {
    label: input.label,
    kind: input.kind ?? 'unknown',
    model: input.model ?? 'default',
    iterations: input.stateRecords.filter((record) => record.type === 'iteration').length,
    convergence: input.registry?.metrics && typeof input.registry.metrics === 'object'
      && !Array.isArray(input.registry.metrics)
      ? (input.registry.metrics as JsonObject).convergenceScore ?? 'n/a'
      : input.registry?.convergenceScore ?? 'n/a',
    salvaged: input.stateRecords.filter((record) =>
      record.type === 'event' && record.event === 'salvaged_from_stdout').length,
    verdict,
  };
}
