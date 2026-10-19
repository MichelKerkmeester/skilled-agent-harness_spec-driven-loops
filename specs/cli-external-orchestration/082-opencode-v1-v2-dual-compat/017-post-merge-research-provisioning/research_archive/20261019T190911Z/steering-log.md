# Steering Log - post-merge research (provisioning and the adapter suite runner)

Orchestrator-owned record of each iteration focus. Angle ids continue the A1-A17 numbering of the original run in `../../research/steering-log.md`; this sibling runs A27 (provisioning and the adapter suite runner) in parallel with phase 014.

## Entry 27 (iteration 1)

- Angle: A27
- Focus: A27 worktree provisioning and the adapter suite runner: what can still fail, drift or mislead in `.skilled/skills/sk-git/scripts/worktree-naming.sh` (`provision_worktree`, `_wn_deps_satisfied`, the bun and npm choice, the build step), `worktree-provision-paths.txt`, `tests/worktree-naming.test.sh`, and the dispatch adapter suite runner documented in `specs/hooks/024-dispatch-adapter-test-repair/` and `.skilled/hooks/vitest.config.ts`? Check whether every provisioned tree on main is listed, whether a lockfile change or a missing bun is handled, whether the documented runner commands match `.skilled/hooks/` docs and package scripts, and whether CI runs these suites with the owning runner. Output: a ranked finding list with file:line evidence labelled confirmed, documented or inferred. Check: run `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` and read-only greps; never create or remove worktrees and never edit files outside this research packet.

### Dispatch stopped (iteration 1, not a model fault)

The first dispatch (`research-i1-g1`) was stopped by the orchestrator before it completed: it shared one worktree with four other lineages, and the 014 and 015 dispatches had already failed write containment on each other's files. No iteration record was written. This packet then moved into its own worktree (`.worktrees/152-post-merge-research-provisioning`) and iteration 1 reruns there.
