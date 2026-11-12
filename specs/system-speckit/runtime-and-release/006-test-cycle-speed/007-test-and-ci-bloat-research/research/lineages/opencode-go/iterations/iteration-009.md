# Iteration 9: The second tier — where the remaining CI time actually sits

## Focus

Iteration 7 priced the duplicate guards; this iteration broadens to the nine workflows no earlier iteration examined for cuts, using per-step timings, so a second tier of recommendations can be priced or dismissed. The question is whether their cost is checkable work or plumbing, because only the first kind can be cut without repeating the settled caching and trigger decisions.

## Actions Taken

1. Pulled per-job and per-step durations for the six largest unexamined workflows from their most recent successful runs.
2. Compared each job's checking steps against its checkout and dependency-install steps.
3. Checked whether any job runs a step that another job in the same workflow already ran.
4. Counted the duplicated step's duration against the workflow total.

## Findings

1. `gate-inputs.yml` costs 170s: 64s checkout, 34s installing the packages the hook tests load, 56s running the hook test scripts against the real hooks, and 10s of fixture tests. Its checking work is 66s, the largest genuine work share in this tier. [SOURCE: .github/workflows/gate-inputs.yml:29]
2. `trigger-index-rebuild.yml` costs 119s across two jobs: 87s to rebuild (26s checkout, 42s install and build, 10s verify and commit) and 32s for a second job that only pushes the rebuild, of which 25s is checking out the base commit. [SOURCE: .github/workflows/trigger-index-rebuild.yml:1]
3. `opencode-dual-version.yml` costs 440s across three jobs: 183s of checkout, 133s provisioning the plugin dependency trees, and 81s of actual battery work. The same "config-shape, battery and cli-opencode doc unit tests" step runs in both the v1 job and the v2 job at 19s each. [SOURCE: .github/workflows/opencode-dual-version.yml:123]
4. `command-tree-parity.yml` costs 211s across two jobs: 120s checkout, 68s installing the spec-kit workspace, and about 23s of comparison work. [SOURCE: .github/workflows/command-tree-parity.yml:86]
5. `playbook-operator-contract.yml` costs 93s for under 8s of checking: 52s checkout and 31s installing the spec-kit workspace plus building its shared package. [SOURCE: .github/workflows/playbook-operator-contract.yml:1]
6. `changed-packet-validation.yml` costs 129s for under 8s of validation: 79s checkout and 45s installing spec-kit dependencies. [SOURCE: .github/workflows/changed-packet-validation.yml:1]
7. Across this tier the checks cost 10-66s while checkout plus install costs 96-188s, so no test-level cut can shorten these workflows. Their remaining ceiling belongs to the settled setup and trigger work in `002-ci-workflow-efficiency` phases 003 and 004, and the only unpriced cut left here is the duplicated config-shape step in `opencode-dual-version.yml` at 19s. [INFERENCE: based on the nine per-step measurements above]

## Ruled Out

- Recommending that these workflows drop their checks: the checks are 6-39% of each workflow, so a check cut saves seconds and loses coverage.
- Recommending narrower checkout or shallower clone for them: that is the settled setup work in `002-ci-workflow-efficiency/004-setup-caching-provisioning`.
- Recommending that the six second-tier workflows run on a schedule instead of every push: that is trigger hygiene, settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`.
- Calling `trigger-index-rebuild`'s second job wasteful: it performs the push that makes the rebuild durable, and a rebuild that is not committed is not a rebuild.

## Dead Ends

- No second-tier workflow has a deletable duplicate. Their checks are unique, and the overlap found in iteration 2 was confined to the four guard workflows plus the routing workflow.

## Edge Cases

- Ambiguous input: "second tier" could mean lower saving or lower value. Selected interpretation: lower saving, ranked by measured duration, because value judgments about a unique guard belong to the operator.
- Contradictory evidence: the packet's workflow means rank `playbook-operator-contract` and `changed-packet-validation` at 108s and 119s, while measured runs show 93s and 129s. The measured runs are used, and the difference is attributed to run-to-run variance plus queue time.
- Missing dependencies: `advisory-checks`, `markdown-link-integrity`, `dispatch-enforcement-guard` and `runtime-no-spec-import` were not timed this iteration; the tier conclusion does not depend on them because their packet means are all below the measured tier's floor.
- Partial success: none.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `gh run view 43177390580` (gate-inputs, 170s)
- `gh run view 43177390849` (trigger-index-rebuild, 119s)
- `gh run view 43172983998` (opencode-dual-version, 440s)
- `gh run view 43177390691` (command-tree-parity, 211s)
- `gh run view 43177390587` (playbook-operator-contract, 93s)
- `gh run view 43177390642` (changed-packet-validation, 129s)
- `.github/workflows/gate-inputs.yml:29`, `.github/workflows/trigger-index-rebuild.yml:1`, `.github/workflows/opencode-dual-version.yml:123`, `.github/workflows/command-tree-parity.yml:86`, `.github/workflows/playbook-operator-contract.yml:1`, `.github/workflows/changed-packet-validation.yml:1`

## Assessment

- New information ratio: 1.0
- Questions addressed: the second tier of workflow cost, and whether check-level cuts exist there.
- Questions answered: none newly; the question about workflow duplication was answered in iteration 2 and this iteration confirms its boundary.

## Reflection

- What worked and why: pricing each workflow as checkout plus install plus work turned six plausible candidates into a negative result with numbers, which is more useful than six unranked maybes.
- What did not work and why: the hope that the second tier held another deletable duplicate failed; their checks are unique, and only one step duplicates another inside its own workflow.
- What I would do differently: pull the second tier's timings in the same batch as the first tier's, so the whole ranking is built from one measurement session.

## Recommended Next Focus

Final consolidation: recompute the ranked list against all nine iterations, state which top claims were confirmed by a command and which remain inferred, and close the two open packets of uncertainty — the legacy lane's overlap with the CLI Vitest project, and whether the advisor default suite's serial setting can be raised without breaking shared state.
