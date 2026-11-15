---
title: "Feature Specification: Phase 4: claude-window-unknown"
description: "With no configured Claude window, the nudge measures fill against a guessed 200,000-token default and hands over too often. This phase makes the window unknown, skips and logs the nudge, adds the doctor hint and corrects the README switch row."
trigger_phrases:
  - "claude window unknown"
  - "phase 4 claude window unknown"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: claude-window-unknown

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-launch-flag-replay |
| **Successor** | 005-subagent-guard-cancel-consume |
| **Handoff Criteria** | `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with a case where no setting and no marker yields no window and no nudge. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Remediate the eight findings of the in-session handover review of the session relaunch loop specification.

**Scope Boundary**: The Claude window fallback, its nudge caller, the doctor hint and one README row. The Codex, Pi and OpenCode window paths are not changed.

**Dependencies**:
- None.

**Deliverables**:
- An unknown-window result, a skipped and logged nudge, a doctor hint, a corrected README row and tests that fail today.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a Claude checkout has neither `SESSION_RELAUNCH_WINDOW_TOKENS` nor `autoCompactWindow`, `resolveWindow` at `.skilled/hooks/session-relaunch/lib/context-usage.cjs:356` returns the 200,000-token default instead of reporting an unknown window. The Claude nudge then reports 80% full at 160,000 tokens, about a third of the 464,850 tokens recent sessions held, so those sessions hand over several times too often and reach the ten-hop cap early.

### Purpose
Make an unconfigured Claude window unknown, skip the nudge with a logged reason and name the missing setting, so no session hands over against a guessed window.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n 'LARGE_WINDOW_MARKER|DEFAULT_WINDOW_TOKENS|SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/lib/context-usage.cjs
24:const LARGE_WINDOW_MARKER = '[1m]';
26:const DEFAULT_WINDOW_TOKENS = 200000;
308:  return positiveNumber(env?.SESSION_RELAUNCH_WINDOW_TOKENS)
340:  const fromEnvironment = positiveNumber(env.SESSION_RELAUNCH_WINDOW_TOKENS);
356:  return String(model).includes(LARGE_WINDOW_MARKER)
358:    : DEFAULT_WINDOW_TOKENS;
```

Line 356 is the fallback this phase removes for a model whose id carries no `[1m]` marker. A configured environment value or `autoCompactWindow` still returns a number, and the marker still declares one million tokens.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Return no window from `resolveWindow` when the environment, the Claude settings files and the `[1m]` marker supply none.
- Skip the Claude nudge and log `context-nudge-skipped` with `reason=window-unknown` when the window is unknown.
- Name the missing Claude window setting from `/doctor:setup`.
- Mark `SESSION_RELAUNCH_WINDOW_TOKENS` environment-only in the README switch table.
- Add tests that fail before the fix for the unknown window and the skipped nudge.

### Out of Scope
- The Codex, Pi and OpenCode window paths, because they take the window from their runtime and finding 4 does not change them.
- Changes to `autoCompactWindow`, `autoCompactEnabled` or auto-compaction behavior, because auto-compaction stays the fallback.
- Reading `SESSION_RELAUNCH_WINDOW_TOKENS` from `.skilled/hooks/hook-flags.env`, because finding 8 accepts the environment-only README row instead.
- Other window documentation such as `.env.example` and `ENV-REFERENCE.md`, because finding 8 names one README row.
- The relaunch record format and the hop cap, because the phase changes neither.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/session-relaunch/lib/context-usage.cjs | Modify | Return `null` when no setting or marker supplies a window |
| .skilled/hooks/session-relaunch/claude/context-nudge.mjs | Modify | Skip and log the nudge when the window is unknown |
| .skilled/hooks/session-relaunch/README.md | Modify | Mark the window switch environment-only and describe the unknown case |

