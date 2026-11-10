---
title: "Implementation Plan: Phase 2: pins-imports-dual-export"
description: "Ports the 11 mechanical plugins to the { id, setup, server } shape, pins both package folders to the target versions and checks both OpenCode versions with the captures."
trigger_phrases:
  - "pins imports dual export plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: pins-imports-dual-export

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM and CJS) for the plugins and tests, Node for the suites, npm for the pins |
| **Framework** | OpenCode 1.19.3 (v1, `opencode`) and OpenCode 2.0.32 (v2, `opencode2`) |
| **Storage** | `OPENCODE_DB` files under `scratch/`. No repo database changes. |
| **Testing** | Node built-in test runner for the plugin suite and the v2 registration file |

### Overview
Phase 2 changes the export shape of the 11 mechanical plugins from a bare function to `{ id, setup, server }`. The `server` entry keeps the current function, so v1 behaviour does not change. The `setup` entry adds the v2 leg. The phase also pins both package folders to the target versions, replaces the `tool` import with a local helper, and moves two test seams into core modules. The phase writes no file outside its file list in `spec.md` section 3.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (SC-001 to SC-003)
- [x] Dependencies identified in `spec.md` section 6

### Definition of Done
- [ ] All acceptance criteria met (`acceptance-criteria.md`) (open: AC-005 and AC-009 stay Unmet)
- [x] The registration file shows 11 failures before the port and 11 passes after it
- [x] The plugin suite is at or above the phase 1 floor, with zero failures
- [ ] `validate.sh --strict` prints `RESULT: PASSED` (open: the closeout run reports the expected GENERATED_METADATA errors, repaired by the orchestrator)
- [x] Docs updated (spec, plan and tasks agree)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Port one plugin per dispatch, then check it. Each port wraps one default export, adds one `setup` leg and moves any seam out of the entry module. The orchestrator runs the registration case and the plugin suite after each port, so a regression stops the sequence at the plugin that caused it.

### Key Components
- **`lib/tool-identity.js`**: an identity function for `tool`, with `tool.schema` set to zod. It replaces the import from `@opencode-ai/plugin/tool`.
- **`lib/classifier-injection-screen-core.js` and `lib/sk-code-post-edit-quality-core.js`**: the two core modules that hold the moved seams. The entry module and its test both import them.
- **Entry module shape**: `export default { id, setup(ctx), server(input, options) }`. `server` is the v1 function unchanged. `setup` registers the v2 hooks on the context and keeps its state inside the call.
- **`tests/v2-registration.test.cjs`**: one case per ported plugin. Each case loads the default export, checks the object shape and calls `setup` on a stub context.

```js
export default {
  id: 'system-speckit-completion',
  server: MkSpeckitCompletionPlugin,
  setup(ctx) {
    // v2 leg: ctx.tool.hook and ctx.event.subscribe
  }
}
```

The sketch shows the shape. Each plugin supplies its own `id` and its own `setup` body.

### Recorded Deviations

The delivered tree deviates from the plan above in four recorded ways.

- Decision 8: one shared bridge, `.opencode/plugins/lib/v2-bridge.js`, builds every v2 `setup` leg from the unchanged v1 `server`, instead of 11 hand-written setup bodies. The 11 plugins use the same five hook keys, so 11 bodies would repeat one mapping 11 times and drift.
- Decision 10: the scope adds `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs`, the import-time `argv[1]` fix for the Bun-compiled v2.
- Decision 9: tool results convert to the v2 `{ content, metadata }` shape. A live v2 `execute` of a bridged tool is not yet observed, and the call is owed before phase 3 closes.
- Decision 13: v2 session event delivery is unit-tested and type-checked, not observed live.

### Data Flow
v1 loads the module, reads `server` and calls it with the v1 input. v2 loads the module, reads `setup` and calls it with the v2 context. The two paths share the module's helpers and nothing else. The registration file exercises the v2 path, and the v1 suite exercises the `server` path.

### Affected Surfaces

