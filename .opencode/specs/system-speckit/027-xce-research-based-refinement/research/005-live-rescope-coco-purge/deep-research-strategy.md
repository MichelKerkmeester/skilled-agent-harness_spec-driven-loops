---
title: Deep Research Strategy — Continuation 22 (027 vs closed-026 + CocoIndex deprecation)
description: Resume lineage (iters 061-080) revalidating 027's 8 phases against the closed 026 program, live system-spec-kit reality, and the CocoIndex deprecation.
---

# Deep Research Strategy — Session Tracking

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh / timeout 1200 / read-only / concurrency 1
**Packet:** root `research/` (continuation appended as iterations 061-080; lineage resume from run 60)
**Session:** `2026-06-05-027-continuation-22-coco-026-drift`

---

## 2. TOPIC
Revalidate/refine 027's 8 planned phases against the now-CLOSED 026 program, current live system-spec-kit reality, and the CocoIndex DEPRECATION (purge all coco scope). XCE corpus treated as near-exhausted signal, not requirements. Per-phase verdict in {UPDATE, REFINE, DRIFT-FIX, REMOVE, ADD}.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] 061 coco-purge: 008 reducer family enumeration (REMOVE 002-coco; classify family refs)
- [ ] 062 coco-purge: 002/003/004/006 specs enumeration + disappearing-scope flags
- [ ] 063 026-dedup: 005 metadata-promoter vs shipped relation-backfill.ts
- [ ] 064 026-dedup: 002 created_by-clobber P0 vs shipped causal conflict guard
- [ ] 065 026-dedup: 008.1 aggregator vs shipped batch-learning.ts; STATE_LIMITS export
- [ ] 066 path-drift: packet-wide affected-file path refresh with live citations
- [ ] 067 007 rescope: Voyage-4/1024d dead -> live Nomic 768d profile-scoped cache
- [ ] 068 003 incremental-index vs self-maintaining memory_index_scan
- [ ] 069 004 tombstones: full live delete-site inventory + lifecycle_generation collision
- [ ] 070 006 write-path/statediff rescope to async post-insert-enrichment model
- [ ] 071 001 peck: 003 warn->INFO; 028-fold reality; keep 002/004 as-is
- [ ] 072 additions: which shipped 026 mechanisms 027 should BUILD ON not re-implement
- [ ] 073 drift: 027 spec.md calls 026 'In Progress' (it's Complete); stale cross-ref sweep
- [ ] 074 008 re-shape after removing 002-coco: coherent coco-free reducer set
- [ ] 075 vocab/constants: RELATION_TYPES vs DEFAULT_RELATION_TARGETS; STATE_LIMITS export
- [ ] 076 XCE residual: confirm external/xce-mcp exhausted for 027 memory scope
- [ ] 077 phase ordering/handoff re-validation after coco removal + 026 dedup
- [ ] 078 028 status: coco home + parked code-graph items; 027 soft-dep breakage
- [ ] 079 sequencing/risk: recommended re-plan order; clean-ship vs rescope
- [ ] 080 final synthesis: verdict matrix + coco purge manifest + dedup + path-drift tables

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No source/spec implementation during research (report only; spec edits are a separate Gate-3 pass).
- No XCE SaaS adoption; no PRAT reverse-engineering as a requirement (signal only).
- No re-opening the settled code-graph/028 adoption matrix except to confirm coco/028 death.
- No embedding-model swap proposals (live = Nomic 768d; rescope TO it, do not change it).

---

## 5. STOP CONDITIONS
- Complete all 20 iterations (061-080), OR explicit operator stop.
- Convergence vote advisory only at threshold 0.01; the 20-iteration plan runs to completion.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading current deletion primitives plus all call sites exposed the difference between active edge hard-delete and memory-row stale cleanup. (iteration 46)
- comparing schema, parser output, and processor mappings separated data availability from promotion behavior. (iteration 47)
- following cache invalidation from callers to cache module exposed which parts are operation-level versus target/action-level. (iteration 48)
- reading the live matcher and handler exposed whether planned Stage 2 exists and where activation semantics currently sit. (iteration 49)
- comparing the phase map to current live modules separated real prerequisites from stale assumptions. (iteration 50)
- grounding the tree in AGENTS and system-code-graph rules avoided inventing a new workflow. (iteration 51)
- Reading state first and then checked-in tool contracts exposed an existing sequence to reuse instead of inventing a new mechanism. (iteration 52)
- Reading the extractor tests gave concrete gate semantics for line anchors and omitted categories. (iteration 53)
- Comparing state docs with reducer code surfaced the exact fail-closed versus lenient distinction. (iteration 54)
- Phase 007 already had strong safety invariants, so the research could convert them into operational backfill and promotion gates. (iteration 58)
- reading parent plus child specs separated governance gates from consumer-specific safety gates. (iteration 59)
- explicitly separating evidence-backed rows from provisional rows avoided fabricating completion. (iteration 60)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- relying on the 004 spec's file table alone missed filename drift and CLI coverage. (iteration 46)
- document-chain scan code initially looked relevant but proved to be same-folder document linking, not packet hierarchy promotion. (iteration 47)
- relying on line numbers in the older spec is brittle because current save invalidation line has drifted; code revalidation is necessary before implementation. (iteration 48)
- external XCE source validation failed because the external corpus is not present in the workspace snapshot. (iteration 49)
- module absence prevented behavioral verification of reducers. (iteration 50)
- the external XCE corpus was unavailable, so adaptation is based on local constraints and prior scoped concept only. (iteration 51)
- Live Code Graph status was unavailable, so runtime readiness could not be demonstrated. (iteration 52)
- The continuation packet has no emitted map yet, so live staleness could not be measured. (iteration 53)
- This fallback could not run the shared reducer because the write boundary forbids reducer-owned files. (iteration 54)
- no live trigger-index cardinality was available, preventing empirical batch-size tuning. (iteration 58)
- no live shadow logs existed for numerical thresholds, so recommendations remain threshold classes rather than calibrated constants. (iteration 59)
- the required earlier iteration artifacts were not present in this fallback slice. (iteration 60)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A context retrieval path before Gate 3 was ruled out for modification requests because Gate 3 is documented as a hard blocker before analysis/tool calls. [SOURCE: AGENTS.md:36-45] -- BLOCKED (iteration 51, 1 attempts)
- What was tried: A context retrieval path before Gate 3 was ruled out for modification requests because Gate 3 is documented as a hard blocker before analysis/tool calls. [SOURCE: AGENTS.md:36-45]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A context retrieval path before Gate 3 was ruled out for modification requests because Gate 3 is documented as a hard blocker before analysis/tool calls. [SOURCE: AGENTS.md:36-45]

### A pure semantic-first workflow was ruled out because local rules route structural/code questions through Code Graph and still require Grep/Read verification. [SOURCE: AGENTS.md:78-106] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:48-53] -- BLOCKED (iteration 51, 1 attempts)
- What was tried: A pure semantic-first workflow was ruled out because local rules route structural/code questions through Code Graph and still require Grep/Read verification. [SOURCE: AGENTS.md:78-106] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:48-53]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A pure semantic-first workflow was ruled out because local rules route structural/code questions through Code Graph and still require Grep/Read verification. [SOURCE: AGENTS.md:78-106] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:48-53]

