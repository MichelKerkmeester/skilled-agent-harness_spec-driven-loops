---
title: "Decision Record: Phase 7: shared-blocks-and-retired-mechanisms"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-shared-blocks-and-retired-mechanisms operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/007-shared-blocks-and-retired-mechanisms"
    last_updated_at: "2026-11-19T17:37:58.143Z"
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
# Decision Record: Phase 7: shared-blocks-and-retired-mechanisms

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | command-metadata.json is updated for the new speckit-lifecycle-shared.yaml include in phase 7. | Not stated. | none | specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/007-shared-blocks-and-retired-mechanisms/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:7d6d5694-6f2f-49e3-badd-e5c0396985cc:toolu_01LwUYLLMeo64VYiri6H16eE:0 -->

Question:
```text
The new shared include (speckit-lifecycle-shared.yaml) is listed in the three routers' Owned Assets, but command-metadata.json, which lists the save tail as a load resource for plan, implement and complete, is not in the phase 7 spec and phase 8 marks it unchanged. Should I add the include to command-metadata.json in phase 7?
```

Options:
```text
Add it in phase 7 (Recommended)
Leave it out
Do it in phase 8
```

Answer:
```text
Add it in phase 7 (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
