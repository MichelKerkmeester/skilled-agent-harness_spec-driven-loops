---
title: "State-Machine Wiring — INIT through REMEDIATE"
description: "The concrete state-to-script wiring for the deep-alignment loop: which script each state calls, the alignment/ state-file layout, the convergence-threshold formula, and the resolved loopType decision."
trigger_phrases:
  - "deep-alignment state machine wiring"
  - "alignment loop convergence thresholds"
  - "alignment state file layout"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.0
---

# State-Machine Wiring — INIT through REMEDIATE

## 1. Purpose

Phase 008 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report/`) wires the deep-alignment loop's seven states onto the reused deep-loop runtime plus two new single-shot scripts (`check-convergence.cjs`, `partition-corpus.cjs`) and one gated hook stub (`remediate-hook.cjs`). This document is the concrete "what calls what, in what order, with what state-file layout" reference every later phase (009's command YAML + LEAF agent) builds against, so the wiring does not need to be re-derived.

Every script named here is **single-shot**: it answers one question and returns, exactly like `runtime/scripts/{loop-lock,convergence,reduce-state,upsert}.cjs` already do. None of them loop or dispatch internally — `deep-alignment/SKILL.md`'s own "FORBIDDEN INVOCATION PATTERNS" section rules out "a custom bash/shell dispatcher to parallelize lanes or iterations." The external orchestrator that calls these once per iteration (a command YAML plus a LEAF agent, mirroring `deep_review_auto.yaml` + `deep-review.md`) is phase 009's own deliverable, not built here.

---

## 2. State-to-Script Map

| State | Script(s) invoked | Reads | Writes |
|---|---|---|---|
| `INIT` | `runtime/scripts/loop-lock.cjs acquire` | — | `alignment/.deep-alignment.lock` |
| `SCOPE` | `deep-alignment/scripts/scoping.cjs` (`--lane-config` or `resolveLanesFromSelections`) | operator's lane answers or `--lane-config <file.json>` | `alignment/deep-alignment-config.json` (`lanes` field, frozen once written) |
| `DISCOVER` | each lane's adapter `discover(scope)` (`deep-alignment/scripts/adapters/<authority>.cjs`), then `runtime/scripts/upsert.cjs --seed-source deep-alignment-discover --seed-confidence 1.0` | `deep-alignment-config.json` lanes | `alignment/deep-alignment-corpus.json` (one entry per lane: `{laneId, authority, artifactClass, scope, artifacts}`); coverage-graph `FILE` nodes via `upsert.cjs` |
| `ITERATE` | `deep-alignment/scripts/partition-corpus.cjs` (which slice next), each lane's adapter `standardSource(authority)` + `check(artifact, rules)` | `deep-alignment-corpus.json`, `deep-alignment-findings-registry.json` (via the reducer, for already-checked counts) | `alignment/deep-alignment-state.jsonl` (append `{type:'iteration', laneId, artifactsChecked, newFindingsRatio, ...}`), `alignment/deltas/iter-NNN.jsonl` (append `{type:'finding', laneId, finding}`), `alignment/iterations/iteration-NNN.md` (narrative) |
| `CONVERGE` | `deep-alignment/scripts/check-convergence.cjs` | `deep-alignment-state.jsonl`, `deep-alignment-corpus.json`, the reducer's registry | — (decision only; no writes) |
| `REPORT` | `runtime/scripts/reduce-alignment-state.cjs <spec-folder>` | `deep-alignment-state.jsonl`, `deltas/`, `deep-alignment-config.json` | `alignment/deep-alignment-findings-registry.json`, `alignment/alignment-report.md` |
| `REMEDIATE` (optional, gated) | `deep-alignment/scripts/remediate-hook.cjs` | — | — (hook point only; no remediation logic exists yet, see §5) |

`INIT`'s lock is released (`loop-lock.cjs release`) after `REPORT`, or after `REMEDIATE` when that optional state runs.

---

## 3. The `alignment/` State-File Layout

Modeled directly on the real `review/` layout observed under `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/`:

```
<bound-spec-folder>/alignment/
├── deep-alignment-config.json          # SCOPE output, frozen (fileProtection: immutable)
├── deep-alignment-corpus.json          # DISCOVER output, one entry per lane (auto-generated)
├── deep-alignment-state.jsonl          # ITERATE append log (append-only)
├── deep-alignment-findings-registry.json  # REPORT output (auto-generated, reducer-owned)
├── alignment-report.md                 # REPORT output, one section per lane (auto-generated)
├── .deep-alignment.lock                # loop-lock.cjs lock file (operator-controlled)
├── iterations/
│   └── iteration-NNN.md                # per-iteration narrative (write-once)
├── deltas/
│   └── iter-NNN.jsonl                  # per-iteration finding deltas (write-once)
├── prompts/
│   └── iteration-N.md                  # per-iteration dispatch prompt (phase 009 populates)
└── dispatch-receipts/
    └── dispatch-alignment-iN-g1.{intent,completion}.json  # phase 009 populates
