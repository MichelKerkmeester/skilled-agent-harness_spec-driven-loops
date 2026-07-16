# Deep Review — Iteration 004

## Dispatcher

- **Dimension**: maintainability
- **Mode**: review (READ-ONLY)
- **Budget profile**: verify (11-13 calls)
- **Target**: relation-inference backfill subsystem (packet 023 opt-in collectors, inherited 021 base)
- **Prior verification (not repeated)**: inline 3-lens (correctness / db-safety-determinism / scope-tests-hygiene) all-approve P2-only; tsc clean; 269+11 tests pass; deployed; live dry-run smoke-tested.

## Files Reviewed

- `mcp_server/lib/causal/relation-backfill.ts` (707 lines — primary)
- `mcp_server/lib/causal/relation-coverage.ts` (138 lines — honest hint)
- `mcp_server/handlers/causal-graph.ts` (handler thread-through, lines 92-111, 800-940)
- `mcp_server/schemas/tool-input-schemas.ts` (lines 414-428)
- `mcp_server/tools/types.ts` (lines 315-326)
- `mcp_server/tests/relation-backfill-similarity.vitest.ts` (395 lines)
- `mcp_server/tests/relation-backfill-unit.vitest.ts` (229 lines)
- `mcp_server/lib/storage/causal-edges.ts` (guards — context)
- ADR-001..003 (`decision-record.md`)
- comment-hygiene gate: `.opencode/hooks/pre-commit` + `sk-code/scripts/check-comment-hygiene.sh` + `ephemeral-pointer-audit.mjs`

## Findings — New

### P0 Findings

None.

### P1 Findings

None. No maintainability defect rises to "real bug / missing safeguard". The two candidates that looked structural (dead import, dead accounting loop) are confined to clarity/dead-code and do not change observable behaviour — classified P2 below after skeptic pass.

### P2 Findings

1. **Unused `createSpecDocumentChain` import (dead import)** — `relation-backfill.ts:21` — `createSpecDocumentChain` is imported from `../storage/causal-edges.js` but never invoked. The execute path deliberately re-emits via `predictSpecChainEdges` + `insertEdgesBatch` (lines 514-524) precisely so it can set `created_by='auto'`, which `createSpecDocumentChain` cannot. The import is pure dead weight that implies a call that does not exist; the remaining references (lines 59, 155, 511, 614-615) are comments only. Recommendation: drop the symbol from the import list; keep the explanatory comments. Confirmed by grep — the only non-comment occurrence is the import binding itself.
   - Finding class: dead-code-cleanup
   - Scope proof: `rg createSpecDocumentChain relation-backfill.ts` → import (21) + comments (59,155,511,614,615) only; zero call sites.
   - Affected surface hints: `relation-backfill.ts` import block; no runtime behaviour change.

2. **Dead no-op accounting loop with misleading comment** — `relation-backfill.ts:526-531` — Inside the spec-chain write block, `for (const edge of edges) { ... bumpRelation(edge.relation, 0); }` adds zero. The adjacent comment claims it attributes "proportionally by emitting per edge only when the batch inserted at least that many," but no proportional logic exists — the loop only ensures map keys exist, and the authoritative per-relation tally is recomputed afterward by `countWrittenByRelation` (lines 584-591, 660-692). The loop and its comment are misleading dead code: a future maintainer may believe spec-chain relations are being counted here when they are not. Recommendation: delete the loop (the `bumpRelation(...,0)` key-seeding is redundant once `countWrittenByRelation` runs) or replace the comment with the truth ("key-seed only; real tally via countWrittenByRelation"). The lineage/similarity/supersession blocks (534-571) correctly do NOT attempt this and rely on the same reconciliation.
   - Finding class: dead-code-cleanup + comment-accuracy
   - Scope proof: lines 526-531 vs. authoritative reconciliation at 584-591 → byRelation is overwritten from DB after commit regardless of this loop.
   - Affected surface hints: `backfillRelationInference` execute transaction, spec-chain branch.

3. **Spec-chain edge strengths use a repeated bare `0.4` literal instead of a named constant** — `relation-backfill.ts:637-642` — Sibling collectors expose `LINEAGE_CAUSED_STRENGTH=0.4` (39), `SIMILARITY_SUPPORTS_STRENGTH=0.35` (44), `SUPERSESSION_CONTRADICTS_STRENGTH=0.3` (48), each with a rationale comment tying it to `MAX_AUTO_STRENGTH`. But `predictSpecChainEdges` hardcodes `0.4` six times with no constant. The value happens to equal `LINEAGE_CAUSED_STRENGTH` yet is not linked, so a future tuning of one will silently diverge from the other. The doc comment (614-615) says this function is "kept in lock-step with createSpecDocumentChain's pairing rules," which is true for pairing but obscures that the *strengths* intentionally differ from `createSpecDocumentChain`'s 0.9/0.8/0.7 — a reader could wrongly assume parity. Recommendation: introduce `SPEC_CHAIN_CAUSED_STRENGTH` / `SPEC_CHAIN_SUPPORTS_STRENGTH` (or reuse `LINEAGE_CAUSED_STRENGTH`) and clarify the lock-step comment to say "pairing only; strengths clamped under MAX_AUTO_STRENGTH, not createSpecDocumentChain's manual strengths." Skeptic note: the actual strengths are all `<0.5` and correct, so this is clarity/drift-risk, not a bug — held at P2.
   - Finding class: magic-number-extraction + comment-accuracy
   - Scope proof: constants at 39/44/48 vs bare `0.4` x6 at 637-642; `createSpecDocumentChain` real strengths 0.9/0.8/0.7 at `causal-edges.ts:874-891`.
   - Affected surface hints: `predictSpecChainEdges`; CONSTANTS section.

