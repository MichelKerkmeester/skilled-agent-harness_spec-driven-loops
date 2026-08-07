---
title: "016 Deep-Research Synthesis"
description: "Coverage + hygiene audit across all 8 arcs of the 016 umbrella, 4 categories (UNSHIPPED / DEAD / BUGGED / MISSED), iters 1-9."
---

# 016 Deep-Research Synthesis

## 1. Overview

This synthesis reads and merges `iteration-001.md` through `iteration-009.md` in order. The nine passes covered the eight top-level arcs under `013-embedder-testing-and-architecture` plus one root umbrella consistency pass.

Methodology: preserve every original finding ID, keep the original category assignment, compress the evidence to a triage-sized `File:line` anchor, and rank the highest-value repairs by impact x effort. Total findings: 57.

Category counts:

| Category | Count |
|---|---:|
| UNSHIPPED | 9 |
| DEAD | 12 |
| BUGGED | 24 |
| MISSED | 12 |

## 2. Findings by Category

### UNSHIPPED (9 findings)

| ID | File:line | What | Recommended action |
|---|---|---|---|
| f-iter001-002 | `008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion/spec.md:117-119`; `tasks.md:60,73-75` | Phase 007 requires MPS benchmark evidence, but benchmark report is absent and closeout tasks remain open. | Finish `benchmark_report.md`, task evidence, and strict validation before treating 007 as evidence-bearing. |
| f-iter001-008 | `008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/tasks.md:40-41,55,72-75` | Phase 006 tasks are checked complete while evidence cells still say pending. | Backfill exact evidence or reopen the affected tasks. |
| f-iter002-005 | `001-local-embeddings-foundation/018-llama-cpp-auto-migration/spec.md:78-83,95-99` | The promised llama-cpp auto-migration gate, startup wiring, and script are not present in live source. | Restore the migration path and tests, or mark phase 018 superseded by the Ollama cascade. |
| f-iter002-007 | `001-local-embeddings-foundation/028-local-llm-feature-test-suite/spec.md:66-134,172`; `tasks.md:53-87` | The local-LLM suite promises 10 functional groups and 4 perf benches, but only a partial suite exists and the packet has no summary. | Implement missing groups/benchmark or rescope the spec to the current partial suite. |
| f-iter003-001 | `002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default/spec.md:73`; `auto-select.ts:80-83`; `factory.ts:143-146`; `profile.ts:185-195` | `auto` uses Nomic, but explicit `hf-local` still defaults to BGE on other runtime paths. | Align all hf-local defaults to Nomic, or narrow ADR-014 to only the auto bootstrap path and add a regression test. |
| f-iter003-005 | `002-spec-memory-stack/spec.md:3,62,75`; `004-spec-memory-embedder-bake-off/decision-record.md:50-56,108-123` | Parent claims mxbai shipped and closed cat-24/409, but the bake-off rolled mxbai back. | Rewrite parent summary to credit the actual Nomic/Jina plus retrieval-rescue closure and mark mxbai failed. |
| f-iter006-002 | `005-cross-cutting-quality/spec.md:49`; `002-deep-review-stack/spec.md:39`; `tasks.md:44-66` | Parent claims `002-deep-review-stack` shipped, but child docs remain planned/pending. | Backfill child completion evidence or downgrade the parent row. |
| f-iter007-005 | `006-mcp-launcher-concurrency/012-*/tasks.md:67-72,80`; `implementation-summary.md:189-195` | Phase 012 claims completion while strict-validate evidence is still written as expected, not observed. | Capture real strict-validate output or reopen `T015`. |
| f-iter008-002 | `007-ollama-and-bge-promotion/002-cocoindex-ollama-adapter/spec.md:42,88,97`; `implementation-summary.md:143,152` | Ollama adapter is marked complete despite failed end-to-end `ccc index`/search smoke. | Downgrade the e2e claim or add an unsandboxed validation record. |

### DEAD (12 findings)

