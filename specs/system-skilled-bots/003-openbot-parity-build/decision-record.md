---
title: "Decision Record: Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "003-openbot-parity-build operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build"
    last_updated_at: "2026-11-28T12:00:00.000Z"
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
# Decision Record: Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Both key maps are approved: the terminal key map in 003/001 AC-007 and the 010/001 design/key-map-delta.md. | Not stated. | None | 003-terminal-screen, 010-conversations |
| Q002 | Decisions D5 and D6 are tightened rather than kept as taken. | Not stated. | None | spec.md decisions D5 and D6 |
| Q003 | Before choosing scope cuts, the operator asked for more detail on items 3 and 4, the members roster half and the Linux secret store group. | Not stated. | None | spec.md scope |
| Q004 | Delete the stray untracked files and keep the 012 manual testing scenarios. | Not stated. | None | 013-manual-testing-scenarios |
| Q005 | D5 tightens in whichever way gives the best UX without adding memory or disk use. | Not stated. | None | spec.md D5, 007-per-bot-apps |
| Q006 | D6 tightens by sandboxing each bot child. | Not stated. | None | spec.md D6 |
| Q007 | Keep the members half of the channel roster, so anyone listed in members can answer from a channel. | Not stated. | None | 011-messaging-channels |
| Q008 | Cut none of scope item 4: the Linux secret-tool store, BOTS_UI_BIN and the next-open restore all stay. | Not stated. | None | 008-vault, 003-terminal-screen, 007-per-bot-apps |
| Q009 | D5 tightens by opt-in: a shared bot with no worktree must declare apps: repository, and its record says repository rather than []. | Not stated. | None | spec.md D5, 007-per-bot-apps |
| Q010 | The fatigue streak skips a refusal with no failure class and keeps counting, so a bot with a precheck still switches off after ten failed runs. | Under the old rule a precheck skip ended the streak, so such a bot rarely reached ten. | REQ-006 as first written | 002-routine-layer REQ-006, AC-006 |
| Q011 | Remove the lifted rakazo placeholder guard, its `secret-placeholder` refusal, the placeholder half of AC-010 and its notice. Keep `secret-empty`. | Its strings are rakazo's own development defaults that nobody here will type, and Node's `crypto.timingSafeEqual` covers the compare. | 008 REQ-010 as first written | 008-vault REQ-010, AC-010, T013, contracts/refusals.md |
| Q012 | Accept that the skills budget fits about one skill per bot, and record the name-and-description tier as the later way out. | A new phase for a name list costs more than the limit hurts a small team today. | None | 009-skills spec.md |
| Q013 | Apply the 307 literal amendment-map edits with a script instead of Vibe runs. | | Every edit was already exact old and new text, so a model would only copy it and could drift. | None | scratch/amendment-map.json |
| Q014 | Update the shipped manual testing playbook in the same pass, so its memory, vault and skills scenarios match the amended plan. | | The scenarios describe unbuilt features, and left alone they would test the old plan. | None | .skilled/skills/system-skilled-bots/manual-testing-playbook |
| Q015 | A Slack approval with an option label over 75 characters goes out in numbered text form, and a typed number answers it. | | Otherwise that prompt could not be answered from Slack at all. | The rule that a typed Slack line is always chat | 011-messaging-channels |
| Q016 | Every phase is dispatched to cli-mistral-vibe with deepseek-flash at its fixed max thinking, and cli-pi becomes the first fallback. No build starts. | The operator chose DeepSeek Flash at max through Vibe for the build. | The cli-pi primary rows of the executor table | spec.md EXTERNAL ORCHESTRATION and BUILD ORCHESTRATION |
| Q019 | The folder architecture phase takes number 012, and the scenario, alignment and review phases shift to 013, 014 and 015. | The operator chose the renumber over a 015 folder whose number would not match the order it runs in. | The 012, 013 and 014 numbers of the three closing phases | spec.md PHASE DOCUMENTATION MAP and BUILD ORCHESTRATION, goal.md criteria 1 to 3 |
| Q020 | The folder architecture phase covers all of `.skilled` the build touched: the system-skilled-bots skill, `.skilled/crates/bots-tui`, `.skilled/bin/bots.cjs` and the deep-loop executor audit files. | The operator chose the widest of the three offered scopes, so the pass reaches the crate, the CLI and the audit files as well as the skill tree. | None | 012-folder-architecture spec.md In Scope, REQ-001 and REQ-004 |
| Q021 | The parent goal is amended to fifteen phases, and the operator resets the session goal from the new chat slice. | The new phase needs its own binding row and criteria that count it, and folding it into 013 was offered and not chosen. | goal.md criteria 1 to 3 at fourteen children | goal.md binding table and criteria 1 to 3 |
| Q022 | Phase 013 executes all 58 bots scenarios, BOT-001 to BOT-025 as a regression check on the rewritten runtime, plus DLR-002, DLR-023 and DLR-064, the system-deep-loop scenarios that cover `executor-audit.ts`. | Phases 001 to 011 rewrote the runtime the first 25 scenarios drive and 007 and 008 changed `executor-audit.ts`. The goal's playbook criterion checks only the package format. | 013's execution of the 33 new scenarios alone | 013-manual-testing-scenarios REQ-005, REQ-014, AC-005, AC-014, AC-015 and goal D8 |
| Q023 | The Rust crate moves from the repository root to `.skilled/crates/bots-tui/`, under `.skilled` and outside the skill. | The operator asked to keep it in the skill if possible, or else under `.skilled`. It cannot sit in the skill, because `parent-skill-check.cjs` lines 118 to 122 allow no `crates` folder at a hub root and the skill walkers would crawl its build output. | 003-terminal-screen goal D1 as first written, which put the crate at the repository root | 003-terminal-screen goal D1, 003-terminal-screen/002-architecture-and-contracts REQ-001 |
| Q024 | Phase 012 gains a README task, a requirement and an acceptance row. `.skilled/crates/`, `.skilled/crates/bots-tui/`, each new folder 012's move map lands and each folder the build created get a `README.md` authored through `/create:readme` that says what belongs in the folder and what does not. | The operator asked on 2026-11-28 for every unique folder to explain what is supposed to be in it. The task runs after the move tasks and before the final gate rerun, because the move map creates folders that do not exist until the moves land. | None | 012-folder-architecture REQ-012, T010, AC-012, CHK-043 and goal criterion 7 |
| Q025 | Strategy A, the backlog review of the merged work, starts now and runs one review at a time. Each slice goes to one Fable 5.2 medium `review` agent that reads a detached review worktree pinned at `d0b90c9b6a9`. Strategy B, one Fable 5.2 medium review of a multi-child phase once its last child merges, joins the same one-at-a-time queue. Findings land in the gitignored store `.skilled/skills/.state/openbot-build/review/`. A suggestion carries no severity and never counts toward 015's gate. | The operator chose on 2026-11-28 to start the interim review now but one review at a time, not the three at once the review strategy proposed. | None | The top orchestrator's review queue and the store under `.skilled/skills/.state/openbot-build/review/` |
| Q026 | A confirmed P0 from an interim review, re-run by the top orchestrator, holds 013 until a follow-up fix unit of the owning phase merges. A P1 or lower never holds anything, and an inferred P0 holds nothing. This hold is a gate beside goal.md D2, approved by the operator. | The operator chose on 2026-11-28 to hold 013 until a confirmed P0 is fixed. 013 records one run of all 58 scenarios, and a run on a runtime with a known P0 files failures that 015 must then seed, fix and re-run. 012 changes no behavior, so holding 012 would buy nothing. | None | The top orchestrator's entry check before 013 opens. goal.md D2 keeps its wording |
| Q027 | 015's documents are not amended for intake. When 015 opens, the top orchestrator's task message tells T009 to read `findings.jsonl` and add every verified, unfixed row that no lineage already reported to `openFindings` as `active` at its severity, with `source` `review`. The rule adds findings and removes none. | The operator chose on 2026-11-28 the bridge at triage over a fourth seeded source, so 015's seeded intake stays at its three inputs and the closing gate can only get stricter. | None | The task message that opens 015. No 015 document changes |
| Q028 | 015 reviews and may fix `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` and `.github/workflows/bots-runtime.yml`. Both are lines in `review/fanout-review-scope.txt`, they form fix group O and the diff filter admits them with the `executor-audit` and `dispatch-receipts` suites. A fix to the executor audit reruns those suites and a fix to the workflow reruns `check-gate-inputs.sh`. | The operator chose on 2026-11-28 to amend 015. Phases 007 and 008 changed the executor audit and phase 003 and the crate move changed the workflow, yet neither file sat in 015's scope list or its diff filter, so 015 as written could neither review nor fix them. | 015's scope list and diff filter as first written | 015-deep-review spec.md (Phase Context, Scope Boundary, In Scope, Files to Change), plan.md (section 8.4, FIX ADDENDUM), tasks.md (T012, T014, T019, Wave 0, group O, CHK-FIX-005), acceptance-criteria.md (AC-002, AC-009), goal.md criterion 7 and its log, design/records.md sections 2 and 12 and the config golden |
| Q029 | Review finding RB-039 is a P0. A vault value that holds a quote or a backslash leaks unredacted into a JSON-log executor's decoded answer, because the post-run scan in `runner.ts` `scanForms` builds no JSON-escaped form of the value. Per Q026 it holds 013 until a follow-up fix unit of phase 008 merges. | The operator answered on 2026-11-28 to fix it before 013. A leaked secret in a conversation file is the one failure the vault exists to prevent. | RB-039's P1 severity in the review store | A follow-up fix unit of 008-vault and the top orchestrator's entry check before 013 opens |
| Q030 | Phase 012 fixes the CI design guard inside its own scope. The guard step in `.github/workflows/bots-runtime.yml` excludes `chat-mockups.md` from its first `diff -r`, diffs `010-conversations/001-chat-ux-and-pane-map/design/mockups.md` against the crate's `design/chat-mockups.md` and the push filter names that design folder. | The guard failed before 012 opened, because commit `44216a6ad13` added the chat copy without teaching the guard about it. The operator chose a named amendment to 012 over a supersede record that would send the fix to the deep review. | 012's scope line that let it touch the workflow only for a path a move changes | 012-folder-architecture REQ-007, Files to Change, T008, AC-007 and implementation-summary.md |
| Q031 | Review finding RB-069 is a P0. The child bar in `bots.cjs` refused only `answer`, `enable` and `skill`, so a bot child could still run `chat`, `run`, `schedule install` and `uninstall`, `resume`, `disable`, `pause`, `enqueue`, `drain` and `status --unregister` or `--rebuild`. A manual run and a reinstall both write the definition approval that `enable` is barred for. Per Q026 it holds 013 until a follow-up fix unit of phase 001 merges. | The operator answered on 2026-11-28 to fix it before 013. A child that edited its own BOT.md could reinstall the bot and so approve its own drift. | RB-069's P1 severity in the review store | A follow-up fix unit of 001-activity-and-actor, which fixed it by refusing every write verb and write form for a bot child, and the top orchestrator's entry check before 013 opens |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01VoK4UXMyJHezxSNJUsGBDW:0 -->

