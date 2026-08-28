---
title: "Implementation Summary"
description: "Both pinned gates are green again, and the recapture is provably a re-measurement rather than a relaxation: the CI threshold arguments are unchanged, and the two joint counts that had no headroom came back at exactly their baseline values."
trigger_phrases:
  - "008 phase 003 summary"
  - "routing-baseline-recapture results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/008-sk-prompt-standalone-conversion/003-routing-baseline-recapture"
    last_updated_at: "2026-08-28T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 3 complete; acceptance checks recorded"
    next_safe_action: "Execute 004-card-sync-guard-rewrite"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-003-routing-baseline-recapture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove the two holdout rows rather than accept a lower pass rate"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-routing-baseline-recapture |
| **Completed** | 2026-08-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both pinned gates are green again, and the recapture is provably a re-measurement rather than a relaxation: the CI threshold arguments are unchanged, and the two joint counts that had no headroom came back at exactly their baseline values.

### Only the rows that asserted a deleted capability were removed

The holdout corpus lost two rows - `dispatch this to MiniMax-M3` and `send it to kimi-for-coding/k2p7` - both of which expected the alias table the previous phase removed. Keeping them would have pinned a permanently failing case. Every other row in all three corpora is untouched.

### The independent check was deliberately left alone

The labeled corpus contains no small-model rows, so it was never affected. It was re-scored against the same CI thresholds after the change and passed, which is what makes the recapture credible: the corpus that could not have moved for this reason confirms nothing else moved either.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/routing-accuracy/holdout-prompts.jsonl` | Modify | Remove the two rows asserting a retired capability (72 to 70) |
| `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Modify | Lower `DELEGATION_MIN_N` from 11 to 9 |
| `scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Recaptured through the capture script |
| `.../002-baseline-capture/baseline/routing-baseline.json` | Modify | Re-pin the holdout sha256 and row count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The ratchet was run first and allowed to fail, so the two moved metrics were observed rather than predicted. The corpus edit was then scoped to exactly those rows, the baseline regenerated through its own capture script rather than hand-edited, and the drifted hash copied in following the pattern an earlier recapture commit had already established. The final check re-ran the CI gate in its exact CI form, hash loop included.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the two holdout rows rather than accept a lower pass rate | A pinned row asserting a capability that was deliberately deleted is a permanently red check, not a measurement. |
| Regenerate the baseline through the capture script | Hand-editing the metric block would have produced numbers that no run had actually observed. |
| Update only the one drifted corpus hash | The two sibling pins were already correct; touching them would have obscured which file actually changed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scorer-eval ratchet | PASS - 7 of 7 |
| Corpus hash pin check | PASS - all three corpora match |
| Routing-accuracy thresholds | PASS - `overall_pass: true`, no threshold failures |
| Zero-headroom counts | PASS - FT=3 and FF=1, unchanged from baseline |
| Labeled-corpus independence | PASS - full-corpus top-1 held at 153/195 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The delegation bucket is now measured over 9 cases rather than 11.** It still reports 100 percent accuracy, but over a smaller sample, so it is a slightly weaker signal than before.
2. **The recapture was taken in the no-sqlite fallback regime.** That matches CI, but a warm advisor daemon scores higher through graph boosts, so these pins should not be compared against numbers taken with a live daemon.
<!-- /ANCHOR:limitations -->

---
