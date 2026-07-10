---
title: "Implementation Plan: 037 llama-cpp embedding worker deep-dive"
description: "Five-phase plan: reproduce, compare versions, falsify-or-confirm, apply minimal fix, verify + ADR-003."
trigger_phrases:
  - "037 plan"
  - "llama-cpp embedding worker plan"
  - "embedding worker deep-dive plan"
importance_tier: "important"
contextType: "spec"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive"
    last_updated_at: "2026-05-14T14:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored plan from approved plan file"
    next_safe_action: "Phase 1 cli-codex dispatch"
    completion_pct: 5
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->
# Implementation Plan: 037 llama-cpp embedding worker deep-dive

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Node.js (mcp_server) + shared/ |
| **Framework** | spec-kit memory MCP server |
| **Embedding Provider** | `node-llama-cpp@^3.15.1` against `unsloth/embeddinggemma-300m-GGUF` Q8_0 / 768d |
| **Storage** | SQLite `context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` (memory_index + vec_memories) |
| **Testing** | vitest (unit), repro.mjs harness (integration), live memory_save/search round-trip |

### Overview

Reproduce the null-return failure in a controlled standalone harness; compare 3.15.1 vs 3.17.1 to isolate version effects; commit to a written CONFIRMED/FALSIFIED verdict before any code change; apply the minimal source-level fix (`contextSize` raise + tokenizer preflight); ship a vitest + ADR-003; verify end-to-end via live save/search/health round-trip.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready
- [x] Hypothesis stated with file:line references
- [x] Pre-execution questions resolved (diagnostic+fix scope; 3.17.1 inclusion)
- [x] Spec folder scaffolded; description.json + graph-metadata.json present
- [x] Strict validate passes on the spec folder before Phase 1

### Definition of Done
- [ ] All 4 P0 + all 4 P1 requirements met (REQ-001..REQ-008)
- [ ] vitest PASS 3/3 on the new test
- [ ] `npm run build` exit 0
- [ ] ADR-003 shipped
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <037-folder> --strict` exit 0
- [ ] 032/handover.md updated with one-line follow-up note
- [ ] Live round-trip evidence captured in implementation-summary.md
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

Single-file source patch to an existing provider abstraction. No new abstractions. No refactor. The diagnostic harness lives in `_sandbox/` (Gate-3 skip class). The vitest lives in the standard `mcp_server/tests/` directory.

### Key Components

- **`shared/embeddings/providers/llama-cpp.ts`**: the patch target. `LlamaCppProvider` class — `createEmbeddingContext` call site (line 216) + `generateEmbedding` method (lines 318–350). Currently char-gated truncation at lines 331–334; new preflight will run before the call to `runtime.context.getEmbeddingFor()` at line 339.
- **`shared/chunking.ts`**: read-only reference; `MAX_TEXT_LENGTH = 8000` stays untouched (037 doesn't refactor the chunking gate).
- **`mcp_server/lib/providers/retry-manager.ts`**: read-only reference; the circuit breaker that opens when null returns accumulate.
- **`_sandbox/37--llama-cpp-context-size/`**: diagnostic harness scripts + raw evidence + version-comparison.md.

### Data Flow

```
memory_save(content) → handlers/save/embedding-pipeline.ts
  → embeddings.generateDocumentEmbedding(content)
    → llama-cpp.ts:generateEmbedding(content)
      → [NEW] preflight: tokenize, truncate if > contextSize - safety
      → runtime.context.getEmbeddingFor(content) → Float32Array(768) | null
      → [existing] L2 normalize + dimension coerce
  → memory_index.embedding_status = 'success'
  → vec_memories.embedding INSERT
