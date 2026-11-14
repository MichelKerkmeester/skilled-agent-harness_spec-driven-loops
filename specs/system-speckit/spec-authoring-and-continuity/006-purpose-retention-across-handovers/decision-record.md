---
title: "Decision Record: Keep a packet's core purpose across handovers and compactions"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-purpose-retention-across-handovers operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers"
    last_updated_at: "2026-11-13T21:18:47.860Z"
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
# Decision Record: Keep a packet's core purpose across handovers and compactions

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The research ran as two DeepSeek lineages of five iterations each, ten in total. | Not stated. | None | plan.md, research/deep-research-config.json |
| Q002 | The research loop ran autonomously with every iteration forced to run. | Not stated. | None | plan.md, research/deep-research-config.json |
| Q003 | The build is planned as five parts, with the purpose field in the continuity block included. | Not stated. | None | spec.md phase map, 005-continuity-purpose-field |
| Q004 | The research packet was committed, merged to main and pushed. | Not stated. | None | research/research.md |
| Q005 | The five build plans and the two research corrections were committed, merged to main and pushed. | Not stated. | None | spec.md phase map, research/research.md section 9 |
| Q006 | All five children were built, including 005 whose own spec rates its value as narrow. | Not stated. | None | spec.md phase map, 005-continuity-purpose-field |
| Q007 | Child 001 also changes the recent_action default, so a finished parent with a real purpose still passes the scaffold check. | Not stated. | None | 001-parent-purpose-scaffold/plan.md |
| Q008 | The live checks that a session can run were run: agent-followed resume runs and the 001 sandbox cases. A real compaction and a real relaunch stay unproven. | Not stated. | None | 001-parent-purpose-scaffold/tasks.md, 002-resume-purpose-row/tasks.md |
| Q009 | The three defects found during the build are planned as one further child, 006-purpose-carry-follow-ups, and not built yet. | Not stated. | None | spec.md phase map, 006-purpose-carry-follow-ups |
| Q010 | The follow-up plan was committed, merged and pushed to origin/main, then worktree 371 was removed. | Not stated. | None | spec.md phase map, 006-purpose-carry-follow-ups |
| Q011 | The five rewritten parent purposes in phase 006 were approved and phase 006 may be built. | Not stated. | None | 006-purpose-carry-follow-ups/plan.md E1 to E10 |
| Q012 | The parent packet gets a goal.md authored through /create:goal from the original user need. | Not stated. | None | goal.md |
| Q013 | The 21 parent purpose sentences were approved with two rewrites before the phase 011 commit. | Not stated. | None | 011-empty-parent-purpose-backfill T010, scratch/sentences.md |
| Q014 | The phase 011 commit bypassed the spec-remint gate once because a folder named research is not an NNN slug. | Not stated. | None | 011-empty-parent-purpose-backfill commit e686356a6d |
| Q015 | Phases 006 to 011 were merged to main, verified and pushed to origin/main. | Not stated. | None | merge dee9003366 |
| Q016 | The DeepSeek review of the purpose carry ran autonomously over all four dimensions. | Not stated. | None | review/deep-review-config.json |
| Q017 | All eleven drafted purpose sentences in phase 013 were approved as written. | Not stated. | None | 013-purpose-docs-and-backfill scratch/sentences.md |
| Q018 | The review output, the fix plans and the phase closeout were committed as three separate commits. | Not stated. | None | commits 98726c9099, aab544ae11, 9609eb5ac2 |
| Q019 | The fix phases were built in order 012, 013 then the harness hardening, one DeepSeek worker each. | Not stated. | None | 012-purpose-reader-precision, 013-purpose-docs-and-backfill |
| Q020 | The planner defaults for the smaller open questions in the fix phases stand. | Not stated. | None | 012 and 013 spec.md section 10 |
| Q021 | The operator is asked about merge and push only after the build reports. | Not stated. | None | session handoff |
| Q022 | Operator answers are recorded by a save after the build finishes. | Not stated. | None | decision-record.md |
| Q023 | A purpose taken from goal.md still carries the packet problem line after a compaction. | Not stated. | None | 012-purpose-reader-precision spec.md section 10 |
| Q024 | The worktree 376 branch was merged with origin/main and pushed to origin/main. | Not stated. | None | origin/main f7620ffda1 |
| Q025 | The save for the operator answers runs after the merge step. | Not stated. | None | decision-record.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01NA8j3mDDKrx7BHgZ5FzpFs:2 -->

