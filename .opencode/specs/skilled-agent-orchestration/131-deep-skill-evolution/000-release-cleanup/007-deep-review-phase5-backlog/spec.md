---
title: "Feature Specification: deep-review phase-5 backlog remediation (007 phase parent)"
description: "Nested phase parent closing the 22 deferred logic gaps from 003-deep-review phase-5 deep-research. Two children: 001-doc-cluster-remediation (feature_catalog entries + verified-closed + won't-fix closures) and 002-reducer-cluster-remediation (reduce-state.cjs behavioral changes reopening ADR-002)."
trigger_phrases:
  - "deep-review phase5 backlog"
  - "007-deep-review-phase5-backlog"
  - "deferred logic gap remediation"
  - "LG-0001 through LG-0033 closure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/007-deep-review-phase5-backlog"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-parent-authored"
    next_safe_action: "author-001-doc-cluster"
    blockers: []
    key_files:
      - "001-doc-cluster-remediation/spec.md"
      - "002-reducer-cluster-remediation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000007000"
      session_id: "131-000-007-phase5-backlog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Structure: phase parent with 2 children (doc cluster + reducer cluster) per operator 'full arc, both clusters' directive"
      - "Origin: 003-deep-review/resource-map.md Phase-5 Augmentation deferred table (24 gaps; LG-0013/0016 already closed by 006)"
      - "Pre-build verification found a large fraction of the backlog already closed by post-audit work (CP scenarios, searchCoverage docs)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: deep-review phase-5 backlog remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup` |
| **Origin** | `003-deep-review/resource-map.md` Phase-5 Augmentation deferred table (24 gaps). LG-0013/LG-0016 already closed by `006-gate-model-reconciliation`. |
| **Handoff Criteria** | Every backlog gap reaches a terminal state (fixed / verified-already-closed / won't-fix), each child passes `validate.sh --strict`, reducer child passes deep-loop-runtime vitest. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `003-deep-review` phase-5 deep-research loop (10 iterations, cli-devin SWE-1.6) surfaced 33 cumulative logic gaps. Nine were closed inline, 24 were deferred to follow-on with rationale. The `006-gate-model-reconciliation` packet then closed the 4-gap gate-model cluster (LG-0013/0016/0031/0032). That leaves 22 deferred gaps split into two risk profiles: safe documentation gaps and loop-critical reducer-behavior gaps that ADR-002 fenced off during the 003 packet.

A pre-build verification pass (2026-05-23) found that several deferred gaps were already closed by work that shipped after the phase-5 audit (the review-depth-v2 rollout, the CP stress-test scenarios, and the resume/migration playbook scenarios). The backlog is therefore staler than the 003 summary implied, and remediation must verify current state per gap before authoring.

### Purpose

Drive every one of the 22 remaining backlog gaps to a terminal state with evidence. "Leave nothing deferred" means each gap is either fixed, verified as already-closed (with the closing artifact cited), or formally marked won't-fix with rationale. Work splits across two children by risk profile.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the two leaf children.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 001-doc-cluster-remediation: documentation gaps (feature_catalog dedicated entries, verified-closed annotations, won't-fix closures).
- 002-reducer-cluster-remediation: behavioral changes to `scripts/reduce-state.cjs` (reopening ADR-002) plus vitest coverage, for the reducer gaps that current-state verification confirms are still genuinely open.
- Updating `003-deep-review/resource-map.md` Phase-5 Augmentation to record the terminal state of every gap.

### Out of Scope

- Re-running the phase-5 deep-research loop.
- Changes to the YAML workflows or the SKILL.md Smart Router.
- Gaps already closed by `006-gate-model-reconciliation` (LG-0013/0016/0031/0032).

### Files Changed (cumulative across both children)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `007-deep-review-phase5-backlog/spec.md` | Create | This file (phase-parent lean trio) |
| `007-deep-review-phase5-backlog/{description,graph-metadata}.json` | Create | Parent metadata |
| `007-deep-review-phase5-backlog/001-doc-cluster-remediation/**` | Create | Doc child spec set + feature_catalog edits |
| `007-deep-review-phase5-backlog/002-reducer-cluster-remediation/**` | Create | Reducer child spec set + reduce-state.cjs + tests |
| `.opencode/skills/deep-review/feature_catalog/**` | Modify | New dedicated entries (genuinely-open gaps) |
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Modify | Reducer behavioral changes (002, if confirmed open) |
| `003-deep-review/resource-map.md` | Modify | Terminal-state annotation per gap |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Child | Folder | Theme | Gaps | Status |
|-------|--------|-------|------|--------|
| 001 | `001-doc-cluster-remediation/` | feature_catalog dedicated entries (LG-0009/0010/0011/0012/0014/0015) + verified-closed (LG-0007/0028/0029/0030) + won't-fix (LG-0021/0026/0027) | 13 | In Progress |
| 002 | `002-reducer-cluster-remediation/` | reduce-state.cjs behavioral changes reopening ADR-002 (LG-0001/0002/0003/0004/0005/0006/0008/0023/0033), per-gap verification first | 9 | Planned |

### Phase Transition Rules

- 001 (doc-only, no runtime risk) runs first and ships independently.
- 002 (reducer code, loop-critical) runs second; each gap is re-verified against current `reduce-state.cjs` before any code change, and the deep-loop-runtime vitest suite gates completion.
- Both children carry no implicit ordering dependency on each other beyond sequencing for safety.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **ADR-002 reopening**: 002 deliberately reverses the 003-packet-scoped ADR-002 (reducer was bug-scan only in that packet). The reversal is authorized by the operator's "full arc, both clusters" directive. Each reducer change must ship with vitest coverage.
- **By-design gaps**: some reducer gaps (graphEvents, traceabilityChecks) may be MCP-handler responsibilities rather than reducer responsibilities. 002 classifies each before deciding fix-vs-document.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Children**: `001-doc-cluster-remediation/`, `002-reducer-cluster-remediation/`
- **Origin**: `../003-deep-review/resource-map.md` Phase-5 Augmentation, `../003-deep-review/research/convergence-summary.md`
- **Predecessor**: `../006-gate-model-reconciliation/` (closed the gate-model cluster)
- **Graph Metadata**: see `graph-metadata.json` for `derived.last_active_child_id`