### A single global "feedback reducers enabled" switch is unsafe because the three consumers have different mutation surfaces, support thresholds, and rollback requirements. [INFERENCE: based on separate flags and consumer scopes] -- BLOCKED (iteration 59, 1 attempts)
- What was tried: A single global "feedback reducers enabled" switch is unsafe because the three consumers have different mutation surfaces, support thresholds, and rollback requirements. [INFERENCE: based on separate flags and consumer scopes]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single global "feedback reducers enabled" switch is unsafe because the three consumers have different mutation surfaces, support thresholds, and rollback requirements. [INFERENCE: based on separate flags and consumer scopes]

### Agent-owned resource-map authoring was ruled out because the live contract says synthesis triggers reducer emission while iterations keep using reducer/registry/dashboard/strategy refreshes. [SOURCE: .opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/006-resource-map-emission.md:24-28] -- BLOCKED (iteration 53, 1 attempts)
- What was tried: Agent-owned resource-map authoring was ruled out because the live contract says synthesis triggers reducer emission while iterations keep using reducer/registry/dashboard/strategy refreshes. [SOURCE: .opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/006-resource-map-emission.md:24-28]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Agent-owned resource-map authoring was ruled out because the live contract says synthesis triggers reducer emission while iterations keep using reducer/registry/dashboard/strategy refreshes. [SOURCE: .opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/006-resource-map-emission.md:24-28]

### Assuming Stage 3 model reranking still exists was ruled out by the current Stage 3 code. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:109-117] -- BLOCKED (iteration 50, 1 attempts)
- What was tried: Assuming Stage 3 model reranking still exists was ruled out by the current Stage 3 code. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:109-117]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming Stage 3 model reranking still exists was ruled out by the current Stage 3 code. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:109-117]

### Claiming a complete 040-059 evidence synthesis from only 058-059 artifacts: ruled out because the missing 040-057 artifacts would make that overconfident. [INFERENCE: based on artifact-root Glob result and strategy-required range] -- BLOCKED (iteration 60, 1 attempts)
- What was tried: Claiming a complete 040-059 evidence synthesis from only 058-059 artifacts: ruled out because the missing 040-057 artifacts would make that overconfident. [INFERENCE: based on artifact-root Glob result and strategy-required range]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming a complete 040-059 evidence synthesis from only 058-059 artifacts: ruled out because the missing 040-057 artifacts would make that overconfident. [INFERENCE: based on artifact-root Glob result and strategy-required range]

