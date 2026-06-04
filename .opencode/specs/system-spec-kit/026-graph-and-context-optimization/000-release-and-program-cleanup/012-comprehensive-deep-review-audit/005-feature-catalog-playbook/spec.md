---
title: "Feature Specification: Feature Catalog + Testing Playbook Verification Slice"
description: "Deep-review slice auditing feature-catalog-to-code traceability and manual-testing-playbook verification coverage for unverified or drifted entries."
trigger_phrases:
  - "feature catalog verification"
  - "playbook coverage audit"
  - "catalog code traceability"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Feature Catalog + Testing Playbook Verification Slice

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
| **Created** | 2026-06-04 |
| **Branch** | `wt/0006-deep-review-audit` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit feature catalog (~412KB, 24 themes) and manual testing playbook (~293KB) claim a large set of features and verification procedures. The user specifically flagged "playbooks or feature catalogs not verified". This slice audits whether catalog entries have real code backing and whether the playbook actually verifies the cataloged features.

### Purpose
Audit feature-catalog-to-code traceability and playbook coverage, reporting entries that lack code references, features without test procedures, and catalog descriptions that drift from actual code behavior. READ-ONLY review. Sample across themes; do not require reading every entry.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Review these artifacts and assess traceability/coverage:

- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` (master index)
- `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/214-feature-catalog-code-references.md` (code-reference traceability)
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` (master index)
- `.opencode/skills/system-spec-kit/manual_testing_playbook/` items that validate catalog annotation/name validity (e.g. 231, 232)
- A sample of theme sub-files under `feature_catalog/<NN>--*/` cross-checked against actual code

### Review Focus
- Catalog entries without corresponding code references (item 214 traceability gaps).
- Feature names not validated by the playbook grep checks (items 231/232).
- Playbook does not mirror catalog (features with no test procedure).
- Catalog/playbook descriptions drifting from actual code behavior.

### Out of Scope
- Modifying any reviewed file (read-only review)
- Exhaustively reading every catalog/playbook entry (sample across themes)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/**` | Review | Audit catalog-to-code traceability + unverified entries |
| `manual_testing_playbook/**` | Review | Audit playbook coverage vs catalog |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Assess catalog-to-code traceability | Unbacked/unverified entries flagged with evidence |
| REQ-002 | Assess playbook coverage vs catalog | Coverage gaps flagged with evidence |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Catalog/playbook verification gaps assessed across a representative sample with a recorded verdict


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent audit packet**: See `../spec.md`

<!-- /ANCHOR:related-docs -->

---
