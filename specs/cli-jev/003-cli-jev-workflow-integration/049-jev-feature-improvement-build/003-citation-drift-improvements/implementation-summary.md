---
title: "Implementation Summary"
description: "The citation drift scan keeps its keep verdict on 55 Jev calls where it needed 121, and its flip count fell from 3 to 0."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/003-citation-drift-improvements"
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
| **Spec Folder** | 003-citation-drift-improvements |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The citation drift scan keeps its keep verdict on 55 Jev calls where it needed 121, and its flip count fell from 3 to 0. It now refuses a label row whose recorded claim or window no longer matches, before any call.

### Phase 1: citation-drift-improvements

`cite-drift-scan.mjs` asks Jev whether a cited code window still shows what the citing sentence claims. It now flags a row when its lowest rerun falls below 0.5 while still reporting the modal pick, screens each row once and spends reruns only near the line, and prints live and constructed rows as separate columns with a live-only sign test. New draws hash the whole paragraph that makes the claim; each label row records its claim unit, and rows without one keep being checked and sent as the single cited line they were labeled on. The census reads each document once.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modified | Min-rerun flag, adaptive reruns, live column, paragraph claims with a per-row claim unit, hash checks, read cache, report details |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Modified | Stop branches, disagreeing reruns, hash tampering, legacy line rows, read counting |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max fast built it on cli-codex. DeepSeek V4.1 Flash max reviewed it on cli-pi and found a P0: the paragraph claim changed what `claim_sha12` hashes, so 20 of the 40 committed label rows failed the hash check and the default scan exited 2. A Luna fix dispatch added the per-row claim unit, finishing just before the Codex usage limit. The session ran the default scan, which exits 0 again, and the live re-measure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep legacy labels on the line they were judged on | Re-hashing them to the paragraph would point an operator label at a claim the operator never read, which 003 D4 does not allow |
| Spend reruns only near the line | Rows far from 0.5 settle on one call; reruns pay off only where a flip is possible |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | 37 passed (baseline 29) |
| Default scan on the committed labels | exit 0, 40 rows accepted (before the fix: `labels row live-02: claim hash mismatch`, exit 2) |
| Live re-measure, `cite-drift-scan.mjs --jev --out ~/.skilled/.labels/runs/049-003-jev-20261003` | exit 0 in 261 s: `verdict jev: keep K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=0 p=2.384e-7`, 55 calls. 032 recorded the same line with F=3 |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Review P2s recorded.** The worktree carried other phases' edits during review; this phase's commit stages only its two files.
2. **Paragraph claims apply to new draws only.** The 40 committed rows stay line claims until someone relabels them on paragraphs.
<!-- /ANCHOR:limitations -->

---


