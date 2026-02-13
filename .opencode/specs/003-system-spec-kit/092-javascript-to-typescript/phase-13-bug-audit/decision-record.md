# Decision Record: Phase 12 — Post-Migration Bug Audit

<!-- SPECKIT_LEVEL: 3 -->

---

## D12-1: Fix Tests to Match Production API (not vice versa)

**Status:** Proposed
**Context:** The tier-classifier function signature changed during migration. We can either revert the function to the old API or update tests/callers.
**Decision:** Fix tests and callers to match production code, because the production code is running in live environments and changing it risks regressions.
**Alternatives Rejected:**
- Revert production API to match old tests: Rejected because production code may already have callers using the new signature. Safer to audit callers and align.
**Confidence:** 70% — Needs investigation (T410) to confirm which direction is safer.

---

## D12-2: Stream Ordering — Infrastructure Before Logic

**Status:** Decided
**Context:** Multiple bug categories found. Could fix in any order.
**Decision:** Fix test infrastructure first (Stream A), then paths (C), then logic (B), then types (D/E/F). Rationale: can't verify logic fixes without working test infrastructure.
**Confidence:** 95%

---

## D12-3: Keep require() in shared/ Lazy Loads

**Status:** Decided
**Context:** shared/embeddings/providers/voyage.ts and openai.ts use lazy `require()` for retry module.
**Decision:** Leave these 2 `require()` calls in shared/ — they are lazy-loaded inside try/catch for optional dependency resolution. Converting to `import` would make the dependency mandatory.
**Confidence:** 90%

---

## D12-4: Test Runner — Shell Loop vs Framework

**Status:** Proposed
**Context:** Need to replace the broken `test:mcp` script. Options: (a) shell loop running each test file, (b) node:test runner, (c) jest/vitest.
**Decision:** Use simple shell loop for now. Adding a test framework is a separate scope.
**Alternatives Rejected:**
- jest/vitest: Rejected for this phase — adding a framework is a larger change and all existing tests are standalone scripts.
- node:test: Would require rewriting test files to use `describe/it` API.
**Confidence:** 85%
