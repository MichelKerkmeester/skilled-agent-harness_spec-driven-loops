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
| Q003 | The pre-dispatch executor audit sends its iteration_start row through the append gateway as a ledger event, so the state log keeps executor identity after a projection refresh. | The direct row was dropped at every refresh, so only dispatch receipts named the executor. | The executor-identity deferral in the purpose packet decision record, Q020 | REQ-009, AC-010, T014 and T021 to T030, executor-audit.ts |
| Q004 | The two-route wording in the harness SKILL.md, sk-prompt SKILL.md and the prompt-improver agent and its mirrors is fixed in this session, and the miss is logged in the Mistral route phase. | Not stated. | None | commit 6fb0f2c502, 004-cli-mistral-vibe-creation/003-dsh-mistral-route implementation-summary.md |
| Q005 | C6 ships as a new system-deep-loop v1.6.27.0 and leaves the shipped v1.6.26.0 entry unchanged. | v1.6.26.0 had already shipped with C6 listed as deferred. | None | spec.md section 3, changelog/v1.6.27.0.md |
| Q006 | The three writers that still bypass the gateway get a follow-up phase, 020-dsh-direct-writer-gateway, planned now and built later. | They are outside C6. | None | 020-dsh-direct-writer-gateway, implementation-summary.md Known Limitations |
| Q007 | The continuity save commit was merged with origin/main and pushed. | Not stated. | None | commit 317d152a5e on origin/main |
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

### Q003
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_017BH3qZ7vGCRcBp3XB4WdHa:0 -->

Question:
```text
C6: where should a single harness iteration's executor identity live? Today only the dispatch receipts name it, and the state log drops the audit row.
```

Options:
```text
Option A: ledger event (Recommended)
Option B: receipts are the record
Keep deferred
```

Answer:
```text
Option A: ledger event (Recommended)
```

### Q004
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_017BH3qZ7vGCRcBp3XB4WdHa:1 -->

Question:
```text
The cli-deepseek-harness SKILL.md line 59, sk-prompt SKILL.md and the prompt-improver agent (plus its 4 mirrors) still say two routes, but Mistral is the third. The Mistral session's phase 003 (In Progress) claims this wording is done. Who fixes it?
```

Options:
```text
Fix it here (Recommended)
Leave to Mistral session
```

Answer:
```text
Fix it here (Recommended)
```

### Q005
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01DvhEXMvuJ5YqMrt5GfXzQo:0 -->

Question:
```text
system-deep-loop v1.6.26.0 already shipped (cf473969a1) with C6 listed as deferred. How should the C6 Option A change be released?
```

Options:
```text
New v1.6.27.0 (Recommended)
Extend v1.6.26.0
```

Answer:
```text
New v1.6.27.0 (Recommended)
```

### Q006
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01DvhEXMvuJ5YqMrt5GfXzQo:1 -->

Question:
```text
Three other writers still append rows straight into a ledger-backed state log, so the next refresh drops them: emitDispatchFailure, emitReceiptWriteFailure and the post-dispatch record_executor_audit step. They are outside C6. What should happen with them?
```

Options:
```text
Plan a follow-up phase (Recommended)
Record as known limitation
Fold into 019 now
```

Answer:
```text
Plan a follow-up phase (Recommended)
```

### Q007
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01X8KZ8cEq7pU866m3i7EPxK:0 -->

Question:
```text
The save is done. Your 19 answers are now in decision records: 13 in the purpose packet, 4 in phase 018 and 2 in phase 019 of the harness packet. Strict validation passes 14 of 14 and 20 of 20. That landed as one local commit, 64632b5249, in worktree 376. origin/main has moved one commit since the push. Should I merge that commit in and push this one too?
```

Options:
```text
Merge and push (Recommended)
Keep it local
```

Answer:
```text
Merge and push (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
