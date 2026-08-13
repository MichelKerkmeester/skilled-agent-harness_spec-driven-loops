---
title: "Feature Specification: Phase 009 Prompt Token-Contract"
description: "Turn the provider prompt into an explicit token-contract copy-editing contract so models reliably carry protected markers and actually rewrite the surrounding prose."
trigger_phrases:
  - "prompt-token-contract"
  - "prompt token contract"
  - "token-aware prompt profile"
  - "projection quality"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/009-prompt-token-contract"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase spec from deep-research priority A."
    next_safe_action: "Plan the versioned prompt-profile revision and its fixed-corpus marker-preservation check."
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 009 Prompt Token-Contract

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

The provider prompt tells the model to "keep every fact, name, number, and file path," but after protection those values are already opaque `⟦pcp:v1:…⟧` markers the model can no longer see. It is never told what the markers are or that each must be copied exactly once, in order. The safe model behavior is to copy everything verbatim, which produces the barely-changed rewrites the smoke exposed.

This phase makes the prompt an explicit token-contract copy-editing contract via a versioned prompt-profile revision: name the marker contract, require one-to-one verbatim preservation, restrict rewriting to the words between markers, and supply a synthetic-token few-shot example.

**Key decision:** the fix is a tracked `PromptProfileRecord` revision (version bump + digest), not an untracked system-string edit.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-13 |
| **Branch** | Current worktree |
| **Parent Spec** | `../spec.md` |
| **Phase** | 9 of 13 |
| **Predecessor** | `008-packaging-and-release-hardening` |
| **Successor** | `010-adjacent-span-coalescing` |
| **Handoff Criteria** | The versioned profile carries the token contract and synthetic example, preserves every marker on the fixed corpus, produces non-trivial rewrites, and passes the package gate without changing canonical bytes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase turns the provider instruction into an explicit contract for protected tokens and surrounding prose.

**Scope boundary**: Revise only the versioned prompt-profile contract, fixture, and existing message assembly needed to express and test the token contract.

**Dependencies**:

- No blocking predecessor implementation dependency
- Phase 010 may reduce the number of markers but is not required

**Deliverables**:

- Versioned token-contract prompt profile
- Synthetic-marker few-shot example
- Fixed-corpus marker-preservation and rewrite-quality check
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- The wire body is one system instruction plus one user message containing the whole encoded text; the instruction references values the model cannot see and never states the token contract. [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100]
- The prompt profile has no example set and no marker rubric field. [SOURCE: packages/cli-communication-projection/src/contracts/prompt.ts:11-32] [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56]
- Confirmed empirically: forcing a "sealed black-box" token instruction took a live batch from 0/6 to 6/6 marker preservation (restore=restored).

### Purpose

Make the versioned provider instruction explicitly preserve each protected marker while rewriting only the surrounding prose.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Revise the versioned prompt profile to add: an explicit `⟦pcp:v1:…⟧` marker contract (copy each marker exactly once, in order, unchanged); a prose-only rewrite scope; and a synthetic-marker before/after few-shot example.
- Bump the prompt-profile version and record its digest; update the reference-like fixture accordingly.
- Add a token-contract schema/field to the profile contract if the example set needs a structured home.

### Out of Scope

- Any change to protection, restoration, or the fidelity boundary.
- Any real protected byte in an example (synthetic markers only).
- Per-model profile proliferation beyond a conservative default and one structured profile (deferred to the model-tier experiment).

### Technical Approach

Extend `contracts/prompt.ts` with the example/rubric surface; author the token-contract instruction and a synthetic few-shot in the profile fixture; thread it through `providers/adapters.ts` message assembly unchanged in structure. Validate against a fixed content-free corpus and the existing restoration checks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `packages/cli-communication-projection/src/contracts/prompt.ts` | Modify | Add the structured token-contract example or rubric surface if required |
| `packages/cli-communication-projection/test/fixtures/prompt-profiles.json` | Modify | Record the versioned profile, digest inputs, and synthetic example |
| `packages/cli-communication-projection/src/providers/adapters.ts` | Modify | Render the revised profile through the existing message assembly |
| `packages/cli-communication-projection/test/` | Modify | Add fixed-corpus contract and restoration coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | State the protected-marker contract explicitly. | The rendered instruction requires each marker exactly once, in order, and unchanged. |
| REQ-002 | Restrict rewriting to non-marker prose. | The rendered instruction identifies only the words between markers as rewriteable. |
| REQ-003 | Carry a synthetic-marker few-shot pair. | At least one before/after example uses only synthetic `⟦pcp:v1:…⟧` markers and no real protected bytes. |
| REQ-004 | Version and digest the profile revision. | The version string changes and its digest is recorded with the evaluation strata. |
| REQ-005 | Improve preservation without accepting a no-op. | The fixed terse-message corpus reaches 100% `restore=restored` and still shows non-trivial prose rewriting. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The versioned profile revision contains the marker contract, prose-only scope, and synthetic few-shot.
- **SC-002**: The fixed corpus records 100% marker preservation and non-trivial prose rewriting.
- **SC-003**: Canonical bytes, protection, restoration, and message-body shape remain unchanged.

### Acceptance Scenarios

1. **Given** a message with multiple protected markers, **When** the revised profile is rendered, **Then** the instruction requires every marker exactly once, in order, and unchanged.
2. **Given** the profile fixture, **When** its examples are inspected, **Then** they contain synthetic markers only and no real protected bytes.
3. **Given** the fixed terse-message corpus, **When** the revised profile is evaluated, **Then** every candidate restores successfully and the prose changes non-trivially.
4. **Given** the same inputs before and after the profile revision, **When** canonical and restoration outputs are compared, **Then** their bytes and fidelity behavior remain unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing prompt-profile contract and adapter assembly | Medium | Extend the tracked profile surface without changing the wire-body structure. |
| Risk | The model preserves markers by echoing all prose | High | Require prose-only rewriting and measure non-trivial change beside restoration success. |
| Risk | An example contains real protected bytes | High | Permit synthetic markers only and scan the fixture in tests. |
| Related phase | Phase 010 marker reduction | Low | Keep this phase independently shippable; measure combined effects later. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Prompt rendering must remain deterministic for the same versioned profile.

### Security and Privacy

- **NFR-S01**: Few-shot examples must contain synthetic markers only and no protected user bytes.

### Reliability

- **NFR-R01**: Marker preservation must remain at 100% on the fixed corpus before the profile can advance.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A message contains one marker and almost no surrounding prose.
- Multiple markers are adjacent or separated only by punctuation.
- The model copies all markers but leaves the prose unchanged.
- The model duplicates, drops, reorders, or edits a marker.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Contract, fixture, adapter rendering, and fixed-corpus tests |
| Risk | 19/25 | Protected-marker fidelity and no-op behavior |
| Research | 12/20 | Existing live-batch evidence is available |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

No unresolved question blocks planning. Model-tier proliferation remains deferred to the separate experiment already identified in scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
