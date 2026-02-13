# Decision Record: Phase 7 — Convert Test Files to TypeScript

> **Parent Spec:** 092-javascript-to-typescript/

---

## D8: Test Conversion Last

**Status:** Decided
**Date:** 2026-02-07

**Context:** Should tests be converted alongside their source modules (Phases 3-6), or in a dedicated phase after all source is converted?

**Decision:** Convert all 59 test files in Phase 7, after all source code is converted (Phases 5-6 complete).

**Rationale:**

1. **No Functionality Risk:** Tests can run as `.js` against compiled `.ts` output. The test execution environment doesn't care about source format — only compiled output matters.

2. **Reduced Migration Complexity:** Converting source and tests simultaneously increases cognitive load. Agents must verify both production code and test code at each step. Separating concerns simplifies each phase.

3. **Maximum Parallelization:** All 59 test files have no inter-file dependencies. Once source is complete, all 5 test batches can be converted in parallel by separate agents.

4. **Type Safety Comes from Source:** Tests import types from source modules. Converting source first means test conversion can immediately use proper type definitions from `shared/types.ts`, `lib/interfaces/`, etc.

5. **Verification Safety Net:** Keeping tests as JS during source conversion means the test suite remains unchanged and trustworthy. If a source conversion introduces a bug, the JS tests will catch it.

**Alternatives Considered:**

1. **Convert tests alongside source (rejected):**
   - Would require converting ~46 MCP tests during Phase 5 and ~13 scripts tests during Phase 6
   - Higher risk: both source and test verification changing simultaneously
   - Less parallelization: tests must wait for their specific source module
   - More context switching between production and test code

2. **Convert tests before source (rejected):**
   - Tests would need to import from `.js` source temporarily, then switch to `.ts`
   - Double work: update imports twice
   - Tests would lack type definitions until source converts

**Trade-offs Accepted:**

- **Temporary lack of type safety in tests:** Test files remain as `.js` through Phases 3-6. This is acceptable because:
  - Tests are verification code, not production code
  - Test logic is simpler and less error-prone than production logic
  - The production code they test IS type-safe

- **Slightly longer timeline to "100% TypeScript":** The codebase isn't fully TypeScript until Phase 7 completes. This is acceptable because:
  - Phases 5-6 deliver the primary value (production code type safety)
  - Phase 7 parallelizes heavily (5 batches simultaneously)
  - Total calendar time is shorter due to parallelization

**Implementation Details:**

- **Mock Typing Strategy:** Tests use mocks extensively. Type them as `as unknown as MockType` to satisfy TypeScript while preserving test flexibility:
  ```typescript
  const mockProvider = {
    embed: async (text: string) => [0.1, 0.2, 0.3],
    getDimension: () => 3,
  } as unknown as IEmbeddingProvider;
  ```

- **Test Data Fixtures:** Type test data structures explicitly:
  ```typescript
  interface TestMemory {
    id: string;
    title: string;
    content: string;
    importance: number;
    tier: string;
  }

  const fixture: TestMemory = { /* ... */ };
  ```

- **No Test Framework Changes:** Continue using `node:test` and `node:assert` (both have TypeScript types via `@types/node`). No dependencies to migrate.

**Success Criteria:**

- All 59 test files converted to `.ts`
- `npm test` passes with 100% success rate
- No `any` in test function signatures (except deliberate mock casts)
- All mock implementations use typed interfaces from `shared/types.ts`
- Test execution time unchanged from JS baseline

**Related Decisions:**

- D1: CommonJS output — tests compile to CJS, work unchanged
- D6: Standards before migration — tests follow TypeScript style guide from Phase 0
- D7: Central types file — tests import from `shared/types.ts`

---

## Cross-References

- **Master Decision Record:** See `../decision-record.md` (full D8 text)
- **Phase Plan:** See `plan.md`
- **Tasks:** See `tasks.md` (tasks T210-T271)
- **Checklist:** See `checklist.md` (CHK-140 through CHK-147)
