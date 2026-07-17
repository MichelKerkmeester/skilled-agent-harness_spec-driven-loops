---
title: "049 Substrate Stress Coverage"
description: "Promote the 045 shared-daemon substrate runner into a canonical Vitest gate and add pure-logic substrate stress coverage."
trigger_phrases:
  - "substrate stress"
  - "049 substrate stress"
  - "vitest substrate gate"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/049-substrate-stress-coverage"
    last_updated_at: "2026-05-14T21:40:00Z"
    last_updated_by: "cli-codex-gpt-5-5-high"
    recent_action: "Substrate stress gate documented"
    next_safe_action: "Operator: review diffs and commit grouping"
    blockers: []
    completion_pct: 100
---
# Feature Specification: 049 Substrate Stress Coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Shipped |
| **Created** | 2026-05-14 |
| **Branch** | main |
| **Parent Spec** | `../spec.md` (`014-local-embeddings-migration`) |
| **Phase** | 049 |
| **Depends On** | `../046-shared-daemon-suite-runner/` |
| **Complexity** | 50/70 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The canonical Vitest stress suite in `mcp_server/stress_test/` is provider-agnostic by design. It mocks `executePipeline` and uses synthetic candidates, so substrate paths such as llama-cpp embedding generation, V-rule save behavior, CocoIndex two-client coordination, query-expansion bounds, and token-budget edges had no canonical stress gate. The only substrate-level evidence lived in `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` from packet 045.

### Purpose
Promote the 045 runner into `mcp_server/stress_test/substrate/` and add pure-logic substrate stress tests so operators can run `npm run stress:substrate` from `mcp_server/` and get one pass/fail signal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`.
- Add `substrate-runner-harness.vitest.ts` for 403/404/407/410 daemon smoke coverage.
- Add `query-expansion-bound-stress.vitest.ts` for combined-query bound pressure.
- Add `token-aware-chunking-edge-stress.vitest.ts` for llama-cpp tokenizer-budget edge pressure.
- Add `v-rule-save-flood-stress.vitest.ts` for V8 cross-spec contamination behavior under 50 canonical-doc validations.
- Add `mcp_server/stress_test/substrate/README.md`.
- Add `npm run stress:substrate`.
- Bump stress timeout to 240 seconds.
- Add a 045 implementation-summary cross-reference.
- Generate `description.json` and `graph-metadata.json` for this packet.

### Out of Scope
- Mutating the sandbox runner at `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs`.
- Adding new corpus extensions.
- Adding new MCP tools.
- Adding top-level dependencies or package lock changes.
- Modifying the 048 deep-review packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/` | Create | Substrate stress harness, Vitest files, and README. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/README.md` | Update | Document substrate suite and entrypoint. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Update | Add `stress:substrate` script. |
| `.opencode/skills/system-spec-kit/mcp_server/vitest.stress.config.ts` | Update | Set stress timeout to 240 seconds. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner/implementation-summary.md` | Update | Add 049 promotion cross-reference. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/049-substrate-stress-coverage/` | Create | Level 2 packet docs and generated metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Substrate stress files exist. | Harness, four Vitest files, and README exist under `mcp_server/stress_test/substrate/`. |
| REQ-002 | Harness smoke can PASS. | `substrate-runner-harness.vitest.ts` invokes the promoted harness and asserts scenarios 403/404/407/410 write PASS rows. |
| REQ-003 | Pure-logic stress tests PASS. | Query expansion, token-budget edge, and V-rule flood tests pass under `vitest.stress.config.ts`. |
| REQ-004 | NPM script is wired. | `package.json` contains `stress:substrate`. |
| REQ-005 | Stress timeout accommodates daemon startup. | `vitest.stress.config.ts` sets `STRESS_TIMEOUT_MS` to `240_000`. |
| REQ-006 | Packet validates strictly. | `validate.sh <049 packet> --strict` exits 0 with 0 errors and 0 warnings. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Runner continuity is documented. | Substrate README states sandbox runner remains operator-facing and copies are manually synchronized. |
| REQ-008 | 045 cross-reference is added. | 045 Key Decisions table names the canonical Vitest gate promotion. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `query-expansion-bound-stress.vitest.ts` passes.
- **SC-002**: `token-aware-chunking-edge-stress.vitest.ts` passes.
- **SC-003**: `v-rule-save-flood-stress.vitest.ts` passes.
- **SC-004**: Promoted harness exits 0 and writes TSV evidence.
- **SC-005**: `npm run stress:substrate` is available as the canonical gate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec Kit Memory daemon | Harness smoke requires a real daemon connection. | Keep pure-logic tests separate so substrate logic still has deterministic coverage. |
| Dependency | CocoIndex daemon | Scenarios 403/404/407 require `cocoindex_code.search`. | Reuse 045 two-client runner and bounded readiness wait. |
| Risk | Harness startup is slow or flaky | Vitest smoke can approach two minutes. | Raise stress timeout to 240 seconds; skip only if daemon races prove flaky. |
| Risk | Runner copies drift | Sandbox and canonical copies can diverge. | Document manual sync in `stress_test/substrate/README.md`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One promoted harness, four stress tests, one README slice, and packet docs. |
| Risk | 14/20 | Live daemon smoke plus locked sandbox evidence handling. |
| Integration | 10/15 | NPM script, Vitest stress config, and 045 cross-reference. |
| Verification | 8/10 | Pure-logic stress, live harness wrapper, and strict packet validation. |
| **Total** | **50/70** | Level 2 verification-focused packet. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Logic-only substrate stress files complete without daemon startup.
- **NFR-P02**: V-rule flood completes 50 validations in under 5 seconds.

### Security
- **NFR-S01**: Tests do not touch the live memory DB.
- **NFR-S02**: Harness env forwarding keeps the existing daemon secret-denylist.

### Reliability
- **NFR-R01**: Harness continues writing TSV evidence to the sandbox evidence path for continuity.
- **NFR-R02**: Substrate README clearly separates daemon smoke from pure-logic stress.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Query expansion stays within budget for expansion-eligible queries with long expansion arrays.
- Existing over-budget base-query behavior remains documented as worker-side token preflight handoff.
- llama-cpp empty input returns `null` without runtime invocation.
- High-entropy CJK and emoji input remains tokenizer-boundary safe after truncation.

### Error Scenarios
- Daemon startup failure causes the harness test to fail with child-process stderr.
- Missing TSV output fails the harness wrapper.
- V8 false positives from numeric prefixes such as `768-dimension` are rejected.

### Concurrent Operations
- The V-rule flood validates 50 canonical-doc attempts sequentially against pure logic and does not open DB handles.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should the sandbox runner and canonical harness be mirrored automatically? **RESOLVED: Not in scope; document manual sync for now.**
- Should the daemon smoke be mandatory in every stress run? **RESOLVED: Yes for `stress:substrate`; pure-logic files can still be run directly.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Prior Runner**: See `../046-shared-daemon-suite-runner/implementation-summary.md`

<!-- /ANCHOR:related-docs -->
