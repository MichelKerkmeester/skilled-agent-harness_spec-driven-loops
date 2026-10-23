---
title: "Tasks: Phase 2: rebuild-fanout-removal"
description: "Ordered tasks for the rebuild fan-out removal: the D1 decision and a pre-change capture, the token and its test in one commit, the spec-kit-check trigger, then three rebuild observations and the 24 h baseline."
trigger_phrases:
  - "rebuild fanout removal tasks"
  - "phase 2 rebuild fanout removal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: rebuild-fanout-removal

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

**Task Format**: `T### [P?] Description (file path)`, followed by a `File:` line naming the path and line, a quoted anchor, a `Change:` line, a fenced `Check:` block with its `Expected:` result, a `Rollback:` line and a `Stop and escalate if:` line.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T001 DECISION D1 (operator yes required) - choose how rebuild commits skip CI (AC-001)

File: `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/d1-answer.md` (new file). Anchor: none; the file does not exist yet.

Default: option A, the `[skip ci]` token on the commit body line at `.github/workflows/trigger-index-rebuild.yml:149`. It is one line, needs no filter entries and adds no new YAML pattern.

Alternative: option B, a push-only `paths-ignore:` on the 9 unfiltered workflows plus `!` negations on the 4 path-filtered ones. That is 8 entries each, 104 in total across 13 files, plus an amendment to ordering rule 2, for about 2,002 runner-min/day with `message-contract` left unfiltered.

Change: put the question to the operator, then, after the operator confirms A, write exactly one line to the new file.

Check:

```bash
mkdir -p specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch
printf 'D1=A\n' > specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/d1-answer.md
cat specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/d1-answer.md
```

Expected: `D1=A`.

Rollback: delete `scratch/d1-answer.md`.

Stop and escalate if: the operator answers B, or no answer arrives. This task list implements option A only; B replaces T004 to T007 and T010 to T011 with the ignore edit set and makes T008 and T009 assert the ignore instead of the token.

---

### T002 Capture the pre-change fan-out for three rebuild SHAs (AC-005)

File: `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/pre-change/` (new directory). Anchor: none.

Change: create one `gh run list` JSON per rebuild SHA, so AC-005 has a before number.

Check:

```bash
mkdir -p specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/pre-change
git log --format='%H %s' -40 origin/main | grep 'rebuild the trigger index' | head -3
```

Expected: three lines, each a full SHA followed by `chore(system-spec-kit): rebuild the trigger index`.

Then, for each of the three SHAs, replace `<sha>` and run:

```bash
gh run list --commit <sha> --json databaseId,workflowName,event,conclusion --limit 30 \
  > specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/pre-change/<sha>.json
```

Expected: three files under `scratch/pre-change/`.

```bash
for f in specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/pre-change/*.json; do
  printf '%s ' "$(basename "$f")"
  node -e 'process.stdout.write(String(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).length) + "\n")' "$f"
done
```

Expected: three lines, each ending in `14`.

Rollback: `rm -rf specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/pre-change`.

Stop and escalate if: fewer than three SHAs are listed, or any captured file holds a count other than 14.

---

### T003 Install the spec-kit workspace and record a green baseline (AC-003)

File: `.skilled/skills/system-spec-kit/` (dependencies only; no tracked file changes). Anchor: none.

Change: install the workspace with the command `spec-kit-check.yml:83` runs, then run the workflow suite before any edit.

Check:

```bash
npm --prefix .skilled/skills/system-spec-kit ci
cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/trigger-index-rebuild-workflow.vitest.ts
```

Expected: exit 0, and the final `Tests` line reports every test as passed with no failure count.

Rollback: none; the install writes `node_modules` only.

Stop and escalate if: the install or the suite exits non-zero before any file is edited.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T004 Add the skip token to the rebuild commit body (AC-001)

File: `.github/workflows/trigger-index-rebuild.yml:149`. Anchor:

`            -m "The pushed corpus changed the committed trigger index, so this job rebuilt it." \`

Change: replace that line with:

`            -m "The pushed corpus changed the committed trigger index, so this job rebuilt it. [skip ci]" \`

Check:

```bash
grep -c 'rebuilt it\. \[skip ci\]"' .github/workflows/trigger-index-rebuild.yml
```

Expected: `1`.

```bash
sed -n '148,150p' .github/workflows/trigger-index-rebuild.yml
```

Expected: the subject `-m`, then the body line ending `[skip ci]" \`, then `-m "Trigger-Index-Rebuild: ci"` as the last line.

