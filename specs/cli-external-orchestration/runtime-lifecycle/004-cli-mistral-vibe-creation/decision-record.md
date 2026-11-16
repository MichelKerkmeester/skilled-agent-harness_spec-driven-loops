---
title: "Decision Record: Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-cli-mistral-vibe-creation operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation"
    last_updated_at: "2026-11-14T12:51:29.807Z"
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
# Decision Record: Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Build the DeepSeek Harness Mistral route now and prove it once MISTRAL_API_KEY is exported. | Not stated. | None | 003-dsh-mistral-route T004-T010 |
| Q002 | A direct-dispatch-only Pi row needs the roster alone; a fan-out model also needs PI_SUPPORTED_MODELS. | Not stated. | None | cli-pi/SKILL.md, cli-pi/references/providers-and-models.md |
| Q003 | Merge origin/main into the Vibe branch by resolving each of the 82 conflicts by hand, keeping both sides and regenerating generated files. | Not stated. | None | Merge commits 1e6742548a2 and c7b8a6ff1d9 |
| Q004 | Push the .vibe roster doc edits to main right away instead of holding them for one final push. | Not stated. | None | Commit e122448415c, pushed to main |
| Q005 | Push the .vibe/plugins/README.md plugin map to main right away. | Not stated. | None | Commit 544fb7345ec, pushed to main |
| Q006 | Push the Vibe branch to origin/main as a fast-forward. Main moved before the push, so the pushed tip e263e5481e7 adds one more merge of main's own commits and a regenerated trigger index. | The branch was five commits ahead as a fast-forward with every gate green. | None | origin/main e263e5481e7 |
| Q007 | Push the dsh Mistral route retirement to origin/main, confirming that the answer 'why use dsh, use vibe cli' meant retiring the route. | The operator confirmed the reading the question stated, so the retirement shipped as 9e5d600ab4f. | None | origin/main 9e5d600ab4f, 003 T011 |
| Q008 | Apply review code fixes F1 claim-command flags, F5 goal packet fallback, F2 runner --remove-home and F11 overlay plus doctor Vibe checks. | Not stated. | None | 023-vibe-review-remediation |
| Q009 | Lanes A and C of the phase 022 alignment pass are covered by the Codex rerun, a deliberate break from goal D4's opencode-go preset. | Not stated. | None | 022-vibe-hook-playbook-and-live-scenarios |
| Q010 | The four failed cli-mistral-vibe routing probes are fixed in phase 022 rather than deferred. | Not stated. | None | 022-vibe-hook-playbook-and-live-scenarios |
| Q011 | cli-mistral-vibe gets no runtime self-invocation guard; the skill doc that names the refusal is the guard. | The operator answered that the doc in the skill naming it is the guard. | None | cli-mistral-vibe SKILL.md |
| Q012 | The dsh Mistral route is retired and Mistral is reached through the Vibe CLI instead. | The operator asked why dsh was used at all when the Vibe CLI exists. | None | spec.md (parent), phase 013 onward |
| Q013 | All ten Vibe scenarios, the five blocked ones and the five one-turn ones, get conversation scripts and live reruns. | Operator direction earlier in the session: everything tested with proper conversation scenarios, not single-prompt scenarios. | None | 022-vibe-hook-playbook-and-live-scenarios |
| Q014 | The review's fix proposals are shown to the operator, who picks which to apply. | Not stated. | None | 023-vibe-review-remediation |
| Q015 | Apply scenario and record fixes F6-F9 with live reruns, F3 close the stale note, F4 the SKILL.md switch line and F10 record drift. | Not stated. | None | 023-vibe-review-remediation |
| Q016 | The hardened-scenario rerun blocked by Mistral's 402 budget error waits until the operator says to run it. | Not stated. | None | 023-vibe-review-remediation |
| Q017 | The 10-iteration deep review runs on the Vibe executor as two lineages of five on deepseek-flash at max. | Not stated. | None | review/ (packet 004) |
| Q018 | All 10 review iterations run; convergence does not stop the loop early. | Not stated. | None | review/ (packet 004) |
| Q019 | The deep review runs autonomously without pausing between iterations. | Not stated. | None | review/ (packet 004) |
| Q020 | All five workstreams from the first review are carried out, not only the recommended two. | Not stated. | None | 023-vibe-review-remediation |
| Q021 | Review lineage Vibe homes stay out of the commit; only the review artifacts are committed. | Not stated. | None | .gitignore, review/ (packet 004) |
| Q022 | Of the Mistral open ends, do the quick fixes (stale box and symlink launch check), refresh VIB-HK-026, and record the session's decisions; the glm-flash pass is not run. | Not stated. | None | 024 T018, 022 scratch/live/VIB-HK-026/hop-record.md |
| Q023 | Before calling the Vibe hooks verified on current code, run 10 iterations of deep review on all the Mistral and Vibe work, to find what to improve. | Not stated. Evidence: open_value, option not_applicable, overlap 0, imperative false, shift false. | None | review/ (packet 004), 023-vibe-review-remediation |
| Q024 | Fold the Mistral Vibe work, including the fixes pushed after the tag, into the v4.0.2.1 entry and republish the v4.0.2.1 tag at the new main. | Not stated. | None | .skilled/changelog/skilled/v4.0.2.1.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:7b5419e7-b051-48ae-a853-821592ddf9fd:toolu_01BcMfUT78fjRZJb5Jm5Y446:1 -->

