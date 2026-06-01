---
title: "Template Greenfield Implementation"
description: "Spec Kit maintained two independent template hierarchies, allowing scaffolding and validation to drift apart. The template system was rebuilt on a single manifest-driven source of truth with a Level-contract resolver and inline gate renderer."
trigger_phrases:
  - "template greenfield implementation"
  - "manifest-driven template system"
  - "level-contract resolver"
  - "inline gate renderer"
  - "legacy template removal"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/003-manifest-template-implementation-plan` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

Spec Kit now has one Level-driven template path instead of parallel rendered template trees. Scaffolding, validation, AI-facing instructions, feature catalog entries, and manual playbooks now describe the same public model: Level 1, Level 2, Level 3, Level 3+, and phase-parent packets. The implementation added a manifest-backed resolver and inline gate renderer, migrated the scaffold and validator stacks to the new source, and removed the obsolete legacy template directories.

### Added

- A manifest-driven template source (`spec-kit-docs.json`) with a Level-contract resolver (`level-contract-resolver.ts`) and inline gate renderer (`inline-gate-renderer.ts`).
- Four Vitest test suites: workflow-invariance, level-contract resolver, inline-gate renderer, and scaffold golden snapshots.
- A shell wrapper function (`resolve_level_contract`) that resolves the requested Level and renders only the applicable document sections.
- A private README documenting the internal template source layout for maintainers.

### Changed

- The scaffold script (`create.sh`) now resolves Levels through the manifest resolver instead of copying from parallel materialized template directories.
- The validator stack (file presence, section presence, template headers, section counts, template-source provenance, and phase-parent lean-trio behavior) now validates against the rendered Level output rather than a separate file matrix.
- Agent prompts, command help text, workflow definitions, skill documentation, feature catalog entries, and manual testing playbooks now describe only the public Level vocabulary (Level 1, 2, 3, 3+, phase-parent).
- Legacy rendered template directories, the core/addendum source split, root cross-cutting templates, composer scripts, and tests tied to the old output tree were removed.

### Fixed

- Renderer frontmatter output corrected so rendered documents start at byte zero with the YAML delimiter and template-source provenance markers render as HTML comments after the frontmatter.
- Validator section counts and phase-parent behavior aligned with the generated packet shape, eliminating drift between scaffolding and validation rules.
- Description and graph metadata files now preserve the `level` field without leaking private internal keys.

### Verification

| Check | Result |
|-------|--------|
| Workflow invariance (Vitest) | PASS |
| Allowlist scope (capability-flags references) | PASS |
| Catalog and playbook leak grep | PASS (no hits) |
| Stress-test no-op (git diff --stat) | PASS (empty output) |
| Sentinel packet validation (strict mode) | PASS (no new errors) |
| Fresh scaffold and validate (all five levels) | PASS (Errors: 0, Warnings: 0) |
| Post-review remediation gates | PASS |
| Round-2 remediation gates | PASS |
| Round-3 remediation gates (fallback, suites, scaffold, phase, traversal, dist) | PASS |
| Rollback dry-run surface | PASS |
| Packet strict validation after final docs | PASS (Errors: 0, Warnings: 0) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `templates/manifest/` (12 template files + manifest) | Created | New manifest-driven template source for all five packet levels |
| `scripts/lib/level-contract-resolver.ts` | Created | Resolver that maps Level requests to template sections |
| `scripts/lib/inline-gate-renderer.ts` | Created | Renderer that writes packet documents from resolved sections |
| `scripts/lib/template-utils.sh` | Modified | Added resolve_level_contract wrapper, updated copy_template |
| `scripts/spec/create.sh` | Modified | Scaffold now resolves Levels through the manifest resolver |
| `scripts/spec/validate/check-files.sh` | Modified | File presence now validated against rendered Level output |
| `scripts/spec/validate/check-sections.sh` | Modified | Section presence now validated against rendered Level output |
| `scripts/spec/validate/check-template-headers.sh` | Modified | Template header validation migrated to Level contract |
| `scripts/spec/validate/check-section-counts.sh` | Modified | Section count validation migrated to Level contract |
| `scripts/spec/validate/check-level.sh` | Modified | Level validation migrated to rendered output |
| `scripts/spec/validate/check-template-source.sh` | Modified | Template provenance validation migrated to Level contract |
| `scripts/spec/validate/check-template-staleness.sh` | Modified | Staleness check migrated to Level contract |
| `mcp_server/lib/validation/spec-doc-structure.ts` | Modified | Server-side validation migrated to Level contract |
| `scripts/spec/scaffold-debug-delegation.sh` | Modified | Debug delegation scaffold updated for new template path |
| `scripts/spec/recommend-level.sh` | Modified | Level recommendation updated for public vocabulary |
| `scripts/spec/upgrade-level.sh` | Modified | Level upgrade script updated for new template path |
| Workflow test suite (4 Vitest cases) | Created | Workflow-invariance, resolver, renderer, and golden-snapshot tests |
| Agent prompt and command doc surfaces | Modified | Rewritten to use only public Level vocabulary |
| Feature catalog and manual playbook surfaces | Modified | Rewritten to use only public Level vocabulary |
| Legacy template directories and composer scripts | Deleted | Obsolete rendered output trees and build-time composition removed |

### Follow-Ups

- Validation hot-path batching and batch rendering remain deferred performance work.
- Manifest schema extensions for section profiles and template versioning remain deferred pending compatibility policy.
- Cross-session parent-session identifier existence checks remain deferred because lineage semantics are currently advisory.
- Exit-code taxonomy cleanup remains deferred because it changes public CLI behavior across scripts.
