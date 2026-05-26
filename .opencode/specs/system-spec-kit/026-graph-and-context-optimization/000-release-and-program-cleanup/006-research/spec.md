---
title: "000-release-cleanup/006-research Phase Parent: Deep Research Charters"
description: "Phase parent for deep research charters covering automation self-management, supplemental investigations, and system bug/improvement research across 4 child packets."
trigger_phrases:
  - "000-release-cleanup/006-research"
  - "cleanup-research"
  - "deep research charters"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-core | v1.0 -->
# Phase Parent: 000-release-cleanup/006-research

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. ROOT PURPOSE

This sub-phase groups deep research charters and remediation work for automation self-management, system bugs, and supplemental investigations. The four children bind together thematically through their focus on investigation-driven improvement: 016 and 017 explore automation capabilities and reality, while 046 conducts system-wide deep research and 049 remediates findings from those investigations.

---

## 2. PHASE CHILDREN

| ID | Slug | Summary |
|----|------|---------|
| 001 | automation-self-management-deep | Research Charter: Automation & Self-Management |
| 002 | automation-reality-supplemental | Research Charter: Automation Reality Supplemental |
| 003 | system-deep-bugs-and-improvements | Research Charter: System Deep Research - Bugs and Improvements |
| 004 | deep-research-finding-remediation | 049 Deep-Research Finding Remediation (Phase Parent) |

---

## 3. SUB-PHASE CONTROL FILE

- Active child: n/a - sub-phase children share equivalent priority
- Last completed child: n/a
- Resume entry: /spec_kit:resume honors graph-metadata.json derived.last_active_child_id; falls back to listing children.

---

## 4. WHAT NEEDS DONE (parent-level pointer)

The parent itself owns no implementation. All work lives in the children. Each child's spec.md is the source of truth for that child's scope.

- **Automation research** (016, 017): Self-management capabilities and supplemental reality investigations
- **System deep research** (046): 20-iteration investigation producing 82 findings on bugs and improvements
- **Finding remediation** (049): Phase parent for closing deep-research findings across multiple campaigns

---

## 5. PROVENANCE

Sub-phase directory created by packet 109 Wave 2 per 998 iter-003 classification rules. Phase-parent base files authored by packet 111 Wave 3.A (cli-devin SWE-1.6).
