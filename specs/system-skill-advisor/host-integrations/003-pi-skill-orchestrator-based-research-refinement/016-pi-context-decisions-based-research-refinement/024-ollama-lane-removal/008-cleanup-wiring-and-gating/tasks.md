---
title: "Tasks: Phase 8: cleanup-wiring-and-gating"
description: "Ordered tasks to harden the lane cleanup tool, add its one-run shared-model answer and askFirst field, wire it into /doctor:update apply after the rebuild prompt, make repo mode block in an advisory-checks.yml job and a doctor test, and prove repo mode 0, the planted fixture 1, machine mode 0 on a fixture and two runs that each ask."
trigger_phrases:
  - "cleanup wiring and gating tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: cleanup-wiring-and-gating

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Commands run from the repository root with `K=.skilled/skills/system-spec-kit`, `T=$K/runtime/cli/retrieval/sweep-lane-residue.mjs`, `CLI=$K/runtime/cli`, `D=.skilled/commands/doctor`, `W=.github/workflows`, `F=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating` and `S` set to the start commit T001 records. `SUITE` is `(cd $CLI && npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts)`. `hits FILE...` prints each line that matches the tool's own exported patterns, case-insensitively, then `lines=N`:

```bash
hits() { node --input-type=module -e "import { IDENTIFIER_PATTERN as I, PROSE_PATTERN as P } from './$T'; import fs from 'node:fs'; const re = new RegExp(I + '|' + P, 'i'); let n = 0; for (const f of process.argv.slice(1)) fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => { if (re.test(l)) { n++; console.log(f + ':' + (i + 1)); } }); console.log('lines=' + n);" "$@"; }
```

