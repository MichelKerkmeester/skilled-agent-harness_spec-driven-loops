---
title: "Decision Record: Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-command-surfacing-build operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build"
    last_updated_at: "2026-11-12T18:28:28.791Z"
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
# Decision Record: Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Update the codex, pi and opencode CLIs globally before the research run. | Not stated. | None | 007-command-surfacing-and-workflow-enforcement research setup |
| Q002 | Repair the Pi extension loading broken by the pi 1.5.2 update instead of working around it. | Not stated. | None | 007 research setup, cli-pi envelope |
| Q003 | Run 30 deep-research iterations in total, 10 per executor. | Not stated. | None | 007 research/research.md |
| Q004 | Treat the uncommitted pi edits in the main checkout as possibly from another session and keep them. | Not stated. | None | 007 research setup |
| Q005 | Run the Fable reviewer through the Claude Code CLI after the subagent hook refused it. | Not stated. | None | 007 research/synthesis-review.md |
| Q006 | D1: a surfaced command that writes tracked files the user asked for is started, not asked about. | Not stated. | None | 007 research.md section 13, 002 commandPolicies |
| Q007 | D2: a hub mode with a command offers that command while the skill keeps flexibility. | Not stated. | None | 007 research.md section 13, 003 lib/command-attach.ts |
| Q008 | D3: a deep loop is offered only when the prompt uses depth wording. | Not stated. | None | 007 research.md section 13, 003 DEPTH_WORDING |
| Q009 | D4: the legacy bridge id command-spec-kit is retired from Gate 4. | Not stated. | None | 007 research.md section 13, 003 plan.md ADR-015 |
| Q010 | Plan the build as a new phased packet after the research and review. | Not stated. | None | specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md |
| Q011 | D2 reading: the looser form, where the AI picks freely between the command and the skill. | Not stated. | None | 007 research.md section 13 |
| Q012 | D5: the private /local-skilled-alignment command is excluded from the command inventory. | Not stated. | None | 002-command-inventory-and-risk-metadata/spec.md |
| Q013 | Amend the sk-create-skill contract so a standalone skill may carry command-metadata.json. | Not stated. | None | 002 plan.md, sk-create-skill skill-root-metadata-contract |
| Q014 | Plan phase 003 next. | Not stated. | None | 003-plain-chat-command-reach/plan.md |
| Q015 | Close research packet 007. | Not stated. | None | 007-command-surfacing-and-workflow-enforcement/spec.md |
| Q016 | Verify the risk class of all 16 hub commands against their workflows. | Not stated. | None | 002 implementation-summary.md |
| Q017 | Build command-level meaning matching as a new phase 004 in packet 008 and renumber the later phases. | Not stated. | None | 004-command-meaning-matching/spec.md |
| Q018 | Leave the published v4.0.2.1 release unsynced until the branch is merged. | Not stated. | None | 003 implementation-summary.md known limitations |
| Q019 | Commit the open-item fixes and the phase 004 plan as two local commits. | Not stated. | None | commits fcbe10b4d3 and 005dea00ae |
| Q020 | Close phase 003 with its holdout plain-recall miss accepted on the terms phase 004 recorded. | Asked on the wrong premise that the holdout row was the only unmet one. The corrected question followed the same day. | None | 003-plain-chat-command-reach decision-record.md ADR-016, AC-007 |
| Q021 | Plan and build phases 005 to 007 in turn, with DeepSeek workers through Pi. | Not stated. | None | 005, 006 and 007 plan.md and tasks.md, commits 80b79880f1, 59e38411ad and the phase 006 plan commit |
| Q022 | No choice made about the Ollama server. The operator asked when an embedding model came into use. | Not stated. | None | Answered in the next dialog. The server stays up until the build ends. |
| Q023 | Settle the eight other unmet criteria of phase 003: three move to phase 005, three doctor rows are superseded by phase 004, the capture-order miss is waived and the widened phrase gate is accepted. | Not stated. | None | 003-plain-chat-command-reach decision-record.md ADR-017 to ADR-020, 005 CARRY-003 group, commit fe20ca1c36 |
| Q024 | Harden the install and setup experience for external repository users around the embedder dependency, and measure its memory and performance cost. | The operator sees a running local server as a real dependency for people who install Skilled into their own repository. | None | 008-embedder-setup-and-cost spec.md, plan.md and tasks.md |
| Q025 | Rename the four old spec-kit command ids and drop the dead Python prompt row. Leave the deep-loop and create ids as a recorded limitation. | Not stated. | None | 005-recommendation-contract-and-brief spec.md section 10, wave 6 tasks |
| Q026 | A degraded brief shows a command only when the prompt typed it. | Not stated. | None | 005-recommendation-contract-and-brief spec.md section 10, G6 requirement |
| Q027 | A bare /doctor:update row prints the strictest policy of its actions, ask. | Not stated. | None | 005-recommendation-contract-and-brief spec.md section 10 |
| Q028 | The Gate 2 bullet offers the command beside the skill, in the 463-byte text the operator saw. | Not stated. | None | 006-gate-2-binding-and-runtime-pointers tasks.md T003, scratch/bullet-draft.txt |
| Q029 | A dispatched child sees a surfaced command marked parent-named only, unless it is a read-only run command. | Not stated. | None | 006-gate-2-binding-and-runtime-pointers plan.md ADR-005 |
| Q030 | Drop the copilot label from the advisor runtime list and accept that old records carrying it fail validation. | The operator chose removal over the recommended retired list. | None | 006-gate-2-binding-and-runtime-pointers plan.md ADR-007, T006 to T008 and T022 |
| Q031 | Run the behaviour proof on all six runtimes that have a transcript reader, about 332 live runs. | Not stated. | None | 007-per-runtime-behaviour-proof spec.md section 10, T022 to T046 |
| Q032 | Run the before arm now on the branch tip. Phase 005 code waits for it. | Not stated. | None | 007-per-runtime-behaviour-proof tasks.md order block, 005 wave 0 gate |
| Q033 | The behaviour runs start each CLI like a chat user, without the child marker. | Not stated. | None | 007-per-runtime-behaviour-proof plan.md ADR-004, T012 |
| Q034 | Keep the doctor lead phrase for the comment hygiene gate. The wording check skips a lead phrase whose policy is ask. | Not stated. | None | 007-per-runtime-behaviour-proof spec.md section 10, T017 to T019 |
| Q035 | For an external repository the embedder is set up by default as a normal install step, behind a yes. | The operator chose default setup over the recommended optional posture. | None | 008-embedder-setup-and-cost spec.md section 10, REQ-003, T029 |
| Q036 | After a yes the doctor route may pull the model and start the server. It never installs Ollama. | Not stated. | None | 008-embedder-setup-and-cost spec.md section 10 |
| Q037 | A switched-off meaning lane is shown by the setup check, the status tool and a warning in the advisor JSON. The hook brief stays unchanged. | Not stated. | None | 008-embedder-setup-and-cost spec.md section 10 |
| Q038 | The prompt embedding gets a 750 ms deadline before the advisor falls back to phrase matching. | Not stated. | None | 008-embedder-setup-and-cost spec.md section 10 |
| Q039 | Fix the plain documentation prompt that reaches no documentation skill inside phase 005. | Not stated. | None | 005-recommendation-contract-and-brief REQ-019, AC-019, T054 to T057 |
| Q040 | Build a way for Claude Code to list all 44 tracked commands; the design was settled by the later rename answer. | Research segment three rank 7 showed Claude lists 32 of 44 because the create commands collapse. | None | 016-claude-create-reach-and-doctor-default lane A |
| Q041 | The degraded brief keeps carrying only a typed command, so research segment three rank 12 is declined. | Not stated. | None | goal.md log, research-segment-3.md rank 12 |
| Q042 | An ambiguous doctor prompt is offered /doctor:helper. | Not stated. | None | 016-claude-create-reach-and-doctor-default lane B |
| Q043 | Edit the AGENTS.md Gate 2 direct-call example to the stdin form with --json -. | Review finding R4-P2-003 found the argument form unsafe. | None | 016-claude-create-reach-and-doctor-default lane C |
| Q044 | No design was chosen: the operator asked whether commands were already symlinked across the CLIs, which led to the next question. | Not stated. | None | 016-claude-create-reach-and-doctor-default lane A |
| Q045 | The doctor default uses the narrow show-up or appear cue, which fixes one of the two rows and changes no other row. | The wide rule changed 8 other rows and broke a doctor test. | None | 016-claude-create-reach-and-doctor-default lane B |
| Q046 | No further behaviour arm runs in this packet, so the OpenCode receipt and the longer time cap are declined. | Not stated. | None | goal.md log, research-segment-4.md |
| Q047 | No design was chosen: the operator pointed at the file name skill.md and proposed sk-skill, which led to the rename question. | Not stated. | None | 016-claude-create-reach-and-doctor-default lane A |
| Q048 | No option was chosen: the operator asked to check that the name is correct, that Skilled commands use it and whether Claude Code has a bug, which the next question answered. | Not stated. | None | 016-claude-create-reach-and-doctor-default lane A |
| Q049 | Rename /create:skill to /create:sk-skill on every runtime, with no alias. | The collapse is the open Claude Code bug anthropics/claude-code#85786: any command file named skill.md swallows its siblings. | None | 016-claude-create-reach-and-doctor-default lane A, task T003 |
| Q050 | The session waited for the two planner agents to return and then handed over to a new session. | Not stated. | None | goal.md log, session handoff note |
| Q051 | The breaking rename is recorded as a new sk-doc changelog entry at v2.10.0.0, a minor bump with the break called out in the text. | Not stated. | None | 016-claude-create-reach-and-doctor-default task T026 and spec.md Q3 |
| Q052 | The operator approves the Codex hooks for one arena and one Codex-only behaviour arm runs, which reverses no more arms for Codex alone. | Not stated. | None | 007-per-runtime-behaviour-proof, goal.md log |
| Q053 | Gate 2 gains no clause for a skill-only brief, so research segment two rank 14 is declined. | Not stated. | None | goal.md log, research-segment-2.md rank 14 |
| Q054 | The sealed holdout row suppressed-codex-abstain is retired in this packet. | Not stated. | None | 018-holdout-row-retirement |
| Q055 | Phase 018 retires only suppressed-codex-abstain, and the eight other rows the leak scan names are an advisory for a separate decision. | Not stated. | None | 018-holdout-row-retirement spec.md Q6, task T002 |
| Q056 | The final hand-over of this branch reaches main through a pull request, not a direct push. | Not stated. | None | goal.md log |
| Q057 | The write discipline misses on Devin and OpenCode are tracked for a separate packet and get no work in this one. | Not stated. | None | goal.md log |
| Q058 | This branch recaptures the routing corpus pin, so the pull request carries a pin that matches the corpus it merges. | Not stated. | None | goal.md log, commit 0238274ed8 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_0118hYavZnNv7m9JX2L1nuer:1 -->

