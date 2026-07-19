// ───────────────────────────────────────────────────────────────────
// MODULE: Authored Continuity Snapshot
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import { buildResumeLadder } from '../resume/resume-ladder.js';
import type { ResumeLadderResult } from '../resume/resume-ladder.js';
import {
  buildContinuityFacets,
  readThinContinuityRecord,
  renderContinuityFacets,
  upsertThinContinuityInMarkdown,
  type ContinuityFacets,
  type ThinContinuityRecord,
} from './thin-continuity-record.js';

export interface AuthoredContinuitySnapshotOptions {
  workspacePath?: string;
  specFolder?: string | null;
  enabled?: boolean;
  now?: Date;
  actor?: string;
  sessionId?: string | null;
}

export interface AuthoredContinuitySnapshotResult {
  status: 'disabled' | 'skipped' | 'updated';
  reason: string;
  specFolder: string | null;
  docsUpdated: string[];
  createdMemoryRecords: 0;
  indexMutations: 0;
  facets?: ContinuityFacets;
  recoveryContext?: string;
}

const SNAPSHOT_START = '<!-- SPECKIT_CONTINUITY_SNAPSHOT_START -->';
const SNAPSHOT_END = '<!-- SPECKIT_CONTINUITY_SNAPSHOT_END -->';

function formatIsoSeconds(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/u, 'Z');
}

