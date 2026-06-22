---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will add an off_corpus eval fixture with absent terms and zero relevance rows, a scripts/evals driver that calls the existing dormant falseGoodOnHardNegatives metric over that class, plus a default-off SPECKIT_FALSE_CONFIRM_MAX_RATE CI gate with a grandfather report mode. No code change has landed."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/025-off-corpus-eval-fixture-gate"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the off-corpus fixture and false-confirm gate phase"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/ground-truth-data.js"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-off-corpus-eval-fixture-gate"
      parent_session_id: null
    completion_pct: 0
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
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Off-corpus eval fixture

The phase will add an `off_corpus` query class to the eval ground-truth, with terms structurally absent from the corpus (kubernetes, oauth, kafka, terraform), each carrying zero relevance rows so the correct verdict is never good. The 029 benchmark caught `/memory:search` confidently citing the off-corpus term kubernetes at good, but the harness cannot reproduce it today because all six existing ground-truth hard-negatives are in-corpus decoys with a real relevance-3 target, so every hard-negative still has a correct answer and no sample tests the absent-term case. The new class gives the harness the absent-term sample the decoys never provided, and kubernetes is pinned as a permanent regression anchor so a fixture deletion is caught by a deletion-guard test. The class is kept separate from the six in-corpus decoys rather than mutating them.

### False-confirm eval driver and CI gate

The phase will build a `run-false-confirm-eval.mjs` driver that scores the `off_corpus` class through the search path and calls the existing `computeCitabilityConfusionMetrics` to read `falseGoodOnHardNegatives`. That metric already ships at `eval-metrics.js` lines 885-902 but is dormant, no `scripts/evals` driver calls it and the ablation framework wires only the weaker `computeGateVerdictMetrics`. The driver reads the false-confirm rate, records the active embedder name because the rate is embedder-scoped, then applies a `SPECKIT_FALSE_CONFIRM_MAX_RATE` CI gate. The gate ships default-off with a grandfather report mode because the existing corpus already trips a non-zero rate before the downstream lexical-grounding floor lands, so enforcing it on day one would block adoption. With the env unset or in grandfather report mode the driver records the rate and exits zero. With the env set below the measured rate it exits non-zero. This turns the one-off 144-cell manual benchmark into a re-runnable artifact and a permanent regression guard.

### Reuse boundary and verdict immutability

The phase will reuse `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` from `dist/lib/eval/eval-metrics.js` verbatim, with no metric re-implementation. It will not touch the verdict, the scoring path or the citation policy. This phase measures the off-corpus defect and guards against a regression, it does not move good versus weak. The lexical-grounding floor that fixes the verdict is rank 3 in the 005 improvement research and a separate downstream phase that this fixture exists to validate.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json` | Planned modify | Add the `off_corpus` class with absent terms and zero relevance rows, kubernetes pinned as the anchor |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/ground-truth-data.js` | Planned modify | Surface the `off_corpus` class so the harness loads the absent-term queries with no fabricated targets |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs` | Planned create | Driver calling the existing confusion metric, recording the embedder, gated by `SPECKIT_FALSE_CONFIRM_MAX_RATE` with a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js` | Verify only | `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` already exist here, the driver reuses them with no modify |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence adds the `off_corpus` class to the ground-truth source first, then builds the driver against the harness copy DB calling the existing confusion metric, then adds the default-off gate and the grandfather report mode. The fixture test that every `off_corpus` query has zero relevance rows and the kubernetes anchor is present, the gate-mode tests that the env unset and grandfather mode record and exit zero while the env below the rate exits non-zero, and the report carrying the active embedder, all land with the driver.
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

No verification has run. The checks below are planned and currently unmet. The planned gate command is `node run-false-confirm-eval.mjs` and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| Every `off_corpus` query has zero relevance rows and no fabricated targets | PLANNED, not yet run |
| The kubernetes anchor is present and a deletion-guard test fails when it is removed | PLANNED, not yet run |
| The driver reads `falseGoodOnHardNegatives` from the existing metric with no re-implementation | PLANNED, not yet run |
| The env unset and grandfather report mode record the rate and exit zero | PLANNED, not yet run |
| The env set below the measured rate exits non-zero and a non-numeric env is rejected | PLANNED, not yet run |
| The report carries the active embedder name and the scored off-corpus terms | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Existing-corpus rate unknown.** The first false-confirm rate the live corpus trips is not measured until the driver runs, so the `SPECKIT_FALSE_CONFIRM_MAX_RATE` value to freeze stays open until then.
3. **Measurement only.** This phase reproduces and guards the off-corpus defect, it does not fix the verdict. The off-corpus false-positive persists until the separate downstream lexical-grounding floor lands.
4. **Embedder-scoped rate.** The recorded false-confirm rate is calibrated against the active nomic embedder, so an embedder change shifts it, which is why the report records the embedder and the fixture asserts a qualitative verdict rather than a fixed cosine number.
<!-- /ANCHOR:limitations -->

---