Question:
```text
Status: the parity build plan is finished. It is pushed at 036026f5d89 and all 15 folders pass strict validation. None of my workers are running. Before the build starts, do you approve the two key maps, the terminal key map (003/001 AC-007) and the 010/001 design/key-map-delta.md?
```

Options:
```text
Approve both (Recommended)
Approve terminal only
Review first
```

Answer:
```text
Approve both (Recommended)
```

### Q002
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01VoK4UXMyJHezxSNJUsGBDW:1 -->

Question:
```text
While you said not to ask, I took the recommended default for decisions D1 to D11 and A1 to A7. D5 and D6 accept a small leftover security risk, which the review flagged. Do they stand?
```

Options:
```text
Keep all as taken (Recommended)
Tighten D5 and D6
Review all first
```

Answer:
```text
Tighten D5 and D6
```

### Q003
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01VoK4UXMyJHezxSNJUsGBDW:2 -->

Question:
```text
The review proposed scope cuts that I kept in scope. Which of them should be cut?
```

Options:
```text
Cut nothing (Recommended)
WhatsApp and Signal later
Members roster half
Linux secret store and more
```

Answer:
```text
need more info on 3 and 4
```

### Q004
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01VoK4UXMyJHezxSNJUsGBDW:3 -->

Question:
```text
Two sets of untracked files are in the worktree. What should happen to them?
```

