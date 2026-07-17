---
title: "Feature Specification: active specs and documents (032 phase 007 child 004)"
description: "Active spec folders and authored documents can retain snake_case names and path references even though numeric phase folders are already structurally compliant. This child separates active authored docs from generated, frozen, and tool-mandated surfaces before applying the naming contract."
trigger_phrases:
  - "active specs and documents naming"
  - "hyphen naming active spec docs"
  - "phase 007 active specs"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/004-active-specs-and-docs"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the active spec and document closure contract"
    next_safe_action: "Census active spec/document paths and classify generated and frozen surfaces"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/"
      - ".opencode/specs/system-code-graph/"
      - ".opencode/specs/system-deep-loop/"
      - ".opencode/specs/system-speckit/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "A three-digit phase prefix with hyphenated suffix is structurally compliant and is not a snake_case violation"
      - "Active authored specs/docs are distinct from z_archive, changelogs, completed history, and generated research/review state"
      - "Filesystem names and path-derived frontmatter values may change; frontmatter fields and data keys do not"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Active Specs and Documents

> Child adjacency under the 007 parent (grouping order, not a runtime dependency): sibling `003-hoisted-shared-script-closures`; root infrastructure and symlink closures are `001-root-and-opencode-infra-strays` and `002-cross-skill-symlink-closure`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/004-active-specs-and-docs |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit / sk-doc |
| **Origin** | Child 004 of the 007 shared and cross-cutting dependency-closures phase |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The active `.opencode/specs/**` tree mixes authored control documents with generated state, research/review artifacts, scratch material, frozen history, and structural phase directories. Some active documents and support paths still contain underscores, while a folder such as `008-component-migration` is already compliant because its three-digit prefix and hyphenated suffix match the phase-folder rule. A blanket character replacement would corrupt artifact IDs, generated state, Python helpers, and tool-owned metadata.

This child defines the active-spec/document census, the structural-name exemption boundary, the document/link closure, and strict-validation evidence required after the future filesystem changes. It does not alter any spec or document in this authoring pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Active `.opencode/specs/**` folder and file names that are not exempt, frozen, generated, or tool-mandated.
- Authored Markdown control documents, support documents, and path-valued references under active spec packets.
- Markdown links, relative references, `_memory.continuity.packet_pointer` values, and other frontmatter values that encode filesystem paths.
- Structural checks that preserve compliant phase-folder forms such as `^[0-9]{3}-[a-z0-9-]+$`.
- Per-packet closure manifests and strict-validation targets for every touched active spec packet.

### Out of Scope
- `z_archive/`, changelogs, completed spec history, review/research archives, generated loop state, and scratch output unless phase 006 classifies a specific item as an active authored document.
- Python `.py` files, Python import-package directories, lockfiles, generated output, and tool-mandated names.
- Code identifiers, JSON/YAML/TOML keys, frontmatter fields, and database columns; only path-derived values may change.
- Root infrastructure, shared scripts, and symlink link-node movement owned by children 001, 002, and 003.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Active `.opencode/specs/**` folder/file candidates | Rename | Apply only semantic targets from the frozen map; preserve compliant phase-folder forms |
| Active Markdown links and relative references | Reference rewrite | Resolve links after document-name changes |
| `_memory.continuity` and other path-valued frontmatter values | Value update | Update filesystem paths while retaining frontmatter field names |
| Touched packet validation inputs and generated metadata | Verification/refresh | Validate packet structure and refresh metadata only through the owning workflow |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Census active spec/document candidates with the full exemption boundary | Every observed candidate is classified as rename, exempt, frozen, generated, or tool-mandated; no unknown bucket remains |
| REQ-002 | Preserve spec-folder structural naming rules | A folder matching `^[0-9]{3}-[a-z0-9-]+$` is accepted as compliant and is not renamed solely because it has a numeric prefix |
| REQ-003 | Close document and path references | Markdown links, relative references, continuity packet pointers, and path-valued frontmatter resolve to renamed documents without changing fields or data keys |
| REQ-004 | Validate every touched active packet | Each touched packet passes `validate.sh --strict` and its required Level 2/3 document set remains intact after the planned closure |
| REQ-005 | Preserve generated, frozen, and tool-owned surfaces | Archives, changelogs, completed history, generated research/review state, Python names, lockfiles, and tool-mandated names retain their approved dispositions |
| REQ-006 | Publish a dependency-ready packet/document handoff | Phase 008 children receive touched-packet paths, link evidence, validation receipts, and any cross-closure dependencies |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the active `.opencode/specs/**` census, **when** each candidate is classified, **then** authored active names and generated/frozen/tool-owned names are separated with evidence.
- **SC-002**: **Given** a phase folder matching `^[0-9]{3}-[a-z0-9-]+$`, **when** the naming guard runs, **then** the folder is accepted without a rename disposition.
- **SC-003**: **Given** an active document rename, **when** markdown links and path-valued frontmatter are resolved, **then** every link and continuity pointer reaches the target and no field/key name changes.
- **SC-004**: **Given** a touched active packet, **when** strict validation runs, **then** its required docs, anchors, level, and metadata relationships pass with no broken path references.
- **SC-005**: **Given** an archive, changelog, generated state file, Python name, or tool-mandated path, **when** the closure map is reviewed, **then** it remains unchanged or carries an explicit non-rename disposition.
- **SC-006**: **Given** a document edge crossing into a symlink or shared-script closure, **when** the packet ledger closes, **then** the edge is handed to the owning child with a stable dependency identifier.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Impact | Mitigation |
|-------------------|--------|------------|
| Generated research/review state is mistaken for authored documentation | Historical or machine-owned artifacts can be rewritten | Classify by packet status, path role, and generator ownership before selecting targets |
| A phase-folder prefix is treated as a violation | Spec navigation and resume paths can break | Apply the explicit `^[0-9]{3}-[a-z0-9-]+$` structural exemption |
| A markdown link or continuity value is missed | Resume, validation, or document navigation breaks | Run link/path closure checks and inspect every changed packet pointer |
| A frontmatter field or data key is changed with its value | The memory and validator contracts change unintentionally | Rewrite path-derived values only; preserve field/key names byte-for-byte |
| A touched packet is not strictly validated | Broken anchors or level contracts reach phase 008 | Require a strict validation receipt per touched packet before handoff |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. An ambiguous active-versus-generated disposition remains in the ledger for phase 006/005 review and is not resolved by a broad filename sweep.
<!-- /ANCHOR:questions -->
