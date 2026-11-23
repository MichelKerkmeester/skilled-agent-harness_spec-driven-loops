// ───────────────────────────────────────────────────────────────────
// MODULE: Definition Approval
// ───────────────────────────────────────────────────────────────────
//
// A run with write access to the checkout can edit its own BOT.md or the
// repository's bots/config.json, and the next unattended fire would obey the
// edit: a precheck it rewrote runs as plain shell, an isolation it dropped
// goes unenforced. So an unattended run (a scheduled fire, a queued request,
// a resume) runs only the exact bytes an operator approved. Approval is a
// hash of both files, kept under the user-level state root where no run can
// write, and it is written only at the points an operator acts: installing a
// schedule, enabling a bot, and running a bot by hand. A manual run is never
// refused for drift, because the operator typing it is the approval.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { approvalFile, STATE_DIR_MODE } from './state-root.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The operator act an approval came from. */
export type ApprovalSource = 'install' | 'enable' | 'manual-run';

/** What an approval file holds. */
export interface DefinitionApproval {
  schemaVersion: 1;
  botId: string;
  definitionDigest: string;
  configDigest: string;
  approvedAt: string;
  approvedBy: ApprovalSource;
}

/** Why an unattended run may not use the definition it found. */
export interface ApprovalRefusal {
  cause: 'definition-unapproved' | 'definition-drifted';
  detail: string;
}

/** The digest of a file that is not there, so a config added later reads as a change. */
export const ABSENT_DIGEST = 'absent';

const CONFIG_RELATIVE = join('bots', 'config.json');

// ───────────────────────────────────────────────────────────────────
// 2. DIGESTS
// ───────────────────────────────────────────────────────────────────

/** The digest a run record already carries for a definition: `sha256:` and the hex hash of its bytes. */
export function digestOf(bytes: Buffer): string {
  return `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}

/**
 * The digest of one file, or `absent` when it does not exist. Any other read
 * failure throws, so an unreadable file is never taken for a missing one.
 */
function fileDigest(path: string): string {
  try {
    return digestOf(readFileSync(path));
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException | null)?.code === 'ENOENT') return ABSENT_DIGEST;
    throw error;
  }
}

/** The digest of a checkout's `bots/config.json`. */
export function configDigest(checkoutRoot: string): string {
  return fileDigest(join(checkoutRoot, CONFIG_RELATIVE));
}

// ───────────────────────────────────────────────────────────────────
// 3. APPROVE & CHECK
// ───────────────────────────────────────────────────────────────────

export interface ApprovalInput {
  stateRoot: string;
  identity: string;
  checkoutRoot: string;
  botId: string;
}

/**
 * Record the definition and config as they are now as approved for a bot's
 * unattended runs. `definitionDigest` names the bytes the caller vetted, so
 * an edit made after the caller read them is never approved by accident.
 *
 * @returns The approval written.
 */
export function approveDefinition(input: ApprovalInput & { definitionDigest: string; by: ApprovalSource; now?: Date }): DefinitionApproval {
  const approval: DefinitionApproval = {
    schemaVersion: 1,
    botId: input.botId,
    definitionDigest: input.definitionDigest,
    configDigest: configDigest(input.checkoutRoot),
    approvedAt: (input.now ?? new Date()).toISOString(),
    approvedBy: input.by,
  };
  const path = approvalFile(input.stateRoot, input.identity, input.botId);
  mkdirSync(dirname(path), { recursive: true, mode: STATE_DIR_MODE });
  writeStateAtomic(path, approval);
  return approval;
}

/** Read one bot's approval; null when there is none, a damaged file included. */
export function readApproval(stateRoot: string, identity: string, botId: string): DefinitionApproval | null {
  try {
    const parsed = JSON.parse(readFileSync(approvalFile(stateRoot, identity, botId), 'utf8')) as Partial<DefinitionApproval>;
    if (parsed.schemaVersion !== 1 || typeof parsed.definitionDigest !== 'string' || typeof parsed.configDigest !== 'string') return null;
    return parsed as DefinitionApproval;
  } catch {
    return null;
  }
}

/**
 * Decide whether an unattended run may use the definition it read. A bot with
 * no readable approval is refused as unapproved, so a damaged approval file
 * fails closed; a definition or config whose hash differs is refused as drifted.
 *
 * @returns Null when both hashes match the approval, else the refusal.
 */
export function checkApproval(input: ApprovalInput & { definitionDigest: string }): ApprovalRefusal | null {
  const approval = readApproval(input.stateRoot, input.identity, input.botId);
  if (approval === null) {
    return {
      cause: 'definition-unapproved',
      detail: `no approval is recorded for ${input.botId}; run bots enable ${input.botId}, reinstall its schedule, or run it by hand once`,
    };
  }
  const changed = [
    ...(approval.definitionDigest !== input.definitionDigest ? [`bots/${input.botId}/BOT.md`] : []),
    ...(approval.configDigest !== configDigest(input.checkoutRoot) ? [CONFIG_RELATIVE] : []),
  ];
  if (changed.length === 0) return null;
  return {
    cause: 'definition-drifted',
    detail: `${changed.join(' and ')} changed since the ${approval.approvedBy} approval at ${approval.approvedAt}; review the change, then run bots enable ${input.botId} or run it by hand to approve it`,
  };
}