Question:
```text
What next for the DSH Mistral route?
```

Options:
```text
Build after I export key
Build now, prove later
Hold phase 003
```

Answer:
```text
Build now, prove later
```

### Q002
<!-- source: claude:7b5419e7-b051-48ae-a853-821592ddf9fd:toolu_01BcMfUT78fjRZJb5Jm5Y446:2 -->

Question:
```text
Apply the one-line fix to the cli-pi PI_SUPPORTED_MODELS rule?
```

Options:
```text
Apply the fix
Wire fan-out instead
Leave as is
```

Answer:
```text
Apply the fix (Recommended)
```

### Q003
<!-- source: claude:abd87731-caa8-451c-b4f8-279c696fc7c1:toolu_01FGePnsqTrSaUyKBdgKQF2n:0 -->

Question:
```text
Merging origin/main into the Vibe branch (commit 36ddad5062d) hits 82 conflicts. origin/main already carries an earlier copy of this work: 7c2073a7dc1 'add the Mistral Vibe runtime packet' (249 files) and 5a1a516b082 'add the Mistral routes'. About 48 conflicts are that packet's own spec docs, about 15 are hub, agent and skill docs both sides edited, and about 8 are generated indexes (trigger index, skill graph, retrieval fixtures). I've aborted the merge, so the branch is clean and nothing is pushed. How should I resolve it?
```

Options:
```text
Branch wins on Vibe (Recommended)
Merge every file by hand
Push the branch only
```

Answer:
```text
Merge every file by hand
```

### Q004
<!-- source: claude:ad8b9098-fc02-46dd-b031-024bfd7e15c9:toolu_01S4e8EazEuwiXoxpM9tbVg3:0 -->

Question:
```text
The .vibe roster edits are done locally (root README, CROSS-CLI.md, PUBLIC-RELEASE.md, SECURITY.md, .claude/SYNC.md, hooks README). The alignment lanes are still running and may produce more fixes. When should these reach origin/main?
```

Options:
```text
One push at the end (Recommended)
Push the doc edits now
Commit, don't push
```

Answer:
```text
Push the doc edits now
```

### Q005
<!-- source: claude:ad8b9098-fc02-46dd-b031-024bfd7e15c9:toolu_01YFQrihtnG2U61RVVNHETtm:0 -->

Question:
```text
I added .vibe/plugins/README.md: a map from each of the 21 OpenCode plugins to the hooks.toml entry, event and script that does its job in Vibe (no symlinks, because Vibe would skip or refuse them). It's committed locally as 544fb7345ec. Push it to main now too?
```

