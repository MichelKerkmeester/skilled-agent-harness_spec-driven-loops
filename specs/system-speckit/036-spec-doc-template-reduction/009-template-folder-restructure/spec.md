---
title: "Feature Specification: Restructure Spec-Kit Template Folders"
description: "Record the completed move from the mixed manifest template directory to role-based core, add-on, and packet-type folders, with contract promotion and consumer path updates."
trigger_phrases:
  - "template folder restructure"
  - "role-based template folders"
  - "spec-kit template manifest"
  - "template resolver paths"
  - "template contract promotion"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Restructure Spec-Kit Template Folders

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `036-spec-doc-template-reduction` |
| **Phase** | `009-template-folder-restructure` |
| **Artifact Set** | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The former `templates/manifest/` directory mixed required core templates, optional add-ons, packet-type templates, the contract manifest, and maintainer guides. The mixed layout obscured document roles and forced scripts, tests, and reference documentation to depend on one overloaded path.

### Purpose

Use `templates/core/`, `templates/addons/`, and `templates/packet-types/` for the 16 template sources, keep contract assets at `templates/` root, and update every in-scope resolver, scaffold, test, and reference consumer while preserving existing document names and behavior.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Move the four required Level-1 sources into `templates/core/`.
- Move the nine add-on sources into `templates/addons/`.
- Move the three packet-type sources into `templates/packet-types/`.
- Promote `spec-kit-docs.json`, `EXTENSION-GUIDE.md`, and `MIGRATION.md` to `templates/`, rename the former manifest README to `CONTRACT.md`, and remove the empty `manifest/` directory.
- Update template lookup, Level contract resolution, phase-parent scaffolding, five repointed test files, and reference documentation.
- Record the completed verification matrix and the known pre-existing workflow-invariance failure.

### Out of Scope

- Changing the rendered content contract of the 16 templates.
- Rewriting existing packet documents or changing their required filenames.
- Running generators, validators, tests, or Git write operations during this documentation-authoring pass.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/templates/core/` | Move | Four required core template sources |
| `.opencode/skills/system-spec-kit/templates/addons/` | Move | Nine optional or workflow add-on sources |
| `.opencode/skills/system-spec-kit/templates/packet-types/` | Move | Three special packet-type sources |
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | Promote | Root contract manifest |
| `.opencode/skills/system-spec-kit/templates/CONTRACT.md` | Rename/Promote | Contract guide formerly named `manifest/README.md` |
| `.opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md` | Promote | Maintainer extension guide |
| `.opencode/skills/system-spec-kit/templates/MIGRATION.md` | Promote | Maintainer migration guide |
| `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh` | Modify | Role-folder template lookup and root contract fallback |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modify | Phase-parent and contract-backed scaffold paths |
| `.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts` | Modify | Root manifest resolution and contract projection |
| `.opencode/skills/system-spec-kit/scripts/tests/` and `.opencode/skills/system-spec-kit/mcp-server/tests/` | Modify | Five repointed tests and related snapshot coverage |
| `.opencode/skills/system-spec-kit/references/` and related guidance paths | Modify | Updated template references |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Separate template sources by role and remove the obsolete manifest folder. | The tree contains four files in `templates/core/`, nine files in `templates/addons/`, and three files in `templates/packet-types/`. The former `templates/manifest/` directory and its 16 source entries no longer exist. |
| REQ-002 | Promote the contract and maintainer documentation to the template root. | `templates/spec-kit-docs.json`, `templates/EXTENSION-GUIDE.md`, `templates/MIGRATION.md`, and `templates/CONTRACT.md` exist. `CONTRACT.md` carries the contract role formerly provided by `manifest/README.md`. |
| REQ-003 | Update runtime template and contract resolution for the new layout. | `_manifest_template_path` searches `core`, `addons`, and `packet-types` before the template root; `create.sh` resolves `phase-parent.spec.md.tmpl` from `packet-types/`; and `level-contract-resolver.ts` uses the root `spec-kit-docs.json` for both source and distribution paths. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Repoint tests and reference documentation to the role-based layout. | The diff updates `scaffold-golden-snapshots.vitest.ts`, `research-template-gating.vitest.ts`, `memory-template-contract.vitest.ts`, `workflow-invariance.vitest.ts`, and `thin-continuity-record.vitest.ts` to use the new paths. The read-only diff also updates the reference and related guidance surfaces, including the 16 files under `system-spec-kit/references/`. |
| REQ-005 | Preserve backward compatibility for packet authors and existing rendered output. | Core template basenames remain `spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, and `implementation-summary.md.tmpl`; manifest-driven contract consumers continue to resolve those names; the all-level scaffold matrix passes; and golden snapshots pass 9/9. Existing packet documents require no migration. |
| REQ-006 | Verify the completed refactor and isolate known pre-existing failures. | The recorded verification passes Level 1, Level 2, Level 3, Level 3+, phase-parent, and `--with-lazy-addons` scaffold cases with `FILE_EXISTS`; research-gating, memory-contract, and thin-continuity checks are green; TypeScript compilation exits 0; the MCP server distribution is rebuilt; and the workflow-invariance taxonomy-leak failure is documented as pre-existing because it also fails at HEAD. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 16 source templates are discoverable in role-based folders whose names distinguish core, add-on, and packet-type responsibilities.
- **SC-002**: The contract manifest and its two maintainer guides live at `templates/` root, while the former manifest README is available as `CONTRACT.md`.
- **SC-003**: Shell and TypeScript consumers resolve the root contract and role-folder templates without changing the public document basenames.
- **SC-004**: Repointed tests and reference documentation use the new layout, and existing packet output remains compatible.
- **SC-005**: The supplied scaffold, snapshot, focused regression, compilation, and distribution-build evidence passes, with the one known pre-existing taxonomy leak explicitly isolated.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A consumer retains a direct `templates/manifest/` path. | Scaffolding, tests, or documentation can fail after the move. | Update lookup helpers, explicit phase-parent paths, resolver constants, named tests, and reference surfaces together. |
| Risk | Role folders contain duplicate basenames. | Lookup order could resolve the wrong template. | Keep one source per template basename and search the distinct role folders in a fixed order before the root fallback. |
| Risk | Existing packets depend on unchanged rendered names. | Authors could face unnecessary migration work. | Preserve basenames, retain the manifest-driven contract, and compare the golden snapshots and all-level scaffold output. |
| Dependency | Root `spec-kit-docs.json` | Runtime contract resolution depends on the promoted manifest. | Point both source and distribution resolver paths at the root file and rebuild the MCP distribution. |
| Dependency | Focused regression and reference suites | Path updates need consumer coverage. | Repoint the five named tests and update the reference documentation set before verification. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions remain. The refactor keeps the manifest as the contract source, moves template files by role, and preserves public document names.

<!-- /ANCHOR:questions -->

