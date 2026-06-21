# Iteration 001 — KQ1: The unified priority-ordered rollout sequence

## Focus

Merge dq-automation-impl's 11-stage build order, the dq-novel-oob correctness/adherence slate, and the dq-skilldoc-cmd-ctx per-surface detectors into ONE dependency-ordered, safe-first master sequence across the three timing tiers. The deliverable is the master stage list and the dependency spine that orders it.

## The five inviolable dependency edges (the spine)

Every prior lineage independently asserts "the order is the safety property." Consolidated, that property is exactly five dependency edges. The master sequence is the topological sort of these:

1. **Census before gate.** Every detector lands report-only/warn FIRST to measure the real corpus band before any blocking promotion (parent Stage 0; dq-deep/dq-automation-impl Stage-0 census; dq-skilldoc "land each detector as default-off warn-only first").
2. **Engine before front doors.** `dq-engine.ts` + `detector-registry.ts` (the shared frozen safe-fix engine) exists before A1/B1/B2 wire into it (dq-automation-impl Stage 1: "one engine, three front doors").
3. **Backfill before error.** No gate flips warn→error before its backfill clears the corpus to zero (parent Stages 2-4; dq-automation-impl Stage 6).
4. **Coverage guard before retrieval trust.** No recall number is trusted while embedding coverage < 100% under the current version — partial coverage mixes prefixed/unprefixed vectors under the floor and confounds the delta (parent Stage 5; dq-novel-oob N6a). The coverage guard (`embeddingCoverage`/`coverageThreshold`) does NOT exist yet (parent N7: grep empty) — it is a build dependency, not a flag.
5. **C2 before retrieval promotion.** The prod-mode completeRecall@3 gate is built BEFORE any retrieval candidate is touched; C2 is the single promotion path (dq-deep C2; dq-automation-impl Stages 8-9; RAIL-2).

## The master sequence (17 stages, 0-16, in seven phases)

The sequence has two disjoint halves on one timeline. Phases I-V ship the floor-bypassing reuse-first half on cost. Phase VI adds the novel correctness/adherence program (report-only/additive, can run in parallel with III-V). Phase VII builds the measurement (C2) FIRST, then touches the retrieval half.

**Phase I — Foundation & census (read-only, zero risk)**
- **S0 Stage-0 baseline census.** Run the report-only engine corpus-wide; record real starting numbers: per-detector band distribution, the 11 invalid graph files (parent), 0 legacy_grandfathered packets (parent N7), frontmatter/continuity gaps, embedded-chunk count, version-grammar census (dq-skilldoc: 20 hits / 2 grammars), mixed-embedding-regime census (dq-novel-oob N6a). Rollback: none. Gate: counts written before any mutation.

**Phase II — The shared engine (keystone infrastructure, dormant)**
- **S1 `dq-engine.ts` + `detector-registry.ts` + pure scorers.** The frozen deny-by-default `fixClass` allow-list; reuse `computeMemoryQualityScore` (pure) + `reviewPostSaveQuality` (non-mutating) + the sk-doc DQI scorer. Lands DORMANT (unwired). Rollback: delete modules.

**Phase III — On-write (warn) + the empty-cron sweep (report)**
- **S2 Sweep the 11 invalid graph files.** The known corpus defect (parent Stage 1). Rollback: git revert.
- **S3 Wire A1 on-write seams as WARN-only** (H1 `generate-context.ts:398` JSON scoring, H2 `workflow.ts:1854` authored-body advisory, H3 `validate.sh` CONTENT_QUALITY rule) + the on-write per-surface detectors (S1 hub-frontmatter, C1 command-router-contract, X1 trigger-vocab coherence). Rollback: revert hooks.
- **S4 Ship `dq-sweep.ts` + `dq-corpus-sweep.yml`** (cron + workflow_dispatch), REPORT-ONLY in CI — the empty cron tier filled. Rollback: delete workflow.

**Phase IV — The safe-fix tier + front doors**
- **S5 Safe-fix executors + the frozen allow-list**; local `--apply` safe-class only; CI stays report-only. Rollback: git revert batch.
- **S6 `/doctor data-quality` route** (DIAGNOSE→APPLY `--confirm`, safe tier only). Rollback: drop route, re-run `route-validate.py`.

