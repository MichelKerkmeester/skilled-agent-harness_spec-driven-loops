---
title: "Feature Specification: Find every surface an sk- prefix rename touches"
description: "Two independent models on two CLIs enumerate every consumer of a mode packet directory or workflowMode key, so the rename phases start from a found surface rather than a guessed one."
trigger_phrases:
  - "sk prefix rename research"
  - "mode rename surface discovery"
importance_tier: "critical"
contextType: "research"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Find Every Surface An sk- Prefix Rename Touches

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/001-surface-research |
| **Level** | 2 |
| **Status** | Complete |
| **Executors** | Grok 4.5 high via cli-cursor, GLM 5.2 via cli-devin, five iterations each |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Twenty packet directories and twenty-one routing keys are about to change. A mode name is not
confined to a path: it appears in registries, routers, generated manifests, advisor metadata,
benchmark gold, command bindings, agent definitions, runtime mirrors and prose. Some of those
positions are typed and safe to rewrite; others are free text where a bare key like `quality` or
`interface` collides with ordinary English.

A rename that misses a consumer class does not fail loudly. It routes to a directory that no longer
exists, or scores gold that no longer matches, and the damage surfaces later as a mystery.

This phase exists to make that surface known before anything moves.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Every file that reads a packet directory name or a `workflowMode` value for the four sk- hubs.
- Classification of each occurrence as a typed position, a path position, or free prose.
- The generated artifacts that must be rebuilt rather than edited.
- Ordering constraints: what must change before what.

### Out of Scope

- Performing any rename. This phase reads and reports.
- The three non-sk hubs.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Consumer classes enumerated | Each class named with a representative path and the field or pattern that carries the name |
| REQ-002 | Typed versus prose separated | Every class marked safe-to-sweep or requires-judgment, with the collision risk stated |
| REQ-003 | Generated artifacts identified | Files that must be regenerated are distinguished from files that are edited |
| REQ-004 | Ordering constraints stated | Any dependency where one surface must change before another is recorded |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verification levers named | For each class, the command that proves it is correct after the rename |
| REQ-006 | Independent corroboration | Where the two lineages disagree, the disagreement is recorded rather than averaged away |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A later phase can execute the rename without discovering a consumer class this phase missed.
- Every occurrence is classified, so no sweep runs against free prose by accident.
- The two lineages ran independently enough that agreement is evidence rather than an echo.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A model reports a plausible surface it did not verify | Findings carry a file and a line; unverifiable claims are marked as such rather than accepted |
| Both lineages miss the same class | Two different models on two different CLIs, prompted to search by different strategies |
| Bare keys collide with English | Collision risk is a required field per class, not an afterthought |

**Dependencies:** the frozen rename map in the parent packet's assets.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. Whether any consumer stores a mode key in a database or cache that a filesystem sweep cannot reach.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Read-only:** this phase changes nothing outside its own artifact directory.
- **Evidence-bearing:** a finding without a path and a line is not a finding.
<!-- /ANCHOR:nfr -->
