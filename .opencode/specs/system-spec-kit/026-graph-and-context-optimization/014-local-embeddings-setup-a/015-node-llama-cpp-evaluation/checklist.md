---
title: "Verification Checklist: 015 node-llama-cpp Memory MCP embedding evaluation"
description: "Verification evidence for provider implementation, parity, benchmarks, default-path safety, documentation, metadata, and scope discipline."
trigger_phrases:
  - "015 llama cpp checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/015-node-llama-cpp-evaluation"
    last_updated_at: "2026-05-13T09:56:14Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded verification checklist with failed parity gate and no default flip"
    next_safe_action: "Review evidence; do not promote llama-cpp without a parity fix"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:3150150150150150150150150150150150150150150150150150150150150150"
      session_id: "015-node-llama-cpp-evaluation-2026-05-13"
      parent_session_id: "015-node-llama-cpp-evaluation-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 015 node-llama-cpp Memory MCP embedding evaluation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER for default flip | Cannot recommend provider default change unless passing |
| **[P1]** | Required for evaluation packet | Must complete or document scope/host blocker |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  - **Evidence**: `spec.md` includes scope, requirements, success criteria, risks, NFRs, edge cases, and related docs anchors.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
  - **Evidence**: `plan.md` includes architecture, phases, testing, dependencies, rollback, and Level 2 sections.
- [x] CHK-003 [P1] Dependencies identified and available.
  - **Evidence**: dynamic `import('node-llama-cpp')` succeeds; Metal dylibs exist nested under `node-llama-cpp/node_modules/@node-llama-cpp/mac-arm64-metal`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `LlamaCppProvider` implements `IEmbeddingProvider`.
  - **Evidence**: `npm run build` exits 0.
- [x] CHK-011 [P0] Provider uses lazy model load and singleton runtime.
  - **Evidence**: `getRuntime()` wraps `loadRuntime(this.modelPath)` and caches by model path.
- [x] CHK-012 [P0] Provider calls `getLlama()`, `loadModel({ embedding: true })`, and `createEmbeddingContext()`.
  - **Evidence**: static implementation in `providers/llama-cpp.ts`.
- [x] CHK-013 [P0] Output vectors are L2-normalized and 768-dimensional.
  - **Evidence**: smoke test passes with Float32Array length 768 and norm near 1.0.
- [x] CHK-014 [P0] Document/query methods reuse prefix registry behavior.
  - **Evidence**: `embedDocument()` and `embedQuery()` call `getPrefixFor(this.prefixModelId, ...)`.
- [x] CHK-015 [P1] Missing dependency error is actionable.
  - **Evidence**: install hint names `npm install node-llama-cpp@3.17.1 --save-optional`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:parity-gate -->
## Parity Gate

- [x] CHK-020 [P0] Parity test runs 50 representative chunks.
  - **Evidence**: `scratch/parity-results.txt` reports `samples=50`.
- [x] CHK-021 [P0] Mean cosine metric recorded.
  - **Evidence**: default Q8_0 GGUF `mean_cosine=0.9677582325103543`.
- [x] CHK-022 [P0] Min cosine metric recorded.
  - **Evidence**: default Q8_0 GGUF `min_cosine=0.9515004519950576`.
- [x] CHK-023 [P0] Parity verdict controls default-flip decision.
  - **Evidence**: parity is below `mean >= 0.995` and `min >= 0.99`; default flip recommendation is `no`.
- [x] CHK-024 [P1] Precision probe documented.
  - **Evidence**: BF16/F32 probes reached about `mean=0.99391`, `min=0.98679`, still below gate.
<!-- /ANCHOR:parity-gate -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] TypeScript build passes.
  - **Evidence**: `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` exits 0.
- [x] CHK-031 [P0] Smoke test passes.
  - **Evidence**: `scratch/smoke-results.txt` reports 2 test files passed with factory test included.
