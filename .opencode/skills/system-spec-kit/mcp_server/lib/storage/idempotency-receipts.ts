// ───────────────────────────────────────────────────────────────
// MODULE: Idempotency Receipts
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';
import type BetterSqlite3 from 'better-sqlite3';

import type { MCPResponse } from '../../handlers/types.js';

export type IdempotencyOperation = 'memory_save' | 'memory_update';

export interface IdempotencyReceiptInput {
  operation: IdempotencyOperation;
  contentHash: string | null;
  requestFingerprint: Record<string, unknown>;
  payload: Record<string, unknown>;
}

export interface IdempotencyReceiptKey {
  operation: IdempotencyOperation;
  receiptKey: string;
  contentHash: string | null;
  requestFingerprintHash: string;
  payloadHash: string;
}

export type IdempotencyLookupResult =
  | { status: 'miss'; key: IdempotencyReceiptKey }
  | { status: 'replay'; key: IdempotencyReceiptKey; response: MCPResponse }
  | { status: 'conflict'; key: IdempotencyReceiptKey; storedPayloadHash: string };

interface ReceiptRow {
  payload_hash: string;
  response_payload: string;
}

interface MemorySaveReceiptCandidate {
  id?: unknown;
  status?: unknown;
}

const RECEIPT_WRITABLE_MEMORY_SAVE_STATUSES = new Set(['indexed', 'updated', 'deferred']);

const CLIENT_TOKEN_KEYS = new Set([
  'idempotencykey',
  'idempotency_key',
  'idempotencytoken',
  'idempotency_token',
  'clientidempotencykey',
  'client_idempotency_key',
  'clientidempotencytoken',
  'client_idempotency_token',
]);

export function isMemoryIdempotencyEnabled(): boolean {
  const raw = process.env.SPECKIT_MEMORY_IDEMPOTENCY?.trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes' || raw === 'on';
}

function normalizeForHash(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeForHash);
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  const record = value as Record<string, unknown>;
  const normalized: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort()) {
    if (CLIENT_TOKEN_KEYS.has(key.toLowerCase())) {
      continue;
    }
    const normalizedValue = normalizeForHash(record[key]);
    if (normalizedValue !== undefined) {
      normalized[key] = normalizedValue;
    }
  }
  return normalized;
}

function hashJson(value: unknown): string {
  return createHash('sha256')
    .update(JSON.stringify(normalizeForHash(value)))
    .digest('hex');
}

export function deriveIdempotencyReceiptKey(input: IdempotencyReceiptInput): IdempotencyReceiptKey {
  const requestFingerprintHash = hashJson(input.requestFingerprint);
  const payloadHash = hashJson(input.payload);
  const material = {
    operation: input.operation,
    contentHash: input.contentHash ?? null,
    requestFingerprintHash,
  };
  return {
    operation: input.operation,
    receiptKey: hashJson(material),
    contentHash: input.contentHash ?? null,
    requestFingerprintHash,
    payloadHash,
  };
}

export function shouldStoreMemorySaveReceipt(
  result: MemorySaveReceiptCandidate,
  response: MCPResponse,
): result is MemorySaveReceiptCandidate & { id: number; status: string } {
  return response.isError !== true
    && typeof result.id === 'number'
    && Number.isInteger(result.id)
    && result.id > 0
    && typeof result.status === 'string'
    && RECEIPT_WRITABLE_MEMORY_SAVE_STATUSES.has(result.status);
}

export function lookupIdempotencyReceipt(
  database: BetterSqlite3.Database,
  input: IdempotencyReceiptInput,
): IdempotencyLookupResult {
  return lookupIdempotencyReceiptByKey(database, deriveIdempotencyReceiptKey(input));
}

export function lookupIdempotencyReceiptByKey(
  database: BetterSqlite3.Database,
  key: IdempotencyReceiptKey,
): IdempotencyLookupResult {
  const row = database.prepare(`
    SELECT payload_hash, response_payload
    FROM memory_idempotency_receipts
    WHERE receipt_key = ?
  `).get(key.receiptKey) as ReceiptRow | undefined;

  if (!row) {
    return { status: 'miss', key };
  }
  if (row.payload_hash !== key.payloadHash) {
    return { status: 'conflict', key, storedPayloadHash: row.payload_hash };
  }
  return {
    status: 'replay',
    key,
    response: JSON.parse(row.response_payload) as MCPResponse,
  };
}

/**
 * Drops the receipt for a key so a follow-up store writes fresh.
 *
 * A receipt is a replay cache keyed on (operation, contentHash, fingerprint),
 * not a durable record. When a replay is rejected because the live index no
 * longer matches the receipt's content_hash (the logical path moved on and
 * came back, so the cached response now carries a superseded memory id), the
 * cache entry is stale: leaving it lets the post-write store lose the
 * ON CONFLICT DO NOTHING race and re-serve the superseded response. Clearing
 * it first lets the re-indexed write store its current response and keeps the
 * cache consistent with the active row. Best-effort: a delete failure must
 * never block serving the live write.
 */