Options:
```text
Delete stray, keep 012 (Recommended)
Delete both
Keep both for now
```

Answer:
```text
Delete stray, keep 012 (Recommended)
```

### Q005
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_017XsFkv5jbALWmf1nx3RKFt:0 -->

Question:
```text
D5 today: a bot run with no worktree of its own (a shared run) can't get a narrowed apps list. The project's MCP config files pin the full .utcp_config.json, so its child sees every app while the record says posture.apps: []. How should D5 tighten?
```

Options:
```text
Opt in and record truth (Recommended)
Refuse all shared runs
Narrow per executor
```

Answer:
```text
we need best ux without bloating memory or disk space
```

### Q006
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_017XsFkv5jbALWmf1nx3RKFt:1 -->

Question:
```text
D6 today: every bot child runs as your OS user, so any child can read any secret, whether from a 0600 value file or by calling the security tool on the keychain. A grant only decides which secret is injected. How should D6 tighten?
```

Options:
```text
Sandbox each child (Recommended)
Separate OS user
Keep, and warn louder
```

Answer:
```text
Sandbox each child (Recommended)
```

### Q007
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_017XsFkv5jbALWmf1nx3RKFt:2 -->

Question:
```text
Scope item 3, the members roster half: phase 011/003 lets a channel answer come from the owner or from anyone listed in members of operators.json, and adds bots channel roster add, remove and list. Cutting the members half keeps only the owner. Only you could answer from a phone, and the roster verbs shrink to setting the owner. Cut it?
```

