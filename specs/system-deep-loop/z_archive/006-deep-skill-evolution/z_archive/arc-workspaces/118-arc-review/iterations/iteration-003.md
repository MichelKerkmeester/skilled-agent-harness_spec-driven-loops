# Iteration 3 — Cross-Cutting Concerns + Test-Surface Depth

**Role**: Expert reviewer of OpenCode peer skills. Audit cross-cutting concerns + test-surface depth + 118 spec packet integrity. P0/P1/P2 with file:line evidence.

**Context**: Iteration 3 of 10. Prior iters covered:
- Iter-1 [correctness+security]: 0/2/2 (path validation, DB lifecycle, TSX loader, lock-file path)
- Iter-2 [traceability+maintainability]: 0/2/3 (system-code-graph stale MCP, playbook cross-refs, 3 missing MODULE headers)

Cumulative: 0 P0 / 4 P1 / 5 P2. No P0s yet — strong sign that the 118 arc shipped clean.

**Focus**: Cross-cutting concerns + test-surface depth. Avoid re-reporting iter-1+2 findings (F-001..F-009).

---

## F-010: Script tests lack exit-code coverage for error paths (P1)

**File**: `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts:62-68`

**Evidence**:
```typescript
it('returns non-zero structured JSON for invalid input', () => {
  const result = runScript('convergence');

  expect(result.exitCode).toBe(3);
  expect(result.json.status).toBe('error');
  expect(result.json.code).toBe('INPUT_VALIDATION');
});
```

**Issue**: The 4 script tests (convergence, query, status, upsert) each test ONE error path (missing args → exit 3). They do NOT test the full exit-code contract documented in 003 ADR-001: `0=ok, 1=script error, 2=DB error, 3=input validation`. Missing coverage:
- Exit 1 (script error): uncaught exception, programming bug
- Exit 2 (DB error): DB_MISSING, DB_LOCKED, SCHEMA_MISMATCH
- Exit 3 variations: BAD_JSON, UNKNOWN_SPEC_FOLDER beyond just MISSING_FLAG

**Impact**: The ADR-001 contract specifies 4 exit codes with machine-checkable semantics, but tests only assert exit 3. Runtime behavior for exits 1 and 2 is unverified.

**Severity**: P1 — contract compliance gap. The exit-code map is normative per ADR-001 §Script Interface Contract.

---

## F-011: DB lifecycle test does not exercise overlapping-writer lock semantics (P1)

**File**: `.opencode/skills/deep-loop-runtime/tests/lifecycle/db-open-close.vitest.ts:21-46`

**Evidence**:
```typescript
it('opens and closes the SQLite DB cleanly across sequential script invocations', () => {
  const namespace = uniqueNamespace('upsert');
  namespaces.push(namespace);

  const upsert = runScript('upsert', [...]);
  const query = runScript('query', [...]);
  const status = runScript('status', namespaceArgs(namespace));
  const convergence = runScript('convergence', namespaceArgs(namespace));

  for (const result of [upsert, query, status, convergence]) {
    expect(result.exitCode).toBe(0);
    expect(result.stderr).not.toContain('SQLITE_BUSY');
    expect(result.stderr).not.toContain('database is locked');
    expect(result.json.status).toBe('ok');
  }
```

**Issue**: This test runs SEQUENTIAL invocations in a single process and checks that `SQLITE_BUSY` does NOT appear. It does NOT actually test the overlapping-writer scenario that the single-owner invariant is meant to prevent. The test name claims "DB lifecycle" but only validates sequential clean close, not concurrent writer rejection.

**Impact**: The single-owner invariant (ADR-001 §Constraint Preserved) claims "OS-level file lock from better-sqlite3 blocks accidental concurrent writers," but no test actually spawns two concurrent writers to verify this. The test is a false negative for lock semantics.

**Severity**: P1 — critical invariant untested. The lock behavior is the core safety property of per-invocation ownership.

---

## F-012: spawn-cjs.ts helper is not independently tested (P2)

**File**: `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts:1-81`

**Evidence**: The helper exports `runScript`, `uniqueNamespace`, `namespaceArgs`, `seedReviewNode`, and `cleanupNamespace`. It is used by 6 integration tests but has NO dedicated test file.

**Issue**: `runScript` (lines 43-58) contains critical logic:
- `spawnSync` invocation with `encoding: 'utf8'`
- JSON parsing of the last stdout line: `const jsonLine = stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}'`
- Error handling is implicit (throws on JSON parse failure)

