// ───────────────────────────────────────────────────────────────────
// MODULE: Skill Proposals
// ───────────────────────────────────────────────────────────────────
//
// A finished run can be turned into a draft skill with no model call. The
// draft and what it was built from live in the identity's proposals folder
// under the state root and never in a checkout, because unreviewed content
// must not land in the repository. One needs-you item reviews it, and its
// answer is pinned to the revision of the target the proposal read, so a
// target that changed since refuses.

import { createHash, randomBytes } from 'node:crypto';
import { chmodSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { classifyAction, clipAction } from './action-kind.js';
import { decideApproval } from './approval-ladder.js';
import { collectAllKnownSecrets, findSecretLiteral } from './dispatch.js';
import { SKILL_PROPOSALS_BOT_ID } from './label.js';
import { itemKind, needsYouExpiry, normalizeAnswer, readNeedsYouItem, writeNeedsYouItem } from './needs-you.js';
import { readRunRecord } from './run-record.js';
import { SKILL_NAME_PATTERN } from './skills.js';
import { identityStatePaths, isSafeSegment, STATE_DIR_MODE, STATE_FILE_MODE, writeGenerationStamp, writeStateFile } from './state-root.js';

import type { NeedsYouItem } from './needs-you.js';
import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & PATHS
// ───────────────────────────────────────────────────────────────────

/** The three files one proposal folder holds, each named once so a reader and a writer agree. */
export const PROPOSAL_FILES = Object.freeze({ draft: 'SKILL.md', proposal: 'proposal.json', answer: 'answer.json' } as const);

/**
 * The tree this runtime ships in, five folders above this file, the same root
 * the CLI uses when no --skilled-tree is given.
 */
export const DEFAULT_SKILLED_TREE = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');

/** What a proposal was built from: the target it read, the revision it read there and the run it came from. */
export interface ProposalRecord {
  schemaVersion: 1;
  targetPath: string;
  revisionRead: string | null;
  runId: string;
  botId: string;
  createdAt: string;
}

/** Everything one propose call needs. A missing name falls back to the proposing bot's id. */
export interface WriteProposalInput {
  stateRoot: string;
  identity: string;
  checkoutRoot: string;
  skilledTree: string;
  runId: string;
  name?: string | null;
  expiryDays: number;
  env?: NodeJS.ProcessEnv;
  now?: Date;
}

/** Where one proposal landed and what it read, so a caller can print the folder and the pin. */
export interface WriteProposalResult {
  itemId: string;
  name: string;
  targetPath: string;
  revisionRead: string | null;
  folder: string;
  draftPath: string;
  proposalPath: string;
}

/** The target path a name proposes into, relative to the checkout root. */
const TARGET_PATH_PATTERN = /^\.skilled\/skills\/[a-z0-9][a-z0-9-]*\/SKILL\.md$/;

/** The form of a pinned revision: the lower-case SHA-256 hex of the bytes read. */
const DIGEST_PATTERN = /^[0-9a-f]{64}$/;

/**
 * The folder one proposal lives in, inside the identity's proposals folder.
 * Nothing creates it here, so a read never makes a folder.
 */
export function proposalFolder(stateRoot: string, identity: string, runId: string): string {
  return join(identityStatePaths(stateRoot, identity).proposals, runId);
}

/** One file of one proposal folder. */
export function proposalFile(
  stateRoot: string,
  identity: string,
  runId: string,
  file: keyof typeof PROPOSAL_FILES,
): string {
  return join(proposalFolder(stateRoot, identity, runId), PROPOSAL_FILES[file]);
}

/** The checkout-relative path a proposal targets, so the operator knows where the draft belongs. */
export function targetPathFor(name: string): string {
  return `.skilled/skills/${name}/SKILL.md`;
}

// ───────────────────────────────────────────────────────────────────
// 2. THE DRAFT
// ───────────────────────────────────────────────────────────────────

/**
 * The draft text, filled from one run record. The four frontmatter keys and
 * the five section headings are the skill validator's requirement, so the
 * template is fixed text and every slot is filled from the record.
 */
export function buildDraft(input: {
  name: string;
  runId: string;
  botId: string;
  runFolder: string;
  exitReason: string;
}): string {
  const lines = [
    '---',
    `name: ${input.name}`,
    `description: "Proposed from run ${input.runId} of bot ${input.botId}. Rewrite this line before the skill goes live."`,
    'allowed-tools: ["Read"]',
    'version: 1.0.0.0',
    '---',
    '',
    `# ${input.name}`,
    '',
    '## WHEN TO USE',
    '',
    `Use this skill when a run has to repeat what run ${input.runId} did.`,
    '',
    '## SMART ROUTING',
    '',
    '| Request | Route |',
    '|---------|-------|',
    `| A run of ${input.botId} that repeats this work | This file |`,
    '',
    '## HOW IT WORKS',
    '',
    `1. Read the run folder at ${input.runFolder}.`,
    "2. Follow the steps the run's ledger records.",
    '',
    '## RULES',
    '',
    `- The run this skill came from exited ${input.exitReason}.`,
    '',
    '## REFERENCES',
    '',
    `- Run folder: ${input.runFolder}`,
  ];
  return `${lines.join('\n')}\n`;
}

/**
 * The characters a terminal does not show: the bidi overrides and isolates,
 * the zero-width spaces and joiners, the word joiner and the byte order mark.
 * Variation selectors are absent on purpose, because ordinary emoji in a skill
 * file carry them.
 */
const HIDDEN_CHARACTER = /[\u202A-\u202E\u2066-\u2069\u200B-\u200D\u2060\uFEFF]/;

/**
 * The first character a terminal would not show, with its code point and its
 * 1-based line, so a refusal names where to look.
 *
 * @returns The first hit, or null when the text holds none.
 */
export function findHiddenCharacter(text: string): { codePoint: string; line: number } | null {
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const found = HIDDEN_CHARACTER.exec(lines[index]);
    if (found === null) continue;
    const code = found[0].codePointAt(0) ?? 0;
    return { codePoint: `U+${code.toString(16).toUpperCase().padStart(4, '0')}`, line: index + 1 };
  }
  return null;
}

