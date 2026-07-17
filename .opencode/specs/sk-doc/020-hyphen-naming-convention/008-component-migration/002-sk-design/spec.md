---
title: "Feature Specification: sk-design component migration (032 phase parent)"
description: "Lean phase parent for the kebab-case filesystem naming work across the sk-design hub, mode packets, catalog/playbook trees, benchmark artifacts, changelog evidence, and final gate."
trigger_phrases:
  - "sk-design naming phases"
  - "sk-design kebab-case migration"
  - "032 sk-design component migration"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored sk-design phase parent"
    next_safe_action: "Resume the selected sk-design child phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/shared/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: sk-design component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design |
| **Predecessor** | `001-sk-code` |
| **Successor** | `003-sk-doc` |
| **Handoff Criteria** | All child phase checklists and the final sk-design gate pass. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-design surface spans a routing hub, shared reference base, six mode packets, feature catalogs, manual playbooks, benchmark snapshots, and changelog records. Its non-exempt filesystem names must follow the 032 kebab-case convention while Python scripts/package directories and tool-mandated names remain exact.

This parent organizes one child phase per coherent surface so each child can inventory names, update path references, and hand evidence to the final gate. The child documents own all implementation detail.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hub/shared Markdown assets and references.
- Six mode-packet surfaces outside their catalog/playbook trees.
- All sk-design feature-catalog and manual-testing-playbook trees.
- Benchmark artifact labels, changelog evidence, and the final subtree gate.

### Out of Scope
- Migration execution during this authoring pass.
- Python scripts, Python package directories, tool-mandated names, code identifiers, data keys, and frontmatter fields.
- Repository surfaces outside `.opencode/skills/sk-design/`.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This parent is intentionally lean. Each child folder owns its spec, plan, tasks, checklist, optional decision record, and continuity.

| Phase | Folder | Focus | Status |
|-------|-------|-------|-------|
| 001 | 001-hub-root-and-shared/ | Rename only the non-exempt hub/shared filesystem names to kebab-case and update every reference that resolves those paths. | Planned |
| 002 | 002-design-interface/ | Rename the design-interface mode's non-exempt filesystem names to kebab-case and keep its routing, procedure, and handoff references intact. | Planned |
| 003 | 003-design-foundations/ | Rename non-exempt design-foundations filesystem names to kebab-case while preserving Python tooling and all resource references. | Planned |
| 004 | 004-design-motion/ | Rename the motion mode's non-exempt filesystem names to kebab-case and update its resource references without changing motion guidance. | Planned |
| 005 | 005-design-audit/ | Rename the audit mode's non-exempt filesystem names to kebab-case and update evidence, fixture, and routing references without changing audit semantics. | Planned |
| 006 | 006-design-md-generator/ | Rename the md-generator mode's non-exempt filesystem names to kebab-case and update its extraction and validation references while preserving the backend contract. | Planned |
| 007 | 007-design-mcp-open-design/ | Rename the transport packet's non-exempt filesystem names to kebab-case, choose a valid target for the private shell helper, and update all transport references. | Planned |
| 008 | 008-feature-catalog/ | Rename every non-exempt feature-catalog root, category directory, and feature file to kebab-case and update catalog-owned references across the sk-design surface. | Planned |
| 009 | 009-manual-testing-playbook/ | Rename every non-exempt manual-testing-playbook root, category directory, and scenario file to kebab-case and update all playbook-owned references. | Planned |
| 010 | 010-benchmark/ | Rename non-exempt benchmark artifact paths to kebab-case and update storage-guide and README references while preserving frozen report content and baseline identity. | Planned |
| 011 | 011-changelog-verify/ | Verify that the sk-design changelog contains a matching kebab-case migration entry and a version greater than the current v1.4.3.0 without performing any rename. | Planned |
| 012 | 012-skill-gate/ | Aggregate sibling evidence and verify the complete sk-design surface is kebab-clean outside the declared exemptions, without introducing new migration work. | Planned |

### Phase handoffs

| From | To | Handoff evidence |
|-------|-------|-------|
| 001–007 | 008 | Component maps and local reference sweeps are clean; catalog ownership is explicit. |
| 008 | 009 | Feature-catalog paths and catalog→playbook handoff ledger are complete. |
| 009 | 010 | All playbook roots/indexes/scenarios resolve under the target names. |
| 010 | 011 | Benchmark paths and report parity evidence are complete. |
| 011 | 012 | Changelog version/scope verification passes. |
| 012 | Parent packet | All sibling contracts pass and the whole sk-design inventory is kebab-clean outside exemptions. |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The release owner must select the final changelog version greater than v1.4.3.0 before phase 011 executes.
- The execution coordinator must pin the candidate/base evidence context used by all sibling reports.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent packet**: See `../spec.md`.
- **Child phases**: See the twelve `[0-9][0-9][0-9]-*/` folders below this parent.
- **Graph metadata**: See `graph-metadata.json` for the child graph pointer.
