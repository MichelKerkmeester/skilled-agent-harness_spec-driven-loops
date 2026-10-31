---
title: "Implementation Summary: Restructure Spec-Kit Template Folders"
description: "Recorded the completed role-based template move, root contract promotion, resolver rewiring, consumer updates, compatibility evidence, and verification results."
trigger_phrases:
  - "template folder restructure implementation"
  - "role-based template move"
  - "root contract promotion"
  - "template resolver compatibility"
  - "spec-kit restructure verification"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-template-folder-restructure |
| **Completed** | 2026-08-27 |
| **Authored** | 2026-08-27 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The refactor makes the Spec Kit template tree legible by role while preserving the public document contract. Sixteen sources moved out of the mixed `manifest/` directory, the contract assets moved to the template root, and runtime consumers now resolve the new locations.

### Role-Based Template Tree

The final source tree contains four required templates in `core/`, nine add-on templates in `addons/`, and three packet-type templates in `packet-types/`. The former `manifest/` directory is absent. `spec-kit-docs.json`, `EXTENSION-GUIDE.md`, and `MIGRATION.md` exist at the template root, and the former manifest README is represented by root `CONTRACT.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/templates/core/` | Moved | Required `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` sources |
| `.opencode/skills/system-spec-kit/templates/addons/` | Moved | Checklist, decision, workflow, research, resource-map, and history/planning add-ons |
| `.opencode/skills/system-spec-kit/templates/packet-types/` | Moved | Phase-parent, review, and context-index sources |
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | Promoted | Root manifest contract |
| `.opencode/skills/system-spec-kit/templates/CONTRACT.md` | Renamed/Promoted | Contract documentation formerly held by `manifest/README.md` |
| `.opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md` | Promoted | Maintainer extension guidance |
| `.opencode/skills/system-spec-kit/templates/MIGRATION.md` | Promoted | Maintainer migration guidance |
| `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh` | Modified | Role-folder lookup and root fallback |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modified | `packet-types/` phase-parent path and contract-backed scaffolding |
| `.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts` | Modified | Root manifest paths and optional contract projection |
| Five named test files | Modified | New role-folder and root contract paths |
| Reference and guidance documentation | Modified | Updated template references across the system-spec-kit documentation surfaces |
| `.opencode/skills/system-spec-kit/mcp-server/dist/` | Rebuilt | Generated MCP server output after resolver changes |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The refactor was already executed and verified before this packet was authored. This authoring pass confirmed the final directory layout with `ls` and the changed paths with read-only Git status and diff commands. It did not run `generate-context.js`, `validate.sh`, tests, or any Git write operation.

The supplied execution evidence covers every supported scaffold level and phase-parent mode, the explicit lazy add-on option, focused regressions, golden snapshots, TypeScript compilation, and the MCP distribution rebuild. The verification table records the one workflow-invariance taxonomy leak as a pre-existing failure rather than attributing it to this refactor.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split sources by role | Folder names make required core documents, add-ons, and packet types obvious to maintainers. |
| Keep the manifest at the template root | Contract consumers now find the registry beside the content it governs without mixing it into a source role. |
| Resolve by basename across role folders | Existing scaffold callers keep their public document names and do not need role-specific knowledge. |
| Use `packet-types/phase-parent.spec.md.tmpl` for phase scaffolding | Phase-parent creation has a special packet shape and now points to its explicit role folder. |
| Preserve existing packet output | Stable basenames, all-level scaffold checks, and 9/9 golden snapshots protect backward compatibility. |
| Isolate the taxonomy leak | `feature-catalog/governance/feature-flag-governance.md` contains the banned word `manifest`; the same test fails at HEAD, so the refactor leaves it documented and unchanged. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Template tree inventory | PASS: `ls` shows 4 core, 9 add-on, and 3 packet-type sources; `manifest/` is absent. |
| Root contract inventory | PASS: `spec-kit-docs.json`, `EXTENSION-GUIDE.md`, `MIGRATION.md`, and `CONTRACT.md` exist at `templates/`. |
| Resolver and lookup wiring | PASS: read-only diff shows role-folder search, root contract fallback, `packet-types/` phase-parent resolution, and root resolver constants. |
| Scaffold matrix | PASS: Level 1, Level 2, Level 3, Level 3+, phase-parent, and `--with-lazy-addons` cases resolve the new folders and pass `FILE_EXISTS`. |
| Golden snapshots | PASS: 9/9. |
| Focused regressions | PASS: research-gating, memory-contract, and thin-continuity checks are green. |
| TypeScript compilation | PASS: `tsc` exited with status 0. |
| MCP server distribution | PASS: `mcp-server/dist/` was rebuilt; fresh August 27 distribution artifacts are present. |
| Workflow invariance taxonomy check | KNOWN PRE-EXISTING FAILURE: `feature-catalog/governance/feature-flag-governance.md` contains the banned word `manifest`; the failure reproduces at HEAD. |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-existing taxonomy-leak failure**: The workflow-invariance test still fails on `feature-catalog/governance/feature-flag-governance.md` because that document contains the banned word `manifest`. The same failure exists at HEAD and is outside this refactor.
2. **Verification was not rerun during packet authoring**: The packet records the supplied completed verification evidence and the read-only tree confirmation. The authoring pass intentionally ran no tests, validators, generators, or Git writes.

<!-- /ANCHOR:limitations -->

