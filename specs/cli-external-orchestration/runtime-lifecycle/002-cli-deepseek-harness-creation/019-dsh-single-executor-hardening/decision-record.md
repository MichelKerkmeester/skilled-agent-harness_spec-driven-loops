---
title: "Decision Record: Phase 19: dsh-single-executor-hardening"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "019-dsh-single-executor-hardening operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening"
    last_updated_at: "2026-11-14T19:47:23.245Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 19: dsh-single-executor-hardening

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | dsh was repinned to 0.2.2-rc.3 before the hardening build, and that repin was later folded into the main repin phase. | Not stated. | None | 017-dsh-rc3-repin scratch/second-probe-run.md |
| Q002 | The duplicate repin phase was dropped and the single-executor phases were renumbered to 018 and 019. | Not stated. | None | commit 1107550ac1, parent spec.md phase map |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01N7EyMwW7YDp9h1ZSZxDR83:0 -->

Question:
```text
Installed dsh is 0.2.2-rc.3 (upgraded at 12:31 today, probably by another session's Mistral route work), but the repo pins 0.2.2-rc.1 and the harness skill says to escalate on a mismatch. How should the DeepSeek workers for phases 012, 013 and 018 run?
```

Options:
```text
Temp rc.1 install (Recommended)
Run on rc.3
Repin to rc.3 first
```

Answer:
```text
Repin to rc.3 first
```

### Q002
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01FNmbHpWsNBcvyEYdLb7NiH:0 -->

Question:
```text
The merge stopped on a numbering clash in the DeepSeek Harness packet. origin/main already has its own child 017-dsh-rc3-repin, which does the same rc.3 repin as this branch's 019-dsh-repin-rc3, with a full rc.3 research lineage. This branch also uses 017 (single-lineage loop) and 018 (hardening). How should they be numbered?
```

Options:
```text
Fold 019, shift ours (Recommended)
Shift all three of ours
Renumber origin's 017 to 020
```

Answer:
```text
Fold 019, shift ours (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