Rollback: revert the line to the quoted anchor.

Stop and escalate if: the anchor text is not on line 149, or the count is not 1.

---

### T005 Explain the token in the commit step (AC-001)

File: `.github/workflows/trigger-index-rebuild.yml:147`. Anchor:

`          # The guard above matches this trailer to recognize the job's own push.`

Change: insert these two lines directly above the anchor, keeping the anchor where it is:

```
          # The skip token makes GitHub start no push- or pull_request-triggered
          # workflow for this commit, so the rebuild does not re-run the push gate.
```

Check:

```bash
grep -c 'skip token makes GitHub start no' .github/workflows/trigger-index-rebuild.yml
```

Expected: `1`.

Rollback: delete the two inserted lines.

Stop and escalate if: the anchor text is not on line 147, or the count is not 1.

---

### T006 State the skip in the rebuild README row (AC-002)

File: `.github/workflows/README.md:58`. Anchor: the sentence

``The loop guard skips commits whose message ends with the `Trigger-Index-Rebuild: ci` trailer.``

Change: insert this sentence immediately after the anchor sentence, inside the same table cell:

``The commit body carries `[skip ci]`, so the pushed rebuild starts no workflow run and the guard remains only for a manual re-run.``

Check:

```bash
grep -c 'The commit body carries `\[skip ci\]`' .github/workflows/README.md
```

Expected: `1`.

Rollback: delete the inserted sentence.

Stop and escalate if: the anchor sentence is not on line 58, or the count is not 1.

---

### T007 State the skip in the push and pull-request README row (AC-002)

File: `.github/workflows/README.md:75`. Anchor cell text:

`Rebuilds the committed index after a push. Also runs by hand`

Change: replace the cell text with:

``Rebuilds the committed index after a push, and its commit carries `[skip ci]` so no other workflow runs on it. Also runs by hand``

Check:

```bash
grep -c 'no other workflow runs on it' .github/workflows/README.md
```

Expected: `1`.

Rollback: restore the quoted anchor cell text.

Stop and escalate if: the anchor cell is not on line 75, or the count is not 1.

---

### T008 Add the SKIP_TOKEN constant (AC-003)

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts:84`. Anchor:

`const LOOP_GUARD_TRAILER = 'Trigger-Index-Rebuild: ci';`

Change: insert this line directly after the anchor:

```ts
const SKIP_TOKEN = '[skip ci]';
```

Check:

```bash
grep -c "^const SKIP_TOKEN = '\[skip ci\]';$" .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts
```

Expected: `1`.

Rollback: delete the inserted line.

Stop and escalate if: the anchor is not on line 84, or the count is not 1.

---

### T009 Assert the token and the trailer in one case (AC-003)

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts`, after the test that ends at `:892` before T008 lands and `:893` after it. Anchor: the closing block

```ts
      expect(lines[lines.length - 1]).toBe(LOOP_GUARD_TRAILER);
    });
```

Change: insert this case directly after the anchor block, inside the same `describe('when origin does not move', ...)`:

```ts
    it('marks the rebuild commit so the pushed commit starts no workflow run', () => {
      const { origin, env } = clean.fixture;
      const lines = git(origin, ['log', '-1', '--format=%B', 'main'], env).trimEnd().split('\n');

      expect(lines).toContain(
        `The pushed corpus changed the committed trigger index, so this job rebuilt it. ${SKIP_TOKEN}`,
      );
      expect(lines[lines.length - 1]).toBe(LOOP_GUARD_TRAILER);
    });
```

Check:

```bash
grep -c 'marks the rebuild commit so the pushed commit starts no workflow run' .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts
```

Expected: `1`.

```bash
cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/trigger-index-rebuild-workflow.vitest.ts
```

Expected: exit 0, and the output lists `marks the rebuild commit so the pushed commit starts no workflow run` with no failing test.

Rollback: delete the inserted case.

Stop and escalate if: the anchor block is not found once, the count is not 1, or the suite fails twice on the same case.

---

### T010 Name the workflow in the push filter (AC-004)

