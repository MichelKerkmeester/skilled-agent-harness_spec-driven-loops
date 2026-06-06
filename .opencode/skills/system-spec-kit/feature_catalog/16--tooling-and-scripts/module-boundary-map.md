---
title: "Module boundary map"
description: "MODULE_MAP.md documents internal module ownership, dependency directions, feature catalog mapping, and canonical locations for all 28 lib/ subdirectories."
trigger_phrases:
  - module boundary map
  - MODULE_MAP.md
  - module ownership documentation
  - dependency direction enforcement
  - lib subdirectory canonical locations
---

# Module boundary map

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

MODULE_MAP.md is the internal ownership and dependency reference for `mcp_server/lib/`. It documents all 28 subdirectories with their purpose, key files, primary consumers, feature catalog cross-references, allowed/forbidden import directions, and canonical file locations.

Created during Phase 15 (Internal Module Boundary Remediation) after discovering that a symlink (`lib/cache/cognitive -> ../cognitive`) masked invisible cross-module dependencies. The map makes module boundaries explicit so that future refactors, dead-code analysis, and dependency enforcement have a single source of truth.

---

## 2. HOW IT WORKS

`MODULE_MAP.md` contains five sections:

1. **Overview** -- purpose and scope
2. **Module Inventory** -- 28 entries with purpose, key files, and primary consumers, including `feedback/` and `spec/`
3. **Feature Catalog Mapping** -- cross-reference between lib/ directories and the 19 feature catalog categories
4. **Dependency Directions** -- allowed/forbidden import directions between module tiers (core, foundation, infrastructure, domain, leaf). Enforcement is deferred (documentation-only; future AST checker planned)
5. **Canonical Locations** -- documents authoritative file locations where modules exist in multiple places (e.g., `lib/cognitive/` is canonical, not `lib/cache/cognitive/`)

The no-symlinks policy is documented in `ARCHITECTURE.md` under "No Symlinks in lib/ Tree".

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/MODULE_MAP.md` | Documentation | Module ownership map, dependency directions, canonical locations |
| `ARCHITECTURE.md` | Documentation | No-symlinks policy and source-dist alignment policy |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| _None yet_ | Automated test | Manual review; future AST-based dependency checker planned |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/module-boundary-map.md`
Related references:
- [source-dist-alignment-enforcement.md](source-dist-alignment-enforcement.md) — Source-dist alignment enforcement
- [json-mode-hybrid-enrichment.md](json-mode-hybrid-enrichment.md) — JSON mode structured summary hardening