No task runs `apply` or `/doctor:update apply` against the operator's HOME or this checkout (parent decision D6). Every apply runs on a fixture root, HOME, database folder, socket folder and model server.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 007 is committed, record its SHA as `S`, and classify anything repo mode still lists (`implementation-summary.md`). Verify: `git status --short | grep -vc '^??'` prints 0; `node $T repo --json > $F/scratch/repo-start.json; echo $?` prints 0 with an empty `live` list, or prints 1 and every live path is written to `$F/scratch/live-start.txt` with one class: a non-lane match that phase 006 or 007 left for this phase (it gets a row in T025) or lane residue (the phase halts; the phase that should have removed it owns it); `counts.allowlistRows` and the four rows phase 007 added for `$K/runtime/data/trigger-index.json` and the three `$K/runtime/cli/retrieval/fixtures/` index outputs are recorded.
- [ ] T002 [P] Record the gate baselines at `S`, with the commands T034 names for the generator checks (`implementation-summary.md`). Verify: the summary holds `SUITE`'s file and case counts (51 cases at `1f85a9dd6dd`); `bash $D/scripts/tests/run-all.sh`'s `node:test (N files)` and `7 suite(s) passed, 0 failed` lines; `bash $D/scripts/route-validate.sh 2>/dev/null | tail -1 | cut -d' ' -f4-`; the mirror check's `PASS` line; the link check's `0 broken` line; `actionlint $W/advisory-checks.yml` exit 0; `bash .github/scripts/check-gate-inputs.sh | tail -1` `RESULT: PASSED`; the `advisory-checks.yml` row of `node $D/scripts/ci-report.cjs --json --no-gh` (2 jobs, no flags); and the exit status of `generate-trigger-index.mjs --check`, `generate-leaf-manifest.cjs --check` on the advisor and spec-kit, `skill-graph-freshness.cjs --strict` and `derive-command-bridges.cjs --check`.
- [ ] T003 [P] Record the operator's machine read-only, with the fingerprints parent decision D6 must leave unchanged (`$F/scratch/machine-start.txt`). Verify: the file holds `node $T machine --json`'s exit status and each check's status and item count (exit 1 with M2, M6 and M8 found at `1f85a9dd6dd` when planned, M3 having cleared that day), plus the output of `ls ~/.ollama/models/manifests/registry.ollama.ai/library/nomic-embed-text/`, `ls -d /tmp/system-hf-embed 2>&1` and `ls ~/.cache/huggingface/hub | wc -l`; no apply runs.
- [ ] T004 Audit what machine mode loads after phase 005 (`$T`). Verify: `grep -n -E "^import|requireCjs\(|ENV_SECRET_CLI =|IPC_BRIDGE_MODULE =" $T` lists only `node:` built-ins, `./lib/artifact.mjs`, `./lib/normalize.mjs`, `../lib/esm-entry.mjs`, the IPC bridge and the env-secret CLI; `ls` prints each of those files; `node -e "console.log(typeof require('./.skilled/bin/lib/launcher-ipc-bridge.cjs').resolveIpcSocketDir)"` prints `function`; `grep -n "require(" .skilled/bin/lib/launcher-ipc-bridge.cjs` lists only Node built-ins.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Move M5 to the package-local model cache as an owned delete, and remove the hub-cache check, its prompt, `resolveHfHubRoot`, `HF_MODEL_FOLDER` and `--hf-home` (`$T`, `plan.md` ADR-003). Verify: a new case passes in which apply deletes `node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5` under both package roots with confirm called 0 times and the rest of `node_modules/@huggingface` left in place; `node $T machine --hf-home x; echo $?` prints `unknown argument: --hf-home` and 2; `git grep -n -E 'hf-home|HF_MODEL_FOLDER|resolveHfHubRoot' -- ':!specs'` prints nothing.
- [ ] T006 Probe and delete the exact socket file a unix `HF_EMBED_SERVER_URL` names (`$T`). Verify: a new case with `HF_EMBED_SERVER_URL=unix://<fixture>/custom.sock` and the four fixed files beside it reports all five under M4, and apply deletes all five while the folder and an unrelated file in it stay; with a `tcp://` value no new path is probed.
- [ ] T007 Match model-server ownership on the first script argument, through the real path of the script's folder (`$T`, ADR-005). Verify: a table case over `isOwnedModelServer` returns true for `node <script>`, `node <script> --flag`, `node --inspect <script>`, the script reached through a symlinked folder and a script deleted from disk, and false for `node /other.js <script>`, `less <script>` and node running another checkout's script; with an injected process list, M4 lists node running any checkout's script as its first argument and does not list `/bin/zsh -c '... <script> ...'` or `less <script>`, and a fixture whose only process is such a shell exits 0; the two existing ownership cases still pass.
- [ ] T008 Make apply change nothing in a checkout that still holds a lane source (`$T`, ADR-004). Verify: a case parameterized over the four sentinel paths plants the leftovers and one sentinel, runs apply with `--shared-model delete` and a fake model server, and finds every leftover still on disk, confirm called 0 times, no DELETE, each item `kept` with a reason naming the sentinel, `askFirst` empty and exit 1; the same fixture without the sentinel is cleaned.
- [ ] T009 Add `--shared-model delete|keep` to apply and `askFirst` to the machine and apply reports (`$T`, ADR-001, ADR-008). Verify: new cases pass: `delete` sends exactly one DELETE and calls confirm 0 times; `keep` with `interactive: true` calls confirm 0 times and sends no DELETE; no flag with `interactive: false` keeps the model with one `kept` action; `askFirst` holds one entry whose `question` equals the string confirm receives when the fake server lists the model, and is empty when the server is closed and only the manifest is planted; `node $T machine --shared-model keep; echo $?` and `node $T apply --shared-model maybe; echo $?` each print 2.
- [ ] T010 Add the index check to repo mode for the four index outputs (`$T`, ADR-007). Verify: in a fixture repository with the four outputs tracked at their real paths and no allowlist row for them, a lane phrase key mapped to a path outside `specs/` that is no allowlist row exits 1 and the JSON names the phrase and the path; a plain phrase key whose phrase-variant spelling holds a lane term, mapped outside `specs/`, exits 1; a lane path outside `specs/` in `paths`, in the corpus manifest or in the generation diagnostics exits 1; the same entries pointing under `specs/` or at an allowlisted path exit 0; and a lane term in any other tracked file is still found by the plain scan.
- [ ] T011 Raise `SCHEMA_VERSION` to 2 and rewrite the header and usage for the new flag (`$T`). Verify: `node $T 2>&1 | grep -c -- '--shared-model'` prints at least 1 and `node $T 2>&1 | grep -c -- '--hf-home'` prints 0; `grep -c 'SCHEMA_VERSION = 2' $T` prints 1; `node --check $T` exits 0; `git diff $S -- $T | grep -E '^\+' | grep -E 'REQ-[0-9]|ADR-[0-9]|\bT0[0-9]{2}\b|phase 00[0-9]'` prints nothing.
- [ ] T012 Isolate the suite from the new environment input and replace the hub-cache fixture (`$CLI/tests/sweep-lane-residue.vitest.ts`). Verify: `HF_EMBED_SERVER_URL` is in `SCRUBBED_ENV`; `grep -c "'hub'" $CLI/tests/sweep-lane-residue.vitest.ts` prints 0; the coverage-matrix comment lists the new rows; the two apply assertions that counted two questions and two `kept` actions now count one of each.
- [ ] T013 Add the two-run case for goal criterion 5 (`$CLI/tests/sweep-lane-residue.vitest.ts`). Verify: on one fixture with a fake model server listing the model and an injected confirm that answers no, two `runApply` calls with `interactive: true` record one question each, the two questions are equal, the fake server records no DELETE, `/api/tags` still lists the model after run 2, and the sorted recursive file list of the fixture HOME and checkout after run 2 equals the list before run 1.
- [ ] T014 Add the two cases for goal criterion 2 (`$CLI/tests/sweep-lane-residue.vitest.ts`). Verify: (a) a fixture with M1, M3, M4, M5 and M6 planted and a fake server that drops the model on DELETE: `runApply` with `--shared-model delete` returns an after-check of exit 1 with M2 the only found check, and after the test deletes the planted `node_modules/@huggingface` and `node_modules/onnxruntime-node` folders, as `npm ci` with the new lockfiles does, `runMachineChecks` returns exit 0; (b) a spawned `node $T machine` on a clean fixture with `--root`, `--db-dir`, `--ollama-host http://127.0.0.1:9`, a `--socket-dir` path that is never created (an existing socket folder counts under M4 even when empty), `HOME` and `OLLAMA_MODELS` at the fixture and the location variables unset exits 0, read from the child's status.
- [ ] T015 [P] Add a terminal case through a pseudo-terminal (`$CLI/tests/sweep-lane-residue.vitest.ts`). Verify: the case is skipped when `python3` is not on `PATH`; otherwise a `python3 -c` driver built on `os.openpty`, not `pty.spawn`, which never returned under Python 3.9.6 with a piped stdin, runs `node $T apply --json --root <fx>/root --db-dir <fx>/db --socket-dir <fx>/sock --ollama-host <fake server URL>` twice on one fixture, with `HOME=<fx>/home`, `OLLAMA_MODELS=<fx>/home/ollama` and every variable in `SCRUBBED_ENV` removed from the child's environment, answers `n` at each `[y/N]` prompt, kills the child at a 20 s deadline, and each run's JSON shows `interactive: true`, one `kept` action for the model and no DELETE at the fake server; the case asserts that the spawned argument list holds all four location flags and that each value and `HOME` lie under the fixture folder before it spawns, so this checkout's database is never in reach.
- [ ] T016 Run the whole sweep suite three times (`$CLI/tests/sweep-lane-residue.vitest.ts`). Verify: `SUITE` prints `Test Files  1 passed (1)` and `Tests  N passed (N)` with N at least 51 plus the cases T005 to T015 added, exit 0, three runs in a row.
- [ ] T017 Wire the cleanup into the apply workflow (`$D/assets/doctor-update-apply.yaml`, ADR-002). Verify: `grep -n '^  phase_' $D/assets/doctor-update-apply.yaml` prints `phase_6_rebuild_prompt`, `phase_7_lane_cleanup` and `phase_8_state_log` in that order; the `action:` line ends `rebuild.prompt -> lane.cleanup -> state.log`; `phase_7_lane_cleanup` names `machine --json`, `askFirst`, `apply --json`, `--shared-model` and `</dev/null`, says it asks on every run and reads no earlier answer, runs only after the rebuild prompt, and lists the outcomes `clean`, `cleaned`, `remaining`, `failed`, `not_run` and `not_applicable`; `state_log_schema` has `lane_cleanup` and no answer field; `upstream_assets` names the tool; `mutation_boundaries.allowed_targets` gains one entry that refers to the targets listed as `deleted` in the tool's `apply --json` actions for this checkout, with no literal target path, file name or command, because those names match the residue patterns (ADR-008); `node -e "require('./$K/node_modules/js-yaml').load(require('fs').readFileSync('$D/assets/doctor-update-apply.yaml','utf8'));console.log('yaml ok')"` prints `yaml ok`; `hits $D/assets/doctor-update-apply.yaml` prints `lines=0`.
- [ ] T018 Add the cleanup to the presentation (`$D/assets/doctor-update-presentation.txt`). Verify: `grep -n '^## ' $D/assets/doctor-update-presentation.txt` shows `## 8. Advisor Rebuild Prompt`, `## 9. Lane Cleanup`, `## 10. Result Templates` and `## 11. Compatibility Action`; `rg -n 'section (9|10)' $D` prints no stale reference; the `Release Apply Plan` block holds the one disclosure line, worded like `Lane cleanup: after the rebuild prompt, delete what the retired embedding lane left in this checkout; ask about the pulled shared model when a local model server lists it`; section 9 holds the question template, a placeholder filled at runtime from `askFirst[].question` followed by a yes-or-no line, and the report template, placeholders filled from the tool's `deleted`, `kept` and `reported` actions, its remedy lines and its after-check exit; no question text, path, file name or command from the tool is written into the file; the Apply result holds `Lane cleanup: [clean|cleaned|remaining|failed|not_run|not_applicable]`; `hits` on the file prints `lines=0`.
- [ ] T019 Extend the update contract test (`$D/scripts/tests/doctor-update-contract.test.cjs`). Verify: `node --test $D/scripts/tests/doctor-update-contract.test.cjs` passes, with new tests that assert T017's phase order, the `apply` command with `</dev/null` and `--shared-model` inside `phase_7_lane_cleanup` and nowhere else, the ask-every-run and no-earlier-answer wording, `lane_cleanup` in the schema with no answer field, and the presentation's section 9 and result line; `hits` on the file prints `lines=0`.
- [ ] T020 Create the doctor gate test (`$D/scripts/tests/lane-residue-gate.test.cjs`). Verify: `node --test $D/scripts/tests/lane-residue-gate.test.cjs` passes two tests: repo mode over this checkout exits 0, and a temporary git repository whose one tracked file holds `IDENTIFIER_TERMS[0]`, read through a dynamic `import()` of `$T`, exits 1; `hits` on the file prints `lines=0`; `bash $D/scripts/tests/run-all.sh` prints `node:test (56 files)` and `7 suite(s) passed, 0 failed`.
- [ ] T021 [P] Update the retrieval README (`$K/runtime/cli/retrieval/README.md` 25, 71, 99). Verify: `rg -n 'Not wired' $K/runtime/cli/retrieval/README.md` prints nothing; the row names `/doctor:update apply`, the `advisory-checks.yml` job, `--shared-model` and the package-local cache, and not `--hf-home`; `hits` on it prints `lines=0`.
- [ ] T022 [P] Update the apply playbook entry (`.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md`). Verify: its expected signals name the cleanup after the rebuild outcome, the question only when a local model server lists the pulled shared model, and `lane_cleanup` among the state log fields; `hits` on it prints `lines=0`; `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` on it exits no worse than at `S`.
- [ ] T023 [P] Update the scripted apply conversation (`.skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md`). Verify: the scenario says the cleanup may ask about the pulled shared model after the rebuild choice and that the script answers no; `hits` on it prints `lines=0`; `validate_document.py` on it exits no worse than at `S`.
- [ ] T024 Check the removal changelog's upgrade step against the wiring (`.skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md`). Verify: `grep -n 'doctor:update apply'` on the entry prints the step; the step says the update deletes the lane's leftovers, asks about the pulled shared model when a local model server lists it, and names `npm ci` for the module folders; if it said otherwise it is corrected, `hits` on it prints `lines=0`, and `check_changelog_shape.py`, `validate_document.py` and `hvr_scan.py` each exit 0 on it; if it already agreed, the summary records it unchanged.
- [ ] T025 Apply the allowlist changes T001 named and confirm the tree is clean before any gate is written (`$K/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json`). Verify: the four index-output rows T001 recorded are gone; each path T001 classed as a non-lane match has one exact-path row with a reason; `node $T repo; echo $?` prints `live        : 0`, no `allowlist rows that matched nothing` block, and 0.
- [ ] T026 Add the blocking residue job (`$W/advisory-checks.yml`, ADR-006). Verify: the `lane-residue` job's `if:` equals its siblings', it carries no `continue-on-error`, and its steps are the pinned checkout, the pinned setup-node with Node 22 and one run step that fails closed when `$T` is missing and runs `node $T repo`; the header comment counts three jobs; `actionlint $W/advisory-checks.yml` exits 0; `bash .github/scripts/check-gate-inputs.sh | tail -1` prints `RESULT: PASSED`; `node $D/scripts/ci-report.cjs --json --no-gh` shows `advisory-checks.yml` with `"jobs":3` and `"flags":[]`; the run block, run with `bash -euo pipefail` at the repository root, exits 0; `hits` on the file prints `lines=0`.
- [ ] T027 Update the workflows README row (`$W/README.md`). Verify: the `advisory-checks.yml` row names the blocking residue job and `ci-report.cjs --json --no-gh` shows that purpose text for the file; `hits` on it prints `lines=0`; the link check prints `0 broken`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T028 Prove repo mode on the final tree (REQ-001, REQ-016) (`$T`). Verify: `node $T repo` exits 0 with `live        : 0`; `node $T repo --json` shows `counts.allowlistRows` equal to T001's, less the four index-output rows and plus T025's classified rows; `hits` on every file `git diff --name-only $S` lists, except `$T`, its test and its allowlist, prints `lines=0`.
- [ ] T029 Prove the planted-term fixture in both gates (REQ-002) (`$CLI/tests/sweep-lane-residue.vitest.ts`, `$D/scripts/tests/lane-residue-gate.test.cjs`). Verify: the case `exits 1 for a planted term and names the file and the term` passes in T016's runs, and `node --test $D/scripts/tests/lane-residue-gate.test.cjs` reports both tests passing.
- [ ] T030 Record goal criterion 2's evidence (REQ-003) (`implementation-summary.md`). Verify: T014's two cases pass in the final `SUITE` run, and the spawned command, run once by hand on a fresh `mktemp -d` fixture, prints `result      : exit 0 (nothing left)` and `echo $?` prints 0; both outputs are in the summary verbatim, beside T003's operator-machine result and the remedy for each check it found.
- [ ] T031 Record goal criterion 5's evidence and the answer-flag cases (REQ-005, REQ-006) (`implementation-summary.md`). Verify: the final `SUITE` output lists the case names T009 and T013 added as passed, in each of T016's three runs.
- [ ] T032 Prove the wiring contract (REQ-004, REQ-019) (`$D/assets/doctor-update-apply.yaml`). Verify: `node --test $D/scripts/tests/doctor-update-contract.test.cjs` passes; `grep -n '^  phase_'` prints T017's order; `grep -n 'lane_cleanup' $D/assets/doctor-update-apply.yaml $D/assets/doctor-update-presentation.txt` prints the schema line, the phase and the result line.
- [ ] T033 Prove both gates (REQ-011, REQ-012) (`$W/advisory-checks.yml`, `$D/scripts/tests/run-all.sh`). Verify: T026's actionlint, gate-input, ci-report and run-block checks print their expected lines on the final tree; `bash $D/scripts/tests/run-all.sh` prints `node:test (56 files)` and `[run-all] 7 suite(s) passed, 0 failed`.
- [ ] T034 Run the generator check modes and behavior probes once (REQ-014) (`implementation-summary.md`). Verify: `node $K/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0; `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check <skill>` prints `leaf-manifest.json OK` for `.skilled/skills/system-skill-advisor` and `$K`; `node $D/scripts/skill-graph-freshness.cjs --strict` exits 0; `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` exits 0; in the advisor runtime `npx vitest run tests/cli-exit-taxonomy.vitest.ts tests/handlers/advisor-status.vitest.ts` passes; `_routes.yaml` yields six `/doctor:skill-advisor` targets; the summary names where each already gates.
- [ ] T035 Prove the gates no worse and the comment rule (REQ-018) (`implementation-summary.md`). Verify: `bash $D/scripts/route-validate.sh 2>/dev/null | tail -1 | cut -d' ' -f4-` prints `31 routes validated` with its warning count; the mirror check prints `PASS`; the link check prints `0 broken`; `git diff $S -- .skilled .github | grep -E '^\+' | grep -E 'REQ-[0-9]|ADR-[0-9]|\bT0[0-9]{2}\b|phase 00[0-9]'` prints nothing; `git diff --name-only $S` lists only `spec.md` Files to Change and this folder.
- [ ] T036 Prove the operator's machine unchanged (REQ-017) (`$F/scratch/machine-start.txt`). Verify: rerunning T003's read-only commands prints the same model-store listing, the same `/tmp/system-hf-embed` result, the same hub count and the same per-check machine-mode statuses; `rg -n 'runApply\(' $CLI/tests/sweep-lane-residue.vitest.ts` shows every call passing fixture options, and every spawned `apply` passes `--root`, `--db-dir` and `--socket-dir` at a fixture with `HOME` at a fixture.
- [ ] T037 Record every result with `S` and the phase commit, and clean scratch (`implementation-summary.md`). Verify: the summary's verification table holds one row per task T028 to T036, the operator machine's blockers with their remedies, and T024's outcome; `ls -A $F/scratch` prints only `.gitkeep`.
- [ ] T038 Validate this phase (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $F --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the presentation's section 9 and the tool's question read once as an operator sees them (T018), and the removal changelog's upgrade step read beside the wiring (T024)
- [ ] Repo mode prints `live        : 0` on the phase commit (T028), both gates pass on it (T033), and both goal proofs are recorded (T030, T031)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (ADR-001 to ADR-011)
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The tool's build and review findings**: See `../001-residue-check-and-cleanup-tool/implementation-summary.md`
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

Any apply against the operator's HOME or this checkout is a P0 halt. A live path at T025 blocks the gate tasks; it is never allowlisted to make the gate pass unless T001 classed it as a non-lane match.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phase 007 is committed and repo mode is at exit 0, or every live path is classified (T001)
- [ ] CHK-004 [P1] The conductor has answered open questions 1 and 2 in `spec.md`, or the answers are recorded as pending in the implementation summary
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check $T` exits 0 and `SUITE` passes three runs in a row (T011, T016)
- [ ] CHK-011 [P0] The apply workflow parses with js-yaml and `actionlint` exits 0 on `advisory-checks.yml` (T017, T026)
- [ ] CHK-012 [P1] Every new delete goes through `deleteContained` or `removeEmptyDir`, so it stays a fixed name under a resolved root that refuses symlinks (T005, T006)
- [ ] CHK-013 [P1] No added line names a spec, phase, task, requirement or decision id (T011, T035)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Both goal proofs are recorded: machine mode 0 on a fixture in-process and from the spawned binary, and two runs that each ask (T030, T031)
- [ ] CHK-022 [P0] Both gates pass on the final tree and both turn red on the planted term (T029, T033)
- [ ] CHK-023 [P1] The sweep suite passes three runs in a row, the terminal case included or skipped only for a missing `python3` (T016)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Finding classes: H1 and H2 `algorithmic` (path and ownership resolution), H3 `class-of-bug` (every apply action in an older checkout, not only the compiled deletes), H4 `instance-only` (one cache location, confirmed by the package's own default and the empty hub).
- [ ] CHK-FIX-002 [P0] Same-class producers: every delete, stop and ask site in the tool, listed by `rg -n 'deleteContained|removeEmptyDir|stopProcess|confirm\(' $T`, sits behind the H3 guard (T008).
- [ ] CHK-FIX-003 [P0] Consumers: `git grep -n -E 'sweep-lane-residue|hf-home|HF_MODEL_FOLDER|resolveHfHubRoot' -- ':!specs'` lists only the files `spec.md` names (T005, T028).
- [ ] CHK-FIX-004 [P0] Adversarial cases: a later argument naming the script, a symlinked script folder, a deleted script, a custom socket file name, a `tcp://` socket value, a planted lane source, a closed input and an answer flag outside apply each have a case (T006 to T009).
- [ ] CHK-FIX-005 [P1] Matrix: mode by checkout state by terminal by answer by model server, as `plan.md` lists, each row a case or named as covered by an existing case.
- [ ] CHK-FIX-006 [P1] Hostile environment: the suite scrubs `HF_EMBED_SERVER_URL` with the other location variables, and one run with every scrubbed variable set to a temporary folder still passes (T012).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to `S` and the phase commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No dotenv value is read or printed: M7 still lists key names through the value-free CLI, and no new code reads a dotenv file
- [ ] CHK-031 [P0] The answer flag accepts only `delete` or `keep`, only in apply, and no file, the doctor state log included, stores an answer (T009, T019)
- [ ] CHK-032 [P0] No apply ran against the operator's HOME or this checkout (T036)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The retrieval README and both playbook entries describe the wiring and name no residue term (T021 to T023)
- [ ] CHK-042 [P2] The removal changelog's upgrade step agrees with the wiring (T024)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 18 | 0/18 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] The removal of `--hf-home` and the report's schema 2 are stated in the retrieval README (T021)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 holds: the CI job's run block finishes well inside `timeout-minutes: 10` locally, and `run-all.sh` grows by about the repo run's 8 s (T026, T033)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented: revert the one phase commit; no user machine, tag or release changed
- [ ] CHK-121 [P1] The CI job and the doctor gate land only after T025 printed `live        : 0` on the same tree
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] No dependency, manifest or lockfile changed: `git diff --name-only $S -- '*package*.json'` prints nothing
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] `spec.md` Files to Change, `plan.md` Affected Surfaces and this file's tasks name the same files
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Answers open questions 1, 2 and 4 in `spec.md` | [ ] Approved | |
| Operator | Answers open question 3, then merges and pushes, which starts the new CI job's first run | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
