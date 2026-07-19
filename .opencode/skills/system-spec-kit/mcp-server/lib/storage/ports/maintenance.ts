// -------------------------------------------------------------------
// MODULE: Storage Ports - Maintenance
// -------------------------------------------------------------------

import type { Awaitable } from './common.js';
import type Database from 'better-sqlite3';

/** Result from a storage maintenance command. */
export interface MaintenanceResult {
  readonly ok: boolean;
  readonly message?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

/** Options for checkpoint-style maintenance operations. */
export interface CheckpointOptions {
  readonly mode?: 'passive' | 'full' | 'restart' | 'truncate';
}

/** Maintenance operation names surfaced to call-site warning hooks. */
export type MaintenanceOperation = 'quick_check' | 'auto_vacuum' | 'incremental_vacuum' | 'wal_checkpoint';

/** Options for the better-sqlite3 maintenance adapter. */
export interface BetterSqliteMaintenanceOptions {
  readonly onMaintenanceError?: (operation: MaintenanceOperation, error: unknown) => void;
}

/** Port for operational storage maintenance tasks. */
export interface Maintenance {
  /** Run an integrity check against the active storage backend. */
  integrityCheck(): Awaitable<MaintenanceResult>;

  /** Compact backend storage when supported. */
  vacuum(): Awaitable<MaintenanceResult>;

  /** Flush write-ahead or equivalent backend state when supported. */
  checkpoint(options?: CheckpointOptions): Awaitable<MaintenanceResult>;
}

/** better-sqlite3 implementation of operational storage maintenance. */
export class BetterSqliteMaintenance implements Maintenance {
  private readonly onMaintenanceError: ((operation: MaintenanceOperation, error: unknown) => void) | undefined;

  constructor(
    private readonly database: Database.Database,
    options: BetterSqliteMaintenanceOptions = {},
  ) {
    this.onMaintenanceError = options.onMaintenanceError;
  }

  integrityCheck(): MaintenanceResult {
    try {
      const rows = this.database.pragma('quick_check(1)') as Array<Record<string, unknown>>;
      const first = Object.values(rows[0] ?? {})[0];
      const verdict = typeof first === 'string' ? first : 'quick_check returned no verdict';
      return { ok: verdict === 'ok', message: verdict, details: { verdict } };
    } catch (error: unknown) {
      this.reportError('quick_check', error);
      return { ok: false, message: errorMessage(error) };
    }
  }

  vacuum(): MaintenanceResult {
    let shouldRunIncrementalVacuum = false;
    try {
      const autoVacuumMode = this.database.pragma('auto_vacuum', { simple: true });
      shouldRunIncrementalVacuum = Number(autoVacuumMode) === 2;
    } catch (error: unknown) {
      this.reportError('auto_vacuum', error);
      return { ok: false, message: errorMessage(error), details: { operation: 'auto_vacuum' } };
    }

    if (shouldRunIncrementalVacuum) {
      try {
        this.database.pragma('incremental_vacuum');
      } catch (error: unknown) {
        this.reportError('incremental_vacuum', error);
        return { ok: false, message: errorMessage(error), details: { operation: 'incremental_vacuum' } };
      }
    }

    return { ok: true, details: { incrementalVacuum: shouldRunIncrementalVacuum } };
  }

  checkpoint(options: CheckpointOptions = {}): MaintenanceResult {
    const mode = (options.mode ?? 'passive').toUpperCase();
    try {
      const result = this.database.pragma(`wal_checkpoint(${mode})`) as unknown;
      return { ok: true, details: { mode: options.mode ?? 'passive', result } };
    } catch (error: unknown) {
      this.reportError('wal_checkpoint', error);
      return { ok: false, message: errorMessage(error), details: { mode: options.mode ?? 'passive' } };
    }
  }

  private reportError(operation: MaintenanceOperation, error: unknown): void {
    this.onMaintenanceError?.(operation, error);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
