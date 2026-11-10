# Steering Log - post-merge research (sk-code-skilled and sk-doc conformance)

Orchestrator-owned record of each iteration focus. Angle ids continue the A1-A17 numbering of the original run in `../../research/steering-log.md`; this sibling runs A28-A29 (sk-code-skilled and sk-doc conformance) in parallel with phase 014.

## Entry 28 (iteration 1)

- Angle: A28
- Focus: A28 sk-code-skilled conformance: which code files changed by the four branches merged to main on 2026-10-19 miss the sk-code-skilled contract? List the changed code with `git log --name-only` over the merge commits `fe1f8a9a53`, `8e8e95e8e6`, `6358d81eba` and their branch commits (OpenCode plugins and `.opencode/plugins/lib/v2-bridge.js`, sk-vision `vision-runtime/src`, cli-opencode and deep-loop runtime scripts, doctor scripts, `.pi/extensions/pi-fast-mode-w-subagent-support/src`, `.skilled/skills/sk-git/scripts/worktree-naming.sh`). Load `.skilled/skills/sk-code/SKILL.md` and its skilled-mode references, then check file headers, section dividers, naming, comment hygiene (no spec paths or ids in comments), error handling and test coverage. Output: a per-file conformance table with file:line evidence and severity. Check: run any drift guard sk-code ships read-only; never edit files outside this research packet.

### Dispatch stopped (iteration 1, not a model fault)

The first dispatch (`research-i1-g1`) was stopped by the orchestrator before it completed: it shared one worktree with four other lineages, and the 014 and 015 dispatches had already failed write containment on each other's files. No iteration record was written. This packet then moved into its own worktree (`.worktrees/153-post-merge-research-conformance`) and iteration 1 reruns there.
