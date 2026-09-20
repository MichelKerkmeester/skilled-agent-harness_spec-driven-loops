---
title: "Implementation Summary"
description: "Ten divergences between the interactive and unattended deep-command surfaces closed, with every remaining difference censused inside the file and machine-checked."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/006-confirm-variant-parity"
    last_updated_at: "2026-09-15T14:23:14Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the confirm-variant divergences and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-confirm-variant-parity"
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
| **Spec Folder** | 006-confirm-variant-parity |
| **Completed** | 2026-09-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The confirm variants of deep-research and deep-review now match their auto twins or say why they do not. Seven measured divergences were closed and three further functional holes the close-out exposed were closed with them: the missing mechanical post-dispatch gate, the unenforced minimum-iterations floor with its convergence-off branch, and the missing snapshot flag on the convergence call. Where the auto variant was itself wrong it was corrected rather than copied, in three places. Everything still different is written into a census block inside the confirm file, and four new tests fail if a future edit reopens the gap.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max thinking through the gateway on cli-pi, with all seven divergences enumerated in the brief and the instruction to close each one or write a reason at the point of divergence, never silence. The delegate restored 383 lines into review-confirm and 190 into research-confirm, corrected the two auto files, regenerated both compiled contracts and added the parity tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Census rather than restore the divergent-pivot step in both confirms | The interactive pivot gate applies the pivot inline in its own branches; restoring the step would have added an unreachable one |
| Correct the auto variant where the auto side held the defect | Copying a wrong lineage read or an unstaged-artifacts step into confirm would have doubled the defect instead of closing it |
| Close three holes beyond the named seven | Restoring a step whose enabling machinery is absent produces a step that runs and does nothing, which reads as parity without being it |
| Write the census into the workflow file, not the packet | The reason has to be where the next editor of that file will see it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Auto-only steps without a census entry | zero in both pairs, counted independently of the delegate |
| Confirm-only steps | zero in both pairs |
| Census entries | four for review, ten for research, each naming the interactive reason |
| Contract drift check | exit 0, three commands OK |
| Command reference checker | exit 1 with ten unresolved references, all under design/, none in this phase's surface |
| Full deep-loop suite | 2654 passed, 8 skipped, 1 failed across 152 files |
| The one failure | a transport-unavailability assertion in the cli-adapter stress file, staled by a neighbouring commit that added binary probing; outside this phase's surface |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The census is a promise in prose.** The tests assert that every auto-only step has a census entry and that the entries name real steps; nothing machine-checks that a reason is true. A wrong reason passes.
2. **Auto-only gateway sites cannot be exercised from the confirm surface.** The research variant has four of them — `deep_research.run_now_requested`, `run_now_rejected` and `run_now_accepted` in `step_run_now_check`, and the restore twin in `step_run_now_restore_check` — against one in the review variant, `deep_review.recovery_baseline`. Each variant's `auto_only_sites` entry names its own, so the gap is recorded rather than silent, but no confirm-surface test can reach them.
3. **Shared branch break.** A neighbouring session's commit added executor binary probing to the runner, which changed the failure message a cli-adapter stress test asserts. That test now fails and belongs to that session's change, not this one. This phase touches command assets and one contract test only. The failure is recorded as the baseline every later phase is measured against, not fixed here.
<!-- /ANCHOR:limitations -->

---


