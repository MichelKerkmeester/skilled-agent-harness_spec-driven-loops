---
title: "Spec: local-LLM feature test suite completion [template:level_1/spec.md]"
description: "Action packet for implementing the 10 functional groups and 4 performance benchmarks promised by predecessor 028-local-llm-feature-test-suite but not delivered."
trigger_phrases:
  - "local-llm feature test suite completion"
  - "028 missing feature groups"
  - "local llm perf benches"
importance_tier: "important"
contextType: "testing"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/029-local-llm-feature-test-suite-completion"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded planned packet from deep-research cleanup dispatch"
    next_safe_action: "Implement missing vitest groups and perf benches"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: local-LLM feature test suite completion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `001-local-embeddings-foundation` |
| **Predecessor** | `001-local-embeddings-foundation/028-local-llm-feature-test-suite/spec.md:66-134,172` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 028 promised a comprehensive local-LLM feature suite, but the cleanup decision keeps 028 as historical/rescoped documentation and moves the missing implementation into this action packet. The promised coverage spans 10 functional groups and 4 deterministic performance benchmarks.

### Purpose

Create the actual tests and benchmarks so the local embedding runtime claims are verified by executable evidence rather than inherited from phase 028 prose.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Implement the 10 functional vitest groups listed in predecessor 028.
- Implement the 4 performance benchmark files under the local-LLM feature test suite.
- Stabilize assertions so provider availability, platform differences, and temporary fixture cleanup are deterministic.
- Document how to run and interpret the suite.

### Out of Scope

- Changing production embedding behavior beyond test seams needed for deterministic verification.
- Cloud provider integration tests for Voyage or OpenAI.
- CocoIndex end-to-end tests.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/cascade-resolution.vitest.ts` | Create | Group 1 provider resolution |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/default-model-selection.vitest.ts` | Create | Group 2 model/profile slug assertions |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/embedding-shape.vitest.ts` | Create | Group 3 embedding shape/dtype behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/prefix-system.vitest.ts` | Create | Group 4 prefix registry behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/auto-migration.vitest.ts` | Create | Group 5 auto-migration behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/health-reporting.vitest.ts` | Create | Group 6 health reporting |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/native-modules.vitest.ts` | Create | Group 7 native compatibility |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts` | Create | Group 8 profile DB filenames |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/cross-platform.vitest.ts` | Create | Group 9 platform behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/offline-degradation.vitest.ts` | Create | Group 10 offline degradation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/embedding-latency.bench.ts` | Create | Latency benchmark |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/throughput.bench.ts` | Create | Throughput benchmark |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/cold-start.bench.ts` | Create | Cold-start benchmark |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/migration-throughput.bench.ts` | Create | Migration benchmark |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/README.md` | Create | Suite runbook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provider Resolution group implemented | `cascade-resolution.vitest.ts` covers Voyage, OpenAI, llama-cpp success, llama-cpp failure, explicit hf-local, and profile/factory ordering parity |
| REQ-002 | Default model selection and profile slug group implemented | `default-model-selection.vitest.ts` asserts hf-local, llama-cpp, Voyage, and OpenAI profile strings from predecessor 028 |
| REQ-003 | Embedding generation group implemented | `embedding-shape.vitest.ts` asserts 768-dim float vectors, normalization, and empty-input failure |
| REQ-004 | Model-keyed prefix system group implemented | `prefix-system.vitest.ts` covers registry entries, task prefixes, env overrides, and EmbeddingGemma strings |
| REQ-005 | Auto-migration group implemented | `auto-migration.vitest.ts` creates isolated fixtures, verifies marker/removal, and covers opt-out |
| REQ-006 | Health reporting group implemented | `health-reporting.vitest.ts` asserts provider metadata, healthCheck, and memory_health provider/dim/dtype fields |
| REQ-007 | Native module compatibility group implemented | `native-modules.vitest.ts` covers node-llama-cpp, GGUF path, Transformers.js, better-sqlite3, and sqlite-vec availability |
| REQ-008 | Profile-derived DB filename group implemented | `profile-db-filename.vitest.ts` asserts exact profile-keyed sqlite filenames and no singleton output |
| REQ-009 | Cross-platform behavior group implemented | `cross-platform.vitest.ts` handles darwin/arm64 Metal and Linux/Windows fallback skips deterministically |
| REQ-010 | Offline degradation group implemented | `offline-degradation.vitest.ts` covers cache hit, FTS5 fallback, and retry-manager behavior |
| REQ-011 | All 4 performance benchmarks implemented | `performance/*.bench.ts` emits deterministic JSON baselines for latency, throughput, cold-start, and migration throughput |
| REQ-012 | Assertions stabilized | Suite passes three consecutive runs without leftover DBs or provider-state leakage |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10 functional test files exist and map back to predecessor 028 claims.
- **SC-002**: 4 performance benchmark files emit JSON baseline artifacts.
- **SC-003**: `npx vitest run tests/local-llm-features` exits 0 on the target machine.
- **SC-004**: Suite README documents command lines, skips, and baseline interpretation.

### Acceptance Scenarios

- **Given** a machine without cloud API keys and with llama-cpp unavailable, **When** the provider-resolution test runs, **Then** the suite deterministically asserts hf-local fallback without requiring a real GGUF file
- **Given** a temporary hf-local fixture database with sample memories, **When** auto-migration is exercised, **Then** the marker, deletion, and opt-out paths are verified in an isolated temp directory
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Local model availability differs by machine | Flaky skips or false failures | Mock availability for logic tests and isolate real-provider smoke tests |
| Risk | Benchmarks are noisy | Unstable perf regressions | Emit baselines and use deterministic fixture sizes rather than pass/fail timing thresholds unless calibrated |
| Dependency | Vitest and local embedding runtime | Suite cannot run without repo test dependencies | Document setup in README and reuse existing mcp_server vitest config |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should perf benches block CI, or remain opt-in local benchmarks? Proposed: opt-in until baselines settle.
<!-- /ANCHOR:questions -->
