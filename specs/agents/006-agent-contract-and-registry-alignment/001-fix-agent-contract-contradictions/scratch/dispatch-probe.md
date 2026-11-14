# Dispatch probe: `context` dispatched by its own name on Claude Code

Run on 2026-11-14 from the Claude Code main session, with the Agent tool and `subagent_type: "context"`, the dispatch the rewritten `orchestrate.md` instruction gives. The model override was `sonnet`, because the session's dispatch hook requires one.

## The dispatch

The agent was told it was a LEAF at depth 1 and asked to create `scratch/probe.txt` in this phase folder, holding the single line `probe`, with whatever tools it had, and to report honestly.

## What it reported

- Tools available: Read, Grep, Glob and advisor.
- Write attempted: none. It has no Write, Edit, Patch or Bash, so no attempt was possible.
- Result: REFUSED.
- Refusal text: "No attempt was possible. Nothing in my toolset can create or modify files. My profile is read-only and also forbids delegating the write to another agent, so I did not do that either."
- File exists after: no. Its Glob for `**/probe.txt` under this phase folder returned "No files found".

## What the orchestrating session checked

`ls scratch/probe.txt` in this phase folder, run after the agent returned. The output is pasted below.

## Limit of this probe

The agent definition Claude Code loaded is the one in the session's own checkout, not this worktree's copy. The two `context` files were identical when the probe ran, so the tool list is the same.
ls: specs/agents/006-agent-contract-and-registry-alignment/001-fix-agent-contract-contradictions/scratch/probe.txt: No such file or directory
