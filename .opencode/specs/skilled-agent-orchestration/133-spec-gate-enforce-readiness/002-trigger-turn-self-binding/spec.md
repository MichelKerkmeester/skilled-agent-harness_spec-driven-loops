---
title: "Feature Specification: Trigger-turn self-binding for the spec-gate"
description: "The spec-gate opens Gate-3 and denies the next Write even when the triggering prompt already names a valid spec folder, because answerParse only runs on an already-open gate and classifyIntent calls classifyPrompt with no ClassificationOptions. This phase binds satisfied on the triggering turn and threads the classifier's prebound/command-contract options."
trigger_phrases:
  - "spec gate trigger turn"
  - "trigger turn self binding"
  - "classifyIntent self binding"
  - "gate-3 classification options"
  - "same-turn spec folder binding"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-spec-gate-enforce-readiness/002-trigger-turn-self-binding"
    last_updated_at: "2026-07-11T11:05:57.148Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level-2 planning docs for trigger-turn self-binding"
    next_safe_action: "Implement classifyIntent self-binding plus options threading in spec-gate-core.mjs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
      - ".opencode/skills/system-spec-kit/shared/gate-3-classifier.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-trigger-turn-self-binding"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Trigger-turn self-binding for the spec-gate

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
| **Branch** | `002-trigger-turn-self-binding` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-advise-telemetry |
| **Successor** | 003-scaffolded-folder-acceptance |
| **Handoff Criteria** | Self-binding and options threading land in `spec-gate-core.mjs` with extended tests green; the shared classifier and `mcp_server/` dist are untouched; fail-open, kill-switch, and the Write/Edit-only deny predicate are unchanged. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Spec-gate enforce-readiness remediation specification.

**Scope Boundary**: `classifyIntent()` in `spec-gate-core.mjs` and its test file only. The shared Gate-3 classifier (`gate-3-classifier.ts` and its dist) is consumed as-is and never edited. `evaluateMutation()` and both runtime adapters keep their current behavior in this phase.

**Dependencies**:
- Phase 001 (advise/would-deny telemetry) records the per-event log; when this phase closes the gate on the triggering turn, telemetry sees a satisfied-on-trigger outcome with no advise/deny event, which 001 must tolerate.
- Phase 003 (scaffolded-folder acceptance) relaxes `prior_answer` binding acceptance; because self-binding here uses `source: 'prior_answer'`, it inherits whatever binding-acceptance path 003 establishes.

**Deliverables**:
- Trigger-turn self-binding: a prompt that triggers Gate-3 and names a valid folder in the same breath binds `satisfied` immediately.
- Options threading: `classifyIntent` passes the available `ClassificationOptions` into `classifyPrompt` so prebound/command-contract/`satisfiedBy` machinery resolves instead of re-asking.
- Extended core tests covering both mechanisms plus regression proof.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`answerParse()` runs only when the persisted gate status is already `'open'` (`spec-gate-core.mjs:496`, gated by `state.status === 'open'`), so a prompt that BOTH triggers Gate-3 AND names a valid folder in one breath ("fix the login bug, use `.opencode/specs/999-valid`") opens the gate and the NEXT Write is denied under enforce. Separately, `classifyIntent` calls `classifyPrompt(prompt)` with no `ClassificationOptions` (`spec-gate-core.mjs:522`), so the classifier's prebound / `commandContract` / `satisfiedBy` machinery (`gate-3-classifier.ts:652-684`) is dead — `/speckit:implement <folder>` and other pre-bound command flows also open the gate and deny the next Write.

### Purpose
A single triggering turn that already names a valid spec folder (or arrives with a resolved prebound command contract) closes the gate as `satisfied` on that turn, so enforce mode never denies the common happy path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add trigger-turn self-binding to `classifyIntent`: when `classifyPrompt` triggers Gate-3 and the same prompt carries a spec-path or `NNN-slug` token that `validateSpecFolderBinding` accepts, persist `satisfied` instead of `open`.
- Thread the available `ClassificationOptions` from the `classifyIntent` request into `classifyPrompt`, and treat a triggered-but-not-`requiresGate3Prompt` result (non-null `satisfiedBy`) as `satisfied`.
- Add a small token extractor helper for trigger prompts and extend `spec-gate-core.test.mjs` with self-binding, options-threading, and regression cases.