function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
  if (typeof specFolder !== 'string') {
    return null;
  }
  const normalized = specFolder
    .trim()
    .replace(/\\/gu, '/')
    .replace(/^\.opencode\/specs\//u, '')
    .replace(/^specs\//u, '')
    .replace(/^\.opencode\//u, '')
    .replace(/\/+$/u, '');
  return normalized.length > 0 ? normalized : null;
}

function resolveSpecFolderPath(workspacePath: string, specFolder: string): string | null {
  const candidates = [
    path.join(workspacePath, '.opencode', 'specs', specFolder),
    path.join(workspacePath, 'specs', specFolder),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
  }
  return null;
}

function compactAction(value: string | null | undefined, fallback: string): string {
  const normalized = (value ?? fallback)
    .replace(/[.!?]+/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
  const tokens = normalized.split(' ').filter(Boolean).slice(0, 10);
  return tokens.join(' ') || fallback;
}

function buildRecoveryContext(params: {
  ladder: ResumeLadderResult;
  facets: ContinuityFacets;
  timestamp: string;
}): string {
  const { ladder, facets, timestamp } = params;
  return [
    '## Continuity Snapshot',
    '',
    `Updated: ${timestamp}`,
    `Source: ${ladder.source}`,
    `Restored: ${ladder.restorePanel.restoredCount}`,
    `Not restored: ${ladder.restorePanel.omittedCount}`,
    '',
    renderContinuityFacets(facets),
  ].join('\n');
}

function upsertSnapshotSection(markdown: string, recoveryContext: string): string {
  const section = `${SNAPSHOT_START}\n${recoveryContext}\n${SNAPSHOT_END}`;
  const existing = new RegExp(`${SNAPSHOT_START}[\\s\\S]*?${SNAPSHOT_END}`, 'u');
  if (existing.test(markdown)) {
    return markdown.replace(existing, section);
  }
  const suffix = markdown.endsWith('\n') ? '' : '\n';
  return `${markdown}${suffix}\n${section}\n`;
}

function buildContinuityRecord(params: {
  ladder: ResumeLadderResult;
  specFolder: string;
  timestamp: string;
  actor: string;
  currentRecord?: ThinContinuityRecord | null;
}): ThinContinuityRecord {
  const { ladder, specFolder, timestamp, actor, currentRecord } = params;
  return {
    packet_pointer: specFolder,
    last_updated_at: timestamp,
    last_updated_by: actor,
    recent_action: compactAction(ladder.recentAction, 'Refreshed continuity snapshot'),
    next_safe_action: compactAction(ladder.nextSafeAction, 'Review continuity snapshot'),
    blockers: currentRecord?.blockers ?? ladder.blockers.slice(0, 3),
    key_files: currentRecord?.key_files ?? ladder.keyFiles.slice(0, 5),
    ...(currentRecord?.session_dedup ? { session_dedup: currentRecord.session_dedup } : {}),
    completion_pct: currentRecord?.completion_pct ?? 0,
    open_questions: currentRecord?.open_questions ?? [],
    answered_questions: currentRecord?.answered_questions ?? [],
  };
}

export function refreshAuthoredContinuitySnapshot(
  options: AuthoredContinuitySnapshotOptions,
): AuthoredContinuitySnapshotResult {
  if (!options.enabled) {
    return {
      status: 'disabled',
      reason: 'Authored continuity snapshot is disabled.',
      specFolder: normalizeSpecFolder(options.specFolder),
      docsUpdated: [],
      createdMemoryRecords: 0,
      indexMutations: 0,
    };
  }

  const workspacePath = options.workspacePath ?? process.cwd();
  const specFolder = normalizeSpecFolder(options.specFolder);
  if (!specFolder) {
    return {
      status: 'skipped',
      reason: 'No spec folder was available for authored continuity snapshot.',
      specFolder: null,
      docsUpdated: [],
      createdMemoryRecords: 0,
      indexMutations: 0,
    };
  }

  const folderPath = resolveSpecFolderPath(workspacePath, specFolder);
  if (!folderPath) {
    return {
      status: 'skipped',
      reason: 'Resolved spec folder does not exist in the workspace.',
      specFolder,
      docsUpdated: [],
      createdMemoryRecords: 0,
      indexMutations: 0,
    };
  }

  const ladder = buildResumeLadder({ specFolder, workspacePath });
  if (ladder.source === 'none') {
    return {
      status: 'skipped',
      reason: 'No authored ladder context was available to summarize.',
      specFolder,
      docsUpdated: [],
      createdMemoryRecords: 0,
      indexMutations: 0,
    };
  }

  const timestamp = formatIsoSeconds(options.now ?? new Date());
  const facets = buildContinuityFacets({
    summary: ladder.summary,
    recentAction: ladder.recentAction,
    nextSafeAction: ladder.nextSafeAction,
    blockers: ladder.blockers,
    keyFiles: ladder.keyFiles,
  });
  const recoveryContext = buildRecoveryContext({ ladder, facets, timestamp });
  const docsUpdated: string[] = [];

  const handoverPath = path.join(folderPath, 'handover.md');
  const handoverContent = fs.existsSync(handoverPath)
    ? fs.readFileSync(handoverPath, 'utf8')
    : ['---', 'title: "Handover"', `last_updated: "${timestamp}"`, '---', '# Handover', ''].join('\n');
  const nextHandover = upsertSnapshotSection(handoverContent, recoveryContext);
  if (nextHandover !== handoverContent) {
    fs.writeFileSync(handoverPath, nextHandover, 'utf8');
    docsUpdated.push(path.relative(workspacePath, handoverPath).replace(/\\/gu, '/'));
  }

  const implementationSummaryPath = path.join(folderPath, 'implementation-summary.md');
  if (fs.existsSync(implementationSummaryPath)) {
    const currentSummary = fs.readFileSync(implementationSummaryPath, 'utf8');
    const currentContinuity = readThinContinuityRecord(currentSummary);
    const writeResult = upsertThinContinuityInMarkdown(currentSummary, buildContinuityRecord({
      ladder,
      specFolder,
      timestamp,
      actor: options.actor ?? 'precompact-hook',
      currentRecord: currentContinuity.ok ? currentContinuity.record : null,
    }));
    if (writeResult.ok && writeResult.markdown && writeResult.markdown !== currentSummary) {
      fs.writeFileSync(implementationSummaryPath, writeResult.markdown, 'utf8');
      docsUpdated.push(path.relative(workspacePath, implementationSummaryPath).replace(/\\/gu, '/'));
    }
  }

  return {
    status: 'updated',
    reason: 'Authored continuity snapshot refreshed packet-local markdown.',
    specFolder,
    docsUpdated,
    createdMemoryRecords: 0,
    indexMutations: 0,
    facets,
    recoveryContext,
  };
}
