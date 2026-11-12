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
| Q009 | Pull request 97 lands on main through a rebase merge with the admin bypass. | Not stated. | None | spec.md phase map, pull request 97 |
| Q010 | The alignment run covers the full scope of 22 commits and nine fired surfaces. | Not stated. | None | alignment report 20261112T162453Z |
| Q011 | The three review lanes and the critic run on DeepSeek V4.1 Flash max through OpenCode Go. | Not stated. | None | alignment report 20261112T162453Z |
| Q012 | Every alignment finding the critic upholds is fixed, literal and judgment alike. | Not stated. | None | pull request 99 |
| Q013 | The merged worktree and branch 350-test-ci-wait-cuts are removed after the alignment run. | Not stated. | None | spec.md phase map |
| Q014 | The phase 017 decision on tracked research and scratch files is deferred. | Not stated. | None | 017-specs-artifact-tracking-decision/decision-record.md |
| Q015 | Pull request 99 lands on main through a rebase merge with the admin bypass. | Not stated. | None | pull request 99 |
| Q016 | The two findings that predate pull request 97 are fixed in pull request 99 as well. | Not stated. | None | pull request 99 |
| Q017 | The deep-loop fsync skip applies to local runs and to CI. | Not stated. | None | 019-local-test-speedups/spec.md, .skilled/skills/system-deep-loop/runtime/vitest.config.ts |
| Q018 | The spec-kit lanes run side by side only if a three-run trial passes every time. | Not stated. | None | 019-local-test-speedups/spec.md REQ-003 |
| Q019 | The phase 019 pull request is merged with the admin bypass once every check is green. | Not stated. | None | pull request 100 |
| Q020 | The local main checkout gets a fast-forward pull attempt and nothing more. | Not stated. | None | spec.md phase map |
| Q021 | The phase 017 decision stays deferred a second time. | Not stated. | None | 017-specs-artifact-tracking-decision/decision-record.md |
| Q022 | The temp folder leak, an install retry for the shard jobs and wider margins for the racy deadline tests are taken on as follow-up work. | Not stated. | None | 020-test-speed-followups/spec.md |
| Q023 | A pull request branch that conflicts with main only in the generated trigger-index files is rebased onto main and the index is regenerated, then force-pushed with a lease. | Not stated. | None | 020-test-speed-followups/implementation-summary.md |
| Q024 | Operator answers that no decision record holds yet are recorded through a docs pull request. | Not stated. | None | decision-record.md |
| Q025 | After phase 20 the checks on main are read, the speckit-test-db leak is traced and fixed, and the leftover test folders in the OS temp folder are deleted by known prefix. | Not stated. | None | 021-test-db-temp-leak/spec.md |
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

### Q009
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01UeUFeJdMhtnLwZdV5zkFTE:0 -->

Question:
```text
PR 97 is green (48 pass, 0 fail) but main's ruleset blocks the merge: it requires 1 approving review, signed commits and linear history. The PR was opened from your account, so it cannot approve itself. How should PR 97 land?
```

Options:
```text
You approve and merge (Recommended)
I merge with admin bypass
Leave it open
```

Answer:
```text
I merge with admin bypass
```

### Q010
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01TEo1RLnPGiLyWQsoo1R4Zz:0 -->

Question:
```text
Alignment scope checkpoint: 22 commits, 262 files, 9 surfaces fire (S1 to S6, S13, S14, S15), 73 battery rows planned. Run the battery on this scope?
```

Options:
```text
Approve (Recommended)
Narrow to CI and specs
Cancel
```

Answer:
```text
Approve (Recommended)
```

### Q011
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01AACDrfGSE1VNsQ9W9YpV3m:0 -->

Question:
```text
Lane checkpoint: the battery passed 64 rows with 0 failures. Three review lanes (A Code, B Skill docs, C READMEs and changelogs) plus one critic would run on DeepSeek V4.1 Flash max through OpenCode Go, up to 30 minutes each, in parallel. These are paid model calls. Run them?
```

Options:
```text
Approve (Recommended)
Approve on Luna
Battery-only
Cancel
```

Answer:
```text
Approve (Recommended)
```

### Q012
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_013tNNnVBx3kDawsu5DRAXPX:0 -->

Question:
```text
The alignment run found about 11 distinct issues in the merged work (1 P1: the gate-critical job lacks the ONNXRUNTIME_NODE_INSTALL_CUDA skip switch; the rest P2 stale citations and comments). Once the critic confirms them, what should I do with them?
```

Options:
```text
Fix all upheld findings (Recommended)
Fix literal ones only
Report only
```

Answer:
```text
Fix all upheld findings (Recommended)
```

### Q013
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_013tNNnVBx3kDawsu5DRAXPX:2 -->

Question:
```text
The old worktree and branch worktrees/350-test-ci-wait-cuts are fully merged. Remove them?
```

Options:
```text
Remove after the alignment run (Recommended)
Keep them
```

Answer:
```text
Remove after the alignment run (Recommended)
```

### Q014
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_013tNNnVBx3kDawsu5DRAXPX:3 -->

