---
title: "Changelog: 005-mcp-cli-stress-tests"
description: "Added sandboxed stress coverage for schema v37 migrations, gated feature paths, and the three daemon-backed CLI front doors."
trigger_phrases:
  - "000 005 stress tests changelog"
  - "schema v37 stress coverage"
  - "daemon cli stress coverage"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/005-mcp-cli-stress-tests` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup`

### Summary

Sandboxed stress coverage was added for release-cleanup surfaces. The suite covers repeated schema v34-through-v37 upgrades, gated flag behavior, the three CLI front doors, and daemon-free warm-only probes while preserving the existing stress harness isolation model.

### Added

- `release-cleanup-new-surfaces-stress.vitest.ts` covering schema migrations, default-off gated flags, CLI shim counts, exit codes, and process-table isolation.

### Changed

- Updated a stale schema canary from the older marker-era pin to current schema 37.
- Updated the substrate stress harness to resolve slug-named scenario files by title or heading.

### Fixed

- Repaired two existing baseline stress failures before adding new coverage: stale schema expectation and slug-title playbook lookup.

### Verification

| Check | Result |
|-------|--------|
| Repaired baseline stress | PASS: 30 files, 108 tests |
| Final stress run | PASS: 31 files, 113 tests |
| Build | PASS: `npm run build` |
| Isolation | PASS: warm-only probes returned `[75, 75, 75]` with unchanged daemon process table |
| Strict validation | PASS: child phase `validate.sh --strict` exited 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `release-cleanup-new-surfaces-stress.vitest.ts` | Created | New stress coverage for schema, flags, CLI shims, and isolation |
| `enrichment-marker-backfill-stress.vitest.ts` | Modified | Schema canary updated to 37 |
| `run-substrate-stress-harness.mjs` | Modified | Slug-title scenario lookup added |
| `005-mcp-cli-stress-tests/{spec.md,plan.md,tasks.md,implementation-summary.md}` | Updated | Phase completion evidence reconciled |

### Follow-Ups

- Broader live-daemon transport drills remain separate from this sandboxed stress scope.
