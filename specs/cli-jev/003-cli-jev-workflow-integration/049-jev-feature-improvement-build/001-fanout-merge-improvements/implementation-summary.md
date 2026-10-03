---
title: "Implementation Summary"
description: "The fan-out merge scorer now reaches the same verdict on 124 Jev calls where it needed 181."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/001-fanout-merge-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs"
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
| **Spec Folder** | 001-fanout-merge-improvements |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The fan-out merge scorer now reaches the same verdict on 124 Jev calls where it needed 181. Its report also names what Jev has to beat: an always-same rule scores 48 of 60 and a word-overlap rule scores 53.

### Phase 1: fanout-merge-improvements

`score-fanout-pairs.cjs` judges whether Jev would merge fan-out findings better than the shipped dedup. It now asks Jev two orders per pair and calls a third only when they disagree, with a pair-symmetric tiebreak order. The report prints two plain baselines beside the merge oracle, and `report.json` records the label digest, rubric hash, scorer hash, each pair's oracle decision and the dropouts. The verdict prints at cuts 0.4, 0.45 and 0.5, so a later held-out batch can calibrate the cut.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` | Modified | Baselines, two-call early stop, symmetric tiebreak, self-describing report, cut sweep |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts` | Modified | Cases for each behavior and a replay of the recorded 60-pair run |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max fast built it on cli-codex in two dispatches, because the first stopped at the Codex usage limit. DeepSeek V4.1 Flash max reviewed it on cli-pi and found no P0. Its one P1 was the re-measure, which the session ran live against Jev with the operator's 047 labels.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stop after two agreeing orders | A 2-0 vote cannot be overturned by a third call, so the third call only buys anything on a split |
| Keep the 0.5 cut as the gate | The cut sweep is for a later held-out batch; recalibrating on the same 60 pairs would tune to them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/unit/score-fanout-pairs.vitest.ts` | 42 passed (baseline 37) |
| Replay of the recorded 047 run in the suite | Same modal picks at all three cuts, 124 calls against 181 |
| Live re-measure, `--labels ~/.skilled/.labels/030-labels.jsonl --jev --out ~/.skilled/.labels/runs/049-001-jev-20261003` | exit 0, `verdict jev: keep cut=0.5 K=60 M=60 A=53 B=12 W=44 L=3 F=3 C=124`, identical to 047 at 0.5 |
| DeepSeek review | 0 P0, 1 P1 (the re-measure, now done), 3 P2 recorded |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The word-overlap baseline ties Jev at the gate cut.** At 0.5 both score 53 of 60, so Jev's edge over a free rule shows only at 0.4 (57). The verdict stays keep because the gate compares against the shipped dedup (12), not the baseline.
2. **Review P2s are recorded, not fixed.** The baseline rows' counts are not asserted, the replay cannot exercise the tiebreak because the recording holds no split answer, and two feature-catalog lines (`runtime/feature-catalog/feature-catalog.md:854`, `fanout/fanout-pair-replay.md:68`) still describe three calls per pair.
<!-- /ANCHOR:limitations -->

---


