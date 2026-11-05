---
title: "Decision Record: Deprecate sk-design-fundamentals into sk-code-frontend and strip research references from sk-design modes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "021-deprecate-fundamentals operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals"
    last_updated_at: "2026-11-05T16:11:14.918Z"
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
# Decision Record: Deprecate sk-design-fundamentals into sk-code-frontend and strip research references from sk-design modes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Delete sk-design-fundamentals and remove every route to it once its useful content lives in sk-code-frontend. | Not stated. | None | 002-retire-fundamentals/spec.md |
| Q002 | Fold the slides, print and document guidance that chart and diagram still need into those two modes instead of sk-code-frontend. | Not stated. | None | 001-frontend-upgrade/spec.md, 002-retire-fundamentals/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:47cfebca-4e20-46c7-be67-6a63e7618084:toolu_01NPGpyugGUKuNVBvrZVFgZ1:2 -->

Question:
```text
After its useful content moves into sk-code-frontend, what happens to the sk-design-fundamentals folder?
```

Options:
```text
Remove and unroute (Recommended)
Keep as a stub
```

Answer:
```text
Remove and unroute (Recommended)
```

### Q002
<!-- source: claude:47cfebca-4e20-46c7-be67-6a63e7618084:toolu_01NPGpyugGUKuNVBvrZVFgZ1:3 -->

Question:
```text
Fundamentals also covers slides, print and document layouts, and chart and diagram borrow its colour and type scales. sk-code-frontend only covers web code. Where should that non-screen guidance go?
```

Options:
```text
Into sk-code-frontend (Recommended)
Inline into chart/diagram
Drop it
```

Answer:
```text
Inline into chart/diagram
```

<!-- /ANCHOR:operator-answers-verbatim -->
