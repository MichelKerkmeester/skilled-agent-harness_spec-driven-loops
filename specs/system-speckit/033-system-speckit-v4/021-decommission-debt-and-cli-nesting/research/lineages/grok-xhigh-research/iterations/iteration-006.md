# Iteration 6: Tests of retired surfaces

## Focus
Angle 4. Tests that pass because they exercise a surface that no longer exists, or that were weakened rather than fixed.

## Findings

### F-I6-001 — Integration tests still require deleted cognitive dist modules. CONFIRMED. P1
`test-integration.vitest.ts` still asserts `runtime/dist/lib/cognitive/working-memory.js` and `attention-decay.js` export contracts. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:169-171]
The TypeScript sources are gone (F-I2-003). A clean dist should fail this test; a dirty dist can keep it green.
`manual-playbook-fixture.ts` dynamically imports the same two dist files plus `hybrid-search.js`. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:357-362]
Smallest fix: delete those cases, or rewrite them as absence assertions.

### F-I6-002 — retry-manager behavioral tests still build `memory_index` / `vec_memories` and require deleted dist. CONFIRMED. P1
`test-retry-manager-behavioral.js` creates an in-memory `memory_index` and a stand-in `vec_memories`, then `require`s `runtime/dist/lib/providers/retry-manager` and `lib/search/vector-index`. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:16-18] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:70-99] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:212]
`runtime/lib/providers/retry-manager.ts` and `runtime/lib/search/vector-index-impl.ts` are gone. There is no skip if the require fails.
T-107f still asserts embeddings land in `vec_memories`. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:892-896]
This is a test of the retired zvec/memory indexer. It passes only if leftover dist is present.
Smallest fix: remove the file from `test:legacy`, or convert it to "module absent".

### F-I6-003 — Naming-migration budgets still list deleted memory handlers and pass at 0/N. CONFIRMED. P1
`CROSS_REFERENCE_MISMATCH_BUDGET` still names `runtime/handlers/memory-context.ts`, `memory-crud-update.ts`, `memory-index.ts`, `memory-search.ts`, `runtime/hooks/memory-surface.ts`, `runtime/lib/cognitive/*`, `runtime/lib/search/hybrid-search.ts`, `runtime/context-server.ts` and more. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-naming-migration.js:40-72]
`LEGACY_SNAKE_CASE_FUNCTION_BUDGET` still names the whole `vector-index-*.ts` family. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-naming-migration.js:29-38]
The pass condition is "no unexpected files and no over-budget files". Missing budgeted files report `0/budget` and still pass. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-naming-migration.js:394-399]
The guardrail never fails when debt files disappear. Decommission made the suite weaker.
Smallest fix: delete every budget row whose file is gone. Fail if a budgeted path is missing.

### F-I6-004 — Folder-detector functional tests still certify a real `session_learning` schema. CONFIRMED. P2
`T-FD06a` opens the real DB and fails if `session_learning` is missing, or skips if the file does not exist. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:790-811]
On a leftover `context-index.sqlite` this test keeps the retired table as a required schema. On a clean machine it skips. Neither path proves the successor.
Smallest fix: drop T-FD06a and the Priority 2.5 tests that insert into `session_learning`.

### F-I6-005 — Parity-check tests still create `memory_index` as the legacy oracle. CONFIRMED. P2
`parity-check.vitest.ts` creates `memory_index` for the legacy arm. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/parity-check.vitest.ts:81]
Together with F-I5-006, the successor harness is tested against a table the product no longer writes.
Smallest fix: keep index-vs-rg tests; drop the sqlite fixture arm.

### F-I6-006 — `test-memory-quality-lane.js` still uses a retired packet slug as its golden spec_folder. CONFIRMED. P2
The fixture content hard-codes `spec_folder: "system-spec-kit/020-mcp-working-memory-hybrid-rag"`. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-memory-quality-lane.js:22]
If `validateMemoryQualityContent` still exists, this is a validator for a quality lane on a gone surface. If the validator was deleted, this file is dead.
INFERRED: not opened the validator in this pass.
Smallest fix: open the validator; delete the test if the lane is gone.

## Sources Consulted
- .opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:169-171
- .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:357-362
- .opencode/skills/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:16-18,70-99,212,892-896
- .opencode/skills/system-spec-kit/scripts/tests/test-naming-migration.js:29-72,394-399
- .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:790-811
- .opencode/skills/system-spec-kit/scripts/tests/parity-check.vitest.ts:81
- .opencode/skills/system-spec-kit/scripts/tests/test-memory-quality-lane.js:22
- runtime/lib/providers/retry-manager.ts (absent)
- runtime/lib/search/vector-index-impl.ts (absent)

## Assessment
- newInfoRatio: 0.75
- Novelty justification: naming-migration 0/N pass, retry-manager dist require, folder-detector real-DB schema, parity fixture, memory-quality slug. Integration case restates I2-003 with more callers.
- Confidence: high on 001-005.

## Reflection
- Worked: search tests for memory_index / hybrid-search / working-memory, then read the pass condition.
- Failed: confirming whether test-memory-quality-lane is still invoked.
- Ruled out: treating the residue-sweep unit tests as themselves a live memory surface. They test `sweep-memory-residue.mjs`.

## Dead Ends
- retry-manager.ts and vector-index-impl.ts source reads (absent, as expected).

## Recommended Next Focus
Angle 5. Documentation that still claims memory-database, mcp-server-as-spec-kit, zvec, or Session Continuity behavior, starting with `.opencode/skills/system-spec-kit/**` READMEs and then install-guides / root README / AGENTS.
