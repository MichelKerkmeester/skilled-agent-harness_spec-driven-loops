---
title: "Decision Record: Expansive-depth sub-mode for deep-research and deep-review"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-expansive-depth-mode operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode"
    last_updated_at: "2026-11-17T16:56:11.456Z"
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
# Decision Record: Expansive-depth sub-mode for deep-research and deep-review

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Put all 13 build-slice phases as children of 007-expansive-depth-mode, overriding the earlier choice of a 004-workflow-logic-hardening child for Slice A. | Not stated. | None | spec.md Phase Documentation Map, 001-013 children |
| Q002 | 001 must merge first; wave 1 builds 001, 003, 005, 007 and 009 in parallel, the rest rebase after. | Not stated. | None | D1, scratch/orchestration-strategy.md |
| Q003 | Allow up to 8 concurrent DeepSeek V4.1 flash max dispatches across cli-pi llmgateway, cli-vibe and cli-opencode Go. | Not stated. | None | scratch/orchestration-strategy.md |
| Q004 | Each phase writes its own manual testing playbook scenarios through /create:manual-testing-playbook; 014 only verifies and aligns. | Not stated. | None | each phase tasks.md, 014-docs-playbooks-alignment/spec.md |
| Q005 | Goal D2 is flag-scoped: the expansive flag adds nothing to a run, and default runs change only through named, tested defect fixes. | Not stated. | None | goal.md D2 |
| Q006 | Create the five wave-1 worktrees through the sk-git allocator and start dispatching at once. | Not stated. | None | goal.md log (operator decisions row), worktrees 456-46x |
| Q007 | Standing yes for local commits on the phase and integration branches and for merges into integration; pushes and any merge into main still need a separate yes. | Not stated. | None | goal.md log (operator decisions row), integration branch worktrees/455-expansive-depth-integration |
| Q008 | Close AC-010 by amending REQ-010 so its grep drops the generated .vibe/agents mirrors. | Not stated. | None | 001-completed-run-extension REQ-010, AC-010, decision-record.md OD-005 |
| Q009 | Add a handed-off status to the operator-local alignment aggregator and rerun both alignment lanes for phase 014. | Not stated. | None | 014 goal.md criterion 5, local-skilled-alignment/aggregate-findings.cjs (operator-local) |
| Q010 | Hold the integration-to-main merge; close the criteria on the integration branch only and leave the merge to the operator. | Not stated. | None | Parent goal.md, integration branch worktrees/455-expansive-depth-integration |
| Q011 | Third alignment allowance: fix findings in text and code this program wrote, hand off only pre-base text, raise the critic limit to 40 minutes. | Not stated. | None | 014 goal.md section 4, rows Handed to follow-up and Reclassified |
| Q012 | Retry the blocked final pair on hy4 flash free; superseded in chat the same minute by Vibe with deepseek-flash at max. | Not stated. The operator then wrote: use cli vibe with deepseek flash max. | None | 014 goal.md section 4, Pair 1 (Vibe) row |
| Q013 | Fix the 28 open P2 findings, then amend 014 criterion 5 to no open P0 or P1 with every P2 fixed or handed off. | Not stated. | 014 criterion 5 zero-open wording | 014 goal.md criterion 5, tasks.md T010 |
| Q014 | Approve the skill-advisor rebuild for the expansive-depth routing vocabulary. | Not stated. | None | commits 30ac5b51f95, 5c5f183decf, b4ce14dcbeb |
| Q015 | The expansive review budget counts the four canonical dimensions plus custom ones. | Not stated. | None | 011 decision Q011, task T037, commit 954345ac43f |
| Q016 | Keep the no-open-P0/P1 rule and run another native Opus pair rather than amend again. | Not stated. | None | 014 goal.md section 4, Native pairs row |
| Q017 | Doc run 11 stands as the last doc run; rerun only the skilled alignment, over the full diff. | Not stated. | None | 014 goal.md section 4, Skilled runs 13-16 and Skilled run-17 (last) rows |
| Q018 | Decouple the frontier node cap from max_iterations and rerun the expansive pilots, rather than amend the criteria. | Not stated. | None | 010 AC-014, 011 AC-011, deep-research.yaml node cap |
| Q019 | Ratify ADR-006 (010) and ADR-005 (011): the default-run golden tests strip the expansive-only persona paragraph. | Not stated. | None | 010 ADR-006, 011 ADR-005 |
| Q020 | Decouple the node cap and amend AC-014, since four frozen default-run blockers make a non-cap research stop unreachable. | Not stated. | None | 010 AC-014 |
| Q021 | Add a partition-drained stop so a fan-out review lineage stops once its own frontier node is answered. | Not stated. | None | 011 AC-011, frontier_drained stop candidate |
| Q022 | Fix the lineage coverage graph first, then gate the drained-partition stop through the review quality gates. | Not stated. | None | 011, review lineage coverage graph |
| Q023 | Add EVIDENCE_FOR links to the standard graph upsert before closing AC-011. | Not stated. | None | 011 AC-011, upsert.cjs evidence links |
| Q024 | Keep frontier_drained a hard stop candidate that skips the score gate but faces every quality gate. | Not stated. | None | 011, convergence.cjs frontier_drained |
| Q025 | Amend AC-011 to what the pilot rerun can show and log the defects it found. | Not stated. | None | 011 AC-011 |
| Q026 | Send the depth-cap question to a fresh Opus xhigh design review that keeps the program's goal and intent. | Not stated. | None | expansive budget design, parent goal.md |
| Q027 | Size the defaulted expansive budget from the seed, option (c) with a ceiling, keeping the cap at half the budget. | Not stated. | None | frontier-admit.cjs expansiveBudget |
| Q028 | Send the no-seed-share edge to a fresh Opus high review given the original intent, goal and purpose. | Not stated. | None | frontier-admit.cjs seedBudget |
| Q029 | A lineage with no seed share, or a run whose seeds were all pruned, gets its loop default budget. | Not stated. | None | frontier-admit.cjs seedBudget, fanout-run.cjs expansiveLineageBudgets |
| Q030 | Fix both P1s and the P2s of the 10-iteration review, then rerun the gate. | Not stated. | None | review fix round, review/review-report.md |
| Q031 | Add four low-token live playbook scenarios through /create:manual-testing-playbook. | Not stated. | None | DR-077, DR-078, DRV-084, DRV-085 |
| Q032 | Fix the setup-time and iteration-time gaps before running the four live scenarios. | Not stated. | None | DR-077, DR-078, DRV-084, DRV-085 |
| Q033 | Fix the review traceability requirement and the research closeout sourceFindings read, then rerun DRV-084 and DR-078. | Not stated. | None | convergence.cjs traceability gate, synthesis-closeout.cjs |
| Q034 | Fix R1, R2, the quoted fan-out config and the R3 frontier-logic refactor. | Not stated. | None | reduce-state.cjs, frontier-admit.cjs |
| Q035 | Fix every P1, the mode problems and all P2s from the expansive dogfood review. | Not stated. | None | commits a424fb6cd8a..d4420e9510d |
| Q036 | Choose the pivot admission design for the best UX and logic; the result amended the review pivot requirement. | Not stated. | None | commit b4e482bcb91, 011 REQ-007 |
| Q037 | Build every 'do' row of the generation 3 improvement backlog. | Not stated. | None | commits adade6c293e..2191e6d1e62, research/improvement-backlog.md |
| Q038 | Wait for main to settle, then merge integration into main once. | Not stated. | None | merge commit 545bfa1fe94 |
| Q039 | Update the two pi-default tests to main's provider-free Pi settings. | Not stated. | None | commit 9ff4d22c00a, executor-config.vitest.ts |
| Q040 | Switch the active gh account to the one with push rights instead of using a one-off token. | Not stated. | None | gh auth active account |
| Q041 | Keep the integration branch and worktree after the merge. | Not stated. | None | worktrees/455-expansive-depth-integration |
| Q042 | Fix both small defects: guard the cost reader and cover workflow-steps.cjs in the review contract digest. | Not stated. | None | commits 958eb9ca1df, 07cf5f92b61 |
| Q043 | Build the generation 4 backlog's top ten plus rows 11-15. | Not stated. | None | research/improvement-backlog.md rows 1-15, round 5 commits |
| Q044 | Land round 5 by rebasing onto main, regating and pushing; replaced by a merge when the rebase conflicted. | Not stated. | None | round 5 landing |
| Q045 | Remove the merged side worktree 483-r5-fanout-stop-lineage and its branch. | Not stated. | None | worktree 483-r5-fanout-stop-lineage |
| Q046 | Fix the opencode unset sandbox default and the other three gaps the round found. | Not stated. | None | commits 040a5371fb3, 1e2add8bab3, 55e8a7c217f, 2e295fea62a |
| Q047 | Merge main into the branch instead of rebasing, after the rebase hit a replay conflict. | Not stated. | None | merge commit c46d5b43dbb |
| Q048 | Land the gap fixes by merging main, regating and pushing. | Not stated. | None | merge ae17b03309b, push to 8170db46079 |
| Q049 | Skip the blocked-stop record on a dry run. | Not stated. | None | commits 47ba2a08a85, 555487146e2 |
| Q050 | Mint review row identity like research and refuse a reused key with different content, in the same landing. | Not stated. | None | commit 8170db46079, append-mode-event.cjs |
| Q051 | Leave the parent goal.md binding row for 015-reducer-test-focus-contract to the session that owns that phase. | Not stated. | None | parent goal.md, 015-reducer-test-focus-contract |
| Q052 | Resolve the merge conflict to main's side, dropping the OpenCode 1 trigger phrase. | Not stated. | None | merge ae17b03309b, opencode-version-dispatch.md |
| Q053 | Fix both live-review P1s and every defect the live review found. | Not stated. | None | round 7 commits aca3e6858b3..c3c91457f9f, scratch/dogfood-review-gen3.md |
| Q054 | Push the dry-run fix, the live review record and the decisions now, and land the new fixes in a later push. | Not stated. | None | push eae0c02ceaf..5a3de84e15b |
| Q055 | Land round 7, then make --stop stop the surviving members of a group whose leader exited. | Not stated. | None | merge d980ac7da74, commit 4fc94bae0d3 |
| Q056 | Fix the --stop double close before landing, so a stopped lineage ends with one terminal row. | Not stated. | None | commit 6ff8135076c, merge 2e913d56935 |
| Q057 | Build the runtime defects, doc drift and packet bookkeeping, plus routing single-executor runs through the fan-out command builder. | Not stated. | None | round 8 commits 6ec426de2db..79fd6666d33, commit 0a9de51c040 |
| Q058 | Write the goal for 015-reducer-test-focus-contract and its parent binding row in this session. | Not stated. | Q051 | commit 534ba42b6db, 015-reducer-test-focus-contract/goal.md, parent goal.md |
| Q059 | Build no OS sandbox around opencode and keep the honest compensating sandbox label. | Not stated. | None | commits 4db1d9aaa43, 9af2f0efc7a, sandboxEnforcement compensating |
| Q060 | Redact the noreply author address in this packet's 15 files only. | Not stated. | None | commit 3710b3afb22 |
| Q061 | Fix the 10 MB stdout cap on single-executor Claude before the live run. | Not stated. | None | commits 1b7fe3e1a26, 90fd5bd1bb4 |
| Q062 | The save docs win: drop the phase parent's implementation-summary.md. | Not stated. | None | commit 9e71013e64f, spec.md |
| Q063 | Also fix the sandbox labels, the resumed run stop reason and the 011 synthesis list of exhausted and blocked nodes. | Not stated. | None | commits 9af2f0efc7a, 336f7b05df7, 40dbd7b5610 |
| Q064 | Fix the backtracking email regex and bound the live stdout buffer before the live runs. | Not stated. | None | commit 56777af3240 |
| Q065 | Keep the parent's decision record and move its plan.md and tasks.md content out of the parent. | Not stated. | None | commit 3ca0b161dc0, goal.md log, decision-record.md |
| Q066 | Redact the real email addresses in the deep-loop logs committed before masking existed, beyond this packet. | Not stated. | Q060 | commit 88645b0150e (26 logs) |
| Q067 | Run the section D live runs now, Claude iteration included. | Not stated. | None | commit e06143a14ce, scratch/dogfood-round8.md |
| Q068 | Fix both live-run stop bugs and the pre-dispatch containment gap for an artifact dir outside the worktree. | Not stated. | None | commits 61112481bc3, a20a1d96a05, 978b74e8df7 |
| Q069 | Add an opt-in switch to the Claude-under-Claude recursion guard, read from the typo "nypass" and the follow-up. | Not stated. | None | commit 3c8df597438 (SPECKIT_ALLOW_HOST_SESSION_EXECUTOR), scratch/dogfood-round8.md Round 11 replay |
| Q070 | Take all four round 11 leftovers in a last fix round: the audit row's model, Claude id masking, usage errors and signals plus doc drift. | Not stated. | None | round 12 commits 4e5216729f9, 8fc35a98984, 09076dd4e0f, 0d1725f86e5 |
| Q071 | The literal answer to the Claude check, a typo for bypass, which the follow-up question clarified into an opt-in switch rather than a detached end-run around the guard. | Not stated. The follow-up answer is Q069. | None | Q069, commit 3c8df597438 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01QNtigJUS3fQfEwq1b7Wmjd:0 -->

