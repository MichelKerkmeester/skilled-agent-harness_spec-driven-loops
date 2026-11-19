---
title: "Decision Record: Deprecate and remove the cli-hermes executor and the .hermes runtime folder"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "003-cli-hermes-deprecation operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/003-cli-hermes-deprecation"
    last_updated_at: "2026-11-19T17:35:28.969Z"
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
# Decision Record: Deprecate and remove the cli-hermes executor and the .hermes runtime folder

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | cli-hermes and the .hermes runtime are removed entirely. | Not stated. | none | specs/cli-external-orchestration/runtime-lifecycle/003-cli-hermes-deprecation/spec.md |
| Q002 | The remaining Hermes-removal agents run through OpenCode Go after the DevPass 402. | Not stated. | none | specs/cli-external-orchestration/runtime-lifecycle/003-cli-hermes-deprecation/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:bc537a37-2cfc-4f67-a64f-441dcdb09c86:toolu_01PCXVz2WzuJyiDGqzYdAb3W:2 -->

Question:
```text
What should "deprecate completely" do to cli-hermes and the .hermes runtime?
```

Options:
```text
Remove entirely (Recommended)
Archive, then remove
Mark deprecated only
```

Answer:
```text
Remove entirely (Recommended)
```

### Q002
<!-- source: claude:bc537a37-2cfc-4f67-a64f-441dcdb09c86:toolu_01PAYQQ54XVuUJApMCFCfuod:0 -->

Question:
```text
DevPass (llmgateway) refused DeepSeek V4.1 Flash max with 402: "Dev Plan credit limit reached… renewal on 11/10/2026". Which route should the remaining Hermes-removal agents use?
```

Options:
```text
OpenCode Go (Recommended)
Cline Pass
DevPass overflow
Wait until Nov 10
```

Answer:
```text
OpenCode Go (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
