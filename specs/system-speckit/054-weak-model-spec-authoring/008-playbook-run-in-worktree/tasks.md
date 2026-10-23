---
title: "Tasks: Phase 8: playbook-run-in-worktree"
description: "Task Format: T### [P?] Description (file path). Each task names its verify command, and each dispatched task carries its full worker brief."
trigger_phrases:
  - "playbook run in worktree tasks"
  - "disposable worktree scenario run"
  - "manual testing playbook report tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: playbook-run-in-worktree

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

**Task Format**: `T### [P?] Description (file path)`, then `Verify:` with the command whose output proves the task.

Shell variables used below, set once by the conductor in `scratch/env.sh`:
- `RUNROOT`: the checkout that holds this phase folder. It is the build worktree from `../goal.md` section 4 when the operator chose A, otherwise the primary checkout.
- `PHASE`: `$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree`
- `MAIN`: the primary checkout, read from the first `git worktree list --porcelain` entry.
- `BASE_REF`: the ref the operator recorded in `../goal.md` section 4.
- `START`: the commit hash recorded by T003.
- `WT_BRANCH` and `WT`: the branch and directory printed by T005.
- `REPORT` and `FOLDER`: the report folder path and its basename, set by T013.
- `P7`: `$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment`
- `S`: `.skilled/skills/system-spec-kit`, relative to the tree named by the block.

Every block runs from `RUNROOT` unless it says `cd "$WT"`. A path that starts with `$S` is relative to `RUNROOT` or to `$WT`, as the block states.

Before a Verify line that names `$PHASE`, `$WT`, `$REPORT` or another variable, load the environment with this one command:

```bash
cd "$(git rev-parse --show-toplevel)" && source "$(git rev-parse --show-toplevel)/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/env.sh"
```

The numbers in these Verify lines are the expected shape, not a measurement of the current tree. A scenario verdict may be `FAIL` and the phase still closes when the failure is escalated. A missing file is always a failure.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Check the phase 007 close and the operator inputs (no file). Run the block below. Verify: the first command prints `1`, the second prints `4` and the third prints `BASE_REF_OK`. When the first prints nothing, phase 007 is not closed: write `BLOCKED phase 007 open` in `goal.md` section 4 and stop. When the second is below `4`, a launch precondition is open: write `BLOCKED preconditions` and stop. When the third prints nothing, the operator has not recorded `BASE_REF`: write `BLOCKED base ref` and stop. The operator's row in `../goal.md` section 4 has exactly three cells, `| BASE_REF | Pending | <note> |`. The State cell `Pending` sits in column 3 and the operator replaces it with the ref, so the awk below reads column 3.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
P7="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment"
rg -c '^\*\*Closeable:\*\* Yes' "$P7/acceptance-criteria.md"
rg -c '^\| Launch precondition [1-4].*\| Done \|' "$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/goal.md"
BASE_REF=$(awk -F'|' '/^\| BASE_REF /{gsub(/^ +| +$/,"",$3); print $3}' "$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/goal.md")
test -n "$BASE_REF" && git rev-parse --verify "$BASE_REF^{commit}" >/dev/null && echo BASE_REF_OK
```

- [ ] T002 Check the tools and the provider (no file). Verify: the block prints eight lines, seven versions and a count of at least `1`. A missing tool stops the phase with `BLOCKED tools`.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
P7="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment"
node --version
npm --version
jq --version
rg --version | head -1
shasum --version | head -1
rg -c 'deepseek-v4.1-flash-1017' opencode.json
perl -e 'print "perl $]\n"'
rsync --version | head -1
```

- [ ] T003 Record the start state and the environment (`scratch/env.sh`, `scratch/status-start.txt`). Run the block below. Verify: `grep -c '^BASE_REF=' "$PHASE/scratch/env.sh"` prints `1`, `grep -c '^START=' "$PHASE/scratch/env.sh"` prints `1` and `tail -1 "$PHASE/scratch/status-start.txt"` prints the last status line or nothing when the tree is clean.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
P7="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment"
mkdir -p "$PHASE/scratch/worktree" "$PHASE/scratch/tools" "$PHASE/scratch/runs" "$PHASE/scratch/briefs" "$PHASE/scratch/fix" "$PHASE/scratch/review" "$PHASE/scratch/test"
START="$(git rev-parse HEAD)"
BASE_REF=$(awk -F'|' '/^\| BASE_REF /{gsub(/^ +| +$/,"",$3); print $3}' "$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/goal.md")
MAIN="$(git worktree list --porcelain | awk 'NR==1{print $2}')"
git status --porcelain --untracked-files=all > "$PHASE/scratch/status-start.txt"
git -C "$MAIN" status --porcelain --untracked-files=all > "$PHASE/scratch/status-main-start.txt"
cat > "$PHASE/scratch/env.sh" <<EOF
RUNROOT="$RUNROOT"
PHASE="$PHASE"
MAIN="$MAIN"
BASE_REF="$BASE_REF"
START="$START"
P7="$P7"
S=".skilled/skills/system-spec-kit"
EOF
cat "$PHASE/scratch/env.sh"
```

- [ ] T004 Build the scenario map (`scratch/scenarios.tsv`, `scratch/tools/build-scenario-map.cjs`). Write the script with the first block, then run it with the second. The script carries the eight ids and paths that phase 007 plan section 3.1 freezes: 476 to 483 under `template-authoring/`. Verify: the block prints `SCENARIO_MAP_OK 8`, `wc -l < "$PHASE/scratch/scenarios.tsv"` prints `8`, `awk -F'\t' 'NF != 6' "$PHASE/scratch/scenarios.tsv"` prints nothing and `awk -F'\t' '{print $1}' "$PHASE/scratch/scenarios.tsv" | sort -u | wc -l` prints `8`. A line `NO_FILE S<n>` means phase 007 did not create that file. A line `AMBIGUOUS S<n>` means two playbook index rows carry that playbook id. Write the line in `goal.md` section 4 and stop. Do not edit phase 007.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
cat > "$PHASE/scratch/tools/build-scenario-map.cjs" <<'JS'
// Maps the eight frozen scenario labels to the playbook scenario files. The
// ids and paths are literal, so a renamed file stops the run instead of
// silently mapping the wrong scenario. A playbook id carried by two index rows
// is ambiguous and stops the build before any scenario runs.
const fs = require('fs');
const path = require('path');

const [playbookRoot, outPath] = process.argv.slice(2);
if (!playbookRoot || !outPath) {
  console.error('usage: build-scenario-map.cjs <playbook-root> <out.tsv>');
  process.exit(2);
}

const rows = [
  ['S1', '476', 'template-authoring/placeholder-token-warning-while-draft.md', '^warning$', '^true$', 'cleanup=ok'],
  ['S2', '477', 'template-authoring/placeholder-token-error-after-draft.md', '^error$', '^false$', 'cleanup=ok'],
  ['S3', '478', 'template-authoring/placeholder-gate-legacy-stamp-unchanged.md', '^error$', '^false$', 'cleanup=ok'],
  ['S4', '479', 'template-authoring/example-drift-guard-catches-leak.md', 'EXAMPLE_DRIFT_OK', 'broken_exit=1', 'cleanup=ok'],
  ['S5', '480', 'template-authoring/golden-render-all-levels.md', 'Tests\\s+12 passed \\(12\\)', 'Tests\\s+16 passed \\(16\\)', 'cleanup=ok'],
  ['S6', '481', 'template-authoring/authoring-card-router-intents.md', '^4$', '^0$', '^1$'],
  ['S7', '482', 'template-authoring/authoring-card-sync-guard.md', 'CARD SYNC OK', 'CARD SYNC FAILED', 'cleanup=ok'],
  ['S8', '483', 'template-authoring/level-1-packet-authored-from-card.md', 'RESULT: PASSED', '^leftover_tokens 0$', 'cleanup=ok'],
];

const indexPath = path.join(playbookRoot, 'manual-testing-playbook.md');
const indexText = fs.readFileSync(indexPath, 'utf8');
const out = [];
const problems = [];
for (const [label, id, file, passA, passB, passC] of rows) {
  const indexRows = indexText.split('\n').filter((line) => new RegExp('^\\| *' + id + ' *\\|').test(line));
  if (indexRows.length > 1) {
    problems.push(`AMBIGUOUS ${label} ${id}`);
    continue;
  }
  const abs = path.resolve(playbookRoot, file);
  if (!fs.existsSync(abs)) {
    problems.push(`NO_FILE ${label} ${file}`);
    continue;
  }
  out.push([label, id, abs, passA, passB, passC].join('\t'));
}

if (problems.length > 0) {
  console.log(problems.join('\n'));
  process.exit(1);
}
fs.writeFileSync(outPath, out.join('\n') + '\n');
console.log(`SCENARIO_MAP_OK ${out.length}`);
JS
node "$PHASE/scratch/tools/build-scenario-map.cjs" \
  "$RUNROOT/$S/manual-testing-playbook" \
  "$PHASE/scratch/scenarios.tsv"
```