- [x] CHK-032 [P0] Factory test passes and default path remains separate.
  - **Evidence**: factory test creates explicit llama-cpp provider and confirms provider metadata.
- [x] CHK-033 [P1] Parity failure output preserved.
  - **Evidence**: `scratch/parity-results.txt` includes failed assertion at threshold.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-034 [P0] Evaluation is complete even though parity failed.
  - **Evidence**: implementation, smoke/factory tests, parity output, benchmark rows, docs, and metadata are complete.
- [x] CHK-035 [P0] Default flip is blocked by evidence.
  - **Evidence**: parity is below threshold; implementation summary recommends no default flip.
- [x] CHK-036 [P1] Optional dependency did not require package promotion.
  - **Evidence**: `npm list node-llama-cpp --depth=0` reports `node-llama-cpp@3.17.1`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:benchmark -->
## Benchmark

- [x] CHK-040 [P0] Benchmark harness records load mode.
  - **Evidence**: `bench-results.json` has load rows for `hf-local` and `llama-cpp`.
- [x] CHK-041 [P0] Benchmark harness records query mode.
  - **Evidence**: `bench-results.json` has query rows for both providers with 1000 iterations.
- [x] CHK-042 [P1] RAM footprint recorded.
  - **Evidence**: `hf-local` query RSS `1798.313 MB`; llama-cpp query RSS `1209.125 MB`.
- [x] CHK-043 [P1] Peak watts handled honestly.
  - **Evidence**: `peak_watts=null`, `power_note="powermetrics requires sudo"`.
<!-- /ANCHOR:benchmark -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-044 [P1] No secrets or credentials were added.
  - **Evidence**: env docs are commented examples only.
- [x] CHK-045 [P1] No archival files were created.
  - **Evidence**: packet uses live docs and scratch artifacts only; no `.bak`, `_deprecated`, or `z_archive`.
- [x] CHK-046 [P1] No git operations were performed.
  - **Evidence**: no `git add`, `git commit`, or `git push` commands were run.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:default-path-regression -->
## Default Path Regression

- [x] CHK-050 [P0] Default provider is unchanged.
  - **Evidence**: `resolveProvider()` still returns `hf-local` fallback when no API keys are configured.
- [x] CHK-051 [P0] llama-cpp is opt-in only.
  - **Evidence**: factory creates llama-cpp only for explicit provider selection.
- [x] CHK-052 [P1] No forbidden files were edited.
  - **Evidence**: `hf-local.ts`, `embeddings.ts`, `types.ts`, and cocoindex paths were not modified in this dispatch.
<!-- /ANCHOR:default-path-regression -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P0] `.env.example` documents llama-cpp provider without changing default.
  - **Evidence**: experimental section shows `EMBEDDINGS_PROVIDER=llama-cpp` as commented opt-in.
- [x] CHK-061 [P0] Memory MCP README documents provider option.
  - **Evidence**: `mcp_server/README.md` includes "Experimental llama-cpp embeddings".
- [x] CHK-062 [P1] Implementation summary contains real numbers and no placeholders.
  - **Evidence**: summary includes parity, latency, RSS, load time, and watts table values.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P0] `description.json` present with `specId: "015"`.
  - **Evidence**: packet metadata created.
- [x] CHK-071 [P0] `graph-metadata.json` present with `parent_id: "014"` and dependency on `014`.
  - **Evidence**: packet graph metadata created.
- [x] CHK-072 [P1] Parent graph metadata updated.
  - **Evidence**: parent `children_ids` includes the 015 packet and `last_active_child_id` points to it.
- [x] CHK-073 [P0] Strict packet validation exits 0.
  - **Evidence**: final strict validation exits 0.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

The implementation and measurement packet is complete. llama-cpp wins query latency and RSS on this host, but it fails the parity gate by a wide enough margin that the default must remain `hf-local`.
<!-- /ANCHOR:summary -->
