# Decision Record: Phase 13 — Comprehensive Memory MCP Test Suite

> **Parent Spec:** 092-javascript-to-typescript/

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core + level3plus-govern | v2.0 -->

---

## Decision Inheritance

Phase 13 inherits all architectural decisions from the parent spec:

**From `092-javascript-to-typescript/decision-record.md`:**
- **D1**: CommonJS output (not ESM)
- **D2**: ~~In-place compilation (no `dist/`)~~ **SUPERSEDED by D11-2**
- **D3**: `strict: true` from start
- **D4**: Move files to break circular deps
- **D5**: Keep `I` prefix on existing interfaces
- **D6**: Phase 0 standards first
- **D7**: Central `shared/types.ts`

**From `phase-12-outdir-and-setup-hardening/decision-record.md`:**
- **D11-2**: Per-workspace `dist/` output (supersedes D2)

**From `phase-13-bug-audit/decision-record.md`:**
- **D12-1**: Fix tests to match production API (not vice versa)
- **D12-2**: Stream ordering — infrastructure before logic
- **D12-3**: Keep `require()` in shared/ lazy loads (2 files only)
- **D12-4**: Shell loop test runner (not jest/vitest)

---

## New Decisions for Phase 13

### D13-1: Custom Test Runner (Not Jest/Vitest)

**Context:** The codebase has 41 existing test files that all use a custom test runner pattern with `pass(name, evidence)` / `fail(name, reason)` / `skip(name, reason)` functions, manual test result tracking, and `T###` test ID numbering.

**Decision:** Continue using the custom test runner pattern for all new tests.

**Rationale:**
- Consistency with 41 existing test files
- No additional test framework dependency required
- Pattern is well-established and understood
- Test output is structured and machine-parseable
- Custom runner handles graceful module-load failures via `skip()` — critical for tests that may run before their target modules are compiled

**Alternative rejected:** Migrate to Jest/Vitest.
- **Rejected:** Would require rewriting 41 existing test files. Migration is a separate concern and would add scope to Phase 13.

**Trade-off:** Less ecosystem tooling (no built-in coverage, watch mode, mocking). Coverage analysis requires separate tooling.

---

### D13-2: Bottom-Up Execution Order (Modules → Handlers → Integration → Protocol)

**Context:** The test suite covers 4 layers: core modules, handlers, integration scenarios, and MCP protocol conformance. These layers have dependencies.

**Decision:** Execute in bottom-up order: Stream B (core modules) → Stream A (handlers) → Stream C (integration) → Stream D (protocol).

**Rationale:**
- Core module tests establish mocking patterns used by handler tests
- Handler tests verify individual handlers before integration tests combine them
- Integration tests validate cross-module interactions before protocol tests validate the full stack
- Each stream can discover issues that inform the next stream's test design

**Alternative considered:** Top-down (protocol tests first).
- **Rejected:** Protocol tests require all handlers to be testable; would create too many blocked tasks

---

### D13-3: Isolated SQLite Per Test File (Not Shared Database)

**Context:** Tests that interact with the database need isolation to prevent cross-test contamination.

**Decision:** Each test file creates its own temporary SQLite database in `os.tmpdir()` and cleans it up after tests complete.

**Rationale:**
- Complete isolation between test files
- No shared state that could cause flaky tests
- Temp directory cleanup is automatic (OS-level)
- Matches existing pattern in `memory-save-integration.test.js` and `memory-search-integration.test.js`

**Alternative rejected:** In-memory SQLite (`:memory:`).
- **Rejected:** Some tests need to verify file-based behaviors (WAL mode, concurrent access, crash recovery). In-memory mode doesn't support these.

**Trade-off:** File I/O overhead per test file. Mitigated by using temp directory on SSD.

---

### D13-4: Handler Tests Use Hybrid Module Loading from `dist/`

**Context:** Handler tests need to load compiled handler modules from `dist/` (D11-2). Production `.ts` files use pure ES `import` (Phase 12 Stream D), but test files still use a hybrid pattern because Phase 12 Stream E (test consolidation) was deferred.

**Decision:** New test files use the same hybrid pattern as the 46 existing test files: ES `import` for Node built-ins (path, assert, fs, better-sqlite3) + `require()` for internal modules loaded from `dist/` paths.

**Rationale:**
- Consistent with all 46 existing test files in mcp_server/tests/
- Tests the actual compiled output, not just TypeScript source
- Avoids need for ts-node or tsx runtime
- Tests catch compilation issues (missing exports, broken paths)
- Hybrid pattern is the established convention — changing it would be a separate scope

**Example pattern:**
```typescript
import path from 'path';
import assert from 'assert';
const handler = require(path.join(__dirname, '..', 'dist', 'handlers', 'memory-search.js'));
```

