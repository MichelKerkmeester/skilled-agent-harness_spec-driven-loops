---
title: "Feature Specification: Local-LLM feature test suite (post-014)"
description: "Comprehensive vitest suite that validates every documented hf-local + llama-cpp feature claim against actual runtime behavior, plus performance benchmarks for embedding latency, throughput, cold-start, and auto-migration. 10 functional groups + perf subgroup."
trigger_phrases:
  - "local-llm test suite"
  - "028 feature tests"
  - "embedding feature validation"
  - "hf-local llama-cpp tests"
importance_tier: "important"
contextType: "testing"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/014-local-embeddings-setup-a/028-local-llm-feature-test-suite"
    last_updated_at: "2026-05-13T18:55:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffolded testing packet; audit identified 10 feature groups + 4 perf benchmarks"
    next_safe_action: "Dispatch cli-codex to implement vitest files; then run npx vitest"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/profile.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/llama-cpp-availability.ts"
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Local-LLM feature test suite (post-014)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent packet** | `014-local-embeddings-setup-a` |
| **Depends on** | All 014 sub-packets (the test suite validates their cumulative ship state) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 014-local-embeddings-setup-a phase parent + the 021/022 remediation packets shipped a major change to the local-LLM embedding stack: cascade resolution (Voyage → OpenAI → llama-cpp → hf-local), profile-keyed sqlite filenames, auto-migration between hf-local and llama-cpp, model-keyed prefix registry, q8 default quantization, and Apple-Silicon Metal acceleration via llama-cpp. **No single test artifact verifies that every documented behavior is actually delivered by the runtime.** Without a feature-test suite, regressions in any of these subsystems would land silently and only be discovered via production failures or downstream review.

### Purpose
Build a comprehensive vitest-based test suite that asserts every documented local-LLM feature against real runtime behavior, plus a performance benchmark layer that captures baseline latency/throughput/cold-start metrics for regression tracking.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (10 functional groups + 4 perf benchmarks)

**Group 1 — Provider Resolution (cascade + availability probes)**
- VOYAGE_API_KEY set → resolves to `voyage`
- OPENAI_API_KEY set (no Voyage) → resolves to `openai`
- No cloud keys + llama-cpp probe succeeds → resolves to `llama-cpp`
- No cloud keys + llama-cpp probe fails → falls back to `hf-local`
- Explicit `EMBEDDINGS_PROVIDER=hf-local` → skips llama-cpp probe, resolves to `hf-local`
- `profile.ts:resolveActiveProfileProvider` matches `factory.ts:resolveProvider` ordering

**Group 2 — Default model selection & profile slug**
- hf-local default model: `onnx-community/embeddinggemma-300m-ONNX` (verify via factory.ts model dim registry + profile.ts:resolveActiveProfileModel)
- llama-cpp default model: `unsloth/embeddinggemma-300m-GGUF` → normalized slug `unsloth-embeddinggemma-300m-gguf`
- Profile slug format: `provider__safe-model__dim__dtype`
- Voyage/OpenAI profile slugs omit dtype suffix (cloud-no-dtype invariant)

**Group 3 — Embedding generation (shape, dim, dtype)**
- hf-local q8 produces 768-dim float vectors
- llama-cpp q8 produces 768-dim float vectors
- Embedding vectors are normalized (L2 norm ≈ 1.0) when configured
- Empty text input fails fast (no segfault)

**Group 4 — Model-keyed prefix system (hf-local only)**
- `PREFIX_REGISTRY` has entries for EmbeddingGemma, Nomic, E5, BGE-M3, MXBAI, Snowflake
- `getPrefixFor(model, task)` returns the correct doc/query prefix per model
- `HF_EMBEDDINGS_PREFIX_DOC` / `HF_EMBEDDINGS_PREFIX_QUERY` env overrides work
- EmbeddingGemma uses `'title: none | text: '` for docs and `'task: search result | query: '` for queries

**Group 5 — Auto-migration (hf-local ↔ llama-cpp)**
- Create test hf-local DB with sample memories
- Force llama-cpp available, start the daemon
- Verify migration writes `.auto-migration-complete.json` marker
- Verify source hf-local sqlite is removed after migration
- Verify `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` opt-out skips migration

**Group 6 — Health reporting**
- `provider.getProviderMetadata()` returns `{name, model, dimension, dtype, healthy}`
- `provider.healthCheck()` returns truthy when provider is ready
- Memory MCP `memory_health` exposes provider + dtype + dim in response

**Group 7 — Native module compatibility**
- `node-llama-cpp` resolves via `resolveWorkspaceNodeLlamaCppEntrypoint`
- GGUF file presence check via `resolveLlamaCppModelPath` + existsSync
- Transformers.js (hf-local) loads without native rebuild
- `better-sqlite3` and `sqlite-vec` load successfully

**Group 8 — Profile-derived DB filename**
- `resolveActiveProfileDbPath()` returns correct profile-keyed filename
- hf-local active: `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`
- llama-cpp active: `context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite`
- Voyage active: `context-index__voyage__voyage-4__1024.sqlite`
- OpenAI active: `context-index__openai__text-embedding-3-small__1536.sqlite`
- No legacy `context-index.sqlite` (singleton) ever produced

**Group 9 — Cross-platform behavior**
- Apple Silicon (darwin/arm64): llama-cpp is the default-when-installed local provider; Metal device hint emitted
- Linux/Windows: llama-cpp may be unavailable → graceful hf-local fallback
- Tests skip platform-specific paths cleanly when not on target platform

