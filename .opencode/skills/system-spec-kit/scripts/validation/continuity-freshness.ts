#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Continuity Freshness Validator
// ───────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { isMainModule } from '../lib/esm-entry.js';
import {
  buildContinuityFingerprint,
  ZERO_CONTINUITY_FINGERPRINT,
} from '@spec-kit/mcp-server/api';

const CONTINUITY_STALENESS_THRESHOLD_MS = 10 * 60 * 1000;
const FRONTMATTER_RE = /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/;
const COMPLETION_DOCS = [
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
  'handover.md',
] as const;

type ResultStatus = 'pass' | 'warn' | 'fail';

export interface ContinuityFreshnessResult {
  readonly rule: 'CONTINUITY_FRESHNESS';
  readonly status: ResultStatus;
  readonly code:
    | 'fresh'
    | 'fresh_completion'
    | 'stale'
    | 'content_stale'
    | 'dirty_tree'
    | 'clock_drift'
    | 'no_completion_claim'
    | 'missing_fingerprint'
    | 'zero_fingerprint'
    | 'implementation_summary_missing'
    | 'missing_frontmatter'
    | 'missing_graph_metadata'
    | 'missing_graph_timestamp'
    | 'invalid_graph_metadata'
    | 'invalid_timestamp'
    | 'invalid_frontmatter';
  readonly message: string;
  readonly details: string[];
  readonly continuityTimestamp?: string;
  readonly graphTimestamp?: string;
  readonly deltaMs?: number;
}

interface CliOptions {
  folder: string;
  json: boolean;
  strict: boolean;
}

interface ContinuityFields {
  timestamp: string | null;
  fingerprint: string | null;
  completionPct: number | null;
  status: string | null;
  parseError: string | null;
}

