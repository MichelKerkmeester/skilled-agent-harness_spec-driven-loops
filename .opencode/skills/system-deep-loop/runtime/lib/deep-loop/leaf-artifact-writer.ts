// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: deep-loop read-only-leaf artifact writer                       ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: A codex alignment leaf runs under `--sandbox read-only` so it     ║
// ║          can never edit the tree (no apply_patch, no corruption) — but a   ║
// ║          read-only leaf also cannot Bash-write its own three iteration     ║
// ║          artifacts. It instead emits one JSON object as its final message; ║
// ║          this module parses that message and authors the artifacts on the  ║
// ║          leaf's behalf: the iteration narrative, the appended state-log    ║
// ║          record, and the write-once delta file. The route-proof invariants ║
// ║          are stamped by THIS code from constants, never trusted from the   ║
// ║          model, so the record's identity is authoritative regardless of    ║
// ║          what the leaf reported. Fail-closed: a malformed or incomplete    ║
// ║          message writes NOTHING and reports failure, so the caller redis-  ║
// ║          patches the iteration rather than persisting a partial record.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import {
  appendFileSync,
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS — the route-proof invariants the orchestrator's contract asserts.
//    These are stamped by the writer, never read from the leaf's message.
// ─────────────────────────────────────────────────────────────────────────────

const ROUTE_PROOF = {
  mode: 'alignment',
  target_agent: 'deep-alignment',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=alignment target_agent=deep-alignment',
} as const;

/** Audit fields the leaf MUST report for the reducer to consume the record. */
const REQUIRED_RECORD_FIELDS = [
  'status',
  'laneId',
  'authority',
  'artifactClass',
  'artifactsChecked',
  'findingsCount',
] as const;

const ALLOWED_STATUS = new Set([
  'complete',
  'timeout',
  'error',
  'stuck',
  'insight',
  'thought',
]);
const completedPublicationKeys = new Set<string>();

// ─────────────────────────────────────────────────────────────────────────────
// 2. TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface LeafArtifactContext {
  /** 1-based iteration number for this dispatch. */
  iteration: number;
  /** Absolute or repo-relative path for the iteration narrative markdown. */
  iterationMdPath: string;
  /** Path to the append-only JSONL state log. */
  stateLogPath: string;
  /** Path for the write-once per-iteration delta file. */
  deltaPath: string;
  /** Test-only crash injection at durable publication boundaries. */
  faultInjection?: (stage: LeafPublicationStage) => void;
}

export type LeafPublicationStage =
  | 'staged'
  | 'narrative-published'
  | 'delta-published'
  | 'state-appended'
  | 'cleaned';

export interface LeafArtifactResult {
  ok: boolean;
  /** Present when ok === false: why the message could not be persisted. */
  error?: string;
  /** The final record actually written (ok === true only). */
  record?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MESSAGE PARSING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract the single JSON object the leaf emitted as its final message. Tolerates
 * surrounding prose and a fenced ```json block; prefers the LAST fenced block,
 * then the last balanced top-level object. Returns null when nothing parses.
 */
export function extractLeafPayload(finalMessage: string): Record<string, unknown> | null {
  if (typeof finalMessage !== 'string' || finalMessage.trim() === '') return null;

  // 1) Fenced ```json blocks — take the last one (the leaf's final answer).
  const fenceRe = /```(?:json)?\s*([\s\S]*?)```/gi;
  const fenced: string[] = [];
  for (let m = fenceRe.exec(finalMessage); m !== null; m = fenceRe.exec(finalMessage)) {
    fenced.push(m[1]);
  }
  for (let i = fenced.length - 1; i >= 0; i -= 1) {
    const parsed = tryParseObject(fenced[i]);
    if (parsed) return parsed;
  }

  // 2) Whole message as JSON.
  const whole = tryParseObject(finalMessage);
  if (whole) return whole;

  // 3) Last balanced top-level object: scan from each '{' that could start the
  //    trailing object, taking the widest span that parses.
  const firstBrace = finalMessage.indexOf('{');
  const lastBrace = finalMessage.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const span = tryParseObject(finalMessage.slice(firstBrace, lastBrace + 1));
    if (span) return span;
  }
  return null;
}

