---
title: "Feature Specification: Post-019 Skill-Routing Research"
description: "Defines the bounded research scope for unresolved fleet-wide skill-routing questions surfaced by packet 019."
trigger_phrases:
  - "post-019 skill routing"
  - "threshold recovery provenance"
  - "advisor confidence calibration"
  - "leaf telemetry"
  - "route holdout"
importance_tier: "important"
contextType: "research"
parent: "sk-doc/019-skill-routing-refactor"
---
# Feature Specification: Post-019 Skill-Routing Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-24 |
| **Branch** | Current workspace |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `017-post-019-alignment` (folder-order adjacency) |
| **Successor** | `019-routing-drift-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 019 surfaced high-value questions about fleet-wide routing decomposition, confidence calibration, leaf-use telemetry, route-budget selection, and fixture generalization, but did not settle them with operational evidence.

### Purpose

Run a bounded 10-iteration evidence-gathering loop that tests those hypotheses against the live tree and packet 019 evidence without implementing routing changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->
### In Scope

- All 12 skill hubs and their routing archetypes
- Advisor confidence and selective auto-routing evidence
- Cross-runtime leaf-use telemetry and causal attribution
- Required/supplemental versus monolithic leaf selection under a route budget
- Generalization of route-gold and typed fixtures to unseen natural prompts

### Out of Scope

- Implementing router, advisor, telemetry, or fixture changes
- Reopening settled packet 019 conclusions without contradictory evidence
- Expanding beyond skill-routing behavior and its verification surfaces

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Create/Update | Workflow-owned state, iterations, synthesis, and evidence map |
| `spec.md` | Bounded update | Generated deep-research context and findings fence only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->
### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Test the five bound research questions against live evidence | Each question has cited findings, explicit uncertainty, or a documented evidence gap |
| REQ-002 | Preserve workflow route proof for every iteration | Every canonical iteration record names the deep-research agent, research mode, and resolved route |
| REQ-003 | Complete the forced-depth run | Exactly 10 valid iteration artifacts exist unless a safety or unrecoverable-state stop occurs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Record negative knowledge | Ruled-out directions and failed approaches are cited and synthesized |
| REQ-005 | Keep research separate from implementation | No researched source file is modified by a leaf iteration |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten mechanically validated iteration records and narratives are present.
- **SC-002**: The synthesis distinguishes confirmed evidence, falsified hypotheses, unresolved questions, and recommended experiments.
- **SC-003**: The route-proof, reducer, resource-map, bounded spec write-back, and continuity-save gates complete or report exact blockers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 019 evidence and live hub files | Missing or stale evidence can weaken conclusions | Cite exact paths and mark unavailable evidence explicitly |
| Risk | Fixture circularity | Authored tests may encode the hypothesis being evaluated | Separate authored-fixture results from unseen-prompt evidence |
| Risk | Quantized confidence interpretation | Policy scores may be mistaken for calibrated probabilities | Evaluate operational reliability and abstention behavior separately |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does Threshold-Recovery-Provenance hold across routing archetypes, and is authority a fourth coordinate?
- How should advisor confidence be calibrated from operational evidence?
- What telemetry minimally proves ordered, successful, causally attributable leaf use?
- Does two-tier leaf selection outperform monolithic unioning within a preregistered route budget?
- Do route-gold and typed fixtures generalize to unseen natural prompts?

### Research Context

Deep research is active for this topic. `research/research.md` remains the canonical findings source.
<!-- /ANCHOR:questions -->