### Copying PRAT internals was ruled out because the public corpus names PRAT but exposes only a high-level diagram and four-step flow. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:229-245] -- BLOCKED (iteration 42, 1 attempts)
- What was tried: Copying PRAT internals was ruled out because the public corpus names PRAT but exposes only a high-level diagram and four-step flow. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:229-245]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying PRAT internals was ruled out because the public corpus names PRAT but exposes only a high-level diagram and four-step flow. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:229-245]

### Creating or editing shared state/research summary files: ruled out by the parallel fallback instructions. -- BLOCKED (iteration 60, 1 attempts)
- What was tried: Creating or editing shared state/research summary files: ruled out by the parallel fallback instructions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Creating or editing shared state/research summary files: ruled out by the parallel fallback instructions.

### Direct code-graph-only context was ruled out because Code Graph explicitly does not own spec folders, memory, resume, or hooks. [SOURCE: .opencode/skills/system-code-graph/README.md:37-44] -- BLOCKED (iteration 52, 1 attempts)
- What was tried: Direct code-graph-only context was ruled out because Code Graph explicitly does not own spec folders, memory, resume, or hooks. [SOURCE: .opencode/skills/system-code-graph/README.md:37-44]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct code-graph-only context was ruled out because Code Graph explicitly does not own spec folders, memory, resume, or hooks. [SOURCE: .opencode/skills/system-code-graph/README.md:37-44]

### Direct SaaS integration was ruled out because the README requires hosted `https://mcp.xanther.ai/sse` plus bearer auth and the strategy says no XCE SaaS adoption. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:70-97] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:10] -- BLOCKED (iteration 42, 1 attempts)
- What was tried: Direct SaaS integration was ruled out because the README requires hosted `https://mcp.xanther.ai/sse` plus bearer auth and the strategy says no XCE SaaS adoption. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:70-97] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:10]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct SaaS integration was ruled out because the README requires hosted `https://mcp.xanther.ai/sse` plus bearer auth and the strategy says no XCE SaaS adoption. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:70-97] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:10]

### Direct semantic replacement of lexical matching: rejected because explicit command triggers are a control surface and false positives affect cognitive activation. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:49] -- BLOCKED (iteration 58, 1 attempts)
- What was tried: Direct semantic replacement of lexical matching: rejected because explicit command triggers are a control surface and false positives affect cognitive activation. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:49]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct semantic replacement of lexical matching: rejected because explicit command triggers are a control surface and false positives affect cognitive activation. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:49]

### Direct XCE README re-read was attempted but unavailable in this workspace snapshot; local plan and implementation evidence were used instead. [INFERENCE: based on failed Read/Glob attempts for `external/README.md`] -- BLOCKED (iteration 49, 1 attempts)
- What was tried: Direct XCE README re-read was attempted but unavailable in this workspace snapshot; local plan and implementation evidence were used instead. [INFERENCE: based on failed Read/Glob attempts for `external/README.md`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct XCE README re-read was attempted but unavailable in this workspace snapshot; local plan and implementation evidence were used instead. [INFERENCE: based on failed Read/Glob attempts for `external/README.md`]

### Directly appending to shared `research/deep-research-state.jsonl` was ruled out because the task explicitly forbids it and the continuation config already declares restart isolation. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-config.json:11-14] -- BLOCKED (iteration 40, 1 attempts)
- What was tried: Directly appending to shared `research/deep-research-state.jsonl` was ruled out because the task explicitly forbids it and the continuation config already declares restart isolation. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-config.json:11-14]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Directly appending to shared `research/deep-research-state.jsonl` was ruled out because the task explicitly forbids it and the continuation config already declares restart isolation. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-config.json:11-14]

### Directly editing `findings-registry.json`, strategy, or dashboard was ruled out because those surfaces are reducer-owned and regenerated from raw iteration/state inputs. [SOURCE: .opencode/skills/deep-research/references/state/state_format.md:68-78] -- BLOCKED (iteration 54, 1 attempts)
- What was tried: Directly editing `findings-registry.json`, strategy, or dashboard was ruled out because those surfaces are reducer-owned and regenerated from raw iteration/state inputs. [SOURCE: .opencode/skills/deep-research/references/state/state_format.md:68-78]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Directly editing `findings-registry.json`, strategy, or dashboard was ruled out because those surfaces are reducer-owned and regenerated from raw iteration/state inputs. [SOURCE: .opencode/skills/deep-research/references/state/state_format.md:68-78]

### Do not add a new ambient hook that auto-runs graph context; current Code Graph context is half-auto only after requested dispatch. [SOURCE: .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:144-152] -- BLOCKED (iteration 52, 1 attempts)
- What was tried: Do not add a new ambient hook that auto-runs graph context; current Code Graph context is half-auto only after requested dispatch. [SOURCE: .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:144-152]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not add a new ambient hook that auto-runs graph context; current Code Graph context is half-auto only after requested dispatch. [SOURCE: .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:144-152]