Options:
```text
Keep members (Recommended)
Cut members
```

Answer:
```text
Keep members (Recommended)
```

### Q008
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_017XsFkv5jbALWmf1nx3RKFt:3 -->

Question:
```text
Scope item 4 is three small pieces. Linux secret-tool: 008 stores secrets in the Linux Secret Service, else a 0600 file. BOTS_UI_BIN: a test-only variable letting the bots ui verb's tests use a stub instead of building the Rust screen. 007 next-open restore: if a run is killed before it puts the worktree's own .utcp_config.json back, the next open of that tree restores it. Which should be cut?
```

Options:
```text
Cut none (Recommended)
Cut Linux secret-tool
Cut BOTS_UI_BIN
Cut next-open restore
```

Answer:
```text
Cut none (Recommended)
```

### Q009
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_0158bJFugqyGdUrGQU6sco6H:1 -->

Question:
```text
For the parked bots plan: D5 tightens with shared bots opting in. A bot with no worktree must declare apps: repository on purpose, and its record says repository rather than []. No extra memory or disk. Does that work?
```

Options:
```text
Yes, opt in (Recommended)
Explain more first
```

Answer:
```text
Yes, opt in (Recommended)
```

### Q010
<!-- source: claude:288e5251-49b6-487c-934d-a3aa36385901:toolu_01S9fFsfTVVtSrHJpnXKg2Db:1 -->

Question:
```text
002 fatigue rule: should the failure streak skip "nothing to do" refusals and keep counting, so a bot with a precheck still switches off after ten failures? This overrides a choice REQ-006 made on purpose.
```

Options:
```text
Yes, change the rule (Recommended)
No, keep REQ-006
```

Answer:
```text
Yes, change the rule (Recommended)
```

### Q011
<!-- source: claude:288e5251-49b6-487c-934d-a3aa36385901:toolu_01S9fFsfTVVtSrHJpnXKg2Db:2 -->

Question:
```text
008: should the lifted rakazo placeholder guard be removed? Its strings are rakazo's own development defaults that nobody here will type.
```

Options:
```text
Remove it (Recommended)
Keep one literal
```

Answer:
```text
Remove it (Recommended)
```

### Q012
<!-- source: claude:288e5251-49b6-487c-934d-a3aa36385901:toolu_01S9fFsfTVVtSrHJpnXKg2Db:3 -->

Question:
```text
009 skills budget: the 20,480-byte total fits about one skill per bot in practice. What should the plan do?
```