interface CompletionCandidate {
  basename: string;
  filePath: string;
  content: string;
  fingerprint: string | null;
  hasCompletionClaim: boolean;
  recomputedFingerprint: string;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isTruthyEnv(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes((value ?? '').toLowerCase().trim());
}

function isEnforceMode(): boolean {
  return isTruthyEnv(process.env.SPECKIT_COMPLETION_FRESHNESS_ENFORCE);
}

function extractFrontmatter(markdown: string): string | null {
  return markdown.match(FRONTMATTER_RE)?.[1] ?? null;
}

function readContinuityFields(markdown: string): ContinuityFields {
  const frontmatterBlock = extractFrontmatter(markdown);
  if (!frontmatterBlock) {
    return {
      timestamp: null,
      fingerprint: null,
      completionPct: null,
      status: null,
      parseError: null,
    };
  }

  try {
    const parsed = yaml.load(frontmatterBlock) as Record<string, unknown> | null;
    const memory = parsed?._memory as Record<string, unknown> | undefined;
    const continuity = memory?.continuity as Record<string, unknown> | undefined;
    const sessionDedup = continuity?.session_dedup as Record<string, unknown> | undefined;
    const completionPct = continuity?.completion_pct;
    const rawStatus = parsed?.status;
    const metadataStatus = extractMetadataTableStatus(markdown);

    return {
      timestamp: typeof continuity?.last_updated_at === 'string' ? continuity.last_updated_at : null,
      fingerprint: typeof sessionDedup?.fingerprint === 'string'
        ? sessionDedup.fingerprint
        : typeof memory?.fingerprint === 'string'
          ? memory.fingerprint
          : null,
      completionPct: typeof completionPct === 'number'
        ? completionPct
        : typeof completionPct === 'string'
          ? Number.parseFloat(completionPct)
          : null,
      status: typeof rawStatus === 'string' ? rawStatus : metadataStatus,
      parseError: null,
    };
  } catch (error: unknown) {
    return {
      timestamp: null,
      fingerprint: null,
      completionPct: null,
      status: null,
      parseError: toErrorMessage(error),
    };
  }
}

function extractMetadataTableStatus(markdown: string): string | null {
  const match = markdown.match(/^\|\s*\*\*Status\*\*\s*\|\s*([^|]+?)\s*\|\s*$/im);
  return match?.[1]?.trim() || null;
}

function readContinuityTimestamp(markdown: string): {
  timestamp: string | null;
  parseError: string | null;
} {
  const fields = readContinuityFields(markdown);
  return { timestamp: fields.timestamp, parseError: fields.parseError };
}

function parseTimestamp(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function readGraphMetadataTimestamp(graphMetadataPath: string): {
  timestamp?: string;
  error?: string;
} {
  try {
    const parsed = JSON.parse(fs.readFileSync(graphMetadataPath, 'utf-8')) as {
      derived?: { last_save_at?: unknown };
    };
    return typeof parsed?.derived?.last_save_at === 'string'
      ? { timestamp: parsed.derived.last_save_at }
      : {};
  } catch (error: unknown) {
    return { error: toErrorMessage(error) };
  }
}

function buildPass(
  code: ContinuityFreshnessResult['code'],
  message: string,
  details: string[] = [],
  extra: Partial<ContinuityFreshnessResult> = {},
): ContinuityFreshnessResult {
  return {
    rule: 'CONTINUITY_FRESHNESS',
    status: 'pass',
    code,
    message,
    details,
    ...extra,
  };
}

function buildWarn(
  code: ContinuityFreshnessResult['code'],
  message: string,
  details: string[] = [],
  extra: Partial<ContinuityFreshnessResult> = {},
): ContinuityFreshnessResult {
  return {
    rule: 'CONTINUITY_FRESHNESS',
    status: 'warn',
    code,
    message,
    details,
    ...extra,
  };
}

function buildFail(
  code: ContinuityFreshnessResult['code'],
  message: string,
  details: string[] = [],
): ContinuityFreshnessResult {
  return {
    rule: 'CONTINUITY_FRESHNESS',
    status: 'fail',
    code,
    message,
    details,
  };
}

function isCompletionStatus(status: string | null): boolean {
  return /\b(?:complete|completed|done|shipped|implemented)\b/i.test(status ?? '');
}

function hasChecklistEvidenceClaim(basename: string, content: string): boolean {
  return basename === 'checklist.md'
    && /^\s*-\s+\[[xX]\].*(?:\[EVIDENCE:|\|\s*Evidence:|[✓✔☑✅]|\((?:verified|tested|confirmed)\)|\[DEFERRED:)/im.test(content);
}

function hasCompletionClaim(basename: string, content: string, fields: ContinuityFields): boolean {
  return fields.completionPct === 100
    || isCompletionStatus(fields.status)
    || hasChecklistEvidenceClaim(basename, content);
}

function collectCompletionCandidates(specFolderPath: string): CompletionCandidate[] {
  const candidates: CompletionCandidate[] = [];
  for (const basename of COMPLETION_DOCS) {
    const filePath = path.join(specFolderPath, basename);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const fields = readContinuityFields(content);
    candidates.push({
      basename,
      filePath,
      content,
      fingerprint: fields.fingerprint,
      hasCompletionClaim: hasCompletionClaim(basename, content, fields),
      recomputedFingerprint: buildContinuityFingerprint(content),
    });
  }
  return candidates;
}

function findGitRoot(folderPath: string): string | null {
  try {
    return execFileSync('git', ['-C', folderPath, 'rev-parse', '--show-toplevel'], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function listPacketDirtyPaths(specFolderPath: string): string[] {
  const gitRoot = findGitRoot(specFolderPath);
  if (!gitRoot) {
    return [];
  }

  const relativeFolder = path.relative(gitRoot, specFolderPath).replace(/\\/g, '/');
  try {
    const output = execFileSync('git', ['-C', gitRoot, 'status', '--porcelain', '--', relativeFolder], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return output
      .split('\n')
      .map((line) => line.trimEnd())
      .filter(Boolean)
      .map((line) => line.slice(3).trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function evaluateCompletionFreshness(specFolderPath: string): ContinuityFreshnessResult | null {
  const completionClaims = collectCompletionCandidates(specFolderPath)
    .filter((candidate) => candidate.hasCompletionClaim);

  if (completionClaims.length === 0) {
    return buildPass(
      'no_completion_claim',
      'Continuity freshness skipped: no completion claim found',
    );
  }

  const candidatesWithFingerprint = completionClaims
    .filter((candidate) => candidate.fingerprint && /^sha256:[a-f0-9]{64}$/.test(candidate.fingerprint));

  if (candidatesWithFingerprint.length === 0) {
    return buildPass(
      'missing_fingerprint',
      'Continuity freshness skipped: completion claim has no stored session_dedup fingerprint',
    );
  }

  const usableCandidates = candidatesWithFingerprint
    .filter((candidate) => candidate.fingerprint !== ZERO_CONTINUITY_FINGERPRINT);

  if (usableCandidates.length === 0) {
    return buildPass(
      'zero_fingerprint',
      'Continuity freshness skipped: completion claim has only the zero fingerprint placeholder',
    );
  }

  const staleCandidates = usableCandidates
    .filter((candidate) => candidate.fingerprint !== candidate.recomputedFingerprint);
  const dirtyPaths = listPacketDirtyPaths(specFolderPath);

  if (staleCandidates.length > 0 || dirtyPaths.length > 0) {
    const details = [
      ...staleCandidates.map((candidate) => `${candidate.basename}: stored=${candidate.fingerprint} recomputed=${candidate.recomputedFingerprint}`),
      ...dirtyPaths.slice(0, 10).map((dirtyPath) => `dirty=${dirtyPath}`),
      'How to Fix: rerun verification, refresh session_dedup.fingerprint, and ensure packet paths are clean.',
      'fix: rerun the completion workflow after updating the packet continuity fingerprint.',
    ];
    const code = staleCandidates.length > 0 ? 'content_stale' : 'dirty_tree';
    const message = staleCandidates.length > 0
      ? 'Completion freshness is stale: stored continuity fingerprint does not match current content'
      : 'Completion freshness is stale: packet paths have uncommitted changes';

    return isEnforceMode()
      ? buildFail(code, message, details)
      : buildWarn(code, message, details);
  }

  return buildPass(
    'fresh_completion',
    'Completion freshness passed: completion claim fingerprint matches current content and packet paths are clean',
    usableCandidates.map((candidate) => `${candidate.basename}: recomputed=${candidate.recomputedFingerprint}`),
  );
}

export function validateContinuityFreshness(
  folderPath: string,
): ContinuityFreshnessResult {
  const specFolderPath = path.resolve(folderPath);
  const implementationSummaryPath = path.join(specFolderPath, 'implementation-summary.md');
  const graphMetadataPath = path.join(specFolderPath, 'graph-metadata.json');

  if (!fs.existsSync(implementationSummaryPath)) {
    return buildPass(
      'implementation_summary_missing',
      'Continuity freshness skipped: implementation-summary.md missing',
    );
  }

  const implementationSummary = fs.readFileSync(implementationSummaryPath, 'utf-8');
  const { timestamp: continuityTimestamp, parseError } = readContinuityTimestamp(implementationSummary);
  if (parseError) {
    return buildWarn(
      'invalid_frontmatter',
      'Continuity freshness could not parse implementation-summary frontmatter',
      [parseError],
    );
  }

  const completionFreshness = evaluateCompletionFreshness(specFolderPath);
  if (completionFreshness && completionFreshness.status !== 'pass') {
    return completionFreshness;
  }
  if (completionFreshness?.code === 'no_completion_claim') {
    return completionFreshness;
  }

  if (!continuityTimestamp) {
    return buildPass(
      'missing_frontmatter',
      'Continuity freshness skipped: _memory.continuity.last_updated_at missing',
    );
  }

  if (!fs.existsSync(graphMetadataPath)) {
    return buildPass(
      'missing_graph_metadata',
      'Continuity freshness skipped: graph-metadata.json missing',
      completionFreshness?.details ?? [],
      { continuityTimestamp },
    );
  }

  const graphTimestampResult = readGraphMetadataTimestamp(graphMetadataPath);
  if (graphTimestampResult.error) {
    return buildFail(
      'invalid_graph_metadata',
      'Continuity freshness could not load graph-metadata.json',
      [graphTimestampResult.error],
    );
  }
  const graphMetadataTimestamp = graphTimestampResult.timestamp;

  if (!graphMetadataTimestamp) {
    return buildPass(
      'missing_graph_timestamp',
      'Continuity freshness skipped: graph-metadata.json has no derived.last_save_at',
      completionFreshness?.details ?? [],
      { continuityTimestamp },
    );
  }

  const continuityMs = parseTimestamp(continuityTimestamp);
  const graphMs = parseTimestamp(graphMetadataTimestamp);
  if (continuityMs === null || graphMs === null) {
    return buildWarn(
      'invalid_timestamp',
      'Continuity freshness could not parse one or more timestamps',
      [
        `continuity=${continuityTimestamp}`,
        `graph=${graphMetadataTimestamp}`,
      ],
      {
        continuityTimestamp,
        graphTimestamp: graphMetadataTimestamp,
      },
    );
  }

  const deltaMs = graphMs - continuityMs;
  if (deltaMs > CONTINUITY_STALENESS_THRESHOLD_MS) {
    return buildWarn(
      'stale',
      'Continuity last_updated_at lags graph-metadata derived.last_save_at by more than the 10-minute heuristic policy budget',
      [
        `deltaMs=${deltaMs}`,
        `continuity=${continuityTimestamp}`,
        `graph=${graphMetadataTimestamp}`,
      ],
      {
        continuityTimestamp,
        graphTimestamp: graphMetadataTimestamp,
        deltaMs,
      },
    );
  }

  if (deltaMs < 0) {
    return buildPass(
      'clock_drift',
      'Continuity timestamp is newer than graph-metadata; treating as benign clock drift',
      [
        `deltaMs=${deltaMs}`,
        `continuity=${continuityTimestamp}`,
        `graph=${graphMetadataTimestamp}`,
      ],
      {
        continuityTimestamp,
        graphTimestamp: graphMetadataTimestamp,
        deltaMs,
      },
    );
  }

  return buildPass(
    completionFreshness?.code === 'fresh_completion' ? 'fresh_completion' : 'fresh',
    completionFreshness?.code === 'fresh_completion'
      ? 'Completion freshness passed: fingerprint, packet paths, and continuity timestamps are fresh'
      : 'Continuity last_updated_at is within the 10-minute heuristic policy budget',
    [
      ...(completionFreshness?.details ?? []),
      `deltaMs=${deltaMs}`,
      `continuity=${continuityTimestamp}`,
      `graph=${graphMetadataTimestamp}`,
    ],
    {
      continuityTimestamp,
      graphTimestamp: graphMetadataTimestamp,
      deltaMs,
    },
  );
}

function parseArgs(argv: string[]): CliOptions {
  let folder = '';
  let json = false;
  let strict = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      console.log([
        'continuity-freshness — validate implementation-summary continuity freshness',
        '',
        'Usage:',
        '  node continuity-freshness.js --folder <spec-folder> [--json] [--strict]',
      ].join('\n'));
      process.exit(0);
    }
    if (arg === '--folder') {
      folder = argv[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--strict') {
      strict = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!folder) {
    throw new Error('--folder is required');
  }

  return { folder, json, strict };
}

function printBridgeOutput(result: ContinuityFreshnessResult): void {
  process.stdout.write(`rule\t${result.rule}\n`);
  process.stdout.write(`status\t${result.status}\n`);
  process.stdout.write(`message\t${result.message}\n`);
  for (const detail of result.details) {
    process.stdout.write(`detail\t${detail}\n`);
  }
}

function runCli(): void {
  const options = parseArgs(process.argv.slice(2));
  const result = validateContinuityFreshness(options.folder);

  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    printBridgeOutput(result);
  }

  if (result.status === 'fail') {
    process.exit(2);
  }
  if (result.status === 'warn' && options.strict) {
    process.exit(1);
  }
}

if (isMainModule(import.meta.url)) {
  runCli();
}
