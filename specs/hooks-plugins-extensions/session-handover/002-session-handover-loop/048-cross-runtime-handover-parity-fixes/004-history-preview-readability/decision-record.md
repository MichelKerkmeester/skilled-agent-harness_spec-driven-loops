---
title: "Decision Record: Phase 4: history-preview-readability"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-history-preview-readability operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/004-history-preview-readability"
    last_updated_at: "2026-11-15T21:21:07.089Z"
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
# Decision Record: Phase 4: history-preview-readability

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the history previews in 048 and rerun Pi on DeepSeek Flash at max thinking, rather than waive the Pi half of AC-005. | Not stated. | The recommendation to waive the Pi half and hand the preview finding to the history lane | 004-history-preview-readability, AC-005 of 003-nudge-parity-and-hop-scoring |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01W7R1fqKzZyK1hZChf92i1V:1 -->

Question:
```text
AC-005 in phase 3 is half met. OpenCode recovered the side word through History Lookup (5/5, word absent from the note). Neither Pi hop did: the first Pi sender leaked the word into the note, and in the second the receiver ran the lookup, but Pi model-turn previews show tool-call JSON, so it gave up. The previews come from the history engine, which the IN SESH HIST lane owns. What should happen to the Pi half?
```

Options:
```text
Waive, hand to history lane (Recommended)
Fix previews in 048
Rerun Pi at higher thinking
Leave AC-005 open
```

Answer:
```text
Rerun pi deepseek flash mac and fix previews
```

<!-- /ANCHOR:operator-answers-verbatim -->