```

`deep-alignment-corpus.json` has no literal analog in `review/`'s layout — deep-review's four dimensions are a fixed constant, so it never needed a separate "what did DISCOVER find" file distinct from its (also fixed) config. deep-alignment's lanes are resolved per-run and their corpora are discovered per-run, so persisting the DISCOVER result as its own auto-generated file (rather than appending to the frozen config) keeps `deep-alignment-config.json`'s "immutable" `fileProtection` entry honest. See `deep_alignment_config_template.json` for the full config shape.

---

## 4. Convergence: the Resolved Formula (REQ-004)

**Combination: AND, not OR.** Convergence requires **both**:

1. **Artifact-coverage** — the fraction of discovered artifacts checked at least once, across all applicable lanes (a lane with zero discovered artifacts is excluded from both sides of the ratio — vacuously covered, matching `reduce-alignment-state.cjs`'s own `NOT_APPLICABLE` treatment rather than inventing a second convention). Default threshold: 100% (`coverageThreshold: 1.0`).
2. **Dry-run stability** — the last N (default 2, `stabilityWindow`) iteration records, across all lanes in state-log append order, must all report `newFindingsRatio === 0`. Fewer than N iterations recorded yet fails closed to "not stable," so a fresh run can never converge on its first iteration by construction.

**Why AND, not OR**: full coverage with still-unstable findings is not a done run (something is still actively drifting), and stability with incomplete coverage is not a done run either (large parts of the corpus were never even looked at — a trivially "stable" zero-signal from untouched artifacts). Requiring both mirrors deep-review's own convergence philosophy of weighting coverage and stability as separate, simultaneously-necessary signals (`convergence.cjs`'s `computeCompositeScore` weights `dimensionCoverage` and `findingStability` as distinct additive terms, never alternatives).

**max-iterations is an independent hard stop**, applied regardless of the AND-pair's outcome: `iterationsRun >= maxIterations` forces `STOP_MAX_ITERATIONS` even when neither coverage nor stability has been met, exactly as a safety backstop against a lane that never stabilizes.

Implementation: `deep-alignment/scripts/check-convergence.cjs`. See §5 for why this is a self-contained script rather than a `runtime/scripts/convergence.cjs` code path.

---

## 5. The loopType Decision (REQ-001) — Resolved

### The constraint

`runtime/scripts/convergence.cjs` (lines 659-660 as of this phase's read, re-verified current) hard-validates its loop type:

```js
if (loopType !== 'research' && loopType !== 'review' && loopType !== 'council' && loopType !== 'context') {
  throw inputError('loopType must be "research", "review", "council", or "context"');
}
```

Two reuse options were on the table (plan.md §3 Architecture):

- **Option A — extend the enum**: add `'alignment'` as a fifth value, plus a new `computeCompositeScore` branch and a new lane-aware signals builder (analogous to `buildReviewSignals`).
- **Option B — reuse `'review'` unchanged**: pass `loopType: 'review'` with a distinct namespace so alignment's graph writes never collide with a real deep-review run on the same packet.

### What reading the real code changed

`computeCompositeScore`'s `'review'`-shaped branch (the one Option B would inherit unchanged) is driven by `buildReviewSignals(nodes, edges)`, which depends on graph conventions deep-alignment's adapters have no reason to produce: `DIMENSION`-kind nodes, `FINDING`-kind nodes with `metadata.severity`, and `COVERS`/`CONTRADICTS`/`EVIDENCE_FOR`/`RESOLVES` edges. `discover_contract.md` (this phase's own dependency) only specifies adapters seeding `FILE` nodes — nothing about a `DIMENSION`-per-lane graph convention. Reusing `'review'` **unchanged**, as Option B's plan.md framing described it ("zero runtime code change"), would silently produce `dimensionCoverage: 0` / `evidenceDensity: 0` / etc. for every real run (no `DIMENSION` or `FINDING` nodes ever get seeded) — a composite score that looks like a permanent near-failure regardless of actual alignment quality. Making Option B produce a *meaningful* signal would require deep-alignment to fabricate a parallel `DIMENSION`-per-lane graph population scheme across every adapter's `ITERATE` call — real, non-trivial new work, just relocated from `convergence.cjs` into the adapters instead of avoided.

Separately, `loopType` is part of the coverage-graph's own namespace key (`{specFolder, loopType, sessionId}`, `convergence.cjs`'s `ns` object). Option B's own plan.md description already had to name a workaround ("bind a distinct `--spec-folder`/namespace so alignment's snapshots never collide with a real deep-review run on the same packet") — meaning reuse-unchanged is not actually collision-safe by construction; it requires an artificial disambiguation Option A gets for free, since `loopType` differing already partitions the namespace.

### The decision

**Option A (extend the enum to add `"alignment"`) is the architecturally correct long-term path** — it is namespace-safe by construction and does not require fabricating a misleading graph-population scheme. This is a recommendation for whichever future phase actually touches `runtime/scripts/convergence.cjs`, not an implementation performed here: `plan.md`'s own "Affected Surfaces" table marks `convergence.cjs` as **"Read-only analysis in this phase; a future phase either extends its enum or reuses it unchanged"**, and this phase's write scope does not include that file.

**What this phase actually built instead**: `spec.md`'s own NFR-R01 names the fallback explicitly — *"If `convergence.cjs` cannot be reused as-is (loopType rejected), the plan's fallback is graceful degradation to a documented manual coverage check, not a silent skip of convergence detection."* `deep-alignment/scripts/check-convergence.cjs` **is** that documented manual coverage check: it implements REQ-004's coverage-AND-stability-AND-max-iterations formula directly against the reducer's own registry and the JSONL state log, without touching `convergence.cjs` or depending on any graph-node convention. This gives phase 008 a real, tested, runnable convergence decision today, while leaving Option A's enum extension as a clearly-scoped, ready-to-apply follow-up (add `'alignment'` to the validation line, add a lane-aware signals branch) for whichever phase is authorized to edit that shared file.

**Do not silently reuse `'review'` unchanged.** If a future phase decides the graph-based composite score is worth the added population work after all, it should extend the enum (Option A) rather than reuse `'review'`, for the namespace-safety reason above.

---

## 6. Corpus Partitioning (lane round-robin)

Distinct from deep-review's fixed four-dimension rotation (four named categories, always the same four): deep-alignment's lanes are N-many, resolved per-run, with variable artifact counts. `partition-corpus.cjs` walks `deep-alignment-corpus.json`'s lanes in declaration order, wrapping, and returns the next lane with unaudited artifacts remaining (comparing the corpus's total against the reducer's per-lane `artifactsChecked` count), sliced to `batchSize` (default 5) artifacts per call. A lane whose corpus is zero-length or fully checked is skipped without ending the walk; `{done: true}` is returned only when every lane's corpus is exhausted.

---

## 7. The `REMEDIATE` Hook Point (ADR-005 invariant 4)

`remediate-hook.cjs` is the concrete, callable proof that the state transition after `REPORT` exists and is safe to enter — it performs **no** remediation action (no file writes, no git operations) and always returns `{status: 'not_implemented', ...}`, citing ADR-005 invariant 4 and `SKILL.md`'s "NEVER run the gated remediation pass without an explicit, separate operator opt-in" rule. A future phase that builds real remediation logic replaces this script's body; the wiring contract (REPORT can optionally transition to REMEDIATE) is already correct.

---

## 8. Cross-References

- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` — ADR-005 (alignment contract), ADR-006 (state machine + layout), ADR-010 (reduce-state.cjs relocation).
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report/` — this phase's spec/plan, REQ-001 through REQ-006.
- `discover_contract.md`, `scoping_protocol.md`, `lane_config_schema.md` — the upstream contracts this wiring consumes.
- `runtime/scripts/{loop-lock,convergence,upsert}.cjs`, `runtime/scripts/reduce-alignment-state.cjs` — the reused/sibling runtime primitives.
