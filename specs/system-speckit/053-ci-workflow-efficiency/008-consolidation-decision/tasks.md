---
title: "Tasks: Phase 8: consolidation-decision"
description: "Task Format: T### [P?] Description (file path). Ordered tasks for the consolidation decision gate: the D8 decision and the post-007 inventory, the before table, the after snapshot, the cost script, the decision record, the no-merge proof, the conditional merge and its probe, then the gates and the criteria."
trigger_phrases:
  - "consolidation decision tasks"
  - "phase 8 consolidation decision tasks"
  - "always-run workflow measurement tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: consolidation-decision

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Every task below names one file, quotes the anchor text it edits or reads, gives that anchor's line number, puts every command in a fenced block, states the expected result, names the acceptance criterion it satisfies, gives a rollback, and gives one concrete stop condition.

**Path convention.** Run every command from the repository root. `PHASE` means `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision`. Write the full path in a command unless the task sets `PHASE` in the same block.

**Anchor convention.** Every line number was read on this packet's scaffold commit. Phases 002 to 007 add a `concurrency:` block above `jobs:`, add a `timeout-minutes` and an `if:` to every job, delete `hooks-node-tests.yml` and rewrite `.github/workflows/README.md`, so a line below `jobs:` will have moved by the time these tasks run. Locate the quoted text and edit there. An absent anchor is a stop, never a nearby edit.

**Two tokens stand for data, never for prose.**

- `<sum>` is the arithmetic sum of the eight member workflows' job `timeout-minutes` values as phase 007 left them. Read the eight files, add the numbers, and write the total.
- `<answer>` is `no` or `yes`, copied from `scratch/d8-answer.md`.

**D8 gating.** T012 is the operator decision. T014 runs only on `D8=no`. T015 to T020 run only on `D8=yes`. No merge task starts before `scratch/d8-answer.md` exists and holds `D8=yes`.

**Comment hygiene.** No task adds an R-id, a D-id or a phase number to a workflow comment, a step name, a job name or a README sentence. Spec documents may cite them.

**Scope guard.** Under the default the only new paths are under `scratch/`. The only repository files any task touches are `.github/workflows/always-run-guards.yml`, the eight member workflow files named in T016, and `.github/workflows/README.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup and measurement

### T001 Record the phase start SHA (AC-006)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/phase-start-sha.txt` (new file). Anchor (read): `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/spec.md:149`, the line `| REQ-006 | **R26.** The group assignment follows the tiers of the push-versus-pull-request table at `.github/workflows/README.md:60-75`: FRESHNESS for the guards row at `:66`, `naming-standard-guard.yml` at `:67`, `gate-inputs.yml` at `:68` and `changed-packet-validation.yml` at `:70`; TESTS for the path-filtered row at `:69`; REVIEW for the review-time row at `:71`; REPORTS for `strict-pass-freshness-report.yml` and `trigger-index-rebuild.yml`; MESSAGES for `message-contract.yml`. The assignment is recorded in `scratch/switch-groups.md` with a workflow count and a job count per group |`.

Change: create `scratch/`, then write the output of `git rev-parse HEAD` to the new file as one line. The SHA must be taken after phase 007 has landed, which the check proves.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
mkdir -p "$PHASE/scratch"
git rev-parse HEAD > "$PHASE/scratch/phase-start-sha.txt"
wc -l < "$PHASE/scratch/phase-start-sha.txt"
grep -cE '^[0-9a-f]{40}$' "$PHASE/scratch/phase-start-sha.txt"
switch_commit=$(git log -1 --format=%H -S'SKILLED_CI_FRESHNESS' -- .github/workflows/gate-inputs.yml)
git merge-base --is-ancestor "$switch_commit" "$(cat "$PHASE/scratch/phase-start-sha.txt")" && echo switch-in-sha
test -f specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/summary.md && echo baseline-ok
grep -c 'SKILLED_CI_FRESHNESS' .github/workflows/gate-inputs.yml
grep -c 'concurrency:' .github/workflows/command-tree-parity.yml
test ! -f .github/workflows/hooks-node-tests.yml && echo hooks-merged
```

Expected: `1`; `1`; `switch-in-sha`; `baseline-ok`; `1`; `1`; `hooks-merged`.

Rollback: delete `scratch/phase-start-sha.txt`.

Stop and escalate if: `switch-in-sha` is missing, or any of `baseline-ok`, `hooks-merged`, the `gate-inputs.yml` count of `1` or the `command-tree-parity.yml` count of `1` is missing, because a dependency phase has not landed and the SHA would predate the phase.

---

### T002 [B] Record the post-007 job inventory (AC-001, AC-004)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/pre-merge-inventory.md` (new file). Anchor (read): `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/phase-start-sha.txt`, its single line, written by T001.

Change: run the parse below and write one row per `(workflow, job)` pair with the columns `workflow | job | name | trigger | job-if | timeout`, then a final line `tree: 9 workflows, 13 jobs`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
python3 - "$PHASE/scratch/pre-merge-inventory.md" <<'PY'
import sys, yaml
files = ['advisory-checks','changed-packet-validation','command-tree-parity','dispatch-enforcement-guard',
         'gate-inputs','message-contract','playbook-operator-contract','rule-canary-sync','sk-doc-script-tests']
rows, jobs = [], 0
for f in files:
    d = yaml.safe_load(open('.github/workflows/%s.yml' % f))
    on = d.get(True) or d.get('on')
    trigger = ','.join(sorted(k for k in on if k != 'jobs'))
    for jid, j in d['jobs'].items():
        jobs += 1
        rows.append('| `%s.yml` | `%s` | %s | %s | %s | %s |' % (
            f, jid, j.get('name', '-'), trigger, j.get('if', '-'), j.get('timeout-minutes', '-')))
open(sys.argv[1], 'w').write('# Pre-merge inventory\n\n| workflow | job | name | trigger | job-if | timeout |\n|---|---|---|---|---|---|\n'
                              + '\n'.join(rows) + '\n\ntree: %d workflows, %d jobs\n' % (len(files), jobs))
