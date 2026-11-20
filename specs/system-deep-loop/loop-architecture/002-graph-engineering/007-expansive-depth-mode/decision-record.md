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

<!-- /ANCHOR:operator-answers-verbatim -->
