---
title: "Feature Specification: create-changelog resource names"
description: "The create-changelog packet contains snake_case reference filenames for topology edge cases, version bump rules, and worked examples. This phase renames those non-exempt resources to kebab-case and updates packet-local links without changing release/version fields or changelog filenames."
trigger_phrases:
  - "create-changelog resource naming"
  - "changelog reference kebab-case phase"
  - "version bump guide rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/009-create-changelog"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/009-create-changelog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-changelog phase docs"
    next_safe_action: "Build the create-changelog rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-changelog/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-changelog resource names

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/009-create-changelog` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-changelog |
| **Origin** | Phase 009 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-changelog packet's three guidance references use underscores, even though the packet's changelog/version contract is otherwise path-sensitive. These reference paths must change without altering version fields, release topology, or changelog filenames.

The outcome is a kebab-case guidance resource set with intact changelog authoring semantics.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `references/topology_edge_cases.md`, `references/version_bump_rules.md`, and `references/worked_examples.md`.
- Update links and path values in `SKILL.md`, README, reference indexes, and examples.
- Preserve changelog filename conventions, version fields, and topology terms as content.

### Out of Scope

- `SKILL.md`, `README.md`, changelog files, package metadata, and tool-mandated names.
- Version values, release-note fields, changelog paths outside this packet, and content identifiers.
- Other create-* packets and the 006 changelog verification phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-changelog/references/{topology_edge_cases,version_bump_rules,worked_examples}.md` | Rename/reference update | Convert three guidance filenames |
| `create-changelog/SKILL.md`, `README.md`, and reference indexes | Modify | Repoint packet-owned guidance paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All three guidance resources become kebab-case | Manifest and filesystem census match exactly |
| REQ-002 | Changelog guidance links resolve | Every old packet-local reference points to the target file |
| REQ-003 | Version/changelog semantics remain stable | No version field, release filename, topology rule, or content key changes outside path tokens |
| REQ-004 | The phase boundary remains clear | Global changelog evidence belongs to phase 006, not this component phase |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The create-changelog guidance resources are kebab-case.
- **SC-002**: Version-bump and topology guidance remains reachable with unchanged release semantics.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Reference index and worked examples | Guidance links break | Search old basenames and resolve all targets |
| Risk | Version strings resemble path changes | Release contract drift | Review version fields separately from path links |
| Risk | Global changelog is edited in component phase | Verification scope overlaps | Hand global evidence to phase 006 |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. A path reference outside create-changelog must be recorded for its owning phase.
<!-- /ANCHOR:questions -->
