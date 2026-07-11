---
title: "Feature Specification: Phase 11 — Split code-quality Checklist + Flagged-File Exemptions"
description: "Split the oversized code-quality code_quality_checklist.md (542) into 3 topic-cohesive parts and rewire its code-quality/SKILL.md RESOURCE_MAP + prose + the code-webflow enforcement cross-links. Record the two operator-approved code-review exemptions (SKILL.md 545, manual_testing_playbook.md 699) that are intentionally NOT split."
trigger_phrases:
  - "018 phase 011 code-quality checklist split"
  - "code-review flagged file exemptions"
  - "code_quality_checklist hygiene"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/011-code-quality-and-flagged"
    last_updated_at: "2026-07-11T15:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "code_quality_checklist split (3 parts) + rewired; code-review exemptions documented; 21/21 guards, 0 regressions"
    next_safe_action: "Commit phase 011, then proceed to phase 012 (terminal gate + parent rollup)"
    blockers: []
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 11 — Split code-quality Checklist + Flagged-File Exemptions

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 010-code-webflow-other-references |
| **Successor** | 012-gate-verification-rollup |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`code-quality/assets/code_quality_checklist.md` (542 lines) is the last oversized reference/asset in the hygiene scope. It is routed in code-quality/SKILL.md's own RESOURCE_MAP (DEFAULT + QUALITY) and referenced by cross-surface enforcement docs. Two additional oversized code-review files are flagged as NOT references/assets and are exempted by operator decision.

### Purpose
Split the code-quality checklist into topic-cohesive parts and rewire its routes; formally record the code-review exemptions so the hub-wide "no >500-line reference/asset" goal is met with documented exceptions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split `code-quality/assets/code_quality_checklist.md` → 3 parts.
- Rewire `code-quality/SKILL.md` RESOURCE_MAP + prose/links, and the 3 `code-webflow/references/shared/enforcement.md` cross-links.

### Out of Scope
- **Exemption (operator decision 2026-07-11):** `code-review/SKILL.md` (545) — a skill entry doc whose routing frontmatter would break if split. Left intact.
- **Exemption (operator decision 2026-07-11):** `code-review/manual_testing_playbook/manual_testing_playbook.md` (699) — a benchmark index over an already-split scenario tree; splitting risks breaking scenario discovery. Left intact.
- code-review's OWN `assets/code_quality_checklist.md` (a distinct file, 7 KB, not oversized) — untouched.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
- R1: 3 parts, each ≤500 lines; union reproduces the source exactly (fixed splitter — blank-line preserving).
- R2: code-quality/SKILL.md RESOURCE_MAP + all cross-surface refs point at parts; no dangling ref to the split checklist.
- R3: 3 hub router guards stay green (code-quality is not in the hub union, so unaffected); full-suite failures == baseline (11).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Checklist split into 3 parts (≤231 lines); source deleted.
- code-quality/SKILL.md routes to parts; enforcement cross-links repaired; dangling grep clean; all part links resolve.
- 21/21 hub guards; 0 regressions. Two code-review exemptions recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- code-review has its OWN `assets/code_quality_checklist.md` (name collision with code-quality's) → only code-quality's was split; code-review refs verified valid and untouched.
- Dependency: builds on 007-010; uses the blank-line-fixed splitter and the complete link rewriter.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- None. Exemptions were operator-approved; boundaries dry-run verified.
<!-- /ANCHOR:questions -->
