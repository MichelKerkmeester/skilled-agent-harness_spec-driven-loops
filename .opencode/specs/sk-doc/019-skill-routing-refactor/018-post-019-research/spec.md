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
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/018-post-019-research"
    last_updated_at: "2026-07-25T07:47:34Z"
    last_updated_by: "opencode"
    recent_action: "Synthesized eight completed research iterations and recorded the manual stop"
    next_safe_action: "Plan the measurement contract and privacy-approved operational study"
    completion_pct: 100
---
# Feature Specification: Post-019 Skill-Routing Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (manual stop after 8 iterations) |
| **Created** | 2026-07-24 |
| **Branch** | Current workspace |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 019 surfaced high-value questions about fleet-wide routing decomposition, confidence calibration, leaf-use telemetry, route-budget selection, and fixture generalization, but did not settle them with operational evidence.

### Purpose

Run a bounded evidence-gathering loop that tests those hypotheses against the live tree and packet 019 evidence without implementing routing changes. The operator approved synthesis after eight completed iterations and prohibited iterations 9-10.
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
| REQ-003 | Complete the bounded run or record an approved stop | Eight valid iteration artifacts exist and the user-requested stop is recorded as `manualStop` before synthesis |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Record negative knowledge | Ruled-out directions and failed approaches are cited and synthesized |
| REQ-005 | Keep research separate from implementation | No researched source file is modified by a leaf iteration |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Eight mechanically valid iteration records and narratives are present; iterations 9-10 are not represented as completed.
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

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: JSONL state remains append-only and reducer outputs remain deterministic.
- **NFR-P01**: Raw prompts are not required for the proposed causal evaluation join.
- **NFR-S01**: Natural-prompt gold remains inside a trusted research environment with split roles.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A dangling iteration start is not counted as a completed iteration.
- Answer statements may differ from the corresponding strategy question text.
- Singular hubs contribute execution/outcome evidence without a non-vacuous internal selection score.
- Missing graph convergence is reported as a limitation rather than converted into fabricated evidence.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Which approved operational prompt source and retention policy can support the sealed sampling frame?
- What per-stratum sample sizes and error budgets are required?
- Can every runtime emit the prompt-free decision/start/finish/outcome contract?
- What equal pair-count and context-cost budgets should govern the paired selection ablation?

### Research Context

Deep research reached terminal synthesis after eight iterations. `research/research.md` is the canonical findings source.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
- `research/research.md`
<!-- /ANCHOR:related-docs -->