| ID | File:line | What | Recommended action |
|---|---|---|---|
| f-iter002-006 | `execution-router.ts:29`; `factory.ts:97,209-214` | `llama-cpp` remains in sidecar-local routing, but factory validation no longer supports it. | Remove the dead branch or restore a real provider adapter. |
| f-iter004-003 | `system-skill-advisor/INSTALL_GUIDE.md:337-339,379`; `README.md:224`; `skill-graph-db.ts:812-817` | User docs still describe the pre-004 writer-gap after writer cross-wire shipped. | Update docs to distinguish shipped writer wiring from the still-unexecuted production pointer swap. |
| f-iter004-004 | `002-jina-swap-and-reindex/evidence/swap-runbook.md:20,55-58`; `registry.ts:13-63` | Swap runbook says 8 embedders and 010/004 unshipped; live registry has 6 and 004 shipped. | Refresh the runbook before operator use. |
| f-iter004-006 | `004-skill-graph-db-writer-cross-wire/implementation-summary.md:63-66,110-111`; `review/review-report.md:22,27,52` | Phase 004 metadata still lists completed review/summary work as pending. | Reconcile implementation summary and continuity fields. |
| f-iter005-002 | `004-code-index-stack/spec.md:40`; `registered_embedders.py:255`; `config.py:21` | Parent still presents the old Jina-code target as live; source defaults to CodeRankEmbed. | Update parent overview/description or add explicit supersession. |
| f-iter005-004 | `009-hybrid-search-bm25-fusion/spec.md:54,83,113-115`; `config.py:722`; `INSTALL_GUIDE.md:339-345` | Hybrid search docs say opt-in/default-off, but the current stack is default-on. | Mark packet 009 opt-in language superseded and link current config source of truth. |
| f-iter005-006 | `mcp-coco-index/INSTALL_GUIDE.md:350,365,367,1088` | Public links point to missing feature-catalog and benchmark paths. | Fix feature-catalog links and normalize benchmark references to the actual folder. |
| f-iter006-001 | `005-cross-cutting-quality/graph-metadata.json:6-11`; `spec.md:46-50`; `004-skill-local-benchmarks-format/graph-metadata.json:3-5` | Parent graph omits existing child 004. | Register child 004 or mark it explicitly superseded. |
| f-iter008-001 | `007-ollama-and-bge-promotion/spec.md:23,35,70,97`; `003-bge-code-v1-confirmation-and-promote/spec.md:23,57-59` | Parent still describes the superseded BGE promotion path. | Refresh parent docs to the Nomic CodeRankEmbed result. |
| f-iter008-003 | `002-cocoindex-ollama-adapter/implementation-summary.md:72-73,97-99`; live paths under `embedders/` and `core/` | Handoff names old flat source files that no longer exist. | Update handoff paths after the CocoIndex feature-grouped refactor. |
| f-iter008-007 | `007-ollama-and-bge-promotion/spec.md:71`; `description.json:4`; `004-newer-text-embedders-survey/spec.md:78-80`; `research.md:65-71,112-114` | Parent still requires 004 benchmark outputs after child 004 was rescoped to research-only HOLD/no-bench. | Replace parent requirement with the actual survey contract. |
| f-iter009-004 | `adapter.ts:7-8`; `registry.ts:9-10`; `.opencode/specs/descriptions.json:9013,9025,9040,9054` | Source comments and descriptions index still point to removed flat child docs. | Replace comments with live nested paths and regenerate/clean `descriptions.json`. |

### BUGGED (24 findings)

