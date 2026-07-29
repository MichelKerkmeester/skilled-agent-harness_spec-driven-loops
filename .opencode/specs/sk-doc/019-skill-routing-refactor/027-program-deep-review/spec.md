---
title: "Feature Specification: Skill-Metadata Program Deep Review"
description: "Two-model deep review (SOL-high + GLM-high, 5 iterations each, no early convergence) of the complete skill-metadata program landed at a39e6ea716, covering the H/S class contract, fleet gate, command-metadata standard, JSON templates, creation-journey fixes, doctrine sweep, and advisor ingestion-seam watcher."
trigger_phrases:
  - "skill metadata program deep review"
  - "review the metadata contract program"
  - "deep review verdict metadata"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/027-program-deep-review"
    last_updated_at: "2026-07-29T04:23:14Z"
    last_updated_by: "claude-code"
    recent_action: "Ran the two-lineage review; synthesized findings; fixed the P1"
    next_safe_action: "Operator decides on the P2 hardening backlog"
    blockers: []
    key_files:
      - "spec.md"
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-program-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Both lineages independently returned CONDITIONAL with the CI-trigger gap as the sole P1"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Skill-Metadata Program Deep Review

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The skill-metadata program (commit range `2fa9fc480c..a39e6ea716`) landed six packets of contract, gate, template, journey, doctrine, and watcher work across many sessions and two writer models. Before the program is considered settled it needs an independent, adversarial read: does the code do what the docs claim, are there silent-failure paths, and is the enforcement actually wired. This packet runs that review with two models at high effort and no early convergence, then records the verdict and remediation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

Review target: the whole program as landed — the contract library and fleet gate, the command-metadata standard and core schema, the JSON template set, the creation-journey fixes, the doctrine coherence sweep, and the advisor ingestion-seam watcher, plus the CI and pre-push wiring. Two lineages (`sol-high` GPT-5.6-SOL, `glm-high` GLM-5.2), 5 iterations each, stop-policy max-iterations. Findings only during the loop; the single cross-confirmed P1 is fixed in this packet, P2s are recorded as a backlog. Out of scope: implementing the P2 hardening (operator-gated).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages run to the configured iteration cap | 5/5 iterations each, dimensions covered |
| REQ-002 | Findings verified against source before action | Each acted finding cites file:line and is re-confirmed |
| REQ-003 | The single P1 is closed | command-metadata.json added to both CI paths filters; workflow parses |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Consolidated verdict recorded with cross-lineage convergence marked; the P1 CI-trigger gap fixed and verified (grep returns the path entry in both blocks, YAML parses); ten P2 findings catalogued with evidence for an operator-gated backlog; per-lineage evidence preserved under review/lineages/.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Graphless review (Spec Memory MCP was down) could miss structural issues | Findings rest on direct source reads + passing scoped tests; noted as a caveat in the report |
| Risk | SOL killed before writing its own report | Terminal synthesis reconstructed from its five iteration files, which carry the full JSON finding records |
| Dependency | The program under review (packets 021-026) | Reviewed at the exact landed tip a39e6ea716 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The ten P2 findings are a hardening backlog; whether to schedule them as a packet is an operator decision recorded in the report's remediation lanes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Consolidated report**: `review/review-report.md`
- **Per-lineage evidence**: `review/lineages/sol-high/`, `review/lineages/glm-high/`
- **Program under review**: predecessor packets 021-026 under `../`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `026-advisor-ingestion-seam` |
| **Successor** | none |
