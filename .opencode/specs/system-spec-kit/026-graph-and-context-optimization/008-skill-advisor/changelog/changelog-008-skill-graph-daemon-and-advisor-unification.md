---
title: "Phase 008: Skill graph daemon and advisor unification"
description: "Unified advisor architecture across 7 child packets. Daemon freshness, native scorer, MCP surface, compatibility shims, and promotion gates shipped."
trigger_phrases:
  - "phase 008 changelog"
  - "skill graph daemon"
  - "advisor unification"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-20

> Spec folder: `026-graph-and-context-optimization/008-skill-advisor/002-daemon-and-unification` (Level 3)
> Parent packet: `026-graph-and-context-optimization/008-skill-advisor`

### Summary

Phase 027 shipped a unified advisor architecture across seven child packets. The work moved durable advisor behavior into the system-spec-kit MCP server while preserving legacy Python and plugin caller compatibility. The daemon provides chokidar-based watcher, single-writer lease, generation freshness, and benchmark gating. The native scorer implements five-lane fusion with regression-protection parity. MCP tools expose recommendation, status, and validation. Compatibility shims route Python and plugin callers to native behavior.

### Added

- `mcp_server/skill_advisor/` package: handlers, lib, schemas, tests.
- Daemon freshness foundation: watcher, single-writer lease, generation freshness, benchmark gate.
- Derived metadata: provenance, trust lanes, lifecycle normalization, schema v2 additivity.
- Native TypeScript scorer with five-lane fusion and regression-protection parity.
- MCP advisor surface: `advisor_recommend`, `advisor_status`, `advisor_validate` tools.
- Compatibility migration: Python shim routed to native advisor, plugin shim routed to native advisor.
- Promotion gates: shadow-cycle and gate bundle for learned and semantic influence.

### Changed

- `skill_advisor.py` now routes through native advisor compatibility path.
- `spec-kit-skill-advisor.js` plugin now routes through native advisor compatibility path.
- Schema migration is additive: preserves rollback and author-authored metadata.

### Fixed

- Daemon SIGTERM/SIGKILL shutdown works correctly.
- Plugin loader safety verified.
- Stale warning propagation works through freshness chain.
- Daemon-probe freshness semantics match expected behavior.

### Verification

- 7 child packets all converged and shipped on 2026-04-20.
- SHAs: `77b0f59e2`, `32fd9197c`, `8318dfaf8`, `1146faeec`, `e35f93b52`, `08bd30145`, `a61547796`, `5696acf4a`.
- Packet validator green.
- Review (pt-01): 0 P0, 3 P1, 15 P2. P1s: advisor unavailable fail-open, public scan authority gating, active invariants lack regression tests.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/skill_advisor/` (new package) | Handlers, lib, schemas, tests for native advisor |
| `skill_advisor.py` | Compatibility shim routing |
| `spec-kit-skill-advisor.js` | Compatibility shim routing |
| Multiple handler/lib/test files | Daemon, scorer, MCP surface, promotion gates |

### Follow-Ups

- Fix advisor unavailable fail-open: `advisor_recommend` scores during corrupt/unavailable graph states.
- Add authority gating to public `skill_graph_scan`.
- Add regression tests for active invariants (unavailable fail-open, untrusted scan rejection, corruption rebuild, path redaction).
