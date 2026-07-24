# flip-history.jsonl — Shared Audit Ledger Schema

> Canonical, single-source schema for the append-only per-hub audit ledger emitted
> by **both** `activate-hub.cjs` and `flip-serving.cjs`. Documented once here so the
> two drivers never diverge into per-driver formats (checklist CHK-012).

## Purpose

`activation-record.json` and `serving-flip-record.json` are single-record "latest
snapshot" files — each re-run overwrites the previous record, so re-mint history is
lost. `flip-history.jsonl` is the durable, append-only complement: every
bind / activate / serving-flip / rollback event is appended as one JSON line and
**no prior line is ever rewritten or removed**. After this child ships, the full
CAS/flip/rollback history of any hub is reconstructable from `flip-history.jsonl`
alone (NFR-AU01).

- **Location:** `<activation-root>/<hub>/flip-history.jsonl` (the same per-hub
  directory that already holds `manifest.json`, `fence-state.json`, and the two
  single-record files).
- **Write mode:** `fs.appendFileSync` only. Never `writeFileSync`, never truncate.
- **One line = one event.** Lines are independent JSON objects (JSONL).

## Record schema (`schemaVersion: "flip-history/V1"`)

| Field | Type | Meaning |
|-------|------|---------|
| `ts` | string (ISO-8601 UTC) | When the event was appended. |
| `schemaVersion` | string | Always `"flip-history/V1"` for this format. |
| `hubId` | string | The hub the event applies to. |
| `driver` | `"activate-hub"` \| `"flip-serving"` | Which driver emitted the event. |
| `event` | enum (below) | The specific transition. |
| `direction` | `"forward"` \| `"rollback"` | Cutover-advance vs recovery-advance — mirrors the `direction` now persisted in `fence-state.json`. |
| `servingAuthority` | `"legacy"` \| `"compiled"` | Serving authority of the resulting manifest. |
| `shadowOnly` | boolean | `shadowOnly` flag of the resulting manifest. |
| `selectedGeneration` | number \| null | `selectedPolicy.generation` of the resulting manifest. |
| `fenceEpoch` | `{ before: number, after: number }` | Fence epoch before and after the event (equal for a no-op). |
| `manifestHash` | string (sha256) | SHA-256 of the resulting `manifest.json`. |
| `restoredHash` | string (sha256) \| null | For rollback events: SHA-256 of the restored manifest (equals the accepted prior hash). `null` for forward events. |

### `event` values

| `event` | Driver | Meaning |
|---------|--------|---------|
| `activate` | activate-hub | Forward binding CAS shipped the compiled generation as SELECTED. |
| `activate-noop` | activate-hub | Activation ran but the hub was already bound (no state change). |
| `binding-rollback` | activate-hub | Committed binding rollback restored the byte-identical prior manifest. |
| `binding-rollback-noop` | activate-hub | Rollback ran but the hub was already at the prior generation (idempotent no-op). |
| `serving-flip` | flip-serving | Forward serving-authority flip `legacy → compiled`. |
| `serving-rollback` | flip-serving | Serving-authority rollback restored the byte-identical pre-flip manifest. |

## Relationship to `fence-state.json`

`fence-state.json` carries only the **latest** transition's `direction` alongside the
monotonic `fencingEpoch`. `flip-history.jsonl` carries the **full** per-transition
ledger. Together they make "was this fence advance a cutover or a recovery"
answerable for every transition, old and new, from persisted state alone (REQ-003 /
SC-003). The fence epoch remains **monotonically increasing** on both forward and
rollback paths — direction is recorded as a label rather than by rewinding the epoch,
so the fenced compare-and-swap preconditions (which assert against a specific
expected epoch) are never weakened by a rollback.

## Example lines

```jsonl
{"ts":"2026-07-21T00:00:00.000Z","schemaVersion":"flip-history/V1","hubId":"sk-doc","driver":"activate-hub","event":"activate","direction":"forward","servingAuthority":"legacy","shadowOnly":true,"selectedGeneration":5,"fenceEpoch":{"before":0,"after":1},"manifestHash":"…","restoredHash":null}
{"ts":"2026-07-21T00:05:00.000Z","schemaVersion":"flip-history/V1","hubId":"sk-doc","driver":"activate-hub","event":"binding-rollback","direction":"rollback","servingAuthority":"legacy","shadowOnly":true,"selectedGeneration":0,"fenceEpoch":{"before":1,"after":2},"manifestHash":"…","restoredHash":"…"}
```

## Out of scope

Rotation / truncation of an unbounded `flip-history.jsonl` over a long program
lifetime is intentionally **not** handled here (spec.md L2 Edge Cases) — it is flagged
as a future concern rather than silently added, because truncating an audit ledger
would defeat its append-only guarantee.
