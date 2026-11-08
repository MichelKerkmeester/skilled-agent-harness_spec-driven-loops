// ───────────────────────────────────────────────────────────────────
// MODULE: Bounded History Loads
// ───────────────────────────────────────────────────────────────────

import { Buffer } from 'node:buffer';

import type { HistoryReference } from './navigator.js';
import type { RecoveryHistoryItem } from './projection.js';
import {
  describeHistoryPart,
  historyParts,
  isRecoveryImage,
  serializeRecoveryPart,
  type HistoryPartDescription,
} from './pages.js';
import {
  MAXIMUM_INLINE_PART_BYTES,
  recoveryResponse,
  fitsRecoveryResponse,
  type HistoryTextReply,
} from './response.js';

export type DeferredHistoryItem = {
  id: string;
  kind: RecoveryHistoryItem['kind'];
  deferred: true;
  parts: HistoryPartDescription[];
  totalParts: number;
  nextPartOffset: number | null;
  readParts: {
    historyId: string;
    mode: 'parts';
    offset: number;
  };
};

export type CompactHistoryReference = HistoryReference | { historyId: string; detailsDeferred: true };

export type BoundedHistoryReply = HistoryTextReply;

type BoundedPayload = {
  references?: CompactHistoryReference[];
  items?: (RecoveryHistoryItem | DeferredHistoryItem)[];
};

function containsImage(value: unknown): boolean {
  return isRecoveryImage(value)
    || (typeof value === 'object' && value !== null && Object.values(value).some(containsImage));
}

function deferredItem(item: RecoveryHistoryItem): DeferredHistoryItem {
  return {
    id: item.id,
    kind: item.kind,
    deferred: true,
    parts: [],
    totalParts: historyParts(item).length,
    nextPartOffset: 0,
    readParts: { historyId: item.id, mode: 'parts', offset: 0 },
  };
}

/**
 * Reserve every id and continuation before spending the shared budget on
 * content. References collapse largest-first, then whole items load
 * smallest-first so a large first item cannot starve a later small one. The
 * emitted item array keeps the caller's requested order.
 */
export function boundedHistoryReply(
  items?: readonly RecoveryHistoryItem[],
  references?: readonly HistoryReference[],
): BoundedHistoryReply {
  const loaded: (RecoveryHistoryItem | DeferredHistoryItem)[] = (items ?? []).map(deferredItem);
  const compact: CompactHistoryReference[] = [...(references ?? [])];
  const payload: BoundedPayload = {
    ...(references === undefined ? {} : { references: compact }),
    ...(items === undefined ? {} : { items: loaded }),
  };

  const largestFirst = compact
    .map((reference, index) => ({ index, bytes: Buffer.byteLength(JSON.stringify(reference), 'utf8') }))
    .sort((left, right) => right.bytes - left.bytes);
  for (const { index } of largestFirst) {
    if (fitsRecoveryResponse(payload)) break;
    const reference = compact[index];
    if (reference !== undefined) compact[index] = { historyId: reference.historyId, detailsDeferred: true };
  }
  if (!fitsRecoveryResponse(payload)) return recoveryResponse(payload);

  const candidates = (items ?? []).flatMap((item, index) => (containsImage(item)
    ? []
    : [{ item, index, bytes: Buffer.byteLength(serializeRecoveryPart(item, ''), 'utf8') }]));
  for (const { item, index } of candidates.sort((left, right) => left.bytes - right.bytes)) {
    const deferred = loaded[index];
    if (deferred === undefined) continue;
    loaded[index] = item;
    if (!fitsRecoveryResponse(payload)) loaded[index] = deferred;
  }

  for (const [index, item] of (items ?? []).entries()) {
    const deferred = loaded[index];
    if (deferred === undefined || !('deferred' in deferred)) continue;
    const parts = historyParts(item);
    for (const part of parts) {
      const description = describeHistoryPart(item, part);
      deferred.parts.push(description);
      deferred.nextPartOffset = deferred.parts.length === parts.length ? null : deferred.parts.length;
      deferred.readParts.offset = deferred.nextPartOffset ?? 0;
      if (Buffer.byteLength(JSON.stringify(description), 'utf8') > MAXIMUM_INLINE_PART_BYTES
        || !fitsRecoveryResponse(payload)) {
        deferred.parts.pop();
        deferred.nextPartOffset = deferred.parts.length;
        deferred.readParts.offset = deferred.parts.length;
        break;
      }
    }
  }

  return recoveryResponse(payload);
}
