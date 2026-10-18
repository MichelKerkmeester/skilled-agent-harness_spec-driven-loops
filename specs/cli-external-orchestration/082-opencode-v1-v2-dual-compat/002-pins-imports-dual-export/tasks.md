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

- [ ] T001 Capture the sorted `git status --porcelain` into `D/scratch/status-before.txt`. Copy the plugin suite floor from `001-unknowns-and-baseline/baseline.json` into `D/scratch/baseline-floor.txt`. Write the 11 mechanical plugin names, sorted, into `D/scratch/mechanical-11.txt`. Stop if phase 1 is not closed. (orchestrator)
- [ ] T002 Test the registry with `npm view @opencode-ai/plugin@1.19.3 version` and `npm view @opencode/plugin@2.0.32 version`. Record both outputs and both exit statuses in `D/scratch/registry.txt`. A block stops this phase, and the block is recorded as a finding. (orchestrator)
- [ ] T003 Record three decisions in `D/scratch/decisions.txt`: the import-site split (spec Open Questions, first item), the reading of "guards" (second item) and the placement of the `@opencode/plugin` dev dependency (third item). Record the phase 1 verdict on Q7 beside them. T005 and T010 wait for this task. (orchestrator)
- [ ] T004 Check whether v1 installs a dev dependency from `.opencode/package.json`. Copy `.opencode/` without `node_modules` to `D/scratch/devdep-probe/`, add `@opencode/plugin` 2.0.32 under `devDependencies`, and run `OPENCODE_DB=D/scratch/devdep-probe/opencode.db opencode debug config </dev/null` from `D/scratch/devdep-probe/`. Record whether `node_modules/@opencode/plugin` appears, with the output and exit status, in `D/scratch/devdep-probe.txt`. Write only under `D/scratch/`. (DeepSeek, cli-devin, `--permission-mode dangerous`)
- [ ] T005 Set `@opencode-ai/plugin` to `1.19.3` exactly in `.opencode/package.json` and `.skilled/package.json`. Declare `zod` at the version that `@opencode-ai/plugin` 1.19.3 uses. List `@opencode/plugin` at `2.0.32` under `devDependencies` as T003 records. Use the placement that T004 supports. (orchestrator)
- [ ] T006 Run `npm install` in `.opencode/` and in `.skilled/`. This regenerates both lock files. Record the exit status and the resolved versions of `@opencode-ai/plugin` and `zod` in `D/scratch/install.txt`. The changed tracked files are the two package files and the two lock files only. (orchestrator)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Write `.opencode/plugins/lib/tool-identity.js`. It exports `tool` as an identity function, with `tool.schema` set to the zod namespace, matching the v1 `tool.js` shape. Start only after the Q7 verdict is in `D/scratch/decisions.txt`. If Q7 rejects zod JSON Schema on v2, the helper keeps the v1 shape, and the v2 leg adapts the schema. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T008 Write `.opencode/plugins/tests/v2-registration.test.cjs` with one case per mechanical plugin. Each case loads the default export, checks that it is an object with `id`, `setup` and `server`, and calls `setup` on a stub v2 context with `tool.hook`, `event.subscribe` and `session.hook`. No case sets an environment variable. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T009 Run `node --test .opencode/plugins/tests/v2-registration.test.cjs > D/scratch/registration-before.txt 2>&1` against the unported tree. Every one of the 11 cases must fail. Record the `# pass` and `# fail` lines. (orchestrator)
- [ ] T010 Port `system-speckit-completion.js`. Replace the `tool` import at line 28 with `lib/tool-identity.js`. Wrap the default export as `{ id, setup, server }`. Remove the `__test` seam at line 90, because no test reads it. Keep the `core` import from `completion-state.cjs`. Update `system-speckit-completion.test.cjs` so each call at lines 32, 41 and 51 goes to `.server`. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T011 Port `classifier-injection-screen.js`. Move `SCREEN_TOOL`, `MAX_PENDING_ADVISORIES`, `MAX_SESSIONS`, `UNKNOWN_SESSION` and `sessionIdOf` into `lib/classifier-injection-screen-core.js`. Wrap the default export. Point `classifier-injection-screen.test.cjs` at the core module for the seam read at line 176, and move its calls to `.server` and its function-type check at line 67 to the object shape. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T012 Port `cli-dispatch-audit.js`. Wrap the default export as `{ id, setup, server }`. Remove the `__test` seam at line 134, because no test reads it and `dispatch-audit.mjs` already exports the same constants. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T013 Port `sk-code-post-edit-quality.js`. Move `PLUGIN_DIR`, `MUTATING_TOOLS`, `MAX_CALL_IDS`, `MAX_PENDING_FINDINGS`, `filePathFromArgs`, `createCorrelationMap` and `formatFinding` into `lib/sk-code-post-edit-quality-core.js`. Wrap the default export. Update `sk-code-post-edit-quality.test.cjs`: the calls at lines 449, 481, 501, 528, 544, 558 and 575 go to `.server`. The shape check at line 419 changes to the object shape. The seam read at line 424 goes to the core module. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T014 Port `session-cleanup.js`. Wrap the default export and keep its `(input, overrides)` signature. In `session-cleanup.test.cjs`, make `loadPlugin()` return `.server`, so the four call sites stay unchanged. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T015 Port `mcp-route-guard.js`. Wrap the default export. In `mcp-route-guard.test.cjs`, change the call at line 36 to `.server`. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T016 Port `codex-hooks-watchdog.js`. Wrap the default export. No test file in `tests/` calls it directly, so T021 covers its use in `source-root-consumers.test.cjs`. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T017 Port `sk-git-message-gate.js`. Wrap the default export. In `sk-git-message-gate.test.cjs`, change the call at line 33 to `.server`. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T018 Port `sk-git-preflight-advisory.js`. Wrap the default export. No test file calls it directly, so T021 covers its use in `source-root-consumers.test.cjs`. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T019 Port `system-deep-loop-guard.js`. Wrap the default export. In `system-deep-loop-guard.test.cjs`, move the function-type check at line 77 to the object shape, and move the calls at lines 81, 369, 387, 408, 417 and 436 to `.server`. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T020 Port `system-dist-freshness-guard.js`. Wrap the default export. In `system-dist-freshness-guard.test.cjs`, move the function-type check at line 163 to the object shape, and move the calls at lines 170, 198, 222, 243 and 255 to `.server`. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T021 Update `source-root-consumers.test.cjs`. Its `load()` at line 61 calls the default export of `cli-dispatch-audit.js`, `sk-git-preflight-advisory.js` and `codex-hooks-watchdog.js`. Change that call to `.server`. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T022 Confirm that the hard plugins and their tests are untouched. Run `git diff --stat -- .opencode/plugins/opencode-goal.js .opencode/plugins/system-skill-advisor.js .opencode/plugins/system-spec-gate.js .opencode/plugins/system-completion-sentinel.js .opencode/plugins/tests/system-skill-advisor.test.cjs` and expect no output. If T003 widened the split, expect only the lines it names. (orchestrator)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Rerun the registration file: `node --test .opencode/plugins/tests/v2-registration.test.cjs > D/scratch/registration-after.txt 2>&1`. Expect `# pass 11` and `# fail 0`. (orchestrator)
- [ ] T024 Rerun the plugin suite: `node --test .opencode/plugins/tests/*.test.cjs > D/scratch/suite-after.txt 2>&1`. Compare the `# pass` count with `D/scratch/baseline-floor.txt`, and expect `# fail 0`. (orchestrator)
- [ ] T025 Run the v1 load check from the worktree root with `OPENCODE_DB=D/scratch/v1-opencode.db opencode debug config </dev/null`, using the model-free trigger that phase 1 records in `001-unknowns-and-baseline/scratch/v1-trigger.txt`. Save the output to `D/scratch/v1-load-after.txt`. Check that each name in `D/scratch/mechanical-11.txt` appears on a plugin load line, and that no `failed to load plugin` line appears. (orchestrator)
- [ ] T026 Run the v2 check with `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<percent-encoded worktree root>" > D/scratch/v2-after.json`. Retry until the count is stable, and extract the active plugin names into `D/scratch/v2-active.txt`, one per line, sorted. Do not stop, start or restart the service (D4). If phase 1 found that v2 needs a restart to reload a changed file, record AC-001 as blocked and do not restart. (orchestrator)
- [ ] T027 Run the grep checks and save the output to `D/scratch/grep-checks.txt`. Check each of the following. `grep -n '^export ' <the 11 entry modules>` prints one `export default` line per file. `grep -n '__test' <the 11 entry modules>` prints nothing. `grep -r -l '@opencode-ai/plugin/tool' .opencode/plugins/` prints only the phase 3 files. `grep -n 'default(' <the nine test files>` prints no call on a mechanical plugin. (orchestrator)
- [ ] T028 Run `git status --porcelain | sort > D/scratch/status-after.txt`, then `comm -13 D/scratch/status-before.txt D/scratch/status-after.txt > D/scratch/scope-check.txt`. Every line in the output must name a path from `spec.md` section 3. (orchestrator)
- [ ] T029 Review the diff findings first against `sk-code/sk-code-opencode` (D7). Run `git diff -- .opencode/plugins .opencode/package.json .skilled/package.json` and read the new core modules and the helper. Report each P0 and P1 finding with its file and line. Read only, and save the output to `D/scratch/review.txt`. (DeepSeek, cli-devin, `--permission-mode auto`)
- [ ] T030 Fix each P0 and P1 finding from T029. If T029 reports none, record that and skip the fix. Then rerun T023 to T028 and overwrite the captures. (Luna, cli-codex, `--sandbox workspace-write`, then orchestrator)
- [ ] T031 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export --strict` and require `RESULT: PASSED`. Confirm `D/description.json` is untouched with `git diff --quiet -- D/description.json`. Remove the working files in `D/scratch/` and keep `D/scratch/.gitkeep`. Run this task last. (orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The registration file shows 11 failures in `registration-before.txt` and 11 passes in `registration-after.txt` (T009, T023)
- [ ] `validate.sh --strict` prints `RESULT: PASSED` (T031)
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
- [ ] CHK-003 [P1] Dependencies available. T001 records the phase 1 floor, and T002 records the registry reach.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each changed or new `.js` and `.cjs` file parses. Run `node --check` on each changed path listed in `D/scratch/scope-check.txt`, and expect exit status 0 for each.
- [ ] CHK-011 [P0] No console errors or warnings in the plugin suite output. Run `grep -n -i -E 'unhandled|warning' D/scratch/suite-after.txt` and expect no line that names a changed plugin.
- [ ] CHK-012 [P1] Error handling implemented. The `setup` leg of each plugin fails loudly on a missing hook, as NFR-R02 requires.
- [ ] CHK-013 [P1] Code follows the sk-code OPENCODE surface, per the T029 review.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row of `acceptance-criteria.md` reads Met. Run `grep -c -E '\| Met \|' D/acceptance-criteria.md`, which must print 10.
- [ ] CHK-021 [P0] The registration file shows 11 failures before the port and 11 passes after it, as AC-004 requires.
- [ ] CHK-022 [P1] Each check that the child guard refused was rerun by the orchestrator, and the rerun is recorded in `D/scratch/`.
- [ ] CHK-023 [P1] Each port has a registration case that failed before it and passes after it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P1] Each P0 or P1 finding from T029 has a finding class and a fix, or a recorded reason for no fix. The classes are `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` and `test-isolation`.
- [ ] CHK-FIX-002 [P1] The consumers of the moved seams were inventoried by grep in T027, so no reader still points at the old entry module.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential text in the captures. Run `grep -n -i -E 'api[_-]?key|secret|password|bearer' D/scratch/*` and expect no line, or redact each line it prints before closure.
- [ ] CHK-031 [P0] No paid model call. The v1 and v2 checks use only the model-free paths of phase 1. Any capture that runs a model names `nosuchprovider` in its command.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the task numbers and the file list. Run `grep -c '^- \[ \] T0' D/tasks.md`, which must print 31 before the task checkboxes are ticked.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No new path outside the file list in `spec.md` section 3. Check it with T028.
- [ ] CHK-051 [P1] `scratch/` holds only `.gitkeep` before completion. Check it with T031.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | [ ]/8 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