Question:
```text
Where should the phase packets for all 13 build slices (A-M from research.md §20) go? Fresh Opus 5.5 medium agents will write the spec docs, one agent per phase, with no code changes. Earlier you put Slice A, the completed-run extension, under 004-workflow-logic-hardening. I recommend one new phase parent holding all 13, so the build order and dependencies live in one place. Slices F, H and L get a decision task first because they wait on your choices.
```

Options:
```text
New parent, all 13 (Recommended)
Split: A in 004, rest new
Children of 007
```

Answer:
```text
Children of 007
```

### Q002
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01BBCfDeSVVnJctNmF39aK2G:0 -->

Question:
```text
Build order: does "001 first" mean 001 must MERGE before others, letting wave 1 build 001 alongside 003, 005, 007 and 009 (which share no files with 001), or must 001 finish before anything else starts?
```

Options:
```text
001 merges first (Recommended)
001 merges first + 004/006 early
001 strictly alone
```

Answer:
```text
001 merges first (Recommended)
```

### Q003
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01BBCfDeSVVnJctNmF39aK2G:2 -->

Question:
```text
How many external DeepSeek V4.1 flash max dispatches may run at once?
```

Options:
```text
5 (Pi 2, Go 2, Vibe 1) (Recommended)
3
8
```

Answer:
```text
opencode go hangs? Dude you also have llm gateway provider and cli vibe mistral provider for deepseek flash max do 8 if possible
```

