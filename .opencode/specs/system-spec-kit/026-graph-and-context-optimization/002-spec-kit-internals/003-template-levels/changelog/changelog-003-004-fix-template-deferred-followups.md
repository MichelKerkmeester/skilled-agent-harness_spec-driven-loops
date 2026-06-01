

---
title: "Template deferred followups complete"
description: "Ten Gate 7 deferred items shipped including validation orchestrator, manifest versioning, section gates, batch rendering, save locking, and migration docs."
trigger_phrases:
  - "deferred followups complete"
  - "round 4 complete"
  - "validation orchestrator"
  - "manifest versions"
  - "template levels"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/004-fix-template-deferred-followups` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

This packet delivered the ten Gate 7 items that were deferred from the parent 003 implementation plan. The changes include a Node validation orchestrator for performance, manifest versioning and per-document section gates, nested gate support in template resolution, batch scaffold rendering, canonical save advisory locking, session lineage warning semantics, and migration documentation. Validation gates now run green on fresh Level 1 through 3+ scaffolds in under 200ms.

### Added

- Validation orchestrator (`mcp_server/lib/validation/orchestrator.ts`) and `validateFolder` export in the API index.
- Manifest-owned `versions` field and per-document `sectionGates` profiles in `templates/manifest/spec-kit-docs.json`.
- `inline-gate-renderer --level N --out-dir DIR file...` CLI command for batch scaffold rendering.
- Canonical save advisory lock handling in `scripts/memory/generate-context.ts`.
- `SESSION_LINEAGE_BROKEN` warning semantics for non-null `parent_session_id` references.
- `templates/manifest/EXTENSION_GUIDE.md` and `templates/manifest/MIGRATION.md` documentation.
- Expanded rendered-output snapshot coverage in `scaffold-golden-snapshots.vitest.ts`.

### Changed

- `scripts/spec/validate.sh` routes through the orchestrator by default with legacy shell validation available behind `SPECKIT_VALIDATE_LEGACY=1`.
- `level-contract-resolver.ts` and `template-structure.js` accept nested section gates while preserving flat serialization.
- Batch scaffold rendering added to `template-utils.sh` and standard `create.sh`.

### Fixed

- None.

### Verification

- Gate A PASS: workflow-invariance, level-contract-resolver, inline-gate-renderer, and scaffold-golden-snapshots tests passed.
- Gate B PASS: fresh Level 1, 2, 3, 3+, and phase-parent scaffolds validated in strict mode.
- Gate C PASS: 003-manifest-template-implementation-plan validated in strict mode.
- Gate D PASS: 004-fix-template-deferred-followups validated in strict mode.
- Gate F PASS: invalid create level exits with code 1; missing validate folder exits with code 3.
- Gate G PASS: fresh Level 3 strict validation wall-clock measured 106ms against target under 2000ms.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/validation/orchestrator.ts` | Created | Node validation orchestrator module |
| `mcp_server/api/index.ts` | Modified | Added validateFolder export |
| `scripts/spec/validate.sh` | Modified | Default orchestrator routing, legacy mode flag |
| `templates/manifest/spec-kit-docs.json` | Modified | Added versions and sectionGates profiles |
| `level-contract-resolver.ts` | Modified | Nested section gate support |
| `template-structure.js` | Modified | Flat serialization preservation |
| `scripts/memory/generate-context.ts` | Modified | Canonical save advisory lock |
| `template-utils.sh` | Modified | Batch scaffold rendering |
| `create.sh` | Modified | Standard rendering path |
| `inline-gate-renderer` | Created | Batch gate rendering CLI |
| `templates/manifest/EXTENSION_GUIDE.md` | Created | Extension documentation |
| `templates/manifest/MIGRATION.md` | Created | Migration guide |
| `scaffold-golden-snapshots.vitest.ts` | Modified | Expanded snapshot coverage |

### Follow-Ups

- None.
