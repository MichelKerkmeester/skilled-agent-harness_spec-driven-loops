---
title: "Implementation Plan: 049 Substrate Stress Coverage"
description: "Plan for promoting the 045 substrate runner into a canonical Vitest gate and adding logic-only substrate stress tests."
trigger_phrases:
  - "049 substrate stress plan"
  - "vitest substrate gate plan"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/049-substrate-stress-coverage"
    last_updated_at: "2026-05-14T21:40:00Z"
    last_updated_by: "cli-codex-gpt-5-5-high"
    recent_action: "Substrate stress plan documented"
    next_safe_action: "Operator: review diffs and commit grouping"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: 049 Substrate Stress Coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Node.js |
| **Framework** | Vitest stress suite |
| **Storage** | No live DB writes; V-rule test uses pure validator logic |
| **Testing** | `vitest.stress.config.ts`, promoted Node harness, strict spec validation |

### Overview
Promote the 045 direct MCP runner into `mcp_server/stress_test/substrate/`, add three deterministic pure-logic stress tests, wire a substrate npm script, and document the packet as a Level 2 shipped gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 answered with new Level 2 packet path.
- [x] Scope constrained to listed files.
- [x] L2 templates and 045 reference docs read.
- [x] Source signatures checked before writing tests.

### Definition of Done
- [x] Harness and four Vitest files exist.
- [x] Stress README and npm entrypoint updated.
- [x] Logic stress files pass.
- [x] Harness smoke passes or is explicitly skipped for daemon flakiness.
- [x] Packet validates strictly.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Stress-suite slice under `mcp_server/stress_test/substrate/`.

### Key Components
- **Promoted harness**: Node script copied from 045 and path-adjusted so it can run from `stress_test/substrate/` while writing evidence to the existing sandbox TSV.
- **Vitest wrapper**: Subprocesses the harness and validates TSV PASS rows.
- **Query expansion stress**: Calls `buildBoundedCombinedQuery()` with 100 expansion-heavy inputs.
- **Token-budget stress**: Uses llama-cpp test runtime overrides to exercise tokenizer-boundary behavior without loading a model.
- **V-rule flood stress**: Calls `validateMemoryQualityContent()` 50 times against canonical-doc fixtures without DB access.

### Data Flow
1. Operator runs `npm run stress:substrate`.
2. Vitest discovers substrate tests through the stress config.
3. Pure-logic files run without daemon startup.
4. Harness wrapper starts the promoted Node harness.
5. Harness starts shared Memory and CocoIndex daemons, runs scenarios 403/404/407/410, and writes TSV evidence.
6. Wrapper asserts four PASS rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Promote harness and add logic tests
- [x] Copy 045 runner into `stress_test/substrate/`.
- [x] Adjust path constants for repo root and sandbox evidence output.
- [x] Add harness wrapper test.
- [x] Add query-expansion bound stress.
- [x] Add token-budget edge stress.
- [x] Add V-rule save flood stress.

### Phase 2: Wire script and README updates
- [x] Add `stress:substrate` npm script.
- [x] Bump stress timeout to 240 seconds.
- [x] Add substrate row and entrypoint to `stress_test/README.md`.
- [x] Add substrate README.
- [x] Add 045 cross-reference paragraph.

### Phase 3: Verify and validate
- [x] Run pure-logic substrate tests.
- [x] Run harness wrapper.
- [x] Generate `description.json`.
- [x] Run strict packet validation.
- [x] Record evidence in checklist and implementation summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Logic stress | Query bounds, llama-cpp token-budget edges, V-rule flood | Vitest |
| Daemon smoke | Scenarios 403/404/407/410 through shared Memory and CocoIndex daemons | Vitest child process + Node harness |
| Documentation validation | Packet docs, metadata, checklist evidence | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Vitest stress config | Internal | Green | Substrate tests cannot run as canonical gate. |
| Spec Kit Memory daemon | Internal | Green | Harness smoke cannot validate memory scenarios. |
| CocoIndex daemon | Internal | Green | Harness smoke cannot validate 403/404/407. |
| llama-cpp test runtime override | Internal | Green | Token-budget stress would need a real model. |
| V-rule validator | Internal | Green | V-rule flood cannot execute. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Remove `stress:substrate` from `package.json`.
- Remove the `substrate/` README rows from `stress_test/README.md`.
- Revert `STRESS_TIMEOUT_MS` to `120_000`.
- Remove the 045 cross-reference row.
- Remove the 049 packet if the gate is abandoned before commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Harness + Tests) -> Phase 2 (Wiring + Docs) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Harness + Tests | 045 runner and source API reads | Wiring + Docs |
| Wiring + Docs | Harness + Tests | Verify |
| Verify | Wiring + Docs | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Harness + Tests | Medium | 2-3 hours |
| Wiring + Docs | Low | 45 minutes |
| Verify | Medium | 1-2 hours |
| **Total** | **50/70** | **3.75-5.75 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No new dependencies.
- [x] No branch, commit, push, or PR.
- [x] Sandbox runner left untouched.

### Rollback Procedure
1. Delete `mcp_server/stress_test/substrate/`.
2. Remove `stress:substrate` from `package.json`.
3. Restore stress timeout if the longer timeout is not wanted.
4. Remove README and 045 cross-reference updates.
5. Re-run stress config discovery if needed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: file-only revert by operator.
<!-- /ANCHOR:enhanced-rollback -->
