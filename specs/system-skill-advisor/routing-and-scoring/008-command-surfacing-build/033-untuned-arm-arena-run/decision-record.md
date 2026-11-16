---
title: "Decision Record: Phase 33: untuned-arm-arena-run"
description: "Decisions taken without the operator during the untuned arm run: keeping the run when the sk-git row moved an arena's head, against the plan's rollback rule, and waiving the every-line-restored criterion for its four turns."
trigger_phrases:
  - "033-untuned-arm-arena-run decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run"
    last_updated_at: "2026-11-16T04:20:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded the decision to keep the run when one sk-git row moved an arena head"
    next_safe_action: "Review the recorded decision"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "77af2d6d-58e8-4180-b6da-697f12833f71"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 33: untuned-arm-arena-run

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| ADR-001 | Keep and score the run instead of discarding it when the four `fresh-skill-04` turns read `restored: false` (devin off run 1 twice, devin on run 1, dsh on run 1), and waive AC-001's every-line-restored clause for those four turns only. Each turn moved the arena's head with a rebase, and the runner stops on a head move before it restores. Each arena was restored by hand to `b765c7a14c5` and checked clean with no remote, and the row was not rerun past one try. The hand restore left a `main` ref in the devin and dsh arenas that a fresh arena never has (created by devin's first turn, recreated in dsh). Later turns in those two arenas ran with it, and it was deleted after the run (`scratch/arenas-after.txt`). The deciding dsh decline line ran before dsh's head move. The row stays in the scorer's counts, scored as capped on the on arm. | `fresh-skill-04` is a skill-only row whose expected top is `sk-git`, so a history operation may be the task it asks for, not an escape. Discarding 401 lines over one row the runner cannot measure would have thrown away the other 35 rows on every runtime. D1 says take the safe default without asking. | AC-001 and REQ-001 as written, plan.md section 3 invariant (every line reads `restored: true`) and plan.md section 7 rollback trigger (any line with `restored` not true) for these four turns | `scratch/devin-rebase-evidence.txt`, `scratch/dsh-head-move-evidence.txt`, `scratch/reruns.txt`, `scratch/arenas-after.txt`, goal log rows on the devin rebase |
<!-- /ANCHOR:operator-decisions -->