**Phase V — Backfill then flip to error (the migration core)**
- **S7 Backfill** (frontmatter/continuity/enum/shape) behind a deferred gate; dry-run report → batched apply. Rollback: revert batch commits.
- **S8 Flip JSON-schema/enum/shape gates warn→ERROR**; drop the dormant `legacy_grandfathered` bypass (0 packets use it). Only after S7 reports clean. Rollback: revert to warn + restore bypass.

**Phase VI — Novel correctness/adherence program (report-only/additive; parallelizable with III-V)**
- **S9 Embedding-drift monitor (N6a)** FIRST in the novel slate — it protects every later measurement incl. C2 from the mixed-vector confound. Rollback: flag off.
- **S10 Cross-doc contradiction + staleness detector (N5a)** as a new detector class on the sweep; graph-nominated pairs, entailment-scored, report-only. Rollback: disable detector.
- **S11 The rest of the novel slate**: example/test generation (N6b, additive+human-approved), typed-relation KG surface (N4a), context-budget-fitting assembler (N1a, envelope layer, default-off), freshness decay queue (N5b) + per-doc SLAs (N7b) report-only tickets, LLM-judge governance score (N2a). Rollback: per-feature flag off / clear queue.

**Phase VII — The retrieval half (frozen behind measurement)**
- **S12 B3 impression capture** (`SPECKIT_RETRIEVAL_GAP_DETECT` default-OFF) accrues a telemetry window. Rollback: flag off.
- **S13 C2 golden + baseline**: author `spec-corpus-golden.json` (multi-target) + capture `spec-corpus-baseline.json`. Measurement only. Rollback: revert files.
- **S14 C2 gate**: `run-spec-recall-gate.mjs` (PROMOTION: prod@3 rises; REGRESSION: fail on prod@3 drop). Reads ONLY the prod column. Rollback: delete gate.
- **S15 B3 gap detector + `refinement_queue`**, surfaced report-only, edge-tagged (edge-a bypass / edge-b C2-gated via `min_rank_seen`). Rollback: clear queue.
- **S16 Retrieval candidates** (header-path prefix C1, edge-b refinement, metadata fusion, LLM-judge ranking N2b, auto-gen answerable-questions N3a) — each default-off, full re-index behind the coverage guard, promoted ONLY by a C2 prod@3 RISE; coverage must reach 100% under the new version first. Rollback: `embedding_context_version` fallback to prior vectors.

## Why this order and not another

- The novel slate (Phase VI) is sequenced AFTER the engine (S1) because the contradiction detector and drift monitor are hosted on the same sweep (S4) and use the same registry. But VI is otherwise INDEPENDENT of IV-V: it ships report-only, so it carries no backfill/error dependency and can run in parallel.
- The drift monitor (S9) is the FIRST novel item by an explicit dependency: it is the instrument that protects the C2 prod@3 read (S14) from the mixed-vector confound. Building C2 without it risks measuring a confounded delta.
- Phase VII is strictly last because every item in it is retrieval-class and frozen behind C2 (RAIL-2). Nothing in VII ships before S14's gate is live.

## Dead Ends

- Interleaving retrieval stages with the floor-bypassing stages to "ship faster." It breaks the C2-before-promotion edge and re-creates the eval-mode saturation trap.
- A single linear timeline that forces the novel slate behind the migration. The novel slate is report-only; it has no migration dependency and parallelizes.

## Sources

- `../dq-automation-impl/research.md` §4 (11-stage rollout), §3 (one engine three doors)
- `../../research.md` §4 (parent staged rollout Stages 0-5)
- `../dq-skilldoc-cmd-ctx/research.md` §3 (the most-automated architecture, empty cron tier)
- `../dq-novel-oob/research.md` §4 (the shippable novel slate, ordered by safety)
- `confidence-truncation.ts:35` (the floor that forces Phase VII last)

## Assessment

newInfoRatio 0.88 — first deliverable. The five dependency edges and the 17-stage master sequence are the consolidation no single prior lineage produced: each had its own partial order; the spine is the topological merge. Establishes the lineage's method: order = safety property = topological sort of the five edges.
