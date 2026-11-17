---
title: "Decision Record: Spec-Line Position Gates"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-spec-line-position-gates operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/008-spec-line-position-gates"
    last_updated_at: "2026-11-17T16:54:33.317Z"
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
# Decision Record: Spec-Line Position Gates

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the four doc findings and add a spec-position rule with tests to the shape check, leaving the changelog entries and the v4.0.2.1 model-entry test alone. | Not stated. | None | spec.md section 3, check_changelog_shape.py |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:77af2d6d-58e8-4180-b6da-697f12833f71:toolu_01CQy8ahzgW8adXFcvj48Edx:1 -->

Question:
```text
Which fixes count as 'all except changelog stuff'? I'm excluding the changelog entries themselves: the five with content after the spec line, the 1,876 missing the &nbsp; line, and the failing test, whose fix is restoring v4.0.2.1's section tags.
```

Options:
```text
Text fixes + position gate (Recommended)
Four text fixes only
Also point the test elsewhere
```

Answer:
```text
Text fixes + position gate (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