Question:
```text
The DeepSeek harness executor only runs as a fan-out of two or more parallel lineages, a single run exits with an error. How should the 10 iterations be shaped on deepseek-v4.1-flash at max?
```

Options:
```text
2 lineages x 10 (Recommended)
2 lineages x 5
3 lineages x 10
```

Answer:
```text
2 lineages x 5
```

### Q002
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01NA8j3mDDKrx7BHgZ5FzpFs:3 -->

Question:
```text
Should the research loop run all iterations without stopping, or pause for your review after each one?
```

Options:
```text
Autonomous (Recommended)
Interactive
```

Answer:
```text
Autonomous (Recommended)
```

### Q003
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01X27AL9EkFdG7E4Mav3x2t5:0 -->

Question:
```text
The deep research on lost packet purpose is done. It recommends making the resume brief, the compaction brief and the relaunch note quote the purpose already written in spec.md, plus stopping create.sh from writing a generic purpose into new phase parents. What should happen next?
```

Options:
```text
Plan that change (Recommended)
Plan it with the continuity field
Stop here
```

Answer:
```text
Plan it with the continuity field
```

### Q004
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01X27AL9EkFdG7E4Mav3x2t5:1 -->

Question:
```text
The research packet (specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers) is uncommitted in worktree 371. What should happen to it?
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

### Q005
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01FTtHSFz49YNnA7LWM9Dt39:0 -->

Question:
```text
The five build plans and two corrections to the research report are uncommitted in worktree 371. One correction fixes a wrong claim already on origin/main (that create.sh writes a generic parent purpose). What should happen to them?
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

### Q006
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01FTtHSFz49YNnA7LWM9Dt39:1 -->

Question:
```text
Which of the five planned children should be built now, with DeepSeek v4.1 flash max workers as before? Child 005 (the continuity field) states its own value is narrow: nothing loads that block into a model, and the only code that shows its Goal never runs in this repository.
```

Options:
```text
Build 001 to 004, hold 005 (Recommended)
Build all five
Build 002 and 004 only
Build nothing now
```

Answer:
```text
Build all five
```

### Q007
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01FTtHSFz49YNnA7LWM9Dt39:2 -->

Question:
```text
Child 001 makes an unfilled purpose in a new phase parent fail a check. Its side effect: a new parent marked Complete then also fails a scaffold check on its own frontmatter defaults, even with a real purpose. How should the plan handle that?
```

Options:
```text
Fix the default too (Recommended)
Accept the side effect
Hold child 001
```

Answer:
```text
Fix the default too (Recommended)
```

### Q008
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01H9876YSX3iBVyfY42ZgXDR:1 -->

Question:
```text
Three behaviors are only proven by tests, not by a real run: the Purpose row in /speckit:resume, the Goal line in a relaunch note and the purpose section after a compaction. Should I run the live checks I can run from this session?
```

Options:
```text
Run resume and the 001 sandbox (Recommended)
Skip the live checks
```

Answer:
```text
Run resume and the 001 sandbox (Recommended)
```

### Q009
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01YFvcr8jXhKitQqkvSwYSX2:1 -->

Question:
```text
Three defects turned up during the build and were left alone because they are outside packet 006: five older phase parents still carry the generic purpose sentence, detectSpecFolder only matches .opencode/specs/ paths, and the resume workflow file and its presentation file list different brief rows. What should happen with them?
```

Options:
```text
Plan them as a new phase (Recommended)
Leave them recorded
Plan only the path match
```

Answer:
```text
Plan them as a new phase (Recommended)
```

### Q010
<!-- source: claude:af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45:toolu_01CjDZbePxtLCq7fccfvzFCz:0 -->

Question:
```text
The plan for child 006-purpose-carry-follow-ups (14 edit steps for three defects, nothing built) is uncommitted in worktree 371. You asked to remove that worktree, which would delete the plan unless it lands first. What should happen?
```

Options:
```text
Land it, then remove 371 (Recommended)
Land it, then build in 371
Keep it uncommitted
```

Answer:
```text
Land it, then remove 371 (Recommended)
```