This phase changes the export contract of the 11 plugins and one tool import, so it carries the affected-surface inventory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `@opencode-ai/plugin/tool` import sites | Three sites: `system-speckit-completion.js:28`, `system-skill-advisor.js:24` and `opencode-goal.js:16`. A test stub at `tests/system-skill-advisor.test.cjs:58`. | Replace the `system-speckit-completion.js` site here. The other two sites and the stub stay for phase 3, unless T003 amends the split. | `grep -r '@opencode-ai/plugin/tool' .opencode/plugins/` (T027, AC-007) |
| Default exports of the 11 plugins | Bare async functions, read as the v1 `server` entry | Wrap as `{ id, setup, server }` | The registration file (T023) and the plugin suite (T024) |
| Test calls to a default export | Nine test files call a default export directly, and two test files assert the function type | Move each call to `.server`, or to the loader that returns it. Replace the function-type assertion with the object-shape assertion. | `grep -n "default(" <the nine files>` prints no line for the 11 plugins (T027) |
| `source-root-consumers.test.cjs` | Its `load()` calls the default export of `cli-dispatch-audit`, `sk-git-preflight-advisory` and `codex-hooks-watchdog` | Update the loader to read `.server` | The plugin suite (T024) |
| Seams: `__test` on the 4 entry modules | `classifier-injection-screen` and `sk-code-post-edit-quality` read by one test each. `cli-dispatch-audit` and `system-speckit-completion` read by no test. | Move the first two into core modules. Remove the last two. | `grep -n '__test' <11 entry modules>` prints nothing (T027, AC-008) |
| `opencode.json` and the v2 loader | Phase 4 owns the config. The v2 loader reads flat `.opencode/plugins/*.js` (research iteration 14, finding F5). | Unchanged | The v2 check (T026) |
| `.opencode/plugins/README.md` | Describes the old shape | Unchanged in this phase. Phase 10 updates it. | Named in `spec.md` section 3 as out of scope |

Required inventories:
- Same-class producers: `rg -n "export default" .opencode/plugins/*.js`, which lists the 11 mechanical default exports and the hard-plugin exports.
- Consumers of changed symbols: `rg -n "\.default\(|__test" .opencode/plugins/tests/`, which lists the test calls and the seam reads.
- Matrix axes: host (v1, v2) by plugin (11) by check (load, registration case, suite). Each cell has one capture.
- Algorithm invariant: not applicable. The phase moves helpers without changing their logic. The existing tests of the moved helpers keep their assertions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Ordered steps and dispatch

Dispatches run one at a time. Each dispatch sets `AI_SESSION_CHILD=1` in its environment, as the cli-devin and cli-codex contracts require. Each dispatch names its model and flags in full. Before any cli-codex or cli-devin prompt, the composing agent reads that CLI's `SKILL.md`.

| Step | Who runs it | How | Produces |
|------|-------------|-----|----------|
| S1 Setup (T001 to T003) | Orchestrator | Shell, from the worktree root | The status snapshot, the floor, the 11-name list and the decisions |
| S2 Install check and pins (T004 to T006) | T004 DeepSeek. T005 and T006 orchestrator. | `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous`, writes only under `scratch/`, for T004 | The dev dependency answer and the lock files |
| S3 Helper and registration file (T007 to T009) | T007 and T008 Luna. T009 orchestrator. | `codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox workspace-write` | The helper, the registration file and the failing baseline |
| S4 Ports (T010 to T021) | Luna, one dispatch per plugin, in the order of the task list | The same cli-codex flags. After each port the orchestrator runs the registration case and the plugin suite. | The 11 ported plugins and the nine test files |
| S5 Scope gate (T022) | Orchestrator | `git diff --stat` on the hard-plugin files | The check that the hard plugins are untouched |
| S6 Verify (T023 to T028) | Orchestrator | The commands in the verification checklist | The captures for AC-001 to AC-009 |
| S7 Review (T029) | DeepSeek V4.1 Flash max via cli-devin | `devin -p --model deepseek-v4-1-flash-max --permission-mode auto`, read-only | Findings first, with file and line citations |
| S8 Fix and rerun (T030) | Luna for fixes, orchestrator for the rerun | The same codex flags for the fixes. The orchestrator reruns T023 to T028. | The fixed tree and the new captures |
| S9 Close (T031) | Orchestrator | The strict validator and the scratch clean-up | The closure evidence |

