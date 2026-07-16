# Deep Review Report

## Executive Summary
Verdict: FAIL. Release readiness is `release-blocking` because two active P0 findings invalidate the shipped packed BM25 fallback claim.

Scope reviewed: packed BM25 implementation, fixtures, targeted tests, and packet documentation for `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights`.

Severity totals: P0 = 2, P1 = 0, P2 = 1. `hasAdvisories=true` due to GPT1-F003.

Stop reason: `maxIterationsReached` after six iterations. Convergence was not legal because active P0 findings remain unresolved.

## Planning Trigger
Plan remediation before shipping or relying on the packed fallback. The first fix should make production async warmup finalize packed postings after the last non-empty batch. The second should replace or augment the current-corpus budget fixture with body text that survives tokenization and produces representative postings memory.

## Active Finding Registry
| ID | Severity | Category | Finding | Evidence |
|----|----------|----------|---------|----------|
| GPT1-F001 | P0 | correctness | `rebuildFromDatabase()` only calls `finalizePackedPostings()` when a later batch starts with `batchIds.length === 0`; when the last real batch drains `pendingIds`, it sets `warmupHandle = null` and returns without finalizing. Production warmup therefore leaves mutable postings and dirty terms resident after completion, contradicting the memory-bounded packed-engine requirement. | [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:604], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:613], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:616], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:510] |
| GPT1-F002 | P0 | traceability | The current-corpus memory fixture uses filler composed entirely of stop words. The packed tokenizer drops stop words before adding postings, so the claimed 69.2 MB current-corpus budget gate measures scanning text without representative body postings. This invalidates REQ-001's RAM evidence. | [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts:19], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts:104], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/lexical-normalizer.ts:11], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:177], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts:117] |
| GPT1-F003 | P2 | metadata-drift | `graph-metadata.json` lists out-of-scope drift files as packet key files, even though the implementation summary says those failures are out-of-scope pre-existing alignment drift. This can mislead future resume and graph traversal. | [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/graph-metadata.json:47], [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/implementation-summary.md:107] |

## Remediation Workstreams
| Workstream | Findings | Required Action |
|------------|----------|-----------------|
| Packed warmup finalization | GPT1-F001 | Ensure the async warmup finalizes postings when the last non-empty batch drains the queue, then add a regression test that uses `rebuildFromDatabase()` rather than direct `addDocumentFields()` plus manual finalization. |
| Representative budget fixture | GPT1-F002 | Use non-stop-word body content with realistic unique and repeated lexical terms, then rerun current-corpus RSS and warmup evidence. |
| Metadata hygiene | GPT1-F003 | Remove out-of-scope drift files from this packet's derived key file set or explicitly mark them as external blockers instead of implementation surfaces. |

## Spec Seed
Add acceptance text requiring production `rebuildFromDatabase()` warmup to clear mutable packed postings at completion. Add a verification clause that budget fixtures must contain tokenizable body terms and must assert body postings are present.

## Plan Seed
1. Patch `rebuildFromDatabase()` final-batch handling.
2. Add a test that schedules or drains a database-backed packed warmup and verifies finalization behavior.
3. Replace stop-word-only budget filler with representative lexical text.
4. Re-measure RSS and warmup budgets against the corrected fixture.
5. Re-run `npx vitest run tests/bm25-packed-inmemory.vitest.ts` and strict spec validation.

## Traceability Status
| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | FAIL | REQ-001 is not met with current production warmup and fixture evidence. |
| checklist_evidence | FAIL | Level 1 has no checklist, but tasks and implementation evidence claim the invalidated budget gate. |
| feature_catalog_code | PASS | Engine selection and exports exist. |
| playbook_capability | PASS | Existing tests prove field weighting and engine flags, but miss the P0 paths. |
| AC_COVERAGE | N/A | Level 1 packet without checklist.md. |

## Deferred Items
P2 GPT1-F003 can be handled after the two P0s. The documented 3x RSS overage remains a separate scale-risk packet unless 3x scale is promoted into this phase's acceptance criteria.

## Audit Appendix
Iterations run: 6. Dimensions covered: correctness, traceability, security, maintainability. Stabilization passes replayed both active P0 findings and found no contradiction.

Code graph status was stale, so graph outputs were not used as authoritative evidence. Direct file reads supplied all cited findings.

Adversarial replay: GPT1-F001 survived because the only finalization call is before syncing an empty batch, while the last non-empty batch path does not call it. GPT1-F002 survived because the fixture filler tokens match the exported stop-word set and `visitBm25Tokens()` drops them before postings are created.

Final verdict: FAIL
