---
title: "Scouted Bugfix Batch 4: 9 Fixes from Batch-4 Scout Pipeline"
description: "Verify-first batch fix over batch-4 scouted candidates: 9 confirmed by gpt-5.5-fast deep-dive and implemented with regression tests; 11 excluded as policy/migration/unconfirmed. Fixes: warm-tier savings metric pre-truncation capture, anchor-miss returnedTokens/savingsPercent recompute, formatAgeString NaN guard, shadow promotion zero-delta epsilon gate, adapter-common dead ternary, check-graph-metadata last-active basename, cli-gemini/cli-codex auth pre-flight corrections, token-budget constitutional count/summary reconciliation."
trigger_phrases:
  - "scouted bugfix batch 4"
  - "warm-tier savings metric locked"
  - "anchor-miss returnedTokens zero"
  - "formatAgeString NaN months"
  - "shadow promotion zero-delta"
  - "adapter-common dead ternary"
  - "check-graph-metadata last-active"
  - "cli-gemini auth preflight"
  - "cli-codex auth preflight"
  - "token-budget constitutional count"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-03

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/004-scouted-bugfix-batch-4` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train`

### Summary

The fourth batch of the scouted bugfix train ran the scout → gpt-5.5-fast confirm → implement-and-test pipeline over the batch-4 candidate pool. Eleven candidates were excluded as out-of-scope: policy changes, migration work, or headlines not confirmed by the deep-dive — none were edited. The 9 confirmed defects were fixed by parallel implement-and-test agents on disjoint file sets: warm-tier savings metric structurally locked at ~67% (pre-truncation capture); all-anchors-missing branch returning hard-coded zeros (accurate recompute from `estimateTokens`); `formatAgeString` returning "NaN months ago" for invalid ISO (NaN guard → "never"); shadow promotion gate counting zero-delta cycles as improvements (epsilon + empty Map on zero signal); dead adapter-common ternary misclassifying non-blocked spawn errors as BLOCKED (→ FAIL); check-graph-metadata-shape spurious WARNING for full packet_id in `last_active_child_id` (basename fallback); cli-gemini calling a non-existent auth subcommand (filesystem probe); cli-codex calling an unrecognized auth subcommand (→ `codex login status`); and token-budget envelope leaving `constitutionalCount`/`envelope.summary` desynced from survivors after the pop loop (post-loop recompute). Every fix ships with a regression test; `npm run build` exit 0.

### Added

- Regression test for warm-tier savings metric with pre-truncation `fullContentTokens` baseline (`modularization.vitest.ts`).
- Regression test for anchor-miss branch accurate metric recompute from `estimateTokens(content)` (`anchor-prefix-matching.vitest.ts`).
- Regression test for `formatAgeString` NaN guard returning "never" sentinel (`search-results-format.vitest.ts`).
- Regression test for shadow promotion zero-delta epsilon gate + empty-Map return (`shadow-scoring-holdout.vitest.ts`).
- Regression test for adapter-common FAIL classification on non-blocked spawn errors (`matrix-adapter-common.vitest.ts`).
- `check-graph-metadata-shape-last-active-child.sh` regression test for basename fallback existence test.
- `token-budget-constitutional-sync.vitest.ts` regression test for post-pop-loop count/summary reconciliation.

### Changed

- `token-metrics.ts` + `memory-triggers.ts`: `fullContentTokens` captured before the 150-char truncation; passed through to the formatter; used as WARM-tier baseline (3x kept only as fallback). Structurally-locked ~67% metric corrected.
- `search-results.ts`: all-anchors-missing branch now recomputes `returnedTokens` and `savingsPercent` from `estimateTokens(content)`, mirroring the partial-match branch.
- `format-helpers.ts` `formatAgeString`: `Number.isNaN(timestamp)` guard added; invalid ISO strings return "never" sentinel instead of "NaN months ago".
- `shadow-scoring.ts` + `shadow-evaluation-runtime.ts`: `MIN_NDCG_IMPROVEMENT` epsilon gate added; returns empty Map (not uniform-0.5) when `maxAbsoluteSignalTotal===0`; evaluation runtime updated to consume the empty-Map guard.
- `adapter-common.ts`: dead ternary else-branch corrected from "BLOCKED : BLOCKED" to "BLOCKED : FAIL"; non-blocked spawn errors (EPIPE, ECONNRESET) now classify as FAIL.
- `check-graph-metadata-shape.sh`: basename fallback existence test added; full packet_id in `derived.last_active_child_id` no longer triggers spurious WARNING.
- `cli-gemini/SKILL.md`: auth pre-flight replaced non-existent `gemini config list` call with filesystem probe of `~/.gemini/oauth_creds.json`.
- `cli-codex/SKILL.md`: auth pre-flight replaced unrecognized `codex auth status` (exit 2) with `codex login status`.
- `context-server.ts`: after the token-budget truncation pop loop, `data.constitutionalCount` recomputed from survivors and `envelope.summary` rebuilt so counts agree with `data.results.length`.

