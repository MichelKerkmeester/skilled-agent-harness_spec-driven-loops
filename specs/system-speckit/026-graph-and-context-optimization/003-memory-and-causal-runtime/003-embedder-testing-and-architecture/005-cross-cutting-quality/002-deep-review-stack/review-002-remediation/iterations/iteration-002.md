---
title: "Iter 2 — Correctness Completeness (commit ba6816a49 re-review)"
iter_number: 2
dimension: correctness-completeness
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ba6816a490b1a20d4f74135179c10096c5348921
write_mode: main_agent_persisted_from_stdout
write_mode_reason: "loop-manager sub-agent stalled after iter 1; main agent took over and extracted iter 2 content from /tmp/devin-iter-008-002-2.output"
---

# Iter 2 — Correctness Completeness

## 1. SCOPED ANGLE

This iteration assesses the **completeness** of the 3 P0 fixes claimed by commit `ba6816a49`. For each P0, verify: (1) implemented fix matches prior reviewer recommendation, (2) fix not scope-narrowed to single site when sibling sites share the same root-cause class, (3) fix does not introduce new correctness issues. Focus: sibling-site detection + mathematical verification of rescue-score cap logic.

## 2. REFERENCES READ

- `.../008-deep-review-stack/review/review-report.md` §3, lines 59-108 (prior P0 findings)
- `mcp_server/lib/embedders/schema.ts` (full file, lines 1-136)
- `mcp_server/lib/search/rerank/retrieval-rescue.ts` (lines 65, 160-283, 370-399)
- `mcp_server/lib/search/pipeline/stage2-fusion.ts` (lines 300-326, 1365-1394)
- `mcp_server/tests/embedders/deep-review-remediation.vitest.ts` (full)
- `mcp_server/tests/search/deep-review-remediation.vitest.ts` (full)

## 3. FINDINGS

### P0-A Completeness — VERDICT: COMPLETE

- `schema.ts:104` wraps INSERT-OR-IGNORE (105-115) + UPDATE (117-132) in `db.transaction(() => {...})`; atomicity honored
- `schema.ts:111-114` binds `trimmedName` + `String(dim)` (no longer DEFAULT literals); core bug fixed
- Sibling-site scan: no other multi-statement writes in schema.ts share the root-cause class
- Test gap (minor, not correctness): no crash-between-INSERT-and-UPDATE test scenario

### P0-B Completeness — VERDICT: COMPLETE

- `retrieval-rescue.ts:189` uses `docType === 'decision_record'` (underscore) — matches DOCUMENT_HINTS:46 + document_type enum:56
- Lines 180-184 dual-branch normalization: raw lowercase `docType` + normalized `searchableDocType`; hint loop checks both
- Sibling-site scan: grep across `lib/search/**` for `=== 'decision record'` literal-compares — only the fixed site
- Test coverage: `deep-review-remediation.vitest.ts:10-25` asserts boost end-to-end

### P0-C Completeness — VERDICT: PARTIAL → NEW P0-D

- `retrieval-rescue.ts:65` sets `RESCUE_SCORE_CAP = 1.0` (raised from 0.82)
- **BUT** the `wouldHaveBeenCapped` telemetry counter at `retrieval-rescue.ts:200` is **structurally dead code** under the new cap
- Math: formula `Math.min(baseScore, 1) * 0.03 + rescueScore * 0.78` has ceiling `0.03 + 0.78 = 0.81` when both inputs are 1.0
- With `RESCUE_SCORE_CAP = 1.0`, condition `uncapped > 1.0` is impossible (rescueScore is bounded to [0,1] at line 221, sourced from lexicalScore at 356/377)
- Test at `deep-review-remediation.vitest.ts:30` passes synthetic `rescueScore = 1.4` to verify cap logic — but this never occurs in production
- Outer normalization at `stage2-fusion.ts:304` and `:319` already clamps to [0,1] — the inner cap at 1.0 is redundant
- Telemetry counter provides no operational value

**Root cause**: cap raised to 1.0 without recognizing the formula's mathematical ceiling (0.81) is already below the new cap → telemetry counter is dead.

### NEW P0 — P0-D: Dead telemetry counter in rescue-layer cap logic

**File:** `mcp_server/lib/search/rerank/retrieval-rescue.ts:195-202`
**Severity:** P0 (correctness/observability)
**Evidence:** `wouldHaveBeenCapped` counter at line 200 is structurally dead — formula ceiling 0.81 < cap 1.0; condition `uncapped > 1.0` impossible given rescueScore ∈ [0,1] (bounded by lexicalScore at 221). Counter will never increment in production.
**Recommendation:**
  - Option (a) [PREFERRED]: remove dead telemetry counter + the `wouldHaveBeenCapped` field; outer clamp in stage2-fusion provides defense-in-depth
  - Option (b): if intent was to track formula-ceiling hits not cap hits, change condition to `uncapped > 0.81` and document formula's mathematical ceiling

### NEW P1 / P2

None.

## 4. POSITIVE OBSERVATIONS

- Transaction wrap in `schema.ts:104` correctly provides atomicity, eliminating crash-between-statements corruption risk
- Test at `deep-review-remediation.vitest.ts:10-25` is well-structured; verifies actual scoring behavior, not just string comparison
- Outer clamp in `stage2-fusion.ts:304/:319` provides defense-in-depth — downstream consumers never see scores > 1.0

## 5. JSONL DELTA ROW (already appended to deep-review-state.jsonl)

```json
{"ts":"2026-05-17T22:30:00Z","event":"iter_complete","iter":2,"dimension":"correctness-completeness","p0_count":1,"p1_count":0,"p2_count":0,"refs_read_count":6,"p0a_verdict":"COMPLETE","p0b_verdict":"COMPLETE","p0c_verdict":"PARTIAL","new_p0_titles":["P0-D — Dead telemetry counter in rescue-layer cap logic"],"new_p1_titles":[],"verdict_so_far":"CONDITIONAL"}
```
