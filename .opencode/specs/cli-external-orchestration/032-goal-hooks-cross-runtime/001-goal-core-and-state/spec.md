---
title: "Feature Specification: Runtime-neutral goal core + shared active-goal state + manage CLI"
description: "Build a runtime-neutral goal core (.opencode/hooks/goal/) that reads/writes a shared active-goal.json state file, renders an mk-goal-compatible [active_goal] injection block with a parameterized Role line, ports the prompt-injection hardening and heuristic verifier, and exposes a manage CLI mirroring /goal:goal-opencode's router contract for runtimes without plugin tools."
trigger_phrases:
  - "goal core and state"
  - "shared active goal state"
  - "goal manage cli"
  - "goal-core.cjs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/001-goal-core-and-state"
    last_updated_at: "2026-07-28T17:38:00Z"
    last_updated_by: "claude"
    recent_action: "Build goal core, CLI and tests; 27/27 pass"
    next_safe_action: "Run capability probes for phase 002"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/hooks/goal/bin/goal.cjs"
      - ".opencode/hooks/goal/lib/goal-core.test.cjs"
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal/goal-opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope: runtime-neutral core + shared state + manage CLI only; per-runtime adapters are 003/004/005."
      - "State model: one shared active-goal.json file for non-OpenCode runtimes, mk-goal's per-session state untouched."
      - "Token accounting: no native token feeds outside OpenCode exist; usageSource must be recorded honestly (e.g. turn-count-estimate), never fabricated."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Runtime-neutral goal core + shared active-goal state + manage CLI

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/v4.0.0.0` (direct, per operator choice) |
| **Authority** | `cli-external-orchestration`; new concern `.opencode/hooks/goal/` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | None (first phase) |
| **Successor** | `002-capability-probes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

OpenCode sessions carry a passive session-goal system: `mk-goal.js` injects an `[active_goal:<goalId>]…[/active_goal]` block every turn via `experimental.chat.system.transform`, and `/goal:goal-opencode` is the manage surface. That implementation is entirely OpenCode-specific — its state lives per-session at `.opencode/skills/.goal-state/<hex-session-id>.json`, its Role line hardcodes "OpenCode execution agent", and its verify/auto-continue logic depends on OpenCode-only lifecycle events (`session.idle`, `message.updated`). Before a goal can be surfaced in Devin, Cursor, or Pi sessions (phases 003-005), a runtime-neutral core and a shared state file must exist for those adapters to call into.

### Purpose

Extract the portable parts of `mk-goal.js` — prompt-injection hardening, the heuristic verifier, and the `[active_goal]` block renderer — into a new `.opencode/hooks/goal/` concern that reads and writes one shared `active-goal.json` state file (not per-OpenCode-session), with the Role line parameterized per runtime instead of hardcoded. Pair it with a manage CLI (`set/show/history/clear/complete/pause/resume/doctor`) that mirrors `/goal:goal-opencode`'s router contract byte-for-byte in envelope shape, so later behavior benchmarks can compare the two surfaces directly. This phase delivers the core and CLI only; per-runtime injection adapters are out of scope (phases 003-005).

### User Story 1: Portable goal core

As the implementer of phases 003-005, I need a runtime-neutral module that renders the exact `[active_goal]` block shape mk-goal produces (Role line aside) and applies the same input-hardening and verification logic, so each per-runtime adapter only has to wire the hook surface, not reimplement the goal logic.

### User Story 2: Manage CLI parity

