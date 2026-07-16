---
title: "Template Deferred Followups: Validation Orchestrator, Manifest Versions, and Migration Guides"
description: "Ten Gate 7 items deferred from the manifest-template-implementation packet that needed policy decisions, CLI contract changes, and cross-script validation architecture work. A single Node.js orchestrator replaced shell validation, manifest-owned template versions were added, and migration documentation was published."
trigger_phrases:
  - "deferred followups"
  - "gate 7"
  - "template validation orchestrator"
  - "template manifest versions"
  - "canonical save advisory lock"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/004-fix-template-deferred-followups` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

Ten items deferred from the round-3 Gate 7 sweep of the manifest-template-implementation packet remained open because they required policy decisions on validation architecture, CLI contracts, and migration strategy. A single Node.js validation orchestrator replaced the legacy shell pipeline and brought strict-mode validation of a fresh Level 3 scaffold down to 106ms. Manifest-owned template version declarations, per-document section gate profiles, a batch inline renderer, canonical save advisory locking, lenient session-lineage warnings, and migration documentation were all delivered across four ordered phases.

### Added

- A single Node.js validation orchestrator (`validateFolder`) that accelerates strict-mode validation to 106ms.
- Manifest-owned template version declarations and per-document section gate profiles in the spec-kit docs manifest.
- A batch inline renderer mode with scaffold batching in the create scripts.
- Canonical save advisory lock handling with automatic stale cleanup in `generate-context.ts`.
- Lenient `SESSION_LINEAGE_BROKEN` warning semantics for non-null parent session identifier references.
- Template extension guide (`EXTENSION_GUIDE.md`) and migration documentation (`MIGRATION.md`).

### Changed

- `validate.sh` routes through the Node orchestrator by default, with legacy shell mode behind the `SPECKIT_VALIDATE_LEGACY=1` environment flag.
- The level contract resolver and template structure scripts accept nested section gates while preserving flat serialization.
- Exit codes follow a formal taxonomy (0 for success, 1 for user error, 2 for validation error, 3 for system error) across validation and documentation.
- Rendered output snapshot test coverage expanded for scaffold golden snapshots.

### Fixed

- None.

### Verification

- Workflow-invariance, level-contract-resolver, inline-gate-renderer, and scaffold-golden-snapshots test suites passed.
- Fresh Level 1, 2, 3, 3-plus, and phase-parent scaffolds validated in strict mode with no errors.
- The parent manifest-template-implementation-plan packet validated in strict mode.
- This deferred-followups packet itself validated in strict mode.
- Invalid create level exits with code 1, missing validate folder exits with code 3.
- Fresh Level 3 strict validation wall-clock measured 106ms against a target of under 2000ms.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/validation/orchestrator.ts` | Created | Single Node validation orchestrator for strict-mode performance |
| `mcp_server/api/index.ts` | Modified | Exported `validateFolder` from the orchestrator |
| `scripts/spec/validate.sh` | Modified | Default routing through Node orchestrator with legacy fallback flag |
| `templates/manifest/spec-kit-docs.json` | Modified | Added versions and per-document section gate profiles |
| `mcp_server/lib/level-contract-resolver.ts` | Modified | Extended to accept nested section gates |
| `scripts/lib/template-structure.js` | Modified | Extended to accept nested section gates |
| `scripts/template-utils.sh` | Modified | Added batch inline rendering and scaffold batching |
| `scripts/spec/create.sh` | Modified | Added batch scaffold rendering support |
| `scripts/memory/generate-context.ts` | Modified | Added canonical save advisory lock with stale cleanup |
| `mcp_server/lib/session-lineage.ts` | Modified | Added lenient `SESSION_LINEAGE_BROKEN` warning semantics |
| `templates/manifest/EXTENSION_GUIDE.md` | Created | Template manifest extension guide |
| `templates/manifest/MIGRATION.md` | Created | Template migration documentation |
| `tests/scaffold-golden-snapshots.vitest.ts` | Modified | Expanded rendered output snapshot coverage |

### Follow-Ups

- Residual Gate E annotation remains partially addressed: the live sentinel path for historical packet validation does not exist in the working tree and reports two warnings under strict validation.
- Full validation of all historical spec-kit packets was deferred. Only sentinel checks and the required A through D gates were executed.
