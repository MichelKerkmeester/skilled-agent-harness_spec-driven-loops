# Phase result

Recorded 2026-10-24 on the worktree, before the phase commit, and closed the same day after the phase commit `028bd0f5cd` reached `origin/main`. The sections up to `## Registration after` are the pre-commit record. `## Closure re-run`, `## Finding the phase gates missed`, `## CI state` and `## Phase result` are the closure record, read on the tree at `c903c0d103`.

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

Re-run at closure on `c903c0d103` (2026-10-24): the snapshot command wrote `scratch/registration-after.json` with exit `0` and `git diff --stat` shows no change against the committed copy. The comparison printed `true true true true true true true`. The snapshot reads version `2.4.0.0`, four modes (`sk-code-quality`, `sk-code-review`, `sk-code-skilled`, `sk-code-ci`), surfaces `sk-code-ci` and `sk-code-skilled`, and 8 canary cases. The ordering state `post-013/002` still holds: `e00fef3e76` and the removal commit `e3beac65f4` are on `origin/main`, and the registry holds no Webflow or Obsidian mode.

## Closure re-run

Every cheap check behind an acceptance row was run again on 2026-10-24 on a clean tree at `c903c0d103` (`git status --short` printed nothing). Outputs read:

- `parent-skill-check.cjs .skilled/skills/sk-code`: exit `0`, 49 PASS and 0 FAIL, `PASS: 3g: all 2 surface packet(s) are read-only evidence-base and advisor-invisible`.
- `run-all-drift-guards.sh`: exit `0`, `run-all-drift-guards: all 4 guards PASSED, 10 non-blocking warning(s)`.
- `verify-router-sync.cjs`: `router-sync: 5/5 checks passed`, exit `0`. The `--checks 1a,1b,2,3` form printed `router-sync: 4/4 checks passed` and `--checks 4` printed `router-sync: 1/1 checks passed`.
- `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs`: exit `0`, `tests 8`, `pass 8`, `fail 0`.
- `node --test --test-concurrency=1 .skilled/bin/tests/compiled-route-*.test.cjs`: exit `0`, `tests 90`, `pass 90`, `fail 0`, `cancelled 0`.
- `compiled-route-sync.cjs --check`: `all 55 served copies match their authored files`.
- `verify-doc-claims.cjs`: exit `0`, `doc-claims: 4/4 checks passed`.
- `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict`: exit `0`, `SIGNAL DRIFT compiled vs disk: none`.
- Routing replay with `compiledRoute("sk-code", <prompt>, {})`: `review the github actions workflow yaml` and `review the ci workflow` print `surfaceBundle` led by `sk-code-review`, `code review the github actions workflow` prints `single` `sk-code-review`, `add a timeout to the ci workflow` prints `single` `sk-code-ci`, and `implement a new function in the typescript module` prints `single` `sk-code-skilled`.
- Scope: `git diff --exit-code 028bd0f5cd~1 HEAD -- .github/workflows/message-contract.yml` exits `0` with no output, the phase commit touches no `.github/` path, and the added-line search for an R-id, a D-id, a phase number or the parent packet name over the phase commit (34 paths outside `specs/`, 1,140 added lines) and over `e8fdd9746b~1` to `c903c0d103` printed nothing with `grep` exit `1`.

## Finding the phase gates missed

The phase commit `028bd0f5cd` failed one CI job: Routing Registry Drift Guard printed `SIGNAL DRIFT compiled vs disk: sk-code`. The cause is that this phase added CI phrases to the sk-code advisor signals, and the compiled fallback graph `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` was not regenerated, so the committed graph disagreed with the signals on disk.

The phase's own gate list (parent-skill-check, the drift guards, the compiled-route suites, router-sync and doc-claims) does not include `skill-graph-freshness.cjs`, so every local gate was green while this one CI job was red. The fix is commit `c903c0d103`: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json` regenerated the graph, and `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` then printed `SIGNAL DRIFT compiled vs disk: none` with exit `0`. That result was read again on the closure tree. A change to `graph-metadata.json` advisor signals should run the freshness check before the commit.

Two pre-commit hooks also changed files during the phase commit: `generate-router-intent-signals.cjs --write --hub sk-code` added the signal `required status check workflow`, and document versions were bumped during the commit.

## CI state

Read with `gh run list --commit <full sha> --limit 50 --json name,status,conclusion` and `gh run list --branch main --limit 40 --json name,status,conclusion,headSha` at 2026-10-24T16:58:25Z. A run that is not completed is reported as it stands.

