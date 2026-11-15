---
title: "Decision Record: Phase 3: dsh-mistral-route"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "003-dsh-mistral-route operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/003-dsh-mistral-route"
    last_updated_at: "2026-11-15T09:58:58.894Z"
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
# Decision Record: Phase 3: dsh-mistral-route

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Retire the dsh Mistral route instead of shipping it with reasoning off, because Mistral work goes through the Vibe CLI. | On dsh 0.2.2-rc.3 the route completed only with reasoning off, and Vibe already reaches Mistral's models. | None | 003 T011, cli-deepseek-harness changelog v1.0.2.0 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_015zDcxdqWpyGM6VHbXVmcKN:0 -->

Question:
```text
Child 003's Mistral route for DeepSeek Harness (dsh) can't meet its spec on the pinned dsh 0.2.2-rc.3. With any reasoning level (high or max), Mistral streams the reply as a list of 'thinking' chunks, and dsh's reader fails. With reasoning off, a run completes. What should 003 ship?
```

Options:
```text
Ship with reasoning off (Recommended)
Roll the route back
Hold 003 blocked
```

Answer:
```text
why use dsh, use vibe cli
```

<!-- /ANCHOR:operator-answers-verbatim -->
