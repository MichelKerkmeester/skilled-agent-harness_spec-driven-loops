---
title: "Implementation Plan: Phase 3: hard-plugins"
description: "Ports the five hard plugins with a v2 leg each, proves each leg with a test that fails before the port and rebuilds the sk-vision bundle from its source."
trigger_phrases:
  - "hard plugins plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: hard-plugins

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM and CJS) for the plugins and tests, TypeScript for the `sk-vision` source, Bun for the `sk-vision` build |
| **Framework** | OpenCode 1.19.3 (v1, `opencode`) and OpenCode 2.0.32 (v2, `opencode2`) |
| **Storage** | `OPENCODE_DB` files under `scratch/`. No repo database changes. |
| **Testing** | Node built-in test runner for the plugin suite and the v2 hard-plugin file. `bun test` for `sk-vision`, if its package defines the script. |

### Overview
Phase 3 gives each hard plugin a v2 leg that uses only the hooks that the 2.0.32 types declare. Each leg is proven by a test that fails before the port. The sentinel and the spec gate each get a behaviour test. The `opencode-goal` port runs in three dispatches. The `sk-vision` source moves its command to `ctx.command.transform`, and its bundle is rebuilt. Seams leave the default exports for core modules, so each default export keeps the plain `{ id, setup, server }` shape.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (SC-001 to SC-003)
- [x] Dependencies identified in `spec.md` section 6

### Definition of Done
- [ ] All acceptance criteria met (`acceptance-criteria.md`)
- [ ] Each v2 case fails in `scratch/hard-before.txt` and passes in `scratch/hard-after.txt`
- [ ] The plugin suite is at or above the phase 2 floor, with zero failures
- [ ] `sk-vision` has a rebuilt `dist/plugin.js` and a load capture, or a blocker naming phase 1
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Write the tests first, then port one plugin per dispatch and check it before the next port. Each v2 leg uses the hooks that the `@opencode/plugin` 2.0.32 declarations name. The `opencode-goal` port splits into three dispatches, because its file is 143 KB.

### Key Components
- **`system-completion-sentinel` v2 leg**: subscribes to `session.idle` with `ctx.event.subscribe`, reads the assistant text from the event payload and keeps it in a map keyed by session ID. The map lives inside `setup`.
- **`system-spec-gate` v2 leg**: reads the prompt with `session.hook("prompt")`, injects the context with `session.hook("context")` and denies with `tool.hook("execute.before")`.
- **`system-skill-advisor` v2 leg**: reacts to the compaction event named in T002, injects with `session.hook("context")` and changes the tool list with `ctx.tool.transform`.
- **`opencode-goal` v2 leg**: enqueues prompts with `ctx.session.prompt({ sessionID, text, delivery: "queue" })`, and rebuilds the deadline and abort wrapper inside `setup`.
- **`sk-vision` command**: `ctx.command.transform` on v2, and the existing `command.execute.before` on v1. Both call the same handler in `src/opencode/`.
- **Core modules under `.opencode/plugins/lib/`**: one per seam that leaves a default export, so tests import the core module, not the plugin.

```js
export default {
  id: 'system-completion-sentinel',
  server: MkCompletionSentinelPlugin,
  setup(ctx) {
    // v2 leg: cache assistant text per session from session.idle
  }
}
```

The sketch shows the shape. Each plugin supplies its own `id` and its own `setup` body.

### Data Flow
On v1, the loader reads `server` and calls it with the v1 input, as in phase 2. On v2, the loader reads `setup` and calls it with the v2 context. The sentinel stores assistant text when the idle event arrives, and it reads that text when its own check runs. The `sk-vision` source builds into `dist/plugin.js`, and the `sk-vision.js` symlink in `.opencode/plugins/` points at that bundle.

### Affected Surfaces

