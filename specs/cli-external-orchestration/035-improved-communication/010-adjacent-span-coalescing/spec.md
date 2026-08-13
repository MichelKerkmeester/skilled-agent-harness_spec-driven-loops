---
title: "Feature Specification: Phase 010 Adjacent-Span Coalescing"
description: "Reduce the model-facing marker burden by coalescing bounded adjacent protected spans or using short wire aliases, while keeping the canonical byte-map and strict restoration unchanged."
trigger_phrases:
  - "adjacent-span-coalescing"
  - "adjacent span coalescing"
  - "protected marker inflation"
  - "projection quality"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/010-adjacent-span-coalescing"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase spec from deep-research priority B."
    next_safe_action: "Plan the model-facing representation layer and its inflation/restoration measurement."
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-010-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a short wire alias schema disclose protected-value categories, and is that acceptable under the privacy policy?"
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 010 Adjacent-Span Coalescing

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Protection tokenizes far more than secrets and paths, and adjacent technical spans are never merged, so a short sentence can inflate to several long opaque markers the model must carry verbatim. This phase adds a model-facing representation layer that coalesces bounded adjacent spans within a prose clause, or replaces long canonical markers with short collision-resistant wire aliases, while the local `ProtectedDocument` keeps canonical bytes, digests, ordinals, member order, and one-to-one restoration exactly as today.

**Key decision:** grouping or aliasing happens only on the model-facing wire representation; the local canonical map and every restoration check are unchanged.

**Critical dependency:** a privacy-policy decision on whether short aliases may disclose protected-value categories.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-13 |
| **Branch** | Current worktree |
| **Parent Spec** | `../spec.md` |
| **Phase** | 10 of 13 |
| **Predecessor** | `009-prompt-token-contract` |
| **Successor** | `011-meaning-judge-wiring` |
| **Handoff Criteria** | The chosen model-facing representation reduces fixed-corpus marker burden, resolves locally to the unchanged canonical map, passes every restoration/fidelity check, and records the required privacy decision. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase reduces opaque marker burden without changing the canonical protection or restoration contract.

**Scope boundary**: Add only a versioned model-facing representation and local resolution step between protection and restoration.

**Dependencies**:

- Privacy-policy decision for any alias type disclosure
- Existing `ProtectedDocument` map and strict restoration behavior
- Phase 009 is complementary but not required

**Deliverables**:

- Versioned grouping or alias representation
- Local mapping back to canonical markers
- Fixed-corpus burden, inflation, adjacency, and rejection measurements
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- `collectProtectedRanges` includes structural blocks, commands, list markers, links, URLs, flags, hashes, variables, numbers, and identifiers; ranges are overlap-filtered but never merged. [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:23-53,134-301]
- Each accepted range becomes one ~48-character opaque token. A read-only probe measured a 95-char sentence at 270 chars with 5 tokens. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:396-415]
- Restoration rejects duplicate, changed, unexpected, missing, or reordered markers, so any representation change must preserve a local one-to-one map of bytes, digest, ordinal, and order. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:117-217]

### Purpose

Reduce model-facing marker count and encoded inflation while retaining the current canonical map, protected categories, and strict byte-for-byte restoration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A versioned model-facing span representation that either (a) coalesces bounded adjacent protected spans within a single prose clause, or (b) maps long canonical markers to short wire aliases, resolved back locally before restoration.
- Retain the canonical `ProtectedDocument` map, digests, ordinals, member order, and strict restore.
- Keep structural blocks, code, and table boundaries separately protected where grouping could change syntax.
- A fixed-corpus measurement of token count, encoded/source inflation, marker adjacency, and restoration-rejection rate.

### Out of Scope

- Removing any protected category or weakening token identity/order/count checks.
- Any representation that discloses raw protected values.

### Technical Approach

Add a representation layer between `protectMarkdown` output and the wire body; resolve aliases/groupings back to canonical markers before `restoreProtectedSpans`. Gate the design on the open alias-disclosure question before choosing aliasing over pure adjacency grouping.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `packages/cli-communication-projection/src/fidelity/` | Modify | Add the versioned model-facing representation and local canonical-marker resolution |
| `packages/cli-communication-projection/src/providers/` | Modify | Send only the reduced wire representation to the provider boundary |
| `packages/cli-communication-projection/test/fidelity/` | Modify | Prove canonical parity, rejection behavior, and structural-boundary safety |
| `packages/cli-communication-projection/test/` | Modify | Measure marker count, inflation, adjacency, and rejection rate on a fixed corpus |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Introduce a versioned model-facing representation. | Grouping or aliases are explicitly versioned and applied only between protection and the provider wire body. |
| REQ-002 | Reduce marker count. | Fixed-corpus marker count drops versus the one-token-per-range baseline. |
| REQ-003 | Reduce encoded/source inflation. | Fixed-corpus encoded/source inflation drops versus baseline. |
| REQ-004 | Preserve the canonical map. | Canonical bytes, digests, ordinals, member order, and protected categories remain unchanged. |
| REQ-005 | Resolve locally before restoration. | Every grouping or alias maps back to canonical markers before `restoreProtectedSpans`. |
| REQ-006 | Preserve syntax-sensitive boundaries. | Structural blocks, code, and tables remain separately protected where grouping could change syntax. |
| REQ-007 | Prevent unapproved disclosure. | The wire representation contains no raw value and no type label lacking privacy approval. |
| REQ-008 | Preserve strict rejection behavior. | Duplicate, changed, unexpected, missing, and reordered markers remain rejected and all existing fidelity tests pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fixed-corpus marker count and encoded/source inflation both improve over baseline.
- **SC-002**: Restoration output is byte-identical to the current pipeline for the same inputs.
- **SC-003**: Structural blocks, code, and tables retain their existing syntax behavior.
- **SC-004**: The privacy decision for any alias schema is recorded before implementation is accepted.

