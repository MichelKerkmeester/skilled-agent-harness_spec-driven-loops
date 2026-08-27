---
title: "Feature Specification: Add Lazy On-Demand Add-On Documents Across Spec Kit Levels"
description: "Define level-agnostic before-after, timeline, roadmap, and decision-record add-on documents for explicit use across every Spec Kit level"
trigger_phrases:
  - "lazy add-on docs"
  - "before-after document"
  - "timeline document"
  - "roadmap document"
  - "decision record any level"
  - "spec-kit doc manifest"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Add Lazy On-Demand Add-On Documents Across Spec Kit Levels

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `036-spec-doc-template-reduction` |
| **Phase** | `007-lazy-addon-docs` |
| **Artifact Set** | `spec.md`, `plan.md`, and `tasks.md` only |
| **Implementation Summary** | Deferred to the later implementation phase |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 7 of the Reduce and optimize spec-kit document templates packet. It adds three level-agnostic on-demand document types and decouples the decision record from documentation levels, so a packet can carry a before/after comparison, a timeline, or a roadmap whenever the work calls for one.

**Scope Boundary**: Add the new templates, register them as lazy add-ons at every level, and move the decision record into the same lazy class. Keep the four core documents unchanged. Existing packets that already carry a decision record stay valid.

**Dependencies**:
- The manifest-backed level contract classifies every document type.
- The scaffold generator already supports an opt-in path for on-demand documents.
- The golden snapshots define the rendered output contract for each template.
<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Spec Kit currently lacks manifest-registered templates for structured before-and-after comparisons, chronological timelines, and forward-looking roadmaps. The manifest also treats `decision-record.md` as a level requirement at Level 3 and Level 3+, which prevents authors at other levels from using a standard decision record without changing the packet level. The scaffold and validator therefore encode level coupling where authors need on-demand history, planning, and decision context.

### Purpose

Define three new level-agnostic lazy add-on document types and decouple `decision-record.md` from documentation levels. The later implementation step will wire the design into the manifest, templates, scaffold, validator, golden snapshots, and the `CLAUDE.md` level-document table. This phase creates only the design documents in this folder.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `before-after.md`, `timeline.md`, and `roadmap.md` as level-agnostic lazy add-on document types.
- Define the required sections and anchors for each new template.
- Register all three new types and `decision-record.md` in `lazyAddonDocs` for Levels 1, 2, 3, and 3+.
- Remove `decision-record.md` from `requiredAddonDocs` and `optionalAddonDocs` at every level.
- Define an explicit `create.sh` opt-in for scaffolding lazy add-on documents.
- Define validator behavior that accepts lazy documents when present and does not require `decision-record.md` at Level 3 or Level 3+.
- Update the later implementation step's golden snapshots, contract tests, and `CLAUDE.md` level-document table.

### Out of Scope

- Editing the manifest, templates, scripts, tests, snapshots, or `CLAUDE.md` in this documentation-authoring phase.
- Creating or updating existing packet documents.
- Creating `implementation-summary.md`, `description.json`, or `graph-metadata.json` in this folder.
- Changing the required core documents or the optional legacy `checklist.md` behavior.

