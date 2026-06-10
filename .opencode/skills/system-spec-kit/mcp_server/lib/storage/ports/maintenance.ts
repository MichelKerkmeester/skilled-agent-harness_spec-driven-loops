// -------------------------------------------------------------------
// MODULE: Storage Ports - Maintenance
// -------------------------------------------------------------------

import type { Awaitable } from './common.js';

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

/** Port for operational storage maintenance tasks. */
export interface Maintenance {
  /** Run an integrity check against the active storage backend. */
  integrityCheck(): Awaitable<MaintenanceResult>;

  /** Compact backend storage when supported. */
  vacuum(): Awaitable<MaintenanceResult>;

  /** Flush write-ahead or equivalent backend state when supported. */
  checkpoint(options?: CheckpointOptions): Awaitable<MaintenanceResult>;
}
