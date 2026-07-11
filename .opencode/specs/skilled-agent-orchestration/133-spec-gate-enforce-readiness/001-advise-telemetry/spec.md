---
title: "Feature Specification: Spec-gate advise & would-deny telemetry [template:level_2/spec.md]"
description: "Add per-event advise/would-deny telemetry to the Spec Mutation Gate so the operator can measure the would-be-deny rate the enforce flip requires. Emit one structured, bounded, rotated log line per mutation event on both runtimes."
trigger_phrases:
  - "spec gate telemetry"
  - "would-deny rate"
  - "advise telemetry"
  - "enforce readiness measurement"
  - "gate-3 mutation log"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-spec-gate-enforce-readiness/001-advise-telemetry"
    last_updated_at: "2026-07-11T11:05:56.873Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level-2 spec for advise/would-deny telemetry"
    next_safe_action: "Implement the would-deny signal + shared formatter in spec-gate-core.mjs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/plugins/mk-spec-gate.js"
      - ".opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-advise-telemetry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Spec-gate advise & would-deny telemetry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `133-spec-gate-enforce-readiness/001-advise-telemetry` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 5 (FOUNDATION) |
| **Predecessor** | None |
| **Successor** | `002-trigger-turn-self-binding` |
| **Handoff Criteria** | Both runtimes emit one parseable telemetry line per open-gate mutation event; disabled writes nothing; existing spec-gate-core tests still green. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec Mutation Gate ships advise-only, and the operator wants to stage a flip to ENFORCE mode (`MK_SPEC_GATE_ENFORCE=1`). That decision needs exactly one number the system cannot currently produce: the would-be-deny rate, i.e. how often an open gate would block a real Write/Edit. Today the only advisory log line records the static `GATE_3_QUESTION` string with no session, tool, file path, or decision (`spec-gate-core.mjs:193`); the OpenCode plugin logs only on `advise` and never distinguishes a would-be-deny from an ordinary advise (`mk-spec-gate.js:239`); and the two Claude adapters write no file log at all (`spec-gate-classify.mjs`, `spec-gate-enforce.mjs`) — so no live telemetry has ever appeared.

### Purpose
Emit one structured, bounded, rotated telemetry line per mutation event on both runtimes so the operator can measure the would-be-deny rate before flipping enforce. Without per-event telemetry (session | tool | path | decision) there is no way to measure the would-be-deny rate the flip requires — this phase is the foundation the enforce-flip decision depends on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `evaluateMutation` to expose a would-deny signal (measurement-only; the deny predicate and the `decision`/`detail` return stay unchanged).
- Add a shared, exported `formatSpecGateEvent` formatter that produces one parseable line: `timestamp | runtime | sessionID | tool | filePath | decision`.
- OpenCode plugin: write the structured line (runtime `opencode`) on advise/would-deny through the bounded rotated log, never stdout/stderr.
- Claude enforce hook: add a real file log (runtime `claude`) on advise/would-deny instead of depending on PreToolUse `additionalContext` landing.
- Tests: format + sanitization, would-deny discriminator, disabled-writes-nothing, single-line parseability, byte-identical format across runtimes, rotation still bounded.

