# Iteration 013 - Recovery replay: R5-P1-001 (correctness)

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Trigger: the convergence check after iteration 12 returned STUCK_RECOVERY (stuckThresholdReached, two iterations with no new finding) with every frontier node answered. Recovery changes approach: instead of another node pass, this iteration replays the one active P1 adversarially against its own downgrade trigger and checks the shape a correct fix must take.
- Review focus addressed: hook fail-open behavior and fix completeness for the only blocker-class finding.
- Sources: steer.md absent; strategy; conv-012 stop decision.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:490-500` (gitTopLevelOrNull strips GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_PREFIX)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5862-5870` (stagedUnownedChanges top-level probe and staged listing)
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:148-170`; `git -C barter/ai-speckit config --get core.hooksPath` -> `skilled/.opencode/scripts/git-hooks` (shared by every worktree of the repository)
- `barter/ai-speckit/AGENTS.md:222` (workspace rule offering "A) Create a git worktree")
- iteration 5 probe a (hook env in a linked worktree: GIT_DIR absolute, GIT_INDEX_FILE absolute; main checkout: no GIT_DIR, GIT_INDEX_FILE=.git/index)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R5-P1-001 replayed and kept at P1 (see below).

### P2 Findings

None.

## Replay of R5-P1-001

- Downgrade trigger ("ai-speckit commits never run from a linked worktree"): not met. ai-speckit's AGENTS.md makes a git worktree one of the two workspace choices every git-workspace trigger offers (`barter/ai-speckit/AGENTS.md:222`), and core.hooksPath is repository config, so the Barter commit hook runs in every linked worktree with the GIT_DIR git exports there.
- Second trigger ("the hook path clears GIT_DIR before calling the engine"): not met; `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:156-164` passes the environment through.
- Counter-check (status runs first and might fail): done at iteration 6; status exits 0 under the same environment.
- Verdict: P1 confirmed, confidence 0.85 unchanged.

## Fix-Shape Note (for the remediation plan, not a finding)

- Reusing gitTopLevelOrNull as-is would also drop GIT_INDEX_FILE. For `git commit <paths>` and `git commit -a`, git runs the hook against a temporary index named by GIT_INDEX_FILE, so a check that drops it reads the wrong index and can judge a different staged set. A fix needs the top level found without GIT_DIR while the staged listing still reads the hook's index; in the main checkout that index path is relative (`.git/index`) and must be resolved against the repository root before the working folder changes.
- A regression test belongs beside `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:858` (R9-P2-001), running pre-commit with GIT_DIR set and a staged unowned edit.

## Traceability Checks

- spec_code: pass. The replay finds no code or doc that contradicts the P1.

## Edge Cases

- ai-speckit's HEAD moved during this review to eaf819282a3 (five later commits: tests and docs for the Pi default and Vibe mirrors, and a record of open items). They sit outside the reviewed range 64cfee51628..e63bd038a5d and do not touch the commit hook or the engine.

## Confirmed-Clean Surfaces

- None new.

## Ruled Out

- R5-P1-001 as unreachable in practice: worktrees are a documented ai-speckit workspace.

## Next Focus

- Dimension: none
- Focus area: synthesis if the convergence check allows it
- Reason: every node answered, recovery replay complete
- Rotation status: complete
- Required evidence: stop decision after this iteration

Review verdict: CONDITIONAL