### Q004
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01BBCfDeSVVnJctNmF39aK2G:3 -->

Question:
```text
Who writes the deep-loop manual testing playbooks? 001's plan hand-edits both loop playbooks for --extend; 014 says playbooks are written only through /create:manual-testing-playbook.
```

Options:
```text
014 owns all playbooks (Recommended)
Each phase writes its own
```

Answer:
```text
Each phase writes its own
```

### Q005
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01GXZervRj4ta5M1vXJ4deg8:0 -->

Question:
```text
Parent goal D2 says that without --depth-mode=expansive, output stays byte-identical to the old baseline. But phases 002-008 and 012-013 fix defects on purpose, which changes default runs. How should D2 read?
```

Options:
```text
Flag-scoped (Recommended)
Keep strict
```

Answer:
```text
Flag-scoped (Recommended)
```

### Q006
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01C9pEU6CFff6Z3yWBgiFH7E:2 -->

Question:
```text
May I create the five wave-1 worktrees now through the sk-git allocator under ~/worktrees/public, one each for phases 001, 003, 005, 007 and 009, and start dispatching? The lanes are Pi for 001 and 007, OpenCode Go for 005 and 009, and Vibe for 003. All three lanes passed the probes.
```

Options:
```text
Yes, create and start (Recommended)
Create worktrees, wait
```

Answer:
```text
Yes, create and start (Recommended)
```

### Q007
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_011ov8krrVYGVdHBWMSir2xK:0 -->

Question:
```text
Each phase needs to commit in its own worktree branch (worktrees/456-ed-001-..., etc.) and then merge, in build order, into the integration branch worktrees/455-expansive-depth-integration. There the compiled contracts are regenerated and the full suite runs. Do you give a standing yes for local commits on the phase branches and the integration branch, and for merges into the integration branch? It would not cover pushes or any merge into main, which still need your yes each time. To undo: `git reset --hard <pre-merge sha>` on the integration branch, or `git branch -D` on a phase branch.
```

Options:
```text
Standing yes, local only (Recommended)
Ask me per phase
```

Answer:
```text
Standing yes, local only (Recommended)
```

### Q008
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_016x3CugdvkP84aGgAahkAKv:0 -->

Question:
```text
Phase 001's acceptance row AC-010 (REQ-010) checks that no doc line containing `completed-continue` also says 'deferred', 'reserved' or similar. Every real doc passes. It still fails on `.vibe/agents/deep-research.toml` and `deep-review.toml`, because the Vibe generator writes each whole agent body as one TOML line. That line contains `completed-continue` alongside unrelated wording such as 'deferred tangents' and 'no fourth tier is reserved'. Those mirrors are generated from the `.skilled/agents` sources, which pass, and `sync-agents-vibe.cjs --check` confirms they are in sync. 001's spec scope is frozen, so this needs your yes. How should AC-010 close?
```

Options:
```text
Amend REQ-010, drop .vibe (Recommended)
Reword the agent sources
```

Answer:
```text
Amend REQ-010, drop .vibe (Recommended)
```

### Q009
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_0124XY7BsyfxrDhCww4fnWY1:2 -->

Question:
```text
Phase 014 alignment criterion (zero open findings): the alignment aggregator counts handed-off and rebutted findings as open because it has no such status. It lives in your untracked operator-local tooling under .skilled/commands/assets/local-*-alignment. How should I close it?
```

Options:
```text
Accept counted findings (Recommended)
Add handed-off status
```

Answer:
```text
Add handed-off status
```

### Q010
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_0124XY7BsyfxrDhCww4fnWY1:3 -->

Question:
```text
Integration branch worktrees/455-expansive-depth-integration (tip 9f174a8c8df, 3383 passed / 0 failed) and the uncommitted parent packet files on main: what about main?
```

Options:
```text
Hold the merge
Merge locally, no push
```

Answer:
```text
Hold the merge
```

### Q011
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01X7f4VihKhhLNRuczczoVav:0 -->

Question:
```text
Phase 014's last criterion (zero open alignment findings) is still unmet after the second allowance. The final doc run has 18 open, the skilled run 12. Each fresh run finds new issues, mostly in older text, and every critic hit the 20-minute limit and was killed. How should I close it?
```

Options:
```text
Fix ours, hand off rest (Recommended)
Amend the criterion
Leave it open, report
```

Answer:
```text
Fix ours, hand off rest (Recommended)
```

### Q012
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_015QQPiVivmTmfys2BesBWsP:0 -->

Question:
```text
The final alignment pair (doc run 7, skilled run 9) is blocked: the deepseek gateway (llmgateway via pi) hit its daily usage cap and resets at 18:18 UTC, about 7h45m from now. All fixes and hand-offs are committed and the suite is 3470 passed, 0 failed. Which lane preset should the retry use?
```

Options:
```text
opencode-go now (Recommended)
Wait for 18:18 UTC
codex now
```

Answer:
```text
hy4 free
```

### Q013
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_017uVrSb2fFwyS7pmeJy8Ps2:0 -->

