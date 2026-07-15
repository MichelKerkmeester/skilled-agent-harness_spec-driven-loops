---
title: "Ephemeral-pointer guard and comprehensive comment sweep"
description: "Built a standalone sk-code §4 comment guard and used it to complete the ephemeral-pointer cleanup across 119 files that an earlier hand-coded pass had left roughly 90 percent incomplete."
trigger_phrases:
  - "ephemeral pointer guard sweep"
  - "ephemeral-pointer-audit lint guard"
  - "comment ephemeral pointer cleanup"
  - "sk-code §4 enforcement"
  - "ephemeral artifact pointer detection"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/007-ephemeral-pointer-guard-and-sweep` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening`

### Summary

An earlier hand-coded grep pass (packet 006) had caught roughly 10 percent of ephemeral-artifact pointers in code comments. A purpose-built guard revealed the true debt was 274 violations across 116 files. This packet delivered a standalone comment guard and a comprehensive sweep that brought the whole system-spec-kit and bin tree to zero violations: 261 comment-only fixes across 119 files with zero dist/ drift.

### Added

- A standalone Node ESM comment guard (`scripts/validation/ephemeral-pointer-audit.mjs`, approximately 470 LOC) that enforces sk-code §4 by flagging ephemeral-artifact pointers in comment regions only, with explicit carve-outs for durable look-alikes (HTTP codes, embedding dimensions, token tiers, schema-version tags, JSDoc `@example` annotations, runtime path constants, external standards and internal `Safeguard #N` enumerations)

### Changed

- 261 comment-only ephemeral-pointer references cleaned across 119 files, keeping only the durable WHY in every comment

### Fixed

- Guard self-flagging on its own documentation strings resolved by adding a self-exclusion rule
- `Safeguard #N` internal enumerations incorrectly flagged as issue references resolved by adding a carve-out
- Eight straggler violations caught in `lib/telemetry`, `scripts/extractors` and `scripts/optimizer` after the parallel agent sweep completed

### Verification

- Whole-tree guard run (`node ephemeral-pointer-audit.mjs system-spec-kit bin`), PASS (0 violations, exit 0)
- Guard self-test (BAD/GOOD fixture), PASS (flags BAD, passes GOOD)
- TypeScript build (`@spec-kit/shared` and `@spec-kit/mcp-server`), PASS (exit 0)
- `dist/` drift check, PASS (0 files changed, edits behaviorally inert)
- `node --check` on touched `.cjs` files, PASS
- `validate.sh --strict` (this packet), PASS
- 11 completed task items recorded

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `scripts/validation/ephemeral-pointer-audit.mjs` | Created | The sk-code §4 comment guard and CI gate |
| `mcp_server/*` (handlers, lib/, context-server.ts, tool-schemas.ts, api, scripts) | Modified | Comment-only ephemeral-pointer removal |
| `scripts/**` (core, lib, utils, renderers, graph, memory, spec-folder, extractors, optimizer, tests) | Modified | Comment-only ephemeral-pointer removal |
| `shared/`, `.opencode/bin/` | Modified | Comment-only ephemeral-pointer removal |

### Follow-Ups

- The guard is not yet wired into CI or pre-commit. It runs on demand. Wiring it into `verify_alignment_drift.py` or a pre-commit hook is proposed in the guard header and deferred to a follow-on decision.
- `SPRINT N` labels are flagged as spec-folder references. They were fixed in this sweep where they appeared, but reasonable people could treat bare sprint labels as durable rather than ephemeral.
- The scope was limited to `system-spec-kit` and `bin`. Other code surfaces (webflow, motion_dev) were not swept.