### Out of Scope
- Editing `gate-3-classifier.ts` or rebuilding any dist - the classifier's option surface is used as-is; changing it is Phase 003's concern for `prior_answer` acceptance.
- Changing `evaluateMutation`, `DENY_CAPABLE_TOOLS`, or the deny predicate - this phase only closes the gate more often, never denies more.
- Wiring adapters to populate `commandContract`/`executionMode` end-to-end - the core must accept and thread options now; adapter population is follow-on work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` | Modify | Add self-binding + options threading in `classifyIntent`; add a trigger-prompt token extractor helper. |
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs` | Modify | Add self-binding, options-threading, and regression tests. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Trigger-turn self-binding: a triggering prompt naming a valid folder binds `satisfied` on that turn. | **Given** enforce on and a fresh session, **When** the user sends a Gate-3-triggering prompt that also names a valid spec folder, **Then** `classifyIntent` returns `satisfied` and the next Write allows. |
| REQ-002 | Thread `ClassificationOptions` into `classifyPrompt` so prebound/command-contract/`satisfiedBy` machinery resolves. | **Given** a request carrying resolved classification options, **When** `classifyPrompt` returns `triggersGate3` true with `requiresGate3Prompt` false and non-null `satisfiedBy`, **Then** `classifyIntent` persists `satisfied` instead of `open`. |
| REQ-003 | No-folder and invalid-folder triggering prompts still open the gate (no regression). | **Given** a fresh session, **When** a triggering prompt names no folder or an invalid/nonexistent folder, **Then** the gate opens and returns the bounded question. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Self-binding accepts both a spec-path token and a bare `NNN-slug` token, gated solely by `validateSpecFolderBinding`. | **Given** a triggering prompt containing a valid bare `NNN-slug` token, **When** `classifyIntent` runs, **Then** it binds `satisfied`; an unresolved token falls through to open. |
| REQ-005 | Fail-open and kill-switch invariants preserved. | **Given** `MK_SPEC_GATE_DISABLED=1`, **When** a triggering-plus-folder prompt arrives, **Then** `classifyIntent` is a full no-op (`closed`); a validation/classifier throw still evicts persisted state and returns `closed`. |
| REQ-006 | The deny predicate is untouched. | `evaluateMutation`'s deny remains open + enforce + Write/Edit + non-exempt only; the deny-matrix test still yields exactly two deny rows. |
| REQ-007 | Tests extend `spec-gate-core.test.mjs`. | Self-binding, options-threading (module-mock), and the full regression suite run green under `node --test` (with `--experimental-test-module-mocks` for the mock cases). |

### P2 - Optional (defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | No shared-classifier change, no dist rebuild, comment hygiene. | `git diff` shows no edits under `shared/` or `mcp_server/`; new code comments carry no spec paths or artifact ids. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single triggering prompt that names a valid folder yields `satisfied` on that turn, and the next Write allows even with `MK_SPEC_GATE_ENFORCE=1`.
- **SC-002**: A triggering prompt naming no folder (or an invalid one) still opens the gate, and every pre-existing core test remains green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 `prior_answer` acceptance relaxation | Self-binding uses `source: 'prior_answer'`, so acceptance strictness is shared | Route self-binding through the same binding-validation entrypoint 003 wraps; note the shared path in both specs. |
| Dependency | Shared classifier resolves prebound options against `process.cwd()` (`gate-3-classifier.ts:657,676`) | Options-threading path is filesystem-anchored to cwd, not the core's `projectDir` | Test the satisfaction-mapping via module-mock; document the cwd anchor as a known limitation. |
| Risk | Over-binding a false-positive `NNN-slug` token (e.g. "404-not-found") | Med | `validateSpecFolderBinding` is the sole authority; any token that does not resolve to a real, valid, in-tree folder falls through to open. |
| Risk | Disturbing `answerParse`'s `isOpen`-gated contract | High | Leave `answerParse` untouched; self-binding uses a separate sibling extractor with no letter/skip logic. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Self-binding adds at most one `validateSpecFolderBinding` filesystem walk per triggering turn, bounded by the spec tree; no measurable added latency on non-triggering turns.
- **NFR-P02**: No new persisted state files beyond the existing single per-session state write.

### Security
- **NFR-S01**: The guard never echoes the classifier's matched-token arrays into the TUI or injected context; only the fixed `GATE_3_QUESTION` string is surfaced.
- **NFR-S02**: Path-traversal, out-of-tree, ambiguous, deprecated, and phase-parent-without-active-child tokens are rejected by `validateSpecFolderBinding` before any bind.

### Reliability
- **NFR-R01**: Fail-open everywhere - any classifier or validation throw evicts persisted state and returns `closed`; `MK_SPEC_GATE_DISABLED=1` is a full no-op.
- **NFR-R02**: Deny stays opt-in behind `MK_SPEC_GATE_ENFORCE=1`, default-off, and never widens beyond the Write/Edit predicate; the OpenCode plugin stays default-export-only and never writes stdout/stderr; `mcp_server/` dist is not rebuilt.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty/whitespace prompt does not trigger Gate-3, so self-binding is never reached (stays `closed`).
- Maximum length: token extraction uses bounded regexes over the prompt; no unbounded scanning.
- Invalid format: a malformed or traversal-bearing token is rejected by `validateSpecFolderBinding` and falls through to open.

### Error Scenarios
- External service failure: not applicable; the classifier and validator are in-process and pure.
- Validation throw: caught by the existing `classifyIntent` try/catch, which evicts persisted state and returns `closed`.
- Concurrent access: session state remains a single atomic per-session write; self-binding does not add new state keys.

### State Transitions
- Fresh -> satisfied (self-bound) on the triggering turn when a valid folder is named.
- Fresh -> open when no folder or an invalid folder is named (unchanged).
- Already open/satisfied/skipped: unchanged - satisfied/skipped short-circuit before `classifyPrompt`; open still uses `answerParse` first.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One core function plus one helper and its tests; two files touched. |
| Risk | 14/25 | Touches the live enforce classify path and shared-policy behavior; mitigated by fail-open and validation authority. |
| Research | 6/20 | Classifier option surface and validation semantics already read and grounded. |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should adapters populate `commandContract`/`executionMode` in this phase, or is core-only threading sufficient until a later wiring phase?
- Does Phase 003's `prior_answer` relaxation land before or after this phase, given both flow through the same binding-validation entrypoint?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