print('jobs', jobs)
PY
grep -c '^| `' "$PHASE/scratch/pre-merge-inventory.md"
grep -c '^tree: 9 workflows, 13 jobs$' "$PHASE/scratch/pre-merge-inventory.md"
```

Expected: `jobs 13`; `13`; `1`.

Rollback: delete `scratch/pre-merge-inventory.md`.

Stop and escalate if: the parse prints anything other than `jobs 13`, or a member file is missing from `.github/workflows/`.

---

### T003 Write the before table (AC-001)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-baseline.md` (new file). Anchor (read): `specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:56`, the line `- **advisory-checks.yml**: Advisory — test suites and doc-model references 60s`.

Change: write the two tables below verbatim, then a `## Arithmetic` section with four bullet lines carrying the bound. Do not add a third table.

```text
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
```

```text
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
```

The four arithmetic bullets, one per line:

```text
- `1,065 s - 12 x 50..76 s = 153..465 s = 3..8 billed` per push against 25, so `17..22` minutes saved per push.
- `73 x 17..22 = 1,241..1,606` runner-min/day, the bound at today's volume.
- The FRESHNESS eight are 12 jobs and `987` job-seconds and 23 billed minutes, so `987 s - 11 x 50..76 s = 151..437 s = 3..8 billed` and `15..20` minutes saved per push.
- The post-R1 before number is `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`, quoted here with its total line.
```

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
grep -c '^| ' "$PHASE/scratch/consolidation-baseline.md"
grep -c '1,241..1,606' "$PHASE/scratch/consolidation-baseline.md"
grep -c '1,065' "$PHASE/scratch/consolidation-baseline.md"
grep -c '002-rebuild-fanout-removal/scratch/baseline-24h/summary.md' "$PHASE/scratch/consolidation-baseline.md"
python3 -c "
import re
t = open('$PHASE/scratch/consolidation-baseline.md').read()
rows = [l for l in t.splitlines() if l.startswith('| ') and '**Total**' not in l and not l.startswith('| Workflow')]
job_rows = [l for l in rows if l.count('|') == 4]
print('data rows', len(rows))
print('job seconds', sum(int(l.rsplit('|', 2)[1].strip()) for l in job_rows if l.rsplit('|', 2)[1].strip().isdigit()))
"
```

Expected: `26`; at least `1`; at least `1`; at least `1`; `data rows 22`; `job seconds 1065`.

Rollback: delete `scratch/consolidation-baseline.md`.

Stop and escalate if: the table-line count is not `26`, or `job seconds` is not `1065`, because the rows were mistyped.

---

### T004 Take the post-007 run list (AC-002)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/runs-after.json` (new file). Anchor (read): `specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:4`, the line `Recent window: 1000 runs over 23.5 h (2026-10-22T07:07:25Z to 2026-10-23T06:35:03Z).`

Change: run the command below and write its output to the new file. Take it at least 24 h after phase 007's last workflow run.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
gh run list --limit 1000 --json databaseId,name,headSha,event,conclusion,createdAt,startedAt,updatedAt > "$PHASE/scratch/runs-after.json"
jq -e . "$PHASE/scratch/runs-after.json" > /dev/null && echo json-ok
jq 'length' "$PHASE/scratch/runs-after.json"
jq -r '[.[].createdAt] | min, max' "$PHASE/scratch/runs-after.json"
```

Expected: `json-ok`; a count of at least `900`; two ISO timestamps at least 20 hours apart.

Rollback: delete `scratch/runs-after.json`.

Stop and escalate if: `gh` exits non-zero, the count is below `900`, or the two timestamps are less than 20 hours apart.

---

### T005 Take the per-workflow run index (AC-002)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/jobs/<workflow>/index.json` (nine new files). Anchor (read): `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/pre-merge-inventory.md`, its `tree: 9 workflows, 13 jobs` line written by T002.

Change: run the loop below, which writes one `index.json` per member workflow holding its newest 40 runs.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
for wf in advisory-checks.yml changed-packet-validation.yml command-tree-parity.yml dispatch-enforcement-guard.yml gate-inputs.yml message-contract.yml playbook-operator-contract.yml rule-canary-sync.yml sk-doc-script-tests.yml; do
  mkdir -p "$PHASE/scratch/jobs/$wf"
  gh run list --workflow "$wf" --limit 40 --json databaseId,createdAt > "$PHASE/scratch/jobs/$wf/index.json"
done
ls -d "$PHASE"/scratch/jobs/*/ | wc -l
for d in "$PHASE"/scratch/jobs/*/; do printf '%s %s\n' "$(basename "$d")" "$(jq 'length' "$d/index.json")"; done
```

Expected: `9`; nine lines, each with a count of at least `20` and at most `40`.

Rollback: `rm -r "$PHASE/scratch/jobs"`.

Stop and escalate if: any directory holds fewer than `20` runs. Record that workflow in `scratch/phase-result.md`, keep the snapshot, and re-run T004 to T007 after 24 more hours so its window doubles; do not take T006 or T008 to T010 on the thin sample.

---

### T006 Take the job-level samples (AC-002)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/jobs/<workflow>/<run-id>.json` (new files). Anchor (read): the `index.json` each file is fetched from, written by T005.

Change: run the loop below, which fetches `gh run view <id> --json jobs` for every id in every index and writes one file per run.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
for wf in advisory-checks.yml changed-packet-validation.yml command-tree-parity.yml dispatch-enforcement-guard.yml gate-inputs.yml message-contract.yml playbook-operator-contract.yml rule-canary-sync.yml sk-doc-script-tests.yml; do
  jq -r '.[].databaseId' "$PHASE/scratch/jobs/$wf/index.json" | while read -r id; do
    gh run view "$id" --json jobs > "$PHASE/scratch/jobs/$wf/$id.json"
  done
done
find "$PHASE/scratch/jobs" -name '*.json' ! -name 'index.json' | wc -l
find "$PHASE/scratch/jobs" -name '*.json' ! -name 'index.json' -exec jq -e '.jobs' {} \; > /dev/null && echo jobs-key-ok
```

Expected: a count equal to the sum of the nine index lengths from T005, and `jobs-key-ok`.

Rollback: delete every file whose name is a numeric run id under `scratch/jobs/`.

Stop and escalate if: `jq -e '.jobs'` fails on any file, or the count differs from the sum T005 printed.

---

### T007 Record the snapshot window (AC-002)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/window.json` and `scratch/snapshot-window.md` (two new files). Anchor (read): `scratch/runs-after.json`, the `createdAt` values of its first and last entries.

