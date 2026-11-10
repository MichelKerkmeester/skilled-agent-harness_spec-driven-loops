# Iteration 018 — Consolidation: workflow count is not the cost driver

## Focus

Whether the many small push-to-main workflows should be merged into fewer workflows with parallel jobs, a shared reusable workflow, or a single changed-files gate — weighed against the measured cost data, required-check names, failure isolation and the README contract. Read-only: no workflow, script or code was modified.

## Actions Taken

1. Re-read the measured dataset's billing rule and per-workflow medians, and the nine workflows that run on every push with no path filter.
2. Counted rebuild commits in the 1000-run window by `displayTitle`, and which workflows each one re-ran.
3. Read the job and step structure of the always-run workflows (`command-tree-parity`, `message-contract`, `gate-inputs`, `changed-packet-validation`, `dispatch-enforcement-guard`, `advisory-checks`).
4. Inventoried caching, reusable workflows, composite actions, path filters, install duplication and concurrency across all 33 workflows.
5. Read the README's per-workflow contract and the gate-inputs text scan that enforces it.

## Findings

**F18-1 (confirmed) — the trigger-index rebuild commit is the dominant CI load: 35 of the 73 distinct push SHAs in the window are rebuild commits, and each re-runs 13 downstream workflows.**

The run dump holds 1000 runs, 985 of them push runs over 73 distinct push SHAs; 35 of those SHAs carry the rebuild commit title, 47.9% [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/runs-last-1000.json:1]. Each rebuild SHA appears once under each of 13 downstream workflow names (Command Tree Parity, Spec-Kit Check, Rule Canary Sync, OpenCode Plugin Tests, Message Contract, Markdown Link Integrity, sk-doc Script Tests, Playbook Operator Contract, Hook Node Tests, Dispatch Enforcement Guard, Advisory Checks, Changed Packet Validation, Gate Inputs), plus once under Trigger Index Rebuild itself, whose loop guard skips it [SOURCE: .github/workflows/trigger-index-rebuild.yml:33]. The mechanism is visible in the run counts: in a window with only 38 non-rebuild pushes, spec-kit-check ran 50 times [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:9], hooks-node-tests 61 [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:13], opencode-plugin-tests 61 [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:14] and markdown-link-integrity 49 [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:23] — none of those extra runs can come from a real change. The rebuild stages four generated files under `.skilled/skills/system-spec-kit/` [SOURCE: .github/workflows/trigger-index-rebuild.yml:79] [SOURCE: .github/workflows/trigger-index-rebuild.yml:80], inside the path filters that admit those workflows. Multiplying the per-run medians [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:9] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:10] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:11] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:12] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:13] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:14] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:15] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:16] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:17] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:18] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:19] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:20] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:23] by those 35 runs gives 2030 billed minutes in the 23.5-hour window, about 2074/day, or 54% of the dataset's 3812 billed min/day estimate [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5]. The run counts and titles are confirmed; the cost multiplication is inferred from medians.

**F18-2 (confirmed) — merging workflows into one file with parallel jobs cannot reduce billed minutes, because billing is per job.**

The dataset defines billed minutes as the sum over non-skipped jobs of `ceil(job seconds / 60)` [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5]. A merged workflow keeps every job and every job's own rounding, so thirteen workflows with one 70-second job each and one workflow with thirteen such jobs bill identically. Only removing jobs, shortening a job across a minute boundary, or not starting the run at all saves minutes. The rebuild data proves the point: the 13 re-run workflows cost their jobs' minutes, not their files' minutes. This makes "fewer workflow files" a maintenance goal, not a cost goal.

**F18-3 (confirmed) — the same duplication exists inside workflows: 11 workflows install in two or more jobs, and no workflow caches anything.**

Install commands counted per workflow: spec-kit-check 9, routing-registry-drift 4, sk-doc-script-tests 3, deep-loop-runtime 3, sk-doc-rename-harness 3, skill-advisor-stress 3, and two each in command-tree-parity, dispatch-enforcement-guard, gate-inputs, playbook-operator-contract and skill-doc-frontmatter. `command-tree-parity`'s two jobs each run the same `npm --prefix .opencode/skills/system-spec-kit ci` [SOURCE: .github/workflows/command-tree-parity.yml:29] [SOURCE: .github/workflows/command-tree-parity.yml:61], and `dispatch-enforcement-guard` installs the hooks runner in its second job [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:52]. No workflow names `actions/cache` or a setup-node `cache:` input (grep: zero hits across all 33 files). This is the duplication a consolidation should remove; merging files does not touch it.

**F18-4 (inferred) — merging the nine always-run workflows into one job would save roughly 700–900 billed min/day, at the cost of nine check names and their failure isolation.**

The nine workflows with no path filter cost 1866 billed min/day: command-tree-parity 299, dispatch-enforcement-guard 299, changed-packet-validation 149, gate-inputs 149, message-contract 149, playbook-operator-contract 149, rule-canary-sync 149, advisory-checks 75 and sk-doc-script-tests 448 [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:10] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:11] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:12] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:15] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:16] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:17] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:18] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:19] [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:20]. Their 13 jobs total 1065 job-seconds per push and bill 25 minutes. One job running the same checks would pay one checkout, one setup and one install; removing a 25–40 second fixed floor eight times leaves 13–15 minutes, a saving of 10–12 minutes per push, or 730–876/day. Inferred, because the dataset carries no step timings, the merged job must take the union of checkout options (`message-contract` fetches full history [SOURCE: .github/workflows/message-contract.yml:22]), and a failing step stops later steps unless each is guarded with `if: always()`. The check-name cost is concrete: message-contract's comment asks for its check to be required in the branch ruleset [SOURCE: .github/workflows/message-contract.yml:5], so collapsing nine jobs into one replaces nine contexts with one.

