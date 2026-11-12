---
title: "Decision Record: Test Cycle Speed"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-test-cycle-speed operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed"
    last_updated_at: "2026-11-12T15:16:41.798Z"
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
# Decision Record: Test Cycle Speed

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The research runs as two lineages of ten iterations each, one per executor. | Not stated. | None | 007-test-and-ci-bloat-research/spec.md REQ-001 |
| Q002 | The research loop runs all iterations autonomously at forced depth and does not stop early. | Not stated. | None | 007-test-and-ci-bloat-research/spec.md REQ-001 |
| Q003 | DeepSeek V4.1 Flash writes the plan for each of phases 008 to 017 and then builds it. | Not stated. | None | 008 to 017 plan.md and tasks.md |
| Q004 | Phase authoring dispatches run through cli-opencode on the OpenCode Go provider. | Not stated. | None | 008 to 017 plan.md |
| Q005 | The operator confirms the edit to the protected dispatch-enforcement-guard.yml and the push of the whole branch. | Not stated. | None | 015-hook-suite-job-split/spec.md, .github/workflows/dispatch-enforcement-guard.yml |
| Q006 | Pull request 97 is merged to main now, after the uncommitted phase 7 copy on main is removed. | Not stated. | None | spec.md phase map, pull request 97 |
| Q007 | Sharding the CLI vitest job is planned and built as phase 018 and pushed to pull request 97. | Not stated. | None | 018-cli-vitest-shards/spec.md |
| Q008 | The session records its decisions, diagnoses the sk-git test failure and marks the finished phases Complete. | Not stated. | None | spec.md phase map, .github/workflows/sk-git-script-tests.yml |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_0173JGhDF9GhAXNRidcVgzTK:1 -->

Question:
```text
How should the 20 iterations split across the two executors (cli-opencode with opencode-go/deepseek-v4.1-flash at max, and cli-pi with deepseek-v4.1-flash-1017 on LLM Gateway)?
```

Options:
```text
10 + 10 fan-out (Recommended)
20 + 20 fan-out
20 on opencode, pi as second lineage of 10
```

Answer:
```text
10 + 10 fan-out (Recommended)
```

### Q002
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_0173JGhDF9GhAXNRidcVgzTK:2 -->

Question:
```text
Should the loop run all iterations without stopping, and may it stop early when it stops finding anything new?
```

Options:
```text
Autonomous, forced depth (Recommended)
Autonomous, stop on convergence
Interactive
```

Answer:
```text
Autonomous, forced depth (Recommended)
```

### Q003
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01Hbo8Nzi1yPd1TyWGAbjTHw:0 -->

Question:
```text
How far should DeepSeek V4.1 Flash take the ten phases (008 to 017 under 006-test-cycle-speed) that cover the research findings?
```

Options:
```text
Plan only (Recommended)
Plan, then build
```

Answer:
```text
Plan, then build
```

### Q004
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01Hbo8Nzi1yPd1TyWGAbjTHw:2 -->

Question:
```text
Which executor should run DeepSeek V4.1 Flash for the phase authoring? The research used both.
```

Options:
```text
cli-opencode, OpenCode Go (Recommended)
cli-pi, LLM Gateway
Alternate both
```

Answer:
```text
cli-opencode, OpenCode Go (Recommended)
```

### Q005
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01HZUVFzfKor9kgcNTSwLULS:0 -->

Question:
```text
The branch edits a protected workflow, dispatch-enforcement-guard.yml, whose recorded role is: "It checks the dispatch rules that other workflows and tools assume." The edit removes its 19-line hooks-vitest job and runs the same command in a new workflow, hook-vitest-suites.yml. The dispatch-enforcement-guard job itself is untouched. protected-set.md rule 2 needs your named confirmation before this ships. Do you confirm the edit?
```

Options:
```text
Confirm, push all (Recommended)
Drop that edit, then push
Hold the push
```

Answer:
```text
Confirm, push all (Recommended)
```

### Q006
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_018JzbeHZfaeDxW4aNyxNdbj:1 -->

Question:
```text
PR 97 is green except sk-git script tests, which also fails on main. What should happen with the merge to main?
```

Options:
```text
Leave it open (Recommended)
Merge it now
```

Answer:
```text
Merge it now
```

### Q007
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_018JzbeHZfaeDxW4aNyxNdbj:2 -->

Question:
```text
The CLI vitest step (479 s) is now the whole wait after a push. Should I plan splitting that suite into shards as a next phase under 006-test-cycle-speed?
```

Options:
```text
Plan it as phase 018 (Recommended)
Plan and build it
Not now
```

Answer:
```text
Plan and build it
```

### Q008
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_018JzbeHZfaeDxW4aNyxNdbj:3 -->

Question:
```text
Which housekeeping items should I do now?
```

Options:
```text
Record decisions
Diagnose sk-git failure
Mark phases Complete
```

Answer:
```text
Record decisions, Diagnose sk-git failure, Mark phases Complete
```

<!-- /ANCHOR:operator-answers-verbatim -->
