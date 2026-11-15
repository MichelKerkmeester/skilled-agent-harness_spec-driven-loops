---
title: "Decision Record: Phase 24: terminal-gates-script"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "024-terminal-gates-script operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/024-terminal-gates-script"
    last_updated_at: "2026-11-15T18:14:00.781Z"
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
# Decision Record: Phase 24: terminal-gates-script

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Wire the terminal-gates script into the review workflow strictly now, accepting that most reviews fail coverage until iterations record traceability results. | Not stated. | None | 024-terminal-gates-script, REQ-002, deep-review.yaml record_terminal_gates |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01SzAkxHisJP8EiTkxXmZCiV:0 -->

Question:
```text
The new terminal-gates script computes evidence, scope and coverage correctly, but on 40 recorded reviews coverage fails in almost all of them: their iterations never record the spec_code and checklist_evidence traceability results the rule needs. Scope also fails on messy scope lists (prose entries, brace globs). If the review workflow uses the script now, nearly every review's session verdict becomes FAIL. How should this land?
```

Options:
```text
Script only, wire later (Recommended)
Wire it now, strict
Wire it, coverage only
```

Answer:
```text
Wire it now, strict
```

<!-- /ANCHOR:operator-answers-verbatim -->