Options:
```text
Accept one skill per bot (Recommended)
Plan a name-list phase
```

Answer:
```text
Accept one skill per bot (Recommended)
```

### Q013
<!-- source: claude:288e5251-49b6-487c-934d-a3aa36385901:toolu_01S4J1FvB2n5XLqXVsXsqnCN:0 -->

Question:
```text
The Opus edit map came back with 307 edits in 110 files, and every one is literal: exact old text, exact new text, each checked unique. So there's no writing left for Vibe to do, only copying. You asked for Vibe for the writing. How should the edits be applied?
```

Options:
```text
Script applies them (Recommended)
Vibe applies them
```

Answer:
```text
Script applies them (Recommended)
```

### Q014
<!-- source: claude:288e5251-49b6-487c-934d-a3aa36385901:toolu_01S4J1FvB2n5XLqXVsXsqnCN:1 -->

Question:
```text
Outside the build plan, the skill's manual testing playbook (.skilled/skills/system-skilled-bots/manual-testing-playbook/) already holds scenarios for the unbuilt memory and vault features: BOT-048 forgets by index, BOT-050 expects the old memory-full line and BOT-053 tests secret-placeholder, plus the root playbook file. They'd contradict the amended plan. Update them in this pass?
```

Options:
```text
Yes, update them too (Recommended)
No, leave them for 012
```

Answer:
```text
Yes, update them too (Recommended)
```

### Q015
<!-- source: claude:288e5251-49b6-487c-934d-a3aa36385901:toolu_01S4J1FvB2n5XLqXVsXsqnCN:2 -->

Question:
```text
One fix has a knock-on the map made explicit: a Slack approval with an option label over 75 characters goes out in numbered text form, so a typed number in Slack would answer it. The plan said a typed Slack line is always chat. Accept that?
```

Options:
```text
Accept it (Recommended)
Refuse long labels
```

Answer:
```text
Accept it (Recommended)
```

### Q016
<!-- source: claude:288e5251-49b6-487c-934d-a3aa36385901:toolu_01WEBV1ZgrgpaQdnnfgW1uwN:0 -->

Question:
```text
"Use max cli vibe": for what exactly? The build schedule now names cli-pi (DeepSeek Flash on DevPass) as the primary executor for most phases, and cli-mistral-vibe only as third on the fallback ladder. Vibe runs deepseek-flash at max thinking always.
```

Options:
```text
Make Vibe primary in plan (Recommended)
Amend plan and start build
Only start the build with Vibe
```

Answer:
```text
Make Vibe primary in plan (Recommended)
```

### Q019
<!-- source: claude:323f5183-9f0e-4734-beef-642466c5fec9:toolu_01PkuLUcRvEw7wwKbgdGC9V6:0 -->

Question:
```text
Where should the new folder-architecture phase sit in the build order? The folder number doesn't have to match the run order, because the BUILD ORCHESTRATION wave table decides when each phase runs.
```

Options:
```text
015, run before 012 (Recommended)
015, run last after 014
Renumber to 012, shift the rest
```

Answer:
```text
Renumber to 012, shift the rest
```

### Q020
<!-- source: claude:323f5183-9f0e-4734-beef-642466c5fec9:toolu_01PkuLUcRvEw7wwKbgdGC9V6:1 -->

Question:
```text
What should the folder-architecture phase restructure?
```

Options:
```text
The bots skill tree (Recommended)
Skill tree plus spec packet
All of .skilled touched by the build
```

Answer:
```text
All of .skilled touched by the build
```

### Q021
<!-- source: claude:323f5183-9f0e-4734-beef-642466c5fec9:toolu_01PkuLUcRvEw7wwKbgdGC9V6:2 -->

Question:
```text
How should the goal be amended for the 15th phase?
```

Options:
```text
Amend to 15, I'll re-set /goal (Recommended)
Keep 14, fold into 013
```

Answer:
```text
Amend to 15, I'll re-set /goal (Recommended)
```

### Q022
<!-- source: claude:323f5183-9f0e-4734-beef-642466c5fec9:toolu_01AmwtUUyP2Zfg3Euxzkhfjn:0 -->

