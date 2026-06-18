// ───────────────────────────────────────────────────────────────
// MODULE: State Diff Reconciliation
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export type DiffActionKind = 'insert' | 'upsert' | 'replace' | 'delete';

export type StatediffTargetType =
  | 'memory_index'
  | 'embedding'
  | 'embedding_cache'
  | 'fts'
  | 'bm25'
  | 'graph_edge'
  | 'causal_edge'
  | 'cache'
  | 'child_projection'
  | (string & {});

export interface TargetStateRow<TPayload extends JsonValue = JsonValue> {
  readonly target: StatediffTargetType;
  readonly key: string;
  readonly payload: TPayload;
  readonly hash?: string;
  readonly dependencyKeys?: readonly string[];
}

export interface StatediffAction<TPayload extends JsonValue = JsonValue> {
  readonly action: DiffActionKind;
  readonly target: StatediffTargetType;
  readonly key: string;
  readonly oldStateHash: string | null;
  readonly newStateHash: string | null;
  readonly prior: TargetStateRow<TPayload> | null;
  readonly desired: TargetStateRow<TPayload> | null;
  readonly sourceOperation: string;
  readonly metadata?: Readonly<Record<string, JsonValue>>;
}

export interface PlanStatediffOptions {
  readonly sourceOperation: string;
  readonly incompletePrior?: boolean;
  readonly metadata?: Readonly<Record<string, JsonValue>>;
}

export interface CompositeTarget<TPayload extends JsonValue = JsonValue> {
  readonly parent: TargetStateRow<TPayload>;
  readonly children?: readonly TargetStateRow<TPayload>[];
}

export interface StatediffActionBatch<TPayload extends JsonValue = JsonValue> {
  readonly sourceOperation: string;
  readonly actions: readonly StatediffAction<TPayload>[];
}

export interface StatediffTargetSink<TPayload extends JsonValue = JsonValue> {
  readonly target: StatediffTargetType;
  apply(action: StatediffAction<TPayload>): void | Promise<void>;
}

export interface StatediffSubscriberResult {
  readonly name: string;
  readonly actionCount: number;
  readonly ok: boolean;
  readonly error?: string;
}

export interface StatediffSubscriber<TPayload extends JsonValue = JsonValue> {
  readonly name: string;
  shouldRun(actions: readonly StatediffAction<TPayload>[]): boolean;
  run(actions: readonly StatediffAction<TPayload>[]): void | Promise<void>;
}

function sortRows<TPayload extends JsonValue>(rows: readonly TargetStateRow<TPayload>[]): TargetStateRow<TPayload>[] {
  return [...rows].sort((left, right) => {
    const targetCompare = String(left.target).localeCompare(String(right.target));
    return targetCompare !== 0 ? targetCompare : left.key.localeCompare(right.key);
  });
}

function stableJson(value: JsonValue): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(',')}]`;
  }

  const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
  return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(',')}}`;
}

function stateHash(row: TargetStateRow | null | undefined): string | null {
  if (!row) {
    return null;
  }
  if (row.hash) {
    return row.hash;
  }
  return createHash('sha256').update(stableJson(row.payload)).digest('hex');
}

function rowId(row: Pick<TargetStateRow, 'target' | 'key'>): string {
  return `${row.target}\u0000${row.key}`;
}

function createAction<TPayload extends JsonValue>(
  action: DiffActionKind,
  target: StatediffTargetType,
  key: string,
  prior: TargetStateRow<TPayload> | null,
  desired: TargetStateRow<TPayload> | null,
  options: PlanStatediffOptions,
): StatediffAction<TPayload> {
  return {
    action,
    target,
    key,
    oldStateHash: stateHash(prior),
    newStateHash: stateHash(desired),
    prior,
    desired,
    sourceOperation: options.sourceOperation,
    ...(options.metadata ? { metadata: options.metadata } : {}),
  };
}