// ───────────────────────────────────────────────────────────────────
// 3. READ
// ───────────────────────────────────────────────────────────────────

/** True for a value that is an object and not an array, so a parsed file is read field by field. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The revision a stored value pins, or undefined when it is neither null nor a digest. */
function pinnedRevision(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (typeof value === 'string' && DIGEST_PATTERN.test(value)) return value;
  return undefined;
}

/**
 * Read one proposal back and check every field, so a damaged file reads as a
 * refusal rather than as a proposal a later step trusts.
 *
 * @returns The record, or `proposal-missing`, `proposal-unreadable` or `proposal-invalid`.
 */
export function readProposal(stateRoot: string, identity: string, runId: string): Result<ProposalRecord> {
  const path = proposalFile(stateRoot, identity, runId, 'proposal');
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    if (code === 'ENOENT') return { ok: false, reason: 'proposal-missing' };
    return { ok: false, reason: 'proposal-unreadable', detail: code ?? 'unknown error' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'proposal-invalid', detail: 'not valid JSON' };
  }
  if (!isPlainObject(parsed)) return { ok: false, reason: 'proposal-invalid', detail: 'schemaVersion' };
  if (parsed.schemaVersion !== 1) return { ok: false, reason: 'proposal-invalid', detail: 'schemaVersion' };

  const targetPath = parsed.targetPath;
  if (typeof targetPath !== 'string' || !TARGET_PATH_PATTERN.test(targetPath)) {
    return { ok: false, reason: 'proposal-invalid', detail: 'targetPath' };
  }
  const revisionRead = pinnedRevision(parsed.revisionRead);
  if (revisionRead === undefined) return { ok: false, reason: 'proposal-invalid', detail: 'revisionRead' };
  if (parsed.runId !== runId) return { ok: false, reason: 'proposal-invalid', detail: 'runId' };
  const botId = parsed.botId;
  if (typeof botId !== 'string' || botId === '') return { ok: false, reason: 'proposal-invalid', detail: 'botId' };
  const createdAt = parsed.createdAt;
  if (typeof createdAt !== 'string' || Number.isNaN(Date.parse(createdAt))) {
    return { ok: false, reason: 'proposal-invalid', detail: 'createdAt' };
  }
  return { ok: true, value: { schemaVersion: 1, targetPath, revisionRead, runId, botId, createdAt } };
}

// ───────────────────────────────────────────────────────────────────
// 4. THE REVIEW ITEM
// ───────────────────────────────────────────────────────────────────

/**
 * The one item that reviews a proposal. The item carries the reserved bot id,
 * so it names a review queue and never holds a real bot, and its kind keeps
 * the hold off as well.
 *
 * @returns The item, or the refusal `classifyAction` gives for the question.
 */
