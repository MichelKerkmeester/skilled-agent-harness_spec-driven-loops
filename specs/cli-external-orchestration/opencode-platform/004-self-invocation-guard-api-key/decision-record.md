---
title: "Decision Record: Self-invocation guard ignores OPENCODE_API_KEY"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-self-invocation-guard-api-key operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/004-self-invocation-guard-api-key"
    last_updated_at: "2026-11-12T15:11:57.534Z"
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
# Decision Record: Self-invocation guard ignores OPENCODE_API_KEY

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The cli-opencode self-invocation guard is fixed now, as its own small packet, so that OPENCODE_API_KEY alone does not trip it. | Not stated. | None | spec.md REQ-001 to REQ-005, and the guard line in .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:6f6d0815-5182-4dab-96b0-b36b0b73deea:toolu_01PVD3dJTFqwWu9RDUv67MEd:2 -->

Question:
```text
The cli-opencode self-invocation guard treats any OPENCODE_* variable as proof of running inside OpenCode, so OPENCODE_API_KEY alone tripped it and I had to ask you before dispatching. Should the guard ignore OPENCODE_API_KEY?
```

Options:
```text
Record as follow-up (Recommended)
Fix it now
Leave as is
```

Answer:
```text
Fix it now
```

<!-- /ANCHOR:operator-answers-verbatim -->
