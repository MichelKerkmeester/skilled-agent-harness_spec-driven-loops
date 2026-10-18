---
title: "Tasks: Phase 2: pins-imports-dual-export"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pins imports dual export tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: pins-imports-dual-export

<!-- SPECKIT_LEVEL: 2 -->

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

Each task names its executor in brackets at the end. `(orchestrator)` runs in the orchestrator's shell. `(DeepSeek, cli-devin)` runs through `devin -p --model deepseek-v4-1-flash-max` with `AI_SESSION_CHILD=1` set. `(Luna, cli-codex)` runs through `codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast"` with `AI_SESSION_CHILD=1` set. Paths are relative to the worktree root. `D` below means `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export`. Tasks T010 to T021 run one at a time, in order. The orchestrator runs the registration case and the plugin suite after each one.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the sorted `git status --porcelain` into `D/scratch/status-before.txt`. Copy the plugin suite floor from `001-unknowns-and-baseline/baseline.json` into `D/scratch/baseline-floor.txt`. Write the 11 mechanical plugin names, sorted, into `D/scratch/mechanical-11.txt`. Stop if phase 1 is not closed. (orchestrator) Evidence: `scratch/status-before.txt:1`, `scratch/baseline-floor.txt:1`, `scratch/mechanical-11.txt:1-11`
- [x] T002 Test the registry with `npm view @opencode-ai/plugin@1.19.3 version` and `npm view @opencode/plugin@2.0.32 version`. Record both outputs and both exit statuses in `D/scratch/registry.txt`. A block stops this phase, and the block is recorded as a finding. (orchestrator) Evidence: `scratch/registry.txt:1-4` (1.19.3 and 2.0.32, both exit 0)
- [x] T003 Record three decisions in `D/scratch/decisions.txt`: the import-site split (spec Open Questions, first item), the reading of "guards" (second item) and the placement of the `@opencode/plugin` dev dependency (third item). Record the phase 1 verdict on Q7 beside them. T005 and T010 wait for this task. (orchestrator) Evidence: `scratch/decisions.txt:2-5`
- [x] T004 Check whether v1 installs a dev dependency from `.opencode/package.json`. Copy `.opencode/` without `node_modules` to `D/scratch/devdep-probe/`, add `@opencode/plugin` 2.0.32 under `devDependencies`, and run `OPENCODE_DB=D/scratch/devdep-probe/opencode.db opencode debug config </dev/null` from `D/scratch/devdep-probe/`. Record whether `node_modules/@opencode/plugin` appears, with the output and exit status, in `D/scratch/devdep-probe.txt`. Write only under `D/scratch/`. (DeepSeek, cli-devin, `--permission-mode dangerous`) Evidence: `scratch/devdep-probe.txt:1` (exit 0), `scratch/devdep-probe.txt:26` (v1 installed the devDependency), `scratch/decisions.txt:4`
- [x] T005 Set `@opencode-ai/plugin` to `1.19.3` exactly in `.opencode/package.json` and `.skilled/package.json`. Declare `zod` at the version that `@opencode-ai/plugin` 1.19.3 uses. List `@opencode/plugin` at `2.0.32` under `devDependencies` as T003 records. Use the placement that T004 supports. (orchestrator) Evidence: `scratch/grep-checks.txt:1-5`, `scratch/install.txt:7-9`
- [x] T006 Run `npm install` in `.opencode/` and in `.skilled/`. This regenerates both lock files. Record the exit status and the resolved versions of `@opencode-ai/plugin` and `zod` in `D/scratch/install.txt`. The changed tracked files are the two package files and the two lock files only. (orchestrator) Evidence: `scratch/install.txt:3-9` (both installs exit 0, both locks regenerated)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Write `.opencode/plugins/lib/tool-identity.js`. It exports `tool` as an identity function, with `tool.schema` set to the zod namespace, matching the v1 `tool.js` shape. Start only after the Q7 verdict is in `D/scratch/decisions.txt`. If Q7 rejects zod JSON Schema on v2, the helper keeps the v1 shape, and the v2 leg adapts the schema. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/decisions.txt:5` (Q7 confirmed), `scratch/grep-checks.txt:51`, `scratch/bridge-final.txt:17`
- [x] T008 Write `.opencode/plugins/tests/v2-registration.test.cjs` with one case per mechanical plugin. Each case loads the default export, checks that it is an object with `id`, `setup` and `server`, and calls `setup` on a stub v2 context with `tool.hook`, `event.subscribe` and `session.hook`. No case sets an environment variable. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/registration-final.txt:1-11`, `scratch/grep-checks.txt:55`
- [x] T009 Run `node --test .opencode/plugins/tests/v2-registration.test.cjs > D/scratch/registration-before.txt 2>&1` against the unported tree. Every one of the 11 cases must fail. Record the `# pass` and `# fail` lines. (orchestrator) Evidence: `scratch/negative-control-registration.txt:12-15` (tests 11, pass 0, fail 11)
- [x] T010 Port `system-speckit-completion.js`. Replace the `tool` import at line 28 with `lib/tool-identity.js`. Wrap the default export as `{ id, setup, server }`. Remove the `__test` seam at line 90, because no test reads it. Keep the `core` import from `completion-state.cjs`. Update `system-speckit-completion.test.cjs` so each call at lines 32, 41 and 51 goes to `.server`. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:7`, `scratch/grep-checks.txt:17`, `scratch/grep-checks.txt:45`
- [x] T011 Port `classifier-injection-screen.js`. Move `SCREEN_TOOL`, `MAX_PENDING_ADVISORIES`, `MAX_SESSIONS`, `UNKNOWN_SESSION` and `sessionIdOf` into `lib/classifier-injection-screen-core.js`. Wrap the default export. Point `classifier-injection-screen.test.cjs` at the core module for the seam read at line 176, and move its calls to `.server` and its function-type check at line 67 to the object shape. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:7`, `scratch/grep-checks.txt:12`, `scratch/grep-checks.txt:49`
- [x] T012 Port `cli-dispatch-audit.js`. Wrap the default export as `{ id, setup, server }`. Remove the `__test` seam at line 134, because no test reads it and `dispatch-audit.mjs` already exports the same constants. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:7`, `scratch/grep-checks.txt:11`
- [x] T013 Port `sk-code-post-edit-quality.js`. Move `PLUGIN_DIR`, `MUTATING_TOOLS`, `MAX_CALL_IDS`, `MAX_PENDING_FINDINGS`, `filePathFromArgs`, `createCorrelationMap` and `formatFinding` into `lib/sk-code-post-edit-quality-core.js`. Wrap the default export. Update `sk-code-post-edit-quality.test.cjs`: the calls at lines 449, 481, 501, 528, 544, 558 and 575 go to `.server`. The shape check at line 419 changes to the object shape. The seam read at line 424 goes to the core module. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:7`, `scratch/grep-checks.txt:15`, `scratch/grep-checks.txt:50`
- [x] T014 Port `session-cleanup.js`. Wrap the default export and keep its `(input, overrides)` signature. In `session-cleanup.test.cjs`, make `loadPlugin()` return `.server`, so the four call sites stay unchanged. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:16`, `scratch/grep-checks.txt:38`
- [x] T015 Port `mcp-route-guard.js`. Wrap the default export. In `mcp-route-guard.test.cjs`, change the call at line 36 to `.server`. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:10`, `scratch/grep-checks.txt:37`
- [x] T016 Port `codex-hooks-watchdog.js`. Wrap the default export. No test file in `tests/` calls it directly, so T021 covers its use in `source-root-consumers.test.cjs`. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:9`, `scratch/grep-checks.txt:41`
- [x] T017 Port `sk-git-message-gate.js`. Wrap the default export. In `sk-git-message-gate.test.cjs`, change the call at line 33 to `.server`. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:13`, `scratch/grep-checks.txt:40`
- [x] T018 Port `sk-git-preflight-advisory.js`. Wrap the default export. No test file calls it directly, so T021 covers its use in `source-root-consumers.test.cjs`. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:14`, `scratch/grep-checks.txt:41`
- [x] T019 Port `system-deep-loop-guard.js`. Wrap the default export. In `system-deep-loop-guard.test.cjs`, move the function-type check at line 77 to the object shape, and move the calls at lines 81, 369, 387, 408, 417 and 436 to `.server`. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:19`, `scratch/grep-checks.txt:42`
- [x] T020 Port `system-dist-freshness-guard.js`. Wrap the default export. In `system-dist-freshness-guard.test.cjs`, move the function-type check at line 163 to the object shape, and move the calls at lines 170, 198, 222, 243 and 255 to `.server`. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:18`, `scratch/grep-checks.txt:43`
- [x] T021 Update `source-root-consumers.test.cjs`. Its `load()` at line 61 calls the default export of `cli-dispatch-audit.js`, `sk-git-preflight-advisory.js` and `codex-hooks-watchdog.js`. Change that call to `.server`. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/grep-checks.txt:41`, `scratch/suite-final.txt:341-344`
- [x] T022 Confirm that the hard plugins and their tests are untouched. Run `git diff --stat -- .opencode/plugins/opencode-goal.js .opencode/plugins/system-skill-advisor.js .opencode/plugins/system-spec-gate.js .opencode/plugins/system-completion-sentinel.js .opencode/plugins/tests/system-skill-advisor.test.cjs` and expect no output. If T003 widened the split, expect only the lines it names. (orchestrator) Evidence: T003 widened the split (decision 1), and `scratch/review-2-phase.log:164` confirms the two hard files carry the single import-line hunk each. `scratch/grep-checks.txt:27`, `:34`, `:44` list the three changed hard-plugin paths. `system-spec-gate.js` and `system-completion-sentinel.js` are absent from the changed list.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Rerun the registration file: `node --test .opencode/plugins/tests/v2-registration.test.cjs > D/scratch/registration-after.txt 2>&1`. Expect `# pass 11` and `# fail 0`. (orchestrator) Evidence: `scratch/registration-final.txt:12-15`
- [x] T024 Rerun the plugin suite: `node --test .opencode/plugins/tests/*.test.cjs > D/scratch/suite-after.txt 2>&1`. Compare the `# pass` count with `D/scratch/baseline-floor.txt`, and expect `# fail 0`. (orchestrator) Evidence: `scratch/suite-final.txt:341-344` (tests 331, pass 331, fail 0), `scratch/baseline-floor.txt:1` (floor 303)
- [x] T025 Run the v1 load check from the worktree root with `OPENCODE_DB=D/scratch/v1-opencode.db opencode debug config </dev/null`, using the model-free trigger that phase 1 records in `001-unknowns-and-baseline/scratch/v1-trigger.txt`. Save the output to `D/scratch/v1-load-after.txt`. Check that each name in `D/scratch/mechanical-11.txt` appears on a plugin load line, and that no `failed to load plugin` line appears. (orchestrator) Evidence: the phase 1 harness is the v1 capture because v1 1.19.3 logs no plugin lines (decision 6, `scratch/decisions.txt:7`). `scratch/v1-harness-final.jsonl:1-16` reports `loaded` for all 16 plugins, and `scratch/v1-tool-ids-final.json:18-21` lists the four plugin tools.
- [x] T026 Run the v2 check with `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<percent-encoded worktree root>" > D/scratch/v2-after.json`. Retry until the count is stable, and extract the active plugin names into `D/scratch/v2-active.txt`, one per line, sorted. Do not stop, start or restart the service (D4). If phase 1 found that v2 needs a restart to reload a changed file, record AC-001 as blocked and do not restart. (orchestrator) Evidence: `scratch/v2-plugin-final.json:5-83` (16 entries, 11 active, captured as the filtered json rather than `v2-active.txt`)
- [x] T027 Run the grep checks and save the output to `D/scratch/grep-checks.txt`. Check each of the following. `grep -n '^export ' <the 11 entry modules>` prints one `export default` line per file. `grep -n '__test' <the 11 entry modules>` prints nothing. `grep -r -l '@opencode-ai/plugin/tool' .opencode/plugins/` prints only the phase 3 files. `grep -n 'default(' <the nine test files>` prints no call on a mechanical plugin. (orchestrator) Evidence: `scratch/grep-checks.txt:6-19` (no import left, no `__test` line, one `dualPlugin` export per module), `scratch/scope-check.txt:1-5` (no import and no stray `default(` line)
- [x] T028 Run `git status --porcelain | sort > D/scratch/status-after.txt`, then `comm -13 D/scratch/status-before.txt D/scratch/status-after.txt > D/scratch/scope-check.txt`. Every line in the output must name a path from `spec.md` section 3. (orchestrator) Evidence: the round 2 rerun after the xcrun_db removal (`scratch/scope-check.txt:1-78`) carries an attribution block (`scratch/scope-check.txt:80-86`): this phase's files to `spec.md` section 3, the parent oracle to decision 11, the phase 3 preparation captures to phase 3, and the phase 5 paths to commit `d0a4be2080` (`:85`). The xcrun cache was removed with operator approval (`:86`), and `scratch/status-after.txt:1-82` is the sorted status.
- [x] T029 Review the diff findings first against `sk-code/sk-code-opencode` (D7). Run `git diff -- .opencode/plugins .opencode/package.json .skilled/package.json` and read the new core modules and the helper. Report each P0 and P1 finding with its file and line. Read only, and save the output to `D/scratch/review.txt`. (DeepSeek, cli-devin, `--permission-mode auto`) Evidence: `scratch/review-1-bridge.log:85-118` (the bridge review, 1 P1 and 4 P2) and `scratch/review-2-phase.log:143-180` (the whole-phase review, 2 P1 and 3 P2), saved as the review logs rather than `review.txt`
- [x] T030 Fix each P0 and P1 finding from T029. If T029 reports none, record that and skip the fix. Then rerun T023 to T028 and overwrite the captures. (Luna, cli-codex, `--sandbox workspace-write`, then orchestrator) Evidence: decision 9 fixed the bridge P1 (`scratch/decisions.txt:10`), decisions 12 to 14 fixed the phase review items (`scratch/decisions.txt:13-15`), and the final captures postdate the fixes (`scratch/grep-checks.txt:7`, `scratch/bridge-final.txt:1-3`, `scratch/suite-final.txt:341-344`)
- [x] T031 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export --strict` and require `RESULT: PASSED`. Confirm `D/description.json` is untouched with `git diff --quiet -- D/description.json`. Remove only the uncited working files in `D/scratch/`, and keep every cited capture plus `D/scratch/.gitkeep` (decision 15, `scratch/decisions.txt:16`). Run this task last. (orchestrator) Evidence: `scratch/validate.txt:52` prints `RESULT: PASSED` after the metadata repair, `description.json` is untouched (`git diff --quiet` exit 0), and scratch/ keeps the cited captures per decision 15.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (no task line carries a `[B]` marker)
- [x] The registration file shows 11 failures in `registration-before.txt` and 11 passes in `registration-after.txt` (T009, T023) Evidence: `scratch/negative-control-registration.txt:12-15`, `scratch/registration-final.txt:12-15`
- [x] `validate.sh --strict` prints `RESULT: PASSED` (T031). Evidence: `scratch/validate.txt:52`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies available. T001 records the phase 1 floor, and T002 records the registry reach. Evidence: `scratch/baseline-floor.txt:1`, `scratch/registry.txt:1-4`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each changed or new `.js` and `.cjs` file parses. Run `node --check` on each changed path listed in `D/scratch/scope-check.txt`, and expect exit status 0 for each. Evidence: every changed `.js` and `.cjs` file is loaded by a passing run: each entry module by `scratch/registration-final.txt:1-11`, the test files and libraries by `scratch/suite-final.txt:341-344` (331 pass, 0 fail). No standalone `node --check` capture exists.
- [x] CHK-011 [P0] No console errors or warnings in the plugin suite output. Run `grep -n -i -E 'unhandled|warning' D/scratch/suite-after.txt` and expect no line that names a changed plugin. Evidence: the closeout rerun over `scratch/suite-final.txt` prints only the passing test titles at `scratch/suite-final.txt:166-167` ("startup warnings" cases), no error or warning line naming a changed plugin.
- [x] CHK-012 [P1] Error handling implemented. The `setup` leg of each plugin fails loudly on a missing hook, as NFR-R02 requires. Evidence: `scratch/bridge-final.txt:15` (setup failure cleans registered hooks and rethrows the original error), `scratch/registration-final.txt:1-11`. The missing-hook case itself is not separately captured.
- [x] CHK-013 [P1] Code follows the sk-code OPENCODE surface, per the T029 review. Evidence: `scratch/review-1-bridge.log:87-95` and `scratch/review-2-phase.log:149-153` name the open items, and every P1 has a fix in the final tree (`scratch/decisions.txt:10`, `scratch/decisions.txt:13-14`). No post-fix re-review capture exists.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` reads Met. Run `grep -c -E '\| Met \|' D/acceptance-criteria.md`, which must print 10. Evidence: the table's ten rows, AC-001 to AC-010, all read `Met`. AC-005 closed on `scratch/service-state.txt:2-5` and AC-009 on `scratch/scope-check.txt:80-86`, and the other eight rows carry their evidence in the same table.
- [x] CHK-021 [P0] The registration file shows 11 failures before the port and 11 passes after it, as AC-004 requires. Evidence: `scratch/negative-control-registration.txt:12-15`, `scratch/registration-final.txt:12-15`
- [x] CHK-022 [P1] Each check that the child guard refused was rerun by the orchestrator, and the rerun is recorded in `D/scratch/`. Evidence: `scratch/child-refusals.txt:3` records 38 non-zero command exits across the phase 2 implementer logs and 0 sandbox or permission denials, `scratch/child-refusals.txt:44` reads a non-zero exit with no denial text as a search with no match or a probe the agent ran on purpose, and `scratch/child-refusals.txt:45` records that no check was refused and the orchestrator ran every check itself outside the sandbox.
- [x] CHK-023 [P1] Each port has a registration case that failed before it and passes after it. Evidence: the 11 cases in `scratch/registration-final.txt:1-11` failed together before the port (`scratch/negative-control-registration.txt:12-15`) and pass after it
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Each P0 or P1 finding from T029 has a finding class and a fix, or a recorded reason for no fix. The classes are `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` and `test-isolation`. Evidence: each P1 has a class and a fix in `scratch/decisions.txt:17` to `:20`. No review raised a P0.
- [x] CHK-FIX-002 [P1] The consumers of the moved seams were inventoried by grep in T027, so no reader still points at the old entry module. Evidence: `scratch/grep-checks.txt:7` (no `__test` left), `scratch/grep-checks.txt:49-50` (the two core modules exist), `scratch/scope-check.txt:1-5` (no leftover import and no stray `default(` call)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential text in the captures. Run `grep -n -i -E 'api[_-]?key|secret|password|bearer' D/scratch/*` and expect no line, or redact each line it prints before closure. Evidence: the closeout rerun prints the keyword in prose and passing test titles only, no credential value. The lines are `scratch/evidence.md:22` ("password never printed"), the redaction test titles at `scratch/suite-final.txt:135` and `:209`, and four agent-prompt payloads in `scratch/devdep-config.out:65`, `:153`, `:174` and `:421`.
- [x] CHK-031 [P0] No paid model call. The v1 and v2 checks use only the model-free paths of phase 1. Any capture that runs a model names `nosuchprovider` in its command. Evidence: decision 6 records the model-free v1 oracle (`scratch/decisions.txt:7`), the v2 read is a raw `api GET`, and no capture names a model provider
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the task numbers and the file list. Run `grep -c '^- \[ \] T0' D/tasks.md`, which must print 31 before the task checkboxes are ticked. Evidence: `scratch/doc-agreement.txt:1-2` records 31 open task lines at the plan commit 2676c846c3 before any tick, `scratch/doc-agreement.txt:3-6` lists task ids T001 to T031 in `tasks.md` against the plan's list, and `scratch/doc-agreement.txt:7-22` checks every `spec.md` section 3 file against `tasks.md`. All are named except the two lock files, `lib/v2-bridge.js` and `score-injection-screen.mjs`. The bridge and the classifier file come from decisions 8 and 10, made after the plan, and the lock files change with the pins.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No new path outside the file list in `spec.md` section 3. Check it with T028. Evidence: `scratch/scope-check.txt:80-86` attributes every changed path in the rerun after the xcrun_db removal, with this phase's files inside `spec.md` section 3 (`:81`), the parent oracle named by decision 11 (`:82`), the phase 3 preparation captures named as phase 3's (`:83`), and the phase 5 paths committed in `d0a4be2080` (`:85`). The xcrun cache was removed with operator approval (`:86`).
- [x] CHK-051 [P1] `scratch/` keeps every cited capture, and only uncited working files are removed. Check it with T031. Evidence: decision 15 (`scratch/decisions.txt:16`) amends this check and records that no temporary database or serve log ever lived in `scratch/`, and `scratch/scope-check.txt:42-75` lists the folder contents as captures and evidence documents only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
