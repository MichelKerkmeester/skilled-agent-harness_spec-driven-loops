// ───────────────────────────────────────────────────────────────────
// MODULE: Model Benchmark Projection Schema
// ───────────────────────────────────────────────────────────────────

import { canonicalJson } from '../event-envelope/index.js';

import type {
  ModelBenchmarkLegacyProjection,
  ModelBenchmarkProjectionState,
  ModelBenchmarkReducerErrorCode,
} from './model-benchmark-projection-types.js';

export class ModelBenchmarkReducerError extends Error {
  readonly code: ModelBenchmarkReducerErrorCode;
  readonly path: string;

  constructor(
    code: ModelBenchmarkReducerErrorCode,
    message: string,
    path: string,
  ) {
    super(message);
    this.name = 'ModelBenchmarkReducerError';
    this.code = code;
    this.path = path;
  }
}

export function immutableModelBenchmarkProjectionClone<T>(value: T): T {
  const clone = JSON.parse(canonicalJson(value)) as T;
  const freeze = (item: unknown): void => {
    if (item === null || typeof item !== 'object' || Object.isFrozen(item)) {
      return;
    }
    for (const child of Object.values(item)) freeze(child);
    Object.freeze(item);
  };
  freeze(clone);
  return clone;
}

export function isDeepFrozenModelBenchmarkProjection(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return true;
  if (!Object.isFrozen(value)) return false;
  return Object.values(value).every(isDeepFrozenModelBenchmarkProjection);
}

export function assertModelBenchmarkProjectionState(
  value: ModelBenchmarkProjectionState,
): void {
  if (value.modelBenchmark === undefined
    || value.common === undefined
    || !Array.isArray(value.seenEvents)
    || !Array.isArray(value.streamFrontiers)) {
    throw new ModelBenchmarkReducerError(
      'projection-field-invalid',
      'Composite projection is missing a required persisted field',
      'projection',
    );
  }
  const streamIds = value.streamFrontiers.map((frontier) => frontier.streamId);
  if (new Set(streamIds).size !== streamIds.length) {
    throw new ModelBenchmarkReducerError(
      'projection-field-invalid',
      'Stream frontiers must be unique per logical stream',
      'streamFrontiers',
    );
  }
}

export function assertModelBenchmarkLegacyProjection(
  value: ModelBenchmarkLegacyProjection,
): void {
  if (value.authority !== 'shadow-only'
    || value.legacyAuthority !== 'unchanged'
    || value.common.authority !== 'shadow-only') {
    throw new ModelBenchmarkReducerError(
      'projection-field-invalid',
      'Legacy projection must remain complete and non-authoritative',
      'legacy',
    );
  }
}
