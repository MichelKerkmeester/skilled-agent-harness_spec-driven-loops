// ───────────────────────────────────────────────────────────────
// MODULE: Resume Ladder
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Pull `findSpecDocuments` from the lib discovery seam instead
// of reaching across into a handler module. Lib code depends inward on
// other lib code; the handler implementation stays the source of truth.
import { findSpecDocuments } from '../discovery/spec-document-finder.js';
import {
  buildContinuityFacets,
  renderContinuityFacets,
  readThinContinuityRecord,
  type ContinuityFacetName,
  type ContinuityFacets,
  type ThinContinuityRecord,
} from '../continuity/thin-continuity-record.js';
import { isGeneratorHardeningEnabled } from '../config/capability-flags.js';
import { resolveLastActiveChildFromStore } from '../graph/access-telemetry.js';
import { listPhaseChildren } from '../spec/is-phase-parent.js';

export type ResumeLadderSource = 'handover' | 'continuity' | 'spec-docs' | 'none';

export interface ResumeLadderDocument {
  type: 'handover' | 'continuity' | 'spec-doc';
  path: string;
  relativePath: string;
  fingerprint: string;
  modifiedAt: string;
}

export interface ResumeLadderResolution {
  kind: 'explicit' | 'cached' | 'unresolved';
  requestedSpecFolder: string | null;
  fallbackSpecFolder: string | null;
  resolvedSpecFolder: string | null;
  folderPath: string | null;
}

export interface ResumeLadderResult {
  phaseParent?: ResumeLadderPhaseParentContext;
  source: ResumeLadderSource;
  specFolder: string | null;
  resolution: ResumeLadderResolution;
  summary: string;
  recentAction: string | null;
  nextSafeAction: string | null;
  blockers: string[];
  keyFiles: string[];
  hints: string[];
  documents: ResumeLadderDocument[];
  freshnessWinner: 'handover' | 'continuity' | 'spec-docs' | null;
  restorePanel: ResumeRestorePanel;
}

export interface ResumeLadderPhaseParentChild {
  name: string;
  qualifies: boolean;
  active: boolean;
}

export interface ResumeLadderPhaseParentContext {
  specFolder: string;
  redirectedSpecFolder: string | null;
  children: ResumeLadderPhaseParentChild[];
  documents: ResumeLadderDocument[];
  summary: string;
}

export interface ResumeRestorePanelItem {
  facet: ContinuityFacetName;
  label: string;
  source: ResumeLadderSource;
  text: string;
}

export interface ResumeRestorePanelOmission {
  facet: ContinuityFacetName;
  label: string;
  reason: 'item-budget' | 'char-budget';
}

export interface ResumeRestorePanel {
  maxItems: number;
  maxChars: number;
  restoredCount: number;
  omittedCount: number;
  omittedByReason: Record<ResumeRestorePanelOmission['reason'], number>;
  facets: ContinuityFacets;
  restored: ResumeRestorePanelItem[];
  omitted: ResumeRestorePanelOmission[];
  markdown: string;
}

export interface ResumeLadderOptions {
  specFolder?: string | null;
  fallbackSpecFolder?: string | null;
  workspacePath?: string;
}

interface StableDocumentSnapshot {
  path: string;
  relativePath: string;
  basename: string;
  content: string;
  fingerprint: string;
  modifiedAt: string;
  modifiedAtMs: number;
}

interface ResumeSignal {
  source: 'handover' | 'continuity' | 'spec-docs';
  updatedAtMs: number;
  summary: string;
  recentAction: string | null;
  nextSafeAction: string | null;
  blockers: string[];
  keyFiles: string[];
  documents: ResumeLadderDocument[];
  packetPointer?: string | null;
}

const FRONTMATTER_RE = /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u;
const SPEC_DOC_PRIORITY = [
  'implementation-summary.md',
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'research.md',
  'handover.md',
  'resource-map.md',
] as const;
const RESTORE_PANEL_MAX_ITEMS = 8;
const RESTORE_PANEL_MAX_CHARS = 1200;
const PHASE_PARENT_REDIRECT_MAX_DEPTH = 5;
const PHASE_CHILD_NAME_RE = /^[0-9]{3}-[a-z0-9-]+$/u;

/**
 * Follow a phase parent's `derived.last_active_child_id` pointer down to the
 * live child packet. Phase parents keep only the lean control trio at their
 * root, so resuming on the parent itself recovers stale or empty context -
 * the chronology pointer in graph-metadata.json names where work actually
 * lives. Bounded depth + an existence/shape check on every hop keep a stale
 * or malformed pointer from escaping the packet tree.
 */
