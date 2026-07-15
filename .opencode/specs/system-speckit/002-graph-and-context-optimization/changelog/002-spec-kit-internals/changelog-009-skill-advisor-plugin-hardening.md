---
title: "Phase 009: Skill advisor plugin hardening"
description: "Per-instance plugin state, in-flight bridge dedup, bounded payloads, cache LRU eviction, and focused Vitest coverage. Tests grew from 23 to 30."
trigger_phrases:
  - "phase 009 changelog"
  - "skill advisor plugin hardening"
  - "in-flight dedup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor` (Level 2)
> Parent packet: `002-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor`

### Summary

Packet 008 hardened the OpenCode skill-advisor plugin across three deferred P2 items from the earlier hook-surface audit. All plugin runtime state is now per-instance closure state. Concurrent identical cache misses share one in-flight bridge promise. Bridge stdin payload, advisor briefs, and cache entries are bounded with configurable caps. Cache insertion now routes through eviction when the cap is exceeded.

### Added

- `insertWithEviction()` helper for bounded cache with LRU eviction.
- Default constants: `DEFAULT_MAX_PROMPT_BYTES = 64KB`, `DEFAULT_MAX_BRIEF_CHARS = 2KB`, `DEFAULT_MAX_CACHE_ENTRIES = 1000`.
- Overridable plugin options: `maxPromptBytes`, `maxBriefChars`, `maxCacheEntries`.
- 7 new focused Vitest cases: state isolation, in-flight dedup, prompt clamp, brief clamp, eviction, per-instance status, configurable caps.

### Changed

- All plugin runtime state (cache, in-flight map, readiness, counters) moved from module globals into `SpecKitSkillAdvisorPlugin(ctx, opts)` closure.
- `getAdvisorContext()` now dedups concurrent identical cache misses through `state.inFlight`.
- Bridge stdin capped at `maxPromptBytes`. Advisor briefs capped at `maxBriefChars`.
- Cache insertion routes through `insertWithEviction()`.
- In-flight dedup counted as logical cache hit, preserving `cache_hits + cache_misses === advisor_lookups`.

### Fixed

- Two plugin instances no longer share mutable runtime state.
- Concurrent identical prompts no longer spawn multiple bridge processes.
- Unbounded cache growth eliminated with LRU eviction at 1000 entries.
- Bridge stdin payload is bounded to prevent oversized inputs.

### Verification

- Baseline focused Vitest: 23/23 passed before edits.
- After closure refactor: 23/23 passed (with workspace-root assertion adjusted).
- After hardening + 7 new tests: 30/30 passed.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/plugins/spec-kit-skill-advisor.js` | Per-instance state, in-flight dedup, bounded payloads, LRU eviction |

### Follow-Ups

- Global package build still fails in unrelated files outside this packet scope.
- Copilot hook wiring mismatch still deferred from earlier packets.
