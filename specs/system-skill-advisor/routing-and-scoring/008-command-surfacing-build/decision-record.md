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

<!-- /ANCHOR:operator-answers-verbatim -->
