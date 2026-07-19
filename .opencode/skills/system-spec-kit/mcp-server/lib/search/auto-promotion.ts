// ───────────────────────────────────────────────────────────────
// MODULE: Auto Promotion
// ───────────────────────────────────────────────────────────────
//
// Adjusts memory importance tier based on validation signals:
// - >=5 positive validations: normal -> important
// - >=10 positive validations: important -> critical
// - Sustained negative validations can step important/critical down one tier.
//
import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
import {
  isManualSourceKind,
  persistProvenanceMetadata,
  type WriteProvenanceContext,
} from '../storage/write-provenance.js';

// Feature catalog: Auto-promotion on validation


// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
export type { Database };

/** Result of an auto-promotion check. */
export interface AutoPromotionResult {
  /** Whether promotion occurred */
  promoted: boolean;
  demoted?: boolean;
  /** Previous importance tier */
  previousTier: string;
  /** New importance tier (same as previous if no promotion) */
  newTier: string;
  /** Current positive validation count */
  validationCount: number;
  /** Reason for the result */
  reason: string;
}

export interface PromotionAuditSweepResult {
  table: 'memory_promotion_audit';
  dryRun: boolean;
  olderThanMs: number;
  cutoff: number;
  matched: number;
  deleted: number;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Positive validations required to promote normal -> important */
export const PROMOTE_TO_IMPORTANT_THRESHOLD = 5;

/** Positive validations required to promote important -> critical */
export const PROMOTE_TO_CRITICAL_THRESHOLD = 10;

/** Tier promotion paths (source -> target). */
export const PROMOTION_PATHS: Readonly<Record<string, { target: string; threshold: number }>> = {
  normal: { target: 'important', threshold: PROMOTE_TO_IMPORTANT_THRESHOLD },
  important: { target: 'critical', threshold: PROMOTE_TO_CRITICAL_THRESHOLD },
};

export const DEMOTION_PATHS: Readonly<Record<string, { target: string; negativeThreshold: number; positiveFloor: number }>> = {
  important: { target: 'normal', negativeThreshold: 3, positiveFloor: PROMOTE_TO_IMPORTANT_THRESHOLD - 1 },
  critical: { target: 'important', negativeThreshold: 5, positiveFloor: PROMOTE_TO_CRITICAL_THRESHOLD - 1 },
};

/** Rolling window length for promotion throttle safeguard (hours). */
export const PROMOTION_WINDOW_HOURS = 8;

/** Maximum allowed promotions inside one rolling window. */
export const MAX_PROMOTIONS_PER_WINDOW = 3;

/** Rolling window length in milliseconds. */
export const PROMOTION_WINDOW_MS = PROMOTION_WINDOW_HOURS * 60 * 60 * 1000;

/** Special-purpose tiers that are outside automatic tier changes. */
export const NON_PROMOTABLE_TIERS: ReadonlySet<string> = new Set([
  'constitutional',
  'temporary',
  'deprecated',
]);

const MANUAL_SOURCE_KIND_VALUES = ['human', 'manual'] as const;

const AUTO_PROMOTION_PROVENANCE: WriteProvenanceContext = {
  provenanceSource: 'auto-promotion',
  provenanceActor: 'memory_validate',
  tool: 'memory_validate',
};

function getNegativeValidationCount(db: Database, memoryId: number): number {
  try {
    const row = db.prepare(`
      SELECT COUNT(*) AS count
      FROM negative_feedback_events
      WHERE memory_id = ?
    `).get(memoryId) as { count?: number } | undefined;

    return typeof row?.count === 'number' && Number.isFinite(row.count)
      ? Math.max(0, Math.floor(row.count))
      : 0;
  } catch (_error: unknown) {
    return 0;
  }
}

function getNegativeValidationCounts(db: Database, memoryIds: number[]): Map<number, number> {
  if (memoryIds.length === 0) return new Map();
  try {
    const placeholders = memoryIds.map(() => '?').join(', ');
    const rows = db.prepare(`
      SELECT memory_id, COUNT(*) AS count
      FROM negative_feedback_events
      WHERE memory_id IN (${placeholders})
      GROUP BY memory_id
    `).all(...memoryIds) as Array<{ memory_id: number; count: number }>;
    return new Map(rows.map((row) => [row.memory_id, row.count]));
  } catch (_error: unknown) {
    return new Map();
  }
}

function resolvePositiveValidationCount(totalValidationCount: number, negativeValidationCount: number): number {
  return Math.max(0, totalValidationCount - Math.max(0, negativeValidationCount));
}

// ───────────────────────────────────────────────────────────────
// 3. PROMOTION THROTTLE SAFEGUARD

// ───────────────────────────────────────────────────────────────
const PROMOTION_AUDIT_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS memory_promotion_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_id INTEGER NOT NULL,
    previous_tier TEXT NOT NULL,
    new_tier TEXT NOT NULL,
    validation_count INTEGER NOT NULL,
    promoted_at INTEGER NOT NULL
  )
