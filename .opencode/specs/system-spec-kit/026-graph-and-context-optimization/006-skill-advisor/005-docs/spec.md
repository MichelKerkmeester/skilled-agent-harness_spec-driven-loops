---
title: "006-skill-advisor/005-docs Phase Parent: Documentation Alignment and Drift Fixes"
description: "Phase parent for skill-advisor documentation work across 3 children: docs/code alignment, code-folder READMEs, and doc/config drift fixes."
trigger_phrases:
  - "006-skill-advisor/005-docs"
  - "skill-advisor-docs"
  - "code-folder-readmes"
importance_tier: "normal"
contextType: "general"
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-core | v1.0 -->
# Phase Parent: 006-skill-advisor/005-docs

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. ROOT PURPOSE

Coordinate documentation quality and alignment work across the skill-advisor system. This sub-phase binds together three children that establish baseline docs/code alignment (004), expand code-folder README coverage with sk-doc standards (024), and resolve drift issues in documentation and configuration files (025). Together they ensure skill-advisor documentation remains consistent with code structure and current configuration.

---

## 2. PHASE CHILDREN

| ID | Slug | Summary |
|----|------|---------|
| 001 | docs-and-code-alignment | Skill-Advisor Docs + Phase 020 Code Alignment |
| 002 | code-folder-readmes | Phase B of 4-phase code-folder README pipeline: TOC anchors and fixture folder READMEs |
| 003 | doc-and-config-drift-fixes | system-skill-advisor doc + config drift fixes - TS5103 build, 8-vs-9 tool count, stale opencode.json comment |

---

## 3. SUB-PHASE CONTROL FILE

- Active child: n/a - sub-phase children share equivalent priority
- Last completed child: n/a
- Resume entry: /spec_kit:resume honors graph-metadata.json derived.last_active_child_id; falls back to listing children.

---

## 4. WHAT NEEDS DONE (parent-level pointer)

The parent itself owns no implementation. All work lives in the children. Each child's spec.md is the source of truth for that child's scope.

- **Docs/code baseline:** 004 establishes alignment between skill-advisor documentation and phase 020 code
- **Code-folder README expansion:** 024 adds TOC anchors to existing READMEs and creates new ones for fixture folders
- **Drift remediation:** 025 resolves TS5103 build errors, tool count discrepancies, and stale configuration comments

---

## 5. PROVENANCE

Sub-phase directory created by packet 109 Wave 2 per 998 iter-005 classification rules. Phase-parent base files authored by packet 111 Wave 3.A (cli-devin SWE-1.6).