### Fixed

- `token-metrics.ts`: WARM-tier savings metric was structurally locked at ~67% because `fullContentTokens` was captured after the 150-char truncation. Now captured before truncation.
- `search-results.ts`: all-anchors-missing branch hard-coded `returnedTokens:0` / `savingsPercent:100` despite emitting a warning string. Both now recomputed accurately from `estimateTokens(content)`.
- `format-helpers.ts`: `formatAgeString` returned "NaN months ago" for invalid ISO input. `Number.isNaN` guard added; returns "never" sentinel.
- `shadow-scoring.ts`: zero-delta uniform-signal cycles miscounted as improvements; uniform-0.5 map emitted when no real signal was present. Epsilon gate + empty-Map return correct this.
- `adapter-common.ts`: dead ternary classified all non-blocked spawn failures as BLOCKED. Corrected to FAIL for non-blocked error codes.
- `check-graph-metadata-shape.sh`: spurious WARNING when `derived.last_active_child_id` held a full packet_id. Basename fallback existence test eliminates the false positive.
- `cli-gemini/SKILL.md`: auth pre-flight called `gemini config list` (non-existent subcommand). Replaced with filesystem probe.
- `cli-codex/SKILL.md`: auth pre-flight ran `codex auth status` (unrecognized subcommand, exit 2). Replaced with `codex login status`.
- `context-server.ts`: `constitutionalCount` and `envelope.summary` not recomputed after the token-budget pop loop removed constitutional entries. Now recomputed from survivors.

### Verification

| Check | Result |
|-------|--------|
| 9 candidates confirmed by gpt-5.5-fast deep-dive before any edit | PASS — 9 CONFIRMED, 11 EXCLUDED (policy/migration/unconfirmed) |
| 11 excluded candidates not acted on | PASS — all 11 left unedited |
| Each of the 9 fixes has a passing regression test | PASS — added/updated regression test passes for each fix |
| Comment-hygiene | PASS — no spec-path / packet-id tracking artifacts in any edited source |
| system-spec-kit `npm run build` | PASS — exit 0 |
| Scope leak | PASS — edits confined to the confirmed-defect files (sources + regression tests) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `token-metrics.ts` + `memory-triggers.ts` + `modularization.vitest.ts` | Modified | Pre-truncation `fullContentTokens` capture; WARM baseline corrected |
| `search-results.ts` + `anchor-prefix-matching.vitest.ts` | Modified | Anchor-miss branch accurate `returnedTokens` + `savingsPercent` recompute |
| `format-helpers.ts` + `search-results-format.vitest.ts` | Modified | `formatAgeString` NaN guard → "never" sentinel |
| `shadow-scoring.ts` + `shadow-evaluation-runtime.ts` + `shadow-scoring-holdout.vitest.ts` | Modified | Zero-delta epsilon gate + empty Map on zero-signal total |
| `adapter-common.ts` + `matrix-adapter-common.vitest.ts` | Modified | Dead ternary → FAIL for non-blocked spawn errors |
| `check-graph-metadata-shape.sh` + `check-graph-metadata-shape-last-active-child.sh` | Modified / Added | Basename fallback existence test; no spurious WARNING |
| `cli-gemini/SKILL.md` | Modified | Filesystem probe for auth pre-flight |
| `cli-codex/SKILL.md` | Modified | `codex login status` for auth pre-flight |
| `context-server.ts` + `token-budget-constitutional-sync.vitest.ts` | Modified / Added | Post-pop-loop `constitutionalCount` + `envelope.summary` reconciliation |

### Follow-Ups

- Deploy: recycle the mk-spec-memory daemon after commit so the `token-metrics.ts`, `search-results.ts`, `format-helpers.ts`, `shadow-scoring.ts`, `context-server.ts`, and `adapter-common.ts` fixes take effect in the running daemon. `check-graph-metadata-shape.sh` and the two SKILL.md files do not need a daemon recycle; SKILL.md changes are live at next CLI dispatch.
- 11 excluded candidates remain out-of-scope (policy/migration/unconfirmed). A fifth scout may surface additional targets if warranted.
