---
title: "Implementation Plan: plugin TUI-overlay fix"
description: "Level 2 plan for the already-shipped mk-dist-freshness-guard TUI-output fix."
trigger_phrases:
  - "mk-dist-freshness-guard plan"
  - "plugin TUI overlay fix plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/010-plugin-tui-fix"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled strict Level 2 plan for the shipped plugin TUI-overlay fix"
    next_safe_action: "Use the completed phase docs as validation evidence for parent close-out"
---
# Implementation Plan: plugin TUI-overlay fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript CommonJS OpenCode plugin, Markdown documentation |
| **Framework** | OpenCode plugin lifecycle hooks and `experimental.chat.system.transform` |
| **Storage** | Append-only local guard log |
| **Testing** | Node plugin test suite and live smoke through `bash validate.sh` |

### Overview
This already-shipped phase removes terminal-output writes from `mk-dist-freshness-guard` while preserving the stale-dist signal. The plan is to route the warning to agent-visible system context, append a durable operator log line, retarget tests to those channels, and document the durable sk-code rule for future OpenCode plugins.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Existing plugin behavior and TUI symptom identified.
- [x] Proven system-context injection pattern identified from sibling plugins.
- [x] Verification expectations defined for tests and live smoke.

### Definition of Done
- [x] Plugin emits zero `console.*` warning/error/log writes for the stale-dist guard path.
- [x] Stale warnings reach the agent through bounded system-context injection.
- [x] Operator evidence is appended to a log file.
- [x] Plugin test suite passes.
- [x] Live smoke confirms zero TUI writes during `validate.sh` via `bash`.
- [x] Documentation and sk-code durable rule are updated.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
OpenCode plugin output routing: user/agent-visible messages use system-context injection, operator records use log files, and process stdout/stderr stays silent unless explicitly DEBUG-gated.

### Key Components
- **Plugin hook path**: `tool.execute.before` watches risky commands and `session.created` handles once-per-session freshness signal setup.
- **System-context transform**: injects a bounded one-line warning so the agent still sees the stale-dist rebuild command.
- **Append-only log**: records warnings for operator inspection without touching the TUI process stderr stream.
- **Regression tests**: trap console calls and assert transform/log behavior, dedupe, freshness silence, and malformed-input fail-open behavior.
- **sk-code rule**: makes the no-TUI-output constraint durable for future OpenCode plugin work.

### Data Flow
1. Plugin observes a risky command or session-created event.
2. Freshness guard determines whether a stale-dist warning is needed.
3. If stale, the plugin appends an operator log line and stores a bounded message for `experimental.chat.system.transform`.
4. The agent sees the warning in system context rather than terminal stderr.
5. Dedupe prevents repeat warnings in the same session.
6. Tests verify zero `console.*` calls across the covered behaviors.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify the TUI overlay source as plugin `console.warn` / `console.error` writes.
- [x] Confirm the stale-dist signal should remain warn-only and fail-open.
- [x] Select the existing system-context transform pattern used by sibling plugins.

### Phase 2: Core Implementation
- [x] Rechannel all three console emission paths to system-context injection and append-only logging.
- [x] Preserve single default export, session dedupe, and never-throw semantics.
- [x] Retarget plugin tests from console capture to transform output plus log file assertions.
- [x] Update consumer docs and sk-code OpenCode guidance/checklist.

### Phase 3: Verification
- [x] Run the plugin test suite.
- [x] Run live smoke for `validate.sh` through `bash` and confirm zero TUI writes.
- [x] Record shipped commit evidence: remote `711b019eb1`, local `42677fac58`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/regression | Plugin warning channels, dedupe, fresh silence, malformed args | `node .opencode/plugins/tests/mk-dist-freshness-guard.test.cjs` |
| Live smoke | TUI-output silence while `validate.sh` runs through `bash` | OpenCode runtime observation with command execution |
| Documentation validation | Phase Level-2 docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/124-sk-code-parent/010-plugin-tui-fix --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `experimental.chat.system.transform` | Internal OpenCode plugin API | Green | Agent-visible warning channel unavailable |
| Append-only local log | Local filesystem | Green | Operator record unavailable; plugin still fails open |
| Existing plugin test suite | Internal test coverage | Green | Regression proof unavailable |
| sk-code OpenCode rule docs | Internal guidance | Green | Durable prevention rule unavailable |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The plugin no longer surfaces stale-dist guidance to the agent, throws during command execution, or reintroduces terminal writes.
- **Procedure**: Revert the shipped fix commits from remote `711b019eb1` / local `42677fac58`, then reapply only the smallest passing channel fix and rerun the plugin suite plus live smoke.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Parent packet close-out |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Medium | 2-3 hours |
| Verification | Medium | 1 hour |
| **Total** | | **3.5-4.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Existing plugin loader contract preserved.
- [x] Single default export preserved.
- [x] Warn-only fail-open behavior preserved.
- [x] Plugin test suite green before shipping.

### Rollback Procedure
1. Revert the shipped plugin/test/docs/rule changes from remote `711b019eb1` or local `42677fac58` if the fix regresses.
2. Re-run `node .opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`.
3. Re-run the live smoke that executes `validate.sh` through `bash` and observe zero TUI writes before re-shipping.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; the only durable data is append-only warning log evidence.

<!-- /ANCHOR:enhanced-rollback -->