### Do not implement a retention reducer that imports unexported file-local constants without first adding an explicit export/helper seam. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:55-80] -- BLOCKED (iteration 50, 1 attempts)
- What was tried: Do not implement a retention reducer that imports unexported file-local constants without first adding an explicit export/helper seam. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:55-80]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not implement a retention reducer that imports unexported file-local constants without first adding an explicit export/helper seam. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:55-80]

### Do not present XCE-style context-first as an override of local read-first or spec-folder governance; it must be a steering layer inside those constraints. [SOURCE: AGENTS.md:24-26] [SOURCE: AGENTS.md:36-45] -- BLOCKED (iteration 51, 1 attempts)
- What was tried: Do not present XCE-style context-first as an override of local read-first or spec-folder governance; it must be a steering layer inside those constraints. [SOURCE: AGENTS.md:24-26] [SOURCE: AGENTS.md:36-45]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not present XCE-style context-first as an override of local read-first or spec-folder governance; it must be a steering layer inside those constraints. [SOURCE: AGENTS.md:24-26] [SOURCE: AGENTS.md:36-45]

### Do not require all ten category headings to be present in research output: tests show research-shaped maps omit empty categories while preserving original category numbers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:137-148] -- BLOCKED (iteration 53, 1 attempts)
- What was tried: Do not require all ten category headings to be present in research output: tests show research-shaped maps omit empty categories while preserving original category numbers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:137-148]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not require all ten category headings to be present in research output: tests show research-shaped maps omit empty categories while preserving original category numbers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:137-148]

### Do not search for shipped `SPECKIT_SEMANTIC_TRIGGERS_*` behavior as if implemented; current evidence shows only the ENV insertion slot and planned requirements. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:103-105] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:170-173] -- BLOCKED (iteration 49, 1 attempts)
- What was tried: Do not search for shipped `SPECKIT_SEMANTIC_TRIGGERS_*` behavior as if implemented; current evidence shows only the ENV insertion slot and planned requirements. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:103-105] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:170-173]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not search for shipped `SPECKIT_SEMANTIC_TRIGGERS_*` behavior as if implemented; current evidence shows only the ENV insertion slot and planned requirements. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:103-105] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:170-173]

### Implementation-summary closeout evidence was ruled out as unavailable because the phase is still scaffolded and explicitly says post-implementation sections are unfilled. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:36-48] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:100-108] -- BLOCKED (iteration 49, 1 attempts)
- What was tried: Implementation-summary closeout evidence was ruled out as unavailable because the phase is still scaffolded and explicitly says post-implementation sections are unfilled. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:36-48] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:100-108]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Implementation-summary closeout evidence was ruled out as unavailable because the phase is still scaffolded and explicitly says post-implementation sections are unfilled. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:36-48] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:100-108]

### Live synchronous embedding during trigger calls: rejected because Phase 007 states the hot path must never generate embeddings and latency budget is tight. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:115] -- BLOCKED (iteration 58, 1 attempts)
- What was tried: Live synchronous embedding during trigger calls: rejected because Phase 007 states the hot path must never generate embeddings and latency budget is tight. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:115]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live synchronous embedding during trigger calls: rejected because Phase 007 states the hot path must never generate embeddings and latency budget is tight. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:115]

### Looking only at `memory-save.ts` undercounts the reconciliation problem; scan stale deletes and no-op/success bulk-delete branches have separate cache/hook behavior. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:559] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151] -- BLOCKED (iteration 48, 1 attempts)
- What was tried: Looking only at `memory-save.ts` undercounts the reconciliation problem; scan stale deletes and no-op/success bulk-delete branches have separate cache/hook behavior. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:559] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking only at `memory-save.ts` undercounts the reconciliation problem; scan stale deletes and no-op/success bulk-delete branches have separate cache/hook behavior. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:559] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151]

### Manual-only stale detection was ruled out because the extractor already has file-existence and line-anchor normalization behavior under test. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:160-198] -- BLOCKED (iteration 53, 1 attempts)
- What was tried: Manual-only stale detection was ruled out because the extractor already has file-existence and line-anchor normalization behavior under test. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:160-198]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Manual-only stale detection was ruled out because the extractor already has file-existence and line-anchor normalization behavior under test. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:160-198]

### No evidence was found that current code already has a `causal_edge_tombstones` table or sweep helper in the inspected deletion paths; current scope remains implementation, not mere wiring. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:764] -- BLOCKED (iteration 46, 1 attempts)
- What was tried: No evidence was found that current code already has a `causal_edge_tombstones` table or sweep helper in the inspected deletion paths; current scope remains implementation, not mere wiring. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:764]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No evidence was found that current code already has a `causal_edge_tombstones` table or sweep helper in the inspected deletion paths; current scope remains implementation, not mere wiring. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:764]

### No independent evidence was available in this agent invocation for the earlier parallel batches; those must be merged by the parent reducer or a later synthesis pass. -- BLOCKED (iteration 60, 1 attempts)
- What was tried: No independent evidence was available in this agent invocation for the earlier parallel batches; those must be merged by the parent reducer or a later synthesis pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No independent evidence was available in this agent invocation for the earlier parallel batches; those must be merged by the parent reducer or a later synthesis pass.

