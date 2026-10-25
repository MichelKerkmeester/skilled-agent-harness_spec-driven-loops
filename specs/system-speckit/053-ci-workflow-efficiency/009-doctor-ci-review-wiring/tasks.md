---
title: "Tasks: Phase 9: doctor-ci-review-wiring"
description: "Task Format: T### [P?] Description (file path). Ordered executor tasks for the R28 probe and D9, the /doctor:ci report, scaffold and toggle, the three routes and bridges, the CI surface value and its regression test, then the gates and the phase result."
trigger_phrases:
  - "doctor ci review wiring tasks"
  - "phase 9 doctor ci review wiring tasks"
  - "ci workflow report command tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: doctor-ci-review-wiring

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

A task closed by a decision record is `[x]` with a `Superseded:` evidence line that names the ADR. Nothing in it was built.

Every task below names one file, quotes the anchor text it edits or reads, gives that anchor's line number, puts every command in a fenced block, states the expected result, names the acceptance criterion it satisfies, gives a rollback, and gives one concrete stop condition.

**Path convention.** Run every command from the repository root. `PHASE` means `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring`. Set `PHASE` in the same block as any command that uses it.

**Anchor convention.** Every line number was read on this packet's scaffold commit. Phase 006 adds a `sk-code-ci/` packet and phase 007 adds a switch line to every job and an `### On/off switches` section to `.github/workflows/README.md`, so a line in those files moves by the time these tasks run. Locate the quoted text and edit there. An absent anchor is a stop, never a nearby edit.

**One token stands for data, never for prose.**

- `<D9>` is `write` or `print`, copied from the single line in `plan.md` that matches `^D9: (write|print)$`.

**D9 gating.** T001 is the operator decision. T011 reads its answer. No task runs a `gh variable set` or `gh variable delete` outside T001 and the toggle route the operator runs later.

**Comment hygiene.** No task adds an R-id, a D-id or a phase number to a command asset, a script comment, a YAML asset, a test name or a commit message. Spec documents may cite them.

**Scope guard.** The only repository paths any task writes are the ones in `spec.md`'s Files to Change table and this phase's `scratch/`. No `.github/workflows` file changes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T001 [x] DECISION D9 (operator yes required): run the R28 probe and record the answer (AC-001, AC-002)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/r28-probe.md` (new file), and `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/plan.md`, anchor: the `phases` anchor close at line 160, the last line of the Implementation Notes block.

Read the operator's yes from `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/r28-probe-approval.md`, which must exist and hold the approval line `R28 probe: approved by the operator on 2026-10-23`. `gh variable set` changes repository settings, so that recorded approval is the stop-for-yes gate. If the file is missing or lacks the approval line, run no `gh` write, stop this task and escalate.

Change: run the four commands below in order, then write one line per command to the new scratch file in the form `<step> exit=<code>` plus the observed output, then insert the single line `D9: write` before the plan.md anchor when the set exits 0, or `D9: print` when it exits non-zero.

```bash
gh variable set SKILLED_CI_PROBE --body x
gh variable get SKILLED_CI_PROBE --json name,value
gh variable delete SKILLED_CI_PROBE
gh variable get SKILLED_CI_PROBE
```

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -cE '^(set|get|delete|get-after-delete) exit=[0-9]+$' "$PHASE/scratch/r28-probe.md"
grep -c 'SKILLED_CI_PROBE' "$PHASE/scratch/r28-probe.md"
grep -cE '^D9: (write|print)$' "$PHASE/plan.md"
gh variable list --json name,value | grep -c 'SKILLED_CI_PROBE' || true
```

Expected: `4`; at least `4`; `1`; `0`. On the success path the recorded codes are set `0`, get `0` with `"value":"x"`, delete `0`, and get-after-delete `1`.

Rollback: `gh variable delete SKILLED_CI_PROBE` and delete `scratch/r28-probe.md`.

Stop and escalate if: the post-delete `gh variable get` exits 0, because a variable that survives its delete is a repository-settings fault; run `gh variable delete SKILLED_CI_PROBE` once more and record both results before any other work.

Evidence: the approval file holds the approval line (count 1) and the probe was run by the orchestrator on 2026-10-25, so this task ran no `gh` write. The check block, re-run on 2026-10-25 after the probe record was amended, printed `4` (exit lines: set 0, get 0 with `"value":"x"`, delete 0, get-after-delete 1), `8` for the `SKILLED_CI_PROBE` count (the expected minimum is `4`), `1` for the `D9:` line (`D9: write`, inserted before the `phases` anchor close) and `0` from the live variable list (`[]`). The earlier count of `3` was a deviation, and the amended record resolved it.

---

### T002 [x] Install and build the tools the gates need (AC-008)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/toolchain.md` (new file). Anchor (read): `.github/workflows/spec-kit-check.yml:205`, the line `      - name: Install test dependencies`.

Change: run the install and build set below, then write one line per tool to the new scratch file: the Node version, the Python version, the PyYAML version, and the word `advisor-built`.

```bash
python3 -m pip install pyyaml==6.0.3
npm --prefix .skilled ci
npm --prefix .skilled/skills/system-spec-kit ci
( cd .skilled/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )
npm --prefix .skilled/skills/sk-doc ci
npm --prefix .skilled/skills/system-spec-kit/runtime run build
npm --prefix .skilled/skills/system-skill-advisor/runtime ci
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
( cd .skilled && node -e "require('yaml'); console.log('yaml ok')" )
test -f .skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/fusion.js && echo advisor-built
python3 -c "import yaml; print(yaml.__version__)"
grep -c '^' "$PHASE/scratch/toolchain.md"
```

Expected: `yaml ok`; `advisor-built`; a PyYAML version; `4`.

Rollback: delete `scratch/toolchain.md`. The installs write only gitignored `node_modules` and `dist` directories.

Stop and escalate if: `npm --prefix .skilled ci` fails twice on the same error, or the advisor build exits non-zero.

Evidence: all eight install and build steps exited 0 (pip pyyaml 6.0.3, the four `npm ci` runs, the shared `tsc --build`, the runtime build and the advisor build). Check block printed `yaml ok`, `advisor-built`, `6.0.3`, and `scratch/toolchain.md` holds `4` lines (node v26.8.2, python 3.9.6, pyyaml 6.0.3, `advisor-built`). The node_modules and dist folders already existed from an earlier session and were reinstalled in place; they are gitignored.

---

### T003 [x] Confirm the dependency phases and record the inventory (AC-003, AC-008)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/inventory.md` (new file). Anchor (read): `.github/workflows/README.md:24`, the line `| Workflow | Responsibility |`.

Change: run the five commands below, then write one table with the file count, the job count, the switch-line count and the six variable names read from the `### On/off switches` section of `.github/workflows/README.md`, plus one `state:` line in the form `state: <files> files, <jobs> jobs, <switch> switch lines; merged=<yes|no>, hooks=<present|absent>`, where `merged` follows the presence of `.github/workflows/always-run-guards.yml` and `hooks` the presence of `.github/workflows/hooks-node-tests.yml`. Mark T010 and T011 blocked while a `006` template or the README section is absent.

```bash
test -f .skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml && echo '006: ready'
test -f .skilled/skills/sk-code/sk-code-ci/references/protected-set.md && echo '006-protected: ready'
grep -c '^### On/off switches$' .github/workflows/README.md
grep -c "vars.SKILLED_CI != 'off'" .github/workflows/*.yml | awk -F: '{s+=$2} END {print "switch lines:", s+0}'
python3 - <<'PY'
import glob, yaml
files = sorted(glob.glob('.github/workflows/*.yml'))
jobs = sum(len((yaml.safe_load(open(f)) or {}).get('jobs') or {}) for f in files)
print('files', len(files), 'jobs', jobs)
PY
```

Expected: `006: ready`; `006-protected: ready`; `1`; the counts the commands print, recorded in `scratch/inventory.md` as one of four states: `switch lines: 42` with `files 32 jobs 44` when `merged=no, hooks=absent`, `switch lines: 43` with `files 33 jobs 45` when `merged=no, hooks=present`, `switch lines: 31` with `files 25 jobs 33` when `merged=yes, hooks=absent`, or `switch lines: 32` with `files 26 jobs 34` when `merged=yes, hooks=present`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -c '^| ' "$PHASE/scratch/inventory.md"
for v in SKILLED_CI SKILLED_CI_TESTS SKILLED_CI_REPORTS SKILLED_CI_REVIEW SKILLED_CI_FRESHNESS SKILLED_CI_MESSAGES; do grep -q "$v" "$PHASE/scratch/inventory.md" || echo "missing: $v"; done
if [ -f .github/workflows/always-run-guards.yml ]; then merged=yes; else merged=no; fi
if [ -f .github/workflows/hooks-node-tests.yml ]; then hooks=present; else hooks=absent; fi
case "$merged-$hooks" in
  no-absent) want='state: 32 files, 44 jobs, 42 switch lines; merged=no, hooks=absent' ;;
  no-present) want='state: 33 files, 45 jobs, 43 switch lines; merged=no, hooks=present' ;;
  yes-absent) want='state: 25 files, 33 jobs, 31 switch lines; merged=yes, hooks=absent' ;;
  yes-present) want='state: 26 files, 34 jobs, 32 switch lines; merged=yes, hooks=present' ;;
esac
grep -cF "$want" "$PHASE/scratch/inventory.md"
```

Expected: at least `3`; nothing printed by the loop; `1`.

Rollback: delete `scratch/inventory.md`.

Stop and escalate if: `006: ready`, `006-protected: ready` or the README section count of `1` is missing, because a dependency phase has not landed; or the recorded `state:` line does not match the tree's merged and hooks presence, because the inventory would assert a count the tree does not hold.

Evidence: the blocker is cleared from the tree. The five commands printed `006: ready`, `006-protected: ready`, `1` (README section), `switch lines: 42` and `files 32 jobs 44`. `always-run-guards.yml` and `hooks-node-tests.yml` are both absent, so the state is `merged=no, hooks=absent`. Check block: `grep -c '^| '` printed `12`, the six-name loop printed nothing, and the state line count printed `1`. T010 and T011 are not blocked.

---

### T004 [x] Record the pre-phase baseline (AC-007, AC-008)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/pre-phase.md` (new file). Anchor (read): `.skilled/commands/doctor/_routes.yaml:46`, the line `routes:`.

Change: run the five commands below and write one row per command with its exit status and its last output line.

```bash
bash .skilled/commands/doctor/scripts/route-validate.sh
node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check
node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs
node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
```

