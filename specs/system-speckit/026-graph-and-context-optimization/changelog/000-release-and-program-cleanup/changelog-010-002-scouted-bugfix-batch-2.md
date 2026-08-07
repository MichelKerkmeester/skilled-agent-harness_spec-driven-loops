---
title: "Scouted Bugfix Batch 2: Verify-First Fix of 13 Confirmed/Partial Defects across 22 Files"
description: "Batch 2 of the 20 scouted targets: 15 parallel gpt-5.5-fast confirm deep-dives classified each headline (4 CONFIRMED, 9 partial-but-real, 2 REFUTED), then 13 parallel implement-and-test agents fixed the confirmed + partial targets across 22 files (sources + regression tests). Spans chunking, deep-loop runtime, embeddings, vector-index validation, skill-advisor, code-graph, and benchmark/runner tooling."
trigger_phrases:
  - "scouted bugfix batch 2"
  - "verify-first partial-but-real batch fix"
  - "chunking maxlength budget guard"
  - "coverage graph vacuous claim rate"
  - "vector index logical key unique"
  - "hf-local persisted dim contract"
  - "13 fixes 22 files"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-03

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/002-scouted-bugfix-batch-2` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train`

### Summary

The 8-agent scout that fed batch 1 surfaced 20 high-risk targets; batch 1 fixed the top 5, leaving 15 latent defects across chunking, the deep-loop runtime, embeddings, vector-index validation, skill-advisor, code-graph, and benchmark/runner tooling. Many of the 15 carried a loud headline that did not survive contact with the real code.

Batch 2 ran a verify-first pipeline: 15 parallel gpt-5.5-fast confirm deep-dives classified each headline as CONFIRMED (4), partial-but-real (9), or REFUTED (2). The two refuted — the `package.json` hook-tests `specs/` path (a symlink to `.opencode/specs/`) and the reconsolidation env-leak (does not leak) — were not acted on. Thirteen parallel implement-and-test agents then fixed the confirmed + partial targets across 22 files (13 sources + added regression tests) on disjoint file sets, fixing only the REAL part of each partial. The orchestrator reviewed every diff; comment-hygiene clean; system-spec-kit + skill-advisor + code-graph builds exit 0; deep-loop `.cjs` `node --check` OK.

### Added

- Regression tests for all 13 fixes (one added test per fix), covering chunking guards, deep-loop signal vacuous-pass, fanout merge resolvedQuestionsById, phase-parent health detection, two-list RRF fusion, hf-local dim contract, semantic-shadow liveness, vector-index unique constraint, readiness-marker workspace root, conditional `--agent`, and mk-skill-advisor.js import.
- `idx_memory_logical_key_active_unique` to `REQUIRED_INDEXES` validation in `vector-index-schema.ts` so the v28 active-row unique index is no longer silently unvalidated.
- `resolvedQuestionsById` Map in `fanout-merge.cjs` mirroring the existing `openQuestionsById`, preserving per-lineage resolved questions and findings across fanout merges.
- Local `isPhaseParent()` detector in `spec-doc-health.ts` so phase parents no longer generate false health errors on absent plan/tasks/checklist (advisory-only annotation).

### Changed

- `chunking.ts`: added a `maxLength<=0` guard and a `remainingBudget<=0` break on the critical-section loop; replaced the non-Unicode-safe `substring` truncation with a code-point-safe slice (no broken surrogate pairs at boundaries).
- `coverage-graph-signals.ts` (deep-loop): `claimVerificationRate` now returns a vacuous-pass 1.0 when there are no CLAIM nodes, matching `p0ResolutionRate` — stops the perpetual CONTINUE on early-stage graphs.
- `fanout-run.cjs` (deep-loop): updated the stale cli-gemini fallback model `gemini-2.5-pro` to `gemini-3.1-pro-preview`.
- `rrf-fusion.ts`: brought the two-list `fuseResults` normalization into parity with `fuseResultsMulti`.
- `auto-select.ts` (embeddings): the hf-local persisted dim now mirrors HfLocalProvider's own contract (canonical=768, custom=0) so the provider's first-embed drift hook resolves the true dim; dropped the legacy `HF_LOCAL_MODEL` env alias so the persisted model name matches what the provider loads.
- `semantic-shadow.ts` (skill-advisor): flipped raw `LaneMatch.shadowOnly` true→false to match lane liveness — fusion already recomputes from `isLiveScorerLane`, so the flip is inert for all public scoring and removes a misleading two-value contract.
- `readiness-marker.ts` (code-graph): resolved the marker base dir via a workspace-root helper mirroring `core/config.ts` instead of `process.cwd()`.
- `dispatch-minimax.cjs` (benchmark): made `--agent` conditional (dropped the unconditional stale `--agent general`).
- `test-opencode-plugins.ts` runner: updated the stale plugin import `spec-kit-skill-advisor.js` → `mk-skill-advisor.js`.

### Fixed