File: `.github/workflows/spec-kit-check.yml:9`. Anchor: the first occurrence of

`      - '.github/workflows/spec-kit-check.yml'`

which sits in the `push:` block.

Change: insert these three lines directly after the anchor:

```
      # The rebuild workflow's own suite pins the commit message it writes, so a
      # change to that workflow has to run the suite that guards it.
      - '.github/workflows/trigger-index-rebuild.yml'
```

Check:

```bash
grep -c 'trigger-index-rebuild\.yml' .github/workflows/spec-kit-check.yml
```

Expected: `1`.

Rollback: delete the three inserted lines.

Stop and escalate if: the anchor is not the first occurrence in the file, it is not inside the `push:` block, or the count is not 1.

---

### T011 Name the workflow in the pull-request filter (AC-004)

File: `.github/workflows/spec-kit-check.yml:37` before T010 lands, `:40` after it. Anchor: the second occurrence of

`      - '.github/workflows/spec-kit-check.yml'`

which sits in the `pull_request:` block.

Change: insert the same three lines directly after that anchor.

Check:

```bash
grep -c 'trigger-index-rebuild\.yml' .github/workflows/spec-kit-check.yml
```

Expected: `2`.

Rollback: delete the three inserted lines.

Stop and escalate if: the anchor is not inside the `pull_request:` block, or the count is not 2.

---

### T012 Prove the case fails without the token (AC-003)

File: `/tmp/trigger-index-rebuild.no-token.yml` (a copy; no tracked file changes). Anchor: the body line T004 wrote.

Change: none in the repository. This task produces the negative proof for AC-003.

Check:

```bash
cp .github/workflows/trigger-index-rebuild.yml /tmp/trigger-index-rebuild.no-token.yml
perl -0pi -e 's/ \[skip ci\]//' /tmp/trigger-index-rebuild.no-token.yml
grep -c '\[skip ci\]' /tmp/trigger-index-rebuild.no-token.yml
```

Expected: `0`.

```bash
cd .skilled/skills/system-spec-kit/runtime/cli && TRIGGER_INDEX_REBUILD_WORKFLOW_PATH=/tmp/trigger-index-rebuild.no-token.yml npx vitest run --config ../../vitest.config.ts --project cli tests/trigger-index-rebuild-workflow.vitest.ts
```

Expected: non-zero exit, and the output names `marks the rebuild commit so the pushed commit starts no workflow run` as failing.

```bash
cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/trigger-index-rebuild-workflow.vitest.ts
```

Expected: exit 0.

Rollback: `rm -f /tmp/trigger-index-rebuild.no-token.yml`.

Stop and escalate if: the stripped copy still contains the token, the stripped run exits 0, or the real run exits non-zero.

---

### T013 Run the filter gate over the two new entries (AC-007)

File: `.github/scripts/check-gate-inputs.sh` (unchanged; it is the check). Anchor: none.

Change: none. This task runs the gate over the T010 and T011 edits.

Check:

```bash
bash .github/scripts/tests/check-gate-inputs.test.sh
bash .github/scripts/check-gate-inputs.sh
```

Expected: both exit 0. The second prints `failures=0`, `twin_pairs=311` or more, and `RESULT: PASSED`.

Rollback: none; no file changes.

Stop and escalate if: either command exits non-zero, or `RESULT: PASSED` is absent from the output.

---

### T014 Commit the change as one commit (AC-001)

File: `.github/workflows/trigger-index-rebuild.yml`, `.github/workflows/README.md`, `.github/workflows/spec-kit-check.yml` and `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts`. Anchor: none.

Change: stage them and commit with the message below, so the token and its guard land together. The operator pushes and merges the commit; this task stops at the commit, and T015 starts once it is on `main`.

Check:

```bash
git add .github/workflows/trigger-index-rebuild.yml .github/workflows/README.md .github/workflows/spec-kit-check.yml .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts
git diff --cached --name-only
```

Expected: exactly these four paths.

```bash
git diff --cached | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|phase 00'
```

Expected: no output, and the command exits 1.

```bash
cat > /tmp/commit-msg.txt <<'EOF'
ci(workflows): skip the push gate on trigger-index rebuild commits

The rebuild commit re-ran 13 workflows on four generated files no gate reads.
GitHub starts no workflow for a commit whose message carries the skip token, so
the body line carries it and the loop-guard trailer stays the last line.

Spec: system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg.txt
git commit -F /tmp/commit-msg.txt
```