| ID | File:line | What | Recommended action |
|---|---|---|---|
| f-iter001-003 | `008-rerank-sidecar-arc/007-*/spec.md:86-93,110`; `cross-encoder.ts:54` | Worktree has a Qwen model flip without the PROMOTE closeout path, validation, or matching docs. | Complete the promote path or park the model flip. |
| f-iter001-004 | `rerank_sidecar.py:40-43,93-103`; `start.sh:39-43`; `cross-encoder.ts:54` | Multi-model claim conflicts with default allowlist that only includes the default model. | Include both consumer models in launcher/default env or document required `RERANK_ALLOWED_MODELS`. |
| f-iter001-005 | `system-rerank-sidecar/SKILL.md:239`; `rerank_sidecar.py:45-49,85-87` | Non-default allowlisted models can load without a pinned revision. | Require revision entries for every allowlisted non-default model or narrow the invariant. |
| f-iter001-006 | `system-rerank-sidecar/SKILL.md:90-93`; `README.md:70`; `rerank_sidecar.py:144-151` | Docs show the old `/health` response shape. | Update examples to the v0.2.0 health contract. |
| f-iter002-001 | `001-local-embeddings-foundation/spec.md:49,117`; `graph-metadata.json:93` | Parent says complete while a child is pending and graph derives in-progress. | Reconcile parent status with child state. |
| f-iter002-004 | `001-local-embeddings-foundation/spec.md:72`; `factory.ts:66,97,612-647` | Docs claim `auto` cascades through llama-cpp; current code supports Ollama/hf-local instead. | Update docs or restore llama-cpp provider support. |
| f-iter003-003 | `002-spec-memory-stack/spec.md:70-79` | Parent phase map rows have the wrong column count and shifted phase titles. | Rebuild the phase map and add a parent-table cell-count validator. |
| f-iter003-004 | `002-spec-memory-stack/description.json:2-17`; `spec.md:55-62` | Parent description appears copied from child 019 rather than the parent arc. | Regenerate description from parent spec and add a post-save sanity check. |
| f-iter004-002 | `registry.ts:10`; `schema.ts:18-21`; `001-pluggable-architecture/implementation-summary.md:43-44` | Skill-advisor has competing default constants for Jina and gemma. | Rename the registry constant to a preference/parity target and test the intended relationship. |
| f-iter004-005 | `002-jina-swap-and-reindex/spec.md:52`; `schema.ts:84-94,97-121` | Spec advertises an env-var embedder swap path that source does not implement. | Remove the env-var promise or implement a real env bridge. |
| f-iter005-003 | `016-query-expansion-identifier-bridging/spec.md:46,97-101,138-142`; `config.py:32,778-781`; `README.md:139` | Query expansion is accepted default-off, but spec and README still say default-on. | Make requirements and README match default-off with failed-bench rationale. |
| f-iter005-005 | `registered_embedders.py:255-256`; `config.py:30`; `README.md:78,104` | Reranker default is Qwen, but README still says local Jina v3 reranker. | Replace stale Jina sentence and keep Jina as opt-in fallback only. |
| f-iter006-003 | `005-cross-cutting-quality/003-skill-docs-alignment/spec.md:40-42,92-96`; root `README.md:132-134`; `embedder-pluggability.md:30-33` | Skill-docs alignment narrative still names old Jina defaults. | Refresh docs to Nomic, CodeRankEmbed, and Qwen defaults, then rerun the audit. |
| f-iter006-004 | `004-skill-local-benchmarks-format/spec.md:110-111`; `implementation-summary.md:99,113,118` | Benchmark-format packet contains contradictory old `FORMAT.md` and new sk-doc relocation claims. | Remove stale requirements or mark them historical/superseded. |
| f-iter006-005 | `005-cocoindex-install-hygiene/graph-metadata.json:43-45`; `spec.md:46`; `implementation-summary.md:40-42`; `tasks.md:53-56` | Graph says complete while packet is blocked. | Set graph status to blocked or split completed diagnosis from open repair. |
| f-iter006-006 | `005-cocoindex-install-hygiene/tasks.md:62-65`; `implementation-summary.md:50`; `INSTALL_GUIDE.md:908-945` | Packet says harness/guide edits are pending, but source changes already shipped. | Reconcile docs with commit `339387694a`, leaving only pipx repair blocked. |
| f-iter007-001 | `006-mcp-launcher-concurrency/spec.md:3,55-68`; `description.json:3,17`; `graph-metadata.json:6-18,54` | Parent says 4/5-phase arc despite 12 children. | Regenerate parent metadata and prose for the 12-child arc. |
| f-iter007-003 | `011-*/spec.md:85,159`; `lease.ts:226-247,300-317` | Dead-PID follow-on asks for a liveness probe that already exists on read path; acquisition path remains the real gap. | Reframe around acquisition-time reclaim semantics and tests. |
| f-iter007-004 | `012-*/spec.md:96-100,170`; `implementation-summary.md:221`; `mk-skill-advisor.js:33,463-474`; `mk-skill-advisor-bridge.mjs:46,242-246` | Plugin bridge timeout is 1s while bridge MCP timeout is 8s. | Raise/configure plugin timeout and add a bridge-completion regression test. |
| f-iter008-005 | `003-bge-code-v1-confirmation-and-promote/spec.md:57-59,70-72,112-114` | Spec says corrected single-run rebaseline, then later references nonexistent 3-run evidence. | Fix the internal contract to reference the corrected run or later 018 evidence. |
| f-iter008-006 | `001-indexer-surface-investigation/research.md:4,15-30,94-106`; `spec.md:22`; `graph-metadata.json:42` | Research output exists, but metadata still says draft/planned. | Mark complete or document why validation remains missing. |
| f-iter009-001 | root `spec.md:76-85`; root `graph-metadata.json:6-14`; direct child dirs `001` through `008` | Root phase map lists old flat child slugs and omits actual direct child 008. | Regenerate root phase map and `children_ids` from actual children. |
| f-iter009-002 | root `spec.md:15-26,47`; root `graph-metadata.json:42-43` | Root continuity still says 5% scaffold and routes to a nonexistent flat child. | Refresh root continuity/status metadata after this research run. |
| f-iter009-003 | root `spec.md:3,79`; `auto-select.ts:80-90`; `config.py:21`; `registered_embedders.py:255` | Root production-default claims name Jina winners, but current defaults are Nomic and CodeRankEmbed. | Update umbrella description and phase rows to final defaults. |

