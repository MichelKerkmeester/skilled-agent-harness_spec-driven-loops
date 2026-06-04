---
title: "Feature Specification: Governance + sk-doc + sk-code Drift Review Slice"
description: "Deep-review slice auditing constitutional rules versus enforcement and sk-doc/sk-code standards conformance drift."
trigger_phrases:
  - "constitutional rule audit"
  - "sk-doc drift"
  - "sk-code drift"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Governance + sk-doc + sk-code Drift Review Slice

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
The constitutional rules govern spec-kit behavior, and sk-doc / sk-code define documentation and code standards. The user flagged "inconsistencies with sk-doc, sk-code". This slice audits whether constitutional rules are actually enforced and whether sk-doc/sk-code standards drift from what the repo practices.

### Purpose
Audit constitutional rules versus actual enforcement and sk-doc/sk-code standards conformance, reporting unenforced rules, contradictory guidance, and standards drift. READ-ONLY review.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Review these standards/governance sources and assess conformance drift:

- `.opencode/skills/system-spec-kit/constitutional/` (all rule files + README)
- `.opencode/skills/sk-doc/SKILL.md` + `.opencode/skills/sk-doc/assets/` (templates, changelog/readme/skill templates)
- `.opencode/skills/sk-code/SKILL.md` + `.opencode/skills/sk-code/assets/` (authoring checklists, recipes, verification contracts)

### Review Focus
- Constitutional rules with no enforcement mechanism, or contradicted by actual repo practice / other rules.
- sk-doc: template/voice/section-order rules that contradict the templates the repo actually uses (cross-check against the example packets and changelog template).
- sk-code: surface-detection + authoring-checklist contracts that drift from how `.opencode/` code is actually authored/verified.
- Internal contradictions between AGENTS.md/CLAUDE.md guidance and the constitutional rules.

### Out of Scope
- Modifying any reviewed file (read-only review)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/constitutional/**` | Review | Audit rule enforcement + contradictions |
| `sk-doc/**` | Review | Audit doc-standards conformance drift |
| `sk-code/**` | Review | Audit code-standards conformance drift |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit constitutional rules vs enforcement | Unenforced/contradicted rules flagged with evidence |
| REQ-002 | Audit sk-doc/sk-code standards drift | Conformance gaps flagged with evidence |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Governance + sk-doc/sk-code drift assessed with a recorded verdict


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent audit packet**: See `../spec.md`

<!-- /ANCHOR:related-docs -->

---
