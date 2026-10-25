---
title: "Implementation Plan: Phase 8: playbook-run-in-worktree"
description: "Create one disposable sk-git worktree from the operator's BASE_REF, provision it with its own dependencies and build, run the eight phase 007 scenarios from their own command blocks and publish a report package with one verdict per scenario."
trigger_phrases:
  - "playbook run in worktree plan"
  - "disposable worktree scenario runner"
  - "manual testing playbook report package"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: playbook-run-in-worktree

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash, Node, npm, git, ripgrep, jq |
| **Framework** | system-spec-kit validator and guards, sk-git worktree allocator |
| **Storage** | TSV, JSON and text files under this phase's `scratch/`, plus one report folder |
| **Testing** | Each scenario file is its own script, compared to a frozen pattern |

### Overview
One conductor creates a disposable worktree from the operator's `BASE_REF`, lets the sk-git allocator install that worktree's own dependency trees and build and proves the build resolves inside the worktree. The conductor then reads the eight frozen scenario ids and files from phase 007 plan section 3.1, extracts each scenario's own command blocks, runs them from the worktree root, captures the output and compares it to its frozen patterns. A failing scenario gets one fix brief and one rerun, at most three times, then an escalation row. The runs are assembled into the benchmark report package before the worktree is removed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The launch preconditions in `../spec.md` section 3 are recorded as met in `../goal.md` section 4
- [ ] `BASE_REF` is recorded in `../goal.md` section 4 and resolves with `git rev-parse --verify`
- [ ] Phase 007 is closed: every new scenario file exists and the playbook index lists it
- [ ] `tasks.md` T001 to T003 are done: preconditions, tools and start state recorded

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED`
- [ ] `results.csv` holds eight data rows, every row is `PASS` or `FAIL`, and `scratch/results.tsv` holds one of the five verdict values `PASS`, `FAIL`, `FIXED`, `ESCALATED` or `SCENARIO_DEFECT`
- [ ] The disposable worktree is gone and the primary checkout gate prints nothing outside the allowed paths
- [ ] The frontier review ran read-only and its reply is saved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One disposable execution host, one scenario map, one literal runner, one comparator, one report assembler.

### Key Components

| Component | Role |
|-----------|------|
| **Conductor** | The operator's interactive OpenCode v2 session on DeepSeek V4.1 Flash max. It creates the worktree, runs every command, writes every verdict and edits only this phase folder plus the report folder |
| **Worktree allocator** | `.skilled/skills/sk-git/scripts/worktree-naming.sh create`, which allocates `worktrees/NNN-slug`, creates `.worktrees/NNN-slug` and provisions the dependency trees and builds |
| **Scenario map builder** | A Node script that carries the eight literal ids and paths, checks each file and writes `scratch/scenarios.tsv` |
| **Runner** | A Bash script that extracts the `### Commands` fenced block from one scenario file and runs it from the worktree root |
| **Comparator** | A Node script that matches each captured run against up to three frozen patterns and prints `PASS` or `FAIL` with a one-line reason |
| **S8 worker** | One Task subagent on `llmgateway/deepseek-v4.1-flash-1017#max` that authors a Level 1 packet from the card inside the disposable worktree |
| **Fix worker** | One Task subagent per failed attempt, limited to the one file the scenario's `## 4. SOURCE FILES` list names |
| **Reviewer** | One read-only `cli-codex` dispatch at phase close |

### 3.1 Execution host

Two roots are named once by the conductor:

- `RUNROOT`: the checkout that holds this phase folder and receives every durable write. It is the build worktree from `../goal.md` section 4 when the operator chose A, otherwise the primary checkout.
- `MAIN`: the primary checkout, read with `git -C "$RUNROOT" worktree list --porcelain | awk 'NR==1{print $2}'`.

`PHASE` is `$RUNROOT/specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree`.
`WT` is the absolute directory printed by the allocator.
`WT_BRANCH` is the branch name printed beside it.
`BASE_REF` is the ref the operator recorded in `../goal.md` section 4.

