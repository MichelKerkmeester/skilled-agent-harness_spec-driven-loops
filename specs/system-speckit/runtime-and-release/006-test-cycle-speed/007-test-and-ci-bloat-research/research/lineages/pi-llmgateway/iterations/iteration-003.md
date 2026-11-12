# Iteration 3: The CI workflow inventory — duplicate guards, report-only jobs, and scope mismatches

## Focus

Key question 1: which CI workflows duplicate a local hook check or another workflow, and what would deleting or merging them save. This is the largest subject by measured cost, and iteration 2 established that the minutes are here rather than on the hook path. Triggers and per-step contents only; caching, trigger hygiene and the consolidation decision are settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency` and are not re-argued.

## Actions Taken

1. Parsed the `on:` block of all 32 workflow files and listed the triggers.
2. Extracted the job and step names plus their `run:` bodies for the guard-shaped workflows.
3. Read `advisory-checks.yml` in full (101 lines).
4. Traced which workflows run hook test suites and what `.skilled/hooks/` contains.

## Findings

1. Twenty-six of the 32 workflows trigger on both `push` and `pull_request`; only `agent-mirror-sync`, `comment-hygiene`, `dependabot-auto-merge` and `prompt-card-sync` are pull-request-only, and `strict-pass-freshness-report` and `trigger-index-rebuild` carry neither. Every duplication below therefore pays its cost twice per change, on the branch push and again on the PR. [SOURCE: .github/workflows/advisory-checks.yml:2] [SOURCE: .github/workflows/spec-kit-check.yml:1]

2. Five workflows re-run a check the local hooks already block: `comment-hygiene.yml` against the `commentHygiene` pre-commit gate, `agent-mirror-sync.yml` and the `mirrorParity` gate, `prompt-card-sync.yml` and the `cardSync` gate, `message-contract.yml` against the pre-push message-contract gate, and `routing-registry-drift.yml` against the pre-push compiled-routing and routing-commit-parity gates. Each is a correct backstop for a bypassed or uninstalled hook, but none of them can catch anything the hook would not have caught on the same change. [SOURCE: .github/workflows/comment-hygiene.yml:1] [SOURCE: .github/workflows/routing-registry-drift.yml:1] [SOURCE: .skilled/scripts/git-hooks/lib/gates.tsv:1]

3. `advisory-checks.yml` runs four steps that are green by construction: `Node test suites (report-only)`, `Doc-model reference drift (report-only)`, `Trigger index freshness (report-only)` and `AGENTS.md manifest (report-only)`, each `continue-on-error: true`, with the workflow comment stating that the run status is not to be read ("Read the step output, not the run status"). It costs a measured mean of 87 s per run and, by design, blocks nothing and informs nobody who does not open a log. [SOURCE: .github/workflows/advisory-checks.yml:15] [SOURCE: .github/workflows/advisory-checks.yml:36]

4. The doc-model reference validator was removed from pre-commit because it scanned the whole tree for advisory output, and its CI destination is exactly that report-only step. The move removed commit latency but produced no enforcement anywhere: the check that could not block locally now cannot block in CI either. [SOURCE: .github/workflows/advisory-checks.yml:50] [SOURCE: .skilled/scripts/git-hooks/pre-commit:111]

5. The trigger index has two owners. `advisory-checks.yml` runs `generate-trigger-index.mjs --check` on every push and PR, and `trigger-index-rebuild.yml` (185 s mean, 331 lines) repairs the same artifact after merge on the integration branches. One artifact, two workflows, and the repair path is the only one with authority. [SOURCE: .github/workflows/advisory-checks.yml:67] [SOURCE: .github/workflows/trigger-index-rebuild.yml:1]

6. `dispatch-enforcement-guard.yml` carries a second job whose name is `Every hook vitest suite passes` and whose command is `vitest run --config .skilled/hooks/vitest.config.ts` over the whole `.skilled/hooks` tree, while the workflow name claims dispatch-rule enforcement only. A workflow named for one guard runs an unrelated full test tree on every push and PR, so its red X no longer says what broke. [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:69] [SOURCE: .skilled/hooks/vitest.config.ts:1]

## Ruled Out

- Re-arguing triggers, caching, or a workflow-consolidation decision: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`.
- Treating every duplicate as deletable: `comment-hygiene.yml` and `agent-mirror-sync.yml` are the only backstop for a contributor whose hooks are not installed or trusted, so the cut is to stop paying for them on every run, not to remove them.

## Dead Ends

- Deleting the hook-backstop workflows outright. Measured cost per run is 66-148 s for the guard cluster, but each one covers the uninstalled-hook case, which is the normal case for a fresh clone.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: `advisory-checks.yml` documents itself as a deliberate home for non-blocking checks, while the pre-commit comment presents the same move as a win. Both are true; the finding states the enforcement gap rather than claiming the move was wrong.
- Missing dependencies: per-job durations are not recorded, only per-workflow mean wall clock including queue time, so job-level savings stay inferred.
- Partial success: the inventory is complete for triggers and step bodies but not for per-workflow test volume, which the next iterations measure.

## Sources Consulted

- `.github/workflows/*.yml` (32 files, `on:` blocks)
- `.github/workflows/advisory-checks.yml` (full)
- `.github/workflows/dispatch-enforcement-guard.yml:69`
- `.github/workflows/gate-inputs.yml:47-56`
- `.github/workflows/trigger-index-rebuild.yml`
- `.skilled/scripts/git-hooks/lib/gates.tsv`
- `.skilled/hooks/vitest.config.ts`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md` (CI run-time table)

## SCOPE VIOLATIONS

None. Workflow files were read only.

## Assessment

- New information ratio: 0.92
- Questions addressed: "Which CI workflows duplicate a local git hook check or another workflow, and how many seconds per run would deleting or merging them save?"
- Questions answered: none fully — the duplication set is now named, but seconds per job remain inferred from workflow means.

## Reflection

- What worked and why: pairing each workflow with its hook gate by name and command, which turns "many workflows" into a finite duplicate set. Extracting `on:` blocks first also showed that almost everything pays twice per change, which multiplies any saving.
- What did not work and why: expecting job-level timing to exist. Only workflow means are recorded, so every per-job figure has to be labelled inferred.
- What I would do differently: measure the four advisory steps directly, since they are read-only report jobs and would convert the largest inferred number into a measured one.

## Recommended Next Focus

Measure the four `advisory-checks.yml` steps individually, then inventory what `Node test suites (report-only)` actually runs through `.skilled/scripts/run-node-tests.mjs`.
