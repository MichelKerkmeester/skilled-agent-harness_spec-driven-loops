---
title: "Feature Specification: root-name consumer migration (017 phase 002)"
description: "The catalog/playbook root + index names are consumed by a network of runtime paths, not just the classifier: the classifier is a symlink plus a real file, the Lane C loader + generator, parent-skill-check.cjs, post-edit-router.cjs, package_skill.py, and an INVERSE guard that currently rejects the hyphenated state. All "
trigger_phrases:
  - "root-name consumer migration"
  - "hyphen naming phase 002"
  - "kebab-case root name"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/002-root-name-consumer-migration"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Root-name consumer migration

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `001-convention-policy-and-scope`; successor `003-create-generators-and-templates`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/002-root-name-consumer-migration |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 002 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The catalog/playbook root + index names are consumed by a network of runtime paths, not just the classifier: the classifier is a symlink plus a real file, the Lane C loader + generator, parent-skill-check.cjs, post-edit-router.cjs, package_skill.py, and an INVERSE guard that currently rejects the hyphenated state. All must accept the hyphenated roots — with a bounded dual-name tolerance — before the 007 rename, or every catalog leaf silently downgrades to `readme`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `validate_document.py` classifier: update the real file under `shared/scripts/` and preserve the `sk-doc/scripts/` symlink (mode 120000).
- The Lane C loader (`load-playbook-scenarios.cjs`) + generator (`playbook-generator.cjs`) hardcoded root/index names.
- `parent-skill-check.cjs`, `post-edit-router.cjs`, and `package_skill.py` root-name references.
- The inverse guard `check_no_hyphenated_catalog_content.py` + its tests, plus `test_category_classification_denumbered.py`, redefined to the hyphenated target.
- A bounded dual-name tolerance: accept both roots for reads, emit only hyphens, fail closed if both physical roots coexist.

### Out of Scope
- Renaming the directories (phase 007).
- Removing the tolerance alias (phase 008).
- Generator emission (003).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every runtime consumer of the catalog/playbook root/index names accepts the hyphenated roots | A reviewed consumer manifest lists each and all are updated |
| REQ-002 | The classifier change preserves the symlink and types hyphenated leaves correctly | A hyphenated catalog leaf classifies as its typed document, not `readme`; the symlink mode stays 120000 |
| REQ-003 | A bounded dual-name tolerance accepts both roots but fails closed if both physically coexist | Both roots classify identically for reads; coexistence of both physical roots errors |
| REQ-004 | The Lane C loader + generator load unchanged against the hyphenated roots | Discovered-scenario count and IDs are unchanged |
| REQ-005 | The inverse guard and its tests are redefined to the hyphenated target | The guard rejects underscore catalog content and accepts hyphenated content |
| REQ-006 | Root-name handling is correct on POSIX and Windows-style path separators | Matrix tests pass for both separators |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All consumers accept hyphenated catalog roots.
- **SC-002**: Dual-name tolerance lets 002 land before 007 with zero downgrade risk.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 017 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline.
<!-- /ANCHOR:questions -->
