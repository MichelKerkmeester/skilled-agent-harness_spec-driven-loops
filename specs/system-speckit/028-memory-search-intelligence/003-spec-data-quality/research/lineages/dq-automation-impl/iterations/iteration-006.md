# Iteration 006 — Cross-cutting: the shared safe-fix engine, the detector registry, and the end-to-end rollout

Focus (KQ6): the single shared engine + registry that A1/B1/B2 all consume, and the end-to-end build/rollback order across all five keystones. This is the architecture that makes the five designs ONE program instead of five.

## The one engine, three front doors, one registry

The five keystones collapse onto a small shared core so they cannot diverge:

```
                    detector-registry.ts  (the one source of truth)
                    ├─ each entry: {id, surface, detect(doc)->issues, fixClass, fix?(doc)->doc}
                    │     fixClass ∈ {safe, risky, none}   (deny-by-default)
                    │
   dq-engine.ts  ───┤  runDetectors(target, {mode:'report'|'apply', allowFixClass:['safe']})
   (pure scorer +   │     reuses: computeMemoryQualityScore (quality-loop.ts:392),
    fix executor)   │             reviewPostSaveQuality shape (post-save-review.ts:573),
                    │             scoreMetadataJson (new, A1), HVR linter (new, A1)
                    │
        ┌───────────┼───────────────────────┬─────────────────────────────┐
        │           │                       │                             │
   A1 on-write   B1 scheduled            B2 /doctor                   B3 detector
   generate-     dq-sweep.ts +           data-quality route           detect-retrieval-gaps
   context.ts +  dq-corpus-sweep.yml     (interactive front door)     (feeds refinement_queue,
   validate.sh   + post-merge hook       report+apply(safe)           report-only, C2-gated)
   (report-only) (report; apply=safe)                                
                              │
                       C2 run-eval-v2.mjs + spec-corpus-golden + baseline gate
                       (the promotion gate every retrieval-class detector must pass)
```

- **`detector-registry.ts`** — the single registry. Each detector declares its `fixClass`. Adding a detector is one entry; granting it `safe` requires editing the frozen allow-list (gate-able via the existing `rule-canary-sync` cross-copy pattern). This is what stops the five surfaces from drifting into five classifications.
- **`dq-engine.ts`** — the pure core. `runDetectors(target, opts)` returns `{issues[], applied[], skipped[]}`. In `report` mode it never writes. In `apply` mode it executes only `fix()` for detectors whose `fixClass ∈ opts.allowFixClass` (always just `['safe']`), with the content_hash idempotency guard and atomic writes. It reuses the shipped scorers verbatim; it adds no scoring logic of its own.
- **Three front doors** call the SAME engine: A1 (on-write, report-only), B1 (scheduled/headless, report + operator-local safe-apply), B2 (interactive, report + `--confirm` safe-apply). B3 is a detector that emits queue rows the front doors surface. C2 is the gate that any `risky`/retrieval-class detector's promotion must pass.

This is the literal instantiation of every prior lineage's "one safe-fix engine, reuse-first, no new lane." It is also the answer to "how do A1/B1/B2 share safe-fix": they don't each implement it; they each call `dq-engine.runDetectors`.

## The fixClass allow-list (frozen, deny-by-default) — consolidated

| Detector id | surface | fixClass | fix (if safe) |
|---|---|---|---|
| `desc.shape` | description.json | safe | regenerate from frontmatter (Stage-1 parent fix) |
| `desc.generic` | description.json | risky | suggest only (semantic) |
| `enum.tier_status_ctype` | both JSONs | safe | case-normalize to canonical enum |
| `triggers.propagate` | frontmatter→description.json | safe | additive metadata copy (subset, cap 12) |
| `hvr.style` | authored *.md (outside fences) | safe | length-neutral em-dash/semicolon/Oxford swap |
| `anchor.unclosed` | authored *.md | safe | append closing comment |
| `graph.child_aggregation` | graph-metadata.json | risky | suggest only (net-negative broad/narrow) |
| `budget.overlength` | authored *.md | none | advisory signal |
| `req.ears_coverage` | spec.md/tasks.md | risky | suggest only (authoring judgment) |
| `retrieval.gap_edge_a` | memory_index (B3) | risky | suggest enrich-triggers (bypass floor, but authoring) |
| `retrieval.gap_edge_b` | memory_index (B3) | none | report-only, C2-gated (pays floor) |

The single invariant across all of it: **a detector that touches an authored-doc BODY is never `safe`** (only metadata-JSON fields and length-neutral fence-aware swaps qualify). Anything not explicitly `safe` here is `risky` by default.

## End-to-end rollout order (all five keystones, with rollback per stage)

