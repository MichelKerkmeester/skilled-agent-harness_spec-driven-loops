---
title: "Tasks: Phase 3: trigger-and-job-hygiene"
description: "Task Format: T### [P?] Description (file path). Thirty-eight ordered tasks for the trigger and job hygiene phase: five operator decisions and the baseline rows, then the parity comment and filters, the deleted duplicate step, the suppression removal, the three checkout depths, the two review-time filters, the pre-commit inventory and the README table, then the concurrency block on 30 files, the whole-tree gates, six concern commits and one closure commit, and the CI probes that close the acceptance rows."
trigger_phrases:
  - "trigger and job hygiene tasks"
  - "phase 3 trigger and job hygiene tasks"
  - "concurrency and path filter tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: trigger-and-job-hygiene

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

Every task below names one file, quotes the anchor text it edits, gives that anchor's current line number, puts every command in a fenced block, states the expected result, names the acceptance criterion it satisfies, gives a rollback, and gives one concrete stop condition.

Line numbers are the values on disk when this plan was written. Tasks T007 to T021 run before T022 and T023 on purpose: inserting the concurrency block above `jobs:` shifts every line below it, so landing that block last keeps every quoted number valid. Within `command-tree-parity.yml`, T007, T008 and T009 run bottom-up for the same reason.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T001 DECISION D2 (operator yes required) - cancel on main or on pull requests only (AC-001, AC-002)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md` (exists; written 2026-10-23 with the operator's answer). Anchor: the answer line.

Default: pull requests only, `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`. After R1, main cancellation reclaims about 89 wall-minutes per window across 23 pairs and costs a verdict on every commit but the newest.

Alternative: `cancel-in-progress: true` on all 30 files. It reclaims 817 wall-minutes per window standalone and about 89 after R1, and it cancels a superseded `main` run.

Change: the operator answered on 2026-10-23, and the file already holds the answer. Do not re-ask and do not rewrite the file; this task only runs the existing check.

Check:

```bash
mkdir -p specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch
grep -c '^D2=' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md
```

Expected: `1`.

Rollback: delete the `D2=` line from `scratch/decisions.md`.

Stop and escalate if: no answer arrives, or the answer is neither `pr-only` nor `true`.

---

### T002 DECISION D3 (operator yes required) - approve or reject the command-tree-parity filter (AC-003)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md` (exists; written 2026-10-23 with the operator's answer). Anchor: the answer line.

Default: approve. The filter is worth ~265 runner-min/day standalone and ~123 after R1, because 30 of 38 human pushes touch none of its inputs.

Alternative: reject. The workflow stays unfiltered, the comment at `:47-50` keeps saying so, and T007, T008, T009, T028 and the row move in T021 do not run.

Change: the operator answered on 2026-10-23, and the file already holds the answer. Do not re-ask and do not rewrite the file; this task only runs the existing check.

Check:

```bash
grep -c '^D3=' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md
```

Expected: `1`.

Rollback: delete the `D3=` line.

Stop and escalate if: no answer arrives, or the answer is neither `approve` nor `reject`.

---

### T003 DECISION D4 (operator yes required) - choose the dispatch-enforcement-guard shape (AC-005, AC-006)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md` (exists; written 2026-10-23 with the operator's answer). Anchor: the answer line.

Default: `drop-step`. Keep both jobs and delete the duplicate `Run the dispatch audit core suite` step at `:41-50`. No check name changes, and the fail-closed rule-suite guard at `:31-35` stays byte-identical.

Alternative: `merge`. One job holds the rule-suite step, one `npm --prefix .skilled ci`, and the whole-tree vitest run; the `hooks-vitest` job at `:52-67` is deleted and the remaining job is renamed. Both check names change, and the saving is inferred at 1-2 billed minutes per run.

Change: the operator answered on 2026-10-23, and the file already holds the answer. Do not re-ask and do not rewrite the file; this task only runs the existing check.

Check:

```bash
grep -c '^D4=' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md
```

Expected: `1`.

Rollback: delete the `D4=` line.

Stop and escalate if: the answer is `merge`. T012, T030 and the README row for this workflow are written for `drop-step`; a `merge` answer needs its own task for the merged job and its own check name before any file is edited.

---

### T004 DECISION D7 (operator yes required) - approve fetch-depth 2 on deep-loop-runtime (AC-008, AC-009)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md` (exists; written 2026-10-23 with the operator's answer). Anchor: the answer line.

Default: `depth-2`. The mode-event suites bind a run to a commit and its parent (`deep-loop-runtime.yml:38-39`) and read nothing older.

Alternative: `keep-0`. The file keeps `fetch-depth: 0` at `:42`, and T017 does not run.

Change: the operator answered on 2026-10-23, and the file already holds the answer. Do not re-ask and do not rewrite the file; this task only runs the existing check.

Check:

```bash
grep -c '^D7=' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md
```

Expected: `1`.

Rollback: delete the `D7=` line.

Stop and escalate if: no answer arrives, or the answer is neither `depth-2` nor `keep-0`.

---

### T005 DECISION D10 (operator yes required) - skip or build the changed-packet-validation filter (AC-004)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md` (exists; written 2026-10-23 with the operator's answer). Anchor: the answer line.

Default: `skip`. The filter is worth about 10 runner-min/day after R1, because 33 of 38 human pushes touch `specs/**` and would still run it.

Alternative: `filter`. Both events gain four `paths:` entries.

Change: the operator answered on 2026-10-23, and the file already holds the answer. Do not re-ask and do not rewrite the file; this task only runs the existing check.

Check:

```bash
grep -c '^D10=' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md
```

Expected: `1`.

Rollback: delete the `D10=` line.

Stop and escalate if: no answer arrives, or the answer is neither `skip` nor `filter`.

---

### T006 Copy the 002 baseline rows this phase measures against (AC-016)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/phase-baseline.md` (new file). Anchor: none.

Change: copy the 002 summary's first 40 lines, then append one row per workflow this phase touches: `advisory-checks`, `agent-mirror-sync`, `changed-packet-validation`, `command-tree-parity`, `dispatch-enforcement-guard`, `deep-loop-runtime`, `repo-rules-corpus`, `rule-canary-sync`, `skill-doc-frontmatter`, `strict-pass-freshness-report`.

Check:

```bash
test -f specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/summary.md && echo BASELINE_PRESENT
```

Expected: `BASELINE_PRESENT`.

Then:

```bash
sed -n '1,40p' specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/summary.md \
  > specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/phase-baseline.md
```

Expected: exit 0 and a non-empty file.

Then, for each of the ten workflows, append one row naming the workflow and its baseline runner-minutes from the copied summary.

Check:

```bash
grep -cE '^\| `?(advisory-checks|agent-mirror-sync|changed-packet-validation|command-tree-parity|dispatch-enforcement-guard|deep-loop-runtime|repo-rules-corpus|rule-canary-sync|skill-doc-frontmatter|strict-pass-freshness-report)' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/phase-baseline.md
```

Expected: `10`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/phase-baseline.md`.

Stop and escalate if: `BASELINE_PRESENT` is not printed. Phase 002 has not recorded its 24 h snapshot, so no after number has a before number; do not substitute a figure from `001-research/research/research.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T007 Rewrite the command-tree-parity comment so it describes the filter (AC-003)

File: `.github/workflows/command-tree-parity.yml:47-50`, anchor:

```yaml
    # The Hermes runtime reads generated copies of every skill's SKILL.md and of the
    # command prompts. An edit to any skill can leave its copy stale, and no path filter
    # narrow enough to keep a heavier workflow cheap sees every such edit, so the copies
    # are compared here, on every push and pull request.
```

Change: replace those four lines with these four:

```yaml
    # The Hermes runtime reads generated copies of every skill's SKILL.md, of the agent
    # personas and of the command prompts. The filter above names each of those sources,
    # so an edit to any of them runs this job; a missed input is what lets a stale copy
    # land green, which is the failure this job exists to catch.
```

Check:

```bash
sed -n '47,50p' .github/workflows/command-tree-parity.yml | grep -c 'The filter above names each of those sources'
```

Expected: `1`.

Rollback: replace the four new lines with the four quoted anchor lines.

Stop and escalate if: the four anchor lines are not on the file at `:47-50`.

---

### T008 Add the push filter to command-tree-parity (AC-003)

File: `.github/workflows/command-tree-parity.yml:7-8`, anchor:

```yaml
  push:
    branches: [main, 'skilled/**']
```

Change: insert these 24 lines immediately after the `branches:` line:

```yaml
    paths:
      - '.skilled/commands/**'
      - '.opencode/commands/**'
      - '.claude/commands/**'
      - '.cursor/commands/**'
      - '.claude/agents/**'
      - '.skilled/agents/**'
      - '.opencode/agents/**'
      - '.cursor/agents/**'
      - '.devin/agents/**'
      - '.skilled/skills/**/SKILL.md'
      - '.opencode/skills/**/SKILL.md'
      - '.hermes/**'
      - '.skilled/skills/system-spec-kit/**'
      - '.opencode/skills/system-spec-kit/**'
      - '.claude/settings.json'
      - '.claude/hooks/**'
      - '.codex/hooks.json'
      - '.codex/hooks/**'
      - '.cursor/hooks.json'
      - '.cursor/hooks/**'
      - '.devin/hooks.v1.json'
      - '.devin/hooks/**'
      - '.github/workflows/command-tree-parity.yml'
```

Check:

```bash
grep -c "^      - '" .github/workflows/command-tree-parity.yml
```

Expected: `23`.

Rollback: delete the `paths:` line and its 23 entries, restoring the file to the quoted anchor.

Stop and escalate if: the anchor is not at `:7-8`, or the count is not 23.

---

### T009 Add the pull-request filter to command-tree-parity (AC-003)

File: `.github/workflows/command-tree-parity.yml:5-6`, anchor:

```yaml
  pull_request:
    branches: [main, 'skilled/**']
```

Change: insert the same 24 lines T008 inserted, immediately after this `branches:` line.

Check:

```bash
grep -c "^      - '" .github/workflows/command-tree-parity.yml
grep -c '^    paths:' .github/workflows/command-tree-parity.yml
grep -c "command-tree-parity.yml'" .github/workflows/command-tree-parity.yml
```

Expected: `46`, then `2`, then `2`.

Rollback: delete the second `paths:` block, the one under `pull_request:`.

Stop and escalate if: the anchor is not at `:5-6`, or any count differs.

---

### T010 Run the twin gate over the new parity filter (AC-003, AC-013)

File: `.github/scripts/check-gate-inputs.sh` (read-only; no edit). Anchor: none.

Change: none. This task proves the filter's twin pairs.

Check:

```bash
bash .github/scripts/check-gate-inputs.sh
```

Expected: `RESULT: PASSED`, with `failures=0` and `twin_pairs` at least `311`.

Rollback: none; the task changes no file.

Stop and escalate if: the gate prints `filter-twins` twice for the same entry, or it still fails after two repairs.

---

### T011 Record D10 and add the changed-packet-validation filter only if it flipped (AC-004)

File: `.github/workflows/changed-packet-validation.yml:5` and `:7`, anchors:

```yaml
    branches: [main, 'skilled/**']
```

and

```yaml
    branches: [main]
```

Change, under `D10=skip`: no YAML edit. Under `D10=filter`: insert these five lines after `:7` first, then after `:5`, so the lower block does not move the upper anchor:

```yaml
    paths:
      - 'specs/**'
      - '.skilled/skills/system-spec-kit/**'
      - '.opencode/skills/system-spec-kit/**'
      - '.github/workflows/changed-packet-validation.yml'
```

Check, under `D10=skip`:

```bash
grep -c '^D10=skip' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/decisions.md
git diff --stat -- .github/workflows/changed-packet-validation.yml
```

Expected: `1`, then no output.

Check, under `D10=filter`:

```bash
grep -c '^    paths:' .github/workflows/changed-packet-validation.yml
bash .github/scripts/check-gate-inputs.sh
```

Expected: `2`, then `RESULT: PASSED`.

Rollback: under `filter`, delete both `paths:` blocks; under `skip`, nothing to roll back.

Stop and escalate if: the `D10=` line is absent, or the filter answer leaves fewer than two `paths:` blocks.

---

### T012 Delete the duplicate dispatch-audit step (AC-006)

File: `.github/workflows/dispatch-enforcement-guard.yml:41-50`, anchor:

```yaml
      - name: Run the dispatch audit core suite
        run: |
          set -euo pipefail
          npm --prefix .skilled ci
          # The quarantined evidence tray (review/containment) freezes an older copy of
          # this suite that resolves no skills tree, so only the live copies enforce.
          # Vitest is installed under .skilled, never at the repository root, so the
          # runner is called by its path. npx resolves through any node_modules above
          # it and has run a cached, unpinned vitest in place of the locked one.
          .skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs --exclude "**/review/containment/**"
```

Change: delete all ten lines. Leave the `Run the dispatch rule engine suite` step at `:22-40`, including the `if [ ! -f "$SUITE" ]` block at `:31-35`, and leave the `hooks-vitest` job at `:52-67` byte-identical.

Check:

```bash
grep -c 'dispatch-audit.test.mjs' .github/workflows/dispatch-enforcement-guard.yml
grep -c 'vitest run --config .skilled/hooks/vitest.config.ts' .github/workflows/dispatch-enforcement-guard.yml
git diff --numstat -- .github/workflows/dispatch-enforcement-guard.yml
```

Expected: `0`, then `1`, then a row whose added count is `0` and whose deleted count is `10`.

Rollback: restore the ten quoted lines immediately above the `hooks-vitest` job.

Stop and escalate if: the anchor is not at `:41-50`, or the diff shows any added line.

---

### T013 Prove the seven hooks vitest suites still collect and pass (AC-005)

File: `.skilled/hooks/vitest.config.ts` (read-only; no edit). Anchor: none.

Change: none. This task proves the deleted step was a duplicate.

Check:

```bash
npm --prefix .skilled ci
.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts --reporter=verbose > /tmp/hooks-vitest.log 2>&1; echo "exit=$?"
grep -oE '\.skilled/hooks/[a-z0-9/-]+\.(test|spec)\.(ts|mjs)' /tmp/hooks-vitest.log | sort -u | wc -l
```

Expected: `exit=0`, then `7`: `classifier-injection-screen/pi/classifier-injection-screen.test.ts`, `dispatch/codex/codex-shell-tool.test.mjs`, `dispatch/devin/devin-dispatch-audit.test.mjs`, `dispatch/lib/dispatch-audit.test.mjs`, `dispatch/pi/directive-dedup.test.ts`, `dispatch/pi/dispatch-preflight-lint.test.ts`, `session-relaunch/pi/session-relaunch.test.ts`.

Rollback: none; the task changes no tracked file.

Stop and escalate if: the count is not 7, or a suite fails.

---

### T014 Remove the double suppression in advisory-checks (AC-007)

File: `.github/workflows/advisory-checks.yml:38`, `:52` and `:68`, anchors:

```yaml
          node "$RUNNER" || true
```

```yaml
          node "$VALIDATOR" || echo "doc-model drift reported above; fix by citing canonical model names from registry.ts"
```

```yaml
          node "$GENERATOR" --check || echo "trigger index drift reported above; the trigger-index-rebuild workflow repairs drift on the integration branches after merge, or regenerate locally with node $GENERATOR"
```

Change: line `:38` becomes `          node "$RUNNER"`. Line `:52` becomes four lines:

```bash
          if ! node "$VALIDATOR"; then
            echo "::error::doc-model drift found; fix by citing canonical model names from registry.ts"
            exit 1
          fi
```

Line `:68` becomes four lines:

```bash
          if ! node "$GENERATOR" --check; then
            echo "::error::trigger index drift found; the trigger-index-rebuild workflow repairs drift on the integration branches after merge, or regenerate locally with node $GENERATOR"
            exit 1
          fi
```

Leave `continue-on-error: true` at `:27`, `:41` and `:55` untouched, and add no path filter.

Check:

```bash
grep -cE '\|\| (true|echo)' .github/workflows/advisory-checks.yml
grep -c 'continue-on-error: true' .github/workflows/advisory-checks.yml
```

Expected: `0`, then `3`.

Rollback: restore the three quoted anchor lines.

Stop and escalate if: any anchor is absent, or either count differs.

---

### T015 Remove the double suppression in strict-pass-freshness-report without losing the report (AC-007)

File: `.github/workflows/strict-pass-freshness-report.yml:172`, anchor:

```yaml
          node .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --roots specs > "$report" 2>&1 || true
```

Change: replace that line with two lines:

```bash
          status=0
          node .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --roots specs > "$report" 2>&1 || status=$?
```

Then insert `          exit "$status"` immediately after the `          rm -f "$report"` line, which is at `:178` before this edit and `:179` after it. Keep `continue-on-error: true` at `:165` and keep `set -euo pipefail`.

Check:

```bash
grep -c 'exit "$status"' .github/workflows/strict-pass-freshness-report.yml
grep -c 'continue-on-error: true' .github/workflows/strict-pass-freshness-report.yml
sed -n '164,183p' .github/workflows/strict-pass-freshness-report.yml
```

Expected: `1`, then `1`, then a block in which `cat "$report"` and `rm -f "$report"` both appear before `exit "$status"`.

Rollback: restore the single quoted line and delete the `exit "$status"` line.

Stop and escalate if: the anchor is absent, or `exit "$status"` lands before `cat "$report"`.

---

### T016 Drop full history from the two workflows whose checkers read none (AC-008)

File: `.github/workflows/rule-canary-sync.yml:14-15`, anchor:

```yaml
        with:
          fetch-depth: 0
```

File: `.github/workflows/repo-rules-corpus.yml:32-33`, the same anchor:

```yaml
        with:
          fetch-depth: 0
```

Change: delete both lines in each file, so each checkout step ends at its `uses:` line.

Check:

```bash
grep -c 'fetch-depth' .github/workflows/rule-canary-sync.yml .github/workflows/repo-rules-corpus.yml
```

Expected: `0` for each file.

Rollback: restore the two quoted lines under the `uses: actions/checkout@...` line in each file.

Stop and escalate if: either anchor is absent, or a count is not 0.

---

### T017 Set deep-loop-runtime to fetch-depth 2 (AC-008)

File: `.github/workflows/deep-loop-runtime.yml:42`, anchor:

```yaml
          fetch-depth: 0
```

Change: replace it with `          fetch-depth: 2`. Change only the value; the comment at `:38-39` still explains why more than one commit is needed.

Check:

```bash
grep -n 'fetch-depth' .github/workflows/deep-loop-runtime.yml
grep -rn 'fetch-depth: 0' .github/workflows/*.yml | wc -l
```

Expected: `42:          fetch-depth: 2`, then `7`.

Rollback: restore `          fetch-depth: 0`.

Stop and escalate if: the anchor is not at `:42`, or the remaining depth-0 count is not 7.

---

### T018 Add the agent-mirror-sync path filter (AC-010)

File: `.github/workflows/agent-mirror-sync.yml:3-4`, anchor:

```yaml
  pull_request:
    branches: [main]
```

Change: insert these twelve lines immediately after the `branches:` line:

```yaml
    paths:
      - '.opencode/agents/**'
      - '.skilled/agents/**'
      - '.claude/agents/**'
      - '.codex/agents/**'
      - '.opencode/bin/check-agent-mirror-sync.cjs'
      - '.skilled/bin/check-agent-mirror-sync.cjs'
      - '.opencode/bin/lib/mirror-sync-verify.cjs'
      - '.skilled/bin/lib/mirror-sync-verify.cjs'
      - '.opencode/skills/system-spec-kit/**'
      - '.skilled/skills/system-spec-kit/**'
      - '.github/workflows/agent-mirror-sync.yml'
```

`.cursor/agents` and `.devin/agents` stay out: `check-agent-mirror-sync.cjs` reads neither, and `mirror-sync-verify.cjs:50-54` names only the OpenCode, Claude and Codex mirrors. Leave `comment-hygiene.yml` unfiltered, because it scans changed code files of any type.

Check:

```bash
grep -c "^      - '" .github/workflows/agent-mirror-sync.yml
grep -c 'agents/\*\*' .github/workflows/agent-mirror-sync.yml
grep -c 'mirror-sync-verify.cjs' .github/workflows/agent-mirror-sync.yml
```

Expected: `11`, then `4`, then `2`.

Rollback: delete the `paths:` line and its 11 entries.

Stop and escalate if: the anchor is not at `:3-4`, or any count differs.

---

### T019 Name the guard and the workflow in both skill-doc-frontmatter filter lists (AC-011)

File: `.github/workflows/skill-doc-frontmatter.yml:23` and `:14`, anchors:

```yaml
      - '.skilled/skills/**/assets/**'
```

and

```yaml
      - '.skilled/skills/**/*.md'
```

Change: insert these three lines after `:23` first, then after `:14`, so the lower insert does not move the upper anchor:

```yaml
      - '.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh'
      - '.opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh'
      - '.github/workflows/skill-doc-frontmatter.yml'
```

Leave the `*.md` entries in the PR list and their absence from the push list as they are: the push job is coverage mode and reads reference and asset docs only (`:41-45`).

Check:

```bash
grep -cE "^      - '\.(opencode|skilled)/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter\.sh'$" .github/workflows/skill-doc-frontmatter.yml
grep -c "'.github/workflows/skill-doc-frontmatter.yml'" .github/workflows/skill-doc-frontmatter.yml
grep -c "^      - '" .github/workflows/skill-doc-frontmatter.yml
```

Expected: `2`, then `2`, then `16`.

Rollback: delete the six added entries, three per list.

Stop and escalate if: either anchor is absent, or any count differs.

---

### T020 Write the pre-commit duplication inventory (AC-012)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/pre-commit-inventory.md` (new file). Anchor: none.

Change: create the file with a header, one sentence stating that nothing in this phase acts on it, and one row per gate key in `.skilled/scripts/git-hooks/pre-commit` (not the 115-line compatibility helper at `.skilled/hooks/git/pre-commit`). Columns: gate key, checker path, installed-hook line, CI counterpart, verdict. The verdict is `keep CI` when a workflow repeats the checker, `drop CI` when the workflow adds nothing, and `local only` when no workflow repeats it.

The twelve keys and their counterparts:

| Gate key | CI counterpart |
|----------|----------------|
| `comment-hygiene` | `comment-hygiene.yml:32` |
| `agent-mirror-sync` | `agent-mirror-sync.yml:28` |
| `prompt-card-sync` | `prompt-card-sync.yml:15` |
| `doc-version-bump` | `skill-doc-frontmatter.yml:78` |
| `mirror-parity` | `spec-kit-check.yml:172` |
| `skill-authoring` | `routing-registry-drift.yml:191` |
| `route-remint` | `routing-registry-drift.yml:172` and `:181` |
| `spec-remint` | `strict-pass-freshness-report.yml:172` |
| `template-phrase-lint` | none |
| `mcp-mutation-class` | none |
| `hook-flags` | none, by design |
| `hook-trust` | none, by design |

Check:

```bash
grep -cE '^\| (agent-mirror-sync|comment-hygiene|doc-version-bump|hook-flags|hook-trust|mcp-mutation-class|mirror-parity|prompt-card-sync|route-remint|skill-authoring|spec-remint|template-phrase-lint)' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/pre-commit-inventory.md
```

Expected: `12`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/pre-commit-inventory.md`.

Stop and escalate if: the hook names a gate key outside the twelve, or the count is not 12.

---

### T021 Make the README push/PR table match the YAML (AC-015)

File: `.github/workflows/README.md:66`, anchor:

```markdown
| `advisory-checks.yml`, `command-tree-parity.yml`, `dispatch-enforcement-guard.yml`, `playbook-operator-contract.yml`, `rule-canary-sync.yml`, `sk-doc-script-tests.yml` | yes | yes | Guards over the whole tree |
```

File: `.github/workflows/README.md:69`, anchor:

```markdown
| `chart-corpus.yml`, `deep-loop-runtime.yml`, `diagram-corpus.yml`, `hooks-node-tests.yml`, `markdown-link-integrity.yml`, `opencode-dual-version.yml`, `opencode-plugin-tests.yml`, `pi-extension-tests.yml`, `repo-rules-corpus.yml`, `routing-registry-drift.yml`, `runtime-no-spec-import.yml`, `sk-code-script-tests.yml`, `sk-doc-rename-harness.yml`, `sk-git-script-tests.yml`, `skill-advisor-stress.yml`, `skill-doc-frontmatter.yml`, `spec-kit-check.yml` | yes, path-filtered | yes, path-filtered | Run only when their inputs change |
```

File: `.github/workflows/README.md:71`, anchor:

```markdown
| `agent-mirror-sync.yml`, `comment-hygiene.yml`, `prompt-card-sync.yml` | no | yes | Review-time checks. The pre-commit hook runs the same checkers on every commit |
```

Change, under `D3=approve`: remove `` `command-tree-parity.yml`, `` from line 66 and insert `` `command-tree-parity.yml`, `` after `` `chart-corpus.yml`, `` on line 69. Under `D3=reject`: leave lines 66 and 69 unchanged.

Change in both cases: line 71's Why cell becomes `Review-time checks. agent-mirror-sync.yml runs only when an agent file changes; the pre-commit hook runs the same checkers on every commit`.

Leave `changed-packet-validation.yml`'s row at `:70` untouched.

Check, under `D3=approve`:

```bash
sed -n '66p' .github/workflows/README.md | grep -c 'command-tree-parity'
sed -n '69p' .github/workflows/README.md | grep -c 'command-tree-parity'
sed -n '71p' .github/workflows/README.md | grep -c 'only when an agent file changes'
```

Expected: `0`, then `1`, then `1`.

Check, under `D3=reject`:

```bash
sed -n '66p' .github/workflows/README.md | grep -c 'command-tree-parity'
sed -n '71p' .github/workflows/README.md | grep -c 'only when an agent file changes'
```

Expected: `1`, then `1`.

Rollback: restore the three quoted rows.

Stop and escalate if: a row is not at its quoted line, or a count differs.

---

### T022 Add the concurrency block to the 21 workflows this phase edits nowhere else (AC-001)

File: `.github/workflows/` - 21 files, each anchored on its `jobs:` line at column 0:

| File | `jobs:` line |
|------|--------------|
| `chart-corpus.yml` | 25 |
| `comment-hygiene.yml` | 6 |
| `diagram-corpus.yml` | 25 |
| `gate-inputs.yml` | 11 |
| `hooks-node-tests.yml` | 42 |
| `markdown-link-integrity.yml` | 31 |
| `message-contract.yml` | 16 |
| `naming-standard-guard.yml` | 12 |
| `opencode-dual-version.yml` | 70 |
| `opencode-plugin-tests.yml` | 50 |
| `pi-extension-tests.yml` | 23 |
| `playbook-operator-contract.yml` | 13 |
| `prompt-card-sync.yml` | 6 |
| `routing-registry-drift.yml` | 121 |
| `runtime-no-spec-import.yml` | 22 |
| `sk-code-script-tests.yml` | 24 |
| `sk-doc-rename-harness.yml` | 27 |
| `sk-doc-script-tests.yml` | 17 |
| `sk-git-script-tests.yml` | 32 |
| `skill-advisor-stress.yml` | 39 |
| `spec-kit-check.yml` | 64 |

Change: in each file, replace the single line `jobs:` with these five lines, so the existing blank line above stays as the separator:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

jobs:
```

Under `D2=true`, the third line becomes `  cancel-in-progress: true`.

Check:

```bash
for f in chart-corpus comment-hygiene diagram-corpus gate-inputs hooks-node-tests markdown-link-integrity message-contract naming-standard-guard opencode-dual-version opencode-plugin-tests pi-extension-tests playbook-operator-contract prompt-card-sync routing-registry-drift runtime-no-spec-import sk-code-script-tests sk-doc-rename-harness sk-doc-script-tests sk-git-script-tests skill-advisor-stress spec-kit-check; do
  printf '%s %s\n' "$f" "$(grep -c '^concurrency:' ".github/workflows/$f.yml")"
done
```

Expected: 21 lines, each ending in ` 1`.

Rollback: in each file, delete the three `concurrency:` lines and the blank line between them and `jobs:`.

Stop and escalate if: a `jobs:` line is not at its quoted number in a file this phase has not edited, or a count is not 1.

---

### T023 Add the concurrency block to the 9 workflows this phase also edits (AC-001)

File: `.github/workflows/` - nine files, each anchored on its `jobs:` line at column 0. Four of these files already carry an edit above `jobs:`, so their number is the post-edit value: `agent-mirror-sync.yml` (T018), `changed-packet-validation.yml` (T011, 22 under `D10=filter` and 12 under `D10=skip`), `command-tree-parity.yml` (T008 and T009), and `skill-doc-frontmatter.yml` (T019). Locate the `jobs:` line by text in those four files and treat the number as confirmation:

| File | `jobs:` line |
|------|--------------|
| `advisory-checks.yml` | 16 |
| `agent-mirror-sync.yml` | 18 |
| `changed-packet-validation.yml` | 22 under `D10=filter`, 12 under `D10=skip` |
| `command-tree-parity.yml` | 61 |
| `deep-loop-runtime.yml` | 32 |
| `dispatch-enforcement-guard.yml` | 13 |
| `repo-rules-corpus.yml` | 26 |
| `rule-canary-sync.yml` | 8 |
| `skill-doc-frontmatter.yml` | 31 |

Change: the same five-line replacement T022 uses, in each of the nine.

Check:

```bash
grep -L '^concurrency:' .github/workflows/*.yml
```

Expected: exactly two paths, `.github/workflows/dependabot-auto-merge.yml` and `.github/workflows/strict-pass-freshness-report.yml`.

Rollback: delete the three `concurrency:` lines and the blank line in each of the nine files.

Stop and escalate if: the command lists any file beyond those two.

---

### T024 Prove the concurrency count, the rebuild group and the YAML (AC-001, AC-014)

File: `.github/workflows/` (read-only). Anchor: none.

Change: none. This task proves T022 and T023.

Check:

```bash
grep -lF "cancel-in-progress: \${{ github.event_name == 'pull_request' }}" .github/workflows/*.yml | wc -l
python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"
sed -n '21,23p' .github/workflows/trigger-index-rebuild.yml
```

Expected: `30`; then exit `0` with no output; then the rebuild workflow's own group, with `cancel-in-progress: false`.

Under `D2=true`, the first command counts files carrying `cancel-in-progress: true` and still returns `30`.

Rollback: none; the task changes no file.

Stop and escalate if: the count is not 30, the parse exits non-zero, or the rebuild workflow's group moved.

---

### T025 Run the whole-tree gates (AC-013, AC-014)

File: `.github/scripts/check-gate-inputs.sh` and `.github/workflows/` (read-only). Anchor: none.

Change: none. This task proves the whole change set.

Check:

```bash
bash .github/scripts/tests/check-gate-inputs.test.sh
bash .github/scripts/check-gate-inputs.sh
python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"
ls .github/workflows/*.yml | wc -l
```

Expected: the fixture suite exits `0`; the real-tree gate prints `RESULT: PASSED` with `failures=0` and `twin_pairs` at least `311`, the observed pre-change value; the parse exits `0` with no output; the file count is `33`.

Rollback: none; the task changes no file.

Stop and escalate if: `RESULT: PASSED` is absent, or the gate fails twice on the same entry.

---

### T026 Commit the change as one commit per concern (AC-017)

File: `.github/workflows/`, `.github/workflows/README.md`, `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/pre-commit-inventory.md`. Anchor (read): `.skilled/skills/sk-git/scripts/validate-message.mjs:1`, the line `#!/usr/bin/env node`.

Change: six commits, one per concern, with these full messages, in this order. Each block writes its message to a file, validates it, stages that concern's paths and commits with `git commit -F`.

Commit 1, the concurrency block on the 21 workflows this phase edits nowhere else:

```bash
cat > /tmp/commit-msg-1.txt <<'EOF'
ci(workflows): cancel superseded pull-request runs

The 21 workflows that carry no other change now carry a concurrency group keyed to
their workflow and pull request, so a newer push cancels the older run instead of
leaving two full runs racing.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-1.txt
for f in chart-corpus comment-hygiene diagram-corpus gate-inputs hooks-node-tests markdown-link-integrity message-contract naming-standard-guard opencode-dual-version opencode-plugin-tests pi-extension-tests playbook-operator-contract prompt-card-sync routing-registry-drift runtime-no-spec-import sk-code-script-tests sk-doc-rename-harness sk-doc-script-tests sk-git-script-tests skill-advisor-stress spec-kit-check; do git add ".github/workflows/$f.yml"; done
git commit -F /tmp/commit-msg-1.txt
```

Commit 2, the four path filters:

```bash
cat > /tmp/commit-msg-2.txt <<'EOF'
ci(command-tree-parity): run only on the inputs the checkers read

The parity filter and the companion filters on agent-mirror-sync and
skill-doc-frontmatter name every source each checker reads, and
changed-packet-validation joins them when its filter is enabled, so a
documentation-only push no longer starts a whole-tree comparison.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-2.txt
git add .github/workflows/command-tree-parity.yml .github/workflows/changed-packet-validation.yml .github/workflows/agent-mirror-sync.yml .github/workflows/skill-doc-frontmatter.yml
git commit -F /tmp/commit-msg-2.txt
```

Commit 3, the deleted duplicate step:

```bash
cat > /tmp/commit-msg-3.txt <<'EOF'
ci(dispatch-enforcement-guard): drop the duplicate dispatch audit run

The explicit dispatch-audit step repeated the whole-tree vitest run in the same
job, so the step is deleted and the vitest include remains the one execution.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-3.txt
git add .github/workflows/dispatch-enforcement-guard.yml
git commit -F /tmp/commit-msg-3.txt
```

Commit 4, the removed suppression layer:

```bash
cat > /tmp/commit-msg-4.txt <<'EOF'
ci(reports): stop suppressing a failing report step

Each report-only workflow keeps continue-on-error, but the command's second
suppression is gone, so a failing check reports failure on the step while the job
stays green.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-4.txt
git add .github/workflows/advisory-checks.yml .github/workflows/strict-pass-freshness-report.yml
git commit -F /tmp/commit-msg-4.txt
```

Commit 5, the three checkout depths:

```bash
cat > /tmp/commit-msg-5.txt <<'EOF'
ci(workflows): check out the history each job reads

The two checkers that read no history now use the default depth, and
deep-loop-runtime fetches the commit and its parent instead of the whole tree.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-5.txt
git add .github/workflows/rule-canary-sync.yml .github/workflows/repo-rules-corpus.yml .github/workflows/deep-loop-runtime.yml
git commit -F /tmp/commit-msg-5.txt
```

Commit 6, the README table and the inventory:

```bash
cat > /tmp/commit-msg-6.txt <<'EOF'
docs(workflows): record trigger filters and pre-commit overlap

The README table matches the new filters, and the inventory records every
pre-commit gate against the workflow that repeats it.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-6.txt
git add .github/workflows/README.md specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/pre-commit-inventory.md
git commit -F /tmp/commit-msg-6.txt
```

Check, after all six commits:

```bash
git log -6 --format=%s
git diff HEAD~6...HEAD | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]'
```

Expected: `validate-message.mjs` exits `0` for each of the six messages; the six subjects above, newest first; then no output from the id grep.

Rollback: `git reset --soft HEAD~6` restores the staged tree without losing a file.

Stop and escalate if: a message fails validation twice, the id grep prints a line, or a commit stages a path outside its concern.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Every probe commit carries a full message the repository's own contract accepts, because `message-contract.yml` runs on every pushed branch. Each task writes the message to a file, validates it, and commits with `git commit -F`:

```bash
cat > /tmp/probe-commit-msg.txt <<'EOF'
test(ci): probe <what>

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-commit-msg.txt
git commit -F /tmp/probe-commit-msg.txt
```

For a commit that changes no file, use `git commit --allow-empty -F /tmp/probe-commit-msg.txt`; for a commit that changes files, stage them with `git add` first. The installed `prepare-commit-msg` hook stamps the `Commit-Id` trailer. Each probe also needs the operator's yes before its first push, because it opens a pull request or starts runs on the remote.

### T027 Probe the concurrency group (AC-002)

File: `.github/workflows/message-contract.yml` (read-only during the probe). Anchor: none.

Change: none. This task observes the block T022 and T023 added. Before the first push, get the operator's yes: the probe opens a pull request.

Check:

```bash
git switch -c probe/concurrency
cat > /tmp/probe-msg-concurrency.txt <<'EOF'
test(ci): probe the concurrency group

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-concurrency.txt
git commit --allow-empty -F /tmp/probe-msg-concurrency.txt
git push -u origin probe/concurrency
printf '## Summary\n- Probe the concurrency group by pushing twice to one pull request.\n\n## Test Plan\n- [x] Observe the older run cancelled and the newest run reporting.\n' > /tmp/probe-pr-body.md
gh pr create --title "test(ci): probe the concurrency group" --body-file /tmp/probe-pr-body.md --head probe/concurrency
sleep 20
cat > /tmp/probe-msg-concurrency-again.txt <<'EOF'
test(ci): probe the concurrency group again

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-concurrency-again.txt
git commit --allow-empty -F /tmp/probe-msg-concurrency-again.txt
git push
sleep 60
gh run list --workflow message-contract.yml --branch probe/concurrency --json databaseId,headSha,event,status,conclusion --limit 10
gh pr checks probe/concurrency --json name,state
```

Expected: `validate-message.mjs` exits `0` for both messages; among the `pull_request` entries, the older run's `conclusion` is `cancelled` and the newest is `success`, and `Commit messages, branch names and PR description follow the templates` reports `SUCCESS` on the newest head. The order matters: the pull request is opened before the second push, because `cancel-in-progress` is false for `push` and a branch pushed twice before the pull request exists has no pull-request run to cancel.

Rollback: `gh pr close probe/concurrency --delete-branch` and `git switch -`.

Stop and escalate if: `gh` exits non-zero with a scope error, or the older run is not `cancelled` after two pushes.

---

### T028 Probe the command-tree-parity filter both ways (AC-003)

File: `.github/workflows/command-tree-parity.yml` (read-only during the probe). Anchor: none.

Change: none. Under `D3=reject` this task does not run; record `not built` in `scratch/phase-result.md` instead.

Check, positive case:

```bash
git switch -c probe/parity-positive
printf '\n<!-- probe -->\n' >> .skilled/skills/system-spec-kit/SKILL.md
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs
git add .skilled/skills/system-spec-kit/SKILL.md .hermes/skills/system-spec-kit/SKILL.md
cat > /tmp/probe-msg-parity-positive.txt <<'EOF'
test(ci): probe the parity filter on a nested SKILL.md

The probe regenerates the Hermes copy so the mirror job reads a fresh input.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-parity-positive.txt
git commit -F /tmp/probe-msg-parity-positive.txt
git push -u origin probe/parity-positive
gh run list --workflow command-tree-parity.yml --commit "$(git rev-parse HEAD)" --json databaseId,conclusion
```

Expected: `validate-message.mjs` exits `0`; one run, and both jobs conclude `success`.

Check, negative case:

```bash
git switch main
git switch -c probe/parity-negative
printf '\n' >> specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/spec.md
git add specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/spec.md
cat > /tmp/probe-msg-parity-negative.txt <<'EOF'
test(ci): probe the parity filter on a specs-only change

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-parity-negative.txt
git commit -F /tmp/probe-msg-parity-negative.txt
git push -u origin probe/parity-negative
gh run list --workflow command-tree-parity.yml --commit "$(git rev-parse HEAD)" --json databaseId
```

Expected: `validate-message.mjs` exits `0`; then `[]`.

Rollback: `git switch main`, then `git branch -D probe/parity-positive probe/parity-negative` and `git push origin --delete probe/parity-positive probe/parity-negative`.

Stop and escalate if: the positive case produces no run, or the negative case produces one.

---

### T029 Probe the D10 answer (AC-004)

File: `.github/workflows/changed-packet-validation.yml` (read-only during the probe). Anchor: none.

Change: none. This task observes whichever branch T011 took.

Check:

```bash
git switch -c probe/d10
printf '\n' >> .github/scripts/check-gate-inputs.sh
git add .github/scripts/check-gate-inputs.sh
cat > /tmp/probe-msg-d10.txt <<'EOF'
test(ci): probe the changed-packet filter

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-d10.txt
git commit -F /tmp/probe-msg-d10.txt
git push -u origin probe/d10
gh run list --workflow changed-packet-validation.yml --commit "$(git rev-parse HEAD)" --json databaseId
```

Expected, under `D10=skip`: `validate-message.mjs` exits `0`; one run, which is the pre-phase behaviour. Under `D10=filter`: `validate-message.mjs` exits `0`; `[]`.

Rollback: `git switch main`, then `git branch -D probe/d10` and `git push origin --delete probe/d10`.

Stop and escalate if: `gh` returns a scope error, or the observed state matches neither branch.

---

### T030 Probe the dispatch guard (AC-005, AC-006)

File: `.github/workflows/dispatch-enforcement-guard.yml` (read-only during the probe). Anchor: none.

Change: none. This task observes the step T012 deleted and the guard it left.

Check, the suite list:

```bash
gh run list --workflow dispatch-enforcement-guard.yml --commit <change-sha> --json databaseId,conclusion
gh run view <run-id> --log | grep -oE '\.skilled/hooks/[a-z0-9/-]+\.(test|spec)\.(ts|mjs)' | sort -u
```

Expected: the run concludes `success`, and the list holds the seven paths T013 named.

Check, the fail-closed guard:

```bash
git switch -c probe/guard-deleted
git rm .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
cat > /tmp/probe-msg-guard-deleted.txt <<'EOF'
test(ci): probe the deleted dispatch rule suite

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-guard-deleted.txt
git commit -F /tmp/probe-msg-guard-deleted.txt
git push -u origin probe/guard-deleted
gh run list --workflow dispatch-enforcement-guard.yml --commit "$(git rev-parse HEAD)" --json databaseId,conclusion
```

Expected: `validate-message.mjs` exits `0`; the run concludes `failure`, and its log holds `::error::Dispatch rule suite not found`.

Rollback: `git switch main`, then `git branch -D probe/guard-deleted` and `git push origin --delete probe/guard-deleted`.

Stop and escalate if: the deleted-suite run concludes `success`.

---

### T031 Probe the report-only steps (AC-007)

File: `.github/workflows/advisory-checks.yml` and `.github/workflows/strict-pass-freshness-report.yml` (read-only during the probe). Anchor: none.

Change: none. This task observes the suppression T014 and T015 removed.

Check:

```bash
git switch main
git switch -c probe/report
printf '\nThe default model is BAAI/bge-base-en-v1.5.\n' >> .skilled/skills/sk-doc/SKILL.md
git add .skilled/skills/sk-doc/SKILL.md
cat > /tmp/probe-msg-report.txt <<'EOF'
test(ci): probe a failing report step

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-report.txt
git commit -F /tmp/probe-msg-report.txt
git push -u origin probe/report
gh run list --workflow advisory-checks.yml --commit "$(git rev-parse HEAD)" --json databaseId
gh api repos/:owner/:repo/actions/jobs/<job-id> --jq '{job: .conclusion, steps: [.steps[] | select(.name | test("Doc-model")) | .conclusion]}'
```

Expected: `validate-message.mjs` exits `0`; `{"job":"success","steps":["failure"]}`. The appended line cites a legacy model name beside the word `default`, which is what `validate-doc-model-refs.js` reports as drift; the validator exits non-zero and the step, no longer suppressed, reports `failure`.

Then dispatch `strict-pass-freshness-report.yml` by hand, read its `Derived-repair drift report` step the same way, and confirm the report text is still in the log.

Rollback: `git switch main`, then `git branch -D probe/report` and `git push origin --delete probe/report`.

Stop and escalate if: the job concludes `failure`, or the step concludes `success`.

---

### T032 Probe the checkout depth (AC-009)

File: `.github/workflows/rule-canary-sync.yml`, `.github/workflows/repo-rules-corpus.yml` and `.github/workflows/deep-loop-runtime.yml` (read-only during the probe). Anchor: none.

Change: none. This task observes T016 and T017.

The three workflows do not share a filter, so the probe uses two changes. `rule-canary-sync.yml` and `repo-rules-corpus.yml` both answer a repo-rules change; `deep-loop-runtime.yml` answers a deep-loop or spec-kit change and nothing else.

Check, `rule-canary-sync` and `repo-rules-corpus`:

```bash
git switch main
git switch -c probe/depth-rules
printf '\n' >> .skilled/repo-rules/communication.md
git add .skilled/repo-rules/communication.md
cat > /tmp/probe-msg-depth-rules.txt <<'EOF'
test(ci): probe the checkout depth

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-depth-rules.txt
git commit -F /tmp/probe-msg-depth-rules.txt
git push -u origin probe/depth-rules
gh run list --workflow rule-canary-sync.yml --commit "$(git rev-parse HEAD)" --json databaseId,conclusion
gh run list --workflow repo-rules-corpus.yml --commit "$(git rev-parse HEAD)" --json databaseId,conclusion
gh api repos/:owner/:repo/actions/jobs/<job-id> --jq '{started_at, completed_at, checkout: [.steps[] | select(.name | startswith("Run actions/checkout")) | {started_at, completed_at}]}'
```

Expected: `validate-message.mjs` exits `0`; both runs conclude `success`, and each checkout step is about 20 s shorter than the same step in its `scratch/phase-baseline.md` sample.

Check, `deep-loop-runtime`:

```bash
git switch main
git switch -c probe/depth-deep-loop
printf '\n' >> .skilled/skills/system-deep-loop/ARCHITECTURE.md
git add .skilled/skills/system-deep-loop/ARCHITECTURE.md
cat > /tmp/probe-msg-depth-deep-loop.txt <<'EOF'
test(ci): probe the deep-loop checkout depth

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-depth-deep-loop.txt
git commit -F /tmp/probe-msg-depth-deep-loop.txt
git push -u origin probe/depth-deep-loop
gh run list --workflow deep-loop-runtime.yml --commit "$(git rev-parse HEAD)" --json databaseId,conclusion
gh api repos/:owner/:repo/actions/jobs/<job-id> --jq '{started_at, completed_at, checkout: [.steps[] | select(.name | startswith("Run actions/checkout")) | {started_at, completed_at}]}'
```

Expected: `validate-message.mjs` exits `0`; the run concludes `success` and its checkout step is about 20 s shorter than its baseline sample.

Overall expected: `rule-canary-sync`'s job is under 60 s, so it bills one minute instead of two.

Rollback: `git switch main`, then delete both branches locally and on the remote:

```bash
for b in probe/depth-rules probe/depth-deep-loop; do
  git branch -D "$b"
  git push origin --delete "$b"
done
```

Stop and escalate if: a run concludes `failure`, or a checkout step does not shorten.

---

### T033 Probe the agent-mirror-sync filter three ways (AC-010)

File: `.github/workflows/agent-mirror-sync.yml` (read-only during the probe). Anchor: none.

Change: none. This task observes T018. The workflow runs on `pull_request` only, so each case opens its own pull request: a push to a bare branch starts nothing and would prove nothing.

Check, positive case, agent file:

```bash
git switch main
git switch -c probe/agent-file
printf '\n' >> .skilled/agents/code.md
git add .skilled/agents/code.md
cat > /tmp/probe-msg-agent-file.txt <<'EOF'
test(ci): probe the agent mirror filter

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-agent-file.txt
git commit -F /tmp/probe-msg-agent-file.txt
git push -u origin probe/agent-file
printf '## Summary\n- Probe the agent mirror filter with an agent-file change.\n\n## Test Plan\n- [x] Expect one run.\n' > /tmp/probe-agent-file.md
gh pr create --title "test(ci): probe the agent mirror filter" --body-file /tmp/probe-agent-file.md --head probe/agent-file
sleep 30
gh run list --workflow agent-mirror-sync.yml --commit "$(git rev-parse HEAD)" --json databaseId,event
```

Expected: `validate-message.mjs` exits `0`; one `pull_request` run.

Check, positive case, verifier only:

```bash
git switch main
git switch -c probe/agent-lib
printf '\n' >> .skilled/bin/lib/mirror-sync-verify.cjs
git add .skilled/bin/lib/mirror-sync-verify.cjs
cat > /tmp/probe-msg-agent-lib.txt <<'EOF'
test(ci): probe the agent verifier filter

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-agent-lib.txt
git commit -F /tmp/probe-msg-agent-lib.txt
git push -u origin probe/agent-lib
printf '## Summary\n- Probe the agent mirror filter with a verifier-only change.\n\n## Test Plan\n- [x] Expect one run.\n' > /tmp/probe-agent-lib.md
gh pr create --title "test(ci): probe the agent verifier filter" --body-file /tmp/probe-agent-lib.md --head probe/agent-lib
sleep 30
gh run list --workflow agent-mirror-sync.yml --commit "$(git rev-parse HEAD)" --json databaseId,event
```

Expected: `validate-message.mjs` exits `0`; one `pull_request` run.

Check, negative case:

```bash
git switch main
git switch -c probe/agent-negative
printf '\n' >> specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/plan.md
git add specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/plan.md
cat > /tmp/probe-msg-agent-negative.txt <<'EOF'
test(ci): probe the agent filter on a specs-only change

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-agent-negative.txt
git commit -F /tmp/probe-msg-agent-negative.txt
git push -u origin probe/agent-negative
printf '## Summary\n- Probe the agent mirror filter with a specs-only change.\n\n## Test Plan\n- [x] Expect no run.\n' > /tmp/probe-agent-negative.md
gh pr create --title "test(ci): probe the agent filter on a specs-only change" --body-file /tmp/probe-agent-negative.md --head probe/agent-negative
sleep 30
gh run list --workflow agent-mirror-sync.yml --commit "$(git rev-parse HEAD)" --json databaseId,event
```

Expected: `validate-message.mjs` exits `0`; then `[]`.

Rollback:

```bash
for b in probe/agent-file probe/agent-lib probe/agent-negative; do
  gh pr close "$b" --delete-branch
  git branch -D "$b"
  git push origin --delete "$b"
done
```

Stop and escalate if: either positive case produces no run, or the negative case produces one.

---

### T034 Probe the skill-doc-frontmatter filter (AC-011)

File: `.github/workflows/skill-doc-frontmatter.yml` (read-only during the probe). Anchor: none.

Change: none. This task observes T019. The push list does not name the guard, so only a pull request proves the new entry; a push would start nothing.

Check:

```bash
git switch main
git switch -c probe/frontmatter-guard
printf '\n' >> .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh
git add .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh
cat > /tmp/probe-msg-frontmatter.txt <<'EOF'
test(ci): probe the frontmatter guard filter

One commit that exists only to observe CI behaviour.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-msg-frontmatter.txt
git commit -F /tmp/probe-msg-frontmatter.txt
git push -u origin probe/frontmatter-guard
printf '## Summary\n- Probe the frontmatter filter with a guard-only change.\n\n## Test Plan\n- [x] Expect one run.\n' > /tmp/probe-frontmatter.md
gh pr create --title "test(ci): probe the frontmatter guard filter" --body-file /tmp/probe-frontmatter.md --head probe/frontmatter-guard
sleep 30
gh run list --workflow skill-doc-frontmatter.yml --commit "$(git rev-parse HEAD)" --json databaseId,event
```

Expected: `validate-message.mjs` exits `0`; one `pull_request` run, and its `Skill reference/asset frontmatter contract` job runs the guard.

Rollback:

```bash
gh pr close probe/frontmatter-guard --delete-branch
git branch -D probe/frontmatter-guard
git push origin --delete probe/frontmatter-guard
```

Stop and escalate if: no run starts.

---

### T035 Review the inventory against the hook (AC-012)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/pre-commit-inventory.md` (read-only). Anchor: none.

Change: none. This task checks T020 against its source.

Check:

```bash
grep -oE 'gate:[a-z-]+' .skilled/scripts/git-hooks/pre-commit | sort -u | wc -l
grep -cE '^\| (agent-mirror-sync|comment-hygiene|doc-version-bump|hook-flags|hook-trust|mcp-mutation-class|mirror-parity|prompt-card-sync|route-remint|skill-authoring|spec-remint|template-phrase-lint)' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/pre-commit-inventory.md
grep -cE '^\| .* \| (keep CI|drop CI|local only) \|$' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/pre-commit-inventory.md
```

Expected: `12`, then `12`, then `12`.

Rollback: none; the task changes no file.

Stop and escalate if: the first count differs from the second, or a row carries no verdict.

---

### T036 Measure the phase delta (AC-016)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/phase-result.md` (new file). Anchor: none.

Change: at least 24 h after the last change merges, collect the run history and one job sample per workflow this phase touched, then write the file with the ten rows from `scratch/phase-baseline.md`, the after numbers, and the delta.

Check:

```bash
gh run list --limit 1000 --json databaseId,name,headSha,event,conclusion,createdAt,startedAt,updatedAt \
  > specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/runs-after.json
grep -cE '^\| `?(advisory-checks|agent-mirror-sync|changed-packet-validation|command-tree-parity|dispatch-enforcement-guard|deep-loop-runtime|repo-rules-corpus|rule-canary-sync|skill-doc-frontmatter|strict-pass-freshness-report)' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/phase-result.md
grep -c 'unmeasured' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/phase-result.md
```

Expected: `10`, then at least `1`.

The delta column carries `command-tree-parity` at about -123 runner-min/day after R1, `rule-canary-sync` at about -39, and `dispatch-enforcement-guard` at its re-measured figure. The PR-side cancellation is recorded as `unmeasured`, never as zero.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/runs-after.json specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/scratch/phase-result.md`.

Stop and escalate if: fewer than 24 h have passed, or fewer than ten rows are recorded.

---

### T037 Close the acceptance rows with evidence (AC-001 to AC-017)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/acceptance-criteria.md`. Anchor: the `| Unmet | - |` status cell of each row.

Change: replace each row's `Unmet` with `Met` and its Verification cell with the evidence T007 to T036 produced: the command, its output and the SHA or run id.

Check:

```bash
grep -c '| Unmet |' specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/acceptance-criteria.md
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene --strict --no-recursive
```

Expected: `0`, then `RESULT: PASSED`.

Rollback: restore the `Unmet` status of any row whose evidence is missing. A row is never marked `Met` on a plan.

Stop and escalate if: any row has no observed evidence, or the validator does not print `RESULT: PASSED`.

---

### T038 Commit the closure evidence (AC-017)

File: `specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/acceptance-criteria.md`. Anchor: `| AC-017 | R3-R11 | REQ-013 |` at `:80`, the row whose Verification cell names the id-hygiene check.

Change: stage the T037 acceptance edit and commit it with this message. No other path is staged.

Check:

```bash
cat > /tmp/commit-msg-7.txt <<'EOF'
docs(spec): record the phase 3 acceptance evidence

Every acceptance row now carries the command, output and SHA or run id that
proves it, and the closure state is committed separately from the change set.

Spec: system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-7.txt
git add specs/system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene/acceptance-criteria.md
git commit -F /tmp/commit-msg-7.txt
git status --porcelain
git log -1 --format=%s
```

Expected: `validate-message.mjs` exits `0`; the commit succeeds; `git status --porcelain` prints nothing; `git log -1 --format=%s` prints `docs(spec): record the phase 3 acceptance evidence`.

Rollback: `git reset --soft HEAD~1` restores the staged acceptance edit without losing evidence.

Stop and escalate if: validation fails twice, the message is rejected, or `git status --porcelain` prints a path after the commit.
<!-- /ANCHOR:phase-3 -->

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
- **Recommendations**: See `../001-research/research/synthesis-reviews/final-review.md` (`:223-325` for R3 to R11, `:552-560` for the phase plan)
- **Baseline to beat**: See `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`
- **Original research**: See `../001-research/research/research.md` (`:88-117` for triggers, concurrency and timeouts)

| R-id | Requirements | Tasks | Acceptance criteria |
|------|--------------|-------|---------------------|
| R3 | REQ-001 | T001, T022, T023, T024, T027 | AC-001, AC-002 |
| R4 | REQ-002 | T002, T007, T008, T009, T010, T021, T028 | AC-003 |
| R5 | REQ-003 | T005, T011, T029 | AC-004 |
| R6 | REQ-004 | T003, T012, T013, T030 | AC-005, AC-006 |
| R7 | REQ-005 | T014, T015, T031 | AC-007 |
| R8 | REQ-006 | T004, T016, T017, T032 | AC-008, AC-009 |
| R9 | REQ-007 | T018, T033 | AC-010 |
| R10 | REQ-008 | T019, T034 | AC-011 |
| R11 | REQ-009 | T020, T035 | AC-012 |
| Gates | REQ-010, REQ-011 | T010, T019, T021, T024, T025 | AC-013, AC-014, AC-015 |
| Baseline | REQ-012 | T006, T036 | AC-016 |
| Id hygiene | REQ-013 | T026, T037, T038 | AC-017 |
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

- [ ] CHK-001 [P0] Requirements documented in spec.md - planned as REQ-001 to REQ-013, each naming its R-id or a gate
- [ ] CHK-002 [P0] Technical approach defined in plan.md - the concurrency shape, the filter derivation from the four checkers, the deleted step, the status-capture form and the two depth values
- [ ] CHK-003 [P1] Dependencies identified and available - the 002 baseline (T006), D2, D3, D4, D7 and D10 (T001 to T005), and `gh` with `repo` and `actions`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks - the gates this change touches are `bash .github/scripts/check-gate-inputs.sh` and the YAML parse (T025); both must pass
- [ ] CHK-011 [P0] No console errors or warnings - the gate prints `failures=0`, the parse prints nothing, and the vitest tree exits 0 (T013, T025)
- [ ] CHK-012 [P1] Error handling implemented - the three suppressed commands now fail their step explicitly, and the repair report keeps its status instead of discarding it (T014, T015)
- [ ] CHK-013 [P1] Code follows project patterns - every new comment explains why, the concurrency block matches the one existing group's shape at `trigger-index-rebuild.yml:21-23`, and no comment carries a packet id (T026)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met - `acceptance-criteria.md` rows AC-001 to AC-017
- [ ] CHK-021 [P0] Manual testing complete - the trigger probes (T027 to T034) and the job-shape probes (T030, T031) are recorded in `scratch/phase-result.md`
- [ ] CHK-022 [P1] Edge cases tested - a specs-only pull request for each newly filtered workflow, a third push while one run is pending, and a `workflow_dispatch` run
- [ ] CHK-023 [P1] Error scenarios validated - the deleted-suite branch still fails its job (T030), and a broken doc-model reference shows a failed step under a green job (T031)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class - `class-of-bug` for the 30 missing concurrency groups, `instance-only` for the duplicate step and the three depths, `matrix/evidence` for the two filters and the inventory
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed - `rg -n '^concurrency:' .github/workflows` and `rg -n 'fetch-depth: 0' .github/workflows` in plan.md, Affected Surfaces
- [ ] CHK-FIX-003 [P0] Consumer inventory completed - `dispatch-audit.test.mjs` (the explicit step and the vitest include), the seven suite paths, `check-gate-inputs.sh`'s twin rule and the README rows, each with its verification in plan.md
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests - the filter matrix in plan.md covers a filter entry under the wrong event, a `.skilled/` entry with no twin, a per-run group key and a checker whose path changed without its filter entry
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - event (3) x workflow class (3) with 7 required rows, in plan.md
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - the throwaway branch with a deleted suite and the branch with a broken doc-model reference are the hostile variants (T030, T031)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range - every probe records the head SHA and the run id in `scratch/phase-result.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets - every edit is a trigger, a group name, a path literal or a shell branch; no token, key or PAT value appears in an edited file
- [ ] CHK-031 [P0] Input validation implemented - each `paths:` entry is a repository-relative literal, and the concurrency group interpolates only `github.workflow`, `github.event.pull_request.number` and `github.ref`
- [ ] CHK-032 [P1] Auth/authz working correctly - no `permissions:` block is added, removed or reordered; `trigger-index-rebuild.yml` keeps its own group and its token split
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized - spec.md REQ-001 to REQ-013, tasks.md T001 to T038, acceptance-criteria.md AC-001 to AC-017
- [ ] CHK-041 [P1] Code comments adequate - the rewritten `command-tree-parity.yml` comment names the inputs and the failure it guards, and the suppression branches name the fix
- [ ] CHK-042 [P2] README updated (if applicable) - `.github/workflows/README.md:66,69,71` (T021)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only - the decisions, baseline rows, inventory, after-run JSON and result all live in `scratch/`
- [ ] CHK-051 [P1] scratch/ cleaned before completion - the five documents are kept on purpose: `decisions.md` records the answers, `phase-baseline.md` and `phase-result.md` are the before and after numbers a later phase measures against, `pre-commit-inventory.md` is the phase's own deliverable, and `runs-after.json` is the raw sample behind the delta
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

