---
title: "000-release-cleanup/004-followup-post-program Phase Parent: Followup + Post-Program Work"
description: "Phase parent for post-program cleanup and followup quality work across 4 child packets. Covers quality passes, runtime cleanup, test recovery, and iterative improvements after major releases."
trigger_phrases:
  - "000-release-cleanup/004-followup-post-program"
  - "followup-post-program"
  - "post-program cleanup phases"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-core | v1.0 -->
# Phase Parent: 000-release-cleanup/004-followup-post-program

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. ROOT PURPOSE

Coordinate followup and post-program work across quality passes, runtime cleanup, test recovery, and iterative improvements. This sub-phase binds together 4 child packets that address cleanup tasks and quality refinements after major program milestones, ensuring system health and test coverage through targeted remediation efforts.

---

## 2. PHASE CHILDREN

| ID | Slug | Summary |
|----|------|---------|
| 001 | post-program-cleanup | 005 Post-Program Cleanup |
| 002 | vitest-recovery-followup | Vitest baseline recovery followup |
| 003 | followup-quality-pass | Follow-up Quality Pass |
| 004 | runtime-cleanup-followups | Three follow-on cleanups after packet 096: harden findAdvisorWorkspaceRoot against false sentinels, diagnose 50 FTS/vec mismatched IDs in memory_health, bulk-delete 2,751 deprecated-tier records |

---

## 3. SUB-PHASE CONTROL FILE

- Active child: n/a - sub-phase children share equivalent priority
- Last completed child: n/a
- Resume entry: /spec_kit:resume honors graph-metadata.json derived.last_active_child_id; falls back to listing children.

---

## 4. WHAT NEEDS DONE (parent-level pointer)

The parent itself owns no implementation. All work lives in the children. Each child's spec.md is the source of truth for that child's scope.

- **Quality assurance**: 002-vitest-baseline-recovery-followup (test baseline recovery) and 003-post-program-quality-pass (quality pass coordination)
- **Runtime cleanup**: 001-post-program-doc-and-state-cleanup (general post-program cleanup) and 004-runtime-root-memory-cleanup-followup-fixes (packet 096 followups: workspace root hardening, memory health diagnostics, deprecated-tier bulk deletion)

---

## 5. PROVENANCE

Sub-phase directory created by packet 109 Wave 2 per 998 iter-003 classification rules. Phase-parent base files authored by packet 111 Wave 3.A (cli-devin SWE-1.6).