### Out of Scope
- Flipping `MK_SPEC_GATE_ENFORCE` — that is the operator's staging decision and depends on the number this phase produces.
- The three stuck-open close-path defects (trigger-turn self-binding, scaffolded-folder acceptance, headless/subagent scoping) — separate phases 002-004.
- Answer-grammar hardening — separate phase 005.
- Changing the deny predicate or widening `DENY_CAPABLE_TOOLS` — invariant; never widened beyond Write/Edit.
- Rebuilding `mcp_server/` dist or editing the shared `gate-3-classifier` — out of bounds.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` | Modify | Add a would-deny signal to `evaluateMutation`'s return; add exported `formatSpecGateEvent` formatter + field sanitizer; generalize `appendWarningLog` so the composed detail carries the decision (drop the hardcoded `ADVISE:` literal). |
| `.opencode/plugins/mk-spec-gate.js` | Modify | In `tool.execute.before`, compose + write the structured telemetry line (runtime `opencode`) on advise/would-deny; never stdout/stderr. |
| `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | Modify | Resolve `stateDir` and write the structured telemetry line (runtime `claude`) on advise/would-deny; stop relying on `additionalContext` landing. |
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs` | Modify | Add telemetry tests: format, would-deny discriminator, disabled writes nothing, single-line parseability, both-runtime identity, rotation bound. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One parseable telemetry line per mutation event carrying session, tool, path, and decision, on BOTH runtimes. | A source-file Write with an open gate produces exactly one line in `spec-gate-warnings.log` matching `<ISO> [mk-spec-gate] <runtime> | <sessionID> | <tool> | <filePath> | <decision>` on OpenCode and on Claude. |
| REQ-002 | Disabled kill-switch writes nothing. | With `MK_SPEC_GATE_DISABLED=1`, a source-file Write produces zero telemetry lines on both runtimes. |
| REQ-003 | The line distinguishes would-deny from advise. | In advise mode (enforce unset), a Write/Edit to a real non-exempt file under an open gate logs `decision=would-deny`; a Bash mutation logs `decision=advise`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Format is byte-identical across runtimes (one shared formatter). | `formatSpecGateEvent` returns identical output for identical inputs; the only field differing between OpenCode and Claude for the same event is the runtime token. |
| REQ-005 | The log stays bounded and rotated. | After structured lines exceed `MK_SPEC_GATE_WARNING_LOG_MAX_BYTES`, the log rotates to its `.1` backup exactly as before; no unbounded growth. |
| REQ-006 | One event equals one line even for a hostile filePath. | A filePath containing an embedded newline or pipe is sanitized to a single-line token; the log still parses as one event. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator can compute would-be-deny rate = count(`would-deny`) / count(all open-gate mutation events) from `spec-gate-warnings.log` across a real work window.
- **SC-002**: Both runtimes emit the identical line format; a single parser reads OpenCode and Claude logs.
- **SC-003**: All existing spec-gate-core tests stay green (`decision`/`detail` backward-compatible); the disabled and fail-open invariants are proven by new tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Telemetry changes the live advise path | Med | Additive only; `decision`/`detail` unchanged; would-deny is measurement-only and never causes a deny. |
| Risk | A logging error blocks a guarded mutation | High | `appendWarningLog` stays fail-open (swallows all errors, returns false, never throws); the would-deny computation cannot throw; logging never gates the decision. |
| Risk | Kill-switch leak | High | `MK_SPEC_GATE_DISABLED=1` stays a full no-op; both adapters short-circuit before any log; the core returns allow. |
| Risk | Deny predicate widened | High | `DENY_CAPABLE_TOOLS` stays `{write, edit}`; enforce stays opt-in + default-off; telemetry never widens deny. |
| Risk | OpenCode plugin writes stdout/stderr | High | Logging is a bounded file append, not console output; no `console.*` added; the static "core never writes console output" test stays green. |
| Dependency | Shared `gate-3-classifier` dist | Green | Unchanged; not rebuilt; no `mcp_server/` dist rebuild. |
| Dependency | Downstream phases 002-005 | Yellow | Foundation only; the enforce flip and the stuck-open fixes depend on this number but are out of scope here. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Telemetry adds one bounded `appendFileSync` per mutation event; negligible cost and never on the hot allow path (only advise/would-deny events log).
- **NFR-P02**: The log is bounded to `MK_SPEC_GATE_WARNING_LOG_MAX_BYTES` (default 256 KiB) with single-backup rotation via `maintainWarningLogPath`; no unbounded growth.

### Security
- **NFR-S01**: The line never echoes the classifier's matched-token arrays or `GATE_3_QUESTION` internals; it carries only session, tool, path, and decision plus timestamp and runtime.
- **NFR-S02**: `filePath` is sanitized (strip newline, carriage return, and pipe; clamp length) so a hostile path cannot inject an extra log line or break the parser.

### Reliability
- **NFR-R01**: Fail-open everywhere — any logging failure is swallowed; the guarded mutation proceeds untouched.
- **NFR-R02**: `MK_SPEC_GATE_DISABLED=1` yields zero telemetry; both adapters no-op before any log call.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty or missing `filePath` logs a placeholder token (`-`); the line still parses as one event.
- Maximum length: an over-length `filePath` is clamped; the line stays one row.
- Invalid format: an embedded pipe or newline in `filePath` is sanitized to a single-line token.

### Error Scenarios
- External service failure: an unwritable state dir makes `appendWarningLog` return false with no throw; the mutation proceeds.
- Network timeout: not applicable — logging is a local file append, no network.
- Concurrent access: `appendFileSync` is atomic per line; rotation is best-effort and fail-open.

### State Transitions
- Partial completion: gate open yields an advise/would-deny line; gate satisfied/skipped/never-opened yields allow with no line.
- Session expiry: a missing `sessionID` resolves to the `UNKNOWN_SESSION_ID` token; the line still parses.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four files (core + two adapters + test); two new core exports; additive changes. |
| Risk | 10/25 | Touches the live advise path but additive, fail-open, and the deny predicate is unchanged. |
| Research | 6/20 | The classifier crux is understood; the canonical line format is a design choice, not an investigation. |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the real-deny path (enforce on) also emit a `decision=deny` telemetry line for post-flip observability, or is advise/would-deny sufficient for the flip decision? Recommendation: log deny too, additively, since the formatter already supports it.
- Where should the would-be-deny-rate rollup live — a one-shot parser script or manual grep? Out of scope for this phase; note as a follow-up.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
