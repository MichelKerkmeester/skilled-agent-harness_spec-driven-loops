---
title: "Tasks: Phase 3: hard-plugins"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hard plugins tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: hard-plugins

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

Each task names its executor in brackets at the end. `(orchestrator)` runs in the orchestrator's shell. `(DeepSeek, cli-devin)` runs through `devin -p --model deepseek-v4-1-flash-max` with `AI_SESSION_CHILD=1` set. `(Luna, cli-codex)` runs through `codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast"` with `AI_SESSION_CHILD=1` set. Paths are relative to the worktree root. `D` below means `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins`, and `P2` means `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/002-pins-imports-dual-export`. Tasks T009 to T012c run one at a time, in order. The orchestrator runs the hard-plugin file and the plugin suite after each one.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm that `P2/spec.md` closed with `validate.sh --strict` printing `RESULT: PASSED`. Copy the pass count from `P2/scratch/suite-after.txt` into `D/scratch/baseline-floor.txt`. Capture the sorted `git status --porcelain` into `D/scratch/status-before.txt`. Write the five hard plugin names, sorted, into `D/scratch/hard-5.txt`. Stop if phase 2 is not closed. (orchestrator)
- [ ] T002 Copy the phase 1 verdicts on Q5 (`session.idle` delivery), Q6 (`session.compacted` delivery), Q7 (zod against `Tool.ValueSchema`) and Q11 (the `sk-vision` source and build) from `001-unknowns-and-baseline/findings.md` into `D/scratch/phase1-answers.txt`. Add the verdict on the v2 reload question. A verdict that is unknown stays unknown in that file, and the task that depends on it is recorded as blocked. (orchestrator)
- [ ] T003 Record four decisions in `D/scratch/decisions.txt`. The first is the class of `system-skill-advisor`, because research marks it mechanical and the brief marks it hard. The second is the home of each seam, one core module per plugin. The third is whether the `sk-vision` named export `SkVisionPlugin` stays. The fourth is whether the `sk-vision` package pin of 1.17.15 changes. The orchestrator also confirms that both hosts register the same `sk-vision` command. Tasks T009 to T016 wait for this file. (orchestrator)
- [ ] T004 Read the type declarations of `@opencode/plugin` 2.0.32 in `.opencode/node_modules/@opencode/plugin/`. List the exact member names of `ctx.event`, `ctx.tool`, `ctx.session` and `ctx.command`, and the payload fields that the five v2 legs use. Give file and line citations for each name. Read only. The orchestrator saves the output to `D/scratch/v2-types.txt`. (DeepSeek, cli-devin, `--permission-mode auto`)
- [ ] T005 Check the `sk-vision` bundle. If `.skilled/skills/sk-vision/vision-runtime/dist/plugin.js` exists from phase 1, record its size and its sha256 in `D/scratch/sk-vision-build-before.txt`. If it does not exist, run `bun install` and `bun run build` in `.skilled/skills/sk-vision/vision-runtime/` and record both exit statuses. (orchestrator)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Write `.opencode/plugins/tests/v2-hard-plugins.test.cjs` with one registration case per plugin. Each case loads the default export, checks that it is an object with `id`, `setup` and `server` and calls `setup` on a stub v2 context. The stub records the hooks that each leg registers on `tool`, `event`, `session` and `command`. Add the payload assertions for the goal queue (`delivery: "queue"`) and the skill advisor transform. No case sets an environment variable. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T007 Add two behaviour cases to the same file. The first case proves that the sentinel caches assistant text per session when a `session.idle` event arrives for that session. The second case proves that the spec gate denies a tool call through `tool.hook("execute.before")`, and that the denial reaches the caller. Both cases use a stub context that delivers events. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T008 Run `node --test .opencode/plugins/tests/v2-hard-plugins.test.cjs > D/scratch/hard-before.txt 2>&1` against the unported tree. Every case must fail. Record the `# pass` and `# fail` lines, and the names of the `not ok` cases. (orchestrator)
- [ ] T009 Port `system-completion-sentinel.js`, following the decisions in T003. Wrap the default export at line 119 as `{ id, setup, server }`. The v2 leg subscribes to `session.idle` with `ctx.event.subscribe`, caches the assistant text per session in a map that lives inside `setup` and clears the map in cleanup. Move the seam at line 170 to `lib/completion-sentinel-core.js`. Point the four `__test.core` reads in `tests/system-completion-sentinel.test.cjs` at lines 60, 86, 105 and 130 to that core module. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T010 Port `system-spec-gate.js`, following the decisions in T003. Wrap the default export at line 168 as `{ id, setup, server }`. The v2 leg reads the prompt with `session.hook("prompt")`, injects with `session.hook("context")` and denies with `tool.hook("execute.before")`. Move the seam at line 301 to a core module if T003 keeps it. The spec gate has no test reader of that seam. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T011 Port `system-skill-advisor.js`. Replace the `tool` import at line 24 with `lib/tool-identity.js`. Wrap the default export at line 935 as `{ id, setup, server }`. The v2 leg reacts to the compaction event that the Q6 verdict in `D/phase1-answers.txt` names, injects with `session.hook("context")` and changes the tool list with `ctx.tool.transform`. In `tests/system-skill-advisor.test.cjs`, change the calls at lines 182, 509, 562 and 586 to `.server`, change the type check at line 276 to the object shape and replace the stub at line 58 with the helper import. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T012a Port `opencode-goal.js`, part 1 of 3. Replace the `tool` import at line 16 with `lib/tool-identity.js`. Wrap the default export at line 3187 as `{ id, setup, server }`. The v2 leg enqueues each prompt with `ctx.session.prompt({ sessionID, text, delivery: "queue" })`. Do not change the deadline logic in this dispatch. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T012b Port `opencode-goal.js`, part 2 of 3. Rebuild the deadline and the abort wrapper inside the v2 leg. The state is keyed by session ID and it resets in cleanup. The v1 path keeps its current logic. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T012c Port `opencode-goal.js`, part 3 of 3. Move the seam at lines 3364 to 3390 to `lib/opencode-goal-core.js`, following T003. Point the seam readers in `tests/opencode-goal-export-contract.test.cjs` and `tests/opencode-goal-render-parity.test.cjs` at that core module. The export contract keeps its pinned key list. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T013 Change the default calls to `.server` in the six goal test files: `opencode-goal-capabilities.test.cjs` (4 calls), `opencode-goal-continuation.test.cjs` (4), `opencode-goal-lifecycle.test.cjs` (36), `opencode-goal-state.test.cjs` (10), `opencode-goal-supervisor.test.cjs` (2) and `opencode-goal-tool-path.test.cjs` (2). Keep the test names and the assertions unchanged. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T014 Move the `sk-vision` command to `ctx.command.transform` in `.skilled/skills/sk-vision/vision-runtime/src/`. Edit `src/plugin.ts`, and the module under `src/opencode/` that it imports. Keep `command.execute.before` for v1, and make both hosts call the same handler. Apply the named export decision from T003 to line 13. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T015 Rebuild the bundle with `bun run build` in `.skilled/skills/sk-vision/vision-runtime/`. Record the exit status and the size and sha256 of `dist/plugin.js` in `D/scratch/sk-vision-build-after.txt`. If the package defines a test script, run it and record the output. (orchestrator)
- [ ] T016 Load the rebuilt bundle on v1 and v2 with the same method that phase 1 used. On v1, use `OPENCODE_DB=D/scratch/v1-sk-vision.db opencode debug config </dev/null`. On v2, use the raw-query `api GET`. Do not stop, start or restart the service. Save both captures to `D/scratch/sk-vision-load.txt`. If the build or a load fails, write the reason and the phase 1 verdict to `D/scratch/sk-vision-blocked.txt`. (orchestrator)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Rerun the hard-plugin file: `node --test .opencode/plugins/tests/v2-hard-plugins.test.cjs > D/scratch/hard-after.txt 2>&1`. Every case must pass. Compare the names with the `not ok` names in `hard-before.txt`, so each name that failed before now passes. (orchestrator)
- [ ] T018 Rerun the plugin suite: `node --test .opencode/plugins/tests/*.test.cjs > D/scratch/suite-after.txt 2>&1`. Compare the `# pass` count with `D/scratch/baseline-floor.txt`, and expect `# fail 0`. (orchestrator)
- [ ] T019 Run the v1 load check from the worktree root with `OPENCODE_DB=D/scratch/v1-opencode.db opencode debug config </dev/null`. Save the output to `D/scratch/v1-load-after-003.txt`. Check that each name in `D/scratch/hard-5.txt` appears on a plugin load line, and that no `failed to load plugin` line appears. (orchestrator)
- [ ] T020 Run `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<percent-encoded worktree root>" > D/scratch/v2-after-003.json`, and retry until the count is stable. Extract the active names into `D/scratch/v2-active-003.txt`, sorted. Do not stop, start or restart the service (D4). If phase 1 found that v2 needs a restart to reload a changed file, record AC-001 as blocked and do not restart. (orchestrator)
- [ ] T021 Run the grep checks and save the output to `D/scratch/grep-checks-003.txt`. `grep -n '^export ' <the five entry modules>` prints one `export default` line per file. `grep -n '__test' <the five entry modules>` prints nothing. `grep -r -l '@opencode-ai/plugin/tool' .opencode/plugins/` prints nothing. `grep -n 'default(' <the goal and skill advisor tests>` prints no call. `grep -n 'return null' <the four entry modules>` lists each guard, and each guard the port touched has its replacement recorded. (orchestrator)
- [ ] T022 Run `git status --porcelain | sort > D/scratch/status-after-003.txt`, then `comm -13 D/scratch/status-before.txt D/scratch/status-after-003.txt > D/scratch/scope-check-003.txt`. Every line in the output must name a path from `spec.md` section 3. (orchestrator)
- [ ] T023 Review the diff, findings first, against `sk-code/sk-code-opencode` (D7). Focus on the five v2 legs and on each replaced null guard. Read `git diff -- .opencode/plugins .skilled/skills/sk-vision/vision-runtime/src` and the new core modules. Report each P0 and P1 finding with its file and line. Read only. The orchestrator saves the output to `D/scratch/review-003.txt`. (DeepSeek, cli-devin, `--permission-mode auto`)
- [ ] T024 Fix each P0 and P1 finding from T023. If T023 reports none, record that and skip the fix. Then rerun T017 to T022 and overwrite the captures. (Luna, cli-codex, `--sandbox workspace-write`, then orchestrator)
- [ ] T025 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins --strict` and require `RESULT: PASSED`. Confirm that `D/description.json` is untouched with `git diff --quiet -- D/description.json`. Remove the working files in `D/scratch/` and keep `D/scratch/.gitkeep`. Run this task last. (orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Each case that failed in `hard-before.txt` passes in `hard-after.txt` (T008, T017)
- [ ] `validate.sh --strict` prints `RESULT: PASSED` (T025)
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
- [ ] CHK-003 [P1] Dependencies available. T001 records the phase 2 floor, T002 records the phase 1 verdicts and T004 records the v2 type names.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each changed or new `.js`, `.cjs` and `.ts` file parses. Run `node --check` on each changed `.js` and `.cjs` path in `D/scratch/scope-check-003.txt`, and run the package build for the `.ts` source (T015). Expect exit status 0.
- [ ] CHK-011 [P0] No console errors or warnings in the plugin suite output. Run `grep -n -i -E 'unhandled|warning' D/scratch/suite-after.txt` and expect no line that names a changed plugin.
- [ ] CHK-012 [P1] The v2 legs fail loudly on a missing hook, as NFR-R02 requires. The registration cases prove it.
- [ ] CHK-013 [P1] Code follows the sk-code OPENCODE surface, per the T023 review.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row of `acceptance-criteria.md` reads Met. Run `grep -c -E '\| Met \|' D/acceptance-criteria.md`, which must print 14.
- [ ] CHK-021 [P0] The sentinel and spec gate behaviour cases fail in `hard-before.txt` and pass in `hard-after.txt`.
- [ ] CHK-022 [P1] Each check that the child guard refused was rerun by the orchestrator, and the rerun is recorded in `D/scratch/`.
- [ ] CHK-023 [P1] Each port has a registration case that failed before it and passes after it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P1] Each P0 or P1 finding from T023 has a finding class and a fix, or a recorded reason for no fix. The classes are `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` and `test-isolation`.
- [ ] CHK-FIX-002 [P1] The consumers of each moved seam were inventoried by grep in T021, so no reader still points at the old entry module.
- [ ] CHK-FIX-003 [P1] The spec gate's denial is tested on v2 as a denial, not only as a load (NFR-S01).
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

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the task numbers and the file list. Run `grep -c '^- \[ \] T0' D/tasks.md`, which must print 27 before the task checkboxes are ticked.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No new path outside the file list in `spec.md` section 3. Check it with T022.
- [ ] CHK-051 [P1] `scratch/` holds only `.gitkeep` before completion. Check it with T025.
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
