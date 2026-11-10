---
title: "Decision Record: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "034-runtime-name-implementation-routing operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/006-runtime-name-implementation-routing"
    last_updated_at: "2026-11-08T16:43:36.983Z"
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
# Decision Record: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the runtime-name routing misses in a new system-skill-advisor packet gated on the advisor parity suite, not inside the ask-surface packet. | The fix changes routing for every prompt that names a runtime, so it belongs to the advisor and its validation gate. | None | REQ-001, REQ-003, executor-delegation.ts |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01CUwcq6fbmhgMsJgFh6fh1L:0 -->

Question:
```text
Eight of the eleven routing probes still miss. Prompts like "Make the Claude Code Stop hook return a block…" go to the cli-claude-code executor instead of sk-code, because the cli-external-orchestration hub's runtime-name keywords outscore sk-code. Fixing that changes routing for every prompt that names a runtime. How should I handle it?
```

Options:
```text
New advisor packet (Recommended)
Record and leave
Narrow keyword tweak here
```

Answer:
```text
New advisor packet (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