Expected before the phase: `14 routes validated`; `"status": "fresh"`; `STATUS=OK` with `bridges=18`; every sk-code test passing; `all 4 guards PASSED`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -c '14 routes validated' "$PHASE/scratch/pre-phase.md"
grep -c '"status": "fresh"' "$PHASE/scratch/pre-phase.md"
grep -c 'bridges=18' "$PHASE/scratch/pre-phase.md"
grep -c 'all 4 guards PASSED' "$PHASE/scratch/pre-phase.md"
grep -c '^| ' "$PHASE/scratch/pre-phase.md"
```

Expected: `1`; `1`; `1`; `1`; at least `5`.

Rollback: delete `scratch/pre-phase.md`.

Stop and escalate if: the route count is not `14`, the projection is not fresh, or the phrase probe prints `STATUS=FAIL`, because a baseline that differs from this plan makes every later count incomparable.

Evidence: `route-validate.sh` exit 0, `14 routes validated, 2 warnings` (both are the existing flag-collision notes for `--dry-run`); the deriver `--check` exit 0, `"status": "fresh"`; the phrase probe exit 0, `STATUS=OK phrases=96 bridges=18`; the sk-code test glob exit 0, 27 pass 0 fail; the drift-guard runner exit 0, `all 4 guards PASSED`. Check block printed `1`, `1`, `1`, `1` and `6`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: The report route

### T005 [x] Create the report script (AC-003)

File: `.skilled/commands/doctor/scripts/ci-report.cjs` (new file; no anchor exists yet).

Change: create the script with these fixed contracts.

- `REPO_ROOT = path.resolve(__dirname, '../../../..')`; `WORKFLOWS = path.join(REPO_ROOT, '.github/workflows')`.
- Flags: `--json` prints JSON only; `--sha=<40 hex>` skips the SHA resolution; `--no-gh` sets every variable state to `unknown` and `newestNonRebuildSha` to `null` with reason `gh disabled by --no-gh`. Any other argument prints `ERROR: unknown argument: <arg>` on stderr and exits 2.
- JSON keys, in this order: `repoRoot`, `workflowCount`, `variables`, `newestNonRebuildSha`, `newestNonRebuildReason`, `notChecked`, `errors`, `workflows`.
- Each workflow row: `file`, `purpose`, `events`, `pathFilterCount`, `jobs`, `switch`, `groups`, `timeout`, `permissions`, `concurrency`, `flags`.
- `variables` maps only the six names to `off`, `unset`, `other` or `unknown`. Never print a variable value.
- Switch resolution: read each job's `if` string; find `vars.SKILLED_CI` and `vars.SKILLED_CI_<GROUP>`. A job is `off` when either resolved value is `off`, `unknown` when either is `unknown`, and `on` otherwise. A workflow is `off` when every job is off, `on` when every job is on, `partial` when they differ, and `missing` when no job carries a switch. `dependabot-auto-merge.yml` reports `on`, raises no `switch-missing` flag and carries no switch.
- Flags: `timeout-missing` when any job lacks `timeout-minutes`; `permissions-missing` when the top-level `permissions` key is absent; `concurrency-missing` when the top-level `concurrency` key is absent; `switch-missing` as described above; `uses-unpinned` when a `uses:` value is neither a local `./` path nor a 40-hex SHA; `readme-row-missing` when no README row names the file; `pull-request-target` when `on.pull_request_target` exists; `event-in-run` when a `run:` value contains `${{ github.event`.
- `notChecked` is the fixed list `["path-parity", "shell-strict-mode", "matrix-guidance"]`.
- SHA resolution: `gh run list --branch main --limit 100 --json headSha,createdAt`; deduplicate the SHAs newest first; for each, `gh api repos/{owner}/{repo}/commits/<sha> --jq .commit.message`; skip a SHA whose last non-empty line is `Trigger-Index-Rebuild: ci`; the first remaining SHA is `newestNonRebuildSha`. When none remains, use `null` and the reason `no non-rebuild SHA in the last 100 runs`.
- Exit 0 on success, 1 when any workflow fails to parse, 2 on a bad argument. A parse failure names the file in `errors` and still lists the other files.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
node --check .skilled/commands/doctor/scripts/ci-report.cjs
node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh > "$PHASE/scratch/report-smoke.json"
python3 -c "import json,glob; d=json.load(open('$PHASE/scratch/report-smoke.json')); print(len(d['workflows']), len(glob.glob('.github/workflows/*.yml')))"
python3 -c "import json; d=json.load(open('$PHASE/scratch/report-smoke.json')); print(sorted({w['switch'] for w in d['workflows']}))"
```

Expected: `node --check` exits 0; the two counts are equal (`32 32` when `hooks-node-tests.yml` is absent and phase 008 has not merged, `33 33` when it is present and 008 has not merged, `25 25` after a D8 merge on the D5-approved tree, `26 26` after a D8 merge on the D5-rejected tree); the switch set is a subset of `['missing', 'off', 'on', 'partial', 'unknown']`.

Rollback: delete `.skilled/commands/doctor/scripts/ci-report.cjs` and `scratch/report-smoke.json`.

Stop and escalate if: the two counts differ, or `node --check` exits non-zero twice on the same syntax error.


Evidence: `node --check` exit 0. `ci-report.cjs --json --no-gh` printed the keys `repoRoot, workflowCount, variables, newestNonRebuildSha, newestNonRebuildReason, notChecked, errors, workflows` in that order; the count check printed `32 32` and the switch set printed `['on', 'unknown']`. A live run with read-only `gh` calls exited 0 with `STATUS=OK workflows=32 on=32 off=0 partial=0 missing=0 unknown=0`, `variables: none` and a 40-hex newest non-rebuild SHA. The report flags `event-in-run` on three workflows (`agent-mirror-sync.yml`, `changed-packet-validation.yml`, `comment-hygiene.yml`) because each interpolates a base or head SHA in a `run:` block, which the standards allow, and `concurrency-missing` on `dependabot-auto-merge.yml` and `strict-pass-freshness-report.yml`. Both flag sets follow the specified rules and are reported as found.
---

### T006 [x] Create the report fixture test (AC-020)

File: `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs` (new file). Anchor (read): `.skilled/commands/doctor/scripts/ci-report.cjs`, the line `function resolveNewestNonRebuildSha(` written by T005.

Change: build a throwaway tree under `fs.mkdtempSync(path.join(os.tmpdir(), 'ci-report-'))` with `a.yml`, `b.yml` and `dependabot-auto-merge.yml`, copy `ci-report.cjs` to the same relative path under that root, write an executable `bin/gh` stub, and spawn the report with `PATH=<root>/bin:$PATH` and `NODE_PATH=<repo-root>/.skilled/node_modules`, both computed from `__dirname`.

- `a.yml`: one job, `if: github.event_name == 'push' && vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'`, `timeout-minutes: 10`, `permissions: contents: read`, `concurrency`, and a README row.
- `b.yml`: one job with no switch, no timeout, no permissions and no concurrency.
- `dependabot-auto-merge.yml`: one job with no switch.
- The `gh` stub answers `variable list --json name,value` with `SKILLED_CI_TESTS=off`, `run list --branch main --limit 100 --json headSha,createdAt` with one rebuild SHA and one real SHA, and `api repos/.../commits/<sha> --jq .commit.message` with a message ending `Trigger-Index-Rebuild: ci` for the rebuild SHA and a normal message for the real one.
- Assert exactly: `a.yml` reports `switch: off` and no `switch-missing` flag; `b.yml` reports `switch: missing` and the four missing flags; `dependabot-auto-merge.yml` reports `switch: on` and no `switch-missing` flag; `newestNonRebuildSha` is the real SHA; `--no-gh` reports `unknown` and still lists all three files; a malformed YAML appears in `errors` and exits 1.

Check:

```bash
node --test .skilled/commands/doctor/scripts/tests/ci-report.test.cjs
```

Expected: exit 0 with at least `5` passing subtests and `fail 0` in the summary.

Rollback: delete `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs`.

Stop and escalate if: the suite fails twice on the same assertion, because a second failure means the script and the fixture disagree on a contract T005 fixes.


Evidence: `node --test .skilled/commands/doctor/scripts/tests/ci-report.test.cjs` exit 0, `tests 14`, `pass 14`, `fail 0` (the task asks for at least 5). Beyond the six asserted contracts it covers a quoted `${{ }}` condition, a folded `>-` block and the `partial` state, the empty variable list, a failing `gh`, an unknown argument, the README-row flag, the three unsafe-shape flags and a byte-for-byte unchanged tree. Negative controls: seven one-line mutations of the script (trailer, exempt set, off token, README flag, `--no-gh`, `pull_request_target`, tag-pin test) each failed at least one subtest, and the script was restored byte for byte.
---

### T007 [x] Create the report workflow (AC-003, AC-021)

File: `.skilled/commands/doctor/assets/doctor-ci-report.yaml` (new file). Anchor (read): `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:1`, the line `# ─────────────────────────────────────────────────────────────────`.

Change: create the YAML with these fixed values: `role: Diagnostic Operator`, `purpose` naming every workflow, its switch state, trigger, filters and drift flags, `action` naming `ci-report.cjs` once, `skill_owner: ".skilled/skills/sk-code/sk-code-ci/"`, `operating_mode.workflow: single-step`, `operating_mode.compliance: MANDATORY`, `operating_mode.execution: read_only`, `operating_mode.approvals: none`, `operating_mode.validation: read_only_assertion`, `mutation_boundaries.read_only: true`, `mutation_boundaries.allowed_targets: []`, `mutation_boundaries.forbidden_targets: ["**/*"]`, an invariant that says the route prints and never writes, and an `execution.steps` entry naming `.skilled/commands/doctor/scripts/ci-report.cjs`. Describe the table columns, the five switch values, the N17 resolution and the exit mapping. Do not use the word sequence `write to` anywhere in the file.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.skilled/commands/doctor/assets/doctor-ci-report.yaml')); print(d['operating_mode']['execution'], d['mutation_boundaries']['read_only'])"
grep -c 'ci-report.cjs' .skilled/commands/doctor/assets/doctor-ci-report.yaml
grep -c 'write to' .skilled/commands/doctor/assets/doctor-ci-report.yaml || true
```

Expected: `read_only True`; at least `1`; `0`.

Rollback: delete `.skilled/commands/doctor/assets/doctor-ci-report.yaml`.

Stop and escalate if: the YAML fails to parse twice, or the `write to` count is not `0`, because `route-validate.sh` K1 reads that phrase as a write declaration.


Evidence: the parse printed `read_only True`; `grep -c 'ci-report.cjs'` printed `3`; `grep -c 'write to'` printed `0`, and the validator's own case-insensitive write regex also matched `0` lines.
---

### T008 [x] Create the router (AC-008, AC-011)

File: `.skilled/commands/doctor/ci.md` (new file). Anchor (read): `.skilled/commands/doctor/sk-code.md:1`, the line `---`.

Change: create the router with frontmatter `description` naming report, scaffold and toggle; `argument-hint: "[report|scaffold|toggle] [--json] [--sha=<sha>] [--no-gh] [--dry-run] [--name=<file>] [--variable=<name>] [--state=<on|off>]"`; `allowed-tools: Read, Bash, Grep, Glob, Write`. Add `<!-- skill_agent: sk-code -->` immediately after the closing frontmatter fence. Write the router contract, the owned-assets table, the mode routing with `report` as the default and an unknown target or flag failing before YAML load, the execution-targets table with exactly these three rows, the presentation boundary and the workflow summary.

```
| `report` | `.skilled/commands/doctor/assets/doctor-ci-report.yaml` |
| `scaffold` | `.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` |
| `toggle` | `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml` |
```

Check:

```bash
grep -cE '^\| `(report|scaffold|toggle)` \| `\.skilled/commands/doctor/assets/doctor-ci-' .skilled/commands/doctor/ci.md
grep -c '<!-- skill_agent: sk-code -->' .skilled/commands/doctor/ci.md
grep -c 'Valid targets:' .skilled/commands/doctor/ci.md || true
```

Expected: `3`; `1`; `0`.

Rollback: delete `.skilled/commands/doctor/ci.md`.

Stop and escalate if: the target-row count is not `3`, or the `skill_agent` tag count is not `1`, because the bridge deriver refuses a doctor router without the tag.


Evidence: the target-row count printed `3`, the `skill_agent` tag count `1` and the `Valid targets:` count `0`. The workflow summary says the toggle also refuses the master switch (see T011).
---

### T009 [x] Create the presentation contract (AC-008, AC-021)

File: `.skilled/commands/doctor/assets/doctor-ci-presentation.txt` (new file). Anchor (read): `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt:1`, the line `# /doctor:sk-code Presentation Contract`.

Change: create the contract with these sections in order: the argument failure; a startup menu in the first ```` ```text ```` block carrying `1) report`, `2) scaffold` and `3) toggle`; the accepted-answers table with one row per number in the shape `` | `1` | target = `report` | ... | ``; the line `Valid targets: report, scaffold, toggle`; the subsystem manifest table with one row per target in the shape `` | `report` | `doctor-ci-report.yaml` | ... | ``; the report summary template; the scaffold plan template with `Write this file? [yes/no]`; the toggle plan template with `Run this command? [yes/no]`; the failure summary; the troubleshooting table; the closing line `What would you like to do next?`.

Check:

```bash
F=.skilled/commands/doctor/assets/doctor-ci-presentation.txt
grep -cE '^\| `[123]` \| target = `(report|scaffold|toggle)` \|' "$F"
grep -c '^Valid targets: report, scaffold, toggle$' "$F"
grep -cE '^\| `(report|scaffold|toggle)` \| `doctor-ci-[a-z]+\.yaml` \|' "$F"
grep -c '^1) report$' "$F"
```

Expected: `3`; `1`; `3`; `1`.

Rollback: delete `.skilled/commands/doctor/assets/doctor-ci-presentation.txt`.

Stop and escalate if: any of the four counts differs, because `route-validate.py` compares all three displays for a multi-route command.


Evidence: the four counts printed `3`, `1`, `3` and `1`. The argument failure is a plain table placed before the menu because the validator reads the first text block as the menu; `Valid targets:` appears once, on its own line, after the accepted-answers table.
---

### T010 [x] Create the scaffold workflow (AC-006)

File: `.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` (new file). Anchor (read): `.skilled/commands/doctor/assets/doctor-mcp-install.yaml:5`, the line `operating_mode:`.

Change: create the YAML with `operating_mode.execution: interactive`, `operating_mode.approvals: explicit_yes_for_each_file_write`, and a `mutation_boundaries` block naming one new `.github/workflows/` file as the only allowed target. The steps read `.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml`, `.skilled/skills/sk-code/sk-code-ci/assets/job-block-template.yml` and `.skilled/skills/sk-code/sk-code-ci/references/protected-set.md`; resolve the operator's file name; refuse an existing target with `REFUSE: the target path already exists; scaffold creates new workflows only`; refuse a protected name with `REFUSE: <name> is a protected workflow`; replace the template's comment placeholders with the operator's answers; print the whole proposed file and the README row it needs; write only after an explicit yes; re-read the written file and print its first line. Never overwrite, never edit an existing workflow, never run `git add` or `git commit`.

Check:

```bash
python3 -c "import yaml; d=yaml.safe_load(open('.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml')); print(d['operating_mode']['approvals'])"
grep -cE 'workflow-template\.yml|job-block-template\.yml|protected-set\.md' .skilled/commands/doctor/assets/doctor-ci-scaffold.yaml
grep -c 'REFUSE' .skilled/commands/doctor/assets/doctor-ci-scaffold.yaml
```

Expected: `explicit_yes_for_each_file_write`; at least `3`; at least `2`.

Rollback: delete `.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml`.

Stop and escalate if: the YAML fails to parse twice, or either `sk-code-ci` template is absent, because the route has nothing to read.


Evidence: the blocker is cleared, because both templates and the protected set exist (T003). The parse printed `explicit_yes_for_each_file_write`; the template and protected-set mention count printed `8` lines; `grep -c 'REFUSE'` printed `2`, one line per exact refusal string.
---

### T011 [x] Create the toggle workflow (AC-007)

File: `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml` (new file). Anchor (read): `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/plan.md`, the single line matching `^D9: (write|print)$` written by T001.

Change: create the YAML for the shape the anchor names. Both shapes accept only `SKILLED_CI`, `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES`; print the current state; print the exact `gh variable set <name> --body off` or `gh variable delete <name>` command; ask for an explicit yes. Refuse any other name with `REFUSE: <name> is not a documented switch`. Refuse `SKILLED_CI_MESSAGES=off` while the `### On/off switches` section of `.github/workflows/README.md` contains `SKILLED_CI_MESSAGES must stay unset`, with `REFUSE: SKILLED_CI_MESSAGES must stay unset while the ruleset requires that context`. Under `<D9> = write`, run the command after the yes and read the state back with `gh variable list --json name,value`. Under `<D9> = print`, print the command, print `Run this command yourself; this route writes nothing`, and stop. Under the print shape, do not use the word sequence `write to`.

