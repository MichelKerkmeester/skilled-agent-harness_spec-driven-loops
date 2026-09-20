---
title: "Feature Specification: Deep-Dive — Minimal Typed Router Contract"
description: "Five-iteration SOL xhigh-fast deep-research lineage on the smallest information-preserving router contract — RouteRequest facts + content-addressed CompiledPolicy + typed RouteDecision (single/orderedBundle/surfaceBundle/clarify/defer/reject) — that collapses the parallel INTENT_SIGNALS and RESOURCE_MAP declarations into compiled detectors and registry/leaf selectors while a policy-pinned modeId derives packet, backend, authority, and default resources, falsified against dissimilar hubs so no field can be removed without losing bundle roles, same-packet public modes, or the evidence-producing detection boundary."
trigger_phrases:
  - "minimal typed router contract deep dive"
  - "route request compiled policy route decision"
  - "defaultMode commitment smell"
importance_tier: "important"
contextType: "research"
---
# Deep-Dive: Minimal Typed Router Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: templates/spec.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Research synthesized; implementation is out of scope |
| **Created** | 2026-07-18 |
| **Branch** | `0069-skilled-router-refactor-impl` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`defaultMode` conflates missing evidence, a policy prior, and authority to execute. Routing information is also split across parallel intent and resource maps, leaving no single typed result that preserves ordered bundle roles, same-packet public modes, evidence, and replay identity.

### Purpose

Define the smallest information-preserving boundary as immutable `RouteRequestV1` facts, a content-addressed `CompiledPolicyV1`, and a typed `RouteDecisionV1` whose outcome is `single`, `orderedBundle`, `surfaceBundle`, `clarify`, `defer`, or `reject`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Finalize the request, compiled-policy, and decision schemas described in `presentation.md`.
- Collapse intent signals and resource maps into one compiled detector, mode-rule, leaf-selector, and bundle-rule graph.
- Preserve explicit commands, ordered target roles, same-packet modes, alternatives, evidence pointers, and replay hashes.
- Falsify the contract against named-default, executor, transport, bundle, and large leaf-inventory archetypes.
- Separate advisor, deterministic benchmark, and document-only behavior.

### Out of Scope

- Runtime implementation or migration of every hub.
- Re-deriving the shipped `defaultMode` answer.
- Treating a document-derived proposal as replay-verifiable without compiled bytes and a matching policy hash.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Conform the research specification to the Level 2 structure |
| `plan.md` | Create | Record the research-document delivery approach |
| `tasks.md` | Create | Track synthesis and verification work |
| `checklist.md` | Create | Record pending verification without invented evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep explicit mode intent separate from inferred facts. | Commands retain precedence and cannot be reduced to another weighted lexical fact. |
| REQ-002 | Keep positive and negative outcomes structurally distinct. | Route outcomes contain at least one ordered target; clarify, defer, and reject contain no targets and include a typed control reason. |
| REQ-003 | Make compilation total and fail-closed. | Unbound facts, unreachable modes, orphan selectors, invalid ownership, or invalid order publish no partial policy. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Preserve all current routing information while removing duplicate maps. | Detectors, mode rules, selectors, bundle rules, authority references, and source digests remain recoverable from the compiled policy. |
| REQ-005 | Bind decisions to replay identity. | Each decision identifies the policy, fact schema, normalized facts, ordered targets, roles, evidence, and alternatives needed for exact replay. |
| REQ-006 | Bound the document-only path honestly. | Documents may produce a transparent proposal but cannot claim a replay-verifiable decision without compiled artifacts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No public field can be removed without losing a demonstrated routing distinction.
- **SC-002**: One compiled policy graph replaces parallel intent and resource maps without deleting the evidence-producing detection boundary.
- **SC-003**: Exact route-gold can assert request and decision bytes, including target order and roles.
- **SC-004**: Defaults act only as bounded priors over already eligible candidates, never as hidden selection authority.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical policy compiler | No content-addressed policy or fail-closed publication | Validate totality, containment, ownership, order, and source digests before publish |
| Dependency | Frozen detector fixtures and typed route gold | Exact replay cannot be established | Pin detector inputs and compare complete request and decision objects |
| Risk | Contract is reduced too far | Bundle roles, same-packet modes, or control outcomes disappear | Retain every field that survived cross-archetype falsification |
| Risk | Document-only output is over-trusted | A proposal may be mistaken for machine authority | Label it document-derived and require destination revalidation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: A pinned compiled policy and detector fixture must produce byte-identical request and decision objects.

### Integrity
- **NFR-I01**: Static packet, backend, authority, and resource data must derive from `modeId` plus the authenticated policy hash rather than copied decision fields.

### Degradation
- **NFR-G01**: A stale advisor projection or missing compiled policy must defer to the documented fallback rather than silently selecting a mode.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Outcome Shape
- Empty targets are valid only for `clarify`, `defer`, and `reject`, each with a typed reason.
- Ordered and surface bundles must preserve target role and order; a set is insufficient.

### Policy State
- A stale advisor policy hash discards advisor evidence rather than mutating local eligibility.
- A compiler error publishes nothing; the previous authenticated policy or fallback remains authoritative.

### Document-Only State
- An AI may explain a proposed route from the policy card but cannot synthesize a policy hash or replay proof from prose.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Three public objects plus one compiled graph spanning five archetypes |
| Risk | 14/25 | Contract loss or hidden commitment would affect every hub migration |
| Research | 18/20 | Five-iteration synthesis and wider falsification are documented |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What exact schema language and versioning policy should define the three public objects?
- Which compatibility views must remain during migration, and when may they be removed?
- What runtime component should authenticate and load the compiled policy before evaluation?
<!-- /ANCHOR:questions -->
