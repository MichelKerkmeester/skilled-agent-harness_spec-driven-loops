---
title: "Feature Specification: Hook Deadline and Diagnostics"
description: "The system-spec-kit shim kills the advisor hook at 2,500 ms, the same budget the hook gives its CLI call, so on Claude, Codex, Cursor and Devin a slow advisor delivers nothing instead of the fallback directive. This phase nests the deadlines, records delivered brief bytes and the real runtime, guards the Pi hook's built import path, makes the diagnostic log trim crash-safe and gives Pi's in-process call its own deadline."
trigger_phrases:
  - "advisor hook deadline"
  - "hook fallback survives shim kill"
  - "advisor diagnostics emitted bytes"
  - "pi advisor dist path test"
  - "bounded jsonl atomic trim"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Hook Deadline and Diagnostics

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-hook-path-cli-spawn-trim |
| **Handoff Criteria** | A forced slow CLI yields the directives fallback on a Claude turn, and a debug-on hook turn on each runtime writes a diagnostic carrying `emittedBytes` and its real runtime |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Pi skill orchestrator research for skill advisor refinement specification. It carries recommendations R1, R3, R7, R11 and R12 from `../001-deep-research/research/research.md` section 11.

**Scope Boundary**: The Claude shim in system-spec-kit, the advisor's Claude and Pi hooks, the advisor's diagnostic record and its runtime list, and their tests. No scorer, ranking or fallback-wording change.

**Dependencies**:
- None. This phase goes first because 003 and 004 need its diagnostics as a baseline, and 004 needs the fallback to reach all four subprocess runtimes.

**Deliverables**:
- A nested deadline so the advisor hook emits its fallback before the shim kills it
- `emittedBytes`, a directives-suppressed flag and the real runtime on every hook diagnostic
- A contract test for the Pi hook's built import path
- A crash-safe trim for bounded JSONL logs
- A deadline race around Pi's in-process advisor call

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit Claude shim spawns the advisor hook with `CHILD_TIMEOUT_MS = 2500` and returns `{}` when it kills the child (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:22`, `:107-114`). The advisor hook gives its CLI call the same 2,500 ms (`.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:106`, `:164`), so a slow CLI gets the hook killed before it can emit its fallback directive at `:302`. Codex, Cursor and Devin route through the same shim with a 2,800 ms outer limit (`.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:103-109`, `cursor/user-prompt-submit.ts:50`, `devin/user-prompt-submit.ts:19`), so all four runtimes lose the guardrail. We also cannot measure the problem: the diagnostic record has no byte field (`.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:347-394`), the runtime list holds only `claude`, `copilot` and `opencode` (`runtime/lib/advisor-runtime-values.ts:10-14`) and the Claude handler hard-codes `'claude'` (`hooks/claude/user-prompt-submit.ts:203`).

### Purpose
Every runtime receives either a brief or the fallback directive on every turn, and each hook turn leaves a measurement that later phases can compare against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: when `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` is unset, the shim sets it in the child environment to `CHILD_TIMEOUT_MS` minus a margin measured from child start-up.
- R3: add `emittedBytes` and a directives-suppressed flag to the diagnostic record and its closed schema, extend the runtime list with `pi`, `codex`, `cursor` and `devin`, and pass the runtime from each adapter.
- R7: one test that resolves both Pi dist candidates and asserts the module exports `handleClaudeUserPromptSubmit`.
- R11: write the trimmed log to a temp file and rename it over the original.
- R12: race Pi's `await handleClaudeUserPromptSubmit(...)` against the budget plus a margin and emit the fallback directive on expiry.

### Out of Scope
- The wording of the fallback line and its repeat handling. That is phase 004.
- The compiled-route spawns and the casual-prompt gate. That is phase 003.
- The second plain rewrite in `runtime/lib/cross-skill-edges/apply-graph-metadata-patch.ts:100`, `:121`. It rewrites tracked metadata, not a log, and was not adopted.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | Modify | R1: set the child's advisor budget below the kill deadline |
| `.skilled/skills/system-spec-kit/runtime/tests/user-prompt-submit-shim.vitest.ts` | Modify | R1: a slow child yields the fallback, not `{}` |
| `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` | Modify | R3 byte and flag fields, R11 temp-and-rename trim |
| `.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts` | Modify | R3: add `pi`, `codex`, `cursor`, `devin` |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | R3: record bytes and the runtime passed in, not a literal |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify | R3 runtime field, R12 deadline race |
| `.skilled/skills/system-spec-kit/runtime/hooks/{codex,cursor,devin}/user-prompt-submit.ts` | Modify | R3: pass the runtime name to the shared shim |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts` | Modify | R7 dist-path test, R12 deadline test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | R1: the advisor hook times out before the shim kills it | A shim test whose advisor CLI stub sleeps past 2,500 ms returns the directives fallback, where today it returns `{}` |
| REQ-002 | R3: diagnostics carry delivered bytes and the real runtime | With debug on, a Claude turn and a Pi turn each write a record with `emittedBytes` and `runtime` set to `claude` and `pi` |
| REQ-003 | R3: every reader of the runtime list still compiles and passes | `npm run typecheck` and `npm test` pass in the advisor runtime, and no reader listed in `plan.md` rejects the new values |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | R7: a broken Pi dist path fails CI | The new test passes, then fails when the built module path is renamed |
| REQ-005 | R11: a crash mid-trim leaves a parseable log | A test that interrupts the trim after the temp write leaves every line of the log parseable as JSON |
| REQ-006 | R12: Pi's in-process call cannot outlive its budget | A test whose handler never resolves gets the fallback directive within the budget plus the margin |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No runtime delivers `{}` on a turn where the advisor CLI is merely slow.
- **SC-002**: Hook `durationMs` and `emittedBytes` per runtime become queryable from the diagnostic log, giving 003 and 004 their baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R1 margin too small keeps the race, too large starves the CLI | High | Measure child start-up (node start plus module load) on the slowest host first, then set the margin from that number |
| Risk | R3 changes a closed schema read in seven places | Med | Sweep every reader listed in `plan.md` before editing and run the full advisor suite after |
| Dependency | Diagnostics are written only with debug on (`runtime/lib/metrics.ts:406-413`) | Med | The baseline for 003 needs a debug-on collection window, which is an operator step |
| Risk | R11 rename still loses an append another process makes between read and write | Low | Same exposure as today. The per-process queue at `runtime/lib/metrics.ts:180` stays the guard within a process |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What margin does child start-up need on the slowest supported host? Answered by the first task in `tasks.md`.
<!-- /ANCHOR:questions -->

---