Question:
```text
Updating cli-codex, cli-pi (plus pi extensions) and cli-opencode is a global install, which AGENTS.md §3 makes a stop-for-yes. Rollback: I record each current version first, and undo is reinstalling that exact version. Go ahead?
```

Options:
```text
Yes, update all (Recommended)
Show versions first
Skip updates
```

Answer:
```text
Yes, update all (Recommended)
```

### Q002
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01CFZ2SBG4F3zKpGgj5AoY3q:0 -->

Question:
```text
The pi update to 1.5.2 broke loading of the repo's own Pi extensions: the same command gives 0 load errors on pi 1.5.0 and 16 on 1.5.2 ("Cannot find module '../../.skilled/hooks/...'", the symlinked guards under .pi/extensions). Which pi version should run the research?
```

Options:
```text
Roll back to 1.5.0 (Recommended)
Keep 1.5.2, run anyway
Keep 1.5.2, drop Pi lineage
```

Answer:
```text
Cant we fix that somehow
```

### Q003
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01CFZ2SBG4F3zKpGgj5AoY3q:1 -->

Question:
```text
How should the 30 deep-research iterations be counted across the three executors (codex Luna max fast, pi DeepSeek V4.1 Flash max via LLM Gateway, opencode DeepSeek V4.1 Flash max via OpenCode Go)?
```

Options:
```text
30 total, 10 each (Recommended)
30 each, 90 total
30 total, weighted
```

Answer:
```text
30 total, 10 each (Recommended)
```

### Q004
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01D7RjCpk3wJXG4kS9UmCPxv:1 -->

Question:
```text
The main checkout's uncommitted pi edits appeared at 10:37 local time while my agent was working elsewhere. Whose are they?
```

Options:
```text
Mine or another session's
Unknown to me
```

Answer:
```text
Mine or another session's
```

### Q005
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01TWCBY7pprqA4mNeshhmJW4:0 -->

Question:
```text
A hook blocked the review dispatch: "subagent model fable is not permitted. Only opus or sonnet subagents may be dispatched while Fable drives the main loop." How should the fresh review of the research synthesis run?
```

Options:
```text
Fable via Claude Code CLI (Recommended)
Opus 5.5 high subagent
Both, then compare
```

Answer:
```text
Fable via Claude Code CLI (Recommended)
```

### Q006
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01KH7nVaPYVv1g4cAVVJzo7S:0 -->