The disposable worktree is created from `BASE_REF`, never from the conductor's uncommitted tree:

```bash
bash .skilled/skills/sk-git/scripts/worktree-naming.sh create playbook-run "$BASE_REF" --no-provision \
  > "$PHASE/scratch/worktree/create.out" 2> "$PHASE/scratch/worktree/create.err"
read -r WT_BRANCH WT_DIR < "$PHASE/scratch/worktree/create.out"
```

The allocator prints `<branch> <dir>` on stdout and its own messages on stderr. `--no-provision` is passed because T006 provisions the worktree as a separate step and captures that output in `scratch/worktree/provision.out`. A create failure prints its reason on stderr, and the conductor writes that last line in `goal.md` section 4 as `BLOCKED worktree`.

### 3.2 Own-code proof

A fresh worktree holds no `node_modules` and no `dist`. A wholesale link of either would make the run read the primary checkout's code. The allocator installs each package inside the worktree instead. The conductor proves the result with this Node block, run from `$RUNROOT`, and writes its output to `scratch/worktree/own-code.txt`:

```bash
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
}' "$WT/.skilled/skills/system-spec-kit" "$WT"
```

A `FOREIGN` line is a hard stop. A `MISSING runtime/node_modules` line is allowed, as phase 003 records. The built orchestrator is `$WT/.skilled/skills/system-spec-kit/runtime/dist/lib/validation/orchestrator.js`.

### 3.3 Scenario map (frozen)

Phase 007 plan section 3.1 freezes the eight scenario ids, files and subjects. This phase copies that table here, so the map builder needs no index search and a weak executor needs no judgment. The playbook root is `.skilled/skills/system-spec-kit/manual-testing-playbook` and every file sits under `template-authoring/`.

| S | Playbook ID | File | Subject | Pass A | Pass B | Pass C |
|---|-------------|------|---------|--------|--------|--------|
| S1 | 476 | `template-authoring/placeholder-token-warning-while-draft.md` | A v2.3 Draft packet warns and still passes strict | `^warn$` | `^true$` | `cleanup=ok` |
| S2 | 477 | `template-authoring/placeholder-token-error-after-draft.md` | The same packet fails once its status leaves Draft | `^error$` | `^false$` | `cleanup=ok` |
| S3 | 478 | `template-authoring/placeholder-gate-legacy-stamp-unchanged.md` | A v2.2 packet keeps the old error at any status | `^error$` | `^false$` | `cleanup=ok` |
| S4 | 479 | `template-authoring/example-drift-guard-catches-leak.md` | The drift guard fails a leaked description and passes a clean tree | `EXAMPLE_DRIFT_OK` | `broken_exit=1` | `cleanup=ok` |
| S5 | 480 | `template-authoring/golden-render-all-levels.md` | Every level renders to the stored snapshots and the anchor counts hold | `Tests\s+12 passed \(12\)` | `Tests\s+16 passed \(16\)` | `cleanup=ok` |
| S6 | 481 | `template-authoring/authoring-card-router-intents.md` | The four authoring intents load the card and not the guide | `^4$` | `^0$` | `^1$` |
| S7 | 482 | `template-authoring/authoring-card-sync-guard.md` | The sync guard passes the tree and fails a copy without the card | `CARD SYNC OK` | `CARD SYNC FAILED` | `cleanup=ok` |
| S8 | 483 | `template-authoring/level-1-packet-authored-from-card.md` | A DeepSeek worker writes a Level 1 packet from the card alone | `^devin_exit=0$` | `^packet=specs/zz-pb-card/001-card-authoring\nval_exit=0\nRESULT: PASSED\n0$` | `cleanup=ok` |

A missing file prints `NO_FILE S<n>` and stops the map build. The conductor records the blocker and stops, because a guessed scenario is worse than no run.

