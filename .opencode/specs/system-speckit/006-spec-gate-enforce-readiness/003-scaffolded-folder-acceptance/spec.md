---
title: "Feature Specification: Scaffolded-folder acceptance for the spec-gate binding path"
description: "The spec-gate closes a Gate-3 answer only when the named folder already carries all three MANDATORY_SPEC_METADATA_FILES, but two of those files are produced at memory-save time, so a freshly scaffolded folder deadlocks enforce mode. Accept a folder that exists with spec.md present as a valid prior_answer binding without weakening the shared classifier."
trigger_phrases:
  - "spec gate scaffolded folder"
  - "gate-3 prior answer binding"
  - "missing_metadata acceptance"
  - "enforce mode deadlock"
  - "scaffold before save"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/003-scaffolded-folder-acceptance"
    last_updated_at: "2026-07-11T11:05:57.515Z"
    last_updated_by: "spec-author"
    recent_action: "Upgraded phase docs to Level 2 and recorded the Option A design decision"
    next_safe_action: "Implement the relaxed prior_answer accept in spec-gate-core.mjs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
      - ".opencode/skills/system-spec-kit/shared/gate-3-classifier.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-scaffolded-folder-acceptance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Scaffolded-folder acceptance for the spec-gate binding path

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
| **Branch** | `scaffold/003-scaffolded-folder-acceptance` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-trigger-turn-self-binding |
| **Successor** | 004-headless-enforce-scoping |
| **Handoff Criteria** | A scaffolded folder (exists + spec.md) satisfies the gate; the shared classifier and its `MANDATORY_SPEC_METADATA_FILES` constant stay byte-identical; core tests + strict validation pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Spec-gate enforce-readiness remediation specification. It fixes Fable defect 2 (scaffolded-folder acceptance), one of three structural "stuck-open" close-path defects that would make `MK_SPEC_GATE_ENFORCE=1` deny the common happy paths.

**Scope Boundary**: The spec-gate's own `source:'prior_answer'` binding-acceptance branch in `spec-gate-core.mjs` and its unit test. The shared Gate-3 classifier (`gate-3-classifier.ts`), the OpenCode plugin, and the Claude adapters are read for grounding but are not modified by this phase.

**Dependencies**:
- Phase 2 (002-trigger-turn-self-binding) fixes the trigger-turn self-binding path; this phase targets the metadata-completeness requirement on the SAME `prior_answer` acceptance branch, so the two touch adjacent lines in `classifyIntent`.
- `isExemptTargetPath` already exempts `.opencode/specs/**`, so the agent's scaffold Write (`NNN-newfolder/spec.md`) is not itself denied; this phase only fixes the follow-on source Writes.