This logic is NOT tested in isolation. If `spawnSync` returns unexpected stdout format (e.g., multi-line JSON, empty stdout), the helper will fail silently or throw cryptic errors.

**Impact**: The helper is a shared fixture for all script-invocation tests. Bugs here would manifest as flaky or misleading test failures across 6 test files, but the root cause would be hard to diagnose.

**Severity**: P2 — missing unit test for shared fixture. Not a runtime risk (helper is test-only), but test hygiene issue.

---

## F-013: Phase B fixture tests are TODO stubs, not migrated assertions (P2)

**File**: `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts:1-8`

**Evidence**:
```typescript
describe('review-depth convergence v2 fixtures', () => {
  // TODO(116/008): Convert this to a workflow-runner integration fixture that
  // executes step_check_convergence YAML with reducer registry state. The graph
  // runtime alone must keep graph-empty CONTINUE behavior for Phase F.
  it.todo('blocks graphless standard-scope STOP when fallback ledger rows are missing');
});
```

**Issue**: The file is entirely a TODO stub. The other 3 review-depth fixtures (validator, graph, reducer) have mixed TODO vs implemented tests. `review-depth-validator.vitest.ts` has 4 TODOs and 1 implemented test (delta iteration-id mismatch). These were described in 007 implementation-summary as "moved or rewritten per T013 per-file decision," but the actual state is mostly TODO.

**Impact**: The Phase B fixtures were supposed to validate post-dispatch-validate behavior after the lib move. Instead, they are placeholders. The review-depth v2 schema validation is untested.

**Severity**: P2 — test debt. The fixtures exist but don't assert the behavior they were meant to cover.

---

## F-014: 001 tasks.md completion_pct is 5 despite phase being complete (P1)

**File**: `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/001-runtime-skill-scaffold/tasks.md:26`

**Evidence**:
```yaml
completion_pct: 5
```

**Issue**: Phase 001 is marked complete in implementation-summary.md (line 38: "Status: Complete") and verification shows all checks PASS. However, tasks.md still reports `completion_pct: 5`. The tasks themselves are all unchecked `[ ]` despite the work being done.

**Impact**: Spec Kit continuity metadata is inconsistent. The `_memory.continuity.completion_pct` field is used by resume logic and dashboards; stale values misrepresent phase state.

**Severity**: P1 — metadata drift. The completion percentage is a machine-readable signal; incorrect values break automation that relies on it.

---

## F-015: 002 tasks.md completion_pct is 5 despite bundled completion (P1)

**File**: `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/002-lib-runtime-migration/tasks.md:18`

**Evidence**:
```yaml
completion_pct: 5
```

**Issue**: Phase 002 implementation-summary.md states "Status: Complete as part of bundled 002+003+004+005 dispatch" (line 33). Verification shows all 13 files moved and typecheck passes. But tasks.md reports `completion_pct: 5` and all tasks remain `[ ]` unchecked.

**Impact**: Same as F-014 — metadata drift. Phase 002 is complete but the task ledger claims 5% progress.

**Severity**: P1 — metadata drift.

---

## F-016: 003 tasks.md completion_pct is 5 despite bundled completion (P1)

**File**: `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/003-script-shim-and-db-relocation/tasks.md:19`

**Evidence**:
```yaml
completion_pct: 5
```

**Issue**: Phase 003 implementation-summary.md states "Status: Complete as part of bundled 002+003+004+005 dispatch" (line 31). Verification shows 4 scripts created, DB relocated, smoke tests pass. But tasks.md reports `completion_pct: 5` and all tasks remain `[ ]` unchecked.

**Impact**: Same as F-014, F-015 — metadata drift across the bundled phases.

**Severity**: P1 — metadata drift.

---

## F-017: 004 tasks.md completion_pct is 5 despite bundled completion (P1)

**File**: `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/004-mcp-tool-surface-removal/tasks.md:23`

**Evidence**:
```yaml
completion_pct: 5
```

**Issue**: Phase 004 implementation-summary.md states "Status: Complete as part of bundled 002+003+004+005 dispatch" (line 31). Verification shows 5 handlers deleted, 3 schema files edited, typecheck passes. But tasks.md reports `completion_pct: 5` and all tasks remain `[ ]` unchecked.