Question:
```text
Phase 017 measured 88,151 tracked research, review, scratch and archive files (1.67 GB), which cost 22 to 63 s of checkout per CI job. Its decision record holds three options. Which do you choose?
```

Options:
```text
Decide later
Stop tracking new loop state
Move the archives out
Keep everything tracked
```

Answer:
```text
Decide later
```

### Q015
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01DVCXFY4QGDUTTrG7whD1rk:0 -->

Question:
```text
Follow-up PR 99 is green (39 checks pass, 0 fail). It closes all 13 in-scope alignment findings. Main's ruleset still needs an approving review, which your account cannot give its own PR. How should PR 99 land?
```

Options:
```text
I merge with admin bypass (Recommended)
You merge it
Leave it open
```

Answer:
```text
I merge with admin bypass (Recommended)
```

### Q016
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01DVCXFY4QGDUTTrG7whD1rk:1 -->

Question:
```text
Two findings predate PR 97 and are not fixed in PR 99: stale permission line citations in job-shape-rules.md, and runtime/tests/README.md naming cli/run-tests.mjs where the runner is scripts/run-tests.mjs. Fix them too?
```

Options:
```text
Add them to PR 99 (Recommended)
Leave them
```

Answer:
```text
Add them to PR 99 (Recommended)
```

### Q017
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01Thitm8gn8EjMsbrt8bTtxu:1 -->

Question:
```text
The deep-loop fsync stub cut the suite from 497 s to 212 s locally with every test passing. Where should it apply?
```

Options:
```text
Local and CI (Recommended)
Local only
Opt-in switch
```

Answer:
```text
Local and CI (Recommended)
```

### Q018
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01Thitm8gn8EjMsbrt8bTtxu:2 -->

Question:
```text
After the two fixes, should spec-kit's npm test also run its three lanes side by side instead of one after another? That is an estimate of 455 s down to 220 to 260 s, unmeasured.
```

Options:
```text
Trial it, keep if it holds (Recommended)
Skip it
```

Answer:
```text
Trial it, keep if it holds (Recommended)
```

### Q019
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01Thitm8gn8EjMsbrt8bTtxu:3 -->

Question:
```text
PR 99 and 97 needed the admin bypass to merge. How should this phase's pull request land once its checks are green?
```

Options:
```text
Ask me when it is green (Recommended)
Merge with admin bypass when green
```

Answer:
```text
Merge with admin bypass when green
```

### Q020
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01A4Q7HQtmYHA2jcRF8T3pAC:0 -->

Question:
```text
The local main checkout is behind origin/main and holds uncommitted files from other sessions (advisor, hooks and .pi docs). What should I do with it?
```

Options:
```text
Leave it (Recommended)
Try a fast-forward pull
```

Answer:
```text
Try a fast-forward pull
```

### Q021
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01A4Q7HQtmYHA2jcRF8T3pAC:2 -->

Question:
```text
Phase 017 is still Proposed: 88,151 tracked research, review, scratch and archive files (1.67 GB) cost 22 to 63 s of checkout per CI job that cannot use a sparse checkout. Decide now?
```

Options:
```text
Keep deferring
Stop tracking new loop state
Move the archives out
Keep everything tracked
```

Answer:
```text
Keep deferring
```

### Q022
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01A4Q7HQtmYHA2jcRF8T3pAC:3 -->

Question:
```text
Which follow-ups from this work should I take on next?
```

Options:
```text
Temp folder leak
Install retry for shards
Widen the racy deadlines
Nothing more
```

Answer:
```text
Temp folder leak, Install retry for shards, Widen the racy deadlines
```

### Q023
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_01HDydHW679VotvX6PMDziux:0 -->

Question:
```text
Pull request 101 now conflicts with main. Another session merged four commits, and the only conflicting files are the four generated trigger-index files (trigger-index.json and three fixtures). How should I resolve it?
```

Options:
```text
Rebase and regenerate (Recommended)
Merge main into the branch
Stop here
```

Answer:
```text
Rebase and regenerate (Recommended)
```

### Q024
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_013uA1HWNDdHfpZKZJtAse5f:0 -->

Question:
```text
The save hook still reports 23 answers as unrecorded in the main checkout. 22 of them are already in the decision record on main, and the two about finishing pull request 101 (push then bypass merge, rebase and regenerate) are recorded nowhere. What should I do with the decision queue?
```

Options:
```text
Record via a docs PR (Recommended)
Leave the queue as it is
```

Answer:
```text
Record via a docs PR (Recommended)
```

### Q025
<!-- source: claude:af05cd33-c1ff-46c9-825e-70281e3ca6f1:toolu_013uA1HWNDdHfpZKZJtAse5f:1 -->

Question:
```text
Several follow-ups from the test speed work are still open. Which ones should I take on next?
```

Options:
```text
Read main's checks
Trace speckit-test-db leak
Clean the temp folder
Nothing more
```

Answer:
```text
Read main's checks, Trace speckit-test-db leak, Clean the temp folder
```

<!-- /ANCHOR:operator-answers-verbatim -->