Check:

```bash
for v in SKILLED_CI SKILLED_CI_TESTS SKILLED_CI_REPORTS SKILLED_CI_REVIEW SKILLED_CI_FRESHNESS SKILLED_CI_MESSAGES; do grep -q "$v" .skilled/commands/doctor/assets/doctor-ci-toggle.yaml || echo "missing: $v"; done
grep -cE 'gh variable set|gh variable delete' .skilled/commands/doctor/assets/doctor-ci-toggle.yaml
grep -c 'SKILLED_CI_MESSAGES must stay unset' .skilled/commands/doctor/assets/doctor-ci-toggle.yaml
grep -c '^D9: (write|print)$' specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/plan.md || true
```

Expected: nothing printed by the loop; at least `2`; at least `1`; `1`.

Rollback: delete `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml`.

Stop and escalate if: the six-name loop prints a missing name, or the `D9:` line is absent, because the route has no shape to follow.


Evidence: the six-name loop printed nothing; `grep -cE 'gh variable set|gh variable delete'` printed `2`; `grep -c 'SKILLED_CI_MESSAGES must stay unset'` printed `1`. The task's last command prints `0` as written because `grep -c '^D9: (write|print)$'` is a basic-regex grep that reads the parentheses and bar literally; with `-E` it prints `1` (`D9: write`). Built for the write shape. AMENDMENT BUILT BEYOND THE TASK: the README sentence also says the master switch `SKILLED_CI` must stay unset, so the YAML refuses `SKILLED_CI=off` with `REFUSE: SKILLED_CI must stay unset while the ruleset requires that context`. The message-contract refusal applies unless the README section is present without the sentence, and a missing section keeps it.
---

### T012 [x] Register the three routes (AC-002, AC-008)

File: `.skilled/commands/doctor/_routes.yaml`, anchor: `      - "getting started with skilled"` at line 317, the last trigger phrase of the `/doctor:setup` route.

Change: insert the three route blocks below immediately after the anchor line, keeping the blank line that follows it. Every trigger phrase is three or more words.

```yaml
  - command: /doctor:ci
    target: report
    yaml: doctor-ci-report.yaml
    setup_vars: [execution_mode, json_output, sha, use_gh]
    allowed_flags: ["--json", "--sha=<sha>", "--no-gh"]
    mutating: read-only
    gate3_location: "n/a (read-only report; writes nothing)"
    mcp_tools: []
    script_invocations:
      - 'node .skilled/commands/doctor/scripts/ci-report.cjs'
    trigger_phrases:
      - "ci workflow status report"
      - "list every workflow switch state"
      - "github actions drift report"
      - "ci workflow inventory"

  - command: /doctor:ci
    target: scaffold
    yaml: doctor-ci-scaffold.yaml
    setup_vars: [execution_mode, dry_run, workflow_name]
    allowed_flags: ["--dry-run", "--name=<file>"]
    mutating: mutates
    gate3_location: "the new .github/workflows/ file named by --name, written only after an explicit yes"
    mcp_tools: []
    trigger_phrases:
      - "scaffold a github actions workflow"
      - "create a workflow from the ci template"
      - "new workflow with timeout and switch"

  - command: /doctor:ci
    target: toggle
    yaml: doctor-ci-toggle.yaml
    setup_vars: [execution_mode, variable, state]
    allowed_flags: ["--variable=<name>", "--state=<on|off>"]
    mutating: <MUTATING>
    gate3_location: "<GATE>"
    mcp_tools: []
    trigger_phrases:
      - "turn off a ci workflow"
      - "set a ci switch variable"
      - "disable a workflow group"
```

Replace `<MUTATING>` with `mutates` and `<GATE>` with `the repository variable named by --variable, set only after an explicit yes` when the `D9:` line reads `write`. Replace `<MUTATING>` with `read-only` and `<GATE>` with `n/a (read-only toggle; prints the command and writes nothing)` when it reads `print`.

Check:

```bash
bash .skilled/commands/doctor/scripts/route-validate.sh
python3 -c "import yaml; d=yaml.safe_load(open('.skilled/commands/doctor/_routes.yaml')); print([(r['target'], r['mutating']) for r in d['routes'] if r['command']=='/doctor:ci'])"
```

Expected: exit 0 and a last line matching `OK: route-validate — 17 routes validated`; `[('report', 'read-only'), ('scaffold', 'mutates'), ('toggle', 'mutates')]` under the write answer, or `('toggle', 'read-only')` under the print answer.

Rollback: delete the three inserted blocks.

Stop and escalate if: `route-validate.sh` fails twice on the same assertion, or the route count is not `17`.


Evidence: `route-validate.sh` exit 0, last line is the `OK: route-validate` line ending `17 routes validated, 2 warnings` (both are the existing `--dry-run` flag-collision notes); the route parse printed `[('report', 'read-only'), ('scaffold', 'mutates'), ('toggle', 'mutates')]`. The header list of routed commands gained one `/doctor:ci` line. The report route's fourth phrase was replaced after the probe (see T014).
---

### T013 [x] Activate the three bridges (AC-009, AC-021)

File: `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`, anchors: `      "id": "command-doctor-mcp-install",` at line 227 and `      "id": "command-doctor-mcp-install",` at line 496, the last entry of the `typescript` and `python` lists.

Change: insert the TypeScript block below after the TypeScript anchor entry's closing `    }` at line 229 and before `  ],` at line 230. Insert the Python block below after the Python anchor entry's closing `    }` at line 498 and before `  ],` at line 499. Each entry has `inventoryId`, `order`, `id` and an empty `description`, in that key order.

TypeScript list:

```json
    {
      "inventoryId": "command-doctor-ci-report",
      "order": 23,
      "id": "command-doctor-ci-report",
      "description": ""
    },
    {
      "inventoryId": "command-doctor-ci-scaffold",
      "order": 24,
      "id": "command-doctor-ci-scaffold",
      "description": ""
    },
    {
      "inventoryId": "command-doctor-ci-toggle",
      "order": 25,
      "id": "command-doctor-ci-toggle",
      "description": ""
    }
```

Python list:

```json
    {
      "inventoryId": "command-doctor-ci-report",
      "order": 34,
      "id": "command-doctor-ci-report",
      "description": ""
    },
    {
      "inventoryId": "command-doctor-ci-scaffold",
      "order": 35,
      "id": "command-doctor-ci-scaffold",
      "description": ""
    },
    {
      "inventoryId": "command-doctor-ci-toggle",
      "order": 36,
      "id": "command-doctor-ci-toggle",
      "description": ""
    }
```

Check:

```bash
python3 -c "import json; d=json.load(open('.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json')); print(len([e for e in d['typescript'] if e['inventoryId'].startswith('command-doctor')]), len([e for e in d['python'] if e['inventoryId'].startswith('command-doctor')]))"
grep -c 'command-doctor-ci-' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json
```

Expected: `21 21`; `6`.

Rollback: delete the six inserted entries.

Stop and escalate if: either count is not `21`, because an activation without a matching route stays inert and a route without an activation never routes.


Evidence: the count check printed `21 21`. `grep -c 'command-doctor-ci-'` printed `12`, not `6`, because each of the six entries holds the string on two lines (`inventoryId` and `id`); a JSON count of the entries whose `inventoryId` starts with `command-doctor-ci-` printed `6`. The `order` values are 23, 24, 25 in the TypeScript list and 34, 35, 36 in the Python list, each one above the previous last entry (22 and 33).
---

### T014 [x] Regenerate the bridge projections (AC-009)

File: `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` and `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` (generated). Anchor (read): `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:679`, the line `    status: changed.length === 0 ? 'fresh' : checkOnly ? 'stale' : 'generated',`.

Change: run the deriver without `--check`, record its `changed` list, then build the runtime. Do not hand-edit any of the four files.

```bash
node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

Check:

```bash
node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check
test -f .skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/fusion.js && echo built
```

Expected: `"status": "fresh"` with `"changed": []`; `built`.

Rollback: re-run the deriver after reverting T013's six entries; the generated files return to their previous content.

Stop and escalate if: the write run does not name all four files in `changed`, or `--check` reports a file it did not generate.


Evidence: the write run exited 0 with `"status": "generated"` and named all four files in `changed`; the diff deletes only the four count lines in `command-bridges.generated.json`. `--check` then exited 0 with `"status": "fresh"` and `"changed": []` (doctorRoutes 21, typescriptActive 26, pythonActive 36) and the build marker printed `built`. The phrase probe found one miss on the first run: `list every workflow switch state` returned no recommendation (`top=null second=null`). Replacing it with `show which ci workflows are switched off` missed the same way. A third phrase, `which ci workflow switches are off`, reached the report bridge as the second line and the probe printed `STATUS=OK phrases=109 bridges=21`. No existing doctor row failed. INFERRED from the observed rows: a bridge phrase only reaches the second line when it also makes a skill pass first, so a report phrase needs `ci workflow` or `github actions` in it. Scoring plain phrases through the built scorer returned nothing for every phrase without those words.
---

### T015 [x] Add the `/doctor:setup` row (AC-010)

File: `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`, anchor: `| `/doctor:sk-code setup` | The sk-code setup battery, with a repair command per failing leg |` at line 25.

Change: insert one row immediately after the anchor line and change no existing row:

```
| `/doctor:ci report` | Lists every workflow with its switch state, trigger, filters and drift flags; `scaffold` and `toggle` are the confirmed action routes |
```

Check:

```bash
grep -cF '| `/doctor:ci report` |' .skilled/commands/doctor/assets/doctor-setup-presentation.txt
git diff --numstat -- .skilled/commands/doctor/assets/doctor-setup-presentation.txt
```

Expected: `1`; `1` added line and `0` deleted lines for that one path.

Rollback: delete the inserted row.

Stop and escalate if: the row count is not `1`, or the diff shows a deleted line, because another doctor row would have changed.


Evidence: `grep -cF '| `/doctor:ci report` |'` printed `1` and `git diff --numstat` printed `1	0` for the file.
---

### T016 [x] Create the command contract test (AC-011, AC-021)

File: `.skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` (new file). Anchor (read): `.skilled/commands/doctor/_routes.yaml:297`, the line `  - command: /doctor:setup`.

Change: parse `_routes.yaml` with `yaml` and assert: exactly three `/doctor:ci` routes with targets `report`, `scaffold` and `toggle`; `report` is `read-only`; `scaffold` is `mutates`; `toggle` matches the `D9:` line in `plan.md`; every trigger phrase has three or more words; every route declares `mcp_tools`; the router carries the `skill_agent` tag and the three target rows; the presentation carries the three menu answers, the `Valid targets:` line and the three subsystem rows; the report YAML names `ci-report.cjs`; the scaffold YAML names both templates and `protected-set.md`; the toggle YAML names all six variables and the `SKILLED_CI_MESSAGES` prohibition. Scan every file this phase creates or edits under `.skilled/commands/doctor/` for `\bR[0-9]{2}\b`, `\bD[0-9]{1,2}\b` and `[Pp]hase 0[0-9]`, and assert no match.

Check:

```bash
node --test .skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs
```

Expected: exit 0 with `fail 0`.

Rollback: delete `.skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs`.

Stop and escalate if: the suite fails twice on the same assertion, because a second failure means an asset and the manifest disagree.


Evidence: `node --test .skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` exit 0, `tests 12`, `pass 12`, `fail 0`. Four one-line mutations (toggle class flipped, a refusal reworded, the scaffold refusal reworded, an id added to the router) each failed exactly one subtest and every file was restored byte for byte. DEVIATION: the test does not read this packet's `plan.md`. A shipped test that opens a spec folder breaks when the packet is archived, so the toggle check asserts that the route's class, its gate location and the toggle YAML agree for the shape the manifest declares. The `D9:` line is still checked against the route by the packet's own acceptance command. The test also asserts the sentence the toggle enforces is still in the workflows README.
---

### T017 [x] Run the doctor script suite (AC-005, AC-011, AC-020, AC-021)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/doctor-suite.md` (new file). Anchor (read): `.skilled/commands/doctor/scripts/tests/run-all.sh:102`, the line `printf '\n[run-all] %d suite(s) passed, %d failed\n' "$passed_count" "${#failed_suites[@]}"`.

