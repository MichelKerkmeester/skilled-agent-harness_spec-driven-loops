---
title: "Decision Record: Phase Parent: pi-context-decisions Research for Skill Advisor Refinement"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "016-pi-context-decisions-based-research-refinement operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement"
    last_updated_at: "2026-11-19T17:37:16.037Z"
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
# Decision Record: Phase Parent: pi-context-decisions Research for Skill Advisor Refinement

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Once the fixes pass, the worktree 474 branch is merged to main and pushed. | Not stated. | none | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md |
| Q002 | A fix phase is opened for the 9 P2 findings of the packet 016 deep review. | Not stated. | none | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md |
| Q003 | Run the five DeepSeek passes and the three native Opus passes as two generations in this packet, since the contract refuses a native fan-out lineage and --extend keeps the executor. | Not stated. | None | review/review-report.md, review-archive/2026-11-23T21-41-09Z/ |
| Q004 | Use deepseek-v4-1-flash-max for the Devin passes. | Not stated. | None | review-archive/2026-11-23T21-41-09Z/deep-review-config.json |
| Q005 | Review the advisor's runtime and hooks code, 154 source files, with prose docs out of scope unless code contradicts them. | Not stated. | None | review/deep-review-config.json reviewScopeFiles |
| Q006 | Commit both generations' review packets, merge origin/main, push main and remove the worktree. | Not stated. | None | review/ |
| Q007 | Switch the DeepSeek passes to cli-pi with deepseek-v4.1-flash-1017 after Devin's daily quota ran out, and resume the same generation. | Not stated. | None | review-archive/2026-11-23T21-41-09Z/deep-review-state.jsonl run_resumed event |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:3ae11fee-4e8c-4cf8-a15c-d21988173a1a:toolu_017aTdigybFdzdksGZKUxYEv:2 -->

Question:
```text
When the fixes pass, how far should they go? The 5 existing commits and the new ones sit on the worktree 474 branch.
```

Options:
```text
Merge to main and push
Merge to main, no push
Branch only
```

Answer:
```text
Merge to main and push
```

### Q002
<!-- source: claude:d74fee32-56c7-4300-9972-512f3d204ae9:toolu_014DbBGudzxDb1xSaXM1LuKw:1 -->

Question:
```text
Open a fix phase for the 9 P2 findings from the packet 016 deep review? None is P0 or P1, so this is optional. If yes, the first fix is making the task-marker regex linear (R2-P2-001), then moving the strip ahead of the 64 KiB cut (R1-P2-001).
```

Options:
```text
Open a fix phase (Recommended)
Not now
```

Answer:
```text
Open a fix phase (Recommended)
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01AGDTxJJx1JRHL4AJ4RyqLN:1 -->

Question:
```text
The deep-review contract refuses a native lineage inside a fan-out (deep-review-presentation.txt line 53: 'cli-* kinds only, since a native lineage is refused in fan-out'). So 5 Devin passes plus 3 native Opus passes can't run as one parallel matrix. How should I run them?
```

Options:
```text
Devin 5, then native 3 (Recommended)
Fan-out, Opus via Claude CLI
Two separate reviews
```

Answer:
```text
Devin 5, then native 3 (Recommended)
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01AGDTxJJx1JRHL4AJ4RyqLN:2 -->

Question:
```text
Devin's allowlist has two DeepSeek flash-max models. Which one?
```

Options:
```text
deepseek-v4-1-flash-max (Recommended)
deepseek-v4-flash-max
```

Answer:
```text
deepseek-v4-1-flash-max (Recommended)
```

### Q005
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01AGDTxJJx1JRHL4AJ4RyqLN:3 -->

Question:
```text
What counts as 'system skill advisor logic' for the review target?
```

Options:
```text
Runtime + hooks code (Recommended)
Routing and scoring only
Whole skill incl. docs
```

Answer:
```text
Runtime + hooks code (Recommended)
```

### Q006
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01TiPzteERrXCQuzxaDkZ3Cf:1 -->

Question:
```text
When both generations finish, what should happen to the review packets?
```

Options:
```text
Commit, merge, push (Recommended)
Commit only
Leave uncommitted
```

Answer:
```text
Commit, merge, push (Recommended)
```

### Q007
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_018E4GtEBbb2Dm9CMJvMzTQQ:0 -->

Question:
```text
Devin refused iteration 1: "Your daily usage quota has been exhausted" (resource_exhausted). The run is halted, the lock released, and no pass was spent. The workflow says to switch executor or wait, then resume the same run. How should the 5 DeepSeek passes run?
```

Options:
```text
cli-pi, DeepSeek v4.1 flash (Recommended)
cli-opencode, opencode-go route
Native 3 now, Devin later
Wait for Devin
```

Answer:
```text
cli-pi, DeepSeek v4.1 flash (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