```

The patch inserts a token-aware preflight between the char-based gate and the model call. No other component changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. Implementation Phases

### Phase 0: Scaffold (main agent, ~5 min, COMPLETE)
- [x] `create.sh --phase --phase-parent 014-local-embeddings-migration --phases 1 --phase-names "llama-cpp-embedding-worker-deep-dive" --level 2 --skip-branch`
- [x] Rename auto-numbered 033 → 037; patch parent spec.md phase map
- [x] Author spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md (Level-2 canonical)
- [x] description.json + graph-metadata.json with correct child-level shape

### Phase 1: Reproduction harness against 3.15.1 (cli-codex gpt-5.5 high fast, ~15 min)
- [ ] Author `_sandbox/37--llama-cpp-context-size/repro.mjs`: imports the llama-cpp provider directly, runs a size sweep, captures inputChars + inputTokens + result + elapsedMs.
- [ ] Run; collect `run-3.15.1.jsonl` + `run-3.15.1.summary.tsv`.
- [ ] Validate raw JSONL has at least one null row.

### Phase 2: 3.17.1 comparison (cli-codex gpt-5.5 high fast, ~15 min)
- [ ] Sandbox-install `node-llama-cpp@^3.17.1` at `_sandbox/37--/v3.17.1/`.
- [ ] Re-run harness pointing at sandbox node_modules.
- [ ] Capture `run-3.17.1.jsonl` + `run-3.17.1.summary.tsv`.
- [ ] Author `version-comparison.md` side-by-side table.

### Phase 3: Falsify or confirm (main agent, ~5 min)
- [ ] Read both summary TSVs + version-comparison.md.
- [ ] Determine: CONFIRMED if 3.15.1 returns null at every size whose tokens ≥ 512.
- [ ] Determine: FALSIFIED if null returns are not token-correlated, OR if both versions truncate cleanly.
- [ ] Write verdict to `implementation-summary.md > Hypothesis verdict` BEFORE Phase 4.
- [ ] HALT if FALSIFIED — re-scope as needed.

### Phase 4: Minimal source-level fix (cli-codex gpt-5.5 high fast, ~10 min)
- [ ] Patch `shared/embeddings/providers/llama-cpp.ts:216` — raise contextSize to 2048 (env-overridable `SPECKIT_LLAMA_CPP_CONTEXT_SIZE`).
- [ ] Add token-count preflight in `generateEmbedding()` around line 331: tokenize once, truncate if over budget; `console.warn` on truncation.
- [ ] Author vitest `mcp_server/tests/llama-cpp-context-size.vitest.ts` with 3 cases.
- [ ] Verify `npm run build` exit 0.

### Phase 5: Verify + ADR-003 (main agent + 1 codex doc-write, ~15 min)
- [ ] `npx vitest run tests/llama-cpp-context-size.vitest.ts` — 3 PASS.
- [ ] Live round-trip: 4000-char `memory_save` → id with `embedding_status='success'`; `memory_search` recalls it.
- [ ] `memory_health` post-soak: `circuitBreakerOpen=false`, `embeddingRetry.flapping=false`.
- [ ] Single-scenario replay 401 + 411; capture VERDICT.
- [ ] Author `decision-record.md` (ADR-003).
- [ ] Update `032/handover.md` with one-line completion note.
- [ ] Final `validate.sh --strict` exit 0.
- [ ] Update `_memory.continuity` per ADR-004.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (vitest) | 3 cases on `generateEmbedding` — short body, long body w/ truncation, expanded query with 8 synonyms | `npx vitest run` |
| Integration (harness) | Direct provider call across 11-size sweep with 3.15.1 + 3.17.1 | repro.mjs |
| Live round-trip | 4000-char ephemeral save + search via Memory MCP | session-scoped script |
| Scenario replay | 401 paraphrase recall + 411 causal graph link quality | cli-codex single-scenario |
| Regression | Existing governance + retry vitests still PASS | `npx vitest run mcp_server/tests/governance-ephemeral-decouple.vitest.ts mcp_server/tests/retry-manager*.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `unsloth/embeddinggemma-300m-GGUF` model cached locally | External binary | Green (cached per 022) | HALT Phase 1 — re-download via 015's setup script |
| `node-llama-cpp@^3.15.1` installed in mcp_server/ | npm package | Green (in package.json) | HALT — `npm install` |
| `node-llama-cpp@^3.17.1` sandbox install | npm package | Yellow (depends on codex sandbox network) | Phase 2 partial — document and proceed with 3.15.1-only |
| 032/001 governance-decouple shipped | Internal | Green (commit 65158f847) | HALT — Phase 5 live save needs ephemeral retention |
| 032/003 mcp-server-build-fix shipped | Internal | Green (commit 65158f847) | HALT Phase 4 — needs clean build |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