### Per-event live reducer firing: explicitly out of scope for causal reducer and incompatible with shadow-first phase-parent policy. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer/spec.md:65] -- BLOCKED (iteration 59, 1 attempts)
- What was tried: Per-event live reducer firing: explicitly out of scope for causal reducer and incompatible with shadow-first phase-parent policy. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer/spec.md:65]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-event live reducer firing: explicitly out of scope for causal reducer and incompatible with shadow-first phase-parent policy. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer/spec.md:65]

### Repairing staleness by rewriting `research.md` alone was ruled out because final synthesis must read all iterations and strategy and preserve machine-owned markers. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:1006-1024] -- BLOCKED (iteration 54, 1 attempts)
- What was tried: Repairing staleness by rewriting `research.md` alone was ruled out because final synthesis must read all iterations and strategy and preserve machine-owned markers. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:1006-1024]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repairing staleness by rewriting `research.md` alone was ruled out because final synthesis must read all iterations and strategy and preserve machine-owned markers. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:1006-1024]

### Ruled out leaving `memory-bulk-delete.ts` outside scope because current code contains two explicit entity-density invalidation call sites there. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:258] -- BLOCKED (iteration 48, 1 attempts)
- What was tried: Ruled out leaving `memory-bulk-delete.ts` outside scope because current code contains two explicit entity-density invalidation call sites there. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:258]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out leaving `memory-bulk-delete.ts` outside scope because current code contains two explicit entity-density invalidation call sites there. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:258]

### Ruled out promoting `derived.last_active_child_id` in this pass because the 005 spec explicitly excludes it due to recency semantics. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:151] -- BLOCKED (iteration 47, 1 attempts)
- What was tried: Ruled out promoting `derived.last_active_child_id` in this pass because the 005 spec explicitly excludes it due to recency semantics. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:151]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out promoting `derived.last_active_child_id` in this pass because the 005 spec explicitly excludes it due to recency semantics. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:151]

### Ruled out treating `createSpecDocumentChain()` as parent/child metadata promotion: it selects document types within a single `spec_folder`, while the target promoter needs cross-packet metadata relationships. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:884] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:872] -- BLOCKED (iteration 47, 1 attempts)
- What was tried: Ruled out treating `createSpecDocumentChain()` as parent/child metadata promotion: it selects document types within a single `spec_folder`, while the target promoter needs cross-packet metadata relationships. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:884] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:872]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out treating `createSpecDocumentChain()` as parent/child metadata promotion: it selects document types within a single `spec_folder`, while the target promoter needs cross-packet metadata relationships. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:884] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:872]

### Ruled out treating existing `runPostMutationHooks('scan')` as the statediff subscriber model: it takes an operation/context object, not a typed target/action batch. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:527] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20] -- BLOCKED (iteration 48, 1 attempts)
- What was tried: Ruled out treating existing `runPostMutationHooks('scan')` as the statediff subscriber model: it takes an operation/context object, not a typed target/action batch. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:527] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out treating existing `runPostMutationHooks('scan')` as the statediff subscriber model: it takes an operation/context object, not a typed target/action batch. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:527] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20]

### Searching only for direct `deleteEdge()` callers undercounts the risk: stale cleanup deletes memory rows without direct causal-edge cleanup, creating a delayed orphan-edge scenario instead of an immediate edge delete. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:470] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:865] -- BLOCKED (iteration 46, 1 attempts)
- What was tried: Searching only for direct `deleteEdge()` callers undercounts the risk: stale cleanup deletes memory rows without direct causal-edge cleanup, creating a delayed orphan-edge scenario instead of an immediate edge delete. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:470] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:865]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching only for direct `deleteEdge()` callers undercounts the risk: stale cleanup deletes memory rows without direct causal-edge cleanup, creating a delayed orphan-edge scenario instead of an immediate edge delete. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:470] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:865]

### Searching only the graph-metadata schema is insufficient: schema proves `parent_id` and `children_ids` exist, but parser return shape proves they are not converted into current causal links. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:61] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480] -- BLOCKED (iteration 47, 1 attempts)
- What was tried: Searching only the graph-metadata schema is insufficient: schema proves `parent_id` and `children_ids` exist, but parser return shape proves they are not converted into current causal links. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:61] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching only the graph-metadata schema is insufficient: schema proves `parent_id` and `children_ids` exist, but parser return shape proves they are not converted into current causal links. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:61] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480]

### Stage 4 score adjustment by reducers: Stage 4 has compile-time and runtime no-score-mutation invariants. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:230] -- BLOCKED (iteration 59, 1 attempts)
- What was tried: Stage 4 score adjustment by reducers: Stage 4 has compile-time and runtime no-score-mutation invariants. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:230]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stage 4 score adjustment by reducers: Stage 4 has compile-time and runtime no-score-mutation invariants. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:230]