`;

function ensurePromotionAuditTable(db: Database): void {
  db.exec(PROMOTION_AUDIT_TABLE_SQL);
}

function countRecentPromotions(db: Database, memoryId: number, nowMs: number): number {
  const cutoffMs = nowMs - PROMOTION_WINDOW_MS;
  const row = db.prepare(
    'SELECT COUNT(*) AS count FROM memory_promotion_audit WHERE memory_id = ? AND promoted_at >= ?'
  ).get(memoryId, cutoffMs) as { count?: number } | undefined;
  return row?.count ?? 0;
}

// ───────────────────────────────────────────────────────────────
// 4. CORE FUNCTIONS

// ───────────────────────────────────────────────────────────────
/**
 * Check if a memory qualifies for auto-promotion based on its positive validation count.
 * Does NOT modify the database -- read-only check.
 *
 * @param db - SQLite database connection
 * @param memoryId - ID of the memory to check
 * @returns Promotion check result with eligibility details
 */
export function checkAutoPromotion(db: Database, memoryId: number): AutoPromotionResult {
  try {
    const memory = db.prepare(
      'SELECT importance_tier, validation_count, confidence, source_kind FROM memory_index WHERE id = ?'
    ).get(memoryId) as {
      importance_tier?: string;
      validation_count?: number;
      confidence?: number;
      source_kind?: string | null;
    } | undefined;

    if (!memory) {
      return {
        promoted: false,
        previousTier: 'unknown',
        newTier: 'unknown',
        validationCount: 0,
        reason: 'memory_not_found',
      };
    }

    const tier = (memory.importance_tier || 'normal').toLowerCase();
    const totalValidationCount = memory.validation_count ?? 0;
    const negativeValidationCount = getNegativeValidationCount(db, memoryId);
    const validationCount = resolvePositiveValidationCount(totalValidationCount, negativeValidationCount);

    // Non-promotable tiers
    if (NON_PROMOTABLE_TIERS.has(tier)) {
      return {
        promoted: false,
        previousTier: tier,
        newTier: tier,
        validationCount,
        reason: `tier_not_promotable: ${tier}`,
      };
    }

    if (isManualSourceKind(memory.source_kind)) {
      return {
        promoted: false,
        previousTier: tier,
        newTier: tier,
        validationCount,
        reason: `source_kind_not_promotable: ${memory.source_kind}`,
      };
    }

    const demotionPath = DEMOTION_PATHS[tier];
    if (demotionPath && negativeValidationCount >= demotionPath.negativeThreshold && validationCount <= demotionPath.positiveFloor) {
      return {
        promoted: false,
        demoted: true,
        previousTier: tier,
        newTier: demotionPath.target,
        validationCount,
        reason: `demotion_threshold_met: negative_validation_count=${negativeValidationCount}>=${demotionPath.negativeThreshold}`,
      };
    }

    // Check if tier has a promotion path
    const path = PROMOTION_PATHS[tier];
    if (!path) {
      return {
        promoted: false,
        previousTier: tier,
        newTier: tier,
        validationCount,
        reason: `no_promotion_path_for_tier: ${tier}`,
      };
    }

    // Check if validation count meets threshold
    if (validationCount < path.threshold) {
      return {
        promoted: false,
        previousTier: tier,
        newTier: tier,
        validationCount,
        reason: `below_threshold: positive_validation_count=${validationCount}/${path.threshold}`,
      };
    }

    return {
      promoted: true,
      previousTier: tier,
      newTier: path.target,
      validationCount,
      reason: `threshold_met: positive_validation_count=${validationCount}>=${path.threshold}`,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[auto-promotion] checkAutoPromotion failed for memory ${memoryId}: ${msg}`);
    return {
      promoted: false,
      previousTier: 'unknown',
      newTier: 'unknown',
      validationCount: 0,
      reason: 'error',
    };
  }
}

/**
 * Execute an automatic tier change for a memory if it qualifies.
 * Updates the memory's importance tier in the database.
 *
   * Tier change rules:
   * - >=5 positive validations: normal -> important
   * - >=10 positive validations: important -> critical
   * - sustained negative validations can demote important/critical one tier
 *
 * @param db - SQLite database connection
 * @param memoryId - ID of the memory to potentially promote
 * @returns Promotion result with details of what happened
 */