**Impact**: Same as F-014, F-015, F-016 — metadata drift across all bundled phases.

**Severity**: P1 — metadata drift.

---

## F-018: 007 implementation-summary.md has placeholder verification data (P2)

**File**: `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/007-test-migration/implementation-summary.md:46-49, 133-151`

**Evidence**:
```yaml
**Completed**: _pending_
**Actual Effort**: _pending (estimated: 8-10 hours)_
```

And verification table:
```markdown
| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Unit (moved) | _pending_ | _pending_ | 9 moved files |
| Integration (moved) | _pending_ | _pending_ | coverage-graph files (count from T002) |
...
```

**Issue**: The implementation-summary.md header says "Status: COMPLETE" (line 36) but the metadata and verification sections are still placeholders with `_pending_` values. The narrative says "Codex dispatch wrote all 22 test artifacts... but hung before authoring this Commit Handoff section; main agent finished the summary + commit." This suggests the summary was partially completed but not fully populated.

**Impact**: The summary claims completion but lacks concrete verification data. Future readers cannot determine what actually passed or failed.

**Severity**: P2 — documentation incomplete. The phase is functionally complete (tests exist and run), but the summary is unfinished.

---

## F-019: YAML workflow script invocations match ADR-001 contract (PASS)

**Files**: 
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:429, 1012`
- `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:437, 934`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:412, 863`
- `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml:401, 717`

**Evidence**:
```yaml
bash: 'node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "{spec_folder}" --loop-type "review" --session-id "{session_id}"'
```

All 4 YAML files correctly invoke:
- `convergence.cjs` with `--spec-folder`, `--loop-type`, `--session-id`
- `upsert.cjs` with `--spec-folder`, `--loop-type`, `--session-id`, `--nodes`, `--edges`

The argument shapes match ADR-001 §Script Interface Contract exactly. No mismatches found.

**Result**: PASS — workflow cutover is correct.

---

## F-020: Unit tests exercise real behavior, not just imports (PASS)

**Files sampled**:
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/loop-lock.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/atomic-state.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts`

**Evidence**: All sampled unit tests have specific assertions:
- `executor-config.vitest.ts`: Tests parse errors, rejects unknown kinds, validates model whitelists (lines 35-48, 75-89, 121-132)
- `jsonl-repair.vitest.ts`: Tests corrupt tail repair, SIGKILL partial append, concurrent append boundaries (lines 20-56, 83-106)
- `loop-lock.vitest.ts`: Tests acquire/reject/refresh/release semantics, stale lock reclamation (lines 46-91, 108-128)
- `atomic-state.vitest.ts`: Tests atomic replacement, temp cleanup on rename failure (lines 24-52)
- `post-dispatch-validate.vitest.ts`: Tests iteration file missing, JSONL not appended, missing fields, executor provenance (lines 56-137)

**Result**: PASS — unit tests have substantive assertions. No `expect(X).toBeDefined()` antipatterns found.

---

## Summary

**Iteration 3 Findings**: 0 P0 / 6 P1 / 4 P2

**P1**:
- F-010: Script tests lack exit-code coverage for error paths (exits 1, 2, and exit 3 variations)
- F-011: DB lifecycle test does not exercise overlapping-writer lock semantics
- F-014: 001 tasks.md completion_pct is 5 despite phase being complete
- F-015: 002 tasks.md completion_pct is 5 despite bundled completion
- F-016: 003 tasks.md completion_pct is 5 despite bundled completion
- F-017: 004 tasks.md completion_pct is 5 despite bundled completion

**P2**:
- F-012: spawn-cjs.ts helper is not independently tested
- F-013: Phase B fixture tests are TODO stubs, not migrated assertions
- F-018: 007 implementation-summary.md has placeholder verification data

**PASS**:
- F-019: YAML workflow script invocations match ADR-001 contract
- F-020: Unit tests exercise real behavior, not just imports

**Cumulative (iters 1-3)**: 0 P0 / 10 P1 / 9 P2

**Assessment**: The 118 arc still shows no P0s. The P1 findings cluster around metadata drift (tasks.md completion_pct) and test coverage gaps (exit codes, lock semantics). These are fixable without breaking changes. The bundled dispatch (002-005) left task ledgers in scaffold state, which is a process issue rather than a code defect.

ITER-3 DONE: 0/6/4, dimensions=cross-cutting+test-depth
