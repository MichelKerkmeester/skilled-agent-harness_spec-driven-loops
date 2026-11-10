# Consolidation baseline (before)

Source: `specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:7-20` for the workflow rows and `:45-56` for the job seconds. That dataset's window is 1000 runs over 23.5 h (`summary.md:4`), and its per-day figures are scaled by `24 / 23.5`.

## Workflows

| Workflow | Jobs | Runs in window | Median billed/run | Billed/day |
|---|---|---|---|---|
| `advisory-checks.yml` | 1 | 73 | 1 | 75 |
| `changed-packet-validation.yml` | 1 | 73 | 2 | 149 |
| `command-tree-parity.yml` | 2 | 73 | 4 | 299 |
| `dispatch-enforcement-guard.yml` | 2 | 73 | 4 | 299 |
| `gate-inputs.yml` | 1 | 73 | 2 | 149 |
| `message-contract.yml` | 1 | 73 | 2 | 149 |
| `playbook-operator-contract.yml` | 1 | 73 | 2 | 149 |
| `rule-canary-sync.yml` | 1 | 73 | 2 | 149 |
| `sk-doc-script-tests.yml` | 3 | 73 | 6 | 448 |
| **Total** | **13** | **73 per workflow** | **25 per push** | **1,866** |

## Jobs

| Workflow | Job id | Median job seconds |
|---|---|---|
| `sk-doc-script-tests.yml` | `sk-doc-scripts` | 77 |
| `sk-doc-script-tests.yml` | `catalog-packages` | 56 |
| `sk-doc-script-tests.yml` | `citation-drift` | 167 |
| `command-tree-parity.yml` | `command-tree-parity` | 70 |
| `command-tree-parity.yml` | `hermes-mirror` | 69 |
| `dispatch-enforcement-guard.yml` | `dispatch-enforcement-guard` | 72 |
| `dispatch-enforcement-guard.yml` | `hooks-vitest` | 69 |
| `changed-packet-validation.yml` | `changed-packets` | 92 |
| `gate-inputs.yml` | `gate-inputs` | 101 |
| `message-contract.yml` | `message-contract` | 78 |
| `playbook-operator-contract.yml` | `operator-contract` | 76 |
| `rule-canary-sync.yml` | `rule-canary` | 78 |
| `advisory-checks.yml` | `advisory` | 60 |
| **Total** | **13 jobs** | **1,065** |

## Arithmetic

- `1,065 s - 12 x 50..76 s = 153..465 s = 3..8 billed` per push against 25, so `17..22` minutes saved per push.
- `73 x 17..22 = 1,241..1,606` runner-min/day, the bound at today's volume.
- The FRESHNESS eight are 12 jobs and `987` job-seconds and 23 billed minutes, so `987 s - 11 x 50..76 s = 151..437 s = 3..8 billed` and `15..20` minutes saved per push.
- The post-R1 before number is `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`, quoted here with its total line: `**Total, .github/workflows runs** | 728 | | | | **2191**`.

## Post-R1 rows for the nine

From the same 002 summary's per-workflow table, a 24 h window from 2026-10-23T21:59:34Z, so no scaling applies. Each figure is runs in window times the median billed minutes of the five latest completed runs.

- `sk-doc Script Tests`: 49 runs x 7 = 343.
- `Dispatch Enforcement Guard`: 49 x 4 = 196.
- `Message Contract`: 76 x 2 = 152.
- `Playbook Operator Contract`: 50 x 2 = 100.
- `Changed Packet Validation`: 49 x 2 = 98.
- `Gate Inputs`: 49 x 2 = 98.
- `Command Tree Parity`: 15 x 4 = 60.
- `Rule Canary Sync`: 49 x 1 = 49.
- `Advisory Checks`: 49 x 1 = 49.
- The nine sum to 1,145; the eight without `Message Contract` sum to 993.