Question:
```text
D1: When the advisor surfaces a command that writes tracked files the user asked for (22 commands, such as /speckit:plan or /create:readme), should the AI start it or ask first?
```

Options:
```text
Start it (Recommended)
Ask first
```

Answer:
```text
Start it (Recommended)
```

### Q007
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01KH7nVaPYVv1g4cAVVJzo7S:1 -->

Question:
```text
D2: For a skill mode that has a command (19 hub commands, such as sk-doc readme mode and /create:readme), should the command be the entry point whenever that mode is chosen?
```

Options:
```text
Yes, command is the entry (Recommended)
No, keep both paths
```

Answer:
```text
can we do 1 with skill flexibility
```

### Q008
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01KH7nVaPYVv1g4cAVVJzo7S:2 -->

Question:
```text
D3: How readily should the AI offer a deep loop (/deep:research, /deep:review, /deep:ai-council) to someone who is just chatting?
```

Options:
```text
Only on depth wording (Recommended)
On any research or review ask
Never unprompted
```

Answer:
```text
Only on depth wording (Recommended)
```

### Q009
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01KH7nVaPYVv1g4cAVVJzo7S:3 -->

Question:
```text
D4: Gate 4 in AGENTS.md still names the legacy bridge id command-spec-kit as a tiebreaker. Should it be retired once each /speckit command has its own row?
```

Options:
```text
Yes, retire it (Recommended)
Keep it
```

Answer:
```text
Yes, retire it (Recommended)
```

### Q010
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01KpyRFYdTZ5JebbKfZEHLfe:0 -->

Question:
```text
The research and review are done and your four decisions are recorded. What should happen next with the command-surfacing work?
```

Options:
```text
Plan the build (Recommended)
Commit the research first
Stop here
```

Answer:
```text
Plan the build (Recommended)
```

### Q011
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01KpyRFYdTZ5JebbKfZEHLfe:1 -->

Question:
```text
I read your D2 answer ('can we do 1 with skill flexibility') as: the command is the default entry for a hub mode, but the skill stays directly usable for partial work, such as fixing one README section, and when the user names the skill. Is that what you meant?
```

Options:
```text
Yes, that reading
Looser: AI picks freely
Something else
```

Answer:
```text
Looser: AI picks freely
```

### Q012
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01KpyRFYdTZ5JebbKfZEHLfe:2 -->

Question:
```text
D5: the 45th command, /local-skilled-alignment, is private and not tracked by git. Should the advisor surface it on your machine?
```

Options:
```text
No, exclude it (Recommended)
Yes, locally only
```

Answer:
```text
No, exclude it (Recommended)
```

### Q013
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01BbVFNh1PVbDx9XU6qybbRg:0 -->

Question:
```text
LOGIC-SYNC REQUIRED while planning phase 002. The review says to add a command-metadata.json to system-spec-kit (7 /speckit commands) and sk-prompt (/prompt:improve). But the repo's skill root metadata contract forbids that file on standalone skills, and both are standalone (the gate passes 14 of 14 today and would fail). Where should the risk class for these 8 commands live?
```

Options:
```text
Folder manifest (Recommended)
Amend the contract
Command frontmatter
```

Answer:
```text
Amend the contract
```

### Q014
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_013zY7wzzRNHczYV5rjQUXBZ:1 -->

Question:
```text
What should I do next on the command surfacing build?
```

Options:
```text
Plan phase 003 (Recommended)
Independent review first
Stop here
```

Answer:
```text
Plan phase 003 (Recommended)
```

### Q015
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_013zY7wzzRNHczYV5rjQUXBZ:2 -->

Question:
```text
Research packet 007 is still marked Draft because its continuity save was missing fields, which was my mistake and is a two-minute fix. Should I close it?
```

Options:
```text
Close it (Recommended)
Leave as Draft
```

Answer:
```text
Close it (Recommended)
```

### Q016
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_013zY7wzzRNHczYV5rjQUXBZ:3 -->

Question:
```text
Hub command risk classes follow the review's table, not a read of each workflow. The review flags /create:changelog --release and /design:extract as unchecked. Should I verify them?
```

Options:
```text
Verify the two flagged (Recommended)
Verify all 16
Leave as is
```

Answer:
```text
Verify all 16
```

### Q017
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_0112ZL1zL8yAz3kSnvmprbvj:0 -->

Question:
```text
Plain-chat reach is still 0 of 44 on holdout prompts and doctor requests do not reach a doctor command. You chose meaning-based matching as the fix. The existing semantic-lane packet (001-semantic-lane-enablement, five Draft phases) embeds skill descriptions only and scopes command rows out. Where should command-level matching be built?
```

Options:
```text
New phase in packet 008 (Recommended)
Extend packet 001
Park it
```

Answer:
```text
New phase in packet 008 (Recommended)
```

### Q018
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_0112ZL1zL8yAz3kSnvmprbvj:1 -->

Question:
```text
The v4.0.2.1 release is already tagged and published on GitHub, and its notes file now describes the command-surfacing work, which lives only on the unpushed worktree branch. What should happen to the published release?
```

Options:
```text
Leave it for the merge (Recommended)
Push branch and sync now
```

Answer:
```text
Leave it for the merge (Recommended)
```

### Q019
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01R51Kkdo6BaCwXFNC82u3he:0 -->

Question:
```text
The open-item fixes, the 27 recorded decisions and the phase 004 plan are uncommitted in the worktree. Full advisor suite passes (165 files, 1,411 tests) and all packet folders pass strict validation. Commit them?
```

Options:
```text
Two local commits (Recommended)
One local commit
Do not commit yet
```

Answer:
```text
Two local commits (Recommended)
```

### Q020
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_015Z3A9Rm4zY9kNYuLDFZqxU:0 -->

Question:
```text
Phase 004 is committed locally (17ddd306b3) and Complete. Phase 003 (plain-chat command reach) is still In Progress, only because its holdout row was unmet at 0 of 44. Phase 004 was built to answer that gap and reached 2 of 44 with real embeddings, which you accepted. How should phase 003 close?
```

Options:
```text
Close with the same accepted miss (Recommended)
Leave it In Progress
```

Answer:
```text
Close with the same accepted miss (Recommended)
```

### Q021
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_015Z3A9Rm4zY9kNYuLDFZqxU:1 -->

Question:
```text
Three phases of packet 008 are still unplanned scaffolds: 005 recommendation contract and brief (the hook brief finally prints the command), 006 Gate 2 binding in AGENTS.md and runtime pointers, 007 behaviour proof per runtime. What should I do with them?
```

Options:
```text
Plan 005 now, then ask (Recommended)
Plan and build 005 to 007
Stop here
```

Answer:
```text
Plan and build 005 to 007
```

### Q022
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_015Z3A9Rm4zY9kNYuLDFZqxU:3 -->

