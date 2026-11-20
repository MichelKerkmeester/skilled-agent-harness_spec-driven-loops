---
title: "Decision Record: Phase 8: wider-hop-recall-measurement"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-wider-hop-recall-measurement operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement"
    last_updated_at: "2026-11-19T17:47:24.598Z"
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
# Decision Record: Phase 8: wider-hop-recall-measurement

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The new phase spec measures the history lookup's benefit over a wider set of hops. | Not stated. | none | 008-wider-hop-recall-measurement/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:18bab8d4-e0f3-4389-862e-01b44355af59:toolu_01KtgnMiFvNZ7kdyVSHCgqun:0 -->

Question:
```text
"Plan to measure this": what should the new phase spec measure once the history lookup engine has moved into the session-handover hook folder?
```

Options:
```text
Lookup benefit, wider (Recommended)
Only that the move broke nothing
Both
```

Answer:
```text
Lookup benefit, wider (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
