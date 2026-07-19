#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: PreCompact Hook — Compact Inject
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code PreCompact event. Precomputes critical context
// using the merge pipeline (Memory, Code Graph, session state)
// and caches to hook state for later injection by SessionStart hook.
// stdout is NOT injected on PreCompact — we only cache here.

import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { closeSync, fstatSync, openSync, readFileSync, readSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  parseHookStdin, hookLog,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET, getRequiredSessionId,
} from './shared.js';
import { ensureStateDir, updateState } from './hook-state.js';
import { buildWarmMemoryContextSection } from '../spec-memory-cli-fallback.js';
import { mergeCompactBrief, type MergeInput } from '@spec-kit/shared/compact-merger';
import { autoSurfaceAtCompaction } from '../../hooks/memory-surface.js';
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
import { buildWarmCodeGraphStatusSection } from '../code-index-cli-fallback.js';

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

/** Extract file paths mentioned in transcript lines */
function extractFilePaths(lines: string[]): string[] {
  const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
  const paths = new Set<string>();
  for (const line of lines) {
    const matches = line.match(pathRegex);
    if (matches) {
      for (const m of matches) paths.add(m);
    }
  }
  return [...paths].slice(0, 20);
}

/** Extract topics from recent transcript content */
function extractTopics(lines: string[]): string[] {
  const topics = new Set<string>();
  for (const line of lines) {
    const specMatch = line.match(/specs\/[\w-]+/g);
    if (specMatch) specMatch.forEach(m => topics.add(m));
    const toolMatch = line.match(/memory_\w+|code_graph_\w+|task_\w+/g);
    if (toolMatch) toolMatch.forEach(m => topics.add(m));
  }
  return [...topics].slice(0, 10);
}

function stripRecoveredCompactLines(lines: string[]): string[] {
  return lines.filter((line) => !COMPACT_FEEDBACK_GUARDS.some((guard) => guard.test(line)));
}

