---
title: "Implementation Summary"
description: "A fresh Opus 5.5 reviewer at xhigh reviewed, tested and re-measured the nine features over the Pi default."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/050-pi-default-review/002-feature-review-and-remeasure"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
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
| **Spec Folder** | 002-feature-review-and-remeasure |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh Opus 5.5 reviewer at xhigh reviewed, tested and re-measured the nine features over the Pi default. Eight have a fresh verdict, Pi answered every judgment call, and one defect in 032 is fixed.

### Phase 1: feature-review-and-remeasure

Seven features hold their verdicts: 032, 035, 025 and 024 keep, and 017, 029 and 031 stop on margin. 037's adopt did not reproduce: 97 of 103 rows agree (94.2%) against the 95% bar, one row fewer than 049, while the margin-gated arm reads 98.1% in both runs. 026 makes no call, because 049's detector, its baseline, is right on 101 of 110 rows. Pi's noul answers agree with the CLI's on 97.7% of 483 paired calls, median gap 0.02, p90 0.08.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | B counts the comparator that won the baseline |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Modify | A case that fails on the old count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One fresh Claude Opus 5.5 subagent at xhigh, with no session context beyond its brief, worked the nine features in turn and used Luna on cli-codex and DeepSeek on cli-pi for review and second opinions. The session then checked every verdict line and route count against its run folder, ran the new 032 test with and without the fix, reran the pooled noul agreement and compared both 037 reports.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Close the phase on the 037 finding instead of changing the default | Whether Pi stays the default or serves only above a 0.10 margin is the operator's call |
| Keep the transport's state framing | Pi's classifier state must be an object, so the CLI's bare text cannot be sent as is |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Verdict lines | All eight match `report.json` in their `~/.skilled/.labels/runs/050-*` folders |
| Route counts | Pi answered every judgment call in the eight runs: 032 58, 035 197, 025 24, 024 258, 017 852, 029 380, 031 108. 037 pairs both routes by design |
| 032 fix | New test fails without the fix (38 pass, 1 fail) and passes with it (39 of 39) |
| Pi noul agreement | Rerun of the pooled script: 483 pairs, 97.7%, median gap 0.02, p90 0.08 |
| 037 | `049-009-paired` adopt 98 of 103, `050-037-paired` keep-cli 97 of 103. Margin arm 101 of 103 in both |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. 037's adopt sits inside run-to-run noise at the 95% bar
2. Verdict lines on the Pi route still read the CLI's model name, so a route switch never prints requalify
3. 025 records no token usage on the Pi route
4. 017's rows come from the live tree and cannot be pinned on a live run
5. The CLI-against-itself noul agreement of 98.8% is the reviewer's figure and was not rerun by the session
<!-- /ANCHOR:limitations -->

---


