// ---------------------------------------------------------------
// MODULE: Gate 3 Classifier
// ---------------------------------------------------------------
// Shared typed classifier for the Gate 3 (SPEC FOLDER QUESTION) trigger surface.
// Addresses classifier edge cases from the foundational-runtime deep review.
//
// Runtime root docs (AGENTS.md, CLAUDE.md) and the
// speckit command entry docs cite this module as the machine contract.
// The prose trigger lists in those docs remain as human-readable references
// but the authoritative list of tokens lives here.
// ---------------------------------------------------------------

import * as fs from 'node:fs';
import * as path from 'node:path';

import { canonicalFold } from './unicode-normalization.js';

function assertNever(value: never, label: string): never {
  throw new Error(`Unexpected ${label}: ${String(value)}`);
}

// ---------------------------------------------------------------
// 1. TRIGGER SCHEMA
// ---------------------------------------------------------------

/** Token categories consumed by the classifier. */
export type TriggerCategory =
  | 'file_write'        // Creating / modifying / deleting files
  | 'memory_save'       // save context / save memory / /memory:save
  | 'resume'            // resume / continue iteration (write-producing flows)
  | 'read_only';        // review / audit / inspect / explain (disqualifiers)

/** Exact phrase vs single-token matching. */
export type MatchKind = 'phrase' | 'token';

/** One row in the classifier vocabulary. */
export interface TriggerEntry {
  /** The exact string to match, lowercased. */
  pattern: string;
  /** Whether `pattern` should match as a phrase (whitespace-tolerant) or a single token. */
  kind: MatchKind;
  /** Category classification. */
  category: TriggerCategory;
  /** Short comment explaining rationale (docs-only). */
  note?: string;
}

export type ExecutionMode = 'AUTONOMOUS' | 'INTERACTIVE' | 'ASK';

export type SpecFolderBindingSource =
  | 'flags'
  | 'pre_bound_setup_answers'
  | 'target_path_resolution'
  | 'prior_answer';

export type PreboundSpecFolderSource = Exclude<SpecFolderBindingSource, 'prior_answer'>;

export type Gate3SatisfiedBy = 'prebound_spec_folder' | 'prior_answer' | null;

export interface BoundSpecFolder {
  path: string;
  source: SpecFolderBindingSource;
  /** Retained for caller compatibility; validation is always recomputed locally. */
  validated?: boolean;
}

export interface CommandContract {
  declaresAutonomousExecution: boolean;
  ownsSpecFolderSetup: boolean;
  allowedSpecFolderSources: readonly PreboundSpecFolderSource[];
  writeBoundary?: string;
}

export interface ClassificationOptions {
  executionMode?: ExecutionMode;
  boundSpecFolder?: BoundSpecFolder | null;
  commandContract?: CommandContract | null;
}

export type SpecFolderBindingValidationReason =
  | 'valid'
  | 'missing_binding'
  | 'empty_path'
  | 'out_of_tree'
  | 'ambiguous_target_path'
  | 'missing_folder'
  | 'missing_metadata'
  | 'deprecated_or_superseded'
  | 'invalid_metadata'
  | 'phase_parent_without_active_child';

export interface SpecFolderBindingValidationOptions {
  workspaceRoot?: string;
}

export interface SpecFolderBindingValidation {
  valid: boolean;
  reason: SpecFolderBindingValidationReason;
  path: string | null;
  resolvedPath: string | null;
  resolvedAbsolutePath: string | null;
  writeBoundary: string | null;
}

/** Result of classifying a prompt. */
export interface ClassificationResult {
  /** Whether Gate 3 must be asked. */
  triggersGate3: boolean;
  /** Whether the generic Gate 3 prompt still needs to be emitted. */
  requiresGate3Prompt: boolean;
  /** Which trusted input satisfied Gate 3, if any. */
  satisfiedBy: Gate3SatisfiedBy;
  /** Canonical write boundary to enforce after satisfaction. */
  writeBoundary: string | null;
  /** Why (or why not). */
  reason: 'file_write_match' | 'memory_save_match' | 'resume_match' | 'read_only_override' | 'no_match';
  /** All trigger entries that matched. */
  matched: TriggerEntry[];
  /** All read-only disqualifiers that matched (may override file_write). */
  readOnlyMatched: TriggerEntry[];
}

type CoreClassificationResult = Omit<ClassificationResult, 'requiresGate3Prompt' | 'satisfiedBy' | 'writeBoundary'>;

