---
title: "Source-dist alignment enforcement"
description: "Source-dist alignment enforcement validates that every .js file in mcp_server/dist/lib/ has a corresponding .ts source file, detecting orphaned build artifacts."
trigger_phrases:
  - source-dist alignment enforcement
  - check-source-dist-alignment
  - orphaned build artifact detection
  - dist lib source mapping
  - build artifact cleanup
version: 3.6.0.6
---

# Source-dist alignment enforcement

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Source-dist alignment enforcement validates that every `.js` file in `mcp_server/dist/lib/` has a corresponding `.ts` source file in `mcp_server/lib/`, detecting orphaned build artifacts that persist after source files are deleted or refactored.

Source files can be silently lost (deleted, renamed, or merged into other modules) while their compiled `dist/` output persists indefinitely. This creates phantom modules that appear functional at runtime but have no maintainable source. The alignment script catches this drift automatically.

---

## 2. HOW IT WORKS

`check-source-dist-alignment.ts` maps each `.js` file under `dist/lib/` to its expected `.ts` source under `lib/`, reports mismatches, and exits non-zero on violations. It supports a typed allowlist for intentional exceptions (with file, reason, owner, date fields).

Added as part of Phase 15 (Internal Module Boundary Remediation) after discovering two orphaned dist artifacts: `dist/lib/utils/retry.js` (source deleted 2026-03-07) and `dist/lib/eval/hydra-baseline.js` (source deleted 2026-03-13, logic moved to `memory-state-baseline.ts`).

The corresponding policy is documented in `ARCHITECTURE.md` under "Source-Dist Alignment Enforcement".

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/evals/check-source-dist-alignment.ts` | Script (evals) | Source-dist alignment enforcement: scans dist/lib/*.js, maps to lib/*.ts, reports orphans |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| _None yet_ | Automated test | Script is self-verifying (exit code 0 = pass, 1 = violations, 2 = missing dist root) |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `tooling-and-scripts/source-dist-alignment-enforcement.md`
Related references:
- [constitutional-memory-manager-command.md](constitutional-memory-manager-command.md) — Constitutional memory manager command
- [module-boundary-map.md](module-boundary-map.md) — Module boundary map