export function followPhaseParentRedirect(
  startFolderPath: string,
  startSpecFolder: string,
  hints: string[],
  telemetryStorePath?: string,
): { folderPath: string; specFolder: string } {
  let folderPath = startFolderPath;
  let specFolder = startSpecFolder;

  for (let depth = 0; depth < PHASE_PARENT_REDIRECT_MAX_DEPTH; depth += 1) {
    const metadataPath = path.join(folderPath, 'graph-metadata.json');
    if (!fs.existsSync(metadataPath)) {
      break;
    }

    let pointer: string | null = null;

    // With the hardening flag on, the freshness pointer lives in the index-layer store
    // rather than the generated JSON, so consult it first. A miss falls back to the JSON
    // pointer so an un-migrated parent still redirects during the transition window.
    if (isGeneratorHardeningEnabled()) {
      const stored = resolveLastActiveChildFromStore(specFolder, { storePath: telemetryStorePath });
      if (stored) {
        pointer = stored.replace(/\\/g, '/').replace(/\/+$/u, '');
      }
    }

    if (!pointer) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as {
          derived?: { last_active_child_id?: unknown } | null;
        };
        const raw = metadata?.derived?.last_active_child_id;
        pointer = typeof raw === 'string' && raw.trim().length > 0 ? raw.trim().replace(/\\/g, '/').replace(/\/+$/u, '') : null;
      } catch {
        hints.push(`Skipping phase-parent redirect: ${path.basename(folderPath)}/graph-metadata.json is unreadable.`);
        break;
      }
    }

    if (!pointer) {
      break;
    }

    // The pointer ships in two shapes: a bare child id ("001-phase") or a
    // track-relative spec-folder path that extends the current packet
    // ("track/parent/001-phase"). Reduce both to child segments under the
    // current folder and refuse anything that doesn't stay inside it.
    let childSegments: string[] | null = null;
    if (PHASE_CHILD_NAME_RE.test(pointer)) {
      childSegments = [pointer];
    } else if (pointer.startsWith(`${specFolder}/`)) {
      childSegments = pointer.slice(specFolder.length + 1).split('/');
    }
    if (!childSegments
      || childSegments.length === 0
      || !childSegments.every((segment) => PHASE_CHILD_NAME_RE.test(segment))) {
      if (pointer !== specFolder) {
        hints.push(`Ignoring phase-parent pointer ${pointer}: it does not name a child phase of ${specFolder}.`);
      }
      break;
    }

    const childPath = path.join(folderPath, ...childSegments);
    const childIsPacket = fs.existsSync(childPath)
      && fs.statSync(childPath).isDirectory()
      && (fs.existsSync(path.join(childPath, 'spec.md')) || fs.existsSync(path.join(childPath, 'description.json')));
    if (!childIsPacket) {
      hints.push(`Ignoring stale phase-parent pointer ${pointer}: child packet not found under ${specFolder}.`);
      break;
    }

    folderPath = childPath;
    specFolder = `${specFolder}/${childSegments.join('/')}`;
    hints.push(`Phase-parent redirect: followed derived.last_active_child_id into ${specFolder}.`);
  }

  return { folderPath, specFolder };
}

function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
  if (typeof specFolder !== 'string') {
    return null;
  }

  const trimmed = specFolder.trim().replace(/\\/g, '/').replace(/\/+$/u, '');
  if (trimmed.length === 0) {
    return null;
  }

  return trimmed
    .replace(/^\.opencode\/specs\//u, '')
    .replace(/^specs\//u, '')
    .replace(/^\.opencode\//u, '');
}

function parseIsoMs(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function stableSha256(content: Buffer): string {
  return `sha256:${createHash('sha256').update(content).digest('hex')}`;
}

function extractFrontmatter(markdown: string): string {
  return markdown.match(FRONTMATTER_RE)?.[1] ?? '';
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(FRONTMATTER_RE, '');
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith('\'') && trimmed.endsWith('\''))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function extractTopLevelField(frontmatter: string, field: string): string | null {
  if (!frontmatter) {
    return null;
  }

  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'miu'));
  return match ? stripQuotes(match[1]) : null;
}

function extractContinuityBlock(frontmatter: string): string | null {
  if (!frontmatter) {
    return null;
  }

  const lines = frontmatter.split(/\r?\n/u);
  const memoryIndex = lines.findIndex((line) => /^_memory:\s*$/u.test(line));
  if (memoryIndex < 0) {
    return null;
  }

  const continuityIndex = lines.findIndex((line, index) => index > memoryIndex && /^  continuity:\s*$/u.test(line));
  if (continuityIndex < 0) {
    return null;
  }

  const blockLines = [lines[continuityIndex]];
  for (let index = continuityIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.length === 0) {
      continue;
    }
    if (!/^    /u.test(line) && !/^      - /u.test(line)) {
      break;
    }
    blockLines.push(line);
  }

  return blockLines.join('\n');
}