**Alternative rejected:** Pure ES `import` for all test modules.
- **Rejected:** Would diverge from 46 existing test files. Unifying the import pattern is Phase 12 Stream E scope (deferred).

**Alternative rejected:** Use ts-node to test `.ts` files directly.
- **Rejected:** Would introduce new dependency and diverge from existing test convention

---

### D13-5: Mock Embeddings as Fixed Float32Arrays (Not Real API Calls)

**Context:** Handler and integration tests need embeddings for vector search but should not call external APIs (Voyage, OpenAI).

**Decision:** Use fixed `Float32Array` vectors as mock embeddings. For integration tests, use pre-recorded real embeddings as fixtures where semantic relationships matter.

**Rationale:**
- Tests run offline (no API key required)
- Deterministic results (same input → same output)
- Fast execution (no network latency)
- Pre-recorded fixtures preserve semantic relationships for integration tests

**Alternative rejected:** Mock at the HTTP level (nock/msw).
- **Rejected:** Over-engineered for unit tests; still requires API key format validation. Mock at the provider function level instead.

---

### D13-6: Test IDs Start at T500 (Clear of Phase 12's T400-T495)

**Context:** Previous phases used `T###` numbering. Phase 11 ended at T389. Phase 12 (bug audit) uses T400-T495. Original Phase 13 plan used T390-T429, which collided with Phase 12's T400-T429 range.

**Decision:** Phase 13 task IDs renumbered to T500-T539, providing clear separation from Phase 12.

**Rationale:**
- Avoids ID collision with Phase 12 (T400-T495)
- Maintains global uniqueness of task IDs
- Provides headroom for any Phase 12 task additions (T496-T499)
- Clean numbering boundary (T500 = Phase 13 start)

**Update history:** Originally T390-T429. Renumbered 2026-02-07 after discovering Phase 12 collision.

---

### D13-7: Phase 12 Streams A–D as Prerequisite (E–F Deferred)

**Context:** Phase 12 (Bug Audit) had 6 streams. Streams A–D (test infrastructure, logic bugs, module paths, require→import) are complete. Streams E (test consolidation) and F (type hardening) were deferred.

**Decision:** Phase 13 depends on Phase 12 Streams A–D being complete. Streams E–F are not prerequisites.

**Rationale:**
- Stream A (test runner): Phase 13 integrates with `run-tests.js` — must be working
- Stream B (logic bugs): Phase 13 handler tests depend on correct handler behavior
- Stream C (module paths): Phase 13 tests load from `dist/` paths — must be valid
- Stream D (require→import in production): Production modules use ES `import` — Phase 13 tests import from compiled output
- Stream E (test consolidation): Deferred, so Phase 13 tests follow the existing hybrid module loading pattern (not pure ES import)
- Stream F (type hardening): Deferred, `allowJs: true` still set — no impact on Phase 13

**Impact of Stream E deferral:** Phase 13 test files use hybrid `import` + `require()` pattern (matching existing 46 test files), not pure ES `import` as originally planned.

**Post-Phase 12 baseline:** 46 test files in mcp_server/tests/ (20 .js + 26 .ts) + 16 in scripts/tests/ (13 .js + 3 other) = 62 total.

---

## Risk Register (Phase 13 Specific)

| Risk | Likelihood | Impact | Mitigation | Outcome |
|------|-----------|--------|-----------|---------|
| Handler functions too tightly coupled to test in isolation | Medium | High | Create test-specific factory functions for dependency injection | _pending_ |
| Mock embeddings don't reproduce real search behavior | Low | Medium | Use pre-recorded real embedding fixtures for integration tests | _pending_ |
| Test count target (350+) is too ambitious for scope | Medium | Low | P2 tests can be deferred; P0+P1 are the quality bar | _pending_ |
| New test files break existing test runner scripts | Low | Medium | Prefix new files with `handler-`, `integration-`, `mcp-` to avoid collisions | _pending_ |
| Database setup/teardown makes tests slow | Medium | Medium | Use smaller fixture datasets; cleanup with `fs.rmSync` | _pending_ |

---

## Cross-References

- **Parent Decisions:** `092-javascript-to-typescript/decision-record.md` (D1–D7)
- **Phase 11 Decisions:** `phase-12-outdir-and-setup-hardening/decision-record.md` (D11-1–D11-5)
- **Phase 12 Decisions:** `phase-13-bug-audit/decision-record.md` (D12-1–D12-4)
- **Spec:** See `spec.md`
- **Plan:** See `plan.md`
- **Tasks:** See `tasks.md`
- **Checklist:** See `checklist.md`
