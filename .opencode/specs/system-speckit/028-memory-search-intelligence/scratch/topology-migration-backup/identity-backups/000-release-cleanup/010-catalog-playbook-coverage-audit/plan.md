---
title: "Implementation Plan: 028 Catalog and Playbook Coverage Audit [template:level_2/plan.md]"
description: "The approach for a 20-iteration read-only coverage audit run across two models, weighted to the two un-synced skills, with orchestrator-written state and a verification pass. Research-only, no catalog or playbook modified. Status complete."
trigger_phrases:
  - "catalog playbook coverage audit plan"
  - "028 coverage audit approach"
  - "read-only audit iterations plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/000-release-cleanup/010-catalog-playbook-coverage-audit"
    last_updated_at: "2026-07-04T17:31:32.246Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the 20-iteration read-only audit approach"
    next_safe_action: "Operator decides close-now versus scaffold-cleanup-phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-22-plan-010-catalog-playbook-coverage-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 028 Catalog and Playbook Coverage Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Read-only audit, no production code touched |
| **Framework** | opencode-dispatched seats at `--variant high --format json` |
| **Storage** | research/research.md plus research/deltas/ (orchestrator-written) |
| **Testing** | Direct grep verification pass over every high-severity cluster |

### Overview
The audit answers one question across three daemon-backed skills: did packet 028 ship features that were never added to those skills feature catalogs or testing playbooks? It runs twenty read-only iterations alternating openai/gpt-5.5-fast and deepseek/deepseek-v4-pro, weighted toward the two skills the 028 release-cleanup never synced, then verifies every surprising cluster by grep before reporting. This plan is complete and produced research/research.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Audit question stated and scope frozen to the three skills catalog and playbook surfaces
- [x] Success criteria measurable (verified gap count, cleared false positives)
- [x] Dependency on before-vs-after.md as the 028 feature inventory identified

### Definition of Done
- [x] Verified gap inventory written to research/research.md
- [x] Verification pass cleared the deleted-flag false-positive cluster
- [x] No catalog or playbook modified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only seat fan-out with an orchestrator that owns all state writes. An opencode-dispatched edit cannot pass Gate 3, so seats were read-only by design and the orchestrator wrote every delta.

### Key Components
- **Orchestrator**: dispatches the twenty seats, writes deltas, runs the verification pass, synthesizes research.md
- **Per-iteration seat**: reads the 028 before-vs-after evidence for one facet, greps the target surface, opens each candidate entry, classifies coverage
- **Verification pass**: re-checks every surprising or high-count cluster by direct grep before it is reported
- **Synthesis**: dedupes the seat findings into the verified gap inventory

### Data Flow
1. Orchestrator selects a facet and a model for the iteration
2. Seat reads before-vs-after, greps the catalog and playbook surface, opens candidates
3. Seat returns a classified finding set (PRESENT, PARTIAL, MISSING or STALE)
4. Orchestrator writes the delta to research/deltas/
5. Verification pass confirms high-severity clusters by grep
6. Synthesis dedupes and writes research/research.md
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Audit question and three-skill scope frozen
- [x] before-vs-after.md sections 1-6 confirmed as the feature source of truth
- [x] Iteration weighting decided (7 code-graph, 7 skill-advisor, 4 spec-kit, 2 cross-cutting)

### Phase 2: Core Implementation
- [x] Seven code-graph iterations dispatched and recorded
- [x] Seven skill-advisor iterations dispatched and recorded
- [x] Four spec-kit completeness iterations dispatched and recorded
- [x] Two cross-cutting iterations (deep-loop ownership, completeness critic) recorded

### Phase 3: Verification
- [x] Every high-count cluster re-checked by direct grep
- [x] Deleted-flag false-positive cluster cleared, kept-on-flag count corrected from 5 to 4
- [x] Findings deduped and synthesized into research/research.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Coverage grep | Each shipped flag, tool and feature-area key against the three catalogs and playbooks | ripgrep |
| Candidate read | Open each grep hit to confirm real coverage, not a keyword match | Read |
| False-positive verify | Re-grep every surprising or high-count cluster before reporting | ripgrep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| before-vs-after.md (028 shipped-feature inventory) | Internal | Green | Cannot scope features to audit |
| opencode run (gpt-5.5-fast, deepseek-v4-pro) | External | Green | Cannot fan out read-only seats |
| The three skills catalog and playbook trees | Internal | Green | Nothing to audit against |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable. This is a read-only research deliverable that mutated no catalog and no playbook.
- **Procedure**: Delete research/research.md and research/deltas/ to discard the audit. No production surface to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Iterations) ──► Phase 3 (Verify + Synthesize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Iterations |
| Iterations | Setup | Verify |
| Verify | Iterations | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Scope freeze and weighting |
| Iterations | Medium | 20 read-only seats across two models |
| Verify and Synthesize | Medium | Cluster verification plus dedup and write |
| **Total** | | **20 iterations plus a verification pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes (read-only audit)
- [x] No feature flag involved
- [x] No monitoring impact

### Rollback Procedure
1. Delete research/research.md
2. Delete research/deltas/
3. Confirm git status shows no catalog or playbook changes

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
