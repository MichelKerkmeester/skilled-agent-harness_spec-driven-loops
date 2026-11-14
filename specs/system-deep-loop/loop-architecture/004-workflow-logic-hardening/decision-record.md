---
title: "Decision Record: Deep-research and deep-review workflow logic hardening"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-workflow-logic-hardening operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening"
    last_updated_at: "2026-11-14T12:20:16.781Z"
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
# Decision Record: Deep-research and deep-review workflow logic hardening

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The duration cap uses a new stop reason, maxDurationReached, that phase 001 adds to the single stop-reason list. | Not stated. | None | 001 REQ-013, 003 REQ-010 |
| Q002 | Phase 005 owns the docs outside the two mode packets that name the changed files or stop reasons, except a file a phase 004 test reads. | Not stated. | None | 005 REQ-013 to REQ-017 |
| Q003 | deep-ai-council is retired as a deep-loop mode and re-homed as a standalone agent, possibly with a command workflow and presentation asset. | Not stated. | None | 006-ai-council-mode-deprecation/spec.md |
| Q004 | Confirm mode asks Retry, Skip or Cancel before synthesis after three failed iterations, and auto mode halts to synthesis with no question. | Not stated. | None | 002 REQ-009, REQ-010, 004 REQ-015 |
| Q005 | The tool-call budgets stay at the prompt values that run today, and the skills are corrected to point at them. | Not stated. | None | 005 REQ-002 |
| Q006 | After the answers were recorded the session stopped for review before any implementation. A later instruction asked for implementation once no decision is pending. | Not stated. | None | spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:82220e9f-953e-4513-8cbd-1433ecf2abdf:toolu_01LtxSZWw2sJybgeX4PfT1wq:0 -->

Question:
```text
Phase 003 enforces the duration cap (maxDurationMinutes) as a terminal stop, but the frozen stop-reason list has no member for it. Which stop reason should the duration cap use?
```

Options:
```text
New member in phase 001 (Recommended)
Reuse maxIterationsReached
Reuse manualStop
```

Answer:
```text
New member in phase 001 (Recommended)
```

### Q002
<!-- source: claude:82220e9f-953e-4513-8cbd-1433ecf2abdf:toolu_01LtxSZWw2sJybgeX4PfT1wq:1 -->

Question:
```text
Several docs outside the deep-research and deep-review packets name the changed files or stop reasons: convergence.md sections 2 and 3, the agent definitions, the sk-doc and sk-code checklists and the speckit README. Which phase should own updating them?
```

Options:
```text
Phase 005 (Recommended)
Phase 004
Leave out of scope
```

Answer:
```text
Phase 005 (Recommended)
```

### Q003
<!-- source: claude:82220e9f-953e-4513-8cbd-1433ecf2abdf:toolu_01LtxSZWw2sJybgeX4PfT1wq:2 -->

Question:
```text
Phases 003 and 005 each found the same kind of defect in the deep-ai-council mode (a stale workflow file name and a lineage value issue). The council mode is out of scope today. Should it be fixed in this packet?
```

Options:
```text
Keep out of scope (Recommended)
Add a sixth phase
Fix only the two found
```

Answer:
```text
let's deprecate deep-ai-council completely as a deep mode and instead make it a isolated .agents file maybe with a command workflow and presentation asset for all runtimes
```

### Q004
<!-- source: claude:82220e9f-953e-4513-8cbd-1433ecf2abdf:toolu_01LtxSZWw2sJybgeX4PfT1wq:3 -->

Question:
```text
Phase 002 sets one failure rule: three failed iterations in a row halt the loop and go to synthesis with partial findings. In confirm mode, should the operator get a Retry, Skip or Cancel choice before that synthesis starts?
```

Options:
```text
Yes, gate in confirm (Recommended)
No gate in either mode
```

Answer:
```text
Yes, gate in confirm (Recommended)
```

### Q005
<!-- source: claude:82220e9f-953e-4513-8cbd-1433ecf2abdf:toolu_01Ab3MvKuC6PtHA99RKdVgjh:0 -->

Question:
```text
No runtime code enforces a tool-call budget per iteration. The agent only sees a number in its prompt: 24 for research, and target 9, soft max 12, hard max 13 for review. The skills say max 12 for both. Which budget is intended?
```

Options:
```text
Keep prompt values (Recommended)
12 for both
Keep values and enforce them
```

Answer:
```text
Keep prompt values (Recommended)
```

### Q006
<!-- source: claude:82220e9f-953e-4513-8cbd-1433ecf2abdf:toolu_01Ab3MvKuC6PtHA99RKdVgjh:1 -->

Question:
```text
The spec packet at specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening is authored and validated, with nothing implemented. What should happen next?
```

Options:
```text
Record answers only (Recommended)
Record, then start phase 001
Record, then commit the specs
```

Answer:
```text
Record answers only (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
