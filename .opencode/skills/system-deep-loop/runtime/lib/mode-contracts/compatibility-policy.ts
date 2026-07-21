// ───────────────────────────────────────────────────────────────────
// MODULE: Mode Interface Compatibility Policy
// ───────────────────────────────────────────────────────────────────

import type {
  ModeCompatibilityAdapter,
  ModeInterfaceChange,
  ModeInterfaceChangeKind,
  ModeInterfaceVersion,
} from './mode-contract-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export interface ModeCompatibilityInput {
  readonly readerVersion: ModeInterfaceVersion;
  readonly writerVersion: ModeInterfaceVersion;
  readonly changes: readonly ModeInterfaceChange[];
  readonly adapters: readonly ModeCompatibilityAdapter[];
}

export type ModeCompatibilityDecision =
  | {
    readonly status: 'compatible';
    readonly strategy: 'exact' | 'native-additive' | 'native-deprecated';
    readonly changeKind: ModeInterfaceChangeKind | null;
    readonly defaults: Readonly<Record<string, unknown>>;
  }
  | {
    readonly status: 'adapter-required';
    readonly changeKind: ModeInterfaceChangeKind;
    readonly adapterId: string;
    readonly fromVersion: ModeInterfaceVersion;
    readonly toVersion: ModeInterfaceVersion;
  }
  | {
    readonly status: 'refused';
    readonly changeKind: ModeInterfaceChangeKind | 'unknown';
    readonly reason: string;
  };

// ───────────────────────────────────────────────────────────────────
// 2. COMPATIBILITY RESOLUTION
// ───────────────────────────────────────────────────────────────────

function findChange(input: ModeCompatibilityInput): ModeInterfaceChange | undefined {
  return input.changes.find((change) => (
    change.fromVersion === input.readerVersion
    && change.toVersion === input.writerVersion
  ) || (
    change.fromVersion === input.writerVersion
    && change.toVersion === input.readerVersion
  ));
}

function findAdapter(input: ModeCompatibilityInput): ModeCompatibilityAdapter | undefined {
  return input.adapters.find((adapter) => (
    adapter.fromVersion === input.writerVersion
    && adapter.toVersion === input.readerVersion
    && adapter.deterministic === true
  ));
}

/** Resolve one reader/writer pair to an explicit native path, adapter, or refusal. */
export function resolveModeInterfaceCompatibility(
  input: ModeCompatibilityInput,
): ModeCompatibilityDecision {
  if (input.readerVersion === input.writerVersion) {
    return Object.freeze({
      status: 'compatible',
      strategy: 'exact',
      changeKind: null,
      defaults: Object.freeze({}),
    });
  }

  const change = findChange(input);
  if (!change) {
    return Object.freeze({
      status: 'refused',
      changeKind: 'unknown',
      reason: 'No declared compatibility change covers the reader/writer pair',
    });
  }

  if (change.kind === 'additive') {
    return Object.freeze({
      status: 'compatible',
      strategy: 'native-additive',
      changeKind: change.kind,
      defaults: Object.freeze({ ...change.safeDefaults }),
    });
  }

  if (change.kind === 'deprecated') {
    return Object.freeze({
      status: 'compatible',
      strategy: 'native-deprecated',
      changeKind: change.kind,
      defaults: Object.freeze({ ...change.safeDefaults }),
    });
  }

  const adapter = findAdapter(input);
  if (adapter) {
    return Object.freeze({
      status: 'adapter-required',
      changeKind: change.kind,
      adapterId: adapter.adapterId,
      fromVersion: adapter.fromVersion,
      toVersion: adapter.toVersion,
    });
  }

  return Object.freeze({
    status: 'refused',
    changeKind: change.kind,
    reason: `${change.kind} interface changes require a deterministic adapter`,
  });
}