Change: write `window.json` with the shape below. `start`, `end` and the top-level `hours` come from the oldest and newest `createdAt` in `runs-after.json`, in hours rounded to two decimals. Each `perWorkflow` entry takes `runs` from that workflow's `index.json` length and `hours` from the span of that workflow's own `createdAt` values, floored at `1`. Write `snapshot-window.md` as one row per workflow with its run count and its hours.

```json
{
  "start": "<oldest createdAt>",
  "end": "<newest createdAt>",
  "hours": 23.5,
  "perWorkflow": {
    "advisory-checks.yml": { "runs": 40, "hours": 23.5 }
  }
}
```

`perWorkflow` carries all nine file names. A workflow that was re-snapshotted over 48 h carries that measured span in its own `hours`, and its `snapshot-window.md` row says `48 h window`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
jq -e . "$PHASE/scratch/window.json" > /dev/null && echo json-ok
jq '.perWorkflow | length' "$PHASE/scratch/window.json"
jq '.hours' "$PHASE/scratch/window.json"
jq -r '.perWorkflow | to_entries[] | "\(.key) \(.value.runs) \(.value.hours)"' "$PHASE/scratch/window.json"
grep -c '^| `' "$PHASE/scratch/snapshot-window.md"
```

Expected: `json-ok`; `9`; a positive number; nine lines whose run counts match T005's index lengths and whose hours are each greater than `0`; `9`.

Rollback: delete `scratch/window.json` and `scratch/snapshot-window.md`.

Stop and escalate if: `perWorkflow` does not hold exactly the nine file names, or any `hours` value is `0` or negative, which would make its runs-per-day infinite.

---

### T008 Write the cost script (AC-003)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-cost.mjs` (new file). Anchor (read): `specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5`, the line `Per-workflow medians come from the 40 latest runs (wall) and the 5 latest completed runs (jobs). Billed minutes = sum over non-skipped jobs of ceil(job seconds / 60), the GitHub rounding rule. Estimated total: 3812 billed min/day.`

Change: write one Node script with no dependencies that does exactly this, in this order:

1. Read `scratch/window.json`; fail when `perWorkflow` does not hold the nine member file names.
2. For each workflow, read every `scratch/jobs/<workflow>/*.json` except `index.json`.
3. For each run, skip a job whose `conclusion` is `skipped` or whose `startedAt` or `completedAt` is null or empty, and count it. Compute `seconds = (Date.parse(completedAt) - Date.parse(startedAt)) / 1000` and `billed = Math.ceil(seconds / 60)`.
4. Per workflow: `runs` is the file count, `medianBilled` is the median of the per-run sums, `runsPerDay = runs * 24 / hours`, `billedPerDay = medianBilled * runsPerDay`.
5. Per `(workflow, job name)`: `medianSeconds` over its runs and `medianBilled = Math.ceil(medianSeconds / 60)`. Mark a job `failed-only` when every run of it failed, and `no-sample` when it never appears.
6. Checkout seconds: for each job, the step whose `name` matches `/actions\/checkout/`; `checkoutSeconds` is the median over all such steps. Mark a job `no-checkout` when it has none.
7. Bounds. `review`: the 13 jobs, `mergedSeconds = sum(medianSeconds) - 12 * checkoutSeconds`, `mergedBilled = Math.ceil(mergedSeconds / 60)`, `savingPerPush = sum(medianBilled) - mergedBilled`, `savingPerDay = savingPerPush * max(runsPerDay)`. `freshness`: the same over the 12 jobs whose workflow is one of the eight, subtracting `11 * checkoutSeconds`.
8. Write `scratch/consolidation-cost.json` with keys `workflows` (9 entries), `jobs` (13 entries), `checkout`, `bounds`, `excluded`, and write `scratch/consolidation-cost.md` with exactly two tables, the workflow table (`| Workflow | Runs | Median billed/run | Runs/day | Billed/day |`, 9 rows plus a total row) and the job table (`| Workflow | Job | Median seconds | Median billed | Checkout |`, 13 rows plus a total row).
9. `--check` recomputes everything, compares the result to the stored JSON with a deep equality test, and exits `1` on any difference; on a match it prints `check: ok` and exits `0`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
node --check "$PHASE/scratch/consolidation-cost.mjs" && echo syntax-ok
grep -c 'consolidation-cost.json' "$PHASE/scratch/consolidation-cost.mjs"
grep -c 'check: ok' "$PHASE/scratch/consolidation-cost.mjs"
```

Expected: `syntax-ok`; at least `1`; `1`.

Rollback: delete `scratch/consolidation-cost.mjs`.

Stop and escalate if: `node --check` fails twice on the same line, or the script needs a package outside the Node standard library.

---

### T009 Run the cost script (AC-003)

File: `scratch/consolidation-cost.json` and `scratch/consolidation-cost.md` (two new files). Anchor (read): `scratch/window.json`, written by T007.

Change: run the script once and keep both outputs.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
node "$PHASE/scratch/consolidation-cost.mjs"; echo "exit=$?"
jq '.workflows | length' "$PHASE/scratch/consolidation-cost.json"
jq '.jobs | length' "$PHASE/scratch/consolidation-cost.json"
jq -e '.bounds.freshness.mergedBilled' "$PHASE/scratch/consolidation-cost.json"
grep -c '^| ' "$PHASE/scratch/consolidation-cost.md"
```

Expected: `exit=0`; `9`; `13`; a number; `26`.

Rollback: delete `scratch/consolidation-cost.json` and `scratch/consolidation-cost.md`.

Stop and escalate if: the exit is not `0`, a count is not `9` or `13`, or the table-line count is not `26`.

---

### T010 Verify the cost table reproduces (AC-003)

File: `scratch/consolidation-cost.json` (unchanged). Anchor (read): the `check: ok` string the script prints, written by T008.

Change: run `--check` and record its output in `scratch/phase-result.md` under a `## Cost check` heading, which is the only new content.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
node "$PHASE/scratch/consolidation-cost.mjs" --check; echo "exit=$?"
grep -c '^## Cost check$' "$PHASE/scratch/phase-result.md"
```

Expected: `check: ok` then `exit=0`; `1`.

Rollback: delete the `## Cost check` section from `scratch/phase-result.md`.