Change: run the runner, then write its exit status, its suite count and its last line to the new scratch file.

```bash
bash .skilled/commands/doctor/scripts/tests/run-all.sh
```

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -cE '^\[run-all\] [0-9]+ suite\(s\) passed, 0 failed$' "$PHASE/scratch/doctor-suite.md"
grep -c 'exit=0' "$PHASE/scratch/doctor-suite.md"
```

Expected: `1`; `1`.

Rollback: delete `scratch/doctor-suite.md`.

Stop and escalate if: a suite fails twice on the same assertion, because the runner's discovery rules are not the thing to change.
<!-- /ANCHOR:phase-2 -->


Evidence: `run-all.sh` exit 0 with `[run-all] 7 suite(s) passed, 0 failed`; the node:test suite covered 23 files, `tests 458`, `pass 458`. `scratch/doctor-suite.md` holds the exit status, the suite breakdown and that last line; the two check counts printed `1` and `1`.
---

<!-- ANCHOR:phase-3 -->
## Phase 3: The CI surface value

### T018 [x] SUPERSEDED (ADR-013): Add the CI surface to the shared contract (AC-012)

File: `.skilled/skills/sk-code/shared/references/stack-detection.md`, anchors: `| SKILLED | `.skilled/` skills, agents, commands, MCP/server code, scripts, tests, JSON/JSONC config | Webflow/browser behavior |` at line 29; `**Precedence**: SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN. An SKILLED target/CWD wins, but only when its **resolved** real path lands inside the hub's own `.skilled/` directory — see the symlink guard below. OBSIDIAN follows, because an Obsidian plugin repository is structurally a generic TypeScript + `package.json` tree that would otherwise fall through to UNKNOWN. WEBFLOW then wins over UNKNOWN. Use early-return logic — later branches must not overwrite earlier matches.` at line 39; `# 1. SKILLED (highest precedence — disambiguates mixed-marker workspaces)` at line 42; `| Changed `.skilled/agents/code.md` | SKILLED | Target file under `.skilled/` |` at line 136; `| Obsidian plugin repo-root markers (`manifest.json` with `minAppVersion`, `esbuild.config.mjs`) AND a Webflow library marker (`new Lenis`, `window.gsap`) in the same tree, no `.skilled/` target | **OBSIDIAN** | Precedence SKILLED > OBSIDIAN > WEBFLOW: the OBSIDIAN branch returns early, so the Webflow marker never overwrites it |` at line 144.

Change, in this order:

