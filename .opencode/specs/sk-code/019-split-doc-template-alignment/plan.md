---
title: "Implementation Plan: sk-code Split-Doc Template Alignment"
description: "Serial GPT-5.6-sol-fast batches conform each sk-code surface subtree to the create-skill asset/reference templates; each batch independently verified (validate_document 0 + broken-link scan) and committed whole-hub before the next."
trigger_phrases:
  - "019 plan sk-code split doc alignment"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/019-split-doc-template-alignment"
    last_updated_at: "2026-07-12T14:23:42Z"
    last_updated_by: "claude-code"
    recent_action: "All 163 files conformed across 11 batches; pushed to v4"
    next_safe_action: "Terminal gates + finalize sibling 017"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code Split-Doc Template Alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Documentation authoring; no code/runtime change. Executed by GPT-5.6-sol-fast agents (opencode, --variant medium) in an isolated worktree, orchestrator-verified.
### Overview
Conform ~163 mechanically-split reference/asset files across code-opencode, code-webflow, code-quality to the create-skill asset/reference templates: snake_case renames, 5-field frontmatter + version, OVERVIEW wrapper, in-hub reference updates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
Templates + package_skill.py read as authority; 027 collision scope confirmed (027 done, did not cover reference/asset split files).
### Definition of Done
0 hyphenated split filenames remaining; validate_document 0 on every file; 0 broken .md links to renamed files (all conformed files + referrers resolve); committed + pushed to v4.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Serial per-subtree GPT batches (batches serialize on each surface's shared SKILL.md RESOURCE_MAP). Each batch: GPT conforms a subtree recursively (incl. nested split dirs) + updates ALL in-hub references; orchestrator verifies (validate_document 0 + full-hub broken-link scan) and commits the WHOLE hub (cross-surface ref-fixes included) before the next.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. code-quality assets (pilot).
2. code-opencode references (config/python/js/shell/typescript/rust/shared) + assets.
3. code-webflow references (animation/css/html/debugging/deployment/performance/verification/js/shared/implementation) + assets.
4. Full-hub verification: 0 hyphenated, 0 broken links to renamed files, all validate 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Per file: validate_document.py (0 issues). Per surface: snake_case scan (0 hyphenated) + full-hub relative-.md-link existence scan (0 broken). Content preservation checked by diffing renamed files (additive frontmatter/OVERVIEW + section renumber only).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- create-skill asset/reference templates + package_skill.py (authority, read-only).
- validate_document.py (verification).
- GPT-5.6-sol-fast via opencode (executor), isolated worktree.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
All changes are doc renames + additive frontmatter/OVERVIEW + reference-link updates. Rollback = revert the batch commits; no runtime/data state.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `./spec.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`
- Sibling: `../../sk-doc/017-smart-routing-mechanism-notes/`
- `.opencode/skills/sk-doc/create-skill/assets/skill/` (templates)