function tryParseObject(raw: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(raw.trim());
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECORD ASSEMBLY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merge the leaf-reported state record with the wrapper-owned route-proof
 * invariants and iteration number. The route-proof keys always win, so the
 * record's identity is authoritative no matter what the leaf reported.
 */
export function assembleRecord(
  reported: Record<string, unknown>,
  iteration: number,
): Record<string, unknown> {
  return {
    type: 'iteration',
    ...reported,
    ...ROUTE_PROOF,
    iteration,
  };
}

function validateReported(reported: unknown): string | null {
  if (!reported || typeof reported !== 'object' || Array.isArray(reported)) {
    return 'leaf payload is not a JSON object';
  }
  const rec = reported as Record<string, unknown>;
  const stateRecordValue = rec.stateRecord ?? rec;
  if (!stateRecordValue || typeof stateRecordValue !== 'object' || Array.isArray(stateRecordValue)) {
    return 'invalid field stateRecord: expected an object';
  }
  const stateRecord = stateRecordValue as Record<string, unknown>;
  for (const field of REQUIRED_RECORD_FIELDS) {
    if (!(field in stateRecord)) return `missing required record field: ${field}`;
  }
  if (typeof stateRecord.status !== 'string' || !ALLOWED_STATUS.has(stateRecord.status)) {
    return `invalid field status: expected one of ${[...ALLOWED_STATUS].join(', ')}`;
  }
  for (const field of ['laneId', 'authority', 'artifactClass'] as const) {
    if (typeof stateRecord[field] !== 'string' || stateRecord[field].trim() === '') {
      return `invalid field ${field}: expected a non-empty string`;
    }
  }
  if (!Array.isArray(stateRecord.artifactsChecked)) {
    return 'invalid field artifactsChecked: expected an array of audited paths';
  }
  if (stateRecord.artifactsChecked.some((path) => typeof path !== 'string' || path.trim() === '')) {
    return 'invalid field artifactsChecked: every path must be a non-empty string';
  }
  if (
    typeof stateRecord.findingsCount !== 'number'
    || !Number.isSafeInteger(stateRecord.findingsCount)
    || stateRecord.findingsCount < 0
  ) {
    return 'invalid field findingsCount: expected a non-negative integer';
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NARRATIVE SYNTHESIS (human-facing only; the reducer never parses it)
// ─────────────────────────────────────────────────────────────────────────────

export function synthesizeNarrative(record: Record<string, unknown>): string {
  const checked = Array.isArray(record.artifactsChecked)
    ? (record.artifactsChecked as unknown[])
    : [];
  const details = Array.isArray(record.findingDetails)
    ? (record.findingDetails as Array<Record<string, unknown>>)
    : [];
  const bySeverity = (sev: string) =>
    details.filter((f) => String(f.severity ?? '').toUpperCase() === sev);
  const line = (f: Record<string, unknown>) =>
    `- ${String(f.severity ?? '?')}: ${String(f.summary ?? f.title ?? f.message ?? 'finding')}`;

  const section = (title: string, items: string[]) =>
    `## ${title}\n\n${items.length ? items.join('\n') : '_none_'}\n`;

  return [
    `# Alignment Iteration ${String(record.iteration ?? '?')}`,
    '',
    `- Lane: ${String(record.laneId ?? record.authority ?? '?')}`,
    `- Authority: ${String(record.authority ?? '?')} / ${String(record.artifactClass ?? '?')}`,
    `- Status: ${String(record.status ?? '?')}`,
    `- Findings: ${String(record.findingsCount ?? 0)} (new ratio ${String(record.newFindingsRatio ?? 'n/a')})`,
    '',
    section('Artifacts Checked', checked.map((p) => `- ${String(p)}`)),
    section('Findings - P0', bySeverity('P0').map(line)),
    section('Findings - P1', bySeverity('P1').map(line)),
    section('Findings - P2', bySeverity('P2').map(line)),
    section('Summary', [String(record.findingsSummary ?? '_none_')]),
    `## Next Focus\n\n${String(record.nextFocus ?? 'Resolved by partition-corpus on the next iteration.')}\n`,
    '',
    '_Narrative synthesized by the read-only-leaf writer from the structured iteration record._',
    '',
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Persist the three per-iteration artifacts from a read-only leaf's final
 * message. All-or-nothing: on any parse/validation error NOTHING is written and
 * `ok:false` is returned so the caller can fail the iteration and redispatch.
 */
export function writeLeafArtifacts(
  finalMessage: string,
  ctx: LeafArtifactContext,
): LeafArtifactResult {
  const payload = extractLeafPayload(finalMessage);
  if (!payload) return { ok: false, error: 'no parseable JSON object in leaf final message' };

  // The leaf may nest under `stateRecord` or emit the record fields at top level.
  const reportedRecord = (payload.stateRecord && typeof payload.stateRecord === 'object'
    ? payload.stateRecord
    : payload) as Record<string, unknown>;

  const invalid = validateReported(reportedRecord);
  if (invalid) return { ok: false, error: invalid };

  const record = assembleRecord(reportedRecord, ctx.iteration);

  // Delta lines: the canonical record first, then one finding line each.
  const deltaFindings = Array.isArray(payload.deltaFindings)
    ? (payload.deltaFindings as unknown[])
    : Array.isArray(reportedRecord.findingDetails)
      ? (reportedRecord.findingDetails as Array<Record<string, unknown>>).map((finding) => ({
          type: 'finding',
          laneId: record.laneId,
          finding,
        }))
      : [];

  const narrative = synthesizeNarrative(record);
  const recordLine = `${JSON.stringify(record)}\n`;
  const deltaBody = [recordLine, ...deltaFindings.map((d) => `${JSON.stringify(d)}\n`)].join('');
  const publicationKey = `${ctx.iterationMdPath}\0${ctx.stateLogPath}\0${ctx.deltaPath}\0${recordLine}`;

  try {
    if (completedPublicationKeys.has(publicationKey)) {
      return { ok: false, error: `delta file already exists (write-once): ${ctx.deltaPath}` };
    }
    const recovery = recoverPublication(ctx, narrative, deltaBody, recordLine);
    if (recovery === 'committed') {
      completedPublicationKeys.add(publicationKey);
      return { ok: true, record };
    }
    if (recovery === 'conflict') {
      return { ok: false, error: `delta file already exists (write-once): ${ctx.deltaPath}` };
    }

    ensureDir(ctx.iterationMdPath);
    ensureDir(ctx.deltaPath);
    ensureDir(ctx.stateLogPath);
    if (existsSync(ctx.deltaPath)) {
      return { ok: false, error: `delta file already exists (write-once): ${ctx.deltaPath}` };
    }

    const stageDir = publicationStageDir(ctx);
    mkdirSync(stageDir, { recursive: true });
    durableWrite(join(stageDir, 'iteration.md'), narrative);
    durableWrite(join(stageDir, 'delta.jsonl'), deltaBody);
    durableWrite(join(stageDir, 'record.jsonl'), recordLine);
    durableWrite(join(stageDir, 'manifest.json'), JSON.stringify({ stage: 'staged' }) + '\n');
    invokeFault(ctx, 'staged');

    publishStagedFile(join(stageDir, 'iteration.md'), ctx.iterationMdPath, narrative);
    durableWrite(join(stageDir, 'manifest.json'), JSON.stringify({ stage: 'narrative-published' }) + '\n');
    invokeFault(ctx, 'narrative-published');

    publishStagedFile(join(stageDir, 'delta.jsonl'), ctx.deltaPath, deltaBody);
    durableWrite(join(stageDir, 'manifest.json'), JSON.stringify({ stage: 'delta-published' }) + '\n');
    invokeFault(ctx, 'delta-published');

    if (!stateContainsLine(ctx.stateLogPath, recordLine)) {
      appendDurable(ctx.stateLogPath, recordLine);
    }
    durableWrite(join(stageDir, 'manifest.json'), JSON.stringify({ stage: 'state-appended' }) + '\n');
    invokeFault(ctx, 'state-appended');

    rmSync(stageDir, { recursive: true, force: true });
    invokeFault(ctx, 'cleaned');
    completedPublicationKeys.add(publicationKey);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
  return { ok: true, record };
}

function ensureDir(filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
}

type PublicationRecovery = 'none' | 'committed' | 'conflict';

function publicationStageDir(ctx: LeafArtifactContext): string {
  return `${ctx.deltaPath}.staging-${ctx.iteration}`;
}

function recoverPublication(
  ctx: LeafArtifactContext,
  narrative: string,
  deltaBody: string,
  recordLine: string,
): PublicationRecovery {
  const stageDir = publicationStageDir(ctx);
  const stateCommitted = stateContainsLine(ctx.stateLogPath, recordLine);

  if (!existsSync(stageDir)) {
    if (!stateCommitted) return existsSync(ctx.deltaPath) ? 'conflict' : 'none';
    if (
      existsSync(ctx.iterationMdPath)
      && existsSync(ctx.deltaPath)
      && readFileSync(ctx.iterationMdPath, 'utf8') === narrative
      && readFileSync(ctx.deltaPath, 'utf8') === deltaBody
    ) {
      return 'committed';
    }
    return 'conflict';
  }

  const stagedNarrativePath = join(stageDir, 'iteration.md');
  const stagedDeltaPath = join(stageDir, 'delta.jsonl');
  const stagedRecordPath = join(stageDir, 'record.jsonl');
  if (!existsSync(stagedNarrativePath) || !existsSync(stagedDeltaPath) || !existsSync(stagedRecordPath)) {
    rmSync(stageDir, { recursive: true, force: true });
    return stateCommitted ? 'conflict' : 'none';
  }

  const stagedRecord = readFileSync(stagedRecordPath, 'utf8');
  if (stagedRecord !== recordLine) {
    if (stateCommitted) return 'conflict';
    removeOwnedArtifact(ctx.iterationMdPath, readFileSync(stagedNarrativePath, 'utf8'));
    removeOwnedArtifact(ctx.deltaPath, readFileSync(stagedDeltaPath, 'utf8'));
    rmSync(stageDir, { recursive: true, force: true });
    return existsSync(ctx.deltaPath) ? 'conflict' : 'none';
  }

  if (stateCommitted) {
    publishStagedFile(stagedNarrativePath, ctx.iterationMdPath, narrative);
    publishStagedFile(stagedDeltaPath, ctx.deltaPath, deltaBody);
    rmSync(stageDir, { recursive: true, force: true });
    return 'committed';
  }

  removeOwnedArtifact(ctx.iterationMdPath, readFileSync(stagedNarrativePath, 'utf8'));
  removeOwnedArtifact(ctx.deltaPath, readFileSync(stagedDeltaPath, 'utf8'));
  rmSync(stageDir, { recursive: true, force: true });
  return existsSync(ctx.deltaPath) ? 'conflict' : 'none';
}

function stateContainsLine(path: string, expectedLine: string): boolean {
  if (!existsSync(path)) return false;
  return readFileSync(path, 'utf8').split(/\r?\n/u).some((line) => `${line}\n` === expectedLine);
}

function durableWrite(path: string, content: string): void {
  writeFileSync(path, content, 'utf8');
  fsyncPath(path);
}

function appendDurable(path: string, content: string): void {
  ensureDir(path);
  let fd: number | undefined;
  try {
    fd = openSync(path, 'a');
    appendFileSync(fd, content, 'utf8');
    fsyncSync(fd);
  } finally {
    if (typeof fd === 'number') closeSync(fd);
  }
  fsyncDirectory(dirname(path));
}

function publishStagedFile(sourcePath: string, targetPath: string, expected: string): void {
  ensureDir(targetPath);
  if (existsSync(targetPath)) {
    if (readFileSync(targetPath, 'utf8') !== expected) {
      throw new Error(`publication target already exists with different content: ${targetPath}`);
    }
    return;
  }
  const tempPath = `${targetPath}.tmp.${process.pid}.${Date.now()}`;
  durableWrite(tempPath, readFileSync(sourcePath, 'utf8'));
  renameSync(tempPath, targetPath);
  fsyncDirectory(dirname(targetPath));
}

function removeOwnedArtifact(path: string, expected: string): void {
  if (existsSync(path) && readFileSync(path, 'utf8') === expected) {
    rmSync(path, { force: true });
  }
}

function fsyncPath(path: string): void {
  const fd = openSync(path, 'r');
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

function fsyncDirectory(path: string): void {
  const fd = openSync(path, 'r');
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

function invokeFault(ctx: LeafArtifactContext, stage: LeafPublicationStage): void {
  ctx.faultInjection?.(stage);
}

// Exported for tests / diagnostics.
export const __internals = { tryParseObject, validateReported, ROUTE_PROOF, REQUIRED_RECORD_FIELDS };
