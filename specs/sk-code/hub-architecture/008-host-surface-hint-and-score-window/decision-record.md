---
title: "Decision Record: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-host-surface-hint-and-score-window operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/008-host-surface-hint-and-score-window"
    last_updated_at: "2026-11-16T10:25:04.362Z"
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
# Decision Record: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | A surface hint may add its surface to a scored route, for a surface the hub declares as specific. | The caller has already detected where the session works. | None | goal.md D4, REQ-001 |
| Q002 | A hinted prompt that scores no mode routes to the hinted specific surface, in this packet. | It is the same code path as the join and removes one reason for the vendoring project's router overlay. | None | goal.md D5, REQ-007, T014 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01DpXRxKmk12gzk1bpuZyDhp:0 -->

Question:
```text
Router plan (Barter item 8): may a session's surface hint add its surface to a route the prompt already scored? Today the hint only reorders surfaces the prompt matched, so it never adds one.
```

Options:
```text
Yes, specific only (Recommended)
No, keep reorder only
```

Answer:
```text
Yes, specific only (Recommended)
```

### Q002
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01DpXRxKmk12gzk1bpuZyDhp:1 -->

Question:
```text
Router plan: should a hinted prompt that scores no mode route to the hinted surface, instead of deferring? Barter's own router overlay does this today, and upstream Skilled defers.
```

Options:
```text
Yes, in this packet (Recommended)
No, keep deferring
```

Answer:
```text
Yes, in this packet (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