Question:
```text
Phase 014 criterion 5 (last alignment pair shows zero open findings) is still unmet after the last allowed pair. Doc run 8 has 12 open and skilled run 10 has 16, all 28 P2 (minor). The only P1s are three pre-existing ones, already handed off. Every lane and critic completed. Each fresh pair finds about 15 new minor items, so zero open has not converged in three allowances. How should criterion 5 close?
```

Options:
```text
Fix 28, then amend (Recommended)
One more full round
Amend now, hand off P2s
Leave unmet, report
```

Answer:
```text
Fix 28, then amend (Recommended)
```

### Q014
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Y5J3PhGKhCzCs7bPpZD8Q8:0 -->

Question:
```text
The last 4 open P1s in phase 014 are all one gap: `--depth-mode=expansive` added no routing vocabulary, so prompts like "seed a depth-capped frontier" route to cli-external-orchestration or sk-code. Fixing it means adding terms to the deep-loop `hub-router.json` and `graph-metadata.json` intent signals, then running `/doctor:skill-advisor rebuild`, which writes the advisor's compiled store and needs your yes before its first write. Approve?
```

Options:
```text
Approve rebuild (Recommended)
Edit, no rebuild
Hand off routing
```

Answer:
```text
Approve rebuild (Recommended)
```

### Q015
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Y5J3PhGKhCzCs7bPpZD8Q8:1 -->

Question:
```text
E-5: in expansive review, the derived budget multiplies by the configured `reviewDimensions` count. But the reducer marks a frontier node answered only once all 4 canonical dimensions plus any custom ones are covered. With 2 configured dimensions, the budget gives about half the iterations a node needs to be answered. Which rule wins?
```

Options:
```text
Budget counts 4 + custom (Recommended)
Reducer uses configured
Document the gap
```

Answer:
```text
Budget counts 4 + custom (Recommended)
```

### Q016
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01DrhzUc4167Q68bvV8syXWa:0 -->

Question:
```text
Every finding of ours from the native Opus pair (doc run 10: 32, skilled run 12: 8, including 1 P0 and 16 P1s) is now fixed in local commits. Code fixes have fail-first tests, and the suite is 3483 passed, 0 failed. The 3 that aren't ours are handed off. But amended criterion 5 needs a last pair with NO open P0/P1, and every new reviewer pair, deepseek or Opus, has surfaced fresh P1s. How should criterion 5 close?
```

Options:
```text
Amend + one regression pair (Recommended)
Amend, close on this pair
One more pair, current rule
Leave unmet, report
```

Answer:
```text
One more pair, current rule
```

### Q017
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01LQrjVjX1GvfBaNCg2p2BB3:0 -->

Question:
```text
The latest native pair nearly passed. Doc run 11 has 0 P0/P1 (27 P2). Skilled run 13 has 1 P1: A-1, `frontier-admit.cjs:407`, the review-target containment check uses the raw target text, so a `.` or glob target prunes every seed. It also showed its first-parent scope skipped 64 changed files (reducers, ledger schemas, 4 runtime scripts), which no lane reviewed. A native Opus medium agent is already fixing A-1 with fail-first tests, plus all P2s of ours. After that, how should criterion 5 close?
```

Options:
```text
Rerun skilled, full diff (Recommended)
Rerun skilled, same scope
Full pair again
Stop after fixes, report
```

Answer:
```text
Rerun skilled, full diff (Recommended)
```

### Q018
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_0124XY7BsyfxrDhCww4fnWY1:0 -->

Question:
```text
Pilot stop criterion: both live expansive-depth pilots (research 010, review 011) stopped on the iteration cap, so AC-014 (010) and AC-011 (011) are Unmet. Cause: the workflow sets maxFrontierNodes = max_iterations, and default-run quality gates (source diversity, graph STOP_BLOCKED) also block an earlier stop. How should I close these?
```

Options:
```text
Amend the criteria (Recommended)
Decouple the caps + rerun
Leave Unmet
```

Answer:
```text
Decouple the caps + rerun
```

### Q019
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_0124XY7BsyfxrDhCww4fnWY1:1 -->

Question:
```text
Golden-test waivers: the default-run golden tests strip one expansive-only persona paragraph from the agent definition. ADR-006 (phase 010) and ADR-005 (phase 011) record this as a waiver, which keeps 011's golden criterion open until ratified. Ratify?
```

Options:
```text
Ratify both (Recommended)
Reject both
```

Answer:
```text
Ratify both (Recommended)
```

### Q020
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01DZkg8CnttvcpZMfP5Hihip:0 -->

Question:
```text
Research pilot: I replayed run 2's final stop check (993 fixture). Decoupling the node cap won't make a non-cap stop reachable, because four default-run blockers that D2 freezes all fired at once: novelty never converged (rolling avg 0.89, MAD stop=false, weighted score 0.35); source diversity was 0.50 vs a 1.5 threshold; graph question coverage was 0.22 (16 uncovered); claim verification was 0. A rerun would cost ~1h and is almost certain to cap-stop again, which would be attempt 3. What now?
```

Options:
```text
Decouple, amend AC-014 (Recommended)
Decouple and rerun anyway
Amend only, no code
```

Answer:
```text
Decouple, amend AC-014 (Recommended)
```

### Q021
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01DZkg8CnttvcpZMfP5Hihip:1 -->

Question:
```text
Review pilot: the node cap never stopped it (12 nodes used against a cap of 16). It failed because each fan-out lineage keeps running after its own frontier node is answered (pi-2 and pi-6 ran 12 more iterations to the cap). The 6→8 root fix for the seven-node part has already landed. What should I do for AC-011?
```

Options:
```text
Partition-drained stop (Recommended)
Amend AC-011
Rerun as-is
```

Answer:
```text
Partition-drained stop (Recommended)
```

### Q022
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01MALQzKqe4JjaiRQRSvwzQr:0 -->

Question:
```text
Review partition-drained stop: I replayed the pilot lineages. In pi-2, pi-5 and pi-6, a drained-partition candidate would be BLOCKED by review quality gates on every iteration, and a blocked stop just continues to the cap. The failing gates: hotspotSaturationGate always fails when a lineage has no coverage graph (5 of 6 had none), pi-2 has an active P0, and partial spec_code traceability fails dimensionCoverageGate. Which design?
```

Options:
```text
Drained stops like the cap
Fix lineage graph, then gate
Gated candidate + amend AC-011
Amend AC-011 only
```

Answer:
```text
Fix lineage graph, then gate
```

### Q023
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01LDqruFvN9Ax8ncL2p5aeua:0 -->