Rollback for steps that change repo files: the tracked files return with `git checkout -- <path>`. The new files are removed by hand: `lib/tool-identity.js`, `lib/classifier-injection-screen-core.js`, `lib/sk-code-post-edit-quality-core.js` and `tests/v2-registration.test.cjs`. The `node_modules` folders are ignored, so after a revert the orchestrator runs `npm install` in both folders to match the restored lock files.

Verification by the orchestrator: the orchestrator reruns the registration file, the plugin suite and the v1 and v2 checks and compares each output with its capture. A verdict stands only when the output matches.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The plugin suite in `.opencode/plugins/tests/*.test.cjs`, and the registration cases in `v2-registration.test.cjs`, one per ported plugin | Node built-in test runner |
| Integration | v1 `opencode debug config </dev/null` and its plugin load lines. v2 `opencode2 api GET /api/plugin` with the raw query. | `opencode` 1.19.3 and `opencode2` 2.0.32 |
| Review | Findings-first review of the diff against `sk-code/sk-code-opencode` | DeepSeek through cli-devin, read-only |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode` 1.19.3 | Internal binary | Green. Version confirmed in phase 1. | The v1 load check cannot run. |
| `opencode2` 2.0.32 | Internal binary | Green. Version confirmed in phase 1. | The v2 check cannot run. |
| npm registry | External | Yellow. Unknown until T002 tests it. | The pins cannot install. Recorded as a finding. |
| Phase 1 baseline (`001-unknowns-and-baseline/baseline.json`) | Internal | Yellow until phase 1 closes. | The suite has no floor. |
| Phase 1 verdict on Q7 | Internal | Yellow until phase 1 closes. | The helper waits (T007). |
| Orchestrator decisions in T003 | Internal | Yellow until T003 is recorded. | The pins and the first port wait (T005, T010). |
| DeepSeek V4.1 Flash max via cli-devin | External model | Green. `deepseek-v4-1-flash-max` is listed by `devin models list`. | The review moves to the orchestrator. |
| GPT-6 Luna max fast via cli-codex | External model | Yellow. The write sandbox blocks local sockets, so the orchestrator runs the tests. | The ports move to the orchestrator. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A port breaks a plugin on v1, the suite falls below the floor, a registration case fails after its port or a step stops, starts or restarts the v2 service.
- **Procedure**: Stop the dispatch. Run `git status --porcelain` and compare it with `scratch/status-before.txt`. Restore each changed tracked file with `git checkout -- <path>`. Delete the four new files named in section 4. Run `npm install` in `.opencode/` and in `.skilled/`. Run `git status --porcelain` again and confirm the diff is empty.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Setup (S1) comes first. The pins and installs (S2) follow it. The helper and the registration file (S3) follow the pins. The ports (S4) follow S3, and they run in order. The scope gate (S5) and the verification (S6) follow the ports. The review (S7) comes next, then the fixes (S8) and the closure (S9).

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 closed | Pins, helper, ports |
| Pins | Setup, T003 | Helper, ports |
| Helper and registration file | Pins, Q7 verdict | Ports |
| Ports | Helper, registration file | Scope gate, verification |
| Verification | Ports | Review |
| Review | Verification | Fixes |
| Fixes | Review | Closure |
| Closure | Fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and pins | Medium | Not estimated. No timing evidence exists yet. |
| Ports | High | Not estimated. No timing evidence exists yet. |
| Verification and review | Medium | Not estimated. No timing evidence exists yet. |
| **Total** | High | **Not estimated. No timing evidence exists yet.** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `scratch/status-before.txt` holds the sorted `git status --porcelain` output from before any change
- [ ] `scratch/baseline-floor.txt` holds the phase 1 suite floor
- [ ] `scratch/mechanical-11.txt` holds the 11 plugin names, sorted
- [ ] No step calls `opencode2 service stop`, `opencode2 service start` or `opencode2 service restart`

### Rollback Procedure
1. Stop the dispatch that caused the problem.
2. Compare `git status --porcelain` with `scratch/status-before.txt`.
3. Restore each changed tracked file with `git checkout -- <path>`.
4. Delete the four new files named in section 4.
5. Run `npm install` in both package folders, and confirm that `git status --porcelain` matches the snapshot.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: The session rows written to a scratch `OPENCODE_DB` go away when the scratch folder is removed.
<!-- /ANCHOR:enhanced-rollback -->
