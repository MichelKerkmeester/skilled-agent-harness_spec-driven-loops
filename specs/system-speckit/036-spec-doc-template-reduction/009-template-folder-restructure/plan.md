---
title: "Implementation Plan: Restructure Spec-Kit Template Folders"
description: "Record the completed role-based template move, root contract promotion, resolver rewiring, consumer updates, compatibility checks, and verification evidence."
trigger_phrases:
  - "template folder restructure plan"
  - "role-based template layout"
  - "root contract manifest"
  - "template lookup resolver"
  - "spec-kit path migration"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Restructure Spec-Kit Template Folders

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, TypeScript, JSON, and Markdown |
| **Template Root** | `.opencode/skills/system-spec-kit/templates/` |
| **Contract** | `templates/spec-kit-docs.json` |
| **Scaffold** | `scripts/spec/create.sh` |
| **Resolver** | `mcp-server/lib/templates/level-contract-resolver.ts` |
| **Verification** | `create.sh` scaffold matrix, focused tests, golden snapshots, `tsc`, and MCP distribution build |

### Overview

The completed implementation moved 16 template sources from the mixed `manifest/` directory into `core/`, `addons/`, and `packet-types/`. It promoted the contract manifest and maintainer guides to the template root, renamed the old manifest README to `CONTRACT.md`, and removed the empty old folder.

The implementation then updated shell lookup, phase-parent scaffolding, TypeScript contract resolution, five test files, and reference documentation. The public document basenames remain stable, so existing packet output keeps the same contract while source ownership becomes explicit.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The old and new template trees were inspected with read-only `ls` and Git commands.
- [x] The four required Level-1 templates, nine add-ons, and three packet-type templates were enumerated.
- [x] Contract, resolver, scaffold, test, reference, compatibility, and verification requirements were defined in `spec.md`.

### Definition of Done

- [x] The 16 templates occupy the three role-based folders.
- [x] Contract assets occupy the template root and `manifest/` is removed.
- [x] Runtime lookup and phase-parent paths resolve the new locations.
- [x] Five test files and the reference documentation set use updated paths.
- [x] Existing basenames and rendered output remain compatible.
- [x] The supplied verification evidence is recorded, including the known pre-existing failure.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Use a role-based source tree with a root-level contract manifest. Keep template lookup basename-oriented so callers do not need to know whether a document is core, an add-on, or a packet type.

### Key Components

- **Core folder**: Holds `spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, and `implementation-summary.md.tmpl`.
- **Add-ons folder**: Holds checklist, decision, handover, debug, research, resource-map, before-after, timeline, and roadmap sources.
- **Packet-types folder**: Holds phase-parent, review, and context-index sources.
- **Root contract**: Holds `spec-kit-docs.json`, `CONTRACT.md`, `EXTENSION-GUIDE.md`, and `MIGRATION.md`.
- **Resolver and scaffold**: Resolve the root contract and search the role folders in a fixed order.

### Data Flow

1. `level-contract-resolver.ts` loads `templates/spec-kit-docs.json` from the source or distribution location.
2. `create.sh` receives manifest document basenames and asks `_manifest_template_path` to locate each source.
3. `_manifest_template_path` searches `core`, `addons`, and `packet-types`, then falls back to the template root.
4. Phase-parent creation uses `packet-types/phase-parent.spec.md.tmpl` explicitly, while normal levels use the same basename lookup.
5. Repointed tests and reference docs consume the role-based paths, and the verification matrix checks rendered output and contract behavior.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

The implementation completed these ordered phases. `tasks.md` owns the task state.

### Phase 1: Template and Contract Layout

- [x] Move the 16 sources into `core/`, `addons/`, and `packet-types/`.
- [x] Promote the manifest and maintainer guides to the template root.
- [x] Rename the old manifest README to `CONTRACT.md` and remove `manifest/`.

### Phase 2: Runtime Consumer Updates

- [x] Update role-folder lookup and root contract fallback in `template-utils.sh`.
- [x] Update phase-parent scaffold resolution in `create.sh`.
- [x] Update source and distribution manifest paths in `level-contract-resolver.ts`.

### Phase 3: Regression and Compatibility Verification

- [x] Repoint five tests and the reference documentation set.
- [x] Run the supplied all-level scaffold, snapshot, focused regression, compilation, and distribution-build checks.
- [x] Record the known pre-existing workflow-invariance taxonomy-leak failure.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Scaffold matrix | Levels 1, 2, 3, 3+, phase-parent, and lazy add-on option | `create.sh` with `FILE_EXISTS` assertions |
| Golden snapshots | Rendered template output and role-folder resolution | `scaffold-golden-snapshots.vitest.ts`, 9/9 passed |
| Focused regressions | Research gating, memory template contract, and thin continuity paths | Named focused test files, all green |
| Compiler check | TypeScript resolver and related MCP sources | `tsc`, exit status 0 |
| Distribution build | Generated MCP server output after resolver changes | MCP server distribution rebuild |
| Known failure isolation | Workflow invariance taxonomy leak | `feature-catalog/governance/feature-flag-governance.md`, also fails at HEAD |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `templates/spec-kit-docs.json` | Internal contract | Available | Scaffolding and contract resolution cannot agree on document sets. |
| Role-based template folders | Internal source tree | Available | Basename lookup cannot render the moved sources. |
| `template-utils.sh` | Internal shell helper | Updated | Normal scaffolding cannot locate moved files. |
| `create.sh` | Internal scaffold | Updated | Phase-parent creation can retain the obsolete direct path. |
| `level-contract-resolver.ts` | Internal TypeScript resolver | Updated | MCP consumers can load the obsolete manifest location. |
| Focused tests and references | Internal consumers | Updated | Stale paths can hide compatibility regressions. |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scoped integration check shows that a supported scaffold level, contract consumer, or existing rendered packet no longer resolves the stable document basenames.
- **Procedure**: Restore the 16 sources and contract assets to the former `manifest/` layout, restore the prior explicit consumer paths, and revert only the refactor's test and reference path edits. Re-run the scaffold, focused regression, snapshot, compiler, and distribution checks after the operator approves the rollback.

<!-- /ANCHOR:rollback -->