Question:
```text
Should the scenario phase (013 after the renumber) execute more than the 33 new scenarios? Today it runs only BOT-026 to BOT-058, and the goal's criterion only validates the 58-scenario package's format.
```

Options:
```text
All 58 bots + deep-loop audit (Recommended)
All 58 bots scenarios
Every playbook in .skilled
Keep it at the 33 new
```

Answer:
```text
All 58 bots + deep-loop audit (Recommended)
```

### Q023
<!-- source: operator chat, 2026-11-28, two lines on the crate move -->

Question:
```text
No AskUserQuestion prompt carries this decision. The operator wrote these two lines in chat about moving the Rust crate out of the repository root.
```

Options:
```text
None offered
```

Answer:
```text
keep it in the skill if possible
Or .skilled
```

### Q024
<!-- source: operator chat, 2026-11-28, one line on folder READMEs -->

Question:
```text
No AskUserQuestion prompt carries this decision. The operator wrote this line in chat about the crates folder and the other unique folders.
```

Options:
```text
None offered
```

Answer:
```text
that crates folder, and any other unique folder needs a sk create readme explaining whats supposed to be in there
```

### Q025
<!-- source: operator answer of 2026-11-28, passed in the orchestrator task message. The question below is the task message's paraphrase and the tool-use id was not passed to this record -->

Question:
```text
Start Strategy A, the backlog review of the merged work, now?
```

Options:
```text
Not passed to this record
```

Answer:
```text
Start, but 1 at a time
```

### Q026
<!-- source: operator answer of 2026-11-28, passed in the orchestrator task message. The question below paraphrases review-strategy.md section 10 item 3 and the tool-use id was not passed to this record -->

Question:
```text
May a confirmed P0 from an interim review hold phase 013 until a follow-up fix merges?
```

Options:
```text
Not passed to this record
```

Answer:
```text
Hold 013 until fixed
```

### Q027
<!-- source: operator answer of 2026-11-28, passed in the orchestrator task message. The question below paraphrases review-strategy.md section 10 item 2 and the tool-use id was not passed to this record -->

Question:
```text
How does a review store row reach 015: a bridge at triage or a fourth seeded source?
```

Options:
```text
Not passed to this record
```

Answer:
```text
Bridge at triage
```

### Q028
<!-- source: operator answer of 2026-11-28, passed in the orchestrator task message. The question is quoted from that message, which elided its middle with an ellipsis, and the tool-use id was not passed to this record -->

Question:
```text
The build changed two files that phase 015 neither reviews nor can fix ... How should they be covered?
```

Options:
```text
Not passed to this record
```

Answer:
```text
Amend 015 to include them
```

### Q029
<!-- source: operator answer of 2026-11-28 on review finding RB-039, passed in the orchestrator task message. The question below paraphrases that message and the tool-use id was not passed to this record -->

Question:
```text
Review finding RB-039: a vault value holding a quote or a backslash leaks unredacted into a JSON-log executor's decoded answer. What severity and when is it fixed?
```

Options:
```text
Not passed to this record
```

Answer:
```text
P0: fix it before 013
```

### Q030
<!-- source: operator answer of 2026-11-28 on the 012 design guard LOGIC-SYNC, passed in the orchestrator task message. The question below paraphrases that message and the tool-use id was not passed to this record -->

Question:
```text
The CI design guard already failed when 012 opened, on design/chat-mockups.md. Fix it inside 012 or route the fix to 015?
```

Options:
```text
Not passed to this record
```

Answer:
```text
Fix it inside 012 (Recommended)
```

### Q031
<!-- source: operator answer of 2026-11-28 on review finding RB-069, passed in the orchestrator task message. The question below paraphrases that message and the tool-use id was not passed to this record. A 001 follow-up unit fixed it -->

Question:
```text
Review finding RB-069: the child bar leaves chat, run, schedule install and uninstall, resume, disable, pause, enqueue, drain and status --unregister or --rebuild open to a bot child, and a manual run or a reinstall writes the definition approval. What severity and when is it fixed?
```

Options:
```text
Not passed to this record
```

Answer:
```text
P0: fix before 013 (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
