# Iteration 2: Which CI workflows duplicate a local gate, and what the duplicate costs

## Focus

Key question 1: which CI workflows duplicate a local hook, another workflow, or a guard that fires no unique regression, and how many minutes does each removal save per push or PR. Iteration 1 established that the hook path blocks on 13 gates and costs about a second; this iteration asks whether CI re-buys the same guarantees. Trigger filters, caching and workflow merging are settled elsewhere (`specs/system-speckit/repo-operations/002-ci-workflow-efficiency`, phases 003, 004 and 008 with `D8=no`), so this iteration looks only for duplicate *coverage*, not for a consolidation plan.

## Actions Taken

1. Extracted every workflow's triggers, whether it carries a `paths:` filter, its job count and its step count.
2. Grepped every workflow for the checker it invokes and compared that to the 13 gates in `pre-commit` and the gates in `pre-push`.
3. Counted workflows that install a toolchain (`npm ci`, `npm install`, `npm run build`, `pip install`) before running a script-level check.
4. Counted `fetch-depth: 0` users and measured the history they pull.
5. Read the four duplicate workflows whose body decides the verdict (`comment-hygiene`, `agent-mirror-sync`, `message-contract`, `naming-standard-guard`).
6. Read the settled decision record `008-consolidation-decision` to keep the duplicate-coverage question separate from the already-answered merge question.

## Findings

1. The repository carries 32 workflows plus a README. Thirteen of the 32 have no `paths:` filter at all, so they queue on every push and every pull request regardless of what changed. [SOURCE: .github/workflows/sk-doc-script-tests.yml:1][SOURCE: .github/workflows/message-contract.yml:1][SOURCE: .github/workflows/naming-standard-guard.yml:1]
2. Six CI workflows re-run a gate that already blocks locally: `comment-hygiene.yml` against the commit hook's comment hygiene gate, `prompt-card-sync.yml` against the commit hook's card-sync gate, `agent-mirror-sync.yml` against the commit hook's agent mirror gate and mirror-parity gate, `message-contract.yml` against the push hook's message-contract gate, `routing-registry-drift.yml` against the commit hook's route re-mint and the push hook's route guard, and `naming-standard-guard.yml` against a naming gate the push hook deliberately deleted. [SOURCE: .skilled/scripts/git-hooks/pre-commit:147][SOURCE: .skilled/scripts/git-hooks/pre-commit:240][SOURCE: .skilled/scripts/git-hooks/pre-commit:365][SOURCE: .skilled/scripts/git-hooks/pre-commit:584][SOURCE: .skilled/scripts/git-hooks/pre-commit:641][SOURCE: .skilled/scripts/git-hooks/pre-push:161][SOURCE: .skilled/scripts/git-hooks/pre-push:474][SOURCE: .skilled/scripts/git-hooks/pre-push:378]
3. The duplicate workflows pay for setup, not for checking. `comment-hygiene.yml` checks out full history to run a checker measured at 0.09s, and this repository's history is 13,633 commits with a 2.01 GiB pack. `agent-mirror-sync.yml` runs `npm ci` and a TypeScript build of the shared package to run a checker measured at 0.13s. [SOURCE: .github/workflows/comment-hygiene.yml:22][SOURCE: .github/workflows/agent-mirror-sync.yml:46]
4. Seventeen of the 32 workflows install dependencies before running a script-level check, and `naming-standard-guard.yml` installs `pytest==8.4.2` through pip for a filename check. [SOURCE: .github/workflows/naming-standard-guard.yml:37][SOURCE: .github/workflows/spec-kit-check.yml:114]
5. `naming-standard-guard.yml` is the cleanest delete: the push hook removed its naming gate with the recorded reason that it never rejected a push the remote-permission gate would not already have allowed, so the CI workflow is the only remaining copy of a check the hook judged redundant with a stronger one. [SOURCE: .skilled/scripts/git-hooks/pre-push:378][SOURCE: .github/workflows/naming-standard-guard.yml:19]
6. `message-contract.yml` is not a straight delete. Its CI body adds two things the push hook cannot do: it tests the validator itself with `node --test`, and it validates the PR description, which does not exist at push time. The duplicate part is the pushed-commit range check the hook already runs. [SOURCE: .github/workflows/message-contract.yml:48][SOURCE: .github/workflows/message-contract.yml:72]
7. `routing-registry-drift.yml` is the largest workflow in the repository at 357 lines and 23 steps, and it is not a plain duplicate: the workflow job exists because it sees the pushed commit rather than a working tree, which the local gate cannot cover. A delete here would lose that commit-parity coverage, so the only defensible cut is narrower than deletion. [SOURCE: .github/workflows/routing-registry-drift.yml:176][SOURCE: .skilled/scripts/git-hooks/pre-push:474]

