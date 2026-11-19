---
title: "Decision Record: Phase 1: sender-dialog-after-prepare"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "001-sender-dialog-after-prepare operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare"
    last_updated_at: "2026-11-19T17:47:48.350Z"
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
# Decision Record: Phase 1: sender-dialog-after-prepare

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The next fix is the hop that never happens when a sender opens a question dialog after prepare. | Not stated. | none | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/spec.md |
| Q002 | This session builds the dialog-after-prepare child itself, with a failing test first. | Not stated. | none | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/spec.md |
| Q003 | The fix makes the guard deny the question dialog a sender opens after prepare, so the hop is not lost. | Not stated. | none | 001-sender-dialog-after-prepare/spec.md REQ-002 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:53e771b8-c072-45b2-b8e1-c6a16e34711f:toolu_01VYomqK7BnnasGSi5EizfDH:0 -->

Question:
```text
Packet 038 (hop state carry) is merged, pushed and its five goal criteria pass again on current main: 18 strict validations PASSED, no Unmet row, suites 1524, 200 and 62 green. Two findings are recorded in the packet and not acted on: senders that open a question dialog after `prepare` never hop (4 live attempts in child 016), and the Pi and OpenCode playbook has no checks for children 013 and 015. What should happen next?
```

Options:
```text
Stop here (Recommended)
Plan a follow-up packet
Fix the dialog-after-prepare hop
Add the playbook checks
```

Answer:
```text
Fix the dialog-after-prepare hop
```

### Q002
<!-- source: claude:53e771b8-c072-45b2-b8e1-c6a16e34711f:toolu_015rjvatdcP46CUNBmzhNF2n:1 -->

Question:
```text
Children 009 to 017 of packet 038 were built by DeepSeek V4.1 Flash through OpenCode or dsh, with me checking each diff. Who should build child 018, which is one small guard change with a failing test first?
```

Options:
```text
This session (Recommended)
DeepSeek via dsh
```

Answer:
```text
This session (Recommended)
```

### Q003
<!-- source: claude:53e771b8-c072-45b2-b8e1-c6a16e34711f:toolu_01AtQKhZSRVzc1RvA6tD7Anb:0 -->

Question:
```text
Correction: the evidence of the four failed runs was not overwritten. I found it and it confirms the cause in all four, so a new live run is not needed for that. In each run the harness (not the sender) ran `prepare` while the sender was still working under its goal, the sender then called AskUserQuestion 5 to 43 seconds later, no Stop event followed and the record stayed pending. In a passing run the turn ended after `prepare`, Stop armed the record and the killer fired 3 seconds later. Note the sender never saw the "stop now" line, because the harness ran `prepare` for it. A real sender runs `prepare` itself, so the real exposure is a sender that asks a question in the same turn instead of stopping. How should child 018 proceed?
```

Options:
```text
Refuse the dialog (Recommended)
Record and close, no code
Still run live first
Stronger wording only
```

Answer:
```text
Refuse the dialog (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
