---
title: "Decision Record: Phase 9: deep-review-p2-remediation"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "009-deep-review-p2-remediation operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/009-deep-review-p2-remediation"
    last_updated_at: "2026-11-15T20:04:12.912Z"
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
# Decision Record: Phase 9: deep-review-p2-remediation

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The operator asked whether the predecessor hard block should be removed rather than waived for this phase. | Not stated. | None | the follow-up block-rule decision and .skilled/commands/speckit/assets/speckit-complete.yaml |
| Q002 | Record I1-P2-004 as already held, with no new export or test, because drifting either bound copy already fails two existing tests. | The negative control showed the existing sweep test fails on drift from either side. | None | spec.md Measured Behavior and REQ-006 |
| Q003 | Remove phase_predecessor_validation from /speckit:complete entirely inside this phase, and check every other speckit workflow for it. | Not stated. | the recommended waive-and-narrow option | REQ-005 and .skilled/commands/speckit/assets/speckit-complete.yaml |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b605670-f7cb-4de9-b085-c762fd46c2f8:toolu_01NEXpNyH3CMtyLV17qGzg11:0 -->

Question:
```text
/speckit:complete hard-blocks a phase child whose predecessor is unfinished (speckit-complete.yaml step 1, phase_predecessor_validation: "HARD BLOCK — predecessor phase not complete"). Child 008 (wider hop-recall measurement) has 14 open tasks and no implementation summary. Child 009 (the P2 fixes) does not depend on 008. How should I proceed?
```

Options:
```text
Skip the check (Recommended)
Stop here
```

Answer:
```text
Should we remove that block
```

### Q002
<!-- source: claude:0b605670-f7cb-4de9-b085-c762fd46c2f8:toolu_01NEXpNyH3CMtyLV17qGzg11:1 -->

Question:
```text
Finding I1-P2-004 says the 66-character session-id bound is held equal in one direction only. My negative control contradicts it: setting either copy (hook-state.ts or lookup-offer.ts) to 65 or 67 fails two existing engine tests each time, so drift is already caught from both sides. What should 009 do with this finding?
```

Options:
```text
Record as already held (Recommended)
Add the test anyway
```

Answer:
```text
Record as already held (Recommended)
```

### Q003
<!-- source: claude:0b605670-f7cb-4de9-b085-c762fd46c2f8:toolu_0152CghJCHk25CKMDLsqr2wi:0 -->

Question:
```text
I'd narrow the block, not remove it. It protects real sequences, where child N builds on child N-1, but it also stops independent siblings like 009. Only speckit-complete.yaml has it (line 535); /speckit:plan and /speckit:implement don't. The narrowed rule would block only when the child's graph-metadata.json lists the predecessor in depends_on, and otherwise warn and continue. Changing a shared workflow is outside 009's scope, so how do you want to handle it?
```

Options:
```text
Waive now, narrow later (Recommended)
Narrow it inside 009
Remove it entirely
```

Answer:
```text
Remove entirely and also check other spec commands for it
```

<!-- /ANCHOR:operator-answers-verbatim -->