Question:
```text
The lineage-graph fix and the gated frontier_drained candidate are committed (full suite: 3414 passed, 0 failed). A replay still predicts 3 of 6 review pilot lineages cap-stopping. The graph decision stays CONTINUE because evidence density is 0: the standard graph upsert never creates EVIDENCE_FOR links (only pi-3's leaf sent any). pi-2 and pi-6 are also blocked by real findings (an active P0, partial spec_code traceability). How do I close AC-011?
```

Options:
```text
Rerun now, then decide
Add evidence links first
Amend AC-011 + rerun
```

Answer:
```text
Add evidence links first
```

### Q024
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01LDqruFvN9Ax8ncL2p5aeua:1 -->

Question:
```text
The agent made frontier_drained a HARD stop candidate (like all_dimensions_clean), so it skips the convergence-score gate but still faces all nine quality gates and the graph decision. A soft one could never add a stop, because the composite candidate already forms at the score the gate needs. Keep it hard?
```

Options:
```text
Keep hard (Recommended)
Veto: make it soft
```

Answer:
```text
Keep hard (Recommended)
```

### Q025
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Wjx69nuK2C3ABzL8tSZQsF:0 -->

Question:
```text
Review pilot rerun (28 min, all 6 lineages got working graphs): AC-011 FAILs. Zero open and zero active: met (22 nodes: 12 answered, 7 exhausted, 3 pruned). But (1) the seed has 8 depth-1 nodes: 7 subsystems + the determinism node T030 requires; (2) pi-2 still hit the cap, blocked by real spec_code traceability that this commit-range fixture's placeholder spec can't satisfy; (3) only pi-6's stop was legal and script-computed: pi-1, pi-3, pi-4 and pi-5 leaves wrote stop reasons themselves (one invented maxDurationReached; one went to synthesis on BLOCKED), and nothing checks a leaf's stop reason. How should AC-011 close?
```

Options:
```text
Amend AC-011, log defects
Fix stop integrity, rerun
Leave Unmet
```

Answer:
```text
Amend AC-011, log defects
```

### Q026
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_019BxFSQ9bCcKQd1U9r9yBGy:0 -->

Question:
```text
Expansive runs at default budgets never grow past depth 1. The frontier node cap is half of maxIterations (research 10 → 5, review 7 → 3), and the 3-8 seeds already fill it, so every depth-2 proposal is pruned 'fanout'. At --max-iterations=16 the review pilot admitted 14 depth-2 nodes. How should this work?
```

Options:
```text
Keep cap, document it (Recommended)
Cap counts only growth
Raise expansive default
```

Answer:
```text
ask fresh opus xhigh, keep our origjnal goal and purpose and intent in mind
```

### Q027
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01FPRewkTEXRRTCkKKmmFfgM:0 -->

Question:
```text
The fresh Opus xhigh design review recommends option (c), with the expansive default budget sized from the seed. The cap rule stays at half the budget, so your earlier decoupling ruling stands. When --depth-mode=expansive is set and --max-iterations is left at its default, the run's budget becomes max(loopDefault, 2·c·(S + 2)), where S = seeded depth-1 nodes and c = 1 for research or the dimension count (4) for review. Research S=3 → 10, S=6 → 16; review S=1 → 24, S=3 → 40. An explicit --max-iterations always wins, and default runs are untouched (D2). Rejected: docs only (review at its default of 7 answers zero seeds), seeds outside the cap (reverses your decoupling ruling), and counting only open nodes (no effect, because the store never records 'answered'). Proceed?
```

Options:
```text
Build option (c) (Recommended)
(c) with a ceiling
Docs only
```

Answer:
```text
(c) with a ceiling
```

### Q028
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01VsMCUwNnrod7TAc5iAL7ps:0 -->

Question:
```text
The seed-sized expansive budget is built (full suite 3456 passed, 0 failed). One edge: in a fan-out review where a lineage gets no seed node (S=0), the formula 2·c·(S+2) still gives 16 iterations (c=4 dimensions) instead of the review default of 7. Such a lineage has no frontier node to fund. What should it get?
```

Options:
```text
Loop default when S=0 (Recommended)
Keep 16
```

Answer:
```text
ask fresh opus high, give it og user intent goal and putpose
```

### Q029
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_016jVgas6Jitctqvg1Hke9CA:0 -->

Question:
```text
Fresh Opus high recommends: a lineage with no seed share (S=0) gets its loop default (CLI review 7, CLI research 10, native 12), not 16, and a single run whose seeds were all pruned gets the same. The code shows why: such a lineage writes no node store, gets frontier_scope none and an empty frontier block, so it can't grow nodes. It runs as a plain whole-target review, and extra iterations only add cost against the 120-minute limit. It also recommends not skipping the lineage (that would drop the executors you chose) and printing a warning when lineages outnumber seeds. An explicit or matrix iteration count still wins. Apply?
```

Options:
```text
Apply recommendation (Recommended)
Keep 16
```

Answer:
```text
Apply recommendation (Recommended)
```

### Q030
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01L47b6zqjdbkSVtA3zDuhWw:0 -->

Question:
```text
The 10-iteration deep review found 0 P0, 2 P1 and 14 P2 issues (verdict FAIL, from the 2 P1s and coverage). P1s: (1) research focus text written by a leaf agent goes into a double-quoted shell argument in deep-research.yaml, so backticks in it run as commands; (2) frontier-admit rejects every expansive node when a review commit-range target carries any surrounding text, so the run silently behaves like a default run. Eight P2s are overengineering (for example an unused seed budget, merged coverage surfaces nothing reads) and one is sk-code. What should I fix?
```

Options:
```text
P1s + P2s, then re-gate (Recommended)
P1s only
No fixes now
```

Answer:
```text
P1s + P2s, then re-gate (Recommended)
```

### Q031
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01EyZtCftbNKKw6JxAvyGdYY:0 -->

Question:
```text
Of the playbook scenarios this program added, 31 of 33 only run scripts or tests, and just two are live conversation scenarios (the --extend ones). There is no live conversation scenario for an expansive research or review run, an expansive fan-out run, or custom review dimensions. Should I add a small set of low-token live scenarios through /create:manual-testing-playbook?
```

Options:
```text
Add 4 low-token scenarios (Recommended)
Add them, skip live check
Leave as is
```

Answer:
```text
Add 4 low-token scenarios (Recommended)
```

### Q032
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01McZeHW16qseqhzJwnC2pph:0 -->

Question:
```text
The four live playbook scenarios (DR-077, DR-078, DRV-084, DRV-085) are committed but unproven. All three runs hit the 25-minute limit, because setup takes 8-11 minutes and each research or review iteration takes 8.5-13 minutes. How do you want to proceed?
```

Options:
```text
Rerun with 50 min cap (Recommended)
Fix the two gaps first
Accept partial results
```