Options:
```text
Push it now (Recommended)
Hold for the final push
```

Answer:
```text
Push it now (Recommended)
```

### Q006
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01NDMvHQQ4RzE6qo5LKJiZPr:0 -->

Question:
```text
Branch worktrees/383-mistral-vibe-runtime is ready to push. It is 5 commits ahead of origin/main as a fast-forward: the alignment fixes, the 022 evidence and decisions, a trigger-index rebuild and two merges of main. Validation passes 23/23 and the gates are green. Push it to origin/main with `git push origin HEAD:main`?
```

Options:
```text
Push it now (Recommended)
Don't push yet
```

Answer:
```text
Push it now (Recommended)
```

### Q007
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01L2qhyd8msoTF9VeN5puyxW:0 -->

Question:
```text
This push REMOVES the dsh Mistral route from main. I read your answer "why use dsh, use vibe cli" as "retire the route, Mistral work goes through Vibe". Push to origin/main now?
```

Options:
```text
Push it now (Recommended)
Keep the route instead
Don't push yet
```

Answer:
```text
Push it now (Recommended)
```

### Q008
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01KhHKzXT1KYXJkBb58h2RMs:0 -->

Question:
```text
Which code fixes from the Fable review should I apply? I've checked each one against the code. (F1, P1) A manual claim command printed after `skilled-loop vibe --trust` drops `--trust` and any other extra launch flags: `skilled-loop` replays them only in hop mode, at lines 807 and 820. (F5) The Vibe goal hook reads only VIBE_SPEC_FOLDER, but the wrapper exports SESSION_HANDOVER_GOAL_PACKET, so a claimed note's packet never reaches the receiver. A fallback plus one test would close 019's last blocked task. (F2) The runner leaves every Vibe home behind; add an opt-in --remove-home. (F11) overlay-engine's DEFAULT_RUNTIME_FOLDERS lacks .vibe, and /doctor:runtime-mirrors has no Vibe checks.
```

Options:
```text
F1 claim-command flags
F5 goal packet fallback
F2 runner --remove-home
F11 overlay + doctor Vibe
```

Answer:
```text
F1 claim-command flags, F5 goal packet fallback, F2 runner --remove-home, F11 overlay + doctor Vibe
```

### Q009
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01N5T4FSzG5eEHtmJgTpAEip:0 -->

Question:
```text
Phase 022's goal.md decision D4 freezes the alignment pass on the opencode-go preset (DeepSeek V4.1 Flash max). Lanes A (code) and C (READMEs, changelogs, env docs) timed out there at 1800 s while still reading files. I started a rerun of A and C on the codex preset (Luna xhigh via cli-codex), following the 2026-11-14 run's precedent. That breaks D4. How should A and C be covered?
```

Options:
```text
Use the Codex rerun (Recommended)
Record A, C as timed out
Retry on opencode-go
```

Answer:
```text
Use the Codex rerun (Recommended)
```

### Q010
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_013RQm8v2BNkmDDsvAA7uGWM:0 -->

Question:
```text
The critic upheld 4 failed routing probes (D-05). Plain requests such as 'read export.json to confirm the vibe run finished' route to sk-code or to nothing instead of cli-mistral-vibe. The fix adds compound phrases ('vibe run', 'vibe roster', 'export.json') to hub-router.json and graph metadata, then rebuilds the compiled routes and reruns the probes. Phase 022's goal requires no open in-scope finding at recheck. What should happen to this item?
```

Options:
```text
Defer as a follow-up (Recommended)
Fix it in this phase
```

Answer:
```text
Fix it in this phase
```

### Q011
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_013RQm8v2BNkmDDsvAA7uGWM:1 -->

