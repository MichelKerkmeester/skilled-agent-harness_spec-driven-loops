---
title: "Decision Record: Research whether spec-kit planning should adopt fresh-context cold-read and decision-free readiness checks from the Elephant-Goldfish Model"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-goldfish-cold-read-plan-review operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/001-research-egm-checks-and-chat-path-gaps"
    last_updated_at: "2026-11-11T20:22:46.110Z"
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
# Decision Record: Research whether spec-kit planning should adopt fresh-context cold-read and decision-free readiness checks from the Elephant-Goldfish Model

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Both proper research runs stay in packet 005 and use the deep-research workflow's restart branch, which archives the previous research folder. | Not stated. | None | specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/research_archive/ |
| Q002 | All fifteen iterations run on DeepSeek V4.1 Flash at max effort through cli-pi, one fresh process per iteration. | Not stated. | None | specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/research/deep-research-config.json |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:5f76d81f-fb45-4644-a826-8139f511907e:toolu_01EEK7YbbSdxiUZAnKVxdms7:0 -->

Question:
```text
The two proper runs each need a clean research folder: the rerun of the chat-path question (10 iterations) and the new one on keeping a chat-started deep loop on its workflow (5 iterations). Packet 005's research folder already holds the earlier runs, so the workflow would classify it as invalid. Where should the two runs live?
```

Options:
```text
Two new packets (Recommended)
Stay in packet 005
One new packet for both
```

Answer:
```text
Stay in packet 005
```

### Q002
<!-- source: claude:5f76d81f-fb45-4644-a826-8139f511907e:toolu_01EEK7YbbSdxiUZAnKVxdms7:1 -->

Question:
```text
The proper path starts a fresh agent for every iteration, so 15 iterations will take much longer than before. Which executor should run them?
```

Options:
```text
DeepSeek Flash max (Recommended)
Luna max fast
Split the two
```

Answer:
```text
DeepSeek Flash max (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
