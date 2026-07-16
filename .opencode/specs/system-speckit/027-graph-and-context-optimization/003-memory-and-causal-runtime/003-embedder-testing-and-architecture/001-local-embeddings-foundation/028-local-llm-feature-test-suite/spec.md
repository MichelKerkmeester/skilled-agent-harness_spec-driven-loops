---
title: "Feature Specification: Local-LLM feature test suite (post-014)"
description: "Partial local-LLM feature test suite shipped after post-014 review. The original 10 functional groups + 4 perf benches are not complete; remaining work is tracked in 029-local-llm-feature-test-suite-completion."
trigger_phrases:
  - "local-llm test suite"
  - "028 feature tests"
  - "embedding feature validation"
  - "hf-local llama-cpp tests"
importance_tier: "important"
contextType: "testing"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/028-local-llm-feature-test-suite"
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
Document the partial local-LLM feature suite that shipped, keep its evidence usable, and move the unshipped functional/performance coverage to a follow-on completion packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Shipped Scope
- Partial Vitest coverage for the local embedding substrate landed during the post-014 remediation stream.
- The shipped suite focuses on targeted regression protection for provider resolution, runtime error propagation, token-aware chunking, and selected substrate repair cases.
- Full 10-group functional coverage and the four performance benchmarks from the original scaffold did not ship in this packet.

### Remaining Work
A new packet, `029-local-llm-feature-test-suite-completion/`, will own the remaining functional groups, performance benches, README/runbook polish, and evidence reconciliation. This packet remains in-progress as the historical source of the partial suite.

### Out of Scope
- Completing the full suite in this cleanup dispatch.
- Changing runtime source code.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Status |
|----|-------------|--------|
| REQ-001 | Preserve evidence for the partial local-LLM suite that shipped. | Shipped partial |
| REQ-002 | Stop claiming the full 10 functional groups + 4 perf benches are complete. | This cleanup |
| REQ-003 | Track remaining coverage in `029-local-llm-feature-test-suite-completion/`. | Dispatch B scaffold |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Partial shipped tests remain documented as partial, not comprehensive.
- Remaining work points at `029-local-llm-feature-test-suite-completion/`.
- No source-code changes are made by this doc cleanup.
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
