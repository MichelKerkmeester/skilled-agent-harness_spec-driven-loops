# Phase result

Recorded 2026-10-24 on the worktree, before the phase commit. The commit SHA and the seven gate outcomes after the commit are written by the closing step once the commit exists.

## Parent-skill check

Command: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`

Result (re-run 2026-10-24 after the routing change): `OK: parent-skill-check — all hard invariants passed, 0 warnings`, `exit=0`, 49 PASS lines and 0 FAIL lines. The worktree is provisioned, so the `12-lib` leg passes and there is no allowed failure.

```text
PASS: 3g: all 2 surface packet(s) are read-only evidence-base and advisor-invisible
PASS: 5b: routerSignals keys match the registry workflowMode set (4)
PASS: 5l: tieBreak places no added surface after the native surface "sk-code-skilled"
PASS: 5k-alias: every registry alias is a keyword of its routerSignal classes
PASS: 5k-packet: every mode packet is a description keyword
PASS: 5k-canary: every routerSignals mode is the expected route of a canary case
PASS: 13b-version: SKILL.md version 2.4.0.0 matches the newest changelog entry
```

## Drift guards

Command: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`

Result: `run-all-drift-guards: all 4 guards PASSED, 10 non-blocking warning(s)`, `exit=0`. The four PASS lines are alignment-drift, stack-folders, router-sync and doc-claims.

## Suites

- `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs`: `pass 8`, `fail 0`, naming `a CI workflow prompt bundles the CI surface` and the test that keeps the cache key, scorer ruleset and test matrix prompts off the CI surface.
- `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 4`: `router-sync: 1/1 checks passed`. Legs 1a to 4 together: `router-sync: 5/5 checks passed`.
- `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs`: `pass 27`, `fail 0`.
- `node --test --test-concurrency=1 .skilled/bin/tests/compiled-route-*.test.cjs`: `tests 90`, `pass 90`, `fail 0`, exit `0`, re-run 2026-10-24 on the final tree. The run first failed once on `the live corpus holds the pinned number of gold scenarios` (`85 !== 82` at `compiled-route-admission.test.cjs:241`). That failure predates this phase: a clean checkout of `113d8b56d1`, before any edit of this phase, printed the same. The pin was set to 82 on 2026-10-11 and the live corpus holds 85, and the operator approved raising the pin to 85 on 2026-10-24. CI does not run this suite.
- The same files run in parallel reported `pass 87`, `fail 2` before the routing change. The extra failure, `checking every live hub scores each one and leaves the activation state untouched`, is an activation-state hash race between test files that run in parallel. It passes alone and under `--test-concurrency=1`. The served `canary-router.cjs` comment drift was synced, and `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files`.

## Routing replay

Recorded 2026-10-24 after the operator-approved routing change, with `compiledRoute("sk-code", <prompt>, {})` from the worktree root:

```text
"review the github actions workflow yaml" => surfaceBundle sk-code-review, sk-code-ci
"code review the github actions workflow" => single sk-code-review
"add a timeout to the ci workflow" => single sk-code-ci
"implement a new function in the typescript module" => single sk-code-skilled
```

The canary `surface-bundle-ci` and its test use the first prompt. The second prompt bundled before the change and is a known limitation: bundling it needs `routerPolicy.ambiguityDelta` raised from 1 for the whole hub, and the operator ruled on 2026-10-24 to accept the limitation. The activation manifest `effectivePolicyHash` moved off `095a492e...` and starts `37718f51`, generation 2, and moves again when the routing lists change, so read it from the manifest.

A second read-only review (a DeepSeek pass) found seven non-CI prompts still selecting `sk-code-ci`, and the aliases and runtime keywords were narrowed again. Replays after that change:

```text
"make the config loader fail-fast on a missing DATABASE_URL" => single sk-code-skilled
"build matrix factorization recommender in python" => single sk-code-skilled
"assign each tenant its own concurrency group inside the worker pool" => defer
"the Temporal workflow timeout on order-fulfilment is too short, raise it" => defer
"the approval workflow permissions should let a manager approve only their own team requests" => defer
"our branch ruleset should block force-pushes to release branches" => defer
"add a required status check to main and document the override" => defer
"review the ci workflow" => surfaceBundle sk-code-review, sk-code-ci
"add a timeout to the ci workflow" => single sk-code-ci
"pin the actions/checkout sha in the github actions workflow" => single sk-code-ci
"fix the timeout-minutes in the workflow yaml" => single sk-code-ci
```

## Scope

- `.github/workflows/message-contract.yml`: `git diff --exit-code` exits 0, blob `22342b9f9ffba023be6ebc7e699cdbdb72b0405a`.
- No `.github/` path was edited by this phase.
- Added-line search for an R-id, a D-id, a phase number or the parent packet name over the tracked diff and every new file: no output.
- `rg -c 'specs/' .skilled/skills/sk-code/sk-code-ci`: no output, exit 1.

## Registration after

`scratch/registration-after.json` against `scratch/registration-before.json`: modes, surfaces, tie-break, router signals, vocabulary classes and keywords are all kept, and `sk-code-ci` is present in modes, surfaces, tie-break, router signals and keywords: `true true true true true true true`. Canary cases went from 7 to 8.

## Phase result

The commit SHA is added by the closing step once the commit exists.

follow-up: the hub-surface removal landed in e00fef3e76 and the registration snapshot is re-checked at closure, and keep sk-code-ci in mode-registry.json, hub-router.json, ROUTER.md and SKILL.md
