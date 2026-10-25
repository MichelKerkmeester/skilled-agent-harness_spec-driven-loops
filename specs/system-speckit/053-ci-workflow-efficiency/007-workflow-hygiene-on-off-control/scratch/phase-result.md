# Phase result

timeout kills: 0

## Timeout-kill read

The read covers every run created from 2026-10-25T00:43:00Z, when the timeout commit `8ff7da700d` reached `main`, to 2026-10-25T21:30:00Z. That is 690 runs: 664 success, 20 failure, 6 cancelled.

Two things differ from the task as written:

- The window is 20.8 hours, not 24. On 2026-10-25 the operator asked not to wait for the full window ("We dont want to wait till misnight"). None of the repository's own schedules falls in the hours it leaves out: the daily `Playbook Operator Contract` schedule ran inside the window at 06:41Z and ended `success`, and the two weekly schedules fire on Mondays at 04:17Z and 04:23Z, after the full window would have ended. Separately, the one scheduled run after 21:30Z, the one-shot plugin-test run 40236652343 the setup caching phase fired at 21:41Z, finished `success` in 251 s against its 10-minute timeout, with no kill message in its log, so it holds no kill either.
- `gh run list --limit 300` covers only the newest 3.5 to 5 hours at today's rate (from 15:32Z when read at 20:36Z, from 18:01Z when read at 21:40Z), so the read lists the window by creation date in three-hour chunks instead. `runs-24h.json` holds all 690 runs.

For each of the 26 runs that did not succeed, every failed or cancelled job had its check-run annotations and its log searched for GitHub's kill message, `maximum execution time`. No job matched, so no timeout value needs raising.

| Run id | Run conclusion | Workflow | Job id | Job | Job conclusion | Annotation hits | Log hits |
|---|---|---|---|---|---|---|---|
| 40148151428 | cancelled | Message Contract | 121033835292 | Commit messages, branch names and PR description follow the templates | cancelled | 0 | 0 |
| 40148156955 | failure | Spec-Kit Check | 121033853161 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40148156916 | cancelled | Message Contract | - | - | no-failed-job | - | - |
| 40149635448 | failure | Spec-Kit Check | 121038233594 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40180719301 | failure | Spec-Kit Check | 121131016774 | Runtime mirrors agree with their sources | failure | 0 | 0 |
| 40185230015 | failure | Spec-Kit Check | 121144507127 | Runtime mirrors agree with their sources | failure | 0 | 0 |
| 40200559901 | failure | Deep-Loop Runtime Tests | 121190647223 | Deep-loop runtime vitest suites | failure | 0 | 0 |
| 40208730185 | failure | Spec-Kit Check | 121215186270 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40212025355 | failure | Changed Packet Validation | 121225085386 | Spec packets touched by this PR validate clean | failure | 0 | 0 |
| 40212025191 | failure | sk-doc Script Tests | 121225084848 | sk-doc script tests | failure | 0 | 0 |
| 40212025206 | failure | Spec-Kit Check | 121225084696 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40218472492 | failure | Spec-Kit Check | 121244649134 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40218472609 | failure | sk-doc Script Tests | 121244649645 | sk-doc script tests | failure | 0 | 0 |
| 40219246778 | failure | Routing Registry Drift Guard | 121247012304 | Registry == advisor maps; compiled-routing freshness; parent-skill structure | failure | 0 | 0 |
| 40219246889 | failure | sk-doc Script Tests | 121247012792 | sk-doc script tests | failure | 0 | 0 |
| 40219246883 | failure | Spec-Kit Check | 121247869722 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40219853435 | failure | sk-doc Script Tests | 121248856496 | sk-doc script tests | failure | 0 | 0 |
| 40221314296 | failure | Spec-Kit Check | 121253288496 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40221346378 | cancelled | OpenCode Plugin Tests | - | - | no-failed-job | - | - |
| 40221346293 | cancelled | sk-doc Script Tests | - | - | no-failed-job | - | - |
| 40221900066 | cancelled | OpenCode Plugin Tests | - | - | no-failed-job | - | - |
| 40221900076 | failure | Spec-Kit Check | 121256852436 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40221911315 | failure | sk-git Script Tests | 121255108706 | sk-git script tests | failure | 0 | 0 |
| 40222644267 | failure | Spec-Kit Check | 121260323698 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40227757929 | failure | Spec-Kit Check | 121272682984 | Typecheck, import policy and test suites for the spec-kit packages | failure | 0 | 0 |
| 40234732843 | cancelled | Message Contract | - | - | no-failed-job | - | - |

## Final gates

Run on 2026-10-25 at `HEAD` `174ebbdc0e`, from the phase start `985e1520e2`.

`bash .github/scripts/check-gate-inputs.sh`:

```text
files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0
RESULT: PASSED
rc=0
```

The workflow parse one-liner:

```text
parse ok
```

`git diff --name-only "$BASE"..HEAD` lists 5488 paths, because other work reached `main` after the phase start. The phase's own commits are read instead:

```text
03abdb20d8 docs(ci): document the workflow switches
1fd95b59cd test(system-spec-kit): accept the switch term in the rebuild push condition
4b7d3d8941 ci(workflows): declare least-privilege token scopes
8ff7da700d ci(workflows): size every job timeout from its own samples
9480d99e6d ci(workflows): gate every job behind a repository switch
b03d3bd1c6 docs(spec): record the permissions pass for workflow hygiene
b1315701ca ci(dependabot): split metadata reads from the merge write scope
b5514a16ae docs(spec): record the switch probe on a throwaway repository
d31d9667b6 docs(spec): record the dependabot split proof on live pull requests
```

They touch 1248 paths. All sit under `.github/workflows/` or this phase folder except 2:

- `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts`: a test that asserts the rebuild workflow's push condition, updated in `1fd95b59cd` to accept the switch term
- `specs/system-speckit/053-ci-workflow-efficiency/graph-metadata.json`: the parent packet's derived metadata, re-minted by the commit gate in `d31d9667b6`

The ephemeral-id count over `git diff "$BASE"..HEAD -- .github`:

```text
0
```

The trigger, filter and concurrency line count over `git diff --unified=0 "$BASE"..HEAD -- .github/workflows`:

```text
1
```

The one added line is `- cron: '37,51 21 25 10 *'` in `opencode-plugin-tests.yml`. The setup caching phase added it in `174ebbdc0e` as a one-shot schedule entry, to fire its scheduled cold run without waiting for Monday, and removes it once GitHub creates that run. It is not this phase's change: the same count over the phase's nine commits is `0`, and over `"$BASE"..174ebbdc0e~1`, the tree before that entry, it is `0`.

The job count, then the three protected check names:

```text
44
1
1
1
```

### Rerun after the one-shot entry was removed

Run on 2026-10-25 at `HEAD` `0ab8f9f74e`, the commit that removed the one-shot schedule entry. The gate printed `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0` and `RESULT: PASSED`, the parse printed `parse ok`, the ephemeral-id count printed `0`, the trigger-line count over the whole range printed `0`, and the job count printed `44`.

The strict validation, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control" --strict --no-recursive`, last lines:

```text
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```
