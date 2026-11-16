---
title: "Decision Record: Phase 12: opencode-model-carry"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "012-opencode-model-carry operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/012-opencode-model-carry"
    last_updated_at: "2026-11-16T11:31:57.876Z"
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
# Decision Record: Phase 12: opencode-model-carry

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Spike the OpenCode 2 model carry, then build it. | Not stated. | None | spec.md, implementation-summary.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:87e90d42-7a99-4147-b5e1-353501784430:toolu_01NA77YJCTxaizXMvMcJLeqq:0 -->

Question:
```text
Hops on Pi and OpenCode now pass (merged and pushed). The one gap left from 'works perfectly in OpenCode' is that an OpenCode 2 hop starts the next session on OpenCode's default model, because OpenCode 2 has no model flag and ignores the OPENCODE_CONFIG and OPENCODE_CONFIG_CONTENT variables (tested). Only a project opencode.json sets the model, and the plugin doesn't record the sender's model yet. How should I continue?
```

Options:
```text
Spike, then build (Recommended)
Spike only, report back
Stop here
```

Answer:
```text
Spike, then build (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