interface SpecRoot {
  label: '.opencode/specs' | 'specs';
  absolutePath: string;
}

interface WriteBoundaryResolution {
  valid: boolean;
  path: string | null;
  absolutePath: string | null;
}

const SPEC_ROOTS: readonly SpecRoot['label'][] = ['.opencode/specs', 'specs'];
const MANDATORY_SPEC_METADATA_FILES = ['spec.md', 'description.json', 'graph-metadata.json'] as const;
const PHASE_CHILD_FOLDER_PATTERN = /^\d{3}-[a-z0-9-]+$/;

// ---------------------------------------------------------------
// 2. CANONICAL TRIGGER VOCABULARY
// ---------------------------------------------------------------

/**
 * File-write positive triggers.
 *
 * These phrases/tokens indicate the prompt is asking for a file modification,
 * requiring a spec folder.
 */
export const FILE_WRITE_TRIGGERS: readonly TriggerEntry[] = Object.freeze([
  { pattern: 'create',     kind: 'token', category: 'file_write' },
  { pattern: 'add',        kind: 'token', category: 'file_write' },
  { pattern: 'remove',     kind: 'token', category: 'file_write' },
  { pattern: 'delete',     kind: 'token', category: 'file_write' },
  { pattern: 'rename',     kind: 'token', category: 'file_write' },
  { pattern: 'move',       kind: 'token', category: 'file_write' },
  { pattern: 'update',     kind: 'token', category: 'file_write' },
  { pattern: 'change',     kind: 'token', category: 'file_write' },
  { pattern: 'modify',     kind: 'token', category: 'file_write' },
  { pattern: 'edit',       kind: 'token', category: 'file_write' },
  { pattern: 'fix',        kind: 'token', category: 'file_write' },
  { pattern: 'patch',      kind: 'token', category: 'file_write' },
  { pattern: 'refactor',   kind: 'token', category: 'file_write' },
  { pattern: 'implement',  kind: 'token', category: 'file_write' },
  { pattern: 'build',      kind: 'token', category: 'file_write' },
  { pattern: 'write',      kind: 'token', category: 'file_write' },
  { pattern: 'rewrite',    kind: 'token', category: 'file_write' },
  { pattern: 'generate',   kind: 'token', category: 'file_write' },
  { pattern: 'configure',  kind: 'token', category: 'file_write' },
]);

/**
 * Memory save triggers.
 *
 * Gate 3 applies to memory save flows because they write canonical continuity
 * artifacts (description.json, graph-metadata.json, and continuity frontmatter).
 */
export const MEMORY_SAVE_TRIGGERS: readonly TriggerEntry[] = Object.freeze([
  { pattern: 'save context',  kind: 'phrase', category: 'memory_save' },
  { pattern: 'save memory',   kind: 'phrase', category: 'memory_save' },
  { pattern: '/memory:save',  kind: 'phrase', category: 'memory_save' },
]);

/**
 * Resume / continue triggers.
 *
 * `/speckit:resume` and deep-loop resume/context flows produce writes such as
 * iteration markdown, JSONL appends, and generated artifacts, so they require
 * Gate 3 even when the surface name sounds read-only.
 */
