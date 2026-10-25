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

### T001 [x] DECISION D1 (operator yes required) - choose how rebuild commits skip CI (AC-001)

File: `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/d1-answer.md` (exists; written 2026-10-23 with the operator's answer). Anchor: the answer line.

Done: `scratch/d1-answer.md` holds `D1=A`.

Default: option A, the `[skip ci]` token on the commit body line at `.github/workflows/trigger-index-rebuild.yml:151`. It is one line, needs no filter entries and adds no new YAML pattern.

Alternative: option B, a push-only `paths-ignore:` on the 9 unfiltered workflows plus `!` negations on the 4 path-filtered ones. That is 8 entries each, 104 in total across 13 files, plus an amendment to ordering rule 2, for about 2,002 runner-min/day with `message-contract` left unfiltered.

Change: the operator answered on 2026-10-23, and the file already holds the answer. Do not re-ask and do not rewrite the file; this task only runs the existing check.

Check:

```bash
mkdir -p specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch
cat specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/d1-answer.md
```

Expected: `D1=A`.

Rollback: delete `scratch/d1-answer.md`.

Stop and escalate if: the operator answers B, or no answer arrives. This task list implements option A only; B replaces T004 to T007 and T010 to T011 with the ignore edit set and makes T008 and T009 assert the ignore instead of the token.

---

### T002 [x] Capture the pre-change fan-out for three rebuild SHAs (AC-005)

File: `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/pre-change/` (new directory). Anchor: none.

Done: `scratch/pre-change/` holds `ac2be31ec6…`, `b786d850c7…` and `bf2bd5ca8a….json`, each 14 rows; they are the three rebuild commits immediately preceding 8e62a3d096.

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

### T003 [x] Install the spec-kit workspace and record a green baseline (AC-003)

File: `.skilled/skills/system-spec-kit/` (dependencies only; no tracked file changes). Anchor: none.

Done: `.skilled/skills/system-spec-kit/node_modules` installed; the vitest run exits 0 with `Tests 60 passed | 1 skipped (61)` in `trigger-index-rebuild-workflow.vitest.ts`.

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

### T004 [x] Add the skip token to the rebuild commit body (AC-001)

File: `.github/workflows/trigger-index-rebuild.yml:151`. Anchor:

`            -m "The pushed corpus changed the committed trigger index, so this job rebuilt it." \`

Done: `[skip ci]` sits on the body `-m` at `:151`; `sed -n '150,152p'` shows the subject, body and trailer `-m` lines in order.

Change: replace that line with:

`            -m "The pushed corpus changed the committed trigger index, so this job rebuilt it. [skip ci]" \`

Check:

```bash
grep -c 'rebuilt it\. \[skip ci\]"' .github/workflows/trigger-index-rebuild.yml
```

Expected: `1`.

```bash
sed -n '150,152p' .github/workflows/trigger-index-rebuild.yml
```

Expected: the subject `-m`, then the body line ending `[skip ci]" \`, then `-m "Trigger-Index-Rebuild: ci"` as the last line.

Rollback: revert the line to the quoted anchor.

Stop and escalate if: the anchor text is not on line 151, or the count is not 1.

---

### T005 [x] Explain the token in the commit step (AC-001)

File: `.github/workflows/trigger-index-rebuild.yml:149`. Anchor:

`          # The guard above matches this trailer to recognize the job's own push.`

Done: the two comment lines sit at `:147-148` and the anchor moved from `:147` to `:149`; grep count=1.

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

Stop and escalate if: the anchor text is not on line 149, or the count is not 1.

---

### T006 [x] State the skip in the rebuild README row (AC-002)

File: `.github/workflows/README.md:58`. Anchor: the sentence

``The loop guard skips commits whose message ends with the `Trigger-Index-Rebuild: ci` trailer.``

Done: the sentence sits at `README.md:58` with the delivered wording the 2026-10-24 amendment accepted; the check grep returns 1.

Change: insert this sentence immediately after the anchor sentence, inside the same table cell:

``The commit body carries `[skip ci]`, so the pushed rebuild starts no workflow run; the loop guard stays as the fallback that skips a run if a commit carrying the trailer ever starts one anyway.``

Check:

```bash
grep -c 'starts no workflow run; the loop guard stays as the fallback' .github/workflows/README.md
```

Expected: `1`.

Rollback: delete the inserted sentence.

Stop and escalate if: the anchor sentence is not on line 58, or the count is not 1.

---

### T007 [x] State the skip in the push and pull-request README row (AC-002)

File: `.github/workflows/README.md:75`. Anchor cell text:

`Rebuilds the committed index after a push. Also runs by hand`

Done: `README.md:75` carries `…carries \`[skip ci]\` so no other workflow runs on it`; grep count=1.

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

### T008 [x] Add the SKIP_TOKEN constant (AC-003)

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts:84`. Anchor:

`const LOOP_GUARD_TRAILER = 'Trigger-Index-Rebuild: ci';`

Done: `const SKIP_TOKEN = '[skip ci]';` sits at `:85`, directly after the `:84` anchor; grep count=1.

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

### T009 [x] Assert the token and the trailer in one case (AC-003)

File: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts`, after the test that ends at `:892` before T008 lands and `:893` after it. Anchor: the closing block

Done: the `it('marks the rebuild commit…')` case sits at `:895` and the suite exits 0 (`Tests 60 passed | 1 skipped (61)`).

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

### T010 [x] Name the workflow in the push filter (AC-004)

File: `.github/workflows/spec-kit-check.yml:9`. Anchor: the first occurrence of

Done: `spec-kit-check.yml:12` names `trigger-index-rebuild.yml` inside the `push:` block.

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

### T011 [x] Name the workflow in the pull-request filter (AC-004)

File: `.github/workflows/spec-kit-check.yml:37` before T010 lands, `:40` after it. Anchor: the second occurrence of

Done: `spec-kit-check.yml:43` carries the same entry inside `pull_request:`; the file's total count is 2.

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

### T012 [x] Prove the case fails without the token (AC-003)

File: `/tmp/trigger-index-rebuild.no-token.yml` (a copy; no tracked file changes). Anchor: the body line T004 wrote.

Done: rerun 2026-10-25 with the stripped copy in a session scratch directory instead of `/tmp` (the variable takes any path). `grep -c '\[skip ci\]'` on the stripped copy printed `0`. The stripped run exited `1` with `Tests  1 failed | 59 passed | 1 skipped (61)` and named `marks the rebuild commit so the pushed commit starts no workflow run` as the failing case. The real run exited `0` with `Tests  60 passed | 1 skipped (61)`.

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

### T013 [x] Run the filter gate over the two new entries (AC-007)

File: `.github/scripts/check-gate-inputs.sh` (unchanged; it is the check). Anchor: none.

Done: `check-gate-inputs: 54 passed, 0 failed`; the gate prints `files=45 inputs_resolved=235 dynamic_inputs=9 twin_pairs=340 failures=0` and `RESULT: PASSED` (twin_pairs ≥ 311).

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

### T014 [x] Commit the change as one commit (AC-001)

File: `.github/workflows/trigger-index-rebuild.yml`, `.github/workflows/README.md`, `.github/workflows/spec-kit-check.yml` and `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts`. Anchor: none.

Done: commit `8e62a3d096` carries the tasked message and staged exactly the four named files; it also carried one unplanned edit, the loop-guard comment rewrite the 2026-10-24 amendment accepted.

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

### T015 [x] Confirm three rebuild SHAs start no workflow run (AC-005)

File: none; the check reads GitHub's run history. Anchor: none.

Done: the three qualifying post-change rebuild SHAs `08bd79a68a`, `27490113c2` and `c9d4deed31` each have a captured `[]` result; a fourth SHA, `c7c5bfb51b`, also has `[]` (`scratch/post-change/`).

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

### T016 [x] Confirm the loop guard still matches (AC-001)

File: none; the check reads a commit message. Anchor: none.

Done: `git log -1 --format=%B` on both rebuild SHAs ends with the `[skip ci]` body then `Trigger-Index-Rebuild: ci`; the suffix check exits 0 on each.

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

### T017 [x] Confirm spec-kit-check is green on the change (AC-007)

File: none; the check reads the workflow run. Anchor: none.

Done: `gh run list --workflow spec-kit-check.yml --commit 8e62a3d096…` returns one run, `databaseId` 40018919244, conclusion `success`.

Change: none.

Check:

```bash
gh run list --workflow spec-kit-check.yml --commit <change-sha> --json databaseId,conclusion
```

Expected: one entry with `"conclusion":"success"`.

Rollback: none; observation only.

Stop and escalate if: no run is listed for the change SHA, or its conclusion is not `success`.

---

### T018 [x] Confirm the new trigger fires on a workflow-only pull request (AC-004)

File: `.github/workflows/trigger-index-rebuild.yml:322` on a throwaway branch (a probe comment, never merged). Anchor:

`          exit 1`

Done: PR #71 "Probe: rebuild workflow trigger" on `branches/018-probe-rebuild-workflow-trigger` (the branch name the 2026-10-24 amendment records in place of `probe/rebuild-workflow-trigger`), head `6c51acecb2f8`, produced one `pull_request` spec-kit-check run 40021934338, conclusion `success`; closed unmerged 2026-10-23T21:03Z.

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

### T019 [x] Record the 24 h baseline (AC-006)

File: `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/` (new directory). Anchor: none.

Done: collected 2026-10-24T21:58Z and every command exited 0. `runs-last-1000.json` holds 1000 runs reaching back to 2026-10-23T15:24:36Z, `window.json` holds 795 runs from 2026-10-23T21:59:34Z, `run-ids.txt` holds 191 ids with 191 `jobs/<id>.json` files, and `summary.md` records the window, the per-workflow rows and the total. The measured total for `.github/workflows/` runs is 2,191 runner-min in the 24 h window, outside the original 1,700-1,850 band; the 67 `dynamic` runs (about 584 min, 420 of them `Push on main`) are on a separate line. Runs started by the 19 rebuild commits in the window: 0 (push, pull_request and schedule events). The stop condition below fired, the number was reported as measured, and on 2026-10-25 the operator ruled "Amend the band to the measured value." (ADR-006). The total was recomputed from the window run list and the 191 job samples on 2026-10-25 and is 2,191; the saving against 3,812 is 1,621 runner-min, 42.5%. The task is done against the amended band.

Change: create the run list, the per-workflow run-id selection, the job samples and `summary.md`.

Counting note: Count only workflow runs from `.github/workflows/` in this baseline and in the deltas for 003 T036 and phase 008. Report any CodeQL default-setup `dynamic` run on a separate line so totals remain comparable with the pre-change baseline.

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

Expected: the total in `summary.md` equals the amended band of 2,191 runner-min/day (originally 1,700-1,850; ADR-006), against 3,812 before the change, and the per-rebuild-SHA run count in the window is 0.

Rollback: `rm -rf specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h` and re-collect after another 24 h.

Stop and escalate if: fewer than 24 hours have passed, or the total falls outside the band. Report the measured number; do not rescale or adjust it. (This condition fired once at 2,191 and ended in the operator's band amendment, ADR-006.)

---

### T020 [x] Close the acceptance criteria with evidence (AC-006)

File: `acceptance-criteria.md`, the Status cell of each row. Anchor: `| Unmet | - |` at the end of each criterion row.

Done: AC-001 to AC-007 all read `Met`. AC-006 moved from `Unmet` to `Met` on 2026-10-25 after the operator's band amendment (ADR-006), with the observed values and `summary.md` line references in its Verification cell; the Closure Statement reads `Closeable: Yes`.

Change: set each row's Status to `Met` and copy the observed number into its Verification cell.

Check:

```bash
grep -c '| Unmet |' specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/acceptance-criteria.md
```

Expected: `0`.

Rollback: restore `Unmet` in the rows that did not pass.

Stop and escalate if: any check from T012 to T019 has not passed.

---

### T021 [x] Commit the closure (AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007)

File: `specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal` (the packet folder). Anchor: `| AC-007 | Gates | REQ-007 |` at `acceptance-criteria.md:65`.

Evidence: the closure edits landed as commit `03baa89ac6`, `docs(spec): close the rebuild fan-out phase on the measured band`, and `git merge-base --is-ancestor 03baa89ac6 origin/main` printed `on-main` (observed 2026-10-25). `git status --short` over the packet folder printed nothing before this tick. The subject differs from the one drafted below because the commit states the measured band the operator amended to.

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

- [x] All tasks marked `[x]` [EVIDENCE: T001 to T021 are `[x]`; the closure commit is `03baa89ac6`, an ancestor of `origin/main`]
- [x] No `[B]` blocked tasks remaining [EVIDENCE: `grep -c '\[B\]'` over the task headings finds none; no task is blocked]
- [x] Manual verification passed [EVIDENCE: the T012, T013, T015 and T019 checks were run and their output and exit status read; the 24 h total was recomputed to 2,191 on 2026-10-25]
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

- [x] CHK-001 [P0] Requirements documented in spec.md - planned as REQ-001 to REQ-007, each naming R1, R2 or the baseline [EVIDENCE: spec.md lists REQ-001 to REQ-007 (grep `REQ-00[1-7] |` found all seven rows at `:122-133`), each naming R1, R2 or the baseline]
- [x] CHK-002 [P0] Technical approach defined in plan.md - the token on the body line, the trailer last, the suite as the guard [EVIDENCE: plan.md section 3 (Pattern, Key Components, Data Flow) and the Fix Addendum describe the token on the body line, the trailer last and the suite as the guard, read 2026-10-25]
- [x] CHK-003 [P1] Dependencies identified and available - D1 answered (T001), `gh` with `repo` and `actions`, a checkout with the spec-kit dependencies installed (T003) [EVIDENCE: `cat scratch/d1-answer.md` prints `D1=A`; `gh repo view` printed the repository name with exit 0 and `gh run list` and `gh run view` exited 0; `.skilled/skills/system-spec-kit/node_modules` exists and the suite ran]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - the vitest suite and `bash .github/scripts/check-gate-inputs.sh` are the only linters this change touches; both must pass (T003, T013) [EVIDENCE: reran 2026-10-25: the workflow suite exits 0 (`Tests  60 passed | 1 skipped (61)`); `bash .github/scripts/check-gate-inputs.sh` exits 0 with `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0` and `RESULT: PASSED`; `check-gate-inputs.test.sh` exits 0 with `57 passed, 0 failed`]
- [x] CHK-011 [P0] No console errors or warnings - the suite exits 0 with no unhandled rejection, and the gate prints `failures=0` (T003, T013) [EVIDENCE: the saved suite output has no match for `unhandled` or `error` (grep count 0, exit 0 on the suite itself) and the gate prints `failures=0`]
- [x] CHK-012 [P1] Error handling implemented - not applicable: the change adds a fixed string to an existing `-m` argument and one assertion [EVIDENCE: n/a because the change adds a fixed string to an existing `-m` argument and one assertion, and no error path is added]
- [x] CHK-013 [P1] Code follows project patterns - the new comment explains why, as the surrounding commit-step comments do, and carries no packet id (T005, T014) [EVIDENCE: read `.github/workflows/trigger-index-rebuild.yml:147-149` 2026-10-25: the two new comment lines say why the token exists, sit beside the existing trailer comment, and name no packet id or spec path]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - `acceptance-criteria.md` rows AC-001 to AC-007 (T020, T021) [EVIDENCE: all 7 rows read `Met` on 2026-10-25; `grep -c '| Unmet |' acceptance-criteria.md` returns 0; AC-006 met against the band the operator amended to the measured 2,191 runner-min (ADR-006, `scratch/baseline-24h/summary.md:12`)]
- [x] CHK-021 [P0] Manual testing complete - three rebuild SHAs, the loop-guard suffix, and the workflow-only pull request (T015 to T018) [EVIDENCE: reran 2026-10-25: `gh run list --commit` for `08bd79a68a`, `27490113c2` and `c9d4deed31` returns 0 push, pull_request or schedule runs each (exit 0); `git log -1 --format=%B c9d4deed31` ends `[skip ci]` then `Trigger-Index-Rebuild: ci`; T017 and T018 are `[x]` with run 40018919244 and run 40021934338 both `success`]
- [x] CHK-022 [P1] Edge cases tested - the token-stripped variant (T012) and the empty-change path, where no commit is made [EVIDENCE: token-stripped variant: T012 rerun 2026-10-25, stripped copy exits 1 naming the new case and the real workflow exits 0. Empty-change path: `.github/workflows/trigger-index-rebuild.yml:138-139` prints `Trigger index is current; nothing to commit.` before any commit is made, so no token is involved]
- [x] CHK-023 [P1] Error scenarios validated - a race-rejected push exits 0 with a notice, and `message-contract` still passes the new message text (T014) [EVIDENCE: race path: the suite cases under `when origin moves before the push` (`exits 0 with a notice and pushes nothing`) pass in the 60-pass run; message contract: `node .skilled/skills/sk-git/scripts/validate-message.mjs --commit` on the body of rebuild `c9d4deed31` exits 0]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - class-of-bug: one producer writes a message that starts a second run of the whole gate [EVIDENCE: class-of-bug: one producer writes a message that starts a second run of the whole gate; the producer is the rebuild commit step at `trigger-index-rebuild.yml:150-152`]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed - `rg -n 'Trigger-Index-Rebuild: ci|\[skip ci\]' .github .skilled` finds the trailer at four sites and the token at none before the change (plan.md, Affected Surfaces) [EVIDENCE: reran `rg -c` for the trailer and the token over `.github` and `.skilled` 2026-10-25: the trailer and the token now appear together in the workflow, its README row, the suite and the sk-code CI reference. The token appears at no other producer, and the producer inventory in plan.md lists the four trailer sites]
- [x] CHK-FIX-003 [P0] Consumer inventory completed - the loop guard, the vitest suite, `spec-kit-check.yml`, the README rows, `message-contract` and `check-gate-inputs.sh`, each with its verification in plan.md [EVIDENCE: plan.md affected-surfaces table names the loop guard, the vitest suite, `spec-kit-check.yml`, the README rows, `message-contract` and `check-gate-inputs.sh`; each was exercised: suite 60 pass, filter entries at `spec-kit-check.yml:12` and `:43`, README greps return 1 each, message validator exit 0, gate exit 0]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests - not applicable: no path, parser or redaction code changes; the message-suffix matrix is in plan.md [EVIDENCE: n/a because no path, parser or redaction code changes; the commit-message suffix matrix is in plan.md line 88]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - event (3) x commit kind (4) with 5 required rows, in plan.md [EVIDENCE: plan.md line 88 lists event (push, pull_request, workflow_dispatch) times commit kind (human, rebuild with token, rebuild without token, race-rejected) and five required rows]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - the token-stripped workflow copy is the hostile variant (T012) [EVIDENCE: the token-stripped workflow copy is the hostile variant: T012 rerun 2026-10-25 exits 1 against it and 0 against the real file]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range - the three rebuild SHAs and the 24 h window bounds are recorded in `scratch/` [EVIDENCE: evidence is pinned: change commit `8e62a3d096`, rebuild SHAs `08bd79a68a`, `27490113c2`, `c9d4deed31` (`scratch/post-change/`), and the 24 h window 2026-10-23T21:59:34Z to 2026-10-24T21:59:34Z (`scratch/baseline-24h/summary.md`, `rebuild-shas.txt`)]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - the change adds a fixed literal; no token, key or PAT value appears in any edited file [EVIDENCE: scanned the four changed files and the packet scratch for key-shaped strings 2026-10-25: the only secret reference is `secrets.TRIGGER_INDEX_PUSH_TOKEN` by name at `trigger-index-rebuild.yml:276`; no value appears]
- [x] CHK-031 [P0] Input validation implemented - not applicable: the token is not interpolated from any input [EVIDENCE: n/a because the token is a fixed literal and nothing is interpolated from any input]
- [x] CHK-032 [P1] Auth/authz working correctly - the push keeps `secrets.TRIGGER_INDEX_PUSH_TOKEN` and the ruleset bypass; this phase adds no scope [EVIDENCE: `trigger-index-rebuild.yml:276` still reads `PUSH_TOKEN: ${{ secrets.TRIGGER_INDEX_PUSH_TOKEN || github.token }}`; the change adds no permission or scope]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - spec.md REQ-001 to REQ-007, tasks.md T001 to T021, acceptance-criteria.md AC-001 to AC-007 [EVIDENCE: spec.md REQ-001 to REQ-007, tasks.md T001 to T021 and acceptance-criteria.md AC-001 to AC-007 agree after the 2026-10-25 edits; spec.md and acceptance-criteria.md read Status `Complete`, AC-006 reads `Met`, and all three state the amended 2,191 band]
- [x] CHK-041 [P1] Code comments adequate - the token's comment says why the token exists and why the trailer stays last, with no packet id (T005) [EVIDENCE: the T005 comment lines say why the token exists and the adjacent line says why the trailer stays; neither names a packet id or spec path (read `trigger-index-rebuild.yml:147-149`)]
- [x] CHK-042 [P2] README updated - `.github/workflows/README.md:58` and `:75` (T006, T007) [EVIDENCE: `grep -c` on `.github/workflows/README.md` for `starts no workflow run; the loop guard stays as the fallback` prints `1` (row at `:57`) and for `no other workflow runs on it` prints `1` (row at `:74`)]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - the pre-change run lists go to `scratch/pre-change/`, the baseline to `scratch/baseline-24h/`, and the token-stripped copy to `/tmp` [EVIDENCE: the pre-change lists are in `scratch/pre-change/`, the baseline in `scratch/baseline-24h/`, and the token-stripped copy lives in a session scratch directory outside the repository]
- [x] CHK-051 [P1] scratch/ cleaned before completion - both scratch folders are kept on purpose: later phases measure against `scratch/baseline-24h/summary.md`, and `scratch/pre-change/` is the before number [EVIDENCE: both scratch folders are kept on purpose: later phases measure against `scratch/baseline-24h/summary.md`, and `scratch/pre-change/` is the before number]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] Read the task's file and confirm the quoted anchor text is on the stated line [EVIDENCE: reran the T004 to T011 anchor greps 2026-10-25 against `trigger-index-rebuild.yml:147-152`, `README.md:57` and `:74`, the suite at `:85` and `:895`, and `spec-kit-check.yml:12` and `:43`; every count matched]
- [x] Know the check's expected result before editing [EVIDENCE: no edit to a tracked file was made in this pass; each task's Expected line was read before its check ran]
- [x] Run the check after the edit and read both its output and its exit status [EVIDENCE: the T012, T013 and T019 checks were run in this pass and their output and exit codes read: stripped suite exit 1, real suite exit 0, gate exit 0, every `gh` call exit 0]

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