function extractContinuityField(block: string, field: string): string | null {
  const match = block.match(new RegExp(`^    ${field}:\\s*(.+)$`, 'mu'));
  return match ? stripQuotes(match[1]) : null;
}

function extractContinuityList(block: string, field: string): string[] {
  const lines = block.split(/\r?\n/u);
  const startIndex = lines.findIndex((line) => new RegExp(`^    ${field}:\\s*$`, 'u').test(line));
  if (startIndex < 0) {
    const inlineMatch = block.match(new RegExp(`^    ${field}:\\s*\\[(.*)\\]\\s*$`, 'mu'));
    return inlineMatch
      ? inlineMatch[1].split(',').map((entry) => stripQuotes(entry)).map((entry) => entry.trim()).filter(Boolean)
      : [];
  }

  const result: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (!/^      - /u.test(line)) {
      break;
    }
    result.push(stripQuotes(line.replace(/^      - /u, '')));
  }
  return result;
}

function extractHeadingTitle(markdownBody: string): string | null {
  const match = markdownBody.match(/^#\s+(.+)$/mu);
  return match ? match[1].trim() : null;
}

function collectSummaryLines(markdownBody: string, maxLines = 3): string[] {
  return markdownBody
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => (
      line.length > 0
      && !line.startsWith('#')
      && !line.startsWith('<!--')
      && !line.startsWith('|')
      && !/^[-=*]{3,}$/u.test(line)
    ))
    .slice(0, maxLines);
}

function extractLabeledValue(markdownBody: string, labels: string[]): string | null {
  for (const label of labels) {
    const match = markdownBody.match(new RegExp(`\\*\\*${label}\\*\\*:\\s*(.+)$`, 'imu'));
    if (match?.[1]) {
      return match[1].trim();
    }

    const plainMatch = markdownBody.match(new RegExp(`^${label}:\\s*(.+)$`, 'imu'));
    if (plainMatch?.[1]) {
      return plainMatch[1].trim();
    }
  }

  return null;
}

