# Changes from Upstream

> How this fork of `christopherarter/deep-pi` differs from upstream across three rounds of local changes, what was verified, and where to read more.

---

## 1. OVERVIEW

This repository initially vendored `christopherarter/deep-pi` byte-for-byte at commit `0f1cbd8124b4fb35df97f85aa943d730f4aae549`, then applied three rounds of local changes. The copy at `.pi/extensions/deep-pi/` is the runtime source used by Pi; the upstream repository does not include the changes documented here.

| Field | Value |
| --- | --- |
| Repository | `christopherarter/deep-pi` |
| Package | `@arter/deep-pi` |
| Commit | `0f1cbd8124b4fb35df97f85aa943d730f4aae549` |
| License | Apache-2.0 |

The upstream README documents its own derivation from `jrimmer/pi-deepseek-optimized`, which is licensed under BSD-3-Clause.

---

## 2. CHANGES FROM UPSTREAM

### Round 1 — Diagnostics Fixes

- Updated `extensions/deeppi.ts` by 30 added lines and 1 removed line, `extensions/deeppi/telemetry.ts` by 13 added lines, and five test files by 202 added lines and 3 removed lines.
- Made `transformErrors`, `usageUnavailable`, and `costMathErrors` appear in the `/deeppi` report when nonzero or true. Report text for a clean run is unchanged.
- Reset all three counters at the start of every session so the report covers the current session rather than a lifetime tally.
- Added `warnOnUnrecognizedModel()` on `session_start` and `model_select`. It notifies once per session when a `deepseek`-provider model ID is not one of the two known IDs but still looks like a DeepSeek-direct ID. It does not activate hooks, tools, or telemetry for the unrecognized ID, and the exact-match `isDeepPiModel` activation gate was not changed.
- Added cost-math validation for `model.cost` and `usage.cost` before the protected totals mutation. Malformed cost data now returns early and increments `costMathErrors` instead of throwing.

### Round 2 — Correctness Floor

- Split the cold-start recording guard in `extensions/deeppi/telemetry.ts` so a cache-write-only turn with zero input and cache-read tokens but nonzero cache-write tokens is recorded rather than treated as unavailable usage.
- Removed `TelemetryState.latestChurn`. Prefix-churn data now flows directly from the stability tracker into the report input, so `/deeppi` no longer copies it into telemetry state as a side effect.
- Added a shared DeepSeek-ownership test fixture.
- Added a combined-host test (`tests/ownership-composition.test.ts`) proving that `deep-pi` and `pi-cache-optimizer` never both react to the same model. The ownership guard this test exercises on the `pi-cache-optimizer` side was added earlier, in that fork's own patch (documented in that fork's changes file) — this round added test coverage, not the guard itself.

### Round 3 — Observability, Economics, and Maintainability

- Added `extensions/deeppi/stats.ts`, which stores persistent, versioned JSON statistics with per-session and cumulative-daily totals. It uses an atomic write helper and a cross-process advisory file lock so concurrent Pi processes cannot silently clobber each other's statistics update. Corrupt files and files with a future schema version return an explicit `unreadable` error rather than being treated as empty.
- Added a cache-write token bucket and included cache-write cost in the reported actual input cost.
- Renamed the report line `Estimated savings` to `No-cache counterfactual savings`. The number is unchanged; the new label identifies it as an avoided-cost estimate rather than a measured saving.
- Split reporting into build, render, and transport layers. Build produces a plain versioned data object, render converts it to human-readable text, and transport writes a JSON snapshot file and notifies the UI.
- Made `errorsEnhanced`, `prunedThinking`, and `preservedThinking` appear in the report when nonzero.
- Added a guard that records only turns with a normal stop reason: `stop`, `length`, or `toolUse`. Aborted and errored turns no longer affect totals.
- Added numeric validation before totals mutation. Non-finite or negative usage and cost values are rejected rather than corrupting running totals.
- Added the opt-in `scripts/live-benchmark.mjs` benchmark entry point. Its default mode makes no external calls.
- Fixed the package `files` allowlist so `scripts/live-benchmark.mjs` is included by `npm pack`.
- Added the repo-level `.opencode/scripts/check-vendored-fork-provenance.mjs` check. It covers both forks, hashes each shipped file set against a recorded baseline, and reports drift.
- Did not change `hashlines.ts`, the hash-verified edit and atomic-write module; it was read but not modified in any round.

---

## 3. VERIFICATION

- Ran the full final test suite: 81 tests across 11 files passed.
- The suite had 60 passing tests at the end of Round 1, compared with the original baseline of 52 tests across 8 files.
- Ran `tsc --noEmit` from the final state: clean.
- Used multiple negative controls to reproduce the predicted failure before each corresponding fix and confirm it passed afterward.
- Verified the cross-process advisory lock with a genuine race test using two real operating-system processes.
- Live Pi sessions confirmed that `deep-pi` activates only for `deepseek/deepseek-v4-flash` and `deepseek/deepseek-v4-pro` and remains fully dormant for every other model.

---

## 4. RELATED RESOURCES

- [deep-pi README](./README.md)