As an operator working in Devin, Cursor, or Pi (runtimes without an OpenCode-style plugin tool surface), I need a CLI that sets, shows, and manages a goal with the same action set, `--budget` parsing, and error codes as `/goal:goal-opencode`, so goal behavior is comparable across runtimes and later benchmarks are apples-to-apples.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/hooks/goal/lib/goal-core.cjs`: read/write the shared `.opencode/skills/.goal-state/active-goal.json` file with atomic temp+rename writes and `0600` permissions (same hygiene as `mk-goal.js`'s per-session state writes).
- `[active_goal]` block renderer: verbatim-compatible with `mk-goal.js`'s RICCE `goalPrompt` template, with the Role line parameterized per runtime (e.g. `"Focused <Runtime> execution agent…"` instead of the hardcoded `"OpenCode execution agent"`).
- Ported `normalizeUserAuthoredText` hardening (NFKC normalization, bidi/zero-width stripping, marker redaction, homoglyph folding) and the heuristic verifier, both carried over from `mk-goal.js` with attribution.
- Turn/wall-clock accounting primitives (turn counters, elapsed wall-clock time). No native token-usage feed exists outside OpenCode; any recorded usage field must set `usageSource` honestly (e.g. `"turn-count-estimate"`), never a fabricated token count.
- `.opencode/hooks/goal/bin/goal.cjs` (or `lib/goal-cli.cjs`): manage CLI with actions `set/show/history/clear/complete/pause/resume/doctor`, mirroring `/goal:goal-opencode`'s router contract — same `STATUS=… ACTION=…` output envelope, same `--budget` flag parsing, same error codes (`INVALID_TOKEN_BUDGET`, `INVALID_OBJECTIVE`, `PLUGIN_DISABLED`).
- Co-located `node --test` suite for `goal-core.cjs` and the manage CLI, placed beside the code under test per repo convention.

### Out of Scope

- Any per-runtime hook wiring or adapter (Devin/Cursor/Pi injection, restore, verify hooks) — phases 003, 004, 005.
- Live capability probes for verify/continue support per runtime — phase 002 (this phase's manage CLI's `verify`/`complete` actions operate on the shared state only, independent of any runtime event).
- Any change to `mk-goal.js` itself or to its per-OpenCode-session state files under `.opencode/skills/.goal-state/<hex-session-id>.json` — both stay untouched.
- Any change to `/goal:goal-opencode`'s own command contract — it remains the OpenCode manage surface; this CLI is a separate, parallel surface for other runtimes.

### Surfaces Changed

| Surface | Change Type | Description |
|---------|-------------|-------------|
| `.opencode/hooks/goal/` (new) | Added | New concern: `lib/goal-core.cjs`, `bin/goal.cjs` (or `lib/goal-cli.cjs`), co-located tests. |
| `.opencode/skills/.goal-state/active-goal.json` (new) | Added | Shared cross-runtime goal state file, separate from mk-goal's per-session files. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `goal-core.cjs` reads/writes the shared state file atomically. | Writes use temp-file-then-rename; file mode is `0600`; a unit test simulating a crash mid-write leaves the prior state file intact. |
| REQ-002 | The rendered `[active_goal]` block is byte-compatible with `mk-goal.js`'s template except for the parameterized Role line. | A test diffs the rendered block against a captured mk-goal.js reference render (same goal fields) and asserts equality outside the Role line. |
| REQ-003 | `usageSource` is recorded honestly; no token count is fabricated outside OpenCode. | Turn/wall-clock accounting sets `usageSource: "turn-count-estimate"` (or equivalent honest label); no field claims a real token count when none is available. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The manage CLI's action set, `--budget` parsing, and error codes mirror `/goal:goal-opencode`'s router contract. | A parity test table runs each CLI action against the same input shapes documented in `goal-opencode.md`'s router contract and confirms matching `STATUS=…`/`ACTION=…` envelopes and error codes (`INVALID_TOKEN_BUDGET`, `INVALID_OBJECTIVE`, `PLUGIN_DISABLED`). |
| REQ-005 | `normalizeUserAuthoredText` hardening is ported with equivalent coverage to `mk-goal.js`'s. | Unit tests cover NFKC normalization, bidi/zero-width stripping, marker redaction, and homoglyph folding, each with a case adapted from `mk-goal.js`'s own test suite. |
| REQ-006 | The heuristic verifier is ported with equivalent coverage. | Unit tests cover the same pass/fail heuristic cases as `mk-goal.js`'s verifier tests, adapted to the shared-state shape. |
| REQ-007 | mk-goal.js and OpenCode's per-session state/command remain untouched. | `git diff` for this phase shows zero changes under `.opencode/plugins/mk-goal.js` or `.opencode/commands/goal/goal-opencode.md`. |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | `goal.cjs doctor` reports shared-state file health (exists, valid JSON, mode `0600`). | Running `doctor` against a healthy state file reports OK; against a missing or malformed file reports a specific diagnosis. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `goal-core.cjs`'s own `node --test` suite passes, covering atomic-write hygiene, block rendering, hardening, and the heuristic verifier.
- **SC-002**: The rendered `[active_goal]` block matches `mk-goal.js`'s template byte-for-byte outside the parameterized Role line, confirmed by a direct diff test.
- **SC-003**: The manage CLI's action parity against `/goal:goal-opencode`'s router contract is confirmed by a parity test table (same actions, same `--budget` parsing, same error codes).
- **SC-004**: Shared state file atomic-write hygiene (`0600`, temp+rename) matches `mk-goal.js`'s own hygiene, confirmed by a direct comparison of the write path logic.
- **SC-005**: `mk-goal.js` and `/goal:goal-opencode` are unmodified by this phase.

### Acceptance Scenarios

- **Given** a goal set via `goal.cjs set`, **When** the shared state file is read back, **Then** it round-trips with identical field values and `0600` permissions.
- **Given** a captured `mk-goal.js` render of an `[active_goal]` block for a known goal, **When** the same goal fields are rendered through `goal-core.cjs` for a non-OpenCode runtime, **Then** every line matches except the Role line, which reflects the parameterized runtime name.
- **Given** `/goal:goal-opencode`'s documented router contract for an invalid `--budget` value, **When** `goal.cjs set --budget <invalid>` is run, **Then** it returns the same `INVALID_TOKEN_BUDGET` error code and envelope shape.
- **Given** no native token-usage feed is available (any non-OpenCode context), **When** turn/time accounting is recorded, **Then** the state file's `usageSource` field reads `"turn-count-estimate"` (or equivalent), never a fabricated token count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Diverging silently from `mk-goal.js`'s template as that file evolves. | Later phases could inject a block that looks compatible but drifts from the reference. | Byte-diff test against a captured reference render, re-run whenever `mk-goal.js`'s template changes. |
| Risk | A shared single state file (vs. per-session) could be overwritten by concurrent non-OpenCode sessions. | Two concurrent Devin/Cursor/Pi sessions could clobber each other's goal. | Documented as a known constraint of the operator-chosen shared-file model; atomic writes prevent corruption, not concurrent-session clobbering (out of scope for this phase to solve). |
| Dependency | `mk-goal.js` as the reference implementation for hardening/verifier logic. | Porting must track its actual current behavior, not an assumed one. | Read `mk-goal.js` directly for each ported function before writing the equivalent. |
| Dependency | `/goal:goal-opencode`'s router contract as the parity target. | CLI action/error-code parity must match the command's actual documented contract, not an assumed shape. | Read `goal-opencode.md` directly before implementing each CLI action. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Quality

- **NFR-Q01**: `goal-core.cjs` must depend on nothing but Node builtins (no new external dependencies), consistent with the fully-portable pattern used by the other `.opencode/hooks/` concerns.
- **NFR-Q02**: Every ported function (hardening, verifier) must carry an attribution comment noting it is ported from `mk-goal.js`.

### Reliability

- **NFR-R01**: A crash mid-write to the shared state file must never leave a corrupted or partially-written file (atomic temp+rename write pattern is mandatory, not optional).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Policy Boundaries

- Fields with no real cross-runtime equivalent (e.g. OpenCode's native token-usage counts) must record an honest `usageSource` label rather than a fabricated numeric value.
- The shared state file's schema must remain independent of `mk-goal.js`'s per-session schema even where field names coincide, since the two are read/written by entirely separate code paths.

### State Transitions

- `goal.cjs clear` removes the shared state file's active goal without deleting the file itself (mirrors `/goal:goal-opencode`'s clear semantics, to be confirmed against its actual contract during implementation).
- `goal.cjs pause`/`resume` mutate a status field on the shared state without altering the goal text itself.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One new concern folder, one shared state file, one CLI; no runtime wiring yet. |
| Risk | 8/25 | No live hook wiring in this phase; risk is confined to template-drift and shared-file concurrency. |
| Research | 9/20 | Requires reading `mk-goal.js` and `goal-opencode.md` closely enough to port logic and mirror a contract exactly. |
| **Total** | **27/70** | **Level 2 verification packet** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Resolved during implementation: clear/pause/resume semantics were confirmed against `goal-opencode.md` and implemented in `goal.cjs`/`goal-core.cjs`, with CLI envelopes and error codes verified by the 27/27-passing `node --test` suite plus a live CLI smoke test (set/show/clear with isolated `MK_GOAL_STATE_DIR`).
<!-- /ANCHOR:questions -->
