---
title: "Feature Specification: sk-code Split-Doc Template Alignment"
description: "Conform the ~104 hyphenated + ~160 total mechanically-sliced reference/asset .md files under sk-code/{code-opencode,code-webflow,code-quality} to the canonical create-skill asset/reference templates: 5-field frontmatter + 4-part version, snake_case filenames, H1 + intro + `## 1. OVERVIEW` before content, optional RELATED RESOURCES last. Every rename updates all in-hub references. Extends 027's underscore convention to the reference/asset split files 027 did not cover."
trigger_phrases:
  - "sk-code split doc template alignment"
  - "conform code-opencode references to create-skill template"
  - "sk-code reference asset snake_case frontmatter"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/019-split-doc-template-alignment"
    last_updated_at: "2026-07-12T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Spec authored; collision-scope confirmed (027 done, did not cover reference/asset split files)"
    next_safe_action: "GPT-5.6-sol-fast batches conform per surface, Sonnet verifies"
    blockers: []
    completion_pct: 0
    status: "In Progress"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-code Split-Doc Template Alignment

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-12 |
| **Track** | sk-code |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Oversized sk-code reference/asset docs were split by a mechanical line-slicer into ~160 topic parts (code-opencode 65, code-webflow 95, code-quality 3). Continuation files kept only a generated header: hyphenated filenames (fail snake_case), dropped `trigger_phrases`, and open straight at an inherited section number with no OVERVIEW/intro — diverging from the canonical create-skill asset/reference templates.

**Purpose:** conform every split file to the template (frontmatter, snake_case name, OVERVIEW structure) so the sk-code surfaces pass the resource-doc contract, extending 027's underscore convention to the reference/asset files it did not rename.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the reference/asset `.md` split files under `.opencode/skills/sk-code/{code-opencode,code-webflow,code-quality}/{references,assets}/` — rename hyphen→underscore (snake_case), add the 5-field frontmatter + 4-part version, add H1+intro+`## 1. OVERVIEW`, renumber content sections, and update every in-hub reference to each renamed file.

**Out of scope:** the sk-code surface SKILL.md header structure (surface-packet headers are deliberate — do not rewrite); any `feature_catalog`/`manual_testing_playbook` file already renamed by 027; anything under `system-deep-loop/deep-alignment` (live session); weakening `package_skill.py`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: Every split reference/asset file carries the 5-field frontmatter {title, description, trigger_phrases, importance_tier, contextType} + a 4-part version.
- R2: Every hyphenated split filename renamed to snake_case via `git mv`; every in-hub reference to it updated (zero broken links).
- R3: Body opens H1 + 1-2 sentence intro (no header) + `## 1. OVERVIEW` (Purpose + When-to-Use for references; Purpose + Usage for assets) before content; content sections renumbered contiguously; optional RELATED RESOURCES last.
- R4: Existing substantive content preserved verbatim — structural re-wrap only.
- R5: `validate_document.py` 0 issues on each conformed file; resource-doc warnings gone.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `package_skill.py --check` code-quality: 0 resource-doc warnings; code-opencode/code-webflow split-file warnings resolved (verified via `validate_document.py`/scoped script — the pre-existing SKILL.md header FAIL is out of scope).
- `validate_document.py` 0 issues on every conformed file.
- Zero broken links to renamed files across sk-code.
- Execution by GPT-5.6-sol-fast agents, Sonnet-verified per batch.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Renames must update all in-hub references or links break (the slicer previously caused broken links) — every batch runs a broken-link scan.
- 027 is complete + merged; this extends its convention to uncovered files — low collision, but a concurrent session may still touch sk-code, so work in the isolated worktree.
- Depends on the create-skill templates + `package_skill.py` as authority (read-only).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Gate 3 resolved: this packet owns the sk-code alignment; GPT LEAF workers proceed under it without re-asking.
<!-- /ANCHOR:questions -->
