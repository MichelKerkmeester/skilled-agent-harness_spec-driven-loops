
---
title: "Skill-Advisor Plugin Hardening"
description: "Converted three latent architectural risks in the skill-advisor plugin into hard guarantees: per-instance state isolation, concurrent bridge dedup, and bounded prompt/brief/cache sizes with LRU eviction."
trigger_phrases:
  - "skill advisor plugin hardening"
  - "skill advisor per-instance state"
  - "skill advisor in-flight dedup"
  - "skill advisor size caps"
  - "skill advisor lru"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/002-advisor-plugin-hardening` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening`

### Summary

The skill-advisor plugin held all runtime state at module scope, risking cross-instance contamination in multi-workspace scenarios. Concurrent identical cache misses spawned duplicate bridge subprocesses with no deduplication. Prompt payloads, advisor briefs, and cache entries had no size bounds, exposing the system to unbounded memory growth from adversarial input. This phase refactored all plugin state into per-instance closures, added in-flight request deduplication, and introduced configurable caps with LRU eviction.

### Added

- Per-instance closure state for all plugin runtime data including cache, in-flight map, readiness flags, bridge and error fields, duration tracking, invocation and cache counters, advisor lookup counts, and disabled reason.
- In-flight deduplication so concurrent identical cache misses share one bridge subprocess while all callers receive the same response.
- Bridge stdin payload cap of 64 kilobytes with configurable override through the maxPromptBytes plugin option.
- Advisor brief output cap of 2,048 characters with configurable override through the maxBriefChars plugin option.
- Cache entry cap of 1,000 entries with LRU eviction through insertWithEviction() and configurable override through the maxCacheEntries plugin option.
- Seven new focused Vitest cases covering state isolation between plugin instances, in-flight deduplication, prompt clamping, brief clamping, cache eviction, per-instance status invariants, and configurable cap behavior.

### Changed

- Module-global plugin state refactored into a per-instance state object owned by the SpecKitSkillAdvisorPlugin closure.

### Fixed

- None.

### Verification

- Baseline focused Vitest: 23/23 passed before edits.
- Post-refactor focused Vitest: 23/23 passed after state refactor.
- Final focused Vitest: 30/30 passed.
- Build: npm run build passed.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modified | Per-instance closure state, in-flight dedup, prompt/brief caps, cache LRU eviction |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Modified | Seven new test cases for state isolation, dedup, clamping, eviction, and per-instance status |
| Packet docs (spec, plan, tasks, checklist, implementation-summary) | Created | Scoped packet documentation |

### Follow-Ups

- This packet does not address the unrelated copilot-hook-wiring.vitest.ts mismatch deferred from packet 007.
- If maxPromptBytes is configured below the fixed JSON metadata overhead, the prompt is clamped to an empty string while the metadata payload may still exceed that unrealistically small cap.