export const RESUME_TRIGGERS: readonly TriggerEntry[] = Object.freeze([
  { pattern: '/speckit:resume',     kind: 'phrase', category: 'resume' },
  { pattern: '/deep:research', kind: 'phrase', category: 'resume' },
  { pattern: '/deep:start-research-loop', kind: 'phrase', category: 'resume' },
  { pattern: 'speckit:deep-research',   kind: 'phrase', category: 'resume' },
  { pattern: '/deep:review',   kind: 'phrase', category: 'resume' },
  { pattern: '/deep:start-review-loop', kind: 'phrase', category: 'resume' },
  { pattern: 'speckit:deep-review',     kind: 'phrase', category: 'resume' },
  { pattern: '/deep:ai-council', kind: 'phrase', category: 'resume' },
  { pattern: '/deep:context',    kind: 'phrase', category: 'resume' },
  { pattern: 'resume the packet',        kind: 'phrase', category: 'resume' },
  { pattern: 'resume the phase folder',  kind: 'phrase', category: 'resume' },
  { pattern: 'reconstruct continuity',   kind: 'phrase', category: 'resume' },
  { pattern: ':auto',               kind: 'phrase', category: 'resume', note: 'Matches alongside a speckit or /deep: loop command.' },
  { pattern: 'deep-research',       kind: 'phrase', category: 'resume' },
  { pattern: 'deep research',       kind: 'phrase', category: 'resume' },
  { pattern: 'deep-review',         kind: 'phrase', category: 'resume' },
  { pattern: 'deep review',         kind: 'phrase', category: 'resume' },
  { pattern: 'deep-loop',           kind: 'phrase', category: 'resume' },
  { pattern: 'research loop',       kind: 'phrase', category: 'resume' },
  { pattern: 'review loop',         kind: 'phrase', category: 'resume' },
  { pattern: 'iteration loop',      kind: 'phrase', category: 'resume' },
  { pattern: 'research sweep',      kind: 'phrase', category: 'resume' },
  { pattern: 'research cycle',      kind: 'phrase', category: 'resume' },
  { pattern: 'research run',        kind: 'phrase', category: 'resume' },
  { pattern: 'research wave',       kind: 'phrase', category: 'resume' },
  { pattern: 'review wave',         kind: 'phrase', category: 'resume' },
  { pattern: 'looped investigation',kind: 'phrase', category: 'resume' },
  { pattern: 'keep iterating',      kind: 'phrase', category: 'resume' },
  { pattern: 'autoresearch',        kind: 'phrase', category: 'resume' },
  { pattern: 'convergence',         kind: 'phrase', category: 'resume' },
  { pattern: ':confirm',            kind: 'phrase', category: 'resume', note: 'Matches alongside a speckit or /deep: command confirmation.' },
  { pattern: 'resume iteration',    kind: 'phrase', category: 'resume' },
  { pattern: 'resume deep research',kind: 'phrase', category: 'resume' },
  { pattern: 'resume deep review',  kind: 'phrase', category: 'resume' },
  { pattern: 'continue iteration',  kind: 'phrase', category: 'resume' },
]);

/**
 * Read-only disqualifiers.
 *
 * These tokens, when present WITHOUT a corresponding file-write / memory-save /
 * resume trigger, mark the request as read-only. This prevents false positives
 * for prompts like "analyze the decomposition phase" or "review / audit / inspect
 * the code".
 *
 * Note: `analyze`, `decompose`, `phase` were previously positive triggers but
 * false-positived on read-only review prompts. They are intentionally omitted
 * from positive triggers; `analyze` is included here as a read-only disqualifier.
 */
export const READ_ONLY_DISQUALIFIERS: readonly TriggerEntry[] = Object.freeze([
  { pattern: 'review',  kind: 'token', category: 'read_only' },
  { pattern: 'audit',   kind: 'token', category: 'read_only' },
  { pattern: 'inspect', kind: 'token', category: 'read_only' },
  { pattern: 'analyze', kind: 'token', category: 'read_only' },
  { pattern: 'explain', kind: 'token', category: 'read_only' },
]);

/** Full canonical vocabulary, exported for docs / linting. */
export const GATE_3_VOCABULARY = Object.freeze({
  fileWrite:           FILE_WRITE_TRIGGERS,
  memorySave:          MEMORY_SAVE_TRIGGERS,
  resume:              RESUME_TRIGGERS,
  readOnlyDisqualifier:READ_ONLY_DISQUALIFIERS,
});

// ---------------------------------------------------------------
// 3. NORMALIZATION
// ---------------------------------------------------------------

/**
 * Normalize a prompt for matching: lowercase and collapse whitespace, but
 * preserve `/` and `:` so command forms like `/speckit:resume` survive.
 */
