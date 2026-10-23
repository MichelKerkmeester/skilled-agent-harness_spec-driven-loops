---
title: "Tasks: Phase 7: workflow-hygiene-on-off-control"
description: "Task Format: T### Description (file path). One hundred and two ordered tasks for the workflow hygiene phase: the D6 decision, the fork capture and the setup records, the 12 permission headers and the Dependabot split, the 40-run sample and the sizing table, one timeout task per workflow file, one switch task per workflow file, the three ANDed conditions and the README section, then the fork probe, the timeout-kill read, the closing gates and the closure commit."
trigger_phrases:
  - "workflow hygiene on off control tasks"
  - "phase 7 workflow hygiene on off control tasks"
  - "timeout sizing tasks"
  - "ci switch tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: workflow-hygiene-on-off-control

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

**Task Format**: `T### Description (file path)`

Every task below names one file, quotes the anchor text it edits, gives that anchor's line number, puts every command in a fenced block, states the expected result, names the acceptance criterion it satisfies, gives a rollback, and gives one concrete stop condition.

**Path convention.** Run every command from the repository root. `PHASE` means `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control`, and a path written as `scratch/<name>` in a task means `$PHASE/scratch/<name>`. Write the full path in a command; the shell does not expand `$PHASE` unless a task sets it.

**Three tokens stand for data, never for prose.**

- `<value>` is the integer in the `final` cell of that job's row in `scratch/r24/timeouts.md`. It is never a number copied from this document, from a sibling job or from the old value in the file.
- `<n>` is the count stated on the task's own Expected line.
- `<probe-fork>` is the `<owner>/<repo>` value recorded on the `PROBE_FORK=` line in `scratch/decisions.md` by the fork-capture task. This is its only definition.

**Anchor convention.** Every line number below was read on the phase's scaffold commit. `003-trigger-and-job-hygiene` adds a `concurrency:` block above `jobs:` in about 30 files and `004-setup-caching-provisioning` rewrites provisioning steps, so a line below `jobs:` will have moved by the time these tasks run. Locate the quoted text and edit there. Never delete a range you have not read. When a file has more than one job, insert at the highest line number first, so the lower anchors keep their numbers.

**Ordering rule.** The three passes run in the order R25, R24, R26. Within a file, the timeout task inserts after `runs-on:` and the switch task inserts above it, so neither moves the other's anchor.

**Comment hygiene.** No task adds an R-id, a D-id or a phase number to a workflow comment, a step name, a job name or a README sentence. Spec documents may cite them.

**Scope guard.** The only new job this phase creates is Dependabot's `metadata` job. Every other task edits a key inside an existing job block, or inserts one line above or below a quoted line.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T001 DECISION D6 (operator yes required) - approve or change the timeout floor (AC-010)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/decisions.md` (new file). Anchor: none; the file does not exist yet.

Default: `10` minutes. It is what `max(10, ceil(3 x job p50), ceil(2 x job p100))` uses, it caps a hang at 10 minutes instead of 360, and it is the value `006-sk-code-ci-surface`'s rule data names as the default.

Alternative: `5` minutes. It detects a hang sooner and doubles the chance of killing a legitimately slow job; it is applied uniformly, never per job.

Change: put the question to the operator, then write exactly one line to the new file: `D6=10` or `D6=5`.

Check:

```bash
mkdir -p specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch
grep -cE '^D6=(5|10)$' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/decisions.md
```

Expected: `1`.

Rollback: delete the `D6=` line.

Stop and escalate if: no answer arrives, or the answer is neither `5` nor `10`.

---

### T002 Record the pre-phase baseline (AC-009)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/phase-baseline.md` (new file). Anchor: none.

