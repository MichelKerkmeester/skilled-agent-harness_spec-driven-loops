---
title: "006-skill-advisor/004-skill-graph Phase Parent: Skill Graph Infrastructure"
description: "Phase parent for skill graph infrastructure covering metadata quality, structural migration, daemon/advisor unification, and extraction across 7 child packets."
trigger_phrases:
  - "006-skill-advisor/004-skill-graph"
  - "skill-graph"
  - "skill-advisor-infrastructure"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-core | v1.0 -->
# Phase Parent: 006-skill-advisor/004-skill-graph

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. ROOT PURPOSE

Build and maintain the skill graph infrastructure that powers the skill advisor subsystem. This phase parent unifies metadata quality auditing, structural migration, daemon/advisor unification, and cross-skill propagation into a coherent graph-driven architecture. The 7 child packets collectively establish the foundational graph structures, metadata signals, and advisor extraction patterns needed for robust skill routing and discovery.

---

## 2. PHASE CHILDREN

| ID | Slug | Summary |
|----|------|---------|
| 001 | skill-advisor-graph | Skill Advisor Graph |
| 002 | daemon-and-unification | 027 - Skill Graph Daemon and Advisor Unification |
| 003 | skill-metadata-quality-audit | Audit graph-metadata.json and SKILL.md descriptions for advisor lane quality |
| 004 | apply-metadata-fixes-and-resweep | Apply audit recommendations and re-run seeded embedding sweep |
| 005 | populate-intent-signals-and-relationships | Populate derived.intent_signals and manual relationship fields |
| 006 | system-skill-advisor-extraction | Phase parent for migrating skill advisor to dedicated .opencode/skills package |
| 007 | cross-skill-auto-propagation | skill_graph_propagate_enhances - cross-skill auto-propagation MVP |

---

## 3. SUB-PHASE CONTROL FILE

- Active child: n/a - sub-phase children share equivalent priority
- Last completed child: n/a
- Resume entry: /spec_kit:resume honors graph-metadata.json derived.last_active_child_id; falls back to listing children.

---

## 4. WHAT NEEDS DONE (parent-level pointer)

The parent itself owns no implementation. All work lives in the children. Each child's spec.md is the source of truth for that child's scope.

**Thematic groupings:**
- **Graph foundation (002, 008):** Core graph structures and daemon/advisor unification
- **Metadata quality (018, 019, 021):** Audit, fix, and populate metadata signals for advisor lanes
- **Structural migration (022):** Extract skill advisor subsystem to first-class package
- **Cross-skill propagation (026):** Auto-propagation MVP across skill graph

---

## 5. PROVENANCE

Sub-phase directory created by packet 109 Wave 2 per 998 iter-003 classification rules. Phase-parent base files authored by packet 111 Wave 3.A (cli-devin SWE-1.6).
