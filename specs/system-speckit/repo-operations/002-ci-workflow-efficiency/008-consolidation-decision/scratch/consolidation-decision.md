# Consolidation decision

Every number below comes from `scratch/consolidation-cost.json` (after), which `node scratch/consolidation-cost.mjs --check` re-derives from the saved JSON, or from `scratch/consolidation-baseline.md` (before). Measurement rules: job seconds run from `startedAt` to `completedAt`; billed minutes are `ceil(seconds / 60)` per non-skipped job; the 001 before figures scale their 23.5 h window by `24 / 23.5`; the after figures scale each workflow's newest 40 runs by `24 / hours`, with the hours in `scratch/window.json`.

## Context

R27 (`001-research/research/synthesis-reviews/final-review.md:504-511`) prices a merge of the always-run workflows at an upper bound of 1,241..1,606 runner-min/day "at today's volume; far less after R1". Every input to that bound has moved since:

- R1 removes 35 of 73 push SHAs (`final-review.md:64`), so the unfiltered push workflows fell from 73 runs to 49 in the 002 window (`002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`).
- R4 path-filters `command-tree-parity.yml`, which `final-review.md:256` sizes as 30 of 38 human pushes skipped. The tree now gates it on `SKILLED_CI_TESTS` (`.github/workflows/README.md:84`).
- R6 reshapes `dispatch-enforcement-guard.yml` (`final-review.md:269`) and R8 gives `rule-canary-sync.yml` a sparse checkout (`final-review.md:296`): its checkout is now 2 s at the median, against 51 s for the others.

## Candidates

- The nine always-run workflows, 13 jobs: `advisory-checks.yml` (1), `changed-packet-validation.yml` (1), `command-tree-parity.yml` (2), `dispatch-enforcement-guard.yml` (2), `gate-inputs.yml` (1), `message-contract.yml` (1), `playbook-operator-contract.yml` (1), `rule-canary-sync.yml` (1), `sk-doc-script-tests.yml` (3). Source: `scratch/pre-merge-inventory.md`, `tree: 9 workflows, 13 jobs`.
- The candidate set the plan fixes (ADR-002): the eight always-run workflows inside `SKILLED_CI_FRESHNESS`, 12 jobs, which is every one of the nine except `message-contract.yml`.
- `message-contract.yml` is excluded. It answers `SKILLED_CI_MESSAGES`, and its job context `Commit messages, branch names and PR description follow the templates` is the one required status check in ruleset 24326453 (`message-contract-required`), read with `gh api repos/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/rules/branches/main`. A merged job answering both variables would let one group's switch silence the other group's required check (`001-research/research/research.md:189`).
- Tree finding: `command-tree-parity.yml`'s two jobs read `SKILLED_CI_TESTS`, not `SKILLED_CI_FRESHNESS`, and its push trigger is path-filtered (`scratch/pre-merge-inventory.md`). So the plan's eight now span two switch groups. The seven that do read `SKILLED_CI_FRESHNESS` (10 jobs) are shown as `freshnessSwitched` beside the plan's eight.

## Measurements

Before, the 001 dataset (`scratch/consolidation-baseline.md`):

- The nine: 13 jobs, 1,065 job-seconds and 25 billed minutes per push, 73 runs each, 1,866 runner-min/day.
- The bound at today's volume: `1,065 s - 12 x 50..76 s = 153..465 s`, 3..8 billed, 17..22 saved per push, `73 x 17..22 = 1,241..1,606` runner-min/day. Labelled "today's volume": it is the 001 volume, not the current one.
- The FRESHNESS eight: 12 jobs, 987 job-seconds, 23 billed per push, 15..20 saved per push.
- Post-R1, the 002 baseline: the nine at 1,145 billed min in its 24 h window, the eight at 993.
- Projection on 38 human pushes, inferred and not measured: `38 x 17..22 = 646..836` runner-min/day for the nine.

After, the snapshot in `scratch/consolidation-cost.json` (runs from 2026-10-24T22:10:53Z to 2026-10-25T20:17:22Z for eight of the nine):

