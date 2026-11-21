# Iteration 016 - Test strength against the pre-fix engine, and P1 record repair (correctness)

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Focus: two items left open. (1) Node F-1-001 asks whether the new mid-loop failure tests fail without the fix; iteration 1 answered from reading, not from a run. (2) Iteration 15's P1 refinement did not reach the registry: its claim packet carried a `type` field that overwrote the delta row's `type:"finding"`, so the reducer skipped the row and R5-P1-001 still reads P2. The delta is write-once, so the refinement is re-recorded here with the packet's kind under `claimType`.
- Review focus addressed: test strength and rollback correctness; registry integrity for the only blocker-class finding.
- Sources: steer.md absent; strategy; registry.

## Files Reviewed

- `git show 3aab896957e^:.skilled/commands/doctor/scripts/overlay-engine.cjs` (engine before the rollback fix), run with copies of `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` and its fixtures inside this lineage's prompts/prefix-engine/
- Run: `node --test --test-name-pattern="relayout that fails" prompts/prefix-engine/tests/overlay-engine-follow-up.test.cjs` -> tests 3, pass 0, fail 3, exit 1; each fails with the injected error escaping commandRelayout ("injected rename failure", "injected rename failure", "injected link failure"), because the pre-fix engine has no rollback
- Same three tests against the current engine: pass (iteration 1, 19 of 19 relayout tests)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:5864`, `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:164`, `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:858-872` (unchanged since iteration 15)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The engine's commit check allows every unowned vendored change when git runs it from a hook in a linked worktree, and no test runs pre-commit under that environment** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:5864 -- Re-records iteration 15's restatement of R5-P1-001 at its adjudicated P1, now in a delta row the reducer reads. Evidence unchanged: reproduced allow under GIT_DIR (iteration 5), status passes under it (iteration 6), worktrees are a documented ai-speckit workspace with a shared core.hooksPath (iteration 13), and the only hook-environment test runs status, not pre-commit (`.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:858-872`).
   - Finding class: fail-open-gate (refines R5-P1-001; restores its severity)
   - Scope proof: stagedUnownedChanges is the commit path's only hook-environment top-level probe.
   - Affected surface hints: overlay-engine.cjs stagedUnownedChanges and trackedTreeKeys; Barter pre-commit hook; strict-writes hook-environment test.
   - Case: in a linked worktree of ai-speckit, stage an unowned edit under skilled/.skilled/ and run git commit; the hook prints allow and the commit lands.

```json
{"type":"fail-open-gate","claim":"Under a hook-exported GIT_DIR, overlay-engine pre-commit returns allow for a staged unowned vendored change in a tree below the git top level, and no test covers that environment for pre-commit","evidenceRefs":[".skilled/commands/doctor/scripts/overlay-engine.cjs:5864","barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:164",".skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:868"],"counterevidenceSought":"Barter hook does not clear GIT_DIR; status also exits 0 under it; main checkout unaffected; worktrees documented in ai-speckit AGENTS.md:222","alternativeExplanation":"Unreachable only if ai-speckit never commits from a linked worktree, which its own workspace rule contradicts","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"The hook or engine clears GIT_DIR before the probe, or ai-speckit forbids commits from linked worktrees"}
```

### P2 Findings

None new.

## Test-Strength Verdict

- The three rollback tests added by the remediation fail on the engine before 3aab896957e and pass after it. The pre-fix failure is the injected error escaping with the first copy left moved, which is the half-move R1-P1-001 described. The tests guard the fix.

## Traceability Checks

- checklist_evidence: fail (unchanged terminal result from iteration 15; this iteration adds test-strength evidence, not a new check result for the record findings).

## Edge Cases

- The pre-fix copies live in this lineage's prompts/prefix-engine/ and were run from there; node:test's fixture cleanup removed its temporary workspaces.

## Confirmed-Clean Surfaces

- Rollback tests' sensitivity to the fix.

## Ruled Out

- Rollback tests that would pass without the fix.

## Next Focus

- Dimension: none
- Focus area: synthesis if the stop decision allows it
- Reason: every node answered, core protocols terminal, registry repaired
- Rotation status: complete
- Required evidence: stop decision after this iteration

Review verdict: CONDITIONAL
