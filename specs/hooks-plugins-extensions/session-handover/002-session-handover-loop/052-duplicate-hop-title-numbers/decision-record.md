---
title: "Decision Record: Phase 52: duplicate-hop-title-numbers"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "052-duplicate-hop-title-numbers operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/052-duplicate-hop-title-numbers"
    last_updated_at: "2026-11-16T20:46:45.597Z"
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
# Decision Record: Phase 52: duplicate-hop-title-numbers

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | A fresh skilled-loop launch resets the hop count to 0 instead of inheriting it from the shell it started in. | Not stated. | None | skilled-loop launch variables, README.md hop count line |
| Q002 | A trailing number in the launch name is replaced on each hop, never stacked. | Not stated. | None | skilled-loop name_stem, runtime-behavior.md naming rule |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:cbc62a39-7ca8-4b5a-989f-a86fdea260ea:toolu_01CeTa3NTQ7aHdpTyck9uh6z:0 -->

Question:
```text
A new skilled-loop started from inside a looped session inherits that session's hop count (this one carries 10), so its first relaunch gets a high number and the count skips. The README says the count starts at 0, and the loop id is already reset at launch. Should a fresh launch reset the hop count to 0?
```

Options:
```text
Reset to 0 (Recommended)
Keep inheriting
```

Answer:
```text
Reset to 0 (Recommended)
```

### Q002
<!-- source: claude:cbc62a39-7ca8-4b5a-989f-a86fdea260ea:toolu_01CeTa3NTQ7aHdpTyck9uh6z:1 -->

Question:
```text
When the loop is launched with a name that already ends in a number, like "ENGINE LIMITS (2)", hops currently give "(2) (2)", then "(2) (3)", and an existing test requires that. Should a hop replace that number too?
```

Options:
```text
Never stack (Recommended)
Keep as part of name
```

Answer:
```text
Never stack (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
