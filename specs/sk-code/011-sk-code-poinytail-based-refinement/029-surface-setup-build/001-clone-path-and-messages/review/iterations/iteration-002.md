# Iteration 2 — security

## Dimension

security — iteration 2 of 5 for the three-commit target (README adapting block, compiled-route-guard.cjs, root-router-contract.cjs, ci-skill-root-metadata.cjs, and the four tests). The pass looked for injection exposure in the newly printed fix line, privilege handling around the new repo-hook trust instruction, information disclosure or failure-masking in the SHARED_NOT_BUILT relabel, and unsafe process or filesystem use in the new tests. Read-only: no reviewed file was modified.

## Files Reviewed

- `README.md:1451-1454` — the new Before-you-start items (provision, trust, hooks, prune) [SOURCE: README.md:1451]
- `.skilled/bin/compiled-route-guard.cjs:1-60, 99-109, 219` — imports, constants, HUBS, staleFix, exports [SOURCE: .skilled/bin/compiled-route-guard.cjs:99]
- `.skilled/bin/tests/compiled-route-manifest.test.cjs:623-645` — T1/T2 pin the stale fix text [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:623]
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:62-90` — the relabel [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:72]
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:49-66` — the no-stack gate [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:60]
- `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:715-802` — T3/T4 [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:718]
- Evidence targets outside the changed set (read-only): `.skilled/scripts/git-hooks/pre-commit:33-53`, `.skilled/scripts/install-git-hooks.sh:188`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:797-800`
- Coverage-limit closure: `.skilled/skills/sk-code/feature-catalog/` (existence), `.skilled/skills/sk-code/shared/references/phase-detection.md`, `.skilled/skills/sk-doc/leaf-scopes.json`
- `spec.md` and `goal.md` were read in iteration 1; this pass re-anchored citations against the changed lines above and did not re-read them.

## Findings by Severity (P0/P1/P2)

### P0

None. No exploitable path was found in the changed lines.

### P1

None.

### P2

None new this iteration. R1-P2-001 (iteration 1, correctness) remains active: the doctor's lib loader was located at `parent-skill-check.cjs:364-365` (`return { module: require(file), missing: false, error: null }` inside a try), but its catch body was not read this iteration, so the finding's downgrade trigger is not yet met. Each security direction below is recorded as ruled out with evidence rather than left open as a suspicion.

## Security Directions Reviewed — ruled out with evidence

1. **Command injection via the printed stale fix.** The new line interpolates `hubId`, the skill root, and both manifest paths into a copy-pasteable command. Ruled out: `HUBS` is a static literal array (guard:44-52) and every interpolated path is derived with `path.join`/`path.relative` from `REPO_ROOT` (guard:39-42, 65-78, 99-109); a scan of the file for `child_process|spawnSync|execSync|execFileSync|eval(|new Function|process.env` returns no matches, so the guard prints the fix and never executes it.
2. **The README repo-hook trust instruction.** [SOURCE: README.md:1452] tells readers to run `git config --local skilled.trustRepoHooks true`. Ruled out as a defect: the gate the instruction satisfies is real, fail-closed, and local-scoped — the hook wrappers check `git config --local --bool skilled.trustRepoHooks` and skip when unset (`.skilled/scripts/git-hooks/pre-commit:44`), an untrusted clone is skipped rather than blocked (`.skilled/scripts/git-hooks/tests/pre-commit.test.sh:800`), and command-line `git -c`/`GIT_CONFIG_*` cannot grant trust (`.skilled/scripts/install-git-hooks.sh:188`). The recipe uses the sanctioned mechanism, its wording is accurate, and the hook prints the same instruction itself (`pre-commit:53`).
3. **Relabeled SHARED_NOT_BUILT message — disclosure or masking.** Ruled out: the message is built from two source literals (rrc:67-68, 80-84), non-matching load errors rethrow unchanged (rrc:79, pinned by the unrelated-module test at root-router-contract.test.cjs:786-802), and the gate prints `err.message` only and exits 1 (cim:62-66). No stack, path, or environment detail is disclosed, and no real failure is relabeled.
4. **New test harness — spawn and cleanup safety.** Ruled out: `spawnSync` passes an argv array and a `JSON.stringify`-quoted path, `NODE_PATH` is deleted for resolution hygiene, and `fs.rmSync` runs only on the `mkdtemp` directory under `os.tmpdir` (root-router-contract.test.cjs:715-802).
5. **Secret exposure.** No credential, token, or environment read appears in the changed lines; the guard has no `process.env` usage, and the two error strings carry no sensitive data.

## Traceability Checks

- `feature_catalog_code` — **pass**; iteration 1's stated coverage limit is closed: `.skilled/skills/sk-code/feature-catalog/feature-catalog.md`, its `two-axis-registry-driven-routing/` and `compiled-routing-and-legacy-fallback/` subdirectories, and `shared/references/phase-detection.md` all exist. `.skilled/skills/sk-code/leaf-scopes.json` is absent, consistent with the README describing the file a user creates when `MODE_LEAF_SET_COLLISION` fires (`.skilled/skills/sk-doc/leaf-scopes.json`, the named format exemplar, exists).
- `skill_agent` — notApplicable; no skill agent doc in the changed set.
- `agent_cross_runtime` — notApplicable; no runtime-specific file in the changed set.
- `playbook_capability` — observed unchanged.
- `spec_code` — carried from iteration 1 (verified); the citations above re-confirm the changed lines.
- `checklist_evidence` — deferred; ledger rows live in `implementation-summary.md`, outside the review scope.

## SCOPE VIOLATIONS

None — every write went to the review packet state files.

## Coverage Limits

- `parent-skill-check.cjs:365` catch body not read this iteration; R1-P2-001 remains open with its downgrade trigger unmet.
- `regenerate-skill-derived.cjs --write` and `worktree-naming.sh provision` internals deferred: both scripts are unchanged and outside the changed set.

## Verdict

**PASS** — no P0 or P1 findings this iteration and no new P2. Five security directions are ruled out with file:line evidence; one direction is deferred with a stated reason. R1-P2-001 remains open as the single advisory.

## Next Dimension

traceability (iteration 3).

Review verdict: PASS
