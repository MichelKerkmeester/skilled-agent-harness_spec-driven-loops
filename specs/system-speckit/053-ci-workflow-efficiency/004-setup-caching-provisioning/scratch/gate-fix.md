# Gate Inputs fix

## Failure

The Gate Inputs workflow went red on main in run 40107034137. Run in a fresh CI checkout, `bash .github/scripts/check-gate-inputs.sh` reported four workflow-inputs failures with 250 inputs resolved, 39 dynamic inputs and 4 failures. They named `.skilled/skills/sk-vision/hooks/opencode/sk-vision.js` and `.skilled/skills/system-spec-kit/.node-version-marker`, each at two lines of `.github/actions/setup/action.yml` (43 and 49, then 81 and 87), and said they resolve nowhere. The gate passed locally because both build outputs exist in a developer tree.

## Cause

Both files are gitignored build outputs that the cached setup action lists in its restore and save `path:` blocks. In `scan_workflow` only a token matching `*node_modules*`, `*/dist/*` or `*/dist` was treated as generated, and for those the gate checked only that the owning directory exists. Any other ignored build output fell to the plain existence check and failed in a checkout that holds no build output.

## Fix

A literal path that does not exist is now checked with `git check-ignore`. If git ignores it, the gate counts it as dynamic when its parent directory exists, and fails with the message `<path> is generated under <dir>, which resolves nowhere` when that directory is missing. A path that is not ignored must still exist. The node_modules and dist branch is unchanged, and the header comment now describes the rule.

The ignore check passes `-c core.excludesFile=/dev/null` so a personal global ignore file cannot change the answer. Without it, this machine ignores `/.opencode/` globally and every missing `.opencode` path would have passed locally while failing in CI.

Three fixture cases were added to the test, in a fixture that is now a git repository with its own `.gitignore`. An ignored absent file under an existing directory passes. An ignored absent file under a missing directory fails with the generated message. A missing path that is not ignored still fails.

## Counts

Fresh checkout of HEAD without provisioning, before the fix: inputs_resolved=250, dynamic_inputs=39, failures=4, RESULT: FAILED.

Same fresh checkout with the fix: inputs_resolved=250, dynamic_inputs=43, failures=0, RESULT: PASSED. The four failing tokens moved into the dynamic count.

Worktree with build outputs present: inputs_resolved=254, dynamic_inputs=39, failures=0, RESULT: PASSED.

Fixture test: 54 passed before, 57 passed and 0 failed after.
