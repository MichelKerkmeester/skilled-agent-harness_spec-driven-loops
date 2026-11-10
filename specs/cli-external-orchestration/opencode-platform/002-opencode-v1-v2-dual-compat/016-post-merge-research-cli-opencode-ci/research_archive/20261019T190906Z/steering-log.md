# Steering Log - post-merge research (cli-opencode, doctor and CI)

Orchestrator-owned record of each iteration focus. Angle ids continue the A1-A17 numbering of the original run in `../../research/steering-log.md`; this sibling runs A24-A25 (cli-opencode, doctor and CI) in parallel with phase 014.

## Entry 24 (iteration 1)

- Angle: A24
- Focus: A24 cli-opencode docs and flag drift: where do `.skilled/skills/cli-external-orchestration/cli-opencode/` (SKILL.md, references, assets) and its dispatch code disagree with OpenCode 1.19.3 (`opencode`) and 2.0.32 (`opencode2`) as installed on this machine? Compare every documented flag, subcommand and dispatch shape against `opencode --help`, `opencode run --help`, `opencode2 --help` and `opencode2 run --help`, and the version detection in the deep-loop runtime (`.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`). Output: a drift table (doc claim, installed reality, file:line, severity) labelled confirmed or documented. Check: run the help commands only; never start, stop or restart any OpenCode service or server (PID 46220 is shared), never run `opencode upgrade`, and never edit files outside this research packet.

### Dispatch stopped (iteration 1, not a model fault)

The first dispatch (`research-i1-g1`) was stopped by the orchestrator before it completed: it shared one worktree with four other lineages, and the 014 and 015 dispatches had already failed write containment on each other's files. No iteration record was written. This packet then moved into its own worktree (`.worktrees/151-post-merge-research-cli-opencode-ci`) and iteration 1 reruns there.
