---
title: "006-skill-advisor/003-skill-advisor-routing-engine Phase Parent: Intent Routing"
description: "Phase parent for intent routing optimization across the skill advisor system. Coordinates 5 children covering search-and-routing tuning, phrase booster tailoring, smart router remediation, hook surface integration, and setup command infrastructure."
trigger_phrases:
  - "006-skill-advisor/003-skill-advisor-routing-engine"
  - "router"
  - "intent routing"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-core | v1.0 -->
# Phase Parent: 006-skill-advisor/003-skill-advisor-routing-engine

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. ROOT PURPOSE

Optimize intent routing across the skill advisor system through coordinated improvements to search accuracy, phrase boosting, smart router behavior, hook surface integration, and setup command infrastructure. The 5 children bind together thematically around the goal of making skill advisor routing more precise, responsive, and maintainable.

---

## 2. PHASE CHILDREN

| ID | Slug | Summary |
|----|------|---------|
| 001 | search-and-routing-tuning | Search and Routing Tuning Coordination Parent |
| 002 | advisor-phrase-booster-tailoring | Advisor Phrase-Booster Tailoring |
| 003 | smart-remediation-and-opencode-plugin | Smart-Router Remediation + OpenCode Plugin |
| 004 | skill-advisor-hook-surface | Skill-Advisor Hook Surface |
| 005 | skill-advisor-setup-command | Skill Advisor Setup Command |

---

## 3. SUB-PHASE CONTROL FILE

- Active child: n/a - sub-phase children share equivalent priority
- Last completed child: n/a
- Resume entry: /spec_kit:resume honors graph-metadata.json derived.last_active_child_id; falls back to listing children.

---

## 4. WHAT NEEDS DONE (parent-level pointer)

The parent itself owns no implementation. All work lives in the children. Each child's spec.md is the source of truth for that child's scope.

**Thematic groupings:**
- Routing optimization: 001 (search-and-routing tuning), 003 (phrase-booster tailoring)
- Smart router remediation: 005 (remediation + OpenCode plugin)
- Integration surface: 007 (hook surface)
- Infrastructure: 012 (setup command)

---

## 5. PROVENANCE

Sub-phase directory created by packet 109 Wave 2 per 998 iter-003 classification rules. Phase-parent base files authored by packet 111 Wave 3.A (cli-devin SWE-1.6).