**F18-5 (confirmed) — a shared reusable workflow would dedupe YAML, not minutes; a composite setup action is the only shared form that can also carry a cache.**

No workflow uses `uses: ./` (zero hits), so the repository has neither a reusable workflow nor a composite action today. A `workflow_call` callee's jobs still run as separate jobs with their own checkout and setup, so the billed minutes are unchanged. A composite action inlined into the existing jobs can replace the repeated checkout/setup/install steps in place while preserving job names, check contexts and failure isolation. That makes the composite the low-risk first consolidation and the reusable workflow a later, maintenance-only option.

**F18-6 (inferred) — a single changed-files gate is worse than native path filters for the filtered workflows.**

A workflow whose `paths:` filter does not match is never started and bills 0. A gate job runs on every push and bills at least one minute, and the jobs it gates then skip — skipped jobs bill 0, but the gate is a new fixed cost on every run. The gate also depends on the unresolved required-check question: whether a job skipped by `if:` satisfies a required status check is still unestablished, while a native path filter leaves the check absent by design and is already the shipped behavior. The one place a gate could help — skipping the always-run group on a rebuild commit — is served by `paths-ignore` for the four generated files at zero runtime cost.

**F18-7 (documented) — the README and the required-check list are the two contracts a merge breaks, and both live outside the workflow file.**

The README gives every workflow a responsibility row [SOURCE: .github/workflows/README.md:24] and a trigger/why row [SOURCE: .github/workflows/README.md:64], and documents the rebuild's file set and push contract [SOURCE: .github/workflows/README.md:58]. `check-gate-inputs.sh` reads the workflow files as text [SOURCE: .github/scripts/check-gate-inputs.sh:481], and gate-inputs enforces `.opencode/` and `.skilled/` path parity, so a merged file must keep both roots' inputs. Required checks live in the branch ruleset, not the repository: message-contract's comment asks for one [SOURCE: .github/workflows/message-contract.yml:5], and sk-git's changelog records that until it is required CI reports but does not block [SOURCE: .skilled/skills/sk-git/changelog/v1.8.0.0.md:53]. Job `name:` strings are therefore the check identities; a merge that keeps every job name keeps every context, and a merge that collapses jobs renames the context and needs a ruleset edit.

**F18-8 (inferred) — `paths-ignore` on the four generated files is the highest-saving, lowest-blast-radius consolidation, and the rebuild's own direct push shows required checks are not an obstacle there.**

The rebuild pushes its commit directly to `main` with a personal token and exits 1 on a ruleset or authentication failure [SOURCE: .github/workflows/README.md:58]. A direct push cannot be gated by checks on the SHA it is creating, and 35 such commits exist in the window, so the token is already permitted past whatever the ruleset requires. Adding `paths-ignore` for the four staged files [SOURCE: .github/workflows/trigger-index-rebuild.yml:79] to the 13 downstream workflows removes 455 runs per window (F18-1) without touching a job, a check name or a trigger. The one consumer that reads the index is advisory-checks' report-only freshness step [SOURCE: .github/workflows/advisory-checks.yml:55], and the rebuild verifies its outputs against a fresh generation before committing [SOURCE: .github/workflows/trigger-index-rebuild.yml:95], so that coverage moves into the rebuild rather than disappearing. Inferred, because the ruleset itself is not readable from the repository.

## Cost summary (window = 23.5 h, 1000 runs)

| Group | Billed min/day | Share of 3812 | Note |
|---|---|---|---|
| Rebuild-commit re-runs (13 workflows x 35 runs) | ~2074 | 54% | Inferred from medians; overlaps the rows below |
| Nine always-run workflows, every push | 1866 | 49% | No path filter by design ("guards over the whole tree" [SOURCE: .github/workflows/README.md:66]) |
| spec-kit-check alone | 1279 | 34% | 25 billed min/run, 50 runs/day, 35 of them rebuild commits |

The rows overlap: spec-kit-check is part of both the rebuild group and the filtered set. The point is that 54% of the spend is a generated commit re-running checks that already passed on the real commit.

## Questions Answered

None marked as fully answered. The phase-grouping question gains its consolidation rows (F18-4, F18-8) but the full ordered table remains open.

## Questions Remaining

- How do the ranked recommendations group into ordered implementation phases 002 and later? *(now has three consolidation rows: paths-ignore, shared composite, job merge)*
- **Blocking phase 002, unchanged:** does a job skipped by `if:` satisfy a required status check? `paths-ignore` sidesteps it for the rebuild commit because that push bypasses the ruleset, but not for a real commit.
- Which jobs duplicate pre-commit hooks? *(carried)*
- Are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and what are the include globs of `.skilled/hooks/vitest.config.ts`? *(carried)*
- New: what is the real per-job fixed floor (checkout + setup + scheduling) that F18-4's saving depends on? The dataset has no step timings, so the 700–900 min/day range is a model, not a measurement.
- New: does every one of the 13 downstream workflows tolerate `paths-ignore` on all four generated files, or does one of them consume the sidecars?

## Next Focus

Settle the last `/doctor:ci` ownership residual — a new router file versus a `ci` target on an existing doctor command — using the route manifest's per-command versus per-target presentation and `/doctor:setup` row. Then fold the ranked rows, including F18-4 and F18-8, into the final phase table.
