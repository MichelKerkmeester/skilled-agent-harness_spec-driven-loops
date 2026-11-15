---
title: "Decision Record: Phase 22: agent-source-and-drift-checks"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "022-agent-source-and-drift-checks operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/022-agent-source-and-drift-checks"
    last_updated_at: "2026-11-15T17:44:29.715Z"
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
# Decision Record: Phase 22: agent-source-and-drift-checks

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Add websearch: allow to the deep-research source so every tree grants web search, and name the key in the crosswalk. | Not stated. | None | 022-agent-source-and-drift-checks, REQ-003, REQ-004 |
| Q002 | Decide both open design calls now: the roster check reads .skilled/agents, and the markdown agent becomes mode: subagent. | Not stated. | None | 022-agent-source-and-drift-checks, REQ-001, REQ-003 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01R7Z3cry1AWnXmtUozeb2WE:0 -->

Question:
```text
The deep-research agent's source permission map (.skilled/agents/deep-research.md) grants webfetch but has no websearch key, yet the Claude copy grants WebSearch. How should the two agree?
```

Options:
```text
Add websearch to source (Recommended)
Drop WebSearch from Claude
Document the mapping
```

Answer:
```text
Add websearch to source (Recommended)
```

### Q002
<!-- source: claude:a84f4eed-26f9-49ac-91eb-e2375c207e96:toolu_01R7Z3cry1AWnXmtUozeb2WE:1 -->

Question:
```text
Phase 20 left two design calls open: which tree the doctor roster check treats as canonical (it reads .claude/agents), and whether the markdown agent keeps mode: all while its body calls it a LEAF. What should happen to them in this pass?
```

Options:
```text
Leave as recorded (Recommended)
Decide them now
```

Answer:
```text
Decide them now
```

<!-- /ANCHOR:operator-answers-verbatim -->
