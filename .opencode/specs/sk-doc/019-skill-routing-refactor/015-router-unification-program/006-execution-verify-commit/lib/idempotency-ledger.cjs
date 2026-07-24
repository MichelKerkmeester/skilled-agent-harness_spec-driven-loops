// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Destination Idempotency Ledger                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Collapse duplicate effects and retain destination receipts.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. HELPERS
──────────────────────────────────────────────────────────────── */

class LedgerError extends Error {
  /**
   * Create a ledger failure with a stable code.
   *
   * @param {string} code - Machine-readable failure code.
   * @param {string} message - Human-readable failure detail.
   */
  constructor(code, message) {
    super(message);
    this.name = 'LedgerError';
    this.code = code;
  }
}

function assertNonEmptyString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new LedgerError('LEDGER_INPUT_INVALID', `${label} must be a non-empty string`);
  }
}

function assertEpoch(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new LedgerError('LEDGER_INPUT_INVALID', `${label} must be a non-negative safe integer`);
  }
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

/* ─────────────────────────────────────────────────────────────
   2. LEDGER
──────────────────────────────────────────────────────────────── */

class InMemoryIdempotencyLedger {
  constructor() {
    this.partitions = new Map();
  }

  getPartition(partitionKey) {
    let partition = this.partitions.get(partitionKey);
    if (!partition) {
      partition = { entries: new Map(), fencingEpoch: 0 };
      this.partitions.set(partitionKey, partition);
    }
    return partition;
  }

  /**
   * Return an existing finalized receipt without changing ledger state.
   *
   * @param {string} partitionKey - Destination-owned storage partition.
   * @param {string} idempotencyKey - Deterministic effect identity.
   * @returns {Object|null} The original receipt when already finalized.
   */
  lookupReceipt(partitionKey, idempotencyKey) {
    const partition = this.partitions.get(partitionKey);
    const entry = partition && partition.entries.get(idempotencyKey);
    return entry && entry.state === 'finalized' ? entry.receipt : null;
  }

  /**
   * Execute an effect once and retain its original receipt for retries.
   *
   * @param {Object} input - Commit material owned by the destination.
   * @param {string} input.partitionKey - Durable destination partition.
   * @param {string} input.idempotencyKey - Stable duplicate-collapse key.
   * @param {'atomic'|'non-atomic'} input.atomicity - Destination commit class.
   * @param {number} input.retentionUntilEpoch - Earliest safe eviction epoch.
   * @param {Function} input.performEffect - Destination effect callback.
   * @param {Function} input.createReceipt - Receipt factory after one effect.
   * @returns {{duplicate:boolean,receipt:Object}} Commit result.
   */
  commitOnce(input) {
    const {
      partitionKey,
      idempotencyKey,
      atomicity,
      retentionUntilEpoch,
      performEffect,
      createReceipt,
    } = input;
    assertNonEmptyString(partitionKey, 'partitionKey');
    assertNonEmptyString(idempotencyKey, 'idempotencyKey');
    assertEpoch(retentionUntilEpoch, 'retentionUntilEpoch');
    if (!['atomic', 'non-atomic'].includes(atomicity)) {
      throw new LedgerError('LEDGER_INPUT_INVALID', 'atomicity must be atomic or non-atomic');
    }
    if (typeof performEffect !== 'function' || typeof createReceipt !== 'function') {
      throw new LedgerError('LEDGER_INPUT_INVALID', 'effect and receipt callbacks are required');
    }

    const partition = this.getPartition(partitionKey);
    const existing = partition.entries.get(idempotencyKey);
    if (existing) {
      if (existing.state === 'finalized') {
        return { duplicate: true, receipt: existing.receipt };
      }
      throw new LedgerError(
        'IDEMPOTENCY_PENDING',
        'a non-atomic destination owns recovery for the pending effect'
      );
    }

    if (atomicity === 'non-atomic') {
      partition.entries.set(idempotencyKey, Object.freeze({
        state: 'pending',
        retentionUntilEpoch,
      }));
    }

    let outcome;
    try {
      outcome = performEffect();
    } catch (error) {
      if (atomicity === 'atomic') partition.entries.delete(idempotencyKey);
      throw error;
    }

    const receipt = deepFreeze(createReceipt(outcome));
    partition.entries.set(idempotencyKey, Object.freeze({
      state: 'finalized',
      retentionUntilEpoch,
      receipt,
    }));
    return { duplicate: false, receipt };
  }

  /**
   * Advance a partition fence after a mutating commit.
   *
   * @param {string} partitionKey - Destination-owned storage partition.
   * @param {number} fencingEpoch - Newly opened planning epoch.
   */
  stampFence(partitionKey, fencingEpoch) {
    assertEpoch(fencingEpoch, 'fencingEpoch');
    const partition = this.getPartition(partitionKey);
    partition.fencingEpoch = Math.max(partition.fencingEpoch, fencingEpoch);
  }

  /**
   * Remove only finalized entries whose complete retention horizon has passed.
   *
   * @param {number} currentEpoch - Destination's current durable epoch.
   * @returns {number} Number of removed entries.
   */
  prune(currentEpoch) {
    assertEpoch(currentEpoch, 'currentEpoch');
    let removed = 0;
    for (const partition of this.partitions.values()) {
      for (const [key, entry] of partition.entries) {
        if (entry.state === 'finalized' && currentEpoch > entry.retentionUntilEpoch) {
          partition.entries.delete(key);
          removed += 1;
        }
      }
    }
    return removed;
  }

  /**
   * Summarize stored state for deterministic verification.
   *
   * @returns {{entries:number,partitions:number,pending:number}} Ledger counts.
   */
  counts() {
    let entries = 0;
    let pending = 0;
    for (const partition of this.partitions.values()) {
      entries += partition.entries.size;
      pending += [...partition.entries.values()].filter((entry) => entry.state === 'pending').length;
    }
    return { entries, partitions: this.partitions.size, pending };
  }
}

/* ─────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  InMemoryIdempotencyLedger,
  LedgerError,
};