export function normalizePrompt(prompt: string): string {
  return canonicalFold(prompt)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokenize a normalized prompt into alphanumeric + `/` + `:` words. */
export function tokenizePrompt(normalized: string): string[] {
  return normalized.split(/[^a-z0-9:/_-]+/).filter(Boolean);
}

// ---------------------------------------------------------------
// 4. MATCHING
// ---------------------------------------------------------------

/** Check if a single trigger entry matches a normalized prompt. */
export function matchesEntry(entry: TriggerEntry, normalized: string, tokens: string[]): boolean {
  if (entry.kind === 'phrase') {
    if (entry.pattern === ':auto' && entry.category === 'resume') {
      return normalized.includes(':auto') && (normalized.includes('speckit') || normalized.includes('/deep:'));
    }
    if (entry.pattern === ':confirm' && entry.category === 'resume') {
      return normalized.includes(':confirm') && (normalized.includes('speckit') || normalized.includes('/deep:'));
    }
    return normalized.includes(entry.pattern);
  }
  // token match — must appear as a standalone word
  return tokens.includes(entry.pattern);
}

// ---------------------------------------------------------------
// 5. SPEC FOLDER BINDING VALIDATION
// ---------------------------------------------------------------

function invalidBinding(reason: SpecFolderBindingValidationReason, pathValue: string | null = null): SpecFolderBindingValidation {
  return {
    valid: false,
    reason,
    path: pathValue,
    resolvedPath: null,
    resolvedAbsolutePath: null,
    writeBoundary: null,
  };
}

function normalizeFilesystemInput(value: string): string {
  return value.replace(/\\/g, '/').replace(/^\.\/+/, '').replace(/\/+$/, '');
}

function toWorkspaceRelative(absolutePath: string, workspaceRoot: string): string {
  const relativePath = path.relative(workspaceRoot, absolutePath).split(path.sep).join('/');
  return relativePath.length > 0 && !relativePath.startsWith('..') ? relativePath : absolutePath;
}

function pathIsWithin(parentPath: string, childPath: string): boolean {
  const relativePath = path.relative(parentPath, childPath);
  return relativePath === '' || (relativePath.length > 0 && !relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function safeRealpath(candidatePath: string): string {
  try {
    return fs.realpathSync(candidatePath);
  } catch {
    return path.resolve(candidatePath);
  }
}

function directoryExists(candidatePath: string): boolean {
  try {
    return fs.statSync(candidatePath).isDirectory();
  } catch {
    return false;
  }
}

function fileExists(candidatePath: string): boolean {
  try {
    return fs.statSync(candidatePath).isFile();
  } catch {
    return false;
  }
}

function findWorkspaceRoot(startPath: string): string {
  let current = path.resolve(startPath);
  let discoveredRoot: string | null = null;

  while (true) {
    const hasSpecRoot = directoryExists(path.join(current, '.opencode', 'specs'))
      || directoryExists(path.join(current, 'specs'));
    if (
      hasSpecRoot
      && (
        directoryExists(path.join(current, '.opencode', 'skills'))
        || (fileExists(path.join(current, 'AGENTS.md')) && directoryExists(path.join(current, '.opencode')))
      )
    ) {
      discoveredRoot = current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return safeRealpath(discoveredRoot ?? path.resolve(startPath));
    }
    current = parent;
  }
}

function getSpecRoots(workspaceRoot: string): SpecRoot[] {
  return SPEC_ROOTS.map((label) => ({
    label,
    absolutePath: path.resolve(workspaceRoot, label),
  }));
}

function hasSpecRootPrefix(normalizedPath: string): boolean {
  return normalizedPath === '.opencode/specs'
    || normalizedPath.startsWith('.opencode/specs/')
    || normalizedPath === 'specs'
    || normalizedPath.startsWith('specs/');
}

function containsTraversal(normalizedPath: string): boolean {
  return normalizedPath.split('/').includes('..');
}

function findContainingSpecRoot(candidatePath: string, specRoots: readonly SpecRoot[]): SpecRoot | null {
  const absoluteCandidate = path.resolve(candidatePath);
  for (const specRoot of specRoots) {
    if (pathIsWithin(path.resolve(specRoot.absolutePath), absoluteCandidate)) {
      return specRoot;
    }
  }
  return null;
}

function relativePathMatchesTarget(relativePath: string, targetPath: string): boolean {
  const relativeSegments = relativePath.split('/').filter(Boolean);
  const targetSegments = targetPath.split('/').filter(Boolean);
  if (relativeSegments.length < targetSegments.length || targetSegments.length === 0) {
    return false;
  }
  return relativeSegments.slice(-targetSegments.length).join('/') === targetSegments.join('/');
}

function collectSpecFolderCandidates(workspaceRoot: string, targetPath: string): string[] {
  const candidates: string[] = [];

  for (const specRoot of getSpecRoots(workspaceRoot)) {
    if (!directoryExists(specRoot.absolutePath)) {
      continue;
    }

    const stack = [specRoot.absolutePath];
    while (stack.length > 0) {
      const current = stack.pop();
      if (current === undefined) {
        continue;
      }

      const relativePath = path.relative(specRoot.absolutePath, current).split(path.sep).join('/');
      if (relativePathMatchesTarget(relativePath, targetPath)) {
        candidates.push(current);
      }

      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          stack.push(path.join(current, entry.name));
        }
      }
    }
  }

  return Array.from(new Set(candidates.map((candidate) => path.resolve(candidate))));
}

function resolveBindingCandidates(bindingPath: string, workspaceRoot: string): string[] {
  const trimmedPath = bindingPath.trim();
  const normalizedPath = normalizeFilesystemInput(trimmedPath);
  if (containsTraversal(normalizedPath)) {
    return [];
  }

  if (path.isAbsolute(trimmedPath)) {
    return [path.resolve(trimmedPath)];
  }
  if (hasSpecRootPrefix(normalizedPath)) {
    return [path.resolve(workspaceRoot, normalizedPath)];
  }

  return collectSpecFolderCandidates(workspaceRoot, normalizedPath);
}

function readJsonRecord(filePath: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }
  return null;
}