Stop and escalate if: `--check` exits `1` twice with the same difference, because the stored table and the recomputation disagree and a number in it cannot be trusted.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Decision and the conditional merge

### T011 Write the decision record (AC-004)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-decision.md` (new file). Anchor (read): `scratch/consolidation-cost.json`, the `bounds` object written by T009.

Change: write one document with exactly these six `##` headings in this order, each body filled from `scratch/consolidation-cost.json` and `scratch/consolidation-baseline.md`:

```text
## Context
## Candidates
## Measurements
## Signal cost
## Recommendation
## D8 answer
```

- `Context` states why the bound is stale: R1 removes 35 of 73 push SHAs, R4 removes 30 of 38 human pushes from `command-tree-parity.yml`, and R6 and R8 change two more.
- `Candidates` names the nine workflows and 13 jobs, the eight-workflow FRESHNESS set and its 12 jobs, and the `message-contract.yml` exclusion with its reason.
- `Measurements` quotes the before table's totals, the 1,241..1,606 bound at today's volume, the post-007 bound from `consolidation-cost.md`, the 646..836 projection on 38 human pushes labelled inferred, and the checkout median the script measured.
- `Signal cost` states that 13 check contexts collapse into one, that the merged job is serial against a 167 s worst single job, that every step needs an `if: always()` guard, and that the trigger union adds pull-request coverage on branches the filtered members did not watch.
- `Recommendation` states the default: no merge unless the operator answers yes.
- `D8 answer` holds the single line `D8: pending`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
grep -cE '^## (Context|Candidates|Measurements|Signal cost|Recommendation|D8 answer)$' "$PHASE/scratch/consolidation-decision.md"
grep -c '^D8: pending$' "$PHASE/scratch/consolidation-decision.md"
grep -c 'message-contract' "$PHASE/scratch/consolidation-decision.md"
grep -c 'SKILLED_CI_FRESHNESS' "$PHASE/scratch/consolidation-decision.md"
grep -c '1,241..1,606' "$PHASE/scratch/consolidation-decision.md"
grep -c 'ceil(seconds / 60)' "$PHASE/scratch/consolidation-decision.md"
grep -c '24 / 23.5' "$PHASE/scratch/consolidation-decision.md"
grep -cE 'run id: [0-9]+' "$PHASE/scratch/consolidation-decision.md"
```

Expected: `6`; `1`; at least `1`; at least `1`; at least `1`; at least `1`; at least `1`; at least `1`.

Rollback: delete `scratch/consolidation-decision.md`.

Stop and escalate if: the heading count is not `6`, or a number in `Measurements` differs from its `consolidation-cost.json` counterpart.

---

### T012 DECISION D8 (operator yes required) - merge the always-run FRESHNESS workflows or leave them separate (AC-005)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/d8-answer.md` (new file). Anchor: none; the file does not exist yet.

Default: `D8=no`. Nothing in `.github/workflows/` changes, the decision record closes the phase, and the measured bound is recorded for a later packet. It is the default because R27 calls the risk high if merged and says the per-check signal is lost (`final-review.md:500-501`), and because most of the bound is checkout and rounding that R1 already removes on 35 of 73 pushes.

Alternative: `D8=yes`. All eight always-run FRESHNESS workflows merge into `.github/workflows/always-run-guards.yml` as one job inside `SKILLED_CI_FRESHNESS`, worth at most the measured bound. A yes is also the second named confirmation that `dispatch-enforcement-guard.yml` and `gate-inputs.yml`, both protected by function, may be edited (`001-research/research/research.md:184-187`).

Change: put the question to the operator with the `Measurements` and `Signal cost` sections of `scratch/consolidation-decision.md` in hand, then write exactly one line to the new file: `D8=no` or `D8=yes`. The operator's stated default on 2026-10-23 is no merge; ask with the measured numbers, and treat no answer as `D8=no`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
grep -cE '^D8=(no|yes)$' "$PHASE/scratch/d8-answer.md"
wc -l < "$PHASE/scratch/d8-answer.md"
```

Expected: `1`; `1`.

Rollback: delete `scratch/d8-answer.md`.

Stop and escalate if: no answer arrives, or the answer is neither `no` nor `yes`, because a subset needs a different plan and a different arithmetic.

---

### T013 Record D8's answer in the decision record (AC-004, AC-005)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/consolidation-decision.md`. Anchor: `scratch/consolidation-decision.md`, the line `D8: pending`, written by T011.

Change: replace that one line with `D8: <answer>`, taking `<answer>` from `scratch/d8-answer.md`. Change no other line.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
grep -c '^D8: pending$' "$PHASE/scratch/consolidation-decision.md"
grep -cE '^D8: (no|yes)$' "$PHASE/scratch/consolidation-decision.md"
diff <(grep -E '^D8=' "$PHASE/scratch/d8-answer.md" | sed 's/^D8=/D8: /') <(grep -E '^D8: ' "$PHASE/scratch/consolidation-decision.md") && echo answer-matches
```

Expected: `0`; `1`; `answer-matches`.

Rollback: replace the `D8: <answer>` line with `D8: pending`.

Stop and escalate if: `D8: pending` is not on the file, or the two answers differ.

---

### T014 Record the no-merge proof (AC-006)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/no-merge.md` (new file). Runs only on `D8=no`; on `D8=yes` this task is cancelled and T015 to T020 run instead. Anchor (read): `scratch/phase-start-sha.txt`, the SHA written by T001.

Change: run both commands below and write their output, including the empty output, into the new file under a `## Workflow diff` and a `## Worktree status` heading.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
git diff --stat "$(cat "$PHASE/scratch/phase-start-sha.txt")"..HEAD -- .github/workflows
git status --porcelain -- .github/workflows
grep -c '^## Workflow diff$' "$PHASE/scratch/no-merge.md"
grep -c '^## Worktree status$' "$PHASE/scratch/no-merge.md"
```

Expected: both commands print nothing; `1`; `1`.

Rollback: delete `scratch/no-merge.md`.

Stop and escalate if: either command prints a path, because a workflow changed on the no-merge path.

---

### T015 Create the merged workflow (AC-007)

File: `.github/workflows/always-run-guards.yml` (new file). Runs only on `D8=yes`. Anchor (read): `.github/workflows/changed-packet-validation.yml:17-19`, the lines `      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1`, `        with:` and `          fetch-depth: 0`.

Change: write one workflow whose header is exactly this block, with `<sum>` replaced by the arithmetic sum of the eight members' job `timeout-minutes` values.

```yaml
name: Always-Run Freshness Guards