### Q011
<!-- source: claude:ef52f514-275d-4013-b7bd-ab365324057d:toolu_017fGe9ChaN5hUKYwfVtR55B:1 -->

Question:
```text
Do the five rewritten parent Purposes (local embeddings, install scripts/doctor, template reduction, decisions and notes, simplification research) read right, so child 006 can be built?
```

Options:
```text
Approve, build now (Recommended)
Commit only, build later
Changes needed
```

Answer:
```text
Approve, build now (Recommended)
```

### Q012
<!-- source: claude:ef52f514-275d-4013-b7bd-ab365324057d:toolu_014g6y4cDBV6eezJ7UjkrM5K:2 -->

Question:
```text
Should the purpose-carry parent packet (006-purpose-retention-across-handovers) get a goal.md?
```

Options:
```text
Create it via /create:goal (Recommended)
No goal
```

Answer:
```text
Create it via /create:goal (Recommended)
```

### Q013
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_0131rW9Xnt2rMnhXa7HDRmMR:0 -->

Question:
```text
Phase 011 task T010 needs your approval of the 21 parent purpose sentences before I commit (they are in specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/011-empty-parent-purpose-backfill/scratch/sentences.md in worktree 374, and listed in my last message). Nineteen read well. Two lean on the opaque label "016" and one states a filing reason, so I drafted replacements:

002-spec-memory-stack: "Move memory search onto local embedders behind one adapter interface, then keep that stack fast, measured and correct, from the backend cascade and default model through its cache, startup and metadata repair."

005-cross-cutting-quality: "Hold the quality, verification and documentation work that spans the memory and code embedder stacks, so the playbooks, benchmarks, install steps and skill docs stay correct across both."

How should I proceed?
```

Options:
```text
Approve with rewrites (Recommended)
Approve all 21 as written
Hold for my edits
```

Answer:
```text
Approve with rewrites (Recommended)
```

### Q014
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01Dn5iyjdpbpVaZKCKbZ63AP:0 -->

Question:
```text
The phase 011 commit is blocked by the pre-commit spec-remint gate. It cannot re-derive metadata for one of the 21 parents, specs/system-speckit/memory-search-and-knowledge/002-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/research, because that folder is named "research" rather than NNN-slug. The folder already failed strict validation before my edit (4 errors, unchanged after), and the other 20 parents are re-derived and validate at baseline. How should I land phase 011?
```

Options:
```text
Bypass for this commit (Recommended)
Drop that parent, commit 20
Hold phase 011
```

Answer:
```text
Bypass for this commit (Recommended)
```

### Q015
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01JZrGkyYRjeEdymokVSEmU6:0 -->

Question:
```text
Phases 006 to 011 are built, verified and committed on branch worktrees/374-purpose-carry-follow-ups (7 commits, head 6a13b695fd). Main has moved to 59e95420f3 (the 373 merge, already on origin), and a dry-run merge of 374 into main is clean, with only .skilled/commands/speckit/handoff.md touched by both sides. Goal criterion 5 needs these commits on origin/main. Should I merge and push? If yes, I merge into main, rerun the four vitest files, the relaunch suite and recursive strict validate on the merged tree, and push only if they pass. Rollback: `git revert -m 1 <merge commit>` then push the revert. Your other sessions' uncommitted files on main (.pi/settings.json and two description.json files) are left untouched.
```

Options:
```text
Merge, verify, then push (Recommended)
Merge locally only
Not now
```

Answer:
```text
Merge, verify, then push (Recommended)
```

### Q016
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01NF1wPViPiELTmhkqtgwggs:2 -->

Question:
```text
Execution mode and review dimensions for the run?
```

Options:
```text
Autonomous, all 4 dims (Recommended)
Autonomous, 2 dims
Interactive, all 4 dims
```

Answer:
```text
Autonomous, all 4 dims (Recommended)
```

### Q017
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01PCQCD2pxZBfwNqnvWkqf2i:0 -->

Question:
```text
Phase 013 replaces eight boilerplate parent purposes and rewrites three phase-011 sentences. The drafts are in worktree 376 at specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/013-purpose-docs-and-backfill/scratch/sentences.md. Example (002-substrate-and-orchestration): 'Build the dark substrate of the new deep-loop runtime, from the authorized event ledger and shared services through durable fan-out and fan-in to convergence and health.' How should these eleven sentences be handled?
```

