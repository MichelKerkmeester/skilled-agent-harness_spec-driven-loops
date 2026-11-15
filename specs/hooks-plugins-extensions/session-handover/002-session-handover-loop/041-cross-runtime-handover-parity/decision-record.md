---
title: "Decision Record: Cross-runtime session handover parity for Pi, OpenCode and Codex"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "041-cross-runtime-handover-parity operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/041-cross-runtime-handover-parity"
    last_updated_at: "2026-11-14T22:26:03.243Z"
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
# Decision Record: Cross-runtime session handover parity for Pi, OpenCode and Codex

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Measure all four runtimes first, fix the gaps the measurement shows, then measure again. | Not stated. | None | REQ-005, tasks.md T002 and T014 |
| Q002 | Live sessions run on cheap models: Codex and Pi on Luna low through the GPT provider, OpenCode on DeepSeek V4.1 Flash, Claude Code on Sonnet. | Not stated. | None | scratch/harness/live-hop.sh |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01CRqAAY2ZoPro7U8eiHNSBa:2 -->

Question:
```text
How should I order the work? I read your request as: measure first, fix the gaps found, then measure again against Claude Code.
```

Options:
```text
Measure, fix, remeasure (Recommended)
Fix known gaps first
Measure only
```

Answer:
```text
Measure, fix, remeasure (Recommended)
```

### Q002
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01CRqAAY2ZoPro7U8eiHNSBa:3 -->

Question:
```text
Which models should the live test sessions use? Codex runs only through cli-codex on the GPT provider per your rule.
```

Options:
```text
Cheap defaults (Recommended)
Each runtime's default
I'll name them
```

Answer:
```text
Cheap defaults (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
