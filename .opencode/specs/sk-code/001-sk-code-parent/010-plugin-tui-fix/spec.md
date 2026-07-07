---
title: "Feature Specification: plugin TUI-overlay fix"
description: "Stop mk-dist-freshness-guard from writing stale-dist warnings to the OpenCode TUI stderr path; preserve the warn-only signal through system-context injection and an append-only operator log."
trigger_phrases:
  - "mk-dist-freshness-guard TUI overlay"
  - "opencode plugin no stdout stderr"
  - "plugin warning over chat input"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/001-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/010-plugin-tui-fix"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled strict Level 2 docs for the shipped plugin TUI-overlay fix"
    next_safe_action: "Use the completed phase docs as validation evidence for parent close-out"
---
# Feature Specification: plugin TUI-overlay fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-04 |
| **Branch** | `sk-code/001-sk-code-parent` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `.opencode/plugins/mk-dist-freshness-guard.js` plugin emitted stale-dist warnings with `console.warn` and `console.error` during `tool.execute.before` for risky `opencode run` / `validate.sh` commands and once per session during `session.created`. OpenCode's TUI rendered those process stderr writes over the chat input, leaving a warning overlay across the interactive prompt. There was no environment kill-switch.

### Purpose
Preserve the stale-dist safety signal without writing to the OpenCode TUI stdout/stderr path. The plugin must keep warn-only, fail-open behavior while delivering agent-visible guidance through bounded system-context injection and durable operator evidence through an append-only log.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rechannel all plugin `console.*` emissions to `experimental.chat.system.transform` and an append-only freshness-guard log.
- Preserve the single default export, session dedupe, warn-only semantics, and never-throw behavior.
- Retarget the plugin test suite from console capture to transform output and log-line assertions.
- Update consumer-facing documentation for the plugin and related bin README.
- Add the durable sk-code OpenCode rule that plugins must not write to the TUI process stdout/stderr.

### Out of Scope
- Changing the freshness detection algorithm.
- Changing the watched package set.
- Adding a hard-fail freshness gate.
- Adding or changing an environment kill-switch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-dist-freshness-guard.js` | Modify | Rechannel stale-dist warnings away from process stdout/stderr |
| `.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs` | Modify | Assert transform output, log deltas, dedupe, and malformed-argument fail-open behavior |
| `.opencode/plugins/README.md` | Modify | Document the system-context and log channels |
| `.opencode/bin/README.md` | Modify | Update consumer list/channel wording |
| `.opencode/skills/sk-code/.../quality_standards.md` | Modify | Add durable no-TUI-overlay rule for OpenCode plugins |
| `.opencode/skills/sk-code/.../javascript_checklist.md` | Modify | Add matching P0 checklist coverage for plugin output channels |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Plugin must not write stale-dist warnings to stdout/stderr | Trapped-console test records zero `console.warn`, `console.error`, and `console.log` calls |
| REQ-002 | Agent still receives stale-dist guidance | `experimental.chat.system.transform` injects a bounded one-line system-context warning with the rebuild command |
| REQ-003 | Operator record remains durable | Freshness warnings append to the guard log instead of terminal stderr |
| REQ-004 | Existing safety behavior is preserved | Plugin keeps warn-only fail-open semantics, never throws, preserves session dedupe, and retains one default export |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Regression tests cover the shipped behavior | Plugin test suite preserves the seven behavioral cases: stale warning, fresh silence, dedupe, malformed args never throw, transform output, log output, and zero console writes |
| REQ-006 | Consumer docs describe the new channels | `.opencode/plugins/README.md` and `.opencode/bin/README.md` describe injection/log behavior and no TUI stdout/stderr writes |
| REQ-007 | sk-code records the durable plugin-output rule | OpenCode plugin guidance states user/agent-visible output must use system-context injection, tools, or log files; DEBUG-gated stderr is allowed only behind an env flag |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/plugins/tests/mk-dist-freshness-guard.test.cjs` passes.
- **SC-002**: Live smoke confirms `validate.sh` executed through `bash` produces zero plugin TUI writes.
- **SC-003**: The stale-dist signal remains available to the agent through bounded system-context injection and to the operator through the append-only log.
- **SC-004**: The shipped fix is recorded in commit evidence: remote `711b019eb1`, local `42677fac58`.

### Acceptance Scenarios

- **Scenario 1**: **Given** stale dist is detected during a risky command, **when** the plugin runs, **then** it injects one bounded system-context warning and appends one log line without calling `console.*`.
- **Scenario 2**: **Given** packages are fresh, **when** the plugin runs, **then** no warning is injected and no terminal write occurs.
- **Scenario 3**: **Given** malformed tool arguments or logging failures, **when** the plugin runs, **then** it fails open and never throws.
- **Scenario 4**: **Given** a session has already received the warning, **when** the plugin runs again in the same dedupe window, **then** duplicate user-visible warnings are suppressed.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode plugin `experimental.chat.system.transform` | Agent-visible warnings depend on the system-context transform path | Reuse the proven pattern from existing OpenCode plugins |
| Dependency | Append-only log path | Operator evidence depends on file append succeeding | Keep log writes fail-open so plugin execution never blocks the session |
| Risk | Reintroducing terminal writes in future plugins | TUI overlay could return | Record durable rule in sk-code OpenCode guidance and checklist |
| Risk | Warning spam | Repeated stale-dist notices could distract the agent | Preserve session dedupe and bounded one-line injection |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The plugin remains lightweight and uses the existing session dedupe/caching behavior to avoid repeated noisy warnings.

### Security
- **NFR-S01**: The log and system-context warning contain no secrets.
- **NFR-S02**: DEBUG-gated stderr remains the only permitted terminal diagnostic path for future plugin debugging.

### Reliability
- **NFR-R01**: The plugin never throws on malformed input or logging errors.
- **NFR-R02**: The single default export remains intact so OpenCode can load the plugin consistently.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty or malformed `tool.execute.before` arguments must not throw.
- Fresh package state must produce no warning.
- Stale package state must produce one bounded warning rather than repeated terminal output.

### Error Scenarios
- Log append failures are fail-open.
- Transform-state issues are fail-open.
- Unexpected command argument shapes do not block tool execution.

### Concurrent Operations
- Session dedupe prevents repeated warnings within the same session.
- Append-only logging tolerates repeated guard observations without writing to the TUI channel.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Focused plugin/test/docs/rule fix |
| Risk | 14/25 | TUI-output regression risk and plugin loader constraints |
| Research | 8/20 | Reused existing system-context transform pattern from sibling plugins |
| **Total** | **34/70** | **Level 2** because the focused fix required QA validation |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
