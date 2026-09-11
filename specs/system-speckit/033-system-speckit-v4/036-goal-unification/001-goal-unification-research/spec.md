---
title: "Feature Specification: Goal unification research"
description: "Fifteen sequential deep-research iterations, ten on deepseek-v4.1-flash and five on glm-5.3-flash through llmgateway via cli-pi, no early convergence, closing eight angles on binding, strip, store fate, resend, runtimes, isolation, authority and budget."
trigger_phrases:
  - "goal unification research"
  - "goal binding research"
  - "goal store fate"
  - "frontmatter strip research"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Goal unification research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-decisions-and-contract-freeze |
| **Handoff Criteria** | See the parent Phase Handoff Criteria row for this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Goal unification: packet goal.md as the single goal surface across runtimes specification.

**Scope Boundary**: A cited, ranked synthesis that lets 002 freeze every decision with a chosen option, a rejected option and an enforcement site.

**Dependencies**:
- Operator-set parent goal; pi on PATH; llmgateway key exported

**Deliverables**:
- Two fan-out runs on this folder: run 1 deepseek-v4.1-flash 10 iterations, run 2 glm-5.3-flash 5 iterations seeded from run 1
- A strategy file with eight rotating angles and a per-iteration allocation
- A fresh-model `research/synthesis.md` ranked and cited

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Seven design decisions must be frozen before any code changes, and each one is a judgment call the repository cannot settle by grep. Session-to-packet binding, the fate of the legacy state store and the resend cadence all have failure modes that only show under concurrent sessions or repeated edits.

### Purpose
A cited, ranked synthesis that lets 002 freeze every decision with a chosen option, a rejected option and an enforcement site.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Two fan-out runs on this folder: run 1 deepseek-v4.1-flash 10 iterations, run 2 glm-5.3-flash 5 iterations seeded from run 1
- A strategy file with eight rotating angles and a per-iteration allocation
- A fresh-model `research/synthesis.md` ranked and cited
- Salvage of `research/research.md` even when a lineage ends in a containment fatal

### Out of Scope
- Any code change in `.opencode/`
- Changes to the deep-loop runtime, fanout driver or cli-pi roster

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/deep-research-strategy.md` | Create | Eight angles, allocation, deliverables, evidence discipline |
| `research/deep-research-fanout-config.json` | Create | Two configs, one per run |
| `research/research.md` | Create | Merged synthesis written by the loop |
| `research/synthesis.md` | Create | Ranked decision-ready distillation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 1 completes 10 iterations on deepseek-v4.1-flash with stop policy max-iterations | 10 iteration files and a synthesis event in the state ledger |
| REQ-002 | Run 2 completes 5 iterations on glm-5.3-flash and its first iteration cites run 1's research.md | Iteration 1 of the glm lineage references run 1 findings |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every angle has at least one iteration with file:line or URL citations | Angle coverage table in synthesis.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 15 iteration files exist across both lineages, counted from the state ledgers
- **SC-002**: `research/synthesis.md` ranks the options for each of the seven decisions with citations that resolve
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | llmgateway credit or 429 window | Run stalls | Retry with maxRetries 5, then pause and report |
| Risk | Run 2 does not see run 1 findings | GLM repeats deepseek work | Seed gate before run 2: check the strategy Known Context and iteration 1 cite run 1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether fan-out seeding via research-topic and resource-map.md is enough, or the resume lifecycle mode is needed for run 2
<!-- /ANCHOR:questions -->

---


