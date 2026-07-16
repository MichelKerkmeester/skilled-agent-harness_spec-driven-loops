---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Added an off_corpus eval fixture (ids 98-103, kubernetes pinned as the anchor) with absent terms and zero relevance rows, a scripts/evals driver that scores the class through the production verdict path and reads the dormant falseGoodOnHardNegatives metric, plus a default-off SPECKIT_FALSE_CONFIRM_MAX_RATE gate with a grandfather report mode. The live driver measures a 0.833 false-confirm rate on nomic. The vitest is 16/16 green and the broad eval/scoring suite is 212/212."
trigger_phrases:
  - "off corpus eval fixture"
  - "false confirm gate"
  - "kubernetes regression anchor"
  - "false good on hard negatives"
  - "off corpus hard negative class"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/025-off-corpus-eval-fixture-gate"
    last_updated_at: "2026-07-06T19:16:34.885Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped off-corpus fixture, driver and gate, live rate 0.833 on nomic"
    next_safe_action: "Hand the fixture to the downstream lexical-grounding floor phase that this guard validates"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/false-confirm-eval.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-off-corpus-eval-fixture-gate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-off-corpus-eval-fixture-gate |
| **Completed** | 2026-06-22, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The fixture, the driver and the default-off gate shipped and all checks pass.

### Off-corpus eval fixture

Added an `off_corpus` query class to the eval ground-truth (ids 98-103) with six terms structurally absent from the corpus, kubernetes, oauth, kafka, terraform, graphql and webpack, each carrying zero relevance rows so the correct verdict is never good. The 029 benchmark caught `/memory:search` citing the bare term kubernetes at good 0.78 on an unrelated doc, but the harness could not reproduce it because all six existing ground-truth hard-negatives are in-corpus decoys (ids 92-97) with a real relevance-3 target, so every hard-negative still had a correct answer and no sample tested the absent-term case. The new class gives the harness the absent-term sample the decoys never provided. The queries are the bare terms, matching the 029 benchmark probe form, which is what reproduces the spurious high-cosine top hit a descriptive phrasing dilutes. Kubernetes is pinned as the permanent regression anchor, its notes carry a PERMANENT ANCHOR marker the vitest asserts. The class is separate from the six in-corpus decoys, the vitest proves they share no ids and the decoys keep their relevance-3 targets.

### False-confirm eval driver and CI gate

