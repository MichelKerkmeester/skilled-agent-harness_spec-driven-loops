# Steering Log - post-merge research (provisioning and the adapter suite runner)

Orchestrator-owned record of each iteration focus. Angle ids continue the A1-A17 numbering of the original run in `../../research/steering-log.md`; this sibling runs A27 (provisioning and the adapter suite runner) in parallel with phase 014.

## Entry 27 (iteration 1)

- Angle: A27
- Focus: A27 worktree provisioning and the adapter suite runner: what can still fail, drift or mislead in `.skilled/skills/sk-git/scripts/worktree-naming.sh` (`provision_worktree`, `_wn_deps_satisfied`, the bun and npm choice, the build step), `worktree-provision-paths.txt`, `tests/worktree-naming.test.sh`, and the dispatch adapter suite runner documented in `specs/hooks/024-dispatch-adapter-test-repair/` and `.skilled/hooks/vitest.config.ts`? Check whether every provisioned tree on main is listed, whether a lockfile change or a missing bun is handled, whether the documented runner commands match `.skilled/hooks/` docs and package scripts, and whether CI runs these suites with the owning runner. Output: a ranked finding list with file:line evidence labelled confirmed, documented or inferred. Check: run `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` and read-only greps; never create or remove worktrees and never edit files outside this research packet.

### Dispatch stopped (iteration 1, not a model fault)

The first dispatch (`research-i1-g1`) was stopped by the orchestrator before it completed: it shared one worktree with four other lineages, and the 014 and 015 dispatches had already failed write containment on each other's files. No iteration record was written. This packet then moved into its own worktree (`.worktrees/152-post-merge-research-provisioning`) and iteration 1 reruns there.

## Executor switch (restart to generation 2)

The operator switched the executor to GLM 5.3 flash because llmgateway kept returning HTTP 500 and request timeouts for deepseek-v4.1-flash, opencode-go was over its usage limit and cline-pass returned 403. The session held no completed iteration, and its config pins the executor model, so it was restarted through the workflow's `restart` branch: the empty generation 1 moved to `../research_archive/20261019T190911Z/`, and this generation runs on cli-pi `glm-5.3-flash` (llmgateway, thinking max). Foci and angle ids are unchanged.

## Entry 27 (iteration 1)

- Angle: A27
- Focus: A27 worktree provisioning and the adapter suite runner: what can still fail, drift or mislead in `.skilled/skills/sk-git/scripts/worktree-naming.sh` (`provision_worktree`, `_wn_deps_satisfied`, the bun and npm choice, the build step), `worktree-provision-paths.txt`, `tests/worktree-naming.test.sh`, and the dispatch adapter suite runner documented in `specs/hooks/024-dispatch-adapter-test-repair/` and `.skilled/hooks/vitest.config.ts`? Check whether every provisioned tree on main is listed, whether a lockfile change or a missing bun is handled, whether the documented runner commands match `.skilled/hooks/` docs and package scripts, and whether CI runs these suites with the owning runner. Output: a ranked finding list with file:line evidence labelled confirmed, documented or inferred. Check: run `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` and read-only greps; never create or remove worktrees and never edit files outside this research packet.

### Digest (iteration 1, generation 2)

A27 done (ratio 0.95). P1: `worktree-provision-paths.txt` misses five tracked package trees, including both `.pi` extensions (F1). P2: nothing guards list completeness (F2); lockfile drift fails but is untested (F3); the adapter suites and hooks vitest tree have no CI job (F5). P3: `bun.lockb` falls to npm (F4); a vanished manifest is skipped silently (F7). The owning-runner suites pass 58/58 and the naming suite 97/0. Angle complete; synthesis next.