- [ ] T005 Create the disposable worktree (`scratch/worktree/create.out`, `scratch/worktree/create.err`). Run the block below. Verify: `read -r WT_BRANCH WT_DIR < "$PHASE/scratch/worktree/create.out"` gives a branch that matches `^worktrees/[0-9]{3}-playbook-run$`, `test -d "$WT"` prints `WORKTREE_DIR_OK` and `git -C "$WT" rev-parse --verify HEAD` prints a 40 character hash. When `create.out` is empty, read `create.err`, write its last line in `goal.md` section 4 and stop.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
bash .skilled/skills/sk-git/scripts/worktree-naming.sh create playbook-run "$BASE_REF" --no-provision \
  > "$PHASE/scratch/worktree/create.out" 2> "$PHASE/scratch/worktree/create.err"
cat "$PHASE/scratch/worktree/create.out"
read -r WT_BRANCH WT_DIR < "$PHASE/scratch/worktree/create.out"
test -n "$WT_BRANCH" && test -n "$WT_DIR"
cat >> "$PHASE/scratch/env.sh" <<EOF
WT_BRANCH="$WT_BRANCH"
WT="$WT_DIR"
EOF
test -d "$WT" && echo WORKTREE_DIR_OK
```

- [ ] T006 Provision the worktree and prove it runs its own code (`scratch/worktree/provision.out`, `scratch/worktree/provision-exit.txt`, `scratch/worktree/own-code.txt`). Run the block below. Verify: `cat "$PHASE/scratch/worktree/provision-exit.txt"` prints `exit=0`, the last provisioning line ends with `0 failed`, `rg -c '^FOREIGN ' "$PHASE/scratch/worktree/own-code.txt" || true` prints nothing and `test -f "$WT/$S/runtime/dist/lib/validation/orchestrator.js" && echo ORCH_OK` prints `ORCH_OK`. When `provision-exit.txt` holds `exit=142`, the 45 minute alarm stopped provisioning: write `BLOCKED provisioning timeout` in `goal.md` section 4 and stop. When it holds any other non-zero exit, run the same command once more and keep its output. A second failure writes `BLOCKED provisioning` in `goal.md` section 4 and stops the phase.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
rc=0
perl -e 'alarm shift; exec @ARGV' 2700 bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision "$WT" \
  > "$PHASE/scratch/worktree/provision.out" 2>&1 || rc=$?
printf 'exit=%s\n' "$rc" > "$PHASE/scratch/worktree/provision-exit.txt"
cat "$PHASE/scratch/worktree/provision-exit.txt"
tail -3 "$PHASE/scratch/worktree/provision.out"
node -e '
const fs = require("fs");
const path = require("path");
const skill = process.argv[1];
const root = fs.realpathSync(process.argv[2]) + path.sep;
for (const t of ["runtime/dist", "node_modules", "node_modules/@spec-kit/runtime", "node_modules/@spec-kit/cli", "node_modules/@spec-kit/shared", "runtime/node_modules"]) {
  const p = path.join(skill, t);
  if (!fs.existsSync(p)) { console.log("MISSING " + t); continue; }
  const real = fs.realpathSync(p);
  console.log((real.startsWith(root) ? "OWN " : "FOREIGN ") + t);
}' "$WT/$S" "$WT" > "$PHASE/scratch/worktree/own-code.txt"
cat "$PHASE/scratch/worktree/own-code.txt"
test -f "$WT/$S/runtime/dist/lib/validation/orchestrator.js" && echo ORCH_OK
```

- [ ] T007 Prove the worktree holds the phase 002 to 007 changes (`scratch/worktree/precondition.txt`). Run the block below. Verify: `grep -c '^PRESENT ' "$PHASE/scratch/worktree/precondition.txt"` prints `5`. When a line is missing, `BASE_REF` does not contain that phase: write `BLOCKED base ref incomplete` and the missing line in `goal.md` section 4 and stop.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
{
  test -f "$WT/$S/references/workflows/spec-authoring-card.md" && echo "PRESENT card"
  test -x "$WT/$S/runtime/cli/spec/check-example-drift.sh" && echo "PRESENT drift-guard"
  test -x "$WT/$S/runtime/cli/spec/check-card-sync.sh" && echo "PRESENT card-guard"
  rg -q 'v2\.3' "$WT/$S/templates/core/spec.md.tmpl" && echo "PRESENT v2.3"
  test "$(git -C "$WT" rev-parse HEAD)" = "$(git -C "$RUNROOT" rev-parse "$BASE_REF^{commit}")" && echo "PRESENT base-ref"
} > "$PHASE/scratch/worktree/precondition.txt"
cat "$PHASE/scratch/worktree/precondition.txt"
```
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Write the runner, the comparator, their fixture and the shared brief skeleton (`scratch/tools/run-scenario.sh`, `scratch/tools/check-run.cjs`, `scratch/test/fixture-scenario.md`, `scratch/briefs/skeleton.txt`). Write the five blocks below in order, then run the last one. The runner truncates a run above 2 MB and writes a `truncated=` line. The comparator writes `<run file>.check.txt` with the result, the missing pattern, the exit line and the last output line, and `<run file>.stderr.txt` with the failing line. A run that ends with `exit=142` compares as `FAIL` with `missing:exit=142`. Verify: the last block prints `SYNTAX_OK`, `FIXTURE_OK`, `FIXTURE_OK_SECOND`, `truncated=no`, `exit=0`, `DIAG_OK`, `STDERR_OK` and `COMPARATOR_OK`. A `NO_COMMANDS` line means the fixture was written wrong: fix the fixture, not the runner.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
cat > "$PHASE/scratch/tools/run-scenario.sh" <<'SH'
#!/usr/bin/env bash
# Runs the scenario's own command blocks from the current directory. Every
# fenced block under the Commands heading is appended in order and runs in one
# shell, so variables set in step one stay defined for the later steps.
set -euo pipefail
scenario="$1"
out="$2"
mkdir -p "$(dirname "$out")"
awk '
  /^### Commands[[:space:]]*$/ { section = 1; next }
  section && /^### / { exit }
  section && /^```/ { block = !block; next }
  section && block { print }
' "$scenario" > "$out.cmd"
if [ ! -s "$out.cmd" ]; then
  printf 'NO_COMMANDS\n' > "$out"
  printf 'exit=90\n' >> "$out"
  exit 0
fi
rc=0
perl -e 'alarm shift; exec @ARGV' 1800 bash "$out.cmd" > "$out" 2>&1 || rc=$?
size=$(wc -c < "$out" | tr -d ' ')
if [ "$size" -gt 2097152 ]; then
  { head -c 2097152 "$out"; printf '\n[truncated]\n'; tail -n 200 "$out"; } > "$out.trunc"
  mv "$out.trunc" "$out"
  printf 'truncated=yes\n' >> "$out"
