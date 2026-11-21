// ───────────────────────────────────────────────────────────────────
// MODULE: Route Receipt
// ───────────────────────────────────────────────────────────────────
// A route receipt records the skill the advisor last delivered on its own
// evidence in a session, stamped with that session's lifecycle clock. A later
// weak follow-up that would route elsewhere only on the confidence floor is
// held back against it, because the earlier brief is still in the model's
// context and the floored route would steer the model off the session's task.
// Every fault reads as no receipt, and no receipt means the turn delivers.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { createHash, randomBytes } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { promptPolicyTokens } from '../../runtime/lib/prompt-policy.js';
import {
  DIRECTIVE_LIFECYCLE_STATE_DIR_ENV,
  MAX_DIRECTIVE_LIFECYCLE_SESSIONS,
  type DirectiveLifecycleClock,
} from './directive-lifecycle-contract.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export const ROUTE_RECEIPT_VERSION = 1;

export interface RouteReceipt {
  readonly version: typeof ROUTE_RECEIPT_VERSION;
  readonly sessionId: string;
  readonly skill: string;
  readonly storeGeneration: string;
  readonly lifecycleEpoch: string;
  readonly transcriptBytes: number | null;
}

export interface RouteReceiptStore {
  read(sessionId: string): RouteReceipt | null;
  write(receipt: RouteReceipt): boolean;
}

export interface RouteReceiptGuardInput {
  readonly receipt: RouteReceipt | null;
  // Called last, because the durable clock costs a helper spawn and most turns
  // fail a cheaper check first.
  readonly clock: () => DirectiveLifecycleClock | null;
  readonly transcriptBytes: number | null;
  readonly strippedPrompt: string;
  readonly policyReason: string;
  readonly topSkill: string | null;
  readonly topFloored: boolean;
}

export type RouteReceiptGuardDecision = 'deliver' | 'suppress';

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const ROUTE_RECEIPT_DIR = 'route-receipts';
const MAX_ROUTE_RECEIPT_BYTES = 4096;
const STALE_TEMP_FILE_MS = 5 * 60 * 1000;
const WORK_INTENT_REASON = 'work_intent_with_meaningful_tokens';

// Words that point back at the earlier turn instead of naming new work.
// Additive words such as "also", "too" and "as well" are left out: they put
// new work beside the earlier turn rather than point back at it.
const BACK_REFERENCE_WORDS = new Set([
  'that', 'it', 'this', 'there', 'them', 'those', 'these',
  'same', 'again', 'remaining', 'ones',
]);

// A follow-up that names more words of its own than this carries enough
// evidence to be routed on its own terms.
const MAX_WEAK_FOLLOW_UP_CONTENT_WORDS = 3;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function routeReceiptBaseDir(): string {
  const envBase = process.env[DIRECTIVE_LIFECYCLE_STATE_DIR_ENV];
  return resolve(envBase?.trim() ? envBase.trim() : join(tmpdir(), 'speckit-advisor'));
}

function receiptFileName(sessionId: string): string {
  return `${createHash('sha256').update(sessionId).digest('hex').slice(0, 16)}.json`;
}

