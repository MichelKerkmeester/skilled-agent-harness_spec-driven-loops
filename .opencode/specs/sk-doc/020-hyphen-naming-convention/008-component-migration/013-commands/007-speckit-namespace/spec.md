---
title: "Feature Specification: speckit command namespace naming (032 phase 008/013/007)"
description: "The speckit command namespace has compliant command markdown files but twelve snake_case workflow and presentation asset filenames. This phase renames those maintained assets, repairs command and README pointers, and preserves the /speckit:* command IDs and workflow keys."
trigger_phrases:
  - "speckit command namespace naming"
  - "kebab-case speckit assets"
  - "hyphenate speckit workflow files"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/007-speckit-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored speckit namespace docs"
    next_safe_action: "Execute the speckit asset rename closure against the frozen map"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/"
      - ".opencode/commands/speckit/assets/"
      - ".opencode/commands/speckit/README.txt"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The four speckit command markdown files already use compliant basenames."
      - "The /speckit:* command IDs, workflow keys, and tool contracts remain exact while asset path values change."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Speckit command namespace naming

> Phase adjacency under the commands component parent: predecessor `006-scripts-namespace`; successor `008-loose-command-ids`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/007-speckit-namespace |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 007 of the commands-surface migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `.opencode/commands/speckit/assets/` tree contains `speckit_complete_auto.yaml`, `speckit_implement_presentation.txt`, `speckit_plan_confirm.yaml`, and `speckit_resume_presentation.txt`. The command markdown and README files reference these underscore filenames even though the public `/speckit:*` command IDs already use the required command syntax.

### Purpose

Rename the 12 maintained speckit assets to kebab-case and update every active path pointer so complete, implement, plan, and resume workflows retain their existing command IDs and behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 12 maintained files under `.opencode/commands/speckit/assets/`: `speckit_complete_auto.yaml`, `speckit_complete_confirm.yaml`, `speckit_complete_presentation.txt`; `speckit_implement_auto.yaml`, `speckit_implement_confirm.yaml`, `speckit_implement_presentation.txt`; `speckit_plan_auto.yaml`, `speckit_plan_confirm.yaml`, `speckit_plan_presentation.txt`; and `speckit_resume_auto.yaml`, `speckit_resume_confirm.yaml`, `speckit_resume_presentation.txt`.
- References from `complete.md`, `implement.md`, `plan.md`, `resume.md`, `README.txt`, asset-local content, tests, indexes, and external consumers.
- A 12-row source-to-target map and dependency-closed reference closure.

### Out of Scope

- The already-compliant `complete.md`, `implement.md`, `plan.md`, `resume.md`, `README.txt`, and `assets/` directory names.
- `/speckit:*` command IDs, workflow/data keys, frontmatter fields, generated/lockfile output, Python files/package directories, and frozen history.
- Other commands namespaces, loose root commands, and cross-namespace asset residuals owned by sibling phases.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every speckit asset candidate maps once to a kebab-case target | The frozen-map report lists 12 sources, 12 distinct targets, and no unknown disposition. |
| REQ-002 | Speckit command and README pointers remain resolvable | Every auto, confirm, and presentation path points to an existing target with no old active path. |
| REQ-003 | Speckit command behavior remains equivalent | Complete, implement, plan, and resume mode selection and presentation loading match BASE outcomes. |
| REQ-004 | Public and data contracts remain exact | `/speckit:*` IDs, YAML/data keys, frontmatter fields, tool names, Python/package names, generated output, and frozen history are unchanged. |
| REQ-005 | The closure is auditable | The report records map, consumer, mode, link, and path-scoped diff evidence. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 12 maintained speckit asset filenames are kebab-case and every active pointer resolves.
- **SC-002**: Complete, implement, plan, and resume retain BASE mode and presentation behavior.
- **SC-003**: `/speckit:*` command IDs and all data/key exemptions remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Speckit assets are referenced from command docs, README tree examples, and workflow content that also contains many underscore-delimited data names. The mitigation is a 12-row semantic map and path-only rewrite with explicit key/prose dispositions. The phase depends on the 005 tooling, 006 frozen map, 000 baseline, and the commands parent handoff.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must classify every occurrence as a filesystem path, `/speckit:*` ID, key, or prose before rewriting it and must attach external consumers to the speckit closure.
<!-- /ANCHOR:questions -->