Question:
```text
The critic's X-07 (P1) says cli-mistral-vibe has no self-invocation refusal, yet its playbook claims 'A Vibe dispatch is refused inside a Vibe child'. Siblings such as cli-claude-code and cli-devin refuse by detecting their own runtime (for example $CLAUDECODE). I have no verified signal that a Vibe child sets, and cli-deepseek-harness has the same gap. What should I do?
```

Options:
```text
Correct the claim, defer the guard (Recommended)
Build the guard now
```

Answer:
```text
The doc in the skill naming it, is the guard
```

### Q012
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_015zDcxdqWpyGM6VHbXVmcKN:0 -->

Question:
```text
Child 003's Mistral route for DeepSeek Harness (dsh) can't meet its spec on the pinned dsh 0.2.2-rc.3. Keyed runs showed two problems. First, Mistral rejects the OpenAI `store` field with 422; the patch fixes this with `supportsStore: false`. Second, with any reasoning level (high or max), Mistral streams the reply as a list of 'thinking' chunks, and dsh's reader fails with `text-delta text must be a string`. A raw stream capture confirmed this, and no patch setting changes it. With reasoning off, a run completes: exit 0, `completed`, text 'OK'. The spec's SC-002 requires a run at `max`. What should 003 ship?
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

### Q013
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_013gj2Ysiu1VPUXDyk373hqA:0 -->

Question:
```text
Besides the 5 blocked Vibe scenarios (007, 013, 018, 025, 026), five that already passed live have only ONE turn: 001 spec-gate-classify, 002 spec-gate deny, 008 turn-end option menu, 019 injection screen, 020 decision capture. They ran as real terminal sessions, but a one-turn conversation is close to the single-prompt test you ruled out. Should I also give those five a second turn and rerun them? My rough estimate is 3 to 5 hours for the blocked five, which includes the runner change. Extending the one-turn five adds about 1 to 2 hours of live runs. The earlier batch of 26 took about 7 hours.
```

Options:
```text
All ten (Recommended)
Only the blocked five
```

Answer:
```text
All ten (Recommended)
```

### Q014
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01D5NBfzWqa6oKEcQkm1PvMG:1 -->

Question:
```text
When the review report comes back, how do you want its fix proposals handled?
```

Options:
```text
Show me, I pick (Recommended)
Report only
```

Answer:
```text
Show me, I pick (Recommended)
```

### Q015
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01KhHKzXT1KYXJkBb58h2RMs:1 -->

Question:
```text
Which scenario and record fixes should I apply? F6 to F9 each need a live Vibe rerun of the changed scenario, about 2 minutes each. (F6) HK-009's second claim could pass on the first turn's advisory file. (F7) HK-003 can't tell 'deduped' from 'hook did not run'. (F8) HK-021 and HK-022 read the machine-wide cleanup log. (F9) HK-024 has no negative control. (F3) The refused hop attempt's handoff note is still open. (F10) Five stale record facts, e.g. the summary still says the push hasn't happened, plus a leftover HK-006 turn folder. (F4) cli-mistral-vibe SKILL.md never says Vibe handover needs its switch.
```

Options:
```text
F6-F9 harden + rerun
F3 close stale note
F10 record drift
F4 SKILL.md switch line
```

Answer:
```text
F6-F9 harden + rerun, F3 close stale note, F4 SKILL.md switch line, F10 record drift
```

### Q016
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01SbkHfKzu7AinJz4QgtHwHW:1 -->

Question:
```text
The five hardened Vibe scenarios (HK-003, 009, 021, 022, 024) need a live rerun, about 10 minutes, but Mistral returns 402 'API budget exhausted'. How should that rerun happen?
```

Options:
```text
I'll tell you (Recommended)
Leave it for later
```

Answer:
```text
I'll tell you (Recommended)
```

### Q017
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01XKSooFAf31nqvqZ7UV9xqC:0 -->

Question:
```text
Deep review of the Mistral Vibe packet 004 (phases 013-022 plus today's fixes), 10 iterations, all four dimensions, on DeepSeek Flash at max. Which route runs DeepSeek Flash max? The Vibe executor runs only as fan-out lineages, so 10 iterations means 2 lineages of 5.
```

Options:
```text
Vibe, 2 x 5 (Recommended)
DeepSeek Harness, 1 x 10
```

Answer:
```text
Vibe, 2 x 5 (Recommended)
```

### Q018
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01XKSooFAf31nqvqZ7UV9xqC:2 -->

Question:
```text
Should all 10 iterations run, or may it stop early once findings converge?
```

Options:
```text
Run all 10 (Recommended)
Stop on convergence
```

Answer:
```text
Run all 10 (Recommended)
```

### Q019
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01XKSooFAf31nqvqZ7UV9xqC:3 -->

Question:
```text
Run autonomously or pause after each iteration?
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

### Q020
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01MypksXJ8rrQ7pjSGX9bXxP:0 -->

Question:
```text
The 10-iteration Vibe review (DeepSeek Flash max) finished CONDITIONAL: 0 P0, 1 P1, 29 P2 after I re-checked every P1 against the code. The P1: the records claim 26 live passes on the shipped code, but VIB-HK-005/006/007 last passed before the automatic-tier change and fail now. All three failures are scenario problems, not hook bugs: the runner sent a message mid-compaction, the Vibe model isn't pinned (today's runs used GLM, not deepseek-flash), the model asked an unscripted question, and no tool call followed a mid-turn compaction. What should I do next?
```

Options:
```text
Fix WS1+WS2, rerun (Recommended)
All five workstreams
Report only
```

Answer:
```text
All five workstreams
```

### Q021
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01MypksXJ8rrQ7pjSGX9bXxP:1 -->

Question:
```text
Each review lineage kept its Vibe home (session journals, 16 MB of the 32 MB review folder). What goes into the commit?
```

Options:
```text
Without Vibe homes (Recommended)
Everything
```

Answer:
```text
Without Vibe homes (Recommended)
```

### Q022
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_017G4ncp6R17UL6NSxQsyeqi:0 -->

Question:
```text
Which Mistral Vibe open ends should I take on? Live runs bill your Mistral budget.
```

Options:
```text
Quick fixes
glm-flash live pass
Refresh VIB-HK-026
Record decisions
```

Answer:
```text
Quick fixes, Refresh VIB-HK-026, Record decisions
```

### Q023
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:chat:1cbb5628-a826-4fc7-8857-9a550c953e99:2fbcd8ce-6078-48a2-9514-de943b3fe5b7:p01274abf712c -->

Question:
```text
**All hooks verified?** Not yet on the current code.
- All 18 hooks Vibe binds have a scenario, and every scenario has passed live at least once.
- The 13 guard hooks have not changed since they passed. The commit that touched them only added symlinks to the same files.
- `turn-start`, `turn-end` and `compaction-post-tool` gained the automatic-handover code at 13:41 UTC. Five scenarios passed before that: VIB-HK-004, 005, 006, 007 and 008. Those are rerunning now.
- The other hooks that changed have passing runs on the newer code: the advisor and completion reruns this afternoon, and the goal hook in tonight's live handover.
```

Options: none

Answer:
```text
zrun 10 iters of deep review / research on all work done to improve
```

### Q024
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_0197x8EX5vQ4Sy7a7CUAMqwH:0 -->

Question:
```text
v4.0.2.1 is tagged and published (tag at 2026-11-15 22:24). Its tag already holds the first Mistral Vibe hook round, which the notes never mention. Five later pushes came after the tag: the process.start/process.write shell-guard fix, kill switches staying live, Claude user hook sync, symlinked-checkout hooks and the second scenario round. The changelog skill says work after a tag goes in a new entry. Where should the post-tag work go?
```

Options:
```text
All in v4.0.2.1 + move tag (Recommended)
All in v4.0.2.1, keep tag
Split: new v4.0.2.2
```

Answer:
```text
All in v4.0.2.1 + move tag (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
