#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: PreCompact Hook — Compact Inject
// ───────────────────────────────────────────────────────────────────
// Runs on Claude Code PreCompact event. Precomputes critical context
// using the merge pipeline (Memory, Code Graph, session state)
// and caches to hook state for later injection by SessionStart hook.
// stdout is NOT injected on PreCompact — we only cache here.

import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { closeSync, fstatSync, openSync, readSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, isAbsolute, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseHookStdin, hookLog,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET, getRequiredSessionId,
} from './shared.js';
import {
  HISTORY_LOCATOR_KINDS,
  HISTORY_LOCATOR_VERSION,
  detectHistoryRuntime,
  ensureStateDir,
  updateState,
  type HistoryLocator,
  type HistoryLocatorRuntime,
} from './hook-state.js';
import { mergeCompactBrief, type MergeInput } from '@spec-kit/shared/compact-merger';
import {
  createSharedPayloadEnvelope,
  createPreMergeSelectionMetadata,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
} from '../../lib/context/shared-payload.js';
import {
  CANONICAL_FOLD_VERSION,
  getUnicodeRuntimeFingerprint,
} from '@spec-kit/shared/unicode-normalization';
import { refreshAuthoredContinuitySnapshot } from '../../lib/continuity/authored-continuity-snapshot.js';
import { historyHandle, persistHistoryLocator } from '../lib/history/locator-digest.js';
import { placeLookup } from '../lib/history/lookup-offer.js';
import { notifyDirectiveLifecycleBoundary } from './directive-lifecycle-boundary.js';
import { isMainModule } from '../../lib/esm-entry.js';
import { readHookStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';

const require = createRequire(import.meta.url);

function sessionLifecycleHookEnabled(): boolean {
  try {
    const { isHookEnabled } = require(
      fileURLToPath(new URL('../../../../../../hooks/shared/hook-flags.cjs', import.meta.url)),
    );
    return typeof isHookEnabled !== 'function' || isHookEnabled('session-lifecycle') !== false;
  } catch {
    return true;
  }
}

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const COMPACT_FEEDBACK_GUARDS = [
  /^\s*\[SOURCE:\s*hook-cache/i,
  /^\s*\[PROVENANCE:/i,
  /^\s*\[\/SOURCE\]/i,
  /^\s*##\s+Recovered Context/i,
  /^\s*##\s+Recovery Instructions/i,
  /\bauto-recovered\b/i,
];
const TAIL_READ_CHUNK_BYTES = 64 * 1024;
const MAX_TAIL_READ_BYTES = 1024 * 1024;
const PERSISTENCE_MARGIN_MS = 150;
const MIN_OPTIONAL_BUDGET_MS = 50;
const SNAPSHOT_STDIO_BYTES = 64 * 1024;

// ───────────────────────────────────────────────────────────────────
// HISTORY LOCATOR
// ───────────────────────────────────────────────────────────────────

function transcriptBelongsToSession(
  runtime: HistoryLocatorRuntime,
  transcriptPath: string,
  sessionId: string,
): boolean {
  const fileName = basename(transcriptPath);
  if (!fileName.endsWith('.jsonl')) return false;
  if (fileName === `${sessionId}.jsonl`) return true;
  // A Codex rollout names its session as the trailing path segment.
  return runtime === 'codex' && fileName.endsWith(`-${sessionId}.jsonl`);
}

/**
 * Mint the opaque locator for the transcript this hook was handed.
 *
 * Only the basename shape (does it name this session?) and the file's existence
 * are checked here; the path is not tested against the runtime's session store.
 * The full path is then discarded: only a digest survives, so recovery never
 * trusts a model-authored path. Store containment belongs to the read-only
 * lookup that redeems the locator: it resolves the transcript under the runtime
 * store and recomputes the handle from that path, so this mint costs no second
 * transcript read.
 */
export function mintHistoryLocator(input: {
  sessionId: string;
  transcriptPath: unknown;
  workspace: string;
  runtime: HistoryLocatorRuntime;
  mintedAt?: string;
}): HistoryLocator | null {
  const sessionId = input.sessionId.trim();
  if (!sessionId || /[/\\\0]/.test(sessionId)) return null;
  if (typeof input.transcriptPath !== 'string' || input.transcriptPath.trim().length === 0) return null;
  const transcriptPath = input.transcriptPath.trim();
  const sessionFolder = input.workspace.trim();
  if (!sessionFolder) return null;
  // Keyed by the checkout root above the session folder, where the printed
  // command runs; a folder no root can serve gets no locator.
  const placement = placeLookup(sessionFolder);
  if (!placement) return null;
  if (!transcriptBelongsToSession(input.runtime, transcriptPath, sessionId)) return null;
  try {
    if (!statSync(transcriptPath).isFile()) return null;
  } catch {
    return null;
  }

  const locatorKind = HISTORY_LOCATOR_KINDS[input.runtime];
  const mintedAt = input.mintedAt ?? new Date().toISOString();
  const identity = { runtime: input.runtime, sessionId, ...placement, locatorKind };
  return {
    version: HISTORY_LOCATOR_VERSION,
    ...identity,
    handle: historyHandle(identity, transcriptPath),
    mintedAt,
    provenance: {
      source: 'precompact',
      capturedAt: mintedAt,
    },
  };
}

function stampHistoryLocator(
  historyLocator: HistoryLocator | null,
  timestamp: string,
): HistoryLocator | null {
  if (!historyLocator) return null;
  return {
    ...historyLocator,
    mintedAt: timestamp,
    provenance: { ...historyLocator.provenance, capturedAt: timestamp },
  };
}

// ───────────────────────────────────────────────────────────────────
// 2. TRANSCRIPT EXTRACTION HELPERS
// ───────────────────────────────────────────────────────────────────

/** Extract the last N lines from a file */
export function tailFile(filePath: string, lines: number): string[] {
  if (!Number.isInteger(lines) || lines <= 0) return [];
  let fileDescriptor: number | null = null;
  try {
    fileDescriptor = openSync(filePath, 'r');
    const { size } = fstatSync(fileDescriptor);
    if (size === 0) return [];

    const chunks: Buffer[] = [];
    let bytesCollected = 0;
    let newlineCount = 0;
    while (
      bytesCollected < size
      && bytesCollected < MAX_TAIL_READ_BYTES
      && newlineCount <= lines
    ) {
      const bytesToRead = Math.min(
        TAIL_READ_CHUNK_BYTES,
        size - bytesCollected,
        MAX_TAIL_READ_BYTES - bytesCollected,
      );
      const startPosition = size - bytesCollected - bytesToRead;
      const buffer = Buffer.allocUnsafe(bytesToRead);
      const bytesRead = readSync(fileDescriptor, buffer, 0, bytesToRead, startPosition);
      if (bytesRead <= 0) break;
      const chunk = buffer.subarray(0, bytesRead);
      chunks.unshift(chunk);
      bytesCollected += bytesRead;
      for (const byte of chunk) {
        if (byte === 0x0a) newlineCount += 1;
      }
    }

    const readStart = size - bytesCollected;
    const allLines = Buffer.concat(chunks, bytesCollected).toString('utf-8').split('\n');
    if (readStart > 0) allLines.shift();
    if (allLines.at(-1) === '') allLines.pop();
    return allLines.slice(-lines);
  } catch {
    return [];
  } finally {
    if (fileDescriptor !== null) closeSync(fileDescriptor);
  }
}

/**
 * A whole path token: every directory segment plus a file name with an
 * extension. The first segment is part of the match, so a path that starts
 * with a dot directory (`./`, `../` or `.skilled`) is not cut to its tail.
 */
const PATH_TOKEN_PATTERN = String.raw`(?:\.{0,2}\/)?(?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+\.[A-Za-z0-9]+`;

/**
 * Render an absolute path relative to the project when it lives underneath it,
 * and keep it absolute otherwise. A path already written relative is left as
 * written: resolving it against a process directory the transcript may not
 * share would invent a location the transcript never named.
 */
function normalizeFilePath(candidate: string, projectRoot: string): string {
  if (!isAbsolute(candidate)) {
    return candidate.startsWith('./') ? candidate.slice(2) : candidate;
  }
  const rootRelative = relative(projectRoot, candidate);
  const insideRoot = rootRelative.length > 0
    && rootRelative !== '..'
    && !rootRelative.startsWith(`..${sep}`)
    && !isAbsolute(rootRelative);
  return insideRoot ? rootRelative.split(sep).join('/') : candidate;
}

/**
 * Drop a path that is only the tail of a longer one, such as a fragment quoted
 * from an earlier brief alongside the full path it came from.
 */
function dropPathFragments(paths: string[]): string[] {
  return paths.filter((candidate) => !paths.some(
    (other) => other !== candidate && other.endsWith(`/${candidate}`),
  ));
}

/** Extract whole file paths mentioned in transcript lines */
function extractFilePaths(lines: string[], projectRoot: string = process.cwd()): string[] {
  const pathRegex = new RegExp(`(?:^|[^A-Za-z0-9_./\\\\-])(${PATH_TOKEN_PATTERN})`, 'g');
  const paths = new Set<string>();
  for (const line of lines) {
    for (const match of line.matchAll(pathRegex)) {
      paths.add(normalizeFilePath(match[1], projectRoot));
    }
  }
  return dropPathFragments([...paths]).slice(0, 20);
}

/** Extract topics from recent transcript content */
function extractTopics(lines: string[]): string[] {
  const topics = new Set<string>();
  for (const line of lines) {
    const specMatch = line.match(/specs\/[\w-]+/g);
    if (specMatch) specMatch.forEach(m => topics.add(m));
  }
  return [...topics].slice(0, 10);
}

function stripRecoveredCompactLines(lines: string[]): string[] {
  return lines.filter((line) => !COMPACT_FEEDBACK_GUARDS.some((guard) => guard.test(line)));
}

/**
 * Identifiers that are only prose capitalized by a sentence start, a heading or
 * an existing brief. They never name a code topic, so frequency alone must not
 * promote them. Runtime globals stay here too because a stray `String(` says
 * nothing about what the session is working on.
 */
const ATTENTION_NOISE = new Set([
  'error', 'string', 'object', 'array', 'promise', 'buffer', 'date', 'map',
  'set', 'number', 'boolean', 'function', 'regexp', 'json', 'math',
  'console', 'process', 'undefined', 'null',
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'than', 'that', 'this',
  'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'has',
  'have', 'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could',
  'should', 'may', 'might', 'must', 'in', 'on', 'at', 'to', 'of', 'for',
  'with', 'from', 'by', 'as', 'into', 'over', 'under', 'after', 'before',
  'when', 'where', 'while', 'which', 'who', 'whom', 'whose', 'why', 'how',
  'not', 'no', 'yes', 'all', 'any', 'both', 'each', 'every', 'some', 'many',
  'most', 'more', 'less', 'other', 'another', 'same', 'new', 'old', 'good',
  'bad', 'best', 'worst', 'users', 'development', 'fixed', 'result',
  'results', 'summary', 'update', 'updates', 'updated', 'added', 'removed',
  'changed', 'readme', 'read', 'write', 'edit', 'run', 'saw', 'see', 'use',
  'used', 'using', 'make', 'made', 'get', 'got', 'keep', 'kept', 'add',
  'remove', 'check', 'test', 'reference', 'message', 'content', 'passed',
  'failed', 'pass', 'fail', 'success', 'failure', 'unknown', 'none', 'true',
  'false', 'ok',
]);

/** Extract most-referenced identifiers from transcript lines (top 10 by frequency) */
function extractAttentionSignals(lines: string[]): string[] {
  const freq = new Map<string, number>();
  // camelCase function calls: e.g. buildMergedContext(
  const funcRe = /\b([a-z][a-zA-Z0-9]{2,})\s*\(/g;
  // PascalCase class/interface names: e.g. MergeInput, OutputSection
  const classRe = /\b([A-Z][a-zA-Z0-9]{2,})\b/g;
  const pathSpanRe = new RegExp(PATH_TOKEN_PATTERN, 'g');

  for (const line of lines) {
    // A directory named like a symbol is a location, not a topic.
    const prose = line.replace(pathSpanRe, ' ');
    let m: RegExpExecArray | null;
    funcRe.lastIndex = 0;
    while ((m = funcRe.exec(prose)) !== null) {
      const id = m[1];
      if (!ATTENTION_NOISE.has(id.toLowerCase()) && id.length <= 60) {
        freq.set(id, (freq.get(id) ?? 0) + 1);
      }
    }
    classRe.lastIndex = 0;
    while ((m = classRe.exec(prose)) !== null) {
      const id = m[1];
      if (!ATTENTION_NOISE.has(id.toLowerCase()) && id.length <= 60) {
        freq.set(id, (freq.get(id) ?? 0) + 1);
      }
    }
  }
  return [...freq.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => `- ${id} (referenced ${count}x)`);
}

/** Detect active spec folder paths from transcript lines */
export function detectSpecFolder(lines: string[]): string | null {
  const specFolderRe = /(?:\.opencode\/)?specs\/[^\s"'`]+/g;
  const freq = new Map<string, number>();
  for (const line of lines) {
    const matches = line.match(specFolderRe);
    if (matches) {
      for (const m of matches) {
        const candidate = m.replace(/[),.;:!?]+$/u, '');
        const folder = candidate.replace(/\/[^/]+\.[A-Za-z0-9]+$/u, '');
        freq.set(folder, (freq.get(folder) ?? 0) + 1);
      }
    }
  }
  if (freq.size === 0) return null;
  // Return the most-referenced spec folder
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function authoredSnapshotEnabled(input: Record<string, unknown>): boolean {
  return input.authored_continuity_snapshot === true
    || input.continuity_snapshot === 'authored'
    || process.env.SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT === '1';
}

/**
 * A sub-agent or fork payload carries its own agent id next to the parent's
 * session id, so `session_id` alone cannot tell the two apart.
 */
export function isSubagentPayload(input: unknown): boolean {
  if (typeof input !== 'object' || input === null) return false;
  const agentId = (input as Record<string, unknown>).agent_id;
  return typeof agentId === 'string' && agentId.trim().length > 0;
}

/** Build compact context from transcript analysis (legacy fallback) */
export function buildCompactContext(transcriptLines: string[]): string {
  const filePaths = extractFilePaths(transcriptLines);
  const topics = extractTopics(transcriptLines);
  const sections: string[] = [];

  if (filePaths.length > 0) {
    sections.push('## Active Files\n' + filePaths.map(p => `- ${p}`).join('\n'));
  }
  if (topics.length > 0) {
    sections.push('## Recent Topics\n' + topics.map(t => `- ${t}`).join('\n'));
  }

  const meaningfulLines = transcriptLines
    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
    .slice(-5);
  if (meaningfulLines.length > 0) {
    sections.push('## Recent Context\n' + meaningfulLines.join('\n'));
  }

  return sections.join('\n\n');
}

// ───────────────────────────────────────────────────────────────────
// 3. BUDGET RENDERING
// ───────────────────────────────────────────────────────────────────

export interface CompactResult {
  text: string;
  payloadContract: SharedPayloadEnvelope;
}

function remainingMs(deadline: number, reserveMs: number = 0): number {
  return Math.max(0, Math.floor(deadline - performance.now() - reserveMs));
}

function renderBudgetedSections(
  sections: SharedPayloadSection[],
  maxTokens: number,
): { text: string; sections: SharedPayloadSection[] } {
  const maxChars = maxTokens * 4;
  const rendered: string[] = [];
  const retained: SharedPayloadSection[] = [];
  let usedChars = 0;

  for (const section of sections) {
    const separator = rendered.length > 0 ? '\n\n' : '';
    const heading = `## ${section.title}\n`;
    const availableContentChars = maxChars - usedChars - separator.length - heading.length;
    if (availableContentChars <= 0) break;

    let content = section.content;
    let wasTruncated = false;
    if (content.length > availableContentChars) {
      const marker = '\n[...truncated to fit token budget]';
      content = marker.length >= availableContentChars
        ? content.slice(0, availableContentChars)
        : `${content.slice(0, availableContentChars - marker.length).trimEnd()}${marker}`;
      wasTruncated = true;
    }
    if (!content.trim()) break;

    rendered.push(`${heading}${content}`);
    retained.push({ ...section, content });
    usedChars += separator.length + heading.length + content.length;
    if (wasTruncated) break;
  }

  return { text: rendered.join('\n\n'), sections: retained };
}

// ───────────────────────────────────────────────────────────────────
// 4. MERGE PIPELINE
// ───────────────────────────────────────────────────────────────────

/**
 * Build merged context from the transcript, then delegate budget allocation
 * and section rendering to mergeCompactBrief.
 */
export async function buildMergedCompactResult(
  transcriptLines: string[],
  projectRoot: string = process.cwd(),
): Promise<CompactResult> {
  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
  const filePaths = extractFilePaths(sanitizedLines, projectRoot);
  const topics = extractTopics(sanitizedLines);

  // The structural-status half of this slot came from a graph index that no
  // longer exists; the active-file list is still worth carrying forward.
  const codeGraphParts: string[] = [];
  if (filePaths.length > 0) {
    codeGraphParts.push('Active files:\n' + filePaths.map(p => `- ${p}`).join('\n'));
  }
  const codeGraph = codeGraphParts.join('\n\n');

  // Build sessionState input: recent context + topics + attention signals
  const sessionParts: string[] = [];

  // Spec folder detection
  const specFolder = detectSpecFolder(sanitizedLines);
  if (specFolder) {
    sessionParts.push(`Active spec folder: ${specFolder}`);
  }

  // Working memory attention signals
  const attentionSignals = extractAttentionSignals(sanitizedLines);
  if (attentionSignals.length > 0) {
    sessionParts.push('Working memory attention:\n' + attentionSignals.join('\n'));
  }

  if (topics.length > 0) {
    sessionParts.push('Recent topics:\n' + topics.map(t => `- ${t}`).join('\n'));
  }
  const meaningfulLines = sanitizedLines
    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
    .slice(-5);
  if (meaningfulLines.length > 0) {
    sessionParts.push('Recent context:\n' + meaningfulLines.join('\n'));
  }
  const sessionState = sessionParts.join('\n\n');

  const selection = createPreMergeSelectionMetadata({
    selectedFrom: ['transcript-tail', 'active-files', 'recent-topics', 'attention-signals'],
    fileCount: filePaths.length,
    topicCount: topics.length,
    attentionSignalCount: attentionSignals.length,
    notes: [
      sanitizedLines.length !== transcriptLines.length
        ? 'Recovered compact transcript lines were removed before pre-merge selection.'
        : 'No recovered compact transcript lines detected in the current tail.',
      specFolder ? `Spec folder anchored: ${specFolder}` : 'No active spec folder detected in transcript tail.',
    ],
    antiFeedbackGuards: [
      'Strip recovered hook-cache source markers before transcript summarization.',
      'Do not reuse Recovery Instructions text as session-state evidence.',
      'Build pre-merge candidates before section assembly.',
    ],
  });

  const mergeInput: MergeInput = {
    codeGraph,
    triggered: '',
    sessionState,
  };

  const t0 = performance.now();
  const merged = mergeCompactBrief(mergeInput, COMPACTION_TOKEN_BUDGET, undefined, selection);
  const elapsed = performance.now() - t0;

  if (elapsed > 1500) {
    hookLog('warn', 'compact-inject', `Merge pipeline took ${elapsed.toFixed(0)}ms (budget: ${HOOK_TIMEOUT_MS}ms)`);
  } else {
    hookLog('info', 'compact-inject', `Merge pipeline completed in ${elapsed.toFixed(0)}ms (${merged.metadata.sourceCount} sections, ~${merged.metadata.totalTokenEstimate} tokens)`);
  }

  const rendered = renderBudgetedSections(
    merged.payloadContract.sections,
    COMPACTION_TOKEN_BUDGET,
  );
  return {
    text: rendered.text,
    payloadContract: {
      ...merged.payloadContract,
      sections: rendered.sections,
    },
  };
}

function buildLegacyCompactResult(transcriptLines: string[], timestamp: string): CompactResult {
  const rendered = renderBudgetedSections([{
    key: 'legacy-compact-context',
    title: 'Legacy Compact Context',
    content: buildCompactContext(transcriptLines),
    source: 'session',
  }], COMPACTION_TOKEN_BUDGET);
  return {
    text: rendered.text,
    payloadContract: createSharedPayloadEnvelope({
      kind: 'compaction',
      sections: rendered.sections,
      summary: 'Legacy compaction cache assembled before optional enrichment',
      provenance: {
        producer: 'hook_cache',
        sourceSurface: 'compact-cache',
        trustState: 'cached',
        generatedAt: timestamp,
        lastUpdated: null,
        sourceRefs: ['compact-inject', 'hook-state'],
        sanitizerVersion: CANONICAL_FOLD_VERSION,
        runtimeFingerprint: getUnicodeRuntimeFingerprint(),
      },
    }),
  };
}

export function persistCompactResult(
  sessionId: string,
  result: CompactResult,
  timestamp: string,
  historyLocator: HistoryLocator | null,
): boolean {
  const persisted = updateState(sessionId, {
    pendingCompactPrime: {
      payload: result.text,
      cachedAt: timestamp,
      payloadContract: {
        ...result.payloadContract,
        provenance: {
          ...result.payloadContract.provenance,
          producer: 'hook_cache',
          sourceSurface: 'compact-cache',
          trustState: 'cached',
          sanitizerVersion: CANONICAL_FOLD_VERSION,
          runtimeFingerprint: getUnicodeRuntimeFingerprint(),
        },
      },
    },
    historyLocator,
  }).persisted;
  if (persisted) mirrorToCheckoutRoot(sessionId, historyLocator);
  return persisted;
}

/**
 * The session-start hook reads the locator from the session folder's state,
 * while the printed command runs the CLI from the checkout root, which reads
 * the root's state. A session started below the root needs both copies; a
 * session at the root already has its one copy.
 */
function mirrorToCheckoutRoot(sessionId: string, historyLocator: HistoryLocator | null): void {
  if (!historyLocator?.sessionDirectory) return;
  const mirrored = persistHistoryLocator(historyLocator, () => {
    ensureStateDir();
    return updateState(sessionId, { historyLocator });
  });
  if (!mirrored) {
    hookLog('warn', 'compact-inject', `History locator was not mirrored to the checkout root for session ${sessionId}`);
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. AUTHORED SNAPSHOT
// ───────────────────────────────────────────────────────────────────

async function runAuthoredSnapshotWorker(): Promise<void> {
  const input = JSON.parse((await readHookStdin()) ?? '') as {
    specFolder: string | null;
    sessionId: string;
  };
  const result = refreshAuthoredContinuitySnapshot({
    enabled: true,
    specFolder: input.specFolder,
    sessionId: input.sessionId,
    actor: 'precompact-hook',
  });
  process.stdout.write(JSON.stringify(result));
}

function runAuthoredSnapshot(
  transcriptLines: string[],
  sessionId: string,
  deadline: number,
): void {
  const timeout = remainingMs(deadline);
  if (timeout < MIN_OPTIONAL_BUDGET_MS) {
    hookLog('warn', 'compact-inject', 'Authored continuity snapshot skipped: hook deadline exhausted');
    return;
  }
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(import.meta.url), '--authored-snapshot-worker'],
    {
      input: JSON.stringify({ specFolder: detectSpecFolder(transcriptLines), sessionId }),
      encoding: 'utf-8',
      timeout,
      maxBuffer: SNAPSHOT_STDIO_BYTES,
      killSignal: 'SIGKILL',
    },
  );
  if (result.error || result.status !== 0) {
    hookLog('warn', 'compact-inject', 'Authored continuity snapshot failed or exceeded its remaining budget');
    return;
  }
  try {
    const snapshotResult = JSON.parse(result.stdout) as {
      status: string;
      docsUpdated?: unknown[];
      createdMemoryRecords?: number;
      indexMutations?: number;
      reason?: string;
    };
    if (snapshotResult.status === 'updated') {
      hookLog(
        'info',
        'compact-inject',
        `Authored continuity snapshot refreshed ${snapshotResult.docsUpdated?.length ?? 0} doc(s); `
          + `memory records=${snapshotResult.createdMemoryRecords ?? 0}; index mutations=${snapshotResult.indexMutations ?? 0}`,
      );
    } else if (snapshotResult.status === 'skipped') {
      hookLog('warn', 'compact-inject', `Authored continuity snapshot skipped: ${snapshotResult.reason ?? 'unknown'}`);
    }
  } catch {
    hookLog('warn', 'compact-inject', 'Authored continuity snapshot returned invalid worker output');
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. MAIN
// ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const deadline = performance.now() + HOOK_TIMEOUT_MS;
  ensureStateDir();

  // Claude kills PreCompact hooks after 3 seconds, so the read ends early
  // enough to leave the merge and the snapshot most of the budget.
  const input = await withTimeout(parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), remainingMs(deadline), null);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'compact' });
    hookLog('warn', 'compact-inject', 'No stdin input received');
    return;
  }

  // A child's payload reuses the parent's session id, so priming the cache or
  // signalling a boundary from here would land on the parent's next session.
  if (isSubagentPayload(input)) {
    const agentId = input.agent_id?.trim();
    hookLog('info', 'compact-inject', `Skipping PreCompact for sub-agent ${agentId}: its session id is the parent's`);
    return;
  }

  const rawSessionId = typeof input.session_id === 'string' ? input.session_id.trim() : '';
  notifyDirectiveLifecycleBoundary({ sessionId: rawSessionId || null, boundary: 'compact' });
  const sessionId = getRequiredSessionId(rawSessionId, 'compact-inject');
  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);

  let transcriptLines: string[] = [];
  let historyLocator: HistoryLocator | null = null;
  if (input.transcript_path) {
    const historyRuntime = detectHistoryRuntime();
    transcriptLines = tailFile(input.transcript_path, 50);
    if (historyRuntime) {
      historyLocator = mintHistoryLocator({
        sessionId,
        transcriptPath: input.transcript_path,
        workspace: process.cwd(),
        runtime: historyRuntime,
      });
    }
    hookLog(
      'info',
      'compact-inject',
      `Read ${transcriptLines.length} transcript lines; history locator ${historyLocator ? 'minted' : 'not minted'} for ${historyRuntime ?? 'unsupported runtime'}`,
    );
  }

  const baselineTimestamp = new Date().toISOString();
  const baseline = buildLegacyCompactResult(transcriptLines, baselineTimestamp);
  if (!persistCompactResult(sessionId, baseline, baselineTimestamp, stampHistoryLocator(historyLocator, baselineTimestamp))) {
    hookLog('warn', 'compact-inject', `Legacy compact context cache was not persisted for session ${sessionId}`);
    return;
  }
  hookLog('info', 'compact-inject', `Cached baseline compact context (${baseline.text.length} chars) for session ${sessionId}`);

  const enrichmentBudget = remainingMs(deadline, PERSISTENCE_MARGIN_MS);
  if (enrichmentBudget >= MIN_OPTIONAL_BUDGET_MS) {
    try {
      const enriched = await withTimeout(
        buildMergedCompactResult(transcriptLines),
        enrichmentBudget,
        null,
      );
      if (enriched && remainingMs(deadline) >= PERSISTENCE_MARGIN_MS) {
        const enrichedTimestamp = new Date().toISOString();
        if (persistCompactResult(
          sessionId,
          enriched,
          enrichedTimestamp,
          stampHistoryLocator(historyLocator, enrichedTimestamp),
        )) {
          hookLog('info', 'compact-inject', `Cached enriched compact context (${enriched.text.length} chars) for session ${sessionId}`);
        } else {
          hookLog('warn', 'compact-inject', `Enriched compact context cache was not persisted for session ${sessionId}`);
        }
      }
    } catch (err: unknown) {
      hookLog('warn', 'compact-inject', `Merge pipeline failed; baseline cache retained: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (authoredSnapshotEnabled(input)) {
    runAuthoredSnapshot(transcriptLines, sessionId, deadline);
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

function isCliEntrypoint(): boolean {
  return isMainModule(import.meta.url);
}

// Run — exit cleanly even on error (hooks must never block Claude)
if (isCliEntrypoint()) {
  const operation = !sessionLifecycleHookEnabled()
    ? Promise.resolve()
    : process.argv.includes('--authored-snapshot-worker')
      ? Promise.resolve().then(runAuthoredSnapshotWorker)
      : main();
  operation.catch((err: unknown) => {
    hookLog('error', 'compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
  }).finally(() => {
    process.exit(0);
  });
}
