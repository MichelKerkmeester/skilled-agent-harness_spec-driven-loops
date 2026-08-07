---
title: "Feature Specification: Deep-Dive — Compiled Policy Collapse"
description: "Five-iteration SOL xhigh-fast deep-research lineage on collapsing the two hand-authored routing maps (INTENT_SIGNALS + RESOURCE_MAP + hub-router.json + mode-registry.json) into one immutable, content-addressed, registry-derived compiled policy that Layer 0 and offline route-gold both read, backed by a thin packet-local resolver that validates, loads, and enforces."
trigger_phrases:
  - "compiled routing policy deep dive"
  - "collapse intent signals resource map"
  - "registry-derived routing policy"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: templates/spec.md -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: Compiled Policy Collapse

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | Important |
| **Status** | Research complete; implementation remains outside this packet |
| **Created** | 2026-07-18 |
| **Packet** | `001-compiled-policy-collapse` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Parent-hub routing is represented in both prose tables and JSON metadata, so equivalent rules can drift and no single immutable artifact identifies the active policy. Fully deleting hub-local routing is unsafe because packet-local validation, resource loading, defer behavior, and authority enforcement still belong at the hub boundary.

### Purpose

Deepen the viable semantic-collapse direction: compile duplicated routing representations into one canonical, hash-addressed policy derived from the registry, retain a thin packet-local resolver, and make Layer 0 and offline route-gold consume the same artifact.

### Research Context

Seed evidence is `../../002-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-001.md` plus that lineage's `research.md` sections 4.1, 7, and 8. The retained `presentation.md` records the five-iteration synthesis and its three-dimension read.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Five-iteration research on the compiled-policy schema, compatibility compiler, thin resolver, deterministic replay, and migration.
- Explicit evaluation of advisor integration, benchmark integration, and document-only effectiveness.
- A plain-language `presentation.md` that retains the synthesized outcome.

### Out of Scope

- Implementing the compiler, policy store, resolver, or activation mechanism.
- Changing live routing configuration or the shared scorer.
- Re-deriving the shipped `defaultMode` answer.

### Packet Artifacts

| File | Role |
|------|------|
| `spec.md` | Research charter and constraints |
| `presentation.md` | Retained five-iteration synthesis |
| `plan.md`, `tasks.md`, `checklist.md` | Canonical planning and verification surfaces for this research packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Research Contract

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define the content-addressed compiled-policy shape and its canonical hash boundary. | `presentation.md` describes the normalized policy contents, version inputs, and immutable policy identity. |
| REQ-002 | Preserve packet-local authority while removing duplicated routing rules. | The synthesis keeps a thin resolver responsible for validation, loading, defer behavior, and authority enforcement. |
| REQ-003 | Define a fail-closed compatibility and migration path. | The synthesis covers legacy comparison, drift detection, gated activation, and retained-generation rollback. |

### P1 - Cross-Cutting Evaluation

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Evaluate system-skill-advisor integration. | `presentation.md` states what the advisor consumes and how stale or absent evidence degrades. |
| REQ-005 | Evaluate deterministic benchmark integration. | `presentation.md` defines shared-artifact replay and parity gates without changing gold automatically. |
| REQ-006 | Evaluate standalone document-only routing. | `presentation.md` states the required human view and its unattested limitations. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The retained presentation distinguishes semantic collapse from governance collapse.
- The design names the policy schema, compiler failure behavior, resolver boundary, activation transaction, and migration sequence.
- Advisor, benchmark, and document-only behavior are evaluated separately, including degraded and unattested cases.
- The result remains a research blueprint rather than an implementation claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Registry, router metadata, and leaf/resource manifests | The compiler cannot produce a closed policy from incomplete or contradictory sources | Fail closed and publish nothing on hard validation failure |
| Risk | Compiler becomes load-bearing | A compiler defect could encode incorrect routing deterministically | Keep legacy routing authoritative during shadow comparison and require parity before activation |
| Risk | Ordered or supporting targets lose role semantics | A compiled policy could make a support surface independently routable | Preserve role and order in the policy schema and resolver checks |
| Risk | Human view is incomplete | Document-only routing could diverge despite a matching hash | Require behavioral document-only replay and visible unattested status |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Determinism**: identical semantic inputs and compiler versions must produce byte-identical policy bodies and hashes.
- **Authority**: advisor evidence must not grant file, tool, or mutation capability; the packet-local resolver revalidates authority.
- **Reversibility**: activation selects retained verified generations and rollback never recompiles historical source state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Weighted detector vocabularies and ordered bundles must retain their distinct shape.
- Missing modes, unresolved resources, role/order drift, authority mismatch, or non-canonical identity must block publication.
- A stale or unavailable advisor supplies no evidence but does not rewrite local routing authority.
- An incomplete human-readable policy view must defer rather than silently consult the machine artifact.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

The packet retains its declared Level 2 classification because it evaluates multiple interacting routing surfaces and requires verification-oriented documentation. No new numeric complexity score is inferred from the retained research artifacts.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What exact schema and canonical hash inputs should become normative for a compiled policy?
- Which migration gate is sufficient for moving from shadow comparison to authoritative activation?
- How should document-only behavioral replay prove that the generated human view is complete?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Five-iteration synthesis**: `presentation.md`
- **Parent phase map**: `../spec.md`
- **Source lineage**: `../../002-default-mode-policy-research/research/lineages/sol-oob/`