Answer:
```text
Fix the two gaps first
```

### Q033
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01D5MNNFt8sUG2iGhMUnJYwv:0 -->

Question:
```text
The live reruns found two bugs in code that predates this program. (1) A review whose dimensions leave out traceability can never pass, because convergence.cjs:939-941 requires traceability coverage. (2) Research closeout halts silently because synthesis-closeout.cjs:397 reads a sourceFindings count the research reducer never writes; that left DR-077's run unclosed, so the DR-078 extend scenario was blocked. What should I do?
```

Options:
```text
Fix both, rerun DRV-084 + DR-078 (Recommended)
Fix bug 1 only
Hand both off
```

Answer:
```text
Fix both, rerun DRV-084 + DR-078 (Recommended)
```

### Q034
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_011vxKkqqGAxt4gRwCysL1a7:0 -->

Question:
```text
The 3-iteration Opus-high review left these open: R1 (an expansive review node still requires traceability when the run's dimensions leave it out, at reduce-state.cjs:1224, the same root cause as the bug just fixed), R2 (the research topic keeps line breaks), the fan-out config JSON still interpolated inside single quotes in a shell command, and R3 (frontier logic duplicated across files, with the copies already behaving differently). Which should I fix?
```

Options:
```text
R1, R2 + JSON quoting (Recommended)
All four incl. R3 refactor
Stop here
```

Answer:
```text
All four incl. R3 refactor
```

### Q035
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01STY1FhWhyQwmpcjXamtqih:0 -->

Question:
```text
The expansive review found 4 P1s: (1) the stuck counter is shared across the whole review and closes the wrong subtopics; (2) 'thought' iterations count as subtopic visits; (3) the spec promises pivot admission but the workflow never admits; (4) nothing records the files a commit range touches. It also found 18 P2s and 5 problems with the mode itself. What should be fixed?
```

Options:
```text
P1s + mode problems (Recommended)
P1s + mode problems + all P2s
P1s only
Nothing yet
```

Answer:
```text
P1s + mode problems + all P2s
```

### Q036
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01STY1FhWhyQwmpcjXamtqih:1 -->

Question:
```text
Item 3: the spec promises that pivots get admitted to the frontier, but the deep-review workflow says it never admits them. Which one should change?
```

Options:
```text
Amend the spec (Recommended)
Change the code
```

Answer:
```text
choose for best ux and logic
```

### Q037
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_018yYZ97fTDx4dBXpKukHL1c:0 -->

Question:
```text
The expansive research produced a 34-item improvement list. The top 10 are all rated 'do' and are mostly small fixes: the resource-map folder bug, the single-reviewer Claude permission lock, the missing top-level config, graph stop checks, per-run status in the summary, research per-subtopic stuck counting, finished runs stealing other runs' questions, the research metadata rewrite, an honest permissions display, and skipping finished runs on relaunch. Which items should be built?
```

Options:
```text
Top 10 + regressions (Recommended)
Every 'do' row
Top 5 only
Nothing yet
```

Answer:
```text
Every 'do' row
```

### Q038
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01PZ8AsszRceurEs56Ew7wH4:0 -->

Question:
```text
Merging integration into main hits 25 conflicting files. Most are docs, but they include fanout-run.cjs, the research ledger schema, and main having dropped OpenCode 1 while this branch still uses it. The build agent is also still committing. How should I merge?
```

Options:
```text
Wait, then merge once (Recommended)
Merge the current tip now
Stop the build, then merge
```

Answer:
```text
Wait, then merge once (Recommended)
```

### Q039
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01E4ESDh3BxCoCfgq52f9UKu:0 -->

Question:
```text
Two pi-default tests in executor-config.vitest.ts fail on main itself, because main's 8bc8f71d2bf removed the .pi defaults they check. Until they're fixed, every gate run stays red. How should they be fixed?
```

Options:
```text
Update the tests (Recommended)
Restore .pi defaults
Leave them
```

Answer:
```text
Update the tests (Recommended)
```

### Q040
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01E4ESDh3BxCoCfgq52f9UKu:1 -->

Question:
```text
The active gh account (michelkerkmeester-barter) gets a 403 on this repo, so the merge push used the MichelKerkmeester token for that one command. What should future pushes from this machine do?
```

Options:
```text
Ask each time (Recommended)
Switch active account
Always use owner token
```

Answer:
```text
Switch active account
```

### Q041
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01E4ESDh3BxCoCfgq52f9UKu:2 -->

Question:
```text
What should happen to the local integration branch worktrees/455-expansive-depth-integration (never pushed) now that it is fully on main?
```

Options:
```text
Keep it (Recommended)
Remove now
```

Answer:
```text
Keep it (Recommended)
```

### Q042
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_011AxuZUWzkony4aDufuNZRY:0 -->

Question:
```text
I rechecked the small open items on main. Only two are real defects. (1) The cost reader in fanout-salvage.cjs (readLineageProviderCostUsd) calls readFileSync with no guard, so a single unreadable lineage log crashes the run before the orchestration summary is written. The fix is a try/catch that returns null, plus one test. (2) The review contract digest hashes only deep-review.yaml, so it misses the logic that moved into workflow-steps.cjs. Nothing compares the digest today. The other two items aren't defects. CLAUDE_DEFAULT_MODEL is pinned on purpose, and a test holds it to the fallback its packet documents. The --allow-single-lineage mentions are in already-shipped release notes. Which should I fix?
```

Options:
```text
Cost reader only (Recommended)
Cost reader + digest
Leave them
```

Answer:
```text
Cost reader + digest
```

### Q043
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01QCZzMU5RFPLzhxpLM15x4u:1 -->

Question:
```text
The new backlog's top ten are mostly small (S effort). Build them next?
```

Options:
```text
Build the top ten (Recommended)
Top ten + rows 11-15
Not now
```

Answer:
```text
Top ten + rows 11-15
```

### Q044
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01JPxTRMNtFxFYNFy14nPZwr:0 -->

Question:
```text
Round 5 is 19 local commits on the integration branch, and its gate is green: 3821 tests passed (up from 3717), 0 failed, every other check passing. Main gained 10 commits from other sessions meanwhile, none touching the same files. How should I land it?
```

Options:
```text
Rebase, regate, push (Recommended)
Merge, regate, push
Keep local
```

Answer:
```text
Rebase, regate, push (Recommended)
```

### Q045
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01JPxTRMNtFxFYNFy14nPZwr:1 -->

Question:
```text
Round 5 left a merged side worktree, 483-r5-fanout-stop-lineage, and its branch. Its commits are already in the integration branch. Remove both?
```

Options:
```text
Remove both (Recommended)
Keep it
```

Answer:
```text
Remove both (Recommended)
```