- Checkout median: 51 s over 517 checkout steps (range 1 to 114 s). The two `fetch-depth: 0` jobs check out at a 72.5 s and 73 s median, and `rule-canary-sync.yml` at 2 s.
- The nine (`bounds.review`): 13 jobs, 1,022.5 job-seconds, 26 billed per push; merged `1,022.5 - 12 x 51 = 410.5 s`, 7 billed, saving 19 per push. Today they bill 1,045.32 runner-min/day; the plan's formula gives a saving of `19 x 50.26 = 954.94` runner-min/day, and the rate-aware figure is `1,045.32 - 351.82 = 693.5`.
- The plan's eight (`bounds.freshness`): 12 jobs, 943.5 job-seconds, 24 billed per push; merged `943.5 - 11 x 51 = 382.5 s`, 7 billed, saving 17 per push. Today they bill 944.8 runner-min/day. The plan's formula gives `17 x 44.1 = 749.7` runner-min/day saved; the rate-aware figure, which charges the merged job at the 44.1 runs/day the always-run members see, is `944.8 - 308.7 = 636.1`.
- The seven that read the switch (`bounds.freshnessSwitched`): 10 jobs, 803.5 job-seconds, 20 billed per push; merged 344.5 s, 6 billed, saving 14 per push; 869.76 runner-min/day today, saving 617.4 by the plan's formula or 605.16 rate-aware.
- The single-checkout subtraction uses the 51 s overall median. Subtracting each member's own checkout median instead, keeping one depth-0 checkout, removes 532 s rather than 561 s for the eight, so the merged job is 411.5 s. That is still 7 billed minutes, so the saving per push does not change.
- Sample run ids, the newest sampled run behind each median: `sk-doc-script-tests.yml` run id: 40230057497, `gate-inputs.yml` run id: 40230057423, `changed-packet-validation.yml` run id: 40230057404, `dispatch-enforcement-guard.yml` run id: 40230057363, `command-tree-parity.yml` run id: 40227757984, `message-contract.yml` run id: 40230057372. Every job row in `scratch/consolidation-cost.md` names its own.
- Excluded and counted: one run with an empty `jobs` array (run id: 40221346293, `sk-doc Script Tests`, cancelled); no skipped job and no job without timestamps.

## Signal cost

- 12 check contexts collapse into one for the plan's eight, 13 into one for all nine. A red run would name one job, and the reader would open the step list to find which of twelve checks failed.
- The merged job is serial: 382.5 s of work against a 190 s worst single job today (`sk-doc script tests`, n 39). Today the twelve jobs run in parallel, so the first signal arrives after about 190 s; merged, the last check would report after about 6.4 minutes.
- Every step after the checkout needs an `if: always()` guard, or the first failure hides every check behind it.
- The trigger union adds coverage nobody asked for. `advisory-checks.yml`, `gate-inputs.yml` and `playbook-operator-contract.yml` answer every pull request, so the union is a bare `pull_request:`. Then `changed-packet-validation.yml` and `rule-canary-sync.yml` (today `main` only), `dispatch-enforcement-guard.yml` and `sk-doc-script-tests.yml` (today `main` and `skilled/**`) would run on pull requests to any branch. `command-tree-parity.yml`'s steps would also lose their path filter and run on every push.
- Two members are protected by function (`001-research/research/research.md:184-187`): `gate-inputs.yml`, the only enforcer of an invariant with no local gate, and `dispatch-enforcement-guard.yml`, a guard whose failure invalidates other workflows' inputs. A merge deletes both files. Neither is a required status check: the only required context is message-contract's, which stays out.
- Including `command-tree-parity.yml` crosses into `SKILLED_CI_TESTS`. A merged job can read only one group variable, so `SKILLED_CI_TESTS=off` would stop silencing the command-tree checks, and `SKILLED_CI_FRESHNESS=off` would start silencing them.

## Recommendation

Do not merge. The measured saving is real, 636.1 runner-min/day rate-aware for the plan's eight. But it costs the per-check signal on twelve checks, more than doubles the time to the last freshness verdict, widens five members' pull-request coverage, and either crosses a switch group (the plan's eight) or leaves a set the plan did not price (the seven). R27 rates the merge high risk because the per-check signal is lost (`final-review.md:510`). The default is no merge unless the operator answers yes, and this record keeps the measured bound and the merge shape so a later packet can take it in one commit.

## D8 answer

D8: no

Recorded from `scratch/d8-answer.md`, which holds the date, the operator's verbatim delegation of 2026-10-25 and the note that this is the session's judgment, pending the operator's verification at the end of the session.