### Treating `/spec_kit:*` and `/speckit:*` as equivalent was ruled out because command files only exist under `.opencode/commands/speckit/` and examples consistently use `/speckit:*`. [SOURCE: .opencode/commands/speckit/resume.md:26-27] -- BLOCKED (iteration 41, 1 attempts)
- What was tried: Treating `/spec_kit:*` and `/speckit:*` as equivalent was ruled out because command files only exist under `.opencode/commands/speckit/` and examples consistently use `/speckit:*`. [SOURCE: .opencode/commands/speckit/resume.md:26-27]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `/spec_kit:*` and `/speckit:*` as equivalent was ruled out because command files only exist under `.opencode/commands/speckit/` and examples consistently use `/speckit:*`. [SOURCE: .opencode/commands/speckit/resume.md:26-27]

### Treating `learned-feedback.ts` as the aggregator was ruled out: it learns search terms, not reducer events from `feedback_events`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:40-64] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:47-68] -- BLOCKED (iteration 50, 1 attempts)
- What was tried: Treating `learned-feedback.ts` as the aggregator was ruled out: it learns search terms, not reducer events from `feedback_events`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:40-64] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:47-68]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `learned-feedback.ts` as the aggregator was ruled out: it learns search terms, not reducer events from `feedback_events`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:40-64] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:47-68]

### Treating a large trigger-index backfill as a single transaction should not be promoted: it would lack restartability and cannot expose per-batch telemetry. [INFERENCE: based on derived-table status fields and large-index risk] -- BLOCKED (iteration 58, 1 attempts)
- What was tried: Treating a large trigger-index backfill as a single transaction should not be promoted: it would lack restartability and cannot expose per-batch telemetry. [INFERENCE: based on derived-table status fields and large-index risk]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a large trigger-index backfill as a single transaction should not be promoted: it would lack restartability and cannot expose per-batch telemetry. [INFERENCE: based on derived-table status fields and large-index risk]

### Treating Grep as an impact-analysis substitute was ruled out because the Code Graph README distinguishes exact-string matching from structural callers/imports/blast-radius edges. [SOURCE: .opencode/skills/system-code-graph/README.md:31-35] -- BLOCKED (iteration 52, 1 attempts)
- What was tried: Treating Grep as an impact-analysis substitute was ruled out because the Code Graph README distinguishes exact-string matching from structural callers/imports/blast-radius edges. [SOURCE: .opencode/skills/system-code-graph/README.md:31-35]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Grep as an impact-analysis substitute was ruled out because the Code Graph README distinguishes exact-string matching from structural callers/imports/blast-radius edges. [SOURCE: .opencode/skills/system-code-graph/README.md:31-35]

### Treating malformed JSONL as harmless by default is unsafe: reducer code throws unless `--lenient` is passed, so the official repair path should make leniency explicit and auditable. [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:84-90] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:954-956] -- BLOCKED (iteration 54, 1 attempts)
- What was tried: Treating malformed JSONL as harmless by default is unsafe: reducer code throws unless `--lenient` is passed, so the official repair path should make leniency explicit and auditable. [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:84-90] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:954-956]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating malformed JSONL as harmless by default is unsafe: reducer code throws unless `--lenient` is passed, so the official repair path should make leniency explicit and auditable. [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:84-90] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:954-956]

### Treating mutation ledger/history rows as edge tombstones is ruled out because the cited rows record memory deletion history or operation metadata, not source/target/relation snapshots for each deleted causal edge. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:102] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:260] -- BLOCKED (iteration 46, 1 attempts)
- What was tried: Treating mutation ledger/history rows as edge tombstones is ruled out because the cited rows record memory deletion history or operation metadata, not source/target/relation snapshots for each deleted causal edge. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:102] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:260]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating mutation ledger/history rows as edge tombstones is ruled out because the cited rows record memory deletion history or operation metadata, not source/target/relation snapshots for each deleted causal edge. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:102] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:260]

### Treating old code-graph/cocoindex phase folders as current 027 implementation scope was ruled out because the context index moved them to 028. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:1-5] -- BLOCKED (iteration 41, 1 attempts)
- What was tried: Treating old code-graph/cocoindex phase folders as current 027 implementation scope was ruled out because the context index moved them to 028. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:1-5]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating old code-graph/cocoindex phase folders as current 027 implementation scope was ruled out because the context index moved them to 028. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:1-5]

