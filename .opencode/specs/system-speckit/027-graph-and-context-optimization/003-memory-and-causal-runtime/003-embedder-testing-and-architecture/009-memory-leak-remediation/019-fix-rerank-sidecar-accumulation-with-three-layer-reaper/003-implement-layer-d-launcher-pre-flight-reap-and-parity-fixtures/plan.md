---
title: "Implementation Plan: Layer D Launcher Pre-Flight Reap and Parity Fixtures"
description: "Plan for implementing Layer D pre-flight reap in JS and Python launchers with shared fixture parity."
trigger_phrases:
  - "arc 010 005 003 plan"
  - "layer d launcher reap plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "implemented-layer-d-launcher-reap"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0100050030100050030100050030100050030100050030100050030100050030"
      session_id: "010-005-003-layer-d-launcher-reap"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Layer D Launcher Pre-Flight Reap and Parity Fixtures

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the Layer D launcher pass in both runtimes:

1. Read the ledger under the launcher write lock.
2. Classify owner liveness with identity-verified PID checks.
3. Health-probe the sidecar port with a short timeout.
4. SIGTERM and remove rows only when owners are dead and health is unreachable.
5. Register the current launcher as owner on reuse and spawn.

This optimizes for correctness over broad refactor. The existing launcher structure stays intact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command / Check | Required Result |
|------|-----------------|-----------------|
| Python ledger parity | `python3 -m pytest tests/test_sidecar_ledger.py -v` | 22 passed |
| JS parity and lifecycle | `node skills/system-spec-kit/scripts/node_modules/vitest/vitest.mjs run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` | 25 passed, 5 pre-existing skipped |
| JS syntax | `node -c .opencode/bin/lib/ensure-rerank-sidecar.cjs` | exit 0 |
| Python syntax | `PYTHONPYCACHEPREFIX=/private/tmp/codex-pycache python3 -m py_compile .../ensure_rerank_sidecar.py` | exit 0 |
| OpenCode alignment | `verify_alignment_drift.py --root` on changed implementation scopes | PASS |
| Spec validation | `validate.sh <spec-folder> --strict` | exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Component | Responsibility |
|-----------|----------------|
| JS launcher | Owns Node-side ledger parsing, liveness parity, pre-flight reap, and owner registration. |
| Python launcher | Owns Python-side pre-flight mirror while reusing ledger v2 helpers. |
| Shared fixture JSON | Defines the cross-runtime liveness reasons and boolean reap decision ground truth. |
| Ledger v2 | Stores owner identities and reaper policy metadata. |

The launchers do not share a runtime library. They share the fixture contract and liveness reason enum.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | JS launcher twin | Add Layer D reap and owner registration | Vitest + `node -c` |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Python launcher twin | Mirror Layer D reap and owner registration | `py_compile` + pytest ledger suite |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | JS regression tests | Consume shared fixtures and add launcher edge coverage | Vitest |
| `reaper-ledger-cases.json` | Shared source of truth | Read-only dependency | Both test stacks consume it |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 2 packet docs.
- [x] Validate scaffold with `--strict`.
- [x] Read predecessor ADRs, ledger v2 helper, fixture JSON, and launcher twins.

### Phase 2: Implementation
- [x] Implement JS liveness parity, pre-flight reap, v2 writes, telemetry, and owner registration.
- [x] Implement Python pre-flight mirror and owner registration.
- [x] Extend Vitest fixture and launcher behavior coverage.

### Phase 3: Verification
- [x] Run Python ledger fixture suite.
- [x] Run JS Vitest fixture suite.
- [x] Run syntax, alignment, and spec validation gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | JS `processLiveness()` reasons and `shouldReapRow()` predicate | Vitest |
| Fixture parity | All shared `reaper-ledger-cases.json` cases | Vitest + pytest |
| Integration-ish launcher behavior | Legacy v1 row migration, health-unreachable reap, live-owner no-kill | Vitest with temp ledger |
| Regression | Python ledger v2 helper suite | pytest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 010/004/001 ADRs | Predecessor design | Available | Defines Layer D and parity contract. |
| 010/005/001 ledger v2 | Predecessor implementation | Available | Supplies owner identities and Python liveness helpers. |
| 010/005/002 env refinement | Sibling implementation | Available | Supplies telemetry env spelling. |
| Vitest runner | Local test dependency | Available under `skills/system-spec-kit/scripts/node_modules` | Needed for JS test verification. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is a three-file revert plus removal of this packet folder. Existing launcher spawn/reuse behavior resumes because no shared schema helper or sidecar app file was modified.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Predecessor docs and fixture schema | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Read and scaffold |
| Core Implementation | Medium | Two launchers plus fixture tests |
| Verification | Medium | Cross-runtime test and spec gates |
| **Total** | Medium | Single dispatch |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- [x] No data migration required beyond normal ledger v2 rewrite on mutation.
- [x] No feature flag added; Layer D is always-on per ADR.
- [x] Telemetry write failures are non-fatal.
- [x] Rows without owner lists are preserved to avoid debug-mode kills.
<!-- /ANCHOR:enhanced-rollback -->
