---
title: "Code Graph Phase 011-001: Applied Source and Doc Fixes"
description: "31 of 38 audit findings fixed on the cg-remediation branch via cli-opencode in an isolated worktree. Covers source bugs (WASM leak, transaction atomicity, re-entrancy guard) and doc misalignments (tool counts, resolver citations, stale paths). Typecheck clean with zero new test regressions."
trigger_phrases:
  - "code graph remediation applied fixes"
  - "CG-001 CG-003 CG-005 source bug fixes"
  - "cg-remediation branch fixes"
  - "applied source and doc fixes 011"
  - "code graph audit remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/001-applied-source-and-doc-fixes` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit`

### Summary

A deep-review audit of the system-code-graph MCP server produced 38 findings (CG-001 through CG-038) covering source bugs and documentation misalignments. The live tree had active BUG-04 and BUG-06 work-in-progress that overlapped several findings, making a direct main-branch landing unsafe.

31 of 38 findings were fixed on the isolated `cg-remediation` branch using `cli-opencode openai/gpt-5.5-fast --variant high` across file-disjoint batches. Source fixes addressed a WASM memory leak in the tree-sitter parser, a non-atomic file removal, a missing re-entrancy guard on shutdown, an owner-lease TOCTOU race plus a broken serialize/deserialize round-trip in the working-set tracker. Documentation fixes corrected tool counts (11 to 8), resolver citations, readiness-marker base-dir resolution plus stale playbook paths. Seven findings were deferred because they overlapped the operator's in-flight WIP.

Typecheck passed with zero errors. The full vitest suite showed zero new failures versus the B0 baseline (24 pre-existing failures from BUG-06 WIP were already present before this work).

### Added

None.

### Changed

- `status.ts` made read-only: no longer writes the readiness marker (per ADR-003)
- `removeFile()` now deletes edges and the file row in a single transaction
- `shutdownCodeIndex` gained a re-entrancy guard to prevent double-shutdown races
- `owner-lease` reclaim path now uses a compare-and-swap plus a TOCTOU re-verify on refresh
- Working-set tracker serialize/deserialize now round-trips symbol data correctly
- Readiness-marker base directory resolved from the canonical resolver instead of `process.cwd()`
- `database_path_policy` doc updated to cite `core/config.ts` and `canonical-db-dir.ts` as the real resolvers
- `lib/README` updated: CodeGraphDatabase class description corrected to the real functional surface
- `replaceEdges` per-file global orphan sweep removed (was producing incorrect cross-file deletions)
- Feature catalog coverage-graph entries corrected: deep-loop graph tools marked as internal `.cjs` scripts, not MCP tools
- Naming conventions doc updated: migration direction corrected from `.spec-kit` to `skill-local`
- Tool-count references across ARCHITECTURE, INSTALL_GUIDE, README plus feature catalog corrected from 11 to 8

### Fixed

- WASM memory leak: `web-tree-sitter` `Tree.delete()` was not called in a `finally` block, leaving parse trees allocated after errors (CG-005)
- Non-atomic file removal: `removeFile()` could leave orphaned edges if the file row delete succeeded but edge cleanup failed (CG-003)
- Re-entrancy bug: `shutdownCodeIndex` could be called twice concurrently with no guard, causing double-close errors (CG-015)
- Owner-lease TOCTOU: reclaim CAS and refresh lacked a re-verify step, allowing a stale lease to be kept (CG-016, CG-017)
- Symbol round-trip loss: working-set tracker did not restore symbols correctly after serialize/deserialize (CG-018)
- Wrong base directory: readiness-marker path was computed from `process.cwd()` instead of the canonical resolver, breaking installs outside the default working directory (CG-013)

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (0 errors) |
| Full vitest suite | Failing set identical to B0 baseline (24 pre-existing WIP failures). Zero new failures. |
| Findings coverage | 31 of 38 CG-findings fixed. 7 deferred to sibling packets 002 and 003 due to BUG-04/BUG-06 WIP overlap. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/README.md` | Tool count corrected from 11 to 8. Diagram updated to reflect ADR-003 read-only status behavior. |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | ADR-003 updated: status no longer writes the readiness marker. |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Stale tool count references corrected. |
| `.opencode/skills/system-code-graph/references/config/database_path_policy.md` | Resolver citation corrected to `core/config.ts` and `canonical-db-dir.ts`. Rationale updated: symlinks already share skill dir. |
| `.opencode/skills/system-code-graph/references/runtime/naming_conventions.md` | Migration direction corrected from `.spec-kit` to `skill-local`. |
| `.opencode/skills/system-code-graph/feature_catalog/05--coverage-graph/` (4 files) | Coverage-graph tool entries corrected: tools marked as internal `.cjs` scripts, not MCP tools. |

### Follow-Ups

- Merge `cg-remediation` into main after BUG-04 and BUG-06 work-in-progress settles on the live tree.
- Verify the 7 deferred findings (CG-002, CG-006 through CG-010 plus others overlapping BUG-04/BUG-06) once the WIP merges.
