---
title: "Decision Record: Phase 12: session-scoped-sweep-and-consume"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "012-session-scoped-sweep-and-consume operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/decision-capture/001-decision-capture/012-session-scoped-sweep-and-consume"
    last_updated_at: "2026-11-16T14:02:30.420Z"
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
# Decision Record: Phase 12: session-scoped-sweep-and-consume

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the sweep's session choice and the worktree save's pending answer as decision-capture child 012. | Not stated. | None | spec.md REQ-001, REQ-002, ../spec.md phase map |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:cbc62a39-7ca8-4b5a-989f-a86fdea260ea:toolu_01Jza9zADX3TZ2CXBPUSS3v4:0 -->

Question:
```text
Where should the two decision-capture defects go? The first is that the transcript sweep reads whichever session's transcript changed last. The second is that a save run from a worktree leaves the answer pending in the main checkout's queue, which risks recording it twice. Both live in .skilled/hooks/decision-capture/.
```

Options:
```text
New child 012 here (Recommended)
Own top-level packet
Leave them recorded
```

Answer:
```text
New child 012 here (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