**Deliverables**:
- Relaxed acceptance in the spec-gate core so a scaffolded folder closes the gate.
- Adversarial + happy-path test coverage in `spec-gate-core.test.mjs`.
- A recorded design decision (Option A vs Option B) with justification in `plan.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Closing the Gate-3 gate through a `source:'prior_answer'` binding requires the named folder to already carry all three files in the shared classifier's `MANDATORY_SPEC_METADATA_FILES` (`spec.md` + `description.json` + `graph-metadata.json`). But `description.json` and `graph-metadata.json` are produced at memory-SAVE time (`generate-context.js`), not at scaffold time. So a user who answers "B" (create a new folder), lets the agent scaffold `NNN-newfolder/spec.md` (an exempt write), then names that folder gets `validateSpecFolderBinding` failing with `missing_metadata`, the gate stays open, and — under enforce — every subsequent source Write is denied until a save runs AND they answer again. That deadlock makes enforce mode unusable for the default new-folder workflow.

### Purpose
A freshly scaffolded spec folder that exists and carries a real `spec.md` is accepted as a valid Gate-3 answer so work can begin immediately, without changing the shared classifier's contract that other consumers depend on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Relax the spec-gate core's OWN acceptance for `source:'prior_answer'` bindings so a folder that exists with `spec.md` present satisfies the gate even before the save-time JSON files exist.
- Extend `spec-gate-core.test.mjs` with scaffolded-acceptance coverage plus adversarial negatives.
- Re-run the core test suite and strict spec validation for this phase.

### Out of Scope
- Changing `MANDATORY_SPEC_METADATA_FILES` or `validateSpecFolderBinding` in the shared classifier - other consumers rely on the strict trio contract.
- Relaxing the AUTONOMOUS prebound/`commandContract` satisfaction path (`applyGate3Satisfaction`) - that path is not the scaffold-then-work workflow and stays strict.
- WS1/WS2/WS4/WS5 defects - each owned by its own sibling phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` | Modify | Relax the `classifyIntent` `prior_answer` binding branch to accept `missing_metadata` when a real `spec.md` is present |
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs` | Modify | Add scaffolded-acceptance happy path plus adversarial negative tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `source:'prior_answer'` binding to an existing in-tree folder that contains `spec.md` but lacks `description.json`/`graph-metadata.json` closes the gate as `satisfied` | New core test: scaffold `spec.md` only, answer "B, <folder>", `classifyIntent` returns `satisfied`; a following `Write` with enforce on returns `allow` |
| REQ-002 | The shared classifier's `MANDATORY_SPEC_METADATA_FILES` (`gate-3-classifier.ts:137`) and `validateSpecFolderBinding` (`:595`) acceptance semantics are unchanged | `git diff` shows no edit to `gate-3-classifier.ts` or `shared/dist/`; `rg` confirms the constant literal is unchanged |
| REQ-003 | A named folder that does NOT exist, or exists WITHOUT `spec.md`, keeps the gate `open` | Negative tests: non-existent folder to `open`; folder with `description.json` but no `spec.md` to `open` |
| REQ-005 | Fail-open and kill-switch invariants hold across the relaxed path | Existing fail-open tests stay green; a throw inside the relaxed accept falls through to re-ask and the outer catch still evicts stale `open` state; `MK_SPEC_GATE_DISABLED=1` short-circuits before any acceptance logic runs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The relaxation is scoped to `source:'prior_answer'`; the AUTONOMOUS prebound/`commandContract` satisfaction path stays strict (trio still required) | Code inspection: the relaxation lives only in `spec-gate-core.mjs`; `applyGate3Satisfaction` behavior is unchanged; the core is the only relaxation site |
| REQ-006 | Out-of-tree, traversal, symlink-escape, and deprecated-status rejections are preserved - the relaxation removes only the trio requirement, not the security checks | Adversarial tests confirm `out_of_tree`, traversal (`../`), symlink-escape, and a deprecated folder carrying the full trio each keep the gate `open` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The WS3 accept scenario passes end-to-end - answer "B, 042-newfolder" after scaffolding `042-newfolder/spec.md` closes the gate (`satisfied`) and Writes are allowed under enforce, while a bare non-existent folder name still keeps it open.
- **SC-002**: `node --test spec-gate-core.test.mjs` is green (existing plus new tests) and `validate.sh --strict` on this phase reports `Errors: 0` (metadata-owned warnings excepted).

### Acceptance Scenarios

- **Given** the gate is open and the agent scaffolded `042-newfolder/spec.md` (no save yet), **When** the user answers "B, .opencode/specs/042-newfolder", **Then** `classifyIntent` returns `satisfied` and the next `Write` under enforce returns `allow`.
- **Given** the gate is open, **When** the user names `.opencode/specs/999-does-not-exist` that has never been created, **Then** the gate stays `open` (`missing_folder`, not `missing_metadata`).
- **Given** the gate is open and a folder exists with `description.json` but no `spec.md`, **When** the user names it, **Then** the gate stays `open` because the relaxed accept requires a real `spec.md`.
- **Given** the gate is open, **When** the answer names a traversal path (`../outside`) or a symlink whose real target escapes the spec tree, **Then** the gate stays `open` (`out_of_tree`).
- **Given** the AUTONOMOUS prebound/`commandContract` path, **When** a bound folder lacks the trio, **Then** it is NOT satisfied - the relaxation is `prior_answer`-only.
- **Given** `MK_SPEC_GATE_DISABLED=1`, **When** any turn is classified, **Then** the gate is a full no-op (`closed`) and no acceptance logic runs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Broadened `satisfied` meaning - a folder without the save-time trio now satisfies the spec-gate | Med | The folder must still exist, be in-tree, and carry a real `spec.md`; `validateSpecFolderBinding` still runs every security check |
| Risk | Deprecated-status ordering edge - `validateSpecFolderCandidate` runs the `missing_metadata` check (`:563`) before the deprecated check (`:567`), so a deprecated folder missing the trio surfaces as `missing_metadata` | Low | Fresh scaffolds are never deprecated; an optional P2 local status read can close the edge; advise-mode plus re-ask remain a backstop |
| Dependency | `isExemptTargetPath` keeps the scaffold Write itself exempt | Low | `.opencode/specs/**` is already exempt (`spec-gate-core.mjs:455`); no change needed |
| Dependency | The `missing_metadata` result carries the resolved folder path in `validation.path` | Low | `invalidBinding('missing_metadata', toWorkspaceRelative(realFolderPath, ...))` (`:565`) already returns the workspace-relative path the core re-derives |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The relaxed accept adds at most one bounded `statSync` on `spec.md` per answered binding turn - no specs-tree walk.
- **NFR-P02**: `evaluateMutation` remains read-only over persisted state and never calls `validateSpecFolderBinding` (static-shape test at `spec-gate-core.test.mjs:474` still holds).

### Security
- **NFR-S01**: Deny stays opt-in behind `MK_SPEC_GATE_ENFORCE=1`, default-off, and is never widened beyond the Write/Edit predicate (`DENY_CAPABLE_TOOLS`).
- **NFR-S02**: The relaxation must not weaken traversal, out-of-tree, or symlink-escape rejection, and must not alter the shared classifier or its compiled dist.

### Reliability
- **NFR-R01**: Fail-open everywhere - any throw in the relaxed accept resolves to the current status with no new state write; the existing catch in `classifyIntent` still evicts stale `open` state.
- **NFR-R02**: `MK_SPEC_GATE_DISABLED=1` is a full no-op for both `classifyIntent` and `evaluateMutation`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Folder exists, `spec.md` + both JSON present (fully saved): `satisfied` via the unchanged valid path.
- Folder exists, `spec.md` present, JSON absent (scaffolded): `satisfied` via the NEW relaxed accept.
- Folder exists, `spec.md` ABSENT: stays `open` (`missing_metadata` reason, but the local `spec.md` check fails).

### Error Scenarios
- Non-existent folder: `missing_folder`, stays `open` (unchanged).
- Out-of-tree path / traversal (`../`): `resolveBindingCandidates` returns `[]` or `out_of_tree`, stays `open` (unchanged).
- Symlink whose real target escapes the tree: rejected on the realpath containment check, stays `open` (unchanged).

### State Transitions
- Deprecated folder carrying the full trio: `deprecated_or_superseded`, stays `open` (unchanged).
- Phase-parent scaffold without an active child: `phase_parent_without_active_child`, stays `open` (not `missing_metadata`).
- `MK_SPEC_GATE_DISABLED=1`: `classifyIntent` returns `closed` immediately; no acceptance logic runs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two files, roughly 40 LOC of production change plus tests |
| Risk | 12/25 | Session-state acceptance semantics and enforce path; security-adjacent but reuses the classifier's own checks |
| Research | 8/20 | Option A vs Option B design choice; understanding the classifier reason payload and ordering |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the relaxed accept read `spec.md` status locally to close the deprecated-ordering edge, or is advise-mode plus a WS5 re-ask a sufficient backstop for a folder that is both freshly scaffolded and already marked deprecated?
- Should the persisted `satisfied` state record a marker distinguishing a scaffold-accepted binding from a fully-saved one, for WS1 telemetry, or is the existing `boundSpecFolder.source` enough?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
