---
title: "003-contextador: Contextador Deep Research - MCP Query, Self-Healing Loop and Mainframe Cache"
description: "20-iteration cli-codex source investigation of Contextador, the Bun-based MCP query server. Produced 18 evidence-backed findings covering the MCP tool surface, routing, self-healing feedback loop, Mainframe shared cache, token-efficiency claims, provider abstraction, GitHub automation pipeline and AGPL licensing. Headline conclusion: Public already wins on retrieval substrate. Contextador's surviving value is runtime retrieval ergonomics."
trigger_phrases:
  - "contextador research findings"
  - "003 contextador changelog"
  - "mainframe shared cache research"
  - "self-healing context loop research"
  - "contextador token reduction claim"
importance_tier: "normal"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/003-contextador` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline`

### Summary

Public already operated CocoIndex, Code Graph MCP and Spec Kit Memory but lacked a Mainframe-style shared query-result cache and a self-healing loop that patches stale context artifacts after agent failures. Contextador appeared to address both, but its headline claims (93% token reduction, self-improving knowledge, cross-agent reuse) needed verification against checked-in source rather than README marketing.

A 20-iteration cli-codex investigation read the full Contextador source tree from `external/src/mcp.ts` outward through routing, the self-healing feedback loop, the Mainframe subsystem, provider abstraction, the GitHub automation pipeline and 13 core helper modules. The investigation produced 18 evidence-backed findings labeled adopt-now, prototype-later or reject. The 93% token-reduction claim was traced to fixed arithmetic constants in `external/src/lib/core/stats.ts:26-28` rather than per-query measurement, establishing it as an aggregate estimate. Public's existing retrieval substrate was found to be stronger on every structural axis. Contextador's surviving value is runtime retrieval ergonomics that could be studied and reimplemented under a clean-room approach.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- `validate.sh --strict` on phase folder before research started: PASSED, 0 errors and 0 warnings (17 of 17 checks).
- `validate.sh --strict` re-run after synthesis: PASSED, 0 errors and 0 warnings.
- 20 total iterations completed across two extension passes (original 8, extended to 13, extended to 20): PASSED.
- `research/research.md` synthesizes 18 evidence-backed findings, each with full schema (source evidence, evidence type, recommendation, affected subsystem, risk).
- Every finding carries an adopt-now / prototype-later / reject label: PASSED, 3 adopt-now, 9 prototype-later, 6 reject.
- Every finding cites a concrete file path and line range in `external/src/`: PASSED.
- 93% token-reduction claim traced to `external/src/lib/core/stats.ts:26-28` fixed constants, not benchmarked measurement: PASSED, documented in Finding 10.
- Cross-phase ownership table between 003-contextador, 002-codesight and 004-graphify resolved in `research/research.md` Section 5: PASSED.
- AGPL-3.0-or-later plus commercial licensing addressed in `research/research.md` Section 7 and Finding 14: PASSED.
- No edits made outside the phase folder: PASSED.

### Files Changed

| File | What changed |
|------|--------------|
| `003-contextador/research/research.md` (NEW) | Canonical synthesis, 18 evidence-backed findings, cross-comparison table, cross-phase ownership table, licensing section |
| `003-contextador/research/iterations/iteration-001.md` through `iteration-020.md` (NEW) | Per-iteration pass narratives for all 20 iterations |
| `003-contextador/research/deep-research-config.json` (NEW) | sk-deep-research session config with sessionId dr_session_1775470451519_esyvim |
| `003-contextador/research/deep-research-state.jsonl` (NEW) | Externalized iteration state across 20 iterations |
| `003-contextador/research/deep-research-strategy.md` (NEW) | Research strategy and question tracking |
| `003-contextador/research/findings-registry.json` (NEW) | Reducer-owned findings registry |
| `003-contextador/implementation-summary.md` (NEW) | Final synthesis summary created after closeout |

### Follow-Ups

- Pointer-lossiness benchmarking remains qualitative. The pointer payload covers only purpose, keyFiles, dependencies, apiSurface and tests. Any future prototype-later experiment around pointer compression should add a measured task-quality benchmark against richer Public outputs before promotion.
- AGPL-3.0-or-later plus commercial licensing constrains every adopt-now and prototype-later recommendation to study plus clean-room reimplementation. Direct source import is not permitted.
- Bun runtime dependency. Contextador's CLI and setup wizard are Bun-native (`external/src/cli.ts:1`, `external/package.json:27-33`). Any prototype that depends on Bun-specific behavior requires runtime-stack normalization before adoption.
- Mainframe conflict resolution gap. Mainframe uses best-effort Matrix room state writes for janitor locks and budget with no explicit reconciliation. Any Public answer-cache prototype must add conflict resolution and timestamps before broader rollout.
- Sibling phases 002-codesight and 004-graphify are not yet complete. A track-level synthesis across all three phases under `026-graph-and-context-optimization/` is the natural next step once siblings finish their own research packets.