### Acceptance Scenarios

1. **Given** adjacent protected spans inside one prose clause, **When** the chosen representation is encoded, **Then** marker count and inflation decrease relative to baseline.
2. **Given** a reduced wire representation, **When** it returns from the provider path, **Then** it resolves locally to the original canonical marker sequence before restoration.
3. **Given** the same protected input before and after the change, **When** restoration completes, **Then** output bytes, digests, ordinals, and member order match exactly.
4. **Given** code, table, or structural-block boundaries, **When** grouping is considered, **Then** spans remain separate wherever grouping could change syntax.
5. **Given** a duplicate, changed, unexpected, missing, or reordered wire marker, **When** resolution or restoration runs, **Then** the candidate is rejected under the existing strict behavior.
6. **Given** a proposed short alias schema, **When** privacy review is performed, **Then** no raw value or unapproved category label reaches the provider wire.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Privacy decision for alias labels | High | Prefer pure adjacency grouping unless alias disclosure is explicitly approved. |
| Risk | Grouping crosses a syntax boundary | High | Preserve structural, code, and table separations and seed negative controls. |
| Risk | Local resolution weakens one-to-one identity | High | Retain the canonical map and run the existing duplicate/order/count rejection suite unchanged. |
| Related phase | Phase 009 token contract | Medium | Measure independently, then measure the combined reduction later. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The fixed-corpus measurement must report token count and encoded/source inflation before and after the representation layer.

### Security and Privacy

- **NFR-S01**: The wire representation must contain neither raw protected values nor unapproved category labels.

### Reliability

- **NFR-R01**: Local resolution and strict restoration must remain deterministic for the same versioned representation.

## 8. EDGE CASES

- Adjacent spans separated only by punctuation.
- Nested Markdown constructs that produce overlapping candidate ranges.
- Code, tables, or structural blocks beside prose spans.
- Alias collisions, unknown aliases, duplicate aliases, and reordered groups.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 21/25 | Crosses protection, provider-wire, resolution, and measurement surfaces |
| Risk | 23/25 | Canonical fidelity, syntax, and privacy boundaries |
| Research | 13/20 | Choice between grouping and aliases needs evidence |
| Multi-Agent | 7/15 | Independent representation and verification lanes |
| Coordination | 11/15 | Related prompt phase and privacy decision |
| **Total** | **75/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Grouping changes Markdown syntax | High | Medium | Keep syntax-sensitive boundaries separate and run structural fixtures. |
| R-002 | Alias mapping discloses a protected category | High | Medium | Require a privacy decision or use category-neutral grouping. |
| R-003 | Resolution accepts an invalid marker sequence | High | Low | Reuse strict duplicate, count, identity, and order rejection checks. |

## 11. USER STORIES

### US-001: Lower marker burden (Priority: P0)

**As a** projection pipeline, **I want** fewer and shorter model-facing markers, **so that** the model can rewrite surrounding prose without carrying unnecessary opaque text.

**Acceptance Criteria**:

1. **Given** the fixed corpus, **When** marker burden is measured, **Then** marker count decreases from baseline.
2. **Given** the same corpus, **When** encoded/source inflation is measured, **Then** inflation decreases from baseline.

### US-002: Exact local restoration (Priority: P0)

**As a** fidelity boundary, **I want** the reduced representation resolved back to canonical markers locally, **so that** strict restoration remains unchanged.

**Acceptance Criteria**:

1. **Given** a valid reduced representation, **When** local resolution and restoration run, **Then** the original bytes are restored exactly.
2. **Given** an invalid alias or grouping sequence, **When** resolution runs, **Then** the candidate is rejected.

### US-003: Privacy-safe representation (Priority: P1)

**As a** privacy operator, **I want** provider-facing markers to reveal no raw or unapproved category data, **so that** reducing marker burden does not expand disclosure.

**Acceptance Criteria**:

1. **Given** a proposed representation, **When** its wire bytes are inspected, **Then** no raw protected value appears.
2. **Given** an alias with a category label, **When** no privacy approval exists, **Then** that alias design cannot ship.

## 12. OPEN QUESTIONS

Does a short wire alias schema disclose protected-value categories, and is that acceptable under the privacy policy?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent Packet**: `../spec.md`
