---
title: "Changelog: Registry advisorRouting block and CI drift guard [117-parent-nested-skill-pattern/002-advisor-routing-drift-guard]"
description: "Chronological changelog for the registry advisorRouting and drift-guard phase."
trigger_phrases:
  - "phase changelog"
  - "routing drift guard"
  - "advisor routing"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/002-advisor-routing-drift-guard` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern`

### Summary

This phase implemented the phase-2 recommendation, Model A via C-plus, as a purely additive four-file change. The registry now carries the advisor routing contract, while the advisor can dump the hardcoded projection maps that still own runtime behavior.

The important line is what did not change. Routing behavior stayed fixed, and the new vitest guard proves that the registry projection matches the Python and TypeScript advisor maps exactly.

### Added

- Added the per-mode `advisorRouting` block for 8 modes and the top-level `advisorRoutingContract` legend, and bumped registry version to `1.1.0` in `.opencode/skills/deep-loop-workflows/mode-registry.json`.
- Added the `--dump-routing-maps` flag, including argument registration and handler, in `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`.
- Marked implementation and verification tasks `[x]`, closing `T008` and `T009` in this turn.
- `CHK-010` recorded the change as additive with no routing behavior altered.
- `CHK-062 No runtime registry read added to the advisor (C-plus)` was recorded.
- `CHK-030 No secrets introduced` was recorded.

### Changed

- Verified the real Python `DEEP_ROUTING_MODE_BY_KEY`, TypeScript `DEEP_MODE_BY_CANONICAL` and `SKILL_ALIAS_GROUPS` against source.
- Confirmed the vitest harness and `aliases.ts` importability.
- Exported `DEEP_MODE_BY_CANONICAL` from `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`.
- Wrote the drift-guard vitest in `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`.
- Confirmed `python3 skill_advisor.py --dump-routing-maps` emits the maps and that the registry projection matches exactly.
- Confirmed the vitest run over the drift-guard plus both parity suites is green, with 19 tests.

### Fixed

- `CHK-024 Existing routing-parity fixtures stay green`, covering 14 invariants.

### Verification

| Check | Result |
|-------|--------|
| Task completion | PASS: 15 completed task item(s) recorded. |
| Additive scope | PASS: `CHK-010` recorded, with no routing behavior altered. |
| C-plus boundary | PASS: `CHK-062` recorded, with no runtime registry read added to the advisor. |
| Routing maps dump | PASS: `python3 skill_advisor.py --dump-routing-maps` emits the maps. |
| Registry projection | PASS: Registry projection matches Python and TypeScript advisor maps exactly. |
| Test suite | PASS: Drift-guard plus both parity suites green, 19 tests. |
| Existing parity | PASS: `CHK-024` recorded, with 14 invariants green. |
| Secret scan discipline | PASS: `CHK-030 No secrets introduced` recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/deep-loop-workflows/mode-registry.json` | Updated | Added 8-mode `advisorRouting`, added `advisorRoutingContract` and bumped version to `1.1.0`. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Updated | Added `--dump-routing-maps` argument registration and handler. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Updated | Exported `DEEP_MODE_BY_CANONICAL`. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Created | Added the registry projection drift-guard. |

### Follow-Ups

- The drift-guard covers the projection maps and alias sets, not the lexical regex weights. Those stay Python tuning by design, and a separate coverage fixture for the lexical set can be added later if a mode's lexical membership changes.
- `model-benchmark` keeps its own `deep-model-benchmark` command-bridge alias group in `RAW_ALIAS_GROUPS`. That group is outside the mode-projection maps, and the guard correctly classifies it as command-bridge and excludes it from the projection comparison.