/** Extract most-referenced identifiers from transcript lines (top 10 by frequency) */
function extractAttentionSignals(lines: string[]): string[] {
  const freq = new Map<string, number>();
  // camelCase function calls: e.g. buildMergedContext(
  const funcRe = /\b([a-z][a-zA-Z0-9]{2,})\s*\(/g;
  // PascalCase class/interface names: e.g. MergeInput, OutputSection
  const classRe = /\b([A-Z][a-zA-Z0-9]{2,})\b/g;
  // Common noise words to skip
  const noise = new Set(['Error', 'String', 'Object', 'Array', 'Promise', 'Buffer', 'Date', 'Map', 'Set', 'Number', 'Boolean', 'Function', 'RegExp', 'JSON', 'Math', 'console', 'process', 'undefined', 'null']);
  for (const line of lines) {
    let m: RegExpExecArray | null;
    funcRe.lastIndex = 0;
    while ((m = funcRe.exec(line)) !== null) {
      const id = m[1];
      if (!noise.has(id) && id.length <= 60) {
        freq.set(id, (freq.get(id) ?? 0) + 1);
      }
    }
    classRe.lastIndex = 0;
    while ((m = classRe.exec(line)) !== null) {
      const id = m[1];
      if (!noise.has(id) && id.length <= 60) {
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
  const specFolderRe = /\.opencode\/specs\/[^\s"'`]+/g;
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

type AutoSurfaceAtCompactionResult = Awaited<ReturnType<typeof autoSurfaceAtCompaction>>;

function renderConstitutionalMemories(
  autoSurfaced: AutoSurfaceAtCompactionResult,
): string {
  const constitutional = autoSurfaced?.constitutional ?? [];
  if (constitutional.length === 0) {
    return '';
  }

  const lines = constitutional.map((memory) => {
    const details: string[] = [`- ${memory.title}`];

    if (memory.retrieval_directive) {
      details.push(`  ${memory.retrieval_directive}`);
    }

    const provenance = [memory.specFolder, memory.filePath].filter(Boolean).join(' | ');
    if (provenance) {
      details.push(`  ${provenance}`);
    }

    return details.join('\n');
  });

  return lines.join('\n');
}

function renderTriggeredMemories(
  autoSurfaced: AutoSurfaceAtCompactionResult,
): string {
  const triggered = autoSurfaced?.triggered ?? [];
  if (triggered.length === 0) {
    return '';
  }

  const lines = triggered.map((memory) => {
    const matchedPhrases = [...new Set(memory.matched_phrases
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length > 0))];

    if (matchedPhrases.length === 0) {
      return `- ${memory.title}`;
    }

    return `- ${memory.title} (matched: ${matchedPhrases.join(', ')})`;
  });

  return lines.join('\n');
}

async function renderCliCompactionFallback(sessionState: string): Promise<string> {
  const section = await buildWarmMemoryContextSection({
    title: 'Spec Memory CLI Fallback',
    input: sessionState,
    timeoutMs: 600,
    onResult: (result) => {
      hookLog('info', 'compact-inject', `CLI warm fallback ${result.status} reason=${result.reason ?? 'none'} exit=${result.exitCode ?? 'none'} duration=${result.durationMs}ms`);
    },
  });
  return section?.content ?? '';
}

interface CompactResult {
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

/**
 * Build merged context using the 3-source merge pipeline.
 * Extracts session state from transcript, then delegates budget allocation
 * and section rendering to mergeCompactBrief.
 */
export async function buildMergedCompactResult(
  transcriptLines: string[],
  deadline: number = performance.now() + HOOK_TIMEOUT_MS,
): Promise<CompactResult> {
  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
  const filePaths = extractFilePaths(sanitizedLines);
  const topics = extractTopics(sanitizedLines);

  // Build codeGraph input: active files + a current warm status read so the
  // compacted context does not carry a stale structural snapshot forward.
  const codeGraphParts: string[] = [];
  if (filePaths.length > 0) {
    codeGraphParts.push('Active files:\n' + filePaths.map(p => `- ${p}`).join('\n'));
  }
  const codeGraphBudget = remainingMs(deadline, PERSISTENCE_MARGIN_MS);
  if (codeGraphBudget >= MIN_OPTIONAL_BUDGET_MS) {
    const statusSection = await withTimeout(
      buildWarmCodeGraphStatusSection({
        title: 'Code Index CLI Fallback',
        timeoutMs: Math.min(codeGraphBudget, 600),
        includeRetryableStatus: false,
      }),
      codeGraphBudget,
      null,
    );
    if (statusSection) {
      codeGraphParts.push(statusSection.content);
    }
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
    constitutional: '',
    codeGraph,
    triggered: '',
    sessionState,
  };

  let cliFallback = '';
  const surfaceBudget = remainingMs(deadline, PERSISTENCE_MARGIN_MS);
  const autoSurfaced = surfaceBudget >= MIN_OPTIONAL_BUDGET_MS
    ? await withTimeout(autoSurfaceAtCompaction(sessionState), surfaceBudget, null)
    : null;
  if (autoSurfaced) {
    mergeInput.constitutional = renderConstitutionalMemories(autoSurfaced);
    mergeInput.triggered = renderTriggeredMemories(autoSurfaced);
    hookLog(
      'info',
      'compact-inject',
      `Compaction auto-surface returned ${autoSurfaced.constitutional.length} constitutional and ${autoSurfaced.triggered.length} triggered memories (${autoSurfaced.latencyMs}ms)`,
    );
  } else {
    const fallbackBudget = remainingMs(deadline, PERSISTENCE_MARGIN_MS);
    if (fallbackBudget >= MIN_OPTIONAL_BUDGET_MS) {
      cliFallback = await withTimeout(
        renderCliCompactionFallback(sessionState || sanitizedLines.slice(-10).join('\n')),
        fallbackBudget,
        '',
      );
    }
  }

  const t0 = performance.now();
  const merged = mergeCompactBrief(mergeInput, COMPACTION_TOKEN_BUDGET, undefined, selection);
  const elapsed = performance.now() - t0;

  if (elapsed > 1500) {
    hookLog('warn', 'compact-inject', `Merge pipeline took ${elapsed.toFixed(0)}ms (budget: ${HOOK_TIMEOUT_MS}ms)`);
  } else {
    hookLog('info', 'compact-inject', `Merge pipeline completed in ${elapsed.toFixed(0)}ms (${merged.metadata.sourceCount} sections, ~${merged.metadata.totalTokenEstimate} tokens)`);
  }

  const rendered = renderBudgetedSections([
    ...(cliFallback
      ? [{
        key: 'spec-memory-cli-fallback',
        title: 'Spec Memory CLI Fallback',
        content: cliFallback,
        source: 'operational' as const,
      }]
      : []),
    ...merged.payloadContract.sections,
  ], COMPACTION_TOKEN_BUDGET);
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

function persistCompactResult(
  sessionId: string,
  result: CompactResult,
  timestamp: string,
): boolean {
  return updateState(sessionId, {
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
  }).persisted;
}

function runAuthoredSnapshotWorker(): void {
  const input = JSON.parse(readFileSync(0, 'utf-8')) as {
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
      hookLog('info', 'compact-inject', `Authored continuity snapshot refreshed ${snapshotResult.docsUpdated?.length ?? 0} doc(s); memory records=${snapshotResult.createdMemoryRecords ?? 0}; index mutations=${snapshotResult.indexMutations ?? 0}`);
    } else if (snapshotResult.status === 'skipped') {
      hookLog('warn', 'compact-inject', `Authored continuity snapshot skipped: ${snapshotResult.reason ?? 'unknown'}`);
    }
  } catch {
    hookLog('warn', 'compact-inject', 'Authored continuity snapshot returned invalid worker output');
  }
}

async function main(): Promise<void> {
  const deadline = performance.now() + HOOK_TIMEOUT_MS;
  ensureStateDir();

  const input = await withTimeout(parseHookStdin(), remainingMs(deadline), null);
  if (!input) {
    hookLog('warn', 'compact-inject', 'No stdin input received');
    return;
  }

  const sessionId = getRequiredSessionId(input.session_id, 'compact-inject');
  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);

  let transcriptLines: string[] = [];
  if (input.transcript_path) {
    transcriptLines = tailFile(input.transcript_path, 50);
    hookLog('info', 'compact-inject', `Read ${transcriptLines.length} transcript lines`);
  }

  const baselineTimestamp = new Date().toISOString();
  const baseline = buildLegacyCompactResult(transcriptLines, baselineTimestamp);
  if (!persistCompactResult(sessionId, baseline, baselineTimestamp)) {
    hookLog('warn', 'compact-inject', `Legacy compact context cache was not persisted for session ${sessionId}`);
    return;
  }
  hookLog('info', 'compact-inject', `Cached baseline compact context (${baseline.text.length} chars) for session ${sessionId}`);

  const enrichmentBudget = remainingMs(deadline, PERSISTENCE_MARGIN_MS);
  if (enrichmentBudget >= MIN_OPTIONAL_BUDGET_MS) {
    try {
      const enriched = await withTimeout(
        buildMergedCompactResult(transcriptLines, deadline),
        enrichmentBudget,
        null,
      );
      if (enriched && remainingMs(deadline) >= PERSISTENCE_MARGIN_MS) {
        const enrichedTimestamp = new Date().toISOString();
        if (persistCompactResult(sessionId, enriched, enrichedTimestamp)) {
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

function isCliEntrypoint(): boolean {
  const entrypoint = process.argv[1];
  return Boolean(entrypoint && import.meta.url === pathToFileURL(entrypoint).href);
}

// Run — exit cleanly even on error (hooks must never block Claude)
if (isCliEntrypoint()) {
  const operation = process.argv.includes('--authored-snapshot-worker')
    ? Promise.resolve().then(runAuthoredSnapshotWorker)
    : main();
  operation.catch((err: unknown) => {
    hookLog('error', 'compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
  }).finally(() => {
    process.exit(0);
  });
}
