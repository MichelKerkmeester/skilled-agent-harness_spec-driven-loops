---
title: "Decision Record: Phase 11: permission-mode-carry"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "011-permission-mode-carry operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/038-goal-and-workflow-resume/011-permission-mode-carry"
    last_updated_at: "2026-11-19T17:36:19.368Z"
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
# Decision Record: Phase 11: permission-mode-carry

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Phase 011: when the sender's mode is plan, the hop keeps the receiver's launch mode (option B). | Not stated. | none | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/038-goal-and-workflow-resume/011-permission-mode-carry/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:76bc97c7-bf3b-47b4-928f-cc11342db852:toolu_01HcmitSDH92b22pffeJrMt6:2 -->

Question:
```text
Phase 011 carries the Claude permission mode across a hop. When the sender's live mode is plan, the receiver still has to run the claim command and usually edit. What should the hop do?
```

Options:
```text
B: keep launch mode (Recommended)
A: carry plan as is
C: map plan to manual
D: carry plan, note asks
```

Answer:
```text
B: keep launch mode (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