export function executeAutoPromotion(
  db: Database,
  memoryId: number,
  provenance: WriteProvenanceContext = AUTO_PROMOTION_PROVENANCE,
): AutoPromotionResult {
  try {
    const check = checkAutoPromotion(db, memoryId);

    if (!check.promoted && check.demoted !== true) {
      return check;
    }

    // Safeguard: cap promotion throughput to avoid runaway tier inflation.
    // Wrap throttle check + tier update + audit insert in a
    // BEGIN IMMEDIATE transaction so concurrent calls cannot exceed the rate limit.
    ensurePromotionAuditTable(db);

    const executePromotion = db.transaction(() => {
      const nowMs = Date.now();
      const recentPromotions = countRecentPromotions(db, memoryId, nowMs);
      if (recentPromotions >= MAX_PROMOTIONS_PER_WINDOW) {
        return {
          promoted: false,
          previousTier: check.previousTier,
          newTier: check.previousTier,
          validationCount: check.validationCount,
          reason: `tier_change_window_rate_limited: ${recentPromotions}/${MAX_PROMOTIONS_PER_WINDOW} in ${PROMOTION_WINDOW_HOURS}h`,
        };
      }

      const update = db.prepare(
        `UPDATE memory_index
         SET importance_tier = ?, updated_at = ?
         WHERE id = ?
           AND (source_kind IS NULL OR lower(source_kind) NOT IN (${MANUAL_SOURCE_KIND_VALUES.map(() => '?').join(', ')}))`
      ).run(check.newTier, new Date().toISOString(), memoryId, ...MANUAL_SOURCE_KIND_VALUES);
      if (update.changes === 0) {
        return {
          promoted: false,
          previousTier: check.previousTier,
          newTier: check.previousTier,
          validationCount: check.validationCount,
          reason: 'source_kind_not_promotable: concurrent_manual_guard',
        };
      }
      persistProvenanceMetadata(db, memoryId, provenance);

      db.prepare(`
        INSERT INTO memory_promotion_audit
          (memory_id, previous_tier, new_tier, validation_count, promoted_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        memoryId,
        check.previousTier,
        check.newTier,
        check.validationCount,
        nowMs
      );

      return check;
    });

    const result = executePromotion();

    if (result.promoted || result.demoted) {
      console.warn(
        `[auto-promotion] Memory ${memoryId} tier changed: ${check.previousTier} -> ${check.newTier} ` +
        `(${check.validationCount} validations)`
      );
    }

    return result;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[auto-promotion] executeAutoPromotion failed for memory ${memoryId}: ${msg}`);
    return {
      promoted: false,
      previousTier: 'unknown',
      newTier: 'unknown',
      validationCount: 0,
      reason: 'error',
    };
  }
}

/**
 * Batch check all memories for automatic tier-change eligibility.
 * Returns a list of memories that qualify for promotion or demotion.
 * Does NOT modify the database -- read-only scan.
 *
 * @param db - SQLite database connection
 * @returns Array of promotion results for eligible memories
 */
export function scanForPromotions(db: Database): AutoPromotionResult[] {
  try {
    const rows = db.prepare(`
      SELECT id, importance_tier, validation_count, source_kind
      FROM memory_index
      WHERE importance_tier IN ('normal', 'important', 'critical')
    `).all() as Array<{
      id: number;
      importance_tier: string;
      validation_count: number;
      source_kind?: string | null;
    }>;

    const eligible: AutoPromotionResult[] = [];
    const negativeCounts = getNegativeValidationCounts(db, rows.map((row) => row.id));

    for (const row of rows) {
      const tier = row.importance_tier?.toLowerCase() || 'normal';
      if (isManualSourceKind(row.source_kind)) continue;

      const negativeValidationCount = negativeCounts.get(row.id) ?? 0;
      const positiveValidationCount = resolvePositiveValidationCount(
        row.validation_count ?? 0,
        negativeValidationCount
      );

      const demotionPath = DEMOTION_PATHS[tier];
      if (demotionPath && negativeValidationCount >= demotionPath.negativeThreshold && positiveValidationCount <= demotionPath.positiveFloor) {
        eligible.push({
          promoted: false,
          demoted: true,
          previousTier: tier,
          newTier: demotionPath.target,
          validationCount: positiveValidationCount,
          reason: `demotion_threshold_met: negative_validation_count=${negativeValidationCount}>=${demotionPath.negativeThreshold}`,
        });
        continue;
      }

      const path = PROMOTION_PATHS[tier];
      if (!path) continue;

      if (positiveValidationCount < path.threshold) continue;

      eligible.push({
        promoted: true,
        previousTier: tier,
        newTier: path.target,
        validationCount: positiveValidationCount,
        reason: `threshold_met: positive_validation_count=${positiveValidationCount}>=${path.threshold}`,
      });
    }

    return eligible;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[auto-promotion] scanForPromotions failed: ${msg}`);
    return [];
  }
}

export function sweepMemoryPromotionAudit(
  db: Database,
  options: { olderThanMs?: number; dryRun?: boolean; now?: number } = {},
): PromotionAuditSweepResult {
  ensurePromotionAuditTable(db);
  const olderThanMs = options.olderThanMs ?? 90 * 24 * 60 * 60 * 1000;
  const cutoff = (options.now ?? Date.now()) - olderThanMs;
  const row = db.prepare('SELECT COUNT(*) AS count FROM memory_promotion_audit WHERE promoted_at < ?')
    .get(cutoff) as { count: number };
  const matched = row.count;
  const dryRun = options.dryRun !== false;
  const deleted = dryRun
    ? 0
    : (db.prepare('DELETE FROM memory_promotion_audit WHERE promoted_at < ?').run(cutoff) as { changes: number }).changes;
  return { table: 'memory_promotion_audit', dryRun, olderThanMs, cutoff, matched, deleted };
}