export function deleteIdempotencyReceiptByKey(
  database: BetterSqlite3.Database,
  key: IdempotencyReceiptKey,
): void {
  try {
    database.prepare(`
      DELETE FROM memory_idempotency_receipts
      WHERE receipt_key = ?
    `).run(key.receiptKey);
  } catch {
    // Best-effort cache eviction; serving the live write takes priority.
  }
}

export function storeIdempotencyReceipt(
  database: BetterSqlite3.Database,
  key: IdempotencyReceiptKey,
  response: MCPResponse,
  memoryId?: number | null,
): boolean {
  const info = database.prepare(`
    INSERT INTO memory_idempotency_receipts (
      receipt_key,
      operation,
      content_hash,
      request_fingerprint,
      payload_hash,
      response_payload,
      memory_id,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(receipt_key) DO NOTHING
  `).run(
    key.receiptKey,
    key.operation,
    key.contentHash,
    key.requestFingerprintHash,
    key.payloadHash,
    JSON.stringify(response),
    memoryId ?? null,
  );
  // changes === 0 means a concurrent caller already stored the canonical receipt
  // for this key (ON CONFLICT DO NOTHING), so this writer lost the first-write race.
  return info.changes > 0;
}

/**
 * Marks a mutated loser's response with an explicit store-race conflict.
 *
 * When a writer loses the first-store race to a concurrent SAME-KEY,
 * DIFFERENT-PAYLOAD request, neither honest option is silent: its mutation
 * already landed (so an error response would lie), and the winner's stored
 * response answers a different payload (so replaying it would lie too).
 * Rolling the landed mutation back from this late window is the dangerous
 * non-option. What remains is the loser's own response carrying a visible
 * conflict block, so callers know the canonical receipt for this key
 * belongs to a different concurrent request and a later retry may replay
 * or conflict against it. Fail-open: if the envelope cannot be parsed, the
 * original response is returned unmodified.
 */
export function markResponseWithReceiptStoreConflict(
  response: MCPResponse,
  key: IdempotencyReceiptKey,
  storedPayloadHash: string | undefined,
): MCPResponse {
  const first = response.content?.[0];
  if (!first || first.type !== 'text' || typeof first.text !== 'string') {
    return response;
  }
  try {
    const envelope = JSON.parse(first.text) as Record<string, unknown>;
    const data = (envelope.data && typeof envelope.data === 'object')
      ? envelope.data as Record<string, unknown>
      : {};
    data.idempotencyStoreConflict = {
      receiptKey: key.receiptKey,
      payloadHash: key.payloadHash,
      storedPayloadHash: storedPayloadHash ?? null,
    };
    envelope.data = data;
    const hints = Array.isArray(envelope.hints) ? envelope.hints as unknown[] : [];
    hints.push('A concurrent same-key request with a different payload holds the canonical idempotency receipt; this write landed but will not replay.');
    envelope.hints = hints;
    return {
      ...response,
      content: [{ ...first, text: JSON.stringify(envelope) }, ...response.content.slice(1)],
    };
  } catch {
    return response;
  }
}

/**
 * Deletes receipts older than the retention window. Receipts are replay
 * caches, not durable records: unbounded growth plus indefinite stale
 * replays (including against deleted memories) is the failure mode this
 * sweep bounds. Best-effort by contract — callers must never let a sweep
 * failure block serving.
 */
export function pruneExpiredIdempotencyReceipts(
  database: BetterSqlite3.Database,
  ttlDays?: number,
): number {
  const envRaw = Number.parseInt(process.env.SPECKIT_IDEMPOTENCY_RECEIPT_TTL_DAYS ?? '', 10);
  const days = Math.max(1, ttlDays ?? (Number.isFinite(envRaw) && envRaw > 0 ? envRaw : 30));
  try {
    // Prune on created_at: it is indexed and, since receipts are insert-only
    // (ON CONFLICT DO NOTHING), updated_at is immutable and equals created_at —
    // so this is behaviorally identical but avoids a full table scan.
    const info = database.prepare(`
      DELETE FROM memory_idempotency_receipts
      WHERE created_at < datetime('now', ?)
    `).run(`-${days} days`);
    return info.changes;
  } catch {
    return 0;
  }
}

export function extractMemoryIdFromResponse(response: MCPResponse): number | null {
  const first = response.content?.[0];
  if (!first || first.type !== 'text' || typeof first.text !== 'string') {
    return null;
  }
  try {
    const envelope = JSON.parse(first.text) as { data?: { id?: unknown; updated?: unknown } };
    const id = envelope.data?.id ?? envelope.data?.updated;
    return typeof id === 'number' && Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}
