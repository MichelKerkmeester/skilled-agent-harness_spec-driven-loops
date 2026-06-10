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

function addReplayMarker(response: MCPResponse): MCPResponse {
  const cloned = JSON.parse(JSON.stringify(response)) as MCPResponse;
  const first = cloned.content?.[0];
  if (!first || first.type !== 'text' || typeof first.text !== 'string') {
    return cloned;
  }

  try {
    const envelope = JSON.parse(first.text) as Record<string, unknown>;
    const data = envelope.data && typeof envelope.data === 'object' && !Array.isArray(envelope.data)
      ? envelope.data as Record<string, unknown>
      : {};
    data.replayed = true;
    envelope.data = data;
    const hints = Array.isArray(envelope.hints) ? envelope.hints : [];
    envelope.hints = ['Replayed prior idempotent write result', ...hints];
    const meta = envelope.meta && typeof envelope.meta === 'object' && !Array.isArray(envelope.meta)
      ? envelope.meta as Record<string, unknown>
      : {};
    meta.replayed = true;
    envelope.meta = meta;
    first.text = JSON.stringify(envelope, null, 2);
  } catch {
    return cloned;
  }

  return cloned;
}

export function lookupIdempotencyReceipt(
  database: BetterSqlite3.Database,
  input: IdempotencyReceiptInput,
): IdempotencyLookupResult {
  const key = deriveIdempotencyReceiptKey(input);
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
    response: addReplayMarker(JSON.parse(row.response_payload) as MCPResponse),
  };
}

export function storeIdempotencyReceipt(
  database: BetterSqlite3.Database,
  key: IdempotencyReceiptKey,
  response: MCPResponse,
  memoryId?: number | null,
): void {
  database.prepare(`
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
    ON CONFLICT(receipt_key) DO UPDATE SET
      response_payload = excluded.response_payload,
      memory_id = excluded.memory_id,
      updated_at = datetime('now')
  `).run(
    key.receiptKey,
    key.operation,
    key.contentHash,
    key.requestFingerprintHash,
    key.payloadHash,
    JSON.stringify(response),
    memoryId ?? null,
  );
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