function readSpecStatus(specPath: string): string | null {
  let content: string;
  try {
    content = fs.readFileSync(specPath, 'utf8');
  } catch {
    return null;
  }

  const tableMatch = content.match(/^\|\s*\*\*Status\*\*\s*\|\s*([^|]+?)\s*\|/im);
  if (tableMatch?.[1]) {
    return tableMatch[1].trim();
  }

  const frontmatterMatch = content.match(/^status:\s*["']?([^"'\n]+?)["']?\s*$/im);
  return frontmatterMatch?.[1]?.trim() ?? null;
}

function isDeprecatedOrSuperseded(status: string | null): boolean {
  return status !== null && /^(deprecated|superseded)$/i.test(status.trim());
}

function isPhaseParent(folderPath: string): boolean {
  for (const entry of fs.readdirSync(folderPath, { withFileTypes: true })) {
    if (!entry.isDirectory() || !PHASE_CHILD_FOLDER_PATTERN.test(entry.name)) {
      continue;
    }
    const childPath = path.join(folderPath, entry.name);
    if (fileExists(path.join(childPath, 'spec.md')) || fileExists(path.join(childPath, 'description.json'))) {
      return true;
    }
  }
  return false;
}

function getLastActiveChildId(folderPath: string): string | null {
  const metadata = readJsonRecord(path.join(folderPath, 'graph-metadata.json'));
  if (metadata === null) {
    return null;
  }

  const derived = metadata.derived;
  const derivedRecord = derived !== null && typeof derived === 'object' && !Array.isArray(derived)
    ? derived as Record<string, unknown>
    : null;
  const candidate = derivedRecord?.last_active_child_id ?? metadata.last_active_child_id;

  return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate.trim() : null;
}

function resolvePhaseChildPath(parentPath: string, specRoot: SpecRoot, lastActiveChildId: string): string {
  if (path.isAbsolute(lastActiveChildId)) {
    return path.resolve(lastActiveChildId);
  }

  const normalizedChildId = normalizeFilesystemInput(lastActiveChildId);
  const childUnderSpecRoot = path.resolve(specRoot.absolutePath, normalizedChildId);
  if (directoryExists(childUnderSpecRoot)) {
    return childUnderSpecRoot;
  }

  const directChild = path.resolve(parentPath, normalizedChildId);
  if (directoryExists(directChild)) {
    return directChild;
  }

  return path.resolve(parentPath, path.basename(normalizedChildId));
}

function validateSpecFolderCandidate(
  candidatePath: string,
  workspaceRoot: string,
  seenPaths: Set<string>,
): SpecFolderBindingValidation {
  const absolutePath = path.resolve(candidatePath);
  const specRoots = getSpecRoots(workspaceRoot);
  const containingRoot = findContainingSpecRoot(absolutePath, specRoots);
  if (containingRoot === null) {
    return invalidBinding('out_of_tree', toWorkspaceRelative(absolutePath, workspaceRoot));
  }
  if (!directoryExists(absolutePath)) {
    return invalidBinding('missing_folder', toWorkspaceRelative(absolutePath, workspaceRoot));
  }

  const realFolderPath = safeRealpath(absolutePath);
  const realSpecRoot = safeRealpath(containingRoot.absolutePath);
  if (!pathIsWithin(realSpecRoot, realFolderPath)) {
    return invalidBinding('out_of_tree', toWorkspaceRelative(absolutePath, workspaceRoot));
  }
  if (seenPaths.has(realFolderPath)) {
    return invalidBinding('invalid_metadata', toWorkspaceRelative(realFolderPath, workspaceRoot));
  }
  seenPaths.add(realFolderPath);

  const missingMetadata = MANDATORY_SPEC_METADATA_FILES.some((fileName) => !fileExists(path.join(realFolderPath, fileName)));
  if (missingMetadata) {
    return invalidBinding('missing_metadata', toWorkspaceRelative(realFolderPath, workspaceRoot));
  }
  if (isDeprecatedOrSuperseded(readSpecStatus(path.join(realFolderPath, 'spec.md')))) {
    return invalidBinding('deprecated_or_superseded', toWorkspaceRelative(realFolderPath, workspaceRoot));
  }

  if (isPhaseParent(realFolderPath)) {
    const lastActiveChildId = getLastActiveChildId(realFolderPath);
    if (lastActiveChildId === null) {
      return invalidBinding('phase_parent_without_active_child', toWorkspaceRelative(realFolderPath, workspaceRoot));
    }
    return validateSpecFolderCandidate(
      resolvePhaseChildPath(realFolderPath, containingRoot, lastActiveChildId),
      workspaceRoot,
      seenPaths,
    );
  }

  const resolvedPath = toWorkspaceRelative(realFolderPath, workspaceRoot);
  return {
    valid: true,
    reason: 'valid',
    path: resolvedPath,
    resolvedPath,
    resolvedAbsolutePath: realFolderPath,
    writeBoundary: resolvedPath,
  };
}