/** Computes explicit target actions from caller-provided desired and prior rows. */
export function planStatediff<TPayload extends JsonValue>(
  desiredRows: readonly TargetStateRow<TPayload>[],
  priorRows: readonly TargetStateRow<TPayload>[],
  options: PlanStatediffOptions,
): StatediffAction<TPayload>[] {
  const desiredById = new Map(sortRows(desiredRows).map((row) => [rowId(row), row]));
  const priorById = new Map(sortRows(priorRows).map((row) => [rowId(row), row]));
  const ids = [...new Set([...desiredById.keys(), ...priorById.keys()])].sort();
  const actions: StatediffAction<TPayload>[] = [];

  for (const id of ids) {
    const desired = desiredById.get(id) ?? null;
    const prior = priorById.get(id) ?? null;
    const reference = desired ?? prior;
    if (!reference) {
      continue;
    }

    if (desired && !prior) {
      actions.push(createAction(options.incompletePrior ? 'upsert' : 'insert', reference.target, reference.key, null, desired, options));
      continue;
    }

    if (!desired && prior) {
      actions.push(createAction('delete', reference.target, reference.key, prior, null, options));
      continue;
    }

    if (desired && prior && stateHash(desired) !== stateHash(prior)) {
      actions.push(createAction(options.incompletePrior ? 'upsert' : 'replace', reference.target, reference.key, prior, desired, options));
    }
  }

  return actions;
}

/**
 * Flattens a parent target plus child projections into deterministic row order.
 *
 * Staged helper for composite (parent + child-projection) planning: it is
 * covered by unit tests but planStatediff does not yet route through it. Kept as
 * the intended entry point for composite-target plans rather than inlined.
 */
export function flattenCompositeTarget<TPayload extends JsonValue>(
  composite: CompositeTarget<TPayload>,
): TargetStateRow<TPayload>[] {
  return sortRows([composite.parent, ...(composite.children ?? [])]);
}

/** Creates a single action for existing imperative write paths that already chose truth. */
export function createStatediffAction<TPayload extends JsonValue>(
  action: DiffActionKind,
  params: {
    readonly target: StatediffTargetType;
    readonly key: string;
    readonly sourceOperation: string;
    readonly prior?: TargetStateRow<TPayload> | null;
    readonly desired?: TargetStateRow<TPayload> | null;
    readonly oldStateHash?: string | null;
    readonly newStateHash?: string | null;
    readonly metadata?: Readonly<Record<string, JsonValue>>;
  },
): StatediffAction<TPayload> {
  const prior = params.prior ?? null;
  const desired = params.desired ?? null;
  return {
    action,
    target: params.target,
    key: params.key,
    oldStateHash: params.oldStateHash ?? stateHash(prior),
    newStateHash: params.newStateHash ?? stateHash(desired),
    prior,
    desired,
    sourceOperation: params.sourceOperation,
    ...(params.metadata ? { metadata: params.metadata } : {}),
  };
}

/** Applies actions through target sinks in deterministic order. */
export async function applyStatediffActions<TPayload extends JsonValue>(
  actions: readonly StatediffAction<TPayload>[],
  sinks: readonly StatediffTargetSink<TPayload>[],
): Promise<StatediffActionBatch<TPayload>> {
  const sinkByTarget = new Map(sinks.map((sink) => [sink.target, sink]));
  const ordered = [...actions].sort((left, right) => {
    const targetCompare = String(left.target).localeCompare(String(right.target));
    return targetCompare !== 0 ? targetCompare : left.key.localeCompare(right.key);
  });

  for (const action of ordered) {
    const sink = sinkByTarget.get(action.target);
    if (!sink) {
      throw new Error(`No statediff sink registered for target "${action.target}"`);
    }
    await sink.apply(action);
  }

  return {
    sourceOperation: ordered[0]?.sourceOperation ?? 'unknown',
    actions: ordered,
  };
}

/**
 * Runs action subscribers after durable sinks have applied.
 *
 * Staged post-apply notification phase: the durable apply path
 * (applyStatediffActions) is wired in production, but no caller fans out to
 * subscribers yet. Kept as the intended extension point and covered by a unit
 * test so its contract does not silently drift.
 */
export async function notifyStatediffSubscribers<TPayload extends JsonValue>(
  actions: readonly StatediffAction<TPayload>[],
  subscribers: readonly StatediffSubscriber<TPayload>[],
): Promise<StatediffSubscriberResult[]> {
  const reports: StatediffSubscriberResult[] = [];
  for (const subscriber of subscribers) {
    if (!subscriber.shouldRun(actions)) {
      continue;
    }
    try {
      await subscriber.run(actions);
      reports.push({ name: subscriber.name, actionCount: actions.length, ok: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      reports.push({ name: subscriber.name, actionCount: actions.length, ok: false, error: message });
    }
  }
  return reports;
}

export type { JsonValue };
