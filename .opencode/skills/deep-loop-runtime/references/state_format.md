---
title: Deep Loop Runtime State Format
description: JSONL state, atomic write, repair, lock, validation, and graph event formats used by deep-loop-runtime.
trigger_phrases:
  - "deep-loop state format"
  - "jsonl repair"
  - "atomic state"
  - "loop lock state"
  - "graphEvents"
importance_tier: normal
contextType: reference
---

# Deep Loop Runtime State Format

State file and event formats used by the shared deep-loop runtime primitives.

---

## 1. OVERVIEW

`deep-loop-runtime` does not own the full deep-review or deep-research packet schema. It owns shared primitives used by those packets:

- atomic JSON state writes
- append-safe JSONL records
- corrupt-tail repair
- loop lock files
- post-dispatch validation inputs and degraded verification events
- optional `graphEvents` arrays consumed by coverage-graph scripts

Consumer skills remain responsible for packet-specific config, strategy, dashboard, and final report files.

---

## 2. ATOMIC JSON STATE

Source: `lib/deep-loop/atomic-state.ts`.

```typescript
writeStateAtomic(path: string, data: unknown): void
```

Write sequence:

1. Serialize data as pretty JSON with trailing newline.
2. Write to a temp file beside the target.
3. fsync the temp file.
4. Rename temp file over the target.
5. fsync the parent directory.
6. Remove temp file on failure when possible.

Temp file naming:

```text
.<basename>.<pid>.<timestamp>.tmp
```

---

## 3. JSONL REPAIR

Source: `lib/deep-loop/jsonl-repair.ts`.

```typescript
type JsonlRepairResult = {
  repaired: boolean;
  originalBytes: number;
  keptBytes: number;
  droppedBytes: number;
};
```

Repair behavior:

- Missing files are treated as empty and unrepaired.
- Valid JSON lines are preserved through the last valid newline-delimited line.
- A final non-newline-terminated line is accepted only if it parses as JSON.
- Corrupt trailing content is truncated.
- Appends call repair before writing a new JSONL record.

Append contract:

```typescript
appendJsonlRecord(path: string, record: Record<string, unknown>): void
```

---

## 4. LOOP LOCK STATE

Source: `lib/deep-loop/loop-lock.ts`.

```typescript
interface LoopLockData {
  ownerPid: number;
  executorKind: ExecutorKind;
  sessionId: string;
  acquiredAtIso: string;
  lastHeartbeatIso: string;
  ttlMs: number;
}
```

Serialized lock file fields:

| JSON field | Runtime field | Meaning |
|---|---|---|
| `owner_pid` | `ownerPid` | Process id that owns the lock. |
| `executor_kind` | `executorKind` | Executor associated with the writer. |
| `session_id` | `sessionId` | Loop session namespace. |
| `acquired_at_iso` | `acquiredAtIso` | Acquisition timestamp. |
| `last_heartbeat_iso` | `lastHeartbeatIso` | Last heartbeat timestamp. |
| `ttl_ms` | `ttlMs` | Lock TTL in milliseconds. |

Acquire behavior:

- Missing lock creates exclusive lock.
- Live holder returns held result.
- Stale holder is removed and replaced.
- Race after write verifies current lock still belongs to owner.

---

## 5. POST-DISPATCH VALIDATION INPUT

Source: `lib/deep-loop/post-dispatch-validate.ts`.

```typescript
type PostDispatchValidateInput = {
  iterationFile: string;
  stateLogPath: string;
  deltaPath?: string;
  recipeConfig?: PostDispatchRecipeConfig;
  executorKind?: ExecutorKind;
};
```

The state log must include a canonical record whose `type === 'iteration'`. Variants such as `iteration_start` are not treated as the final iteration record for validation.

Review-depth v2 validation is controlled by `DEEP_REVIEW_V2_ENFORCEMENT`.

| Value | Behavior |
|---|---|
| `strict` | Hard-fail v2 validation failures. |
| `warn` | Emit typed advisories while allowing legacy records. |
| unset / skip | Do not enforce v2 failures. |

---

## 6. GRAPH EVENTS

Consumer iteration records may include optional `graphEvents` arrays.

```json
[
  { "type": "node", "id": "finding-1", "kind": "FINDING", "label": "Missing guard" },
  { "type": "edge", "id": "edge-1", "relation": "EVIDENCE_FOR", "source": "evidence-1", "target": "finding-1" }
]
```

`scripts/upsert.cjs` accepts graph events through `--events <path>` or `--events -` and converts them into node and edge arrays. It also accepts explicit `--nodes '<json-array>'` and `--edges '<json-array>'`.

---

## 7. DISPATCH FAILURE RECORDS

Source: `lib/deep-loop/executor-audit.ts`.

When audited executor dispatch fails, the runtime can append a typed event to JSONL state. The event records iteration, executor kind, failure reason, exit status or signal when available, and provenance needed for later validation.

The failure path uses `appendJsonlRecord` so corrupt trailing state is repaired before the dispatch failure is appended.

---

## 8. SOURCE ANCHORS

| Path | State Role |
|---|---|
| `lib/deep-loop/atomic-state.ts` | Atomic JSON writes. |
| `lib/deep-loop/jsonl-repair.ts` | JSONL repair and append. |
| `lib/deep-loop/loop-lock.ts` | Lock-file schema and single-writer behavior. |
| `lib/deep-loop/post-dispatch-validate.ts` | Iteration validation and v2 advisory records. |
| `lib/deep-loop/executor-audit.ts` | Executor provenance and dispatch failure records. |
| `scripts/upsert.cjs` | Graph event ingestion. |
| `deep-review/assets/prompt_pack_iteration.md.tmpl` | Review graphEvents prompt contract. |
| `deep-research/assets/prompt_pack_iteration.md.tmpl` | Research graphEvents prompt contract. |