### Files to Change in the Later Implementation Step

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/templates/manifest/before-after.md.tmpl` | Create | Level-agnostic before-and-after template |
| `.opencode/skills/system-spec-kit/templates/manifest/timeline.md.tmpl` | Create | Level-agnostic chronological timeline template |
| `.opencode/skills/system-spec-kit/templates/manifest/roadmap.md.tmpl` | Create | Level-agnostic forward-looking roadmap template |
| `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json` | Modify | Register document entries and all-level lazy lists |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modify | Add explicit lazy-add-on scaffolding opt-in |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modify | Validate lazy documents when present and remove the decision-record level gate |
| `.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts` | Review/adjust | Preserve manifest-driven required, optional, and lazy document lists |
| `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts` | Modify | Assert the new all-level lazy contract |
| `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts` | Modify | Cover lazy templates and explicit scaffold behavior |
| `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Record the approved rendered output |
| `CLAUDE.md` | Modify | Update the level-document table with lazy add-ons and the decoupled decision record |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register the three new document types as lazy add-ons at every Spec Kit level. | `spec-kit-docs.json` contains document entries for `before-after.md`, `timeline.md`, and `roadmap.md` with `creationTrigger: explicit-option` and `absenceBehavior: silent-skip`; each `levels.1`, `levels.2`, `levels.3`, and `levels.3+` `lazyAddonDocs` list contains all three names. |
| REQ-002 | Define stable, level-agnostic templates for the three new document types. | `before-after.md.tmpl` contains `metadata`, `summary`, `comparison`, `net-effect`, and `notes-caveats` anchors; its summary captures what changed and why, its comparison pairs before and after values by aspect, and its notes/caveats section records limits. `timeline.md.tmpl` contains `metadata`, `timeline`, and `milestones` anchors; each timeline entry records when, what happened, and outcome. `roadmap.md.tmpl` contains `metadata`, `now-next-later`, `milestones-targets`, and `dependencies` anchors; it records strategic forward work and stays distinct from execution tasks in `tasks.md`. |
| REQ-003 | Move `decision-record.md` into the lazy add-on contract at every level. | `decision-record.md` is absent from every `requiredAddonDocs` and `optionalAddonDocs` list, appears in every level's `lazyAddonDocs` list, and uses `creationTrigger: explicit-option` with `absenceBehavior: silent-skip` in the manifest document entry. |
| REQ-004 | Make lazy-document scaffolding opt in. | `create.sh` exposes the documented `--with-lazy-addons` flag; without the flag it creates no lazy add-on files, and with the flag it creates the requested lazy document set, including the three new types and `decision-record.md`. |
| REQ-005 | Treat lazy documents as valid when present without making them required. | `validate.sh` accepts each registered lazy document when present, ignores its absence, and reports no missing `decision-record.md` error for a Level 3 or Level 3+ packet that does not contain that file. |
| REQ-006 | Preserve backward compatibility for existing decision records. | A Level 3 or Level 3+ packet that already contains `decision-record.md` remains valid after the contract change, and the validator does not require a migration or rewrite of that file. |
| REQ-007 | Update contract tests and golden snapshots for the new manifest behavior. | The resolver tests assert all four lazy document names at Levels 1, 2, 3, and 3+; the scaffold golden suite renders the three new templates and records approved output without changing unrelated snapshots. |
| REQ-008 | Update the level-document table in `CLAUDE.md`. | The table distinguishes required core documents, optional documents, and lazy add-ons at each level; it identifies `decision-record.md` as on-demand rather than a Level 3 or Level 3+ requirement. |
| REQ-009 | Verify the complete contract and behavior matrix in the later implementation step. | Verification covers manifest registration, template anchors, default and opt-in scaffolding, validation with and without lazy documents, existing Level 3 and Level 3+ decision records, resolver expectations, golden snapshots, and the documentation table. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** any of Levels 1, 2, 3, or 3+, **when** the manifest contract is resolved, **then** `before-after.md`, `timeline.md`, `roadmap.md`, and `decision-record.md` appear in `lazyAddonDocs` and none appears in a required or optional add-on list.
- **SC-002**: **Given** an author requests a before-and-after, timeline, or roadmap document, **when** the later implementation renders its template, **then** the output contains the required document-specific anchors and no level-only gate markers.
- **SC-003**: **Given** a packet created without `--with-lazy-addons`, **when** the scaffold completes, **then** no lazy add-on file exists; **given** the same request with the flag, **when** the scaffold completes, **then** the four registered lazy add-on files exist.
- **SC-004**: **Given** a Level 3+ packet with an existing `decision-record.md`, **when** the later validator runs, **then** validation passes without changing the file; **given** a Level 3+ packet without it, **when** validation runs, **then** validation does not fail for its absence.
- **SC-005**: **Given** the implementation updates the manifest and templates, **when** the contract tests and golden snapshot suite run, **then** the new lazy-document expectations pass and unrelated rendered output remains unchanged.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing tests encode `decision-record.md` as a Level 3 and Level 3+ requirement. | The later contract change can leave stale assertions or snapshots. | Update resolver tests and golden expectations in the same implementation step. |
| Risk | The scaffold opt-in can accidentally create lazy files by default. | New packets gain unsolicited documents and violate the lazy contract. | Test the default path and the explicit `--with-lazy-addons` path separately. |
| Risk | New template anchors drift across document types. | Validation and downstream readers lose predictable structure. | Keep the required anchor table in the templates and assert every anchor in rendered-output checks. |
| Dependency | Manifest-driven contract resolver. | The validator and scaffold can disagree about document classification. | Keep all four lazy names in the manifest and verify resolver output at every level. |
| Dependency | Golden snapshot and contract-test fixtures. | The approved rendered contract lacks a regression baseline. | Update only the scoped snapshot entries and run the focused suite in the later step. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions remain for this design. The later implementation step uses `--with-lazy-addons` as the explicit scaffold opt-in and keeps the four lazy document names identical across all levels.

<!-- /ANCHOR:questions -->