Change: copy the 002 baseline's first 40 lines when it exists, otherwise copy the 001 dataset summary and write `source: 001 dataset (provisional)` as the file's first line. Then append one `## Pre-phase tree` block holding the four counts below, one per line, each with its command, and write the current `HEAD` to `scratch/phase-start-sha.txt`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
test -f specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/summary.md && echo BASELINE_PRESENT || echo BASELINE_MISSING
ls .github/workflows/*.yml | wc -l
python3 -c "import glob,yaml; print(sum(len(yaml.safe_load(open(f))['jobs']) for f in glob.glob('.github/workflows/*.yml')))"
grep -c 'timeout-minutes' .github/workflows/*.yml | grep -v ':0' | wc -l
grep -L 'permissions:' .github/workflows/*.yml | wc -l
git rev-parse HEAD > "$PHASE/scratch/phase-start-sha.txt"
test -s "$PHASE/scratch/phase-start-sha.txt" && echo SHA_PRESENT
grep -c '^## Pre-phase tree' "$PHASE/scratch/phase-baseline.md"
```

Expected: `BASELINE_PRESENT` or `BASELINE_MISSING`; `33`; `44`; `6`; `12`; `SHA_PRESENT`; `1`. When `004` has landed, expect `32` files, `43` jobs, `5` files with a timeout line and `12` files without a permissions block instead; record whichever the commands print.

Rollback: `rm -r specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch`.

Stop and escalate if: the file counts are neither the scaffold set nor the post-`004` set, or the `## Pre-phase tree` block is not written.

---

### T003 [B] Confirm the dependency phases and record the final inventory (AC-003, AC-005)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/inventory.md` (new file). Anchor: none.

Change: run the four confirmation commands and the inventory parse below, then write one row per `(workflow, job)` pair with the columns `workflow | job | name | timeout | if | group`. Add a final line `tree: <files> files, <jobs> jobs` and, when `hooks-node-tests.yml` is absent, a line `hooks-node-tests: merged into opencode-plugin-tests.yml`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
test ! -f .github/workflows/hooks-node-tests.yml && echo 'hooks: merged' || echo 'hooks: separate'
grep -c 'plugin-and-hook-tests' .github/workflows/opencode-plugin-tests.yml
grep -c 'max(<floor>' .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md
python3 - <<'PY'
import glob, yaml, re
for f in sorted(glob.glob('.github/workflows/*.yml')):
    text = open(f).read().splitlines()
    jobs_line = next(i for i, l in enumerate(text) if l.startswith('jobs:'))
    for job, body in yaml.safe_load(open(f))['jobs'].items():
        start = next(i for i in range(jobs_line, len(text)) if re.match(r'^  ' + re.escape(job) + r':\s*$', text[i]))
        end = min([i for i in range(start + 1, len(text)) if re.match(r'^  [a-z0-9-]+:\s*$', text[i])] + [len(text)])
        block = text[start:end]
        timeout = next((l for l in block if l.startswith('    timeout-minutes:')), '')
        condition = next((l for l in block if l.startswith('    if:')), '')
        print(f'{f} | {job} | {body.get("name", "")} | {timeout.strip()} | {condition.strip()}')
PY
grep -c '^| ' "$PHASE/scratch/inventory.md"
```

Expected: `hooks: merged` or `hooks: separate`; `1` when merged and `0` when separate; `1`; one parse line per job, `43` after `004`'s hook merge and `44` on the scaffold path; the inventory's row count equals the parse line count plus one header row.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/inventory.md`.

Stop and escalate if: `job-shape-rules.md` is absent, or `grep -c 'max(<floor>'` is not `1`, or the parse prints fewer than `40` lines, or the inventory's row count differs from the parse count.

---

### T004 Record the switch group assignment (AC-006)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/switch-groups.md` (new file). Anchor: none.

Change: read `.github/workflows/README.md:60-75` and write one table with a row per group: the variable, the README row it comes from, the workflow files in it, and its job count. FRESHNESS is the guards row at `:66` plus `naming-standard-guard.yml` at `:67`, `gate-inputs.yml` at `:68` and `changed-packet-validation.yml` at `:70`; TESTS is the path-filtered row at `:69`; REVIEW is the row at `:71`; REPORTS is `strict-pass-freshness-report.yml` and `trigger-index-rebuild.yml`; MESSAGES is `message-contract.yml`; `dependabot-auto-merge.yml` gets no group.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
grep -cE '^\| SKILLED_CI' "$PHASE/scratch/switch-groups.md"
python3 - <<'PY'
import glob, re
t = open('specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/switch-groups.md').read()
listed = set(re.findall(r'([a-z0-9-]+\.yml)', t))
tree = {f.rsplit('/', 1)[-1] for f in glob.glob('.github/workflows/*.yml')}
print('missing', sorted(tree - listed), 'extra', sorted(listed - tree))
PY
```

Expected: `5`; `missing [] extra []`. The exempt workflow is named in the table's prose line, so the set comparison is complete without a group row for it. On the default path the counts are FRESHNESS 9 files and 13 jobs, TESTS 16 and 22, REVIEW 3 and 3, REPORTS 2 and 3, MESSAGES 1 and 1.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/switch-groups.md`.

Stop and escalate if: the group count is not `5`, or `extra` is not empty, or the file counts do not sum to the tree's file count.

---

### T005 Record the constraints the passes must respect (AC-005)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/constraints.md` (new file). Anchor: none.

Change: write four `CONSTRAINT ` lines, each quoting its source: the message-contract prohibition from `001-research/research/research.md:189`, the protected-by-function rule that a skipped job reports Success, the four job-level `if:` sites with their exact text from the command below, and the loop-guard comment above `trigger-index-rebuild.yml:33`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
grep -n '^    if:' .github/workflows/*.yml
grep -c '^CONSTRAINT ' "$PHASE/scratch/constraints.md"
```

Expected: four `if:` lines (`dependabot-auto-merge.yml:18`, `skill-doc-frontmatter.yml:52`, `trigger-index-rebuild.yml:33`, `trigger-index-rebuild.yml:186`); `4`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/constraints.md`.

Stop and escalate if: the `if:` count is not four, or a quoted condition differs from the file.

---

### T006 Capture the probe fork (operator input required) (AC-008)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/decisions.md:1`, anchor: the `D6=` line written by T001.

Change: put the fork question to the operator and append exactly one line `PROBE_FORK=<probe-fork>` naming a fork or throwaway test repository that carries this repository's workflows. The operator supplies the value; no command derives it.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
grep -cE '^PROBE_FORK=[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$' "$PHASE/scratch/decisions.md"
```

Expected: `1`.

Rollback: delete the `PROBE_FORK=` line.

Stop and escalate if: no answer arrives, or the value is not an `<owner>/<repo>` pair.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation - R25 permissions and the Dependabot split

### T007 Add the workflow-level permission block to `advisory-checks.yml` (AC-001)

File: `.github/workflows/advisory-checks.yml:16`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`, keeping the blank line that already sits above it.

Check:

```bash
grep -c '^permissions:$' .github/workflows/advisory-checks.yml
grep -A1 '^permissions:$' .github/workflows/advisory-checks.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/advisory-checks.yml'))['permissions'])"
```

Expected: `1`; `permissions:` then `  contents: read`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse prints anything other than `{'contents': 'read'}`.

---

### T008 Add the workflow-level permission block to `agent-mirror-sync.yml` (AC-001)

File: `.github/workflows/agent-mirror-sync.yml:6`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/agent-mirror-sync.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/agent-mirror-sync.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T009 Add the workflow-level permission block to `chart-corpus.yml` (AC-001)

File: `.github/workflows/chart-corpus.yml:25`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/chart-corpus.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/chart-corpus.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T010 Add the workflow-level permission block to `comment-hygiene.yml` (AC-001)

File: `.github/workflows/comment-hygiene.yml:6`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/comment-hygiene.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/comment-hygiene.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T011 Add the workflow-level permission block to `diagram-corpus.yml` (AC-001)

File: `.github/workflows/diagram-corpus.yml:25`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/diagram-corpus.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/diagram-corpus.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T012 Add the workflow-level permission block to `markdown-link-integrity.yml` (AC-001)

File: `.github/workflows/markdown-link-integrity.yml:31`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/markdown-link-integrity.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/markdown-link-integrity.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T013 Add the workflow-level permission block to `playbook-operator-contract.yml` (AC-001)

File: `.github/workflows/playbook-operator-contract.yml:13`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/playbook-operator-contract.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/playbook-operator-contract.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T014 Add the workflow-level permission block to `prompt-card-sync.yml` (AC-001)

File: `.github/workflows/prompt-card-sync.yml:6`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/prompt-card-sync.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/prompt-card-sync.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T015 Add the workflow-level permission block to `repo-rules-corpus.yml` (AC-001)

File: `.github/workflows/repo-rules-corpus.yml:26`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/repo-rules-corpus.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/repo-rules-corpus.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T016 Add the workflow-level permission block to `rule-canary-sync.yml` (AC-001)

File: `.github/workflows/rule-canary-sync.yml:8`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/rule-canary-sync.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/rule-canary-sync.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T017 Add the workflow-level permission block to `runtime-no-spec-import.yml` (AC-001)

File: `.github/workflows/runtime-no-spec-import.yml:22`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`.

Check:

```bash
grep -c '^permissions:$' .github/workflows/runtime-no-spec-import.yml
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/runtime-no-spec-import.yml'))['permissions'])"
```

Expected: `1`; `{'contents': 'read'}`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse is not `{'contents': 'read'}`.

---

### T018 Add the workflow-level permission block to `skill-doc-frontmatter.yml` (AC-001)

File: `.github/workflows/skill-doc-frontmatter.yml:25`, anchor: `jobs:`.

Change: insert `permissions:`, `  contents: read` and one blank line immediately above `jobs:`. Change no other line; the two jobs and the `if:` at `:52` stay as they are.

Check:

```bash
grep -c '^permissions:$' .github/workflows/skill-doc-frontmatter.yml
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/skill-doc-frontmatter.yml')); print(d['permissions'], sorted(d['jobs']))"
```

Expected: `1`; `{'contents': 'read'} ['doc-version-raise', 'frontmatter-coverage']`.

Rollback: delete the three inserted lines.

Stop and escalate if: `jobs:` is not on the file, or the parse does not print two jobs.

---

### T019 Split `dependabot-auto-merge.yml` into a read-only and a write-scoped job (AC-002)

File: `.github/workflows/dependabot-auto-merge.yml:10-40`. Anchor:

```yaml
permissions:
  contents: write
  pull-requests: write

jobs:
  auto-merge:
    name: Auto-merge Dependabot security patch updates
    runs-on: ubuntu-latest
    if: github.event.pull_request.user.login == 'dependabot[bot]'
```

Change: replace lines 10-40 (the entire `auto-merge` job, including its steps) with the two-job shape below. The file header and the `on:` block above line 10 stay as they are, and both step comments are carried into the new shape.

```yaml
permissions:
  contents: read

jobs:
  metadata:
    name: Read the Dependabot update metadata
    runs-on: ubuntu-latest
    if: github.event.pull_request.user.login == 'dependabot[bot]'
    permissions:
      contents: read
      pull-requests: read
    outputs:
      package-ecosystem: ${{ steps.meta.outputs.package-ecosystem }}
      dependency-group: ${{ steps.meta.outputs.dependency-group }}
      update-type: ${{ steps.meta.outputs.update-type }}
    steps:
      - name: Read the update metadata
        id: meta
        uses: dependabot/fetch-metadata@25dd0e34f4fe68f24cc83900b1fe3fe149efef98 # v3.1.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

  auto-merge:
    name: Auto-merge Dependabot security patch updates
    needs: metadata
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    if: >-
      needs.metadata.outputs.package-ecosystem == 'npm_and_yarn'
      && (needs.metadata.outputs.dependency-group == 'npm-security' || needs.metadata.outputs.dependency-group == '')
      && needs.metadata.outputs.update-type == 'version-update:semver-patch'
    steps:
      # A fix for one package in one directory arrives ungrouped rather than in
      # npm-security. It is still a security update: every npm version update
      # matches the catch-all npm-runtime group, so only a security fix lands
      # outside both groups.
      - name: Enable auto-merge for an npm security patch
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_URL: ${{ github.event.pull_request.html_url }}
        # A merge commit keeps Dependabot's own commit, which the message
        # contract has already checked, rather than rewriting it in a squash.
        run: gh pr merge --auto --merge "$PR_URL"
```

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/dependabot-auto-merge.yml')); print(sorted(d['jobs']), d['permissions'], d['jobs']['metadata']['permissions'], d['jobs']['auto-merge']['permissions'])"
grep -c 'contents: write' .github/workflows/dependabot-auto-merge.yml
grep -c 'actions/checkout' .github/workflows/dependabot-auto-merge.yml
grep -c 'dependabot/fetch-metadata' .github/workflows/dependabot-auto-merge.yml
```

Expected: `['auto-merge', 'metadata'] {'contents': 'read'} {'contents': 'read', 'pull-requests': 'read'} {'contents': 'write', 'pull-requests': 'write'}`; `1`; `0`; `1`.

Rollback: restore lines 10-40 from the pre-edit file, which is the original single-job shape.

Stop and escalate if: the anchor is not on the file, or the parse prints a job list other than `['auto-merge', 'metadata']`, or `contents: write` appears more than once.

---

### T020 Gate the permissions pass and record it (AC-001, AC-002)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/pass-permissions.md` (new file). Anchor: none.

Change: run the gate and the parse into the scratch file, then write `## Permissions pass` holding both outputs, the exit status and the changed-file count.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
bash .github/scripts/check-gate-inputs.sh > "$PHASE/scratch/gate-after-permissions.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/gate-after-permissions.txt"
python3 -c "import yaml, glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]; print('parse ok')"
grep -c 'RESULT: PASSED' "$PHASE/scratch/gate-after-permissions.txt"
grep -L 'permissions:' .github/workflows/*.yml | wc -l
git diff --stat .github/workflows | tail -1
```

Expected: `parse ok`; `1`; `0`; one summary line naming `13` files changed.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/pass-permissions.md specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/gate-after-permissions.txt`.

Stop and escalate if: the gate does not print `RESULT: PASSED`, or the parse fails, or `grep -L` still names a file other than none.

---

### T021 Commit the permissions pass (AC-001)

File: `.github/workflows/` (the 12 permission headers). Anchor (read): `scratch/pass-permissions.md`, the `## Permissions pass` heading written by T020.

Change: stage the 12 files and the permissions evidence, write the full message below to `/tmp/commit-permissions.txt`, validate it, then commit with `git commit -F`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
cat > /tmp/commit-permissions.txt <<'MSG'
ci(workflows): declare least-privilege token scopes

The twelve workflows that declared no token scope now request read access to repository contents.

Spec: system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
MSG
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-permissions.txt; echo "msg=$?"
for f in advisory-checks agent-mirror-sync chart-corpus comment-hygiene diagram-corpus markdown-link-integrity playbook-operator-contract prompt-card-sync repo-rules-corpus rule-canary-sync runtime-no-spec-import skill-doc-frontmatter; do git add ".github/workflows/$f.yml"; done
git add "$PHASE/scratch"
git commit -F /tmp/commit-permissions.txt
git log -1 --format=%s
```

Expected: `msg=0`; `ci(workflows): declare least-privilege token scopes`; a clean commit.

Rollback: `git reset --soft HEAD~1`.

Stop and escalate if: the validator exits non-zero, or the commit stages a path outside `.github/workflows/` and `$PHASE/scratch/`.

---

### T022 Prove the split on a real Dependabot pull request (AC-002)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r25-dependabot.md` (new file). Anchor: none.

Change: read the newest open Dependabot pull request and its newest run, then write the pull request number, the run id and both job conclusions. When none exists, write `pending: no Dependabot pull request in window` and leave the task `[B]`.

Check:

```bash
gh pr list --author 'app/dependabot' --state open --json number,title,headRefName
gh run list --workflow dependabot-auto-merge.yml --limit 1 --json databaseId,conclusion
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
grep -cE 'run id: [0-9]+|pending:' "$PHASE/scratch/r25-dependabot.md"
```

Expected: one open pull request or none; one run row or none; `1`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r25-dependabot.md`.

Stop and escalate if: a run exists and its `metadata` job is not green, or the run id cannot be read. Never create a pull request from a non-Dependabot account to force the path, because the job's `if:` would skip it.

---

### T023 Commit the Dependabot split (AC-002)

File: `.github/workflows/dependabot-auto-merge.yml` and `scratch/r25-dependabot.md`. Anchor (read): `scratch/r25-dependabot.md:1`, the run id or `pending:` line written by T022.

Change: stage the split workflow and its proof, write the full message below to `/tmp/commit-dependabot.txt`, validate it, then commit with `git commit -F`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
cat > /tmp/commit-dependabot.txt <<'MSG'
ci(dependabot): split metadata reads from the merge write scope

The metadata job holds only read scopes.
The merge job holds the write scopes and runs no repository code.

Spec: system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
MSG
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-dependabot.txt; echo "msg=$?"
git add .github/workflows/dependabot-auto-merge.yml "$PHASE/scratch/r25-dependabot.md"
git commit -F /tmp/commit-dependabot.txt
git log -1 --format=%s
```

Expected: `msg=0`; `ci(dependabot): split metadata reads from the merge write scope`; a clean commit.

Rollback: `git reset --soft HEAD~1`.

Stop and escalate if: the validator exits non-zero, or the commit stages a path outside the workflow and its proof.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Implementation - R24 per-job timeouts

### T024 Collect 40 runs of job-level timings per workflow (AC-003)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/` (new directory tree). Anchor: none.

Change: create `runs/` and `jobs/`, write one run list per workflow with `--limit 40`, then one job file per run id. Run every list before any per-run view, so a rate-limit pause costs one workflow rather than all of them. Record the run count per workflow in `scratch/r24/sample.md`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
mkdir -p "$PHASE/scratch/r24/runs" "$PHASE/scratch/r24/jobs"
for f in .github/workflows/*.yml; do b="$(basename "$f" .yml)"; gh run list --workflow "$(basename "$f")" --limit 40 --json databaseId,conclusion,createdAt,event,headSha > "$PHASE/scratch/r24/runs/$b.json"; done
for id in $(python3 -c "import json,glob; print(' '.join(str(r['databaseId']) for f in glob.glob('$PHASE/scratch/r24/runs/*.json') for r in json.load(open(f))))"); do gh run view "$id" --json databaseId,conclusion,jobs > "$PHASE/scratch/r24/jobs/$id.json"; done
ls "$PHASE/scratch/r24/runs"/*.json | wc -l
ls "$PHASE/scratch/r24/jobs"/*.json | wc -l
python3 -c "import json,glob; print(sum(len(json.load(open(f))) for f in glob.glob('$PHASE/scratch/r24/runs/*.json')))"
```

Expected: `32` run lists; a job-file count equal to the total run count; a total at or below `1,280`.

Rollback: `rm -r specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24`.

Stop and escalate if: fewer than `30` run lists are written, or a job file is missing for a run id, or `gh` reports an authentication or scope error.

---

### T025 Write the sizing script (AC-003, AC-004)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/size-timeouts.mjs` (new file). Anchor: none.

Change: write the script to read `scratch/r24/jobs/*.json`, keep only `conclusion == 'success'` runs per job, compute seconds from `startedAt` to `completedAt`, and print one markdown row per job: `| workflow | job | samples | p50 | p100 | formula | final | marker |`. It accepts `--floor <n>`, and `--assert` reads the tree and prints `values match formula: ok` and `50% rule: ok` or exits 1.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
node "$PHASE/scratch/r24/size-timeouts.mjs" --floor 10 | head -3
node "$PHASE/scratch/r24/size-timeouts.mjs" --floor 10 | grep -c '^| '
```

Expected: a header row, a divider row and one job row; a count equal to the job count plus `2`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/size-timeouts.mjs`.

Stop and escalate if: the script exits non-zero, or the row count is not the job count plus `2`.

---

### T026 Produce the sizing table (AC-003, AC-004)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md` (new file). Anchor: none.

Change: run the script with D6's floor into the table, then add a `## Comparison` section naming the six jobs that already carried a value and their old number beside the new one. A job with fewer than 5 successful samples is marked `thin`, one with none takes the floor and is marked `no-sample`, and one with only failures is sized from them and marked `failed-only`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
FLOOR=$(sed -n 's/^D6=\([0-9]\+\)$/\1/p' "$PHASE/scratch/decisions.md")
node "$PHASE/scratch/r24/size-timeouts.mjs" --floor "$FLOOR" > "$PHASE/scratch/r24/timeouts.md"
grep -c '^| ' "$PHASE/scratch/r24/timeouts.md"
grep -cE '\| (thin|no-sample|failed-only) \|' "$PHASE/scratch/r24/timeouts.md"
```

Expected: the job count plus `2`; at least `1`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md`.

Stop and escalate if: the row count is not the job count plus `2`, or any row's `final` cell is empty, or any `final` cell is below the floor.

---

### T027 Give `advisory-checks.yml` a timeout (AC-003)

File: `.github/workflows/advisory-checks.yml:19`, anchor: `    runs-on: ubuntu-latest` (the only job, id `advisory` at `:17`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `advisory-checks.yml | advisory` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/advisory-checks.yml'))['jobs']['advisory'].get('timeout-minutes'))"
grep -E '^\| advisory-checks\.yml \| advisory \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T028 Give `agent-mirror-sync.yml` a timeout (AC-003)

File: `.github/workflows/agent-mirror-sync.yml:9`, anchor: `    runs-on: ubuntu-latest` (the only job, id `agent-mirror-sync` at `:7`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `agent-mirror-sync.yml | agent-mirror-sync` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/agent-mirror-sync.yml'))['jobs']['agent-mirror-sync'].get('timeout-minutes'))"
grep -E '^\| agent-mirror-sync\.yml \| agent-mirror-sync \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T029 Give `changed-packet-validation.yml` a timeout (AC-003)

File: `.github/workflows/changed-packet-validation.yml:15`, anchor: `    runs-on: ubuntu-latest` (the only job, id `changed-packets` at `:13`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `changed-packet-validation.yml | changed-packets` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/changed-packet-validation.yml'))['jobs']['changed-packets'].get('timeout-minutes'))"
grep -E '^\| changed-packet-validation\.yml \| changed-packets \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T030 Give `chart-corpus.yml` a timeout (AC-003)

File: `.github/workflows/chart-corpus.yml:28`, anchor: `    runs-on: ubuntu-latest` (the only job, id `corpus` at `:26`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `chart-corpus.yml | corpus` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/chart-corpus.yml'))['jobs']['corpus'].get('timeout-minutes'))"
grep -E '^\| chart-corpus\.yml \| corpus \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T031 Give both `command-tree-parity.yml` jobs a timeout (AC-003)

File: `.github/workflows/command-tree-parity.yml:16` and `:52`, anchors: `    runs-on: ubuntu-latest` twice, first for `command-tree-parity` at `:14` and second for `hermes-mirror` at `:46`.

Change: insert `    timeout-minutes: <value>` after each anchor, using each job's own row. Insert the `:52` line first, so the `:16` anchor keeps its number.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/command-tree-parity.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| command-tree-parity\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: two job ids, neither `None`; two rows; each value equals its own row's final cell.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or a value is `None`, or either value is copied from the other job's row.

---

### T032 Give `comment-hygiene.yml` a timeout (AC-003)

File: `.github/workflows/comment-hygiene.yml:9`, anchor: `    runs-on: ubuntu-latest` (the only job, id `comment-hygiene` at `:7`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `comment-hygiene.yml | comment-hygiene` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/comment-hygiene.yml'))['jobs']['comment-hygiene'].get('timeout-minutes'))"
grep -E '^\| comment-hygiene\.yml \| comment-hygiene \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T033 Re-size `deep-loop-runtime.yml`'s existing timeout (AC-003)

File: `.github/workflows/deep-loop-runtime.yml:36`, anchor: `    timeout-minutes: 45` (the only job, id `deep-loop-runtime` at `:33`).

Change: replace `45` with the `final` cell of the `deep-loop-runtime.yml | deep-loop-runtime` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/deep-loop-runtime.yml'))['jobs']['deep-loop-runtime'].get('timeout-minutes'))"
grep -E '^\| deep-loop-runtime\.yml \| deep-loop-runtime \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: replace the value with `45`.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T034 Give both `dependabot-auto-merge.yml` jobs a timeout (AC-003)

File: `.github/workflows/dependabot-auto-merge.yml`, anchors: `    runs-on: ubuntu-latest` in the `metadata` job and in the `auto-merge` job, both added by T019.

Change: insert `    timeout-minutes: <value>` after each anchor, using each job's own row. Both rows are marked `no-sample`, so both values are D6's floor. Insert the `auto-merge` job's line first.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/dependabot-auto-merge.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| dependabot-auto-merge\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: two job ids, neither `None`, both equal to the floor; two rows, both marked `no-sample`.

Rollback: delete both inserted lines.

Stop and escalate if: either job is missing, or a value is not the floor, or a row is not marked `no-sample`.

---

### T035 Give `diagram-corpus.yml` a timeout (AC-003)

File: `.github/workflows/diagram-corpus.yml:28`, anchor: `    runs-on: ubuntu-latest` (the only job, id `corpus` at `:26`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `diagram-corpus.yml | corpus` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/diagram-corpus.yml'))['jobs']['corpus'].get('timeout-minutes'))"
grep -E '^\| diagram-corpus\.yml \| corpus \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T036 Give both `dispatch-enforcement-guard.yml` jobs a timeout (AC-003)

File: `.github/workflows/dispatch-enforcement-guard.yml:16` and `:54`, anchors: `    runs-on: ubuntu-latest` twice, first for `dispatch-enforcement-guard` at `:14` and second for `hooks-vitest` at `:52`.

Change: insert `    timeout-minutes: <value>` after each anchor, using each job's own row. Insert the `:54` line first.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/dispatch-enforcement-guard.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| dispatch-enforcement-guard\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: two job ids, neither `None`; two rows; each value equals its own row's final cell.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or a value is `None`, or either value is copied from the other job's row.

---

### T037 Give `gate-inputs.yml` a timeout (AC-003)

File: `.github/workflows/gate-inputs.yml:14`, anchor: `    runs-on: ubuntu-latest` (the only job, id `gate-inputs` at `:12`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `gate-inputs.yml | gate-inputs` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/gate-inputs.yml'))['jobs']['gate-inputs'].get('timeout-minutes'))"
grep -E '^\| gate-inputs\.yml \| gate-inputs \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T038 Give `markdown-link-integrity.yml` a timeout (AC-003)

File: `.github/workflows/markdown-link-integrity.yml:34`, anchor: `    runs-on: ubuntu-latest` (the only job, id `markdown-link-integrity` at `:32`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `markdown-link-integrity.yml | markdown-link-integrity` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/markdown-link-integrity.yml'))['jobs']['markdown-link-integrity'].get('timeout-minutes'))"
grep -E '^\| markdown-link-integrity\.yml \| markdown-link-integrity \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T039 Give `message-contract.yml` a timeout (AC-003)

File: `.github/workflows/message-contract.yml:19`, anchor: `    runs-on: ubuntu-latest` (the only job, id `message-contract` at `:17`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `message-contract.yml | message-contract` row. Change no step and no step condition.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/message-contract.yml'))['jobs']['message-contract'].get('timeout-minutes'))"
grep -E '^\| message-contract\.yml \| message-contract \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T040 Give `naming-standard-guard.yml` a timeout (AC-003)

File: `.github/workflows/naming-standard-guard.yml:15`, anchor: `    runs-on: ubuntu-latest` (the only job, id `naming-standard` at `:13`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `naming-standard-guard.yml | naming-standard` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/naming-standard-guard.yml'))['jobs']['naming-standard'].get('timeout-minutes'))"
grep -E '^\| naming-standard-guard\.yml \| naming-standard \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T041 Re-size both `opencode-dual-version.yml` timeouts (AC-003)

File: `.github/workflows/opencode-dual-version.yml:74` and `:172`, anchors: `    timeout-minutes: 30` twice, first for `battery` at `:71` and second for `both` at `:169`.

Change: replace each `30` with its own job's `final` cell, the `battery` row and the `both` row. Edit `:172` first.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/opencode-dual-version.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| opencode-dual-version\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: two job ids, neither `None`; two rows; each value equals its own row's final cell.

Rollback: replace both values with `30`.

Stop and escalate if: either anchor is missing, or a value is `None`, or either value is copied from the other job's row.

---

### T042 Re-size `opencode-plugin-tests.yml`'s existing timeout (AC-003)

File: `.github/workflows/opencode-plugin-tests.yml:54`, anchor: `    timeout-minutes: 20`. After `004`'s hook merge the same line reads `    timeout-minutes: 40` and the job id is `plugin-and-hook-tests`; locate the file's only `timeout-minutes` line either way.

Change: replace the value with the `final` cell of the row for the job id the file carries.

Check:

```bash
grep -n 'timeout-minutes' .github/workflows/opencode-plugin-tests.yml
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/opencode-plugin-tests.yml'))['jobs']; print([(j, v.get('timeout-minutes')) for j, v in d.items()])"
grep -E '^\| opencode-plugin-tests\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: one `timeout-minutes` line; one job, not `None`; one row; the value equals that row's final cell.

Rollback: replace the value with `20`, or `40` when the hook merge landed.

Stop and escalate if: the file holds no `timeout-minutes` line, or more than one, or the value differs from the row.

---

### T043 Give both `pi-extension-tests.yml` jobs a timeout (AC-003)

File: `.github/workflows/pi-extension-tests.yml:26` and `:51`, anchors: `    runs-on: ubuntu-latest` twice, first for `discover` at `:24` and second for `pi-extension` at `:48`.

Change: insert `    timeout-minutes: <value>` after each anchor, using each job's own row. Insert the `:51` line first.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/pi-extension-tests.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| pi-extension-tests\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: two job ids, neither `None`; two rows; each value equals its own row's final cell.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or a value is `None`, or either value is copied from the other job's row.

---

### T044 Give `playbook-operator-contract.yml` a timeout (AC-003)

File: `.github/workflows/playbook-operator-contract.yml:16`, anchor: `    runs-on: ubuntu-latest` (the only job, id `operator-contract` at `:14`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `playbook-operator-contract.yml | operator-contract` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/playbook-operator-contract.yml'))['jobs']['operator-contract'].get('timeout-minutes'))"
grep -E '^\| playbook-operator-contract\.yml \| operator-contract \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T045 Give `prompt-card-sync.yml` a timeout (AC-003)

File: `.github/workflows/prompt-card-sync.yml:9`, anchor: `    runs-on: ubuntu-latest` (the only job, id `card-sync` at `:7`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `prompt-card-sync.yml | card-sync` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/prompt-card-sync.yml'))['jobs']['card-sync'].get('timeout-minutes'))"
grep -E '^\| prompt-card-sync\.yml \| card-sync \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T046 Give `repo-rules-corpus.yml` a timeout (AC-003)

File: `.github/workflows/repo-rules-corpus.yml:29`, anchor: `    runs-on: ubuntu-latest` (the only job, id `repo-rules-corpus` at `:27`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `repo-rules-corpus.yml | repo-rules-corpus` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/repo-rules-corpus.yml'))['jobs']['repo-rules-corpus'].get('timeout-minutes'))"
grep -E '^\| repo-rules-corpus\.yml \| repo-rules-corpus \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T047 Give both `routing-registry-drift.yml` jobs a timeout (AC-003)

File: `.github/workflows/routing-registry-drift.yml:124` and `:238`, anchors: `    runs-on: ubuntu-latest` twice, first for `routing-drift` at `:122` and second for `golden-prompt-gate` at `:230`.

Change: insert `    timeout-minutes: <value>` after each anchor, using each job's own row. Insert the `:238` line first.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/routing-registry-drift.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| routing-registry-drift\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: two job ids, neither `None`; two rows; each value equals its own row's final cell.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or a value is `None`, or either value is copied from the other job's row.

---

### T048 Give `rule-canary-sync.yml` a timeout (AC-003)

File: `.github/workflows/rule-canary-sync.yml:11`, anchor: `    runs-on: ubuntu-latest` (the only job, id `rule-canary` at `:9`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `rule-canary-sync.yml | rule-canary` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/rule-canary-sync.yml'))['jobs']['rule-canary'].get('timeout-minutes'))"
grep -E '^\| rule-canary-sync\.yml \| rule-canary \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T049 Give `runtime-no-spec-import.yml` a timeout (AC-003)

File: `.github/workflows/runtime-no-spec-import.yml:25`, anchor: `    runs-on: ubuntu-latest` (the only job, id `no-spec-import` at `:23`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `runtime-no-spec-import.yml | no-spec-import` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/runtime-no-spec-import.yml'))['jobs']['no-spec-import'].get('timeout-minutes'))"
grep -E '^\| runtime-no-spec-import\.yml \| no-spec-import \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T050 Give `sk-code-script-tests.yml` a timeout (AC-003)

File: `.github/workflows/sk-code-script-tests.yml:27`, anchor: `    runs-on: ubuntu-latest` (the only job, id `sk-code-scripts` at `:25`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `sk-code-script-tests.yml | sk-code-scripts` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/sk-code-script-tests.yml'))['jobs']['sk-code-scripts'].get('timeout-minutes'))"
grep -E '^\| sk-code-script-tests\.yml \| sk-code-scripts \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T051 Re-size `sk-doc-rename-harness.yml`'s existing timeout (AC-003)

File: `.github/workflows/sk-doc-rename-harness.yml:31`, anchor: `    timeout-minutes: 30` (the only job, id `rename-harness` at `:28`).

Change: replace `30` with the `final` cell of the `sk-doc-rename-harness.yml | rename-harness` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/sk-doc-rename-harness.yml'))['jobs']['rename-harness'].get('timeout-minutes'))"
grep -E '^\| sk-doc-rename-harness\.yml \| rename-harness \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: replace the value with `30`.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T052 Give all three `sk-doc-script-tests.yml` jobs a timeout (AC-003)

File: `.github/workflows/sk-doc-script-tests.yml:20`, `:60` and `:77`, anchors: `    runs-on: ubuntu-latest` three times, for `sk-doc-scripts` at `:18`, `catalog-packages` at `:58` and `citation-drift` at `:75`.

Change: insert `    timeout-minutes: <value>` after each anchor, using each job's own row. Insert in the order `:77`, `:60`, `:20`.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/sk-doc-script-tests.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| sk-doc-script-tests\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: three job ids, none `None`; three rows; each value equals its own row's final cell.

Rollback: delete all three inserted lines.

Stop and escalate if: any anchor is missing, or a value is `None`, or a value is copied from a sibling job's row.

---

### T053 Give `sk-git-script-tests.yml` a timeout (AC-003)

File: `.github/workflows/sk-git-script-tests.yml:35`, anchor: `    runs-on: ubuntu-latest` (the only job, id `sk-git-scripts` at `:33`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `sk-git-script-tests.yml | sk-git-scripts` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/sk-git-script-tests.yml'))['jobs']['sk-git-scripts'].get('timeout-minutes'))"
grep -E '^\| sk-git-script-tests\.yml \| sk-git-scripts \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T054 Re-size `skill-advisor-stress.yml`'s existing timeout (AC-003)

File: `.github/workflows/skill-advisor-stress.yml:43`, anchor: `    timeout-minutes: 20` (the only job, id `skill-advisor-stress` at `:40`).

Change: replace `20` with the `final` cell of the `skill-advisor-stress.yml | skill-advisor-stress` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/skill-advisor-stress.yml'))['jobs']['skill-advisor-stress'].get('timeout-minutes'))"
grep -E '^\| skill-advisor-stress\.yml \| skill-advisor-stress \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: replace the value with `20`.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T055 Give both `skill-doc-frontmatter.yml` jobs a timeout (AC-003)

File: `.github/workflows/skill-doc-frontmatter.yml:28` and `:53`, anchors: `    runs-on: ubuntu-latest` twice, first for `frontmatter-coverage` at `:26` and second for `doc-version-raise` at `:48`.

Change: insert `    timeout-minutes: <value>` after each anchor, using each job's own row. Insert the `:53` line first.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/skill-doc-frontmatter.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| skill-doc-frontmatter\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: two job ids, neither `None`; two rows; each value equals its own row's final cell.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or a value is `None`, or either value is copied from the other job's row.

---

### T056 Give all three `spec-kit-check.yml` jobs a timeout (AC-003)

File: `.github/workflows/spec-kit-check.yml:67`, `:148` and `:184`, anchors: `    runs-on: ubuntu-latest` three times, for `check` at `:65`, `mirrors` at `:146` and `doctor-scripts` at `:182`.

Change: insert `    timeout-minutes: <value>` after each anchor, using each job's own row. Insert in the order `:184`, `:148`, `:67`.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/spec-kit-check.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| spec-kit-check\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: three job ids, none `None`; three rows; each value equals its own row's final cell.

Rollback: delete all three inserted lines.

Stop and escalate if: any anchor is missing, or a value is `None`, or a value is copied from a sibling job's row.

---

### T057 Give `strict-pass-freshness-report.yml` a timeout (AC-003)

File: `.github/workflows/strict-pass-freshness-report.yml:24`, anchor: `    runs-on: ubuntu-latest` (the only job, id `strict-pass-freshness` at `:23`, which has no `name:`).

Change: insert `    timeout-minutes: <value>` immediately after the anchor, where `<value>` is the `final` cell of the `strict-pass-freshness-report.yml | strict-pass-freshness` row.

Check:

```bash
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/strict-pass-freshness-report.yml'))['jobs']['strict-pass-freshness'].get('timeout-minutes'))"
grep -E '^\| strict-pass-freshness-report\.yml \| strict-pass-freshness \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
```

Expected: an integer; one row; the integer equals that row's final cell.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the value is `None`, or it differs from the row.

---

### T058 Give both `trigger-index-rebuild.yml` jobs a timeout (AC-003)

File: `.github/workflows/trigger-index-rebuild.yml:34` and `:187`, anchors: `    runs-on: ubuntu-latest` twice, first for `rebuild` at `:26` and second for `push` at `:178`.

Change: insert `    timeout-minutes: <value>` after each anchor, using each job's own row. Insert the `:187` line first. Change no `if:` and no `permissions:`.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/trigger-index-rebuild.yml'))['jobs']; print({j: v.get('timeout-minutes') for j, v in d.items()})"
grep -E '^\| trigger-index-rebuild\.yml \|' specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md
grep -c 'Trigger-Index-Rebuild: ci' .github/workflows/trigger-index-rebuild.yml
```

Expected: two job ids, neither `None`; two rows; each value equals its own row's final cell; the trailer count is unchanged from before the edit.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or a value is `None`, or the trailer count changed.

---

### T059 Re-size `hooks-node-tests.yml` when the hook merge was rejected (AC-003)

File: `.github/workflows/hooks-node-tests.yml:46`, anchor: `    timeout-minutes: 20` (the only job, id `hook-node-tests` at `:43`).

Change: when the file exists, replace `20` with the `final` cell of the `hooks-node-tests.yml | hook-node-tests` row. When `004`'s hook merge landed, the file is absent: write `hooks-node-tests: merged into opencode-plugin-tests.yml` to `scratch/inventory.md` and change no workflow file.

Check:

```bash
test -f .github/workflows/hooks-node-tests.yml && echo present || echo absent
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
grep -c 'hooks-node-tests: merged into opencode-plugin-tests.yml' "$PHASE/scratch/inventory.md"
```

Expected: `present` with one `timeout-minutes` line in the file and the value equal to its row; or `absent` with `1`. Exactly one of the two outcomes holds.

Rollback: replace the value with `20`, or delete the `merged` line.

Stop and escalate if: the file is present and the row is missing, or the file is absent and the `merged` line is not written.

---

### T060 Prove the timeout pass (AC-003, AC-004)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r24/timeouts.md`. Anchor: none; append a `## R24 proof` section.

Change: run the assertion and the parse, then record both outputs and the count of marked rows under `## R24 proof`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
FLOOR=$(sed -n 's/^D6=\([0-9]\+\)$/\1/p' "$PHASE/scratch/decisions.md")
node "$PHASE/scratch/r24/size-timeouts.mjs" --assert --floor "$FLOOR"
python3 -c "import yaml,glob; d=[(f,j,v) for f in glob.glob('.github/workflows/*.yml') for j,v in yaml.safe_load(open(f))['jobs'].items()]; print('jobs',len(d),'no-timeout',[(f,j) for f,j,v in d if 'timeout-minutes' not in v])"
grep -c '^## R24 proof' "$PHASE/scratch/r24/timeouts.md"
```

Expected: `values match formula: ok` and `50% rule: ok`, exit 0; `no-timeout []`; `1`.

Rollback: delete the `## R24 proof` section.

Stop and escalate if: the assertion exits non-zero, or `no-timeout` is not `[]`, or a marked row lacks its sample count.

---

### T061 Commit the timeout pass (AC-003)

File: `.github/workflows/*.yml` and `scratch/r24/`. Anchor (read): `scratch/r24/timeouts.md`, the `## R24 proof` heading written by T060.

Change: stage every workflow file and the sizing evidence, write the full message below to `/tmp/commit-timeouts.txt`, validate it, then commit with `git commit -F`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
cat > /tmp/commit-timeouts.txt <<'MSG'
ci(workflows): size every job timeout from its own samples

Each job timeout is sized from forty runs of its own job-level samples.
The floor and the 50% rule are applied to every value.

Spec: system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
MSG
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-timeouts.txt; echo "msg=$?"
git add .github/workflows/*.yml "$PHASE/scratch/r24"
git commit -F /tmp/commit-timeouts.txt
git log -1 --format=%s
```

Expected: `msg=0`; `ci(workflows): size every job timeout from its own samples`; a clean commit.

Rollback: `git reset --soft HEAD~1`.

Stop and escalate if: the validator exits non-zero, or the commit stages a path outside the workflow YAML files and `scratch/r24/`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Implementation - R26 switches and the README

### T062 Add the switch to `advisory-checks.yml` (AC-005)

File: `.github/workflows/advisory-checks.yml:19`, anchor: `    runs-on: ubuntu-latest` (the only job, id `advisory` at `:17`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'" .github/workflows/advisory-checks.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/advisory-checks.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T063 Add the switch to `agent-mirror-sync.yml` (AC-005)

File: `.github/workflows/agent-mirror-sync.yml:9`, anchor: `    runs-on: ubuntu-latest` (the only job, id `agent-mirror-sync` at `:7`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_REVIEW != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_REVIEW != 'off'" .github/workflows/agent-mirror-sync.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/agent-mirror-sync.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T064 Add the switch to `changed-packet-validation.yml` (AC-005)

File: `.github/workflows/changed-packet-validation.yml:15`, anchor: `    runs-on: ubuntu-latest` (the only job, id `changed-packets` at `:13`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'" .github/workflows/changed-packet-validation.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/changed-packet-validation.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T065 Add the switch to both `command-tree-parity.yml` jobs (AC-005)

File: `.github/workflows/command-tree-parity.yml:16` and `:52`, anchors: `    runs-on: ubuntu-latest` twice, for `command-tree-parity` at `:14` and `hermes-mirror` at `:46`.

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'` above each anchor. Insert the `:52` line first.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'" .github/workflows/command-tree-parity.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/command-tree-parity.yml')); print('parse ok')"
```

Expected: `2`; `parse ok`.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or the count is not `2`, or the parse fails.

---

### T066 Add the switch to `comment-hygiene.yml` (AC-005)

File: `.github/workflows/comment-hygiene.yml:9`, anchor: `    runs-on: ubuntu-latest` (the only job, id `comment-hygiene` at `:7`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_REVIEW != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_REVIEW != 'off'" .github/workflows/comment-hygiene.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/comment-hygiene.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T067 Add the switch to `deep-loop-runtime.yml` (AC-005)

File: `.github/workflows/deep-loop-runtime.yml:35`, anchor: `    runs-on: ubuntu-latest` (the only job, id `deep-loop-runtime` at `:33`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/deep-loop-runtime.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deep-loop-runtime.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T068 Add the switch to `diagram-corpus.yml` (AC-005)

File: `.github/workflows/diagram-corpus.yml:28`, anchor: `    runs-on: ubuntu-latest` (the only job, id `corpus` at `:26`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/diagram-corpus.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/diagram-corpus.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T069 Add the switch to both `dispatch-enforcement-guard.yml` jobs (AC-005)

File: `.github/workflows/dispatch-enforcement-guard.yml:16` and `:54`, anchors: `    runs-on: ubuntu-latest` twice, for `dispatch-enforcement-guard` at `:14` and `hooks-vitest` at `:52`.

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'` above each anchor. Insert the `:54` line first.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'" .github/workflows/dispatch-enforcement-guard.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/dispatch-enforcement-guard.yml')); print('parse ok')"
```

Expected: `2`; `parse ok`.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or the count is not `2`, or the parse fails.

---

### T070 Add the switch to `gate-inputs.yml` (AC-005)

File: `.github/workflows/gate-inputs.yml:14`, anchor: `    runs-on: ubuntu-latest` (the only job, id `gate-inputs` at `:12`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'" .github/workflows/gate-inputs.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/gate-inputs.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T071 Add the switch to `markdown-link-integrity.yml` (AC-005)

File: `.github/workflows/markdown-link-integrity.yml:34`, anchor: `    runs-on: ubuntu-latest` (the only job, id `markdown-link-integrity` at `:32`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/markdown-link-integrity.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/markdown-link-integrity.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T072 Add the switch to `message-contract.yml` (AC-005)

File: `.github/workflows/message-contract.yml:19`, anchor: `    runs-on: ubuntu-latest` (the only job, id `message-contract` at `:17`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_MESSAGES != 'off'` immediately above the anchor. Change no step condition; the two step `if:` lines at `:45` and `:67` stay as they are.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_MESSAGES != 'off'" .github/workflows/message-contract.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/message-contract.yml')); print('parse ok')"
grep -c "if: github.event_name == 'push'" .github/workflows/message-contract.yml
```

Expected: `1`; `parse ok`; `1`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or either count is not `1`, or the parse fails.

---

### T073 Add the switch to `naming-standard-guard.yml` (AC-005)

File: `.github/workflows/naming-standard-guard.yml:15`, anchor: `    runs-on: ubuntu-latest` (the only job, id `naming-standard` at `:13`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'" .github/workflows/naming-standard-guard.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/naming-standard-guard.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T074 Add the switch to both `opencode-dual-version.yml` jobs (AC-005)

File: `.github/workflows/opencode-dual-version.yml:73` and `:171`, anchors: `    runs-on: ubuntu-latest` twice, for `battery` at `:71` and `both` at `:169`.

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` above each anchor. Insert the `:171` line first.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/opencode-dual-version.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/opencode-dual-version.yml')); print('parse ok')"
```

Expected: `2`; `parse ok`.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or the count is not `2`, or the parse fails.

---

### T075 Add the switch to `opencode-plugin-tests.yml` (AC-005)

File: `.github/workflows/opencode-plugin-tests.yml:53`, anchor: `    runs-on: ubuntu-latest` (the only job, whose id is `plugin-tests` at `:51` or `plugin-and-hook-tests` after `004`'s merge).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/opencode-plugin-tests.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/opencode-plugin-tests.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T076 Add the switch to both `pi-extension-tests.yml` jobs (AC-005)

File: `.github/workflows/pi-extension-tests.yml:26` and `:51`, anchors: `    runs-on: ubuntu-latest` twice, for `discover` at `:24` and `pi-extension` at `:48`.

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` above each anchor. Insert the `:51` line first.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/pi-extension-tests.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/pi-extension-tests.yml')); print('parse ok')"
```

Expected: `2`; `parse ok`.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or the count is not `2`, or the parse fails.

---

### T077 Add the switch to `playbook-operator-contract.yml` (AC-005)

File: `.github/workflows/playbook-operator-contract.yml:16`, anchor: `    runs-on: ubuntu-latest` (the only job, id `operator-contract` at `:14`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'" .github/workflows/playbook-operator-contract.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/playbook-operator-contract.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T078 Add the switch to `prompt-card-sync.yml` (AC-005)

File: `.github/workflows/prompt-card-sync.yml:9`, anchor: `    runs-on: ubuntu-latest` (the only job, id `card-sync` at `:7`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_REVIEW != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_REVIEW != 'off'" .github/workflows/prompt-card-sync.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/prompt-card-sync.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T079 Add the switch to `repo-rules-corpus.yml` (AC-005)

File: `.github/workflows/repo-rules-corpus.yml:29`, anchor: `    runs-on: ubuntu-latest` (the only job, id `repo-rules-corpus` at `:27`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/repo-rules-corpus.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/repo-rules-corpus.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T080 Add the switch to both `routing-registry-drift.yml` jobs (AC-005)

File: `.github/workflows/routing-registry-drift.yml:124` and `:238`, anchors: `    runs-on: ubuntu-latest` twice, for `routing-drift` at `:122` and `golden-prompt-gate` at `:230`.

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` above each anchor. Insert the `:238` line first.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/routing-registry-drift.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/routing-registry-drift.yml')); print('parse ok')"
```

Expected: `2`; `parse ok`.

Rollback: delete both inserted lines.

Stop and escalate if: either anchor is missing, or the count is not `2`, or the parse fails.

---

### T081 Add the switch to `rule-canary-sync.yml` (AC-005)

File: `.github/workflows/rule-canary-sync.yml:11`, anchor: `    runs-on: ubuntu-latest` (the only job, id `rule-canary` at `:9`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'" .github/workflows/rule-canary-sync.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/rule-canary-sync.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T082 Add the switch to `runtime-no-spec-import.yml` (AC-005)

File: `.github/workflows/runtime-no-spec-import.yml:25`, anchor: `    runs-on: ubuntu-latest` (the only job, id `no-spec-import` at `:23`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/runtime-no-spec-import.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/runtime-no-spec-import.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T083 Add the switch to `sk-code-script-tests.yml` (AC-005)

File: `.github/workflows/sk-code-script-tests.yml:27`, anchor: `    runs-on: ubuntu-latest` (the only job, id `sk-code-scripts` at `:25`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/sk-code-script-tests.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/sk-code-script-tests.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T084 Add the switch to `sk-doc-rename-harness.yml` (AC-005)

File: `.github/workflows/sk-doc-rename-harness.yml:30`, anchor: `    runs-on: ubuntu-latest` (the only job, id `rename-harness` at `:28`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/sk-doc-rename-harness.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/sk-doc-rename-harness.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T085 Add the switch to all three `sk-doc-script-tests.yml` jobs (AC-005)

File: `.github/workflows/sk-doc-script-tests.yml:20`, `:60` and `:77`, anchors: `    runs-on: ubuntu-latest` three times, for `sk-doc-scripts` at `:18`, `catalog-packages` at `:58` and `citation-drift` at `:75`.

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'` above each anchor. Insert in the order `:77`, `:60`, `:20`.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'" .github/workflows/sk-doc-script-tests.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/sk-doc-script-tests.yml')); print('parse ok')"
```

Expected: `3`; `parse ok`.

Rollback: delete all three inserted lines.

Stop and escalate if: any anchor is missing, or the count is not `3`, or the parse fails.

---

### T086 Add the switch to `sk-git-script-tests.yml` (AC-005)

File: `.github/workflows/sk-git-script-tests.yml:35`, anchor: `    runs-on: ubuntu-latest` (the only job, id `sk-git-scripts` at `:33`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/sk-git-script-tests.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/sk-git-script-tests.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T087 Add the switch to `skill-advisor-stress.yml` (AC-005)

File: `.github/workflows/skill-advisor-stress.yml:42`, anchor: `    runs-on: ubuntu-latest` (the only job, id `skill-advisor-stress` at `:40`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/skill-advisor-stress.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/skill-advisor-stress.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T088 Add the switch to `skill-doc-frontmatter.yml`'s first job (AC-005)

File: `.github/workflows/skill-doc-frontmatter.yml:28`, anchor: `    runs-on: ubuntu-latest` (the `frontmatter-coverage` job at `:26`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` immediately above the anchor. The second job's condition is T094's edit, not this one.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/skill-doc-frontmatter.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/skill-doc-frontmatter.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T089 Add the switch to all three `spec-kit-check.yml` jobs (AC-005)

File: `.github/workflows/spec-kit-check.yml:67`, `:148` and `:184`, anchors: `    runs-on: ubuntu-latest` three times, for `check` at `:65`, `mirrors` at `:146` and `doctor-scripts` at `:182`.

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'` above each anchor. Insert in the order `:184`, `:148`, `:67`.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'" .github/workflows/spec-kit-check.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/spec-kit-check.yml')); print('parse ok')"
```

Expected: `3`; `parse ok`.

Rollback: delete all three inserted lines.

Stop and escalate if: any anchor is missing, or the count is not `3`, or the parse fails.

---

### T090 Add the switch to `strict-pass-freshness-report.yml` (AC-005)

File: `.github/workflows/strict-pass-freshness-report.yml:24`, anchor: `    runs-on: ubuntu-latest` (the only job, id `strict-pass-freshness` at `:23`).

Change: insert `    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_REPORTS != 'off'` immediately above the anchor.

Check:

```bash
grep -c "if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_REPORTS != 'off'" .github/workflows/strict-pass-freshness-report.yml
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/strict-pass-freshness-report.yml')); print('parse ok')"
```

Expected: `1`; `parse ok`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on the file, or the count is not `1`, or the parse fails.

---

### T091 Record that `trigger-index-rebuild.yml` takes no bare switch (AC-005)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/pass-switch.md` (new file). Anchor: none.

Change: write one line `trigger-index-rebuild.yml: both jobs carry a condition, so T092 and T093 AND the switch onto them`. This task changes no workflow file; both jobs are covered by the two tasks that follow.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
grep -c 'both jobs carry a condition' "$PHASE/scratch/pass-switch.md"
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/trigger-index-rebuild.yml'))['jobs']; print(sorted(d))"
```

Expected: `1`; `['push', 'rebuild']`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/pass-switch.md`.

Stop and escalate if: either job is missing from the parse, or a job's `if:` is absent.

---

### T092 AND the switch onto `trigger-index-rebuild.yml`'s `push` condition (AC-005)

File: `.github/workflows/trigger-index-rebuild.yml:186`, anchor: `    if: needs.rebuild.outputs.committed == 'true'` (job `push` at `:178`).

Change: replace it with `    if: ${{ (vars.SKILLED_CI != 'off') && (vars.SKILLED_CI_REPORTS != 'off') && (needs.rebuild.outputs.committed == 'true') }}`.

Check:

```bash
python3 -c "import yaml; c=yaml.safe_load(open('.github/workflows/trigger-index-rebuild.yml'))['jobs']['push']['if']; print('vars.SKILLED_CI' in c, 'needs.rebuild.outputs.committed' in c, c.count('(')==c.count(')'))"
```

Expected: `True True True`.

Rollback: replace the line with the quoted anchor.

Stop and escalate if: the anchor is not on the file, or any of the three values is `False`.

---

### T093 AND the switch onto `trigger-index-rebuild.yml`'s `rebuild` condition (AC-005)

File: `.github/workflows/trigger-index-rebuild.yml:33`, anchor: `    if: "${{ !endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci') }}"` (job `rebuild` at `:26`).

Change: replace it with `    if: "${{ (vars.SKILLED_CI != 'off') && (vars.SKILLED_CI_REPORTS != 'off') && (!endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci')) }}"`, keeping the surrounding double quotes.

Check:

```bash
python3 -c "import yaml; c=yaml.safe_load(open('.github/workflows/trigger-index-rebuild.yml'))['jobs']['rebuild']['if']; print('vars.SKILLED_CI' in c, 'Trigger-Index-Rebuild: ci' in c, c.count('(')==c.count(')'))"
```

Expected: `True True True`.

Rollback: replace the line with the quoted anchor.

Stop and escalate if: the anchor is not on the file, or any of the three values is `False`, or the file's double quotes are lost.

---

### T094 AND the switch onto `skill-doc-frontmatter.yml`'s `doc-version-raise` condition (AC-005)

File: `.github/workflows/skill-doc-frontmatter.yml:52`, anchor: `    if: github.event_name == 'pull_request'` (job `doc-version-raise` at `:48`).

Change: replace it with `    if: ${{ (vars.SKILLED_CI != 'off') && (vars.SKILLED_CI_TESTS != 'off') && (github.event_name == 'pull_request') }}`.

Check:

```bash
python3 -c "import yaml; c=yaml.safe_load(open('.github/workflows/skill-doc-frontmatter.yml'))['jobs']['doc-version-raise']['if']; print('vars.SKILLED_CI' in c, 'pull_request' in c, c.count('(')==c.count(')'))"
```

Expected: `True True True`.

Rollback: replace the line with the quoted anchor.

Stop and escalate if: the anchor is not on the file, or any of the three values is `False`.

---

### T095 Write the README on/off section (AC-007)

File: `.github/workflows/README.md:75-79`. Anchor:

```markdown
| `trigger-index-rebuild.yml` | yes, `main` and `skilled/**` | no | Rebuilds the committed index after a push. Also runs by hand |

---

## 3. GUARD ENTRYPOINTS
```

Change: insert an `### On/off switches` section between the table and the `---`, holding: the six variable names, the five group rows from `scratch/switch-groups.md` with their member workflows, `off` is the only token that disables, that an unset variable runs the job, that `0`, `false`, `no` and a typo also run it, that `dependabot-auto-merge.yml` has no switch, and that `SKILLED_CI_MESSAGES` must stay unset while the ruleset requires that context because a skipped job reports Success. Change no existing row and renumber no section.

Check:

```bash
grep -c '^### On/off switches$' .github/workflows/README.md
for v in SKILLED_CI SKILLED_CI_TESTS SKILLED_CI_REPORTS SKILLED_CI_REVIEW SKILLED_CI_FRESHNESS SKILLED_CI_MESSAGES; do grep -q "$v" .github/workflows/README.md || echo "missing: $v"; done
sed -n '/^### On\/off switches$/,/^## 3\./p' .github/workflows/README.md | grep -c 'only token'
grep -c 'SKILLED_CI_MESSAGES must stay unset' .github/workflows/README.md
git diff --stat .github/workflows/README.md
```

Expected: `1`; nothing printed by the loop; `1`; `1`; one file with added lines only.

Rollback: delete the inserted section.

Stop and escalate if: the anchor block is not on the file, or the loop prints a missing name, or the section lands after `## 3. GUARD ENTRYPOINTS`.

---

### T096 Prove the switch pass (AC-005, AC-006)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/pass-switch.md`. Anchor: none; append a `## R26 proof` section.

Change: run the counts and the gate, then the negative control. The switch count is `42` when `.github/workflows/hooks-node-tests.yml` is absent and `43` when it is present, because that file carries one job; compute the expected value from the file's presence rather than copying one number. Copy `trigger-index-rebuild.yml` to `scratch/trigger-index-rebuild-mutant.yml`, replace the parenthesised `rebuild` condition with `if: vars.SKILLED_CI != 'off'`, and run the T093 assertion against the copy. The copy must print `True False True` and exit `1`, because the original expression is gone; write `mutant: rejected` only on that failure. Record the counts, the gate line and the mutant result, then remove the copy.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
SWITCHES=$(grep -c "vars.SKILLED_CI != 'off'" .github/workflows/*.yml | awk -F: '{s+=$2} END {print s}')
if test -f .github/workflows/hooks-node-tests.yml; then EXPECTED=43; else EXPECTED=42; fi
printf 'switches %s expected %s\n' "$SWITCHES" "$EXPECTED"
test "$SWITCHES" -eq "$EXPECTED" && echo 'switch count: ok' || echo 'switch count: mismatch'
python3 -c "import yaml,glob; d=[(f,j) for f in glob.glob('.github/workflows/*.yml') for j,v in yaml.safe_load(open(f))['jobs'].items() if 'vars.SKILLED_CI' not in str(v.get('if',''))]; print(d)"
GATE=$(bash .github/scripts/check-gate-inputs.sh | tail -1)
echo "$GATE"
printf '## R26 proof\nswitches %s expected %s\ngate %s\n' "$SWITCHES" "$EXPECTED" "$GATE" >> "$PHASE/scratch/pass-switch.md"
cp .github/workflows/trigger-index-rebuild.yml "$PHASE/scratch/trigger-index-rebuild-mutant.yml"
test -s "$PHASE/scratch/trigger-index-rebuild-mutant.yml"
perl -0pi -e "s/^    if: \"\\\$\\{\\{ !endsWith\\(github\\.event\\.head_commit\\.message, 'Trigger-Index-Rebuild: ci'\\) \\}\\}\"\$/    if: vars.SKILLED_CI != 'off'/m" "$PHASE/scratch/trigger-index-rebuild-mutant.yml"
grep -n '^    if:' "$PHASE/scratch/trigger-index-rebuild-mutant.yml"
python3 - "$PHASE/scratch/trigger-index-rebuild-mutant.yml" <<'PY'
import sys, yaml
c = yaml.safe_load(open(sys.argv[1]))['jobs']['rebuild']['if']
ok = 'vars.SKILLED_CI' in c and 'Trigger-Index-Rebuild: ci' in c and c.count('(') == c.count(')')
print('vars.SKILLED_CI' in c, 'Trigger-Index-Rebuild: ci' in c, c.count('(') == c.count(')'))
sys.exit(0 if ok else 1)
PY
MUTANT=$?
echo "mutant_check=$MUTANT"
if [ "$MUTANT" -eq 1 ]; then printf 'mutant: rejected\n' >> "$PHASE/scratch/pass-switch.md"; elif [ "$MUTANT" -eq 0 ]; then printf 'mutant: accepted\n' >> "$PHASE/scratch/pass-switch.md"; else echo 'mutant_check: error'; fi
grep -c 'mutant: rejected' "$PHASE/scratch/pass-switch.md"
grep -c 'mutant: accepted' "$PHASE/scratch/pass-switch.md" || true
rm "$PHASE/scratch/trigger-index-rebuild-mutant.yml"
```

Expected: `switches 42 expected 42` and `switch count: ok` when `hooks-node-tests.yml` is absent, or `switches 43 expected 43` and `switch count: ok` when it is present; exactly the two `dependabot-auto-merge.yml` jobs; `RESULT: PASSED`; the mutant's `rebuild` line reads `if: vars.SKILLED_CI != 'off'` and the `push` line keeps `if: needs.rebuild.outputs.committed == 'true'`; `True False True`; `mutant_check=1`; `1`; `0`; the `rm` exits 0.

Rollback: delete the `## R26 proof` section and restore `scratch/pass-switch.md` with `git checkout`.

Stop and escalate if: the switch count is not the expected value for the tree, the no-switch list names any job other than Dependabot's two, the mutant check does not exit `1`, or the mutant is accepted.

---

### T097 Commit the switch pass (AC-005)

File: `.github/workflows/*.yml` and `scratch/pass-switch.md`. Anchor (read): `scratch/pass-switch.md`, the `## R26 proof` heading written by T096.

Change: stage every workflow YAML (not the README) and the switch proof, write the full message below to `/tmp/commit-switches.txt`, validate it, then commit with `git commit -F`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
cat > /tmp/commit-switches.txt <<'MSG'
ci(workflows): gate every job behind a repository switch

Every job except Dependabot's two now answers the switch and its group variable.
The three existing conditions keep their expression as a conjunct.

Spec: system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
MSG
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-switches.txt; echo "msg=$?"
git add .github/workflows/*.yml "$PHASE/scratch/pass-switch.md"
git commit -F /tmp/commit-switches.txt
git log -1 --format=%s
git status --short .github/workflows/README.md | wc -l
```

Expected: `msg=0`; `ci(workflows): gate every job behind a repository switch`; a clean commit; `1`, because the README section is committed separately.

Rollback: `git reset --soft HEAD~1`.

Stop and escalate if: the validator exits non-zero, or the commit stages a path outside the workflow YAML files and the switch proof.

---

### T098 Commit the README section (AC-007)

File: `.github/workflows/README.md`. Anchor (read): `.github/workflows/README.md`, the `### On/off switches` heading written by T095.

Change: stage the README, write the full message below to `/tmp/commit-readme.txt`, validate it, then commit with `git commit -F`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
cat > /tmp/commit-readme.txt <<'MSG'
docs(ci): document the workflow switches

The README now names the six variables, the five groups and the one token that disables a job.

Spec: system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
MSG
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-readme.txt; echo "msg=$?"
git add .github/workflows/README.md
git commit -F /tmp/commit-readme.txt
git log -1 --format=%s
git status --short | wc -l
```

Expected: `msg=0`; `docs(ci): document the workflow switches`; a clean commit; `0`.

Rollback: `git reset --soft HEAD~1`.

Stop and escalate if: the validator exits non-zero, or the commit stages a path outside the README.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification

### T099 Prove the switch behaviourally on a fork (AC-008)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/r26-probe.md` (new file). Anchor: none.

Precondition: T097's `ci(workflows): gate every job behind a repository switch` commit and T098's `docs(ci): document the workflow switches` commit are on `HEAD`, and the fork named by the `PROBE_FORK=` line in `scratch/decisions.md` carries this repository's workflows. Push the phase `HEAD` to the fork's `main` before the first dispatch; without it the fork runs the pre-phase workflow, the switch is absent, and the `off` run cannot skip.

Change: push `HEAD` to the fork's `main`, record the pushed SHA and the fork's previous `main` SHA, set `SKILLED_CI_REPORTS=off`, dispatch `strict-pass-freshness-report.yml`, wait for the run, record its conclusion and its job's conclusion, then delete the variable, dispatch again, wait, and record the second run. Write the pushed SHA on the `fork head:` line, then `off: skipped`, `unset: ran` and both run ids.

Check:

```bash
set -euo pipefail
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
PROBE_FORK=$(sed -n 's/^PROBE_FORK=//p' "$PHASE/scratch/decisions.md")
test -n "$PROBE_FORK"
FORK_URL="https://github.com/$PROBE_FORK.git"
test "$(git log -1 --format=%s)" = 'docs(ci): document the workflow switches'
test "$(git log -2 --format=%s | sed -n '2p')" = 'ci(workflows): gate every job behind a repository switch'
HEAD_SHA=$(git rev-parse HEAD)
FORK_BEFORE=$(git ls-remote "$FORK_URL" refs/heads/main | cut -f1)
git push "$FORK_URL" HEAD:main
FORK_AFTER=$(git ls-remote "$FORK_URL" refs/heads/main | cut -f1)
printf 'fork main: %s\n' "$FORK_AFTER"
test "$FORK_AFTER" = "$HEAD_SHA"
gh variable set SKILLED_CI_REPORTS --body off --repo "$PROBE_FORK"
BEFORE=$(gh run list --workflow strict-pass-freshness-report.yml --repo "$PROBE_FORK" --limit 1 --json databaseId --jq '.[0].databaseId // 0')
gh workflow run strict-pass-freshness-report.yml --repo "$PROBE_FORK" --ref main
OFF_RUN=""
for _ in $(seq 1 36); do
  OFF_RUN=$(gh run list --workflow strict-pass-freshness-report.yml --repo "$PROBE_FORK" --limit 1 --json databaseId --jq '.[0].databaseId // empty')
  [ -n "$OFF_RUN" ] && [ "$OFF_RUN" != "$BEFORE" ] && break
  sleep 5
done
test -n "$OFF_RUN" && test "$OFF_RUN" != "$BEFORE"
gh run watch "$OFF_RUN" --repo "$PROBE_FORK"
OFF_RUN_CONCLUSION=$(gh run view "$OFF_RUN" --repo "$PROBE_FORK" --json conclusion --jq '.conclusion')
OFF_JOB=$(gh run view "$OFF_RUN" --repo "$PROBE_FORK" --json jobs --jq '.jobs[0].conclusion')
printf 'off run: %s job: %s\n' "$OFF_RUN_CONCLUSION" "$OFF_JOB"
test "$OFF_RUN_CONCLUSION" = success && test "$OFF_JOB" = skipped
gh variable delete SKILLED_CI_REPORTS --repo "$PROBE_FORK"
sleep 5
BEFORE=$(gh run list --workflow strict-pass-freshness-report.yml --repo "$PROBE_FORK" --limit 1 --json databaseId --jq '.[0].databaseId // 0')
gh workflow run strict-pass-freshness-report.yml --repo "$PROBE_FORK" --ref main
UNSET_RUN=""
for _ in $(seq 1 36); do
  UNSET_RUN=$(gh run list --workflow strict-pass-freshness-report.yml --repo "$PROBE_FORK" --limit 1 --json databaseId --jq '.[0].databaseId // empty')
  [ -n "$UNSET_RUN" ] && [ "$UNSET_RUN" != "$BEFORE" ] && break
  sleep 5
done
test -n "$UNSET_RUN" && test "$UNSET_RUN" != "$BEFORE"
gh run watch "$UNSET_RUN" --repo "$PROBE_FORK"
UNSET_RUN_CONCLUSION=$(gh run view "$UNSET_RUN" --repo "$PROBE_FORK" --json conclusion --jq '.conclusion')
UNSET_JOB=$(gh run view "$UNSET_RUN" --repo "$PROBE_FORK" --json jobs --jq '.jobs[0].conclusion')
printf 'unset run: %s job: %s\n' "$UNSET_RUN_CONCLUSION" "$UNSET_JOB"
test -n "$UNSET_JOB" && test "$UNSET_JOB" != skipped
printf 'fork head: %s\noff: skipped\nrun id: %s\nunset: ran\nrun id: %s\n' "$HEAD_SHA" "$OFF_RUN" "$UNSET_RUN" > "$PHASE/scratch/r26-probe.md"
grep -cE 'run id: [0-9]+' "$PHASE/scratch/r26-probe.md"
grep -c 'off: skipped' "$PHASE/scratch/r26-probe.md"
grep -c 'unset: ran' "$PHASE/scratch/r26-probe.md"
```

Expected: a `fork main:` line equal to `HEAD_SHA`; `off run: success job: skipped`; `unset run: success job: success` or `unset run: failure job: failure`, never a `skipped` job; `2`; `1`; `1`.

Rollback: `gh variable delete SKILLED_CI_REPORTS --repo "$PROBE_FORK"` when it still exists; `rm "$PHASE/scratch/r26-probe.md"`; when the fork had a previous `main`, restore it with `git push --force "$FORK_URL" "$FORK_BEFORE:main"` using the SHA printed before the push.

Stop and escalate if: the push is rejected, the fork's `main` does not equal `HEAD`, no run appears, the `off` run is not `success` with its job `skipped`, the unset job is `skipped`, or the variable cannot be deleted.

---

### T100 Read the first 24 hours of runs for a timeout kill (AC-003)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/phase-result.md` (new file). Anchor: none.

Change: read the newest 300 runs, grep every non-success run's log for the kill message, and write `timeout kills: <n>` followed by any hit's run id. When a job was killed, raise its value from a fresh sample in `scratch/r24/timeouts.md` and record the old value, the new one and the run id.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
gh run list --limit 300 --json databaseId,name,conclusion,createdAt > "$PHASE/scratch/runs-24h.json"
python3 -c "import json; d=json.load(open('$PHASE/scratch/runs-24h.json')); print(len(d), sum(1 for r in d if r['conclusion']!='success'))"
grep -cE '^timeout kills: [0-9]+$' "$PHASE/scratch/phase-result.md"
```

Expected: `300` runs, a non-success count, and `1` line matching `timeout kills: <n>`.

Rollback: delete `scratch/runs-24h.json` and the `timeout kills` line.

Stop and escalate if: the kill message appears and the value cannot be raised from a fresh sample, or the 50% rule would have to be relaxed to keep the job green.

---

### T101 Run the final gates and record the phase result (AC-009, AC-011, AC-012)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/phase-result.md`. Anchor: none; append a `## Final gates` section.

Change: run the gate commands, record each output verbatim, then mark T001 to T101 `[x]` in `tasks.md` and set `Closeable: Yes` in `acceptance-criteria.md` only when every row is `Met`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
BASE=$(cat "$PHASE/scratch/phase-start-sha.txt")
bash .github/scripts/check-gate-inputs.sh
python3 -c "import yaml, glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]; print('parse ok')"
git diff --name-only "$BASE"..HEAD
git diff "$BASE"..HEAD -- .github | grep -cE '^\+.*(R2[456]|D6|D[0-9]|phase 007|Phase 7)'
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/$PHASE" --strict --no-recursive
```

Expected: `RESULT: PASSED`; `parse ok`; a file list inside `.github/workflows/` and `$PHASE/`; `0`; `RESULT: PASSED`.

Rollback: delete the `## Final gates` section and revert the `[x]` marks.

Stop and escalate if: either gate does not print `RESULT: PASSED`, or the ephemeral-id count is not `0`, or a changed path falls outside the three allowed roots.

---

### T102 Commit the closure records (AC-009, AC-011, AC-012)

File: `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md`, `acceptance-criteria.md` and the verification records under `scratch/`. Anchor: none; T101 has closed the acceptance rows and set `Closeable: Yes`.

Change: mark T102 `[x]` in `tasks.md`, stage the two spec documents and `scratch/`, write the full message below to `/tmp/commit-closure.txt`, validate it, then commit with `git commit -F`. The closure edits and the probe records land in one commit, so the phase tree ends clean.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
cat > /tmp/commit-closure.txt <<'MSG'
docs(spec): close the workflow hygiene phase

Record the completed task list, the acceptance criteria and the probe results in
one closure commit.

Spec: system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control
MSG
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-closure.txt; echo "msg=$?"
git add "$PHASE/tasks.md" "$PHASE/acceptance-criteria.md" "$PHASE/scratch"
git diff --cached --name-only
git commit -F /tmp/commit-closure.txt
git log -1 --format=%s
git status --short | wc -l
```

Expected: `msg=0`; every staged path under `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/`; `docs(spec): close the workflow hygiene phase`; `0`.

Rollback: `git reset --soft HEAD~1`, restore the previous `[x]` marks and `Closeable:` value with `git checkout -- "$PHASE/tasks.md" "$PHASE/acceptance-criteria.md"`, and delete `/tmp/commit-closure.txt`.

Stop and escalate if: the validator exits non-zero, or a staged path falls outside the phase folder.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Recommendations**: See `../001-research/research/synthesis-reviews/final-review.md` (`:458-493` for R24 to R26, `:585-592` for the phase plan, `:619` for D6)
- **Rules this phase applies**: See `../006-sk-code-ci-surface/` and its `references/job-shape-rules.md`
- **Baseline**: See `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` and `../001-research/scratch/ci-run-data/summary.md`

| R-id | Requirements | Tasks | Acceptance criteria |
|------|--------------|-------|---------------------|
| R24 | REQ-003, REQ-004 | T024 to T061, T100 | AC-003, AC-004 |
| R25 | REQ-001, REQ-002 | T007 to T023 | AC-001, AC-002 |
| R26 | REQ-005, REQ-006, REQ-007, REQ-008 | T006, T062 to T098, T099 | AC-005, AC-006, AC-007, AC-008 |
| Gates and decisions | REQ-009, REQ-010, REQ-011, REQ-012, REQ-013 | T001 to T005, T101 to T102 | AC-009, AC-010, AC-011, AC-012, AC-013 |
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

- [ ] CHK-001 [P0] Requirements documented in spec.md - planned as REQ-001 to REQ-013, each naming R24, R25, R26, D6 or the gates
- [ ] CHK-002 [P0] Technical approach defined in plan.md - the three-pass order, the formula, the split and the probe
- [ ] CHK-003 [P1] Dependencies identified and available - `003`, `004`, `005` and `006` landed (T003), `gh` scopes, a fork, and D6 (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks - `python3 -c "import yaml, glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]; print('parse ok')"` parses every workflow and `check-gate-inputs.sh` prints `RESULT: PASSED` (T020, T060, T096, T101)
- [ ] CHK-011 [P0] No console errors or warnings - the gate prints `failures=0` and the sizing script exits 0 with `50% rule: ok` (T020, T060)
- [ ] CHK-012 [P1] Error handling implemented - the split's `auto-merge` job skips when the update is not an npm patch, and the switch fails safe to on (T019, T062 to T090)
- [ ] CHK-013 [P1] Code follows project patterns - the switch sits above `runs-on:` and the timeout below it, the split mirrors `trigger-index-rebuild.yml`'s token split, and no comment carries a packet id (T019, T027 to T058, T062 to T094)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met - `acceptance-criteria.md` rows AC-001 to AC-013
- [ ] CHK-021 [P0] Manual testing complete - the fork probe and the Dependabot pull request (T022, T099)
- [ ] CHK-022 [P1] Edge cases tested - the mutant copy proves the AND rule rejects a replaced condition, and the thin-sample rows are marked (T026, T096)
- [ ] CHK-023 [P1] Error scenarios validated - a timeout kill is read from the log rather than assumed absent, and the probe reads both the `off` and the unset state (T099, T100)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class - `class-of-bug` for the missing timeouts and permissions, `cross-consumer` for the switch because two later phases read its names, `instance-only` for the Dependabot split
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed - `grep -n '^    if:'`, `grep -n 'timeout-minutes'` and `grep -L 'permissions:'` over `.github/workflows/*.yml`, re-run after the dependency phases (T003, plan.md Affected Surfaces)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed - `check-gate-inputs.sh`, the 006 rule data, the 009 report and the README table, each with its verification in plan.md
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests - the permission split is the security change: the merge job runs no repository code and no checkout, proved by reading its steps and by `grep -c 'actions/checkout'` returning 0 (T019)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - workflow class (3) x change (4) x group (6), with five required rows, in plan.md
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - the fork probe is that variant: the same workflows with a variable set and unset (T099)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range - every sample row names its run ids and every probe row its run id, under `scratch/`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets - the change adds permission blocks, timeouts, `vars.*` expressions and prose; no token, key or PAT value appears in any edited file
- [ ] CHK-031 [P0] Input validation implemented - not applicable: the switch compares a repository variable to a fixed literal, and no value reaches a shell
- [ ] CHK-032 [P1] Auth/authz working correctly - every workflow declares a scope, the only write scopes sit on a job that runs no repository code, and no job gains a scope it did not already use (T007 to T019)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized - R24 to R26 map to REQ-001 to REQ-013 and to AC-001 to AC-013 in the cross-reference table above
- [ ] CHK-041 [P1] Code comments adequate - the merge job keeps the reason it holds the write scope, and the README section carries the `off`-only rule and the message-contract prohibition
- [ ] CHK-042 [P2] README updated (if applicable) - `.github/workflows/README.md` gains the `### On/off switches` section and no existing row changes (T095)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only - the samples, the sizing table, the gate transcripts and the probe records live under `$PHASE/scratch/`
- [ ] CHK-051 [P1] scratch/ cleaned before completion - the mutant copy is deleted after T096; the samples and the table stay as the phase's evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | [ ]/13 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---