else
  printf 'truncated=no\n' >> "$out"
fi
printf 'exit=%s\n' "$rc" >> "$out"
exit 0
SH
chmod +x "$PHASE/scratch/tools/run-scenario.sh"
```

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
cat > "$PHASE/scratch/tools/check-run.cjs" <<'JS'
// Compares one captured run with the frozen patterns for its label. Every
// non-empty pattern must match, so a partial pass is never reported as a pass.
// The sidecar check file carries the full diagnosis, and a second file,
// <run>.stderr.txt, carries the failing line the fix brief quotes.
const fs = require('fs');

const [mapPath, label, runPath] = process.argv.slice(2);
if (!mapPath || !label || !runPath) {
  console.error('usage: check-run.cjs <scenarios.tsv> <label> <run-file>');
  process.exit(2);
}
const diagPath = runPath + '.check.txt';
const errPath = runPath + '.stderr.txt';
const row = fs.readFileSync(mapPath, 'utf8').split('\n').find((line) => line.startsWith(label + '\t'));
if (!row) {
  fs.writeFileSync(diagPath, 'result:FAIL\nmissing:row\nlast:\n');
  fs.writeFileSync(errPath, 'missing:row\n');
  console.log(`${label}\tFAIL\tmissing-row\t${runPath}`);
  process.exit(0);
}
const [, id, , passA, passB, passC] = row.split('\t');
const patterns = [passA, passB, passC].filter(Boolean);
const text = fs.readFileSync(runPath, 'utf8');
const exitLine = (text.match(/^exit=(\d+)$/m) || [, 'none'])[1];
const missing = exitLine === '142' ? 'exit=142' : patterns.find((pattern) => !new RegExp(pattern, 'm').test(text));
const truncated = /^truncated=yes$/m.test(text) ? 'yes' : 'no';
const lines = text.split('\n').filter((line) => line.trim() !== '' && !/^(exit|truncated)=/.test(line));
const last = lines.length > 0 ? lines[lines.length - 1] : '';
const diag = `result:${missing ? 'FAIL' : 'PASS'}\nmissing:${missing || 'none'}\nexit:${exitLine}\ntruncated:${truncated}\nlast:${last}\n`;
fs.writeFileSync(diagPath, diag);
fs.writeFileSync(errPath, missing ? `missing:${missing}\n` : '');
if (!missing) {
  console.log(`${label}\tPASS\t${id}\t${runPath}`);
} else {
  console.log(`${label}\tFAIL\t${id}\t${runPath}`);
  console.error(`missing:${missing}`);
}
JS
node --check "$PHASE/scratch/tools/check-run.cjs"
```

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
cat > "$PHASE/scratch/test/fixture-scenario.md" <<'MD'
# Fixture Scenario

## 3. TEST EXECUTION

### Commands

1. Set a value.

```bash
VALUE=FIXTURE_OK
echo "$VALUE"
```

2. Use the value in a second block.

