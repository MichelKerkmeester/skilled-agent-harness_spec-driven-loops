# Deep Review Strategy: Embedding-Stack Hardening Program

<!-- ANCHOR:deep-review-embedding-stack -->

## Review Charter

**Target:** the embedding-stack hardening program shipped this session — the `031-embedding-stack-hardening` packet (phases 001–005) plus the `026/007` daemon-durability children (009/010/012/013), reviewed as committed code.

**Target type:** files (curated committed-code list across two packets).

**Executor:** cli-codex `gpt-5.5`, reasoning `high`, service tier `fast` (each iteration is a fresh LEAF review pass).

**Max iterations:** 20 | **Convergence threshold:** 0.10 (severity-weighted new-findings ratio).

**Review target is READ-ONLY.** The loop produces findings + a remediation-ready report; it never modifies the reviewed code.

## Dimensions (risk-ordered queue)

1. **correctness** — logic defects, edge cases, race conditions, resource leaks, contract mismatches in the embed path, daemon shutdown/WAL durability, supervision, and the reindex/cache paths.
2. **security** — socket-dir perimeter, sandbox/path handling, env precedence, single-writer/lease discipline, fail-closed behavior, no secret leakage.
3. **traceability** — spec↔code↔test alignment for each phase (001–005, 009/010/012/013); do the shipped files match their spec/impl-summary claims; are the gated/deferred items honestly documented.
4. **maintainability** — clarity, dead code, test coverage of the new behavior, doc accuracy (ENV_REFERENCE), idiom consistency with the surrounding code.

Iteration 0 is an inventory pass (artifact map + complexity estimate); subsequent passes go correctness → security → traceability → maintainability, revisiting hotspots as findings accumulate.

## Scope Files