Question:
```text
I started the local Ollama server for the embedding measurements and it is still running. Meaning-based matching only works while it runs. What do you want?
```

Options:
```text
Leave it running (Recommended)
Stop it
```

Answer:
```text
Since when do we use embeddings modal
```

### Q023
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01U9wbcNqiczYfsfd15vBNYC:0 -->

Question:
```text
Correction first: I told you phase 003 (plain-chat command reach) was open only because of its holdout row. That was wrong. It has eight more unmet criteria, and I re-measured them today. Three are still fixable: one typed command (/create:agent) still ties with its own skill, four old spec-kit ids still sit in the Python compatibility list, and the prompt 'show me which packets mention the token cap' still reaches no command. Three are doctor rows whose phrases were reverted, where phase 004 now reaches 3 of 17 tune and 2 of 17 held-out doctor prompts with real embeddings. One is a one-time measurement-order miss. One asks you to judge that the doctor-only phrase gate was widened to every command. I recorded your holdout waiver and left the phase In Progress. How should phase 003 close?
```

Options:
```text
Carry three, settle five (Recommended)
Fix the three inside 003 first
Keep 003 In Progress
```

Answer:
```text
Carry three, settle five (Recommended)
```

### Q024
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01U9wbcNqiczYfsfd15vBNYC:1 -->

Question:
```text
You asked since when we use an embeddings model. Since spring, before this work: the advisor's meaning lane was added on 2026-04-20, real cosine was wired on 2026-05-13 and it counts toward the score at weight 0.05. The model is nomic-embed-text v1.5 through Ollama, pulled on this machine on 2026-05-17 and set as the advisor's embedder in your main checkout on 2026-07-22. Until this session it embedded skill descriptions only. New this session, from your answer 'Add meaning-based matching now': command rows get vectors too (phase 004). Both only work while Ollama runs. It was not running when I needed it, so I started `ollama serve` myself and it is still running. Without it the advisor silently falls back to phrase-only matching. What do you want with the server?
```

Options:
```text
Keep it until the build ends (Recommended)
Leave it running
Stop it now
```

Answer:
```text
We need to really harden the ux and ease of install and setup for external repo users if we add this running dependancy, also measure memory usage performance impact
```

### Q025
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01VsNTVTxZEPtQMLbNzZQS4P:0 -->

Question:
```text
Phase 005 (the brief prints the command) is planned: 53 tasks, validates. Question 1 of 4 for it. Four advisor command ids still use the old spelling (command-spec-kit-plan, -complete, -implement, -resume) and the Python fallback still has a dead /prompt row. How far should the id cleanup go? Anyone who matches on these ids in their own scripts is affected by a rename.
```

Options:
```text
Rename the four, drop /prompt (Recommended)
Rename everything
Rename nothing
```

Answer:
```text
Rename the four, drop /prompt (Recommended)
```

### Q026
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01VsNTVTxZEPtQMLbNzZQS4P:1 -->

Question:
```text
Phase 005, question 2 of 4. When the advisor daemon is down, the hook falls back to a simpler Python scorer (the degraded path). What may the brief show about commands in that state?
```

Options:
```text
Only a typed command (Recommended)
Never a command
Same as the live path
```

Answer:
```text
Only a typed command (Recommended)
```

### Q027
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01VsNTVTxZEPtQMLbNzZQS4P:2 -->

Question:
```text
Phase 005, question 3 of 4. /doctor:update has six actions with different risk (check runs, others ask or start). When the advisor surfaces /doctor:update without naming an action, which policy word should the brief print?
```

Options:
```text
The strictest: ask (Recommended)
No policy word
The check action's: run
```

Answer:
```text
The strictest: ask (Recommended)
```

### Q028
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_016LW2bw7asYGmZgsuEQrU3M:0 -->

Question:
```text
Phase 006 (the Gate 2 rule in AGENTS.md) is planned: 32 tasks, validates. Question 1 of 4. Which sentence goes into Gate 2? AGENTS.md has 755 bytes of room left. Every session on every runtime will read this line, so the exact text is yours to approve.
```

Options:
```text
Command beside the skill (Recommended)
Command first
```

Answer:
```text
Command beside the skill (Recommended)
```

### Q029
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_016LW2bw7asYGmZgsuEQrU3M:1 -->

Question:
```text
Phase 006, question 2 of 4. A dispatched worker session (a child, such as a DeepSeek worker through Pi) also gets an advisor brief. How should a child see a surfaced command? A child that starts /speckit:plan on its own would act outside its brief.
```

Options:
```text
Shown as parent-named only (Recommended)
Dropped from the child's brief
No brief for a child at all
```

Answer:
```text
Shown as parent-named only (Recommended)
```

### Q030
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_016LW2bw7asYGmZgsuEQrU3M:3 -->

Question:
```text
Phase 006, question 4 of 4. The advisor's runtime list still contains 'copilot', which Skilled no longer supports. Stored metrics records and tool input are validated against that list.
```

Options:
```text
Keep it, mark it retired (Recommended)
Drop it
```

Answer:
```text
Drop it
```

### Q031
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01BrBDYBivNJzGTHWZiAZ6PK:0 -->

Question:
```text
Phase 007 (behaviour proof per runtime) is planned: 46 tasks, validates. Question 1 of 4. It starts real sessions on your paid accounts and reads their transcripts to see whether the model started the surfaced command. Each runtime gets 24 chat prompts in two arms (before and after) plus 6 started-command runs. Which runtimes should run? Cursor cannot be measured in any option because its transcript reader is gated.
```

Options:
```text
All six, about 332 runs (Recommended)
Three, about 164 runs
Claude Code only, about 56 runs
All six, full prompt set, about 850 runs
```

Answer:
```text
All six, about 332 runs (Recommended)
```

### Q032
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01BrBDYBivNJzGTHWZiAZ6PK:1 -->

Question:
```text
Phase 007, question 2 of 4. The 'before' measurement must describe behaviour without the new brief and Gate 2 rule. When should it run? It has to happen before phase 005's code lands, or in a checkout of the older code.
```

Options:
```text
Now, on today's branch tip (Recommended)
Later, in a separate older checkout
Both today's tip and pre-phase-003
```

Answer:
```text
Now, on today's branch tip (Recommended)
```

### Q033
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01BrBDYBivNJzGTHWZiAZ6PK:2 -->

Question:
```text
Phase 007, question 3 of 4. To measure what a real chat user gets, the test sessions must start like a normal session and not as a marked child session. Two dispatch rules stand in the way: the OpenCode contract wants the child marker set, and the Claude Code contract forbids starting Claude Code from inside Claude Code. May the behaviour runs start each CLI like a chat user?
```

Options:
```text
Yes, run them like a chat user (Recommended)
No, keep the child marker
```

