---
title: "Tasks: Eval-Gated Confidence Calibration and Shipped-Lever A/B"
description: "Task breakdown for graduating the dormant isotonic confidence calibration on held-out ECE evidence (harvest labels, binarize the golden set, build the ECE lane, three-way shadow) and A/Bing the three default-on search levers (cosine reorder, generic-query escalation, top-dominant verdict). All tasks pending, neither candidate shipped in the Wave-0 record, both gated on the 019 eval-harness."
trigger_phrases:
  - "isotonic calibration graduation tasks"
  - "ece calibration lane tasks"
  - "ab shipped levers tasks"
  - "eval gated calibration tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/027-eval-calibration-ab"
    last_updated_at: "2026-07-04T17:51:01.862Z"
    last_updated_by: "codex"
    recent_action: "Implemented observe-only calibration harvest, shadow comparison and lever A/B utilities"
    next_safe_action: "Run 019-backed golden benchmark"
    blockers:
      - "Gated on the 019 eval-harness ECE lane + A8 promotion gate."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts"
    completion_pct: 45
    open_questions:
      - "Held-out ECE split + identity-baseline margin to graduate the flag."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Eval-Gated Confidence Calibration and Shipped-Lever A/B

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

> **Status note**: Observe-only consumer utilities are implemented and tested. Both candidates remain PENDING for promotion because no 019-backed held-out ECE or golden-set lever benchmark has been run.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the 019 eval-harness ECE lane (`C9-3`) + the `A8` per-class promotion gate are built. If absent, scope this phase to the calibration consumer wiring and HALT at promotion [20m], confirmed promotion remains gated. This phase implemented observe-only consumer utilities only
- [ ] T002 Confirm the gate-zero corpus reindex (`001-corpus-reindex-gate-zero`) has run so golden-set embedding coverage is whole [15m], PENDING: no live corpus benchmark was run
- [x] T003 Read the `eval_run_ablation` baseline loop (`lib/eval/ablation-framework.ts`) and the `EvalResult[]` capture shape [15m]
- [x] T004 [P] Read `fitCalibration` (`confidence-calibration.ts:145`), `loadLabeledSet` (`:73`), `CalibrationSample` (`:41`) and `maybeCalibrate`/`rebalancedValue` (`confidence-scoring.ts:217,:348`) [15m]
- [x] T005 [P] Read the three lever seams: S5 reorder + eval-mode skip (`hybrid-search.ts:1989,:2014-2021`), S3 escalation (`query-classifier.ts:157,:245`, `:62`), S2 verdict (`confidence-scoring.ts:78,:385,:423`) [15m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Calibration Harvest, Fit and ECE Lane (A2)

- [x] T006 Binarize the graded golden set (`grade >= 2 -> relevant=1`) into the `CalibrationSample` shape (`confidence-calibration.ts`) [25m]
- [x] T007 Instrument the `eval_run_ablation` baseline loop to emit calibration pairs from diagnostic snapshots (`ablation-framework.ts`) [40m]
- [x] T008 Wire `fitCalibration` to the harvested binarized labels as its first non-test caller (`ablation-framework.ts`, `confidence-calibration.ts`) [25m]
- [x] T009 Add/consume the ECE + Brier + reliability-bin lane over a held-out split at the eval-metrics aggregation (`lib/eval/eval-metrics.ts`), the validation crux [45m]
- [x] T010 Add the three-way shadow (identity / materialized proxy-seed / traffic-fit) scored on held-out ECE (`lib/eval/shadow-scoring.ts`) [40m]
- [ ] T011 Graduate `SPECKIT_CONFIDENCE_CALIBRATION` / `isConfidenceCalibrationEnabled` default-on ONLY when the real fit beats identity on held-out ECE, via the flag lifecycle (opt-in → feature-on → rollback) (`search-flags.ts:622`) [25m], PENDING: no 019-backed held-out ECE benchmark was run

### Shipped-Lever A/B (A3)

- [x] T012 Fix the S5 eval-mode blind spot: make the A/B searchFn descriptor set `evaluationMode:false` and toggle `SPECKIT_COSINE_TOPN_REORDER` (`ablation-framework.ts`, reorder seam `hybrid-search.ts:2014-2021`) [25m]
- [ ] T013 A/B S5 (cosine head-reorder) on nDCG@1 + top-1 precision on the golden set [25m], PENDING: metric utility exists. No golden benchmark delta was run
- [x] T014 Add the S5 demotion instrument: flag pre/post-reorder rank losses for golden-relevant rows lacking `.similarity` (`eval-metrics.ts`) [30m]
- [ ] T015 A/B S3 (generic-query/complexity escalation) on recall@k, partitioned {escalated, non-escalated} (`SPECKIT_COMPLEXITY_ROUTER`, `query-classifier.ts:157,:245`) [30m], PENDING: variant descriptors exist. No golden benchmark delta was run
- [ ] T016 A/B S2 (top-dominant verdict) via citability confusion incl. the false-good-on-hard-negatives cell (`assessRequestQuality`, `TOP_DOMINANT_THRESHOLD`, `eval-metrics.ts` confusion instrument) [30m], PENDING: confusion instrument exists. No golden benchmark delta was run
- [ ] T017 Report each lever's measured effect (S5/S3/S2) against the golden set [20m], PENDING: benchmark acceptance requires 019-backed golden run
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Add a label-harvest test (non-empty `CalibrationSample[]` emitted from the ablation loop) (`tests/eval-calibration-ab.vitest.ts`) [20m]
- [x] T019 Add a binarization test (`loadLabeledSet` accepts) (`tests/eval-calibration-ab.vitest.ts`) [15m]
- [x] T020 Add an ECE/reliability-bin lane test (held-out split) (`tests/eval-calibration-ab.vitest.ts`, `tests/eval-metrics.vitest.ts`) [25m]
- [x] T021 Add a three-way shadow test (identity / proxy-seed / traffic ECE comparison + promote/wait/rollback) (`tests/eval-calibration-ab.vitest.ts`) [25m]
- [x] T022 Add an S5 eval-mode toggle test (the reorder descriptor runs outside evaluation mode under the A/B) (`tests/eval-calibration-ab.vitest.ts`) [15m]
- [x] T023 Add per-lever A/B tests (S5 nDCG@1 + top-1, S3 partitioned variants, S2 citability confusion) (`tests/eval-calibration-ab.vitest.ts`) [30m]
- [x] T024 Add a no-op test (production calibration + lever defaults unchanged, harness observe-only) (`tests/confidence-calibration.vitest.ts`, no production flag defaults changed) [20m]
- [ ] T025 Report the held-out ECE delta and the per-lever golden-set deltas [20m], PENDING: benchmark acceptance requires 019-backed golden run
- [x] T026 Run `npx tsc --noEmit` from the MCP server directory [10m]
- [x] T027 Run the requested vitest suites and record exact counts [20m]
- [x] T028 Run strict spec validation for this phase [10m]
- [ ] T029 Run changed-code comment-hygiene checks [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] `fitCalibration` is called from the eval runner with harvested, binarized label pairs (first non-test caller).
- [x] ECE + Brier + reliability bins are reported over a held-out split (existing calibration lane consumed by the observe-only report).
- [ ] The three-way calibration shadow is scored on held-out ECE. The flag graduates default-on only when the real fit beats identity, PENDING: shadow utility exists, but flag graduation requires benchmark evidence.
- [ ] The S5 eval-mode blind spot is fixed. S5/S3/S2 each have a reported on/off measured effect on the golden set, PENDING: utility descriptors exist, golden-set deltas not run.
- [x] The S5 demotion instrument exists for the bounded/rare class.
- [x] Production calibration + lever defaults are unchanged until a promotion decision (the harness is observe-only).
- [x] No live `mcp_server/database/**` shard or host daemon was used.
- [ ] Final TypeScript, requested tests, strict spec validation and comment-hygiene checks pass, PENDING until final cross-phase verification completes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Parent Spec**: See `../spec.md`.
- **Source research**: `../../research/synthesis/08-retrieval-evaluation-findings.md` (#6 / #7), `../research/retrieval-evaluation/research.md`, `.../research/deltas/iter-004.jsonl` (A2) + `iter-005.jsonl` (A3) + `iter-010.jsonl`/`iter-012.jsonl` (verify), `../../research/roadmap.md` (BROADENING §6).
- **Gate dependency**: `../001-corpus-reindex-gate-zero/spec.md`. The 019 eval-harness spine (sibling phase).
- **Wave-0 shipped record**: Wave-0 record (neither candidate listed → PENDING).
<!-- /ANCHOR:cross-refs -->