/** Validate a bound spec folder by inspecting the filesystem, never caller trust. */
export function validateSpecFolderBinding(
  binding: BoundSpecFolder | null | undefined,
  options: SpecFolderBindingValidationOptions = {},
): SpecFolderBindingValidation {
  if (binding === null || binding === undefined) {
    return invalidBinding('missing_binding');
  }

  const trimmedPath = binding.path.trim();
  if (trimmedPath.length === 0) {
    return invalidBinding('empty_path');
  }

  const workspaceRoot = safeRealpath(path.resolve(options.workspaceRoot ?? findWorkspaceRoot(process.cwd())));
  const candidates = resolveBindingCandidates(trimmedPath, workspaceRoot);
  if (candidates.length === 0) {
    return invalidBinding('out_of_tree', normalizeFilesystemInput(trimmedPath));
  }
  if (candidates.length > 1) {
    return invalidBinding('ambiguous_target_path', normalizeFilesystemInput(trimmedPath));
  }

  return validateSpecFolderCandidate(candidates[0], workspaceRoot, new Set<string>());
}

function isPreboundSource(source: SpecFolderBindingSource): source is PreboundSpecFolderSource {
  return source !== 'prior_answer';
}

function resolveWriteBoundary(writeBoundary: string | undefined, workspaceRoot: string): WriteBoundaryResolution {
  if (writeBoundary === undefined || writeBoundary.trim().length === 0) {
    return { valid: false, path: null, absolutePath: null };
  }

  const candidates = resolveBindingCandidates(writeBoundary, workspaceRoot);
  if (candidates.length !== 1) {
    return { valid: false, path: null, absolutePath: null };
  }

  const absolutePath = path.resolve(candidates[0]);
  const containingRoot = findContainingSpecRoot(absolutePath, getSpecRoots(workspaceRoot));
  if (containingRoot === null || !directoryExists(absolutePath)) {
    return { valid: false, path: null, absolutePath: null };
  }

  const realBoundary = safeRealpath(absolutePath);
  if (!pathIsWithin(safeRealpath(containingRoot.absolutePath), realBoundary)) {
    return { valid: false, path: null, absolutePath: null };
  }

  return {
    valid: true,
    path: toWorkspaceRelative(realBoundary, workspaceRoot),
    absolutePath: realBoundary,
  };
}

function applyGate3Satisfaction(core: CoreClassificationResult, options: ClassificationOptions): Pick<ClassificationResult, 'requiresGate3Prompt' | 'satisfiedBy' | 'writeBoundary'> {
  if (!core.triggersGate3) {
    return { requiresGate3Prompt: false, satisfiedBy: null, writeBoundary: null };
  }

  const validation = validateSpecFolderBinding(options.boundSpecFolder);
  if (!validation.valid || validation.resolvedAbsolutePath === null) {
    return { requiresGate3Prompt: true, satisfiedBy: null, writeBoundary: null };
  }

  if (options.executionMode === 'INTERACTIVE' && options.boundSpecFolder?.source === 'prior_answer') {
    return { requiresGate3Prompt: false, satisfiedBy: 'prior_answer', writeBoundary: validation.writeBoundary };
  }

  const commandContract = options.commandContract;
  if (
    options.executionMode === 'AUTONOMOUS'
    && commandContract?.declaresAutonomousExecution === true
    && commandContract.ownsSpecFolderSetup === true
    && options.boundSpecFolder !== null
    && options.boundSpecFolder !== undefined
    && isPreboundSource(options.boundSpecFolder.source)
    && commandContract.allowedSpecFolderSources.includes(options.boundSpecFolder.source)
  ) {
    const workspaceRoot = findWorkspaceRoot(process.cwd());
    const boundary = resolveWriteBoundary(commandContract.writeBoundary, workspaceRoot);
    if (boundary.valid && boundary.absolutePath !== null && pathIsWithin(boundary.absolutePath, validation.resolvedAbsolutePath)) {
      return { requiresGate3Prompt: false, satisfiedBy: 'prebound_spec_folder', writeBoundary: boundary.path };
    }
  }

  return { requiresGate3Prompt: true, satisfiedBy: null, writeBoundary: null };
}