Answer:
```text
Yes, run them like a chat user (Recommended)
```

### Q034
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01BrBDYBivNJzGTHWZiAZ6PK:3 -->

Question:
```text
Phase 007, question 4 of 4. The research proposed a wording check on doctor lead phrases that would remove the phrase 'disable comment hygiene gate', which today leads with /doctor:git hooks. A pinned doctor test expects that command first. What should happen?
```

Options:
```text
Keep the phrase (Recommended)
Remove it as the research says
Skip this item
```

Answer:
```text
Keep the phrase (Recommended)
```

### Q035
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01PvQr5BsJTyRX4xWPDRX4T5:0 -->

Question:
```text
Your requirement on the Ollama dependency is planned as a new phase 008, embedder setup and cost: 43 tasks, validates. Question 1 of 4. For someone who installs Skilled into their own repository, is meaning matching optional or set up by default? Measured cost on your Mac: 274 MB on disk, 46 MB of memory idle and 421 MB with the model loaded, about 5 ms per prompt warm and about 310 ms extra on the first prompt after a 5 minute pause.
```

Options:
```text
Optional (Recommended)
Set up by default, behind a yes
Required
```

Answer:
```text
Set up by default, behind a yes
```

### Q036
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01PvQr5BsJTyRX4xWPDRX4T5:1 -->

Question:
```text
Phase 008, question 2 of 4. After the user says yes, may Skilled's doctor route itself start the Ollama server and pull the model, or should it only print the commands?
```

Options:
```text
Pull and start, never install (Recommended)
Print only
Also install Ollama
```

Answer:
```text
Pull and start, never install (Recommended)
```

### Q037
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01PvQr5BsJTyRX4xWPDRX4T5:2 -->

Question:
```text
Phase 008, question 3 of 4. Today the advisor says nothing when meaning matching is off. Where should the user see it?
```

Options:
```text
Doctor, status and JSON warning (Recommended)
Also one line in the first brief of a session
Doctor and status only
```

Answer:
```text
Doctor, status and JSON warning (Recommended)
```

### Q038
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01PvQr5BsJTyRX4xWPDRX4T5:3 -->

Question:
```text
Phase 008, question 4 of 4. How long may the advisor wait for the embedding of a prompt before it gives up and matches on phrases only? Today the adapter waits up to 5000 ms while the hook gives up at 2500 ms, so a hung server costs the whole brief. A cold model load took about 275 ms here.
```

Options:
```text
750 ms (Recommended)
1500 ms
Keep 5000 ms
```

Answer:
```text
750 ms (Recommended)
```

### Q039
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01BebHcDRDfsmedRhjfy9biL:0 -->

Question:
```text
One routing miss surfaced when I rebased onto main. The prompt 'fix the typo in the heading of the setup guide' should go to sk-doc. It ties three skills at the same score and sk-doc is not among the winners: before the rebase sk-code came first, now system-skilled-doctor does. No command is offered and no metric moved, so I re-captured the baseline to keep the suite green. It was a miss before this work too. What should happen with it?
```

Options:
```text
Fix it in phase 005 (Recommended)
Record it as a known limitation
```

Answer:
```text
Fix it in phase 005 (Recommended)
```

### Q040
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_017Mz9ELyva7g3JyAi4bTG6w:0 -->

Question:
```text
Claude Code shows the model 32 of the 44 tracked commands, because its twelve /create commands collapse into one entry. Research proposes a Claude-only create skill plus a managed .claude/skills tree to restore 44 of 44. Build it?
```

Options:
```text
Build it (Recommended)
Leave at 32 of 44
```

Answer:
```text
Build it (Recommended)
```

### Q041
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_017Mz9ELyva7g3JyAi4bTG6w:1 -->

Question:
```text
When the advisor daemon is unreachable, the fallback brief carries only a typed command (your earlier answer Q026). Research can now also carry the plain-chat command offer on that path. Change the earlier answer?
```

Options:
```text
Keep typed only (Recommended)
Carry plain offers too
```

Answer:
```text
Keep typed only (Recommended)
```

### Q042
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_017Mz9ELyva7g3JyAi4bTG6w:2 -->

Question:
```text
Two plain prompts about doctor checks route to the doctor family but to the wrong subcommand. Research proposes a default doctor subcommand for such prompts. Which policy do you want for the seven-subcommand doctor family?
```

Options:
```text
Offer /doctor:helper (Recommended)
Offer /doctor:setup
No default
```

Answer:
```text
Offer /doctor:helper (Recommended)
```

### Q043
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_017Mz9ELyva7g3JyAi4bTG6w:3 -->

Question:
```text
Review found the Gate 2 direct-call example in AGENTS.md (line 65) passes the request as an argument, where the safe form is --json - with the request on stdin. AGENTS.md is the shared framework document, so the edit is yours to allow. Make it?
```

Options:
```text
Yes, edit it (Recommended)
No, leave it
```

Answer:
```text
Yes, edit it (Recommended)
```

### Q044
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_01NEh67Bnm8XQ2MxG2RtV6nL:0 -->

Question:
```text
You approved a Claude-only create skill with a managed .claude/skills tree to show Claude all 44 commands. The planner found a smaller way to the same 44 of 44. Which design should phase 016 build?
```

Options:
```text
Flat command mirror (Recommended)
Managed skills tree
Accept 43 of 44
```

Answer:
```text
didnt we already symlink commands cross cli
```

### Q045
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_01NEh67Bnm8XQ2MxG2RtV6nL:1 -->

Question:
```text
You chose /doctor:helper for ambiguous doctor prompts. The narrow rule fixes one of the two rows. The wider rule fixes both but changes 8 other rows and breaks a doctor test. Which rule?
```

Options:
```text
Narrow cue (Recommended)
Wide rule
Copy the row wording
```

Answer:
```text
Narrow cue (Recommended)
```

### Q046
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_01NEh67Bnm8XQ2MxG2RtV6nL:2 -->

Question:
```text
Research found OpenCode runs were cut off by the time cap (8 of 24 runs) and its brief delivery cannot be proven without a receipt. Both fixes only pay off if another behaviour arm with OpenCode runs. Run one more arm in this packet?
```

Options:
```text
No more arms (Recommended)
One OpenCode-only arm
```

Answer:
```text
No more arms (Recommended)
```

### Q047
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_0192gGiFLy2tbPkzunEoKQgT:0 -->

Question:
```text
Commands are already symlinked to every CLI. Claude alone collapses the create folder because it holds a file named skill.md. Fix it by adding flat symlinks for Claude in the existing mirror sync?
```

Options:
```text
Add the flat symlinks (Recommended)
Managed skills tree
Leave it
```

Answer:
```text
skill.md? should be sk-skill i think right
```