Built `run-false-confirm-eval.mjs`. It scores the `off_corpus` class through the production verdict path, `computeResultConfidence` then `assessRequestQuality`, the exact wiring the production formatter and the ablation snapshot use, on a read-only tempdir backup of the live DB. It treats each off-corpus query as a hard-negative whose only correct verdict is non-citable, then calls the existing `computeCitabilityConfusionMetrics` to read `falseGoodOnHardNegatives`. That metric ships at `eval-metrics.ts:885-902` but was dormant, no driver called it and the ablation framework wires only the weaker `computeGateVerdictMetrics`. The driver reports a `falseConfirmRate`, the active embedder block and the per-query top-hit doc name, then applies the `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate. The gate is default-off with a `SPECKIT_FALSE_CONFIRM_GRANDFATHER` report mode because the existing corpus trips a non-zero rate before the downstream lexical-grounding floor lands. The live run measures a 0.833 rate on nomic, five of six off-corpus terms earn a good verdict on an unrelated doc, kubernetes among them, which reproduces the 029 defect as a re-runnable artifact.

### Reuse boundary and verdict immutability

The driver imports `computeCitabilityConfusionMetrics` from the existing module and re-implements no part of it, asserting the export exists at import and failing with a contract error otherwise. It does not touch the verdict, the scoring path or the citation policy, `git diff` shows no edit to `confidence-scoring.ts` or `pipeline/types.ts`. This phase measures the off-corpus defect and guards a regression, it does not move good versus weak. The lexical-grounding floor that fixes the verdict is rank 3 in the 005 improvement research and a separate downstream phase this fixture validates.

### Scope deviation

The spec froze the file list to the ground-truth source, the driver and the metric. Adding a zero-target class broke two per-query target gates in `ground-truth-generator.ts` that previously demanded a relevance-3 target on every query, which directly contradicts REQ-001 and REQ-002. The minimal correct fix was to exempt the target-free `off_corpus` class from gates 5 and 6 in the validator, mirrored in the legacy `ground-truth.vitest.ts`. This deviation is necessary to satisfy the requirements and is documented here rather than silently hand-rolled.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json` | Modified | Added the `off_corpus` class (ids 98-103) with absent bare terms and zero relevance rows, kubernetes pinned as the anchor. The actual ground-truth source, copied to dist by finalize-dist |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts` | Modified | Added `off_corpus` to the `QueryCategory` union so the harness loads the absent-term queries |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts` | Modified | Exempted the target-free `off_corpus` class from the per-query relevance-target gates |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs` | Created | Driver scoring the class through the production verdict path, reusing the confusion metric, recording the embedder, gated by `SPECKIT_FALSE_CONFIRM_MAX_RATE` with a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/tests/false-confirm-eval.vitest.ts` | Created | Covers the off_corpus class shape, the false-confirm metric wiring and the gate modes |
| `.opencode/skills/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts` | Modified | Mirrored the target-free exemption and added `off_corpus` to the valid categories |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts` | Verify only | `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` already exist here, the driver reuses them with no modify |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in source-then-build order. The `off_corpus` class went into `lib/eval/data/ground-truth.json` with the category surfaced through `ground-truth-data.ts` and the validator gates relaxed in `ground-truth-generator.ts`. The driver was built against the harness copy DB reusing the confusion metric, then the default-off gate and the grandfather report mode. The dist was rebuilt with `npm run build` so finalize-dist copied the updated JSON, which the `.mjs` driver imports. The vitest covers the class shape, the metric wiring and the five gate modes, the live driver run confirmed the end-to-end path and the embedder recording.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add a separate `off_corpus` class rather than mutate the six in-corpus decoys | The six existing hard-negatives each carry a real relevance-3 target, so they are in-corpus decoys, and the gap is the absence of an absent-term class, not a broken decoy |
| Pin kubernetes as a permanent regression anchor | It is the exact term the 029 benchmark caught at good, so a deletion-guard test on it keeps the benchmarked defect reproducible |
| Reuse the existing `falseGoodOnHardNegatives` metric verbatim | The metric already ships and is correct, it is only dormant, so the new work is a driver and a gate, not a metric |
| Ship the gate default-off with a grandfather report mode | The existing corpus already trips a non-zero false-confirm rate before the downstream grounding floor lands, so an on-by-default gate would block adoption |
| Record the active embedder and assert a qualitative verdict | The rate is embedder-scoped, so a baked nomic-specific cosine number would not port across an embedder change |
| Do not touch the verdict or scoring path | This phase measures the off-corpus defect, the lexical-grounding floor that fixes it is a separate downstream phase this fixture validates |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run from the `mcp_server` directory. The vitest gate is `npx vitest run --config vitest.config.ts tests/false-confirm-eval.vitest.ts`, the live driver is `node scripts/evals/run-false-confirm-eval.mjs`, the docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| The vitest covering the class shape and the false-confirm metric passes | CONFIRMED, 16/16 green |
| Every `off_corpus` query has zero relevance rows and no fabricated targets | CONFIRMED by the vitest, zero relevance rows for ids 98-103 |
| The kubernetes anchor is present and `resolveOffCorpusClass` rejects a drifted target | CONFIRMED, the anchor carries the PERMANENT ANCHOR marker and the drift case throws |
| The driver reads `falseGoodOnHardNegatives` from the existing metric with no re-implementation | CONFIRMED, imported by name with an at-import contract check |
| The env unset and grandfather report mode record the rate and exit zero | CONFIRMED live, exit 0 for both |
| The env 0.0 below the measured 0.833 rate exits non-zero, a non-numeric env is rejected | CONFIRMED live, exit 1 for both |
| The env 0.9 above the rate exits zero | CONFIRMED live, exit 0 |
| The report carries the active embedder block and the scored off-corpus terms | CONFIRMED, `nomic-embed-text-v1.5` and the six terms in the report |
| No edit to the verdict or scoring path | CONFIRMED, `git diff` clean on `confidence-scoring.ts` and `pipeline/types.ts` |
| Broad eval and scoring suite, no regression | CONFIRMED, 212/212 across 10 files that import the changed modules |
| `validate.sh --strict` on 025 | CONFIRMED, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Measurement only.** This phase reproduces and guards the off-corpus defect, it does not fix the verdict. The off-corpus false-positive persists until the separate downstream lexical-grounding floor lands. The gate ships default-off for exactly this reason, the live corpus trips a 0.833 rate today.
2. **Embedder-scoped rate.** The 0.833 rate is calibrated against the active nomic embedder, so an embedder change shifts it, which is why the report records the embedder and the fixture asserts a qualitative good-is-wrong verdict rather than a fixed cosine number.
3. **Pre-existing legacy-test failures, not introduced here.** `ground-truth.vitest.ts` carries three failures that predate this phase, the length-equals-60 assertion, the distribution-counts assertion and the supported-category enum set, all stale since the eval-v2 work added the multi-target classes (ids 91-97). This phase introduced no net-new failure, the two it would have caused were repaired by exempting the target-free class in both the validator and the test. Bringing those three pre-existing assertions current is out of scope here.
4. **Gate bar still open.** The `SPECKIT_FALSE_CONFIRM_MAX_RATE` value to freeze for enforcement stays open until the downstream verdict fix lands, the default-off plus grandfather posture lets the guard ship without picking that number now.
<!-- /ANCHOR:limitations -->

---
