---
title: "Decision Record: Retire three low-value reply rules and fold their unique clauses into the surviving rules"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-reply-rule-pruning operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents-md/repo-rule-operations/005-reply-rule-pruning"
    last_updated_at: "2026-11-12T09:00:00.113Z"
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
# Decision Record: Retire three low-value reply rules and fold their unique clauses into the surviving rules

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Retire all three low-value reply rules and fold their unique clauses into communication.md. | Not stated. | None | REQ-001, REQ-003, spec.md scope |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:d2b7b083-7b6e-461a-bb59-532bdecb0369:toolu_015GQQk2GSBygTHRakcyA9sr:0 -->

Question:
```text
Which repo rules should I remove? I found three low-value reply rules: answer-the-actual-request.md (mostly restates other rules), communication-prose.md (mostly default writing behaviour) and communication-decisions.md (overlaps communication.md and AGENTS.md). Their unique clauses would be folded into communication.md so no norm is lost.
```

Options:
```text
All three (Recommended)
Two, keep decisions
Only answer-the-actual-request
None, trim instead
```

Answer:
```text
All three (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
