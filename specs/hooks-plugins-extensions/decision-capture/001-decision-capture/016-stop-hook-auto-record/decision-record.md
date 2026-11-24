---
title: "Decision Record: Phase 16: stop-hook-auto-record"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "016-stop-hook-auto-record operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/decision-capture/001-decision-capture/016-stop-hook-auto-record"
    last_updated_at: "2026-11-24T18:45:20.350Z"
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
# Decision Record: Phase 16: stop-hook-auto-record

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Plan an automatic record of queued answers as new work. | Not stated. | None | REQ-001, spec.md |
| Q002 | Auto-record only when the session is bound to exactly one packet; otherwise keep the nudge, and leave chat candidates manual. | Not stated. | None | REQ-001, REQ-003, spec.md Scope |
| Q003 | Write the plan with /speckit:plan in the primary checkout, by the main session. | Not stated. | None | plan.md, tasks.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_013E62x2SS1cT8cbiizbKUzu:1 -->

Question:
```text
Should I start the save automation for queued answers as a new piece of work?
```

Options:
```text
Not now (Recommended)
Yes, plan it
```

Answer:
```text
Yes, plan it
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_011fPGy6q5MxRwaXsd7wsaK3:1 -->

Question:
```text
What should the plan cover first? Packet routing is the risk: a session that touched several packets could file an answer in the wrong record.
```

Options:
```text
Bound packet only (Recommended)
Research first
Opt-in flag
```

Answer:
```text
Bound packet only (Recommended)
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_011fPGy6q5MxRwaXsd7wsaK3:2 -->

Question:
```text
How should the plan be written? It only writes spec docs, so no git workspace choice is needed until the build.
```

Options:
```text
/speckit:plan, I write (Recommended)
/speckit:plan via cli-pi
```

Answer:
```text
/speckit:plan, I write (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