export function proposalReviewItem(input: {
  identity: string;
  runId: string;
  name: string;
  draftPath: string;
  proposalPath: string;
  runFolder: string;
  now: Date;
  expiryDays: number;
}): Result<NeedsYouItem> {
  const question = `Propose skill ${input.name}?`;
  const classified = classifyAction(question);
  if (!classified.ok) return classified;
  return {
    ok: true,
    value: {
      id: input.runId,
      runId: input.runId,
      botId: SKILL_PROPOSALS_BOT_ID,
      identity: input.identity,
      question,
      options: ['confirm', 'reject'],
      createdAt: input.now.toISOString(),
      expiresAt: needsYouExpiry(input.now, input.expiryDays),
      evidence: [input.draftPath, input.proposalPath, input.runFolder],
      prompt: question,
      specFolder: null,
      answer: null,
      resumeRequestId: null,
      kind: 'skill-proposal',
      proposalType: null,
      proposalFact: null,
      proposalBotId: null,
      grants: {
        kind: classified.value,
        action: clipAction(question),
        rung: decideApproval({ kind: classified.value }).rung,
        scope: null,
        grantedBy: null,
        grantedAt: null,
      },
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. WRITE
// ───────────────────────────────────────────────────────────────────

/** What one target read found: the digest of its bytes, no file at all, or the error code that stopped the read. */
type TargetRead = { kind: 'digest'; digest: string } | { kind: 'absent' } | { kind: 'error'; code: string };

/**
 * Read one target body and digest its bytes. A missing file is a state and not
 * a failure, because a proposal may create a skill that does not exist yet.
 */
function readTarget(path: string): TargetRead {
  let bytes: Buffer;
  try {
    bytes = readFileSync(path);
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    if (code === 'ENOENT' || code === 'ENOTDIR') return { kind: 'absent' };
    return { kind: 'error', code: code ?? 'unknown error' };
  }
  return { kind: 'digest', digest: createHash('sha256').update(bytes).digest('hex') };
}

/** The errno code of a caught error, or its message when it carries no code. */
function errorDetail(error: unknown): string {
  const code = (error as NodeJS.ErrnoException | null)?.code;
  if (typeof code === 'string') return code;
  return error instanceof Error ? error.message : String(error);
}

/**
 * Turn one finished run into a draft skill and the review item that asks about
 * it. Every check runs before the first write, so a refusal leaves the state
 * root byte for byte unchanged. The write order is the repair rule: the draft,
 * then the record of what it was built from, then the item, so a re-run with
 * both files and no item overwrites both and repairs an interrupted proposal.
 *
 * @returns Where the proposal landed and what it read, or the first refusal.
 */
export function writeProposal(input: WriteProposalInput): Result<WriteProposalResult> {
  // The id check runs before any read, so no id can leave the proposals folder.
  if (!isSafeSegment(input.runId)) return { ok: false, reason: 'run-id-invalid', detail: input.runId };

  const read = readRunRecord(input.stateRoot, input.identity, input.runId);
  if (!read.ok) {
    if (read.reason === 'record-missing') return { ok: false, reason: 'run-record-missing', detail: input.runId };
    return read;
  }
  const record = read.value.record;

  const name = input.name ?? record.identity.botId;
  if (!SKILL_NAME_PATTERN.test(name)) return { ok: false, reason: 'skills-name-invalid', detail: name };

  const targetPath = targetPathFor(name);
  const target = readTarget(join(input.skilledTree, targetPath));
  if (target.kind === 'error') return { ok: false, reason: 'target-unreadable', detail: `${targetPath} (${target.code})` };
  const revisionRead = target.kind === 'digest' ? target.digest : null;

  const draft = buildDraft({
    name,
    runId: record.identity.runId,
    botId: record.identity.botId,
    runFolder: record.evidence.runFolder,
    exitReason: record.exit.reason,
  });

  const allKnown = collectAllKnownSecrets(input.env ?? process.env, input.checkoutRoot, input.stateRoot, input.identity);
  if (!allKnown.ok) return allKnown;
  const match = findSecretLiteral(draft, allKnown.value);
  if (match !== null) return { ok: false, reason: 'proposal-secret', detail: match.name };

  const hidden = findHiddenCharacter(draft);
  if (hidden !== null) {
    return { ok: false, reason: 'proposal-hidden-character', detail: `${hidden.codePoint} at line ${hidden.line}` };
  }

  const existing = readNeedsYouItem(input.stateRoot, input.identity, input.runId);
  if (existing.ok) {
    const kind = itemKind(existing.value);
    if (kind === 'skill-proposal') return { ok: false, reason: 'review-already-exists', detail: input.runId };
    return { ok: false, reason: 'review-already-exists', detail: `${input.runId} (${kind})` };
  }
  // A damaged item file is never overwritten, so only a missing one goes on.
  if (existing.reason !== 'item-missing') return existing;

  const now = input.now ?? new Date();
  const folder = proposalFolder(input.stateRoot, input.identity, input.runId);
  const draftPath = proposalFile(input.stateRoot, input.identity, input.runId, 'draft');
  const proposalPath = proposalFile(input.stateRoot, input.identity, input.runId, 'proposal');
  const proposal: ProposalRecord = {
    schemaVersion: 1,
    targetPath,
    revisionRead,
    runId: record.identity.runId,
    botId: record.identity.botId,
    createdAt: now.toISOString(),
  };

  const temp = `${draftPath}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
  try {
    mkdirSync(folder, { recursive: true, mode: STATE_DIR_MODE });
    try {
      writeFileSync(temp, draft, { mode: STATE_FILE_MODE });
      chmodSync(temp, STATE_FILE_MODE);
      renameSync(temp, draftPath);
    } catch (error: unknown) {
      rmSync(temp, { force: true });
      throw error;
    }
    writeStateFile(proposalPath, proposal);
  } catch (error: unknown) {
    return { ok: false, reason: 'proposal-unwritten', detail: errorDetail(error) };
  }

  const item = proposalReviewItem({
    identity: input.identity,
    runId: input.runId,
    name,
    draftPath,
    proposalPath,
    runFolder: record.evidence.runFolder,
    now,
    expiryDays: input.expiryDays,
  });
  if (!item.ok) return item;
  const written = writeNeedsYouItem(input.stateRoot, item.value);
  if (!written.ok) return written;
  writeGenerationStamp(input.stateRoot, input.identity, now);

  return { ok: true, value: { itemId: input.runId, name, targetPath, revisionRead, folder, draftPath, proposalPath } };
}

// ───────────────────────────────────────────────────────────────────
// 6. THE ANSWER SEAM
// ───────────────────────────────────────────────────────────────────

/**
 * The half of an answer that runs before anything is written. The pin reads
 * the target under the skilled tree root, the same root the loader reads,
 * never under the process's working directory, so a body that changed, a
 * target that appeared where none was read and a target that vanished all
 * refuse here and leave the item open.
 *
 * @returns `claimed` to go on, `not-a-proposal` for any other item, or `proposal-stale`.
 */
export function claimProposalAnswer(input: {
  stateRoot: string;
  identity: string;
  skilledTree: string;
  item: NeedsYouItem;
}): Result<'claimed' | 'not-a-proposal'> {
  if (itemKind(input.item) !== 'skill-proposal') return { ok: true, value: 'not-a-proposal' };
  // A damaged proposal reads as no proposal rather than refusing every answer.
  const read = readProposal(input.stateRoot, input.identity, input.item.runId);
  if (!read.ok) return { ok: true, value: 'not-a-proposal' };
  const proposal = read.value;
  const name = proposal.targetPath.split('/')[2];
  const target = readTarget(join(input.skilledTree, proposal.targetPath));
  if (target.kind === 'error') return { ok: false, reason: 'proposal-stale', detail: `${name} (${target.code})` };
  const current = target.kind === 'digest' ? target.digest : null;
  if (current !== proposal.revisionRead) return { ok: false, reason: 'proposal-stale', detail: name };
  return { ok: true, value: 'claimed' };
}

/**
 * The half of an answer that runs after the answer is written. The review is
 * recorded beside the proposal, and a second settle that would write the same
 * bytes writes nothing, so answering twice changes nothing.
 *
 * @returns `recorded`, `not-a-proposal` for any other item, or a refusal.
 */
export function settleProposalAnswer(input: {
  stateRoot: string;
  identity: string;
  item: NeedsYouItem;
  decision: 'confirm' | 'reject';
}): Result<'recorded' | 'not-a-proposal'> {
  const read = readProposal(input.stateRoot, input.identity, input.item.runId);
  if (!read.ok) return { ok: true, value: 'not-a-proposal' };
  const proposal = read.value;
  if (input.item.answer === null) return { ok: false, reason: 'item-unanswered', detail: input.item.id };
  const answer = normalizeAnswer(input.item.answer);
  const record = {
    schemaVersion: 1,
    decision: input.decision,
    text: answer.text,
    by: answer.by ?? 'unknown',
    scope: answer.scope,
    answeredAt: answer.answeredAt,
    revisionRead: proposal.revisionRead,
  };
  const path = proposalFile(input.stateRoot, input.identity, input.item.runId, 'answer');
  const serialized = `${JSON.stringify(record, null, 2)}\n`;
  let current: string | null = null;
  try {
    current = readFileSync(path, 'utf8');
  } catch {
    current = null;
  }
  if (current === serialized) return { ok: true, value: 'recorded' };
  try {
    writeStateFile(path, record);
  } catch (error: unknown) {
    return { ok: false, reason: 'proposal-unwritten', detail: errorDetail(error) };
  }
  return { ok: true, value: 'recorded' };
}
