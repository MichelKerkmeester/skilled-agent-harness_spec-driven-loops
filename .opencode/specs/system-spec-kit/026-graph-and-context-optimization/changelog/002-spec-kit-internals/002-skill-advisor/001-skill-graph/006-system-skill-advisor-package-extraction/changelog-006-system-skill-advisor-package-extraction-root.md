---
title: "Phase Parent Rollup: system skill advisor package extraction"
description: "Rollup of 30 child phase changelogs under 006-system-skill-advisor-package-extraction. Each child shipped independently and is listed in the Included Phases table. Detail lives in the child changelogs."
trigger_phrases:
  - "006-system-skill-advisor-package-extraction rollup"
  - "006-system-skill-advisor-package-extraction phase parent"
  - "006-system-skill-advisor-package-extraction changelog index"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction` (Level <!-- SPECKIT_LEVEL: phase -->, Phase Parent)

### Summary

This phase parent groups 30 child phases spanning 2026-05-14 to 2026-05-31. Each child phase shipped independently and carries its own changelog with full detail. The Included Phases table below is the authoritative child inventory. Read each child changelog for the per-phase summary, verification, and files changed.

### Included Phases

| Changelog | Date | Title |
|-----------|------|-------|
| [changelog-006-001-extraction-design-and-adr.md](./001-extraction-design-and-adr/changelog-006-001-extraction-design-and-adr.md) | 2026-05-18 | Skill Advisor Extraction: Design + ADR Phase 001 |
| [changelog-006-002-system-skill-advisor-package-scaffold.md](./002-system-skill-advisor-package-scaffold/changelog-006-002-system-skill-advisor-package-scaffold.md) | 2026-05-14 | Skill Advisor Package Scaffold: Envelope authored per ADR-001 standalone-MCP shape |
| [changelog-006-003-advisor-source-db-tests-migration.md](./003-advisor-source-db-tests-migration/changelog-006-003-advisor-source-db-tests-migration.md) | 2026-05-14 | Skill Advisor Package Extraction Phase 003: Advisor Source DB and Tests Migration Recalibration |
| [changelog-006-004-standalone-mcp-launcher-runtime-configs.md](./004-standalone-mcp-launcher-runtime-configs/changelog-006-004-standalone-mcp-launcher-runtime-configs.md) | 2026-05-14 | Skill Advisor Phase 004: Standalone MCP Launcher and Runtime Configs |
| [changelog-006-005-hook-compatibility-consumer-cutover.md](./005-hook-compatibility-consumer-cutover/changelog-006-005-hook-compatibility-consumer-cutover.md) | 2026-05-14 | Phase 005: Hook Compatibility and Consumer Cutover |
| [changelog-006-006-clean-validation-and-remove-deprecated-code.md](./006-clean-validation-and-remove-deprecated-code/changelog-006-006-clean-validation-and-remove-deprecated-code.md) | 2026-05-14 | Skill Advisor Phase 006: Validate Extraction and Remove Deprecated Bridge |
| [changelog-006-007-skill-advisor-db-rename.md](./007-skill-advisor-db-rename/changelog-006-007-skill-advisor-db-rename.md) | 2026-05-14 | Changelog: Skill graph DB rename |
| [changelog-006-008-skill-graph-tools-advisor-migration.md](./008-skill-graph-tools-advisor-migration/changelog-006-008-skill-graph-tools-advisor-migration.md) | 2026-05-14 | Skill Graph Tools Advisor Migration: Move skill_graph_* MCP tools to system_skill_advisor ownership |
| [changelog-006-009-fix-script-filesystem-scope.md](./009-fix-script-filesystem-scope/changelog-006-009-fix-script-filesystem-scope.md) | 2026-05-14 | Fix advisor-script filesystem-scope resolution bugs |
| [changelog-006-010-skill-id-field-rename.md](./010-skill-id-field-rename/changelog-006-010-skill-id-field-rename.md) | 2026-05-14 | Skill Advisor Graph: Align canonical skill id to folder name |
| [changelog-006-011-mcp-server-package-extraction.md](./011-mcp-server-package-extraction/changelog-006-011-mcp-server-package-extraction.md) | 2026-05-14 | Full MCP extraction of skill graph library and lifecycle |
| [changelog-006-012-sk-doc-documentation-alignment.md](./012-sk-doc-documentation-alignment/changelog-006-012-sk-doc-documentation-alignment.md) | 2026-05-14 | Advisor doc alignment with sk-doc [006/012] |
| [changelog-006-013-remove-spec-kit-references.md](./013-remove-spec-kit-references/changelog-006-013-remove-spec-kit-references.md) | 2026-05-14 | Changelog: Sweep stale advisor refs from spec-kit docs |
| [changelog-006-014-manual-testing-playbook-validation.md](./014-manual-testing-playbook-validation/changelog-006-014-manual-testing-playbook-validation.md) | 2026-05-31 | Skill Advisor Manual Testing Playbook Validation |
| [changelog-006-015-mcp-server-mk-skill-advisor-rename.md](./015-mcp-server-mk-skill-advisor-rename/changelog-006-015-mcp-server-mk-skill-advisor-rename.md) | 2026-05-31 | Changelog: Rename system_skill_advisor MCP server to mk_skill_advisor |
| [changelog-006-016-fix-deep-review-p2-findings-for-package-extraction.md](./016-fix-deep-review-p2-findings-for-package-extraction/changelog-006-016-fix-deep-review-p2-findings-for-package-extraction.md) | 2026-05-31 | P2 remediation for 015 deep-review advisories |
| [changelog-006-017-fix-deep-review-p1-findings-for-package-extraction.md](./017-fix-deep-review-p1-findings-for-package-extraction/changelog-006-017-fix-deep-review-p1-findings-for-package-extraction.md) | 2026-05-15 | Skill Advisor Package Extraction Phase 017: Fix Deep-Review P1 Findings |
| [changelog-006-018-fix-followup-p2-findings-for-package-extraction.md](./018-fix-followup-p2-findings-for-package-extraction/changelog-006-018-fix-followup-p2-findings-for-package-extraction.md) | 2026-05-31 | Changelog: 10-iter P2 cleanup |
| [changelog-006-019-spec-kit-advisor-decoupling.md](./019-spec-kit-advisor-decoupling/changelog-006-019-spec-kit-advisor-decoupling.md) | 2026-05-31 | Spec-Kit Advisor Import Decoupling |
| [changelog-006-020-spec-kit-codegraph-decoupling.md](./020-spec-kit-codegraph-decoupling/changelog-006-020-spec-kit-codegraph-decoupling.md) | 2026-05-31 | Spec Kit Code Graph Decoupling |
| [changelog-006-021-codegraph-rpc-surface.md](./021-codegraph-rpc-surface/changelog-006-021-codegraph-rpc-surface.md) | 2026-05-31 | Changelog: Code Graph RPC Classifier Surface |
| [changelog-006-022-plugin-bridge-unit-test-isolation.md](./022-plugin-bridge-unit-test-isolation/changelog-006-022-plugin-bridge-unit-test-isolation.md) | 2026-05-31 | Plugin bridge unit test isolation |
| [changelog-006-023-subprocess-environment-whitelist.md](./023-subprocess-environment-whitelist/changelog-006-023-subprocess-environment-whitelist.md) | 2026-05-31 | Subprocess Environment Whitelist for Skill Advisor |
| [changelog-006-024-dfidf-cold-start-cache.md](./024-dfidf-cold-start-cache/changelog-006-024-dfidf-cold-start-cache.md) | 2026-05-31 | DFIDF cold start cache |
| [changelog-006-025-parent-documentation-drift-refresh.md](./025-parent-documentation-drift-refresh/changelog-006-025-parent-documentation-drift-refresh.md) | 2026-05-31 | Parent doc drift refresh |
| [changelog-006-026-sk-code-readme-audit.md](./026-sk-code-readme-audit/changelog-006-026-sk-code-readme-audit.md) | 2026-05-31 | sk-code compliance and code README coverage audit |
| [changelog-006-027-typescript-header-normalization.md](./027-typescript-header-normalization/changelog-006-027-typescript-header-normalization.md) | 2026-05-31 | Changelog: TypeScript Header Normalization |
| [changelog-006-028-generated-js-declaration-alignment.md](./028-generated-js-declaration-alignment/changelog-006-028-generated-js-declaration-alignment.md) | 2026-05-31 | Generated JS and Declaration Alignment |
| [changelog-006-029-python-package-header-policy.md](./029-python-package-header-policy/changelog-006-029-python-package-header-policy.md) | 2026-05-31 | Python Package Header Policy |
| [changelog-006-030-any-type-justification-sweep.md](./030-any-type-justification-sweep/changelog-006-030-any-type-justification-sweep.md) | 2026-05-31 | Any Type Justification Sweep |

### Added

- None. Detail lives in the child phase changelogs.

### Changed

- None. Detail lives in the child phase changelogs.

### Fixed

- None. Detail lives in the child phase changelogs.

### Verification

- All 30 child phases were verified independently. See each child changelog for per-phase verification evidence.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/` (child phases) | n/a | Rollup of 30 child phase changelogs, no direct source changes at the parent level |

### Follow-Ups

- None.