### Q048
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_015CvLhRWQu9GrQ8D6BqVvnw:0 -->

Question:
```text
Rename /create:skill to /create:sk-skill (matching /doctor:sk-skill), or keep the name and add flat symlinks for Claude?
```

Options:
```text
Rename to /create:sk-skill (Recommended)
Rename, keep old name as alias
Keep name, add flat symlinks
```

Answer:
```text
cgecj if name is correct and command in skilled used that, and check if claude just had bug
```

### Q049
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_01XTE6oDiK3mnHjfFKA23YD8:0 -->

Question:
```text
The collapse is an open Claude Code bug triggered by any command file named skill.md. How should phase 016 get Claude to list all 44 commands?
```

Options:
```text
Rename to /create:sk-skill (Recommended)
Rename, keep typed alias
Claude-only workaround
Wait for the upstream fix
```

Answer:
```text
Rename to /create:sk-skill (Recommended)
```

### Q050
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_01Tz2cLhFK3x3TJ9KK6nhYPf:0 -->

Question:
```text
The hand-over was deferred by two running planner agents and then withdrawn by your prompt. Context is near 81 percent. How should I continue?
```

Options:
```text
Wait for planners, then hop (Recommended)
Hop now
Stay in this session
```

Answer:
```text
Wait for planners, then hop (Recommended)
```

### Q051
<!-- source: claude:d3d370d4-5963-4512-aba8-e562cf2a5942:toolu_01Lk9b8JvXTfnyb9JdERqL9Z:0 -->

Question:
```text
Renaming /create:skill to /create:sk-skill is a breaking command change in the sk-doc hub, which sits at version 2.9.13.0. How should the changelog record it?
```

Options:
```text
sk-doc v3.0.0.0 (Recommended)
sk-doc v2.10.0.0
Release note only
```

Answer:
```text
sk-doc v2.10.0.0
```

### Q052
<!-- source: claude:96fe92f2-be24-4324-9bfc-fe4422c8760b:toolu_01Aha9iWD3dJsBNnseHacxqM:0 -->

Question:
```text
Codex never received an advisor brief in any behaviour run, because its hooks are not approved for arena paths. Its start rate reads 0 of 12 before, 0 of 12 after and 'not measurable' in the final arm. You already chose no more behaviour arms. How should Codex be closed in the behaviour summary?
```

Options:
```text
Accept not measurable (Recommended)
Approve hooks, run one arm
```

Answer:
```text
Approve hooks, run one arm
```

### Q053
<!-- source: claude:96fe92f2-be24-4324-9bfc-fe4422c8760b:toolu_01Aha9iWD3dJsBNnseHacxqM:1 -->

Question:
```text
Gate 2 in AGENTS.md tells the model what to do when the advisor brief names a command. Research segment two (rank 14) proposed one more clause for a brief that names a skill and no command. AGENTS.md is your shared framework document, and with no further behaviour arm the effect of the clause cannot be measured in this packet. Add the clause?
```

Options:
```text
No, decline it (Recommended)
Yes, add the clause
```

Answer:
```text
No, decline it (Recommended)
```

### Q054
<!-- source: claude:96fe92f2-be24-4324-9bfc-fe4422c8760b:toolu_01Aha9iWD3dJsBNnseHacxqM:3 -->

Question:
```text
The committed file runtime/scripts/skill-graph.json of the skill advisor holds the full text of one sealed holdout prompt (row suppressed-codex-abstain). It predates this packet. A holdout row whose text sits in a file the scorer reads is no longer out of sample. What should happen with that row?
```

Options:
```text
Retire it in a follow-up (Recommended)
Retire it in this packet
Leave it
```

Answer:
```text
Retire it in this packet
```

### Q055
<!-- source: claude:96fe92f2-be24-4324-9bfc-fe4422c8760b:toolu_01SPbc8BUY636UxECgiAonvL:0 -->

Question:
```text
Planning the holdout retirement found more than the one row you chose to retire (suppressed-codex-abstain). A count-only leak scan shows two more sealed rows whose one- or two-word prompts also appear in committed data files (P1-ABSTAIN-001, P1-PHRASE-001), and six sealed rows whose text appears only in hand-written scorer rules. No command holdout row hits. Which rows should phase 018 retire?
```

Options:
```text
Only the one row (Recommended)
The one row plus the two short rows
All nine rows
```

Answer:
```text
Only the one row (Recommended)
```

### Q056
<!-- source: claude:96fe92f2-be24-4324-9bfc-fe4422c8760b:toolu_01SPbc8BUY636UxECgiAonvL:1 -->

Question:
```text
On 2026-11-13 the 35 commits of this packet were pushed straight to main on your instruction, which bypassed main's branch rules (pull request, required check, verified signatures) as the owner. The branch will be handed back unpushed again at the end. How should the final hand-over of this branch reach main?
```

Options:
```text
Through a pull request (Recommended)
Direct push again
```

Answer:
```text
Through a pull request (Recommended)
```

### Q057
<!-- source: claude:96fe92f2-be24-4324-9bfc-fe4422c8760b:toolu_01Aha9iWD3dJsBNnseHacxqM:2 -->

Question:
```text
In the final behaviour arm, Devin and OpenCode edited a guessed file when asked for an edit that names no file, and OpenCode wrote a new spec folder after an ask offer. A brief cannot fix either, so it is write discipline on those two runtimes and outside command surfacing. What should happen with it?
```

Options:
```text
Track for a separate packet (Recommended)
Drop it
```

Answer:
```text
Track for a separate packet (Recommended)
```

### Q058
<!-- source: claude:b2f21765-98d5-42ba-9b2c-af31769e43e6:toolu_01CMWF7yxaqJC7B2a8zXhmuq:0 -->

Question:
```text
Another session relayed that you chose this 008 session to recapture the routing corpus pin (routing-baseline.json in the system-deep-loop drift-guard packet) on the 008 branch, so the pull request carries a matching pin. Should I do that after my rebase?
```

Options:
```text
Yes, recapture on 008 (Recommended)
No, leave the pin alone
```

