---
title: "Spec: 028 Catalog and Playbook Coverage Audit [template:level_2/spec.md]"
description: "Research-only audit of whether packet 028 shipped features into the three system skills without adding them to those skills feature catalogs or testing playbooks. The 20-iteration findings live in research/research.md. No catalog or playbook was modified."
trigger_phrases:
  - "catalog playbook coverage audit"
  - "028 feature catalog gap"
  - "code-graph skill-advisor coverage"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/000-release-cleanup/010-catalog-playbook-coverage-audit"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed 20-iteration coverage audit, synthesized research.md"
    next_safe_action: "Operator decides close-now versus scaffold-cleanup-phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: 028 Catalog and Playbook Coverage Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-22 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 028 shipped many features into three daemon-backed system skills (system-spec-kit, system-code-graph and system-skill-advisor), but the release-cleanup that aligned feature catalogs and testing playbooks only ever touched system-spec-kit, and even there it ran edits-only. No one had confirmed how much catalog and playbook coverage the other two skills were missing.

### Purpose
Produce a verified inventory of every 028 feature that has no feature-catalog entry or testing-playbook scenario across the three skills, separating real gaps from false alarms, without modifying any catalog or playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only audit of feature_catalog and manual_testing_playbook for all three system skills
- A verified gap inventory with a per-surface PRESENT, PARTIAL, MISSING or STALE classification
- A verification pass that clears false positives before they are reported

### Out of Scope
- Closing the gaps. That is a follow-on decision recorded in research/research.md section 6
- Any edit to a feature catalog or a testing playbook
- The deep-loop-workflows catalog ownership decision beyond flagging it

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| research/research.md | Create | The synthesized 20-iteration audit findings |
| research/deltas/ | Create | The twenty per-iteration finding sets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verified inventory of 028 catalog and playbook coverage gaps across the three skills | research/research.md lists each gap with a per-surface classification confirmed by grep |
| REQ-002 | False positives cleared before reporting | The twelve deleted-flag cluster is verified absent-by-design and excluded from the count |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No catalog or playbook modified | git status shows zero changes under the three skills catalog and playbook trees |
| REQ-004 | Per-iteration evidence retained | research/deltas/ holds the twenty finding sets |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Roughly fifty high-confidence coverage gaps documented and attributed to a root cause
- **SC-002**: The deleted-flag false-positive cluster cleared by direct grep and excluded from the gap count
- **SC-003**: Findings reproducible from research/deltas/ and the 028 before-vs-after evidence
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | before-vs-after.md as the canonical 028 shipped-feature inventory | Audit cannot scope features without it | Read sections 1-6 as the feature source of truth |
| Risk | Model-named tool ids may be artifacts | Inflated gap count | Excluded unverified tool-name findings from the count |
| Risk | A keyword match mistaken for real coverage | Missed gaps | Each candidate entry opened and read, not just grepped |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Twenty bounded iterations, one facet each, so every read-only seat stays within context
- **NFR-P02**: Two-model coverage (gpt-5.5-fast and deepseek-v4-pro) to diversify the read

### Security
- **NFR-S01**: Read-only seats only. No seat can mutate a feature catalog or a testing playbook
- **NFR-S02**: Orchestrator owns all state writes, confined to the packet research/ tree

### Reliability
- **NFR-R01**: Every high-count or surprising cluster re-verified by direct grep before it enters the count
- **NFR-R02**: Each candidate entry opened and read, since a keyword match is not coverage
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Zero-match grep: classified MISSING and confirmed by reading the surface
- Keyword-only match: opened and read, classified PARTIAL when the narrative coverage is thin
- Maximum overlap: the broad critic seat deduped against the narrow seats

### Error Scenarios
- Model-named tool id: excluded from the count as unverified, not reported as a gap
- Removed-feature flag: an absent catalog entry is treated as correct, not a gap

### State Transitions
- Edits-only cleanup: features needing a new entry have no catalog home, classified MISSING
- Cross-skill feature: deep-loop ownership flagged as a structural question, not a same-skill omission
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three skills, two surfaces each, plus a cross-cutting runtime |
| Risk | 8/25 | Read-only, no mutation, low blast radius |
| Research | 18/20 | Twenty iterations across two models with a verification pass |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Close the gaps now or scaffold a follow-on cleanup phase that does
- Whether the five Deep Loop features belong in a deep-loop-workflows catalog or in system-spec-kit
<!-- /ANCHOR:questions -->
