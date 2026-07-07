---
title: "Feature Specification: deep-skill evolution arc (nested phase parent)"
description: "Nested phase parent for the deep-* skill family evolution arc: eight thematic clusters (release-cleanup + five per-skill clusters + one cross-cutting cluster + one playbook-validation cluster) each owning their own leaf phases."
trigger_phrases:
  - "deep skill evolution arc"
  - "deep stack consolidation"
  - "deep-ai-council rename + iterative"
  - "deep-loop runtime isolation"
  - "deep-research uplift + hygiene"
  - "deep-agent-improvement correctness + evaluator"
  - "deep-stack cross-cutting"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "reorganized to 7 thematic clusters with bridged old paths"
    next_safe_action: "validate.sh --strict --recursive then reindex memory/skill/code graph"
    blockers: []
    key_files:
      - "context-index.md"
      - "merged-phase-map.md"
      - "001-deep-ai-council/spec.md"
      - "002-deep-review/spec.md"
      - "003-deep-loop-runtime/spec.md"
      - "004-deep-research/spec.md"
      - "005-deep-agent-improvement/spec.md"
      - "006-deep-stack-cross-cutting/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000131"
      session_id: "131-phase-parent-nested"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Root structure: 8 thematic clusters (000 release-cleanup + 5 per-skill + 006 cross-cutting + 007 playbook-validation)"
      - "Each cluster is a phase parent with its own lean trio and leaf phases"
      - "Reorganization history lives in context-index.md; exhaustive old->new paths in merged-phase-map.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: deep-skill evolution arc (nested phase parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (nested phase parent) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Last Updated** | 2026-05-26 |
| **Branch** | `main` |
| **Parent Spec** | n/a (root packet under skilled-agent-orchestration) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | 114-small-ai-model-optimization |
| **Successor** | None planned |
| **Handoff Criteria** | Each cluster passes `validate.sh --strict --recursive` independently; memory + skill graph + code graph reindexed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-* skill family — `deep-ai-council`, `deep-review`, `deep-loop-runtime`, `deep-research`, and `deep-agent-improvement` — evolved through many incremental decisions (rename, isolate, iterate, harden, fix, validate). The skilled-agent-orchestration track lacked a single parent that holds that evolution together and lets a maintainer find any decision's home without scanning dozens of sibling folders.

### Purpose

Provide one nested phase parent whose root reads as eight thematic clusters: a release-cleanup meta-cluster, one cluster per deep-* skill, a cross-cutting cluster, and a playbook-validation cluster for work that spans the whole stack. Each cluster is itself a phase parent with its own `spec.md`/`description.json`/`graph-metadata.json` lean trio and owns the leaf phases relevant to its theme.

> **Phase-parent note:** This spec.md is the ONLY authored document at the root parent level. Cluster-level orientation lives in each cluster's own `spec.md`; detailed planning, tasks, checklists, decisions, and implementation summaries live in the leaf phase folders. Reorganization history (renames, folds, archival moves, and the original source-packet lineage) lives in `context-index.md` and `merged-phase-map.md`, not here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Eight thematic cluster parents at the root, each a phase parent itself.
- Every shipped leaf artifact (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/, ai-council/) preserved intact inside its cluster.
- Resolvable `description.json` + `graph-metadata.json` across the packet, with old packet IDs preserved as migration aliases.

### Out of Scope

- Modifying any deep-* skill source code.
- Rewriting historical leaf narratives (preserved as evidence).
- Packets outside 116.

### Files Changed (cumulative)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | This root parent lean trio |
| `description.json` / `graph-metadata.json` | Modify | Root metadata; `children_ids` now the 7 clusters |
| `context-index.md` | Create | Reorganization + source-packet bridge |
| `merged-phase-map.md` | Create | Exhaustive old→new leaf path map |
| `006-deep-stack-cross-cutting/**` | Create/Move | New cross-cutting cluster + folded leaves |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each row is a thematic cluster phase parent. Drill into the cluster's own `spec.md` to see its leaf phases. Statuses roll up from the cluster's children.

| Cluster | Folder | Theme | Children | Status |
|---------|--------|-------|----------|--------|
| 000 | `000-release-cleanup/` | Flat release-cleanup specs for the five deep-* skills (per-skill cleanup + remediation) | 15 specs | In Progress |
| 001 | `001-deep-ai-council/` | deep-ai-council rename (4 runtimes) + shared runtime + iterative multi-topic | 13 | In Progress |
| 002 | `002-deep-review/` | deep-review complexity hardening (research → schema → validator → ledger → saturation → graph vocab → playbooks) | 8 | Complete |
| 003 | `003-deep-loop-runtime/` | deep-loop runtime isolation (core deliberation + isolation + CLI migration + closeout) | 11 | Complete |
| 004 | `004-deep-research/` | deep-research uplift + iteration ordering + uncovered questions + hygiene | 6 | In Progress |
| 005 | `005-deep-agent-improvement/` | deep-agent-improvement uplift + correctness + evaluator + cross-runtime + mixed-executor + command relocation | 9 | In Progress |
| 006 | `006-deep-stack-cross-cutting/` | Cross-stack work: unique-value differentiation audit, command relocation, documentation evolution | 5 | In Progress |
| 007 | `007-deep-stack-playbook-validation/` | Deep-stack manual-playbook validation run — 177 scenarios across all five deep-* skills → release-readiness matrix (verdict READY); 4 remediation children | 10 | Complete |

### Phase Transition Rules

- Each cluster is independently executable and validates independently via `validate.sh --recursive`.
- The root's 8-child count is within `is-phase-parent.js`'s healthy band (<20); each cluster's child count is ≤13.

### Cross-Cluster Dependencies

- **001-deep-ai-council** depends on **003-deep-loop-runtime** (the rename moves `deep-ai-council` out of the deep-loop family).
- **004-deep-research** uplift depends on **002-deep-review** (investigates whether deep-review changes propagate).
- **005-deep-agent-improvement** uplift depends on **002-deep-review** + **004-deep-research**.
- **006-deep-stack-cross-cutting** differentiation audit depends on 001/002/004 having shipped (audits boundaries between them).
- **007-deep-stack-playbook-validation** validates the shipped manual-testing playbooks of all five deep-* skills (cross-cutting; consumes the 001-005 skill surfaces). Complete — 177/177 PASS, verdict READY.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **In-flight leaves**: Some leaves carry active continuity (deep-ai-council iterative `001-deep-ai-council/008–013`, deep-agent-improvement uplift `005-deep-agent-improvement/001–003`). Resume via the new cluster paths.
- **000-release-cleanup**: flattened (2026-05-26) from 5 per-skill buckets into 15 standalone skill-prefixed specs; see `000-release-cleanup/context-index.md` for the old→new map.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Reorganization + source lineage bridge**: `context-index.md`
- **Exhaustive old→new leaf path map**: `merged-phase-map.md`
- **Cluster children**: 8 thematic phase parents enumerated above (see each cluster's own `spec.md`)
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id` pointer)
