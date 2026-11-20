---
title: "Decision Record: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-ci-vocabulary-single-source operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/007-ci-vocabulary-single-source"
    last_updated_at: "2026-11-19T17:36:43.718Z"
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
# Decision Record: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The seven CI keyword phrases added to the sk-code hub's advisor vocabulary are kept. | Not stated. | none | specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:4f13b979-22c2-4cb8-9c32-6053ecd082ab:toolu_014JxfBrZ7edtsQgu8MJcgLW:1 -->

Question:
```text
The CI keyword fix added seven phrases (such as 'strategy matrix' and 'trigger-index rebuild') to the sk-code hub's skill-advisor vocabulary, because a commit gate requires it. Advisor validation scores did not move. What should happen with them?
```

Options:
```text
Keep them (Recommended)
Pin them out of the advisor
Test more prompts first
```

Answer:
```text
Keep them (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