- **Trigger**: Phase 5 verification fails (vitest red, live round-trip fails, or scenario replay regresses).
- **Procedure**: Revert source patch via `git checkout HEAD -- llama-cpp.ts`; remove the new vitest; update Known Limitations.
- **Safety**: All changes confined to one source file + one new test + sandbox dir.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. Phase Dependencies (Level 2 addendum)

| Phase | Depends on | Blocks |
|-------|-----------|--------|
| Phase 0 (scaffold) | none | Phase 1 |
| Phase 1 (3.15.1 repro) | Phase 0; model cache | Phase 2, Phase 3 |
| Phase 2 (3.17.1 compare) | Phase 1 evidence available | Phase 3 |
| Phase 3 (verdict) | Phase 1 + Phase 2 outputs | Phase 4 (if CONFIRMED) |
| Phase 4 (fix) | Phase 3 verdict = CONFIRMED | Phase 5 |
| Phase 5 (verify + ADR) | Phase 4 build clean | n/a (terminal) |

Phase 1 and Phase 2 could theoretically parallelize but the codex sandbox holds the Metal context — running both at once would race the GPU resource. Sequential.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. Effort Estimation (Level 2 addendum)

| Phase | Wall-clock | Executor | Cost estimate |
|-------|-----------|----------|---------------|
| Phase 0 | 5 min | main agent | $0 (in-session) |
| Phase 1 | 15 min | cli-codex gpt-5.5 high fast | ~$0.15 |
| Phase 2 | 15 min | cli-codex gpt-5.5 high fast | ~$0.15 |
| Phase 3 | 5 min | main agent | $0 |
| Phase 4 | 10 min | cli-codex gpt-5.5 high fast | ~$0.10 |
| Phase 5 | 15 min | main + 1 codex doc-write | ~$0.05 |
| **Total** | **~65 min** | autonomous | **~$0.45** |

Effort is bounded by codex dispatch latency, not by computation. The actual embedding inference per harness row is ~6s × 11 sizes = ~66s per version run.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. Enhanced Rollback (Level 2 addendum)

### Rollback decision matrix

| Scenario | Action | Recovery |
|----------|--------|----------|
| Phase 1 harness can't import provider | HALT; fix import path; do not patch source | Re-dispatch Phase 1 with corrected paths |
| Phase 3 verdict = FALSIFIED | HALT; do NOT proceed to Phase 4 | Open 038 with new hypothesis; archive 037 evidence |
| Phase 4 vitest fails on case 2 (long body w/ truncation) | Revert source patch; investigate truncation logic | Iterate on truncation impl; do NOT skip the test |
| Phase 4 `npm run build` fails | Revert source patch; verify 003's fix still intact | Check 032/003 dist mirrors not regressed |
| Phase 5 live round-trip fails | Revert source patch; capture failure logs | Restart MCP server; check substrate state |
| Phase 5 scenario 401 still FAIL | Document as partial fix; flag 034 as next-priority | 037 ships CONDITIONAL; 034 takes over |

### Rollback procedure

1. `git checkout HEAD -- .opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts`
2. `rm .opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-context-size.vitest.ts`
3. Restart MCP server: `pkill -f spec-kit-memory && sleep 5 && # MCP relaunches on next tool call`
4. Update `implementation-summary.md > Known Limitations` with rollback reason + evidence.
5. Open 038 packet with the new evidence chain.
6. Leave `_sandbox/37--/` intact for forensics.

### Reversibility classification

- **Source patch**: fully reversible (single-file diff).
- **Vitest**: fully reversible (single-file delete).
- **`_sandbox/37--/`**: read-only sandbox; no impact if left in place.
- **ADR-003**: can be marked `superseded` rather than deleted; document trail preserved.
<!-- /ANCHOR:enhanced-rollback -->
