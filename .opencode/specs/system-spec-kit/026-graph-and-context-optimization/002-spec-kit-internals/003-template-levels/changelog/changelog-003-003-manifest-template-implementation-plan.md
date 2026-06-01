---
title: "Template Greenfield Implementation — Manifest-Driven Level Contract System"
description: "Spec Kit migrated from parallel rendered template trees to a single manifest-driven Level contract system, eliminating drift between scaffolding and validation while preserving the public Level vocabulary."
trigger_phrases:
  - "template greenfield implementation"
  - "manifest-driven template system"
  - "level-contract resolver"
  - "legacy template removal"
  - "workflow-invariance test"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/003-manifest-template-implementation-plan` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

Spec Kit previously maintained parallel rendered template trees with separate file matrices in the scaffolder and validators, causing silent drift and shipping stale empty stub documents in fresh packets. This phase replaced the entire system with a unified manifest-driven Level contract. Scaffolding, validation, AI-facing instructions, feature catalog entries, and manual playbooks now all describe the same public model: Level 1, Level 2, Level 3, Level 3+, and phase-parent packets.

### Added
- A resolver-backed template system with a TypeScript level-contract resolver and inline gate renderer that generates packet documentation from a single manifest source
- A Level-contract manifest (spec-kit-docs.json) serving as the single source of truth for packet document structure across all five levels
- Shell-level Level contract resolution in template-utils.sh so create.sh renders only the sections that apply to the requested Level
- Twelve private template source files driving document generation for all packet levels

### Changed
- create.sh scaffolding resolves Level through the manifest and renders documents directly instead of copying from pre-built level directories
- Validator rules for file presence, section presence, template headers, section counts, template-source provenance, and phase-parent lean-trio behavior now validate against the generated Level output
- Agent prompts, command documentation, workflow YAML, skill documentation, references, catalog entries, and manual testing playbooks rewritten to use only the public Level vocabulary
- The workflow-invariance test expanded to scan feature catalog and manual testing playbook surfaces directly with a narrowed source-path and import allowlist

### Fixed
- Drift between scaffolding and validation file matrices eliminated by moving both subsystems to consume the same manifest
- Stale empty stub documents no longer appear in freshly scaffolded packets because addon documents are now rendered only when their owning workflow calls for them
- Rendered documents now start at byte 0 with the frontmatter delimiter and template-source markers render as HTML comments after the frontmatter block

### Verification
- Workflow invariance test: PASS (all six surface categories covered: live script outputs, fixture snapshots, template sources, command docs, agent prompts, skill and root policy docs)
- Allowlist verification: PASS (only the capability-flags.ts source filename and import references exempted)
- Catalog and playbook leak scan: PASS (no roadmap or composer-doc compose.sh references found outside historical fixtures)
- Sentinel packet validation: PASS (three active sentinels reported zero errors; older template packets matched pre-existing warning baselines; archived 020 packet validated with zero errors)
- Fresh scaffold validation: PASS (Level 1, 2, 3, 3+, and phase-parent generated and validated with zero errors and zero warnings)
- Round-2 remediation gates: PASS (traversal rejection, default scaffold performance, opt-in validation, README stale-reference grep, memory parser fixtures, workflow-invariance, strict packet validation)
- Round-3 remediation gates: PASS (workflow-invariance fallback, four named Vitest suites, five-level scaffold and validate loop, phase mode, traversal rejection, strict validation, typecheck, build, dist runtime verification)
- Rollback dry-run: PASS (worktree restored to pre-implementation state cleanly)
- Final packet validation: PASS (Errors: 0, Warnings: 0)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| templates/manifest/spec-kit-docs.json | Created | Single manifest defining document structure for all five packet levels |
| templates/manifest/*.md.tmpl (12 files) | Created | Private template sources for packet document generation |
| scripts/dist/template/level-contract-resolver.ts | Created | TypeScript resolver that loads the manifest and selects the Level-appropriate contract |
| scripts/dist/template/inline-gate-renderer.ts | Created | TypeScript renderer that applies inline gates to template output |
| scripts/shell/template-utils.sh | Modified | Added resolve_level_contract function for shell-side contract resolution |
| scripts/shell/create.sh | Modified | Migrated from directory-copy scaffolding to manifest-driven document rendering |
| scripts/shell/recommend-level.sh | Modified | Updated to use the public Level vocabulary |
| scripts/shell/upgrade-level.sh | Modified | Updated to use the public Level vocabulary |
| scripts/shell/scaffold-debug-delegation.sh | Modified | Updated to use the public Level vocabulary |
| scripts/validate/check-files.sh | Modified | Migrated file-presence validation to consume the Level contract |
| scripts/validate/check-sections.sh | Modified | Migrated section-presence validation to consume the Level contract |
| scripts/validate/check-template-headers.sh | Modified | Migrated template-header validation to consume the Level contract |
| scripts/validate/check-section-counts.sh | Modified | Migrated section-count validation to consume the Level contract |
| scripts/validate/check-level.sh | Modified | Migrated Level validation to consume the Level contract |
| scripts/validate/check-level-match.sh | Modified | Migrated Level-match validation to consume the Level contract |
| scripts/validate/check-template-source.sh | Modified | Migrated template-source validation to consume the Level contract |
| scripts/validate/check-template-staleness.sh | Modified | Migrated staleness validation to consume the Level contract |
| mcp_server/lib/validation/template-structure.js | Modified | Migrated JS validation structure to consume the Level contract |
| mcp_server/lib/validation/spec-doc-structure.ts | Modified | Migrated TypeScript validation structure to consume the Level contract |
| tests/workflow-invariance.vitest.ts | Modified | Expanded surface coverage to catalog, playbook, and rendered output surfaces |
| Legacy template directories and composer assets | Deleted | Removed obsolete rendered level directories, core/addendum split, compose.sh, and old output-tree tests |

### Follow-Ups
- Validation hot-path batching and batch rendering remain deferred performance work
- Manifest schema extensions for section profiles and template versioning remain deferred until compatibility policy is settled
- Cross-session parent_session_id existence checks remain deferred because lineage semantics are currently advisory
- Exit-code taxonomy cleanup remains deferred because it changes public CLI behavior across scripts
