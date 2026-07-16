---
title: "Code Graph Phase 007-006: System Code Graph Reference Template Alignment"
description: "The system-code-graph reference set was reorganized from root-level kebab-case files into canonical snake_case subfolders. Compatibility stubs preserved old paths. The SKILL.md smart router was updated to load canonical references with sk-doc-aligned discovery and path-guard patterns."
trigger_phrases:
  - "reference template alignment"
  - "system-code-graph canonical references"
  - "code graph router alignment"
  - "sk-doc reference subfolders"
  - "code graph compatibility stubs"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-24

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes/006-reference-template-alignment` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes`

### Summary

The `system-code-graph` references were root-level kebab-case files with no domain grouping and a static router map. Active docs in `README.md` and `ARCHITECTURE.md` pointed at those root paths, making them stale-prone whenever references moved. The SKILL.md router used no path-guard, no inventory checks. Fallback behavior was not aligned with the sk-doc skill pattern.

Eight canonical references were reorganized into four domain subfolders under `references/`. `runtime/` holds tool surface, naming conventions, ownership boundary as well as launcher lease. `readiness/` holds readiness check and scope fingerprint. `config/` holds database path policy. Old root kebab-case filenames were retained as compatibility stubs so existing links continue to resolve. The SKILL.md smart router was rewritten with `_guard_in_skill()` path sandboxing, `load_if_available()` inventory checks, `_task_text()` normalization, weighted intent scoring, `UNKNOWN_FALLBACK_CHECKLIST`. No-knowledge-base notice behavior was also added. Active docs in `README.md` and `ARCHITECTURE.md` were updated to link to canonical subfolder references.

All 16 reference and stub files passed sk-doc blocking validation. The skill and readme documents passed their respective blocking checks. Strict packet validation passed.

### Added

- Canonical reference subfolders `references/runtime/`, `references/readiness/` as well as `references/config/` under `system-code-graph`
- `tool_surface.md`, `naming_conventions.md`, `ownership_boundary.md`, `launcher_lease.md` as canonical runtime references
- `code_graph_readiness_check.md`, `readiness_and_scope_fingerprint.md` as canonical readiness references
- `database_path_policy.md` as the canonical config reference
- `_guard_in_skill()`, `load_if_available()`, `_task_text()`, `UNKNOWN_FALLBACK_CHECKLIST` as well as no-KB notice behavior in the SKILL.md smart router

### Changed

- `SKILL.md` router resource map updated from static root paths to canonical subdomain paths with sk-doc-aligned discovery patterns
- `README.md` related-document table updated to point at canonical references instead of root stubs
- `ARCHITECTURE.md` active architecture links updated to canonical references

### Fixed

- Router loaded root-level compatibility stubs as primary knowledge resources. Canonical paths now serve as the router map and stubs are bypass surfaces only.
- Active docs referenced stale root kebab-case paths. Both `README.md` and `ARCHITECTURE.md` now resolve to canonical subdomain references.

### Verification

| Check | Result |
|-------|--------|
| `extract_structure.py` on `SKILL.md`, `README.md`, `ARCHITECTURE.md` as well as all reference and stub files | PASS |
| `validate_document.py --type reference --blocking-only` on all 16 reference and stub files | PASS |
| `validate_document.py --type skill --blocking-only .opencode/skills/system-code-graph/SKILL.md` | PASS |
| `validate_document.py --type readme --blocking-only .opencode/skills/system-code-graph/README.md` | PASS |
| `quick_validate.py .opencode/skills/system-code-graph --json` | PASS. Returned `"valid": true` |
| `rg` old root reference paths in active docs | PASS. No matches |
| `rg` kebab-case canonical subfolder paths | PASS. No matches |
| `rg '^### TABLE OF CONTENTS' .opencode/skills/system-code-graph/references` | PASS. No matches |
| Canonical H2 numbering script | PASS |
| Local markdown link resolver over changed active docs and references | PASS |
| `validate.sh <packet> --strict` | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/references/runtime/tool_surface.md` (NEW) | Canonical runtime reference migrated from root stub |
| `.opencode/skills/system-code-graph/references/runtime/naming_conventions.md` (NEW) | Canonical runtime reference migrated from root stub |
| `.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md` (NEW) | Canonical runtime reference migrated from root stub |
| `.opencode/skills/system-code-graph/references/runtime/launcher_lease.md` (NEW) | Canonical runtime reference migrated from root stub |
| `.opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md` (NEW) | Canonical readiness reference migrated from root stub |
| `.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md` (NEW) | Canonical readiness reference migrated from root stub |
| `.opencode/skills/system-code-graph/references/config/database_path_policy.md` (NEW) | Canonical config reference migrated from root stub |
| `.opencode/skills/system-code-graph/SKILL.md` | Smart router rewritten with path guards, inventory checks, intent scoring, fallback behavior |
| `.opencode/skills/system-code-graph/README.md` | Related-document table updated to canonical reference paths |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Architecture links updated to canonical reference paths |

### Follow-Ups

- Historical changelogs and archived provenance files were not rewritten. Compatibility stubs preserve those links.
- Future router updates should continue to target canonical subdomain references, not root stubs.