function splitInlineList(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(/[;,]/u)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }

    const normalized = value.trim();
    if (normalized.length === 0 || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function pushPanelCandidate(
  candidates: ResumeRestorePanelItem[],
  seen: Set<string>,
  item: ResumeRestorePanelItem,
): void {
  const normalized = item.text.trim();
  if (normalized.length === 0) {
    return;
  }
  const key = `${item.facet}:${item.label}:${normalized}`;
  if (seen.has(key)) {
    return;
  }
  seen.add(key);
  candidates.push({ ...item, text: normalized });
}

function buildRestoredFacets(restored: ResumeRestorePanelItem[]): ContinuityFacets {
  const filtered: ContinuityFacets = {
    goal: [],
    decision: [],
    progress: [],
    gotcha: [],
  };

  for (const item of restored) {
    filtered[item.facet].push(item.text);
  }

  return filtered;
}

function enforceMarkdownBudget(markdown: string, maxChars: number): string {
  if (markdown.length <= maxChars) {
    return markdown;
  }

  return markdown.slice(0, maxChars);
}

function buildRestorePanel(params: {
  source: ResumeLadderSource;
  summary: string;
  recentAction: string | null;
  nextSafeAction: string | null;
  blockers: string[];
  keyFiles: string[];
  documents: ResumeLadderDocument[];
}): ResumeRestorePanel {
  const facets = buildContinuityFacets({
    summary: params.summary,
    recentAction: params.recentAction,
    nextSafeAction: params.nextSafeAction,
    blockers: params.blockers,
    keyFiles: params.keyFiles,
  });
  const candidates: ResumeRestorePanelItem[] = [];
  const seen = new Set<string>();
  const source = params.source;

  for (const text of facets.goal) {
    pushPanelCandidate(candidates, seen, { facet: 'goal', label: 'next-safe-action', source, text });
  }
  for (const text of facets.decision) {
    pushPanelCandidate(candidates, seen, { facet: 'decision', label: 'answered-question', source, text });
  }
  for (const text of facets.progress) {
    pushPanelCandidate(candidates, seen, { facet: 'progress', label: 'progress', source, text });
  }
  for (const text of facets.gotcha) {
    pushPanelCandidate(candidates, seen, { facet: 'gotcha', label: 'gotcha', source, text });
  }
  for (const document of params.documents) {
    pushPanelCandidate(candidates, seen, {
      facet: 'progress',
      label: document.relativePath,
      source: document.type === 'spec-doc' ? 'spec-docs' : document.type,
      text: `Recovered ${document.relativePath}`,
    });
  }

  const restored: ResumeRestorePanelItem[] = [];
  const omitted: ResumeRestorePanelOmission[] = [];
  let charCount = 0;
  for (const candidate of candidates) {
    const nextChars = candidate.text.length + candidate.label.length + 8;
    if (restored.length >= RESTORE_PANEL_MAX_ITEMS) {
      omitted.push({ facet: candidate.facet, label: candidate.label, reason: 'item-budget' });
      continue;
    }
    if (charCount + nextChars > RESTORE_PANEL_MAX_CHARS) {
      omitted.push({ facet: candidate.facet, label: candidate.label, reason: 'char-budget' });
      continue;
    }
    restored.push(candidate);
    charCount += nextChars;
  }

  const omittedByReason = omitted.reduce<Record<ResumeRestorePanelOmission['reason'], number>>((counts, item) => {
    counts[item.reason] += 1;
    return counts;
  }, { 'item-budget': 0, 'char-budget': 0 });
  const restoredFacets = buildRestoredFacets(restored);
  const markdown = enforceMarkdownBudget([
    `Restored: ${restored.length}`,
    `Not restored: ${omitted.length}`,
    '',
    renderContinuityFacets(restoredFacets),
  ].join('\n'), RESTORE_PANEL_MAX_CHARS);

  return {
    maxItems: RESTORE_PANEL_MAX_ITEMS,
    maxChars: RESTORE_PANEL_MAX_CHARS,
    restoredCount: restored.length,
    omittedCount: omitted.length,
    omittedByReason,
    facets: restoredFacets,
    restored,
    omitted,
    markdown,
  };
}

function getPriorityIndex(basename: string): number {
  const index = SPEC_DOC_PRIORITY.indexOf(basename as (typeof SPEC_DOC_PRIORITY)[number]);
  return index === -1 ? SPEC_DOC_PRIORITY.length : index;
}

function readStableMarkdownDocument(filePath: string, workspacePath: string): StableDocumentSnapshot {
  const before = fs.statSync(filePath);
  const raw = fs.readFileSync(filePath);
  const after = fs.statSync(filePath);

  if (
    before.size !== after.size
    || before.mtimeMs !== after.mtimeMs
    || before.ino !== after.ino
  ) {
    throw new Error(`Read of ${path.basename(filePath)} was not stable enough for fingerprint verification.`);
  }

  return {
    path: filePath,
    relativePath: path.relative(workspacePath, filePath).replace(/\\/g, '/'),
    basename: path.basename(filePath),
    content: raw.toString('utf8'),
    fingerprint: stableSha256(raw),
    modifiedAt: after.mtime.toISOString(),
    modifiedAtMs: after.mtimeMs,
  };
}

function toResumeDocument(
  snapshot: StableDocumentSnapshot,
  type: ResumeLadderDocument['type'],
): ResumeLadderDocument {
  return {
    type,
    path: snapshot.path,
    relativePath: snapshot.relativePath,
    fingerprint: snapshot.fingerprint,
    modifiedAt: snapshot.modifiedAt,
  };
}

function parseHandoverSignal(snapshot: StableDocumentSnapshot): ResumeSignal | null {
  const body = stripFrontmatter(snapshot.content);
  const recentAction = extractLabeledValue(body, ['Recent action', 'Recent Action']);
  const nextSafeAction = extractLabeledValue(body, ['Next safe action', 'Next action', 'Next Safe Action']);
  const blockers = splitInlineList(extractLabeledValue(body, ['Blockers']));
  const keyFiles = uniqueStrings(splitInlineList(extractLabeledValue(body, ['Key files', 'Key Files'])));
  const title = extractTopLevelField(extractFrontmatter(snapshot.content), 'title') ?? extractHeadingTitle(body);
  const summaryLines = collectSummaryLines(body);
  const summary = uniqueStrings([
    title,
    recentAction,
    nextSafeAction,
    ...summaryLines,
  ]).slice(0, 3).join(' | ');

  if (!recentAction && !nextSafeAction && summary.length === 0) {
    return null;
  }

  // Extract frontmatter once; try all known field aliases before falling back to mtime.
  // 'updated' covers handover files that use the shorter alias; the continuity-block
  // lookup handles last_updated_at written as an indented child of _memory.continuity
  // (regex ^field:\s* does not match leading-space lines, so block extraction is needed).
  const _hFrontmatter = extractFrontmatter(snapshot.content);
  const _hContinuityBlock = extractContinuityBlock(_hFrontmatter);
  const updatedAtMs = parseIsoMs(
    extractTopLevelField(_hFrontmatter, 'last_updated')
    ?? extractTopLevelField(_hFrontmatter, 'last_updated_at')
    ?? extractTopLevelField(_hFrontmatter, 'updated')
    ?? (_hContinuityBlock ? extractContinuityField(_hContinuityBlock, 'last_updated_at') : null)
    ?? snapshot.modifiedAt,
  ) ?? snapshot.modifiedAtMs;

  return {
    source: 'handover',
    updatedAtMs,
    summary,
    recentAction: recentAction ?? summaryLines[0] ?? title ?? null,
    nextSafeAction,
    blockers,
    keyFiles,
    documents: [toResumeDocument(snapshot, 'handover')],
  };
}

function parseContinuitySignal(
  snapshot: StableDocumentSnapshot,
  resolvedSpecFolder: string | null,
): ResumeSignal | null {
  const continuity = readThinContinuityRecord(snapshot.content);

  if (!continuity.ok || !continuity.record) {
    const frontmatter = extractFrontmatter(snapshot.content);
    const block = extractContinuityBlock(frontmatter);
    if (!block) {
      return null;
    }

    const packetPointer = extractContinuityField(block, 'packet_pointer');
    const lastUpdatedAt = extractContinuityField(block, 'last_updated_at');
    const lastUpdatedBy = extractContinuityField(block, 'last_updated_by');
    const recentAction = extractContinuityField(block, 'recent_action');
    const nextSafeAction = extractContinuityField(block, 'next_safe_action');

    if (!packetPointer || !lastUpdatedAt || !lastUpdatedBy || !recentAction || !nextSafeAction) {
      return null;
    }

    return {
      source: 'continuity',
      updatedAtMs: parseIsoMs(lastUpdatedAt) ?? snapshot.modifiedAtMs,
      summary: uniqueStrings([recentAction, nextSafeAction]).join(' | '),
      recentAction,
      nextSafeAction,
      blockers: extractContinuityList(block, 'blockers'),
      keyFiles: extractContinuityList(block, 'key_files'),
      documents: [toResumeDocument(snapshot, 'continuity')],
      packetPointer: packetPointer ?? resolvedSpecFolder,
    };
  }

  const record: ThinContinuityRecord = continuity.record;
  return {
    source: 'continuity',
    updatedAtMs: parseIsoMs(record.last_updated_at) ?? snapshot.modifiedAtMs,
    summary: uniqueStrings([record.recent_action, record.next_safe_action]).join(' | '),
    recentAction: record.recent_action,
    nextSafeAction: record.next_safe_action,
    blockers: record.blockers,
    keyFiles: record.key_files,
    documents: [toResumeDocument(snapshot, 'continuity')],
    packetPointer: record.packet_pointer,
  };
}

function parseSpecDocumentSignal(snapshots: StableDocumentSnapshot[]): ResumeSignal | null {
  if (snapshots.length === 0) {
    return null;
  }

  const ordered = [...snapshots].sort((left, right) => {
    const priorityDelta = getPriorityIndex(left.basename) - getPriorityIndex(right.basename);
    if (priorityDelta !== 0) {
      return priorityDelta;
    }
    return right.modifiedAtMs - left.modifiedAtMs;
  });

  const primary = ordered[0];
  const frontmatter = extractFrontmatter(primary.content);
  const body = stripFrontmatter(primary.content);
  const title = extractTopLevelField(frontmatter, 'title') ?? extractHeadingTitle(body) ?? primary.basename;
  const summaryLines = collectSummaryLines(body);
  const recentAction = summaryLines[0] ?? title;
  const nextSafeAction = ordered.some((entry) => entry.basename === 'tasks.md')
    ? 'Review tasks.md and continue the packet.'
    : `Review ${primary.basename} and continue the packet.`;
  const summary = uniqueStrings([title, ...summaryLines]).slice(0, 3).join(' | ');

  return {
    source: 'spec-docs',
    updatedAtMs: ordered.reduce((latest, entry) => Math.max(latest, entry.modifiedAtMs), primary.modifiedAtMs),
    summary,
    recentAction,
    nextSafeAction,
    blockers: [],
    keyFiles: ordered.map((entry) => entry.relativePath).slice(0, 5),
    documents: ordered.map((entry) => toResumeDocument(entry, 'spec-doc')),
  };
}

function buildPhaseParentContext(params: {
  folderPath: string;
  specFolder: string;
  redirectedSpecFolder: string | null;
  workspacePath: string;
  hints: string[];
}): ResumeLadderPhaseParentContext | null {
  const phaseChildren = listPhaseChildren(params.folderPath);
  if (!phaseChildren.some((child) => child.qualifies)) {
    return null;
  }

  const activeChild = params.redirectedSpecFolder?.startsWith(`${params.specFolder}/`)
    ? params.redirectedSpecFolder.slice(params.specFolder.length + 1).split('/')[0] ?? null
    : null;
  const children = phaseChildren.map((child) => ({
    name: child.name,
    qualifies: child.qualifies,
    active: child.name === activeChild,
  }));

  const documents: ResumeLadderDocument[] = [];
  for (const relativePath of SPEC_DOC_PRIORITY) {
    const docPath = path.join(params.folderPath, relativePath);
    if (!fs.existsSync(docPath) || !fs.statSync(docPath).isFile()) {
      continue;
    }

    try {
      documents.push(toResumeDocument(readStableMarkdownDocument(docPath, params.workspacePath), 'spec-doc'));
    } catch (error: unknown) {
      params.hints.push(`Skipping parent ${path.basename(docPath)} after fingerprint verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const childListing = children
    .map((child) => `${child.name}${child.active ? ' (active)' : ''}${child.qualifies ? '' : ' (no spec doc)'}`)
    .join(', ');
  const parentDocs = documents.map((document) => path.basename(document.relativePath)).join(', ');
  const summaryParts = [
    `Phase parent ${params.specFolder}: ${children.length} child phase${children.length === 1 ? '' : 's'}`,
    params.redirectedSpecFolder ? `redirect=${params.redirectedSpecFolder}` : null,
    `children=${childListing}`,
    parentDocs.length > 0 ? `parentDocs=${parentDocs}` : null,
  ].filter((part): part is string => typeof part === 'string' && part.length > 0);

  return {
    specFolder: params.specFolder,
    redirectedSpecFolder: params.redirectedSpecFolder,
    children,
    documents,
    summary: summaryParts.join('; '),
  };
}

function synthesizeResult(params: {
  primary: ResumeSignal;
  secondary?: ResumeSignal | null;
  phaseParent?: ResumeLadderPhaseParentContext | null;
  resolution: ResumeLadderResolution;
  hints: string[];
}): ResumeLadderResult {
  const { primary, secondary, phaseParent, resolution, hints } = params;
  const mergedBlockers = uniqueStrings([
    ...primary.blockers,
    ...(secondary?.blockers ?? []),
  ]);
  const mergedKeyFiles = uniqueStrings([
    ...primary.keyFiles,
    ...(secondary?.keyFiles ?? []),
  ]);
  const mergedDocuments = [...primary.documents];
  if (secondary) {
    for (const document of secondary.documents) {
      if (!mergedDocuments.some((candidate) => candidate.path === document.path)) {
        mergedDocuments.push(document);
      }
    }
  }

  const summary = uniqueStrings([
    primary.summary,
    secondary?.summary ?? null,
  ]).join(' | ');
  const recentAction = primary.recentAction ?? secondary?.recentAction ?? null;
  const nextSafeAction = primary.nextSafeAction ?? secondary?.nextSafeAction ?? null;
  const restorePanel = buildRestorePanel({
    source: primary.source,
    summary,
    recentAction,
    nextSafeAction,
    blockers: mergedBlockers,
    keyFiles: mergedKeyFiles,
    documents: mergedDocuments,
  });

  return {
    ...(phaseParent ? { phaseParent } : {}),
    source: primary.source,
    specFolder: resolution.resolvedSpecFolder,
    resolution,
    summary,
    recentAction,
    nextSafeAction,
    blockers: mergedBlockers,
    keyFiles: mergedKeyFiles,
    hints,
    documents: mergedDocuments,
    freshnessWinner: primary.source,
    restorePanel,
  };
}

function buildNoRecoveryResult(
  resolution: ResumeLadderResolution,
  hints: string[],
  phaseParent?: ResumeLadderPhaseParentContext | null,
): ResumeLadderResult {
  return {
    ...(phaseParent ? { phaseParent } : {}),
    source: 'none',
    specFolder: resolution.resolvedSpecFolder,
    resolution,
    summary: resolution.resolvedSpecFolder
      ? 'No recovery context found in handover.md, _memory.continuity, or spec docs. Start with /spec_kit:plan or inspect the packet directly.'
      : 'No recovery context found. Pass specFolder explicitly or start with /spec_kit:plan.',
    recentAction: null,
    nextSafeAction: null,
    blockers: [],
    keyFiles: [],
    hints,
    documents: [],
    freshnessWinner: null,
    restorePanel: buildRestorePanel({
      source: 'none',
      summary: '',
      recentAction: null,
      nextSafeAction: null,
      blockers: [],
      keyFiles: [],
      documents: [],
    }),
  };
}

function isPathWithinRoot(candidatePath: string, rootPath: string): boolean {
  const relativePath = path.relative(rootPath, candidatePath);
  return relativePath === ''
    || (
      !relativePath.startsWith(`..${path.sep}`)
      && relativePath !== '..'
      && !path.isAbsolute(relativePath)
    );
}

function resolveFromFolderPath(workspacePath: string, folderPath: string): string | null {
  const normalized = path.resolve(folderPath);
  const candidates = [
    path.join(workspacePath, '.opencode', 'specs'),
    path.join(workspacePath, 'specs'),
  ];

  for (const root of candidates) {
    if (normalized === root || !isPathWithinRoot(normalized, root)) {
      continue;
    }

    return path.relative(root, normalized).replace(/\\/g, '/').replace(/\/+$/u, '');
  }

  return null;
}

function resolveSpecFolder(options: ResumeLadderOptions, workspacePath: string): ResumeLadderResolution {
  const requestedSpecFolder = normalizeSpecFolder(options.specFolder);
  const fallbackSpecFolder = normalizeSpecFolder(options.fallbackSpecFolder);

  const allowedRoots = [
    path.join(workspacePath, '.opencode', 'specs'),
    path.join(workspacePath, 'specs'),
  ].map((root) => path.resolve(root));

  const resolveExistingFolder = (candidate: string | null): { folderPath: string; specFolder: string } | null => {
    if (!candidate) {
      return null;
    }

    const rawCandidates = path.isAbsolute(candidate)
      ? [path.resolve(candidate)]
      : [
        path.join(workspacePath, '.opencode', 'specs', candidate),
        path.join(workspacePath, 'specs', candidate),
      ];

    for (const candidatePath of rawCandidates) {
      const resolved = path.resolve(candidatePath);
      if (!allowedRoots.some((root) => resolved !== root && isPathWithinRoot(resolved, root))) {
        continue;
      }

      if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
        continue;
      }

      const resolvedFolder = resolveFromFolderPath(workspacePath, resolved);
      if (!resolvedFolder) {
        continue;
      }

      return {
        folderPath: resolved,
        specFolder: resolvedFolder,
      };
    }

    return null;
  };

  const explicit = resolveExistingFolder(requestedSpecFolder);
  if (explicit) {
    return {
      kind: 'explicit',
      requestedSpecFolder,
      fallbackSpecFolder,
      resolvedSpecFolder: explicit.specFolder,
      folderPath: explicit.folderPath,
    };
  }

  const fallback = resolveExistingFolder(fallbackSpecFolder);
  if (fallback) {
    return {
      kind: 'cached',
      requestedSpecFolder,
      fallbackSpecFolder,
      resolvedSpecFolder: fallback.specFolder,
      folderPath: fallback.folderPath,
    };
  }

  return {
    kind: 'unresolved',
    requestedSpecFolder,
    fallbackSpecFolder,
    resolvedSpecFolder: null,
    folderPath: null,
  };
}

/**
 * Resolve the canonical three-step resume ladder for a spec folder.
 *
 * The helper reads packet-local `handover.md` and `_memory.continuity` inside
 * `implementation-summary.md`, promotes whichever of those two sources is
 * fresher when both exist, then falls back to canonical spec documents when
 * no fresher packet-local recovery data is available.
 *
 * @param options - Optional spec-folder and workspace overrides for resolution
 * @returns Resume payload describing the best recovery source and hints
 */
export function buildResumeLadder(options: ResumeLadderOptions = {}): ResumeLadderResult {
  const workspacePath = options.workspacePath ?? process.cwd();
  const hints: string[] = [];
  const resolution = resolveSpecFolder(options, workspacePath);

  if (!resolution.folderPath || !resolution.resolvedSpecFolder) {
    return buildNoRecoveryResult(resolution, hints);
  }

  const requestedFolderPath = resolution.folderPath;
  const requestedSpecFolder = resolution.resolvedSpecFolder;
  const redirect = followPhaseParentRedirect(resolution.folderPath, resolution.resolvedSpecFolder, hints);
  const phaseParent = buildPhaseParentContext({
    folderPath: requestedFolderPath,
    specFolder: requestedSpecFolder,
    redirectedSpecFolder: redirect.specFolder !== requestedSpecFolder ? redirect.specFolder : null,
    workspacePath,
    hints,
  });
  if (redirect.specFolder !== resolution.resolvedSpecFolder) {
    resolution.folderPath = redirect.folderPath;
    resolution.resolvedSpecFolder = redirect.specFolder;
  }

  const folderPath: string = resolution.folderPath;
  let specDocPaths = findSpecDocuments(workspacePath, { specFolder: resolution.resolvedSpecFolder })
    .filter((candidate) => candidate.startsWith(folderPath));
  if (specDocPaths.length === 0) {
    specDocPaths = SPEC_DOC_PRIORITY
      .map((relativePath) => path.join(folderPath, relativePath))
      .filter((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  }
  const handoverPath = path.join(folderPath, 'handover.md');
  const implementationSummaryPath = path.join(folderPath, 'implementation-summary.md');

  let handoverSignal: ResumeSignal | null = null;
  if (fs.existsSync(handoverPath)) {
    try {
      handoverSignal = parseHandoverSignal(readStableMarkdownDocument(handoverPath, workspacePath));
    } catch (error: unknown) {
      hints.push(`Skipping handover.md after fingerprint verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  let continuitySignal: ResumeSignal | null = null;
  if (fs.existsSync(implementationSummaryPath)) {
    try {
      continuitySignal = parseContinuitySignal(
        readStableMarkdownDocument(implementationSummaryPath, workspacePath),
        resolution.resolvedSpecFolder,
      );
      if (!continuitySignal) {
        hints.push('implementation-summary.md continuity was missing or invalid; fell through to spec docs.');
      }
    } catch (error: unknown) {
      hints.push(`Skipping _memory.continuity after fingerprint verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    hints.push('implementation-summary.md was missing; continuity tier unavailable.');
  }

  if (
    resolution.kind === 'explicit'
    && continuitySignal?.packetPointer
    && normalizeSpecFolder(continuitySignal.packetPointer) !== resolution.resolvedSpecFolder
  ) {
    hints.push('Explicit specFolder override took precedence over the continuity packet pointer.');
  }

  const specDocSnapshots: StableDocumentSnapshot[] = [];
  for (const docPath of specDocPaths) {
    if (docPath === handoverPath) {
      continue;
    }

    try {
      specDocSnapshots.push(readStableMarkdownDocument(docPath, workspacePath));
    } catch (error: unknown) {
      hints.push(`Skipping ${path.basename(docPath)} after fingerprint verification failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const specDocSignal = parseSpecDocumentSignal(specDocSnapshots);

  if (handoverSignal && continuitySignal) {
    const primary = continuitySignal.updatedAtMs > handoverSignal.updatedAtMs ? continuitySignal : handoverSignal;
    const secondary = primary === handoverSignal ? continuitySignal : handoverSignal;
    hints.push(`Compared folder-local handover.md and _memory.continuity; selected ${primary.source} as the fresher resume source.`);
    return synthesizeResult({
      primary,
      secondary,
      phaseParent,
      resolution,
      hints,
    });
  }

  if (handoverSignal) {
    return synthesizeResult({
      primary: handoverSignal,
      secondary: continuitySignal,
      phaseParent,
      resolution,
      hints,
    });
  }

  if (continuitySignal) {
    return synthesizeResult({
      primary: continuitySignal,
      secondary: specDocSignal,
      phaseParent,
      resolution,
      hints,
    });
  }

  if (specDocSignal) {
    return synthesizeResult({
      primary: specDocSignal,
      phaseParent,
      resolution,
      hints,
    });
  }

  return buildNoRecoveryResult(resolution, hints, phaseParent);
}
