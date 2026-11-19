---
title: "Decision Record: Phase 11: decisions-rule-delivery"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "011-decisions-rule-delivery operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents-md/repo-rule-operations/002-repo-rule-advisor-surfacing/011-decisions-rule-delivery"
    last_updated_at: "2026-11-19T17:34:22.986Z"
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
# Decision Record: Phase 11: decisions-rule-delivery

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Only the Gate 3 fix ships; no 'recommend one option first' line is added to the per-prompt Directives block. | Not stated. | none | specs/agents-md/repo-rule-operations/002-repo-rule-advisor-surfacing/011-decisions-rule-delivery/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:53042a94-d007-4749-9b53-e5f4f2e2d42b:toolu_01TEjNrDnztifvksWKmHNEdv:0 -->

Question:
```text
The Gate 3 fix is done and its tests pass (AGENTS.md label plus the hook notice now say 'recommend one'). Should I also add a 'Decisions: recommend one option first and say why' line to the per-prompt Directives block on every runtime? Commit f4ead54766 (2026-08-30) retired the same kind of line on purpose: only a rule with an enforcer earns that slot, and a disposition does not. Since then, the directive-lifecycle dedup shows the block once per startup or compaction rather than every turn, so it costs less now.
```

Options:
```text
No, Gate 3 fix only (Recommended)
Yes, add the directive
```

Answer:
```text
No, Gate 3 fix only (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
