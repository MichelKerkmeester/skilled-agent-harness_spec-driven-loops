---
title: Deep Context Reducer And Registry Reference
description: Reducer ownership, findings-registry schema, agreement weighting, contradiction surfacing, and runtime robustness.
trigger_phrases:
  - "findings registry schema"
  - "reduce state reducer"
  - "agreement weighting"
  - "unit id dedup"
  - "contradiction surfacing"
  - "low confidence bucket"
importance_tier: normal
contextType: implementation
---

# Deep Context Reducer And Registry Reference

The reducer turns per-seat findings and the append-only state log into a synchronized, agreement-weighted findings registry and dashboard. It is the host writer of derived state; seats stay read-only.

---

## 1. OVERVIEW

### Purpose

Define what `scripts/reduce-state.cjs` owns: the `findings-registry.json` schema, sha256 `unit_id` dedup, agreement weighting, the `lowConfidence` bucket, contradiction surfacing, and the runtime robustness it runs (atomic writes, JSONL-tail repair, per-seat finding validation).

### When to Use

Load this reference when rebuilding derived state, validating the registry or dashboard, or deciding whether a file is host-owned, reducer-owned, or per-seat.

### Core Principle

By-model shared scope makes cross-executor AGREEMENT the confidence signal — a unit found by N distinct executors over the SAME shared focus is more trustworthy than one found once. The reducer encodes that, deterministically and idempotently.

### Key Source

- `.opencode/skills/deep-context/scripts/reduce-state.cjs` — the reducer. Exports `reduceContextState`, `dedupByUnit`, `detectContradictions`, `buildRegistry`, `collectAllSeatFindings`, `validateSeatFinding`, `loadStateSafety`, plus `parseJsonl` / `parseJsonlDetailed` and `unitId`.

### Related Features

- Agreement merge — the cross-executor dedup, attribution union, agreement scoring, relevance gate, and contradiction surfacing described in §3–§5. The host-side merge contract that feeds these inputs lives in `../protocol/loop_protocol.md` §6.
- Runtime robustness — the atomic-write + JSONL-tail-repair + per-seat-validation discipline described in §7, sourced from the deep-loop-runtime state-safety helpers (`lib/deep-loop/atomic-state.ts`, `lib/deep-loop/jsonl-repair.ts`) with contract-equivalent inline fallbacks in the reducer.

---

## 2. REDUCER CONTRACT

`reduceContextState(specFolder, { write })` is the entry point. It:

- resolves the context packet via `resolveArtifactRoot(specFolder, 'context')`;
- repairs a crash-truncated JSONL tail BEFORE reading the state log;
- parses `deep-context-state.jsonl` into iteration and event records (corrupt lines reported, not silently dropped);
- collects every per-seat finding under `seats/iter-NNN/`, validating each before merge;
- dedups findings by `unit_id`, unions per-executor attribution, sets agreement;
- builds the agreement-weighted registry (buckets + `lowConfidence` + contradictions + metrics);
- derives lineage, graph-convergence rollup, and status;
- writes `findings-registry.json` and `deep-context-dashboard.md` atomically.

It is idempotent: repeated calls produce identical outputs for the same inputs. The workflow invokes it at `step_update_registry` after every iteration, and its JSON result surfaces `stateLogRepair`, `seatValidationWarnings`, and `corruptionWarnings`.

---

## 3. UNIT ID AND DEDUP

`unit_id = sha256(path:symbol:kind)`, matching the coverage-graph node id so the registry and the graph dedup the same unit.

`dedupByUnit` groups all findings across all surviving seats by `unit_id`:

- an explicit `unit_id` on a finding is trusted; otherwise it is derived deterministically from `path:symbol:kind`;
- `producedBy` = distinct seat labels that emitted the unit;
- `relevanceByProducer`, `signatureByProducer`, `reuseByProducer` retain each producer's value (inputs for contradiction detection);
- `maxRelevance` = highest relevance across producers; `firstIteration` = earliest iteration the unit appeared;
- non-empty `signature` / `evidence` / `notes` / `reuse` from any producer fill gaps left by others;
- `agreement` = `producedBy.length`.

The `kind` field routes a unit to its registry bucket (`KIND_TO_BUCKET`): `reuse_candidate → reuseCandidates`, `integration_point → integrationPoints`, `convention → conventions`, `dependency → dependencies`, `gap → gaps`. An unknown kind defaults to `reuseCandidates`.

---

## 4. FINDINGS REGISTRY

`findings-registry.json` is the reducer-owned, agreement-weighted output. Buckets hold gated findings; below-gate units go to `lowConfidence`.

```json
{
  "reuseCandidates": [],
  "integrationPoints": [],
  "conventions": [],
  "dependencies": [],
  "gaps": [],
  "lowConfidence": [],
  "contradictions": [],
  "metrics": {
    "findings": 0,
    "gatedFindings": 0,
    "lowConfidenceFindings": 0,
    "agreementEligible": 0,
    "contradictions": 0,
    "agreementRate": 0,
    "relevanceFloor": 0,
    "reuseCandidates": 0,
    "integrationPoints": 0,
    "conventions": 0,
    "dependencies": 0,
    "gaps": 0
  },
  "sessionId": "",
  "lineageMode": "new",
  "generation": 1,
  "status": "INITIALIZED",
  "relevanceGate": 0.55,
  "agreementMin": 2,
  "executorPool": [],
  "iterationsCompleted": 0,
  "seatsByIteration": {},
  "graphDecision": null,
  "corruptionWarnings": [],
  "seatValidationWarnings": [],
  "stateLogRepair": { "repaired": false, "droppedBytes": 0 }
}
```