The failing-first tests live in `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` and `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`. `/doctor:setup` is a workflow, not a script: `.skilled/commands/doctor/assets/doctor-setup.yaml` already runs `session-relaunch.cjs history --last 1` as an informational line. The hint is a new `window` command in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`, shown by one more informational step in that workflow, with its line in `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` and one sentence in `.skilled/commands/doctor/setup.md`. Its case lives in `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With no `SESSION_RELAUNCH_WINDOW_TOKENS`, no `autoCompactWindow` and no `[1m]` marker, `resolveWindow` returns `null`. Verify: `node --test --test-name-pattern 'no setting and no model marker' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0. |
| REQ-002 | With an unknown window, the Claude nudge emits no context and writes `context-nudge-skipped` with `reason=window-unknown` to `relaunch.log`. Verify: `node --test --test-name-pattern 'window is unknown' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0. |
| REQ-003 | The two named test files exit 0 together and carry the no-setting/no-marker and skipped-nudge cases. Verify: `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `/doctor:setup` prints a line that names `SESSION_RELAUNCH_WINDOW_TOKENS` or `autoCompactWindow` when the Claude window is unknown. Verify: with no window configured, `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs window` prints one line naming both settings, and `rg -c 'session-relaunch.cjs window' .skilled/commands/doctor/assets/doctor-setup.yaml` prints 1. |
| REQ-005 | The `SESSION_RELAUNCH_WINDOW_TOKENS` README row states that the value is read from the environment only. Verify: `rg -n 'SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/README.md` prints one row containing `environment only`. |
| REQ-006 | The unknown-window skip is logged once per session, so a hook that runs on every tool call does not grow `relaunch.log`. Verify: `node --test --test-name-pattern 'once per session' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0. |
| REQ-007 | `session-relaunch.cjs window` rejects any argument with exit 2 like the other commands, and its unconfigured line says `none configured` instead of calling the window unknown. Verify: `node --test --test-name-pattern 'window rejects an argument' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0 and the no-setting/no-marker case returns no window.
- **SC-002**: `node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 and the unknown-window case emits no nudge and logs `context-nudge-skipped`.
- **SC-003**: `rg -n 'SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/README.md` prints the row with `environment only`.
- **SC-004**: `/doctor:setup` prints a line naming `SESSION_RELAUNCH_WINDOW_TOKENS` or `autoCompactWindow` when no window is configured.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `node` with the built-in test runner | The proof commands cannot run | Use the repository Node binary and run the two named test files |
| Risk | A `[1m]` model still gets a window while any other model skips the nudge | Med | Keep the marker case tested and document that only an explicit setting or the marker supplies a window |
| Risk | The unknown-window skip hides a nudge an operator expected | Med | Log `reason=window-unknown`, name the setting in `/doctor:setup` and keep auto-compaction as the fallback |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: The change adds one null check before `fillRatio` and runs no service or request path.
- **NFR-P02**: N/A: No throughput target applies to a local hook.

### Security
- **NFR-S01**: N/A: The change reads no credential and adds no auth path.
- **NFR-S02**: N/A: No data store or transport changes.

### Reliability
- **NFR-R01**: N/A: No uptime target applies to a local hook.
- **NFR-R02**: N/A: The nudge still exits 0 on every path, proven by the claude-adapters suite.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: No environment value, no settings file, an empty model id and no marker return `null` and the nudge stays silent.
- Maximum input: A transcript at 464,850 tokens with an unknown window emits no nudge and logs the skip instead of firing at 160,000 tokens.
- Failure path: An unreadable settings file is treated as absent, and if no other source supplies a window the result is `null` and the nudge logs `reason=window-unknown`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three production or docs files, two test files and one README row |
| Risk | 6/25 | No auth, API, schema or record-format change. One behavior trade-off |
| Research | 4/20 | The resolver, caller and tests are known. The doctor check file is open |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The doctor question was answered by reading the workflow: `.skilled/commands/doctor/assets/doctor-setup.yaml` owns the informational lines.
<!-- /ANCHOR:questions -->

---
