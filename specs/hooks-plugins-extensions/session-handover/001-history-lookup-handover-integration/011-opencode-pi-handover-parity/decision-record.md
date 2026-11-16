---
title: "Decision Record: Phase 11: opencode-pi-handover-parity"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "011-opencode-pi-handover-parity operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity"
    last_updated_at: "2026-11-16T11:34:39.348Z"
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
# Decision Record: Phase 11: opencode-pi-handover-parity

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The research and fixes cover the full hop, the history lookup included. | Not stated. | None | spec.md scope, research/ |
| Q002 | The deep research fans out across a Vibe lineage and an OpenCode Go lineage. | Not stated. | None | research/lineages/ |
| Q003 | Each research lineage runs up to 10 iterations autonomously and stops at convergence. | Not stated. | None | research/lineages/ |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:87e90d42-7a99-4147-b5e1-353501784430:toolu_01Sz9Luiscwho4BAat7NMKpV:0 -->

Question:
```text
"Works perfectly in cli-opencode and cli-pi": what should the research and fixes cover?
```

Options:
```text
Full hop, lookup included (Recommended)
History lookup only
```

Answer:
```text
Full hop, lookup included (Recommended)
```

### Q002
<!-- source: claude:87e90d42-7a99-4147-b5e1-353501784430:toolu_01Sz9Luiscwho4BAat7NMKpV:2 -->

Question:
```text
Which executors should run the deep research? Vibe can only run as one lane of a fan-out.
```

Options:
```text
Fan-out Vibe + OpenCode Go (Recommended)
OpenCode Go only
Vibe x2 fan-out
```

Answer:
```text
Fan-out Vibe + OpenCode Go (Recommended)
```

### Q003
<!-- source: claude:87e90d42-7a99-4147-b5e1-353501784430:toolu_01Sz9Luiscwho4BAat7NMKpV:3 -->

Question:
```text
How many research iterations per lineage, run autonomously?
```

Options:
```text
10, stop at convergence (Recommended)
15, stop at convergence
6, forced depth
```

Answer:
```text
10, stop at convergence (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
