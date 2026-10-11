---
title: "Implementation Summary"
description: "Ten-iteration deep research ranked every fresh-clone stumble by user impact; two README lines stop a newcomer before the first routed request."
trigger_phrases:
  - "fresh clone onboarding implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding"
    last_updated_at: "2026-10-11T17:40:10Z"
    last_updated_by: "generate-context"
    recent_action: "Completed ten-iteration fresh-clone research and checked synthesis"
    next_safe_action: "Run a fix phase that implements R1 to R11 in rank order"
    blockers: []
    key_files:
      - "specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/research.md"
      - "specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/goal.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:9602fcfb32a7c30b5614c8574ea5fc6b151df54ed1c15b65ce596e49cda2a950"
      session_id: "scaffold-002-fresh-clone-onboarding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1"
      - "Q2"
      - "Q3"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-fresh-clone-onboarding |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A stranger who clones this framework and follows the README now has a ranked list of everything that trips them, and the two worst items are one-line README fixes. On a pristine clone the advisor CLI exits 1 because the README promises an auto-build that does not exist, and the Code Mode MCP server refuses any Node other than 24.x, which the README never names.

### Phase 2: fresh-clone-onboarding

You get `research/research.md`: ten iterations of `/deep:research` folded into 14 ranked recommendations, each with its `path:line` evidence, its move from the reversal-cost order, and what fails at the cheaper move. Of the five stumbles the spec named, two are real as stated, one is real by a different mechanism (the unbuilt sk-vision `dist` breaks the shipped plugin symlinks, not the tests), and two cost nothing before the first spec packet. The walk also found that nothing on the documented path builds the spec-kit runtime `dist`, so session-start hooks degrade in every runtime, and that the tracked Claude settings ship `bypassPermissions` to every user.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Loop config, state log, ledgers, ten iterations, deltas, dispatch receipts, dashboard, resource map and the synthesis |
| `research/research.md` | Created | The checked synthesis and the ranked Recommendations table |
| `spec.md` | Modified | Bounded pre-init research note and the generated findings fence under Open Questions |
| `tasks.md`, `goal.md`, `implementation-summary.md` | Modified | Task state, goal log and this summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `/deep:research` auto workflow ran with stop policy max-iterations, so all ten iterations ran. Each iteration was dispatched through the cli-pi executor on the DevPass route (`llmgateway/deepseek-v4.1-flash`, thinking max), with the child-dispatch preamble and the deep-research persona inlined, and every one passed `verify-iteration.cjs`. The iterations probed a disposable clone in the session scratchpad. After the loop the orchestrator read every cited line, re-ran the load-bearing commands on a second pristine clone, corrected two iteration claims, and wrote the synthesis. Both clones were deleted.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rank by impact along the walk, cheaper move first on a tie | A hard stop before the first routed request costs a newcomer more than a gap they meet later |
| Keep the `.claude/settings.json` row at R3 but flag it as inferred | The shipped values are confirmed; how Claude Code applies them at startup was not observed in a live session |
| Point the coverage graph database at the scratchpad | Keeps every write of the run inside the packet folder or the scratchpad |
| Run iteration executor timeout at 1800 seconds | Iterations install and build inside the clone, which the 900-second default could cut short |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records in `deep-research-state.jsonl` | PASS, 10 |
| `verify-iteration.cjs` per iteration | PASS, 10 of 10 |
| Recommendation rows, path:line and move checks from `goal.md` | PASS, 14 rows, 0 without path:line, 0 without a named move |
| Orchestrator spot-check of cited lines | PASS after two corrections, recorded in `research/research.md` section 8 |
| Pristine-clone re-runs (advisor exit 1, Code Mode Node 24 refusal, 36 root files) | PASS, reproduced |
| `check-goal.cjs` | PASS, 5 of 5 |
| Strict validation | Recorded in `goal.md` log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Claude Code startup effect not observed.** R3 rests on the shipped settings values and the schema text; one live session in a fresh clone settles it before anyone implements R3.
2. **npm 11 skipped install scripts.** npm 11.19 skips `onnxruntime-node` and three other dependency install scripts until approved; whether the first-packet path needs any of them is unknown.
3. **Node 20.19 warn-only result not re-run.** It comes from iteration 2's clone, not the orchestrator's pristine clone.
<!-- /ANCHOR:limitations -->

---