function parseReceipt(raw: string, sessionId: string): RouteReceipt | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== 'object' || value === null) return null;
  const record = value as Record<string, unknown>;
  const transcriptBytes = record.transcriptBytes;
  if (record.version !== ROUTE_RECEIPT_VERSION
    || record.sessionId !== sessionId
    || typeof record.skill !== 'string'
    || record.skill.length === 0
    || typeof record.storeGeneration !== 'string'
    || typeof record.lifecycleEpoch !== 'string'
    || !(transcriptBytes === null
      || (typeof transcriptBytes === 'number' && Number.isFinite(transcriptBytes) && transcriptBytes >= 0))) {
    return null;
  }
  return {
    version: ROUTE_RECEIPT_VERSION,
    sessionId,
    skill: record.skill,
    storeGeneration: record.storeGeneration,
    lifecycleEpoch: record.lifecycleEpoch,
    transcriptBytes,
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * True when a prompt points back at earlier work and names little of its own.
 *
 * Back-reference words are read from every token, because some of them, such
 * as "it", are policy stop words. Content words are the policy's meaningful
 * tokens minus back-reference words and work-intent verbs.
 */
export function isWeakFollowUp(strippedPrompt: string): boolean {
  const { tokens, meaningful, workVerbs } = promptPolicyTokens(strippedPrompt);
  if (!tokens.some((token) => BACK_REFERENCE_WORDS.has(token))) return false;
  const verbs = new Set(workVerbs);
  const contentWords = meaningful.filter((token) => !BACK_REFERENCE_WORDS.has(token) && !verbs.has(token));
  return contentWords.length <= MAX_WEAK_FOLLOW_UP_CONTENT_WORDS;
}

/**
 * Decide whether a turn's brief is held back against the session's earlier route.
 *
 * Suppresses only a floored work-intent weak follow-up whose top skill differs
 * from a receipt that is still current: same lifecycle clock and a transcript
 * that has not shrunk. Anything else delivers, so a missing or stale receipt
 * leaves the turn as it would be without receipts.
 */
export function decideRouteReceiptGuard(input: RouteReceiptGuardInput): RouteReceiptGuardDecision {
  const { receipt } = input;
  if (receipt === null
    || input.policyReason !== WORK_INTENT_REASON
    || !input.topFloored
    || input.topSkill === null
    || input.topSkill === receipt.skill
    || !isWeakFollowUp(input.strippedPrompt)) {
    return 'deliver';
  }
  if (typeof receipt.transcriptBytes === 'number'
    && typeof input.transcriptBytes === 'number'
    && input.transcriptBytes < receipt.transcriptBytes) {
    return 'deliver';
  }
  const clock = input.clock();
  if (clock === null
    || clock.storeGeneration !== receipt.storeGeneration
    || clock.lifecycleEpoch !== receipt.lifecycleEpoch) {
    return 'deliver';
  }
  return 'suppress';
}

/** Process-local receipts for tests and in-process callers. */
export class InMemoryRouteReceiptStore implements RouteReceiptStore {
  private readonly receipts = new Map<string, RouteReceipt>();

  read(sessionId: string): RouteReceipt | null {
    return this.receipts.get(sessionId) ?? null;
  }

  write(receipt: RouteReceipt): boolean {
    while (this.receipts.size >= MAX_DIRECTIVE_LIFECYCLE_SESSIONS && !this.receipts.has(receipt.sessionId)) {
      const oldest = this.receipts.keys().next().value;
      if (typeof oldest !== 'string') break;
      this.receipts.delete(oldest);
    }
    this.receipts.set(receipt.sessionId, receipt);
    return true;
  }
}

/**
 * One small JSON file per session beside the other per-session advisor state.
 *
 * A write lands through a same-folder temp file and a rename, so a reader sees
 * the old receipt or the new one, never a torn file. No lock is taken: two
 * writers on one session each leave a valid receipt, and any unreadable file
 * reads as no receipt, which delivers.
 */
export class FileRouteReceiptStore implements RouteReceiptStore {
  private readonly baseDir: string;
  private readonly dir: string;

  constructor(baseDir: string = routeReceiptBaseDir()) {
    this.baseDir = resolve(baseDir);
    this.dir = join(this.baseDir, ROUTE_RECEIPT_DIR);
  }

  read(sessionId: string): RouteReceipt | null {
    try {
      if (!this.ownedFolder()) return null;
      const path = join(this.dir, receiptFileName(sessionId));
      const stat = lstatSync(path);
      if (!stat.isFile() || stat.size > MAX_ROUTE_RECEIPT_BYTES) return null;
      return parseReceipt(readFileSync(path, 'utf8'), sessionId);
    } catch {
      return null;
    }
  }

  write(receipt: RouteReceipt): boolean {
    let tempPath: string | null = null;
    try {
      const body = JSON.stringify(receipt);
      if (Buffer.byteLength(body, 'utf8') > MAX_ROUTE_RECEIPT_BYTES) return false;
      mkdirSync(this.dir, { recursive: true, mode: 0o700 });
      if (!this.ownedFolder()) return false;
      const target = join(this.dir, receiptFileName(receipt.sessionId));
      if (!existsSync(target)) this.makeRoom();
      tempPath = join(this.dir, `.${process.pid}-${randomBytes(6).toString('hex')}.tmp`);
      writeFileSync(tempPath, body, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
      renameSync(tempPath, target);
      tempPath = null;
      return true;
    } catch {
      return false;
    } finally {
      if (tempPath) {
        try {
          unlinkSync(tempPath);
        } catch {
          // The temp file never landed or a concurrent cleanup removed it.
        }
      }
    }
  }

  // A symlinked base or folder could point a shared temp directory's receipts
  // at a path another user controls, so either one disables the store. Both
  // must also belong to this user and stay closed to everyone else, the rule
  // the lifecycle store holds its own state to. That rule is what refuses a
  // folder reached through a symlinked parent, which lstat alone lets through.
  private ownedFolder(): boolean {
    const uid = typeof process.getuid === 'function' ? process.getuid() : null;
    for (const path of [this.baseDir, this.dir]) {
      const stat = lstatSync(path);
      if (stat.isSymbolicLink() || !stat.isDirectory()) return false;
      if (uid !== null && stat.uid !== uid) return false;
      if ((stat.mode & 0o077) !== 0) return false;
    }
    return true;
  }

  // Keeps the folder within the shared session bound, oldest first, and drops
  // temp files a crashed writer left behind.
  private makeRoom(): void {
    const now = Date.now();
    const receipts: { path: string; mtimeMs: number }[] = [];
    for (const name of readdirSync(this.dir)) {
      const path = join(this.dir, name);
      try {
        const stat = lstatSync(path);
        if (!stat.isFile()) continue;
        if (name.endsWith('.tmp')) {
          if (now - stat.mtimeMs > STALE_TEMP_FILE_MS) unlinkSync(path);
        } else if (name.endsWith('.json')) {
          receipts.push({ path, mtimeMs: stat.mtimeMs });
        }
      } catch {
        // A concurrent writer renamed or removed the entry.
      }
    }
    receipts.sort((left, right) => left.mtimeMs - right.mtimeMs);
    const excess = receipts.length - (MAX_DIRECTIVE_LIFECYCLE_SESSIONS - 1);
    for (const entry of receipts.slice(0, Math.max(0, excess))) {
      try {
        unlinkSync(entry.path);
      } catch {
        // Already evicted by a concurrent writer.
      }
    }
  }
}

let defaultStore: FileRouteReceiptStore | null = null;

/** Return the process-local handle to the durable receipt store. */
export function defaultRouteReceiptStore(): FileRouteReceiptStore {
  defaultStore ??= new FileRouteReceiptStore();
  return defaultStore;
}