Options:
```text
Approve all 11 (Recommended)
Approve 8, hold 3
I'll edit the file first
```

Answer:
```text
Approve all 11 (Recommended)
```

### Q018
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01PCQCD2pxZBfwNqnvWkqf2i:1 -->

Question:
```text
Worktree 376 has three uncommitted sets of changes: the new plan folders 012, 013 and 018 with their parent updates, the staged deep-review output under 006's review/ folder (72 files), and the phase 017 closeout (the live run now proves AC-009). How should they be committed on the worktree branch?
```

Options:
```text
Three separate commits (Recommended)
Skip the review output
Don't commit yet
```

Answer:
```text
Three separate commits (Recommended)
```

### Q019
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01PCQCD2pxZBfwNqnvWkqf2i:2 -->

Question:
```text
Phases 012 (purpose-reader fixes, both P1s), 013 (docs and backfill) and 018 (DeepSeek Harness hardening) are planned and pass strict validation. How should they be built?
```

Options:
```text
All three, 012 then 013 then 018 (Recommended)
018 first, then 012 and 013
Only 012 for now
Plan only, build later
```

Answer:
```text
All three, 012 then 013 then 018 (Recommended)
```

### Q020
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01PCQCD2pxZBfwNqnvWkqf2i:3 -->

Question:
```text
The plans carry smaller open decisions. Should the planner's defaults stand? Defaults: five packets whose only purpose line is a short fragment get no new sentence; a packet's own problem line takes precedence over its parent's; the goal objective does not also carry a problem line; the hop tests write their temporary folders to the system temp dir rather than the working tree, which reverses phase 009's choice; the sk-design/020 title stays as is; the executor-identity gap in the review state log is deferred; stale dsh home folders are swept after 24 hours.
```

Options:
```text
Accept all defaults (Recommended)
Walk me through each
```

Answer:
```text
Accept all defaults (Recommended)
```

### Q021
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_014vCA73MEBoBuAMUrvAgh11:0 -->

Question:
```text
A background agent is closing phase 017 and then building phases 012, 013 and 018 on the worktree 376 branch, committing each one. Nothing is pushed. When it reports and the checks hold, what should happen to the branch?
```

Options:
```text
Ask me then (Recommended)
Merge to main, no push
Merge and push to origin/main
```

Answer:
```text
Ask me then (Recommended)
```

### Q022
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_014vCA73MEBoBuAMUrvAgh11:1 -->

Question:
```text
A session hook reports 12 of your answers from this session that aren't in a decision record yet (sentence approvals, commit split, build order, defaults, the remint bypass, the 374 merge and others). Should I record them with /speckit:save --full-auto?
```

Options:
```text
After the build (Recommended)
Now
Skip
```

Answer:
```text
After the build (Recommended)
```

### Q023
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01N7EyMwW7YDp9h1ZSZxDR83:1 -->

Question:
```text
Correction: I misstated one default earlier. The planner's real default for phase 012 is that when a purpose comes from a packet's goal.md (no purpose in spec.md), the packet's own Problem line is still shown after a compaction. Which do you want?
```

Options:
```text
Carry the problem (Recommended)
No problem line
```

Answer:
```text
Carry the problem (Recommended)
```

### Q024
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01XZV2dRs9ed19TiQUbwiUYe:0 -->

Question:
```text
Worktree 376 now holds eight commits: the 017 single-lineage loop, the review output, the fix plans, the 017 closeout, the rc.3 repin (019), the purpose reader fixes (012), the docs and backfill (013) and the harness hardening (018). Strict validation and the purpose tests pass. What should happen to the branch?
```

Options:
```text
Merge and push (Recommended)
Merge only
Leave on the branch
```

Answer:
```text
Merge and push (Recommended)
```

### Q025
<!-- source: claude:09dbafe5-7a4f-45ac-ae2e-b8dc70b614b6:toolu_01XZV2dRs9ed19TiQUbwiUYe:1 -->

Question:
```text
After that, should I run /speckit:save --full-auto to record the 16 operator answers from this session in a decision record?
```

Options:
```text
Yes, after the merge step (Recommended)
Skip
```

Answer:
```text
Yes, after the merge step (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
