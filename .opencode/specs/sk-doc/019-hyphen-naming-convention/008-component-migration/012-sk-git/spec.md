---
title: "Feature Specification: sk-git component migration (017 phase parent)"
description: "The sk-git surface needs a scoped kebab-case migration plan that covers its references, assets, manual playbook, benchmark artifacts, changelog evidence, and final naming gate without expanding into code or other skills."
trigger_phrases:
  - "sk-git kebab-case migration"
  - "sk-git component naming phases"
  - "017 sk-git phase map"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the sk-git child phase map from the live surface inventory"
    next_safe_action: "Execute the selected sk-git child phase on the pinned migration worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/references/"
      - ".opencode/skills/sk-git/assets/"
      - ".opencode/skills/sk-git/manual-testing-playbook/"
      - ".opencode/skills/sk-git/benchmark/"
      - ".opencode/skills/sk-git/changelog/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the six child folders. -->

# Feature Specification: sk-git component migration

> **SUPERSEDED IN PART — v4 reconciliation (2026-07-15).** Concurrent v4 work already committed the sk-git kebab pilot (the "hyphen-case pilot" made authoritative in AGENTS.md), which renamed the **references**, **assets**, and **manual-testing-playbook** surfaces and shipped version **1.3.2.0** with its changelog entry. As a result, children **001, 002, 003 are now VERIFY-ONLY** and **005** verifies the already-shipped changelog. The **benchmark** surface (child **004**) is still snake on v4 and remains a real, unexecuted rename — this component is therefore NOT complete, and the **006-skill-gate** rollup cannot pass until 004 executes. Full inventory and rationale: the packet's v4-reconciliation-inventory.md.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-git |
| **Parent packet** | sk-doc/019-hyphen-naming-convention/008-component-migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-git surface spans reference material, reusable assets, a manual-testing-playbook tree, benchmark profiles, and versioned changelog evidence. Those surfaces have had mixed underscore and hyphen spellings in their history and pointers, so the component needs one bounded decomposition that applies the program rule consistently: kebab-case is the sole canonical filesystem-name form except Python scripts, Python package directories, and tool-mandated names.

This parent partitions the work into independent child phases. The children describe the source-to-target maps, pointer closure, changelog evidence, and final rollup contract; they do not execute the migration in this authoring pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The references/ source-to-target map and all links or pointers to those files.
- The assets/ source-to-target map and all links or pointers to those files.
- Category directories and scenario files under manual-testing-playbook/.
- Snake_case benchmark profile or artifact names under benchmark/ and their consumers.
- The sk-git changelog entry and version-bump evidence for this component migration.
- A subtree gate that aggregates the five work phases and checks the component naming surface against the exemption boundary.

### Out of Scope
- Renaming code, scripts, Python .py files, Python import-package directories, or tool-mandated names.
- Changing JSON/YAML/TOML keys, frontmatter fields, or non-path values.
- Renaming feature-catalog paths, shared infrastructure, other skills, or any sibling 017 component subtree.
- Executing any rename, reference rewrite, changelog edit, version bump, or validation run during this authoring pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-references/ | VERIFY-ONLY (v4 renamed it): confirm reference files are kebab and every link/pointer resolves. | Verify-only (v4 shipped) |
| 002 | 002-assets/ | VERIFY-ONLY (v4 renamed it): confirm asset/template files are kebab and every link/pointer resolves. | Verify-only (v4 shipped) |
| 003 | 003-manual-testing-playbook/ | VERIFY-ONLY (v4 renamed it): confirm category dirs and scenario files are kebab, IDs intact, index resolves; re-count vs v4's tree. | Verify-only (v4 shipped) |
| 004 | 004-benchmark/ | ACTIVE RENAME (not done on v4): rename snake_case benchmark profile or artifact names and repair references without changing report data keys. | Planned |
| 005 | 005-changelog-verify/ | Verify the already-shipped 1.3.2.0 changelog entry for the reference/asset/playbook renames; benchmark coverage deferred; perform no rename. | Verify-only (v4 shipped 1.3.2.0) |
| 006 | 006-skill-gate/ | Roll up sibling evidence and prove no in-scope snake_case filesystem name remains in sk-git outside the exemption set. BLOCKED until 004 executes. | Planned (blocked on 004) |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None blocking. Each child resolves its exact source-to-target map against the pinned execution baseline before changing files.
<!-- /ANCHOR:questions -->
