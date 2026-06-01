---
title: "Template Levels Phase 010/003: Template greenfield implementation"
description: "Executed the C+F hybrid manifest-driven greenfield template system across 4 gated phases. Shipped new private manifest, level-contract resolver, inline-gate renderer, and workflow-invariance CI test (Phase 1). Modified scaffolder to consume the resolver (Phase 2). Modified validators to consume the same manifest (Phase 3). Deleted 51 obsolete template files and the composer (Phase 4). Source surface dropped from 86 to approximately 13 files in templates/manifest/."
trigger_phrases:
  - "phase 010/003 changelog"
  - "template greenfield impl"
  - "manifest-driven implementation"
  - "level-contract resolver"
  - "delete level dirs"
  - "workflow invariance"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/003-manifest-template-implementation-plan` (Level 3)
> Parent packet: `026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

Phase 003 executed the C+F hybrid manifest-driven greenfield template system designed in phase 002. The implementation shipped across 4 gated phases:

**Phase 1 (ADD)**: Added the private manifest (`templates/manifest/spec-kit-docs.json`), 12 markdown template files (`*.md.tmpl`), `level-contract-resolver.ts`, `inline-gate-renderer.ts`, shell wrapper `resolve_level_contract`, and the `workflow-invariance.vitest.ts` CI test. Fixed 2 vocabulary leaks found in iter 12: replaced `[capability]` placeholder text with `[applicable]` in level_3/level_3+ templates, and replaced "Sub-phase manifest" with "Sub-phase list" in the phase-parent template. Zero production-path files were modified.

**Phase 2 (MODIFY scaffolder)**: Modified `create.sh` (approximately 30-line diff) to call `resolve_level_contract` instead of the hardcoded level-to-files matrix. Public CLI flag stayed `--level N` per ADR-005. Scaffold-comparison tests showed identical file lists for all 5 levels.

**Phase 3 (MODIFY validators)**: Modified `check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh`, `check-level.sh`, `check-level-match.sh`, `check-template-source.sh`, `check-template-staleness.sh`, and `template-structure.js` to consume the resolver. Error messages stayed level-only per ADR-005. Zero regressions against all existing spec folders.

**Phase 4 (DELETE legacy)**: Deleted `templates/{level_1,level_2,level_3,level_3+,core,addendum,phase_parent}/`, `scripts/templates/compose.sh`, and `wrap-all-templates.{ts,sh}`. Updated `SKILL.md`, `CLAUDE.md`, `AGENTS.md`, and `AGENTS_Barter.md`. Verified `rg "templates/level_"` returns zero active hits and one-commit rollback is clean.

### Added

- `templates/manifest/spec-kit-docs.json` (private manifest, per ADR-005 never AI-readable).
- 12 `templates/manifest/*.md.tmpl` files (4 author-core, 3 capability-gated, 2 author-optional, 3 lazy command/agent/workflow-owned).
- `mcp_server/lib/templates/level-contract-resolver.ts` with `resolveLevelContract()`, `resolveTemplate()`, `getRequiredDocs()`.
- `scripts/templates/inline-gate-renderer.ts` with EBNF-driven gate stripping.
- `scripts/lib/template-utils.sh::resolve_level_contract` (shell wrapper).
- `scripts/tests/workflow-invariance.vitest.ts` (CI test that greps for banned vocabulary).
- Vitest cases: resolver unit tests, inline-gate-renderer EBNF tests, 6 golden-snapshot scaffold tests.

### Changed

- `scripts/spec/create.sh` lines ~538-661: level-to-files matrix replaced with `resolve_level_contract` call.
- `scripts/lib/template-utils.sh::copy_template`: refactored to source resolver output.
- Validator scripts (8 files): now read level contracts from the private resolver instead of hardcoded matrices.
- `mcp_server/lib/validation/spec-doc-structure.ts`: consumes same resolver.
- `templates/manifest/level_3/spec.md.tmpl` and `level_3+/spec.md.tmpl`: `[capability]` replaced with `[applicable]`.
- `templates/manifest/phase_parent/spec.md.tmpl`: "Sub-phase manifest" replaced with "Sub-phase list".
- `SKILL.md`, `CLAUDE.md`, `AGENTS.md`, `AGENTS_Barter.md`: removed file-path references to deleted level dirs. Kept level vocabulary.

