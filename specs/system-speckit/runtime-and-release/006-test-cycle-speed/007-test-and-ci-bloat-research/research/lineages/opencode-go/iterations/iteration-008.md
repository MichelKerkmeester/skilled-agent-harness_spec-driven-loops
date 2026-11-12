# Iteration 8: Verifying the top deletions before they are published

## Focus

The top three cuts in iteration 7 are deletions of workflows that re-run a local hook. Before a ranked list tells an operator to delete a merge gate, three claims need confirmation: that the CI job runs the same checker as the hook, that nothing requires the workflow by name, and that no unique coverage hides inside it. This iteration runs that verification against the live repository and the live branch.

## Actions Taken

1. Queried `main`'s branch protection through the GitHub API.
2. Compared the checker path in each candidate workflow against the checker path in the hook.
3. Read `naming-standard-guard.yml`'s full step list to see whether it carries more than the scan.
4. Searched the gate-input manifest script for any enumeration of the candidate workflows.
5. Re-read each workflow's diff scope to separate what CI adds from what the hook already does.

## Findings

1. `main` is unprotected: the branch-protection endpoint returns 404 "Branch not protected", so no status check is required to merge. Deleting a workflow removes enforcement but breaks no merge gate. [SOURCE: .github/workflows/comment-hygiene.yml:1][INFERENCE: based on `gh api repos/{owner}/{repo}/branches/main/protection` returning 404]
2. `comment-hygiene.yml` and the commit hook invoke the identical checker, `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`. The difference is scope only: CI diffs base to head across the whole pull request, the hook checks the staged index. [SOURCE: .github/workflows/comment-hygiene.yml:34][SOURCE: .skilled/scripts/git-hooks/pre-commit:151]
3. `agent-mirror-sync.yml` and the commit hook invoke the identical checker, `.skilled/bin/check-agent-mirror-sync.cjs`; CI adds only the shared-package build the checker loads. [SOURCE: .github/workflows/agent-mirror-sync.yml:57][SOURCE: .skilled/scripts/git-hooks/pre-commit:244]
4. `naming-standard-guard.yml` carries more than the scan: it runs a Python snake_case guard against the changed range and then runs that guard's own pytest suite (two files). Deleting the workflow would delete the guard's regression tests as well, so this cut must keep those two test files somewhere. [SOURCE: .github/workflows/naming-standard-guard.yml:54][SOURCE: .github/workflows/naming-standard-guard.yml:58]
5. The regression each deletion stops catching is exactly the no-hook path: a commit made with `--no-verify`, from a clone without the machine-wide hooks installed, or by a tool that runs no hooks. That is narrow but real, and it is the whole of what the CI copies add. [SOURCE: .skilled/scripts/git-hooks/pre-commit:149][INFERENCE: based on the hook's own bypass surface and the identical checker paths in findings 2 and 3]
6. No gate inventory enumerates these workflows: `check-gate-inputs.sh` does not reference `comment-hygiene`, `agent-mirror-sync` or `naming-standard-guard`, so deleting one needs no manifest update. [SOURCE: .github/scripts/check-gate-inputs.sh:1]
7. Deletion is the only cut that captures the checkout cost. Each candidate spends 72-87s cloning and 1-14s checking, so narrowing the check inside the job would leave the clone in place and save nothing measurable. [INFERENCE: based on the per-step durations recorded in iteration 7 and the check scope in findings 2 and 3]

## Ruled Out

- Deleting `naming-standard-guard.yml` wholesale: it would take two pytest files with it, so the ranked cut must be "delete the workflow, move its two guard tests into an existing script-test workflow".
- Claiming that CI is unnecessary because the hooks exist: the hooks are machine-wide installs, not repository properties, so a contributor without them gets no enforcement at all. The finding keeps that regression and prices it as the cost of the deletion.
- Arguing from branch protection: there is none, so the "required check" objection does not apply here and is recorded as a verified negative rather than an assumption.

## Dead Ends

- No required-check list exists to inspect, because the branch is unprotected. The verification therefore ends at "nothing requires it by name", which is the strongest statement the repository supports.

## Edge Cases

- Ambiguous input: "the same checker" could mean the same file, the same rules, or the same diff scope. Verified at file identity and scope separately, because file identity without scope would overstate the overlap.
- Contradictory evidence: none. Every candidate's CI body invokes the same path the hook invokes.
- Missing dependencies: the GitHub API answered for `main` only; other branches were not checked, and the workflow triggers cover `main` and `skilled/**`, so a release branch could in principle be protected independently.
- Partial success: none.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `.github/workflows/comment-hygiene.yml:34`
- `.github/workflows/agent-mirror-sync.yml:57`
- `.github/workflows/naming-standard-guard.yml:54`, `:58`
- `.skilled/scripts/git-hooks/pre-commit:151`, `:244`, `:149`
- `.github/scripts/check-gate-inputs.sh:1`
- `gh api repos/{owner}/{repo}/branches/main/protection` → HTTP 404 "Branch not protected"

## Assessment

- New information ratio: 0.9
- Questions addressed: verification of the delete candidates against live enforcement and hidden coverage.
- Questions answered: none newly; this iteration hardens answers already given.

## Reflection

- What worked and why: checking branch protection first removed the strongest objection to deletion in one call, and reading the naming workflow's second step found the one candidate whose deletion would take tests with it.
- What did not work and why: the gate-input manifest was the wrong place to look for workflow enumerations; the script checks hook and workflow *inputs*, not a list of workflows.
- What I would do differently: read each candidate's full step list before ranking it; the naming guard's trailing pytest step changes the shape of that recommendation.

## Recommended Next Focus

Broaden to the workflows that no earlier iteration examined for cuts — `gate-inputs.yml` (199s), `trigger-index-rebuild.yml` (185s), `opencode-dual-version.yml` (161s), `command-tree-parity.yml` (108s), `playbook-operator-contract.yml` (108s) and `changed-packet-validation.yml` (119s) — with per-step timings so a second tier of cuts can be priced or dismissed.