Expected: `validate-message.mjs` exits 0 and `git commit` exits 0 with one new commit.

Rollback: `git reset --soft HEAD~1` before any push; after a push, `git revert <sha>`.

Stop and escalate if: the staged list is not exactly four paths, the id grep prints a match, or `validate-message.mjs` exits non-zero.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T015 Confirm three rebuild SHAs start no workflow run (AC-005)

File: none; the check reads GitHub's run history. Anchor: none.

Change: none. This task observes the pushed rebuild commits after T014 lands on `main`.

Check:

```bash
git log --format='%H %s' -20 origin/main | grep 'rebuild the trigger index' | head -3
```

Expected: three SHAs, each newer than the T014 commit.

Then, for each SHA, replace `<sha>` and run:

```bash
gh run list --commit <sha> --json databaseId,workflowName,event,conclusion --limit 30
```

Expected: `[]` for each of the three SHAs.

Rollback: none; observation only.

Stop and escalate if: any SHA returns a non-empty list, or fewer than three rebuild SHAs land within 72 hours of the merge.

---

### T016 Confirm the loop guard still matches (AC-001)

File: none; the check reads a commit message. Anchor: none.

Change: none.

Check:

```bash
git log -1 --format=%B <rebuild-sha>
```

Expected: the body line ends `[skip ci]`, and the last line is exactly `Trigger-Index-Rebuild: ci`.

```bash
node -e "process.exit(require('node:child_process').execFileSync('git',['log','-1','--format=%B','<rebuild-sha>']).toString().trimEnd().endsWith('Trigger-Index-Rebuild: ci')?0:1)"
```

Expected: exit 0.

Rollback: none; observation only.

Stop and escalate if: the suffix check exits 1, or the token is missing from the body line.

---

### T017 Confirm spec-kit-check is green on the change (AC-007)

File: none; the check reads the workflow run. Anchor: none.

Change: none.

Check:

```bash
gh run list --workflow spec-kit-check.yml --commit <change-sha> --json databaseId,conclusion
```

Expected: one entry with `"conclusion":"success"`.

Rollback: none; observation only.

Stop and escalate if: no run is listed for the change SHA, or its conclusion is not `success`.

---

### T018 Confirm the new trigger fires on a workflow-only pull request (AC-004)

File: `.github/workflows/trigger-index-rebuild.yml:322` on a throwaway branch (a probe comment, never merged). Anchor:

`          exit 1`

Change: append one comment line on a probe branch and open a pull request against `main`, so the `pull_request:` filter is exercised.

Check:

```bash
git switch -c probe/rebuild-workflow-trigger
printf '\n# Probe line: this exists only to prove the trigger fires.\n' >> .github/workflows/trigger-index-rebuild.yml
git add .github/workflows/trigger-index-rebuild.yml
cat > /tmp/probe-commit-msg.txt <<'EOF'
ci(workflows): probe the rebuild workflow trigger

The probe proves a workflow-only change reaches spec-kit-check through the new
filter entry before the trigger is relied on.

Spec: system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/probe-commit-msg.txt
git commit -F /tmp/probe-commit-msg.txt
git push -u origin probe/rebuild-workflow-trigger
gh pr create --title "Probe: rebuild workflow trigger" --body "Temporary trigger probe; closed unmerged." --base main
gh run list --workflow spec-kit-check.yml --commit "$(git rev-parse HEAD)" --json databaseId,conclusion
```

Expected: `validate-message.mjs` exits 0, `git commit` exits 0, and one run is listed for the probe head SHA.

Rollback: `gh pr close probe/rebuild-workflow-trigger --delete-branch`, then `git switch main`, `git branch -D probe/rebuild-workflow-trigger` and `rm -f /tmp/probe-commit-msg.txt`.

Stop and escalate if: no run is listed for the probe head SHA, or the pull request is merged.

---

### T019 Record the 24 h baseline (AC-006)

File: `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/` (new directory). Anchor: none.

Change: create the run list, the per-workflow run-id selection, the job samples and `summary.md`.

Check: at least 24 hours after T014 merges, run every block in this task from `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal`:

```bash
cd specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal
mkdir -p scratch/baseline-24h/jobs
gh run list --limit 1000 --json databaseId,name,headSha,event,conclusion,createdAt,startedAt,updatedAt > scratch/baseline-24h/runs-last-1000.json
```

Expected: `runs-last-1000.json` exists and parses.

```bash
SINCE="$(date -u -v-24H +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)"
jq --arg since "$SINCE" '[.[] | select(.createdAt >= $since)]' scratch/baseline-24h/runs-last-1000.json > scratch/baseline-24h/window.json
jq 'length' scratch/baseline-24h/window.json
```

Expected: a count of at least 50 runs in the 24 h window.

Then select the five latest non-skipped completed runs of each workflow and write their ids:

```bash
jq -r '
  group_by(.name)
  | map(map(select(.conclusion != null and .conclusion != "skipped")) | sort_by(.createdAt) | reverse | .[:5])
  | add
  | .[].databaseId
' scratch/baseline-24h/runs-last-1000.json > scratch/baseline-24h/run-ids.txt
wc -l < scratch/baseline-24h/run-ids.txt
```

Expected: five ids per workflow, or fewer where that workflow has fewer non-skipped completed runs.

Then, for each id, run:

```bash
while read -r id; do gh run view "$id" --json jobs > "scratch/baseline-24h/jobs/$id.json"; done < scratch/baseline-24h/run-ids.txt
```

Expected: one `jobs/<id>.json` per id in `run-ids.txt`.

Write `scratch/baseline-24h/summary.md` with the window bounds, the per-workflow run counts, the median per run, and `sum over non-skipped jobs of ceil(job seconds / 60)` per run.

Expected: the total in `summary.md` falls in 1,700-1,850 runner-min/day, against 3,812 before the change, and the per-rebuild-SHA run count in the window is 0.

Rollback: `rm -rf specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h` and re-collect after another 24 h.

Stop and escalate if: fewer than 24 hours have passed, or the total falls outside 1,700-1,850. Report the measured number; do not rescale or adjust it.

---

### T020 Close the acceptance criteria with evidence (AC-006)

File: `acceptance-criteria.md`, the Status cell of each row. Anchor: `| Unmet | - |` at the end of each criterion row.

Change: set each row's Status to `Met` and copy the observed number into its Verification cell.

Check:

```bash
grep -c '| Unmet |' specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/acceptance-criteria.md
```

Expected: `0`.

Rollback: restore `Unmet` in the rows that did not pass.

Stop and escalate if: any check from T012 to T019 has not passed.

---

### T021 Commit the closure (AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007)

File: `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal` (the packet folder). Anchor: `| AC-007 | Gates | REQ-007 |` at `acceptance-criteria.md:65`.

Change: stage the packet folder, including the acceptance criteria, the task statuses and the scratch evidence, write its message, validate it, and commit, so the closure edits T019 and T020 made are not left uncommitted.

Check:

```bash
cat > /tmp/commit-msg-closure.txt <<'EOF'
docs(spec): close the rebuild fan-out removal criteria

Every acceptance row now carries the observed run id, gate output or baseline
number that proves it, so the packet records the measured state rather than a
plan.

Spec: system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /tmp/commit-msg-closure.txt
git add specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal
git commit -F /tmp/commit-msg-closure.txt
git status --porcelain -- specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal
```

Expected: `validate-message.mjs` exits `0`; `git log -1 --format=%s` prints `docs(spec): close the rebuild fan-out removal criteria`; `git status --porcelain` prints nothing.

Rollback: `git reset --soft HEAD~1` and delete `/tmp/commit-msg-closure.txt`.

Stop and escalate if: the validator exits non-zero twice, or the commit stages a path outside the packet folder.

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
- **Recommendations**: See `../001-research/research/synthesis-reviews/final-review.md` (`:193-222` for R1 and R2, `:534-607` for the phase plan)
- **Baseline to beat**: See `../001-research/scratch/ci-run-data/summary.md`

| R-id | Requirements | Tasks | Acceptance criteria |
|------|--------------|-------|---------------------|
| R1 | REQ-001, REQ-002, REQ-005 | T002, T004, T005, T006, T007, T014, T015, T016 | AC-001, AC-002, AC-005 |
| R2 | REQ-003, REQ-004 | T008, T009, T010, T011, T012, T018 | AC-003, AC-004 |
| Baseline | REQ-006 | T019, T020, T021 | AC-006 |
| Gates | REQ-007 | T013, T017 | AC-007 |
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