on:
  push:
    branches: [main, 'skilled/**']
  pull_request:
  workflow_dispatch:
  schedule:
    - cron: '17 6 * * *'

permissions:
  contents: read

jobs:
  always-run-guards:
    name: Always-run freshness guards
    runs-on: ubuntu-latest
    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'
    timeout-minutes: <sum>
    steps:
```

Copy the `concurrency:` block verbatim from `.github/workflows/command-tree-parity.yml` as phase 003 left it and insert it between `permissions:` and `jobs:`. Then assemble the steps in this order, each step keeping its `name:` and its `run:` body byte for byte:

1. One checkout, exactly the three lines quoted in this task's anchor.
2. The Node 20 group, in this member order: `advisory-checks.yml` steps without its checkout and its `setup-node`; `command-tree-parity.yml` steps from both jobs without their checkouts and `setup-node`s; `dispatch-enforcement-guard.yml` steps from both jobs without their checkouts and `setup-node`s; `playbook-operator-contract.yml` steps without its checkout and `setup-node`; `rule-canary-sync.yml` steps without its checkout.
3. One `actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0` with `node-version: '22'`.
4. The Node 22 group, in this member order: one `actions/setup-python@5fda3b95a4ea91299a34e894583c3862153e4b97 # v7.0.0` with `python-version: '3.x'`; `changed-packet-validation.yml` steps without its checkout and `setup-node`; `gate-inputs.yml` steps without its checkout and `setup-node`; `sk-doc-script-tests.yml` steps from all three jobs without their checkouts, `setup-node`s and `setup-python`s.

Every step after the checkout gets `if: always()` when it had no condition and `if: always() && (<original condition>)` when it had one.

Check:

```bash
python3 -c "
import yaml
d = yaml.safe_load(open('.github/workflows/always-run-guards.yml'))
print(len(d['jobs']), sorted(d['jobs']))
j = d['jobs']['always-run-guards']
print('schedule' in (d.get(True) or d.get('on')))
print(j['timeout-minutes'])
print(sum(1 for s in j['steps'] if str(s.get('if','')).startswith('always()')))
print(sum(1 for s in j['steps']))
"
grep -c 'node-version' .github/workflows/always-run-guards.yml
grep -c 'message-contract' .github/workflows/always-run-guards.yml
grep -c 'fetch-depth: 0' .github/workflows/always-run-guards.yml
grep -c 'SKILLED_CI_FRESHNESS' .github/workflows/always-run-guards.yml
```

Expected: `1 ['always-run-guards']`; `True`; `<sum>`; a count equal to the step count minus one; the step count; `2`; `0`; `1`; `1`.

Rollback: delete `.github/workflows/always-run-guards.yml`.

Stop and escalate if: the file parses with more than one job, the guarded-step count is not the step count minus one, or `node-version` does not appear exactly twice.

---

### T016 Delete the eight member workflows (AC-007)

File: the eight files named below (deleted). Runs only on `D8=yes`. Anchor: `.github/workflows/advisory-checks.yml:1`, the line `name: Advisory Checks`, and the first line of each of the other seven: `name: Changed Packet Validation` (`changed-packet-validation.yml:1`), `name: Command Tree Parity` (`command-tree-parity.yml:1`), `name: Dispatch Enforcement Guard` (`dispatch-enforcement-guard.yml:1`), `name: Gate Inputs` (`gate-inputs.yml:1`), `name: Playbook Operator Contract` (`playbook-operator-contract.yml:1`), `name: Rule Canary Sync` (`rule-canary-sync.yml:1`), `name: sk-doc Script Tests` (`sk-doc-script-tests.yml:1`).

Change: remove the eight files in one commit, after T015's file parses.

Check:

```bash
for f in advisory-checks changed-packet-validation command-tree-parity dispatch-enforcement-guard gate-inputs playbook-operator-contract rule-canary-sync sk-doc-script-tests; do test -f ".github/workflows/$f.yml" && echo "still-present $f"; done
test -f .github/workflows/hooks-node-tests.yml && expected=26 || expected=25
echo "expected=$expected"
ls .github/workflows/*.yml | wc -l
grep -c 'message-contract.yml' .github/workflows/README.md
```

Expected: no `still-present` line; `expected=25` when `hooks-node-tests.yml` is absent from the pre-merge tree, because phase 004's D5 was approved and deleted it (32 files, plus `always-run-guards.yml`, minus the eight members), and `expected=26` when it is present, because D5 was rejected (33 files, plus the merged file, minus the eight); the `ls` count equals the printed `expected` value; the README count is at least `1`.

Rollback: `git checkout HEAD~1 -- .github/workflows/advisory-checks.yml .github/workflows/changed-packet-validation.yml .github/workflows/command-tree-parity.yml .github/workflows/dispatch-enforcement-guard.yml .github/workflows/gate-inputs.yml .github/workflows/playbook-operator-contract.yml .github/workflows/rule-canary-sync.yml .github/workflows/sk-doc-script-tests.yml`.

Stop and escalate if: any of the eight is still present, or the surviving file count does not equal the printed `expected` value.

---

### T017 Update the README contents table (AC-009)

File: `.github/workflows/README.md`. Runs only on `D8=yes`. Anchor: `.github/workflows/README.md:26`, the line `| `advisory-checks.yml` | Runs advisory test suites, doc-model references and the trigger index freshness check (`generate-trigger-index.mjs --check`). Reports without gating. |`.

Change: delete these eight rows, each quoted whole with its line number, and insert one row in place of the first of them:

```text
:26  | `advisory-checks.yml` | Runs advisory test suites, doc-model references and the trigger index freshness check (`generate-trigger-index.mjs --check`). Reports without gating. |
:28  | `changed-packet-validation.yml` | Validates the spec packets a commit or pull request changed. Compares the set of failing rules at head against the merge base, or the previous tip on a push, and blocks when head fails a rule the base did not. |
:30  | `command-tree-parity.yml` | Keeps the OpenCode and Claude command trees identical, and the Hermes skill and prompt copies equal to their sources. |
:35  | `dispatch-enforcement-guard.yml` | Checks that every declared dispatch rule is reachable and discriminates. |
:36  | `gate-inputs.yml` | Checks that every hook and workflow input resolves and that every path filter names both `.opencode/` and `.skilled/`. |
:44  | `playbook-operator-contract.yml` | Checks the manual-testing-playbook operator-scenario contract. |
:48  | `rule-canary-sync.yml` | Checks rule canaries against their source rules. |
:52  | `sk-doc-script-tests.yml` | Runs the other sk-doc script tests, among them the durable-directory manifest and README verdict baseline, which walk the whole repository. |
```

The replacement row:

```text
| `always-run-guards.yml` | Runs the always-run freshness guards as one job: the advisory suites and doc-model references, the trigger index freshness report, command tree and Hermes mirror parity, the dispatch rule and hook vitest suites, the gate-input probe, the playbook operator contract, the rule canary and the sk-doc script, catalog and citation tests. |
```

Check:

```bash
grep -c '^| `always-run-guards.yml` |' .github/workflows/README.md
for f in advisory-checks changed-packet-validation command-tree-parity dispatch-enforcement-guard gate-inputs playbook-operator-contract rule-canary-sync sk-doc-script-tests; do grep -c "^| \`$f.yml\` |" .github/workflows/README.md; done
```

Expected: `1`; eight `0` lines.

Rollback: `git checkout HEAD -- .github/workflows/README.md` and re-apply only the rows this task owns.

Stop and escalate if: the anchor line is not on the file, or a member's first cell still appears in the contents table.

---

### T018 Update the README push/PR table (AC-009)

File: `.github/workflows/README.md`. Runs only on `D8=yes`. Anchor: `.github/workflows/README.md:66`, the line `| `advisory-checks.yml`, `command-tree-parity.yml`, `dispatch-enforcement-guard.yml`, `playbook-operator-contract.yml`, `rule-canary-sync.yml`, `sk-doc-script-tests.yml` | yes | yes | Guards over the whole tree |`.

Change: replace that line with `| `always-run-guards.yml` | yes | yes | Guards over the whole tree |`, then delete the two rows at `:68` and `:70`, which are `| `gate-inputs.yml` | yes, no path filter | yes, no path filter | Guards a move of the source tree, the one change a path filter could miss |` and `| `changed-packet-validation.yml` | yes | yes | Validates the packets a commit changed and blocks only when head fails a rule the base did not. On push it diffs against the previous tip |`. Change no other row.

Check:

```bash
grep -c '^| `always-run-guards.yml` | yes | yes | Guards over the whole tree |$' .github/workflows/README.md
grep -c '^| `gate-inputs.yml` |' .github/workflows/README.md
grep -c '^| `changed-packet-validation.yml` |' .github/workflows/README.md
grep -c '^| `message-contract.yml` |' .github/workflows/README.md
```

Expected: `1`; `0`; `0`; `1`.

Rollback: restore the three original lines from the quoted anchors.

Stop and escalate if: the line-66 anchor is not on the file, or `message-contract.yml`'s row count changes from `1`.

---

### T019 Update the README switch-group list (AC-009)

File: `.github/workflows/README.md`. Runs only on `D8=yes`. Anchor (read): `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/spec.md:150`, the line `| REQ-007 | **R26.** `.github/workflows/README.md` gains an `### On/off switches` section that names `SKILLED_CI`, `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES`, states that `off` is the only disable token, that an unset variable runs the job, that `dependabot-auto-merge.yml` has no switch, and that `SKILLED_CI_MESSAGES` must stay unset while the ruleset requires that context |`. The row this task edits is the FRESHNESS row inside the `### On/off switches` section that line requires; its exact text is phase 007's, so read it and keep every other cell.

Change: replace the eight member names in that one row's workflow list with `always-run-guards.yml`, leaving `naming-standard-guard.yml` in the list because that file stays separate. Change no other row.

Check:

```bash
grep -c '^### On/off switches$' .github/workflows/README.md
grep -c 'always-run-guards.yml' .github/workflows/README.md
grep -c 'naming-standard-guard.yml' .github/workflows/README.md
```

Expected: `1`; `3`; at least `1`.

Rollback: restore the FRESHNESS row from the text read before the edit.

Stop and escalate if: `### On/off switches` is absent, or the `always-run-guards.yml` count is not `3` after T017, T018 and this task.

---

### T020 Prove the merged job's signal (AC-007)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/merge-probe.md` (new file). Runs only on `D8=yes`. Anchor (read): `.github/workflows/gate-inputs.yml:19`, the line `      - name: Check the inputs of every hook, workflow and dependabot entry`, which T015 copies into `.github/workflows/always-run-guards.yml`.

Change: on a throwaway branch, add the probe workflow below, stage it together with the merged workflow, the eight deletions and the README edits with `git add -A .github/workflows`, write the commit message below to a file, validate it, commit with `git commit -F` so one commit carries the merge and the probe, push it, open a draft pull request, and read the `always-run-guards.yml` run. Then close the pull request, switch back to the phase branch, reapply the merge with the diff command below, and delete the branch; never merge it.

```yaml
name: Probe One Root
on:
  push:
    paths: ['.skilled/skills/sk-doc/SKILL.md']
jobs:
  probe:
    runs-on: ubuntu-latest
    steps:
      - run: echo probe
```

Check:

```bash
git switch -c probe/always-run-guards
mkdir -p .github/workflows
cat > .github/workflows/probe-one-root.yml <<'YAML'
name: Probe One Root
on:
  push:
    paths: ['.skilled/skills/sk-doc/SKILL.md']
jobs:
  probe:
    runs-on: ubuntu-latest
    steps:
      - run: echo probe
YAML
git add -A .github/workflows
cat > /tmp/probe-commit-msg.txt <<'EOF'
test(workflows): probe the merged freshness job

The probe commit carries the merged workflow and the eight deletions so the
always-run job runs on the branch. A failed guard step must not stop the later steps.

Spec: system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-commit-msg.txt; echo "msg=$?"
git commit -F /tmp/probe-commit-msg.txt
git show --stat --format= HEAD
git push -u origin probe/always-run-guards
gh pr create --draft --title "test: probe the merged freshness job" --body "Throwaway probe. Closed, never merged." > /dev/null
gh run list --workflow always-run-guards.yml --branch probe/always-run-guards --limit 1 --json databaseId,conclusion
```

