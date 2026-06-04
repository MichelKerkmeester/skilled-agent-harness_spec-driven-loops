# Deep Review — Iteration 003

## Dispatcher
- **Dimension**: traceability
- **Budget profile**: verify (12 tool calls)
- **Mode**: review (READ-ONLY of reviewed code; writes limited to this iteration artifact + delta)
- **Run / session**: 2026-06-04T11:55:41.000Z, generation 1, lineageMode new
- **Filename note**: dispatch named `iteration-003.md`; JSONL-derived iteration number is 001 (0 prior `type:"iteration"` records). Honored the dispatch-named path; recorded the mismatch as an ambiguity edge case (see Edge Cases).

## Files Reviewed
- `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts` (full)
- `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts` (full)
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` (full)
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` (memoryCausalStatsSchema region)
- `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts` (CausalStatsArgs region)
- `.opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-similarity.vitest.ts` (full; 11 tests run green)
- Packet docs: `spec.md`, `plan.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
- Inherited 021 docs (cross-reference)

## Findings — New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings

1. **Review-packet/strategy references "ADR-001..004" but only ADR-001..003 exist** — `review/deep-review-strategy.md:17` (and the dispatch brief) — The traceability charter and dispatch both instruct verifying "ADR-001..004 vs implementation". The reviewed code's own decision-record contains only three ADRs. `grep -n "ADR-004" decision-record.md` → no match; `wc -l decision-record.md` → 317 lines ending at ADR-003's Implementation/rollback block. `plan.md:252` and `implementation-summary.md:68` both explicitly enumerate "ADR-001..003". So the shipped code, decision-record, plan, implementation-summary, and checklist (`checklist.md:133` CHK-100 "ADR-001..003") are MUTUALLY CONSISTENT at three ADRs; the "..004" label is an error in the review framing artifacts, not in the reviewed subsystem. Risk: a reviewer (human or agent) hunts for a phantom ADR-004 and either fabricates a gap or wastes a cycle. No impact on shipped behavior.
   - Finding class: documentation/traceability-metadata (review-artifact label drift)
   - Scope proof: confined to the review strategy doc + dispatch brief; reviewed code and all six packet docs agree on exactly three ADRs (decision-record.md ends at ADR-003; plan.md:252; implementation-summary.md:68).
   - Affected surface hints: `review/deep-review-strategy.md:17`; dispatch brief. Reviewed code/decision-record require no change.

2. **Live dry-run yield (scanned 600; 218 caused / 200 contradicts / 3 supports) is undocumented in the packet and contradicts the "pending" claim** — `implementation-summary.md:82` vs the (undocumented) live run — The dispatch reports a LIVE dry-run was executed (scanned 600, inferred 421 = 218 caused / 200 contradicts / 3 supports, written 0). These numbers appear ONLY in `review/deep-review-strategy.md:17`; `grep -rn "218 caused|200 contradicts|3 supports|scanned 600|421"` across the spec folder returns no hit in any authored packet doc. Meanwhile `implementation-summary.md:82` states the production-DB backfill is "Post-deploy (pending)" and the Known Limitations (`implementation-summary.md:90-92`) do not record any executed run or its distribution. Two traceability concerns: (a) an actual dry-run against production WAS performed but never captured in the continuity/summary docs (disclosure gap); (b) the `200 contradicts` magnitude (200 supersession pairs promoted in one bounded run) is large and unexplained — neither spec.md nor plan.md predicts a yield magnitude or a balance expectation, so an operator cannot tell whether 200 is expected or anomalous. Internal math is consistent (218+200+3 = 421 = `inferred`, matching `relation-backfill.ts:468-469` for the dry-run path), and dry-run writes 0 (`relation-backfill.ts:493-500`), so there is NO correctness/data-corruption issue — this is purely a documentation/disclosure traceability gap.
   - Finding class: documentation/traceability (undisclosed execution result + unstated yield expectation)
   - Scope proof: dry-run path provably writes 0 (`relation-backfill.ts:477-500`); the gap is that the executed run's distribution is absent from `implementation-summary.md` / continuity and no doc predicts the contradicts magnitude.
   - Affected surface hints: `implementation-summary.md:82,90-92` (record the executed dry-run + its 218/200/3 distribution and an expected-magnitude note before the user-gated commit run); optionally `spec.md` §8 edge cases.

## Traceability Checks (spec/ADR <-> code)

| Claim | Source | Code Evidence | Verdict |
|-------|--------|---------------|---------|
| ADR-001: read cached `related_memories`, NO live vector_search / sqlite-vec / O(n^2) | `decision-record.md:51,60,73` | `relation-backfill.ts:259-295` reads only `memory_index.related_memories` (`:409-415` SQL selects `related_memories`); `grep vector_search\|sqlite-vec` → only NEGATIVE comments at `:260,:405`; no `vectorIndex` import | MATCH |
| ADR-001: threshold default 75 (1-100), top-K<=5, strength ~0.35, drop bare ids | `decision-record.md:62` | `DEFAULT_SIMILARITY_THRESHOLD=75` `:53`; clamp 1-100 `:353-355`; `SIMILARITY_TOP_K=5` `:56` applied `:278`; `SIMILARITY_SUPPORTS_STRENGTH=0.35` `:44`; bare-id drop `:243-254` (requires numeric `similarity`) | MATCH |
| ADR-002: contradicts from structural supersession, NOT embedding; NOT detectContradictions | `decision-record.md:147-158` | `collectSupersessionEdges` `:304-323` reads `superseded_by_memory_id`; `grep detectContradictions\|embedding\|cosine` in module → only NEGATIVE comments; no detectContradictions call | MATCH |
| ADR-002: direction = predecessor (memory_id) contradicts successor (superseded_by) | `decision-record.md:158,190` | `:314-318` source=`memory_id`, target=`superseded_by_memory_id`, relation CONTRADICTS; test asserts 20->21 `:243-244` | MATCH |
| ADR-003: both collectors opt-in default false; `similarityThreshold` clamped 1-100; reuse single post-commit invalidate | `decision-record.md:251-254` | `similarityEnabled = options.similarity === true` `:350`; `contradictsEnabled` `:351`; clamp `:353-355`; single `invalidateEntityDensityCache()` `:597`; tests (1)/(4) confirm default-off | MATCH |
| spec REQ-001..006 (opt-in / dryRun-zero / bounded similarity / contradicts / idempotent / graceful no-op) | `spec.md:114-124` | Tests (1)-(9) in `relation-backfill-similarity.vitest.ts`; all 11 pass (run this iteration) | MATCH |
| honest-stat `backfillJob.command` names a real callable entry the handler accepts | `relation-coverage.ts:53,114` | `BACKFILL_COMMAND='memory_causal_stats({ backfill: { dryRun: false } })'`; handler `handleMemoryCausalStats` accepts `args.backfill` `:803,825-834`; schema accepts it strict `tool-input-schemas.ts:417-426` | MATCH |
| honest-stat `implemented:true`, `lastBackfillAt` = latest auto-edge ts | `relation-coverage.ts:31-33,114-115` | `implemented:true` `:113`; `readLastBackfillAt` queries `MAX(extracted_at) WHERE created_by='auto'` `:64-77`; `extracted_at` column exists in real schema (`causal-edges.ts:100,114`) | MATCH |
| hint advertises opt-in collectors with exact command | `decision-record.md:280` | `relation-coverage.ts:122` hint includes `{ dryRun:false, similarity:true, contradicts:true }` | MATCH |
| schema strict + similarityThreshold bounded <=100 | `checklist.md:91` CHK-031 | `tool-input-schemas.ts:29-31` strict default; `:426` `positiveIntMax(100)`; test (9) rejects 101/0/'yes' | MATCH |
| dry-run `inferred` = caused + contradicts + supports candidate sum | dispatch yield 421 | `:468-469` inferred = specChainCandidate + lineage + similarity + supersession; 218+200+3=421 internally consistent | MATCH (math) |
| ADR count "ADR-001..004" | strategy.md:17 / dispatch | Only ADR-001..003 exist (decision-record.md; plan.md:252; impl-summary.md:68; checklist.md:133) | **MISMATCH (P2 F1)** |
| Live dry-run yield documented in packet | dispatch / strategy.md:17 | Absent from all packet docs; impl-summary.md:82 says run is "pending" | **GAP (P2 F2)** |

## Integration Evidence
- Handler entry point `handleMemoryCausalStats` (`handlers/causal-graph.ts:800,825-834`) threads all 6 backfill fields (dryRun/limit/actor/similarity/contradicts/similarityThreshold) into `backfillRelationInference`. Verified by direct read, not inference.
- Tool schema `memory_causal_stats` allow-list entry `['backfill']` (`tool-input-schemas.ts:589`) + nested strict object (`:417-426`). Nested fields validated without separate allow-list per `implementation-summary.md:50`.
- Test suite `relation-backfill-similarity.vitest.ts` executed this iteration: 11/11 pass (402ms).

## Edge Cases
1. **Iteration-number ambiguity**: dispatch named `iteration-003.md` / `iter-003.jsonl`, but JSONL has 0 prior `type:"iteration"` records (derived number = 001). Chose the dispatch-named filenames (explicit operator path) and recorded the mismatch rather than silently renumbering. Safest in-scope interpretation; does not affect findings.
2. **Contradictory evidence on ADR count**: dispatch + strategy say "ADR-001..004"; all six packet docs + code say three ADRs. Searched counterevidence once (`grep -rn ADR-004` across the whole spec folder → no hit). Adjudicated: three ADRs is ground truth; "..004" is a label error (F1).
3. **Undisclosed execution**: a live dry-run was performed (per dispatch) but is not recorded in continuity/summary. Did not convert the missing record into a pass — flagged as F2 (disclosure gap), severity bounded to P2 because the dry-run provably writes 0.

## Confirmed-Clean Surfaces (traceability dimension)
- ADR-001, ADR-002, ADR-003 decisions are each faithfully implemented in the shipped code (see Traceability Checks — all MATCH).
- spec.md REQ-001..006 are each backed by a passing named test.
- checklist.md checked items (CHK-010/020/021/031/100/121) are substantiated by tsc-clean + green tests + strict schema + the three real ADRs.
- The honest-stat claim in `relation-coverage.ts` (`implemented`, `command`, `lastBackfillAt`) matches what the handler accepts and does.

## Ruled Out
- **"ADR says cached column but code calls vector_search"** — ruled out: `grep vector_search\|sqlite-vec\|vectorIndex` in `relation-backfill.ts` returns only negative comments; no live-vec import/call. ADR-001 honored.
- **"contradicts derived from embedding/detectContradictions"** — ruled out: no `detectContradictions` call; supersession-only path. ADR-002 honored.
- **`lastBackfillAt` reads a non-existent column** — ruled out: `extracted_at` exists in the real causal_edges schema (`causal-edges.ts:100,114`).
- **dry-run yield math inconsistency** — ruled out: 218+200+3 = 421 matches the `inferred` formula; dry-run writes 0. No correctness defect.
- **`backfillJob.command` names a non-callable/false entry** — ruled out: command string matches the handler-accepted + strict-schema-validated shape.

## Next Focus
- **Dimension**: maintainability (or correctness edge: supersession/lineage both scan `memory_lineage` — confirm no double-count or window-cap interaction on commit).
- **Focus area**: long-term clarity of the dual-source `caused`/byRelation accounting; test coverage of the commit-path `countWrittenByRelation` re-read.
- **Reason**: traceability dimension is substantially covered (all ADR/spec/checklist claims verified MATCH; two P2 doc gaps found). Remaining risk is in commit-path accounting fidelity, not traceability.
- **Rotation status**: traceability complete for this run; correctness/security/maintainability remain.
- **Blocked/productive carry-forward**: PRODUCTIVE — direct-read traceability against ADRs yielded verifiable MATCH/MISMATCH verdicts; reuse this approach for remaining dimensions.
- **Required evidence**: file:line for any commit-path accounting finding; rerun keep-green suite if correctness is selected.

## Dimension Verdict
**PASS** (with advisories). No active P0 or P1 traceability findings. The shipped subsystem's behavior matches its spec and its three real ADRs; checklist evidence is substantiated. Two P2 advisories: (F1) the review-framing "ADR-001..004" label overstates the ADR count (only three exist); (F2) the executed live dry-run yield is undocumented in the packet and its `200 contradicts` magnitude is unexplained vs an "pending"-marked summary. Both are documentation/disclosure gaps with no effect on shipped correctness or data safety.
