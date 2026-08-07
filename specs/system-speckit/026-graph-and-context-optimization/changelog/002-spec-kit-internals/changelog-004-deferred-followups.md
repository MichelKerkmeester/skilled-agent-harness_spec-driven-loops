---
title: "Template Levels Phase 010/004: Deferred followups"
description: "Implemented ten P1/P2 items deferred from 003 Gate 7. Key additions: single-process validation orchestrator for faster strict checks, manifest-owned template versioning, session-lineage lenient warnings, explicit exit-code taxonomy, batch inline renderer mode, and canonical save advisory lock. Five ADRs formalized the policy choices."
trigger_phrases:
  - "phase 010/004 changelog"
  - "deferred followups"
  - "validation orchestrator"
  - "manifest template versions"
  - "save advisory lock"
  - "exit code taxonomy"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels` (Level 3)
> Parent packet: `026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

Phase 004 implemented the ten P1/P2 items deferred from 003 Gate 7 after the greenfield implementation landed. The most impactful changes were: (1) a single-process validation orchestrator that loads rule metadata once, bringing fresh Level 3 strict validation under 2000ms. (2) Manifest-owned template versions that expose `templateVersions` via the resolver and let staleness checks read the manifest map. (3) Batch `--out-dir` mode for the inline-gate-renderer. (4) A canonical save advisory lock in `generate-context.js`. (5) An explicit exit-code taxonomy (1 for bad flags, 2 for validation failures, 3 for missing folders).

Five ADRs formalize the policy choices: validation orchestration, lenient session-lineage warnings (missing non-null parents warn instead of fail, null parents skip silently), exit-code semantics, manifest version evolution, and legacy marker migration policy (indefinite support for existing SPECKIT_TEMPLATE_SOURCE markers as descriptive provenance).

### Added

- `mcp_server/lib/validation/orchestrator.ts` (NEW): single-process validation orchestration that batches rule metadata loading.
- `templates/manifest/EXTENSION_GUIDE.md` (NEW): documents the new document-type extension workflow.
- `templates/manifest/MIGRATION.md` (NEW): documents the legacy marker and broad-doc-list migration policy.
- Batch `--out-dir` mode in `inline-gate-renderer.ts`.
- Canonical save advisory lock in `generate-context.js` (stale-lock cleanup after 30 seconds).
- Exit-code taxonomy: 1 (bad create flags), 2 (validation failures), 3 (missing validation folders).
- Manifest `templateVersions` field and per-document `sectionGatesByDocument` profiles.
- ADRs for validation, lineage, exit codes, version, and migration policy in `decision-record.md`.

### Changed

- `templates/manifest/spec-kit-docs.json`: added `templateVersions` map and `sectionGatesByDocument` profiles.
- `scripts/spec/validate.sh`: routes validation through the orchestrator and applies the exit-code taxonomy.
- `scripts/templates/inline-gate-renderer.ts`: added batch `--out-dir` mode.
- `scripts/memory/generate-context.ts`: added canonical save advisory lock with stale cleanup.

### Fixed

- Strict validation performance: fresh Level 3 validation now completes under 2000ms (previously slower due to multiple process spawns).
- `parent_session_id: null` no longer triggers spurious warnings. Missing non-null parents now emit `SESSION_LINEAGE_BROKEN` as a warning rather than an error.

### Verification

- 003 and 004 packets validate cleanly in strict mode.
- Workflow-invariance, resolver, renderer, and snapshot tests pass.
- Fresh Level 1, 2, 3, 3+, and phase-parent scaffolds validate.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/lib/validation/orchestrator.ts` (NEW) | Single-process validation orchestration |
| `templates/manifest/spec-kit-docs.json` | Added `templateVersions` and `sectionGatesByDocument` |
| `templates/manifest/EXTENSION_GUIDE.md` (NEW) | Extension workflow documentation |
| `templates/manifest/MIGRATION.md` (NEW) | Migration policy documentation |
| `scripts/spec/validate.sh` | Orchestrator routing and exit-code taxonomy |
| `scripts/templates/inline-gate-renderer.ts` | Batch `--out-dir` mode |
| `scripts/memory/generate-context.ts` | Canonical save advisory lock |
| `004-template-deferred-followup-fixes/decision-record.md` | Five ADRs (validation, lineage, exit codes, version, migration) |
| `004-template-deferred-followup-fixes/implementation-summary.md` | Followup outcomes summary |

Three commits: `e933c152a7`, `79e97aec92`, `bdb739d973`.

### Follow-Ups

- **Phase 005 (skill references audit).** Align SKILL.md and references/ with the new template system.
- **Phase 006 (command md/yaml alignment).** Align command Markdown and YAML assets.
- **Phase 007 (fleet marker sweep).** Validate fleet markers across spec folders.
- **Phase 008 (z_archive marker sweep).** Validate archive markers.