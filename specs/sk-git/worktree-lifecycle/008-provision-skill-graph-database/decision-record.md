---
title: "Decision Record: Build the advisor skill-graph database when provisioning a worktree"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-provision-skill-graph-database operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/worktree-lifecycle/008-provision-skill-graph-database"
    last_updated_at: "2026-11-24T14:46:08.330Z"
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
# Decision Record: Build the advisor skill-graph database when provisioning a worktree

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Make worktree provisioning build the advisor skill-graph database, in sk-git. | Not stated. | None | spec.md REQ-001, worktree-naming.sh |
| Q002 | Merge origin/main into the primary checkout's local main again, without pushing. | Not stated. | None | Primary checkout merge bd2755b1d23 |
| Q003 | Build 008 and the 004 note with one-change briefs on cli-pi DeepSeek Flash max. | Not stated. | None | plan.md, tasks.md T004-T006 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01QmMCcJmAmHEw3BWkcTuNVK:1 -->

Question:
```text
A fresh worktree has no skill-graph database, so 24 advisor tests fail until skill_graph_scan --trusted runs. Should worktree provisioning build it?
```

Options:
```text
Fix in sk-git (Recommended)
Record only
```

Answer:
```text
Fix in sk-git (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01QmMCcJmAmHEw3BWkcTuNVK:2 -->

Question:
```text
Your primary checkout's local main holds 3 unpushed commits from another session and is 2 commits behind origin/main (the 030 work). What should happen to it?
```

Options:
```text
Leave to its session (Recommended)
Merge origin/main again
```

Answer:
```text
Merge origin/main again
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_016qSJ7hSgEDXsuGzoXABqmk:3 -->

Question:
```text
Which executor should build them?
```

Options:
```text
DeepSeek Flash, cli-pi (Recommended)
Luna xhigh, cli-codex
```

Answer:
```text
DeepSeek Flash, cli-pi (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