### Q046
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01JPxTRMNtFxFYNFy14nPZwr:2 -->

Question:
```text
The round found one real safety gap it didn't fix: an opencode lineage with no sandbox mode set runs as danger-full-access, the most permissive mode. Fix it next?
```

Options:
```text
Fix after landing (Recommended)
Fix + the other 3 gaps
Leave it
```

Answer:
```text
Fix + the other 3 gaps
```

### Q047
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01QjrNG5CzhuxTwBQSVXVgeL:0 -->

Question:
```text
The rebase hit a conflict in fanout-run.cjs, so I aborted it and the branch is back at 0e49309a701, unchanged. The conflict wasn't with main. Round 5 merged a side branch, and a rebase has to replay that side branch's commit against changes it was originally merged beside. A test merge of origin/main into the branch is conflict-free. Switch to merging?
```

Options:
```text
Merge instead (Recommended)
Resolve the rebase
Keep local
```

Answer:
```text
Merge instead (Recommended)
```

### Q048
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01MXQaJBJEkGfM6uCxMF8KTc:0 -->

Question:
```text
All four gap fixes are 6 local commits. Gate: 3838 passed, 0 failed, every check green. Main gained 32 commits from other sessions, none touching the deep loop, and a test merge is clean. Land it the same way as round 5?
```

Options:
```text
Merge, regate, push (Recommended)
Keep local
```

Answer:
```text
Merge, regate, push (Recommended)
```

### Q049
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01MXQaJBJEkGfM6uCxMF8KTc:1 -->

Question:
```text
The new script-backed blocked stop now writes a real state row during a dry run, in both research and review, and a dry run is supposed to write nothing. Fix it?
```

Options:
```text
Skip it on dry runs (Recommended)
Leave it
```

Answer:
```text
Skip it on dry runs (Recommended)
```

### Q050
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01MXQaJBJEkGfM6uCxMF8KTc:2 -->

Question:
```text
The review gateway silently drops a row that reuses an earlier idempotency key, and it still trusts model-written identity fields (research is now protected). Fix it too?
```

Options:
```text
Fix with the dry-run fix (Recommended)
Later
```

Answer:
```text
Fix with the dry-run fix (Recommended)
```

### Q051
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01MXQaJBJEkGfM6uCxMF8KTc:3 -->

Question:
```text
check-goal fails 4/5 because the parent goal.md has no binding row for the new child 015-reducer-test-focus-contract. Another session added that child on main. Who adds the row?
```

Options:
```text
Leave to that session (Recommended)
Add it here
```

Answer:
```text
Leave to that session (Recommended)
```

### Q052
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01AXztVpEsoqKSK66FVDhEgF:0 -->

Question:
```text
Main moved again during the merge, and the merge now has one conflict, in the cli-opencode feature-catalog file opencode-version-dispatch.md. It's a single trigger-phrase line in the frontmatter. Our side keeps "OpenCode 1 refusal". Main deleted it in 09a760a4763, "remove every OpenCode 1 observation". How should I resolve it?
```

Options:
```text
Take main's side (Recommended)
Abort the merge
```

Answer:
```text
Take main's side (Recommended)
```

### Q053
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01TGQncWkYb5NnNzmFupXFVo:1 -->

Question:
```text
The live review found 2 new P1s and several defects. P1: --stop signals a ledger pid's process group without checking it's still a lineage. P1: a signal or parent-death stop leaves lineages marked open. Defects: --max-iterations never reaches the lineages (Opus ran 24, costing $20.51), the merge counts a rejected lineage's findings at full weight, the restart lineage is lost when the prior root had no config, kept logs aren't redacted, and the continuity check reads a version number like v2.1.3.0 as sentences. Fix them?
```

Options:
```text
Fix all (Recommended)
P1s + iteration cap
Later
```

Answer:
```text
Fix all (Recommended)
```

### Q054
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01TGQncWkYb5NnNzmFupXFVo:2 -->

Question:
```text
Three local commits wait to be pushed: 555487146e2 (dry-run read-only fix, gate green), the live review record, and 8525021efae (your 35 decisions, Q018-Q052). When should they go to main?
```

Options:
```text
Now, then fix (Recommended)
After the fixes
```

Answer:
```text
Now, then fix (Recommended)
```

### Q055
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_016LxALfT4h11FMkc8iqC5em:0 -->

Question:
```text
Round 7 is 12 local commits with a green gate (3879 passed, up from 3845, 0 failed; spec-kit's affected tests 57/57). Both P1s and every live-review defect are fixed or rebutted. One trade-off: --stop now refuses to signal in three cases it used to handle: runs started before this change, a process group whose leader has exited (its children could survive), and Windows. Main gained one commit. Land it?
```

Options:
```text
Merge, regate, push (Recommended)
Land + cover orphans
Keep local
```

Answer:
```text
Land + cover orphans
```

### Q056
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Rex9vqRHzbw1b8Bgf2h1aP:0 -->

Question:
```text
The orphan follow-up is one local commit, 4fc94bae0d3, with a green gate: 3880 passed, 0 failed. --stop now signals the surviving members of a group whose leader died, but only those started at or after the lineage's spawn. Older processes are left alone and listed as 'spared'. The new test fails on the old code. One gap: if the runner is still in its post-exit grace period, --stop can write the stopped row before the runner writes its own end row, so the lineage gets two terminal rows. Main has gained 5 commits. What next?
```

Options:
```text
Fix the double close, then land (Recommended)
Land now
Keep local
```

Answer:
```text
Fix the double close, then land (Recommended)
```

### Q057
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Q5ncNMHd64fxtCaXA37Xf1:0 -->

Question:
```text
The three audits found about 30 open items in four groups: runtime defects (about 14), doc drift (16 places), packet bookkeeping, and held refactors. The largest held refactor is routing single-executor runs through the same command builder as fan-out. The two copies have already diverged three times: permission mode, sandbox pass-through and output format. How much should this round build?
```

Options:
```text
Defects, drift, bookkeeping + one executor path (Recommended)
Defects, drift, bookkeeping only
Everything, all held rows
```

Answer:
```text
Defects, drift, bookkeeping + one executor path (Recommended)
```

### Q058
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Q5ncNMHd64fxtCaXA37Xf1:1 -->

Question:
```text
check-goal fails because child 015-reducer-test-focus-contract has no goal.md and the parent has no row for it. You left this to the session that owns 015. That session has finished: 015 is marked Complete, and it never added a goal. Close it here?
```

Options:
```text
Write the goal and row here (Recommended)
Leave it failing
```

Answer:
```text
Write the goal and row here (Recommended)
```

### Q059
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Q5ncNMHd64fxtCaXA37Xf1:2 -->

