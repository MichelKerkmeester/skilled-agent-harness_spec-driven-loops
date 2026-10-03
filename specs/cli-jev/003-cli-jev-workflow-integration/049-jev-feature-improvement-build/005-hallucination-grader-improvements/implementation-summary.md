---
title: "Implementation Summary"
description: "The hallucination grader keeps its keep verdict on the repeat run, and a new cascade arm keeps too, sending only 30 of 56 rows to the model."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/005-hallucination-grader-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 005-hallucination-grader-improvements |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hallucination grader keeps its keep verdict on the repeat run, and a new cascade arm keeps too, sending only 30 of 56 rows to the model. A grader failure is now unmeasured after one retry, never a silent 0.0.

### Phase 1: hallucination-grader-improvements

`score-d4-agreement.cjs` measures how well Jev agrees with operator labels on the D4 hallucination dimension. All 21 benchmark fixtures now carry an `allowlist`, and `run-benchmark.cjs` forwards task, spec and allowlist so the 5-dimension path sees the same context as the check. `score-model-variant.cjs` records a failed grader call as unmeasured after one retry, and `dispute.cjs` escalation is reachable from the 5-dimension adapter for low-confidence rows. The report prints per-class results with intervals, refuses requalification when the stored labels SHA changed, and runs a cascade arm that sends only check-flagged rows to the model.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/` | Modified | allowlist on all 21 fixtures |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs` | Modified | Unmeasured state and one retry instead of 0.0 |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Modified | Per-class report, labels SHA check, cascade arm |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs` | Modified | Escalation reachable from the 5-dimension adapter |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Modified | Forward task, spec and allowlist to the scorer |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts` | Modified | Unmeasured state, forwarding through the real caller, escalation, per-class, SHA refusal, repeat run |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md` | Modified | Census expects allowlist 21 of 21 |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md` | Modified | Index line for the census scenario |
| `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md` | Modified | Cascade arm, per-class lines and labels-SHA refusal |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max fast built it on cli-codex. A DeepSeek V4.1 Flash max review on cli-pi found a P1, the caller did not forward context, and two P2s, docs and the cascade fill. DeepSeek fixed all three in single-change dispatches. A Luna review of the final change found a P1: the forwarding test called the scorer directly, so it could not catch a broken caller. DeepSeek added a test that spawns the real `run-benchmark.cjs` with a spy scorer and showed it fails with the forwarding removed. The session ran the suite and the repeat run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Test forwarding by spawning the real caller | `run-benchmark.cjs` runs on load and exports nothing, so a spawned run with a spy scorer is the narrowest path that covers the production code |
| Report the cascade as its own arm | It changes which rows reach the model, so it must not replace the jev column the keep rule reads |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run --config vitest.config.mjs model-benchmark/tests/d4-agreement.vitest.ts` | 36 passed (baseline 27) |
| Fixture census | 21 of 21 fixtures carry `allowlist` |
| Repeat run, `score-d4-agreement.cjs --jev --cascade --out ~/.skilled/.labels/runs/049-005-jev-20261003` | exit 0 in 92 s: `verdict jev: keep K=56 M=56 A=55 B=47 W=9 L=1 F=1 p_win=0.01074`, `verdict cascade: keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906` |
| `validate_document.py` on the three changed docs | 0 issues on the scenario and catalog entry; the playbook index keeps its HEAD document-type fallback warning |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The jev column moved one row.** It now shows W=9 L=1 where 047 had W=8 L=0, both keep.
2. **No second rater.** Two-reader labels are new labels, out of scope per 003 D4.
<!-- /ANCHOR:limitations -->

---


