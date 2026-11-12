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

<!-- /ANCHOR:operator-answers-verbatim -->