- [ ] CHK-001 [P0] Requirements documented in spec.md - planned as REQ-001 to REQ-007, each naming R1, R2 or the baseline
- [ ] CHK-002 [P0] Technical approach defined in plan.md - the token on the body line, the trailer last, the suite as the guard
- [ ] CHK-003 [P1] Dependencies identified and available - D1 answered (T001), `gh` with `repo` and `actions`, a checkout with the spec-kit dependencies installed (T003)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks - the vitest suite and `bash .github/scripts/check-gate-inputs.sh` are the only linters this change touches; both must pass (T003, T013)
- [ ] CHK-011 [P0] No console errors or warnings - the suite exits 0 with no unhandled rejection, and the gate prints `failures=0` (T003, T013)
- [ ] CHK-012 [P1] Error handling implemented - not applicable: the change adds a fixed string to an existing `-m` argument and one assertion
- [ ] CHK-013 [P1] Code follows project patterns - the new comment explains why, as the surrounding commit-step comments do, and carries no packet id (T005, T014)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met - `acceptance-criteria.md` rows AC-001 to AC-007 (T020, T021)
- [ ] CHK-021 [P0] Manual testing complete - three rebuild SHAs, the loop-guard suffix, and the workflow-only pull request (T015 to T018)
- [ ] CHK-022 [P1] Edge cases tested - the token-stripped variant (T012) and the empty-change path, where no commit is made
- [ ] CHK-023 [P1] Error scenarios validated - a race-rejected push exits 0 with a notice, and `message-contract` still passes the new message text (T014)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class - class-of-bug: one producer writes a message that starts a second run of the whole gate
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed - `rg -n 'Trigger-Index-Rebuild: ci|\[skip ci\]' .github .skilled` finds the trailer at four sites and the token at none before the change (plan.md, Affected Surfaces)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed - the loop guard, the vitest suite, `spec-kit-check.yml`, the README rows, `message-contract` and `check-gate-inputs.sh`, each with its verification in plan.md
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests - not applicable: no path, parser or redaction code changes; the message-suffix matrix is in plan.md
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - event (3) x commit kind (4) with 5 required rows, in plan.md
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - the token-stripped workflow copy is the hostile variant (T012)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range - the three rebuild SHAs and the 24 h window bounds are recorded in `scratch/`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets - the change adds a fixed literal; no token, key or PAT value appears in any edited file
- [ ] CHK-031 [P0] Input validation implemented - not applicable: the token is not interpolated from any input
- [ ] CHK-032 [P1] Auth/authz working correctly - the push keeps `secrets.TRIGGER_INDEX_PUSH_TOKEN` and the ruleset bypass; this phase adds no scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized - spec.md REQ-001 to REQ-007, tasks.md T001 to T021, acceptance-criteria.md AC-001 to AC-007
- [ ] CHK-041 [P1] Code comments adequate - the token's comment says why the token exists and why the trailer stays last, with no packet id (T005)
- [ ] CHK-042 [P2] README updated - `.github/workflows/README.md:58` and `:75` (T006, T007)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only - the pre-change run lists go to `scratch/pre-change/`, the baseline to `scratch/baseline-24h/`, and the token-stripped copy to `/tmp`
- [ ] CHK-051 [P1] scratch/ cleaned before completion - both scratch folders are kept on purpose: later phases measure against `scratch/baseline-24h/summary.md`, and `scratch/pre-change/` is the before number
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

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read the task's file and confirm the quoted anchor text is on the stated line
- [ ] Know the check's expected result before editing
- [ ] Run the check after the edit and read both its output and its exit status

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run T001 first. T002 and T003 then run in either order. T004 to T014 run in listed order. |
| TASK-SCOPE | Edit only the file a task names. Report any other file as a finding. |
| TASK-ANCHOR | Match the quoted anchor text. Never edit by line number alone. |
| TASK-VERIFY | Run the task's check before marking it complete. |
| TASK-STOP | Stop at the task's stated escalation condition. Do not repair around it. |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol

1. Mark the task `[B]` with the blocking fact.
2. Record the fact on the task's own line.
3. Stop at the second blocked task and report both.
