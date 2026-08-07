---
title: "Daemon Concurrency Fixes: Four Race Conditions Closed in the Skill-Advisor Daemon"
description: "Four concurrency holes in the skill-advisor daemon and freshness layer are closed. Watcher flushes are now serialized. Shutdown ordering is corrected. The generation lock is token-tagged to prevent stale reclamation theft. Cache invalidation enforces monotonic generation order. Four new stress tests verify each fix would have failed against the pre-fix code."
trigger_phrases:
  - "daemon concurrency fixes"
  - "skill-advisor watcher race"
  - "generation lock token ownership"
  - "cache invalidation monotonic"
  - "shutdown ordering fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/024-daemon-concurrency-fixes` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

The skill-advisor daemon had four concurrency holes that let its persisted state diverge from reality under realistic interleavings. Timer-driven flushes could race each other, leaving two `processSkill()` calls running concurrently for the same skill. Shutdown could publish the terminal `unavailable` generation first and then have a queued reindex overwrite it with `live`. The generation lock could be deleted by a previous holder whose reclamation token no longer matched the current owner. Cache listeners could observe events in reverse generation order.

All four holes are now closed with localized fixes that keep the public daemon contract unchanged. The `flushPromise` drain loop serializes watcher flushes. The shutdown sequence suppresses generation publication before draining and closing the watcher, then publishes the terminal `unavailable` last. Every lock acquisition writes a 32-character random token and the release closure only deletes the lock when the token still matches. Cache invalidation drops any event whose generation is strictly older than the most recently observed generation. The full stress suite finishes in approximately 55 seconds and now includes four additional tests that would have failed against the pre-fix code.

### Added

- `flushPromise` field and `drainPending()` while-loop in `watcher.ts` to serialize concurrent `processSkill()` invocations per skill
- `flush()` and `suppressGenerationPublication()` methods on the `SkillGraphWatcher` public interface to make shutdown sequencing explicit and testable
- `sa-003b` describe block in `daemon-lifecycle-stress.vitest.ts` with 2 mutex tests covering timer drain serialization and close-awaits-flush behavior
- `sa-007b` describe block in `generation-cache-invalidation-stress.vitest.ts` with 2 token-ownership tests covering stale reclamation and concurrent ownership invariants
- Random token field (32 hex characters via `crypto.randomBytes(16)`) in the generation lock file format alongside the existing pid and timestamp fields

### Changed

- `shutdown()` in `lifecycle.ts` now calls `suppressGenerationPublication(true)`, then `flush()`, then `close()` on the watcher before publishing the terminal `unavailable` generation. Previously it published `unavailable` first and then left queued reindex events free to overwrite it.
- `acquireGenerationLock()` in `generation.ts` now writes a token into the lock file and the release closure performs a token-matched compare-and-swap before deleting. Stale reclamation also reads the persisted token before removing an old lock.
- `invalidateSkillGraphCaches()` in `cache-invalidation.ts` now compares `published.generation` against `lastInvalidation.generation` and returns early without notifying listeners when the incoming event is strictly older.

### Fixed

- Timer-driven watcher flushes could race: a second `flushPending()` call while a drain was already active would start a competing `processSkill()` pass. The `flushPromise` ref ensures concurrent callers join the in-flight drain instead of starting a new one.
- Daemon shutdown left the on-disk generation in `state: 'live'` when queued watcher events flushed after the terminal `unavailable` was published. Reversed shutdown ordering eliminates this window.
- Generation lock release by a paused holder could delete a lock already reclaimed by a newer publisher. Token-matched release turns the stale holder's deletion into a no-op.
- Cache listeners could observe a generation event that arrived out of order from a slow publisher, overwriting `lastInvalidation` with a lower generation number. The monotonic guard drops such events before listener fan-out.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` (tsc --build) | PASS, exit 0 |
| `npx vitest run skill_advisor/tests/daemon-freshness-foundation.vitest.ts` | PASS, 20/20 tests |
| Targeted stress (4 files) | PASS, 13/13 tests (9 baseline plus 4 new) |
| `npm run stress` | PASS, exit 0, 56 files. 163 tests, 54.69 seconds |
| `validate.sh --strict` (this packet) | Remediated to exit 0 |
| New `sa-003b` test against pre-fix code | Would fail. Pre-fix `pending.clear()` before await allowed `maxConcurrent` to reach 2. |
| New `sa-007b` test against pre-fix code | Would fail. Pre-fix release deleted B's lock unconditionally. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts` | Modified | Added `flushPromise` field, `drainPending()` while-loop, `suppressGenerationPublication` flag. Exposed `flush()` and `suppressGenerationPublication()` on the public interface. Gated `processSkill()` generation-publish behind the suppress flag. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lifecycle.ts` | Modified | Reversed `shutdown()` ordering. Now suppresses then flushes then closes the watcher before publishing the terminal `unavailable` generation. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/generation.ts` | Modified | Added token-tagged lock acquisition using `crypto.randomBytes(16)`. Release closure now performs owner-checked compare-and-swap. Stale reclamation reads the persisted token before removing. Exported `__testables` for stress tests. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/cache-invalidation.ts` | Modified | Added monotonic guard that drops events whose `generation` is strictly older than `lastInvalidation.generation` before listener fan-out. |
| `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/daemon-lifecycle-stress.vitest.ts` | Modified | Added `sa-003b` describe block with 2 mutex tests for the watcher serialization fix. |
| `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/generation-cache-invalidation-stress.vitest.ts` | Modified | Added `sa-007b` describe block with 2 token-ownership tests for the generation lock fix. |

### Follow-Ups

- Audit `getLastCacheInvalidation()` consumers to confirm they tolerate monotonic ordering. Iteration-001 flagged this as an open question but it is explicitly out of scope for this packet.
- Audit `indexSkillMetadata(skillsRoot)` for same-skill concurrent reindex idempotency. Also flagged in iteration-001 and deferred.
- The lock format is forward-compatible but not backward-compatible. Old binaries reading the new `pid:acquiredAt:token` format treat missing tokens as un-owned and reclaim eagerly. Rolling upgrades are safe. Rolling downgrades lose token-ownership protection until both sides match.
- The `sa-003b` mutex test parks reindex callbacks via `setTimeout` to reproduce the JS-level race shape. It does not directly stress SQLite. A combined watcher-plus-lease-plus-SQLite race test remains a larger follow-on.
