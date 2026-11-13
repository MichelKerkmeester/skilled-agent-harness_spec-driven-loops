---
title: "Implementation Plan: Phase 11: permission-mode-carry"
description: "Carry Claude's live permission mode across a hop: the Stop arm stamps it, the core keeps it, consume prints it and the wrapper replays it as --permission-mode. Two live checks against Claude come first, and every source change is test first."
trigger_phrases:
  - "permission mode carry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: permission-mode-carry

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM adapter, CommonJS core and CLI) and bash (the `skilled-loop` wrapper) |
| **Framework** | None, Node built-in modules |
| **Storage** | The JSON relaunch record in the relaunch state directory |
| **Testing** | `node:test` with `node:assert/strict`, and the wrapper harness that stubs the runtime |

### Overview
The mode travels the same road the live model already uses: Stop payload, `arm` settings, record, `consume`, wrapper. Two live checks against Claude 2.1.323 settle the default-mode spelling and the bypass rule first, and the operator settles the plan-mode question. Each of the four source edits follows a failing test, and the proof is the five test files plus one strict validation run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The operator gave the greenlight to build
- [ ] The operator answered the plan-mode question in `spec.md` section 10
- [ ] The five test files pass at baseline: 155, 158, 67, 54 and 45 tests, each `fail 0`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`
- [ ] `bash -n .skilled/bin/skilled-loop` exits 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Record-carried live setting.

### Key Components
- **`claude/stop-arm.mjs`**: reads `payload.permission_mode` and passes it to `arm` at `:152`. Without it the live mode never reaches the record.
- **`lib/relaunch-core.cjs` `armLocked`**: copies the non-empty key onto the armed record with the other live settings at `:1011-1012`.
- **`bin/session-relaunch.cjs` `consume`**: prints the key beside model, provider and effort at `:793-795`.
- **`.skilled/bin/skilled-loop`**: captures the launch mode, accepts or rejects the live one, and appends `--permission-mode` in the Claude branch at `:609-619`, for the hop at `:1252-1272` and for the manual command at `:256-308`.

### Data Flow
Claude Stop payload `permission_mode` goes to `arm({ settings: { permissionMode } })`, which writes `permissionMode` on the armed record. The wrapper runs `consume`, reads `permissionMode` with `consumed_field`, checks it against the accepted set and the plan and bypass rules, sets `SKILLED_LOOP_PERMISSION_MODE`, and the Claude branch appends `--permission-mode` before the seed. A rejected value leaves the launch value, captured at launch, in place.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claude/stop-arm.mjs` | Producer of the Claude arm, with no settings at `:152` | update | `stop-arm stamps the payload permission mode on the armed record` |
| `lib/relaunch-core.cjs` `armLocked` | Owner of the record's live settings at `:1011` | update | `arm keeps a live permission mode and a later arm without one keeps it` |
| `bin/session-relaunch.cjs` `consume` | Consumer of the record, printer for the wrapper at `:793` | update | `consume reports the permission mode the record holds` |
| `.skilled/bin/skilled-loop` | Consumer of `consume` and builder of the relaunch line | update | the wrapper tests in `skilled-loop-wrapper-model-effort.test.cjs` |
| `codex/stop-arm.mjs:121` | Codex arm with no settings | unchanged, out of scope | `rg -n "permissionMode" .skilled/hooks/session-relaunch/codex` prints nothing |
| `pi/session-relaunch.ts:458` and `.opencode/plugins/session-relaunch.js:433` | Other arm callers | not a consumer, they pass no `permissionMode` | their suites are not edited |
| `.skilled/hooks/session-relaunch/README.md` | Documentation | unchanged here, phase 017 documents it | phase 017's own criteria |

Required inventories:
- Same-class producers: `rg -n "arm\(\{" .skilled/hooks/session-relaunch .opencode/plugins/session-relaunch.js --glob '!tests/**'` lists four arm callers. Only the Claude one changes.
- Consumers of the new key: `rg -n "permissionMode" .skilled .opencode/plugins --glob '!node_modules'` lists only the files in the Files to Change table after the build.
- Matrix axes: live mode (none, each of the six help choices, the default spelling, an unknown value) by launch mode (none, `manual`, `plan`) by launch unlocking flag (none, `--dangerously-skip-permissions`, `--allow-dangerously-skip-permissions`). The wrapper tests cover one row per rule: plain replay, unknown value, live `plan`, live bypass with no unlocking flag, no live mode, and the manual command.
- Algorithm invariant: the hop line holds at most one `--permission-mode`, its value is in the accepted set, and the wrapper adds no unlocking flag the launch line lacked.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup runs the two live Claude checks into `scratch/live-checks.md`, records the operator's plan-mode answer and the baseline counts. Implementation writes each failing test, then the stop-arm, core, consume and wrapper edits in that order. Verification runs the five test files in full, `bash -n` on the wrapper and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `armLocked` key copy and `armPendingRecord` settings | `node:test` in `relaunch-core.test.cjs` and `claude-adapters.test.cjs` |
| Integration | `consume` output, and the wrapper hop and manual command through the stubbed runtime | `node:test` in `session-relaunch-cli.test.cjs`, `skilled-loop-wrapper-model-effort.test.cjs` and `skilled-loop-wrapper-launch-arguments.test.cjs` |
| Manual | The two live facts from Claude 2.1.323, captured by a Stop hook given through `--settings` in a scratch directory | `claude -p` |

Each test is run once failing before its source edit, with the output kept in `scratch/red.txt`, and once passing after, in `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude Code 2.1.323 on PATH | External | Green, `claude --version` printed it | The default spelling and the bypass rule stay inferred, so T005 to T014 wait |
| Operator answer on live `plan` | Internal | Yellow, open | The plan-mode test in T012 and its branch in T014 wait, the rest can be built |
| Phases 012 and 014 not started | Internal | Green, both are planned only | Parallel edits to `skilled-loop` and `claude/stop-arm.mjs` would conflict |
| `node:test` and `rg` | Internal | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hop ends at a Claude usage error on `--permission-mode`, or starts with a permission the sender did not hold.
- **Procedure**: Revert the one commit that lands this phase. The record key is additive, so an old wrapper ignores it, and the next hop runs on today's arguments.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The operator's greenlight and Claude 2.1.323 | Implementation |
| Implementation | The two live facts and the operator's plan-mode answer | Verification |
| Verification | Every implementation task | Phases 012 and 014 |
<!-- /ANCHOR:phase-deps -->

---