The order is the safety property: each stage is independently revertible, no stage enables a destructive path before its measurement exists, and the retrieval half stays frozen behind C2.

| Stage | Builds | Keystone | Mode at land | Rollback | Checkpoint |
|---|---|---|---|---|---|
| 0 | baseline census: run the report-only engine over the corpus | A1 H3 | report | none (read-only) | counts of each detector's failures written before any change |
| 1 | `dq-engine.ts` + `detector-registry.ts` + the pure scorers (`scoreMetadataJson`, `computeAuthoredDocQuality` wrapper, HVR linter) | A1 | dormant (no wiring) | delete additive modules | unit tests green; nothing wired |
| 2 | wire A1 H1/H2 into `generate-context.ts main()` + H3 rule into `validate.sh` | A1 | WARN-only | single-commit revert of hooks; drop registry rule | on-write + validate report emit, exit unaffected |
| 3 | `dq-sweep.ts` (report-only) + `dq-corpus-sweep.yml` (schedule + workflow_dispatch) | B1 | report-only CI | delete workflow + script | weekly report artifact produced; 0 unexpected detectors |
| 4 | `safe`-fix executors + frozen allow-list; operator-local `dq-sweep --apply` (safe only, batched) | B1 | apply=safe, local | `git revert` batch | re-run is a no-op (idempotent); corpus clean of safe-class issues |
| 5 | `/doctor data-quality` route (DIAGNOSE) then APPLY behind `--confirm` (safe only) | B2 | report→safe-apply | drop route + asset, route-validate | interactive run matches sweep output; DBs in forbidden_targets |
| 6 | flip the cheap deterministic JSON/enum/shape checks to `--strict` error; remove dormant `legacy_grandfathered` bypass | A1/parent | ERROR | revert to warn, restore bypass | strict exits 0 corpus-wide; corrupted scratch file exits 2 |
| 7 | B3 impression capture (default-off) accumulates a multi-week window | B3 | telemetry-only | flag off; table inert | impressions accruing; zero downstream effect |
| 8 | `spec-corpus-golden.json` + capture `spec-corpus-baseline.json` via `run-eval-v2.mjs` | C2 | measurement | revert additive files | first real prod@3 number recorded (answers parent's open Q) |
| 9 | `run-spec-recall-gate.mjs` (PROMOTION + REGRESSION); wire REGRESSION into the sweep/CI | C2 | gate live | delete gate + baseline | regression gate fails on an injected prod@3 drop |
| 10 | `detect-retrieval-gaps.ts` + `refinement_queue`; surface in B1/B2 as report-only | B3 | report-only | clearRefinementQueue; flag off | queue rows edge-tagged; nothing auto-applied |
| 11 | retrieval-class candidates (A1 header-prefix, B3 edge-b, metadata fusion) built default-off, each promoted ONLY through C2 PROMOTION mode | (CONDITIONAL tier) | default-off | version field fallback; no data migration | prod@3 rises in PROMOTION mode, not eval@3 |

Stages 0-6 ship the write-time/adherence/logic wins on cost (the floor-bypassing half). Stages 7-11 build the measurement instrument FIRST (C2) and only then touch the retrieval half. The retrieval tier is the last thing built and the only thing gated on a prod-mode number — exactly the parent's doctrine, now sequenced.

## The two hard rails carried across the whole program

1. **No body-mutating auto-fix.** Enforced structurally by the `fixClass` registry (body-touching ⇒ never `safe`) + the `computeAuthoredDocQuality` wrapper that throws on `mode==='full-auto'` for authored docs. The `quality-loop.ts:463-468` budget-trim is permanently quarantined to the memory-save path.
2. **No retrieval promotion without prod@3.** Enforced by C2 being the only promotion path for any `risky`/retrieval-class detector, reading ONLY the prod column.

## Dead ends ruled out this iteration

- Five separate fix engines per surface — they would diverge in classification; one `dq-engine.ts` + one registry, three front doors. [evidence: prior-lineage "one safe-fix engine"]
- Building the retrieval candidates before C2 — repeats the 028 saturation mistake; C2 (the measurement) is built at stage 8-9, candidates at stage 11. [evidence: parent truncation law]
- Flipping `--strict` error before the corpus census reads clean — the parent's Stage-2→3 discipline; warn-only until clean. [evidence: parent staged rollout]

## Assessment

newInfoRatio: 0.55 — the engine/registry/three-door architecture and the 12-stage interleaved rollout are net-new synthesis (no prior lineage sequenced all five together with per-stage rollback), but it composes findings from iters 1-5 rather than discovering new seams. Status: complete. Sources: iters 001-005; `quality-loop.ts:392,463-468`; `post-save-review.ts:573`; `run-eval-v2.mjs`; parent staged rollout + truncation law.