Then read the run's steps:

```bash
gh run view <run-id> --json jobs --jq '.jobs[] | {name, conclusion, steps: [.steps[] | {name, conclusion}]}'
```

Then close the pull request, restore the merge on the phase branch and delete the throwaway branch:

```bash
gh pr close probe/always-run-guards
git switch -
git diff HEAD probe/always-run-guards -- .github/workflows ':(exclude).github/workflows/probe-one-root.yml' | git apply
git status --porcelain .github/workflows
git branch -D probe/always-run-guards
git push origin --delete probe/always-run-guards
```

Expected: `msg=0`; the `git show --stat` names the merged file, the probe, the README and the eight deletions; one run; the `Check the inputs of every hook, workflow and dependabot entry` step concludes `failure`; at least one later step has a conclusion, so it ran; the job concludes `failure`; every original step name appears once; after the restore `git status --porcelain .github/workflows` lists the merged file as untracked, the README as modified and the eight members as deleted, and no `probe-one-root.yml` line.

Rollback: close the draft pull request, then run `git switch -`, `git diff HEAD probe/always-run-guards -- .github/workflows ':(exclude).github/workflows/probe-one-root.yml' | git apply`, `git branch -D probe/always-run-guards` and `git push origin --delete probe/always-run-guards`. The probe file exists only on the deleted branch.

Stop and escalate if: the commit stat does not name the merged file, the probe, the README and the eight deletions; the gate-inputs step stays green on the probe workflow; or a later step shows no conclusion, because either the guard or the `if: always()` chain is broken. When the gate-inputs step stays green, replace the probe with an edit to `.skilled/skills/sk-doc/SKILL.md` on the same branch without regenerating the Hermes copy, which fails the `Compare the Hermes copies with their sources` step; if both edits leave every step green, stop.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and close

### T021 Run the gates and record the phase result (AC-008)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/scratch/phase-result.md`. Anchor: the `## Cost check` heading written by T010.

Change: append a `## Gates` section holding each command's output and exit status.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
node "$PHASE/scratch/consolidation-cost.mjs" --check; echo "cost=$?"
bash .github/scripts/check-gate-inputs.sh; echo "gate=$?"
python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"; echo "parse=$?"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/$PHASE" --strict --no-recursive | tail -3
grep -c '^## Gates$' "$PHASE/scratch/phase-result.md"
```

Expected: `check: ok` and `cost=0`; `RESULT: PASSED` and `gate=0`; no parse output and `parse=0`; a summary line whose errors are `0`, or only the two `GENERATED_METADATA_*` rules the orchestrator regenerates; `1`.

Rollback: delete the `## Gates` section from `scratch/phase-result.md`.

Stop and escalate if: any command exits non-zero twice, or the validator reports an error other than `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT`.

---

### T022 Commit the decision record (AC-009)

File: the phase's `scratch/` artifacts and this packet's documents (committed). Anchor (read): `scratch/consolidation-decision.md`, its `D8: <answer>` line written by T013.

Change: stage `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/` and commit it with the message below. The staged-packet id scan covers the packet's code and metadata files; its Markdown documents may cite R-ids and D-ids.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
cat > /tmp/commit-msg.txt <<'EOF'
docs(ci): record the consolidation decision

The decision record carries the measured before and after numbers and D8's answer.

Spec: system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg.txt; echo "msg=$?"
git add "$PHASE"
git diff --cached -- "$PHASE" ':(exclude)*.md' | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]'; echo "ids=$?"
git commit -F /tmp/commit-msg.txt
git log -1 --format=%s
```

Expected: `msg=0`; no `grep` output and `ids=1`; a clean commit; `docs(ci): record the consolidation decision`.

Rollback: `git reset --soft HEAD~1`.

Stop and escalate if: the message validator fails, the id scan finds a match, or the commit touches a path outside this packet.

---

### T023 Commit the merge (AC-009)

File: `.github/workflows/always-run-guards.yml`, the eight deletions and `.github/workflows/README.md` (committed). Runs only on `D8=yes`. Anchor (read): `.github/workflows/always-run-guards.yml`, its `name: Always-Run Freshness Guards` line written by T015.

Change: stage `.github/workflows` and commit with the message below, in one commit, after T020's probe is recorded.

Check:

```bash
cat > /tmp/commit-msg-merge.txt <<'EOF'
ci(workflows): merge the always-run freshness guards

The merged job keeps every step name and the fail-closed guards in one workflow.

Spec: system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-merge.txt; echo "msg=$?"
git add .github/workflows
git diff --cached -- .github | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]'; echo "ids=$?"
git commit -F /tmp/commit-msg-merge.txt
git log -1 --format=%s
git show --stat --format= HEAD | tail -12
```

Expected: `msg=0`; no `grep` output and `ids=1`; `ci(workflows): merge the always-run freshness guards`; a stat listing one new file, eight deleted files and the README.

Rollback: `git revert HEAD` restores the eight files and the README rows and leaves the decision record in place.

Stop and escalate if: the stat names a path other than the merged file, the eight deletions and the README.

---

### T024 Close the acceptance criteria rows (AC-001 to AC-009)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/acceptance-criteria.md`. Anchor: each row's Status cell, currently `Unmet`.

