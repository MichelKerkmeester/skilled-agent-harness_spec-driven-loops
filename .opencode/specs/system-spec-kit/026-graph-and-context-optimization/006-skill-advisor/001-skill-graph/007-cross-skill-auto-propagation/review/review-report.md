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
| Spec folder | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation` |
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
- **Risk**: If a same-family exemplar edge has `context: null` (legal per type — `string | null`), `substituteProviderName` calls `.replace()` on null/undefined → TypeError. Today's data has non-null contexts, but the type permits null.
- **Fix**: Guard `if (exemplar?.context == null)` before substituteProviderName, return `{ context: null, blockers: ['exemplar context missing'] }`.

### F-08-001 [P1] `skill_has_files` non-array value crashes `.every()` — unvalidated enhance_when rule field
- **Where**: `detect-inbound-enhances.ts:146`, `context-template.ts:105`
- **Risk**: `rule.skill_has_files && rule.skill_has_files.every(...)` — the truthy check passes for strings, numbers, booleans. Only arrays have `.every()`. Hand-edited `enhance_when.skill_has_files: "SKILL.md"` (string instead of array) crashes.
- **Fix**: `Array.isArray(rule.skill_has_files) && rule.skill_has_files.every(...)`. Same guard at both call sites.

### F-10-001 [P1] Cross-iteration pattern: null-weight → applyable=true spans 3 unremediated code paths
- **Where**: `context-template.ts:109,142`; `apply-graph-metadata-patch.ts:43`
- **Risk**: `clipWeight` (`context-template.ts:55-57`) returns null when input is null/undefined, but neither caller in `inferEdgePayload` adds a blocker. `applyEnhanceEdge` writes `candidate.weight` to JSON without null-check. Production data avoids the gap (both `enhance_when` rules provide explicit weights), but a future `enhance_when` rule missing a weight would silently write `"weight": null` to disk.
- **Fix**: Single-site guard at `detect-inbound-enhances.ts:239`: `applyable: weight !== null && context !== null && blockers.length === 0`. Closes F-01-006 / F-02-001 / F-05-005 simultaneously.

### F-10-002 [P1] Cross-iteration pattern: unsafe `as` cast cascade creates multiple crash and silent-failure paths
- **Where**: `metadata-loader.ts:131` (enhance_when), `metadata-loader.ts:122` (edge arrays), `skill-graph-tools.ts:141` (handler args)
- **Risk**: Three `as` casts at runtime boundaries defeat TS type-checking. Cascades into F-07-001 (null context crash), F-08-001 (non-array .every() crash), F-08-003 (silent malformed enhance_when), F-04-003 (handler arg validation bypass) — collectively 4 of the 10 P1 findings. Root cause: trust JSON shape without structural guards.
- **Fix**:
  1. `metadata-loader.ts:131` — validate `enhance_when` is object-or-array-of-objects before cast.
  2. `metadata-loader.ts:122` — validate each edge element has `typeof target === 'string'` + `typeof weight === 'number'`.
  3. `skill-graph-tools.ts:141` — validate `mode` against enum, reject unknown values.

## 5. P2 Findings — Advisory Cleanup (count: 36)

Grouped by theme. See iteration-NN.md files for full evidence per finding. Numbers in parentheses = finding IDs from iteration sources.

### Code hygiene / dead code (5)
- F-01-002 `allEqual` + `medianOf` dead in detect-inbound-enhances.ts (also in context-template.ts where used)
- F-01-005 utility-function duplication between detect-inbound-enhances.ts and context-template.ts
- F-06-002 unused `EnhanceWhenRule` import in context-template.ts
- F-06-003 unused `TOOL_NAMES` export in skill-graph-tools.ts
- F-06-007 single-letter loop vars `c`, `r` in apply filter

### Type safety + runtime guards (5)
- F-03-002 empty-string `skillsRoot` bypass via `??`
- F-03-003 enhance_when as-cast w/o type check
- F-05-006 `EnhanceWhenRule.weight` typed optional but always required in production
- F-08-003 enhance_when zero runtime type validation (root of F-08-001)
- F-09-002 clipWeight passes NaN through (`NaN == null` is false)

### Test coverage gaps (5)
- F-04-004 `applyCandidateIds` + `applyAllHighConfidence` filter block — 0 automated coverage
- F-04-005 `dryRun` default has no test confirming it blocks writes
- F-04-006 REQ-001 + REQ-002 validated only by manual smoke
- F-08-004 empty-source enhances defensive behavior — no test
- F-05-004 CHK-021 (full test suite no regression) admitted "Partial"

### Substitution + regex edge cases (5)
- F-03-004 unescaped skill-ID injection in substituteProviderName regex
- F-07-002 `\b` boundary fails on hyphenated skill IDs
- F-07-003 plan vs implementation divergence: `.replace(string)` vs `.replace(/g)`
- F-07-004 unbalanced `${target.id` passes through silently
- F-07-006 `$` in replacement values interpreted by JS pattern-substitution

### Scoring math edge cases (4)
- F-01-001 family-inference contribution not clamped at 0.45 with duplicate edges
- F-08-002 same-family circular protection covers family-inference only, not asset-shape / sibling-transitivity
- F-07-005 context-conflict fallback uses `familyEdges[0]` only
- F-05-003 enhance_when single-object form forecloses array-form future (spec open question 2)

### Documentation / provenance (5)
- F-01-003 misleading JSDoc "Pure function — no I/O" on detectInboundEnhances
- F-01-004 test fixture description says "high-confidence" but produces 0.30
- F-06-001 spec calls function `proposeInboundEnhances`; code is `propagateInboundEnhances`
- F-06-008 PropagateEnhancesArgs fields lack JSDoc
- F-09-003 auto_added_reason omits rule detail — numeric-only provenance

### Error reporting / observability (4)
- F-04-003 handleTool args cast with `as unknown`
- F-06-005 applyEnhanceEdge catch block reports errors generically
- F-06-006 "Target not registered" spec edge case not implemented (n/a per design)
- F-09-001 auto_added_reason empty when rules array empty (reachable at minConfidence=0.0)

### Misc data shape (3)
- F-02-001 inferEdgePayload enhance_when template path returns empty blockers with null weight (rolled up in F-10-001)
- F-05-005 same path returns applyable=true with empty-string context (rolled up in F-10-001)

## 6. Cross-Iteration Patterns (3)

1. **Null-weight propagation** (F-10-001) — 3 code paths, single root cause in `clipWeight`. Recommended single-site fix at `detect-inbound-enhances.ts:239`.
2. **Unsafe `as` cast cascade** (F-10-002) — 4 of 10 P1 findings trace to 3 unchecked casts in `metadata-loader.ts` and `skill-graph-tools.ts`.
3. **Silent error swallowing** (F-06-004, F-08-003, F-03-003) — `loadAllSkillMetadata` returns `SkillMetadataRecord[]`, drops parse failures. The `PropagateEnhancesResult.errors[]` field is designed for this — wire it up at the loader boundary.

## 7. REQ Traceability — P0 Verification

| REQ | Code-Level Evidence | Test-Level Evidence | Verdict |
|-----|---------------------|---------------------|---------|
| REQ-001 (HEAD = 0 candidates) | `detect-inbound-enhances.ts:193-246` | Manual smoke only (CHK-022) | **GAP** (test) |
| REQ-002 (synthetic ≥ 0.80) | `detect-inbound-enhances.ts:212-222,235` | Manual smoke only (CHK-023). No vitest fixture hits ≥ 0.80. | **GAP** (test) |
| REQ-003 (idempotent) | `detect-inbound-enhances.ts:209` + `apply-graph-metadata-patch.ts:37` | Fixture C `vitest.ts:169-228` | **PASS** |
| REQ-004 (auto-marker fields) | `apply-graph-metadata-patch.ts:45-46` + production evidence at `system-skill-advisor/graph-metadata.json:104-105` | No automated round-trip read (F-04-002) | **PASS (code)** / **GAP (test)** |
| REQ-005 (enhances-only) | `detect-inbound-enhances.ts:231` + `types.ts:30` | `vitest.ts:230-257` | **PASS** |
| REQ-006 (MCP tool registered) | `skill-graph-tools.ts:66-83,90,140-141` + `handlers/skill-graph/index.ts:8` | No integration test | **LIKELY PASS** / **UNVERIFIED (server)** |
| REQ-007 (schema additive) | `metadata-loader.ts:96-99,128-132` | Implicit (no regression) | **PASS** |

## 8. Recommended Next Steps

**Priority 1 (P1 — close before claiming completion):**
- Fix the 3 cross-iteration patterns (F-10-001, F-10-002, F-06-004 ⇒ closes ~6 underlying findings).
- Add automated vitest fixtures for REQ-002 high-confidence path + REQ-004 auto-marker round-trip (F-04-001, F-04-002).
- Reconcile spec.md drift: asset filename (F-05-001), function name (F-06-001).
- Decide on fixture-directory convention (F-05-002): move to `tests/fixtures/` OR update REQ-013.
- Add path-boundary guard in `applyEnhanceEdge` (F-03-001).

**Priority 2 (P2 backlog):** 36 findings tracked above. Recommend bundling theme groups in single commits.

**Suggested command chain:**
```
/spec_kit:plan remediation       # plan the P1 closure packet
/spec_kit:implement              # execute
/spec_kit:deep-review (re-review) # verify after remediation
```

## 9. Methodology Notes

- **Executor**: `opencode run --pure --model deepseek/deepseek-v4-pro --agent build` per iteration. Sequential dispatch (not parallel) — matches `feedback_cli_dispatch_unreliability`.
- **Per-iter prompt**: 5.4KB with explicit RM-8 mitigation language (no destructive ops, no writes outside iteration file). Zero scope violations across 10 iterations.
- **State**: `deep-review-state.jsonl` event log + 10 `iteration-NN.md` files (2143 lines total). Each iteration produces ~150-330 lines depending on dimension density.
- **Adjudication discipline**: iter 10 re-verified all 8 prior P1 findings against current source (all VALID), detected 2 borderline-ghost findings, identified 3 cross-iteration patterns elevated to P1.
- **Convergence**: technically did not hit `newInfoRatio < 0.10 for 2 consecutive iterations` (iter 09 was 1.00, iter 10 was 0.20), but iter 10's only "new" findings were pattern consolidations, not novel code-path discoveries. Review surface exhausted by operator-cap iteration.
