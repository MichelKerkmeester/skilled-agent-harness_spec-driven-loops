---
title: "Decision Record: Phase 2: history-core-relocation"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "002-history-core-relocation operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation"
    last_updated_at: "2026-11-19T17:35:58.813Z"
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
# Decision Record: Phase 2: history-core-relocation

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Phase 2 splits ownership of the history core instead of a full move. | Not stated. | none | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:d785250f-7570-4eb7-b91c-c43f32d65099:toolu_016fHsL6ffddzG2z6taQGRdy:0 -->

Question:
```text
I verified the phase 2 claim against the code. All four facts hold, but 'blocked' is too strong: the full move is possible, it just costs more. The history core's CLI imports the spec-kit runtime's hook state, and hook state imports one small function back from the history folder (a two-way dependency, breakable by moving that one function). The handover concern has no build step, and the hooks README says a core lives there only if it imports nothing but Node builtins. Which placement should phase 2 specify?
```

Options:
```text
Split ownership (Recommended)
Full move with a build step
Full move, converted to plain JS
```

Answer:
```text
Split ownership (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