Each bucket record carries: `unit_id`, `path`, `symbol`, `kind`, `signature`, `reuse`, `evidence`, `notes`, sorted `producedBy[]`, `agreement`, `agreementEligible` (`agreement >= agreementMin`), `relevance` (rounded `maxRelevance`), and `firstIteration`. `lowConfidence` records additionally carry `droppedBelowGate`.

Records within each bucket are stably ordered: agreement desc, then relevance desc, then path, then symbol.

`relevanceGate` and `agreementMin` come from config when present, else the defaults `DEFAULT_RELEVANCE_GATE = 0.55` and `DEFAULT_AGREEMENT_MIN = 2` (mirrored from the coverage-graph context signals so registry and graph agree). `agreementRate` = agreement-eligible / gated finding-kind units; `relevanceFloor` = gated / total units. `status` is `COMPLETE` when a `synthesis_complete` event exists, else `ITERATING` once iterations exist.

---

## 5. RELEVANCE GATE, AGREEMENT, AND CONTRADICTIONS

Relevance gate: a unit whose `maxRelevance < relevanceGate` drops to `lowConfidence` — kept, not discarded, so the Context Report's Gaps section can surface marginal-relevance near-misses. Gated units route to their kind bucket.

Agreement-eligible: a gated unit with `agreement >= agreementMin` (default 2 distinct executors). `newAgreementEligible` per iteration is the loop's primary progress / convergence signal.

Contradictions (`detectContradictions`): for any unit with two or more producers, if the distinct non-empty values for `signature` or `reuse` exceed one, a contradiction record is emitted (`unit_id`, `path`, `symbol`, `field`, and the per-seat `values` map). Contradictions are surfaced in the registry and dashboard and recorded as `CONTRADICTS` edges — never silently resolved.

---

## 6. DERIVED ROLLUPS

Beyond findings, the reducer attaches run context derived from the state log:

| Field | Derived from |
|-------|--------------|
| `sessionId`, `lineageMode`, `generation` | latest `resumed` / `restarted` event, else `config.lineage` (`buildLineageState`) |
| `graphDecision` | latest `graph_convergence` event decision (`buildGraphConvergenceRollup`) |
| `status` | `synthesis_complete` event > `config.status` > iteration presence (`deriveStatus`) |
| `executorPool` | sorted union of all seat labels seen across iterations |
| `seatsByIteration` | per-iteration `{ succeeded, failed }` seat labels |
| `iterationsCompleted` | count of `type === "iteration"` records |

The dashboard (`renderDashboard`) reads these same rollups; it adds nothing the registry does not already derive from raw state.

---

## 7. RUNTIME ROBUSTNESS

The reducer auto-runs three robustness mechanisms; this is the step that exercises the runtime state-safety contract.

**Atomic writes.** `findings-registry.json` and `deep-context-dashboard.md` are written temp + fsync + rename (with a best-effort parent-directory fsync), so a crash mid-write leaves the prior complete file intact — never a half-written registry or dashboard for a downstream reader.

**JSONL-tail repair before read.** A crash mid-append can leave a truncated final line. The reducer repairs the tail in place before parsing: it keeps every complete valid line and drops trailing garbage, then reads. The result (`repaired`, `droppedBytes`) is surfaced as `stateLogRepair`.

**Per-seat finding validation.** `validateSeatFinding` rejects a finding that is not an object, carries an unknown `kind`, has neither `path` nor `symbol`, or has a non-numeric `relevance`. Invalid findings are surfaced as `seatValidationWarnings` (with seat label, reason, and symbol/path), never silently merged. Malformed JSONL lines are likewise reported via `corruptionWarnings` (line number, length, short content hash, error) — content is never persisted raw, since a malformed record may carry secrets.

**Single source of truth with fallback.** `loadStateSafety` prefers the deep-loop-runtime helpers (`lib/deep-loop/atomic-state.ts` `writeStateAtomic`, `lib/deep-loop/jsonl-repair.ts` `repairJsonlTail`) loaded in-process via the tsx CJS register; when the TS toolchain is absent it falls back to contract-equivalent inline implementations so the reducer stays runnable and importable. The active source is reported as `stateSafetySource` (`runtime` | `inline`).

---

## 8. OWNERSHIP AND PROTECTION

| File | Owner | Protection |
|------|-------|------------|
| `findings-registry.json` | Reducer | auto-generated |
| `deep-context-dashboard.md` | Reducer | auto-generated |

Manual edits to either are overwritten on the next reduce. Host-owned and per-seat files are documented in `state_format.md`; the JSONL record shapes the reducer consumes are in `state_jsonl.md`.