## Ruled Out

- Recommending path filters for the 13 unfiltered workflows: trigger hygiene is settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`.
- Recommending a composite setup action or dependency caching: settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`.
- Recommending that any two workflows be merged into one: settled as `D8 = no` in `002-ci-workflow-efficiency/008-consolidation-decision`. The cuts proposed here are deletions or narrowings of duplicate coverage, which is a different decision from merging job shapes.
- Treating `message-contract.yml` as a duplicate to delete after reading only its name; its body carries PR-only coverage.

## Dead Ends

- Per-job runner minutes for each workflow are not in the packet and are not derivable from `spec.md`'s per-workflow means, which include queue time. Any per-workflow saving claimed from here is an estimate bounded by the workflow mean, not a measured job time. Candidate for promotion to "exhausted approaches" if a later iteration keeps reaching for per-job attribution.

## Edge Cases

- Ambiguous input: "duplicate a local hook" could mean duplicate coverage or duplicate implementation. Selected interpretation: duplicate coverage, because deleting one copy is the only actionable cut and implementation sharing is settled caching work. Deferred alternative: counting duplicated checker code across `.skilled/` and `.opencode/` roots.
- Contradictory evidence: the routing workflow's own comment states the hook and the workflow validate different trees, which contradicts a simple "hook already covers it" reading. Preserved both: the hook covers the working tree, the workflow covers the published commit. The question is marked answered only for the five unambiguous duplicates.
- Missing dependencies: `gh` run data was not queried; `spec.md` carries the measured workflow means and the packet's own caveat about queue time.
- Partial success: none.
- Self-correction: iteration 1's iteration record declared `findingsCount: 5` while seven findings were enumerated (and seven finding rows were written to the delta). The record is durable in the ledger and rewriting it would duplicate the iteration, so the count stands as recorded and the discrepancy is noted here rather than silently patched.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `.skilled/scripts/git-hooks/pre-commit:147`, `:240`, `:365`, `:584`, `:641`
- `.skilled/scripts/git-hooks/pre-push:161`, `:378`, `:474`
- `.github/workflows/comment-hygiene.yml:22`
- `.github/workflows/agent-mirror-sync.yml:46`
- `.github/workflows/naming-standard-guard.yml:19`, `:37`
- `.github/workflows/message-contract.yml:48`, `:72`
- `.github/workflows/routing-registry-drift.yml:176`
- `specs/system-speckit/repo-operations/002-ci-workflow-efficiency/008-consolidation-decision/scratch/d8-answer.md:1`
- Measured: `git rev-list --count HEAD` = 13633; `git count-objects -vH` size-pack = 2.01 GiB.

## Assessment

- New information ratio: 0.9
- Questions addressed: Which CI workflows duplicate a local hook, another workflow, or a guard that fires no unique regression, and how many minutes does each remove per push or PR?
- Questions answered: Which CI workflows duplicate a local hook, another workflow, or a guard that fires no unique regression, and how many minutes does each remove per push or PR?

## Reflection

- What worked and why: mapping workflow name to checker path to hook line turned "which workflows are bloat" into a citation chain, and the setup-versus-check split fell out of the same pass.
- What did not work and why: per-job time attribution failed because the only timing source is workflow-level and includes queue time; the finding stays bounded by that.
- What I would do differently: read the settled 002 decision record before the workflows, because two of the six candidates needed re-framing once the merge decision was known.

## Recommended Next Focus

Go inside the largest test tree: `.skilled/skills/system-spec-kit/runtime` holds 353 test files and its `spec-kit-check.yml` is the slowest workflow at 595s. Find which of those tests mirror the implementation or re-assert the framework, and what a deletion would stop catching.
