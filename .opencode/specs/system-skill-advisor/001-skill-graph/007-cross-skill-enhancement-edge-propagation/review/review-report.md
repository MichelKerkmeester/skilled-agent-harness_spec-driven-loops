---
title: Deep Review Report — Phase 026 skill_graph_propagate_enhances MVP
description: 10-iteration adversarial audit of SWE-1.6 implementation. Verdict CONDITIONAL PASS — 0 P0, 10 P1, 36 P2. Test coverage gaps for REQ-001/REQ-002 + 3 cross-iteration code patterns recommend remediation before claiming completion.
---

# Deep Review Report — Phase 026 skill_graph_propagate_enhances MVP

## 1. Metadata

| Field | Value |
|-------|-------|
| Review target | Phase 026 — skill_graph_propagate_enhances MVP |
| Implementation under review | SWE-1.6 via cli-devin (Devin for Terminal v2026.5.6-8) |
| Spec folder | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation` |
| Iterations | 10 of 10 (operator-capped) |
| Executor | `cli-opencode` + `deepseek/deepseek-v4-pro` + `reasoning=high` (`--pure --agent build`) |
| Dimensions | Correctness (D1) ×5 iters · Security (D2) ×1 · Traceability (D3) ×2 · Maintainability (D4) ×1 · Adjudication (D5) ×1 |
| Wall-clock | 2026-05-15T14:54Z → 2026-05-15T16:24Z (90 min) |
| Convergence | Final-iteration newInfoRatio=0.20; review surface exhausted |

## 2. Verdict

**CONDITIONAL PASS** (hasAdvisories=true)

- **0 P0** — no blockers
- **10 P1** — required remediation before claiming completion (mostly test gaps + 3 cross-iteration code patterns + spec drift)
- **36 P2** — advisory cleanup / defense-in-depth

The implementation's core properties are sound: trusted-caller gating, dryRun default, idempotence guards, edge-type hardcoding, schema-additive parsing, deterministic templating, and apply-time auto-marker fields are all correctly implemented. The CONDITIONAL severity comes from:
1. Two P0 requirements (REQ-001, REQ-002) validated only by manual smoke — no automated test produces a confidence-≥0.80 candidate.
2. Three recurrent code patterns spanning multiple files (null-weight propagation, unchecked `as` casts, silent error swallowing).
3. Three spec-implementation drifts (asset filename, function name, inapplicable edge case).

None are exploitable in production data today, but each can compound if the module grows.

## 3. Coverage Summary

| Iteration | Dimension | P0 | P1 | P2 | Convergence Signal |
|-----------|-----------|----|----|----|-----|
| 01 | D1 Correctness — scoring math | 0 | 0 | 6 | not-converged |
| 02 | D1 Correctness — idempotence/hash/filter | 0 | 0 | 1 | approaching |
| 03 | D2 Security — path/parse/injection | 0 | 1 | 3 | not-converged |
| 04 | D3 Traceability — P0 REQs | 0 | 2 | 4 | not-converged |
| 05 | D3 Traceability — P1 REQs + checklist | 0 | 2 | 4 | approaching |
| 06 | D4 Maintainability — naming/dead code/errors/docs | 0 | 1 | 6 | approaching |
| 07 | D1 Correctness — substitution edge cases | 0 | 1 | 5 | not-converged |
| 08 | D1 Correctness — adversarial data shapes | 0 | 1 | 3 | not-converged |
| 09 | D1 Correctness — auto-marker integrity | 0 | 0 | 3 | approaching |
| 10 | D5 Adjudication — re-verify + patterns | 0 | 2 | 0 | converged |
| **Total** | | **0** | **10** | **35** | **converged** |

Files reviewed: 12 implementation + 4 spec docs + 2 graph-metadata.json (sk-prompt + system-skill-advisor) = 18.

Cross-reference protocols completed: `spec_code` (P0 REQs traced in iter 04, P1 REQs in iter 05), `checklist_evidence` (iter 05), `skill_agent` (n/a — no skill changes), `agent_cross_runtime` (n/a), `feature_catalog_code` (n/a), `playbook_capability` (n/a).

## 4. P1 Findings — Required Remediation

### F-03-001 [P1] No path-boundary check in `applyEnhanceEdge` — candidate.sourcePath written without workspace validation
- **Where**: `apply-graph-metadata-patch.ts:52` (write); `propagate-enhances.ts:49` (handler partial guard)
- **Risk**: Spec CHK-031 / NFR-S01 specify path traversal must be guarded. The handler validates `skillsRoot` but `candidate.sourcePath` from `discoverGraphMetadataFiles` isn't re-validated before `fs.writeFile`. Production paths come from `metadata-loader` which globs `<skillsRoot>/*/graph-metadata.json` — so today the paths are safe by construction. But the contract has no defense if `sourcePath` is ever passed in directly.
- **Fix**: Add a `path.resolve(p).startsWith(path.resolve(skillsRoot))` guard in `applyEnhanceEdge` before write, rejecting paths outside the trusted root.

### F-04-001 [P1] REQ-002 high-confidence path has zero automated test coverage — validated only by manual smoke
- **Where**: `cross-skill-edges.vitest.ts:1-289`
- **Risk**: All 5 vitest fixtures use `minConfidence: 0.25` (line 108) or `0.0` (line 248). No fixture composite-scores above 0.30. The family-inference scorer (max contribution 0.45) is never exercised by automated tests. REQ-002 acceptance was satisfied by my live smoke against the repo (which found `system-skill-advisor → deep-ai-council` at 0.90 and applied it), but that's a one-shot snapshot — not a regression net.
- **Fix**: Add a vitest fixture with 5+ synthetic same-family skills where the source has ≥3 prior enhances + the target shares the family + matching asset-shape. Assert at least one returned candidate has `confidence >= 0.80` and `confidenceLabel === 'high'`.

### F-04-002 [P1] REQ-004 auto-marker fields not verified by automated test round-trip
- **Where**: `cross-skill-edges.vitest.ts:213-215` (Fixture C)
- **Risk**: Fixture C asserts `applyResult.applied.length === 1` but doesn't read the file back to verify `auto_added_at` is ISO-8601 + `auto_added_reason` is non-empty + the edge appears in `enhances[]`. Without the round-trip, a regression that drops these fields would not be caught.
- **Fix**: After `applyResult` in Fixture C, `JSON.parse(readFileSync(sourcePath))` and assert `edges.enhances[N].auto_added_at` is a parseable ISO-8601 UTC string + `auto_added_reason` is non-empty.

### F-05-001 [P1] REQ-008 acceptance criteria asset path mismatch — `prompt_quality_card.md` vs `cli_prompt_quality_card.md`
- **Where**: `spec.md:143` (claims `assets/prompt_quality_card.md`) vs implementation (uses `cli_prompt_quality_card.md`)
- **Risk**: The acceptance criterion as-written cannot be satisfied — the asset doesn't exist by the spec name. The implementation uses the real filename. Acceptance gate reads stale.
- **Fix**: Update spec.md REQ-008 to cite `cli_prompt_quality_card.md`.

### F-05-002 [P1] REQ-013 / CHK-051 — `tests/fixtures/cross-skill-edges/` empty; fixtures live in `/tmp`
- **Where**: `tests/fixtures/cross-skill-edges/` glob returns zero files
- **Risk**: REQ-013 + CHK-051 specify synthetic fixtures live under `tests/fixtures/cross-skill-edges/`. SWE-1.6 used `mkdtempSync` to create synthetic skills in `/tmp` per test. Functionally equivalent, but the cited convention isn't honored.
- **Fix**: Either move fixture data into `tests/fixtures/cross-skill-edges/` and load via `path.join(__dirname, 'fixtures/cross-skill-edges/...')`, OR update REQ-013 + CHK-051 to permit `mkdtempSync` pattern.

### F-06-004 [P1] JSON parse failures silently swallowed during metadata loading — never surfaced to tool output `errors[]`
- **Where**: `metadata-loader.ts:83-85,88-94,170`
- **Risk**: When a skill's `graph-metadata.json` is malformed (per spec.md:215 edge case), `loadSkillMetadata` returns null without warn, and `loadAllSkillMetadata:170` silently discards nulls via `if (record)`. The tool's `PropagateEnhancesResult.errors[]` is designed for this surface (types.ts:75) but is only populated by `applyEnhanceEdge`. Operators get zero signal that a skill was skipped.
- **Fix**: Capture parse failures into a `parseErrors: string[]` field on `loadAllSkillMetadata`'s return, merge into `PropagateEnhancesResult.errors`. Closes 3 related findings (F-06-004, F-08-003, F-03-003).

### F-07-001 [P1] `inferEdgePayload` crashes on `null`/`undefined` exemplar context — `substituteProviderName` dereferences without null guard
- **Where**: `context-template.ts:79` (`result.replace(...)`), called from `inferEdgePayload:134`