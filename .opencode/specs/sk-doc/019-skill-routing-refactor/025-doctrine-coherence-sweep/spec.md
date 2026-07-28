---
title: "Feature Specification: Doctrine Coherence Sweep"
description: "Purge every remaining doc statement contradicting the skill-root metadata contract: description.json mislabeled as advisor-facing across five surfaces, the retired command-metadata overlay policy, incomplete required-shape trees in create-skill SKILL.md and README, and missing canonical-contract links across advisor feature-catalog and graph docs."
trigger_phrases:
  - "doctrine coherence sweep"
  - "description json advisor facing stale"
  - "overlay policy leftover"
  - "canonical contract missing links"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/025-doctrine-coherence-sweep"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered and verified"
    next_safe_action: "None"
    blockers: []
      - "Execution awaits operator authorization"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-doctrine-coherence-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "graph-metadata.json is the sole advisor identity input; description.json is doctor-only — the contract is authoritative and the older docs are what drifted"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Doctrine Coherence Sweep

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
| **Research Source** | `../024-create-journey-gate-fixes/research/swarm/lens1-report.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The doc-coherence lens found 22 places where older prose contradicts the metadata contract. The dominant theme: `description.json` is called "advisor-facing" in the description template, the hub template, the hub scaffold, the parent doctrine ("the advisor-routable metadata pair"), and the graph template's derived source list — while the contract, verified against the advisor's ingesters, says it is doctor-only and `graph-metadata.json` is the sole identity input. Beside that: the parent doctrine still restates the retired command-metadata overlay policy; the create-skill SKILL.md "Required Shape" trees and README initializer lists omit the required root JSONs (maintaining second, conflicting file lists); and roughly a dozen advisor feature-catalog/graph docs describe metadata maintenance without linking the canonical contract, which is exactly how restated content drifts.

### Purpose

One authority, everywhere referenced, nowhere restated: every doc touching these files either agrees with the contract or links it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- All 22 lens-1 findings after re-verification: the five advisor-facing mislabels, the overlay leftover in the parent doctrine, the SKILL.md/README shape-tree completions (or replacement with matrix links), the missing canonical-contract links in advisor feature-catalog/graph docs and the router-schema related list, and the graph template's derived source list dropping description.json.
- Version bumps on every edited authored doc.

### Out of Scope

- Anything functional (templates' validation behavior, scaffolder, generator) — sibling 024.
- Advisor ingestion/refresh behavior — sibling 026.

### Files to Change

| Surface | Count |
|---------|-------|
| create-skill assets (description/hub/graph templates, hub scaffold) | 4 |
| create-skill SKILL.md + README + references (parent doctrine, router schema) | 4 |
| system-skill-advisor feature-catalog + references + mcp-server READMEs | ~8 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No doc calls description.json an advisor input | `grep -ri "advisor-facing" create-skill` and equivalent probes return only correct usages |
| REQ-002 | The overlay policy restatement is gone | Parent doctrine links the contract's hub-required rule instead |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Shape trees agree with the matrix or link it | No second file-list authority survives in SKILL.md/README |
| REQ-004 | Advisor metadata-maintenance docs link the canonical contract | Each edited doc carries the link; none restates the matrix |
| REQ-005 | Graph template's derived source lists drop description.json | The derived pipeline no longer consumes a file the contract says nothing reads |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A repo-wide probe for the stale phrasings ("advisor-facing description", "advisor-routable metadata pair", "enforcement ... pending") returns zero hits.
- **SC-002**: Fleet gate, freshness, doctor, and both suites unchanged-green (prose-only sweep; only sk-doc's leaf manifest may legitimately churn if reference files change bytes).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Editing reference/asset leaves stales sk-doc's manifest and compiled manifest | Run gate --fix + compiled re-mint as the landing step, as established |
| Dependency | Lens-1 evidence | Re-verify each finding; several files moved recently |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the contract is the settled authority and this sweep is mechanical alignment to it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Source**: `../024-create-journey-gate-fixes/research/swarm/lens1-report.md`
- **Canonical contract**: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `024-create-journey-gate-fixes` |
| **Successor** | `026-advisor-ingestion-seam` |