4. **Four near-identical insert blocks (collector write duplication)** — `relation-backfill.ts:514-571` — The spec-chain, lineage, similarity, and supersession write branches each repeat the same shape: `.map(edge => ({ sourceId, targetId, relation, strength, evidence, createdBy:'auto' }))` → `insertEdgesBatch(...)` → `total += result.inserted`. Three of the four (lineage/similarity/supersession) are byte-for-byte identical except the source array. A `writeAutoEdges(edges: InferredEdge[]): number` helper would collapse ~30 lines and make "add a 5th collector" a one-line addition rather than a copy-paste of the block. This directly affects the extension-point cleanliness called out in the review brief. Recommendation: extract a single `insertInferredEdges(edges)` helper that maps to the batch shape and returns `result.inserted`; call it once per collector array. Confidence the duplication is real and mechanical: high.
   - Finding class: duplication-extraction (extension-point hardening)
   - Scope proof: blocks at 514-532, 534-545, 547-558, 560-571 share identical `.map → insertEdgesBatch → total +=` structure.
   - Affected surface hints: `backfillRelationInference` execute transaction; future 5th-collector onboarding.

5. **Non-dry-run `byRelation` count accuracy is untested** — `tests/relation-backfill-unit.vitest.ts` + `relation-backfill-similarity.vitest.ts` — Tests assert `byRelation.*` only on dry runs (`toBeGreaterThan(0)`, unit:135-136; similarity:179-180) or assert the *edge rows* directly on non-dry runs (similarity:192-216, 237-249). Nothing asserts the committed-run `byRelation` *numeric values* produced by the `countWrittenByRelation` reconciliation (lines 660-692) or proves the spec-chain `bumpRelation(...,0)` no-op (finding 2) does not corrupt the tally. So the post-commit summary distribution — the field operators read from the hint — is effectively rubber-stamped: a regression that mis-attributed counts (e.g. counting guard-rejected duplicates) would pass green. Recommendation: add one assertion that after a committed run, `result.byRelation.caused` / `.supports` / `.contradicts` equal the actual `SELECT relation, COUNT(*)` from `causal_edges WHERE created_by='auto'`. This also pins finding 2's behaviour. Severity held at P2: the live dry-run (218 caused / 200 contradicts / 3 supports) shows the dry path is exercised; only the committed-tally path is unguarded.
   - Finding class: test-coverage-gap
   - Scope proof: no `expect(...byRelation.caused).toBe(<n>)` on any non-dry run; `countWrittenByRelation` (660-692) has zero direct assertions.
   - Affected surface hints: both vitest suites; `countWrittenByRelation`.

## Traceability Checks

- **Comment hygiene (brief item a)** — PASS. `rg "Spec [0-9]|ADR-[0-9]|REQ-[0-9]|specs/[0-9]|C[0-9]{3}:|NFR-|SC-[0-9]|packet|phase [0-9]"` over the two new lib files (`relation-backfill.ts`, `relation-coverage.ts`) returns ZERO hits (exit 1). The forbidden patterns in `check-comment-hygiene.sh:85-93` (ADR-\d, REQ-\d, `specs/.../\d{3}-`) and `ephemeral-pointer-audit.mjs` do not match. Note: legacy `causal-edges.ts:874-891` carries `'Spec 126:'` in edge *evidence strings* (data, not comments) and `C138:` in a comment (line 30) — both OUTSIDE this packet's scope and pre-existing; not a finding here.
- **Naming/clarity of new collectors + options (brief item b)** — PASS. `collectSimilarityEdges` / `collectSupersessionEdges`, `parseRelatedNeighbors`, `pairKey`, and options `similarity`/`contradicts`/`similarityThreshold` are clear, intention-revealing, and consistent with the `collect*Edges` family. Doc comments accurately describe behaviour (the only comment-accuracy nits are findings 2 and 3).
- **Error-handling consistency (brief item g)** — PASS. Graceful no-op is uniform: every scan is wrapped in `try/catch → []` (lines 377-387, 391-401, 408-418, 428-438); `tableExists`/`columnExists` guard before query; `parseRelatedNeighbors` never throws (returns `[]`); the whole `execute()` is `try { written = execute() } catch { written = 0 }` (576-580). The pattern is consistent across all four collectors. Verified by test 7 (genuinely-absent schema) and 6b (unparseable JSON).
- **ADR alignment** — PASS. Implementation matches ADR-001 (cached-column read, threshold 75, K<=5, strength ~0.35), ADR-002 (supersession→contradicts, no embedding, no detectContradictions), ADR-003 (opt-in default-off, threshold clamped 1-100). No drift between decision-record and code.

