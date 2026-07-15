# Iteration 002 - Traceability

## Focus
Cross-check REQ-001 budget evidence against the actual corpus fixture and tokenizer behavior.

## Finding GPT1-F002
Severity: P0

Category: traceability

Finding class: invalid-budget-fixture

The current-corpus fixture filler is composed entirely of common stop words [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts:19]. The fixture expands that filler to the claimed 69.2 MB indexed-text target [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts:104]. The tokenizer's stop-word set contains those words [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/lexical-normalizer.ts:11], and packed indexing drops stop words before adding term frequencies [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:177]. The budget test iterates that fixture and asserts RSS/warmup limits [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts:117], [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts:127].

Impact: the memory budget gate measures scanning a large body string, but not storing representative body postings. REQ-001 and the shipped evidence are therefore unsupported.

## Adversarial Self-Check
Hunter: The fixture still has title, trigger, and path terms.

Skeptic: Those terms create postings and make `termCount > 100`, so the test is not empty.

Referee: The acceptance claim is about 69.2 MB indexed text and full current corpus memory. Most of that claimed text is stop-word body content that does not create body postings. P0 stands.

## Delta
New findings: 1 P0, 0 P1, 0 P2.

Review verdict: FAIL
