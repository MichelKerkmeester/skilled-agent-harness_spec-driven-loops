# DeepPi Tests

---

## 1. OVERVIEW

Test suite for the DeepPi extension, covering eligibility, hash-anchored editing, prefix stability, statistics persistence, retry economy, telemetry, report transport, package identity, and cross-fork ownership composition. Tests use Vitest for TypeScript tests and Node.js child processes for cross-process lock and statistics race tests.

---

## 2. KEY FILES

| File | Role |
| --- | --- |
| `cross-process-lock-worker.mjs` | Child-process worker that acquires `withCrossProcessLock` on a shared target, holds it for a fixed duration, and appends timestamped start/end markers to a shared log. Spawned by `stats.test.ts` to prove mutual exclusion across real OS processes. |
| `cross-process-stats-worker.mjs` | Child-process worker that calls `updateStatsForSession` from a separate OS process. Spawned by `stats.test.ts` to prove concurrent stats updates do not clobber each other. |
| `deeppi.integration.test.ts` | Integration tests exercising the full extension through `FakePi`: dormancy for unsupported models, activation for Pro, cache usage reporting, unrecognized-model warnings, prefix churn rendering, and telemetry state immutability after `/deeppi`. |
| `eligibility.test.ts` | Unit tests for `isDeepPiModel` (accepts direct DeepSeek V4 Flash/Pro, rejects other providers and preview ids) and `withEditLinesActive` (adds `edit_lines` when eligible, removes it when dormant). |
| `fake-pi.ts` | Test harness exporting `FakePi` (in-memory `ExtensionAPI` mock with handler registry, command registry, tool registry, and active-tool list) and `fakeContext` (builds an `ExtensionContext` with an isolated OS temp directory as `cwd`). |
| `hashlines.test.ts` | Tests for `atomicWriteFile` (file mode preservation, symlink rejection, post-rename verification, race detection) and the `edit_lines` tool (dormancy for unsupported models, batch validation, overlapping range rejection). Uses `vi.mock` to intercept `node:fs/promises.readFile` for race simulation. |
| `ownership-composition.test.ts` | Cross-fork tests proving `deep-pi` and `pi-cache-optimizer` never both react to the same model. Loads both extensions via `jiti`, compares predicates against a shared fixture and a wide synthetic candidate space, and observes exactly one extension reacting in a combined host. |
| `package.test.ts` | Tests for package identity: verifies `@arter/deep-pi` name, version `1.0.0`, extension entry point, `benchmark:live` script, Apache 2.0 license, and absence of stale runtime branding. |
| `report.test.ts` | Tests for the build/render/transport report layers: plain versioned data separation, snapshot and stats writing in UI-less mode, and no persistence on `message_end` but flush on `session_shutdown`. |
| `review2.test.ts` | Review-finding tests: atomic-write serialization and race detection (rename interception, post-replace verification), 32-bit hash non-collision, 8-hex-char annotation recognition, stormbreaker ignoring non-assistant `message_end` events, and lowercase date/time label preservation. |
| `stability.test.ts` | Tests for `stabilizeMessages` (thinking pruning without input mutation, preservation on toolCall turns), `freezeSessionTimestamps` (generated-line freezing, user-authored date preservation), `sortProviderTools`, `capturePrefixShape`, `classifyPrefixChurn`, and stability transform-error surfacing at session boundaries. |
| `stats.test.ts` | Tests for statistics persistence: session and daily total rebuilding, unreadable corrupt and future-version files, compare-and-swap concurrent writer rejection, and cross-process mutual exclusion using real OS child processes. |
| `stormbreaker.test.ts` | Tests for the batch-aware retry economy: guard on third equivalent all-failed batch, abort on fourth, streak reset on any success, alternating-batch guarding through blocked-turn streak, non-assistant `message_end` filtering, and actionable error text preservation beyond 500 characters. |
| `telemetry.test.ts` | Tests for usage recording (normalized Pi usage, model-aware savings, cache-write-only turns, empty usage rejection), report rendering (pinned text, relabeled savings line, runtime counters), cost-math validation (missing pricing, non-finite/negative values), and hook-level provider and stop-reason filtering. |

---

## 3. VALIDATION

```bash
npm test
```

The test suite uses Vitest for TypeScript tests and `node --test` compatible workers for cross-process tests. Run from the `deep-pi` extension directory.

---

## 4. RELATED

- [deep-pi README](../README.md)
- [Changes from Upstream](../CHANGES-FROM-UPSTREAM.md)
- [extensions/ README](../extensions/README.md)
