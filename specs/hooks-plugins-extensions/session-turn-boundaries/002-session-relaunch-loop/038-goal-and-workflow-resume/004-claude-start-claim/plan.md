---
title: "Implementation Plan: Phase 4: claude-start-claim"
description: "Move the Claude startup claim decision ahead of the per-runtime enable switch, keep the master and concern kill switches authoritative, and prove it with the start-claim test and the existing claim guards."
trigger_phrases:
  - "claude start claim plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: claude-start-claim

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ESM on Node.js |
| **Framework** | None, the Claude hook adapter is a standalone script |
| **Storage** | None |
| **Testing** | `node:test` with the existing adapter sandbox |

### Overview
The Claude start hook drops a startup payload before it reads it when the Claude enable switch is off. This plan moves the startup claim decision ahead of that switch, using the flag resolver's decision reason so the master switch and the concern kill switch still return early. It proves the change with a new failing-first test and the existing `compact-pointer` suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 003 handoff passed strict validation

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single hook branch.

### Key Components
- **`compact-pointer.mjs`**: the Claude SessionStart adapter. It owns the startup claim and the flag decision.
- **`hook-flags.cjs`**: the shared resolver. It reports which switch decided. Not changed.
- **`claude-adapters.test.cjs`**: the contract tests around the start claim and its guards. Changed.

### Data Flow
The wrapper exports `SKILLED_LOOP_CLAIM_SEED` when it swaps the start prompt for `/goal <slice>`. Claude sends a SessionStart payload with `source: startup`. The hook reads the flag decision, returns early for the master switch or the concern kill switch, and otherwise runs the startup claim. The claim path builds the lead, the seed and the nudge instructions, emits them as `additionalContext` and logs `goal-start-claim`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `compact-pointer.mjs` | Producer of the startup claim | update | New concern-off test plus the `compact-pointer` suite |
| `claude-adapters.test.cjs` | Consumer and contract test | update | `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` |
| `skilled-loop` wrapper | Producer of `SKILLED_LOOP_CLAIM_SEED` | unchanged | `rg -n 'SKILLED_LOOP_CLAIM_SEED' .skilled/bin/skilled-loop` |
| `hook-flags.cjs` | Policy that names the deciding switch | unchanged | `rg -n 'reason: "runtime"' .skilled/hooks/shared/hook-flags.cjs` |
| `.skilled/hooks/session-relaunch/README.md` | Documents the old switch rule | unchanged in this phase, phase 007 updates it | `rg -n 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` |

Required inventories:
- Finding class: `instance-only`, one branch in one adapter. The startup claim branch has no same-class producer in another runtime.
- Same-class producers: `rg -n 'isHookEnabled\(CONCERN' .skilled/hooks/session-relaunch/claude`.
- Consumers of changed symbols: `rg -n 'SKILLED_LOOP_CLAIM_SEED' .skilled --glob '*.mjs' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: runtime switch on or off, seed present or absent, source `startup` or another source.
- Algorithm invariant: N/A: the change moves one branch and adds no path, parser, redaction or resolver logic.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline `compact-pointer` tests and adds the failing concern-off test. Implementation moves the startup claim decision ahead of the runtime switch while the master and concern kill switches stay first. Verification runs the new test, the whole `compact-pointer` suite and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The flag decision and the startup claim branch in `compact-pointer.mjs` | `node:test` |
| Integration | The hook process with the sandbox env, a valid seed and a startup payload | `node:test` |
| Manual | N/A: the hook has no interactive surface of its own | None |

The failing-first command is `node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`. It must exit non-zero before the source change and 0 after it. The guard command is `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`. It must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js test runner | Internal | Green | The tests cannot run |
| Phase 003 handoff | Internal | Yellow | Phase 004 waits |
| Shared flag decision reason | Internal | Green | Compare the runtime flag directly while the master and kill checks stay first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the hook emits a claim while `SYSTEM_SESSION_RELAUNCH_DISABLED=1` or `SYSTEM_HOOKS_DISABLED=1`, or it still emits nothing when only the Claude enable switch is off.
- **Procedure**: revert the one local implementation commit on `worktrees/358-handover-goal-resume`. No data or config is migrated.
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
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