### Treating the old registry as authoritative was ruled out because it reports zero completed work while the old state records completed iterations. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json:20-27] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:30-40] -- BLOCKED (iteration 40, 1 attempts)
- What was tried: Treating the old registry as authoritative was ruled out because it reports zero completed work while the old state records completed iterations. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json:20-27] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:30-40]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the old registry as authoritative was ruled out because it reports zero completed work while the old state records completed iterations. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json:20-27] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:30-40]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Directly appending to shared `research/deep-research-state.jsonl` was ruled out because the task explicitly forbids it and the continuation config already declares restart isolation. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-config.json:11-14] (iteration 40)
- Treating the old registry as authoritative was ruled out because it reports zero completed work while the old state records completed iterations. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json:20-27] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:30-40] (iteration 40)
- Treating `/spec_kit:*` and `/speckit:*` as equivalent was ruled out because command files only exist under `.opencode/commands/speckit/` and examples consistently use `/speckit:*`. [SOURCE: .opencode/commands/speckit/resume.md:26-27] (iteration 41)
- Treating old code-graph/cocoindex phase folders as current 027 implementation scope was ruled out because the context index moved them to 028. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:1-5] (iteration 41)
- Copying PRAT internals was ruled out because the public corpus names PRAT but exposes only a high-level diagram and four-step flow. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:229-245] (iteration 42)
- Direct SaaS integration was ruled out because the README requires hosted `https://mcp.xanther.ai/sse` plus bearer auth and the strategy says no XCE SaaS adoption. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/external/xce-mcp/README.md:70-97] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:10] (iteration 42)
- No evidence was found that current code already has a `causal_edge_tombstones` table or sweep helper in the inspected deletion paths; current scope remains implementation, not mere wiring. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:743] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:764] (iteration 46)
- Searching only for direct `deleteEdge()` callers undercounts the risk: stale cleanup deletes memory rows without direct causal-edge cleanup, creating a delayed orphan-edge scenario instead of an immediate edge delete. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:470] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:865] (iteration 46)
- Treating mutation ledger/history rows as edge tombstones is ruled out because the cited rows record memory deletion history or operation metadata, not source/target/relation snapshots for each deleted causal edge. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:102] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:260] (iteration 46)
- Ruled out promoting `derived.last_active_child_id` in this pass because the 005 spec explicitly excludes it due to recency semantics. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:151] (iteration 47)
- Ruled out treating `createSpecDocumentChain()` as parent/child metadata promotion: it selects document types within a single `spec_folder`, while the target promoter needs cross-packet metadata relationships. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:884] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:872] (iteration 47)
- Searching only the graph-metadata schema is insufficient: schema proves `parent_id` and `children_ids` exist, but parser return shape proves they are not converted into current causal links. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:61] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480] (iteration 47)
- Looking only at `memory-save.ts` undercounts the reconciliation problem; scan stale deletes and no-op/success bulk-delete branches have separate cache/hook behavior. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:559] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151] (iteration 48)
- Ruled out leaving `memory-bulk-delete.ts` outside scope because current code contains two explicit entity-density invalidation call sites there. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:151] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:258] (iteration 48)
- Ruled out treating existing `runPostMutationHooks('scan')` as the statediff subscriber model: it takes an operation/context object, not a typed target/action batch. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:527] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20] (iteration 48)
- Direct XCE README re-read was attempted but unavailable in this workspace snapshot; local plan and implementation evidence were used instead. [INFERENCE: based on failed Read/Glob attempts for `external/README.md`] (iteration 49)
- Do not search for shipped `SPECKIT_SEMANTIC_TRIGGERS_*` behavior as if implemented; current evidence shows only the ENV insertion slot and planned requirements. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:103-105] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:170-173] (iteration 49)
- Implementation-summary closeout evidence was ruled out as unavailable because the phase is still scaffolded and explicitly says post-implementation sections are unfilled. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:36-48] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/implementation-summary.md:100-108] (iteration 49)
- Assuming Stage 3 model reranking still exists was ruled out by the current Stage 3 code. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:109-117] (iteration 50)
- Do not implement a retention reducer that imports unexported file-local constants without first adding an explicit export/helper seam. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:55-80] (iteration 50)
- Treating `learned-feedback.ts` as the aggregator was ruled out: it learns search terms, not reducer events from `feedback_events`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:40-64] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:47-68] (iteration 50)
- A context retrieval path before Gate 3 was ruled out for modification requests because Gate 3 is documented as a hard blocker before analysis/tool calls. [SOURCE: AGENTS.md:36-45] (iteration 51)
- A pure semantic-first workflow was ruled out because local rules route structural/code questions through Code Graph and still require Grep/Read verification. [SOURCE: AGENTS.md:78-106] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:48-53] (iteration 51)
- Do not present XCE-style context-first as an override of local read-first or spec-folder governance; it must be a steering layer inside those constraints. [SOURCE: AGENTS.md:24-26] [SOURCE: AGENTS.md:36-45] (iteration 51)
- Direct code-graph-only context was ruled out because Code Graph explicitly does not own spec folders, memory, resume, or hooks. [SOURCE: .opencode/skills/system-code-graph/README.md:37-44] (iteration 52)
- Do not add a new ambient hook that auto-runs graph context; current Code Graph context is half-auto only after requested dispatch. [SOURCE: .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:144-152] (iteration 52)
- Treating Grep as an impact-analysis substitute was ruled out because the Code Graph README distinguishes exact-string matching from structural callers/imports/blast-radius edges. [SOURCE: .opencode/skills/system-code-graph/README.md:31-35] (iteration 52)
- Agent-owned resource-map authoring was ruled out because the live contract says synthesis triggers reducer emission while iterations keep using reducer/registry/dashboard/strategy refreshes. [SOURCE: .opencode/skills/deep-research/feature_catalog/01--loop-lifecycle/006-resource-map-emission.md:24-28] (iteration 53)
- Do not require all ten category headings to be present in research output: tests show research-shaped maps omit empty categories while preserving original category numbers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:137-148] (iteration 53)
- Manual-only stale detection was ruled out because the extractor already has file-existence and line-anchor normalization behavior under test. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:160-198] (iteration 53)
- Directly editing `findings-registry.json`, strategy, or dashboard was ruled out because those surfaces are reducer-owned and regenerated from raw iteration/state inputs. [SOURCE: .opencode/skills/deep-research/references/state/state_format.md:68-78] (iteration 54)
- Repairing staleness by rewriting `research.md` alone was ruled out because final synthesis must read all iterations and strategy and preserve machine-owned markers. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:1006-1024] (iteration 54)
- Treating malformed JSONL as harmless by default is unsafe: reducer code throws unless `--lenient` is passed, so the official repair path should make leniency explicit and auditable. [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:84-90] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:954-956] (iteration 54)
- Direct semantic replacement of lexical matching: rejected because explicit command triggers are a control surface and false positives affect cognitive activation. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:49] (iteration 58)
- Live synchronous embedding during trigger calls: rejected because Phase 007 states the hot path must never generate embeddings and latency budget is tight. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md:115] (iteration 58)
- Treating a large trigger-index backfill as a single transaction should not be promoted: it would lack restartability and cannot expose per-batch telemetry. [INFERENCE: based on derived-table status fields and large-index risk] (iteration 58)
- A single global "feedback reducers enabled" switch is unsafe because the three consumers have different mutation surfaces, support thresholds, and rollback requirements. [INFERENCE: based on separate flags and consumer scopes] (iteration 59)
- Per-event live reducer firing: explicitly out of scope for causal reducer and incompatible with shadow-first phase-parent policy. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/003-causal-reducer/spec.md:65] (iteration 59)
- Stage 4 score adjustment by reducers: Stage 4 has compile-time and runtime no-score-mutation invariants. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:230] (iteration 59)
- Claiming a complete 040-059 evidence synthesis from only 058-059 artifacts: ruled out because the missing 040-057 artifacts would make that overconfident. [INFERENCE: based on artifact-root Glob result and strategy-required range] (iteration 60)
- Creating or editing shared state/research summary files: ruled out by the parallel fallback instructions. (iteration 60)
- No independent evidence was available in this agent invocation for the earlier parallel batches; those must be merged by the parent reducer or a later synthesis pass. (iteration 60)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Parent reducer should merge all task deltas, then rerun a final synthesis that replaces provisional 040-057 rows with evidence-backed decisions.