// ---------------------------------------------------------------
// 6. CORE CLASSIFIER
// ---------------------------------------------------------------

function triggerIndex(entry: TriggerEntry, normalized: string): number {
  return normalized.indexOf(entry.pattern);
}

function hasMixedWriteTail(
  normalized: string,
  writeMatches: TriggerEntry[],
  readOnlyMatches: TriggerEntry[],
): boolean {
  for (const readOnlyEntry of readOnlyMatches) {
    const readIndex = triggerIndex(readOnlyEntry, normalized);
    if (readIndex < 0) {
      continue;
    }

    for (const writeEntry of writeMatches) {
      const writeIndex = triggerIndex(writeEntry, normalized);
      if (writeIndex <= readIndex) {
        continue;
      }

      const between = normalized.slice(readIndex + readOnlyEntry.pattern.length, writeIndex);
      if (/\b(then|and|if)\b/.test(between) || between.includes(',')) {
        return true;
      }
    }
  }

  return false;
}

function hasWorkflowInvocationMarker(normalized: string): boolean {
  return /\b(run|use|start|begin|continue|resume|append|kick off|keep|launch)\b/.test(normalized);
}

function hasNegatedWriteAction(normalized: string, writeMatches: TriggerEntry[]): boolean {
  for (const writeEntry of writeMatches) {
    const writeIndex = triggerIndex(writeEntry, normalized);
    if (writeIndex < 0) {
      continue;
    }

    const prefix = normalized.slice(Math.max(0, writeIndex - 32), writeIndex);
    if (/\b(do not|don't|dont|without|no need to)\b/.test(prefix)) {
      return true;
    }
  }

  return /\bdo not (change|edit|save|write|update)\b/.test(normalized);
}

function hasFileTarget(normalized: string): boolean {
  return /`[^`]+\.(md|jsonl|json|ts|tsx|js|py|sh|txt|toml|ya?ml)`/.test(normalized)
    || /\b(file|folder|readme|docs?|corpus|checklist|implementation-summary|research\.md|tasks\.md)\b/.test(normalized);
}

function isPromptOnlyGeneration(normalized: string): boolean {
  if (!/\b(prompt|phrasing)\b/.test(normalized)) {
    return false;
  }
  if (hasFileTarget(normalized)) {
    return false;
  }
  return /\b(inline|in chat only|show it|just show|better phrasing|cleaner user prompt|prompt variant|prompt package|stronger system prompt)\b/.test(normalized)
    || /\b(create|generate|build|write)\b.*\b(prompt|phrasing)\b/.test(normalized);
}

/**
 * Classify a prompt against the Gate 3 trigger vocabulary.
 *
 * Decision order:
 * 1. Test positive triggers (file_write, memory_save, resume).
 * 2. If a resume or memory_save trigger matches → Gate 3 ALWAYS required
 *    (read_only disqualifiers cannot override).
 * 3. If only file_write triggers match:
 *    a. If any read_only disqualifier matches AND no file_write token is
 *       explicitly paired with a file target, Gate 3 is SUPPRESSED.
 *    b. Otherwise Gate 3 is required.
 * 4. If no positive trigger matches → Gate 3 not required.
 */
function classifyPromptCore(prompt: string): CoreClassificationResult {
  const normalized = normalizePrompt(prompt);
  const tokens = tokenizePrompt(normalized);

  const matched: TriggerEntry[] = [];
  const readOnlyMatched: TriggerEntry[] = [];

  let hasMemorySave = false;
  let hasResume = false;
  let hasFileWrite = false;

  for (const entry of MEMORY_SAVE_TRIGGERS) {
    if (matchesEntry(entry, normalized, tokens)) {
      matched.push(entry);
      hasMemorySave = true;
    }
  }
  for (const entry of RESUME_TRIGGERS) {
    if (matchesEntry(entry, normalized, tokens)) {
      matched.push(entry);
      hasResume = true;
    }
  }
  for (const entry of FILE_WRITE_TRIGGERS) {
    if (matchesEntry(entry, normalized, tokens)) {
      matched.push(entry);
      hasFileWrite = true;
    }
  }
  for (const entry of READ_ONLY_DISQUALIFIERS) {
    if (matchesEntry(entry, normalized, tokens)) {
      readOnlyMatched.push(entry);
    }
  }

  const fileWriteMatched = matched.filter((entry) => entry.category === 'file_write');
  const hasRecoverableMixedWriteTail = hasMixedWriteTail(normalized, fileWriteMatched, readOnlyMatched);
  if (hasFileWrite && (hasNegatedWriteAction(normalized, fileWriteMatched) || isPromptOnlyGeneration(normalized))) {
    return { triggersGate3: false, reason: readOnlyMatched.length > 0 ? 'read_only_override' : 'no_match', matched, readOnlyMatched };
  }

  // Memory save / resume: Gate 3 ALWAYS required (writes produced regardless).
  if (hasMemorySave) {
    return { triggersGate3: true, reason: 'memory_save_match', matched, readOnlyMatched };
  }
  if (hasResume) {
    if (readOnlyMatched.length > 0 && !hasWorkflowInvocationMarker(normalized) && !hasRecoverableMixedWriteTail) {
      return { triggersGate3: false, reason: hasFileWrite ? 'read_only_override' : 'no_match', matched, readOnlyMatched };
    }
    return { triggersGate3: true, reason: 'resume_match', matched, readOnlyMatched };
  }

  // File-write: read-only disqualifiers can override ONLY when there is no
  // direct file-write action (i.e., the file-write token appears alongside
  // a read-only verb like "review", "audit", "inspect").
  if (hasFileWrite) {
    if (readOnlyMatched.length > 0) {
      if (hasRecoverableMixedWriteTail) {
        return { triggersGate3: true, reason: 'file_write_match', matched, readOnlyMatched };
      }
      return { triggersGate3: false, reason: 'read_only_override', matched, readOnlyMatched };
    }
    return { triggersGate3: true, reason: 'file_write_match', matched, readOnlyMatched };
  }

  return { triggersGate3: false, reason: 'no_match', matched, readOnlyMatched };
}

export function classifyPrompt(prompt: string, options: ClassificationOptions = {}): ClassificationResult {
  const core = classifyPromptCore(prompt);
  return {
    ...core,
    ...applyGate3Satisfaction(core, options),
  };
}

// ---------------------------------------------------------------
// 7. JSON EXPORT (for non-TS consumers)
// ---------------------------------------------------------------

/** Serializable JSON snapshot of the vocabulary (for Python / YAML consumers). */
export interface Gate3VocabularySnapshot {
  version: string;
  fileWrite: readonly { pattern: string; kind: MatchKind }[];
  memorySave: readonly { pattern: string; kind: MatchKind }[];
  resume: readonly { pattern: string; kind: MatchKind }[];
  readOnlyDisqualifier: readonly { pattern: string; kind: MatchKind }[];
}

export const GATE_3_SCHEMA_VERSION = '1.0.0';

function getEntriesForCategory(category: TriggerCategory): readonly TriggerEntry[] {
  switch (category) {
    case 'file_write':
      return FILE_WRITE_TRIGGERS;
    case 'memory_save':
      return MEMORY_SAVE_TRIGGERS;
    case 'resume':
      return RESUME_TRIGGERS;
    case 'read_only':
      return READ_ONLY_DISQUALIFIERS;
    default:
      return assertNever(category, 'trigger-category');
  }
}

/** Return the vocabulary as a plain JSON snapshot. */
export function toJsonSnapshot(): Gate3VocabularySnapshot {
  const pick = (entries: readonly TriggerEntry[]) =>
    entries.map(({ pattern, kind }) => ({ pattern, kind }));
  return {
    version: GATE_3_SCHEMA_VERSION,
    fileWrite: pick(getEntriesForCategory('file_write')),
    memorySave: pick(getEntriesForCategory('memory_save')),
    resume: pick(getEntriesForCategory('resume')),
    readOnlyDisqualifier: pick(getEntriesForCategory('read_only')),
  };
}