### MISSED (12 findings)

| ID | File:line | What | Recommended action |
|---|---|---|---|
| f-iter001-001 | `008-rerank-sidecar-arc/007-*/spec.md:36-37`; parent `graph-metadata.json:6-13,53-55`; parent `spec.md:55-62` | Phase 007 says arc 008 reopened, but parent metadata/map still stop at 006. | Register phase 007 in parent map and graph metadata. |
| f-iter001-007 | `008-rerank-sidecar-arc/006-*/implementation-summary.md:155-157`; `007-*/spec.md:2,36-37` | Phase 006 promised `007-cocoindex-rerank-baseline-drift`, but phase 007 is a different packet. | Create a non-conflicting follow-on or retarget the limitation. |
| f-iter002-002 | `001-local-embeddings-foundation/spec.md:80-82,104-119`; live child dirs | Parent phase map omits many live child folders. | Regenerate map from filesystem or graph metadata. |
| f-iter002-003 | `001-local-embeddings-foundation/graph-metadata.json:19-56` | Graph skips several live re-review child directories. | Regenerate `children_ids` and `last_active_child_id`. |
| f-iter003-002 | `002-spec-memory-stack/graph-metadata.json:6-23,51`; live child dirs 018/019 | Parent graph omits children 018 and 019 and still derives planned. | Regenerate graph metadata from direct children and closeout state. |
| f-iter004-001 | `003-skill-advisor-stack/spec.md:58,91`; `schema.ts:18-21`; `CHANGELOG.md:197` | Arc success requires Jina activation, but runtime remains gemma. | Execute swap runbook or retitle the arc as infrastructure-only with a concrete follow-on. |
| f-iter004-007 | `001-pluggable-architecture/review/review-report.md:99,164`; `schema.ts:103-120` | Prior P2 about non-transactional `setActiveEmbedder` table creation remains open. | Close, fix, or explicitly waive the P2. |
| f-iter005-001 | `004-code-index-stack/spec.md:15-26,63-69`; `graph-metadata.json:6-28,58-59` | Parent map still lists only first 3 children and scaffold continuity despite many later children. | Refresh parent control file and graph metadata. |
| f-iter005-007 | `023-deep-research-arc-blind-spots/spec.md:2-3,58-67`; `graph-metadata.json:6-16,56` | Nested parent says 8-packet arc but graph contains child 010. | Include 010 in the parent map or mark it out-of-band. |
| f-iter007-002 | `006-mcp-launcher-concurrency/spec.md:88-93`; `011-*/spec.md:124-129`; `012-*/tasks.md:82-85` | Parent implies only passive operator items remain, but no tracked 013 exists for open dead-PID reclaim. | Add a follow-on child or update parent "What Needs Done." |
| f-iter008-004 | `003-bge-code-v1-confirmation-and-promote/spec.md:84-89`; folder contents | Required CSV/JSONL, implementation summary, and decision evidence are absent. | Close as superseded by later evidence or backfill the promised summary/evidence links. |
| f-iter009-005 | `051-runtime-config-mk-code-index-parity-plus-findings/implementation-summary.md:143-145,164` | Three named deferred P2 packets do not exist under the track. | Create them, retarget deferrals, or explicitly waive/resolve them. |