| Commit | Runs | Completed success | Completed failure | Not completed |
|--------|------|-------------------|-------------------|---------------|
| `e8fdd9746b` | 0 | 0 | 0 | 0 |
| `028bd0f5cd` | 19 | 18 | 1 (Routing Registry Drift Guard) | 0 |
| `81739ae290` | 1 | 1 (Push on main) | 0 | 0 |
| `c903c0d103` | 15 | 14 | 0 | 1 (Routing Registry Drift Guard `in_progress`) |

`gh run list --commit` returns no run with `e8fdd9746b` as its head sha. The likely reason is that its push also carried `028bd0f5cd` and the runs took the later head sha, which is inferred and would be confirmed by reading the push event of the 028bd0f5cd runs.

The 14 completed runs for `c903c0d103` at that read are Advisory Checks, Changed Packet Validation, Dispatch Enforcement Guard, Gate Inputs, Hook Node Tests, Markdown Link Integrity, Message Contract, OpenCode Plugin Tests, Playbook Operator Contract, Push on main, Rule Canary Sync, sk-doc Script Tests, Skill Advisor Stress Tests and Trigger Index Rebuild. An earlier read at 16:55:40Z showed 13 completed with Push on main and Routing Registry Drift Guard in progress, so the table moves quickly and the timestamp is part of the record. The Routing Registry Drift Guard run for `c903c0d103` was still in progress, so the CI result of the graph fix is not yet observed and nothing here claims it. The one observed fact is local: the freshness check prints `SIGNAL DRIFT compiled vs disk: none`.

## Phase result

The phase commit is `028bd0f5cd` (`feat(sk-code): add the read-only CI surface to the sk-code hub`), on `origin/main`. Three commits follow it:

- `e8fdd9746b` `test(compiled-routing): pin the admission corpus at 85 scenarios` raised the admission pin from 82 to 85, and the serial compiled-route suites ran `tests 90`, `pass 90`, `fail 0`.
- `81739ae290` `chore(system-spec-kit): rebuild the trigger index`.
- `c903c0d103` `fix(system-skill-advisor): regenerate the compiled skill graph after the CI surface` fixed the failed Routing Registry Drift Guard check on the phase commit.

Seven gate outcomes, each read on the tree at `c903c0d103` on 2026-10-24:

1. parent-skill-check: exit `0`, 49 PASS and 0 FAIL, the `3g`, `5b`, `5k-alias`, `5k-packet`, `5k-canary`, `5l` and `13b-version` legs all PASS.
2. Drift guards: exit `0`, `all 4 guards PASSED, 10 non-blocking warning(s)`.
3. Surface-hint suite: `tests 8`, `pass 8`, `fail 0`.
4. Router-sync: `router-sync: 5/5 checks passed`, exit `0`.
5. Serial compiled-route suites: `tests 90`, `pass 90`, `fail 0`, exit `0`.
6. Scope: the message-contract workflow is byte-identical across the phase, no `.github/` path changed, and the added-line search printed nothing.
7. Registration: `true true true true true true true`, canary cases 7 to 8.

An eighth check, `skill-graph-freshness.cjs --strict`, was not in the gate list and failed in CI on `028bd0f5cd`. It prints `SIGNAL DRIFT compiled vs disk: none` with exit `0` after `c903c0d103`. CI for `c903c0d103` was not all complete when this was written (see the table above).

T066 is ticked on the phase commit `028bd0f5cd`. T068, the closure commit, landed as `25aa533f0b` and is ticked.

follow-up: the hub-surface removal landed in e00fef3e76 and the registration snapshot is re-checked at closure, and keep sk-code-ci in mode-registry.json, hub-router.json, ROUTER.md and SKILL.md

## CI state at final close-out

Read on 2026-10-24 at 22:05 UTC with `gh run view 40113489423 --json name,status,conclusion,headSha` and `gh run list --commit c903c0d103b59c7d51838d45b598d1e7981f5056 --json name,status,conclusion --limit 40`. Run `40113489423` is Routing Registry Drift Guard, status `completed`, conclusion `success`, head sha `c903c0d103b59c7d51838d45b598d1e7981f5056`. The commit has 15 runs and all 15 are `completed` with `success`, so the one run that was `in_progress` in the table above finished green. The closure commit `25aa533f0b` is on `origin/main`.