**Group 10 — Offline degradation**
- Embedding cache hit returns vector without invoking provider
- Vector search unavailable → falls back to FTS5 keyword search with warning
- Provider failure retries with exponential backoff per `retry-manager`

**Perf benchmarks (subgroup `performance/`):**
- `embedding-latency.bench.ts` — p50/p95/p99 latency per text length (50, 500, 5000 chars) per provider
- `throughput.bench.ts` — embeddings/sec for batch sizes 1, 10, 100
- `cold-start.bench.ts` — time to first embedding (provider init + first inference)
- `migration-throughput.bench.ts` — rows/sec during hf-local→llama-cpp auto-migration

### Out of Scope
- Voyage/OpenAI cloud provider tests (this suite is local-LLM-only; cloud paths have existing integration tests)
- End-to-end CocoIndex tests (separate suite at `.opencode/skills/mcp-coco-index/tests/`)
- UI/frontend tests
- Spec-folder validation tests (covered by validate.sh)

### Files to Change

| File Path | Change Type |
|-----------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/cascade-resolution.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/default-model-selection.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/embedding-shape.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/prefix-system.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/auto-migration.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/health-reporting.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/native-modules.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/profile-db-filename.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/cross-platform.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/offline-degradation.vitest.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/embedding-latency.bench.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/throughput.bench.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/cold-start.bench.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/performance/migration-throughput.bench.ts` | Create |
| `.opencode/skills/system-spec-kit/mcp_server/tests/local-llm-features/README.md` | Create (suite overview + how-to-run) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 10 functional vitest groups exist and pass on the test machine | `npx vitest run tests/local-llm-features` exit 0 |
| REQ-002 | Each test cites the doc claim it validates | Tests include `// claim: <doc-path:line> "<quoted claim>"` comments |
| REQ-003 | Provider resolution tests cover all 5 cascade branches | All 5 environment scenarios exercised |
| REQ-004 | Profile-DB filename tests assert exact strings | Snapshot or `toBe(...)` matches for all 4 provider filenames |
| REQ-005 | Tests mock `node-llama-cpp` availability cleanly | No real GGUF file required for cascade-resolution + default-model tests |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Perf benchmarks emit JSON baseline | `performance/*.bench.ts` write to `mcp_server/tests/local-llm-features/baselines/*.json` |
| REQ-007 | Auto-migration test creates + cleans up its own sqlite fixtures | No leftover test DBs in working tree |
| REQ-008 | Suite README documents how to run + interpret results | `tests/local-llm-features/README.md` exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run tests/local-llm-features` exits 0 (all functional tests pass)
- **SC-002**: Each documented local-LLM feature is mapped to ≥1 test
- **SC-003**: Perf benchmarks emit JSON results to `baselines/` for future regression tracking
- **SC-004**: Suite-level README explains how to run and interpret
- **SC-005**: Total test suite runtime ≤ 5 min on Apple Silicon (excluding model download)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `node-llama-cpp` may not be installed on test machine | llama-cpp group skipped | Tests detect availability via `getLlamaCppAvailability` and skip cleanly with `it.skipIf` |
| Dependency | `~/.cache/huggingface/transformers/` model download needed for first hf-local test | ~310MB download on first run | Tests use `beforeAll` warmup; CI caches the model dir |
| Risk | Auto-migration test pollutes the actual Memory MCP DB | Production data corruption | Tests use isolated temp dirs (`tmpdir()`); never write to canonical `mcp_server/database/` |
| Risk | Perf measurements are noisy on shared CI runners | False regressions | Use median of N=10 runs; tolerance ±20% for baseline comparison |
| Risk | Test order matters (provider state leaks) | Flaky tests | Each `describe` block creates a fresh `EmbeddingFactory`; no shared module-level state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Functional test suite walltime ≤ 5 min on Apple Silicon
- **NFR-P02**: Perf benchmarks each ≤ 2 min walltime
- **NFR-P03**: Cold-start benchmark records < 60s for hf-local + llama-cpp

### Reliability
- **NFR-R01**: All tests deterministic (no flakiness across 3 consecutive runs)
- **NFR-R02**: Tests fully isolated (run in any order, no cross-test state)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Provider availability
- llama-cpp module installed but GGUF file missing → probe returns `available: false` with reason
- llama-cpp module missing entirely → probe returns `available: false` with reason
- Both cloud keys set → Voyage wins (cascade priority)

### Migration
- Auto-migration mid-run interruption → next start retries cleanly
- Empty hf-local DB → migration is no-op, marker still written

### Cross-platform
- Test running on Linux without Metal → cross-platform.vitest.ts must skip Metal-specific assertions
- ARM64 vs x86_64 detection
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 14 test files, ~2000 LOC total, 10 functional groups + 4 perf benches |
| Risk | 8/25 | Read-only against production code; tests use isolated temp dirs |
| Research | 5/20 | Audit complete; feature claims mapped; no further investigation needed |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the perf benchmarks be gated behind `SPECKIT_RUN_BENCHMARKS=true` env var to keep `vitest run` fast for CI? (Lean: yes; benchmarks are opt-in)
- Should baselines be committed to git or stored ephemerally in `.gitignore`d dir? (Lean: commit a `baselines/README.md` documenting the format; actual JSON in `_runtime/` gitignored)
<!-- /ANCHOR:questions -->