- `chunking.ts` critical-section loop could spin or emit empty chunks when `maxLength<=0` or budget reached 0 mid-loop; code-point-unsafe `substring` could produce broken surrogate pairs at truncation boundaries. Both fixed.
- `coverage-graph-signals.ts`: `claimVerificationRate` returned 0 with no CLAIM nodes, driving a perpetual CONTINUE on early deep-loop graphs before any claim existed. Now returns vacuous-pass 1.0.
- `fanout-merge.cjs`: per-lineage `resolvedQuestions` and `resolvedFindings` were silently dropped on merge. Fixed via `resolvedQuestionsById` Map.
- `spec-doc-health.ts`: phase parents received false health errors on absent plan/tasks/checklist. Fixed with local `isPhaseParent()` detector.
- `rrf-fusion.ts`: two-list `fuseResults` applied a different normalization than `fuseResultsMulti`. Brought into parity.
- `auto-select.ts`: hf-local persisted dim was hardcoded to 768 regardless of model type, breaking custom-model drift resolution. Fixed to mirror provider contract.
- `semantic-shadow.ts`: raw `LaneMatch.shadowOnly` was unconditionally true, disagreeing with fusion's liveness recomputation. Flipped to false to remove the misleading contract.
- `vector-index-schema.ts`: the v28 `idx_memory_logical_key_active_unique` active-row unique index was absent from REQUIRED_INDEXES validation and could be silently missing. Added to validation.
- `readiness-marker.ts`: marker base dir resolved from `process.cwd()` instead of workspace root, causing incorrect placement under unexpected CWDs. Fixed via workspace-root helper.
- `dispatch-minimax.cjs`: unconditional `--agent general` passed stale agent flag. Made conditional.
- `test-opencode-plugins.ts`: imported `spec-kit-skill-advisor.js` (stale name). Updated to `mk-skill-advisor.js`.

### Verification

| Check | Result |
|-------|--------|
| 15 confirm deep-dives: 4 CONFIRMED, 9 partial-but-real, 2 REFUTED with code evidence | PASS |
| 2 REFUTED headlines not acted on (symlinked `specs/` hook-tests path; non-leaking reconsolidation env) | PASS |
| 13 parallel implement agents ran on disjoint file sets | PASS |
| Each of the 13 fixes has an added regression test that passes | PASS |
| Comment-hygiene clean (no spec-path / packet-id artifacts in any edited source) | PASS |
| system-spec-kit `npm run build` exit 0 | PASS |
| skill-advisor `npm run build` exit 0 | PASS |
| code-graph `npm run build` exit 0 | PASS |
| Deep-loop `.cjs` `node --check` OK (fanout-run, fanout-merge, dispatch-minimax) | PASS |
| Scope leak check: edits land only in 22 confirmed/partial-defect files | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `chunking.ts` + regression test | Modified | `maxLength<=0` guard + `remainingBudget<=0` break + code-point-safe truncation |
| `coverage-graph-signals.ts` + regression test | Modified | vacuous-pass 1.0 for `claimVerificationRate` when no CLAIM nodes |
| `fanout-run.cjs` + regression test | Modified | Updated stale cli-gemini fallback model to `gemini-3.1-pro-preview` |
| `fanout-merge.cjs` + regression test | Modified | Added `resolvedQuestionsById` Map to preserve per-lineage resolved questions/findings |
| `spec-doc-health.ts` + regression test | Modified | Added local `isPhaseParent()` detector to suppress false health errors on phase parents |
| `rrf-fusion.ts` + regression test | Modified | Brought two-list `fuseResults` normalization into parity with `fuseResultsMulti` |
| `auto-select.ts` + regression test | Modified | hf-local persisted dim mirrors provider contract; dropped legacy `HF_LOCAL_MODEL` env alias |
| `semantic-shadow.ts` + regression test | Modified | Flipped raw `shadowOnly` true→false to match lane liveness |
| `vector-index-schema.ts` + regression test | Modified | Added `idx_memory_logical_key_active_unique` to `REQUIRED_INDEXES` validation |
| `readiness-marker.ts` + regression test | Modified | Resolved marker base dir via workspace-root helper instead of `process.cwd()` |
| `dispatch-minimax.cjs` + regression test | Modified | Made `--agent` conditional (dropped unconditional `--agent general`) |
| `test-opencode-plugins.ts` + regression test | Modified | Updated stale plugin import `spec-kit-skill-advisor.js` → `mk-skill-advisor.js` |

Total: **22 files** (13 sources + 9 partial regression tests merged into existing test files + standalone tests) across 13 disjoint targets in 6 subsystems.

### Follow-Ups

- Deploy is required for the fixes to take effect: the orchestrator must recycle the mk-spec-memory daemon (shared/ + migration changes) after commit; skill-advisor + code-graph dist deploy on their next restart; the deep-loop `.cjs`/`.ts` files run via the consuming toolchain (no separate build step needed).
- The 2 REFUTED headlines (hook-tests `specs/` symlink path; reconsolidation env-leak) are closed with no action owed — both are correct as-is.
- Batch 2 closes the last 15 of the original 20-target scout; no further scouted targets remain from that scout batch.
