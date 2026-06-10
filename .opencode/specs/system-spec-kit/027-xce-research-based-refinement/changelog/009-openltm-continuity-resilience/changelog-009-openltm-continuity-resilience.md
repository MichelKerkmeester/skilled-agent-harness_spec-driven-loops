---
title: "Changelog: 027/009 OpenLTM Continuity & Session Resilience"
description: "Bounded startup restore panel, opt-in authored PreCompact snapshot, and goal/decision/progress/gotcha facet taxonomy shipped as additive, markdown-native continuity surfaces with no memory rows, no index mutations, and schema v37 unchanged."
trigger_phrases:
  - "027 phase 009 changelog"
  - "openltm continuity resilience shipped"
  - "bounded startup restore panel changelog"
  - "precompact authored continuity snapshot shipped"
  - "goal decision progress gotcha facets changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-openltm-continuity-resilience` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

This phase adapted the highest-fit OpenLTM session-resilience surfaces to fit our markdown-native continuity ladder rather than OpenLTM's DB-derived projection model. Three surfaces shipped together: a bounded startup restore panel that states explicit restored and omitted counts instead of dumping unbounded results, an opt-in authored PreCompact snapshot that refreshes `handover.md` and `_memory.continuity` before context compaction without minting memory rows or mutating the index, and a goal/decision/progress/gotcha facet taxonomy that organizes continuity summaries into a scannable shape. The implementation stayed entirely inside the approved continuity/bootstrap/hook scope. Schema v37 is unchanged and the feature is disabled by default. `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT=1` is the opt-in flag and its operator documentation was intentionally deferred out of this phase at user direction.

### Added

- `mcp_server/lib/continuity/authored-continuity-snapshot.ts` — markdown-only snapshot refresh helper that reads the existing authored ladder docs and rewrites `handover.md` and `_memory.continuity` frontmatter; returns `createdMemoryRecords=0` and `indexMutations=0` so tests can assert no durable side effects
- `mcp_server/tests/openltm-continuity-resilience.vitest.ts` — 6 targeted tests covering the bounded restore panel, PreCompact snapshot, cache-loss recovery path, facet rendering, and disabled-mode invariant (packet-local ladder docs byte-for-byte unchanged when the feature is off)

### Changed

- `mcp_server/lib/resume/resume-ladder.ts` — adds a bounded restore panel built from the existing `handover.md`, `_memory.continuity`, and spec-doc fallback chain; the panel reports restored and omitted counts and formats output via the facet taxonomy
- `mcp_server/handlers/session-bootstrap.ts` — startup payload gains a restore panel section with a count hint so callers see how much continuity was restored and how much was omitted at session start
- `mcp_server/lib/continuity/thin-continuity-record.ts` — adds a goal/decision/progress/gotcha facet formatter used by the restore panel and continuity summaries
- `mcp_server/hooks/claude/compact-inject.ts` — wires the opt-in authored snapshot refresh before existing hook-cache work; the path is gated on `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT` and skipped entirely when not set

### Fixed

- None. This phase is fully additive; no prior correctness gaps were addressed.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/openltm-continuity-resilience.vitest.ts` (mcp_server workspace) | PASS: 1 file, 6 tests |
| `npx vitest run tests/openltm-continuity-resilience.vitest.ts tests/resume-ladder.vitest.ts tests/session-bootstrap.vitest.ts tests/thin-continuity-record.vitest.ts tests/hook-precompact.vitest.ts` | PASS: 5 files, 29 tests |
| `npx tsc --noEmit -p tsconfig.json` (.opencode/skills/system-spec-kit workspace) | PASS |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` (touched files) | PASS |
| `SCHEMA_VERSION` check (`vector-index-schema.ts`) | PASS: remains `37` |
| `ENV_REFERENCE.md` unchanged | PASS: no `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT` entry added (deferred by user direction) |
| `validate.sh --strict` | PASS (exit 0) |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/resume/resume-ladder.ts` | Modified | Bounded restore panel with restored/omitted counts and facet-backed panel markdown |
| `mcp_server/handlers/session-bootstrap.ts` | Modified | Startup payload restore panel section and count hint |
| `mcp_server/lib/continuity/thin-continuity-record.ts` | Modified | Goal/decision/progress/gotcha facet formatter |
| `mcp_server/lib/continuity/authored-continuity-snapshot.ts` | Created | Markdown-only authored snapshot refresh helper; zero memory records; zero index mutations |
| `mcp_server/hooks/claude/compact-inject.ts` | Modified | Opt-in authored snapshot refresh wired before hook-cache work; gated on env flag |
| `mcp_server/tests/openltm-continuity-resilience.vitest.ts` | Created | 6 tests: bounded panel, snapshot, cache-loss recovery, facets, disabled-mode invariant |

### Follow-Ups

- `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT=1` needs an `ENV_REFERENCE.md` entry; deferred out of this phase at user direction.
- The alignment drift verifier reported three out-of-scope files (`canonical-fingerprint.ts`, `memo.ts`, `deploy-mcp.sh`) missing required headers; this phase did not touch them under the concurrency rule and they are not regressions from this work.
