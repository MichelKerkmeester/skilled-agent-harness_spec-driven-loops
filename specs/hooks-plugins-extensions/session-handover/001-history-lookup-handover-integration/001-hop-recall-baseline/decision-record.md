---
title: "Decision Record: Phase 1: hop-recall-baseline"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "001-hop-recall-baseline operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline"
    last_updated_at: "2026-11-19T17:35:50.619Z"
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
# Decision Record: Phase 1: hop-recall-baseline

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Phase 1's result (6 of 6 hops failed to recover the code) is a go for building the history lookup integration. | Not stated. | none | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:d785250f-7570-4eb7-b91c-c43f32d65099:toolu_01NRttwn1JDY8kmR5nBzpn7Y:0 -->

Question:
```text
Phase 1 result on Claude Code: in 6 of 6 counted hops the receiver could not recover the code. It answered UNKNOWN every time, never tried the history lookup and never read the sender's transcript, with the lookup CLI on disk (3 runs) and hidden (3 runs). One extra run did not count: there the sender had been told a follow-up question was coming, so it copied all 120 codes into the note and the receiver answered correctly. So a detail is lost on a hop whenever the sender does not know it will matter. Go or no-go for building phases 2 to 6?
```

Options:
```text
Go (Recommended)
Go, but widen the baseline first
No-go
```

Answer:
```text
Go (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