<!-- /ANCHOR:next-focus -->

---

## 12. KNOWN CONTEXT

### 2026-06-05 relevance-audit (single-model gpt-5.5-fast, 10 passes) — baseline being complemented
0 ALREADY-DONE; STILL-RELEVANT: 002, 003; NEEDS-RESCOPE: 001, 004, 005, 006, 007, 008, vocab; INVALIDATED: embedding assumption. Dominant cause = path drift, not completion. Single-model risk flagged.

### Live system-spec-kit reality (verified this session)
Embedder: ollama `nomic-embed-text-v1.5` 768-dim (EMBEDDINGS_PROVIDER=auto; Voyage/OpenAI keys unset), profile-scoped cache (profile_key+input_kind). 026 CLOSED (Complete; 005 deferred). Shipped: relation-backfill.ts causal auto-edges + conflict guard; async post-insert enrichment default-on; self-maintaining memory_index_scan; checkpoints v2 schema v30; separate MCP servers + shared daemon.

### CocoIndex DEPRECATION (operator constraint)
ALL coco-derived scope removed from 027. 008/002-coco-rerank-consumer = DELETE (structurally coco-dependent). Coco refs thread through 002/003/004/006/008 specs. iteration-057's "keep memory_context separate from 028 Coco extras" is moot.

### XCE corpus (external/xce-mcp) — near-exhausted
Paid SaaS, PRAT, 5 tools. pt-01..04 settled: SaaS/PRAT/unconditional-steering = SKIP; adaptable signals already captured/landed. XCE = signal, not requirement.

### Resource map
`{spec_folder}/resource-map.md` present → coverage gate active; treat inventoried files as exclusion set.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20 new (061-080), cap 81
- Convergence threshold: 0.01
- Per-iteration budget: 12 tool calls, 20 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle: resume (run 60 → 061-080)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Current generation: 2
- Started: 2026-06-05T20:30:00Z
