---
title: "Implementation Summary: Phase 44: deem-answer-shape-fix"
description: "cli-deem and two scorers read judgment answers in shapes the real tools never send. The fix is in progress."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/044-deem-answer-shape-fix"
    last_updated_at: "2026-10-02T06:02:32Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Traced the cause and dispatched the two fixes"
    next_safe_action: "Verify both fixes and check the client against the local server"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-044-deem-answer-shape-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 044-deem-answer-shape-fix |
| **Completed** | In progress |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has landed yet. Two workers are fixing the three readers that disagree with the real tools.

### Phase 44: deem-answer-shape-fix

The local Deem server answers `noul` as `{"noul": <number>}` and `score` with a numeric `score`, but `cli-deem` reads `value` and a `level` label, so every real `noul` and `score` call exits 1. 027's stop rater and 026's Deem arm read the number above the `answers.answer` envelope that real `cli-deem` and `jev` print.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Pending | The fixes are in progress |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max on cli-codex takes `cli-deem` and SWE 2 max on cli-devin takes the two scorers, in parallel on disjoint files. The session verifies each and commits it alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The real tools are the contract, with no fallback to the old shapes | A fallback would keep a path no real tool exercises |
| The scorers that already read `answers.answer` stay unchanged | The parser sweep found them correct |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baselines | cli-deem 34, 027 vitest 59, 026 vitest 23, 0 failing |
| Fixes, local check, review, closure | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A live scorer run still needs the operator's yes.** This phase checks the client against the local server only.
<!-- /ANCHOR:limitations -->

---