### Fixed

- Two ADR-005 vocabulary leaks in template text: `[capability]` placeholder and "Sub-phase manifest" wording (found in iter 12, fixed in Phase 1).
- Scaffold-comparison test discrepancy: stale empty addon stubs no longer generated (intended cleanup, not a bug).

### Verification

- Phase 1 gate: all new tests pass. Workflow-invariance test green. Existing `validate.sh --strict` unchanged.
- Phase 2 gate: scaffold-comparison test identical file lists for levels 1/2/3/3+/phase-parent. CLI help text contains zero banned vocabulary. Workflow-invariance test green.
- Phase 3 gate: zero validator regressions against all existing spec folders. Error messages stay level-only. Workflow-invariance test green.
- Phase 4 gate: `rg "templates/level_"` shows zero active hits. One-commit `git revert` rollback verified. Workflow-invariance test green.
- Deep-review: 5 iterations reviewed all production diffs. Review report accepted.

### Files Changed

| File | What changed |
|------|--------------|
| `templates/manifest/spec-kit-docs.json` (NEW) | Private manifest driving scaffold + validator |
| `templates/manifest/*.md.tmpl` (12 NEW files) | Author-core, capability-gated, and lazy addon templates |
| `mcp_server/lib/templates/level-contract-resolver.ts` (NEW) | Level-contract resolver API |
| `scripts/templates/inline-gate-renderer.ts` (NEW) | EBNF-driven inline gate stripper |
| `scripts/lib/template-utils.sh` | Added `resolve_level_contract` function |
| `scripts/spec/create.sh` | ~30-line diff: matrix replaced with resolver call |
| `scripts/rules/check-files.sh` | Refactored to consume resolver |
| `scripts/rules/check-sections.sh` | Refactored to consume resolver |
| `scripts/rules/check-template-headers.sh` | Refactored to consume resolver |
| `scripts/rules/check-section-counts.sh` | Refactored to consume resolver |
| `scripts/rules/check-level.sh` | Refactored to consume resolver |
| `scripts/rules/check-level-match.sh` | Refactored to consume resolver |
| `scripts/rules/check-template-source.sh` | Refactored to consume resolver |
| `scripts/rules/check-template-staleness.sh` | Refactored to consume resolver |
| `scripts/utils/template-structure.js` | Refactored to consume resolver |
| `mcp_server/lib/validation/spec-doc-structure.ts` | Refactored to consume resolver |
| `scripts/tests/workflow-invariance.vitest.ts` (NEW) | CI test for banned vocabulary |
| `SKILL.md` | Removed deleted-dir path references |
| `CLAUDE.md` | Removed deleted-dir path references |
| `AGENTS.md` | Removed deleted-dir path references |
| `AGENTS_Barter.md` | Removed deleted-dir path references |
| `templates/{level_1,level_2,level_3,level_3+,core,addendum,phase_parent}/` (DELETED) | 25 markdown files + 4 directory trees removed |
| `scripts/templates/compose.sh` (DELETED) | Build-time composer removed |
| `scripts/templates/wrap-all-templates.{ts,sh}` (DELETED) | ANCHOR wrapper removed |

Three commits touched this phase: `e933c152a7`, `79e97aec92`, `7beb807694`.

### Follow-Ups

- **Phase 004 (deferred followups).** Ten P1/P2 items deferred from Gate 7 of this implementation.
- **Phase 005 (skill references audit).** Audit `SKILL.md`, `references/`, and `assets/` for stale references.
- **Phase 006 (command md/yaml alignment).** Audit command Markdown and YAML workflow assets.
- **Phase 007 (fleet marker sweep).** Validate and clean fleet markers across spec folders.
- **Phase 008 (z_archive marker sweep).** Validate and clean archive markers.