This phase changes the export shape of five plugins, one bundle and the seams of four modules, so it carries the affected-surface inventory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Default exports of the five plugins | Bare functions, read as the v1 `server` entry | Wrap as `{ id, setup, server }` | The registration cases (T008, T017) |
| Seams: `__test` on `system-completion-sentinel.js:170`, `system-spec-gate.js:301` and `opencode-goal.js:3390` | The sentinel seam has four readers in its test. The spec gate seam has no test reader. The goal seam has readers in the export-contract test and in the render-parity test. | Move each seam to a core module, and point each reader at it | `grep -n '__test'` on the five entry modules prints nothing (T021) |
| Test calls to the default exports | `system-skill-advisor.test.cjs` makes 4 calls and 1 type check. The six goal test files make 58 calls. | Move each call to `.server`, and change each type check to the object shape | `grep -n 'default('` on the test files (T021) |
| Module stub `@opencode-ai/plugin/tool` in `system-skill-advisor.test.cjs:58` | Stubs the old import | Replace with the phase 2 helper import | The plugin suite (T018) |
| `tool` imports in `system-skill-advisor.js:24` and `opencode-goal.js:16` | Phase 2 left these two for this phase | Replace with `lib/tool-identity.js` | `grep -r '@opencode-ai/plugin/tool' .opencode/plugins/` (T021) |
| `sk-vision` command registration | `command.execute.before` in `src/plugin.ts`, which handles every host | Add `ctx.command.transform` on v2 and keep the v1 hook | The v2 active list and the command capture (T016) |
| `sk-vision.js` symlink | Points at the bundle that the build creates | Unchanged | The load check (T016) |
| Consumers of `sk-vision` source | `src/model-modality.test.ts` and the Python and runtime folders in the package | Unchanged unless the port changes them | The package test script, if it defines one (T015) |

Required inventories:
- Same-class producers: `rg -n "export default" .opencode/plugins/{system-completion-sentinel,system-spec-gate,system-skill-advisor,opencode-goal}.js`.
- Consumers of changed symbols: `rg -n "__test|\.default\(" .opencode/plugins/tests/`.
- Defensive null guards: `rg -n "return null" .opencode/plugins/{system-completion-sentinel,system-spec-gate,system-skill-advisor,opencode-goal}.js` lists each guard. Each guard the port touches is recorded in the implementation summary with its replacement.
- Matrix axes: host (v1, v2) by plugin (5) by check (load, registration case, behaviour case where one exists). Each cell has one capture.
- Algorithm invariant: the spec gate's deny is a deny on both hosts. The behaviour test asserts a blocked call, not only a loaded plugin.

### Scope of the Open Questions

Four decisions bind the work (T003). They are the class of `system-skill-advisor`, the seam homes, the `sk-vision` named export and the `sk-vision` pin. The work does not start until T003 records all four.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Ordered steps and dispatch

Dispatches run one at a time. Each dispatch sets `AI_SESSION_CHILD=1` in its environment, as the cli-devin and cli-codex contracts require. Each dispatch names its model and flags in full. Before any cli-codex or cli-devin prompt, the composing agent reads that CLI's `SKILL.md`.

| Step | Who runs it | How | Produces |
|------|-------------|-----|----------|
| S1 Setup (T001 to T005) | Orchestrator, with a DeepSeek desk check in T004 | Shell from the worktree root. T004 uses `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous`, writing only under `scratch/`. | The floor, the phase 1 verdicts, the four decisions, the v2 hook list and the `sk-vision` build status |
| S2 Tests before ports (T006 to T008) | Luna for T006 and T007. Orchestrator for T008. | `codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox workspace-write` | The v2 hard-plugin file and its failing baseline |
| S3 Ports (T009 to T012c) | Luna, one dispatch per port, in the task order. The goal port runs as three dispatches (T012a to T012c). | The same codex flags. After each port the orchestrator runs the hard-plugin file and the plugin suite. | The five ports and the seam moves |
| S4 Test updates (T013) | Luna | The same codex flags | The goal and skill advisor tests on `.server` |
| S5 sk-vision (T014 to T016) | Luna for the source (T014). Orchestrator for the build (T015) and the load check (T016). | Source edit by codex with `--sandbox workspace-write`. Then `bun run build` in `.skilled/skills/sk-vision/vision-runtime/`. | The rebuilt bundle, or the blocker |
| S6 Verify (T017 to T022) | Orchestrator | The commands in the verification checklist | The captures for AC-001 to AC-011 |
| S7 Review (T023) | DeepSeek V4.1 Flash max via cli-devin | `devin -p --model deepseek-v4-1-flash-max --permission-mode auto`, read-only | Findings first, with file and line citations |
| S8 Fix and rerun (T024) | Luna for fixes, orchestrator for the rerun | The same codex flags for the fixes. The orchestrator reruns T017 to T022. | The fixed tree and the new captures |
| S9 Close (T025) | Orchestrator | The strict validator and the scratch clean-up | The closure evidence |

Rollback for steps that change repo files: the tracked files return with `git checkout -- <path>`, and the new core modules and the new test file are removed by hand. The `sk-vision` `dist/` folder is gitignored. The rollback removes it only if this phase created it, and the rollback line is `rm -r .skilled/skills/sk-vision/vision-runtime/dist`. After a revert, the orchestrator reruns the phase 2 registration file to confirm that the mechanical plugins still load.