## 3. Cross-Arc Patterns

Metadata drift is the dominant pattern. Root and arc parents repeatedly have stale `spec.md`, `description.json`, and `graph-metadata.json` after child packets landed, renames happened, or defaults changed.

Production-default drift recurs across mk-spec-memory, CocoIndex, skill-advisor, and rerank surfaces. Docs still name Jina, BGE, llama-cpp, or old reranker choices while source has moved to Nomic, Ollama/hf-local, CodeRankEmbed, Qwen, or gemma-as-active-default depending on surface.

Several packets claim completion before evidence is durable. The recurring shape is checked tasks with pending evidence, expected validation output recorded as if observed, or phase parents declaring shipped status while child docs remain planned/blocked.

Supersession is under-documented. Later packets invalidated or replaced BGE, mxbai, hybrid opt-in, benchmark-format, and flat-child path assumptions, but older parent docs still present those assumptions as live.

Runtime bugs cluster around boundary contracts: model allowlists/revisions, default constants, env-var promises, daemon lease reclaim, and plugin timeout alignment.

## 4. Recommended Priority

| Rank | Finding(s) | Why it ranks here | Recommended first move |
|---:|---|---|---|
| 1 | f-iter009-001, f-iter009-002 | Root umbrella metadata routes recovery into nonexistent/stale children; high blast radius, mostly doc/metadata repair. | Regenerate root phase map, `children_ids`, continuity, and status. |
| 2 | f-iter009-003, f-iter006-003, f-iter005-002 | Production-default story is wrong across root, skill docs, and CocoIndex parent docs. | Author one current-default source-of-truth update, then propagate. |
| 3 | f-iter001-004, f-iter001-005 | Rerank sidecar multi-model behavior can reject intended models or load unpinned revisions. | Fix allowlist/revision contract before relying on multi-consumer serving. |
| 4 | f-iter003-001 | mk-spec-memory `hf-local` default split can produce different models depending on entry path. | Align defaults and add explicit-provider regression coverage. |
| 5 | f-iter007-004 | Skill-advisor plugin timeout can kill valid bridge requests before the bridge MCP timeout. | Raise/configure plugin timeout and test slow bridge completion. |
| 6 | f-iter004-001, f-iter004-002 | Skill-advisor arc claims Jina activation, but runtime active default remains gemma and constants are confusing. | Decide infrastructure-only vs actual pointer flip; rename constants accordingly. |
| 7 | f-iter005-003 | Query expansion default is documented both true and false, affecting operator expectations. | Patch spec and README to accepted default-off state. |
| 8 | f-iter002-005, f-iter002-006 | llama-cpp migration/routing is half-dead and risks future agents chasing removed architecture. | Mark superseded or restore provider/migration support coherently. |
| 9 | f-iter005-006, f-iter009-004 | Dead public links and source comments poison recovery/search surfaces. | Fix live anchors and regenerate affected indexes. |
| 10 | f-iter001-002, f-iter007-005, f-iter008-002 | Completion claims lack durable validation/evidence. | Reopen or backfill validation records before closeout. |

## 5. Out of Scope

This synthesis did not re-run the code probes from iterations 1-9, revalidate benchmark outputs, execute strict spec validation, inspect unmentioned arcs outside the 016 umbrella, or resolve any findings. It also did not mutate source files, graph metadata, descriptions indexes, or task checkboxes; those are follow-up implementation packets.

The synthesis preserves original categories even where a later triage might merge or reclassify related metadata findings.

## 6. Convergence Notes

Iterations 2-7 produced 7, 5, 7, 7, 6, and 5 findings. Iterations 8-9 produced 7 and 5 findings. That is only a weak convergence signal: iteration 9 returned to the lower end of the prior range, but iteration 8 still found a full batch of seven issues and the final root pass found high-blast-radius metadata/default drift.

The better convergence signal is topical rather than numeric. Later iterations increasingly repeated the same failure modes: stale phase-parent metadata, stale production defaults, missing follow-on registration, and completion evidence gaps. That suggests the broad issue taxonomy is converged, but not that the repo surface is clean.