Change: for each of AC-001 to AC-009, put the observed evidence in the Verification cell and set the Status cell to `Met`, or leave it `Unmet` and record the blocker in `scratch/phase-result.md`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
grep -c '^| AC-00[1-9] |' "$PHASE/acceptance-criteria.md"
grep -c '| Met |' "$PHASE/acceptance-criteria.md"
grep -c '| Unmet |' "$PHASE/acceptance-criteria.md"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/$PHASE" --strict --no-recursive | tail -3
```

Expected: `9`; `9` when every row closed, or the count of rows whose evidence exists; `0` on a full close; a summary line reporting `Errors: 0` and `RESULT: PASSED`.

Rollback: restore every Status cell to `Unmet` and clear the evidence added by this task.

Stop and escalate if: a row would be `Met` without a command output in its Verification cell, or the validator reports an error other than `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT`.

---

### T025 Commit the closure evidence (AC-009)

File: `specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision/acceptance-criteria.md` (committed), with this packet's other closure files. Anchor (read): `acceptance-criteria.md:71`, the Status cell `Unmet` on the AC-009 row, set to `Met` or left `Unmet` by T024.

Change: stage the packet and commit it with the message below, after T024 has written every row's evidence.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
cat > /tmp/commit-msg-closure.txt <<'EOF'
docs(ci): close the consolidation acceptance criteria

The closure commit records each acceptance row's evidence and the phase result.

Spec: system-speckit/053-ci-workflow-efficiency/008-consolidation-decision
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-closure.txt; echo "msg=$?"
git add "$PHASE"
git diff --cached -- "$PHASE" ':(exclude)*.md' | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]'; echo "ids=$?"
git commit -F /tmp/commit-msg-closure.txt
test -z "$(git status --porcelain -- "$PHASE")"; echo "clean=$?"
git log -1 --format=%s
```

Expected: `msg=0`; no `grep` output and `ids=1`; `clean=0`; `docs(ci): close the consolidation acceptance criteria`.

Rollback: `git reset --soft HEAD~1`.

Stop and escalate if: the message validator fails, the id scan finds a match, the commit touches a path outside this packet, or a tracked packet file stays listed by `git status --porcelain`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or cancelled by D8's answer
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Recommendations**: See `../001-research/research/synthesis-reviews/final-review.md` (`:495-503` for R27, `:594-598` for the phase gate, `:621` for D8)
- **Before data**: See `../001-research/scratch/ci-run-data/summary.md` (`:7-20` for the workflow rows, `:45-56` for the job seconds) and `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`
- **Switch groups**: See `../007-workflow-hygiene-on-off-control/spec.md:149`

| R-id | Requirements | Tasks | Acceptance criteria |
|------|--------------|-------|---------------------|
| R27 | REQ-001, REQ-002, REQ-004, REQ-006 | T002, T003, T004, T005, T006, T007, T008, T009, T010, T011, T015, T020, T021 | AC-001, AC-002, AC-003, AC-004, AC-007 |
| D8 | REQ-003, REQ-004 | T012, T013, T014, T015, T016, T017, T018, T019, T020 | AC-005, AC-006, AC-007, AC-009 |
| Gates | REQ-005, REQ-007, REQ-008 | T017, T018, T019, T021, T022, T023, T024, T025 | AC-008, AC-009 |
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md - planned as REQ-001 to REQ-008, each naming R27, D8 or a gate
- [ ] CHK-002 [P0] Technical approach defined in plan.md - the before and after measurement, the cost script's arithmetic, the FRESHNESS merge boundary and the conditional merge shape
- [ ] CHK-003 [P1] Dependencies identified and available - the 002 baseline, phases 003 to 007, D8 (T012), `gh` with `repo` and `actions`, and a test branch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks - `node --check scratch/consolidation-cost.mjs`, `bash .github/scripts/check-gate-inputs.sh` and the YAML parse (T021)
- [ ] CHK-011 [P0] No console errors or warnings - the cost script exits 0, the gate prints `failures=0`, and the parse prints nothing
- [ ] CHK-012 [P1] Error handling implemented - `--check` exits 1 on a mismatch, a missing sample is marked `thin` or `no-sample`, and a job with no checkout is marked `no-checkout`
- [ ] CHK-013 [P1] Code follows project patterns - the merged workflow copies phase 003's concurrency block and phase 007's switch and timeout shapes, and no comment carries a packet id (T023)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met - `acceptance-criteria.md` rows AC-001 to AC-009
- [ ] CHK-021 [P0] Manual testing complete - the before and after measurements (T003, T004 to T007), the cost check (T009, T010) and, under D8 = yes, the merge probe (T020)
- [ ] CHK-022 [P1] Edge cases tested - a thin sample, a job with no checkout, a skipped run and a run with no jobs are each counted or marked in the cost table
- [ ] CHK-023 [P1] Error scenarios validated - a missing 002 baseline blocks T001, and a forced failure shows the later merged steps still ran (T020)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class - `matrix/evidence` for the decision record and the measurement, `instance-only` for the conditional merge
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed - the nine workflow files and their 13 jobs are parsed in T002, and a Python parse of each file's `on.push` block proves no `paths:` and no `paths-ignore:`
- [ ] CHK-FIX-003 [P0] Consumer inventory completed - `.github/workflows/README.md:64-75`, phase 007's `scratch/switch-groups.md` and phase 009's report are each named in plan.md, Affected Surfaces
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests - the matrix in plan.md covers a no-checkout job, a zero-sample job, a skipped run, a renamed workflow, a step that must not run after a failure, and message-contract in the candidate set
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - D8 answer (2) x candidate set (3) x measurement source (3), with six required rows, in plan.md
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - the forced-failure branch and the no-checkout job are the hostile variants (T020, T008)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range - every number names a run id, and the phase start SHA is recorded in `scratch/phase-start-sha.txt` (T001)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets - every `gh` call is read-only and no token, key or PR body text appears in `scratch/`
- [ ] CHK-031 [P0] Input validation implemented - the cost script validates every JSON file before it reads it, and a missing field is reported, not defaulted
- [ ] CHK-032 [P1] Auth/authz working correctly - the phase writes no repository variable and adds no permission; a merge keeps `permissions: contents: read`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized - spec.md REQ-001 to REQ-008, tasks.md T001 to T025, acceptance-criteria.md AC-001 to AC-009
- [ ] CHK-041 [P1] Code comments adequate - the decision record explains why the bound shrank and why message-contract is excluded; the merged workflow's comments carry the durable reason, not an id
- [ ] CHK-042 [P2] README updated (if applicable) - only under D8 = yes: `.github/workflows/README.md` contents, push/PR table and switch list (T017 to T019)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only - the inventory, baseline, snapshot, cost artifacts, decision record and probe all live in `scratch/`
- [ ] CHK-051 [P1] scratch/ cleaned before completion - the artifacts are kept on purpose: they are the before and after numbers a later packet measures against, and the decision record is the phase's deliverable
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---
