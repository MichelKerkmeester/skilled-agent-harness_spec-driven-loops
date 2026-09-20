---
title: "Implementation Summary"
description: "The containment promise and the verdict contract now describe their mechanisms, and a severity outside the scale is reported instead of vanishing below every real tier."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/009-containment-promise-and-severity-scale"
    last_updated_at: "2026-09-15T14:23:17Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Named one authority per domain and filled the packet record"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-containment-promise-and-severity-scale"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-containment-promise-and-severity-scale |
| **Completed** | 2026-09-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Two domains that each had two authorities now have one. The containment comments, the two confirm notes and the guard's docstring describe what the runner actually does, which is to diff, record and quarantine while leaving the bytes on disk, with restoring opt-in and the guard named as the remedy authority. The verdict check's contract now states plainly that it validates the final line's format and nothing else, that a PASS over active blocking findings passes it, and that the governing verdict is recomputed from the findings registry with the fan-out merge as the authoritative rollup. A severity outside the three-tier scale is reported per lineage, finding and value instead of falling through a rank lookup to a zero default. And the collapse rule that lanes had been applying by unwritten convention is written where a rater reads it.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max thinking through the gateway on cli-pi, briefed with the measurements and the instruction to name one authority per domain rather than build a reconciler. The delegate checked each measurement against the tree first and found four of them wrong, which changed what it did.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Correct the promise, not the containment default | The guard cannot attribute a path a concurrent writer may own, so a revert destroys work the lane never wrote; the runner also latches preserve permanently once churn detection sees a second writer, so a restore default would be overridden exactly where defaults matter |
| Keep the verdict check shape-only and say so | Consulting the findings would not make it independent: the verifier reads only the narrative and the state record, both written by the same leaf, and the carried-forward findings live in a registry it never opens |
| Report an out-of-scale severity rather than re-rank it | The merge cannot invent a tier the scale does not have, and guessing one would hide the defect a second way |
| State the contract at three sites rather than one | The check, the hub document and the rendered prompt reach three different readers, and only the third reaches the rater who assigns the severity |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Containment promise sites | no remaining claim of a revert or a loud failure; the codex-leaf mention is gone from every variant |
| Comment count contradiction | the promise comment occurs once per auto variant, not four times, verified against this commit and its parent |
| Out-of-scale report | negative control: the pre-change module returned no mismatch for an out-of-scale registry, the changed one reports it |
| Contract drift | regenerated; the digest test refused the stale pair until they were |
| Comment hygiene | no spec path, phase number or identifier in any added line |
| Full deep-loop suite | 154 files, 2678 passed, 8 skipped, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three adjacent defects recorded, not fixed.** The runner's devin branch still claims the guard reverts any out-of-scope path a lineage touched, inside executor tables another session owns. The reducer's severity normalizer returns null for an out-of-scale value and its callers drop the finding with no warning, a second silent path. The collapse rule does not reach the agent mirrors yet.
2. **The verdict check is still shape-only.** Nothing changed about what it can catch. The change is that its contract no longer implies otherwise and names where the governing answer is computed.
3. **Four of the brief's measurements were wrong.** The promise comment occurs once per auto variant rather than four times, it was never copied into the cursor, devin or pi branches, there were four promise sites once the confirm notes are counted, and the four-tier promise sites this phase was told to correct had already been corrected elsewhere.
<!-- /ANCHOR:limitations -->

---


