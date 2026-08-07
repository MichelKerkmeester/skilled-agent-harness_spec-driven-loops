---
title: "Feature Specification: Deep-Dive — Typed No-Destination Outcomes"
description: "Five-iteration SOL xhigh-fast deep-research lineage on replacing the undifferentiated null / silent-default zero-signal case with a typed router-owned control result (idle / no-match / dependency-failure / degraded-fallback / handoff-required plus defer / clarify), borrowing state distinctions from OS idle, IP no-route, DNS NXDOMAIN/NODATA, load-balancer fail-open, and no-wrong-door intake, with policy-versioned negative caching and a fail-open posture that is visible and forbidden for mutation-capable requests."
trigger_phrases:
  - "typed no-destination deep dive"
  - "no route control outcomes"
  - "typed defer instead of null"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: templates/spec.md -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: Typed No-Destination Outcomes

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | Important |
| **Status** | Research complete; typed-result implementation remains outside this packet |
| **Created** | 2026-07-18 |
| **Packet** | `003-typed-no-destination` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current zero-signal state can collapse genuine no-work, no-match, dependency failure, degradation, handoff, and clarification needs into one bare `null` or a guessed default. That ambiguity lets callers confuse abstention with authority and makes failures indistinguishable from uncertain requests.

### Purpose

Define a closed, router-owned control contract that distinguishes `route`, `clarify`, and `defer`, attaches precise bases or reasons, and grants execution authority only to valid routes. The design reframes `defaultMode: null` without re-litigating the previously shipped configuration changes.

### Research Context

Seed evidence is `../../002-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-003.md` plus that lineage's sections 4.3 and 11(1). The cross-domain state distinctions come from Linux idle behavior, IP and DNS no-route states, load-balancer fail-open behavior, and no-wrong-door intake. The retained `presentation.md` records the completed five-iteration synthesis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Five-iteration research on typed outcomes, bounded defaults, negative caching, degraded fail-open, and schema migration.
- Explicit evaluation of advisor evidence, deterministic route-gold, and document-only operation.
- A retained plain-language synthesis in `presentation.md`.

### Out of Scope

- Implementing the typed schema, cache, caller migration, or route-gold fixtures.
- Editing the shared scorer.
- Reversing or re-deriving the shipped `defaultMode` decisions.

### Packet Artifacts

| File | Role |
|------|------|
| `spec.md` | Research charter and typed-control requirements |
| `presentation.md` | Retained five-iteration synthesis |
| `plan.md`, `tasks.md`, `checklist.md` | Canonical planning and verification surfaces |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Research Contract

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define a closed typed result contract. | `presentation.md` separates `route`, `clarify`, and `defer`, with authority only on `route`. |
| REQ-002 | Define bounded-default and degraded-fallback proofs. | The synthesis lists their required predicates and excludes unsafe mutation-capable fallback. |
| REQ-003 | Define safe negative caching. | The synthesis limits caching to negative results, binds identity and expiry, excludes raw prompts, and treats misses as fresh routing. |
| REQ-004 | Define a dual-read migration from legacy defaults and nulls. | The synthesis maps legacy states conservatively and keeps typed results in shadow until callers migrate. |

### P1 - Cross-Cutting Evaluation

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Evaluate system-skill-advisor integration. | `presentation.md` treats advisor output as evidence, never caller authority. |
| REQ-006 | Evaluate benchmark integration. | `presentation.md` requires whole-result typed gold and falsifying cases for each proof term. |
| REQ-007 | Evaluate standalone document-only routing. | `presentation.md` permits only predicates supported by current docs and requires a visible typed negative otherwise. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The design distinguishes no-work, no-match, dependency failure, handoff, clarification, bounded default, and degraded fallback without a bare null.
- Execution authority is representable only on a valid route; negative results visibly withhold it.
- Negative caching cannot convert abstention into a default and invalidates with decision-relevant identity changes.
- Advisor, benchmark, and document-only roles are bounded separately, with no implementation claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Typed consumers and route-gold fixtures | Rich outcomes are ineffective if callers collapse them back to null or a default | Use dual-read migration and deep-compare whole typed results |
| Risk | Bounded default becomes a final `else` | Zero signal could manufacture authority | Require every proof term before returning `route(bounded-default)` |
| Risk | Stale negative cache | A no-route decision can outlive the evidence or policy that produced it | Bind all decision identities and expire at the earliest evidence boundary |
| Risk | Degraded fallback widens mutation authority | Availability pressure could permit an unsafe write | Restrict to visible read-only, non-destructive operation and never cache it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Safety**: `clarify` and `defer` always withhold execution authority.
- **Determinism**: typed route-gold deep-compares decision, basis or reason, targets, recovery, and exact authority scope.
- **Privacy**: negative-cache keys exclude raw prompts and secrets and use opaque normalized request identity.
- **Compatibility**: legacy null and named defaults migrate conservatively through dual-read shadowing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- No work must produce `idle`, not `no-match` or a default route.
- Dependency outage must remain distinguishable from ambiguous user intent.
- Cache corruption or outage triggers fresh routing and cannot widen authority.
- Missing fresh health or caller-authority evidence in document-only operation yields a visible typed negative.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

The packet retains its declared Level 2 classification because it changes a cross-caller decision contract and requires migration and verification analysis. No numeric score is reconstructed from the retained artifacts.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What final enum and reason taxonomy should be normative across all callers?
- Which exact predicates and health evidence certify bounded defaults and degraded fallbacks?
- What route-gold matrix and migration sequence prove that no caller collapses typed negatives back into a guessed route?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Five-iteration synthesis**: `presentation.md`
- **Parent phase map**: `../spec.md`
- **Source lineage**: `../../002-default-mode-policy-research/research/lineages/sol-oob/`