shared/embeddings: `auto-select.ts`, `providers/hf-local.ts`, `factory.ts`, `registry.ts`; `shared/types.ts`.
launcher/server (cjs): `.opencode/bin/hf-model-server.cjs`, `.opencode/bin/lib/model-server-supervision.cjs`, `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `.opencode/bin/mk-skill-advisor-launcher.cjs`.
mcp_server: `handlers/embedder-status.ts`, `lib/embedders/execution-router.ts`, `lib/embedders/reindex.ts`, `lib/search/vector-index-store.ts`, `lib/cache/embedding-cache.ts`, `lib/governance/memory-retention-sweep.ts`, `context-server.ts`.
scripts: `scripts/core/daemon-detect.ts`, `scripts/core/workflow.ts`.

## Cross-Reference Targets

- spec_paths: `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/**` (parent + 001–005 children), `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/{009,010,012,013}*/**`.
- code_paths: the scope files above.
- test_paths: `mcp_server/tests/embedders/*`, `mcp_server/tests/embedder-*.vitest.ts`, `mcp_server/tests/context-server.vitest.ts`, `mcp_server/tests/memory-retention-sweep.vitest.ts`, `mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts`, `scripts/tests/{daemon-detect,workflow-step115-daemon-guard}.vitest.ts`.

## Known Context

This program was implemented this session through a per-phase gauntlet (design → implement → independent verify → adversarial-review workflow → fix → validate → commit). The adversarial reviews already caught and fixed real defects in every phase (001: 9, 002: 10→5, 003: P1 dim-drift + 3 P2, 004: 2 P1, 005: 1 P0 + 2 P1 + 2 P2; daemon 009/012/013: P0/P1 each). Commits: `910e87c429` (001), `73ae557901` (002), `6781109b97` (003), `47a01c7170` (004), `40806392cb` (005), `a6ab05a4f2` (031 parent); daemon `904204c272`/`34604b521b`/`8a30db8820`/`b88390a6cd`.

**Honestly-gated/deferred items (NOT defects — verify they're documented, don't re-litigate):** the advisor flag-flip (`SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` default-off) and live perf/dtype numbers are blocked by an unresolvable `onnxruntime-common` in the `@huggingface/transformers` checkout; cache-into-reindex is deferred pending a pre-existing reindex-vs-query normalization fix. This review should confirm those are correctly documented and look for NEW issues the per-phase gauntlet missed (cross-phase interactions, integration seams, anything the single-phase lenses couldn't see).

## Resource Map Coverage

resource-map.md not present; skipping coverage gate.

## Iteration 003 Update

**Dimension covered:** traceability.

**New findings:** DR-003-P1-001 (daemon child packet verification ledgers conflict with implementation-summary completion claims) and DR-003-P2-001 (phase 005 spec file matrix still assigns idle eviction to `hf-model-server.cjs` even though implementation lives in `model-server-supervision.cjs`).

**Ruled out:** the high-risk gated/deferred items are honestly documented and match code state: the skill-advisor model-server flag remains default-off pending live model-path evidence, dtype remains `q8` pending a working model bench, and cache-into-reindex is explicitly re-deferred because of the reindex-vs-query normalization mismatch.

**Next focus:** maintainability.

## Iteration 004 Update

**Dimension covered:** maintainability.

**New findings:** DR-004-P2-001 (embedding env knobs are code/test-visible but absent from `ENV_REFERENCE.md`, including `HF_EMBEDDINGS_PREFIX_DOC`, `HF_EMBEDDINGS_PREFIX_QUERY`, `EMBEDDER_REINDEX_BATCH_SIZE`, and the `HF_LOCAL_MODEL` alias).

**Ruled out:** no new P0/P1 maintainability blockers found; prefix override behavior shares one resolver branch, and the remaining legacy/deprecated markers are compatibility scaffolding rather than standalone defects.

**Next focus:** stabilization pass across open P1 clusters.

## Iteration 006 Update

**Dimension covered:** correctness/security stabilization sweep.

**New findings:** DR-006-P1-001 (demand-triggered model-server spawn failures can strand the lazy listener after `handleModelServerDemand` removes the listener before confirming launch success; synchronous launch errors can also skip respawn-lock release).

**Ruled out:** no new cross-launcher election race beyond DR-005-P1-001 and DR-006-P1-001; no distinct new transport/auth issue beyond DR-002-P1-001; no new raw secret leakage in the reviewed embedding status/selection paths.

**Next focus:** convergence/synthesis candidate, with remediation workstream grouping for the model-server lease/listener lifecycle findings.

## Iteration 008 Update

**Dimension covered:** correctness/data-safety under-explored sweep.

**New findings:** DR-008-P1-001 (non-active tracked SQLite connections in `vector-index-store.ts` close without the explicit main/shard `wal_checkpoint(TRUNCATE)` sequence; only the active singleton receives the durability checkpoint before detach/close).

**Ruled out:** no new cache eviction/LRU or shard-qualified cache migration issue; daemon shutdown still drains `fileWatcher` before `closeDb`; retention sweep post-delete FTS optimize/incremental vacuum guards are present; embed batching chunks by count+bytes and HF local preserves null slots, validates dimensions, and retries bounded readiness failures.

**Next focus:** adjudicate DR-008-P1-001 with the active P1 set, then continue convergence without re-mining the saturated single-writer/lease supervision cluster.

## Iteration 009 Update

**Dimension covered:** final broad discovery sweep across correctness, security, traceability, and maintainability.

**New findings:** DR-009-P1-001 (the embedder reindex shard writer opens a direct WAL-backed vector-shard connection, writes vector rows, and closes it without the explicit `wal_checkpoint(TRUNCATE)` durability path used by daemon shutdown).

**Ruled out:** no new P0/data-corruption path in active shard attach/detach ordering; HF local row-count/dimension adoption/normalization remains guarded; auto-select still probes local-first and factory fallback dimension changes are caught before vector persistence by existing dimension checks.

**Next focus:** convergence/synthesis with the WAL durability workstream now covering both tracked non-active connections and the untracked reindex shard writer.
