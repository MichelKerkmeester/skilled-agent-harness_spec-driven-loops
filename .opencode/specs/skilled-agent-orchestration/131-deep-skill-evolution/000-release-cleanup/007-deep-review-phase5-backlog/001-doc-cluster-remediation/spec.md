---
title: "Feature Specification: deep-review doc-cluster backlog remediation (001)"
description: "Close the documentation half of the 003-deep-review phase-5 backlog: author 6 dedicated feature_catalog entries for genuinely-open gaps, record verified-already-closed gaps with citing artifacts, and formally mark won't-fix gaps with rationale."
trigger_phrases:
  - "doc cluster remediation"
  - "feature_catalog dedicated entries"
  - "deep-review backlog doc gaps"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/007-deep-review-phase5-backlog/001-doc-cluster-remediation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "spec-authored"
    next_safe_action: "author-feature-catalog-entries"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000007001"
      session_id: "131-000-007-001-doc"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "6 feature_catalog gaps verified genuinely-open (no dedicated entry): LG-0009/0010/0011/0012/0014/0015"
      - "LG-0007/0028/0029/0030 verified already-closed by post-audit work"
      - "LG-0021/0026/0027 are won't-fix (design-correct / architectural / historical)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Feature Specification: deep-review doc-cluster backlog remediation

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/007-deep-review-phase5-backlog` |
| **Origin** | `003-deep-review` phase-5 deferred backlog, documentation gaps |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `003-deep-review` phase-5 loop deferred a set of documentation gaps. Pre-build verification (2026-05-23) classified each against current skill state:

| Gap | Severity | Verified state | Disposition |
|---|---|---|---|
| LG-0009 | P1 | No feature_catalog entry for Resource Map Coverage Gate | OPEN, author entry |
| LG-0010 | P1 | No feature_catalog entry for semanticNovelty + findingStability | OPEN, author entry |
| LG-0011 | P1 | No feature_catalog entry for Security-Sensitive Fix Overrides | OPEN, author entry |
| LG-0012 | P2 | No feature_catalog entry for Executor Selection Contract | OPEN, author entry |
| LG-0014 | P1 | graph_convergence only mentioned in passing, no dedicated entry | OPEN, author entry |
| LG-0015 | P2 | pause sentinel only mentioned in passing, no dedicated entry | OPEN, author entry |
| LG-0007 | P2 | state_format.md already documents searchCoverage/searchLedger/reviewDepthSchemaVersion (lines 469-582) | ALREADY CLOSED |
| LG-0028 | P2 | DRV-006 covers legacy state migration (`step_migrate_legacy_review_state`) | ALREADY CLOSED |
| LG-0029 | P2 | DRV-005 covers resume/restart/completed session classification | ALREADY CLOSED |
| LG-0030 | P2 | DRV-019 covers stuck detection and recovery | ALREADY CLOSED |
| LG-0021 | P2 | 4 thresholds documented in YAML not config.json | WON'T FIX (design-correct split) |
| LG-0026 | P1 | review-depth-reducer.vitest.ts test location | WON'T FIX (architectural, not docs) |
| LG-0027 | P2 | v1.3.1.0 changelog filename typo | WON'T FIX (historical, preserved per AF-0019) |

### Purpose

Bring every documentation-side backlog gap to a terminal state. Author dedicated feature_catalog entries for the 6 genuinely-open gaps, and record the verified-closed and won't-fix dispositions with citing evidence in the `003-deep-review` resource-map and this packet's implementation-summary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Author 6 dedicated feature_catalog entries (placements below) and add their summary rows + counts to `feature_catalog/feature_catalog.md`.
- Annotate the `003-deep-review/resource-map.md` Phase-5 Augmentation table with the terminal state of each doc gap.

### Out of Scope

- Reducer code changes (handled by sibling `002-reducer-cluster-remediation`).
- The gate-model cluster already closed by `006-gate-model-reconciliation`.

### Files to Change

| File Path | Change Type | Gap |
|-----------|-------------|-----|
| `feature_catalog/01--loop-lifecycle/07-resource-map-coverage-gate.md` | Create | LG-0009 |
| `feature_catalog/01--loop-lifecycle/08-executor-selection-contract.md` | Create | LG-0012 |
| `feature_catalog/02--state-management/06-graph-convergence-event.md` | Create | LG-0014 |
| `feature_catalog/02--state-management/07-pause-sentinel.md` | Create | LG-0015 |
| `feature_catalog/04--severity-system/06-convergence-signals.md` | Create | LG-0010 |
| `feature_catalog/04--severity-system/07-security-sensitive-fix-overrides.md` | Create | LG-0011 |
| `feature_catalog/feature_catalog.md` | Modify | Add 6 summary rows + bump counts |
| `../../003-deep-review/resource-map.md` | Modify | Terminal-state annotations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 6 dedicated feature_catalog entries authored with real contract content sourced from live docs | `grep` for each feature term returns a dedicated file, not a passing mention |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Root `feature_catalog.md` index lists the 6 new entries with correct counts | index entry count matches disk |
| REQ-011 | Verified-closed gaps (LG-0007/0028/0029/0030) annotated with the closing artifact | resource-map cites DRV-005/006/019 + state_format lines |
| REQ-012 | Won't-fix gaps (LG-0021/0026/0027) annotated with rationale | resource-map records disposition |
| REQ-013 | HVR clean on all authored files | 0 em-dashes, 0 prose semicolons, 0 banned words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 genuinely-open feature_catalog gaps have dedicated entries linked from the root index.
- **SC-002**: Strict validate exits 0 on this spec folder.
- **SC-003**: Every doc-cluster gap in the `003-deep-review` resource-map has a terminal-state annotation.
- **SC-004**: No reducer code or YAML touched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | feature_catalog index count drifts from disk | Low | Recount files after authoring; update index table |
| Risk | Authored entry duplicates an existing passing mention | Low | Verified each target has no dedicated file before authoring |
| Dependency | Live docs (convergence.md, loop_protocol.md, state_format.md) as content source | Read-only | Verified present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Documentation-only. No runtime behavior change. feature_catalog files are read references, not executed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **A "missing" feature already has passing coverage**: LG-0014 and LG-0015 have passing mentions but no dedicated entry. The new entries consolidate the contract into one referenceable file rather than scattered mentions.
- **A gap turns out already-closed mid-authoring**: record it as verified-closed with the closing artifact rather than authoring redundant content.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 6 new feature_catalog files + index update + resource-map annotations |
| Risk | 3/25 | docs-only, no code/YAML, no cross-reference cascade |
| Research | 5/20 | per-gap current-state verification already done |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. All dispositions resolved during pre-build verification.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent**: `../spec.md`
- **Origin**: `../../003-deep-review/resource-map.md` Phase-5 Augmentation