Question:
```text
An opencode lineage's Bash can still write outside its working directory, because OpenCode 2 can't restrict shell commands by path. The only real fix is to wrap the opencode process in an OS sandbox: sandbox-exec on macOS, bwrap on Linux. Build that?
```

Options:
```text
No, keep the honest label (Recommended)
Build it, macOS only
```

Answer:
```text
No, keep the honest label (Recommended)
```

### Q060
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Q5ncNMHd64fxtCaXA37Xf1:3 -->

Question:
```text
The GitHub noreply author address is in 94 files already on main, mostly raw lineage logs and review iterations across nine tracks, 15 of them in this packet. It's the same address that is public on every commit. New logs are redacted now. What about the existing 94?
```

Options:
```text
Redact this packet's 15 (Recommended)
Redact all 94
Leave them
```

Answer:
```text
Redact this packet's 15 (Recommended)
```

### Q061
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_015i1ZeNCunoKoLYStBY6C9w:1 -->

Question:
```text
The round found that single-executor Claude now streams stream-json into a 10 MB stdout cap (executor-audit.ts:1470). A long iteration could overflow it. That's the likeliest failure in the live run (section D). Fix it before running?
```

Options:
```text
Fix, then run D (Recommended)
Run D as is
```

Answer:
```text
Fix, then run D (Recommended)
```

### Q062
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_015i1ZeNCunoKoLYStBY6C9w:2 -->

Question:
```text
LOGIC-SYNC: the save docs say a phase parent holds no implementation-summary.md, but this parent has one, and the save writer never writes to a parent. So the parent stays 'in progress' at 0% while every child says Complete. Which truth wins?
```

Options:
```text
Docs win: drop the parent's summary (Recommended)
Parent keeps it
```

Answer:
```text
Docs win: drop the parent's summary (Recommended)
```

### Q063
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_015i1ZeNCunoKoLYStBY6C9w:3 -->

Question:
```text
The round left other findings outside the plan. In priority order: (1) the 10 MB cap above; (2) phase 011's synthesis never lists exhausted or blocked nodes, as its ADR-001 requires; (3) a single-iteration DeepSeek harness audit row records danger-full-access while the harness runs workspace-write; (4) devin and pi report workspace-write while running unconfined; (5) a resumed research run loses maxIterationsReached as its stop reason. Which should be fixed too?
```

Options:
```text
(3)+(4) sandbox labels
(5) resume stop reason
(2) 011 synthesis list
```

Answer:
```text
(3)+(4) sandbox labels, (5) resume stop reason, (2) 011 synthesis list
```

### Q064
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01LGrNkVHJSeZ95gYu6vq4oQ:1 -->

Question:
```text
The new log redaction is slow: masking email addresses in a 12 MB log took 9.6 s, because the regex backtracks on long runs of word characters. Two smaller gaps remain: stderr still has the 10 MB cap, and fan-out's live stdout buffer has no size limit. Fix these before the live runs?
```

Options:
```text
Fix the regex + live buffer (Recommended)
Run the live checks first
```

Answer:
```text
Fix the regex + live buffer (Recommended)
```

### Q065
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01LGrNkVHJSeZ95gYu6vq4oQ:2 -->

Question:
```text
The rule that removed the parent's implementation-summary.md also says a phase parent holds no plan.md, tasks.md or decision-record.md, and this parent still has all three. The decision record holds this packet's Q018-Q056 operator decisions, and the next save writes new ones there. What should happen to them?
```

Options:
```text
Keep the decision record, move plan and tasks (Recommended)
Leave all three
Move all three
```

Answer:
```text
Keep the decision record, move plan and tasks (Recommended)
```

### Q066
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01B7euafRnXUMhjMWQwxJtf2:1 -->

Question:
```text
Round 10 found 375 email addresses that were never masked, in 49 deep-loop logs committed before masking existed. Earlier you limited redaction to this packet's 15 files. What about these?
```

Options:
```text
Leave them (Recommended)
Redact the 49 logs
```

Answer:
```text
Redact the 49 logs
```

### Q067
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01B7euafRnXUMhjMWQwxJtf2:2 -->

Question:
```text
Next is section D, the live runs. They are cheap and run on DeepSeek through LLM Gateway, capped at 4 iterations. They cover a fan-out research run, a single-executor Claude review iteration, and throwaway runs for SIGHUP, a spared process, and a reused key. Run them now?
```

Options:
```text
Run now (Recommended)
Skip the Claude iteration
```

Answer:
```text
Run now (Recommended)
```

### Q068
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_014ghbHrSCr8tzXKDKUzzViy:0 -->

Question:
```text
The live runs found two real bugs. (1) `--stop` reports a process as spared, but the runner's own stop handler kills the whole group anyway (`fanout-run.cjs:1173`). Round 8 had wrongly marked this fixed. (2) The runner writes 'stopped' rows for lineages that ignored SIGTERM and are still alive (`:5099`). There is also a gap: when the artifact dir is outside the worktree, the pre-dispatch containment check returns empty, so the child runs before the post-dispatch check throws. Fix them?
```

Options:
```text
Fix all three (Recommended)
Only the two stop bugs
```

Answer:
```text
Fix all three (Recommended)
```

### Q069
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01XhSBbNg92PokbUYkjDntFC:0 -->

Question:
```text
For the Claude check you answered "nypass"; I read it as "bypass". The guard that refuses Claude-under-Claude has no switch to turn it off. Bypassing it means starting the run detached, outside this session's process tree, so the guard can't see it: a deliberate end-run around a safety check. What did you mean?
```

Options:
```text
I'll run it in a plain terminal (Recommended)
Yes, detach it this once
Leave it unproven
```

Answer:
```text
make the switch lol
```

### Q070
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01HJAzea1JXvDACG8ge2ApjJ:1 -->

Question:
```text
Round 11 left five smaller items open. Which should a last fix round take?
```

Options:
```text
Audit row's model
Mask Claude uuid/request_id
Usage error, not stack trace
Signals + docs drift
```

Answer:
```text
Audit row's model, "Usage error, not stack trace", Mask Claude uuid/request_id, Signals + docs drift
```

### Q071
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_014ghbHrSCr8tzXKDKUzzViy:1 -->

Question:
```text
The Claude single-executor iteration never ran. The guard against Claude spawning Claude refused it under this session (exit 3), so the stdout log, the cost sidecar and containment for Claude are unproven live. It only works from a shell outside Claude. How do you want to cover it?
```

Options:
```text
I'll run it in a plain terminal (Recommended)
Leave it unproven
```

Answer:
```text
nypass
```

<!-- /ANCHOR:operator-answers-verbatim -->