```bash
echo "${VALUE}_SECOND"
```
MD
```

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
cat > "$PHASE/scratch/briefs/skeleton.txt" <<'TXT'
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a dispatched Task subagent. This repository's AGENTS.md treats a dispatched worker
as pre-resolved for the spec-folder question, and this prompt is that pre-resolution.

Your write authority is already bound. The spec folder is:
  specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE: You are a documentation author working in a disposable worktree. You write only the
paths named below and you run the verification command before you return.

ALLOWED WRITE PATHS:
  specs/zz-pb-card/ and everything under it

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, rm, mv, create.sh outside the task's stated command, generate-context.js,
/speckit:save, and any edit to a file not listed under ALLOWED WRITE PATHS.
TXT
```

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
bash -n "$PHASE/scratch/tools/run-scenario.sh"
echo SYNTAX_OK
bash "$PHASE/scratch/tools/run-scenario.sh" "$PHASE/scratch/test/fixture-scenario.md" "$PHASE/scratch/test/fixture-run.txt"
cat "$PHASE/scratch/test/fixture-run.txt"
printf 'S1\tfixture-id\t%s\tFIXTURE_OK\t\t\n' "$PHASE/scratch/test/fixture-scenario.md" > "$PHASE/scratch/test/fixture-map.tsv"
OUT=$(node "$PHASE/scratch/tools/check-run.cjs" "$PHASE/scratch/test/fixture-map.tsv" S1 "$PHASE/scratch/test/fixture-run.txt")
printf '%s\n' "$OUT"
test -s "$PHASE/scratch/test/fixture-run.txt.check.txt" && grep -q '^result:PASS$' "$PHASE/scratch/test/fixture-run.txt.check.txt" && echo DIAG_OK
test -f "$PHASE/scratch/test/fixture-run.txt.stderr.txt" && echo STDERR_OK
printf '%s' "$OUT" | grep -q '^S1\tPASS' && echo COMPARATOR_OK
```

- [ ] T009 Run scenarios S1 to S7 from their own command blocks (`scratch/runs/*.txt`, `scratch/results.tsv`). Run the block below from `RUNROOT`. It removes any old results file first, then runs each row whose label is not S8 from `$WT`. Each run is captured to `scratch/runs/<id>.txt` and the comparator writes a `.check.txt` sidecar beside it. Verify: `wc -l < "$PHASE/scratch/results.tsv"` prints `7` and `rg -c '^S[1-7]\t(PASS|FAIL|SCENARIO_DEFECT)\t' "$PHASE/scratch/results.tsv"` prints `7`. A `NO_COMMANDS` run is a scenario defect: the block writes `SCENARIO_DEFECT`, records it in `goal.md` section 4 and continues. A run that ends with `exit=142` hit the 30 minute alarm: record `FAIL` in the verdict page and run T011. Do not retype the scenario.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
: > "$PHASE/scratch/results.tsv"
while IFS=$'\t' read -r LABEL ID SCENARIO PASS_A PASS_B; do
  [ "$LABEL" = "S8" ] && continue
  ( cd "$WT" && bash "$PHASE/scratch/tools/run-scenario.sh" "$SCENARIO" "$PHASE/scratch/runs/$ID.txt" )
  if grep -q '^NO_COMMANDS$' "$PHASE/scratch/runs/$ID.txt"; then
    printf '%s\tSCENARIO_DEFECT\t%s\t%s\n' "$LABEL" "$ID" "$PHASE/scratch/runs/$ID.txt" >> "$PHASE/scratch/results.tsv"
    printf 'SCENARIO_DEFECT %s %s\n' "$LABEL" "$ID" >> "$PHASE/goal.md"
    continue
  fi
  node "$PHASE/scratch/tools/check-run.cjs" "$PHASE/scratch/scenarios.tsv" "$LABEL" "$PHASE/scratch/runs/$ID.txt" \
    >> "$PHASE/scratch/results.tsv"
done < "$PHASE/scratch/scenarios.tsv"
cat "$PHASE/scratch/results.tsv"
```

- [ ] T010 Run S8 as a DeepSeek authoring dispatch (`scratch/briefs/S8.txt`, `scratch/runs/<S8 id>.txt`). Read the shared skeleton, extract the scenario prompt, assemble the brief with the first block below, then dispatch it with the Task tool. Each worker reply is saved as `scratch/runs/<S8 id>.worker-<n>.txt` and the run file holds conductor-written lines only, so a `RESULT: PASSED` line inside the reply can never satisfy the S8 pattern. A provider error is retried once after 10 minutes, and a second failure marks S8 `ESCALATED`. Verify: `test -s "$PHASE/scratch/runs/$S8_ID.txt" && echo S8_RUN_OK` prints `S8_RUN_OK`, `rg -c '^RESULT: PASSED$' "$PHASE/scratch/runs/$S8_ID.txt"` prints `1`, `rg -c '^leftover_tokens 0$' "$PHASE/scratch/runs/$S8_ID.txt"` prints `1`, `rg -c '^dispatch_exit=0$' "$PHASE/scratch/runs/$S8_ID.txt"` prints `1` and `rg -c '^S8\tPASS\t' "$PHASE/scratch/results.tsv"` prints `1`. When the packet is missing, the worker did not follow the frozen path: append `S8 FAIL <S8 id> <run file>` as four tab-separated fields to the results file and run T011. When the second dispatch also fails, the block prints `S8_ESCALATED`, writes the first error line in `goal.md` section 4 and appends the `ESCALATED` row.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
S8_ID=$(awk -F'\t' '$1=="S8"{print $2}' "$PHASE/scratch/scenarios.tsv")
S8_FILE=$(awk -F'\t' '$1=="S8"{print $3}' "$PHASE/scratch/scenarios.tsv")
cat >> "$PHASE/scratch/env.sh" <<EOF
S8_ID="$S8_ID"
S8_FILE="$S8_FILE"
EOF
awk '/^### Prompt/{f=1;next} f&&/^```/{if(b){exit}else{b=1;next}} f&&b{print}' "$S8_FILE" > "$PHASE/scratch/briefs/S8-prompt.txt"
test -s "$PHASE/scratch/briefs/skeleton.txt" && echo SKELETON_OK
{
  cat "$PHASE/scratch/briefs/skeleton.txt"
  printf '\nTASK: Author one Level 1 spec packet from the authoring card, following the scenario\nprompt below exactly.\n\n'
  printf 'Work only inside the disposable worktree at %s and run every command from that directory.\n\n' "$WT"
  cat "$PHASE/scratch/briefs/S8-prompt.txt"
  printf '\n\nSteps:\n1. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md once.\n2. Run: bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-pb-card --short-name card-authoring --number 1 "Author a Level 1 packet from the card"\n3. Fill spec.md, plan.md, tasks.md and implementation-summary.md for this feature: add a --quiet flag to .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh that prints only the final recommended-level line.\n4. Run: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-pb-card/001-card-authoring --strict\n5. Fix what it reports and run it again, at most three times in all.\n\nRETURN exactly one line: the folder path, then the last RESULT line validate.sh printed.\n'
} > "$PHASE/scratch/briefs/S8.txt"
test -s "$PHASE/scratch/briefs/S8.txt" && echo S8_BRIEF_OK
```

Dispatch attempt 1 with the Task tool: subagent_type `general`, description `S8`, prompt = the full text of
`$PHASE/scratch/briefs/S8.txt`. When the subagent returns, write its final reply verbatim to
`$PHASE/scratch/runs/$S8_ID.worker-1.txt` with the write tool. A provider error is retried once after
10 minutes as attempt 2, with its reply written to `$PHASE/scratch/runs/$S8_ID.worker-2.txt`.

When attempt 1 ends in a provider error, run this block before attempt 2. It prints `RETRY_DELAY_DONE` after 10 minutes.

```bash
sleep 600
echo RETRY_DELAY_DONE
```

Then set `ATTEMPT` to the attempt that produced a reply and run the block below.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
ATTEMPT=${ATTEMPT:-1}
WORKER="$PHASE/scratch/runs/$S8_ID.worker-$ATTEMPT.txt"
if [ -s "$WORKER" ] && ! rg -qi 'provider|rate limit|overloaded|unavailable|timeout|503|529' "$WORKER"; then RC=0; else RC=1; fi
P="$WT/specs/zz-pb-card/001-card-authoring"
LEFT=unknown
{
  printf 'dispatch_exit=%s\n' "$RC"
  printf 'dispatch_attempts=%s\n' "$ATTEMPT"
  echo "--- conductor validation ---"
  if [ -d "$P" ]; then
    ( cd "$WT" && bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict ) 2>&1
    LEFT=$(rg -o 'YOUR_VALUE_HERE:|NEEDS CLARIFICATION:' "$P" 2>/dev/null | wc -l | tr -d ' ')
    printf 'leftover_tokens %s\n' "$LEFT"
  else
    echo "MISSING $P"
    echo "leftover_tokens unknown"
  fi
  echo "--- end conductor validation ---"
} > "$PHASE/scratch/runs/$S8_ID.txt"
rm -r "$WT/specs/zz-pb-card" 2>/dev/null || true
[ ! -d "$WT/specs/zz-pb-card" ] && echo "cleanup=ok" >> "$PHASE/scratch/runs/$S8_ID.txt"
awk -F'\t' '$1 != "S8"' "$PHASE/scratch/results.tsv" > "$PHASE/scratch/results.tmp"
mv "$PHASE/scratch/results.tmp" "$PHASE/scratch/results.tsv"
LINE=$(node "$PHASE/scratch/tools/check-run.cjs" "$PHASE/scratch/scenarios.tsv" S8 "$PHASE/scratch/runs/$S8_ID.txt")
if [ "$RC" -eq 0 ] && [ "$LEFT" = "0" ] && printf '%s' "$LINE" | grep -q 'PASS'; then
  printf '%s\n' "$LINE" >> "$PHASE/scratch/results.tsv"
  echo S8_PASS
elif [ "$RC" -ne 0 ]; then
  printf 'S8\tESCALATED\t%s\t%s\n' "$S8_ID" "$WORKER" >> "$PHASE/scratch/results.tsv"
  ERR=$(rg -m1 -i 'provider|rate limit|overloaded|unavailable|timeout|503|529' "$WORKER" | cut -c1-200)
  printf 'S8 ESCALATED provider error after %s dispatch attempts: %s\n' "$ATTEMPT" "$ERR" >> "$PHASE/goal.md"
  echo S8_ESCALATED
else
  printf 'S8\tFAIL\t%s\t%s\n' "$S8_ID" "$PHASE/scratch/runs/$S8_ID.txt" >> "$PHASE/scratch/results.tsv"
  echo "leftover_tokens=$LEFT"
fi
tail -1 "$PHASE/scratch/results.tsv"
```

- [ ] T011 Fix one failed scenario, one file, at most three attempts (`scratch/fix/<label>-<n>.txt`). Run this task only for a `FAIL` row. Set `LABEL` from that row before the first block. The first block reads the fix target from the scenario's `## 4. SOURCE FILES` list, quotes the failing line from the run's `.stderr.txt` file and writes the next attempt brief. Dispatch that brief with the Task tool, then run the second block to rerun the scenario and record the attempt. Repeat the two blocks only while the row is still `FAIL`, so `N` advances only after a failed rerun and the loop stops at the first PASS. Verify: the first block prints `FIX_TARGET=<the one repo-relative file the scenario names>` and `ATTEMPT=<n>`, the second block prints one `attempt=<n> verdict=<value>` line per attempt, `test -s "$PHASE/scratch/fix/$LABEL-1.txt" && echo FIX_OK` prints `FIX_OK`, `grep -c 'ALLOWED WRITE PATHS' "$PHASE/scratch/fix/$LABEL-1.txt"` prints `1` and `find "$PHASE/scratch/fix" -name "$LABEL-*.txt" | wc -l` prints `1` to `3`. After the third failed attempt the row reads `ESCALATED` and the other scenarios continue. When the scenario has no `- Implementation:` bullet, the first block writes `SCENARIO_DEFECT` and prints `SCENARIO_DEFECT <label>`.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
ROW=$(awk -F'\t' -v l="$LABEL" '$1==l{print; exit}' "$PHASE/scratch/results.tsv")
VERDICT=$(printf '%s' "$ROW" | cut -f2)
ID=$(printf '%s' "$ROW" | cut -f3)
RUN=$(printf '%s' "$ROW" | cut -f4)
SCENARIO=$(awk -F'\t' -v l="$LABEL" '$1==l{print $3}' "$PHASE/scratch/scenarios.tsv")
LINK=$(awk '/^## 4\. SOURCE FILES$/{f=1;next} f&&/^## /{exit} f&&/^- Implementation:/{if (match($0,/\]\([^)]+\)/)){print substr($0,RSTART+2,RLENGTH-3); exit}}' "$SCENARIO")
FILE=$(node -e 'const p=require("path"); const [root,s,l]=process.argv.slice(1); console.log(p.relative(root, p.resolve(p.dirname(s), l)))' "$RUNROOT" "$SCENARIO" "$LINK")
if [ -z "$FILE" ]; then
  NEW=$(printf '%s\t%s\t%s\t%s' "$LABEL" "SCENARIO_DEFECT" "$ID" "$RUN")
  awk -F'\t' -v l="$LABEL" -v row="$NEW" 'BEGIN{OFS="\t"} $1==l{print row; next}{print}' "$PHASE/scratch/results.tsv" > "$PHASE/scratch/results.tmp"
  mv "$PHASE/scratch/results.tmp" "$PHASE/scratch/results.tsv"
  echo "SCENARIO_DEFECT $LABEL"
  exit 0
fi
[ "$VERDICT" = "FAIL" ] || { echo "NO_FAIL_ROW $LABEL $VERDICT"; exit 0; }
N=$(( $(find "$PHASE/scratch/fix" -name "$LABEL-*.txt" | wc -l | tr -d ' ') + 1 ))
[ "$N" -le 3 ] || { echo "ATTEMPTS_EXHAUSTED $LABEL"; exit 0; }
FAIL_LINE=$(cat "$RUN.stderr.txt")
PASS_LINE=$(grep -m1 '^- \*\*Pass\*\*:' "$SCENARIO")
sed "s|  specs/zz-pb-card/ and everything under it|  $FILE|" "$PHASE/scratch/briefs/skeleton.txt" > "$PHASE/scratch/fix/$LABEL-$N.txt"
printf '\nTASK: Scenario %s failed at %s.\nThe captured run is %s. The comparator wrote:\n%s\nThe scenario pass criterion is:\n%s\nWork only inside the disposable worktree at %s and run every command from that directory.\nChange only the single file named under ALLOWED WRITE PATHS so that the scenario\npasses. Do not edit the scenario file. Do not edit any other file.\nThe conductor reruns the scenario after you return.\nRETURN exactly one line: FIXED <the file> or BLOCKED <the reason>\n' \
  "$LABEL" "$ID" "$RUN" "$FAIL_LINE" "$PASS_LINE" "$WT" >> "$PHASE/scratch/fix/$LABEL-$N.txt"
printf 'FIX_TARGET=%s\n' "$FILE"
printf 'ATTEMPT=%s\n' "$N"
printf 'BRIEF=%s\n' "$PHASE/scratch/fix/$LABEL-$N.txt"
```

Dispatch that brief with the Task tool: subagent_type `general`, description `FIX-$LABEL-$N`, prompt = the full text of
`$PHASE/scratch/fix/$LABEL-$N.txt`. When the subagent returns, write its final reply verbatim to
`$PHASE/scratch/runs/$ID.fix-$N.reply.txt` with the write tool. Then run the block below. Repeat the
first block, the dispatch and the block below only while the row is still `FAIL`, up to three
attempts in all.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
ROW=$(awk -F'\t' -v l="$LABEL" '$1==l{print; exit}' "$PHASE/scratch/results.tsv")
ID=$(printf '%s' "$ROW" | cut -f3)
SCENARIO=$(awk -F'\t' -v l="$LABEL" '$1==l{print $3}' "$PHASE/scratch/scenarios.tsv")
N=$(find "$PHASE/scratch/fix" -name "$LABEL-*.txt" | wc -l | tr -d ' ')
[ "$N" -ge 1 ] || { echo "NO_BRIEF $LABEL"; exit 0; }
LATEST="$PHASE/scratch/runs/$ID.fix-$N.txt"
( cd "$WT" && bash "$PHASE/scratch/tools/run-scenario.sh" "$SCENARIO" "$LATEST" )
LINE=$(node "$PHASE/scratch/tools/check-run.cjs" "$PHASE/scratch/scenarios.tsv" "$LABEL" "$LATEST")
printf '%s\n' "$LINE"
if printf '%s' "$LINE" | grep -q 'PASS'; then
  VERDICT=FIXED
elif [ "$N" -ge 3 ]; then
  VERDICT=ESCALATED
else
  VERDICT=FAIL
fi
NEW=$(printf '%s\t%s\t%s\t%s' "$LABEL" "$VERDICT" "$ID" "$LATEST")
awk -F'\t' -v l="$LABEL" -v row="$NEW" 'BEGIN{OFS="\t"} $1==l{print row; next}{print}' "$PHASE/scratch/results.tsv" > "$PHASE/scratch/results.tmp"
mv "$PHASE/scratch/results.tmp" "$PHASE/scratch/results.tsv"
printf 'attempt=%s verdict=%s\n' "$N" "$VERDICT"
test -s "$PHASE/scratch/fix/$LABEL-1.txt" && echo FIX_OK
```

- [ ] T012 Build the verdict page (`scratch/results.tsv`, `scratch/verdicts.md`). Run the block below. Verify: `rg -c '^\| S[1-8] \|' "$PHASE/scratch/verdicts.md"` prints `8`, `wc -l < "$PHASE/scratch/results.tsv"` prints `8` and `awk -F'\t' '{print $2}' "$PHASE/scratch/results.tsv" | grep -cvE '^(PASS|FAIL|FIXED|ESCALATED|SCENARIO_DEFECT)$'` prints `0`, which means every verdict uses the one status vocabulary.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
{
  echo "# Phase 8 scenario verdicts"
  echo
  echo "| S | Playbook ID | Verdict | Evidence |"
  echo "|---|---|---|---|"
  awk -F'\t' '{printf "| %s | %s | %s | `%s` |\n", $1, $3, $2, $4}' "$PHASE/scratch/results.tsv"
} > "$PHASE/scratch/verdicts.md"
cat "$PHASE/scratch/verdicts.md"
```

- [ ] T013 Build the report package (`$REPORT`). Run the block below. It first inspects the newest existing `manual-testing-playbook` report folder, then picks a new dated folder, writes `results.csv`, one outcome JSON per scenario, `source.md` and the ten-section `README.md`. Verify: the block prints `EXISTING_REPORT=<path>`, `PRESENT README.md`, `PRESENT results.csv`, `PRESENT source.md`, `PRESENT outcomes` and the `scenario_id,runtime,run,evidence_class,verdict` header, then `find "$REPORT" -maxdepth 1 -type f | wc -l` prints `3`, `find "$REPORT/outcomes" -name '*.json' | wc -l` prints `8`, `wc -l < "$REPORT/results.csv"` prints `9` and `rg -c '^## [0-9]+\. ' "$REPORT/README.md"` prints `10`. When a report folder with today's name already exists, the block appends `-2`, `-3` and so on. Do not overwrite an older folder.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
EXISTING=$(find "$RUNROOT/$S/benchmark/reports" -maxdepth 1 -type d -name '20*--manual-testing-playbook--*' | sort | tail -1)
printf 'EXISTING_REPORT=%s\n' "$EXISTING"
for F in README.md results.csv source.md outcomes; do
  test -e "$EXISTING/$F" && printf 'PRESENT %s\n' "$F"
done
head -1 "$EXISTING/results.csv"
RUN_DATE=$(date +%F)
FOLDER="$RUN_DATE--manual-testing-playbook--weak-model-authoring"
REPORT="$RUNROOT/$S/benchmark/reports/$FOLDER"
N=2
while [ -d "$REPORT" ]; do
  FOLDER="$RUN_DATE--manual-testing-playbook--weak-model-authoring-$N"
  REPORT="$RUNROOT/$S/benchmark/reports/$FOLDER"
  N=$((N + 1))
done
mkdir -p "$REPORT/outcomes"
cat >> "$PHASE/scratch/env.sh" <<EOF
RUN_DATE="$RUN_DATE"
FOLDER="$FOLDER"
REPORT="$REPORT"
EOF
printf 'scenario_id,runtime,run,evidence_class,verdict\n' > "$REPORT/results.csv"
awk -F'\t' '{v=$2; if (v=="FIXED") v="PASS"; else if (v=="ESCALATED" || v=="SCENARIO_DEFECT") v="FAIL"; printf "%s,conductor,1,manual-testing-playbook,%s\n", $3, v}' "$PHASE/scratch/results.tsv" >> "$REPORT/results.csv"
while IFS=$'\t' read -r LABEL VERDICT ID RUN; do
  BYTES=$(wc -c < "$RUN" | tr -d ' ')
  SHA=$(shasum -a 256 "$RUN" | awk '{print $1}')
  REL=$(printf '%s' "$RUN" | sed "s|^$RUNROOT/||")
  OUT_VERDICT="$VERDICT"
  [ "$VERDICT" = "FIXED" ] && OUT_VERDICT=PASS
  case "$VERDICT" in ESCALATED|SCENARIO_DEFECT) OUT_VERDICT=FAIL ;; esac
  REASON="Every non-empty frozen pass pattern matched the captured run."
  [ "$VERDICT" = "FIXED" ] && REASON="The first captured run failed and a rerun after one fix matched its frozen patterns."
  [ "$VERDICT" = "FAIL" ] && REASON="The captured run did not match its frozen pass pattern. The run file holds the failing output."
  [ "$VERDICT" = "ESCALATED" ] && REASON="Three fix attempts did not pass. The scenario is escalated to the operator."
  [ "$VERDICT" = "SCENARIO_DEFECT" ] && REASON="The scenario file could not be executed as written. Escalated to the phase 007 owner."
  [ "$(grep -c '^truncated:yes$' "$RUN.check.txt" 2>/dev/null || true)" = "1" ] && REASON="$REASON The run file was truncated to its first 2 MB and last 200 lines."
  cat > "$REPORT/outcomes/$ID.json" <<JSON
{
  "scenarioId": "$ID",
  "runtime": "conductor",
  "evidenceClass": "manual-testing-playbook",
  "verdict": "$OUT_VERDICT",
  "reason": "$REASON",
  "executionContext": {
    "evidenceRoot": ".",
    "requireDurableEvidence": true
  },
  "supersedes": [],
  "providerModel": null,
  "dispatchModel": "llmgateway/deepseek-v4.1-flash-1017#max",
  "runs": [
    {
      "run": "1",
      "verdict": "$OUT_VERDICT",
      "reason": "$REASON",
      "operatorInputs": "None.",
      "evidence": [
        {
          "path": "$REL",
          "bytes": $BYTES,
          "sha256": "$SHA"
        }
      ]
    }
  ],
  "evidence": [
    {
      "path": "$REL",
      "bytes": $BYTES,
      "sha256": "$SHA"
    }
  ]
}
JSON
done < "$PHASE/scratch/results.tsv"
cat > "$REPORT/source.md" <<MD
# system-spec-kit Benchmark Sources

> system-spec-kit · manual-testing-playbook · weak-model authoring

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives.

| Resource | Purpose |
|---|---|
| Target skill | \`.skilled/skills/system-spec-kit\` |
| Scenarios | the eight files in \`$PHASE/scratch/scenarios.tsv\` |
| Execution host | disposable worktree \`$WT\` on \`$WT_BRANCH\` |
| Base ref | \`$BASE_REF\` |
| Run files | \`$PHASE/scratch/runs/\`, one per playbook id |
| Verdict page | \`$PHASE/scratch/verdicts.md\` |
| Source packet | \`specs/system-spec-kit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/\` |

---

## 2. BOUNDARY

The corpus is an input and is never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.

Last updated $RUN_DATE.
MD
{
  echo "# $FOLDER"
  echo
  echo "> system-spec-kit · manual-testing-playbook · eight scenarios · weak-model authoring"
  echo
  echo "---"
  echo
  echo "## 1. HEADLINE / OVERVIEW"
  echo
  echo "Verdict: $(awk -F'\t' '$2=="PASS" || $2=="FIXED" {p++} END {print (p==8 ? "PASS" : (p==0 ? "FAIL" : "PASS WITH ESCALATIONS"))}' "$PHASE/scratch/results.tsv")."
  echo
  echo "Eight scenarios from phase 007 ran on a disposable worktree built from \`$BASE_REF\`. $(awk -F'\t' '$2=="PASS" || $2=="FIXED" {p++} END {print p+0}' "$PHASE/scratch/results.tsv") passed and $(awk -F'\t' '$2=="FAIL" || $2=="ESCALATED" || $2=="SCENARIO_DEFECT" {p++} END {print p+0}' "$PHASE/scratch/results.tsv") need attention."
  echo
  echo "## 2. AGGREGATE RESULTS"
  echo
  echo "| S | Playbook ID | Verdict | Evidence |"
  echo "|---|---|---|---|"
  awk -F'\t' '{printf "| %s | %s | %s | `%s` |\n", $1, $3, $2, $4}' "$PHASE/scratch/results.tsv"
  echo
  echo "## 3. METHODOLOGY"
  echo
  echo "One disposable worktree was created through the sk-git allocator from \`$BASE_REF\`. The allocator installed its own dependency trees and build. Each scenario ran from its own \`### Commands\` block, captured to one file, and compared to its frozen patterns. S8 ran one DeepSeek dispatch on \`llmgateway/deepseek-v4.1-flash-1017#max\`."
  echo
  echo "## 4. PER-CANDIDATE PROFILES"
  echo
  echo "| S | Candidate | Command source | Pass pattern |"
  echo "|---|---|---|---|"
  awk -F'\t' '{printf "| %s | %s | `%s` | `%s` |\n", $1, $3, $3".txt", $4}' "$PHASE/scratch/scenarios.tsv"
  echo
  echo "## 5. PROCESS NOTES"
  echo
  echo "Fix attempts are recorded in \`scratch/fix/\`. A row marked FIXED passed on a rerun after one fix. A row marked ESCALATED failed three attempts. No scenario was retyped by the conductor."
  echo
  echo "## 6. FINDINGS"
  echo
  echo "The load-bearing result is the per-scenario verdict in section 2. A pass means the scenario's own commands produced its own criterion on a tree that holds phases 002 to 007."
  echo
  echo "## 7. CAVEATS"
  echo
  echo "Each scenario ran once. S8 sampled one model, not a model comparison. The result is pinned to \`$BASE_REF\` and does not describe a later tree."
  echo
  echo "## 8. RECOMMENDATIONS"
  echo
  echo "Tier 1: apply a fix that made a scenario pass, if any. Tier 2: validate a scenario defect with the phase 007 owner. Tier 3: extend the run to a second model in a later packet."
  echo
  echo "## 9. REPRODUCIBILITY"
  echo
  echo '```bash'
  echo "bash .skilled/skills/sk-git/scripts/worktree-naming.sh create playbook-run $BASE_REF"
  echo "bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision <the printed directory>"
  echo "bash specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/tools/run-scenario.sh <scenario file> <out file>"
  echo '```'
  echo
  echo "Expected wall clock: 4 to 8 hours including provisioning."
  echo
  echo "## 10. CROSS-LINKS"
  echo
  echo "Phase folder: \`specs/system-spec-kit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/\`"
  echo
  echo "Parent packet: \`specs/system-spec-kit/054-weak-model-spec-authoring/\`"
  echo
  echo "| File | Contents |"
  echo "|---|---|"
  echo "| \`results.csv\` | One row per scenario |"
  echo "| \`outcomes/\` | One outcome JSON per scenario |"
  echo "| \`source.md\` | Where the raw evidence lives |"
} > "$REPORT/README.md"
cat "$REPORT/README.md"
```

- [ ] T014 Add the reports index row (`.skilled/skills/system-spec-kit/benchmark/reports/README.md`). Run the block below. It prints the row, inserts it after the header separator and prints `1`. Verify: `rg -c "$FOLDER" "$RUNROOT/$S/benchmark/reports/README.md"` prints `1`. When it prints `2`, the row was already added: remove the duplicate by hand and record it in `goal.md` section 4.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
P=$(awk -F'\t' '$2=="PASS" || $2=="FIXED" {n++} END {print n+0}' "$PHASE/scratch/results.tsv")
F=$(awk -F'\t' '$2=="FAIL" || $2=="ESCALATED" || $2=="SCENARIO_DEFECT" {n++} END {print n+0}' "$PHASE/scratch/results.tsv")
if [ "$P" -eq 8 ]; then VERDICT="PASS"; elif [ "$F" -eq 0 ]; then VERDICT="PASS (after fixes)"; else VERDICT="FAIL"; fi
ROW=$(printf '| %s | [`%s/`](./%s/) | conductor manual-testing-playbook | %s PASS, %s FAIL | **%s** | `manual-testing-playbook` |' "$RUN_DATE" "$FOLDER" "$FOLDER" "$P" "$F" "$VERDICT")
printf '%s\n' "$ROW"
INDEX="$RUNROOT/$S/benchmark/reports/README.md"
awk -v row="$ROW" '
  index($0, "|---|---|---|---|---|---|") == 1 && !done { print; print row; done=1; next }
  { print }
' "$INDEX" > "$PHASE/scratch/reports-index.tmp"
mv "$PHASE/scratch/reports-index.tmp" "$INDEX"
rg -c "$FOLDER" "$INDEX"
```

- [ ] T015 Check the primary checkout (`scratch/primary-status.txt`). Run the block below. It compares the current status with the baseline T003 saved. Verify: `grep -c '^PRIMARY_CLEAN$' "$PHASE/scratch/primary-status.txt"` prints `1`. When a path is listed, stop the phase and record it in `goal.md` section 4. Do not remove the path by hand.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
if [ "$RUNROOT" = "$MAIN" ]; then
  BASE="$PHASE/scratch/status-start.txt"
else
  BASE="$PHASE/scratch/status-main-start.txt"
fi
git -C "$MAIN" status --porcelain --untracked-files=all > "$PHASE/scratch/primary-status-now.txt"
{
  diff "$BASE" "$PHASE/scratch/primary-status-now.txt" | grep '^>' | sed 's/^> .. //' | rg -v "^(specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/|\.skilled/skills/system-spec-kit/benchmark/reports/$FOLDER/|\.skilled/skills/system-spec-kit/benchmark/reports/README\.md$)" || true
} > "$PHASE/scratch/primary-status.txt"
if [ -s "$PHASE/scratch/primary-status.txt" ]; then
  cat "$PHASE/scratch/primary-status.txt"
else
  echo PRIMARY_CLEAN > "$PHASE/scratch/primary-status.txt"
  cat "$PHASE/scratch/primary-status.txt"
fi
```

- [ ] T016 Save the worktree diff, check the evidence and remove the disposable worktree and its branch (`scratch/fixes/fix.patch`, `scratch/fixes/status.txt`, `scratch/worktree/removal.txt`). Run the block below. It prints `RUNS_RECORDED 8` only when eight verdict rows exist and every evidence file is non-empty. It then saves the worktree diff and status, writes `PATCHED` or `UNPATCHED` for every changed path and prints `PATCH_GATE_COVERED` when the two counts agree. Verify: the block prints `SCRATCH_CLEAN`, `PATCH_SAVED`, `STATUS_SAVED`, `RUNS_RECORDED 8`, `PATCH_GATE_COVERED`, `REMOVAL_OK`, `WORKTREE_GONE` and `BRANCH_GONE`. It clears untracked output under `$WT/scratch/` before it saves the status, so a scratch artifact cannot read `UNPATCHED`. A `NO_ROWS`, `EMPTY <label>` or `UNPATCHED <path>` line stops the removal with `REMOVAL_REFUSED`, keeps the worktree and must be recorded in `goal.md` section 4. The rollback sentence is in `plan.md` section 7. Removal is irreversible for uncommitted files in the worktree.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
mkdir -p "$PHASE/scratch/fixes"
git -C "$WT" clean -fd -- scratch > "$PHASE/scratch/fixes/scratch-clean.txt" 2>&1 || true
echo SCRATCH_CLEAN
{
  ROWS=$(wc -l < "$PHASE/scratch/results.tsv" | tr -d ' ')
  [ "$ROWS" = "8" ] && echo "RUNS_RECORDED 8" || echo "NO_ROWS $ROWS"
  while IFS=$'\t' read -r LABEL VERDICT ID RUN; do
    test -s "$RUN" || echo "EMPTY $LABEL"
  done < "$PHASE/scratch/results.tsv"
} > "$PHASE/scratch/worktree/evidence-before-remove.txt"
git -C "$WT" diff > "$PHASE/scratch/fixes/fix.patch" && echo PATCH_SAVED
git -C "$WT" status --porcelain > "$PHASE/scratch/fixes/status.txt" && echo STATUS_SAVED
: > "$PHASE/scratch/fixes/gate.txt"
while read -r XY PATHSPEC; do
  [ -z "${PATHSPEC:-}" ] && continue
  if grep -qF "diff --git a/$PATHSPEC b/$PATHSPEC" "$PHASE/scratch/fixes/fix.patch"; then
    printf 'PATCHED %s\n' "$PATHSPEC" >> "$PHASE/scratch/fixes/gate.txt"
  else
    printf 'UNPATCHED %s\n' "$PATHSPEC" >> "$PHASE/scratch/fixes/gate.txt"
  fi
done < "$PHASE/scratch/fixes/status.txt"
STATUS_N=$(grep -c . "$PHASE/scratch/fixes/status.txt" || true)
PATCHED_N=$(grep -c '^PATCHED ' "$PHASE/scratch/fixes/gate.txt" || true)
[ "$STATUS_N" = "$PATCHED_N" ] && echo PATCH_GATE_COVERED >> "$PHASE/scratch/fixes/gate.txt"
{
  cat "$PHASE/scratch/worktree/evidence-before-remove.txt"
  cat "$PHASE/scratch/fixes/gate.txt"
  if rg -q '^(NO_ROWS|EMPTY|UNPATCHED) ' "$PHASE/scratch/worktree/evidence-before-remove.txt" "$PHASE/scratch/fixes/gate.txt"; then
    echo REMOVAL_REFUSED
    exit 1
  fi
  if ! rg -q '^PATCH_GATE_COVERED$' "$PHASE/scratch/fixes/gate.txt"; then
    echo REMOVAL_REFUSED
    exit 1
  fi
  echo REMOVAL_OK
  git -C "$RUNROOT" worktree remove --force "$WT"
  git -C "$RUNROOT" branch -D "$WT_BRANCH"
  test ! -d "$WT" && echo WORKTREE_GONE
  git -C "$RUNROOT" branch --list "$WT_BRANCH" | grep -q . || echo BRANCH_GONE
} 2>&1 | tee "$PHASE/scratch/worktree/removal.txt"
```
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Frontier review of the report and the runs (`scratch/review/T017.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first. Write the brief with the first block and send it with the second. Verify: `test -s "$PHASE/scratch/review/T017.txt" && echo REVIEW_FILE_OK` prints `REVIEW_FILE_OK` and `grep -cvE '^(P0|P1|P2) |^NO FINDINGS$' "$PHASE/scratch/review/T017.txt"` prints `0`, which means every line is a finding or the file holds the single line `NO FINDINGS`.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
mkdir -p "$PHASE/scratch/review"
cat > "$PHASE/scratch/review/T017-brief.txt" <<TXT
You are a read-only reviewer. Do not edit, create or delete any file.
Read the report folder $REPORT and every run file under $PHASE/scratch/runs/.
For each scenario, check:
(1) the captured run matches the verdict in results.csv,
(2) the pass pattern in $PHASE/scratch/scenarios.tsv is present in the run,
(3) a FIXED or ESCALATED row has the fix brief and the rerun it names.
Check that $PHASE/scratch/primary-status.txt shows no path outside the allowed set.
Check that $PHASE/scratch/worktree/removal.txt recorded REMOVAL_OK only after every changed path appeared in scratch/fixes/fix.patch.
Return one line per finding in this form, and nothing else:
P0|P1|P2 <file>:<line> | <what is wrong> | <the fix>
Return the single line NO FINDINGS when there are none.
TXT
```

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
AI_SESSION_CHILD=1 codex -a never exec \
  --model gpt-6-luna \
  -c model_reasoning_effort="max" \
  -c service_tier="fast" \
  --sandbox read-only \
  -o "$PHASE/scratch/review/T017.txt" \
  "$(cat "$PHASE/scratch/review/T017-brief.txt")" </dev/null
```

- [ ] T018 Apply the review findings (`scratch/review/T017.txt`, `goal.md`). Run the first block to number every finding as `F01`, `F02` and so on. For each line it prints, apply the fix when the finding names a file in this phase folder or the report folder, otherwise record it. Write one plain line per finding in `goal.md` section 4, not a table row, as `T018-APPLIED F<n>` or `T018-RECORDED F<n> <reason>`, using the finding's own fix text as the reason. When T017 holds `NO FINDINGS`, write `T018 NO FINDINGS` in `goal.md` section 4. Then run the second block. Verify: the first block prints one `F<n>` line per finding and nothing for `NO FINDINGS`, the second block prints `findings=<the first block's line count>` and `unrecorded=0`, and `grep -cE '^T018-(APPLIED|RECORDED) ' "$PHASE/goal.md"` equals the finding count. Do not edit a scenario file or a product file.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
awk 'BEGIN{n=0} /^(P0|P1|P2) /{n++; printf "F%02d\t%s\n", n, $0}' "$PHASE/scratch/review/T017.txt" > "$PHASE/scratch/review/T018-findings.tsv"
cat "$PHASE/scratch/review/T018-findings.tsv"
```

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
awk -F'\t' 'FILENAME == ARGV[1] { need[$1] = 1; next }
  /T018-(APPLIED|RECORDED) / {
    if (match($0, /T018-(APPLIED|RECORDED) F[0-9]+/)) {
      token = substr($0, RSTART, RLENGTH)
      split(token, parts, " ")
      done[parts[2]] = 1
    }
  }
  END { n = 0; u = 0; for (id in need) { n++; if (!(id in done)) u++ } printf "findings=%d\nunrecorded=%d\n", n, u }' \
  "$PHASE/scratch/review/T018-findings.tsv" "$PHASE/goal.md"
```

- [ ] T019 Close the phase (this folder). Run the block below, then compare its status output with `scratch/status-start.txt`. Fill `implementation-summary.md` and mark each `acceptance-criteria.md` row. Verify: `validate.sh` prints `RESULT: PASSED` and `rg -c '^\| AC-[0-9]+ .*\| Unmet \|' "$PHASE/acceptance-criteria.md"` prints nothing. Record the report tally and the review result in `goal.md` section 4.

```bash
cd "$(git rev-parse --show-toplevel)"
RUNROOT="$(git rev-parse --show-toplevel)"
PHASE="$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
source "$PHASE/scratch/env.sh"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PHASE" --strict
git -C "$RUNROOT" status --porcelain
```
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or `[B]` with a recorded blocker
- [ ] No `[B]` blocked task without a line in `goal.md` section 4
- [ ] Every acceptance criterion marked `Met` with its evidence
- [ ] Every scenario has one of the five verdict values: `PASS`, `FAIL`, `FIXED`, `ESCALATED` or `SCENARIO_DEFECT`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the scenario map, the report contract and the AI execution protocol
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

- [ ] CHK-001 [P0] Phase 007 is closed and every launch precondition is recorded as met
- [ ] CHK-002 [P0] `BASE_REF` resolves and contains the card, both guard scripts and the v2.3 stamp
- [ ] CHK-003 [P1] Every brief is saved under `scratch/briefs/` before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `run-scenario.sh` passes `bash -n` and `check-run.cjs` passes `node --check`
- [ ] CHK-011 [P0] No scenario command was retyped by the conductor
- [ ] CHK-012 [P1] No file under `.skilled/` was edited by hand
- [ ] CHK-013 [P1] Every fix brief names exactly one ALLOWED WRITE PATH
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Eight run files exist and eight verdict rows exist
- [ ] CHK-022 [P1] A run that hit the 30 minute alarm is recorded with its `exit=142` line and `FAIL`
- [ ] CHK-023 [P1] The fixture test proves the extractor and comparator before the first real run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every `FAIL` row has a fix brief and a rerun, or an `ESCALATED` row after three attempts
- [ ] CHK-FIX-002 [P0] Each fix brief limits writes to the one file the scenario's `## 4. SOURCE FILES` list names
- [ ] CHK-FIX-003 [P1] A `SCENARIO_DEFECT` row is escalated to phase 007 and no scenario file is edited
- [ ] CHK-FIX-004 [P1] The report `results.csv` matches `scratch/results.tsv` row for row
- [ ] CHK-FIX-005 [P1] The reports index holds exactly one row for the new folder
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief contains a credential, a token or a key
- [ ] CHK-031 [P0] Every worker was one Task subagent and its brief states that the spec-folder question is pre-resolved
- [ ] CHK-032 [P1] No worker wrote outside the disposable worktree
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` agree on the eight scenarios and the report shape
- [ ] CHK-041 [P1] `goal.md` section 4 records `BASE_REF`, the worktree pair, every verdict and every escalation
- [ ] CHK-042 [P2] `source.md` names every run file
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files are under this phase's `scratch/` only
- [ ] CHK-051 [P1] The disposable worktree does not exist at phase close
- [ ] CHK-052 [P1] The primary checkout gate prints `PRIMARY_CLEAN`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 24 | 0/24 |
| P2 Items | 9 | 0/9 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001, ADR-002, ADR-003 and ADR-004 in `plan.md` are followed by T008 to T013
- [ ] CHK-101 [P1] Every ADR has status Accepted
- [ ] CHK-102 [P1] Each ADR names the alternative it rejected and why
- [ ] CHK-103 [P2] No database migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Each scenario returned within 30 minutes or ended with its `exit=142` alarm line
- [ ] CHK-111 [P1] Provisioning time is recorded in `goal.md` section 4
- [ ] CHK-112 [P2] No load test applies to this phase
- [ ] CHK-113 [P2] The report's expected wall clock matches the observed range
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] The removal block ran and its output is saved
- [ ] CHK-121 [P0] Nothing outside the allowed set changed in the primary checkout
- [ ] CHK-122 [P1] Phase 009 can start: the report folder and `results.csv` exist
- [ ] CHK-123 [P1] `goal.md` section 4 names the next phase as ready
- [ ] CHK-124 [P2] No deployment applies to this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] The frontier review ran read-only and its reply is saved
- [ ] CHK-131 [P1] No new dependency was added to a manifest
- [ ] CHK-132 [P2] No user data is handled by this phase
- [ ] CHK-133 [P2] No OWASP surface is touched by this phase
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] The six phase documents agree at close
- [ ] CHK-141 [P1] `implementation-summary.md` cites the report folder and the eight verdicts
- [ ] CHK-142 [P2] No user-facing documentation changes outside the report
- [ ] CHK-143 [P2] The report names the exact `BASE_REF`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Pending | |
| Frontier reviewer | Reads the report read-only | Pending | |
| Operator | Merges the report and closes the phase | Pending | |
<!-- /ANCHOR:sign-off -->