## Integration Evidence

- **Handler thread-through** — `handlers/causal-graph.ts:825-834` passes `dryRun/limit/actor/similarity/contradicts/similarityThreshold` into `backfillRelationInference`; wrapped in try/catch with `backfillResult=null` fallback (835-838). Matches the schema (`tool-input-schemas.ts:417-427`, strict `.object`) and `tools/types.ts:315-326`. Naming is consistent end-to-end.
- **Coverage hint** — `relation-coverage.ts:122` advertises the exact opt-in command `memory_causal_stats({ backfill: { dryRun:false, similarity:true, contradicts:true } })`, matching ADR-003's mitigation. Honest `implemented:true`.

## Edge Cases

- **Stale-prose vs implementation**: the only stale-prose risk is the misleading comment at lines 527-529 (finding 2) and the partial "lock-step" comment at 614-615 (finding 3). Implementation evidence governs; both recorded as P2 comment-accuracy.
- **Severity-affecting ambiguity**: findings 1 and 2 looked structural (dead import / dead loop) but a skeptic pass confirmed zero behavioural impact (the import is never called; the loop adds 0 and is overwritten by `countWrittenByRelation`). Downgraded from P1-candidate to P2. `downgradeTrigger`: no observable-behaviour change.

## Confirmed-Clean Surfaces

- Comment hygiene in the two new lib files (zero forbidden artifact ids).
- Collector/option naming and doc-comment accuracy (except findings 2-3).
- Graceful-no-op error handling uniformity across all four collectors.
- ADR-to-code traceability (ADR-001..003).
- Schema/handler/types thread-through naming consistency.

## Ruled Out

- **"Comment hygiene violation in scope files"** — RULED OUT. Zero forbidden patterns in the two new lib files; `Spec 126:`/`C138:` live only in out-of-scope pre-existing `causal-edges.ts` (and as evidence-string data, which the checker does not scan).
- **"Similarity tests rubber-stamp behaviour"** — MOSTLY RULED OUT. The 11 similarity tests prove real behaviour: threshold filtering (test 3/3b assert exact target ids `['2','3']` then `['2']`), top-K clamp (test 3 asserts `length===5` and excludes id 105), self-loop exclusion, dedup against spec-chain (test 8 both directions), opt-in-off default (test 1), dry-run-zero (test 2), idempotence (test 5), and four graceful-no-op variants (6/6b/7). These are genuine assertions, not smoke. The ONLY residual gap is committed-run `byRelation` numeric accuracy (finding 5).
- **"Extension point for a 5th collector is broken"** — PARTIALLY RULED OUT. The collector pattern (pure `collect*Edges(rows) -> InferredEdge[]`) is clean and a 5th collector slots in easily; the only friction is the duplicated write block (finding 4), a P2 ergonomics issue, not a blocker.
- **"Magic numbers 0.35/0.3/75/K=5 are unnamed"** — RULED OUT for the collector constants: they ARE named (`SIMILARITY_SUPPORTS_STRENGTH`, `SUPERSESSION_CONTRADICTS_STRENGTH`, `DEFAULT_SIMILARITY_THRESHOLD`, `SIMILARITY_TOP_K`) with rationale comments. The ONLY unnamed magic number is the spec-chain `0.4` (finding 3).

## Next Focus

- **Dimension**: n/a (maintainability dimension complete for this target)
- **Focus area**: If a further iteration runs, verify the proposed finding-5 test addition does not already exist in a sibling suite, and re-check duplication finding-4 against any shared edge-write helper that may already exist elsewhere in `lib/causal`.
- **Reason**: maintainability dimension produced only P2 advisories; no blocker carry-forward.
- **Rotation status**: maintainability reviewed.
- **Blocked/productive carry-forward**: none blocked. PRODUCTIVE: code-comment-accuracy + dead-code grep was high-yield.
- **Required evidence**: none outstanding for a PASS verdict.

## Dimension Verdict

**PASS (with advisories)** — No P0, no P1. Five P2 maintainability advisories (1 dead import, 1 dead/misleading accounting loop, 1 unnamed spec-chain magic number, 1 collector write duplication, 1 committed-run byRelation test gap). `hasAdvisories=true`. The subsystem is well-factored, ADR-aligned, comment-hygiene-clean, and has genuine (non-rubber-stamp) test coverage; the advisories are clarity/cleanup/coverage-hardening, none gate promotion.