Answer:
```text
Yes, recapture on 008 (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---

<!-- ANCHOR:planner-decisions -->
## Planner Decisions, 2026-11-14

These were taken by the dispatched planner that wrote phases 020 to 023 after the alignment reviews of 2026-11-14. None is an operator decision. Each stays open for the operator to overturn, and none reverses an entry above.

| ID | Decided | Why | Open to overturn | Carried by |
|----|---------|-----|------------------|------------|
| P001 | Phases 020 to 023 are Level 2, where `recommend-level.sh` printed Level 1 for each. | The dispatch requires `acceptance-criteria.md` as the closure gate, and that document is scaffolded from Level 2. | Yes | Each phase spec, Open Questions |
| P002 | Four phases split by file ownership. 020 and 021 share no file and run side by side. 022 runs after 019 and 021, and 023 runs after 020, 021 and 022, because 022 and 023 edit the transcript scorer and its README in turn. | A finding is fixed where its code lives, and two phases never edit one file at once. A first task in 022 and in 023 stops until the earlier phase is committed. | Yes | Parent spec phase map and handoff rows |
| P003 | The goal objective names delivery as the means of the outcome. Criterion 1 reads every phase folder. The review and alignment criteria are one line. A new criterion names the followed rate with its range, the sealed reach and fit counts and the operator's target or waiver. | Review finding B-4: the criteria could close green with models improvising, and criterion 1 named eight phases of twenty-three. The count of criteria stays at seven. | Yes | `goal.md` sections 1 and 3 |
| P004 | Three template `FILL` comments above the goal log were removed to hold the durable slice at 3,954 of 4,000 characters. Decisions D1 to D7 keep their wording. | The four binding rows and the new criterion did not fit, and the comments carry no directive. | Yes | `goal.md`, `packet_budget=ok` |
| P005 | Binding rows are added for 020 to 023 only. Phases 009 to 019 keep no row and the goal checker keeps its finding for them. | Those phases have no `goal.md`, the planner may not edit a closed phase and eleven rows do not fit the slice. | Waits on the operator | Goal log row "Goal check after the amendment" |
| P006 | Finding A-5 is fixed in part. A weak doctor cue needs the stronger bar. Two probe prompts still draw a doctor command after the fix. | The ranker scores them 10.009 and 9.761, inside the range real toolkit problems score (7.491 to 23.471). Raising a bar to move two probes would be tuning on the probes. | Yes | 020 spec, Out of Scope |
| P007 | The `run` policy of an add-only doctor command on a request that allows a change is left as it is. | The policy derives from the risk class the inventory phase fixed, and this plan does not reopen it. The no-edit half of finding A-6 is fixed. | Yes | 020 spec, Out of Scope |
| P008 | Finding B-10 is not planned. | It did not reproduce: the head reads `use sk-doc → /create:agent (start)` on both the Claude hook and the OpenCode plugin, the owning skill first. | Yes, with a prompt that reproduces it | 021 spec, mechanism table |
| P009 | The fallback head `Advisor: no skill matched.` still counts as a delivered brief. | A fallback head that reached the session is a delivery, and its offer is recorded as null. The partner and tool-result parts of finding A-11 are fixed. | Yes | 022 spec, mechanism table |
| P010 | A run on an ask row that asked and wrote nothing counts in the new `followedRate` and never in `loadRate`. | The ask policy tells the model to offer the command in one question and wait, so asking is the policy's own step. A reader who disagrees still has the unchanged load rate. | Yes | 022 spec, Open Questions |
| P011 | The sealed fit rows are written by one worker that sees no phrase table and scores no draft, and are frozen after their first capture. | A fit row chosen by its result is a tuned row. The operator may replace the set with requests from real use before the capture. | Yes, before 023 task T006 runs | 023 spec, Open Questions, and 023 goal D2 |
| P012 | No phase builds a behaviour arm, sets a target, rewords the brief head, edits `AGENTS.md` or raises the sealed reach. Each is logged as waiting on the operator with options and a recommendation. | Each would reverse or bypass an operator decision in force: no more behaviour arms, the approved Gate 2 wording, and the follow-up logged for holdout reach. | Waits on the operator | Goal log rows of 2026-11-14 |
| P013 | Goal criterion 6 ends with: this log states for each a target and whether the printed value meets it, or states the outcome as not shown with the item waiting on the operator. It replaces the clause that needed the operator's target or waiver. Taken by the coordinator after the plan verification of 2026-11-14. | The earlier clause could not be met without an operator answer, which D1 rules out, while the original criteria could close with items logged as waiting. The new clause still cannot close silent: the log must hold a met target or the words not shown. | Yes. The operator set the criteria, so the whole criteria amendment of P003 and this entry stay open for the operator to overturn | `goal.md` section 3 and the goal log row of the same date |
| P014 | P008 is reworded. For finding B-10 the row order reproduces, the rendered head already names the skill first, and the rest is B-5. | The returned list holds `create:agent 0.8235` above `sk-doc 0.8924`, and the head reads `use sk-doc → /create:agent (start)` on both paths. What is left is how the head words the command, which waits on the operator as B-5. | Yes | 021 spec, mechanism table, and the phase map row 21 |
| P015 | The OpenCode plugin sends `compiledRouteTopOnly`, the request option every hook already sends. This reverses the 021 line that left the plugin's request shape out of scope. | The head-row fix does not reach the partner of an ambiguous head: four probe prompts printed a partner with a command on OpenCode and none on Claude, or the reverse. One option that already exists makes both paths ask the same question. | Yes | 021 tasks T014, 021 goal D1 |
| P016 | `loadRate` keeps every owned scored run in its denominator, which phase 022 widens to the six path counts. This is the one existing summary expression a later phase edits, and it is planned in 022 because phase 019 is closed to the planner. | Phase 022 names some runs `asked` or `otherMode`. Left alone, those runs would leave the phase 019 denominator and undo its fix for finding A-1. The count identity now checks both rates. | Yes | 022 tasks T009 and `SUMOK` |
| P017 | The small-edit gate covers correction wording only. An edit that names no correction word, an app problem that scores above the doctor bar and a no-change wording the no-edit pattern does not hold are named as classes and not planned. | Each reproduced by a probe. Telling an edit from a request to write a document, or a foreign project from the toolkit, needs the matching change the operator logged for a follow-up, and widening a word list to move the probes would be tuning on them. | Yes | 020 spec, Out of Scope |
| P018 | The purpose review's step-level check on a sample of stored runs is not planned. It waits on the operator with options and a recommendation. | Whether a run executed the workflow's own steps needs a rubric per command and a reader, human or model, and no committed script can print it. A model reader over stored sessions is a model run, which D5 and the no more arms answer keep with the operator. | Waits on the operator | Goal log row of 2026-11-14 |
| P019 | Tasks that changed several functions are split so each changes one function, or one private helper and the one call that is its only test surface. A task that writes a test case and the function it covers keeps both files. New tasks take the next free id and no existing id is renumbered. Taken by the coordinator. | The workers are DeepSeek v4.1 flash max, which hold one literal change at a time. Test first in one task is the shape phases 014 and 017 used. | Yes | 020 T017 and T018, 021 T014, 022 T020 to T028, 023 T016 to T021 |
| P020 | Phase 020 recaptures `command-routing-baseline.json`, a committed baseline its scope boundary left out. Taken by the coordinator at the phase gate. | The slice test failed only on rows sv-09, sv-11 and sv-12, each a question about a command, which this phase stops offering a command on by design. The full suite cannot reach 0 failed without the recapture, and no other row moved. | Yes | 020 `scratch/after.txt`, `implementation-summary.md` |
| P021 | The uncertainty bar on meaning matches stays, although the real-embedding sealed plain count fell from 5 to 4 of 44. Taken by the coordinator. | Removing the bar returned the count to 5 and removing the weak-cue bar did not, so the bar is the cause. The phase task says a lower real count does not block, every fixture floor held, and the bar withholds a command the scorer is unsure of, which is the false-offer guard the phase exists for. | Yes | 020 `scratch/after.txt`, `DROP` and `cause` lines |
| P022 | The mention reader ends a sentence only at `.`, `!` or a line break. `quick question? is /speckit:resume safe to run twice` and `ok, is /speckit:plan enough here` read as requests. Taken by the coordinator. | Both follow the sentence-end set the task named, and the Opus check found no case the change broke. Adding `?` and `,` would be a new rule with no reproduction from real use. | Yes, with a real prompt that reproduces it | 020 `tasks.md` T028 evidence |
| P023 | Phase 022 T005 keeps three confirm stems the task line did not name, `design:chart`, `design:diagram` and `design:extract`, and the task line is amended to match. Taken by the coordinator after the Opus check failed the task on scope. | The task's own guard case reads every `-confirm.yaml` under the command assets and failed on `design/assets/chart-confirm.yaml`, because the design commands name their confirm workflow without the namespace (`.skilled/commands/design/chart.md`). The rows are true to disk, and no stored run of the three arms names a design command, so no stored score moves. Removing them would leave the guard red. | Yes | 022 `tasks.md` T005, check report in `scratch/verify/` |
| P024 | A question mark ends a sentence in the mention reader, so a bare ask word that follows one opens a question about the command. This supersedes P022 for the question mark. A comma stays out of the sentence-start set. Taken by the dispatched planner that wrote phases 024 and 025 after the Fable 5.2 review of 2026-11-14, as are P025 to P031. | The review reproduced it: `quick question? is /speckit:resume safe to run twice` returned `/speckit:resume` (start), and the planning probe printed `shipped=false` for it. A question mark ends a sentence in any grammar, so the edit is no tuning, and the guard `is this right? run /speckit:plan` stays a request. P022's own condition was a prompt that reproduces it. A comma ends a clause, and no prompt reproduced the comma form. | Yes | 024 tasks T008, 024 `scratch/planning/probe-mention-reader.before.txt` |
| P025 | Phases 024 and 025 are Level 2, where `recommend-level.sh` printed Level 1 for each. | The same reason as P001: `acceptance-criteria.md` is the closure gate, and it is scaffolded from Level 2. | Yes | Each phase spec, Open Questions |
| P026 | Rows sv-09, sv-11 and sv-12 keep their `expected_command`. No build task relabels them. The routing-accuracy README states the three designed withholds, and the relabel waits on the operator with options and a recommendation. | The capture counts a slash-variant row with no expected command as a row that must stay silent, so a relabel moves the false-offer floor from 0 of 35 to 0 of 38, and completion criterion 2 quotes 35. That criterion is the operator's. A relabel would also file a full command name under partial mentions, a different class, while phase 023 counts questions about a command on sealed `decline` rows. Consumers checked: the capture and its committed baseline, `command-routing-slice.vitest.ts`, the transcript scorer's row labels, the behaviour runner, `measure-brief-cost.mjs` and two handler and scorer tests. | Waits on the operator | 024 spec, Open Questions and mechanism table |
| P027 | A search with `rg` or `grep` over a workflow document is not a load, a line inside a heredoc is not a command and a bare document name is read in the folder an earlier `cd` of the same command entered. | A search prints the lines that match a word, and the measure counts a workflow that was opened. The probe found two stored loads that rest on a search alone, one stored heredoc line and one stored `cd` then bare name, of 175 owned runs. Each count that moves is named in the rescore delta, and no rule is bent toward a better score. | Yes | 024 tasks T012 to T014, 024 `scratch/planning/probe-shell-read-rule.before.txt` |
| P028 | Three items carried from the task checks get no code: the OpenCode plugin always sending `skillLabel`, the Claude hook's `skillLabelFor` falling back to the first row, and the plugin test with a wall-clock bound. | None produced a wrong output in a probe. The renderer printed the same head with and without the label, because only a hub is marked as needing a mode and a hub owns itself. A wrong label needs a first row below the bars, and 0 of 10 CLI rows were below them, which agrees with the coordinator's row-0 probe. The timing test passed 20 of 20 runs, and a flake fix was in scope only if the flake could be shown. | Yes, with an output that shows the defect | 024 spec, mechanism table, and 024 `scratch/planning/` |
| P029 | The Codex reader keeps the body of a custom tool call as `arguments.input` and the transcript scorer reads the shell commands out of it. One `exec` call stays one shell step whose command holds its `cmd` strings one per line. | The reader is shared with the history lookup, four hooks and one plugin, whose contract calls tool arguments opaque, so the record keeps its shape and gains one key. What counts as a command is the scorer's question. One step per call keeps the change to one helper and one call, at the cost that a body holding a gate lookup and a task command reads as a gate step, which the README states. | Yes | 024 tasks T009 and T011, 024 plan, affected surfaces |
| P030 | Phase 025 extends the open changelog entry v1.1.0.0 and writes no new version. The root Skilled release note is not touched and waits on the operator. | `origin/main` ships advisor version 1.0.0.0, so 1.1.0.0 has not shipped and the changelog mode extends an open entry. The operator's choice to amend the root note was made for phases 014 to 018, and an approval for one change does not carry to the next. | Waits on the operator for the root note | 025 spec, Open Questions |
| P031 | No binding row is added to the parent goal for phases 024 and 025, and no completion criterion is changed. | The durable slice is 3,992 of 4,000 characters and two rows need about 98. Making room means shortening a decision the operator froze. Both phases carry their own `goal.md`, which a worker reads before the phase. | Waits on the operator, with P005 | Goal log row of 2026-11-14, `packet_budget=ok` at 3,992 |
| P032 | The plugin timing test gets a fix after all, as phase 024 task T024, and P028 no longer covers it. The test checks the timers the plugin scheduled and keeps a loose wall-clock bound. | P028 asked for an output that shows the defect. Phase 024 T002 showed it: 2 of 20 runs failed with `expected bounded timeout, got 370ms` while worker lanes ran. The plugin schedules its kill at the configured deadline, and a busy machine fires timers late, so the wall-clock bound tested load and not the budget. | Yes, autonomous under D1 | 024 tasks T002 and T024 |
<!-- /ANCHOR:planner-decisions -->