1. Insert after line 29: `| CI | `.github/workflows/*.yml` and `.github/actions/**` workflow and action definitions | `.skilled/` code, browser behavior |`
2. Replace line 39 with: `**Precedence**: SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN. An SKILLED target/CWD wins, but only when its **resolved** real path lands inside the hub's own `.skilled/` directory — see the symlink guard below. CI follows, because a workflow or action path is an explicit marker that a Webflow or Obsidian marker in the same diff must not outvote. OBSIDIAN comes next, because an Obsidian plugin repository is structurally a generic TypeScript + `package.json` tree that would otherwise fall through to UNKNOWN. WEBFLOW then wins over UNKNOWN. Use early-return logic — later branches must not overwrite earlier matches.`
3. Insert after line 43: `# 2. CI (workflow and action definitions)`, `# A changed/target file under .github/workflows/ or .github/actions/`, and a blank line; then change `# 2. OBSIDIAN` to `# 3. OBSIDIAN`, `# 3. WEBFLOW` to `# 4. WEBFLOW` and `# 4. UNKNOWN` to `# 5. UNKNOWN`.
4. Insert after line 136: `| Changed `.github/workflows/spec-kit-check.yml` | **CI** | A workflow definition is CI work |`, `| Changed `.github/actions/setup/action.yml` | **CI** | A composite action is CI work |`, `| Changed `.skilled/skills/sk-code/SKILL.md` AND changed `.github/workflows/spec-kit-check.yml` | **SKILLED** | A resolved `.skilled/` path outranks a workflow path |`, `| Changed `.github/workflows/spec-kit-check.yml` AND a `src/2_javascript/app.js` path | **CI** | A workflow path outranks a Webflow marker |`
5. Replace the reason in line 144 with: `Precedence SKILLED > CI > OBSIDIAN > WEBFLOW: the OBSIDIAN branch returns early, so the Webflow marker never overwrites it`.

Check:

```bash
F=.skilled/skills/sk-code/shared/references/stack-detection.md
grep -c '^| CI |' "$F"
grep -c 'SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN' "$F"
grep -c '\.github/workflows/' "$F"
grep -c '\.github/actions/' "$F"
grep -c '^# 5\. UNKNOWN' "$F"
```

Expected: `1`; `1`; at least `3`; at least `2`; `1`.

Rollback: restore the five anchor lines and delete the inserted rows.

Stop and escalate if: the precedence count is not `1`, because a second full occurrence makes the contract ambiguous.

Blocked before the ruling (observed 2026-10-25, nothing edited): the contract this task rewrites no longer exists. The Webflow and Obsidian surfaces were removed from the hub after this task was written, so `stack-detection.md` now defines two values, `SKILLED` and `UNKNOWN`, at precedence `SKILLED > UNKNOWN` (surface table lines 27-28, precedence line 36, step list `# 1. SKILLED` and `# 2. UNKNOWN`, the latter at line 42). Of the five quoted anchors, one is still present at a moved line (`# 1. SKILLED (highest precedence`, line 39; the `Changed .skilled/agents/code.md` row, line 85) and four are absent by `grep -cF`: the SKILLED row text ending `Webflow/browser behavior`, the `**Precedence**: SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN.` sentence, the `Obsidian plugin repo-root markers` test row, and the `# 2. OBSIDIAN` and `# 4. UNKNOWN` step lines. The check's expected string `SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN` can only be met by reintroducing two deleted surfaces. The hub's own sentence at `SKILL.md:138` also says `sk-code-ci` is the one surface stack detection does not select. Awaiting a decision on which truth prevails; see the pass B report.

Superseded: ADR-013 (operator ruling of 2026-10-25, "Drop R30, keep the hub."). The shared detection contract stays at `SKILLED > UNKNOWN` (`stack-detection.md:36`) and gains no CI row. The check was not run, because its expected strings need the two deleted surfaces. A search of `.skilled/skills/sk-code` for `SKILLED > CI` matches `0` files.

---

### T019 [x] SUPERSEDED (ADR-013): Add the CI branch to the review router (AC-013)

File: `.skilled/skills/sk-code/sk-code-review/SKILL.md`, anchors: `- Surface detection: the markers and the precedence (SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN) come from the shared detection contract, [`stack-detection.md`](../shared/references/stack-detection.md) section 2. `detect_surface_evidence` below restates that contract and keeps no rules of its own, so it changes only when the contract does.` at line 58; `SKILLED_PATH_MARKER = ".skilled/"` at line 223; `    """Return SKILLED, OBSIDIAN, WEBFLOW or UNKNOWN, in the shared contract's precedence.` at line 234; `    if any(path.startswith(SKILLED_PATH_MARKER) or "/" + SKILLED_PATH_MARKER in path for path in paths):` at line 249.

Change, in this order:

1. In line 58, replace `(SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` with `(SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN)`.
2. Insert after line 223: `CI_PATH_MARKERS = (".github/workflows/", ".github/actions/")`.
3. Replace line 234 with `    """Return SKILLED, CI, OBSIDIAN, WEBFLOW or UNKNOWN, in the shared contract's precedence.`
4. Insert after the `    return "SKILLED"` line that follows the branch at line 249: a `def under_ci(path: str) -> bool:` helper that tests path segments, and the branch `    if any(under_ci(path) for path in paths): return "CI"`.
5. In the three surface-packet lists at lines 39, 42 and 499, add `sk-code-ci` to the parenthesised list.

Leave the OBSIDIAN, non-Webflow and WEBFLOW branches byte-identical apart from their position.

Check:

```bash
F=.skilled/skills/sk-code/sk-code-review/SKILL.md
grep -c 'CI_PATH_MARKERS' "$F"
grep -c 'SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN' "$F"
grep -c 'Return SKILLED, CI, OBSIDIAN, WEBFLOW or UNKNOWN' "$F"
grep -c 'sk-code-ci' "$F"
```

Expected: `2`; `1`; `1`; at least `3`.

Rollback: restore the four anchor lines and delete the helper and the branch.

Stop and escalate if: the `CI_PATH_MARKERS` count is not `2`, or the inline block no longer parses with `python3 -m py_compile`.

Blocked before the ruling (observed 2026-10-25, nothing edited): depends on T018. In `sk-code-review/SKILL.md` the inline `detect_surface_evidence` (line 225) now has one branch, SKILLED, then `return "UNKNOWN"` (lines 238-241); the OBSIDIAN, non-Webflow and WEBFLOW branches this task says to leave byte-identical do not exist. Anchors: line 58 reads `(SKILLED > UNKNOWN)`, so the `(SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` replacement text is absent (count 0); the docstring at line 226 reads `Return SKILLED or UNKNOWN`, so `Return SKILLED, OBSIDIAN, WEBFLOW or UNKNOWN` is absent (count 0); `SKILLED_PATH_MARKER = ".skilled/"` is present at line 223. The surface-packet lists at lines 39 and 42 name only `sk-code-skilled`, and the file has no `sk-code-ci` mention (count 0), so the list edit is real work, but it belongs to the same unresolved contract change.

Superseded: ADR-013 (operator ruling of 2026-10-25, "Drop R30, keep the hub."). The review router keeps its one detection branch. Its surface label reads `UNKNOWN` for a workflow diff, observed on 2026-10-25 by running the inline block on `.github/workflows/spec-kit-check.yml`. That is a known limitation, recorded in ADR-013 and `implementation-summary.md`, and not a task.

---

### T020 [x] SUPERSEDED (ADR-013): Update the hub SKILL.md restatements (AC-013)

File: `.skilled/skills/sk-code/SKILL.md`, anchors: `Bundled surfaces follow the `routerPolicy.tieBreak` order, which is the detection precedence SKILLED > OBSIDIAN > WEBFLOW, so the higher-precedence evidence packet comes first.` at line 74; `Surface detection (`SKILLED`, `OBSIDIAN`, `WEBFLOW`, `UNKNOWN`, at precedence SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN) lives once in the hub's `shared/` layer and is consumed by every mode and surface. `MOTION_DEV` is a resource intent loaded after the surface decision, not a surface. Modes own workflow contracts, not surface identity.` at line 139.

Change:

1. Replace line 74's last sentence with: `Bundled surfaces follow the `routerPolicy.tieBreak` order, which is the bundle order, not the single-surface detection precedence; [`shared/references/stack-detection.md`](shared/references/stack-detection.md) owns that precedence.`
2. In line 139, replace `(`SKILLED`, `OBSIDIAN`, `WEBFLOW`, `UNKNOWN`, at precedence SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` with `(`SKILLED`, `CI`, `OBSIDIAN`, `WEBFLOW`, `UNKNOWN`, at precedence SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN)`.

Change no other sentence and no count.

Check:

```bash
F=.skilled/skills/sk-code/SKILL.md
grep -c 'SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN' "$F"
sed -n '74p' "$F" | grep -c 'stack-detection.md'
grep -c 'bundle order' "$F"
```

Expected: `1`; `1`; at least `1`.

Rollback: restore the two anchor sentences.

Stop and escalate if: the precedence count is not `1`, because a second occurrence means another sentence was edited.

Blocked before the ruling (observed 2026-10-25, nothing edited): depends on T018. Both quoted sentences are gone from `SKILL.md`. The line 74 sentence was already reworded when the CI surface packet landed: line 73 now ends `Bundled surfaces follow the routerPolicy.tieBreak order, which ranks sk-code-ci ahead of sk-code-skilled, so the surface that wins a keyword tie comes first.`, which already separates the bundle order from detection and does not name the precedence. Line 138 reads `Surface detection (SKILLED, UNKNOWN, at precedence SKILLED > UNKNOWN) ...` and ends `sk-code-ci is the one surface that stack detection does not select: the hub bundles it from request vocabulary alone`, so a CI detection value would also make that sentence false. The task's `version: 2.3.0.0` anchor is also stale: the file reads `2.4.0.0` (line 5).

Superseded: ADR-013 (operator ruling of 2026-10-25, "Drop R30, keep the hub."). The hub `SKILL.md` is not edited. Line 138 already says `sk-code-ci` is the one surface that stack detection does not select.

---

### T021 [x] SUPERSEDED (ADR-013): Update the three precedence restatements (AC-013)

File: `.skilled/skills/sk-code/ROUTER.md`, anchor: `| SURFACE | After WEBFLOW, SKILLED or OBSIDIAN detection | Surface-specific resources (`sk-code-webflow/references/shared/*`, `sk-code-skilled/references/shared/*`, or the `sk-code-obsidian/references/*` leaves its packet router maps) |` at line 112. File: `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`, anchor: `The ladder consumes the detected surface; it does NOT change surface precedence (SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN) or the Iron Law (Phase 3 verification is still required). For the over-engineering, gold-plating, and scope-creep detectors, see the Restraint Signals table in the repo `AGENTS.md` §3.` at line 56. File: `.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md`, anchor: `The ladder is a post-read reflex that runs AFTER surface and intent routing, so it consumes the detected surface but changes neither surface precedence (SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN) nor the Iron Law (Phase 3 verification is still required). It is gated to the Phase 0 to Phase 1 transition and named in the SKILL.md Phase Overview.` at line 13.

Change:

1. In `ROUTER.md:112`, replace `After WEBFLOW, SKILLED or OBSIDIAN detection` with `After SKILLED, CI, OBSIDIAN or WEBFLOW detection`.
2. In `code-quality-standards.md:56`, replace `(SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` with `(SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN)`.
3. In `design-restraint-ladder.md:13`, replace `(SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` with `(SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN)`.

Change no other sentence and no count.

Check:

```bash
grep -L 'SKILLED, CI, OBSIDIAN or WEBFLOW\|SKILLED > CI' .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md .skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md
grep -c 'SKILLED, CI, OBSIDIAN or WEBFLOW' .skilled/skills/sk-code/ROUTER.md
```

Expected: nothing printed by `grep -L`; `1`.

Rollback: restore the three anchor sentences.

Stop and escalate if: `grep -L` names a file, because one restatement would still carry the old order.

Blocked before the ruling (observed 2026-10-25, nothing edited): depends on T018. All three anchor sentences are absent: `ROUTER.md:107` now reads `| SURFACE | After SKILLED detection | Surface-specific resources (sk-code-skilled/references/shared/*) |`, and `code-quality-standards.md` and `design-restraint-ladder.md` read `(SKILLED > UNKNOWN)`. `grep -cF '(SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)'` returns `0` for both, and `grep -cF 'After WEBFLOW, SKILLED or OBSIDIAN detection'` returns `0` for `ROUTER.md`.

Superseded: ADR-013 (operator ruling of 2026-10-25, "Drop R30, keep the hub."). `ROUTER.md`, `code-quality-standards.md` and `design-restraint-ladder.md` are not edited. They read `SKILLED > UNKNOWN`.

---

### T022 [x] SUPERSEDED (ADR-013): Raise the six versions and add the two changelog entries (AC-018)

File: `.skilled/skills/sk-code/changelog/<new-version>.md` and `.skilled/skills/sk-code/sk-code-review/changelog/<new-version>.md` (new files), plus the six changed docs' frontmatter. Anchor (read): `.skilled/skills/sk-code/SKILL.md:5`, the line `version: 2.3.0.0`.

Change: stage the six changed docs, run the bump tool, then write one changelog file per version the tool prints for the hub and for `sk-code-review`. Each changelog file holds one line naming the CI surface value. Do not edit a version the tool already raised.

```bash
git add .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/sk-code-review/SKILL.md .skilled/skills/sk-code/shared/references/stack-detection.md .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md .skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md
node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base origin/main
```

Check:

```bash
node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --check --base origin/main
git diff --cached -- .skilled/skills/sk-code | grep -cE '^\+version:'
python3 -c "import re,os; v=re.search(r'^version: (.+)$', open('.skilled/skills/sk-code/sk-code-review/SKILL.md').read(), re.M).group(1); print(v, os.path.exists(f'.skilled/skills/sk-code/sk-code-review/changelog/v{v}.md'))"
python3 -c "import re,os; v=re.search(r'^version: (.+)$', open('.skilled/skills/sk-code/SKILL.md').read(), re.M).group(1); print(v, os.path.exists(f'.skilled/skills/sk-code/changelog/v{v}.md'))"
```

Expected: exit 0; at least `6`; a version followed by `True`; a version followed by `True`.

Rollback: `git checkout --` the six docs and delete the two changelog files.

Stop and escalate if: the bump tool exits non-zero twice, because `@spec-kit/shared` is not built and T002 did not complete.

Blocked before the ruling (observed 2026-10-25, nothing staged or bumped): there are no edits from T018 to T021 to version. Read-only observations for the retry: `SKILL.md` reads `2.4.0.0` (the task anchors `2.3.0.0`) with changelog files up to `v2.4.0.0.md`; `sk-code-review/SKILL.md` reads `1.7.1.0` with changelog files up to `v1.7.1.0.md`; `stack-detection.md` reads `2.2.2.0`, `ROUTER.md` `2.2.15.0`, `code-quality-standards.md` and `design-restraint-ladder.md` `1.5.2.0`. `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --check --base origin/main` exited 0 and printed `[bump] 1 changed docs | every changed body raised its version`, so the tool runs here. The `sk-code-ci` packet reads inconsistently and the task does not touch it: `SKILL.md` `0.1.0.0`, `changelog/v0.1.0.0.md` `0.1.0.0`, `README.md` `1.0.0.0`; left as found for the operator.

Superseded: ADR-013 (operator ruling of 2026-10-25, "Drop R30, keep the hub."). No sk-code doc changes in this phase, so no version is bumped and no changelog entry is written.

---

### T023 [x] SUPERSEDED (ADR-013): Refresh the compiled route (AC-019)

File: `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` (generated and its authored twin). Anchor (read): `.skilled/skills/sk-code/SKILL.md:5`, the line `version: 2.3.0.0`.

Change: refresh the manifest, copy it over the authored twin, then run the four gates.

```bash
node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code
cp .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json
node .skilled/bin/compiled-route-guard.cjs
node .skilled/bin/compiled-route-sync.cjs --check
node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs
```

Check:

```bash
node .skilled/bin/compiled-route-guard.cjs | grep -c 'sk-code *fresh'
node .skilled/bin/compiled-route-sync.cjs --check | tail -1
cmp .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json && echo twin-matches
```

Expected: `1`; a last line ending `served copies match their authored files`; `twin-matches`.

Rollback: `git checkout --` both manifest paths.

Stop and escalate if: the guard reports `sk-code stale` after a second refresh, because the policy hash covers a file the phase did not expect.

Blocked before the ruling (observed 2026-10-25, no refresh run): the manifest is regenerated only after the hub `SKILL.md` changes, and T020 is blocked. The manifest in the tree is current for the unedited hub (`effectivePolicyHash` `37718f519c97811a07c1ddbbb6ec5979eeab7eb17d7e4fe71ba4625795e8eaf8`, generation 2).

Superseded: ADR-013 (operator ruling of 2026-10-25, "Drop R30, keep the hub."). No hub doc changes in this phase, so the compiled manifest is not refreshed. The gates run on the untouched tree gave `compiled-route-guard.cjs` exit 0 with `sk-code` and `fresh`, `compiled-route-sync.cjs --check` exit 0 with `all 55 served copies match their authored files` and `generate-router-intent-signals.cjs --check` exit 0 with `RESULT: PASSED`.

---

### T024 [x] SUPERSEDED (ADR-013): Write the surface-detection regression test (AC-014)

File: `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs` (new file). Anchor (read): `.skilled/skills/sk-code/sk-code-review/SKILL.md:125`, the line ` ```python `.

Change: read `sk-code-review/SKILL.md`, extract the first ```` ```python ```` block, write it to a temp file, and run it with `python3` through a harness that calls `detect_surface_evidence` with JSON fixtures. Assert exactly: `.skilled/skills/sk-code/SKILL.md` returns `SKILLED`; a `manifest.json` whose text contains `"minAppVersion"` returns `OBSIDIAN`; `src/2_javascript/app.js` returns `WEBFLOW`; `.github/workflows/spec-kit-check.yml` returns `CI`; `.github/actions/setup/action.yml` returns `CI`; `README.md` returns `UNKNOWN`; the SKILL.md path plus the workflow path returns `SKILLED`; the workflow path plus the Webflow path returns `CI`; `docs/.github/workflows-notes.md` returns `UNKNOWN`. Assert the shared contract contains `| CI |` and `SKILLED > CI > OBSIDIAN > WEBFLOW > UNKNOWN`, and that the review router contains `CI_PATH_MARKERS`. Do not change a fixture to make the test pass.

Check:

```bash
node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs
```

Expected: exit 0 with at least `9` passing subtests and `fail 0`.

Rollback: delete `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/surface-detection.test.cjs`.

Stop and escalate if: an existing-surface fixture returns a value other than the one the contract's §4 table states, because the precedence edit changed a result it must not change.

Blocked before the ruling (observed 2026-10-25, test not written): the fixtures cannot be satisfied by the current inline block. Two of the three "existing surface" fixtures, `manifest.json` with `"minAppVersion"` returning `OBSIDIAN` and `src/2_javascript/app.js` returning `WEBFLOW`, name surfaces that are deleted, and the inline block returns `UNKNOWN` for both. The task's own stop condition is that an existing-surface fixture returning another value halts the work. `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/` holds three files (`run-all-drift-guards.test.cjs`, `verify-doc-claims.test.cjs`, `verify-router-sync.test.cjs`) and no surface-detection test. Dropping those two leaves 7 of the task's 9 fixture rows, so the `at least 9` passing subtests in the check and in the acceptance row would then depend on counting the three contract and router assertions as separate subtests.

Superseded: ADR-013 (operator ruling of 2026-10-25, "Drop R30, keep the hub."). `surface-detection.test.cjs` is not written, because two of its fixtures name the deleted Webflow and Obsidian surfaces and its CI case needs the superseded detection value.

---

### T025 [x] SUPERSEDED (ADR-013): Run the sk-code tests and drift guards (AC-015)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/sk-code-gates.md` (new file). Anchor (read): `.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:1`, the line `#!/usr/bin/env bash`.

Change: run the two gates and write each command, its exit status and its last line to the new scratch file.

```bash
node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
```

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -c 'all 4 guards PASSED' "$PHASE/scratch/sk-code-gates.md"
grep -c 'exit=0' "$PHASE/scratch/sk-code-gates.md"
```

Expected: `1`; at least `2`.

Rollback: delete `scratch/sk-code-gates.md`.

Stop and escalate if: `verify-doc-claims.cjs` reports a surface count, because phase 006's registration and this phase's prose would then disagree; record the file and line and stop rather than editing a count.

Blocked before the ruling (observed 2026-10-25, `scratch/sk-code-gates.md` not written): the gates are the closing proof of T018 to T024, which have not run. Baseline re-observed on the untouched tree so the later run has a comparison: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` exit 0 with `tests 27`, `pass 27`, `fail 0`; `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exit 0 with `all 4 guards PASSED, 10 non-blocking warning(s)`.

Superseded: ADR-013 (operator ruling of 2026-10-25, "Drop R30, keep the hub."). `scratch/sk-code-gates.md` is not written. The two gates still run in the final gate of T030: the test glob exited 0 with `tests 27`, `pass 27` and `fail 0`, and the runner exited 0 with `all 4 guards PASSED, 10 non-blocking warning(s)`, the same numbers as the baseline. Their output is in `scratch/phase-result.md`.

---

### T026 [x] Record the compiled-route observation (AC-022)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/compiled-route.md` (new file). Anchor (read): `.skilled/skills/sk-code/hub-router.json:5`, the line `    "defaultMode": null,`.

Change: run the route twice, once without a hint and once with `--surface-hint CI`, and write both JSON lines plus one verdict line to the new scratch file.

```bash
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review the GitHub Actions workflow diff in .github/workflows/spec-kit-check.yml"
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review the GitHub Actions workflow diff in .github/workflows/spec-kit-check.yml" --surface-hint CI
```

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -c '"sk-code-ci"' "$PHASE/scratch/compiled-route.md"
grep -cE '^(bundles: (yes|no)|verdict: .+)$' "$PHASE/scratch/compiled-route.md"
```

Expected: `1` when phase 006 has registered `sk-code-ci`; `1` verdict line. When the count is `0`, write `bundles: no` with the observed `selectionKind` and mark this task blocked rather than editing phase 006.

Rollback: delete `scratch/compiled-route.md`.

Stop and escalate if: the two runs disagree with each other on `selectionKind` in a way the hint does not explain, because the hub policy would then be mid-change.

Evidence: both runs exited 0 and returned `selectionKind` `surfaceBundle` with `sk-code-review` first and `sk-code-ci` second (policy hash `37718f51...e8eaf8`, generation 2), so `bundles: yes` is written in `scratch/compiled-route.md`. `grep -cE '^(bundles: (yes|no)|verdict: .+)$'` printed `1`. DEVIATION: `grep -c '"sk-code-ci"'` printed `2`, not the expected `1`, because the file holds both route outputs and each names the packet; the single hinted run piped to `grep -c` (the acceptance row's own command) prints `1`. The no-hint run already bundles, so the bundle comes from the workflow vocabulary in `hub-router.json`, not from surface detection: a vague prompt (`review my changes`) returns `single` with only `sk-code-review` under no hint, `--surface-hint CI` and `--surface-hint SKILLED`. This observation predates any hub edit, so re-run it if a manifest refresh lands later.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

### T027 [x] Run the doctor gates and record them (AC-008, AC-009)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/doctor-gates.md` (new file). Anchor (read): `.skilled/commands/doctor/scripts/route-validate.sh:1`, the line `#!/usr/bin/env bash`.

Change: run the three gates and write each command, its exit status and its last line to the new scratch file.

```bash
bash .skilled/commands/doctor/scripts/route-validate.sh
node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check
node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs
```

Expected: `17 routes validated`; `"status": "fresh"` with `"changed": []`; `STATUS=OK` with `bridges=21`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -c '17 routes validated' "$PHASE/scratch/doctor-gates.md"
grep -c '"status": "fresh"' "$PHASE/scratch/doctor-gates.md"
grep -c 'STATUS=OK phrases=[0-9]* bridges=21' "$PHASE/scratch/doctor-gates.md"
```

Expected: `1`; `1`; `1`.

Rollback: delete `scratch/doctor-gates.md`.

Stop and escalate if: a phrase row fails twice with the same phrase, because a new phrase would then be displacing an existing bridge and the replacement must be a different new phrase.

Evidence: `route-validate.sh` exit 0, `OK: route-validate`, then `17 routes validated, 2 warnings`; the deriver `--check` exit 0, `"status": "fresh"` with `"changed": []`; the phrase probe exit 0, `STATUS=OK phrases=109 bridges=21`. The check block printed `1`, `1` and `1`. These gates read no sk-code file, so the blocked surface work cannot change them, but T030 re-runs them from the final state.

---

### T028 [x] Run the live report and record the newest non-rebuild SHA (AC-003, AC-004)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/live-report.md` and `scratch/live-report.json` (new files). Anchor (read): `.github/workflows/README.md:24`, the line `| Workflow | Responsibility |`.

Change: run the report, reduce it to the count, the SHA and the switch set, read the SHA's last commit-message line, and write all four values to the new scratch file.

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
node .skilled/commands/doctor/scripts/ci-report.cjs --json > "$PHASE/scratch/live-report.json"
python3 -c "import json; d=json.load(open('$PHASE/scratch/live-report.json')); print(len(d['workflows']), d['newestNonRebuildSha'], sorted({w['switch'] for w in d['workflows']}))"
gh api repos/{owner}/{repo}/commits/<newestNonRebuildSha> --jq .commit.message | awk 'NF{last=$0} END{print last}'
```

Expected: the workflow count equals `ls .github/workflows/*.yml | wc -l`; a 40-hex SHA; a switch set drawn only from `on`, `off`, `partial`, `missing` and `unknown`; a last message line other than `Trigger-Index-Rebuild: ci`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -cE '^workflows: [0-9]+$' "$PHASE/scratch/live-report.md"
grep -cE 'newest non-rebuild SHA: [0-9a-f]{40}' "$PHASE/scratch/live-report.md"
grep -cE '^last message line: ' "$PHASE/scratch/live-report.md"
```

Expected: `1`; `1`; `1`.

Rollback: delete the two scratch files.

Stop and escalate if: the workflow count differs from the glob, because the report would be omitting a file.

Evidence: `ci-report.cjs --json` exit 0 (read-only `gh` calls). 32 workflows against `ls .github/workflows/*.yml | wc -l` = 32; switch set `['on']`; all six variables `unset`; `errors` empty; `newestNonRebuildSha` `4e0b8560cb51c3809ab37d2f2de757da78948e42` with reason `no rebuild commit above it`. `gh api repos/{owner}/{repo}/commits/<sha> --jq .commit.message` gives the subject `docs(doctor): list the ci command in setup` and the last non-empty line `Commit-Id: 0012176`, not `Trigger-Index-Rebuild: ci`. The three check counts printed `1`, `1` and `1`.

---

### T029 [x] Prove the report writes nothing (AC-017)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/report-read-only.md` (new file). Anchor (read): `.skilled/commands/doctor/scripts/ci-report.cjs:1`, the line `#!/usr/bin/env node`.

Change: capture the tree status, run the report, capture it again, and write the diff result to the new scratch file.

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
git status --porcelain -- .github .skilled > "$PHASE/scratch/status-before.txt"
node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh > /dev/null
git status --porcelain -- .github .skilled > "$PHASE/scratch/status-after.txt"
diff -u "$PHASE/scratch/status-before.txt" "$PHASE/scratch/status-after.txt"
```

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -c 'status-identical: yes' "$PHASE/scratch/report-read-only.md"
git diff --exit-code -- .github/workflows && echo workflows-untouched
```

Expected: `1`; `workflows-untouched`.

Rollback: delete the three scratch files.

Stop and escalate if: the diff prints a line, because the report changed the tree.

Earlier pass (partial, task left open then): `scratch/status-before.txt` and `scratch/status-after.txt` were captured around `ci-report.cjs --json --no-gh` (exit 0); `diff -u` printed nothing and exited 0; both files hold the same one line, a `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` change that was in the tree before the run; `git diff --exit-code -- .github/workflows` exited 0 (`workflows-untouched`). The write of `scratch/report-read-only.md` was refused twice by the tool layer (it rejects report-like file names from this worker), so the check's `status-identical: yes` count could not be produced here and the task is not ticked. The file content to create is in the pass B report.

Evidence: `scratch/report-read-only.md` now exists (created 2026-10-25 by the orchestrator) and holds `status-identical: yes`. The check printed `1` for `grep -c 'status-identical: yes'` and `workflows-untouched` for `git diff --exit-code -- .github/workflows` (exit 0). A fresh derivation in the closure pass agrees: the report script has `0` matches for a file-write API (the fixture test file, used as a control, has `2`), its only `gh` calls are `variable list`, `run list` and `api` reads, and a hash of `.github` and `.skilled/commands/doctor/scripts` taken before and after a `--no-gh` run was identical (`diff` exit 0). A whole-tree `git status` comparison taken in the same pass was not usable, because another process edited `.skilled/commands/doctor/ci.md` between the two captures. That edit is not the report's: the script has no write call.

---

### T030 [x] Run the full gate and write the phase result (AC-008, AC-009, AC-016)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/scratch/phase-result.md` (new file). Anchor (read): `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/spec.md:42`, the line `| **Handoff Criteria** |`.

Change: run the eight commands below, write each command, its exit status and its last line to the new scratch file, add the D9 answer, the live report's workflow count and SHA, and the line `ephemeral-id hits: 0`.

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
bash .skilled/commands/doctor/scripts/tests/run-all.sh
node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
bash .skilled/commands/doctor/scripts/route-validate.sh
node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check
node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs
git status --porcelain
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/$PHASE" --strict
```

Expected: every suite passes; `17 routes validated`; `"status": "fresh"`; `STATUS=OK` with `bridges=21`; a changed-file list inside the command folder, the bridge folder, the sk-code docs and `$PHASE/`; and `RESULT: PASSED`. When the only remaining validator errors are `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `METADATA_DISK_PATH_CONSISTENCY` or packet-identity lines, record `RESULT: FAILED` with those lines and leave the task blocked for the orchestrator; do not hand-edit `graph-metadata.json` or `description.json`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -cE 'RESULT: (PASSED|FAILED)' "$PHASE/scratch/phase-result.md"
grep -c 'ephemeral-id hits: 0' "$PHASE/scratch/phase-result.md"
grep -cE '^D9: (write|print)$' "$PHASE/scratch/phase-result.md"
```

Expected: at least `1`; `1`; `1`.

Rollback: delete `scratch/phase-result.md`.

Stop and escalate if: a gate fails twice on the same assertion, because the phase result would then record a failure the phase cannot repair inside its scope.

Blocked before the ruling (observed 2026-10-25): the full gate is the closing proof of the surface work, which has not been done (T018 to T025 are blocked on the stale detection contract), so `scratch/phase-result.md` is not written. A phase result written now would carry `17 routes validated`, `STATUS=OK` and a 40-hex SHA while the surface half of the phase is absent. Gates already observed from the current tree are recorded in T025 to T028 and `scratch/doctor-gates.md`.

Evidence: `scratch/phase-result.md` is written. The surface half is superseded by ADR-013 (T018 to T025), so the gate no longer waits on it. The code gates ran between 09:52 and 09:57 UTC on 2026-10-25 and all exited 0: `run-all.sh` printed `7 suite(s) passed, 0 failed` with node:test `tests 458`, `pass 458`. The sk-code test glob printed `tests 27`, `pass 27` and `fail 0`. The drift runner printed `all 4 guards PASSED, 10 non-blocking warning(s)`. `route-validate.sh` printed `17 routes validated, 2 warnings`. The deriver `--check` printed `"status": "fresh"` with `"changed": []`. The phrase probe printed `STATUS=OK phrases=109 bridges=21`. The strict validator ran on the phase folder with `--no-recursive` after `repair-derived.cjs --apply` and printed `Summary: Errors: 0  Warnings: 0` then `RESULT: PASSED`. The check block printed `1` for `RESULT: (PASSED|FAILED)`, `1` for `ephemeral-id hits: 0` and `1` for the `D9:` line. The id grep ran over the range of the three doctor commits, because `scratch/pre-phase.md` records no start SHA, and matched `0` lines. `git status --porcelain` lists changes that this phase did not make: another process edited the doctor assets, `ci.md` and the `sk-code-ci` docs in this worktree during the pass, and they are uncommitted.


---

### T031 [x] Commit the change as one commit per concern and prove no ephemeral id entered code (AC-016)

File: the staged paths under `.skilled/commands/doctor/`, `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/`, `.skilled/skills/sk-code/`, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/` and `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/`. Anchor (read): `.skilled/skills/sk-git/scripts/validate-message.mjs:1`, the line `#!/usr/bin/env node`.

Change: make four commits, one per concern, in this order: the report, the scaffold and toggle, the sk-code surface, and the `/doctor:setup` row. Unstage the earlier tasks' paths first so no concern leaks into another commit. For each commit, stage only that concern's paths, write the full message to `$PHASE/scratch/commit-<concern>.txt`, run the validator and require exit 0, then commit with `git commit -F`.

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
git reset

git add .skilled/commands/doctor/ci.md .skilled/commands/doctor/assets/doctor-ci-presentation.txt .skilled/commands/doctor/assets/doctor-ci-report.yaml .skilled/commands/doctor/scripts/ci-report.cjs .skilled/commands/doctor/scripts/tests/ci-report.test.cjs
git diff --cached -- .skilled .github | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]' || true
cat > "$PHASE/scratch/commit-report.txt" <<'EOF'
feat(doctor): report every workflow switch state

The report lists every workflow with its switch state, trigger, filters and drift flags.

Spec: system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit "$PHASE/scratch/commit-report.txt"
git commit -F "$PHASE/scratch/commit-report.txt"

git add .skilled/commands/doctor/_routes.yaml .skilled/commands/doctor/assets/doctor-ci-scaffold.yaml .skilled/commands/doctor/assets/doctor-ci-toggle.yaml .skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py .skilled/skills/system-skill-advisor/runtime/lib/render.ts
git diff --cached -- .skilled .github | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]' || true
cat > "$PHASE/scratch/commit-scaffold-toggle.txt" <<'EOF'
feat(doctor): scaffold and toggle ci workflows

The scaffold creates new workflows from the sk-code-ci templates, and the toggle changes one documented switch after an explicit yes.

Spec: system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit "$PHASE/scratch/commit-scaffold-toggle.txt"
git commit -F "$PHASE/scratch/commit-scaffold-toggle.txt"

git add .skilled/skills/sk-code .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json
git diff --cached -- .skilled .github | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]' || true
cat > "$PHASE/scratch/commit-sk-code.txt" <<'EOF'
feat(sk-code): add the ci surface value

The shared detection contract, the review router and the hub restatements name CI after SKILLED, and the versions and compiled route follow.

Spec: system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit "$PHASE/scratch/commit-sk-code.txt"
git commit -F "$PHASE/scratch/commit-sk-code.txt"

git add .skilled/commands/doctor/assets/doctor-setup-presentation.txt
git diff --cached -- .skilled .github | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]' || true
cat > "$PHASE/scratch/commit-setup-row.txt" <<'EOF'
docs(doctor): list the ci command in setup

The setup target list gains one report row so the command is discoverable.

Spec: system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit "$PHASE/scratch/commit-setup-row.txt"
git commit -F "$PHASE/scratch/commit-setup-row.txt"
```

Check:

```bash
git log --oneline -4
git diff HEAD~4..HEAD -- .skilled .github | grep -cE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]' || true
```

Expected: the four subjects in the log; `0`.

Rollback: `git reset --soft HEAD~4` restores the staged state without losing a file.

Stop and escalate if: the id grep prints a line after the second attempt, because an asset carries a spec id that must be reworded before the commit.

Evidence: three commits landed on `main`, not four. `git fetch -q origin main` exited 0, and `git merge-base --is-ancestor` exited 0 for each of `10c6791341` (feat(doctor): report every workflow switch state), `e0f922b593` (feat(doctor): scaffold and toggle ci workflows) and `4e0b8560cb` (docs(doctor): list the ci command in setup). The id grep over their patches, over the combined diff `cfd9285e32..4e0b8560cb` and over their messages matched `0` lines, and a seeded control line matched `1`. The sk-code commit is not made, because R30 is superseded by ADR-013, so no `git add` for the sk-code paths ran and `scratch/commit-sk-code.txt` is an unused draft. DEVIATION: the check's `git log --oneline -4` and `HEAD~4..HEAD` diff are replaced by the three subjects above and the grep over `cfd9285e32..4e0b8560cb`, because the fourth commit does not exist.

---

### T032 [x] Close the acceptance rows (AC-001 to AC-022)

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/acceptance-criteria.md`, anchor: `| AC-001 | R28 | REQ-001 |` at the first criteria row.

Change: for each row, replace `Unmet` with `Met` when its verification command passed in T027 to T031, and leave `Unmet` otherwise. Write the command and its observed result in the row's Verification cell when the cell does not already name one. Set the closure statement's `**Closeable:**` value to `Yes` only when every row is `Met`, `Waived` or `Superseded`.

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
grep -c '| Unmet |' "$PHASE/acceptance-criteria.md" || true
grep -c '^| AC-0' "$PHASE/acceptance-criteria.md"
grep -c '^\*\*Closeable:\*\* ' "$PHASE/acceptance-criteria.md"
```

Expected: `0`; `22`; `1`.

Rollback: restore the file from `git checkout --` and leave the rows as they were.

Stop and escalate if: a row cannot be marked `Met` and has no ADR to waive it, because the phase would then be closing on an unmet criterion.

Evidence: the check block printed `0` for `grep -c '| Unmet |'`, `22` for the AC rows and `1` for the Closeable line, which reads `Yes`. A status tally over the table gave 17 `Met` and 5 `Superseded`, with no `Waived` and no `Unmet` row. The five `Superseded` rows are AC-012, AC-013, AC-014, AC-018 and AC-019, and each names ADR-013, which exists in `decision-record.md`. Every `Met` row carries the command result observed on 2026-10-25 in its Verification cell. DEVIATION: AC-021 is `Met` although its literal `grep -c` prints `12` and not `6`, because each of the six activation entries matches on two lines, and the row records that. AC-015 is `Met` against the existing sk-code suites only, because REQ-007 is superseded.

---

### T033 [x] Commit the closure edits (AC-001 to AC-022)

Evidence: the closure edits landed as `8811c7e36d`, `docs(spec): close the doctor ci and review wiring criteria`, and `git merge-base --is-ancestor 8811c7e36d origin/main` exits 0 (observed 2026-10-25). The 19 workflow runs on that push all concluded `success`, including Spec-Kit Check and Routing Registry Drift Guard.

File: `specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring/acceptance-criteria.md`. Anchor (read): `.skilled/skills/sk-git/scripts/validate-message.mjs:1`, the line `#!/usr/bin/env node`.

Change: stage the closure file, write the full message to `$PHASE/scratch/commit-closure.txt`, run the validator and require exit 0, then commit with `git commit -F`. The message has a conventional subject, a blank line, a prose body, a blank line, and the `Spec:` trailer.

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
git add "$PHASE/acceptance-criteria.md"
cat > "$PHASE/scratch/commit-closure.txt" <<'EOF'
docs(spec): close the acceptance criteria

Every criterion row carries its observed result and the closure statement records the verdict.

Spec: system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
EOF
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit "$PHASE/scratch/commit-closure.txt"
git commit -F "$PHASE/scratch/commit-closure.txt"
```

Check:

```bash
PHASE=specs/system-speckit/053-ci-workflow-efficiency/009-doctor-ci-review-wiring
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit "$PHASE/scratch/commit-closure.txt"
git log -1 --format=%s
git status --porcelain -- "$PHASE/acceptance-criteria.md" | grep -c . || true
```

Expected: exit 0; `docs(spec): close the acceptance criteria`; `0`.

Rollback: `git reset --soft HEAD~1` keeps the closure edit staged and leaves the message file in `scratch/`.

Stop and escalate if: the validator exits non-zero twice, or the committed subject is not the message's first line, because the subject and trailer would then be malformed.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [EVIDENCE: T001 to T033 are `[x]`; the closure commit is `8811c7e36d`, on `origin/main`]
- [x] No `[B]` blocked tasks remaining [EVIDENCE: re-run 2026-10-25: `grep -c '^### T0[0-9][0-9] \[B\]'` over this file prints `0`, and the 32 closed task headings read `[x]`]
- [x] Manual verification passed [EVIDENCE: re-run 2026-10-25: the R28 probe record, the live report run and the compiled route runs listed under CHK-021 all hold, and the strict validator prints `RESULT: PASSED` on this folder]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Recommendations**: See `../001-research/research/synthesis-reviews/final-review.md` (`:504-532` for R28 to R30, `:600-607` for the phase plan, `:622` for D9)
- **Rules this phase reads**: See `../006-sk-code-ci-surface/` and its `references/` and `assets/`
- **Switch names this phase reads**: See `../007-workflow-hygiene-on-off-control/` and its `scratch/switch-groups.md`

| R-id | Requirements | Tasks | Acceptance criteria |
|------|--------------|-------|---------------------|
| R28 | REQ-001 | T001, T004, T030 | AC-001, AC-002 |
| R29 | REQ-002, REQ-003, REQ-004, REQ-005 | T005 to T017, T027, T028, T029 | AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009, AC-010, AC-011, AC-020, AC-021 |
| R30 | REQ-006, REQ-007 (superseded by ADR-013) | T018 to T025 superseded, T026 done | AC-012, AC-013, AC-014, AC-015, AC-018, AC-019, AC-022 |
| Gates and decisions | REQ-008, REQ-009, REQ-010, REQ-011 | T002, T003, T029, T030, T031, T032, T033 | AC-016, AC-017, AC-023, AC-024 |
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

- [x] CHK-001 [P0] Requirements documented in spec.md - planned as REQ-001 to REQ-011, each naming R28, R29, R30, D9 or the gates [EVIDENCE: re-run 2026-10-25: `grep -c '^| REQ-0' spec.md` prints `11`. REQ-001 names R28 and REQ-002 to REQ-005 name R29. REQ-006 and REQ-007 name R30 and read "Superseded by ADR-013". REQ-008 to REQ-011 are the cross-cutting gates]
- [x] CHK-002 [P0] Technical approach defined in plan.md - the R28 probe, the three-route command, the bridge registration and the CI surface value [EVIDENCE: read 2026-10-25: plan.md lines 143 and 159 hold the R28 probe and its stop-for-yes, lines 145 to 150 hold the report, the scaffold and the toggle, line 151 holds the bridge phrases and line 162 holds the one `D9: write` line. Lines 152 and 153 hold the CI surface and compiled-route approach, and line 160 marks the surface half superseded by ADR-013]
- [x] CHK-003 [P1] Dependencies identified and available - `006`, `007`, D9, the `gh` scopes and the Node and Python installs (T002, T003) [EVIDENCE: re-run 2026-10-25: `test -f` finds `sk-code-ci/assets/workflow-template.yml`, `sk-code-ci/assets/job-block-template.yml` and `sk-code-ci/references/protected-set.md`, and `grep -c '^### On/off switches$' .github/workflows/README.md` prints `1`. `plan.md` holds one `D9: write` line. `scratch/toolchain.md` holds 4 lines, `node -v` prints `v26.8.2`, `yaml.__version__` prints `6.0.3` and the advisor `dist/runtime/lib/scorer/fusion.js` exists. `gh variable list --json name,value` ran with the existing login and printed `[]`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - every new YAML asset parses, `route-validate.sh` exits 0, and the deriver reports a fresh projection (T012, T014, T017) [EVIDENCE: re-run 2026-10-25: `yaml.safe_load` parses `doctor-ci-report.yaml`, `doctor-ci-scaffold.yaml` and `doctor-ci-toggle.yaml`, and `node --check ci-report.cjs` exits 0. `route-validate.sh` exits 0 and its `OK: route-validate` line ends `17 routes validated, 2 warnings`, the same two `--dry-run` notes as the baseline in `scratch/pre-phase.md`. The deriver `--check` exits 0 and prints `"status": "fresh"` with `"changed": []`. `run-all.sh` exits 0 with `[run-all] 7 suite(s) passed, 0 failed`. The tree held another process's uncommitted edits to `ci.md` and the doctor assets, and these runs read them]
- [x] CHK-011 [P0] No console errors or warnings - the report exits 0, the phrase probe prints `STATUS=OK`, and the sk-code test glob has no failing suite (T006, T024, T027) [EVIDENCE: re-run 2026-10-25: a live `ci-report.cjs --json` exits 0 with an empty stderr and `ci-report.cjs --json --no-gh` exits 0. `doctor-phrase-reach.cjs` exits 0 with `STATUS=OK phrases=109 bridges=21`. The sk-code test glob exits 0 with `tests 27`, `pass 27` and `fail 0`, and the drift runner exits 0 with `all 4 guards PASSED, 10 non-blocking warning(s)`, the same numbers as the baseline. The two `route-validate.sh` warnings are the existing flag-collision notes, unchanged from the baseline. The detection test named in T024 is superseded by ADR-013 and was not written]
- [x] CHK-012 [P1] Error handling implemented - a missing `gh` yields `unknown`, an unparseable workflow yields a named error and exit 1, and a missing template blocks the scaffold (T005, T010) [EVIDENCE: re-run 2026-10-25: the `ci-report.test.cjs` subtests `a failing gh degrades to unknown, exits 0 and says why on stderr` and `a malformed workflow is named in errors, exits 1 and the other files are still listed` pass in a 14 of 14 run, and `ci-report.cjs --json --no-gh` reports every variable as `unknown` with reason `gh disabled by --no-gh`. `doctor-ci-scaffold.yaml` carries the step `If any of the three is missing, report the missing path and stop`. That stop is route text an agent follows, and no test drives it, so it is read and not executed]
- [x] CHK-013 [P1] Code follows project patterns - the router has the `skill_agent` tag, the presentation owns every visible string, and the generated bridge files are written only by the deriver (T008, T009, T014) [EVIDENCE: re-run 2026-10-25: `grep -c '<!-- skill_agent: sk-code -->' ci.md` prints `1` and the three-row target grep prints `3`. The presentation greps print `3`, `1`, `3` and `1` for the menu answers, the `Valid targets:` line, the subsystem rows and the `1) report` line, and `route-validate.sh` check J1 passes with targets in parity with the router and presentation across 8 commands. The deriver `--check` prints `"changed": []`, so the four generated bridge files match the deriver's own output, and the T014 write run is what produced them. The tree held another process's uncommitted edits to `ci.md` and the presentation]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - `acceptance-criteria.md` rows AC-001 to AC-022 [EVIDENCE: re-run 2026-10-25: `grep -c '^| AC-0' acceptance-criteria.md` prints `22`, `grep -cE '\| Met \| - \|$'` prints `17`, `grep -cE '\| Superseded \| ADR-013 \|$'` prints `5` and `grep -c '| Unmet |'` prints `0`. The closure statement reads `Closeable: Yes`. The strict validator prints AC_CLOSURE as 22/22 criteria met, waived or superseded. The five superseded rows are AC-012, AC-013, AC-014, AC-018 and AC-019, and each names ADR-013, which holds status Accepted]
- [x] CHK-021 [P0] Manual testing complete - the R28 probe, the live report and the compiled route (T001, T026, T028) [EVIDENCE: re-run 2026-10-25: `scratch/r28-probe.md` holds 4 `exit=` lines (set 0, get 0, delete 0, get-after-delete 1) and `gh variable list --json name,value` prints `[]`. A live `ci-report.cjs --json` exits 0 with 32 workflows against 32 files, switch set `['on']`, no errors and newest non-rebuild SHA `bce45aa297aac14f6b0e92f85126c57dc53c4ba2`. That run excluded the rebuild commit `cafaa0facd8bf41f335520e962a7b248297e49cf`, whose last message line is `Trigger-Index-Rebuild: ci`, and the resolved commit's last line is `Commit-Id: 0012178`. The compiled route, run with and without `--surface-hint CI`, exits 0 and returns `surfaceBundle` with `sk-code-review` then `sk-code-ci`]
- [x] CHK-022 [P1] Edge cases tested - the fixture tree covers switch on/off/missing, a rebuild SHA, a malformed workflow and `--no-gh`; the detection test covers the mixed and near-miss paths (T006, T024) [EVIDENCE: re-run 2026-10-25: `ci-report.test.cjs` exits 0 with `tests 14`, `pass 14` and `fail 0`. Its subtests cover a switch that is off, a missing switch, the auto-merge workflow, a quoted and a folded condition with the `partial` state, a rebuild commit skipped by its trailer, every run being a rebuild commit, `--no-gh`, a failing `gh`, a malformed workflow and an unknown argument. The detection test for the mixed and near-miss paths (T024) is superseded by ADR-013 and was not written]
- [x] CHK-023 [P1] Error scenarios validated - a failed probe delete is a blocker, a missing template blocks the scaffold, and a toggle of the message-contract variable is refused (T001, T010, T011) [EVIDENCE: the probe delete succeeded, so the blocker branch never ran. The read-back after the delete exited 1 with `variable SKILLED_CI_PROBE was not found` (`scratch/r28-probe.md`) and `gh variable list --json name,value` prints `[]` on 2026-10-25. `doctor-ci-contract.test.cjs` passes 12 of 12 and asserts the scaffold and toggle refusal strings, including the refusals for `SKILLED_CI_MESSAGES` and `SKILLED_CI`, and the T016 record shows a reworded refusal failed exactly one subtest. The missing-template stop in `doctor-ci-scaffold.yaml` is read and not asserted by a test. No test executes the interactive routes, so the refusals are checked as contract text and not as behavior]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - `class-of-bug` for the missing report and the missing surface value, `cross-consumer` for the bridge data because two scorers read it, `instance-only` for the R28 probe [EVIDENCE: derived 2026-10-25: the labels are written in this row only, because a search of the other packet docs finds none of the three. The work follows them. The missing report was fixed as a class: `ci-report.cjs` enumerates `.github/workflows/*.yml` by glob and a live run lists 32 of 32 files. The bridge data is cross-consumer: `scoring-compatibility.json` holds 21 doctor entries in each of its `typescript` and `python` lists, three of them `command-doctor-ci-`, and the deriver `--check` is fresh. The R28 probe is instance-only: one throwaway variable that was deleted. The missing-surface-value class is superseded by ADR-013 and was not built]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed - `rg -n 'detect_surface_evidence|SKILLED > OBSIDIAN' .skilled/skills/sk-code` and `rg -n 'command-doctor-' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`, recorded in plan.md's Affected Surfaces (T003, T018 to T021) [EVIDENCE: re-run 2026-10-25: plan.md line 127 records both searches. The first now finds `detect_surface_evidence` on 4 lines of `sk-code-review/SKILL.md` and one line of the old `v1.7.0.0.md` changelog, and `SKILLED > OBSIDIAN` matches no line, because the shared contract and the hub restatements read `SKILLED > UNKNOWN` (5 lines across 5 files) and the surface half is superseded by ADR-013. The second prints 84 lines, which is 42 entries at two lines each, and a JSON parse gives 21 doctor entries in each of the two lists. The sk-code docs held another process's uncommitted edits when the first search ran]
- [x] CHK-FIX-003 [P0] Consumer inventory completed - the doctor router and validators, the bridge deriver and phrase probe, the review router and the five hub restatements, each with its verification in plan.md [EVIDENCE: read and re-run 2026-10-25: plan.md lines 110 to 124 list the routes manifest, the router, the three assets, the report script, the setup presentation, the bridge data with its four generated outputs, the review router and the hub restatements, each with a verification command, and line 128 records the consumer search. `rg -l 'ci-report|doctor:ci' .skilled .github` lists 15 files and 14 are named in that inventory. The 15th, `.skilled/commands/README.txt`, got its `/doctor:ci` row from the report commit and plan.md does not list it. The review router and hub restatement rows (T019 to T021) are superseded by ADR-013]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests - the report's parser is tested against a quoted condition, an ANDed condition and a malformed file; the detection test includes the mixed and near-miss paths (T006, T024) [EVIDENCE: re-run 2026-10-25: `ci-report.test.cjs` passes 14 of 14 and includes the subtests `a job whose group variable is off reports off, with the switch ANDed onto another condition`, `a quoted expression and a folded block resolve, and mixed jobs report partial` and `a malformed workflow is named in errors, exits 1 and the other files are still listed`. The T006 record shows seven one-line mutations of the script each failed at least one subtest. The detection test for the mixed and near-miss paths (T024) is superseded by ADR-013 and was not written]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - surface (5) x input (3) x expected, and route (3) x mutation class (2) x D9 (2), in plan.md [EVIDENCE: read and re-run 2026-10-25: plan.md line 129 lists both matrices, the surface one with five required rows and the route one with the four valid combinations. The route matrix is exercised by `doctor-ci-contract.test.cjs` (12 of 12 pass) and by the AC-002 command, which prints `mutates write` against the `D9: write` line. The surface matrix is superseded by ADR-013 and plan.md line 160 keeps it as written for the record]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - the `gh` stub and the `--no-gh` run are that variant for the report; the R28 probe is that variant for the token (T001, T006) [EVIDENCE: re-run 2026-10-25: the report variants pass in `ci-report.test.cjs` (14 of 14), where a `gh` stub returns a rebuild SHA and a real SHA, a failing `gh` degrades to `unknown` and `--no-gh` makes no `gh` call. A live `--no-gh` run reports every variable as `unknown`. For the token, `scratch/r28-probe.md` records set 0, get 0, delete 0 and get-after-delete 1 against the live repository]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range - the live report records the resolved SHA and the commit message's last line; the probe records the variable name and the four exit codes (T001, T028) [EVIDENCE: re-run 2026-10-25: `scratch/live-report.md` holds one `workflows:` line, one `newest non-rebuild SHA:` line with 40 hex digits (`4e0b8560cb51c3809ab37d2f2de757da78948e42`) and one `last message line:` line (`Commit-Id: 0012176`). A fresh run today resolved `bce45aa297aac14f6b0e92f85126c57dc53c4ba2` with last line `Commit-Id: 0012178`, and `scratch/phase-result.md` pins that SHA. `scratch/r28-probe.md` has 4 `exit=` lines and names `SKILLED_CI_PROBE` on 8 lines. The three doctor commits are `10c6791341`, `e0f922b593` and `4e0b8560cb`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - the command assets and scripts carry no token, key or variable value; the report prints only a state (T005, T007) [EVIDENCE: re-run 2026-10-25: the added lines of `10c6791341`, `e0f922b593` and `4e0b8560cb` match none of `ghp_`, `gho_`, `github_pat`, `password`, `api_key` or `token:` (count `0`). A case-insensitive search of the router, the three YAML assets, the presentation, the report script and the two tests for secret-like words matches 3 prose lines about repository secrets settings and no value. `ci-report.cjs` reduces each variable to `off` or `other` when it reads it, and its header comment (lines 13 and 14) says a value is never printed. The tree held another process's uncommitted edits to the router and the assets]
- [x] CHK-031 [P0] Input validation implemented - the toggle accepts only the six names, the scaffold accepts only a new path, and the report rejects an unknown flag with exit 2 (T005, T010, T011) [EVIDENCE: re-run 2026-10-25: `ci-report.cjs --bogus` exits 2 and prints `ERROR: unknown argument: --bogus` with the usage line. The six-name loop over `doctor-ci-toggle.yaml` prints nothing, and the file carries `REFUSE: <name> is not a documented switch`. `doctor-ci-scaffold.yaml` accepts only a bare lowercase hyphen-case name ending in `.yml` and carries the existing-path refusal and the protected-name refusal, which the contract test asserts (12 of 12 pass). The two YAML assets are read and not executed]
- [x] CHK-032 [P1] Auth/authz working correctly - the R28 probe uses a throwaway name, deletes it in the task, and records the post-delete read-back; the toggle refuses `SKILLED_CI_MESSAGES=off` (T001, T011) [EVIDENCE: re-run 2026-10-25: the probe name `SKILLED_CI_PROBE` appears in 0 files under `.github`, `scratch/r28-probe.md` records delete exit 0 and then exit 1 with `variable SKILLED_CI_PROBE was not found`, and `gh variable list --json name,value` prints `[]`. `doctor-ci-toggle.yaml` carries the refusals for `SKILLED_CI_MESSAGES` and `SKILLED_CI` set to off, and the contract subtest `the toggle workflow allows the six documented names and refuses the message-contract switches` passes. The refusal is contract text and no test runs the interactive toggle]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - R28 to R30 map to REQ-001 to REQ-011 and to AC-001 to AC-024 in the cross-reference table above [EVIDENCE: **Amendment (2026-10-25, review crosswalk)**: AC-023 (REQ-010) and AC-024 (REQ-011) were added, and the Gates row now lists AC-016, AC-017, AC-023 and AC-024, so it no longer overlaps the R30 row. Earlier record: re-run 2026-10-25: a script reads the four rows of the cross-reference table and finds the union of their AC lists is AC-001 to AC-022 with no gap and the union of their REQ lists is REQ-001 to REQ-011 with no gap. The R29 row now lists AC-010 and AC-011, and its AC list equals the R29 rows of `acceptance-criteria.md`. The R28 and R30 rows equal the R28 and R30 rows there. The Gates row still lists AC-014 and AC-015, which the criteria file assigns to R30, so the table is complete but that row overlaps the R30 row]
- [x] CHK-041 [P1] Code comments adequate - the report explains why a rebuild SHA is excluded and why a prose rule is `notChecked`; the toggle explains why the message-contract variable is refused [EVIDENCE: read 2026-10-25: the header of `ci-report.cjs` explains the message-based rebuild exclusion (lines 16 to 19) and the `notChecked` list (lines 21 and 22). It also says a variable value is never printed (lines 13 and 14). `doctor-ci-toggle.yaml` states the reason for the refusal: a skipped job reports Success, so switching off the job that holds the only required status context would let a commit with a wrong message merge]
- [x] CHK-042 [P2] README updated (if applicable) - the doctor target list gains the `/doctor:ci report` row; no `.github/workflows/README.md` change is made by this phase (T015) [EVIDENCE: re-run 2026-10-25: `grep -cF '| `/doctor:ci report` |'` over `doctor-setup-presentation.txt` prints `1` and `git show --numstat 4e0b8560cb` for that file prints `1 0`. `git diff --stat cfd9285e32..4e0b8560cb -- .github` prints nothing, so the three phase commits changed nothing under `.github`, and `git diff --exit-code -- .github/workflows` exits 0 for the working tree]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - the probe record, the inventory, the pre-phase baseline, the live report and the phase result live under `$PHASE/scratch/` [EVIDENCE: re-run 2026-10-25: `ls -A scratch/` lists 22 entries, among them `r28-probe.md`, `inventory.md`, `pre-phase.md`, `live-report.md` and `phase-result.md`. `git status --porcelain` for the phase folder lists nothing untracked outside `scratch/`, and the other lines are the edited packet docs]
- [x] CHK-051 [P1] scratch/ cleaned before completion - the fixture trees are created under the system temp directory and removed by their tests; the probe's variable is deleted; the records stay as evidence [EVIDENCE: re-run 2026-10-25: `ci-report.test.cjs` creates its fixture tree with `fs.mkdtempSync` and removes it in `t.after` (lines 164 and 165), and the system temp directory holds 0 entries named `ci-report-` after the test runs. `gh variable list --json name,value` prints `[]`, so the probe variable is gone. The records in `scratch/` stay on purpose, including `commit-sk-code.txt`, a draft for a commit that was never made because R30 is superseded by ADR-013]
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

**Tree state**: while these checks re-ran, `git status` showed uncommitted edits by another process to `.skilled/commands/doctor/ci.md`, the four doctor assets and the `sk-code-ci` and sk-code docs. The checks that read those files read the edited versions. They are not part of this phase's three commits.
<!-- /ANCHOR:summary -->

---