The patterns are the lines the scenario files print, read from phase 007 plan sections 3.2 to 3.9: the JSON gate status and `passed` value for S1 to S3, the clean sentinel plus the broken exit for S4, both vitest pass counts for S5, the three counts for S6, both guard verdicts for S7, and the validation result plus the conductor token count line for S8.

### 3.4 Running one scenario

The runner appends every `bash` or `sh` fenced block under `### Commands` in order, writes the extracted text to the run file's own `<run file>.cmd` path, which is `scratch/runs/<playbook-id>.txt.cmd`, and runs it from `$WT` in one shell, so the variables set in step one stay defined for the later steps:

```bash
awk '
  /^### Commands[[:space:]]*$/ { section = 1; next }
  section && /^### / { exit }
  section && /^```/ { if (fence) { fence = 0; run = 0 } else { fence = 1; run = ($0 ~ /^```(bash|sh)[[:space:]]*$/) }; next }
  section && run { print }
' "$SCENARIO_FILE" > "$PHASE/scratch/runs/$ID.txt.cmd"
```

An empty command file is `SCENARIO_DEFECT` and is not run. The scenario files phase 007 writes use several numbered blocks under one `### Commands` heading, so concatenation is what makes the scenario runnable as one script. The run output goes to `$PHASE/scratch/runs/$ID.txt`, followed by a `truncated=yes` or `truncated=no` line and an `exit=<n>` line. A run above 2 MB is cut to its first 2 MB and last 200 lines before those two lines are written, so a runaway scenario cannot fill the disk. The command block is the scenario's own text. The runner never retypes a command.

S8 is the one exception. Its commands dispatch a worker, so the conductor extracts the `### Prompt` block, writes a worker brief from the skeleton in this plan, dispatches one Task subagent that works inside `$WT` and then checks the packet the worker returns. The worker reply is saved as `scratch/runs/<playbook-id>.worker-<n>.txt`. The S8 run file holds only conductor-written lines: `dispatch_exit`, `dispatch_attempts`, the conductor's own strict validation, `leftover_tokens` and `cleanup=ok`. A `RESULT: PASSED` line in the worker reply therefore can never satisfy the S8 pattern. S8's packet path is frozen to `specs/zz-pb-card/001-card-authoring`, the path the scenario file itself uses, so the check needs no parsing judgment.

### 3.5 Comparator

For each run the comparator reads its up to three patterns and prints one line:

`S<n> PASS <playbook-id> <run-file>` or `S<n> FAIL <playbook-id> <first missing pattern>`

Every non-empty pattern must match. The `^4$` and `^0$` patterns are matched with the multiline flag. A run whose exit line is `142` is always a `FAIL` with `missing:exit=142`, whatever its output matched. For every run the comparator also writes `<run file>.check.txt`, which names the result, the first missing pattern, the exit line, the truncation line and the last output line. It also writes `<run file>.stderr.txt`, which holds the failing `missing:` line. The fix brief quotes the stderr file, so the failing line reaches the worker without the conductor retyping it. When a run does not match, the conductor reads the scenario's own `### Pass / Fail` section. If that section states a different observable and the run satisfies it, the row is `SCENARIO_DEFECT` and is escalated to phase 007. The comparator's verdict is never overridden by a chat impression.

### 3.6 Report package

An existing report folder holds `README.md`, `results.csv`, `source.md` and `outcomes/`. This phase copies that real file set. The `sk-create-benchmark` report contract requires ten numbered sections, so `README.md` carries all ten section headings even though the older folders use a shorter shape. That difference is recorded in ADR-003.

T013 inspects one existing folder before it writes the new one. The block prints `EXISTING_REPORT=<path>`, one `PRESENT <name>` line for each of the four entries and the `results.csv` header. A missing entry stops the task before a new folder is written, so the convention is read from a real folder rather than assumed.

The report folder name is `<date>--manual-testing-playbook--weak-model-authoring`, where the date is the run date from `date +%F`. When the folder exists, the conductor appends `-2`, `-3` and so on, because a report folder is immutable.

`results.csv` uses the header observed in the existing folders:

```text
scenario_id,runtime,run,evidence_class,verdict
```

One data row per scenario, with `runtime` set to `conductor`, `run` set to `1`, `evidence_class` set to `manual-testing-playbook` and `verdict` set to `PASS` for a `PASS` or `FIXED` row and `FAIL` for a `FAIL`, `ESCALATED` or `SCENARIO_DEFECT` row. The five-value verdict stays in `scratch/results.tsv`.

`outcomes/<playbook-id>.json` follows the observed shape:

```json
{
  "scenarioId": "<playbook id>",
  "runtime": "conductor",
  "evidenceClass": "manual-testing-playbook",
  "verdict": "PASS",
  "reason": "<one paragraph naming the pattern that matched>",
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
      "verdict": "PASS",
      "reason": "<one paragraph with the observed lines>",
      "operatorInputs": "None.",
      "evidence": [
        {
          "path": "specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/<playbook id>.txt",
          "bytes": 0,
          "sha256": "<sha256>"
        }
      ]
    }
  ],
  "evidence": [
    {
      "path": "specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/runs/<playbook id>.txt",
      "bytes": 0,
      "sha256": "<sha256>"
    }
  ]
}
```

The `bytes` and `sha256` values are filled from `wc -c` and `shasum -a 256`. The example above is a shape, not a literal file. The conductor writes each file from the template in `tasks.md` T013.

`source.md` names the scenario files, the run files, the worktree branch and path, `BASE_REF` and the phase folder. `README.md` ends with a file table and a REPRODUCIBILITY section that holds the create, provision and run commands.

One row is added at the top of `.skilled/skills/system-spec-kit/benchmark/reports/README.md`:

```text
| <date> | [`<folder>/`](./<folder>/) | conductor manual-testing-playbook | <p> PASS, <f> FAIL | **<PASS or PASS (after fixes) or FAIL>** | `manual-testing-playbook` |
```

### 3.7 Failure protocol

A `FAIL` row gets one fix brief and one rerun. The same scenario gets at most three fix briefs. After the third failed fix the row becomes `ESCALATED` and the other scenarios continue.

The one file a fix may touch is the `- Implementation:` bullet of the scenario file's `## 4. SOURCE FILES` list. The conductor resolves that link against the scenario file's own directory, prints the result as `FIX_TARGET=<repo-relative path>` and copies that path into the brief and into ALLOWED WRITE PATHS. No second file is allowed. A scenario with no `- Implementation:` bullet is `SCENARIO_DEFECT`.

The fix brief is the skeleton in the AI EXECUTION PROTOCOL section, followed by this text with the fields filled:

```text
TASK: Scenario <S label> failed at <playbook id>.
The captured run is <run file>. The comparator wrote:
<the contents of <run file>.stderr.txt, quoted>
The scenario's pass criterion is:
<the Pass line from the scenario file, quoted>
Change only the single file named under ALLOWED WRITE PATHS so that the scenario
passes. Do not edit the scenario file. Do not edit any other file.
The conductor reruns the scenario after you return.
RETURN exactly one line: FIXED <the file> or BLOCKED <the reason>
```

After the worker returns, the conductor reruns the same scenario command block from `$WT`. A PASS marks the row `FIXED` and keeps the original run beside the rerun as `scratch/runs/<playbook-id>.fix-<n>.txt`.

A fix edits a tracked file under `.skilled/`, so the disposable worktree is never clean after a successful fix. Before removal, T016 clears scratch output and saves the worktree state:

```bash
git -C "$WT" diff > "$PHASE/scratch/fixes/fix.patch" && echo PATCH_SAVED
git -C "$WT" status --porcelain > "$PHASE/scratch/fixes/status.txt" && echo STATUS_SAVED
```

The block prints `PATCH_SAVED` and `STATUS_SAVED`. Untracked output under `$WT/scratch/` is scratch and not a fix, so T016 clears it with `git -C "$WT" clean -fd -- scratch` before it saves `status.txt`. A changed path outside that scratch directory that still reads `UNPATCHED` keeps the worktree and is recorded for the operator.

The removal gate then reads `status.txt` line by line and looks for `diff --git a/<path> b/<path>` in `fix.patch`. It writes `PATCHED <path>` or `UNPATCHED <path>` for each change, prints `PATCH_GATE_COVERED` when the counts agree, and refuses removal while any `UNPATCHED` line exists. The patch is applied to the build worktree later by the operator or the phase 009 conductor, never by this phase.

### Data Flow
`BASE_REF`, then disposable worktree, then provable own-code build, then scenario map, then one captured run per scenario, then comparator verdict, then `results.tsv`, then report package, then worktree removal, then frontier review.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes no product producer by hand. It reads the phase 007 scenarios and runs the phase 003 to 005 guards. A fix brief may change one file inside the disposable worktree, and that change is never merged by this phase.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/` | Holds the eight new scenarios and the index | unchanged, read | `scratch/scenarios.tsv` names eight existing files |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` | Example drift guard | unchanged, run by S4 | `EXAMPLE_DRIFT_OK` in the S4 run |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` | Card sync guard | unchanged, run by S7 | `CARD SYNC OK` in the S7 run |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Validation front end | unchanged, run by S1, S2, S3 and S8 | `RESULT:` line in each run |
| `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Report index | one row added | `rg -c` of the folder name prints `1` |

Required inventories:
- Same-class producers: the eight scenario files are the whole new set, selected by the eight S labels in `scratch/scenarios.tsv`. A missing label stops the run.
- Consumers of changed symbols: the report index is the only consumer changed, and `rg -c` proves one row.
- Matrix axes: eight scenarios by the patterns each row carries, each reported as a match or a miss.
- Algorithm invariant: a scenario passes only when its captured run matches every non-empty frozen pattern. A disagreement with the scenario file is a scenario defect, never a silent pass.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The extractor and comparator against a fixture scenario in `scratch/test/` | `run-scenario.sh`, `check-run.cjs` |
| Integration | Each of the eight scenarios, on the disposable worktree | the scenario's own command block |
| Manual | The frontier review reads every run and every verdict | read-only `cli-codex` dispatch in `tasks.md` T017 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `BASE_REF` from the operator | External | Checked in T001 | No worktree can be created from the right tree |
| `worktree-naming.sh` and its provisioning list | Internal | Checked in T005 | The worktree has no dependencies or build |
| The OpenCode Task tool with `llmgateway/deepseek-v4.1-flash-1017` | External | Checked in T002 | S8 and every fix brief cannot run |
| npm registry or local cache | External | Exercised in T005 | Provisioning fails and the phase stops |
| `jq`, `rg` and `shasum` on PATH | Internal | Checked in T002 | The map, verdicts and evidence hashes cannot be built |
| `cli-codex` with `gpt-6-luna` | External | Checked in T017 | The review is recorded as skipped and REQ-007 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a scenario writes outside the disposable worktree, or the primary checkout gate names a path outside the allowed set.
- **Procedure**: keep the worktree until the named paths are read. Write `scratch/worktree/status-before-remove.txt` first. Remove the worktree with `git -C "$RUNROOT" worktree remove "$WT"` and delete its branch with `git -C "$RUNROOT" branch -D "$WT_BRANCH"`. Restore any primary checkout path with `git restore --source="$START" -- <path>`. Delete the new report folder with `rm -r "$REPORT"` only after its contents are copied into this phase folder. Remove the one index row with the edit tool. Record the rollback in `goal.md` section 4.
- **Irreversible part**: removing the worktree deletes every uncommitted file in it. The branch deletion makes its commits reachable only through the reflog until git garbage collection. The create command allocates a new number on a rerun, so the same directory name is not reused.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 007 close ──► Setup (T001-T003) ──► Scenario map (T004)
                                              │
                    Worktree + own-code (T005-T007)
                                              │
                    Runner test (T008) ──► Scenarios S1 to S7 (T009) ──► S8 dispatch (T010)
                                              │                              │
                                        Fix protocol (T011) ◄───────────────┘
                                              │
                    Results (T012) ──► Report (T013) ──► Index row (T014)
                                              │
                    Primary gate (T015) ──► Worktree removal (T016) ──► Review (T017-T018) ──► Close (T019)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 007 close, operator `BASE_REF` | Scenario map, worktree |
| Scenario map | Setup | Every run |
| Worktree | Setup | Every run |
| Runner test | Scenario map, worktree | Scenarios |
| Scenarios | Runner test, worktree | Results |
| Report | Results | Index row, review |
| Removal | Report, primary gate | Close |
| Review | Report | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and scenario map | Low | 30 minutes |
| Worktree provisioning | Med | 15 to 45 minutes, network bound |
| Eight scenario runs | Med | 2 to 4 hours |
| Fix attempts | Med | 0 to 2 hours, only on failure |
| Report and index row | Low | 1 hour |
| Review and close | Low | 30 minutes |
| **Total** | | **4 to 8 hours, an assumption with no timed earlier run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `BASE_REF` and `START` recorded in `goal.md` section 4 before the worktree is created
- [ ] `git -C "$RUNROOT" status --porcelain` saved to `scratch/status-start.txt`
- [ ] No feature flag applies, this phase ships a report and no runtime behavior

### Rollback Procedure
1. Copy every run file and every outcome file into `scratch/report-backup/` before removing anything.
2. Remove the disposable worktree with `git -C "$RUNROOT" worktree remove "$WT"`.
3. Delete its branch with `git -C "$RUNROOT" branch -D "$WT_BRANCH"`.
4. Restore each primary checkout path the gate named with `git restore --source="$START" -- <path>`.
5. Delete the report folder and remove the index row only after step 1.
6. Run `git -C "$RUNROOT" status --porcelain` and compare it with `scratch/status-start.txt`.
7. Record the rollback in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, nothing is written to a database or a remote
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Setup   │────►│ Scenario map │────►│   Runner     │
└────┬─────┘     └──────────────┘     └──────┬───────┘
     │                                        │
     │           ┌──────────────┐             ▼
     └──────────►│  Worktree    │───────►┌──────────┐     ┌──────────┐
                 │  own-code    │        │ S1 to S8 │────►│  Report  │
                 └──────────────┘        └────┬─────┘     └────┬─────┘
                                              │                │
                                         ┌────▼─────┐     ┌────▼─────┐
                                         │ Fix loop │     │  Review  │
                                         └──────────┘     └──────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Phase 007 close, `BASE_REF` | Start state | Map, worktree |
| Scenario map | Setup | `scenarios.tsv` | Runner |
| Worktree | Setup | Own-code proof | Every run |
| Runner | Map, worktree | Captured runs | Results |
| Fix loop | A failed run | Fix briefs, reruns | Results |
| Report | Results | Report package | Index row, review |
| Review | Report | Findings | Phase close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Worktree provisioning** - 15 to 45 minutes - CRITICAL
2. **Eight scenario runs** - 2 to 4 hours - CRITICAL
3. **Report and review** - 1.5 hours - CRITICAL

**Total Critical Path**: about 4 to 7 hours

**Parallel Opportunities**:
- The scenario map and the worktree creation do not share a file and can run together.
- A fix brief and a different scenario run can overlap, because the fix writes one source file and the other scenario runs in a different part of the tree. The conductor sends at most three Task calls in one message, and never two that write the same file.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup done | T001 to T003 marked `[x]` with evidence | Start of phase |
| M2 | Own-code worktree | T005 to T007 show `OWN` and no `FOREIGN` | Before the first run |
| M3 | Every scenario recorded | Eight run files and eight verdict rows | Mid phase |
| M4 | Report published | Report folder, eight outcomes and one index row | Before removal |
| M5 | Phase closeable | Every acceptance criterion `Met` | End of phase |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Written for the executing swarm. Follow each rule as written. Where a rule and your own judgment disagree, follow the rule and record the disagreement in `goal.md` section 4.

### Roles
- **Conductor**: the operator's interactive OpenCode v2 session on DeepSeek V4.1 Flash max. It creates the worktree, runs every scenario, writes every verdict and edits only this phase folder plus the report folder.
- **Worker**: one Task subagent on `llmgateway/deepseek-v4.1-flash-1017#max`. A Task subagent inherits the session model and cannot receive environment variables, so its brief is what pre-resolves its gates.
- **S8 worker**: one Task subagent that authors one Level 1 packet inside the disposable worktree, then stops.
- **Fix worker**: one Task subagent per failed attempt. It may edit exactly one file inside the disposable worktree.
- **Reviewer**: one read-only `cli-codex` dispatch at phase close. It writes nothing.

### Pre-Task Checklist
- [ ] Read this phase's `spec.md`, this plan and `tasks.md` before the first dispatch
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` NEVER rules 1 and 5 before the first dispatch, because they forbid a nested CLI dispatch from inside OpenCode and name the Task tool as the replacement
- [ ] Read `.skilled/skills/sk-git/SKILL.md` and its `references/worktree-workflows.md` before creating the worktree
- [ ] Confirm the conductor's working directory is `RUNROOT`, never the disposable worktree for durable writes
- [ ] Confirm `rg -c 'deepseek-v4.1-flash-1017' opencode.json` prints a number above 0
- [ ] Save every brief to `scratch/briefs/<task-id>.txt` before dispatching it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. T011 runs only after a `FAIL`, and T018 only after a finding |
| TASK-PARALLEL | Send at most three Task calls in one message, and never two that write the same file |
| TASK-SCOPE | A worker writes only the paths under ALLOWED WRITE PATHS in its brief |
| TASK-VERIFY | The conductor runs the task's verify command and reads both its output and its exit status before marking the task `[x]` |
| TASK-LOCATE | Find text by its exact content, never by a line number |
| TASK-SCENARIO | Run the scenario's own command block. Never retype a command from prose |
| TASK-HOST | A scenario runs only inside `$WT`. A run started in `$RUNROOT` or `$MAIN` is killed and recorded as a violation |
| TASK-BANNED | Workers never run `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js` or `/speckit:save` |
| TASK-REMOVE | Only the conductor runs the removal block in T016, and only after its status gate prints `REMOVAL_OK` |

### Worker Brief Skeleton

Every brief starts with this block, word for word, with the two paths filled in:

```text
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
  <the one path this task names>

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, rm, mv, create.sh outside the task's stated command, generate-context.js,
/speckit:save, and any edit to a file not listed under ALLOWED WRITE PATHS.
```

The role line is a focused persona summary in place of a full agent file, the small-context exception that `cli-opencode` rule 18 allows for a native surface. It is declared here as that exception.

### Dispatch Command

Dispatch with the Task tool: subagent_type `general`, description `<TASK id>`, prompt = the full text of
`$PHASE/scratch/briefs/<TASK>.txt`. When the subagent returns, write its final reply verbatim to
`$PHASE/scratch/runs/<TASK>.txt` with the write tool.

`PHASE` is this folder's path in `RUNROOT`. `WT` is the disposable worktree. The prompt is the brief and nothing else, so the Task call adds no instruction of its own. A Task subagent starts in the conductor's session directory, so the brief names `$WT` and the worker runs every command from that directory.

### S8 Brief Task Text

Append this text after the skeleton for S8, with the scenario file's Prompt block copied verbatim into the prompt slot:

```text
TASK: Author one Level 1 spec packet from the authoring card, following the scenario
prompt below exactly.

Work only inside the disposable worktree at $WT and run every command from that directory.

<the scenario's Prompt block, verbatim>

Steps:
1. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md once.
2. Run: bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-pb-card --short-name card-authoring --number 1 "Author a Level 1 packet from the card"
3. Fill spec.md, plan.md, tasks.md and implementation-summary.md for this feature: add a --quiet flag to .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh that prints only the final recommended-level line.
4. Run: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-pb-card/001-card-authoring --strict
5. Fix what it reports and run it again, at most three times in all.

RETURN exactly one line: the folder path, then the last RESULT line validate.sh printed.
```

### Status Reporting Format

`T### DONE | BLOCKED | ESCALATED - one line of evidence`, written as a row in the progress table of `goal.md` section 4.

### Blocked Task Protocol
1. Copy the current run files into `scratch/report-backup/` before changing any state.
2. Mark the task `[B]` in `tasks.md` with the failing command and the first line of its output.
3. Re-dispatch at most twice with the brief corrected for what failed. After the third failure on the same task, leave it `[B]` and continue with the next task.
4. Stop the phase when two tasks are blocked, and write `STOP` with both task IDs in `goal.md` section 4.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Run the scenario file's own command block

**Status**: Accepted

**Context**: A runner that retypes commands drifts from the scenario the first time either side changes, and the report then describes the runner rather than the playbook.

**Decision**: The runner extracts every fenced block under `### Commands` in order, writes them to one command file and executes that file unchanged. A scenario with no such block is a scenario defect and is escalated.

**Consequences**:
- The report measures the shipped scenario text.
- A scenario that is not copy-runnable fails the phase instead of being silently repaired by the conductor.

**Alternatives Rejected**:
- Retyping each command from the prose: it hides a defective scenario and adds a second source of truth.

### ADR-002: A disposable worktree with its own dependencies and build

**Status**: Accepted

**Context**: A fresh worktree has no `node_modules` and no `dist`. Linking either one from the primary checkout makes the run read the primary checkout's code, and the validator can pass without touching the worktree's files.

**Decision**: The worktree is created through `worktree-naming.sh create`, which installs every dependency tree and builds the outputs its provisioning list names. A realpath check rejects any build path that resolves outside the worktree.

**Consequences**:
- Every verdict describes the `BASE_REF` tree.
- Provisioning costs 15 to 45 minutes and needs npm access.

**Alternatives Rejected**:
- Symlinking `node_modules` and `dist`: the documented trap that makes a strict run exit 0 while doing no work.

### ADR-003: Copy the real report file set and keep the ten section headings

**Status**: Accepted

**Context**: `sk-create-benchmark` section 3 names `benchmark-report.md`, while every existing `system-spec-kit` report folder holds `README.md`, `results.csv`, `source.md` and `outcomes/`. Section 5 requires ten numbered sections.

**Decision**: The package copies the observed file set and puts the ten required section headings inside `README.md`. `results.csv` keeps the observed header.

**Consequences**:
- The new report opens like every sibling report.
- A reader who looks for `benchmark-report.md` finds `README.md` instead, and the file table names it.

**Alternatives Rejected**:
- Adding `benchmark-report.md` beside `README.md`: two report bodies with one verdict each would drift.

### ADR-004: A verdict is a pattern match, and a disagreement is a scenario defect

**Status**: Accepted

**Context**: A weak executor asked to grade output will call a partial match a pass.

**Decision**: Every non-empty frozen pattern must match the captured output. When one does not, the conductor reads the scenario's own Pass section. A run that satisfies that section but not the frozen pattern is recorded as `SCENARIO_DEFECT` and escalated to phase 007.

**Consequences**:
- The same run file yields the same verdict for a second conductor.
- A scenario whose wording differs from the frozen pattern costs one escalation instead of a false pass.

**Alternatives Rejected**:
- A model's judgment of the output: one model is one opinion, and the runs already hold the evidence.

---