Verification by the orchestrator: the orchestrator reruns the hard-plugin file, the plugin suite, the v1 and v2 checks and the `sk-vision` build, and compares each output with its capture. A verdict stands only when the output matches.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The hard-plugin file (`v2-hard-plugins.test.cjs`), which holds the five registration cases and the behaviour cases. The plugin suite in `.opencode/plugins/tests/*.test.cjs`. | Node built-in test runner |
| Behaviour | The sentinel caches text on `session.idle`. The spec gate denies on `tool.hook("execute.before")`. The goal queues a prompt with `delivery: "queue"`. The skill advisor's transform changes the tool list. | Node built-in test runner, with a stub v2 context |
| Integration | v1 `opencode debug config </dev/null` and its load lines. v2 `opencode2 api GET /api/plugin` with the raw query. The `sk-vision` load on both versions. | `opencode` 1.19.3 and `opencode2` 2.0.32 |
| Build | `bun run build` in the `sk-vision` package, and its test script if the package defines one | Bun |
| Review | Findings-first review of the diff against `sk-code/sk-code-opencode`, with the v2 legs and the null guards in focus | DeepSeek through cli-devin, read-only |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 closed | Internal | Yellow until phase 2 closes. | The helper and the floor do not exist. |
| Phase 1 verdicts on Q5, Q6, Q7 and Q11 | Internal | Yellow until phase 1 closes. | The sentinel, skill advisor, goal and `sk-vision` ports wait. |
| `@opencode/plugin` 2.0.32 declarations | External package | Green once phase 2 installs it. | The v2 legs cannot be checked against the types. |
| `bun` and the `sk-vision` lock file | External tool | Yellow. The build depends on the lock file. | `dist/plugin.js` stays absent, and REQ-006 falls back to the blocker. |
| Orchestrator decisions in T003 | Internal | Yellow until T003 is recorded. | The ports wait (T009 to T016). |
| DeepSeek V4.1 Flash max via cli-devin | External model | Green. | The desk check and the review move to the orchestrator. |
| GPT-6 Luna max fast via cli-codex | External model | Yellow. The write sandbox blocks local sockets, so the orchestrator runs the tests. | The ports move to the orchestrator. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A port breaks a plugin on v1, the suite falls below the floor, a v2 case fails after its port, the `sk-vision` build fails, or a step stops, starts or restarts the v2 service.
- **Procedure**: Stop the dispatch. Run `git status --porcelain` and compare it with `scratch/status-before.txt`. Restore each changed tracked file with `git checkout -- <path>`. Delete the new core modules and the new test file. Remove the `sk-vision` `dist/` folder only if this phase created it. Rerun the phase 2 registration file, and confirm that `git status --porcelain` matches the snapshot.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Setup (S1) comes first, and the tests (S2) follow it. The ports (S3) follow the tests, and they run in order. The test updates (S4) and the `sk-vision` work (S5) follow the ports. Verification (S6) follows S5. The review (S7) comes next, then the fixes (S8) and the closure (S9).

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 2 closed, phase 1 verdicts | Tests, ports |
| Tests before ports | Setup | Ports |
| Ports | Tests before ports, T003 | Test updates, sk-vision |
| sk-vision | Setup, T003 | Verification |
| Verification | Ports, test updates, sk-vision | Review |
| Review | Verification | Fixes |
| Fixes | Review | Closure |
| Closure | Fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and tests | Medium | Not estimated. No timing evidence exists yet. |
| Ports and test updates | High | Not estimated. No timing evidence exists yet. |
| sk-vision | High | Not estimated. No timing evidence exists yet. |
| Verification and review | Medium | Not estimated. No timing evidence exists yet. |
| **Total** | High | **Not estimated. No timing evidence exists yet.** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `scratch/status-before.txt` holds the sorted `git status --porcelain` output from before any change
- [ ] `scratch/baseline-floor.txt` holds the phase 2 suite floor
- [ ] `scratch/hard-5.txt` holds the five plugin names, sorted
- [ ] No step calls `opencode2 service stop`, `opencode2 service start` or `opencode2 service restart`

### Rollback Procedure
1. Stop the dispatch that caused the problem.
2. Compare `git status --porcelain` with `scratch/status-before.txt`.
3. Restore each changed tracked file with `git checkout -- <path>`.
4. Delete the new core modules and the new test file.
5. Remove the `sk-vision` `dist/` folder only if this phase created it, and confirm that `git status --porcelain` matches the snapshot.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: The session rows written to a scratch `OPENCODE_DB` go away when the scratch folder is removed.
<!-- /ANCHOR:enhanced-rollback -->
