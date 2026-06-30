---
title: "Changelog: Skill Advisor Embedding Staleness Signal"
description: "Chronological changelog for the Skill Advisor embedding-staleness signal phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/003-embedding-staleness-signal` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

The read-side staleness signal is implemented. The SQLite projection now records an embedding signature from persisted vector model rows, compares it with the active embedder pointer on load and emits a structured stale verdict. Fresh signatures stay usable, missing or mixed signatures fail closed and empty projections remain not-stale because there are no vectors to trust. A stale verdict degrades the semantic shadow lane and is surfaced through advisor status.

### Added

- Added projection embedding signature and stale-verdict types.
- Added load-time comparison between stored vector identity and the active embedder identity.
- Added semantic-lane, fusion and status handling for stale projections.

### Changed

- Kept `generatedAt` as a sibling field for existing status and cache consumers.
- Targeted the projection read boundary instead of duplicating the write-path refresh guard.
- Recorded the projection-rebuild leg as pending on the shared durable cursor primitive.

### Fixed

- Legacy signature-less populated projections now fail closed instead of being silently trusted.
- Stale semantic vectors no longer rank as fresh matches.
- The semantic lane is marked runtime-degraded when the projection verdict is stale, so confidence normalization follows the lane-health contract.

### Verification

| Check | Result |
|-------|--------|
| Baseline typecheck | PASS, 0 errors |
| Baseline broad related suite | PASS, 84 of 86 with 2 skipped |
| Post-change typecheck | PASS, 0 errors |
| Build | PASS |
| Focused staleness tests | PASS, 6 of 6 |
| Broad related suite | PASS, 90 of 92 with 2 skipped |
| Alignment drift | PASS |
| Phase validation | PASS |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Updated | Signal done, rebuild reuse gated |
| `plan.md` | Updated | Signal-first delivery path |
| `tasks.md` | Updated | Implemented signal tasks and blocked rebuild tasks |
| `checklist.md` | Updated | Verification evidence |
| `implementation-summary.md` | Updated | Final closeout |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/types.ts` | Modified | Projection signature and stale verdict |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Modified | Load-time stale verdict |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Modified | Stale projection lane degrade |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Runtime-degraded semantic lane normalization |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-status.ts` | Modified | Status surface for stale projection vectors |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/projection-embedding-staleness.vitest.ts` | Created | Fresh, stale, fail-closed, empty and status-health coverage |

### Follow-Ups

- Wire the projection rebuild through the shared durable cursor and idempotency primitive once that primitive lands.
- Keep the signal as a correctness fix, not a claimed routing-quality improvement. No benchmark delta was measured.
- Do not build a second rebuild engine for the advisor.
